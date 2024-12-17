    'use strict';

    const Service = require('egg').Service;
    const nodemailer = require('nodemailer');

    class EmailService extends Service {
    async sendEmail(to, subject, html) {
        const { app, config } = this;
        console.log("chsi")

        // 创建邮件发送器
        const transporter = nodemailer.createTransport({
        host: config.email.host,
        port: config.email.port,
        secure: config.email.secure,
        auth: {
            user: config.email.user,
            pass: config.email.pass,
        },
        });
        console.log(transporter)
        console.log(transporter)

        // 发送邮件
        try {
        const info = await transporter.sendMail({
            from: config.email.from,
            to,
            subject,
            html,
        });
        app.logger.info('邮件发送成功:', info.messageId);
        return true;
        } catch (error) {
        app.logger.error('邮件发送失败:', error);
        return false;
        }
    }
    }

    module.exports = EmailService;
