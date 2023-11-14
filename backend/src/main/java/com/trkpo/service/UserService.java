package com.trkpo.service;

import com.trkpo.model.dto.request.UpdateMeDto;
import com.trkpo.model.dto.response.MyProfileDto;
import com.trkpo.model.dto.response.OtherProfileDto;
import com.trkpo.model.dto.response.SubscriptionDto;
import com.trkpo.repository.SubscriptionRepository;
import com.trkpo.repository.UserRepository;
import java.util.List;
import java.util.Objects;
import java.util.regex.Pattern;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.HttpClientErrorException;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private static final Pattern LOGIN_PATTERN = Pattern.compile("^[A-Za-z0-9]+$");

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

    public OtherProfileDto getOtherProfile(String login, Integer id) {
        var requestingUser = userRepository.findByLoginOrThrow(login);
        if (Objects.equals(requestingUser.getId(), id)) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "User" + login + " requested his profile as other profile");
        }
        var requestedUser = userRepository.findById(id)
            .orElseThrow(() -> new HttpClientErrorException(HttpStatus.NOT_FOUND, "Could not find user with id " + id));
        return OtherProfileDto.builder()
            .id(requestedUser.getId())
            .login(requestedUser.getLogin())
            .shortInfo(requestedUser.getShortInfo())
            .subscribed(subscriptionRepository.findByCreatorIdAndSubscriberId(
                    requestedUser.getId(),
                    requestingUser.getId()
                ).isPresent()
            )
            .build();
    }

    public List<OtherProfileDto> getByLoginPart(String requestingLogin, String requestedLogin) {
        var requestingUser = userRepository.findByLoginOrThrow(requestingLogin);
        var matcher = LOGIN_PATTERN.matcher(requestedLogin);
        if (!matcher.matches()) {
            log.info("Requested login {} is invalid, returning empty result of search by login", requestedLogin);
        }
        return userRepository.findByLoginContaining(requestedLogin).stream()
            .filter(entity -> !entity.getLogin().equals(requestingLogin))
            .map(entity -> OtherProfileDto.builder()
                .id(entity.getId())
                .login(entity.getLogin())
                .shortInfo(entity.getShortInfo())
                .subscribed(subscriptionRepository.findByCreatorIdAndSubscriberId(
                        entity.getId(),
                        requestingUser.getId()
                    ).isPresent()
                )
                .build()
            ).toList();
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
