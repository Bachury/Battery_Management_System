package com.bai.usercenter.model.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * 电池数据信息表
 * @TableName battery_data_info
 */
@TableName(value ="battery_data_info")
@Data
public class BatteryDataInfo implements Serializable {
    /**
     * id
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 电池编号
     */
    private String batteryCode;

    /**
     * 电压
     */
    private Double voltage;

    /**
     * 电流
     */
    private Double current;

    /**
     * 电能
     */
    private Double capacity;

    /**
     * 采集时间
     */
    private Date collectTime;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 
     */
    private Date updateTime;

    /**
     * 是否删除
     */
    private Integer isDelete;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;

}