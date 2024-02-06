package com.trkpo.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.trkpo.model.dto.request.CreateCommentDto;
import com.trkpo.model.dto.request.CreatePostDto;
import com.trkpo.model.entity.CommentEntity;
import com.trkpo.model.entity.LikeEntity;
import com.trkpo.model.entity.NotificationEntity;
import com.trkpo.model.entity.PostEntity;
import com.trkpo.model.entity.UserEntity;
import com.trkpo.repository.CommentRepository;
import com.trkpo.repository.NotificationRepository;
import com.trkpo.repository.PostRepository;
import com.trkpo.repository.UserRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.web.client.HttpClientErrorException;

@SpringBootTest(classes = {CommentService.class})
public class CommentServiceTest {

    @Autowired
    private CommentService commentService;
    @MockBean
    private PostRepository postRepository;
    @MockBean
    private CommentRepository commentRepository;
    @MockBean
    private NotificationRepository notificationRepository;
    @MockBean
    private UserRepository userRepository;

    @Test
    void getByPostId() {
        var userId = 2;
        var postId = 3;
        var login = "loooooogin";
        var givenMe = UserEntity.builder()
            .id(userId)
            .login(login)
            .build();
        var givenPost = PostEntity.builder().id(postId).build();
        when(postRepository.existsById(eq(postId))).thenReturn(true);
        when(commentRepository.findByPostId(eq(postId), any())).thenReturn(
            new PageImpl<>(List.of(
                CommentEntity.builder()
                    .id(123)
                    .post(givenPost)
                    .user(givenMe)
                    .body("comment body")
                    .build()
            ))
        );

        var actual = commentService.getByPostId(postId, Pageable.ofSize(20));

        assertThat(actual).singleElement()
            .hasFieldOrPropertyWithValue("id", 123)
            .hasFieldOrPropertyWithValue("authorLogin", login)
            .hasFieldOrPropertyWithValue("body", "comment body");
    }

    @Test
    void getByPostIdWhenPostDoesNotExist() {
        var postId = 3;
        when(postRepository.existsById(eq(postId))).thenReturn(false);

        assertThatThrownBy(() -> commentService.getByPostId(postId, Pageable.ofSize(20)))
            .isInstanceOf(HttpClientErrorException.class);
    }

    @Test
    void createComment() {
        var userId = 2;
        var postId = 3;
        var login = "loooooogin";
        var login2 = "login22222";
        var notExistingLogin = "notexistinguser";
        var givenMe = UserEntity.builder()
            .id(userId)
            .login(login)
            .build();
        var givenDto = CreateCommentDto.builder()
            .body("body @" + notExistingLogin + " @" + login2)
            .build();
        var givenPost = PostEntity.builder().id(postId).build();
        var givenTaggedUser = UserEntity.builder().build();
        when(postRepository.existsById(eq(postId))).thenReturn(true);
        when(userRepository.findByLoginOrThrow(eq(login))).thenReturn(givenMe);
        when(postRepository.getReferenceById(eq(postId))).thenReturn(givenPost);
        when(userRepository.findByLogin(eq(login2))).thenReturn(
            Optional.of(givenTaggedUser)
        );

        commentService.createComment(login, givenDto, postId);

        var captor = ArgumentCaptor.forClass(CommentEntity.class);
        verify(commentRepository).save(captor.capture());
        var captorNotification = ArgumentCaptor.forClass(NotificationEntity.class);
        verify(notificationRepository).save(captorNotification.capture());
        assertThat(captor.getValue())
            .hasFieldOrPropertyWithValue("body", givenDto.getBody())
            .hasFieldOrPropertyWithValue("user", givenMe)
            .hasFieldOrPropertyWithValue("post", givenPost);
        assertThat(captorNotification.getValue())
            .hasFieldOrPropertyWithValue("user", givenTaggedUser)
            .hasFieldOrPropertyWithValue("post", givenPost);
    }

    @Test
    void createCommentWhenPostDoesNotExist() {
        var postId = 3;
        var givenDto = CreateCommentDto.builder().build();
        when(postRepository.existsById(eq(postId))).thenReturn(false);

        assertThatThrownBy(() -> commentService.createComment("login", givenDto, postId))
            .isInstanceOf(HttpClientErrorException.class);
    }
}
