package com.trkpo.model.dto.response;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OtherProfileDto {
    @NotNull
    private Integer id;

    @NotBlank
    private String login;

    @NotBlank
    private String shortInfo;

    @NotNull
    private Boolean subscribed;
}
