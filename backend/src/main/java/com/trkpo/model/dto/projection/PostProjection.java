package com.trkpo.model.dto.projection;

public interface PostProjection {
    Integer getId();

    String getTitle();

    String getBody();

    Integer getAuthorId();

    String getAuthorLogin();

    Integer getLikeCounter();

    Long getCreatedAt();
}
