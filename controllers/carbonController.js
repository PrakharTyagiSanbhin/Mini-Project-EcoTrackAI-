const calculateCarbon = require("../utils/carbonCalculator");

exports.calculate = (req, res) => {
    try {
        console.log("Assessment data received:", req.body);

        const result = calculateCarbon(req.body);

        console.log("Carbon calculation result:", result);

        res.status(200).json({
            success: true,
            carbon: result
        });

    } catch (error) {
        console.error("Carbon calculation error:", error);

        res.status(500).json({
            success: false,
            message: "Carbon calculation failed.",
            error: error.message
        });
    }
};