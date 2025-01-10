'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async wechatLogin() {
    const { ctx } = this;
    const { code } = ctx.request.body;

    // 参数验证
    if (!code) {
      ctx.status = 400;
      ctx.body = { code: 400, message: '微信code不能为空' };
      return;
    }

    try {
      const result = await ctx.service.user.wechatLogin(wechatId);
      ctx.body = {
        code: 200,
        message: '登录成功',
        data: result,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: '服务器错误',
        error: error.message,
      };
    }
  }
}

module.exports = UserController;