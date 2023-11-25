package com.trkpo.model.dto.request;

import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateMeDto {
    @Size(min = 1, max = 250)
    private String shortInfo;

    @Size(min = 8, max = 50)
    @Pattern(regexp = "^[A-Za-z0-9]+$")
    private String password;
}
