package com.trkpo.model.dto.response;

import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
public class NotificationDto {
    @NotNull
    private Integer id;

    @NotNull
    private Integer postId;
}
