package com.bai.usercenter.controller;

import cn.hutool.core.lang.Snowflake;
import com.bai.usercenter.common.BaseResponse;
import com.bai.usercenter.common.ErrorCode;
import com.bai.usercenter.common.ResultUtils;
import com.bai.usercenter.exception.BusinessException;
import com.bai.usercenter.model.domain.BatteryDataInfo;
import com.bai.usercenter.model.domain.BatteryInfo;
import com.bai.usercenter.model.domain.request.BatteryAddRequest;
import com.bai.usercenter.model.domain.request.BatteryDeleteRequest;
import com.bai.usercenter.model.domain.request.BatteryQueryRequest;
import com.bai.usercenter.model.domain.request.BatteryUpdateRequest;
import com.bai.usercenter.service.BatteryDataInfoService;
import com.bai.usercenter.service.BatteryInfoService;
import com.bai.usercenter.utils.CodeUtils;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvException;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;

@RestController
public class BatteryController {
    @Resource
    private BatteryInfoService batteryInfoService;
    @Resource
    private BatteryDataInfoService batteryDataInfoService;;

//    /**
//     * 上传电池数据
//     *
//     * @param batteryUploadRequest
//     * @return
//     */
//    @PostMapping("/upload")
//    public BaseResponse<BatteryInfo> batteryUpload(@RequestBody BatteryUploadRequest batteryUploadRequest) {
//        // 校验
//        if (batteryUploadRequest == null) {
//            throw new BusinessException(ErrorCode.PARAMS_ERROR);
//        }
//        // todo: 调用Service实现电池总体信息保存，数据上传等功能
//        String batteryName = batteryUploadRequest.getBatteryname();
//        String batteryType = batteryUploadRequest.getBatterytype();
//        BatteryInfo batteryInfoBaseResponse = batteryInfoService.SaveBatteryInfo(batteryName, batteryType);
//
//        // 返回给前端
//        return ResultUtils.success(batteryInfoBaseResponse);
//    }

    /**
     * 更新电池信息
     *
     * @param batteryUpdateRequest
     * @param request
     * @return
     */
    @PostMapping("/update")
    public BaseResponse<Boolean> updateBattery(@RequestBody BatteryUpdateRequest batteryUpdateRequest,
                                            HttpServletRequest request) {
        if (batteryUpdateRequest == null || batteryUpdateRequest.getId() == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        BatteryInfo batteryInfo = new BatteryInfo();
        BeanUtils.copyProperties(batteryUpdateRequest, batteryInfo);
        boolean result = batteryInfoService.updateById(batteryInfo);
        return ResultUtils.success(true);
    }

    /**
     * 根据用户分页查询功能完成对电池信息的分页查询功能
     * @param batteryQueryRequest
     * @param request
     * @return
     */
    @PostMapping("/batteryinfo/page")
    public BaseResponse<Page<BatteryInfo>> batteryInfoByPage(@RequestBody BatteryQueryRequest batteryQueryRequest,
                                                   HttpServletRequest request) {
        long current = batteryQueryRequest.getCurrent();
        long size = batteryQueryRequest.getPageSize();
        Page<BatteryInfo> batteryInfoPage = batteryInfoService.page(new Page<>(current, size),
                batteryInfoService.getQueryWrapper(batteryQueryRequest));
        return ResultUtils.success(batteryInfoPage);
    }

    /**
     * 删除电池信息
     * @param batteryDeleteRequest
     * @param request
     * @return
     */
    @PostMapping("/delete")
    public BaseResponse<Boolean> deleteBattery(@RequestBody BatteryDeleteRequest batteryDeleteRequest, HttpServletRequest request) {
        if (batteryDeleteRequest == null || batteryDeleteRequest.getId() <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        boolean b = batteryInfoService.removeById(batteryDeleteRequest.getId());
        // todo: 还需要删除相关的电池数据信息
        return ResultUtils.success(b);
    }

    /**
     * 创建电池信息
     *
     * @param batteryAddRequest
     * @param request
     * @return
     */
    @PostMapping("/add")
    public BaseResponse<Long> addBattery(@RequestBody BatteryAddRequest batteryAddRequest, HttpServletRequest request) {
        if (batteryAddRequest == null || StringUtils.isBlank(batteryAddRequest.getBatteryName()) || StringUtils.isBlank(batteryAddRequest.getBatteryType())) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        BatteryInfo batteryInfo = new BatteryInfo();
        BeanUtils.copyProperties(batteryAddRequest, batteryInfo);
        Snowflake snowflake = CodeUtils.getInstance();
        long batteryCode = snowflake.nextId();
        batteryInfo.setBatteryCode(String.valueOf(batteryCode));
        boolean result = batteryInfoService.save(batteryInfo);
        return ResultUtils.success(batteryInfo.getId());
    }

    /**
     * 根据电池编码分页查询电池数据
     *
     */
    @PostMapping("/battery_data_info/page")
    public BaseResponse<Page<BatteryDataInfo>> batteryDataInfoByPage(@RequestBody BatteryQueryRequest batteryQueryRequest) {
        if (batteryQueryRequest == null || StringUtils.isBlank(batteryQueryRequest.getBatteryCode())) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        String batteryCode = batteryQueryRequest.getBatteryCode();
        long current = batteryQueryRequest.getCurrent();
        long size = batteryQueryRequest.getPageSize();
        QueryWrapper<BatteryDataInfo> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("batteryCode", batteryCode);
        Page<BatteryDataInfo> batteryDataInfoPage = batteryDataInfoService.page(new Page<>(current, size),
                queryWrapper);
        return ResultUtils.success(batteryDataInfoPage);
    }

    /**
     * 解析上传的数据csv文件
     * @param file
     * @return
     * @throws IOException
     * @throws CsvException
     */
    @PostMapping("/upload")
    public BaseResponse<Boolean> uploadCsv(@RequestParam("file") MultipartFile file, @RequestParam("batteryCode") String batteryCode) throws IOException, CsvException {
        boolean totalResult = true;
        // 解析CSV文件
        try (CSVReader reader = new CSVReader(new InputStreamReader(file.getInputStream()))) {
            List<String[]> rows = reader.readAll();

            // 第一行是标题，跳过
            for (int i = 1; i < rows.size(); i++) {
                String[] row = rows.get(i);
                // 保存到数据库
                BatteryDataInfo batteryDataInfo = new BatteryDataInfo();
                batteryDataInfo.setBatteryCode(batteryCode);
                batteryDataInfo.setVoltage(Double.valueOf(row[3]));
                batteryDataInfo.setCurrent(Double.valueOf(row[4]));
                batteryDataInfo.setCapacity(Double.valueOf(row[5]));

                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
                LocalDateTime dateTime = LocalDateTime.parse(row[0], formatter);
                // LocalDateTime 转换为 Date 的字段
                int year = dateTime.getYear();
                int month = dateTime.getMonthValue(); // 月份从1开始
                int day = dateTime.getDayOfMonth();
                int hour = dateTime.getHour();
                int minute = dateTime.getMinute();
                int second = dateTime.getSecond();
                // 使用Date构造函数创建Date对象
                Date date = new Date(year - 1900, month - 1, day, hour, minute, second);
                batteryDataInfo.setCollectTime(date);

                boolean result = batteryDataInfoService.save(batteryDataInfo);
                totalResult = totalResult&result;
            }
        }
        return ResultUtils.success(totalResult);
    }

}
