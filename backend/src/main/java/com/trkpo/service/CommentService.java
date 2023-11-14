package com.trkpo.service;

import com.trkpo.config.TagProperties;
import com.trkpo.model.dto.request.CreateCommentDto;
import com.trkpo.model.dto.response.CommentDto;
import com.trkpo.model.entity.CommentEntity;
import com.trkpo.model.entity.NotificationEntity;
import com.trkpo.repository.CommentRepository;
import com.trkpo.repository.NotificationRepository;
import com.trkpo.repository.PostRepository;
import com.trkpo.repository.UserRepository;
import java.time.Instant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommentService {
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public List<CommentDto> getByPostId(Integer id, Pageable pageable) {
        if (!postRepository.existsById(id)) {
            throw new HttpClientErrorException(HttpStatus.NOT_FOUND, "Could not find post with id " + id);
        }
        return commentRepository.findByPostId(id, pageable).stream()
            .map(entity -> CommentDto.builder()
                .id(entity.getId())
                .authorLogin(entity.getUser().getLogin())
                .body(entity.getBody())
                .build()
            ).toList();
    }

    public void createComment(String login, CreateCommentDto dto, Integer postId) {
        log.info("Creating comment for user {} with body {} for postId {}", login, dto.getBody(), postId);
        if (!postRepository.existsById(postId)) {
            throw new HttpClientErrorException(HttpStatus.NOT_FOUND, "Could not find post with id " + postId);
        }
        var matcher = TagProperties.TAG_PATTERN.matcher(dto.getBody());
        log.info("For comment {} found {} tag matches", dto.getBody(), matcher.groupCount());
        matcher.results().forEach(match -> attemptToCreateNotification(match.group(), postId));
        commentRepository.save(CommentEntity.builder()
            .body(dto.getBody())
            .user(userRepository.findByLoginOrThrow(login))
            .post(postRepository.getReferenceById(postId))
            .build()
        );
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
