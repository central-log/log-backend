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
   id   VARCHAR(36)      NOT NULL,
   name VARCHAR (40)     NOT NULL UNIQUE,
	createdTime long     NOT NULL,
	description VARCHAR (100)     NOT NULL,
	email VARCHAR (500)     NOT NULL,
	enabled bool     NOT NULL,
	endDateTime long     NOT NULL,
   starDateTime  long              NOT NULL,
   updatedTime  long NOT NULL,
   PRIMARY KEY (ID)
);


CREATE TABLE domain_env(
   id   VARCHAR(36)      NOT NULL,
   name VARCHAR (40)     NOT NULL,
	logLevel VARCHAR (40)     NOT NULL,
	description VARCHAR (100)     NOT NULL,
	email VARCHAR (500)     NOT NULL,
	domainId VARCHAR(36) NOT NULL,
   PRIMARY KEY (ID)
);
alter table domain_env
  add constraint domain_env_fk_domainId foreign key (domainId)
  references domain (id);
CREATE UNIQUE INDEX domain_env_unique_index
ON domain_env (name, domainId);

CREATE TABLE users(
   id   VARCHAR(36)      NOT NULL,
   name VARCHAR (40)     NOT NULL,
	email VARCHAR (60)     NOT NULL UNIQUE,
	password VARCHAR (32)     NOT NULL,
   PRIMARY KEY (ID)
);

CREATE TABLE env_users(
   userId VARCHAR (36)     NOT NULL,
	envId	VARCHAR (36)     NOT NULL
);
CREATE UNIQUE INDEX env_users_unique_index
ON env_users (userId, envId);

alter table env_users
  add constraint env_users_fk_userId foreign key (userId)
  references users (id);
alter table env_users
  add constraint env_users_fk_envId foreign key (envId)
  references domain_env (id);

CREATE TABLE roles(
   id   VARCHAR(36)      NOT NULL,
   name VARCHAR (40)     NOT NULL UNIQUE,
	createdTime long     NOT NULL,
	description VARCHAR (100)     NOT NULL,
	enabled bool     NOT NULL,
   updatedTime  long NOT NULL,
   PRIMARY KEY (ID)
);


CREATE TABLE permissions(
   id   VARCHAR(36)      NOT NULL,
   name VARCHAR (40)     NOT NULL UNIQUE,
	url VARCHAR (500)    NOT NULL,
	method VARCHAR (20)     NOT NULL,
   PRIMARY KEY (ID)
);
CREATE UNIQUE INDEX permissions_unique
ON permissions (name, url, method);

CREATE TABLE groups(
   id   VARCHAR(36)      NOT NULL,
   name VARCHAR (40)     NOT NULL UNIQUE,
	createdTime long     NOT NULL,
	description VARCHAR (100)     NOT NULL,
	enabled bool     NOT NULL,
   updatedTime  long NOT NULL,
   PRIMARY KEY (ID)
);

CREATE TABLE role_users(
   userId VARCHAR (36)     NOT NULL,
	roleId	VARCHAR (36)     NOT NULL
);
CREATE UNIQUE INDEX role_users_unique_index
ON role_users (userId, roleId);
alter table role_users
  add constraint role_users_fk_userId foreign key (userId)
  references users (id);
alter table role_users
  add constraint role_users_fk_roleId foreign key (roleId)
  references roles (id);

CREATE TABLE role_group(
   groupId VARCHAR (36)     NOT NULL,
	roleId	VARCHAR (36)     NOT NULL
);
CREATE UNIQUE INDEX role_group_unique_index
ON role_group (groupId, roleId);
alter table role_group
  add constraint role_group_fk_groupId foreign key (groupId)
  references groups (id);
alter table role_group
  add constraint role_group_fk_roleId foreign key (roleId)
  references roles (id);

CREATE TABLE user_group(
   userId VARCHAR (36)     NOT NULL,
	groupId	VARCHAR (36)     NOT NULL
);
CREATE UNIQUE INDEX user_group_unique_index
ON user_group (userId, groupId);
alter table user_group
  add constraint user_group_fk_groupId foreign key (groupId)
  references groups (id);
alter table user_group
  add constraint user_group_fk_userId foreign key (userId)
  references users (id);

