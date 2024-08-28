package com.bai.usercenter.utils;

import cn.hutool.core.lang.Snowflake;
import cn.hutool.core.util.IdUtil;

public class CodeUtils {

    private static Snowflake snowflake = IdUtil.getSnowflake();

    private CodeUtils() {}

    public static Snowflake getInstance(){
        return snowflake;
    }

}
