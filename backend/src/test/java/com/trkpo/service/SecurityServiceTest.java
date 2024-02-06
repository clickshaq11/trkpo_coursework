package com.trkpo.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.trkpo.model.dto.request.LoginRequestDto;
import com.trkpo.model.dto.request.RegistrationRequestDto;
import com.trkpo.model.entity.SubscriptionEntity;
import com.trkpo.model.entity.UserEntity;
import com.trkpo.repository.SubscriptionRepository;
import com.trkpo.repository.UserRepository;
import com.trkpo.service.jwt.JwtService;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.client.HttpClientErrorException;

@SpringBootTest(classes = {SecurityService.class})
public class SecurityServiceTest {

    @Autowired
    private SecurityService securityService;
    @MockBean
    private UserRepository userRepository;
    @MockBean
    private JwtService jwtService;
    @MockBean
    private PasswordEncoder passwordEncoder;

    @Test
    void login() {
        var givenLogin = "looooooogin";
        var givenPassword = "password";
        var givenDto = LoginRequestDto.builder()
            .login(givenLogin)
            .password(givenPassword)
            .build();
        var givenMe = UserEntity.builder()
            .id(1)
            .login(givenLogin)
            .hashedPassword("hashedpassword")
            .shortInfo("short info")
            .build();
        when(userRepository.findByLogin(eq(givenLogin))).thenReturn(
            Optional.of(givenMe)
        );
        when(passwordEncoder.matches(eq(givenPassword), eq("hashedpassword"))).thenReturn(true);
        when(jwtService.createJwt(givenLogin)).thenReturn("jwt");

        var actual = securityService.login(givenDto);

        assertThat(actual)
            .hasFieldOrPropertyWithValue("token", "jwt");
    }

    @Test
    void loginWhenPasswordsDontMatch() {
        var givenLogin = "looooooogin";
        var givenPassword = "password";
        var givenDto = LoginRequestDto.builder()
            .login(givenLogin)
            .password(givenPassword)
            .build();
        var givenMe = UserEntity.builder()
            .id(1)
            .login(givenLogin)
            .hashedPassword("hashedpassword")
            .shortInfo("short info")
            .build();
        when(userRepository.findByLogin(eq(givenLogin))).thenReturn(
            Optional.of(givenMe)
        );
        when(passwordEncoder.matches(eq(givenPassword), eq("hashedpassword"))).thenReturn(false);

        assertThatThrownBy(() -> securityService.login(givenDto))
            .isInstanceOf(HttpClientErrorException.class);
    }

    @Test
    void loginWhenUserIsNotFound() {
        var givenLogin = "looooooogin";
        var givenPassword = "password";
        var givenDto = LoginRequestDto.builder()
            .login(givenLogin)
            .password(givenPassword)
            .build();
        when(userRepository.findByLogin(eq(givenLogin))).thenReturn(
            Optional.empty()
        );

        assertThatThrownBy(() -> securityService.login(givenDto))
            .isInstanceOf(HttpClientErrorException.class);
    }

    @Test
    void register() {
        var givenLogin = "looooooogin";
        var givenPassword = "password";
        var givenDto = RegistrationRequestDto.builder()
            .login(givenLogin)
            .password(givenPassword)
            .shortInfo("short info")
            .build();
        when(passwordEncoder.encode(eq(givenPassword))).thenReturn("hashedpassword");
        when(jwtService.createJwt(givenLogin)).thenReturn("jwt");

        var actual = securityService.register(givenDto);

        var expected = UserEntity.builder()
            .login(givenLogin)
            .hashedPassword("hashedpassword")
            .shortInfo("short info")
            .build();
        verify(userRepository).save(eq(expected));
        assertThat(actual)
            .hasFieldOrPropertyWithValue("token", "jwt");
    }

    @Test
    void registerWhenLoginIsAlreadyTaken() {
        var givenLogin = "looooooogin";
        var givenPassword = "password";
        var givenDto = RegistrationRequestDto.builder()
            .login(givenLogin)
            .password(givenPassword)
            .shortInfo("short info")
            .build();
        var expected = UserEntity.builder()
            .login(givenLogin)
            .hashedPassword("hashedpassword")
            .shortInfo("short info")
            .build();
        when(passwordEncoder.encode(eq(givenPassword))).thenReturn("hashedpassword");
        when(userRepository.save(eq(expected))).thenThrow(
            new DataIntegrityViolationException("message")
        );

        assertThatThrownBy(() -> securityService.register(givenDto))
            .isInstanceOf(HttpClientErrorException.class);
    }
}
