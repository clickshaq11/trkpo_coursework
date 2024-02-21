package com.trkpo.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trkpo.model.dto.request.CreateCommentDto;
import com.trkpo.model.entity.LikeEntity;
import com.trkpo.repository.CommentRepository;
import com.trkpo.repository.NotificationRepository;
import com.trkpo.repository.PostRepository;
import com.trkpo.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest("spring.datasource.url=jdbc:tc:postgresql:15.2:///main")
@Sql("/init.sql")
@AutoConfigureMockMvc
public class CommentControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PostRepository postRepository;
    @Autowired
    private NotificationRepository notificationRepository;

    @Test
    void createCommentForNotExistingPost() throws Exception {
        var given = CreateCommentDto.builder().body("comment").build();

        var actual = mockMvc.perform(
            post("/post/123/comment")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(given))
                .with(user("login123"))
        );
        var actualComments = commentRepository.findAll();

        actual
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.message").value("Could not find post with id 123"));
        assertThat(actualComments).isEmpty();
    }

    @Test
    void createCommentWithTags() throws Exception {
        var given = CreateCommentDto.builder().body("comment @login2222").build();

        var actual = mockMvc.perform(
            post("/post/1/comment")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(given))
                .with(user("login123"))
        );
        var actualComments = commentRepository.findAll();
        var actualNotifications = notificationRepository.findAll();

        actual
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").doesNotExist());
        assertThat(actualComments).singleElement()
            .hasFieldOrPropertyWithValue("user", userRepository.findByLogin("login123").get())
            .hasFieldOrPropertyWithValue("post", postRepository.findById(1).get())
            .hasFieldOrPropertyWithValue("body", "comment @login2222");
        assertThat(actualNotifications).singleElement()
            .hasFieldOrPropertyWithValue("user", userRepository.findByLogin("login2222").get())
            .hasFieldOrPropertyWithValue("post", postRepository.findById(1).get());
    }
}
