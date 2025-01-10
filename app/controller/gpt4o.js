// app/controller/gpt4o.js
const { Controller } = require('egg');

class Gpt4oController extends Controller {
  async getCompletion() {
    const { ctx } = this;
    const { prompt } = ctx.request.body;

    try {
      const completionData = await ctx.service.gpt4o.getSimpleCompletion(prompt);
      ctx.body = { success: true, data: completionData };
    } catch (error) {
      ctx.logger.error('Error in Gpt4oController:', error);
      ctx.body = { success: false, message: error.message };
      ctx.status = 500;
    }
  }
}

module.exports = Gpt4oController;
