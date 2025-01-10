// app/service/Plan.js
const Service = require('egg').Service;

class PlanService extends Service {
  async getPlansByEmail(email) {
    const plan = await this.ctx.model.Plan.findOne({ email });
    return plan ? plan.plans : [];
  }

  async savePlansByEmail(email, plans) {
    const { ctx } = this;
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    const updatedPlan = await ctx.model.Plan.findOneAndUpdate({ email }, { plans }, options);
    return updatedPlan;
  }
}

module.exports = PlanService;
