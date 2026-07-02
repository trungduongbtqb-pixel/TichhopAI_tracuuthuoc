require("dotenv").config();
console.log("===== ĐANG CHẠY SERVER GEMINI =====");
const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const app = express();

app.use(cors());
app.use(express.json());

// Cho phép truy cập website trong thư mục public
app.use(express.static("public"));

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});
app.post("/api/chat", async (req, res) => {

    try {

        const question = req.body.question;
        console.log("Câu hỏi nhận được:", question);
        const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
Bạn là AI Pharma Copilot.

Bạn là dược sĩ lâm sàng.

Chỉ trả lời các câu hỏi liên quan đến thuốc.

Luôn trả lời bằng tiếng Việt.

Nếu không chắc chắn thì hãy nói rõ và khuyến nghị tham khảo Dược thư Quốc gia hoặc bác sĩ/dược sĩ.

Câu hỏi: ${question}
`
});

    console.log("===== RESULT =====");
    console.dir(result, { depth: null });
    const answer = result.candidates[0].content.parts[0].text;

res.json({
    answer: answer
});
        

    } catch (err) {

        console.error(err);

        res.status(500).json({

            answer: "Không thể kết nối AI."

        });

    }

});
app.listen(3000, () => {

    console.log("===================================");

    console.log("AI Pharma Copilot đang chạy");

    console.log("http://localhost:3000");

    console.log("===================================");

});