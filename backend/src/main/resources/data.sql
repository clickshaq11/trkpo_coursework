INSERT INTO user_entity("login", "hashed_password", "short_info")
    VALUES ('login123', '$2a$10$MO/dA/SSgyjhoO0wFhcw9enmzWpNmM0iMIp3BRQ0A.Mstebe0VVju', '123')
    ON CONFLICT DO NOTHING;

INSERT INTO post("author_id", "title", "body", "created_at")
    VALUES (1, 'West branch', 'Why do i do whole backend alone without any help', 1699646474000)
    ON CONFLICT DO NOTHING;
INSERT INTO post("author_id", "title", "body", "created_at")
    VALUES (1, 'East branch', 'Why do i spend so much energy on the countless uni tasks', 1668099664000)
    ON CONFLICT DO NOTHING;

INSERT INTO like_entity("user_id", "post_id") VALUES (1, 1) ON CONFLICT DO NOTHING;
