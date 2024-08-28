import {
  PlusOutlined,
  UploadOutlined,
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
  DownloadOutlined,
  DeleteOutlined,
  ClearOutlined
} from '@ant-design/icons';
import type {ActionType, ProColumns} from '@ant-design/pro-components';
import {ProTable, ProCard} from '@ant-design/pro-components';
import '@umijs/max';
import {Button, Card, message, Popconfirm, List, Spin, Badge, Tag, Image, Tooltip} from 'antd';
import { Modal } from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import ModalForm from "@/pages/Admin/Components/ModalForm";
import axios from 'axios';
import { ProForm, ProFormUploadDragger, ProFormText } from '@ant-design/pro-form';
import {
  BatteryAddModalFormColumns,
  BatteryDataColumns,
  BatteryUpdateModalFormColumns
} from "@/pages/Admin/Columns/BatteryInfoColumns";
import {
  batteryInfoByPageUsingPost,
  deleteBatteryUsingPost,
  updateBatteryUsingPost,
  addBatteryUsingPost,
  uploadCsvUsingPost,
  batteryDataInfoByPageUsingPost
} from "@/services/user-center/batteryController";
import BatteryColumns from "@/pages/Admin/Columns/BatteryInfoColumns";
import Battery from "../../../public/assets/电池.png";


