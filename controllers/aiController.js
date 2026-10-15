const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.climateCoach = async (req, res) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({
                error: "Gemini API key is missing"
            });
        }

        const genAI = new GoogleGenerativeAI(
            process.env.GEMINI_API_KEY
        );

        const model = genAI.getGenerativeModel({
            model: "gemini-3.5-flash-lite"
        });

        const data = req.body;

        if (!data || !data.name) {
            return res.status(400).json({
                error: "Incomplete student data"
            });
        }

        const prompt = `
You are an environmental expert and climate coach.

Student Data:

Name: ${data.name}
Transport: ${data.transport}
Distance: ${data.distance} km per day
AC Usage: ${data.acHours} hours per day
Meals: ${data.meals} per day
Plastic Bottles: ${data.plasticBottles} per week

Provide:

1. Carbon Analysis
2. Three personalised eco-friendly suggestions
3. Eco Score out of 100

Keep the answer under 150 words.
`;

        const result =
            await model.generateContent(prompt);

        res.json({
            response: result.response.text()
        });

    } catch (err) {
        console.error(
            "Gemini Error:",
            err
        );

        res.status(500).json({
            error: "AI Error",
            details: err.message
        });
    }
};


exports.futureMe = async (req, res) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({
                error: "Gemini API key is missing"
            });
        }

        const genAI = new GoogleGenerativeAI(
            process.env.GEMINI_API_KEY
        );

        const model = genAI.getGenerativeModel({
            model: "gemini-3.5-flash-lite"
        });

        const {
            assessment,
            question
        } = req.body;

        if (!assessment) {
            return res.status(400).json({
                error: "Assessment data is required"
            });
        }

        if (
            !question ||
            !question.trim()
        ) {
            return res.status(400).json({
                error: "Question is required"
            });
        }

        const prompt = `
You are EcoTrack AI, an environmental climate coach.

Current user data:

Name: ${assessment.name || "User"}
Transport: ${assessment.transport || "Unknown"}
Daily distance: ${assessment.distance || "Unknown"} km
AC usage: ${assessment.acHours || "Unknown"} hours
Meals: ${assessment.meals || "Unknown"}
Plastic bottles per week: ${assessment.plasticBottles || "Unknown"}

Future question:
${question}

Answer specifically about the proposed future change.

Include:

1. 🌍 Estimated impact on carbon footprint
2. 📉 Whether emissions would likely increase or decrease
3. 🌱 Three benefits
4. 💡 One practical recommendation

Keep the answer under 150 words.
`;

        const result =
            await model.generateContent(prompt);

        res.json({
            response: result.response.text()
        });

    } catch (err) {
        console.error(
            "Future Me Error:",
            err
        );

        res.status(500).json({
            error: "AI Error",
            details: err.message
        });
    }
};