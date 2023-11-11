package com.trkpo.model.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
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
@Entity(name = "userEntity")
public class UserEntity {
    @Id
    @GeneratedValue
    @Column(columnDefinition = "serial")
    private Integer id;

    @Size(min = 8, max = 50)
    @Column(unique = true, nullable = false)
    private String login;

    @Column(nullable = false)
    private String hashedPassword;

    @Size(min = 1, max = 250)
    @Column(nullable = false)
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
    private Set<SubscriptionEntity> subscribers;

    @OneToMany(mappedBy = "subscriber")
    private Set<SubscriptionEntity> subscriptions;
}
