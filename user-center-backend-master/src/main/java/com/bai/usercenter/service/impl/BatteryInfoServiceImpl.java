package com.bai.usercenter.service.impl;

import cn.hutool.core.lang.Snowflake;
import com.bai.usercenter.common.ErrorCode;
import com.bai.usercenter.exception.BusinessException;
import com.bai.usercenter.mapper.BatteryInfoMapper;
import com.bai.usercenter.model.domain.request.BatteryQueryRequest;
import com.bai.usercenter.utils.CodeUtils;
import com.bai.usercenter.utils.SnowflakeIdGenerator;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.bai.usercenter.model.domain.BatteryInfo;
import com.bai.usercenter.service.BatteryInfoService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

/**
* @author Fang Hao
* @description 针对表【battery_info(电池信息表)】的数据库操作Service实现
* @createDate 2024-08-24 16:34:11
*/
@Service
public class BatteryInfoServiceImpl extends ServiceImpl<BatteryInfoMapper, BatteryInfo>
    implements BatteryInfoService{

    @Override
    public BatteryInfo SaveBatteryInfo(String batteryName, String batteryType) {
        BatteryInfo batteryInfo = new BatteryInfo();
        batteryInfo.setBatteryName(batteryName);
        batteryInfo.setBatteryType(batteryType);
        // 创建雪花算法对象，默认机器id提供者使用自动获取IP地址
        // 成单例模式
        SnowflakeIdGenerator snowflake = CodeUtils.getInstance();
        // 获取下一个ID
        long batteryCode = snowflake.nextId();
        batteryInfo.setBatteryCode(String.valueOf(batteryCode));
        // todo:保存电池信息
        return batteryInfo;
    }

    @Override
    public QueryWrapper<BatteryInfo> getQueryWrapper(BatteryQueryRequest batteryQueryRequest) {
        if (batteryQueryRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "请求参数为空");
        }
        Long id = batteryQueryRequest.getId();
        String batteryCode = batteryQueryRequest.getBatteryCode();
        String batteryName = batteryQueryRequest.getBatteryName();
        String batteryType = batteryQueryRequest.getBatteryType();

        QueryWrapper<BatteryInfo> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq(id != null, "id", id);
        queryWrapper.eq(StringUtils.isNotBlank(batteryCode), "batteryCode", batteryCode);
        queryWrapper.eq(StringUtils.isNotBlank(batteryType), "batteryType", batteryType);
        queryWrapper.like(StringUtils.isNotBlank(batteryName), "batteryName", batteryName);
        return queryWrapper;
    }
}