const BatteryList: React.FC = () => {

  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const actionRefBatteryData = useRef<any>();
  const [currentRow, setCurrentRow] = useState<API.UserVO>();
  // 添加一个新的状态来控制预览窗口的显示
  const [previewModalOpen, setPreviewModalOpen] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [currentBatteryCode, setCurrentBatteryCode] = useState<string | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState<boolean>(false);
  const [total, setTotal] = useState<number>();
  const [pageSize] = useState<number>(12);
  const [data, setData] = useState<API.BatteryInfo[]>([]);
  const [showTable, setShowTable] = useState(true);  // 用于切换显示 ProTable 或 Spin 的状态


  useEffect(() => {
    loadData();
  }, []);

  /**
   * @en-US Add node
   * @zh-CN 添加节点
   * @param fields
   */
  const handleAdd = async (fields: API.BatteryAddRequest) => {
    const hide = message.loading('正在添加');
    try {
      const res = await addBatteryUsingPost({
        ...fields,
      });
      if (res.data && res.code === 0) {
        hide();
        message.success('添加成功');
        return true;
      }
    } catch (error: any) {
      hide();
      message.error('添加失败! ' + error.message);
      return false;
    }
  };

  // 当点击预览按钮时，设置新状态为true，并传递当前行的数据
  const handlePreview = async (record: API.BatteryQueryRequest) => {
    setCurrentRow(record);
    // const res = await batteryDataInfoByPageUsingPost({batteryCode: record.batteryCode});
    // if (res.code === 0) {
    //   setPreviewData(res.data.records);  // 提取records数组
    // } else {
    //   // 处理错误情况
    //   console.error('Error:', res.message);
    // }
    setPreviewModalOpen(true);
  };


  /**
   * @en-US Update node
   * @zh-CN 更新节点
   *
   * @param fields
   */
  const handleUpdate = async (fields: API.UserUpdateRequest) => {
    const hide = message.loading('修改中');
    try {
      const res = await updateBatteryUsingPost({id: currentRow?.id, ...fields});
      if (res.data && res.code === 0) {
        hide();
        message.success('修改成功');
        return true;
      }
    } catch (error: any) {
      hide();
      message.error('修改失败' + error.message);
      return false;
    }
  };

  const handleFileChange = (info: any) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      setFile(info.file.originFileObj);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const handleUpload = async () => {
    if (!file || !currentBatteryCode) {
      message.error('Please select a file and battery code');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('batteryCode', currentBatteryCode);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data && response.status === 200) {
        message.success('File and data uploaded successfully');
      }
    } catch (error) {
      message.error('Upload failed');
    }
  };

  const loadData = async (current = 1) => {
    setLoading(true)
    const res = await batteryInfoByPageUsingPost({
      current: current,
      // name: searchText,
      pageSize: pageSize,
      // sortField: 'totalInvokes',
      sortOrder: 'descend',
      // description: searchText,
    });
    if (res.code === 0 && res.data) {
      const fetchedData = res?.data?.records || [];
      setData(fetchedData);
      setTotal(res.data.total)
      setLoading(false)
    } else {
      setLoading(false)
    }
  };

  const BatteryUploadForm: React.FC = () => {
    const handleSubmit = async (values: any) => {
      const formData = new FormData();
      const file = values['drag-pic'][0]?.originFileObj;

      if (file) {
        formData.append('file', file);
        formData.append('batteryCode', currentBatteryCode);

        try {
          // const response = await axios.post('localhost:8101/api/upload', formData, {
          //   headers: {
          //     'Content-Type': 'multipart/form-data',
          //   },
          // });
          const response = await uploadCsvUsingPost({batteryCode: currentBatteryCode}, {file: file});
          if (response.data && response.code === 0) {
            message.success('文件数据上传成功');
          }
        } catch (error) {
          message.error('上传失败');
        }
      } else {
        message.error('提交前请先选择文件');
      }
    };

    return (
      <ProForm onFinish={handleSubmit}>
        <ProFormText
          name="batteryCode"
          label="Battery Code"
          placeholder="Enter Battery Code"
          initialValue={currentBatteryCode}  // 设置初始值
          disabled={true}  // 锁定输入框，禁止编辑
          rules={[{ required: true, message: 'Battery Code is required' }]}
        />

        <ProFormUploadDragger
          name="drag-pic"
          label="Drag and Drop Upload"
          max={1}
          rules={[{ required: true, message: 'Please upload a file' }]}
        />

        <Button type="primary" htmlType="submit">
          Upload
        </Button>
      </ProForm>
    );
  };

  const handleOpenUploadModal = () => {
    setUploadModalOpen(true);
  };

  const handleCloseUploadModal = () => {
    setUploadModalOpen(false);
  };



  /**
   *  Delete node
   * @zh-CN 删除节点
   *
   * @param record
   */
  const handleRemove = async (record: API.BatteryInfo) => {
    const hide = message.loading('正在删除');
    if (!record) return true;
    try {
      const res = await deleteBatteryUsingPost({
        id: record.id,
      });
      hide();
      if (res.data) {
        message.success('删除成功');
        actionRef.current?.reload();
      }
      return true;
    } catch (error: any) {
      hide();
      message.error('删除失败', error.message);
      return false;
    }
  };

  const confirm = async () => {
    await handleRemove(currentRow as API.UserVO);
  };

  const cancel = () => {
    message.success('取消成功');
  };

  const columns: ProColumns<API.BatteryInfo>[] = [
    ...BatteryColumns,
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="update"
          onClick={() => {
            setCurrentRow(record);
            handleUpdateModalOpen(true);
          }}
        >
          修改
        </a>,
        <a
          key="upload"
          onClick={() => {
            setCurrentBatteryCode(record.batteryCode); // 这里假设 batteryCode 是 record 的一个属性
            handleOpenUploadModal();
          }}
        >
          导入数据
        </a>,
        <a
          key="download"
          onClick={() => {
            setCurrentBatteryCode(record.batteryCode)
          }}
        >
          下载数据
        </a>,
        <a
          key="dataprocess"
          onClick={() => {
            setCurrentBatteryCode(record.batteryCode)
          }}
        >
          数据清洗
        </a>,
        <a
          key="preview"
          onClick={() => {
            setCurrentBatteryCode(record.batteryCode);
            // 手动触发表格刷新
            actionRefBatteryData.current?.reload();
            handlePreview(record);
          }}
        >
          预览
        </a>,
        <Popconfirm
          key={'Delete'}
          title="请确认是否删除该电池信息!"
          onConfirm={confirm}
          onCancel={cancel}
          okText="Yes"
          cancelText="No"
        >
          <a
            key="Remove"
            style={{color: "red"}}
            onClick={async () => {
              setCurrentRow(record);
            }}
          >
            删除
          </a>
        </Popconfirm>,
      ],
    },
  ];
  return (
    <div>
      <Button
        onClick={() => setShowTable(!showTable)}  // 切换显示状态
        style={{ marginBottom: 16 }}
      >
        切换{showTable ? '列表' : '表格'}
      </Button>
      <Card>
        {showTable ? (
          <ProTable<API.BatteryInfo>
            headerTitle={'电池信息管理'}
            actionRef={actionRef}
            rowKey="user"
            loading={loading}
            search={{
              labelWidth: 120,
            }}
            toolBarRender={() => [
              <Button
                type="primary"
                key="primary"
                onClick={() => {
                  handleModalOpen(true);
                }}
              >
                <PlusOutlined/> 新建
              </Button>,
            ]}
            pagination={{ defaultPageSize: 10 }}
            request={async (params) => {
              setLoading(true);
              const res = await batteryInfoByPageUsingPost({ ...params });
              setLoading(false);
              if (res.data) {
                return {
                  data: res.data.records || [],
                  success: true,
                  total: res.data.total,
                };
              } else {
                return {
                  data: [],
                  success: false,
                  total: 0,
                };
              }
            }}
            columns={columns}
          />
        ) : (
          <Spin spinning={loading}>
            <List
              pagination={{
                onChange: (page) => {
                  loadData(page);
                },
                pageSize: pageSize,
                total: total,
              }}
              grid={{
                gutter: 20,
                xs: 1,
                sm: 1,
                md: 2,
                lg: 4,
                xl: 5,
                xxl: 6,
              }}
              dataSource={data}
              renderItem={(item, index) => (
                <List.Item>
                  <ProCard key={index} bordered loading={loading} hoverable direction="column" style={{ height: 270 }} actions={[
                    <Tooltip title="导入数据" key="import">
                      <UploadOutlined onClick={() => {
                        setCurrentBatteryCode(item.batteryCode);
                        handleOpenUploadModal();
                      }} />
                    </Tooltip>,
                    <Tooltip title="下载数据" key="download">
                      <DownloadOutlined onClick={() => {
                        setCurrentBatteryCode(item.batteryCode);
                      }} />
                    </Tooltip>,
                    <Tooltip title="删除" key="delete">
                      <DeleteOutlined onClick={async () => {
                        setCurrentRow(item);
                      }} />
                    </Tooltip>,
                    <Tooltip title="修改" key="edit">
                      <EditOutlined onClick={() => {
                        setCurrentRow(item);
                        handleUpdateModalOpen(true);
                      }} />
                    </Tooltip>,
                    <Tooltip title="数据清洗" key="clean">
                      <ClearOutlined onClick={() => {
                        setCurrentBatteryCode(item.batteryCode);
                      }} />
                    </Tooltip>,
                  ]}>
                    <ProCard layout="center" onClick={() => {
                      setCurrentBatteryCode(item.batteryCode);
                      // 手动触发表格刷新
                      actionRefBatteryData.current?.reload();
                      handlePreview(item);
                    }}>
                      <Badge count={1} overflowCount={999999999} color='#eb4d4b'>
                        <Image style={{ width: 80, borderRadius: 8, marginLeft: 10 }}
                               src={Battery}
                               preview={false}
                        />
                      </Badge>
                      <Tag color="blue">{"锂电池"}</Tag>
                    </ProCard>
                    <ProCard onClick={() => {
                      setCurrentBatteryCode(item.batteryCode);
                      // 手动触发表格刷新
                      actionRefBatteryData.current?.reload();
                      handlePreview(item);
                    }} layout="center" style={{ marginTop: -10, fontSize: 16 }}>
                      <span style={{ fontWeight: 'bold', fontSize: 18 }}>{item.batteryName}</span>
                    </ProCard>
                    <ProCard onClick={() => {
                      setCurrentBatteryCode(item.batteryCode);
                      // 手动触发表格刷新
                      actionRefBatteryData.current?.reload();
                      handlePreview(item);
                    }} layout="center" style={{ marginTop: -18, fontSize: 14, textAlign: 'center' }}>
                    <span style={{ fontSize: 14, textOverflow: 'ellipsis', overflow: 'hidden', width: '100%', whiteSpace: 'nowrap' }}>
                      {!item.batteryCode ? "暂无电池编号" : item.batteryCode.length > 32 ? item.batteryCode.slice(0, 32) + '...' : item.batteryCode}
                    </span>
                    </ProCard>
                  </ProCard>
                </List.Item>
              )}
            />
          </Spin>
        )}

        <ModalForm
          title={"添加电池信息"}
          value={{}}
          open={() => {
            return createModalOpen;
          }}
          onOpenChange={handleModalOpen}
          onSubmit={async (value) => {
            const success = await handleAdd(value as API.BatteryInfo);
            if (success) {
              handleModalOpen(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => handleModalOpen(false)}
          columns={BatteryAddModalFormColumns} width={"480px"}
          size={"large"}
        />
        <ModalForm
          title={"修改电池信息"}
          open={() => {
            return updateModalOpen;
          }}
          value={currentRow}
          onOpenChange={handleUpdateModalOpen}
          onSubmit={async (value) => {
            const success = await handleUpdate(value as API.UserVO);
            if (success) {
              handleUpdateModalOpen(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => handleUpdateModalOpen(false)}
          columns={BatteryUpdateModalFormColumns} width={"480px"}
          size={"large"}
        />
        {/* 预览窗口 */}
        <Modal
          title="预览数据"
          visible={previewModalOpen}
          onCancel={() => setPreviewModalOpen(false)}
          footer={null}
          width={1200}
        >
          <ProTable<API.BatteryDataInfo>
            columns={BatteryDataColumns.map(column => ({
              ...column,
              render: (text, record, index) => (
                <td style={{ height: '15px', lineHeight: '15px' }}>
                  {text}
                </td>
              ),
            }))}
            // dataSource={previewData ? [previewData] : []}
            rowKey="id"
            pagination={{defaultPageSize: 10}}
            search={false}
            actionRef={actionRefBatteryData}  // 绑定actionRef
            request={async (params) => {
              if (!currentBatteryCode) {
                return { data: [], success: false };  // 初始时不加载数据
              }
              const response = await batteryDataInfoByPageUsingPost({
                batteryCode: currentBatteryCode,
                pageSize: params.pageSize,
                current: params.current,
              });
              return {
                data: response.data.records,
                success: response.code === 0,
                total: response.data.total,
              };
            }}
          />
        </Modal>
      </Card>

      <Modal
        title="Upload Battery Data"
        visible={uploadModalOpen}
        onCancel={handleCloseUploadModal}
        footer={null}
      >
        <BatteryUploadForm />
      </Modal>
    </div>

  );
};
export default BatteryList;
