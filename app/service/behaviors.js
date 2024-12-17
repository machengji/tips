'use strict';

const Service = require('egg').Service;

class BehaviorsService extends Service {
  async saveBehaviors(email, behaviors) {
    const { ctx } = this;
    const now = new Date();

    try {
      // 1. 查询是否已存在该用户的行为数据
      const existingBehavior = await ctx.model.Behavior.findOne({ email });

      if (existingBehavior) {
        // 2. 如果存在，则更新数据
        existingBehavior.behaviors = behaviors;
        existingBehavior.updatedAt = now;
        await existingBehavior.save();
        ctx.logger.info(`用户 ${email} 的行为数据已更新`);
      } else {
        // 3. 如果不存在，则创建新的数据
        const newBehavior = new ctx.model.Behavior({
          email,
          behaviors,
          createdAt: now,
          updatedAt: now,
        });
        await newBehavior.save();
        ctx.logger.info(`用户 ${email} 的行为数据已创建`);
      }
      return true;
    } catch (error) {
      ctx.logger.error('保存行为数据失败:', error);
      throw error;
    }
  }
}

module.exports = BehaviorsService;
