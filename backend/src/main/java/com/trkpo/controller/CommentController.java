package com.trkpo.controller;

import com.trkpo.model.dto.response.CommentDto;
import com.trkpo.service.CommentService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class CommentController {
    private final CommentService service;

    @GetMapping("/post/{id}/comment")
    public List<CommentDto> getByPostId(@PathVariable Integer id, Pageable pageable) {
        return service.getByPostId(id, pageable);
    }
}
