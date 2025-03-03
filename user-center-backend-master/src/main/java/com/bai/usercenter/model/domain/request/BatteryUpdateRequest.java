package com.bai.usercenter.model.domain.request;

import com.bai.usercenter.common.PageRequest;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;

/**
 * 电池信息表
 * @TableName battery_info
 */
@TableName(value ="battery_info")
@Data
public class BatteryUpdateRequest extends PageRequest implements Serializable {

    /**
     * id
     */
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
     * 电池类型
     */
    private String batteryType;

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



    @TableField(exist = false)
    private static final long serialVersionUID = 1L;


}