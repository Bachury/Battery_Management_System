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
public class BatteryQueryRequest extends PageRequest implements Serializable {

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



    @TableField(exist = false)
    private static final long serialVersionUID = 1L;


}