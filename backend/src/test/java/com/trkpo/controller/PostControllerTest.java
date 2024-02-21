package com.trkpo.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.tuple;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trkpo.model.dto.request.CreatePostDto;
import com.trkpo.model.entity.NotificationEntity;
import com.trkpo.model.entity.PostEntity;
import com.trkpo.model.entity.UserEntity;
import com.trkpo.repository.CommentRepository;
import com.trkpo.repository.LikeRepository;
import com.trkpo.repository.NotificationRepository;
import com.trkpo.repository.PostRepository;
import com.trkpo.repository.UserRepository;
import com.trkpo.service.PostService;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.MockMvc;

@WithMockUser
@WebMvcTest(value = {PostController.class, PostService.class, ObjectMapper.class})
@AutoConfigureMockMvc
public class PostControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @MockBean
    private UserRepository userRepository;
    @MockBean
    private PostRepository postRepository;
    @MockBean
    private NotificationRepository notificationRepository;
    @MockBean
    private LikeRepository likeRepository;
    @MockBean
    private CommentRepository commentRepository;

    @Test
    void createPost() throws Exception {
        var givenBody = "new body @anotherUser and @not-a-tag and @logout111";
        var post = PostEntity.builder()
            .id(1)
            .build();
        var given = CreatePostDto.builder()
            .title("new title")
            .body(givenBody)
            .build();
        var givenMe = UserEntity.builder()
            .login("user")
            .hashedPassword("hashedpassword")
            .shortInfo("short info")
            .build();
        var givenTaggedUser1 = UserEntity.builder().login("anotherUser").build();
        var givenTaggedUser2 = UserEntity.builder().login("logout111").build();
        when(userRepository.findByLoginOrThrow(eq("user"))).thenReturn(givenMe);
        when(userRepository.findByLogin(eq("anotherUser"))).thenReturn(
            Optional.of(givenTaggedUser1)
        );
        when(userRepository.findByLogin(eq("not-a-tag"))).thenReturn(
            Optional.empty()
        );
        when(userRepository.findByLogin(eq("logout111"))).thenReturn(
            Optional.of(givenTaggedUser2)
        );
        when(postRepository.save(any())).thenReturn(post);
        when(postRepository.getReferenceById(eq(1))).thenReturn(post);

        var actual = mockMvc.perform(
            post("/post")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(given))
                .with(csrf())
        );


        var captor = ArgumentCaptor.forClass(NotificationEntity.class);
        actual
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").doesNotExist());
        verify(notificationRepository, times(2)).save(captor.capture());
        assertThat(captor.getAllValues()).hasSize(2)
            .extracting("user", "post")
            .containsOnly(
                tuple(givenTaggedUser1, post),
                tuple(givenTaggedUser2, post)
            );
    }

    @Test
    void getNotExistingPost() throws Exception {
        when(postRepository.findById(123)).thenReturn(Optional.empty());

        var actual = mockMvc.perform(
            get("/post/123").with(user("login123"))
        );

        actual
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.message").value("Could not find post with id 123"));
    }
}
