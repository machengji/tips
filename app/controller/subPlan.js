'use strict';

const Controller = require('egg').Controller;

class SubPlanController extends Controller {
  // 创建子计划
  async create() {
    const { ctx } = this;
    ctx.validate({
      explorationPlan: { type: 'string', required: true },
      subPlanName: { type: 'string', required: true },
      isCompleted: { type: 'boolean', required: false }
    });
    const subPlan = await ctx.service.subPlan.create(ctx.request.body);
    ctx.body = { success: true, data: subPlan };
    ctx.status = 201;
  }

  // 获取子计划详情
  async show() {
    const { ctx } = this;
    const subPlan = await ctx.service.subPlan.findById(ctx.params.id);
    if (!subPlan) {
      ctx.throw(404, '子计划不存在');
    }
    ctx.body = { success: true, data: subPlan };
  }

  // 更新子计划
  async update() {
    const { ctx } = this;
    ctx.validate({
      subPlanName: { type: 'string', required: false },
      isCompleted: { type: 'boolean', required: false }
    });
    const subPlan = await ctx.service.subPlan.update(
      ctx.params.id,
      ctx.request.body
    );
    if (!subPlan) {
      ctx.throw(404, '子计划不存在');
    }
    ctx.body = { success: true, data: subPlan };
  }

  // 删除子计划
  async destroy() {
    const { ctx } = this;
    const subPlan = await ctx.service.subPlan.delete(ctx.params.id);
    if (!subPlan) {
      ctx.throw(404, '子计划不存在');
    }
    ctx.body = { success: true };
  }

  // 获取子计划列表
  async index() {
    const { ctx } = this;
    const explorationPlanId = ctx.query.explorationPlanId;
    const subPlans = await ctx.service.subPlan.list(explorationPlanId);
    ctx.body = { success: true, data: subPlans };
  }
}

module.exports = SubPlanController;