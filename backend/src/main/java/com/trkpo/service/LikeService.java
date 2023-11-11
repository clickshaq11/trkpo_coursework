package com.trkpo.service;

import com.trkpo.model.dto.response.LikeDto;
import com.trkpo.model.entity.LikeEntity;
import com.trkpo.repository.LikeRepository;
import com.trkpo.repository.PostRepository;
import com.trkpo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

@Slf4j
@Service
@RequiredArgsConstructor
public class LikeService {
    private final LikeRepository likeRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public LikeDto like(String login, Integer postId) {
        if (!postRepository.existsById(postId)) {
            throw new HttpClientErrorException(HttpStatus.NOT_FOUND, "Post with id " + postId + " could not be found");
        }
        var user = userRepository.findByLoginOrThrow(login);
        var likeOptional = likeRepository.findByUserIdAndPostId(user.getId(), postId);
        if (likeOptional.isPresent()) {
            likeRepository.deleteById(likeOptional.get().getId());
            return new LikeDto(false);
        }
        likeRepository.save(LikeEntity.builder()
            .user(user)
            .post(postRepository.getReferenceById(postId))
            .build()
        );
        return new LikeDto(true);
    }
}
