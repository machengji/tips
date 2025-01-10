'use strict';

const Service = require('egg').Service;

class ExplorationPlanService extends Service {
  // 创建探索计划
  async create(explorationPlanData) {
    const { ctx } = this;
    return ctx.model.ExplorationPlan.create(explorationPlanData);
  }

  // 根据ID查找探索计划
  async findById(id) {
    const { ctx } = this;
    return ctx.model.ExplorationPlan.findById(id)
      .populate('user')
      .populate('subPlans');
  }

  // 更新探索计划
  async update(id, updateData) {
    const { ctx } = this;
    return ctx.model.ExplorationPlan.findByIdAndUpdate(id, updateData, { new: true });
  }

  // 删除探索计划
  async delete(id) {
    const { ctx } = this;
    return ctx.model.ExplorationPlan.findByIdAndDelete(id);
  }

  // 获取用户的所有探索计划
  async findByUser(userId) {
    const { ctx } = this;
    return ctx.model.ExplorationPlan.find({ user: userId })
      .populate('user')
      .populate('subPlans');
  }
}

module.exports = ExplorationPlanService;