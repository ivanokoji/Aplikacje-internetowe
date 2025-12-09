create table flower
(
    id          integer not null
        constraint flower_pk
            primary key autoincrement,
    name        text not null,
    color       text not null,
    description text not null
);
