// webhook.js
const express = require("express");
const bodyParser = require("body-parser");
const { WebhookClient } = require("dialogflow-fulfillment");

const app = express();
app.use(bodyParser.json());

const catPrices = {
  "anh lông ngắn": "2.000.000 - 4.000.000 VND",
  "xiêm": "1.500.000 - 3.000.000 VND",
  "ba tư": "3.000.000 - 6.000.000 VND",
  "bengal": "5.000.000 - 8.000.000 VND",
  "mướp": "500.000 - 1.000.000 VND"
};

let orderContext = {};

app.post("/", (req, res) => {
  const agent = new WebhookClient({ request: req, response: res });

  function welcome(agent) {
    agent.add("Chào bạn! Mình là chatbot tư vấn mèo cưng 🐱 Bạn muốn tìm giống mèo nào ạ?");
  }

  function fallback(agent) {
    agent.add("Xin lỗi, mình chưa hiểu ý bạn. Bạn có thể nói lại không?");
  }

  function getCatBreed(agent) {
    const breed = agent.parameters["CatBreed"];
    if (breed) {
      orderContext.breed = breed;
      agent.add(`Bên mình có mèo ${breed} nha. Bạn muốn hỏi giá, tuổi hay giới tính nè?`);
    } else {
      agent.add("Bạn muốn giống mèo nào vậy ạ?");
    }
  }

  function getCatPrice(agent) {
    const breed = agent.parameters["CatBreed"] || orderContext.breed;
    if (breed && catPrices[breed]) {
      orderContext.breed = breed;
      agent.add(`Giá của mèo ${breed} là: ${catPrices[breed]}`);
    } else {
      agent.add("Hiện mình chưa có giá cho giống mèo này hoặc bạn chưa chọn giống ạ.");
    }
  }

  function getCatAge(agent) {
    let age = agent.parameters["age"];
    console.log("Age received:", age);
  
    // Nếu age là mảng, lấy phần tử đầu tiên
    if (Array.isArray(age)) {
      age = age[0];
    }
  
    // Kiểm tra nếu age tồn tại và không rỗng
    if (age && typeof age === "string" && age.trim() !== "") {
      orderContext.age = age;
      agent.add(`Bên mình có mèo ${age} nha. Bạn muốn hỏi thêm gì không?`);
    } else {
      agent.add("Bạn muốn mua mèo bao nhiêu tháng tuổi ạ?");
    }
  }
  function getPetCareAdvice(agent) {
    agent.add("Dưới đây là một số mẹo chăm sóc mèo cơ bản:\n\n" +
      "1. 🥣 Cho mèo ăn đúng bữa, tránh cho ăn đồ ngọt và xương nhỏ.\n" +
      "2. 🚰 Luôn để nước sạch cho mèo uống.\n" +
      "3. 🧼 Vệ sinh khay cát và nơi ở thường xuyên.\n" +
      "4. 🐾 Tiêm phòng và tẩy giun định kỳ.\n" +
      "5. 🧸 Dành thời gian chơi với mèo, tạo không gian vận động.\n\n" +
      "Bạn cần tư vấn thêm gì nữa không ạ?");
  }
  

  function getCatGender(agent) {
    const gender = agent.parameters["catgender"];
    if (gender) {
      orderContext.gender = gender;
      agent.add(`Bên mình có mèo ${gender} nha. Bạn muốn đặt mua luôn không?`);
    } else {
      agent.add("Bạn muốn mua mèo đực hay cái ạ?");
    }
  }
  function askUserInfo(agent) {
    if (!orderContext.breed || !orderContext.age || !orderContext.gender) {
      agent.add("Bạn chưa chọn đủ thông tin mèo (giống, tuổi, giới tính) ạ. Vui lòng chọn trước rồi hãy đặt đơn nhé!");
      return;
    }
    agent.add("Tuyệt vời! Bạn vui lòng cho mình biết tên, số điện thoại và địa chỉ để mình chốt đơn nhé!");
  }
  
  
  function confirmOrder(agent) {
    const name = agent.parameters["name"];
    const phone = agent.parameters["phone"];
    const address = agent.parameters["address"];


    if (name && phone && address) {
      agent.add(`Cảm ơn ${name}. Shop sẽ liên hệ qua số ${phone} và giao mèo ${orderContext.breed}, ${orderContext.age}, ${orderContext.gender} đến địa chỉ: ${address}. ❤️`);
    } else {
      agent.add("Bạn vui lòng cung cấp đầy đủ tên, số điện thoại và địa chỉ để mình chốt đơn nhé.");
    }
  }

  if (!orderContext.breed || !orderContext.age || !orderContext.gender) {
    agent.add("Bạn chưa chọn đủ thông tin mèo (giống, tuổi, giới tính) ạ. Vui lòng chọn trước rồi hãy đặt đơn nhé!");
    return;
  }
  function handleUnexpectedUserInfo(agent) {
    agent.add("Bạn chưa chọn mèo mà đã gửi thông tin. Vui lòng chọn giống mèo, tuổi và giới tính trước nhé 🐱");
  }

  let intentMap = new Map();
  intentMap.set("Default Welcome Intent", welcome);
  intentMap.set("Default Fallback Intent", fallback);
  intentMap.set("AskBreed", getCatBreed);
  intentMap.set("AskPrice", getCatPrice);
  intentMap.set("AskAge", getCatAge);
  intentMap.set("AskGender", getCatGender);
  intentMap.set("PlaceOrder", confirmOrder);
  intentMap.set("UnexpectedUserInfo", handleUnexpectedUserInfo);
  intentMap.set("PetCareAdvice", getPetCareAdvice);
  intentMap.set("ConfirmBuyYes", askUserInfo);
  intentMap.set("AskUserInfo", askUserInfo);




  agent.handleRequest(intentMap);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Webhook server is running on port ${PORT}`);
});