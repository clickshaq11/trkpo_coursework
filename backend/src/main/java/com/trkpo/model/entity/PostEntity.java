package com.trkpo.model.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.util.Set;
import javax.persistence.OneToMany;
import javax.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "post")
public class PostEntity {
    @Id
    @GeneratedValue
    @Column(columnDefinition = "serial")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "authorId", nullable = false)
    private UserEntity user;

    @Size(min = 1, max = 120)
    @Column(nullable = false)
    private String title;

    @Size(min = 1, max = 600)
    @Column(nullable = false)
    private String body;

    @Column(nullable = false)
    private Long createdAt;

    @OneToMany(mappedBy = "post")
    private Set<CommentEntity> comments;

    @OneToMany(mappedBy = "post")
    private Set<NotificationEntity> notifications;

    @OneToMany(mappedBy = "post")
    private Set<LikeEntity> likes;
}
