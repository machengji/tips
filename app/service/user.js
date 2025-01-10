'use strict';

const Service = require('egg').Service;
const axios = require('axios');

class UserService extends Service {
  async getOpenId(code) {
    const { appid, secret } = this.config.wechat;
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`;
    
    try {
      const response = await axios.get(url);
      if (response.data.errcode) {
        throw new Error(`微信接口错误: ${response.data.errmsg}`);
      }
      return response.data.openid;
    } catch (error) {
      throw new Error(`获取openid失败: ${error.message}`);
    }
  }

  async wechatLogin(code) {
    const { ctx } = this;
    
    // 获取openid
    const openid = await this.getOpenId(code);
    
    // 查找用户
    const user = await ctx.model.User.findOne({ openid });
    
    if (!user) {
      // 如果用户不存在，创建新用户
      const newUser = await ctx.model.User.create({
        openid,
        username: `用户_${Date.now()}`,
        avatar: 'https://default-avatar-url.com',
      });
      
      const token = this.app.jwt.sign({
        userId: newUser._id,
      }, this.config.jwt.secret);
      
      return {
        token,
        user: newUser,
      };
    }
    
    // 用户存在，生成token
    const token = this.app.jwt.sign({
      userId: user._id,
    }, this.config.jwt.secret);
    
    return {
      token,
      user,
    };
  }
}

module.exports = UserService;