package com.trkpo.controller;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trkpo.repository.CommentRepository;
import com.trkpo.repository.NotificationRepository;
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
public class UserControllerTest {

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
    void getNotExistingUser() throws Exception {
        var actual = mockMvc.perform(
            get("/user/id/123").with(user("login123"))
        );

        actual
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.message").value("Could not find user with id 123"));
    }

    @Test
    void getOtherUser() throws Exception {
        var actual = mockMvc.perform(
            get("/user/id/2").with(user("login123"))
        );

        var expected = """
            {
              "id":2,
              "login":"login2222",
              "shortInfo":"info",
              "subscribed":false
            }
            """;
        actual
            .andExpect(status().isOk())
            .andExpect(content().json(expected));
    }

    @Test
    void getByLoginPart() throws Exception {
        var actual = mockMvc.perform(
            get("/user/login/og").with(user("login123"))
        );

        var expected = """
            [
              {
                "id":2,
                "login":"login2222",
                "shortInfo":"info",
                "subscribed":false
              },
              {
                "id":3,
                "login":"logout111",
                "shortInfo":"logoutInfo",
                "subscribed":false
              }
            ]
            """;
        actual
            .andExpect(status().isOk())
            .andExpect(content().json(expected));
    }
}
