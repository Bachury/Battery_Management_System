package com.bai.usercenter.service.impl;

import com.bai.usercenter.common.ErrorCode;
import com.bai.usercenter.exception.BusinessException;
import com.bai.usercenter.mapper.BatteryDataInfoMapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.bai.usercenter.model.domain.BatteryDataInfo;
import com.bai.usercenter.service.BatteryDataInfoService;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
* @author Fang Hao
* @description 针对表【battery_data_info(电池数据信息表)】的数据库操作Service实现
* @createDate 2024-08-24 16:34:11
*/
@Service
public class BatteryDataInfoServiceImpl extends ServiceImpl<BatteryDataInfoMapper, BatteryDataInfo>
    implements BatteryDataInfoService{
    private BatteryDataInfoMapper batteryDataInfoMapper;
    @Override
    public List<BatteryDataInfo> queryBatteryData(String cycleRange, String batteryCode){

        // 解析循环次数范围
        String[] cycleParts = cycleRange.split("-");
        Integer cycleStart = Integer.parseInt(cycleParts[0]);
        Integer cycleEnd = Integer.parseInt(cycleParts[1]);
        // 校验cycle范围是否合理
        if(cycleStart>cycleEnd || cycleStart<=0 || cycleEnd<=0){
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        List<Integer> cycles = new ArrayList();
        for(int i=cycleStart;i<=cycleEnd;i++){
            cycles.add(i);
        }
        // 构造查询条件
        QueryWrapper<BatteryDataInfo> queryWrapperDataInfo = new QueryWrapper<>();
        queryWrapperDataInfo.eq("batteryCode", batteryCode);
        queryWrapperDataInfo.in("cycle", cycles);
        List<BatteryDataInfo> batteryDataInfos = this.list(queryWrapperDataInfo);
        return batteryDataInfos;
    }

}




