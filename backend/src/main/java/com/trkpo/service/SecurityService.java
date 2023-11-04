package com.trkpo.service;

import com.trkpo.model.dto.request.LoginRequestDto;
import com.trkpo.model.dto.response.LoginResponseDto;
import com.trkpo.repository.UserRepository;
import com.trkpo.service.jwt.JwtService;
import lombok.RequiredArgsConstructor;
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
            .orElseThrow(() -> new HttpClientErrorException(HttpStatus.BAD_REQUEST, "User with that login does not exist"));
        if (!passwordEncoder.matches(dto.getPassword(), user.getHashedPassword())) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Passwords don't match");
        }
        return new LoginResponseDto(jwtService.createJwt(login));
    }
}