package com.trkpo.model.dto.projection;

public interface MyPostProjection {
    Integer getId();

    String getTitle();

    String getBody();

    Integer getAuthorId();

    String getAuthorLogin();

    Integer getLikeCounter();

    Long getCreatedAt();
}
