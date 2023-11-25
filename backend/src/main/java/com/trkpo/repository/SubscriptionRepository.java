package com.trkpo.repository;

import com.trkpo.model.entity.SubscriptionEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubscriptionRepository extends JpaRepository<SubscriptionEntity, Integer> {
    List<SubscriptionEntity> findBySubscriberId(Integer id);

    Optional<SubscriptionEntity> findByCreatorIdAndSubscriberId(Integer creatorId, Integer subscriberId);
}
