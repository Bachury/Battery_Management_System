package com.bai.usercenter.controller;

import cn.hutool.core.lang.Snowflake;
import com.bai.usercenter.common.BaseResponse;
import com.bai.usercenter.common.ErrorCode;
import com.bai.usercenter.common.ResultUtils;
import com.bai.usercenter.exception.BusinessException;
import com.bai.usercenter.model.domain.BatteryDataInfo;
import com.bai.usercenter.model.domain.BatteryInfo;
import com.bai.usercenter.model.domain.request.*;
import com.bai.usercenter.service.BatteryDataInfoService;
import com.bai.usercenter.service.BatteryInfoService;
import com.bai.usercenter.utils.CodeUtils;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvException;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;
import java.util.regex.Pattern;
import java.util.regex.Matcher;
import java.text.SimpleDateFormat;

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
//        String batteryName = batteryUploadRequest.getbatteryName();
//        String batteryType = batteryUploadRequest.getbatteryType();
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
        // todo: 还需要删除battery_data_info里相关的电池数据信息
        QueryWrapper<BatteryInfo> queryWrapperInfo = new QueryWrapper<>();
        queryWrapperInfo.eq("id", batteryDeleteRequest.getId());
        BatteryInfo batteryInfo = batteryInfoService.getOne(queryWrapperInfo);
        String batteryCode = batteryInfo.getBatteryCode();
        QueryWrapper<BatteryDataInfo> queryWrapperDataInfo = new QueryWrapper<>();
        queryWrapperDataInfo.eq("batteryCode", batteryCode);
        batteryDataInfoService.remove(queryWrapperDataInfo);
        boolean b = batteryInfoService.removeById(batteryDeleteRequest.getId());
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

        // 校验文件名称是否符合规范
        String fileName = file.getOriginalFilename();
        // 正则表达式，匹配"index_"后面的数字
        Pattern pattern = Pattern.compile("index_(\\d+)");
        Matcher matcher = pattern.matcher(fileName);
        int cycle = 0;
        if (matcher.find()) {
            // 如果找到匹配项，matcher.group(1)将返回括号内匹配的数字
            String number = matcher.group(1);
            cycle = Integer.valueOf(number);
        } else {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        // 解析CSV文件
        try (CSVReader reader = new CSVReader(new InputStreamReader(file.getInputStream()))) {
            List<String[]> rows = reader.readAll();

            // 第一行是标题，跳过
            for (int i = 1; i < rows.size(); i++) {
                String[] row = rows.get(i);
                // 保存到数据库
                BatteryDataInfo batteryDataInfo = new BatteryDataInfo();
                batteryDataInfo.setBatteryCode(batteryCode);
                batteryDataInfo.setAdjacentTimeDifference(Double.valueOf(row[1]));
                batteryDataInfo.setVoltage(Double.valueOf(row[2]));
                batteryDataInfo.setCurrent(Double.valueOf(row[3]));
                batteryDataInfo.setSoc(Double.valueOf(row[4]));
                batteryDataInfo.setMinTemperature(Double.valueOf(row[5]));
                batteryDataInfo.setMaxTemperature(Double.valueOf(row[6]));
                batteryDataInfo.setMileage(Double.valueOf(row[7]));
                batteryDataInfo.setStartTimeDifference(Double.valueOf(row[8]));

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
                batteryDataInfo.setCycle(cycle);
                boolean result = batteryDataInfoService.save(batteryDataInfo);
                totalResult = totalResult&result;
            }
        }
        // todo:先根据batteryCode在battery_data_info数据表中查询已经存在的数据条数，然后更新battery_info表中相应的数据
        QueryWrapper<BatteryDataInfo> queryWrapperDataInfo = new QueryWrapper<>();
        queryWrapperDataInfo.eq("batteryCode", batteryCode);
        Long count = batteryDataInfoService.count(queryWrapperDataInfo);
        QueryWrapper<BatteryInfo> queryWrapperInfo = new QueryWrapper<>();
        queryWrapperInfo.eq("batteryCode", batteryCode);
        BatteryInfo batteryInfo = batteryInfoService.getOne(queryWrapperInfo);
        batteryInfo.setDataNum(count);
        batteryInfoService.updateById(batteryInfo);
        return ResultUtils.success(totalResult);
    }

    /**
     * 生成csv数据
     */
    @PostMapping("/generateCSV")
    public BaseResponse<String> generateCsv(@RequestBody BatteryDownloadRequest request){
        //按照soc范围
        String socRange = request.getSocRange();
        //按照cycle范围
        String cycleRange = request.getCycleRange();
        //按照时间范围
        String timeRange = request.getTimeRange();
        String batteryCode = request.getBatteryCode();

        try {
            // 根据范围查询数据
            List<BatteryDataInfo> data = batteryDataInfoService.queryBatteryData(cycleRange, batteryCode);

            // 生成一个csv的临时文件，然后存储在某个位置上
            File tempFile = File.createTempFile("battery_data_", ".csv");
            tempFile.deleteOnExit(); // 确保 JVM 退出时删除文件

            // 查询数据库，将数据写入 CSV 文件
            try (OutputStreamWriter writer = new OutputStreamWriter(new FileOutputStream(tempFile), StandardCharsets.UTF_8)) {
                writer.append("Cycle,Voltage,Current,SOC,Min Temperature,Max Temperature,Mileage,Capacity,Start Time Difference,Adjacent Time Difference,Collect Time\n");

                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                for (BatteryDataInfo entry : data) {
                    writer.append(entry.getCycle() != null ? entry.getCycle().toString() : "0").append(",")
                            .append(entry.getVoltage() != null ? entry.getVoltage().toString() : "0").append(",")
                            .append(entry.getCurrent() != null ? entry.getCurrent().toString() : "0").append(",")
                            .append(entry.getSoc() != null ? entry.getSoc().toString() : "0").append(",")
                            .append(entry.getMinTemperature() != null ? entry.getMinTemperature().toString() : "0").append(",")
                            .append(entry.getMaxTemperature() != null ? entry.getMaxTemperature().toString() : "0").append(",")
                            .append(entry.getMileage() != null ? entry.getMileage().toString() : "0").append(",")
                            .append(entry.getCapacity() != null ? entry.getCapacity().toString() : "0").append(",")
                            .append(entry.getStartTimeDifference() != null ? entry.getStartTimeDifference().toString() : "0").append(",")
                            .append(entry.getAdjacentTimeDifference() != null ? entry.getAdjacentTimeDifference().toString() : "0").append(",");

                    if (entry.getCollectTime() != null) {
                        writer.append(dateFormat.format(entry.getCollectTime())).append(",");
                    } else {
                        writer.append("0"); // Write "0" if collectTime is null
                    }
                    writer.append("\n");
                }
            }

            // 生成文件下载的URL
            String fileUrl = tempFile.getName();
            // System.out.println(tempFile.getAbsolutePath());
            // 获取临时文件存储位置，返回给前端
            return ResultUtils.success(fileUrl);
        } catch (Exception e) {
            return ResultUtils.error(ErrorCode.SYSTEM_ERROR);
        }

    }

    /**
     * 下载csv数据
     */
    @PostMapping("/download")
    public ResponseEntity<org.springframework.core.io.Resource> downloadCsv(@RequestBody BatteryDownloadRequest request) {
        String filename = request.getFilePath();
        try {
            // 获取文件路径
            Path filePath = Paths.get(System.getProperty("java.io.tmpdir"), filename);

            // 将文件作为资源返回
            org.springframework.core.io.Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                        .contentType(MediaType.APPLICATION_OCTET_STREAM)
                        .body(resource);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/deleteCSV")
    public BaseResponse<String> deleteCsv(@RequestBody BatteryDownloadRequest request){
        String filename = request.getFilePath();
        try {
            // 获取文件路径
            Path filePath = Paths.get(System.getProperty("java.io.tmpdir"), filename);
            // 删除文件
            Files.deleteIfExists(filePath);
            return ResultUtils.success("文件下载中");
        } catch (Exception e) {
            return ResultUtils.error(ErrorCode.SYSTEM_ERROR);
        }
    }


}
