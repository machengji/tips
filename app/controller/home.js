'use strict';

const Controller = require('egg').Controller;
const axios = require('axios');
const { URLSearchParams } = require('url'); // 引入 URLSearchParams

class HomeController extends Controller {
  async sendMessage() {
    const { ctx } = this;
    console.log("jingning")
    const loginUrl = 'https://www.papayagpt.com/app/user/login';
    const loginData = {
      username: 'machengji',
      password: 'ma20171007',
    };

    const sendMessageUrl = 'https://www.papayagpt.com/app/ai/message/send'; // 使用绝对 URL
    const prompt = ctx.request.body.message; // 从请求体中获取 prompt
    const sendMessageData = {
      rolePrompt: '',
      roleId: 1,
      model: 'gpt-4-mini',
      temperature: 0.6,
      prompt: `我的目标是：${prompt}。请根据我的目标，返回6个具体而且细小而且特别易于实现而且容易开始而且的初始小行为列表，严格按照以下 JSON 格式，不要添加其他文字：

{
  "behaviors": [
    {"id":1, "text":"具体行为1"},
    {"id":2, "text":"具体行为2"},
    {"id":3, "text":"具体行为3"},
    {"id":4, "text":"具体行为4"},
    {"id":5, "text":"具体行为5"},
    {"id":6, "text":"具体行为6"}
  ]
}`, // 使用请求体中的 prompt
    };

    let cookie = ctx.session.papayaCookie; // 从 session 中获取 cookie

    try {
      // 1. 检查 cookie 是否有效
      if (!cookie) {
        // 重新登录
        const loginResponse = await axios.post(loginUrl, new URLSearchParams(loginData).toString(), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });

        if (loginResponse.status !== 200) {
          ctx.status = loginResponse.status;
          ctx.body = { error: 'Login failed', details: loginResponse.data };
          return;
        }

        // 从响应头中获取 cookie
        const setCookieHeader = loginResponse.headers['set-cookie'];
        if (setCookieHeader) {
          const papayaCookieMatch = setCookieHeader.find(cookie => cookie.startsWith('Papaya_UwU='));
          if (papayaCookieMatch) {
            cookie = papayaCookieMatch.split(';')[0];
            ctx.session.papayaCookie = cookie; // 存储 cookie 到 session
          }
        }

        if (!cookie) {
          ctx.status = 500;
          ctx.body = { error: 'Login failed', details: 'Could not extract cookie from login response' };
          return;
        }
      }

      // 2. 发送消息请求，携带 Cookie
      const sendMessageResponse = await fetch(sendMessageUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Origin': 'https://www.papayagpt.com',
          'Referer': 'https://www.papayagpt.com/',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
          'X-Requested-With': 'XMLHttpRequest',
          'Cookie': cookie,
        },
        body: new URLSearchParams(sendMessageData).toString(),
      });
      console.log(sendMessageResponse)
      if (!sendMessageResponse.ok) {
        // 检查是否是登录错误
        const responseText = await sendMessageResponse.text();
        if (responseText && responseText.includes('请登录后使用')) {
          ctx.session.papayaCookie = null; // 清除 cookie
          ctx.status = 401;
          ctx.body = { error: 'Login required', details: responseText };
          return;
        }
        ctx.status = sendMessageResponse.status;
        ctx.body = { error: 'Send message failed', details: responseText };
        return;
      }

      const reader = sendMessageResponse.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = ''; // 用于存储拼接后的内容

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log('SSE stream completed');
          break;
        }
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.startsWith('data: '));
        lines.forEach(line => {
          const data = line.substring(6).trim();
          if (data === '[DONE]') {
            return;
          }
          try {
            const jsonData = JSON.parse(data);
            if (jsonData.choices && jsonData.choices.length > 0 && jsonData.choices[0].delta && jsonData.choices[0].delta.content) {
              fullContent += jsonData.choices[0].delta.content;
            }
          } catch (error) {
            console.error('Error parsing JSON:', error, data);
          }
        });
      }

      // 提取 JSON 并返回
      let behaviors;
      try {
          behaviors = this.extractJSON(fullContent);
          behaviors = JSON.parse(behaviors).behaviors;
      } catch (parseError) {
          ctx.logger.error('解析AI返回的JSON失败:', parseError);
          ctx.status = 500;
          ctx.body = { error: 'AI 返回的数据格式有误', details: parseError.message };
          return;
      }

      ctx.body = {
        // success: true,
        // message: 'Message sent successfully',
        response: behaviors, // 将 behaviors 数组包裹在 response 字段中
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: 'Internal server error', details: error.message };
    }
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
}

module.exports = HomeController;
