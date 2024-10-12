const moment = require('moment-timezone');
module.exports = function () {
  setInterval(async () => {
    const thoiGianHienTai = moment.tz("Asia/Ho_Chi_MinH");

    const timeRestart = [
      { gio: 0, phut: 30, giay: 0 },
      { gio: 6, phut: 30, giay: 0 },
      { gio: 12, phut: 30, giay: 0 },
      { gio: 18, phut: 30, giay: 0 }
    ];
  
    for (const thoiDiem of timeRestart) {
      if (
        thoiGianHienTai.hour() === thoiDiem.gio &&
        thoiGianHienTai.minute() === thoiDiem.phut &&
        thoiGianHienTai.second() === thoiDiem.giay
      ) {
        process.exit(1);
      }
    }
  }, 1000);
};
