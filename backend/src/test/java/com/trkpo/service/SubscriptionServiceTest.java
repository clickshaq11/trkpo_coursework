package com.trkpo.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.trkpo.model.dto.request.UpdateMeDto;
import com.trkpo.model.entity.SubscriptionEntity;
import com.trkpo.model.entity.UserEntity;
import com.trkpo.repository.SubscriptionRepository;
import com.trkpo.repository.UserRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;

@SpringBootTest(classes = {SubscriptionService.class})
public class SubscriptionServiceTest {

    @Autowired
    private SubscriptionService subscriptionService;
    @MockBean
    private UserRepository userRepository;
    @MockBean
    private SubscriptionRepository subscriptionRepository;

    @Test
    void subscribeIfNotSubscribed() {
        var creatorId = 2;
        var login = "loooooogin";
        var givenMe = UserEntity.builder()
            .id(1)
            .login(login)
            .hashedPassword("hashedpassword")
            .shortInfo("short info")
            .build();
        var givenCreator = UserEntity.builder()
            .id(creatorId)
            .build();
        when(userRepository.findByLoginOrThrow(eq(login))).thenReturn(givenMe);
        when(userRepository.existsById(creatorId)).thenReturn(true);
        when(userRepository.getReferenceById(creatorId)).thenReturn(givenCreator);
        when(subscriptionRepository.findByCreatorIdAndSubscriberId(eq(creatorId), eq(1))).thenReturn(
            Optional.empty()
        );

        var actual = subscriptionService.subscribe(login, creatorId);

        var expected = SubscriptionEntity.builder()
            .creator(givenCreator)
            .subscriber(givenMe)
            .build();
        verify(subscriptionRepository).save(eq(expected));
        assertThat(actual)
            .hasFieldOrPropertyWithValue("subscribed", true);
    }

    @Test
    void subscribeIfAlreadySubscribed() {
        var creatorId = 2;
        var subscriptionId = 123;
        var login = "loooooogin";
        var givenMe = UserEntity.builder()
            .id(1)
            .login(login)
            .hashedPassword("hashedpassword")
            .shortInfo("short info")
            .build();
        var givenCreator = UserEntity.builder()
            .id(creatorId)
            .build();
        when(userRepository.findByLoginOrThrow(eq(login))).thenReturn(givenMe);
        when(userRepository.existsById(creatorId)).thenReturn(true);
        when(userRepository.getReferenceById(creatorId)).thenReturn(givenCreator);
        when(subscriptionRepository.findByCreatorIdAndSubscriberId(eq(creatorId), eq(1))).thenReturn(
            Optional.of(
                SubscriptionEntity.builder()
                    .id(subscriptionId)
                    .creator(givenCreator)
                    .subscriber(givenMe)
                    .build()
            )
        );

        var actual = subscriptionService.subscribe(login, creatorId);

        verify(subscriptionRepository).deleteById(eq(subscriptionId));
        assertThat(actual)
            .hasFieldOrPropertyWithValue("subscribed", false);
    }

    @Test
    void subscribeToYourself() {
        var creatorId = 2;
        var login = "loooooogin";
        var givenMe = UserEntity.builder()
            .id(creatorId)
            .login(login)
            .hashedPassword("hashedpassword")
            .shortInfo("short info")
            .build();
        when(userRepository.findByLoginOrThrow(eq(login))).thenReturn(givenMe);

        assertThatThrownBy(() -> subscriptionService.subscribe(login, creatorId))
            .isInstanceOf(HttpClientErrorException.class);
    }

    @Test
    void subscribeToNotExistingUser() {
        var creatorId = 2;
        var login = "loooooogin";
        var givenMe = UserEntity.builder()
            .id(1)
            .login(login)
            .hashedPassword("hashedpassword")
            .shortInfo("short info")
            .build();
        when(userRepository.findByLoginOrThrow(eq(login))).thenReturn(givenMe);
        when(userRepository.existsById(creatorId)).thenReturn(false);

        assertThatThrownBy(() -> subscriptionService.subscribe(login, creatorId))
            .isInstanceOf(HttpClientErrorException.class);
    }
}
