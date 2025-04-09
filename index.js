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

  function welcome(agent) {
    agent.add("Xin chào! Tôi có thể giúp bạn tư vấn và đặt mua mèo. Bạn cần gì?");
  }

  function fallback(agent) {
    agent.add("Tôi chưa hiểu ý bạn. Bạn có thể hỏi lại không?");
  }

  function getCatPrice(agent) {
    const breed = agent.parameters["meo_giong"];
    const price = catPrices[breed] || "Giống mèo này hiện chưa có giá.";
    agent.add(`Giá của ${breed} là: ${price}`);
  }

  function getCatAge(agent) {
    const age = agent.parameters["meo_tuoi"];
    agent.add(`Tuổi của mèo là ${age} tháng.`);
  }

  function getCatGender(agent) {
    const gender = agent.parameters["meo_gioitinh"];
    agent.add(`Giới tính mèo là: ${gender}`);
  }

  function confirmOrder(agent) {
    const name = agent.parameters["ten"];
    const phone = agent.parameters["sdt"];
    const address = agent.parameters["diachi"];
    agent.add(`Đơn hàng đã được ghi nhận! Cảm ơn ${name}, chúng tôi sẽ liên hệ số ${phone} và giao hàng đến: ${address}.`);
  }

  let intentMap = new Map();
  intentMap.set("Default Welcome Intent", welcome);
  intentMap.set("Default Fallback Intent", fallback);
  intentMap.set("Hỏi giá mèo", getCatPrice);
  intentMap.set("Hỏi tuổi mèo", getCatAge);
  intentMap.set("Hỏi giới tính mèo", getCatGender);
  intentMap.set("Chốt đơn", confirmOrder);

  agent.handleRequest(intentMap);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Webhook is running on port ${PORT}`));
