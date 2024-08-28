# 数据库初始化
-- 创建库
create database if not exists battery;

-- 切换库
use battery;

# 用户表
create table user
(
    id           bigint auto_increment comment 'id' primary key,
    userName     varchar(256)                       null comment '用户昵称',
    userAccount  varchar(256)                       null comment '账号',
    avatarUrl    varchar(1024)    default 'https://battery-1301005258.cos.ap-beijing.myqcloud.com/user/用户默认头像.png'       null comment '用户头像',
    gender       tinyint                            null comment '性别',
    userPassword varchar(512)                       not null comment '密码',
    phone        varchar(128)                       null comment '电话',
    email        varchar(512)                       null comment '邮箱',
    createTime   datetime default CURRENT_TIMESTAMP null comment '创建时间',
    updateTime   datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    isDelete     tinyint  default 0                 not null comment '是否删除',
    userRole     varchar(256) default 'user'            not null comment '用户角色：user/admin/ban')
    comment '用户';

# 导入示例用户
INSERT INTO battery.user (username, userAccount, avatarUrl, gender, userPassword, phone, email, createTime, updateTime, isDelete, userRole) VALUES ('baibai', 'baibai', 'https://battery-1301005258.cos.ap-beijing.myqcloud.com/user/用户默认头像.png', null, '74e8338cf7389e7508eb85031afc345c', null, null, '2024-08-06 14:14:22', '2024-08-06 14:39:37', 0, 'admin');


# 电池数据信息表
create table battery_data_info
(
    id           bigint auto_increment comment 'id' primary key,
    batteryCode  varchar(256)                       not null  comment '电池编号',
    voltage      float8                             null comment '电压',
    current      float8                             null comment '电流',
    capacity     float8                             null comment '电能',
    collectTime  datetime                           not null comment '采集时间',
    createTime   datetime default CURRENT_TIMESTAMP null comment '创建时间',
    updateTime   datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    isDelete     tinyint  default 0                 not null comment '是否删除')
    comment '电池数据信息表';

create table battery_info
(
    id           bigint auto_increment comment 'id' primary key,
    batteryCode  varchar(256)                       not null  comment '电池编号',
    batteryName  varchar(256)                       null  comment '电池名称',
    batteryType  varchar(256)                       null  comment '电池类型（1-锂离子电池）',
    dataNum      bigint   default 0                 not null  comment '电池数据条数',
    createTime   datetime default CURRENT_TIMESTAMP null comment '创建时间',
    updateTime   datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    isDelete     tinyint  default 0                 not null comment '是否删除')
    comment '电池信息表';