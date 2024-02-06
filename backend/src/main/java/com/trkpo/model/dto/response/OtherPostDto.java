package com.trkpo.model.dto.response;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.List;
import javax.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
public class OtherPostDto {
    @NotNull
    private Integer id;

    @NotBlank
    private String title;

    @NotBlank
    private String body;

    @NotNull
    private Integer authorId;

    @NotBlank
    private String authorLogin;

    @NotNull
    private Integer likeCounter;

    @NotNull
    private Long createdAt;

    @NotNull
    private Boolean hitLike;

    @NotEmpty
    @Size(min = 3, max = 3)
    private List<FirstCommentDto> firstComments;
}
