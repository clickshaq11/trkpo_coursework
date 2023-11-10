package com.trkpo.controller;

import com.trkpo.model.dto.response.MyProfileDto;
import com.trkpo.service.UserService;
import java.security.Principal;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService service;

    @GetMapping("/me")
    public MyProfileDto getMe(Principal principal) {
        return service.getMe(principal.getName());
    }
}
