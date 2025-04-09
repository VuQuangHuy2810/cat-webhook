const express = require("express");
const bodyParser = require("body-parser");
const { WebhookClient } = require("dialogflow-fulfillment");

const app = express();
app.use(bodyParser.json());

app.post("/", (req, res) => {
  const agent = new WebhookClient({ request: req, response: res });

  // Dữ liệu mẫu cho giá mèo
  const catPrices = {
    "anh lông ngắn": "2.000.000 - 4.000.000 VND",
    "xiêm": "1.500.000 - 3.000.000 VND",
    "ba tư": "3.000.000 - 6.000.000 VND",
    "bengal": "5.000.000 - 8.000.000 VND",
    "mướp": "500.000 - 1.000.000 VND"
  };

  function welcome(agent) {
    agent.add("Chào bạn! Mình là chatbot tư vấn mèo cưng 🐱 Bạn muốn tìm giống mèo nào ạ?");
  }

  function fallback(agent) {
    agent.add("Xin lỗi, mình chưa hiểu ý bạn. Bạn có thể nói lại không?");
  }

  function getCatPrice(agent) {
    const breed = agent.parameters["CatBreed"];
    const price = catPrices[breed] || "Hiện mình chưa có giá cho giống mèo này.";
    agent.add(`Giá của mèo ${breed} là khoảng: ${price}`);
  }

  function getCatAge(agent) {
    const age = agent.parameters["AgeRange"];
    agent.add(`Bên mình có mèo ${age} tháng tuổi. Bạn muốn biết về giá hay giới tính không?`);
  }

  function getCatGender(agent) {
    const gender = agent.parameters["CatGender"];
    agent.add(`Bên mình có mèo ${gender} nha bạn. Bạn muốn chốt đơn hay cần tư vấn thêm gì nữa không?`);
  }

  function confirmOrder(agent) {
    const name = agent.parameters["name"];
    const phone = agent.parameters["phone"];
    const address = agent.parameters["address"];
    agent.add(`Cảm ơn ${name}. Shop sẽ liên hệ qua số ${phone} và giao mèo đến địa chỉ: ${address}. ❤️`);
  }

  let intentMap = new Map();
  intentMap.set("Default Welcome Intent", welcome);
  intentMap.set("Default Fallback Intent", fallback);
  intentMap.set("AskPrice", getCatPrice);
  intentMap.set("AskAge", getCatAge);
  intentMap.set("AskGender", getCatGender);
  intentMap.set("PlaceOrder", confirmOrder);

  agent.handleRequest(intentMap);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Webhook server is running on port ${100000}`);
});
