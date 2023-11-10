package com.trkpo.controller;

import com.trkpo.model.dto.response.MyPostDto;
import com.trkpo.service.PostService;
import java.security.Principal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/post")
@RequiredArgsConstructor
public class PostController {
    private final PostService service;

    @GetMapping("/filter/mine")
    public List<MyPostDto> getMine(Principal principal, Pageable pageable){
        return service.getMine(principal.getName(), pageable);
    }
}
