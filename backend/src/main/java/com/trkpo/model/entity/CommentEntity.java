package com.trkpo.model.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class CommentEntity {
    @Id
    @GeneratedValue
    private Integer id;

    @ManyToOne
    private UserEntity user;

    @ManyToOne
    private PostEntity post;

    private String body;
}
