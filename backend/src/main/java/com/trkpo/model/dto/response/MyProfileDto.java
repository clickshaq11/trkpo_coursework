package com.trkpo.model.dto.response;

import javax.validation.constraints.NotBlank;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MyProfileDto {
    @NotBlank
    private String login;

    @NotBlank
    private String shortInfo;

    private List<SubscriptionDto> subscriptions;
}