CREATE TABLE role_permission(
   permissionId VARCHAR (36)     NOT NULL,
	roleId	VARCHAR (36)     NOT NULL
);
CREATE UNIQUE INDEX role_permission_unique_index
ON role_permission (permissionId, roleId);
alter table role_permission
  add constraint role_permission_fk_permissionId foreign key (permissionId)
  references permissions (id);
alter table role_permission
  add constraint role_permission_roleId foreign key (roleId)
  references roles (id);









----------------------------------------------
-- Export file for user LOGGER              --
-- Created by chenkan on 6/4/2012, 18:04:41 --
----------------------------------------------

spool Logger.log

prompt
prompt Creating table APPLICATION
prompt ==========================
prompt
create table APPLICATION
(
  APP_ID   NUMBER not null,
  APP_NAME VARCHAR2(255) not null
)
tablespace SBS_TB
  pctfree 10
  initrans 1
  maxtrans 255
  storage
  (
    initial 64K
    minextents 1
    maxextents unlimited
  );
alter table APPLICATION
  add constraint APP_PK primary key (APP_ID)
  using index 
  tablespace USERS
  pctfree 10
  initrans 2
  maxtrans 255;

prompt
prompt Creating table ENVIRONMENT
prompt ==========================
prompt
create table ENVIRONMENT
(
  ENV_ID   NUMBER not null,
  ENV_NAME VARCHAR2(255) not null
)
tablespace SBS_TB
  pctfree 10
  initrans 1
  maxtrans 255
  storage
  (
    initial 64K
    minextents 1
    maxextents unlimited
  );
alter table ENVIRONMENT
  add constraint ENV_PK primary key (ENV_ID)
  using index 
  tablespace USERS
  pctfree 10
  initrans 2
  maxtrans 255;

prompt
prompt Creating table HOST
prompt ===================
prompt
create table HOST
(
  HOST_ID NUMBER not null,
  IP      VARCHAR2(40) not null
)
tablespace SBS_TB
  pctfree 10
  initrans 1
  maxtrans 255
  storage
  (
    initial 64K
    minextents 1
    maxextents unlimited
  );
alter table HOST
  add constraint HOST_PK primary key (HOST_ID)
  using index 
  tablespace USERS
  pctfree 10
  initrans 2
  maxtrans 255;

prompt
prompt Creating table APP_INSTANCE
prompt ===========================
prompt
create table APP_INSTANCE
(
  INSTANCE_ID NUMBER not null,
  APP_ID      NUMBER not null,
  HOST_ID     NUMBER not null,
  EVN_ID      NUMBER not null
)
tablespace SBS_TB
  pctfree 10
  initrans 1
  maxtrans 255
  storage
  (
    initial 64K
    minextents 1
    maxextents unlimited
  );
alter table APP_INSTANCE
  add constraint INSTANCE_PK primary key (INSTANCE_ID)
  using index 
  tablespace USERS
  pctfree 10
  initrans 2
  maxtrans 255;
alter table APP_INSTANCE
  add constraint INSTANCE_APP_FK foreign key (APP_ID)
  references APPLICATION (APP_ID);
alter table APP_INSTANCE
  add constraint INSTANCE_ENV_FK foreign key (EVN_ID)
  references ENVIRONMENT (ENV_ID);
alter table APP_INSTANCE
  add constraint INSTANCE_HOST_FK foreign key (HOST_ID)
  references HOST (HOST_ID);

prompt
prompt Creating table RUNTIME_INSTANCE
prompt ===============================
prompt
create table RUNTIME_INSTANCE
(
  RUN_ID      NUMBER not null,
  INSTANCE_ID NUMBER not null,
  START_TIME  DATE not null
)
tablespace SBS_TB
  pctfree 10
  initrans 1
  maxtrans 255
  storage
  (
    initial 64K
    minextents 1
    maxextents unlimited
  );
alter table RUNTIME_INSTANCE
  add constraint RUNTIME_PK primary key (RUN_ID)
  using index 
  tablespace USERS
  pctfree 10
  initrans 2
  maxtrans 255;
alter table RUNTIME_INSTANCE
  add constraint RUN_INSTANCE_FK foreign key (INSTANCE_ID)
  references APP_INSTANCE (INSTANCE_ID);

prompt
prompt Creating table EVENT
prompt ====================
prompt
create table EVENT
(
  EVENT_ID    NUMBER not null,
  CREATE_DATE DATE,
  SEVERITY    VARCHAR2(255),
  MESSAGE     VARCHAR2(500),
  RUN_ID      NUMBER
)
tablespace SBS_TB
  pctfree 10
  initrans 1
  maxtrans 255
  storage
  (
    initial 64K
    minextents 1
    maxextents unlimited
  );
