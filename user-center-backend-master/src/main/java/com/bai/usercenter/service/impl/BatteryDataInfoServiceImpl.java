package com.bai.usercenter.service.impl;

import com.bai.usercenter.common.ErrorCode;
import com.bai.usercenter.exception.BusinessException;
import com.bai.usercenter.model.domain.BatteryInfo;
import com.bai.usercenter.model.domain.request.BatteryQueryRequest;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.bai.usercenter.model.domain.BatteryDataInfo;
import com.bai.usercenter.service.BatteryDataInfoService;
import com.bai.usercenter.mapper.BatteryDataInfoMapper;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

/**
* @author Fang Hao
* @description 针对表【battery_data_info(电池数据信息表)】的数据库操作Service实现
* @createDate 2024-08-24 16:34:11
*/
@Service
public class BatteryDataInfoServiceImpl extends ServiceImpl<BatteryDataInfoMapper, BatteryDataInfo>
    implements BatteryDataInfoService{

}




