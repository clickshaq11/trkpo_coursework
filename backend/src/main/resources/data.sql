INSERT INTO user_entity("login", "hashed_password", "short_info")
    VALUES ('login123', '$2a$10$MO/dA/SSgyjhoO0wFhcw9enmzWpNmM0iMIp3BRQ0A.Mstebe0VVju', '123')
    ON CONFLICT DO NOTHING;
INSERT INTO user_entity("login", "hashed_password", "short_info")
VALUES ('login456', '$2a$10$MO/dA/SSgyjhoO0wFhcw9enmzWpNmM0iMIp3BRQ0A.Mstebe0VVju', '456')
    ON CONFLICT DO NOTHING;
INSERT INTO user_entity("login", "hashed_password", "short_info")
VALUES ('login789', '$2a$10$MO/dA/SSgyjhoO0wFhcw9enmzWpNmM0iMIp3BRQ0A.Mstebe0VVju', 'Здоровая такая инфо, совсем не шорт')
    ON CONFLICT DO NOTHING;
INSERT INTO user_entity("login", "hashed_password", "short_info")
VALUES ('login000', '$2a$10$MO/dA/SSgyjhoO0wFhcw9enmzWpNmM0iMIp3BRQ0A.Mstebe0VVju', 'Короткая инфа')
    ON CONFLICT DO NOTHING;
INSERT INTO user_entity("login", "hashed_password", "short_info")
VALUES ('blackberry', '$2a$10$MO/dA/SSgyjhoO0wFhcw9enmzWpNmM0iMIp3BRQ0A.Mstebe0VVju', 'Пурум пум pum')
    ON CONFLICT DO NOTHING;

INSERT INTO post("author_id", "title", "body", "created_at")
    VALUES (1, 'West branch', 'Why do i do whole backend alone without any help', 1699646474000)
    ON CONFLICT DO NOTHING;
INSERT INTO post("author_id", "title", "body", "created_at")
    VALUES (1, 'East branch', 'Why do i spend so much energy on the countless uni tasks', 1668099664000)
    ON CONFLICT DO NOTHING;
INSERT INTO post("author_id", "title", "body", "created_at")
VALUES (2, 'Еще пост', 'Помогите', 1668099534000)
    ON CONFLICT DO NOTHING;
INSERT INTO post("author_id", "title", "body", "created_at")
VALUES (3, 'Зачем', 'Просто зачтите, нормальный сайтик, по спеке норм совпадает, хлд красиво аскидоком отрендерена', 1668099534000)
    ON CONFLICT DO NOTHING;
INSERT INTO post("author_id", "title", "body", "created_at")
VALUES (4, 'Почему', 'Не надо читать тексты постов, которые нужны только для инита', 1668099534000)
    ON CONFLICT DO NOTHING;

INSERT INTO like_entity("user_id", "post_id") VALUES (1, 1) ON CONFLICT DO NOTHING;
INSERT INTO like_entity("user_id", "post_id") VALUES (2, 1) ON CONFLICT DO NOTHING;
INSERT INTO like_entity("user_id", "post_id") VALUES (2, 2) ON CONFLICT DO NOTHING;
INSERT INTO like_entity("user_id", "post_id") VALUES (3, 1) ON CONFLICT DO NOTHING;
INSERT INTO like_entity("user_id", "post_id") VALUES (4, 1) ON CONFLICT DO NOTHING;
INSERT INTO like_entity("user_id", "post_id") VALUES (4, 3) ON CONFLICT DO NOTHING;

INSERT INTO comment("user_id", "post_id", "body")
    VALUES (2, 1, 'Спецификация очень красиво рендерится аскидоком, очень адвансед стаф')
    ON CONFLICT DO NOTHING;
INSERT INTO comment("user_id", "post_id", "body")
    VALUES (3, 2, 'Хлд тоже аскидоком отрендерена, даже титульник - поставьте зачет')
    ON CONFLICT DO NOTHING;
INSERT INTO comment("user_id", "post_id", "body")
    VALUES (2, 3, 'Таски онли по фс и хлд, все чисто')
    ON CONFLICT DO NOTHING;
INSERT INTO comment("user_id", "post_id", "body")
    VALUES (2, 1, 'Коммиты онли по фс и хлд, все как по заданию')
    ON CONFLICT DO NOTHING;
INSERT INTO comment("user_id", "post_id", "body")
    VALUES (1, 1, 'Я умираю')
    ON CONFLICT DO NOTHING;
INSERT INTO comment("user_id", "post_id", "body")
VALUES (4, 1, 'Я тегаю @login123 хехехехехехехех и @blackberry!!! и @login456')
    ON CONFLICT DO NOTHING;

INSERT INTO subscription("creator_id", "subscriber_id") VALUES (1, 3) ON CONFLICT DO NOTHING;
INSERT INTO subscription("creator_id", "subscriber_id") VALUES (1, 2) ON CONFLICT DO NOTHING;
INSERT INTO subscription("creator_id", "subscriber_id") VALUES (2, 3) ON CONFLICT DO NOTHING;
INSERT INTO subscription("creator_id", "subscriber_id") VALUES (2, 1) ON CONFLICT DO NOTHING;
INSERT INTO subscription("creator_id", "subscriber_id") VALUES (3, 1) ON CONFLICT DO NOTHING;

INSERT INTO notification("user_id", "post_id", "created_at") VALUES (1, 1, 1700222508000) ON CONFLICT DO NOTHING;
INSERT INTO notification("user_id", "post_id", "created_at") VALUES (5, 1, 1700222504000) ON CONFLICT DO NOTHING;
INSERT INTO notification("user_id", "post_id", "created_at") VALUES (2, 1, 1700222502000) ON CONFLICT DO NOTHING;
