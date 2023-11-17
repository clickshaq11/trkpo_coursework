package com.trkpo.service;

import com.trkpo.config.TagProperties;
import com.trkpo.model.dto.request.CreatePostDto;
import com.trkpo.model.dto.request.UpdatePostDto;
import com.trkpo.model.dto.response.FirstCommentDto;
import com.trkpo.model.dto.response.MyPostDto;
import com.trkpo.model.dto.response.NewsFeedPostDto;
import com.trkpo.model.dto.response.OtherPostDto;
import com.trkpo.model.dto.response.PostDto;
import com.trkpo.model.entity.NotificationEntity;
import com.trkpo.model.entity.PostEntity;
import com.trkpo.repository.CommentRepository;
import com.trkpo.repository.LikeRepository;
import com.trkpo.repository.NotificationRepository;
import com.trkpo.repository.PostRepository;
import com.trkpo.repository.UserRepository;
import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.client.HttpClientErrorException;

@Slf4j
@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final LikeRepository likeRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    @Transactional
    public void createPost(String login, CreatePostDto dto) {
        var post = postRepository.save(PostEntity.builder()
            .title(dto.getTitle())
            .body(dto.getBody())
            .createdAt(Instant.now().toEpochMilli())
            .user(userRepository.findByLoginOrThrow(login))
            .build()
        );
        var matcher = TagProperties.TAG_PATTERN.matcher(dto.getBody());
        log.info("For post {} found {} tag matches", dto.getBody(), matcher.groupCount());
        matcher.results().forEach(match -> attemptToCreateNotification(match.group(), post.getId()));
    }

    public List<MyPostDto> getMine(String login, Pageable pageable) {
        var user = userRepository.findByLoginOrThrow(login);
        var projections = postRepository.findPostsByUserId(user.getId(), pageable);
        log.info("Getting my posts for login {}", login);
        return projections.stream()
            .map(projection -> MyPostDto.builder()
                .id(projection.getId())
                .title(projection.getTitle())
                .body(projection.getBody())
                .authorId(projection.getAuthorId())
                .authorLogin(projection.getAuthorLogin())
                .likeCounter(projection.getLikeCounter())
                .createdAt(projection.getCreatedAt())
                .hitLike(likeRepository.existsByUserIdAndPostId(user.getId(), projection.getId()))
                .firstComments(getFirstComments(projection.getId()))
                .build()
            )
            .toList();
    }

    public List<OtherPostDto> getByUserId(Integer id, Pageable pageable) {
        if (!userRepository.existsById(id)) {
            throw new HttpClientErrorException(HttpStatus.NOT_FOUND, "Could not find user with id " + id);
        }
        var projections = postRepository.findPostsByUserId(id, pageable);
        log.info("Getting other posts for userId {}", id);
        return projections.stream()
            .map(projection -> OtherPostDto.builder()
                .id(projection.getId())
                .title(projection.getTitle())
                .body(projection.getBody())
                .authorId(projection.getAuthorId())
                .authorLogin(projection.getAuthorLogin())
                .likeCounter(projection.getLikeCounter())
                .createdAt(projection.getCreatedAt())
                .hitLike(likeRepository.existsByUserIdAndPostId(id, projection.getId()))
                .firstComments(getFirstComments(projection.getId()))
                .build()
            )
            .toList();
    }

    public PostDto getById(String login, Integer id) {
        var user = userRepository.findByLoginOrThrow(login);
        var post = postRepository.findById(id)
            .orElseThrow(() -> new HttpClientErrorException(HttpStatus.NOT_FOUND, "Could not find post with id " + id));
        return PostDto.builder()
            .title(post.getTitle())
            .body(post.getBody())
            .createdAt(post.getCreatedAt())
            .authorId(post.getUser().getId())
            .authorLogin(post.getUser().getLogin())
            .likeCounter(likeRepository.countByPostId(post.getId()))
            .hitLike(likeRepository.existsByUserIdAndPostId(user.getId(), post.getId()))
            .build();
    }

    public List<NewsFeedPostDto> getMyNewsFeed(String login, Pageable pageable) {
        var user = userRepository.findByLoginOrThrow(login);
        log.info("Getting news feed for user {} with pageable {}", login, pageable);
        var projections = postRepository.findNewsFeedByUserId(user.getId(), pageable);
        return projections.stream()
            .map(projection -> NewsFeedPostDto.builder()
                .id(projection.getId())
                .title(projection.getTitle())
                .body(projection.getBody())
                .authorId(projection.getAuthorId())
                .authorLogin(projection.getAuthorLogin())
                .likeCounter(projection.getLikeCounter())
                .createdAt(projection.getCreatedAt())
                .hitLike(likeRepository.existsByUserIdAndPostId(user.getId(), projection.getId()))
                .firstComments(getFirstComments(projection.getId()))
                .build()
            )
            .toList();
    }

    @Transactional
    public void updateById(String login, UpdatePostDto dto, Integer id) {
        var user = userRepository.findByLoginOrThrow(login);
        var post = postRepository.findById(id)
            .orElseThrow(() -> new HttpClientErrorException(HttpStatus.NOT_FOUND, "Could not find post with id " + id));
        if (!Objects.equals(post.getUser().getId(), user.getId())) {
            throw new HttpClientErrorException(
                HttpStatus.FORBIDDEN,
                "User " + login + " attempts to update post " + id + " from other user"
            );
        }
        if (StringUtils.hasText(dto.getTitle())) {
            post.setTitle(dto.getTitle());
        }
        if (StringUtils.hasText(dto.getBody())) {
            post.setTitle(dto.getBody());
        }
        postRepository.save(post);
    }

    @Transactional
    public void deleteById(String login, Integer id) {
        var user = userRepository.findByLoginOrThrow(login);
        var post = postRepository.findById(id)
            .orElseThrow(() -> new HttpClientErrorException(HttpStatus.NOT_FOUND, "Could not find post with id " + id));
        if (!Objects.equals(post.getUser().getId(), user.getId())) {
            throw new HttpClientErrorException(
                HttpStatus.FORBIDDEN,
                "User " + login + " attempts to delete post " + id + " from other user"
            );
        }
        postRepository.deleteById(id);
    }

    private List<FirstCommentDto> getFirstComments(Integer postId) {
        var realComments = commentRepository.findByPostId(postId, PageRequest.of(0, 3, Sort.by(Direction.ASC, "id"))).stream()
            .map(entity -> FirstCommentDto.builder()
                .id(entity.getId())
                .authorLogin(entity.getUser().getLogin())
                .body(entity.getBody())
                .build()
            )
            .toList();
        log.info("{} real comments for post {}", realComments.size(), postId);
        if (realComments.size() < 3) {
            var phantomComment = FirstCommentDto.builder()
                .id(-1)
                .authorLogin("phantomUser")
                .body("hey, phantomUser is here to help you match the requirements:"
                    + " whenever you need a comment out of a thin air, i got you!")
                .build();
            return Stream.concat(realComments.stream(), Collections.nCopies(3 - realComments.size(), phantomComment).stream()).toList();
        }
        return realComments;
    }

    private void attemptToCreateNotification(String tag, Integer postId) {
        var userOptional = userRepository.findByLogin(tag);
        if (userOptional.isEmpty()) {
            log.info("Possible tag {} for postId {}, could not find user with that login", tag, postId);
            return;
        }
        log.info("Creating tag {} for postId {}", tag, postId);
        notificationRepository.save(NotificationEntity.builder()
            .user(userOptional.get())
            .post(postRepository.getReferenceById(postId))
            .createdAt(Instant.now().toEpochMilli())
            .build()
        );
    }
}
