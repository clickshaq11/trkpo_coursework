package com.trkpo.service;

import com.trkpo.model.dto.request.UpdateMeDto;
import com.trkpo.model.dto.response.MyProfileDto;
import com.trkpo.model.dto.response.SubscriptionDto;
import com.trkpo.repository.SubscriptionRepository;
import com.trkpo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.HttpServerErrorException;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final PasswordEncoder passwordEncoder;

    public MyProfileDto getMe(String login) {
        var userEntity = userRepository.findByLoginOrThrow(login);
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

    public void updateMe(String login, UpdateMeDto dto) {
        if (!StringUtils.hasText(dto.getPassword()) && !StringUtils.hasText(dto.getShortInfo())) {
            return;
        }
        var user = userRepository.findByLoginOrThrow(login);
        if (StringUtils.hasText(dto.getPassword())) {
            user.setHashedPassword(passwordEncoder.encode(dto.getPassword()));
        }
        if (StringUtils.hasText(dto.getShortInfo())) {
            user.setShortInfo(dto.getShortInfo());
        }
        userRepository.save(user);
    }
}
