package com.trkpo.controller;

import com.trkpo.model.dto.request.CreatePostDto;
import com.trkpo.model.dto.request.UpdatePostDto;
import com.trkpo.model.dto.response.MyPostDto;
import com.trkpo.model.dto.response.NewsFeedPostDto;
import com.trkpo.model.dto.response.OtherPostDto;
import com.trkpo.model.dto.response.PostDto;
import com.trkpo.service.PostService;
import java.security.Principal;
import java.util.List;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/post")
@RequiredArgsConstructor
public class PostController {
    private final PostService service;

    @PostMapping
    public void createPost(Principal principal, @RequestBody @Valid CreatePostDto dto) {
        service.createPost(principal.getName(), dto);
    }

    @GetMapping("/filter/mine")
    public Page<MyPostDto> getMine(Principal principal, Pageable pageable){
        return service.getMine(principal.getName(), pageable);
    }

    @GetMapping("/filter/feed")
    public Page<NewsFeedPostDto> getMyNewsFeed(Principal principal, Pageable pageable) {
        return service.getMyNewsFeed(principal.getName(), pageable);
    }

    @GetMapping("/user/{id}")
    public Page<OtherPostDto> getByUserId(@PathVariable Integer id, Pageable pageable) {
        return service.getByUserId(id, pageable);
    }

    @GetMapping("/{id}")
    public PostDto getById(Principal principal, @PathVariable Integer id) {
        return service.getById(principal.getName(), id);
    }

    @PutMapping("/{id}")
    public void updateById(Principal principal, @RequestBody @Valid UpdatePostDto dto, @PathVariable Integer id) {
        service.updateById(principal.getName(), dto, id);
    }

    @DeleteMapping("/{id}")
    public void deleteById(Principal principal, @PathVariable Integer id) {
        service.deleteById(principal.getName(), id);
    }
}
