package com.trkpo.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.trkpo.model.entity.LikeEntity;
import com.trkpo.model.entity.NotificationEntity;
import com.trkpo.model.entity.PostEntity;
import com.trkpo.model.entity.UserEntity;
import com.trkpo.repository.LikeRepository;
import com.trkpo.repository.NotificationRepository;
import com.trkpo.repository.PostRepository;
import com.trkpo.repository.UserRepository;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.web.client.HttpClientErrorException;

@SpringBootTest(classes = {LikeService.class})
public class LikeServiceTest {

    @Autowired
    private LikeService likeService;
    @MockBean
    private UserRepository userRepository;
    @MockBean
    private LikeRepository likeRepository;
    @MockBean
    private PostRepository postRepository;

    @Test
    void likeWhenLikeDoesNotExist() {
        var userId = 2;
        var postId = 3;
        var login = "loooooogin";
        var givenMe = UserEntity.builder()
            .id(userId)
            .login(login)
            .build();
        var givenPost = PostEntity.builder().id(postId).build();
        when(postRepository.existsById(eq(postId))).thenReturn(true);
        when(userRepository.findByLoginOrThrow(eq(login))).thenReturn(givenMe);
        when(likeRepository.findByUserIdAndPostId(eq(userId), eq(postId))).thenReturn(
            Optional.empty()
        );
        when(postRepository.getReferenceById(eq(postId))).thenReturn(givenPost);

        var actual = likeService.like(login, postId);

        var captor = ArgumentCaptor.forClass(LikeEntity.class);
        verify(likeRepository).save(captor.capture());
        assertThat(actual)
            .hasFieldOrPropertyWithValue("hitLike", true);
        assertThat(captor.getValue())
            .hasFieldOrPropertyWithValue("user", givenMe)
            .hasFieldOrPropertyWithValue("post", givenPost);
    }

    @Test
    void likeWhenLikeExists() {
        var userId = 2;
        var postId = 3;
        var likeId = 4;
        var login = "loooooogin";
        var givenMe = UserEntity.builder()
            .id(userId)
            .login(login)
            .build();
        when(postRepository.existsById(eq(postId))).thenReturn(true);
        when(userRepository.findByLoginOrThrow(eq(login))).thenReturn(givenMe);
        when(likeRepository.findByUserIdAndPostId(eq(userId), eq(postId))).thenReturn(
            Optional.of(
                LikeEntity.builder()
                    .id(likeId)
                    .build()
            )
        );

        var actual = likeService.like(login, postId);

        verify(likeRepository).deleteById(eq(likeId));
        assertThat(actual)
            .hasFieldOrPropertyWithValue("hitLike", false);
    }

    @Test
    void likeWhenPostDoesNotExist() {
        var postId = 3;
        when(postRepository.existsById(eq(postId))).thenReturn(false);

        assertThatThrownBy(() -> likeService.like("loooooogin", postId))
            .isInstanceOf(HttpClientErrorException.class);
    }
}
