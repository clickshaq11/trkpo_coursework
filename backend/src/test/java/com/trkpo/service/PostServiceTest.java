package com.trkpo.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.trkpo.model.dto.projection.PostProjection;
import com.trkpo.model.dto.request.CreatePostDto;
import com.trkpo.model.dto.request.UpdateMeDto;
import com.trkpo.model.dto.request.UpdatePostDto;
import com.trkpo.model.dto.response.MyPostDto;
import com.trkpo.model.entity.CommentEntity;
import com.trkpo.model.entity.NotificationEntity;
import com.trkpo.model.entity.PostEntity;
import com.trkpo.model.entity.SubscriptionEntity;
import com.trkpo.model.entity.UserEntity;
import com.trkpo.repository.CommentRepository;
import com.trkpo.repository.LikeRepository;
import com.trkpo.repository.NotificationRepository;
import com.trkpo.repository.PostRepository;
import com.trkpo.repository.SubscriptionRepository;
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
import org.springframework.data.projection.ProjectionFactory;
import org.springframework.data.projection.SpelAwareProxyProjectionFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;

@SpringBootTest(classes = {PostService.class})
public class PostServiceTest {

    @Autowired
    private PostService postService;
    @MockBean
    private PostRepository postRepository;
    @MockBean
    private CommentRepository commentRepository;
    @MockBean
    private LikeRepository likeRepository;
    @MockBean
    private UserRepository userRepository;
    @MockBean
    private NotificationRepository notificationRepository;

    @Test
    void createPostWithTags() {
        var login = "loooooogin";
        var login2 = "login22222";
        var notExistingLogin = "notexistinguser";
        var givenDto = CreatePostDto.builder()
            .title("title")
            .body("body @" + notExistingLogin + " @" + login2)
            .build();
        var givenMe = UserEntity.builder()
            .id(1)
            .login(login)
            .hashedPassword("hashedpassword")
            .shortInfo("short info")
            .build();
        var givenTaggedUser = UserEntity.builder().build();
        var post = PostEntity.builder()
            .id(1)
            .build();
        when(userRepository.findByLoginOrThrow(eq(login))).thenReturn(givenMe);
        when(userRepository.findByLogin(eq(login2))).thenReturn(
            Optional.of(givenTaggedUser)
        );
        when(userRepository.findByLogin(eq(notExistingLogin))).thenReturn(
            Optional.empty()
        );
        when(postRepository.save(any())).thenReturn(post);
        when(postRepository.getReferenceById(eq(1))).thenReturn(post);

        postService.createPost(login, givenDto);

        var captor = ArgumentCaptor.forClass(NotificationEntity.class);
        verify(notificationRepository).save(captor.capture());
        assertThat(captor.getValue())
            .hasFieldOrPropertyWithValue("user", givenTaggedUser)
            .hasFieldOrPropertyWithValue("post", post);
    }

    @Test
    void getMine() {
        var userId = 1;
        var postId = 2;
        var login = "loooooogin";
        var givenMe = UserEntity.builder()
            .id(userId)
            .login(login)
            .build();
        var givenPostProjection = getPostProjection(postId, "title", "body", userId, login);
        when(userRepository.findByLoginOrThrow(eq(login))).thenReturn(givenMe);
        when(postRepository.findPostsByUserId(eq(userId), any())).thenReturn(
            new PageImpl<>(List.of(givenPostProjection))
        );
        when(likeRepository.existsByUserIdAndPostId(eq(userId), eq(postId))).thenReturn(true);
        when(commentRepository.findByPostId(eq(postId), any())).thenReturn(
            new PageImpl<>(List.of(
                CommentEntity.builder()
                    .user(givenMe)
                    .body("comment body")
                    .build()
            ))
        );

        var actual = postService.getMine(login, Pageable.ofSize(20));

        assertThat(actual).singleElement()
            .hasFieldOrPropertyWithValue("id", postId)
            .hasFieldOrPropertyWithValue("title", "title")
            .hasFieldOrPropertyWithValue("body", "body")
            .hasFieldOrPropertyWithValue("authorId", userId)
            .hasFieldOrPropertyWithValue("authorLogin", login)
            .hasFieldOrPropertyWithValue("hitLike", true)
            .extracting("firstComments").asList().singleElement()
            .hasFieldOrPropertyWithValue("authorLogin", login)
            .hasFieldOrPropertyWithValue("body", "comment body");
    }

