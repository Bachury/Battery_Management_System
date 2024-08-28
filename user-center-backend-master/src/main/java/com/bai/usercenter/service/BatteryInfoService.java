package com.bai.usercenter.service;

import com.bai.usercenter.common.BaseResponse;
import com.bai.usercenter.model.domain.BatteryInfo;
import com.bai.usercenter.model.domain.User;
import com.bai.usercenter.model.domain.request.BatteryQueryRequest;
import com.bai.usercenter.model.domain.request.UserQueryRequest;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.IService;

/**
* @author Fang Hao
* @description 针对表【battery_info(电池信息表)】的数据库操作Service
* @createDate 2024-08-24 16:34:11
*/
public interface BatteryInfoService extends IService<BatteryInfo> {

    /**
     *
     *
     */
    BatteryInfo SaveBatteryInfo(String batteryName, String batteryType);

    /**
     * 获取查询条件
     *
     * @param batteryQueryRequest
     * @return
     */
    QueryWrapper<BatteryInfo> getQueryWrapper(BatteryQueryRequest batteryQueryRequest);

}
