package com.trkpo.model.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "subscription")
@Table(uniqueConstraints = {
    @UniqueConstraint(
        name = "uniqueCreatorAndSubscriber",
        columnNames = {"creatorId", "subscriberId"}
    )
})
public class SubscribtionEntity {
    @Id
    @GeneratedValue
    @Column(columnDefinition = "serial")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "creatorId", nullable = false)
    private UserEntity creator;

    @ManyToOne
    @JoinColumn(name = "subscriberId", nullable = false)
    private UserEntity subscriber;
}
