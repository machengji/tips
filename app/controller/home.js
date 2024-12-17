const { Controller } = require('egg');
// app/controller/home.js
const SendReminders = require('../../app/schedule/send_reminders');
class HomeController extends Controller {
  async index() {
    const { ctx } = this;
   
    const sendReminders = new SendReminders(ctx.app, ctx);
    console.log("HomeController")
    await sendReminders.subscribe();
    ctx.body = '定时任务已手动执行';
  }
}

module.exports = HomeController;
