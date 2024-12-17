'use strict';

const Controller = require('egg').Controller;

class BehaviorsController extends Controller {
  async upload() {
    const { ctx } = this;
    const { email, behaviors } = ctx.request.body;

    // 1. 校验参数
    if (!email || !behaviors || !Array.isArray(behaviors)) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: '参数错误：缺少 email 或 behaviors，或者 behaviors 不是数组',
      };
      return;
    }

    // 2. 调用 Service 层处理业务逻辑
    try {
      await this.service.behaviors.saveBehaviors(email, behaviors);
      ctx.body = {
        code: 200,
        message: '上传成功',
      };
    } catch (error) {
      ctx.logger.error('上传行为数据失败:', error);
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: '服务器错误，上传失败',
      };
    }
  }
}

module.exports = BehaviorsController;
