package com.trkpo.model.dto.response;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
public class SubscriptionDto {
    @NotNull
    private Integer id;

    @NotBlank
    private String login;
}
