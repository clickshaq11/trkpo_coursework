package com.trkpo.repository;

import com.trkpo.model.entity.UserEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity, Integer> {
    Optional<UserEntity> findByLogin(String login);
}
