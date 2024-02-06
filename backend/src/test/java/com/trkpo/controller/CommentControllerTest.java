package com.trkpo.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trkpo.model.dto.request.CreateCommentDto;
import com.trkpo.model.dto.response.CommentDto;
import com.trkpo.service.CommentService;
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
@WebMvcTest(CommentController.class)
public class CommentControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @MockBean
    private CommentService commentService;

    @BeforeEach
    void setUp() {
        Mockito.reset(commentService);
    }

    @Test
    void getByPostIdWhenServiceReturnsComments() throws Exception {
        var id = 1;
        when(commentService.getByPostId(eq(id), any())).thenReturn(
            new PageImpl<>(List.of(
                CommentDto.builder()
                    .id(123)
                    .authorLogin("456")
                    .body("789")
                    .build()
            ))
        );

        var actual = mockMvc.perform(get("/post/{id}/comment", id));

        var expected = """
            {
            "content": [
                {
                  "id": 123,
                  "authorLogin": "456",
                  "body": "789"
                }
              ]
            }
            """;
        actual
            .andExpect(status().isOk())
            .andExpect(content().json(expected));
    }

    @Test
    void createComment() throws Exception {
        var id = 1;
        var given = CreateCommentDto.builder()
            .body("given body")
            .build();

        var actual = mockMvc.perform(post("/post/{id}/comment", id)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(given))
            .with(csrf())
        );

        var captor = ArgumentCaptor.forClass(CreateCommentDto.class);
        verify(commentService).createComment(eq("user"), captor.capture(), eq(id));
        actual
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").doesNotExist());
        assertThat(captor.getValue()).isEqualTo(given);
    }
}
