package com.bai.usercenter.utils;

public class SnowflakeIdGenerator {
    // 起始时间戳，例如Twitter的Snowflake起始时间(毫秒数)
    private final long twepoch = 1288834974657L;

    // 工作机器ID所占的位数
    private final long workerIdBits = 10L;

    // 支持的最大机器ID，结果是1023 (最大值为2^10 - 1)
    private final long maxWorkerId = 1023;

    // 序列号所占的位数
    private final long sequenceBits = 12L;

    // 机器ID左移位数 (12位)
    private final long workerIdShift = sequenceBits;

    // 时间戳左移位数 (12位序列号 + 10位机器ID = 22位)
    private final long timestampLeftShift = sequenceBits + workerIdBits;

    // 生成序列的掩码，这里为4095 (最大值为2^12 - 1)
    private final long sequenceMask = 4095;

    // 工作机器ID (0~1023)
    private long workerId;

    // 毫秒内序列 (0~4095)
    private long sequence = 0L;

    // 上次生成ID的时间戳
    private long lastTimestamp = -1L;

    /**
     * 构造函数，初始化Snowflake ID生成器
     * @param workerId 工作ID (0~1023)
     */
    public SnowflakeIdGenerator(long workerId) {
        // 确保工作ID在合理范围内
        if (workerId > maxWorkerId || workerId < 0) {
            throw new IllegalArgumentException(String.format("worker Id can't be greater than %d or less than 0", maxWorkerId));
        }
        this.workerId = workerId;
    }

    /**
     * 生成下一个ID (该方法是线程安全的)
     * @return Snowflake ID
     */
    public synchronized long nextId() {
        // 获取当前时间戳 (毫秒)
        long timestamp = timeGen();

        // 如果当前时间戳小于上次生成ID的时间戳，说明系统时钟倒退
        if (timestamp < lastTimestamp) {
            throw new RuntimeException(String.format("Clock moved backwards. Refusing to generate id for %d milliseconds", lastTimestamp - timestamp));
        }

        // 如果是在同一毫秒内生成ID
        if (lastTimestamp == timestamp) {
            // 在序列号内自增 (掩码计算以防溢出)
            sequence = (sequence + 1) & sequenceMask;

            // 如果序列号溢出，等待下一毫秒
            if (sequence == 0) {
                timestamp = tilNextMillis(lastTimestamp);
            }
        } else {
            // 如果是新的毫秒，重置序列号
            sequence = 0L;
        }

        // 更新上次生成ID的时间戳
        lastTimestamp = timestamp;

        // 组合成最终的ID并返回 (时间戳部分 | 工作ID部分 | 序列号部分)
        return ((timestamp - twepoch) << timestampLeftShift) |
                (workerId << workerIdShift) |
                sequence;
    }

    /**
     * 阻塞直到获得下一个毫秒时间戳
     * @param lastTimestamp 上次生成ID的时间戳
     * @return 当前时间戳
     */
    protected long tilNextMillis(long lastTimestamp) {
        long timestamp = timeGen();
        // 循环直到获得当前时间戳大于上次的时间戳
        while (timestamp <= lastTimestamp) {
            timestamp = timeGen();
        }
        return timestamp;
    }

    /**
     * 获取当前时间戳
     * @return 当前时间戳 (毫秒)
     */
    protected long timeGen() {
        return System.currentTimeMillis();
    }

    public static void main(String[] args) {
        SnowflakeIdGenerator idGenerator = new SnowflakeIdGenerator(1);
        System.out.println(idGenerator.nextId());
    }
}
