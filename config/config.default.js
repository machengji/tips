require('dotenv').config();

module.exports = appInfo => {
  const config = exports = {};

  // 设置应用的密钥，用于签名 Cookie 等
  config.keys = appInfo.name + '_1733757802248_4743';

  // 添加 bodyParser 配置
  config.bodyParser = {
    enable: true,
    jsonLimit: '1mb',
  };

   // 配置邮件发送参数
   config.email = {
    host: process.env.EMAIL_HOST || 'smtp.example.com', // 替换为你的 SMTP 服务器地址
    port: process.env.EMAIL_PORT || 465, // 替换为你的 SMTP 服务器端口
    secure: process.env.EMAIL_SECURE === 'true', // 是否使用 SSL/TLS
    user: process.env.EMAIL_USER || 'your_email@example.com', // 替换为你的邮箱账号
    pass: process.env.EMAIL_PASS || 'your_email_password', // 替换为你的邮箱密码
    from: process.env.EMAIL_FROM || 'your_email@example.com', // 替换为你的发件人邮箱
  };
  // 配置中间件（此处暂未添加任何中间件）
  config.middleware = [];
  // 微信小程序配置
  config.wechat = {
    appid: 'wx143a38ebfeaba324',
    secret: '39a3fc50c468dd5078598652ede18451',
  };

  // 配置 MongoDB
  config.mongoose = {
    client: {
      url: 'mongodb://127.0.0.1:27017/tip', // 从环境变量读取，并设置默认值
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    },
  };
  // 配置安全策略
  config.security = {
    csrf: {
      enable: true, // 启用 CSRF 防护
      ignore: ctx => {
        // 将所有以 /api 开头的路由设置为白名单，忽略 CSRF 检查
        return /^\/api/.test(ctx.path);
      },
      // 如果您更喜欢使用正则表达式数组，也可以这样配置：
      // ignore: [/^\/api/],
    },
    // 其他安全配置（可根据需要进行调整）
    // domainWhiteList: [ 'http://example.com' ],
  };

  // 用户自定义配置
  const userConfig = {
    // myAppName: 'egg',
  };
  // console.log('环境变量：', process.env);
  // console.log('MOONSHOT_API_KEY:', process.env.MOONSHOT_API_KEY);

  return {
    ...config,
    ...userConfig,
    moonshot: {
      apiKey: process.env.MOONSHOT_API_KEY || 'your_default_api_key',
      baseURL: 'https://api.moonshot.cn/v1',
    },
  };
};
