// app/controller/Plan.js
const Controller = require('egg').Controller;

class PlanController extends Controller {
  async getPlans() {
    const { ctx } = this;
    const { email } = ctx.params;
    const plans = await ctx.service.plan.getPlansByEmail(email);
    ctx.body = { success: true, data: plans };
  }

  async savePlans() {
    const { ctx } = this;
    const { email } = ctx.params;
    const plans = ctx.request.body;
    try {
      await ctx.service.plan.savePlansByEmail(email, plans);
      ctx.status = 200;
      ctx.body = { success: true, message: 'Plans saved successfully' };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { success: false, message: 'Failed to save plans', error: error.message };
    }
  }
}

module.exports = PlanController;
