// app/controller/ai.js
const { Controller } = require('egg');

class AIController extends Controller {
  async ask() {
    const { ctx, service } = this;
    const { message } = ctx.request.body;

    if (!message) {
      ctx.status = 400;
      ctx.body = { error: '缺少参数: message' };
      return;
    }

    try {
      const aiResponse = await service.moonshot.getAIResponse(message);
      ctx.body = { response: aiResponse };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: '获取AI回答失败' };
    }
  }
}

module.exports = AIController;
