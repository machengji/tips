'use strict';

const Controller = require('egg').Controller;

class ExplorationPlanController extends Controller {
  // 创建探索计划
  async create() {
    const { ctx } = this;
    const { user, planName, isFirstExploration, subPlans, isPinned } = ctx.request.body;
    const explorationPlan = await ctx.service.explorationPlan.create({
      user,
      planName,
      isFirstExploration,
      subPlans,
      isPinned,
    });
    ctx.body = explorationPlan;
    ctx.status = 201;
  }

  // 获取探索计划详情
  async show() {
    const { ctx } = this;
    const { id } = ctx.params;
    const explorationPlan = await ctx.service.explorationPlan.findById(id);
    ctx.body = explorationPlan;
  }

  // 更新探索计划
  async update() {
    const { ctx } = this;
    const { id } = ctx.params;
    const updateData = ctx.request.body;
    const explorationPlan = await ctx.service.explorationPlan.update(id, updateData);
    ctx.body = explorationPlan;
  }

  // 删除探索计划
  async destroy() {
    const { ctx } = this;
    const { id } = ctx.params;
    await ctx.service.explorationPlan.delete(id);
    ctx.status = 204;
  }

  // 获取用户的所有探索计划
  async index() {
    const { ctx } = this;
    const { userId } = ctx.query;
    const explorationPlans = await ctx.service.explorationPlan.findByUser(userId);
    ctx.body = explorationPlans;
  }
}

module.exports = ExplorationPlanController;