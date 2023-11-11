package com.trkpo.repository;

import com.trkpo.model.dto.projection.MyPostProjection;
import com.trkpo.model.entity.PostEntity;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PostRepository extends JpaRepository<PostEntity, Integer> {
    @Query(value = "SELECT p.id AS id, p.title AS title, p.body AS body, u.id AS authorId, u.login AS authorLogin, "
        + "COUNT(l.id) AS likeCounter, p.createdAt AS createdAt "
        + "FROM likeEntity l "
        + "RIGHT JOIN l.post p "
        + "JOIN p.user u "
        + "WHERE u.id = ?1 "
        + "GROUP BY p.id, u.id")
    List<MyPostProjection> findPostsByUserId(Integer id, Pageable pageable);
}
