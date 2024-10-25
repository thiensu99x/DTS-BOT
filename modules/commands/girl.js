module.exports.config = {
    name: "girl",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "DTS",
    description: "Random ảnh",
    commandCategory: "Video",
    usages: "",
    cooldowns: 5,
    dependencies: {
        "request": "",
        "fs-extra": "",
        "axios": ""
    }
};

module.exports.run = async ({ api, event, args, Users, Threads, Currencies }) => {
    const axios = global.nodemodule["axios"];
    const fs = global.nodemodule["fs-extra"];

    // URL của API để lấy ảnh
    const apiUrl = "https://apiquockhanh.click/images/girl";

    // Lấy dữ liệu người dùng
    var data = await Currencies.getData(event.senderID);
    var money = data.money;

    // Kiểm tra số tiền trong tài khoản
    if (money < 500) {
        api.sendMessage("→ Bạn cần 500$ để xem ảnh ?", event.threadID, event.messageID);
    } else {
        // Trừ tiền khỏi tài khoản của người dùng
        Currencies.setData(event.senderID, { money: money - 500 });

        try {
            // Lấy ảnh từ API
            const response = await axios.get(apiUrl);
            // console.log("Phản hồi từ API:", response.data); // In ra phản hồi để kiểm tra

            const imageUrl = response.data.url; // Lấy URL từ trường "url"

            // Kiểm tra xem imageUrl có hợp lệ không
            if (!imageUrl) {
                throw new Error("Không tìm thấy URL hình ảnh trong phản hồi từ API");
            }

            // Gửi tin nhắn kèm ảnh
            const callback = () => api.sendMessage({
                body: ` Ảnh của bạn đây\n→ -500$ !`,
                attachment: fs.createReadStream(__dirname + "/cache/1.jpg")
            }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.jpg"), event.messageID);

            // Tải ảnh và lưu vào bộ nhớ cache
            const imageResponse = await axios({
                method: 'get',
                url: imageUrl,
                responseType: 'stream'
            });

            // Lưu ảnh vào file hệ thống
            imageResponse.data.pipe(fs.createWriteStream(__dirname + "/cache/1.jpg")).on("finish", () => {
                callback();
            });

        } catch (error) {
            console.error(error);
            api.sendMessage("Lỗi khi tải ảnh: " + error.message, event.threadID, event.messageID);
        }
    }
};
