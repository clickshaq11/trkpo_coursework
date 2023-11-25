package com.trkpo.controller;

import com.trkpo.model.dto.response.LikeDto;
import com.trkpo.service.LikeService;
import java.security.Principal;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class LikeController {
    private final LikeService service;

    @PostMapping("/post/{id}")
    public LikeDto like(Principal principal, @PathVariable Integer id) {
        return service.like(principal.getName(), id);
    }
}
