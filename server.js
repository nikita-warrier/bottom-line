const express = require("express");
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

const app = express();

const PORT = 3000;

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.use(express.json());

app.use(express.static(__dirname));


app.post("/api/branding", async (req, res) => {

    try {

        const { message } = req.body;

        const response = await ai.models.generateContent({

            model: "gemini-3.6-flash",

            contents: `
You are an expert brand strategist helping a business owner
create their brand identity.

The user is having a conversation with you about their company.

User's latest message:
"${message}"

Your job is to:

1. Understand information the user has provided about their brand.
2. Identify which branding fields can be updated based on their message.
3. Generate useful branding information when the user has provided
   enough information to do so.
4. Ask a helpful follow-up question so the conversation can continue.

Return ONLY valid JSON.

Use exactly this structure:

{
    "message": "Your conversational response to the user",
    "updates": {
        "companyName": "",
        "mission": "",
        "vision": "",
        "goals": [],
        "colors": [],
        "headingFont": "",
        "bodyFont": "",
        "misc": ""
    }
}

IMPORTANT RULES:

- Only fill in fields when the user's message provides enough
  information to reasonably do so.
- Do NOT invent information about the company.
- Keep existing information unchanged by returning an empty string
  or empty array for fields that should not be updated.
- "goals" must be an array of strings.
- "colors" must be an array of color names or HEX codes.
- Keep the response friendly and conversational.
- Ask only one follow-up question at a time.
- Do not use Markdown.
- Return ONLY the JSON object.
`

        });

        const text = response.text;

        console.log("Gemini response:");
        console.log(text);


        // Remove possible markdown code fences

        const cleanedText = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();


        const data = JSON.parse(cleanedText);


        res.json(data);


    } catch (error) {

        console.error("Gemini error:", error);

        res.status(500).json({

            error: "Something went wrong with the AI."

        });

    }

});


app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});