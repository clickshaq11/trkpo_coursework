package com.trkpo.controller;

import com.trkpo.model.dto.request.UpdateMeDto;
import com.trkpo.model.dto.response.MyProfileDto;
import com.trkpo.model.dto.response.OtherProfileDto;
import com.trkpo.service.UserService;
import java.security.Principal;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
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

    @GetMapping("/id/{id}")
    public OtherProfileDto getOtherProfile(Principal principal, @PathVariable Integer id) {
        return service.getOtherProfile(principal.getName(), id);
    }

    @PutMapping
    public void updateMe(Principal principal, @RequestBody @Valid UpdateMeDto dto) {
        service.updateMe(principal.getName(), dto);
    }
}
