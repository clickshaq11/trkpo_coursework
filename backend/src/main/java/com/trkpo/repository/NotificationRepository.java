package com.trkpo.repository;

import com.trkpo.model.entity.NotificationEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface NotificationRepository extends JpaRepository<NotificationEntity, Integer> {
    List<NotificationEntity> findByUserId(Integer id);

    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("DELETE notification n WHERE n.createdAt + 2592000000 <= ?1")
    void deleteAllOlderThan30Days(Long utcNow);
}