alter table EVENT
  add constraint EVENT_PK primary key (EVENT_ID)
  using index 
  tablespace USERS
  pctfree 10
  initrans 2
  maxtrans 255
  storage
  (
    initial 64K
    next 1M
    minextents 1
    maxextents unlimited
  );
alter table EVENT
  add constraint EVENT_RUNTIME_INSTANCE_FK1 foreign key (RUN_ID)
  references RUNTIME_INSTANCE (RUN_ID);

prompt
prompt Creating sequence SEQ_APP_ID
prompt ============================
prompt
create sequence SEQ_APP_ID
minvalue 1
maxvalue 9999999999999999999999999999
start with 1
increment by 1
cache 20;

prompt
prompt Creating sequence SEQ_ENV_ID
prompt ============================
prompt
create sequence SEQ_ENV_ID
minvalue 1
maxvalue 9999999999999999999999999999
start with 1
increment by 1
cache 20;

prompt
prompt Creating sequence SEQ_EVENT_ID
prompt ==============================
prompt
create sequence SEQ_EVENT_ID
minvalue 1
maxvalue 9999999999999999999999999999
start with 1
increment by 1
cache 20;

prompt
prompt Creating sequence SEQ_HOST_ID
prompt =============================
prompt
create sequence SEQ_HOST_ID
minvalue 1
maxvalue 9999999999999999999999999999
start with 1
increment by 1
cache 20;

prompt
prompt Creating sequence SEQ_INSTANCE_ID
prompt =================================
prompt
create sequence SEQ_INSTANCE_ID
minvalue 1
maxvalue 9999999999999999999999999999
start with 1
increment by 1
cache 20;

prompt
prompt Creating sequence SEQ_RUN_ID
prompt ============================
prompt
create sequence SEQ_RUN_ID
minvalue 1
maxvalue 9999999999999999999999999999
start with 1
increment by 1
cache 20;

prompt
prompt Creating trigger TRG_INS_APP
prompt ============================
prompt
create or replace trigger TRG_INS_APP
  before insert on application  
  for each row
declare
  -- local variables here
begin
  SELECT SEQ_APP_ID.NEXTVAL INTO :NEW.APP_ID
  FROM DUAL;
end TRG_INS_APP;
/

prompt
prompt Creating trigger TRG_INS_ENV
prompt ============================
prompt
create or replace trigger TRG_INS_ENV
  before insert on environment  
  for each row
declare
  -- local variables here
begin
  SELECT SEQ_ENV_ID.NEXTVAL INTO :NEW.ENV_ID
  FROM DUAL;
end TRG_INS_APP;
/

prompt
prompt Creating trigger TRG_INS_EVENT
prompt ==============================
prompt
create or replace trigger TRG_INS_EVENT
  before insert on event  
  for each row
declare
  -- local variables here
begin
  SELECT SEQ_EVENT_ID.NEXTVAL INTO :NEW.EVENT_ID
  FROM DUAL;
end TRG_INS_APP;
/

prompt
prompt Creating trigger TRG_INS_HOST
prompt =============================
prompt
create or replace trigger TRG_INS_HOST
  before insert on host  
  for each row
declare
  -- local variables here
begin
  SELECT SEQ_HOST_ID.NEXTVAL INTO :NEW.HOST_ID
  FROM DUAL;
end TRG_INS_APP;
/

prompt
prompt Creating trigger TRG_INS_INSTANCE
prompt =================================
prompt
create or replace trigger TRG_INS_INSTANCE
  before insert on app_instance  
  for each row
declare
  -- local variables here
begin
  SELECT SEQ_INSTANCE_ID.NEXTVAL INTO :NEW.INSTANCE_ID
  FROM DUAL;
end TRG_INS_APP;
/

prompt
prompt Creating trigger TRG_INS_RUNTIME
prompt ================================
prompt
create or replace trigger TRG_INS_RUNTIME
  before insert on RUNTIME_INSTANCE  
  for each row
declare
  -- local variables here
begin
  SELECT SEQ_RUN_ID.NEXTVAL INTO :NEW.RUN_ID
  FROM DUAL;
end TRG_INS_APP;
/


spool off