const express = require("express");
const bodyParser = require("body-parser");
const { WebhookClient } = require("dialogflow-fulfillment");

const app = express();
app.use(bodyParser.json());

app.post("/", (req, res) => {
  const agent = new WebhookClient({ request: req, response: res });

  // Dữ liệu mẫu
  const catPrices = {
    "anh long ngan": "2.000.000 - 4.000.000 VND",
    "xiem": "1.500.000 - 3.000.000 VND",
    "ba tu": "3.000.000 - 6.000.000 VND",
    "bengal": "5.000.000 - 8.000.000 VND",
    "muop": "500.000 - 1.000.000 VND"
  };

  function askPrice(agent) {
    const breed = agent.parameters.catBreed;
    const price = catPrices[breed];
    if (price) {
      agent.add(`Giá của mèo ${CatBreed} là khoảng ${catPrice}.`);
    } else {
      agent.add("Hiện tại mình chưa có giá cho giống mèo này.");
    }
  }

  function askAge(agent) {
    const age = agent.parameters.AgeRange;
    if (age) {
      agent.add(`Bên mình có mèo ${AgeRange} tháng tuổi. Bạn muốn biết về giá hay giới tính không?`);
    } else {
      agent.add("Bạn muốn mèo bao nhiêu tháng tuổi ạ?");
    }
  }

  function askGender(agent) {
    const gender = agent.parameters.CatGender;
    if (gender === "duc") {
      agent.add("Bên mình có mèo đực nha bạn. Bạn muốn chốt đơn hay cần tư vấn thêm?");
    } else if (gender === "cai") {
      agent.add("Bên mình có mèo cái nha bạn. Bạn muốn chốt đơn hay cần tư vấn thêm?");
    } else {
      agent.add("Bạn muốn mèo đực hay cái ạ?");
    }
  }

  function placeOrder(agent) {
    const name = agent.parameters.name;
    const phone = agent.parameters.phone;
    const address = agent.parameters.Address;
    if (name && phone && address) {
      agent.add(`Cảm ơn ${name}. Shop sẽ liên hệ qua số ${phone} và giao mèo đến địa chỉ: ${Address}. ❤️`);
    } else {
      agent.add("Bạn vui lòng cung cấp đầy đủ tên, số điện thoại và địa chỉ để shop chốt đơn nhé!");
    }
  }

  let intentMap = new Map();
  intentMap.set("AskPrice", askPrice);
  intentMap.set("AskAge", askAge);
  intentMap.set("AskGender", askGender);
  intentMap.set("PlaceOrder", placeOrder);

  agent.handleRequest(intentMap);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Webhook server is running on port ${100000}`);
});
