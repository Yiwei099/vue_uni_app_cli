// 应用全局配置
const config = {
  //测试环境-穿透
  devBaseURL: 'http://o24j849177.zicp.vip',

  // 服装正式环境
  baseURLClothing: 'https://retail.fuyungroup.com',
  // 餐饮正式环境
  baseURL: 'https://merchant.fuyungroup.com',

  //开发环境
  // devBaseURL: 'http://192.168.3.85:9088',
  //服装开发环境
  // devBaseURLClothing: 'http://192.168.3.85:9081',

  // 更新的应用信息（应用名称）
  updateName: '衣点通服务市场',
  appInfo: {
    // 应用名称
    name: '衣点通服务市场',
    // 应用版本
    version: '1.0.0',
    // 应用logo
    // 官方网站
    site_url: '',
    // 政策协议
    agreements: [
      {
        title: '会员服务协议',
        url: 'https://merchant.fuyungroup.com/privacy/fzMemberAgreement.html',
      },
      {
        title: '会员服务协议',
        url: 'https://merchant.fuyungroup.com/privacy/cyMemberAgreement.html',
      },
    ],
  },
}
export default config
