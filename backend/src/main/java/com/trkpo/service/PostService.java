package com.trkpo.service;

import com.trkpo.model.dto.response.FirstCommentDto;
import com.trkpo.model.dto.response.MyPostDto;
import com.trkpo.repository.CommentRepository;
import com.trkpo.repository.LikeRepository;
import com.trkpo.repository.PostRepository;
import java.util.Collections;
import java.util.List;
import java.util.stream.Stream;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final LikeRepository likeRepository;

    public List<MyPostDto> getMine(String login, Pageable pageable) {
        var projections = postRepository.findMyPosts(login, pageable);
        log.info("Get my posts for login {}", login);
        return projections.stream()
            .map(projection -> MyPostDto.builder()
                .id(projection.getId())
                .title(projection.getTitle())
                .body(projection.getBody())
                .authorId(projection.getAuthorId())
                .authorLogin(projection.getAuthorLogin())
                .likeCounter(projection.getLikeCounter())
                .createdAt(projection.getCreatedAt())
                .hitLike(likeRepository.existsByPostId(projection.getId()))
                .firstComments(getFirstComments(projection.getId()))
                .build()
            )
            .toList();
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
}
