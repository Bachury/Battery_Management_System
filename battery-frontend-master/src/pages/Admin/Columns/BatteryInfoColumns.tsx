import {ProColumns, ProFormColumnsType} from '@ant-design/pro-components';

export const BatteryAddModalFormColumns: ProFormColumnsType<API.BatteryInfo, "text">[] = [
  {
    title: 'id',
    dataIndex: 'id',
    valueType: 'index',
    hideInTable: true,
    key: "id"
  },
  {
    title: '电池类型',
    dataIndex: 'batteryType',
    key: "batteryType",
    width: 'lg',
    colProps: {
      span: 24,
    },
  },
  {
    title: '电池名称',
    dataIndex: 'batteryName',
    key: "batteryName",
    width: 'lg',
    colProps: {
      span: 24,
    },
  },

];


export const BatteryUpdateModalFormColumns: ProFormColumnsType<API.BatteryInfo, "text">[] = [
  {
    title: 'id',
    dataIndex: 'id',
    valueType: 'index',
    hideInTable: true,
    key: "id"
  },
  {
    title: '电池类型',
    dataIndex: 'batteryType',
    key: "batteryType",
    width: 'lg',
    colProps: {
      span: 24,
    },
  },
  {
    title: '电池名称',
    dataIndex: 'batteryName',
    key: "batteryName",
    width: 'lg',
    colProps: {
      span: 24,
    },
  },
];


export const BatteryColumns: ProColumns<API.BatteryInfo>[] = [
  {
    title: 'id',
    dataIndex: 'id',
    valueType: 'index',
    hideInTable: true,
    key: 'id',
    width: 48,
  },
  {
    title: '电池编号',
    dataIndex: 'batteryCode',
    copyable: true,
    ellipsis: true,
    key: 'batteryCode',
    width: 200,
  },
  {
    title: '电池名称',
    dataIndex: 'batteryName',
    valueType: 'text',
    copyable: true,
    key: 'batteryName',
    width: 164,
  },
  {
    title: '电池类型',
    dataIndex: 'batteryType',
    filters: true,
    onFilter: true,
    key: 'batteryType',
    width: 100,
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    valueType: 'dateTime',
    key: 'updateTime',
    search: false,
    width: 200,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    valueType: 'dateTime',
    key: 'createTime',
    search: false,
    width: 200,
  },
];

export const BatteryDataColumns: ProColumns<API.BatteryInfo>[] = [
  {
    title: 'id',
    dataIndex: 'id',
    valueType: 'index',
    hideInTable: true,
    key: 'id',
    width: 48,
  },
  {
    title: '电池编号',
    dataIndex: 'batteryCode',
    copyable: true,
    ellipsis: true,
    key: 'batteryCode',
    width: 200,
  },
  {
    title: '电压值',
    dataIndex: 'voltage',
    copyable: true,
    key: 'voltage',
    width: 164,
  },
  {
    title: '电流值',
    dataIndex: 'current',
    filters: true,
    onFilter: true,
    key: 'current',
    width: 100,
  },
  {
    title: '电能值',
    dataIndex: 'capacity',
    key: 'capacity',
    search: false,
    width: 100,
  },
  {
    title: '采集时间',
    dataIndex: 'collectTime',
    valueType: 'dateTime',
    key: 'collectTime',
    search: false,
    width: 200,
  },
];

export default BatteryColumns;