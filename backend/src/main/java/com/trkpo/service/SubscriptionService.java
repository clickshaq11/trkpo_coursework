package com.trkpo.service;

import com.trkpo.model.dto.response.SubscriptionResultDto;
import com.trkpo.model.entity.SubscriptionEntity;
import com.trkpo.repository.SubscriptionRepository;
import com.trkpo.repository.UserRepository;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;

@Slf4j
@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;

    @Transactional
    public SubscriptionResultDto subscribe(String login, Integer creatorId) {
        log.info("Subscribe user with login {} to user with id {}", login, creatorId);
        var subscribingUser = userRepository.findByLoginOrThrow(login);
        if (Objects.equals(subscribingUser.getId(), creatorId)) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Attempt to subscribe to yourself for login " + login);
        }
        if (!userRepository.existsById(creatorId)) {
            throw new HttpClientErrorException(HttpStatus.NOT_FOUND, "Could not found user with id " + creatorId);
        }
        var subscriptionOptional = subscriptionRepository.findByCreatorIdAndSubscriberId(creatorId, subscribingUser.getId());
        if (subscriptionOptional.isPresent()) {
            subscriptionRepository.deleteById(subscriptionOptional.get().getId());
            return new SubscriptionResultDto(false);
        }
        subscriptionRepository.save(
            SubscriptionEntity.builder()
                .creator(userRepository.getReferenceById(creatorId))
                .subscriber(subscribingUser)
                .build()
        );
        return new SubscriptionResultDto(true);
    }
}