    @Test
    void getByUserId() {
        var myUserId = 1;
        var otherUserId = 2;
        var postId = 3;
        var login = "loooooogin";
        var givenMe = UserEntity.builder()
            .id(myUserId)
            .login(login)
            .build();
        var givenOtherUser = UserEntity.builder()
            .id(otherUserId)
            .build();
        var givenPostProjection = getPostProjection(postId, "title", "body", otherUserId, null);
        when(userRepository.existsById(otherUserId)).thenReturn(true);
        when(userRepository.findByLoginOrThrow(eq(login))).thenReturn(givenMe);
        when(postRepository.findPostsByUserId(eq(otherUserId), any())).thenReturn(
            new PageImpl<>(List.of(givenPostProjection))
        );
        when(likeRepository.existsByUserIdAndPostId(eq(myUserId), eq(postId))).thenReturn(true);
        when(commentRepository.findByPostId(eq(postId), any())).thenReturn(
            new PageImpl<>(List.of(
                CommentEntity.builder()
                    .user(givenOtherUser)
                    .body("comment body")
                    .build()
            ))
        );

        var actual = postService.getByUserId(login, otherUserId, Pageable.ofSize(20));

        assertThat(actual).singleElement()
            .hasFieldOrPropertyWithValue("id", postId)
            .hasFieldOrPropertyWithValue("title", "title")
            .hasFieldOrPropertyWithValue("body", "body")
            .hasFieldOrPropertyWithValue("authorId", otherUserId)
            .hasFieldOrPropertyWithValue("hitLike", true)
            .extracting("firstComments").asList().singleElement()
            .hasFieldOrPropertyWithValue("body", "comment body");
    }

    @Test
    void getByUserIdWhenUserIsNotFound() {
        var otherUserId = 2;
        when(userRepository.existsById(otherUserId)).thenReturn(false);

        assertThatThrownBy(() -> postService.getByUserId("loooooogin", otherUserId, Pageable.ofSize(20)))
            .isInstanceOf(HttpClientErrorException.class);
    }

    @Test
    void getById() {
        var myUserId = 1;
        var postId = 3;
        var login = "loooooogin";
        var givenMe = UserEntity.builder()
            .id(myUserId)
            .login(login)
            .build();
        var givenPost = PostEntity.builder()
            .id(postId)
            .title("title")
            .body("body")
            .user(givenMe)
            .build();
        when(userRepository.findByLoginOrThrow(eq(login))).thenReturn(givenMe);
        when(postRepository.findById(eq(postId))).thenReturn(
            Optional.of(givenPost)
        );
        when(likeRepository.countByPostId(eq(postId))).thenReturn(2);
        when(likeRepository.existsByUserIdAndPostId(eq(myUserId), eq(postId))).thenReturn(true);

        var actual = postService.getById(login, postId);

        assertThat(actual)
            .hasFieldOrPropertyWithValue("title", "title")
            .hasFieldOrPropertyWithValue("body", "body")
            .hasFieldOrPropertyWithValue("authorId", myUserId)
            .hasFieldOrPropertyWithValue("authorLogin", login)
            .hasFieldOrPropertyWithValue("likeCounter", 2)
            .hasFieldOrPropertyWithValue("hitLike", true)
            .hasFieldOrPropertyWithValue("isAuthor", true);
    }

    @Test
    void getByIdWhenPostIsNotFound() {
        var myUserId = 1;
        var postId = 3;
        var login = "loooooogin";
        var givenMe = UserEntity.builder()
            .id(myUserId)
            .login(login)
            .build();
        when(userRepository.findByLoginOrThrow(eq(login))).thenReturn(givenMe);
        when(postRepository.findById(eq(postId))).thenReturn(
            Optional.empty()
        );

        assertThatThrownBy(() -> postService.getById(login, postId))
            .isInstanceOf(HttpClientErrorException.class);
    }

    @Test
    void getMyNewsFeed() {
        var myUserId = 1;
        var postId = 3;
        var login = "loooooogin";
        var givenMe = UserEntity.builder()
            .id(myUserId)
            .login(login)
            .build();
        var givenPostProjection = getPostProjection(postId, "title", "body", myUserId, login);
        when(userRepository.findByLoginOrThrow(eq(login))).thenReturn(givenMe);
        when(postRepository.findNewsFeedByUserId(eq(myUserId))).thenReturn(
            List.of(givenPostProjection)
        );
        when(likeRepository.existsByUserIdAndPostId(eq(myUserId), eq(postId))).thenReturn(true);
        when(commentRepository.findByPostId(eq(postId), any())).thenReturn(
            new PageImpl<>(List.of(
                CommentEntity.builder()
                    .user(givenMe)
                    .body("comment body")
                    .build()
            ))
        );

        var actual = postService.getMyNewsFeed(login);

        assertThat(actual).singleElement()
            .hasFieldOrPropertyWithValue("id", postId)
            .hasFieldOrPropertyWithValue("title", "title")
            .hasFieldOrPropertyWithValue("body", "body")
            .hasFieldOrPropertyWithValue("hitLike", true)
            .extracting("firstComments").asList().singleElement()
            .hasFieldOrPropertyWithValue("authorLogin", login)
            .hasFieldOrPropertyWithValue("body", "comment body");
    }

