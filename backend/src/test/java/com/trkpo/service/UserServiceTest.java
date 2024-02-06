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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;

@SpringBootTest(classes = {UserService.class})
public class UserServiceTest {

    @Autowired
    private UserService userService;
    @MockBean
    private UserRepository userRepository;
    @MockBean
    private SubscriptionRepository subscriptionRepository;
    @MockBean
    private PasswordEncoder passwordEncoder;

    @Test
    void getMe() {
        var login = "loooooogin";
        var givenMe = UserEntity.builder()
            .id(1)
            .login(login)
            .hashedPassword("hashedpassword")
            .shortInfo("short info")
            .build();
        var givenCreator = UserEntity.builder()
            .id(4)
            .login("otherlogin")
            .hashedPassword("hashedpassword")
            .shortInfo("short info")
            .build();
        when(userRepository.findByLoginOrThrow(eq(login))).thenReturn(givenMe);
        when(subscriptionRepository.findBySubscriberId(eq(1))).thenReturn(
            List.of(
                SubscriptionEntity.builder()
                .id(2)
                .creator(givenCreator)
                .subscriber(givenMe)
                .build()
            )
        );

        var actual = userService.getMe(login);

        assertThat(actual)
            .hasFieldOrPropertyWithValue("login", login)
            .hasFieldOrPropertyWithValue("shortInfo", "short info")
            .extracting("subscriptions").asList().singleElement()
            .hasFieldOrPropertyWithValue("id", 4)
            .hasFieldOrPropertyWithValue("login", "otherlogin");
    }

    @Test
    void getMeIfUserIsNotFound() {
        var login = "loooooogin";
        when(userRepository.findByLoginOrThrow(eq(login))).thenThrow(
            new HttpServerErrorException(HttpStatus.INTERNAL_SERVER_ERROR)
        );

        assertThatThrownBy(() -> userService.getMe(login))
            .isInstanceOf(HttpServerErrorException.class);
    }

    @Test
    void getOtherProfile() {
        var requestedId = 2;
        var requestingLogin = "loooooogin";
        var givenMe = UserEntity.builder()
            .id(1)
            .login(requestingLogin)
            .hashedPassword("hashedpassword")
            .shortInfo("short info")
            .build();
        var givenRequestedUser = UserEntity.builder()
            .id(requestedId)
            .login("otherlogin")
            .hashedPassword("hashedpassword")
            .shortInfo("short info")
            .build();
        when(userRepository.findByLoginOrThrow(eq(requestingLogin))).thenReturn(givenMe);
        when(userRepository.findById(eq(requestedId))).thenReturn(Optional.of(givenRequestedUser));
        when(subscriptionRepository.findByCreatorIdAndSubscriberId(eq(requestedId), eq(1))).thenReturn(
            Optional.empty()
        );

        var actual = userService.getOtherProfile(requestingLogin, requestedId);

        assertThat(actual)
            .hasFieldOrPropertyWithValue("id", requestedId)
            .hasFieldOrPropertyWithValue("login", "otherlogin")
            .hasFieldOrPropertyWithValue("shortInfo", "short info")
            .hasFieldOrPropertyWithValue("subscribed", false);
    }

    @Test
    void getOtherProfileWhenRequestingAndRequestedUsersAreTheSame() {
        var requestedId = 2;
        var requestingLogin = "loooooogin";
        var givenMe = UserEntity.builder()
            .id(requestedId)
            .login(requestingLogin)
            .hashedPassword("hashedpassword")
            .shortInfo("short info")
            .build();
        when(userRepository.findByLoginOrThrow(eq(requestingLogin))).thenReturn(givenMe);

        assertThatThrownBy(() -> userService.getOtherProfile(requestingLogin, requestedId))
            .isInstanceOf(HttpClientErrorException.class);
    }

    @Test
    void getOtherProfileWhenRequestedUserIsNotFound() {
        var requestedId = 2;
        var requestingLogin = "loooooogin";
        var givenMe = UserEntity.builder()
            .id(1)
            .login(requestingLogin)
            .hashedPassword("hashedpassword")
            .shortInfo("short info")
            .build();
        when(userRepository.findByLoginOrThrow(eq(requestingLogin))).thenReturn(givenMe);
        when(userRepository.findById(eq(requestedId))).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.getOtherProfile(requestingLogin, requestedId))
            .isInstanceOf(HttpClientErrorException.class);
    }

    @Test
    void getByLoginPart() {
        var requestedPart = "part";
        var requestingLogin = "loooooogin";
        var givenMe = UserEntity.builder()
            .id(1)
            .login(requestingLogin)
            .hashedPassword("hashedpassword")
            .shortInfo("short info")
            .build();
        var givenRequestedUser = UserEntity.builder()
            .id(2)
            .login("otherlogin" + requestedPart)
            .hashedPassword("hashedpassword")
            .shortInfo("short info")
            .build();
        when(userRepository.findByLoginOrThrow(eq(requestingLogin))).thenReturn(givenMe);
        when(userRepository.findByLoginContaining(eq(requestedPart))).thenReturn(
            List.of(givenRequestedUser)
        );
        when(subscriptionRepository.findByCreatorIdAndSubscriberId(eq(2), eq(1))).thenReturn(
            Optional.empty()
        );

        var actual = userService.getByLoginPart(requestingLogin, requestedPart);

        assertThat(actual).singleElement()
            .hasFieldOrPropertyWithValue("id", 2)
            .hasFieldOrPropertyWithValue("login", "otherlogin" + requestedPart)
            .hasFieldOrPropertyWithValue("shortInfo", "short info")
            .hasFieldOrPropertyWithValue("subscribed", false);
    }

    @Test
    void updateMe() {
        var givenDto = UpdateMeDto.builder()
            .password("newpassword")
            .shortInfo("new short info")
            .build();
        var requestingLogin = "loooooogin";
        var givenMe = UserEntity.builder()
            .id(1)
            .login(requestingLogin)
            .hashedPassword("hashedpassword")
            .shortInfo("short info")
            .build();
        when(userRepository.findByLoginOrThrow(eq(requestingLogin))).thenReturn(givenMe);
        when(passwordEncoder.encode(eq("newpassword"))).thenReturn("newpassword");

        userService.updateMe(requestingLogin, givenDto);

        var expected = UserEntity.builder()
            .id(1)
            .login(requestingLogin)
            .hashedPassword("newpassword")
            .shortInfo("new short info")
            .build();
        verify(userRepository).save(eq(expected));
    }
}
