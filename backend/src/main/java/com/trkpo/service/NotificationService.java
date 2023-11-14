package com.trkpo.service;

import com.trkpo.model.dto.response.NotificationDto;
import com.trkpo.repository.NotificationRepository;
import com.trkpo.repository.UserRepository;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public List<NotificationDto> getAllNotifications(String login) {
        log.info("Getting all notifications for user {}", login);
        var user = userRepository.findByLoginOrThrow(login);
        notificationRepository.deleteAllOlderThan30Days(Instant.now().toEpochMilli());
        return notificationRepository.findByUserId(user.getId()).stream()
            .filter(entity -> entity.getCreatedAt() + Duration.ofDays(30).toMillis() > Instant.now().toEpochMilli())
            .map(entity -> NotificationDto.builder()
                .id(entity.getId())
                .postId(entity.getPost().getId())
                .build()
            ).toList();
    }
}