    @Test
    void updateById() {
        var myUserId = 1;
        var postId = 3;
        var login = "loooooogin";
        var givenMe = UserEntity.builder()
            .id(myUserId)
            .login(login)
            .build();
        var givenPost = PostEntity.builder()
            .id(postId)
            .title("title")
            .body("body")
            .user(givenMe)
            .build();
        var givenDto = UpdatePostDto.builder()
            .title("new title")
            .body("new body")
            .build();
        when(userRepository.findByLoginOrThrow(eq(login))).thenReturn(givenMe);
        when(postRepository.findById(eq(postId))).thenReturn(
            Optional.of(givenPost)
        );

        postService.updateById(login, givenDto, postId);

        var expected = PostEntity.builder()
            .id(postId)
            .title("new title")
            .body("new body")
            .user(givenMe)
            .build();
        verify(postRepository).save(eq(expected));
    }

    @Test
    void updateByIdWhenUpdatingPostOfOtherUser() {
        var myUserId = 1;
        var postId = 3;
        var login = "loooooogin";
        var givenMe = UserEntity.builder()
            .id(myUserId)
            .login(login)
            .build();
        var givenPost = PostEntity.builder()
            .id(postId)
            .title("title")
            .body("body")
            .user(UserEntity.builder().id(123123123).build())
            .build();
        var givenDto = UpdatePostDto.builder().build();
        when(userRepository.findByLoginOrThrow(eq(login))).thenReturn(givenMe);
        when(postRepository.findById(eq(postId))).thenReturn(
            Optional.of(givenPost)
        );

        assertThatThrownBy(() -> postService.updateById(login, givenDto, postId))
            .isInstanceOf(HttpClientErrorException.class);
    }

    @Test
    void deleteById() {
        var myUserId = 1;
        var postId = 3;
        var login = "loooooogin";
        var givenMe = UserEntity.builder()
            .id(myUserId)
            .login(login)
            .build();
        var givenPost = PostEntity.builder()
            .id(postId)
            .title("title")
            .body("body")
            .user(givenMe)
            .build();
        when(userRepository.findByLoginOrThrow(eq(login))).thenReturn(givenMe);
        when(postRepository.findById(eq(postId))).thenReturn(
            Optional.of(givenPost)
        );

        postService.deleteById(login, postId);

        verify(postRepository).deleteById(eq(postId));
    }

    @Test
    void deleteByIdWhenDeletingPostOfOtherUser() {
        var myUserId = 1;
        var postId = 3;
        var login = "loooooogin";
        var givenMe = UserEntity.builder()
            .id(myUserId)
            .login(login)
            .build();
        var givenPost = PostEntity.builder()
            .id(postId)
            .title("title")
            .body("body")
            .user(UserEntity.builder().id(123123).build())
            .build();
        when(userRepository.findByLoginOrThrow(eq(login))).thenReturn(givenMe);
        when(postRepository.findById(eq(postId))).thenReturn(
            Optional.of(givenPost)
        );

        assertThatThrownBy(() -> postService.deleteById(login, postId))
            .isInstanceOf(HttpClientErrorException.class);
    }

    @Test
    void deleteByIdWhenPostIsNotFound() {
        var myUserId = 1;
        var postId = 3;
        var login = "loooooogin";
        var givenMe = UserEntity.builder()
            .id(myUserId)
            .login(login)
            .build();
        when(userRepository.findByLoginOrThrow(eq(login))).thenReturn(givenMe);
        when(postRepository.findById(eq(postId))).thenReturn(
            Optional.empty()
        );

        assertThatThrownBy(() -> postService.deleteById(login, postId))
            .isInstanceOf(HttpClientErrorException.class);
    }

    private PostProjection getPostProjection(
        int id,
        String title,
        String body,
        int userId,
        String login
    ) {
        return new PostProjection() {
            @Override
            public Integer getId() {
                return id;
            }

            @Override
            public String getTitle() {
                return title;
            }

            @Override
            public String getBody() {
                return body;
            }

            @Override
            public Integer getAuthorId() {
                return userId;
            }

            @Override
            public String getAuthorLogin() {
                return login;
            }

            @Override
            public Integer getLikeCounter() {
                return 0;
            }

            @Override
            public Long getCreatedAt() {
                return null;
            }
        };
    }
}
