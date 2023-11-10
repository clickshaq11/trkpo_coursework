package com.trkpo.repository;

import com.trkpo.model.entity.SubscribtionEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubscriptionRepository extends JpaRepository<SubscribtionEntity, Integer> {
    List<SubscribtionEntity> findBySubscriberId(Integer id);
}
