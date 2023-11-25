package com.trkpo.repository;

import com.trkpo.model.entity.UserEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.client.HttpServerErrorException;

public interface UserRepository extends JpaRepository<UserEntity, Integer> {
    default UserEntity findByLoginOrThrow(String login) {
        return findByLogin(login)
            .orElseThrow(() -> new HttpServerErrorException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not find user with login " + login));
    }

    Optional<UserEntity> findByLogin(String login);

    List<UserEntity> findByLoginContaining(String login);
}
