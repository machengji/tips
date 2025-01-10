'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const UserSchema = new Schema({
    openid: { type: String, unique: true }, // 微信openid
    email: { type: String, unique: true }, // 邮箱
    password: { type: String, required: true }, // 密码
    username: { type: String, required: true }, // 用户名字
    avatar: { type: String }, // 用户头像
    createdAt: { type: Date, default: Date.now }, // 创建时间
    updatedAt: { type: Date, default: Date.now }, // 更新时间
  });

  UserSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
  });

  return mongoose.model('User', UserSchema);
};