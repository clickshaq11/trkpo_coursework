package com.trkpo.controller;

import com.trkpo.model.dto.request.LoginRequestDto;
import com.trkpo.model.dto.request.RegistrationRequestDto;
import com.trkpo.model.dto.response.LoginResponseDto;
import com.trkpo.model.dto.response.RegistrationResponseDto;
import com.trkpo.service.SecurityService;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/security")
@RequiredArgsConstructor
public class SecurityController {
    private final SecurityService service;

    @PostMapping("/auth")
    public LoginResponseDto login(@RequestBody @Valid LoginRequestDto dto) {
        return service.login(dto);
    }

    @PostMapping("/register")
    public RegistrationResponseDto register(@RequestBody @Valid RegistrationRequestDto dto) {
        return service.register(dto);
    }
}
