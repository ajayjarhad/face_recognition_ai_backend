BEGIN TRANSACTION;

INSERT into users (name,email,entries,joined) values ('admin','admin@email.com',5, '2020-01-01');
INSERT into login (hash,email) values ('$2a$10$t.wcxbuBaBmhce.qscd/zuXWWjFAoe9BEqtU3DZOr1HQgB4Ctevha','admin@email.com');
COMMIT;