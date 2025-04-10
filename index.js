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
      console.log("Chọn giống:", breed);
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

    if (Array.isArray(age)) {
      age = age[0];
    }

    if (age && typeof age === "string" && age.trim() !== "") {
      orderContext.age = age;
      console.log("Chọn tuổi:", age);
      agent.add(`Bên mình có mèo ${age} nha. Bạn muốn hỏi thêm gì không?`);
    } else {
      agent.add("Bạn muốn mua mèo bao nhiêu tháng tuổi ạ?");
    }
  }
  function askVaccinationIncluded(agent) {
    agent.add("Giá đã bao gồm chi phí tiêm ngừa cơ bản cho mèo rồi ạ 🐾.");
  }
  
  function askPromotion(agent) {
    agent.add("Hiện tại bên shop đang có chương trình giảm 10% cho đơn hàng từ 2 bé trở lên và tặng kèm đồ chơi 🧸.");
  }
  
  function askDiscountForTwo(agent) {
    agent.add("Nếu bạn mua 2 bé sẽ được giảm giá 10% trên tổng hóa đơn nha 🐱🐱.");
  }
  
  function askVaccinatedStatus(agent) {
    agent.add("Tất cả mèo bên mình đều đã được tiêm ngừa trước khi giao đến tay khách hàng ạ 💉.");
  }
  
  function askVaccinationBook(agent) {
    agent.add("Có ạ! Mỗi bé sẽ có sổ tiêm riêng, ghi rõ ngày tiêm và loại vắc-xin ✅.");
  }
  
  function askCatHealth(agent) {
    agent.add("Bên mình cam kết mèo khỏe mạnh, không bệnh nền. Có thể kiểm tra trước khi nhận 🩺.");
  }
  
  function askShippingAvailability(agent) {
    agent.add("Dạ có ạ! Bên mình hỗ trợ giao mèo tận nơi toàn quốc qua các đơn vị uy tín 🚚.");
  }
  
  function askShippingFee(agent) {
    agent.add("Phí vận chuyển tùy theo địa chỉ, trong TP.HCM khoảng 30.000 - 50.000đ. Ngoại tỉnh sẽ báo cụ thể khi bạn cung cấp địa chỉ nhé 🗺️.");
  }
  
  function askCheckBeforeAccept(agent) {
    agent.add("Dạ bạn có thể kiểm tra mèo trước khi nhận hàng để đảm bảo đúng yêu cầu nha 🕵️‍♂️.");
  }
  
  function askPaymentMethods(agent) {
    agent.add("Shop chấp nhận thanh toán tiền mặt, chuyển khoản, và ví điện tử (Momo, ZaloPay, v.v.) 💳.");
  }
  
  function askWarranty(agent) {
    agent.add("Nếu mèo bị bệnh trong 7 ngày đầu (do lỗi bên shop), bạn có thể đổi hoặc hoàn tiền theo chính sách bảo hành 🛡️.");
  }
  
  function askShopLocation(agent) {
    agent.add("Shop mình ở Quận 10, TP.HCM. Có thể ghé trực tiếp để xem bé nhé 🏠.");
  }
  
  function askWorkingHours(agent) {
    agent.add("Shop mở cửa từ 9:00 sáng đến 8:00 tối mỗi ngày, kể cả cuối tuần ạ 🕘.");
  }
  
  function askContactInfo(agent) {
    agent.add("Bạn có thể liên hệ qua số 0933 701 000 (có Zalo luôn nha) ☎️.");
  }
  
  function askVisitInPerson(agent) {
    agent.add("Hoàn toàn được ạ! Bạn có thể đến trực tiếp shop để xem và chọn mèo ưng ý nhất 🐾.");
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
      console.log("Chọn giới tính:", gender);
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
      console.log("Đơn hàng hoàn tất:", { name, phone, address, ...orderContext });

      // Reset sau khi đặt hàng
      orderContext = {};
    } else {
      agent.add("Bạn vui lòng cung cấp đầy đủ tên, số điện thoại và địa chỉ để mình chốt đơn nhé.");
    }
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
  intentMap.set("AskVaccinationIncluded", askVaccinationIncluded);
  intentMap.set("AskPromotion", askPromotion);
  intentMap.set("AskDiscountForTwo", askDiscountForTwo);
  intentMap.set("AskVaccinatedStatus", askVaccinatedStatus);
  intentMap.set("AskVaccinationBook", askVaccinationBook);
  intentMap.set("AskCatHealth", askCatHealth);
  intentMap.set("AskShippingAvailability", askShippingAvailability);
  intentMap.set("AskShippingFee", askShippingFee);
  intentMap.set("AskCheckBeforeAccept", askCheckBeforeAccept);
  intentMap.set("AskPaymentMethods", askPaymentMethods);
  intentMap.set("AskWarranty", askWarranty);
  intentMap.set("AskShopLocation", askShopLocation);
  intentMap.set("AskWorkingHours", askWorkingHours);
  intentMap.set("AskContactInfo", askContactInfo);
  intentMap.set("AskVisitInPerson", askVisitInPerson);


  agent.handleRequest(intentMap);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Webhook server is running on port ${PORT}`);
});
