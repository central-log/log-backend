DROP TABLE if exists role_permission;
DROP TABLE if exists user_group;
DROP TABLE if exists role_group;
DROP TABLE if exists role_users;
DROP TABLE if exists groups;
DROP TABLE if exists permissions;
DROP TABLE if exists roles;
DROP TABLE if exists env_users;
DROP TABLE if exists users;

DROP TABLE IF EXISTS domain_env;
DROP TABLE if exists domain;

CREATE TABLE domain(
   id   VARCHAR (40)      NOT NULL ,
   name VARCHAR (40)     NOT NULL UNIQUE,
	description VARCHAR (100)     NOT NULL,
	email VARCHAR (500)     NOT NULL,
  key VARCHAR (40) NOT NULL,
	endDateTime long     NOT NULL,
   starDateTime  long              NOT NULL,
   createdTime long     NOT NULL,
   updatedTime  long NOT NULL,
   enabled bool     NOT NULL,
   PRIMARY KEY (ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE domain_env(
   id   VARCHAR (40)      NOT NULL ,
   name VARCHAR (40)     NOT NULL,
	logLevel VARCHAR (40)     NOT NULL,
	description VARCHAR (100)     NOT NULL,
	email VARCHAR (500)     NOT NULL,
	domainId VARCHAR (40) NOT NULL,
  createdTime long     NOT NULL,
  updatedTime  long  NOT NULL,
   PRIMARY KEY (ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

alter table domain_env
  add constraint domain_env_fk_domainId foreign key (domainId)
  references domain (id) ON DELETE CASCADE;
CREATE UNIQUE INDEX domain_env_unique_index
ON domain_env (name, domainId);

CREATE TABLE users(
  name VARCHAR (60)     NOT NULL,
	email VARCHAR (60)     NOT NULL,
	password VARCHAR (32)     NOT NULL,
  createdTime long     NOT NULL,
  updatedTime  long NOT NULL,
   PRIMARY KEY (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE env_users(
    name VARCHAR (40)     NOT NULL,
   userId VARCHAR (40)     NOT NULL,
	envId	 VARCHAR (40)     NOT NULL,
  createdTime long     NOT NULL,
  updatedTime  long NOT NULL,
  userType VARCHAR (40) NOT NULL,
  status VARCHAR (40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE UNIQUE INDEX env_users_unique_index
ON env_users (userId, envId);

alter table env_users
  add constraint env_users_fk_userId foreign key (userId)
  references users (email) ON DELETE CASCADE;
alter table env_users
  add constraint env_users_fk_envId foreign key (envId)
  references domain_env (id) ON DELETE CASCADE;

CREATE TABLE roles(
   id   VARCHAR (40)      NOT NULL ,
   name VARCHAR (40)     NOT NULL UNIQUE,
	createdTime long     NOT NULL,
	description VARCHAR (100)     NOT NULL,
	enabled bool     NOT NULL,
   updatedTime  long NOT NULL,
   PRIMARY KEY (ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE permissions(
   id   int      NOT NULL AUTO_INCREMENT,
   name VARCHAR (40)     NOT NULL UNIQUE,
   url VARCHAR (200),
   method VARCHAR (10),
	description VARCHAR (50)     NOT NULL,
  type VARCHAR (40) NOT NULL,
   PRIMARY KEY (ID)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE groups(
   id   VARCHAR (40)      NOT NULL ,
   name VARCHAR (40)     NOT NULL UNIQUE,
	createdTime long     NOT NULL,
	description VARCHAR (100)     NOT NULL,
	enabled bool     NOT NULL,
   updatedTime  long NOT NULL,
   PRIMARY KEY (ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE role_users(
   userId VARCHAR (40)     NOT NULL,
	roleId	 VARCHAR (40)     NOT NULL,
  updatedTime  long NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE UNIQUE INDEX role_users_unique_index
ON role_users (userId, roleId);
alter table role_users
  add constraint role_users_fk_userId foreign key (userId)
  references users (email) ON DELETE CASCADE;
alter table role_users
  add constraint role_users_fk_roleId foreign key (roleId)
  references roles (id) ON DELETE CASCADE;

CREATE TABLE role_group(
   groupId VARCHAR (40)     NOT NULL,
	roleId	 VARCHAR (40)     NOT NULL,
  updatedTime  long NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE UNIQUE INDEX role_group_unique_index
ON role_group (groupId, roleId);
alter table role_group
  add constraint role_group_fk_groupId foreign key (groupId)
  references groups (id) ON DELETE CASCADE;
alter table role_group
  add constraint role_group_fk_roleId foreign key (roleId)
  references roles (id) ON DELETE CASCADE;

CREATE TABLE user_group(
   userId VARCHAR (40)     NOT NULL,
   groupId	 VARCHAR (40)     NOT NULL,
   updatedTime  long NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE UNIQUE INDEX user_group_unique_index
ON user_group (userId, groupId);
alter table user_group
  add constraint user_group_fk_groupId foreign key (groupId)
  references groups (id) ON DELETE CASCADE;
alter table user_group
  add constraint user_group_fk_userId foreign key (userId)
  references users (email) ON DELETE CASCADE;

CREATE TABLE role_permission(
   permissionId int     NOT NULL,
	roleId	 VARCHAR (40)    NOT NULL,
  updatedTime  long NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE UNIQUE INDEX role_permission_unique_index
ON role_permission (permissionId, roleId);
alter table role_permission
  add constraint role_permission_fk_permissionId foreign key (permissionId)
  references permissions (id) ON DELETE CASCADE;
alter table role_permission
  add constraint role_permission_roleId foreign key (roleId)
  references roles (id) ON DELETE CASCADE;
