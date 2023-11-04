package com.trkpo.model.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import java.util.Set;
import javax.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class PostEntity {
    @Id
    @GeneratedValue
    private Integer id;

    @ManyToOne
    private UserEntity user;

    private String title;

    private String body;

    private Long createdAt;

    @OneToMany(mappedBy = "post")
    private Set<CommentEntity> comments;

    @OneToMany(mappedBy = "post")
    private Set<NotificationEntity> notifications;

    @OneToMany(mappedBy = "post")
    private Set<LikeEntity> likes;
}
