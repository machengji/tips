const Controller = require('egg').Controller;
const path = require('path');
const fs = require('fs');

class DownloadController extends Controller {
  async apk() {
    const { ctx } = this;
    const apkPath = path.join(this.app.baseDir, 'app/public', 'micohabit.apk'); // 替换为你的 APK 文件路径
    // console.log('apkPath', apkPath);
    // console.log('this.app.baseDir', fs.existsSync(apkPath));
    // 检查文件是否存在
    if (fs.existsSync(apkPath)) {
      console.log('apkPath', apkPath);
      ctx.set('Content-Disposition', 'attachment; filename=micohabit.apk'); // 设置下载文件名
      ctx.body = fs.createReadStream(apkPath); // 读取文件流
    } else {
      ctx.status = 404;
      ctx.body = 'File not found';
    }
  }
}

module.exports = DownloadController; 