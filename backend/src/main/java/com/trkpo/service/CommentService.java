package com.trkpo.service;

import com.trkpo.model.dto.response.CommentDto;
import com.trkpo.repository.CommentRepository;
import com.trkpo.repository.PostRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;

    public List<CommentDto> getByPostId(Integer id, Pageable pageable) {
        if (!postRepository.existsById(id)) {
            throw new HttpClientErrorException(HttpStatus.NOT_FOUND, "Could not find post with id " + id);
        }
        return commentRepository.findByPostId(id, pageable).stream()
            .map(entity -> CommentDto.builder()
                .id(entity.getId())
                .authorLogin(entity.getUser().getLogin())
                .body(entity.getBody())
                .build()
            ).toList();
    }
}
