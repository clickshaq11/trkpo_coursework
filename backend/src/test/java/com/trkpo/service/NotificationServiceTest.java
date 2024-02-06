package com.trkpo.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.trkpo.model.entity.NotificationEntity;
import com.trkpo.model.entity.PostEntity;
import com.trkpo.model.entity.SubscriptionEntity;
import com.trkpo.model.entity.UserEntity;
import com.trkpo.repository.NotificationRepository;
import com.trkpo.repository.UserRepository;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.web.client.HttpClientErrorException;

@SpringBootTest(classes = {NotificationService.class})
public class NotificationServiceTest {

    @Autowired
    private NotificationService notificationService;
    @MockBean
    private UserRepository userRepository;
    @MockBean
    private NotificationRepository notificationRepository;

    @Test
    void getAllNotifications() {
        var userId = 2;
        var postId = 3;
        var login = "loooooogin";
        var givenMe = UserEntity.builder()
            .id(userId)
            .login(login)
            .hashedPassword("hashedpassword")
            .shortInfo("short info")
            .build();
        var givenPost = PostEntity.builder().id(postId).build();
        when(userRepository.findByLoginOrThrow(eq(login))).thenReturn(givenMe);
        when(notificationRepository.findByUserId(eq(userId))).thenReturn(
            List.of(
                NotificationEntity.builder()
                    .id(1)
                    .post(givenPost)
                    .createdAt(Instant.now().toEpochMilli())
                    .build()
            )
        );

        var actual = notificationService.getAllNotifications(login);

        assertThat(actual).singleElement()
            .hasFieldOrPropertyWithValue("id", 1)
            .hasFieldOrPropertyWithValue("postId", postId);
    }
}
