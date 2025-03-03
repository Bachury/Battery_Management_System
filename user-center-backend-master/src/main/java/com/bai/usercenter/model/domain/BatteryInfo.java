package com.bai.usercenter.model.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * 电池信息表
 * @TableName battery_info
 */
@TableName(value ="battery_info")
@Data
// todo:电池信息新添字段description
public class BatteryInfo implements Serializable {
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
     * 电池名称
     */
    private String batteryName;

    /**
     * 电池类型（1-锂离子电池）
     */
    private String batteryType;

    /**
     * 电池数据条数
     */
    private Long dataNum;

    /**
     * SOC分析图片地址
     */
    private String socImgPath;

    /**
     * 电池数据检定状态
     */
    private Integer dataQualityStatus;

    /**
     * 电池数据检定完备性不通过数量
     */
    private Integer unCompleteness;

    /**
     * 电池数据检定一致性不通过数量
     */
    private Integer unConsistency;

    /**
     * 电池数据检定充电模式异常数量
     */
    private Integer abnormalChargingMode;

    /**
     * 电池数据检定空数据数量
     */
    private Integer noneDataNum;

    /**
     * 电池数据检定合格数量比例
     */
    private Double qualifiedRate;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 更新时间
     */
    private Date updateTime;

    /**
     * 是否删除
     */
    private Integer isDelete;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;

}