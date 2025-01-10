'use strict';

const Service = require('egg').Service;

class SubPlanService extends Service {
  // 创建子计划
  async create(subPlan) {
    const { ctx } = this;
    return ctx.model.SubPlan.create(subPlan);
  }

  // 获取子计划详情
  async findById(id) {
    const { ctx } = this;
    return ctx.model.SubPlan.findById(id).populate('explorationPlan');
  }

  // 更新子计划
  async update(id, updates) {
    const { ctx } = this;
    return ctx.model.SubPlan.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );
  }

  // 删除子计划
  async delete(id) {
    const { ctx } = this;
    return ctx.model.SubPlan.findByIdAndDelete(id);
  }

  // 获取子计划列表
  async list(explorationPlanId) {
    const { ctx } = this;
    const query = {};
    if (explorationPlanId) {
      query.explorationPlan = explorationPlanId;
    }
    return ctx.model.SubPlan.find(query).populate('explorationPlan');
  }
}

module.exports = SubPlanService;