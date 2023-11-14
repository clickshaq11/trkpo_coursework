package com.trkpo.controller;

import com.trkpo.model.dto.request.CreateCommentDto;
import com.trkpo.model.dto.response.CommentDto;
import com.trkpo.service.CommentService;
import java.security.Principal;
import java.util.List;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class CommentController {
    private final CommentService service;

    @GetMapping("/post/{id}/comment")
    public List<CommentDto> getByPostId(@PathVariable Integer id, Pageable pageable) {
        return service.getByPostId(id, pageable);
    }

    @PostMapping("/post/{id}/comment")
    public void createComment(Principal principal, @RequestBody @Valid CreateCommentDto dto, @PathVariable Integer id) {
        service.createComment(principal.getName(), dto, id);
    }
}
