// app/service/moonshot.js
const { Service } = require('egg');
const OpenAI = require('openai');

class MoonshotService extends Service {

    constructor(ctx) {
        super(ctx);
        this.client = new OpenAI({
            apiKey: this.config.moonshot.apiKey,
            baseURL: this.config.moonshot.baseURL,
        });
    }

    /**
     * 从AI响应中提取JSON字符串
     * @param {string} text - AI返回的完整文本
     * @returns {string} 提取的JSON字符串
     */
    extractJSON(text) {
        const jsonRegex = /```json\s*([\s\S]*?)\s*```/i;
        const match = text.match(jsonRegex);
        if (match && match[1]) {
            return match[1];
        }
        // 如果没有匹配到代码块，尝试查找第一个大括号
        const jsonStart = text.indexOf('{');
        if (jsonStart !== -1) {
            const jsonString = text.substring(jsonStart);
            // 尝试找到匹配的大括号
            let braceCount = 0;
            let endIndex = -1;
            for (let i = 0; i < jsonString.length; i++) {
                if (jsonString[i] === '{') braceCount++;
                if (jsonString[i] === '}') braceCount--;
                if (braceCount === 0) {
                    endIndex = i;
                    break;
                }
            }
            if (endIndex !== -1) {
                return jsonString.substring(0, endIndex + 1);
            }
        }
        throw new Error('未找到有效的JSON数据');
    }

    async getAIResponse(userMessage) {
        console.log("API Key:", this.config.moonshot.apiKey);
        try {
            const completion = await this.client.chat.completions.create({
                model: "moonshot-v1-8k",
                messages: [
                    {
                        role: "system",
                        content: "你是 Kimi，由 Moonshot AI 提供的人工智能助手，你更擅长中文和英文的对话。你会为用户提供安全、有帮助、准确的回答。同时，你会拒绝一切涉及恐怖主义、种族歧视、黄色暴力等问题的回答。Moonshot AI 为专有名词，不可翻译成其他语言。"
                    },
                    {
                        role: "user",
                        content: `我的目标是：${userMessage}。请根据我的目标，返回6个具体而且细小而且特别易于实现而且容易开始而且的初始小行为列表，严格按照以下 JSON 格式，不要添加其他文字：

{
  "behaviors": [
    {"id":1, "text":"具体行为1"},
    {"id":2, "text":"具体行为2"},
    {"id":3, "text":"具体行为3"},
    {"id":4, "text":"具体行为4"},
    {"id":5, "text":"具体行为5"},
    {"id":6, "text":"具体行为6"}
  ]
}`
                    }
                ],
                temperature: 0.3
            });
            const aiResponse = completion.choices[0].message.content.trim();
            console.log("AI Response:", aiResponse);

            // 尝试提取JSON
            let behaviors;
            try {
                const jsonString = this.extractJSON(aiResponse);
                behaviors = JSON.parse(jsonString).behaviors;
            } catch (parseError) {
                this.ctx.logger.error('解析AI返回的JSON失败:', parseError);
                throw new Error('AI 返回的数据格式有误');
            }

            return behaviors;
        } catch (error) {
            this.ctx.logger.error('获取AI响应时出错:', error);
            throw error;
        }
    }
}

module.exports = MoonshotService;
