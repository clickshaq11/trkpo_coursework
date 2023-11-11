package com.trkpo.model.dto.request;

import javax.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePostDto {
    @Size(min = 1, max = 120)
    private String title;

    @Size(min = 1, max = 600)
    private String body;
}
