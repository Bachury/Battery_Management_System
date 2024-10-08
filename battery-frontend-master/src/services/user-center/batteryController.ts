// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** addBattery POST /api/add */
export async function addBatteryUsingPost(
  body: API.BatteryAddRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseLong_>('/api/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** batteryDataInfoByPage POST /api/battery_data_info/page */
export async function batteryDataInfoByPageUsingPost(
  body: API.BatteryQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageBatteryDataInfo_>('/api/battery_data_info/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** batteryInfoByPage POST /api/batteryinfo/page */
export async function batteryInfoByPageUsingPost(
  body: API.BatteryQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageBatteryInfo_>('/api/batteryinfo/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** deleteBattery POST /api/delete */
export async function deleteBatteryUsingPost(
  body: API.BatteryDeleteRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/api/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** deleteCsv POST /api/deleteCSV */
export async function deleteCsvUsingPost(
  body: API.BatteryDownloadRequest,
  options?: { [key: string]: any },
) {
  return request<any>('/api/deleteCSV', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** downloadCsv POST /api/download */
// export async function downloadCsvUsingPost(
//   body: API.BatteryDownloadRequest,
//   options?: { [key: string]: any },
// ) {
//   return request<API.Resource>('/api/download', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     data: body,
//     ...(options || {}),
//   });
// }
export async function downloadCsvUsingPost(
  body: API.BatteryDownloadRequest,
  options?: { [key: string]: any },
) {
  const response = await request<API.Resource>('/api/download', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
    responseType: 'blob',  // 指定响应类型为 blob
  });

  // 检查响应是否有效
  if (response) {
    const blob = new Blob([response], { type: 'text/csv' });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = body.filePath;  // 指定下载文件的默认名称
    document.body.appendChild(link);
    link.click();
    link.remove();  // 移除临时生成的链接
  } else {
    // 处理错误情况
    console.error('Download failed');
  }
}



/** generateCsv POST /api/generateCSV */
export async function generateCsvUsingPost(
  body: API.BatteryDownloadRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseString_>('/api/generateCSV', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** updateBattery POST /api/update */
export async function updateBatteryUsingPost(
  body: API.BatteryUpdateRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/api/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** uploadCsv POST /api/upload */
export async function uploadCsvUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.uploadCsvUsingPOSTParams,
  body: {},
  file?: File,
  options?: { [key: string]: any },
) {
  const formData = new FormData();

  if (file) {
    formData.append('file', file);
  }

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele];

    if (item !== undefined && item !== null) {
      if (typeof item === 'object' && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach((f) => formData.append(ele, f || ''));
        } else {
          formData.append(ele, JSON.stringify(item));
        }
      } else {
        formData.append(ele, item);
      }
    }
  });

  return request<API.BaseResponseBoolean_>('/api/upload', {
    method: 'POST',
    params: {
      ...params,
    },
    data: formData,
    requestType: 'form',
    ...(options || {}),
  });
}
