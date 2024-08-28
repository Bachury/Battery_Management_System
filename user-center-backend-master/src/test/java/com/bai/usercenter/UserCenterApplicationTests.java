package com.bai.usercenter;

import com.bai.usercenter.common.BaseResponse;
import com.bai.usercenter.common.ErrorCode;
import com.bai.usercenter.common.ResultUtils;
import com.bai.usercenter.exception.BusinessException;
import com.bai.usercenter.model.domain.BatteryDataInfo;
import com.bai.usercenter.model.domain.request.BatteryQueryRequest;
import com.bai.usercenter.service.BatteryDataInfoService;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvException;
import org.apache.commons.lang3.StringUtils;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.util.DigestUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;

/**
 * 启动类测试
 *
 */
@SpringBootTest
class UserCenterApplicationTests {


    @Test
    void testDigest() throws NoSuchAlgorithmException {
        String newPassword = DigestUtils.md5DigestAsHex(("abcd" + "mypassword").getBytes());
        System.out.println(newPassword);
    }


    @Test
    void contextLoads() {

    }

}

///**
// * 根据电池编码分页查询电池数据
// *
// */
//@PostMapping("/battery_data_info/page")
//public BaseResponse<Page<BatteryDataInfo>> batteryDataInfoByPage(@RequestBody BatteryQueryRequest batteryQueryRequest) {
//
//    if (batteryQueryRequest == null || StringUtils.isBlank(batteryQueryRequest.getbatteryCode())) {
//        throw new BusinessException(ErrorCode.PARAMS_ERROR);
//    }
//    QueryWrapper<BatteryDataInfo> queryWrapper = new QueryWrapper<>();
//    queryWrapper.eq("batteryCode", batteryQueryRequest.getbatteryCode());
//    Page<BatteryDataInfo> batteryDataInfoPage = batteryDataInfoService.page(new Page<>(batteryQueryRequest.getCurrent(), batteryQueryRequest.getPageSize()),
//            queryWrapper);
//    return ResultUtils.success(batteryDataInfoPage);
//}
//@Resource
//private BatteryDataInfoService batteryDataInfoService;
//
///**
// * 解析上传的数据csv文件
// * @param file
// * @return
// * @throws IOException
// * @throws CsvException
// */
//@PostMapping("/upload")
//public BaseResponse<Boolean> uploadCsv(@RequestParam("file") MultipartFile file, @RequestParam("batteryCode") String batteryCode) throws IOException, CsvException {
//    boolean totalResult = true;
//    // 解析CSV文件
//    try (CSVReader reader = new CSVReader(new InputStreamReader(file.getInputStream()))) {
//        List<String[]> rows = reader.readAll();
//
//        // 第一行是标题，跳过
//        for (int i = 1; i < rows.size(); i++) {
//            String[] row = rows.get(i);
//            // 保存到数据库
//            BatteryDataInfo batteryDataInfo = new BatteryDataInfo();
//            batteryDataInfo.setbatteryCode(batteryCode);
//            batteryDataInfo.setVoltage(Double.valueOf(row[3]));
//            batteryDataInfo.setCurrent(Double.valueOf(row[4]));
//            batteryDataInfo.setCapacity(Double.valueOf(row[5]));
//
//            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
//            LocalDateTime dateTime = LocalDateTime.parse(row[0], formatter);
//            // LocalDateTime 转换为 Date 的字段
//            int year = dateTime.getYear();
//            int month = dateTime.getMonthValue(); // 月份从1开始
//            int day = dateTime.getDayOfMonth();
//            int hour = dateTime.getHour();
//            int minute = dateTime.getMinute();
//            int second = dateTime.getSecond();
//            // 使用Date构造函数创建Date对象
//            Date date = new Date(year - 1900, month - 1, day, hour, minute, second);
//            batteryDataInfo.setcollectTime(date);
//
//            boolean result = batteryDataInfoService.save(batteryDataInfo);
//            totalResult = totalResult&result;
//        }
//    }
//    return ResultUtils.success(totalResult);
//}