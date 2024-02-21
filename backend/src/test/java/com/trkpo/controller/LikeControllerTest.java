package com.trkpo.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.trkpo.model.entity.LikeEntity;
import com.trkpo.repository.LikeRepository;
import com.trkpo.repository.PostRepository;
import com.trkpo.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest("spring.datasource.url=jdbc:tc:postgresql:15.2:///main")
@Sql("/init.sql")
@AutoConfigureMockMvc
public class LikeControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private LikeRepository likeRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PostRepository postRepository;

    @Test
    void likeNotExistingPost() throws Exception {

        var actual = mockMvc.perform(post("/post/123").with(user("login123")));
        var actualLikes = likeRepository.findAll();

        actual
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.message").value("Post with id 123 could not be found"));
        assertThat(actualLikes).isEmpty();
    }

    @Test
    void likeNotLikedPost() throws Exception {
        var actual = mockMvc.perform(post("/post/1").with(user("login123")));
        var actualLikes = likeRepository.findAll();
        var user = userRepository.findById(1).get();
        var post = postRepository.findById(1).get();

        actual
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.hitLike").value(true));
        assertThat(actualLikes).singleElement()
            .hasFieldOrPropertyWithValue("user", user)
            .hasFieldOrPropertyWithValue("post", post);
    }

    @Test
    void likeLikedPost() throws Exception {
        var givenLike = LikeEntity.builder()
            .user(userRepository.findById(1).get())
            .post(postRepository.findById(1).get())
            .build();
        likeRepository.save(givenLike);

        var actual = mockMvc.perform(post("/post/1").with(user("login123")));
        var actualLikes = likeRepository.findAll();

        actual
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.hitLike").value(false));
        assertThat(actualLikes).isEmpty();
    }
}
