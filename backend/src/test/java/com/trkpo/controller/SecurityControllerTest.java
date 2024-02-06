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
import com.trkpo.model.dto.request.LoginRequestDto;
import com.trkpo.model.dto.request.RegistrationRequestDto;
import com.trkpo.model.dto.response.LoginResponseDto;
import com.trkpo.model.dto.response.RegistrationResponseDto;
import com.trkpo.service.SecurityService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

@WithMockUser
@WebMvcTest(SecurityController.class)
public class SecurityControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @MockBean
    private SecurityService securityService;

    @BeforeEach
    void setUp() {
        Mockito.reset(securityService);
    }

    @Test
    void login() throws Exception {
        var given = LoginRequestDto.builder()
            .login("loooooooogin")
            .password("password")
            .build();
        when(securityService.login(eq(given))).thenReturn(new LoginResponseDto("token"));

        var actual = mockMvc.perform(post("/security/auth")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(given))
            .with(csrf())
        );

        var expected = """
            {
              "token": "token"
            }
            """;
        actual
            .andExpect(status().isOk())
            .andExpect(content().json(expected));
    }

    @Test
    void register() throws Exception {
        var given = RegistrationRequestDto.builder()
            .login("loooooooogin")
            .password("password")
            .shortInfo("short info")
            .build();
        when(securityService.register(eq(given))).thenReturn(new RegistrationResponseDto("token"));

        var actual = mockMvc.perform(post("/security/register")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(given))
            .with(csrf())
        );

        var expected = """
            {
              "token": "token"
            }
            """;
        actual
            .andExpect(status().isOk())
            .andExpect(content().json(expected));
    }
}
