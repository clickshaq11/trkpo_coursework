DELETE FROM subscription;
DELETE FROM notification;
DELETE FROM like_entity;
DELETE FROM comment;
DELETE FROM post;
DELETE FROM user_entity;

ALTER SEQUENCE subscription_id_seq RESTART WITH 1;
ALTER SEQUENCE notification_id_seq RESTART WITH 1;
ALTER SEQUENCE like_entity_id_seq RESTART WITH 1;
ALTER SEQUENCE comment_id_seq RESTART WITH 1;
ALTER SEQUENCE post_id_seq RESTART WITH 1;
ALTER SEQUENCE user_entity_id_seq RESTART WITH 1;


INSERT INTO user_entity(hashed_password, login, short_info) VALUES
('$2a$10$2mHLKjAiCjX8NeQ0CWA9XOE54UWqquQccHsrWSJAeSNcRHaG1msvK', 'login123', 'shortInfo'),
('$2a$10$2mHLKjAiCjX8NeQ0CWA9XOE54UWqquQccHsrWSJAeSNcRHaG1msvK', 'login2222', 'info'),
('$2a$10$2mHLKjAiCjX8NeQ0CWA9XOE54UWqquQccHsrWSJAeSNcRHaG1msvK', 'logout111', 'logoutInfo'),
('$2a$10$2mHLKjAiCjX8NeQ0CWA9XOE54UWqquQccHsrWSJAeSNcRHaG1msvK', 'anotherUser', 'info');

INSERT INTO post(author_id, title, body, created_at)
VALUES (1, 'title1', 'body1', 123);
