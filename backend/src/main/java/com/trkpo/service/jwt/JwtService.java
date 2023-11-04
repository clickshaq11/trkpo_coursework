package com.trkpo.service.jwt;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class JwtService {
    private static final String JWT_SECRET_KEY = "secret_key_123";
    private final Algorithm algorithm = Algorithm.HMAC256(JWT_SECRET_KEY.getBytes());

    public String createJwt(String login) {
        log.info("Creating jwt for subject {}", login);
        return JWT.create()
            .withSubject(login)
            .sign(algorithm);
    }

    public String verifyJwtAndGetSubject(String token) {
        var verifier = JWT.require(algorithm).build();
        var decodedJwt = verifier.verify(token);
        var subject = decodedJwt.getSubject();
        log.info("Decoded jwt with subject {}", subject);
        return subject;
    }
}
