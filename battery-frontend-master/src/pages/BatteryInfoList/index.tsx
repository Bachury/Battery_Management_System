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
import {ProTable, ProCard, StatisticCard, ProFormDigitRange} from '@ant-design/pro-components';
import '@umijs/max';
import RcResizeObserver from 'rc-resize-observer';
import {Button, Card, message, Popconfirm, List, Spin, Badge, Tag, Image, Tooltip, Input, Progress } from 'antd';
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
  queryBatteryUsingPost,
  addBatteryUsingPost,
  uploadCsvUsingPost,
  batteryDataInfoByPageUsingPost,
  downloadCsvUsingPost,
  deleteCsvUsingPost,
  generateCsvUsingPost,
  generateCsvByCycleUsingPost
} from "@/services/user-center/batteryController";
import BatteryColumns from "@/pages/Admin/Columns/BatteryInfoColumns";
import Battery from "../../../public/assets/电池.png";
import DataNum from "../../../public/assets/数据总量.png";
import BatteryNum from "../../../public/assets/电池接入数量.png";
import VisitNum from "../../../public/assets/访问量.png";
const { Statistic } = StatisticCard;



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
  const [currentRow, setCurrentRow] = useState<API.BatteryInfo>();
  // 添加一个新的状态来控制预览窗口的显示
  const [previewModalOpen, setPreviewModalOpen] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [currentBatteryCode, setCurrentBatteryCode] = useState<string | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState<boolean>(false);
  const [total, setTotal] = useState<number>();
  const [pageSize] = useState<number>(12);
  const [data, setData] = useState<API.BatteryInfo[]>([]);
  const [showTable, setShowTable] = useState(true);  // 用于切换显示 ProTable 或 Spin 的状态
  const [responsive, setResponsive] = useState(false);
  const [rangeQuery, setRangeQuery] = useState(null);
  const [progressVisible, setProgressVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDataCleanModalVisible, setIsDataCleanModalVisible] = useState(false);

  const [unCompleteness, setUnCompleteness] = useState(0);
  const [unConsistency, setUnConsistency] = useState(0);
  const [abnormalChargingMode, setAbnormalChargingMode] = useState(0);
  const [noneDataNum, setNoneDataNum] = useState(0);
  const [qualifiedRate, setQualifiedRate] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const imgStyle = {
    display: 'block',
    width: 42,
    height: 42,
  };

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
  const handleUpdate = async (fields: API.BatteryUpdateRequest) => {
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

        {/*<Button type="primary" htmlType="submit">*/}
        {/*  Upload*/}
        {/*</Button>*/}
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


  const handleDownload = async () => {
    // Range Query String
    // 最新逻辑：将数据导出到固定目录中，按照循环划分csv文件存储
    const cycleRangeQueryString = rangeQuery ? `${rangeQuery[0]}-${rangeQuery[1]}` : '';
    const res = await generateCsvByCycleUsingPost({batteryCode:currentBatteryCode,cycleRange:cycleRangeQueryString});
    if(res.data){
      //导出成功
      message.success('导出成功');
    }else{
      //导出失败（数据问题或是已经导出过了）
      message.error('导出失败，请检查数据或查看是否已经导出过');
    }

    // 下面是原本导出数据的逻辑，是将该电池所有循环的数据都导出在一个csv文件中，并提供网页端下载的形式
    // // 生成csv
    // const res = await generateCsvUsingPost({batteryCode:currentBatteryCode,cycleRange:cycleRangeQueryString});
    // // 开始下载
    // await downloadCsvUsingPost({filePath:res.data});
    // // 删除临时文件
    // await deleteCsvUsingPost({filePath:res.data});

  };

  const fakeProgress = (onComplete) => {
    return new Promise((resolve) => {
      let currentProgress = 0;

      const interval = setInterval(() => {
        if (currentProgress < 20) {
          currentProgress += Math.floor(Math.random() * 10) + 99; // 快速增长
        } else if (currentProgress < 90) {
          currentProgress += Math.random() * 5; // 慢速增长
        } else if (onComplete) {
          currentProgress += Math.random() * 10; // 最后完成部分
        }

        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(interval);
          resolve(); // 进度完成
        }

        setProgress(currentProgress);
      }, 100); // 每200ms更新一次
    });
  };

  /**
   *  Clean data
   * @zh-CN 数据清洗
   *
   */
  const handleCleaning = async () => {
    // 先查询数据
    const res = await queryBatteryUsingPost({batteryCode: currentBatteryCode})
    const id = res.data.id;
    // 如果是未检定
    if(res.data.dataQualityStatus==-1){
      setProgress(0);
      setProgressVisible(true);
      let isRequestComplete = false;
      try {
        // 开启假进度条
        const progressPromise = fakeProgress(() => isRequestComplete);

        // 发送请求到后端
        const payload = {
          batteryCode: currentBatteryCode,
          // todo: 这块写死了，后续再改
          processedDataFolder: "D:/BatteryData/downloadRawData/" + currentBatteryCode + "/"
        };
        const cleanRes = await axios.post('http://127.0.0.1:8102/fastapi/clean_data', payload, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // 请求完成后通知假进度条完成
        isRequestComplete = true;
        await progressPromise;

        setProgressVisible(false); // 隐藏进度条窗口

        if (cleanRes.data.data.result==1) {
          message.success('清洗完成');
          // alert(res.data);

          // 将数据写回到数据库
          const updateRes = await updateBatteryUsingPost({id: id, dataQualityStatus: cleanRes.data.data.dataQualityStatus, unCompleteness: cleanRes.data.data.unCompleteness,
            unConsistency: cleanRes.data.data.unConsistency,abnormalChargingMode: cleanRes.data.data.abnormalChargingMode,noneDataNum: cleanRes.data.data.noneDataNum,qualifiedRate: cleanRes.data.data.qualifiedRate});
          if (updateRes.data && updateRes.code === 0){
            setUnConsistency(cleanRes.data.data.unConsistency);
            setUnCompleteness(cleanRes.data.data.unCompleteness);
            setAbnormalChargingMode(cleanRes.data.data.abnormalChargingMode);
            setQualifiedRate(cleanRes.data.data.qualifiedRate);
            setNoneDataNum(cleanRes.data.data.noneDataNum);
            // 展示数据
            showModal();

          }
        } else {
          // alert(cleanRes.data.data.result);
          message.error('清洗失败');
        }
      } catch (error) {
        isRequestComplete = true; // 即使出错也结束进度条
        setProgressVisible(false);
        message.error('发生错误，请重试');
      }
    }else{
      setUnConsistency(res.data.unConsistency);
      setUnCompleteness(res.data.unCompleteness);
      setAbnormalChargingMode(res.data.abnormalChargingMode);
      setQualifiedRate(res.data.qualifiedRate);
      setNoneDataNum(res.data.noneDataNum);
      // 展示数据
      showModal();
    }

  };

  const confirm = async () => {
    await handleRemove(currentRow as API.BatteryInfo);
  };

  const cancel = () => {
    message.success('取消成功');
  };

  const getBatteryDataCount = () => {
    let count = 0;
    for (let i = 0; i < data.length; i++) {
      count = count + parseInt(data[i].dataNum);
    }
    return count;
  };

  // 控制弹窗显示
  const showModal = () => {
    setIsDataCleanModalVisible(true);
  };

  // 关闭弹窗
  const handleClose = () => {
    setIsDataCleanModalVisible(false);
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
        // <a
        //   key="download"
        //   onClick={() => {
        //     setCurrentBatteryCode(record.batteryCode)
        //   }}
        // >
        //   下载数据
        // </a>,
        <a
          key="dataClean"
          onClick={() => {
            alert(record.batteryCode);
            setCurrentBatteryCode(record.batteryCode);
            handleCleaning(); // 调用数据清洗函数
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
      <RcResizeObserver
        key="resize-observer"
        onResize={(offset) => {
          setResponsive(offset.width < 596);
        }}
      >
        <StatisticCard.Group direction={responsive ? 'column' : 'row'}>
          <StatisticCard
            statistic={{
              title: '电池接入数量',
              value: data.length,
              tip: "test",
              icon: (
                <img
                  style={imgStyle}
                  src={BatteryNum}
                  alt="icon"
                />
              ),
            }}
          />
          <StatisticCard
            statistic={{
              title: '电池数据总量',
              value: getBatteryDataCount(),
              icon: (
                <img
                  style={imgStyle}
                  src={DataNum}
                  alt="icon"
                />
              ),
            }}
          />
          <StatisticCard
            statistic={{
              title: '今日网站浏览量',
              value: 5,
              icon: (
                <img
                  style={imgStyle}
                  src={VisitNum}
                  alt="icon"
                />
              ),
            }}
          />
          <StatisticCard
            statistic={{
              title: '网站浏览总量',
              value: 200,
              icon: (
                <img
                  style={imgStyle}
                  src={VisitNum}
                  alt="icon"
                />
              ),
            }}
          />
        </StatisticCard.Group>
      </RcResizeObserver>
      <br/>
      <Button
        onClick={() => setShowTable(!showTable)}  // 切换显示状态
        style={{ marginBottom: 16 }}
      >
        切换{showTable ? '卡片' : '表格'}
      </Button>
      <Card>
        {showTable ? (
          <ProTable<API.BatteryInfo>
            headerTitle={'电池信息管理'}
            actionRef={actionRef}
            rowKey="battery"
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
                  <ProCard key={index} bordered loading={loading} hoverable direction="column" style={{height: 270}}
                           actions={[
                             <Tooltip title="导入数据" key="import">
                               <UploadOutlined onClick={() => {
                                 setCurrentBatteryCode(item.batteryCode);
                                 handleOpenUploadModal();
                               }}/>
                             </Tooltip>,
                             // <Tooltip title="下载数据" key="download">
                             //   <DownloadOutlined onClick={() => {
                             //     setCurrentBatteryCode(item.batteryCode);
                             //   }} />
                             // </Tooltip>,
                             <Tooltip title="删除" key="delete">
                               <DeleteOutlined onClick={async () => {
                                 setCurrentRow(item);
                               }}/>
                             </Tooltip>,
                             <Tooltip title="修改" key="edit">
                               <EditOutlined onClick={() => {
                                 setCurrentRow(item);
                                 handleUpdateModalOpen(true);
                               }}/>
                             </Tooltip>,
                             <Tooltip title="数据清洗" key="clean">
                               <ClearOutlined onClick={() => {
                                 setCurrentBatteryCode(item.batteryCode);
                                 handleCleaning(); // 调用数据清洗函数
                               }}/>
                             </Tooltip>,
                           ]}>
                    <ProCard layout="center" onClick={() => {
                      setCurrentBatteryCode(item.batteryCode);
                      // 手动触发表格刷新
                      actionRefBatteryData.current?.reload();
                      handlePreview(item);
                    }}>
                      <Badge count={item.dataNum} overflowCount={999999999} color='#eb4d4b'>
                        <Image style={{width: 80, borderRadius: 8, marginLeft: 10}}
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
                    }} layout="center" style={{marginTop: -10, fontSize: 16}}>
                      <span style={{fontWeight: 'bold', fontSize: 18}}>{item.batteryName}</span>
                    </ProCard>
                    <ProCard onClick={() => {
                      setCurrentBatteryCode(item.batteryCode);
                      // 手动触发表格刷新
                      actionRefBatteryData.current?.reload();
                      handlePreview(item);
                    }} layout="center" style={{marginTop: -18, fontSize: 14, textAlign: 'center'}}>
                    <span style={{
                      fontSize: 14,
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      width: '100%',
                      whiteSpace: 'nowrap'
                    }}>
                      {!item.batteryCode ? "暂无电池编号" : item.batteryCode.length > 32 ? item.batteryCode.slice(0, 32) + '...' : item.batteryCode}
                    </span>
                    </ProCard>
                    <div style={{textAlign: 'center'}}>
                      {/*<span style={{fontWeight: 'bold', fontSize: 18}}>{item.dataQualityStatus}</span>*/}
                      <span
                        style={{
                          fontWeight: 'bold',
                          fontSize: 12,
                          color:
                            item.dataQualityStatus === -1
                              ? 'gray'
                              : item.dataQualityStatus === 1
                                ? 'red'
                                : 'green',
                        }}
                                          >
                      {item.dataQualityStatus === -1
                        ? '未检定'
                        : item.dataQualityStatus === 1
                          ? '检定不合格'
                          : item.dataQualityStatus === 0
                            ? '检定合格'
                            : '未知状态'}
                    </span>
                    </div>
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
            const success = await handleUpdate(value as API.BatteryInfo);
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

          <div style={{display: 'flex', marginBottom: '16px'}}>
            {/* Range Query Bar */}
            <ProFormDigitRange
              label="循环次数范围"
              name="range-query"
              separator="-"
              placeholder={['最小值', '最大值']}
              separatorWidth={60}
              style={{marginRight: '16px', height: '32px'}} // Adjust height to match buttons
              onChange={(values) => {
                setRangeQuery(values); // Update state with the selected range
              }}
            />
            <Button
              type="primary"
              onClick={handleDownload}
              style={{marginLeft: '16px', marginRight: '16px', height: '32px'}} // Ensure same height as the ProFormDigitRange
            >
              查询数据
            </Button>
            <Button
              type="primary"
              onClick={handleDownload}
              style={{height: '32px'}} // Ensure same height as the ProFormDigitRange
            >
              导出数据
            </Button>
          </div>

          <ProTable<API.BatteryDataInfo>
            columns={BatteryDataColumns.map(column => ({
              ...column,
              render: (text, record, index) => (
                <td style={{height: '15px', lineHeight: '15px'}}>
                  {text}
                </td>
              ),
            }))}
            rowKey="id"
            pagination={{defaultPageSize: 10}}
            search={false}
            actionRef={actionRefBatteryData}
            request={async (params) => {
              if (!currentBatteryCode) {
                return {data: [], success: false};
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

      <Modal
        title="正在清洗数据"
        visible={progressVisible}
        footer={null}
        closable={false}
        centered
      >
        <Progress percent={Math.round(progress)} status={progress < 100 ? 'active' : 'success'} />
      </Modal>

      {/* 弹窗 */}
      <Modal
        title="弹窗"
        visible={isDataCleanModalVisible}
        onCancel={handleClose}
        footer={null}
        width={1000} // 可根据需要调整宽度
      >
        {/* 模态框中的内容 */}
        <RcResizeObserver
          key="resize-observer"
          onResize={(offset) => {
            setResponsive(offset.width < 596);
          }}
        >
          <ProCard
            title="数据清洗概览"
            extra=""
            split={responsive ? 'horizontal' : 'vertical'}
            headerBordered
            bordered
          >
            <ProCard split="horizontal">
              <ProCard split="horizontal">
                <ProCard split="vertical">
                  <StatisticCard
                    statistic={{
                      title: '完备性',
                      value: unCompleteness,
                      // description: (
                      //   <Statistic
                      //     title="较本月平均流量"
                      //     value="8.04%"
                      //     trend="down"
                      //   />
                      // ),
                    }}
                  />
                  <StatisticCard
                    statistic={{
                      title: '一致性',
                      value: unConsistency,
                      // description: (
                      //   <Statistic title="月同比" value="8.04%" trend="up" />
                      // ),
                    }}
                  />
                </ProCard>
                <ProCard split="vertical">
                  <StatisticCard
                    statistic={{
                      title: '充电模式异常',
                      value: abnormalChargingMode,
                      // suffix: '个',
                    }}
                  />
                  <StatisticCard
                    statistic={{
                      title: '空数据',
                      value: noneDataNum,
                      // suffix: '个',
                    }}
                  />
                  <StatisticCard
                    statistic={{
                      title: '合格数据比例',
                      value: qualifiedRate,
                      // suffix: '个',
                    }}
                  />
                </ProCard>
              </ProCard>
            </ProCard>
            <img
              src="/images/1846439044557312000_soc.png"
              alt="soc分析"
              style={{ width: '500px', height: 'auto' }}
            />
          </ProCard>
        </RcResizeObserver>
      </Modal>
    </div>

  );
};
export default BatteryList;
