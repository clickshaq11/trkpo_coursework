package com.trkpo.controller;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.trkpo.model.dto.response.NotificationDto;
import com.trkpo.service.NotificationService;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

@WithMockUser
@WebMvcTest(NotificationController.class)
public class NotificationControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private NotificationService notificationService;

    @Test
    void getAllNotifications() throws Exception {
        when(notificationService.getAllNotifications(eq("user"))).thenReturn(
            List.of(
                NotificationDto.builder()
                    .id(1)
                    .postId(2)
                    .build()
            )
        );

        var actual = mockMvc.perform(get("/notification"));

        var expected = """
            [
                {
                  "id": 1,
                  "postId": 2
                }
            ]
            """;
        actual
            .andExpect(status().isOk())
            .andExpect(content().json(expected));
    }
}
