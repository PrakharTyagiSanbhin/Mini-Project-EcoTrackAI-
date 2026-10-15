const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const connectDB = require("./config/db");

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);

const carbonRoutes =
    require("./routes/carbonRoutes");

const aiRoutes =
    require("./routes/aiRoutes");

app.use(
    "/api/carbon",
    carbonRoutes
);

app.use(
    "/api/ai",
    aiRoutes
);

app.get("/", (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            "public",
            "index.html"
        )
    );
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
});

const PORT =
    process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(
        `🚀 Server running on port ${PORT}`
    );
});