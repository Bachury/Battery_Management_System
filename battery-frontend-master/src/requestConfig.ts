import type { RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';
import {message} from 'antd';
// 与后端约定的响应数据格式
interface ResponseStructure {
  success: boolean;
  data: any;
  errorCode?: number;
  errorMessage?: string;
}

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const requestConfig: RequestConfig = {
  baseURL: 'http://localhost:8101/',
  withCredentials: true,
  // 请求拦截器
  requestInterceptors: [
    (config: RequestOptions) => {
      // 拦截请求配置，进行个性化处理。
      const url = config?.url?.concat('?token = 123');
      return { ...config, url };
    },
  ],
  // 响应拦截器
  responseInterceptors: [
    (response) => {
      // 检查响应的 Content-Type 是否为文件类型
      const contentType = response.headers['content-type'];

      if (contentType && contentType.includes('application/octet-stream')) {
        // 针对文件下载的处理
        return response;
      }

      // 拦截非文件下载的响应数据，进行个性化处理
      const { data } = response as unknown as ResponseStructure;
      console.log('data', data);
      if (data.code == 0) {
        return response;
      } else {
        // 异常情况处理
        message.error(data.message);
        return response;
      }
    },
  ],
};
