package com.bai.usercenter.model.domain.request;

import lombok.Data;

@Data
public class BatteryDownloadRequest {

    private String batteryCode;  // 电池编码

    private String socRange;  // SOC范围

    private String cycleRange;  // 循环次数范围

    private String timeRange;  // 时间范围

    private String filePath;  // CSV文件保存的路径

}
