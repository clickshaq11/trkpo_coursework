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
import com.trkpo.model.dto.request.UpdatePostDto;
import com.trkpo.model.dto.response.FirstCommentDto;
import com.trkpo.model.dto.response.MyPostDto;
import com.trkpo.model.dto.response.NewsFeedPostDto;
import com.trkpo.model.dto.response.OtherPostDto;
import com.trkpo.model.dto.response.PostDto;
import com.trkpo.model.dto.response.SubscriptionResultDto;
import com.trkpo.service.SubscriptionService;
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
@WebMvcTest(SubscriptionController.class)
public class SubscriptionControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private SubscriptionService subscriptionService;

    @BeforeEach
    void setUp() {
        Mockito.reset(subscriptionService);
    }

    @Test
    void subscribe() throws Exception {
        var id = 1;
        when(subscriptionService.subscribe(eq("user"), eq(id))).thenReturn(SubscriptionResultDto.builder()
                .subscribed(true)
            .build()
        );

        var actual = mockMvc.perform(post("/subscription/{userId}", id)
            .contentType(MediaType.APPLICATION_JSON)
            .with(csrf())
        );

        var expected = """
            {
              "subscribed": true
            }
            """;
        actual
            .andExpect(status().isOk())
            .andExpect(content().json(expected));
    }
}
