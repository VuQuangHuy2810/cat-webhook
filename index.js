const express = require("express");
const bodyParser = require("body-parser");
const { WebhookClient } = require("dialogflow-fulfillment");

const app = express();
app.use(bodyParser.json());

app.post("/", (req, res) => {
  const agent = new WebhookClient({ request: req, response: res });

  const catPrices = {
    "Mèo Anh lông ngắn": "3.000.000 VND",
    "Mèo Ba Tư": "4.500.000 VND",
    "Mèo Munchkin": "6.000.000 VND",
    "Mèo Sphynx": "10.000.000 VND"
  };

  // Chào người dùng
  function welcome(agent) {
    agent.add("Xin chào! Tôi có thể giúp bạn tư vấn và đặt mua mèo. Bạn muốn biết gì ạ?");
  }

  // Nếu bot không hiểu
  function fallback(agent) {
    agent.add("Xin lỗi, tôi chưa hiểu ý bạn. Bạn có thể nói lại được không?");
  }

  // Lấy giá mèo theo giống
  function getCatPrice(agent) {
    const breed = agent.parameters["CatBreed"];
    const price = catPrices[breed] || "Xin lỗi, giống mèo này hiện chưa có giá trong hệ thống.";
    agent.add(`Giá của ${breed} là: ${price}`);
  }

  // Lấy tuổi mèo
  function getCatAge(agent) {
    const age = agent.parameters["CatAge"];
    agent.add(`Tuổi của mèo là: ${age} tháng.`);
  }

  // Lấy giới tính mèo
  function getCatGender(agent) {
    const gender = agent.parameters["CatGender"];
    agent.add(`Giới tính của mèo là: ${gender}.`);
  }

  // Chốt đơn hàng
  function confirmOrder(agent) {
    const name = agent.parameters["CustomerName"];
    const phone = agent.parameters["PhoneNumber"];
    const address = agent.parameters["Address"];
    agent.add(`Đơn hàng đã được ghi nhận! Cảm ơn ${name}, chúng tôi sẽ liên hệ qua số ${phone} và giao hàng đến địa chỉ: ${address}.`);
  }

  // Map intent đến function
  let intentMap = new Map();
  intentMap.set("Default Welcome Intent", welcome);
  intentMap.set("Default Fallback Intent", fallback);
  intentMap.set("Hỏi giá mèo", getCatPrice);
  intentMap.set("Hỏi tuổi mèo", getCatAge);
  intentMap.set("Hỏi giới tính mèo", getCatGender);
  intentMap.set("Chốt đơn", confirmOrder);

  agent.handleRequest(intentMap);
});

// Khởi chạy server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Webhook is running on port ${PORT}`));
