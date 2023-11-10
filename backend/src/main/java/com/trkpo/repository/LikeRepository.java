package com.trkpo.repository;

import com.trkpo.model.entity.LikeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LikeRepository extends JpaRepository<LikeEntity, Integer> {
    Boolean existsByPostId(Integer postId);
}
