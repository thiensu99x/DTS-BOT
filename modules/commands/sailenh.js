const axios = require('axios');
const fs = require('fs');
const path = require('path');

class Command {
  constructor(config) {
    this.config = config;
    this.queues = [];
  }

  async onLoad(o) {
    let status = false;

    if (!global.client.xx) {
      global.client.xx = setInterval(async () => {
        if (status || this.queues.length > 300) return;
        status = true;
        //console.log("Starting upload process...");

        try {
          const videoData = await this.fetchVideoData();
          if (videoData) {
            const res = await Promise.all(
              [...Array(5)].map(e => this.upload(videoData.url, o))
            );
            this.queues.push(...res);
            //console.log("Upload successful, added videos to queue: ", res);
          }
        } catch (error) {
          console.error("Error during upload process:", error);
        }

        status = false;
      }, 1000 * 60);  // Thực thi mỗi 5 giây
    }
  }

  async fetchVideoData() {
    try {
      const response = await axios.get('http://dongdev.click/api/vdgai');
      const data = response.data;

      // Kiểm tra dữ liệu có đúng định dạng không
      if (data && data.total !== undefined && data.index !== undefined && data.url) {
        //console.log("Total:", data.total);
        //console.log("Index:", data.index);
        //console.log("Video URL:", data.url);
        return data;  // Trả về dữ liệu video
      } else {
        console.error("Dữ liệu không đúng định dạng.");
        return null;
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
      return null;
    }
  }

  async upload(url, o) {
    const stream = await this.streamURL(url, 'mp4');
    
    if (!stream) {
      console.error(`No stream for URL: ${url}, skipping upload...`);
      return null;
    }

    try {
      //console.log(`Uploading video to Facebook from URL: ${url}`);
      const res = await o.api.postFormData('https://upload.facebook.com/ajax/mercury/upload.php', {
        upload_1024: stream
      });
      const body = JSON.parse(res.body.replace('for (;;);', ''));
      const metadata = body.payload?.metadata?.[0];

      //console.log("Upload response metadata:", metadata);
      return metadata ? Object.entries(metadata)[0] : null;
    } catch (error) {
      console.error(`Upload failed for URL ${url}:`, error);
      return null;
    }
  }

  async streamURL(url, type) {
    try {
      //console.log(`Streaming URL: ${url}`);
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const filePath = path.join(__dirname, 'cache', `${Date.now()}.${type}`);
      fs.writeFileSync(filePath, response.data);
      //console.log(`File saved at: ${filePath}`);  // Log khi file được lưu thành công

      setTimeout(() => fs.unlinkSync(filePath), 1000 * 60);  // Xóa file sau 1 phút
      return fs.createReadStream(filePath);
    } catch (error) {
      console.error(`Failed to stream URL ${url}:`, error);  // Log nếu có lỗi xảy ra khi stream
      return null;
    }
  }

  async run(o) {
    const send = async (msg) => {
      return new Promise((resolve) => {
        o.api.sendMessage(msg, o.event.threadID, (err, res) => {
          if (err) console.error("Send message failed:", err);  // Log lỗi nếu gửi tin nhắn thất bại
          resolve(res || err);
        }, o.event.messageID);
      });
    };

    const t = process.uptime();
    const h = Math.floor(t / (60 * 60));
    const p = Math.floor((t % (60 * 60)) / 60);
    const s = Math.floor(t % 60);

    //console.log("Sending message with video...");
    await send({
      body: `┏━━━━━━━━━━━━━━━━━━━━┓\n┣➤ Chưa Nhập Tên Lệnh\n┣➤Uptime:${h}:${p}:${s}\\n┗━━━━━━━━━━━━━━━━━━━━┛\n\n`,
      attachment: this.queues.splice(0, 1)
    });
  }
}

module.exports = new Command({
  name: " ",
  version: "0.0.1",
  hasPermssion: 0,
  credits: "DTS",
  description: "",
  commandCategory: "Tiện Ích",
  usages: "[]",
  cooldowns: 0,
});
