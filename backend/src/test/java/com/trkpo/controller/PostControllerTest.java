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
import com.trkpo.model.dto.request.CreateCommentDto;
import com.trkpo.model.dto.request.CreatePostDto;
import com.trkpo.model.dto.request.UpdatePostDto;
import com.trkpo.model.dto.response.CommentDto;
import com.trkpo.model.dto.response.FirstCommentDto;
import com.trkpo.model.dto.response.MyPostDto;
import com.trkpo.model.dto.response.NewsFeedPostDto;
import com.trkpo.model.dto.response.OtherPostDto;
import com.trkpo.model.dto.response.PostDto;
import com.trkpo.service.PostService;
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
@WebMvcTest(PostController.class)
public class PostControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @MockBean
    private PostService postService;

    @BeforeEach
    void setUp() {
        Mockito.reset(postService);
    }

    @Test
    void createPost() throws Exception {
        var given = CreatePostDto.builder()
            .title("title")
            .body("body")
            .build();

        var actual = mockMvc.perform(post("/post")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(given))
            .with(csrf())
        );

        var captor = ArgumentCaptor.forClass(CreatePostDto.class);
        verify(postService).createPost(eq("user"), captor.capture());
        actual
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").doesNotExist());
        assertThat(captor.getValue()).isEqualTo(given);
    }

    @Test
    void getMine() throws Exception {
        when(postService.getMine(eq("user"), any())).thenReturn(
            new PageImpl<>(List.of(
                MyPostDto.builder()
                    .id(123)
                    .title("title")
                    .body("body")
                    .authorId(456)
                    .authorLogin("authorLogin")
                    .likeCounter(789)
                    .createdAt(123456L)
                    .hitLike(false)
                    .firstComments(List.of(
                        FirstCommentDto.builder()
                            .id(567)
                            .authorLogin("commentLogin")
                            .body("commentBody")
                            .build()
                    ))
                    .build()
            ))
        );

        var actual = mockMvc.perform(get("/post/filter/mine"));

        var expected = """
            {
                "content": [
                  {
                    "id": 123,
                    "title": "title",
                    "body": "body",
                    "authorId": 456,
                    "authorLogin": "authorLogin",
                    "likeCounter": 789,
                    "createdAt": 123456,
                    "hitLike": false,
                    "firstComments": [
                      {
                        "id": 567,
                        "authorLogin": "commentLogin",
                        "body": "commentBody"
                      }
                    ]
                  }
                ]
            }
            """;
        actual
            .andExpect(status().isOk())
            .andExpect(content().json(expected));
    }

    @Test
    void getMyNewsFeed() throws Exception {
        when(postService.getMyNewsFeed(eq("user"))).thenReturn(
            List.of(
                NewsFeedPostDto.builder()
                    .id(123)
                    .title("title")
                    .body("body")
                    .authorId(456)
                    .authorLogin("authorLogin")
                    .likeCounter(789)
                    .createdAt(123456L)
                    .hitLike(false)
                    .firstComments(List.of(
                        FirstCommentDto.builder()
                            .id(567)
                            .authorLogin("commentLogin")
                            .body("commentBody")
                            .build()
                    ))
                    .build()
            )
        );

        var actual = mockMvc.perform(get("/post/filter/feed"));

        var expected = """
            [
              {
                "id": 123,
                "title": "title",
                "body": "body",
                "authorId": 456,
                "authorLogin": "authorLogin",
                "createdAt": 123456,
                "likeCounter": 789,
                "hitLike": false,
                "firstComments": [
                  {
                    "id": 567,
                    "authorLogin": "commentLogin",
                    "body": "commentBody"
                  }
                ]
              }
            ]
                        """;
        actual
            .andExpect(status().isOk())
            .andExpect(content().json(expected));
    }

    @Test
    void getByUserId() throws Exception {
        var id = 1;
        when(postService.getByUserId(eq("user"), eq(id), any())).thenReturn(
            new PageImpl<>(List.of(
                OtherPostDto.builder()
                    .id(123)
                    .title("title")
                    .body("body")
                    .authorId(456)
                    .authorLogin("authorLogin")
                    .likeCounter(789)
                    .createdAt(123456L)
                    .hitLike(false)
                    .firstComments(List.of(
                        FirstCommentDto.builder()
                            .id(567)
                            .authorLogin("commentLogin")
                            .body("commentBody")
                            .build()
                    ))
                    .build()
            ))
        );

        var actual = mockMvc.perform(get("/post/user/{id}", id));

        var expected = """
            {
            "content": [
              {
                "id": 123,
                "title": "title",
                "body": "body",
                "authorId": 456,
                "authorLogin": "authorLogin",
                "likeCounter": 789,
                "createdAt": 123456,
                "hitLike": false,
                "firstComments": [
                  {
                    "id": 567,
                    "authorLogin": "commentLogin",
                    "body": "commentBody"
                  }
                ]
              }
            ]
            }
                      """;
        actual
            .andExpect(status().isOk())
            .andExpect(content().json(expected));
    }

    @Test
    void getById() throws Exception {
        var id = 1;
        when(postService.getById(eq("user"), eq(id))).thenReturn(
            PostDto.builder()
                .title("title")
                .body("body")
                .authorId(456)
                .authorLogin("authorLogin")
                .likeCounter(789)
                .createdAt(123456L)
                .hitLike(false)
                .isAuthor(true)
                .build()
        );

        var actual = mockMvc.perform(get("/post/{id}", id));

        var expected = """
            {
              "title": "title",
              "body": "body",
              "createdAt": 123456,
              "authorId": 456,
              "authorLogin": "authorLogin",
              "likeCounter": 789,
              "hitLike": false,
              "isAuthor": true
            }
                        """;
        actual
            .andExpect(status().isOk())
            .andExpect(content().json(expected));
    }

    @Test
    void updateById() throws Exception {
        var id = 1;
        var given = UpdatePostDto.builder()
            .title("new title")
            .body("new body")
            .build();

        var actual = mockMvc.perform(put("/post/{id}", id)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(given))
            .with(csrf())
        );

        var captor = ArgumentCaptor.forClass(UpdatePostDto.class);
        verify(postService).updateById(eq("user"), captor.capture(), eq(id));
        actual
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").doesNotExist());
        assertThat(captor.getValue()).isEqualTo(given);
    }

    @Test
    void deleteById() throws Exception {
        var id = 1;

        var actual = mockMvc.perform(delete("/post/{id}", id).with(csrf()));

        actual
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").doesNotExist());
    }
}
