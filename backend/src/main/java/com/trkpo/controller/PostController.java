package com.trkpo.controller;

import com.trkpo.model.dto.request.UpdatePostDto;
import com.trkpo.model.dto.response.MyPostDto;
import com.trkpo.service.PostService;
import java.security.Principal;
import java.util.List;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
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

    @PutMapping("/{id}")
    public void updateById(Principal principal, @RequestBody @Valid UpdatePostDto dto, @PathVariable Integer id) {
        service.updateById(principal.getName(), dto, id);
    }

    @DeleteMapping("/{id}")
    public void deleteById(Principal principal, @PathVariable Integer id) {
        service.deleteById(principal.getName(), id);
    }
}
