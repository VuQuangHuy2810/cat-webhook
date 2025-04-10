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
  function handleUnexpectedUserInfo(agent) {
    agent.add("Tôi chưa hiểu bạn muốn làm gì với thông tin này. Bạn có muốn đặt mua mèo không?");
  }
  function confirmOrder(agent) {
    const name = agent.parameters["name"];
    const phone = agent.parameters["phone"];
    const address = agent.parameters["address"];
  
    // Kiểm tra context xem người dùng đã chọn giống chưa
    const breed = agent.context.get("breed-followup")?.parameters?.catBreed;
    const age = agent.context.get("age-followup")?.parameters?.catAge;
    const gender = agent.context.get("gender-followup")?.parameters?.catGender;
  
    if (!breed || !age || !gender) {
      agent.add("Bạn vui lòng chọn giống mèo, tuổi và giới tính trước khi chốt đơn nhé. 🐾");
      return;
    }
  
    if (name && phone && address) {
      agent.add(`Đơn hàng đã được ghi nhận! Cảm ơn ${name}, chúng tôi sẽ liên hệ số ${phone} và giao mèo đến: ${address}. 🐱`);
    } else {
      agent.add("Bạn vui lòng cung cấp đầy đủ tên, số điện thoại và địa chỉ để chốt đơn nhé.");
    }
  }
  
  

  let intentMap = new Map();
  intentMap.set("Default Welcome Intent", welcome);
  intentMap.set("Default Fallback Intent", fallback);
  intentMap.set("AskPrice", getCatPrice);
  intentMap.set("AskAge", getCatAge);
  intentMap.set("AskGender", getCatGender);
  intentMap.set("PlaceOrder", confirmOrder);
  intentMap.set("UnexpectedUserInfo", handleUnexpectedUserInfo);


  agent.handleRequest(intentMap);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Webhook server is running on port ${100000}`);
});
