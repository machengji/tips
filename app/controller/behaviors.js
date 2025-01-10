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

  async getByEmail() {
    const { ctx } = this;
    const { email } = ctx.query;

    // 1. 校验参数
    if (!email) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: '参数错误：缺少 email',
      };
      return;
    }

    // 2. 调用 Service 层查询数据
    try {
      const behaviors = await this.service.behaviors.getBehaviorsByEmail(email);
      ctx.body = {
        code: 200,
        message: '查询成功',
        data: behaviors,
      };
    } catch (error) {
      ctx.logger.error('查询行为数据失败:', error);
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: '服务器错误，查询失败',
      };
    }
  }

  async saveAnchorList() {
    const { ctx } = this;
    const { email, anchorList } = ctx.request.body;

    // 1. 校验参数
    if (!email || !anchorList || !Array.isArray(anchorList)) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: '参数错误：缺少 email 或 anchorList，或者 anchorList 不是数组',
      };
      return;
    }

    // 2. 调用 Service 层处理业务逻辑
    try {
      await this.service.behaviors.saveAnchorList(email, anchorList);
      ctx.body = {
        code: 200,
        message: '保存成功',
      };
    } catch (error) {
      ctx.logger.error('保存锚点数据失败:', error);
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: '服务器错误，保存失败',
      };
    }
  }

  async getAnchorList() {
    const { ctx } = this;
    const { email } = ctx.query;

    // 1. 校验参数
    if (!email) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: '参数错误：缺少 email',
      };
      return;
    }

    // 2. 调用 Service 层查询数据
    try {
      const anchorList = await this.service.behaviors.getAnchorList(email);
      ctx.body = {
        code: 200,
        message: '查询成功',
        data: anchorList,
      };
    } catch (error) {
      ctx.logger.error('查询锚点数据失败:', error);
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: '服务器错误，查询失败',
      };
    }
  }

  async getBehaviorList() {
    const { ctx } = this;
    const { email, anchorName } = ctx.params;

    // 查询数据库以获取行为列表
    const behaviorList = await ctx.service.behaviors.findByEmailAndAnchorName(email, anchorName);

    if (behaviorList) {
      ctx.body = {
        success: true,
        data: behaviorList,
      };
    } else {
      ctx.body = {
        success: false,
        message: '未找到相关行为列表',
      };
      ctx.status = 404; // 设置状态码为404
    }
  }
}

module.exports = BehaviorsController;
