package com.trkpo.config;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.ConstructorBinding;
import org.springframework.stereotype.Component;

@Data
@RequiredArgsConstructor
@Component
@ConstructorBinding
@ConfigurationProperties("db")
public class DbConfigProperties {
    private Boolean generation;
}
