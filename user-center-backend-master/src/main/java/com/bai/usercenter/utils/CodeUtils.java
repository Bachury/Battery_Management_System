package com.bai.usercenter.utils;

import cn.hutool.core.lang.Snowflake;
import cn.hutool.core.util.IdUtil;

public class CodeUtils {

    private static SnowflakeIdGenerator snowflakeIdGenerator = new SnowflakeIdGenerator(1L);

    private CodeUtils() {}

    public static SnowflakeIdGenerator getInstance(){
        return snowflakeIdGenerator;
    }

}
