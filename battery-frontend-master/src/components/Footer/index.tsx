import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import '@umijs/max';
const Footer: React.FC = () => {
  const defaultMessage = 'Bachury出品';
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      // copyright={`${currentYear} ${defaultMessage}`}
      copyright={<>
        {`${currentYear} ${defaultMessage}`}  {' '}
      </>}
      links={[
        {
          key: 'Ant Design Pro',
          title: 'Ant Design Pro',
          href: 'https://pro.ant.design',
          blankTarget: true,
        },
        // {
        //   key: 'github',
        //   title: <GithubOutlined />,
        //   href: 'https://github.com/Vampon',
        //   blankTarget: true,
        // },
        // {
        //   key: '电池数据管理系统',
        //   title: '电池数据管理系统',
        //   href: 'https://github.com/Vampon',
        //   blankTarget: true,
        // },
      ]}
    />
  );
};
export default Footer;
