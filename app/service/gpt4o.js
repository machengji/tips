// app/service/gpt4o.js
const OpenAI = require('openai-api');
const { Service } = require('egg'); // Keep this line here

class Gpt4oService extends Service {
  constructor(ctx) {
    super(ctx);
    this.openai = new OpenAI(this.config.moonshot.apiKey);
  }

  async getSimpleCompletion(prompt) {
    try {
      const gptResponse = await this.openai.complete({
        engine: 'gpt-4o-2024-08-06',
        prompt: prompt,
        maxTokens: 100,
        temperature: 0.9,
        topP: 1,
        presencePenalty: 0,
        frequencyPenalty: 0,
        bestOf: 1,
        n: 1,
        stream: false,
        stop: null,
      });

      return gptResponse.data;
    } catch (error) {
      this.ctx.logger.error('Error in getSimpleCompletion:', error);
      throw error;
    }
  }
}

module.exports = Gpt4oService;
