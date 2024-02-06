package com.trkpo.service;

import com.trkpo.model.dto.request.LoginRequestDto;
import com.trkpo.model.dto.request.RegistrationRequestDto;
import com.trkpo.model.dto.response.LoginResponseDto;
import com.trkpo.model.dto.response.RegistrationResponseDto;
import com.trkpo.model.entity.UserEntity;
import com.trkpo.repository.UserRepository;
import com.trkpo.service.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

@Service
@RequiredArgsConstructor
public class SecurityService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public LoginResponseDto login(LoginRequestDto dto) {
        var login = dto.getLogin();
        var user = userRepository.findByLogin(login)
            .orElseThrow(
                () -> new HttpClientErrorException(HttpStatus.BAD_REQUEST, "User with that login does not exist")
            );
        if (!passwordEncoder.matches(dto.getPassword(), user.getHashedPassword())) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Passwords don't match");
        }
        return LoginResponseDto.builder()
            .token(jwtService.createJwt(login))
            .build();
    }

    public RegistrationResponseDto register(RegistrationRequestDto dto) {
        var user = UserEntity.builder()
            .login(dto.getLogin())
            .shortInfo(dto.getShortInfo())
            .hashedPassword(passwordEncoder.encode(dto.getPassword()))
            .build();
        try {
            userRepository.save(user);
        } catch (DataIntegrityViolationException e) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Login is already taken");
        }
        return RegistrationResponseDto.builder()
            .token(jwtService.createJwt(dto.getLogin()))
            .build();
    }
}
