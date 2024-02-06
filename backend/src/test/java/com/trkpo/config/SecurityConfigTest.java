package com.trkpo.config;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.Map.Entry;
import org.assertj.core.api.InstanceOfAssertFactories;
import org.junit.jupiter.api.Test;

public class SecurityConfigTest {

    @Test
    void corsConfigurationSource() {
        var actual = new SecurityConfig().corsConfigurationSource();

        assertThat(actual)
            .extracting("corsConfigurations").asInstanceOf(InstanceOfAssertFactories.MAP)
            .hasSize(1)
            .extractingFromEntries(Entry::getValue).singleElement()
            .hasFieldOrPropertyWithValue("allowedOrigins", List.of("*"))
            .hasFieldOrPropertyWithValue("allowedMethods", List.of("*"))
            .hasFieldOrPropertyWithValue("allowedHeaders", List.of("*"));
    }
}
