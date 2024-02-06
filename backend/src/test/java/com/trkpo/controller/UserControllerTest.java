package com.trkpo.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trkpo.model.dto.request.CreatePostDto;
import com.trkpo.model.dto.request.UpdateMeDto;
import com.trkpo.model.dto.request.UpdatePostDto;
import com.trkpo.model.dto.response.FirstCommentDto;
import com.trkpo.model.dto.response.MyPostDto;
import com.trkpo.model.dto.response.MyProfileDto;
import com.trkpo.model.dto.response.NewsFeedPostDto;
import com.trkpo.model.dto.response.OtherPostDto;
import com.trkpo.model.dto.response.OtherProfileDto;
import com.trkpo.model.dto.response.PostDto;
import com.trkpo.model.dto.response.SubscriptionDto;
import com.trkpo.service.UserService;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

@WithMockUser
@WebMvcTest(UserController.class)
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @MockBean
    private UserService userService;

    @BeforeEach
    void setUp() {
        Mockito.reset(userService);
    }

    @Test
    void getMe() throws Exception {
        when(userService.getMe(eq("user"))).thenReturn(
            MyProfileDto.builder()
                .login("looooooogin")
                .shortInfo("short info")
                .subscriptions(
                    List.of(
                        SubscriptionDto.builder()
                            .id(1)
                            .login("otherloogin")
                            .build()
                    )
                )
                .build()
        );

        var actual = mockMvc.perform(get("/user/me"));

        var expected = """
            {
              "login": "looooooogin",
              "shortInfo": "short info",
              "subscriptions": [
                {
                  "id": 1,
                  "login": "otherloogin"
                }
              ]
            }
                        """;
        actual
            .andExpect(status().isOk())
            .andExpect(content().json(expected));
    }

    @Test
    void getOtherProfile() throws Exception {
        var id = 1;
        when(userService.getOtherProfile(eq("user"), eq(id))).thenReturn(
            OtherProfileDto.builder()
                .id(id)
                .login("looooooogin")
                .shortInfo("short info")
                .subscribed(true)
                .build()
        );

        var actual = mockMvc.perform(get("/user/id/{id}", id));

        var expected = """
            {
              "id": 1,
              "login": "looooooogin",
              "shortInfo": "short info",
              "subscribed": true
            }
                        """;
        actual
            .andExpect(status().isOk())
            .andExpect(content().json(expected));
    }

    @Test
    void getByLoginPart() throws Exception {
        var part = "part";
        when(userService.getByLoginPart(eq("user"), eq(part))).thenReturn(
            List.of(
                OtherProfileDto.builder()
                    .id(1)
                    .login("looooooogipartn")
                    .shortInfo("short info")
                    .subscribed(true)
                    .build()
            )
        );

        var actual = mockMvc.perform(get("/user/login/{login}", part));

        var expected = """
            [
              {
                "id": 1,
                "login": "looooooogipartn",
                "shortInfo": "short info",
                "subscribed": true
              }
            ]
                        """;
        actual
            .andExpect(status().isOk())
            .andExpect(content().json(expected));
    }

    @Test
    void updateMe() throws Exception {
        var given = UpdateMeDto.builder()
            .shortInfo("new short info")
            .password("newpassword")
            .build();

        var actual = mockMvc.perform(put("/user")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(given))
            .with(csrf())
        );

        var captor = ArgumentCaptor.forClass(UpdateMeDto.class);
        verify(userService).updateMe(eq("user"), captor.capture());
        actual
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").doesNotExist());
        assertThat(captor.getValue()).isEqualTo(given);
    }
}
