package com.trkpo.controller;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.trkpo.model.dto.response.LikeDto;
import com.trkpo.service.LikeService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

@WithMockUser
@WebMvcTest(LikeController.class)
public class LikeControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private LikeService likeService;

    @Test
    void like() throws Exception {
        var id = 1;
        when(likeService.like(eq("user"), eq(id))).thenReturn(LikeDto.builder().hitLike(true).build());

        var actual = mockMvc.perform(post("/post/{id}", id).with(csrf()));

        var expected = """
            {
              "hitLike": true
            }
            """;
        actual
            .andExpect(status().isOk())
            .andExpect(content().json(expected));
    }
}
