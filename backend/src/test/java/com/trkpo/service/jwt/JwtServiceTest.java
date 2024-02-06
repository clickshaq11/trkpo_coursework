package com.trkpo.service.jwt;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(classes = {JwtService.class})
public class JwtServiceTest {
    @Autowired
    private JwtService jwtService;

    @Test
    void createJwt() {
        var actual = jwtService.createJwt("login");

        assertThat(actual).isNotBlank();
    }
    @Test
    void verifyJwtAndGetSubject() {
        var givenToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJsb2dpbiJ9.fQMUTA2egyZl7hMox9CHsxA5tOn87RdkzudPHaY_DXs";

        var actual = jwtService.verifyJwtAndGetSubject(givenToken);

        assertThat(actual).isEqualTo("login");
    }

}
