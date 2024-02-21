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
public class PostDto {
    @NotBlank
    private String title;

    @NotBlank
    private String body;

    @NotNull
    private Long createdAt;

    @NotNull
    private Integer authorId;

    @NotBlank
    private String authorLogin;

    @NotNull
    private Integer likeCounter;

    @NotNull
    private Boolean hitLike;

    @NotNull
    private Boolean isAuthor;
}
