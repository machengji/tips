'use strict';

const Subscription = require('egg').Subscription;

class SendReminders extends Subscription {
  static get schedule() {
    return {
      cron: '0 0 * * * *', 
    //   cron: '* * * * * *', // 每秒执行// 每分钟的第0秒执行
      type: 'all',
    };
  }

  async subscribe() {
    const { app, ctx } = this;
    const now = new Date();
    const currentHour = String(now.getHours()).padStart(2, '0');
    const currentMinute = String(now.getMinutes()).padStart(2, '0');
    const currentTime = `${currentHour}:${currentMinute}`;
    console.log(`开始检查 ${currentTime} 的提醒`)
    app.logger.info(`开始检查 ${currentTime} 的提醒`);
   
    try {
      const behaviors = await ctx.model.Behavior.find({});
      
      for (const behavior of behaviors) {
        const { email, behaviors: behaviorList } = behavior;

        for (const anchor of behaviorList) {
          const { anchorName, time, behaviorList: actions } = anchor;
          console.log(anchorName)
          console.log(time)
          console.log(currentTime)
          if (time === currentTime) {
            console.log("================================================")
            for (const action of actions) {
              const { name } = action;
              const subject = `行为提醒: ${anchorName}`;
              const html = `
                <p>您好，${email}：</p>
                <p>请注意，待会 ${anchorName} 要执行以下行为：</p>
                <p><strong>${name}</strong></p>
              `;
              console.log("======================1==========================")
              const isSent = await ctx.service.email.sendEmail(email, subject, html);
              if (isSent) {
                app.logger.info(`已发送邮件给 ${email}，提醒 ${anchorName} 执行 ${name}`);
              } else {
                app.logger.error(`发送邮件给 ${email} 失败，提醒 ${anchorName} 执行 ${name}`);
              }
            }
          }
        }
      }
    } catch (error) {
      app.logger.error('定时任务执行失败:', error);
    }
  }
}

module.exports = SendReminders;
