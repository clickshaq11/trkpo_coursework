package com.trkpo.service;

import com.trkpo.model.dto.response.MyProfileDto;
import com.trkpo.model.dto.response.SubscriptionDto;
import com.trkpo.repository.SubscriptionRepository;
import com.trkpo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpServerErrorException;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final SubscriptionRepository subscriptionRepository;

    public MyProfileDto getMe(String login) {
        var userEntity = userRepository.findByLogin(login)
            .orElseThrow(() -> new HttpServerErrorException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not find user with login " + login));
        var subscriptions = subscriptionRepository.findBySubscriberId(userEntity.getId()).stream()
            .map(subscribtionEntity -> SubscriptionDto.builder()
                .id(subscribtionEntity.getId())
                .login(subscribtionEntity.getCreator().getLogin())
                .build()
            )
            .toList();
        return MyProfileDto.builder()
            .login(userEntity.getLogin())
            .shortInfo(userEntity.getShortInfo())
            .subscriptions(subscriptions)
            .build();
    }
}
