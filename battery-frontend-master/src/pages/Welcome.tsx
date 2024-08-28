import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Card, theme } from 'antd';
import React from 'react';
import BatterySrc from "../../public/assets/Battery.png";


/**
 * 每个单独的卡片，为了复用样式抽成了组件
 * @param param0
 * @returns
 */
const InfoCard: React.FC<{
  title: string;
  index: number;
  desc: string;
  href: string;
}> = ({ title, href, index, desc }) => {
  // const { useToken } = theme;

  // const { token } = useToken();

  return (
    <div
      style={{
        borderRadius: '8px',
        fontSize: '14px',
        lineHeight: '22px',
        padding: '16px 19px',
        minWidth: '220px',
        flex: 1,
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '4px',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            lineHeight: '22px',
            backgroundSize: '100%',
            textAlign: 'center',
            padding: '8px 16px 16px 12px',
            color: '#FFF',
            fontWeight: 'bold',
            backgroundImage:
              "url('https://gw.alipayobjects.com/zos/bmw-prod/daaf8d50-8e6d-4251-905d-676a24ddfa12.svg')",
          }}
        >
          {index}
        </div>
        <div
          style={{
            fontSize: '16px',
            paddingBottom: 8,
          }}
        >
          {title}
        </div>
      </div>
      <div
        style={{
          fontSize: '14px',
          textAlign: 'justify',
          lineHeight: '22px',
          marginBottom: 8,
        }}
      >
        {desc}
      </div>

    </div>
  );
};

const Welcome: React.FC = () => {
  // const { token } = theme.useToken();
  const { initialState } = useModel('@@initialState');
  return (
    <PageContainer>
      <Card
        style={{
          borderRadius: 8,
          minHeight: '200px',
          display: 'flex', // 使用Flexbox
          alignItems: 'center', // 垂直居中
          justifyContent: 'center', // 水平居中
          flexDirection: 'column', // 确保子元素垂直排列
        }}
        bodyStyle={{
          backgroundImage:
            initialState?.settings?.navTheme === 'realDark'
              ? 'background-image: linear-gradient(75deg, #1A1B1F 0%, #191C1F 100%)'
              : 'background-image: linear-gradient(75deg, #FBFDFF 0%, #F5F7FF 100%)',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100px', // logo图片高度
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#fff', // 页面背景
          }}
        >
          {/* 显示logo图片 */}
          <img
            src={BatterySrc}
            alt="Logo"
            style={{
              width: '760px', // logo图片大小
              height: 'auto',
            }}
          />
        </div>
      </Card>
      <Card
        style={{
          borderRadius: 8,
        }}
        bodyStyle={{
          backgroundImage:
            initialState?.settings?.navTheme === 'realDark'
              ? 'background-image: linear-gradient(75deg, #1A1B1F 0%, #191C1F 100%)'
              : 'background-image: linear-gradient(75deg, #FBFDFF 0%, #F5F7FF 100%)',
        }}
      >
        <div
          style={{
            backgroundPosition: '100% -30%',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '274px auto',
            backgroundImage:
              "url('https://gw.alipayobjects.com/mdn/rms_a9745b/afts/img/A*BuFmQqsB2iAAAAAAAAAAAAAAARQnAQ')",
          }}
        >
          <div
            style={{
              fontSize: '20px',
            }}
          >
            欢迎使用 电池数据管理系统 🎉
          </div>
          <p
            style={{
              fontSize: '14px',
              lineHeight: '22px',
              marginTop: 16,
              marginBottom: 32,
              width: '65%',
            }}
          >
            电池数据管理系统是一个为开发者提供的一站式数据服务平台，旨在简化电池数据的管理与使用 🛠
          </p>
          <p>
            😀 作为『用户』，您可以浏览电池组列表，并选择感兴趣的电池数据进行查看与分析。
          </p>
          <p>
            🤝 作为『管理员』，您可以全面管理电池数据和用户账户。电池数据管理包括修改、添加、发布及删除电池数据，而用户管理则涵盖修改用户信息、禁用或恢复用户访问权限等功能。
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <InfoCard
              index={1}
              title="丰富多样的电池数据"
              desc="本系统为您提供了广泛的电池组数据选择，涵盖多种应用场景，满足您在电池管理和分析中的多样化需求。"
            />
            <InfoCard
              index={2}
              title="实时数据阅览"
              desc="通过平台，您可以方便地在线阅览和分析电池数据，无需繁琐的开发过程，显著提升工作效率。"
            />
            <InfoCard
              index={3}
              title="智能预测功能"
              desc="系统集成了深度学习模型，支持对电池健康状态（SOH）等关键参数的在线预测，助力决策支持。"
            />
          </div>
        </div>
      </Card>
    </PageContainer>
  );
};

export default Welcome;
