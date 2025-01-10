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

  async getBehaviorsByEmail(email) {
    // 假设你使用的是 MongoDB，调用 Model 层查询数据
    const behaviors = await this.ctx.model.Behavior.find({ email });
    return behaviors;
  }

  async saveAnchorList(email, anchorList) {
    // 使用 updateOne 方法，如果不存在则创建新文档
    await this.ctx.model.Anchor.updateOne(
      { email },
      { 
        email,
        anchorList,
        updatedAt: new Date()
      },
      { upsert: true }
    );
  }

  async getAnchorList(email) {
    const result = await this.ctx.model.Anchor.findOne({ email });
    return result ? result.anchorList : [];
  }

  async findByEmailAndAnchorName(email, anchorName) {
    // 使用 Mongoose 的 findOne 方法查询数据库
    const behavior = await this.ctx.model.Behavior.findOne({
      email,
      behaviors: { $elemMatch: { anchorName } }, // 只匹配包含特定 anchorName 的行为
    });

    // 如果找到行为，返回该行为的相关数据
    if (behavior) {
      return behavior.behaviors.filter(b => b.anchorName === anchorName); // 只返回匹配的行为
    }
    
    return []; // 如果没有找到，返回空数组
  }
}

module.exports = BehaviorsService;
