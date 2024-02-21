package com.trkpo.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.tuple;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trkpo.model.dto.request.LoginRequestDto;
import com.trkpo.model.dto.request.RegistrationRequestDto;
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
public class SecurityControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private UserRepository userRepository;

    @Test
    void loginWithNotExistingUsername() throws Exception {
        var given = LoginRequestDto.builder()
            .login("notExistingLogin")
            .password("password")
            .build();

        var actual = mockMvc.perform(
            post("/security/auth")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(given))
        );

        actual
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("User with that login does not exist"));
    }

    @Test
    void loginWithNotMatchingPasswords() throws Exception {
        var given = LoginRequestDto.builder()
            .login("login123")
            .password("notMatchingPassword")
            .build();

        var actual = mockMvc.perform(
            post("/security/auth")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(given))
        );

        actual
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("Passwords don't match"));
    }

    @Test
    void login() throws Exception {
        var given = LoginRequestDto.builder()
            .login("login123")
            .password("password")
            .build();

        var actual = mockMvc.perform(
            post("/security/auth")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(given))
        );

        actual
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").value("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9."
                + "eyJzdWIiOiJsb2dpbjEyMyJ9.e0Vgi_RBrXwzlwmYqSDgO6u2vTngKyTS_EsLuhRvieg"));
    }

    @Test
    void registerWhenUsernameIsTaken() throws Exception {
        var given = RegistrationRequestDto.builder()
            .login("login123")
            .password("password")
            .shortInfo("newShortInfo")
            .build();

        var actual = mockMvc.perform(
            post("/security/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(given))
        );
        var actualUsers = userRepository.findAll();

        actual
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("Login is already taken"));
        assertThat(actualUsers).hasSize(4)
            .extracting("login", "shortInfo")
            .containsOnly(
                tuple("login123", "shortInfo"),
                tuple("login2222", "info"),
                tuple("logout111", "logoutInfo"),
                tuple("anotherUser", "info")
            );
    }

    @Test
    void register() throws Exception {
        var given = RegistrationRequestDto.builder()
            .login("login456")
            .password("password")
            .shortInfo("newShortInfo")
            .build();

        var actual = mockMvc.perform(
            post("/security/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(given))
        );
        var actualUsers = userRepository.findAll();

        actual
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").value("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9."
                + "eyJzdWIiOiJsb2dpbjQ1NiJ9.-sk2FKdfFHuVEr7TeA7KxUk8i03Mjy-EHgOAVsXHhJ0"));
        assertThat(actualUsers).hasSize(5)
            .extracting("login", "shortInfo")
            .containsOnly(
                tuple("login123", "shortInfo"),
                tuple("login2222", "info"),
                tuple("logout111", "logoutInfo"),
                tuple("anotherUser", "info"),
                tuple("login456", "newShortInfo")
            );
    }
}
