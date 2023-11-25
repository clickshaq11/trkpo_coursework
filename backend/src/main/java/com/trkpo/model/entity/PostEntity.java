package com.trkpo.model.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Integer id;

    @JsonManagedReference
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
}
