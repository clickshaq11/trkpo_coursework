package com.trkpo.repository;

import com.trkpo.model.dto.projection.PostProjection;
import com.trkpo.model.entity.PostEntity;
import org.springframework.data.domain.Page;
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
    Page<PostProjection> findPostsByUserId(Integer id, Pageable pageable);

    @Query(value = "SELECT p.id AS id, p.title AS title, p.body AS body, s.creator.id AS authorId, s.creator.login AS authorLogin, "
        + "COUNT(l.id) AS likeCounter, p.createdAt AS createdAt "
        + "FROM subscription s "
        + "JOIN post p ON p.user.id = s.creator.id "
        + "LEFT JOIN likeEntity l ON p.id = l.post.id "
        + "WHERE s.subscriber.id = ?1 "
        + "GROUP BY p.id, s.creator.id, s.creator.login")
    Page<PostProjection> findNewsFeedByUserId(Integer id, Pageable pageable);
}
