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
@Data
@TableName(value ="battery_data_info")
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
     * 循环次数
     */
    private Integer cycle;

    /**
     * 电压
     */
    private Double voltage;

    /**
     * 电流
     */
    private Double current;

    /**
     * SOC
     */
    private Double soc;

    /**
     * 最小温度
     */
    private Double minTemperature;

    /**
     * 最大温度
     */
    private Double maxTemperature;

    /**
     * 里程数
     */
    private Double mileage;

    /**
     * 电能
     */
    private Double capacity;

    /**
     * 开始采集时间差值
     */
    private Double startTimeDifference;

    /**
     * 相邻采集数据时间差值
     */
    private Double adjacentTimeDifference;

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