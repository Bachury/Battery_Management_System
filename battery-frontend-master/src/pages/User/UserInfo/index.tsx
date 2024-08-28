import {ProCard, ProDescriptions, ProField, ProFormUploadDragger} from '@ant-design/pro-components';
import {
  getLoginUserUsingGet,
  updateUserUsingPost,

} from '@/services/user-center/userController';
import {values} from 'lodash';
import {useState} from 'react';
import { Image } from 'antd';
import {useModel} from "@umijs/max";


export const valueLength = (val: any) => {
  return val && val.trim().length > 0
}

/**
 * 个人中心
 * @constructor
 */
const UserInfo: React.FC = () => {
  const [currentRow, setCurrentRow] = useState<API.UserVO>();
  const [reloadFlag, setReloadFlag] = useState(false);
  const [dailyCheckInLoading, setDailyCheckInLoading] = useState<boolean>(false);
  const {initialState, setInitialState} = useModel('@@initialState');



  return (
    <ProCard
      bordered
      headerBordered
      direction="column"
      gutter={[0, 16]}
      style={{ marginBlockStart: 8 }}
    >
      <ProCard title="个人信息" type="inner" bordered>
        <ProDescriptions
          column={1}
          request={async () => {
            const res = await getLoginUserUsingGet({
              ...values(),
            });
            if (res?.data) {
              return {
                data: res?.data || '',
                success: true,
                total: res.data,
              };
            } else {
              return {
                data: '',
                success: false,
                total: 0,
              };
            }
          }}
          emptyText={'空'}
          editable={{
            // 编辑框修改后点击 ✔ 保存用户昵称
            onSave: async (keypath, newInfo, oriInfo) => {
              console.log(keypath, newInfo, oriInfo);
              const res = await updateUserUsingPost(newInfo);
              console.log(res.data);
              if (res?.data) {
                return {
                  data: res?.data || '',
                  success: true,
                  total: res.data,
                };
              } else {
                return {
                  data: '',
                  success: false,
                  total: 0,
                };
              }
              return true;
            },
          }}
          columns={[
            {
              title: '头像',
              dataIndex: 'avatarUrl',
              valueType: 'image',
              hideInSearch: true,
              render: (_, record) => (
                <div>
                  <Image src={record.avatarUrl} width={50}/>
                </div>
              ),
              editable: false,
            },
            {
              title: '用户名',
              dataIndex: 'userName',
              copyable: true,
            },
            {
              title: '绑定邮箱',
              dataIndex: 'userEmail',
              copyable: true,
            },
            {
              title: '角色',
              dataIndex: 'userRole',
              valueType: 'select',
              valueEnum: {
                user: { text: '普通用户', status: 'Default' },
                admin: { text: '管理员', status: 'Success' },
                suspend: { text: '禁用', status: 'Error' },
              },
              editable: false,
            },
            {
              title: '创建时间',
              dataIndex: 'createTime',
              valueType: 'dateTime',
              hideInForm: true,
              editable: false,
            },
          ]}
        ></ProDescriptions>
      </ProCard>
    </ProCard>
  );
};

export default UserInfo;
