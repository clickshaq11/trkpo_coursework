package com.trkpo.model.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
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
public class UserEntity {
    @Id
    @GeneratedValue
    private Integer id;

    @Column(unique = true)
    private String login;

    private String hashedPassword;

    private String shortInfo;

    @OneToMany(mappedBy = "user")
    private Set<PostEntity> posts;

    @OneToMany(mappedBy = "user")
    private Set<CommentEntity> comments;

    @OneToMany(mappedBy = "user")
    private Set<NotificationEntity> notifications;

    @OneToMany(mappedBy = "user")
    private Set<LikeEntity> likes;

    @OneToMany(mappedBy = "creator")
    private Set<SubscribtionEntity> subscribers;

    @OneToMany(mappedBy = "subscriber")
    private Set<SubscribtionEntity> subscriptions;
}
