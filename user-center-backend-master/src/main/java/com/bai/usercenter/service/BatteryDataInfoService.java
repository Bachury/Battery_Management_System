package com.bai.usercenter.service;

import com.bai.usercenter.model.domain.BatteryDataInfo;
import com.baomidou.mybatisplus.extension.service.IService;

import java.text.ParseException;
import java.util.List;

/**
* @author Fang Hao
* @description 针对表【battery_data_info(电池数据信息表)】的数据库操作Service
* @createDate 2024-08-24 16:34:11
*/
public interface BatteryDataInfoService extends IService<BatteryDataInfo> {
    public List<BatteryDataInfo> queryBatteryData(String cycleRange, String batteryCode);

}
