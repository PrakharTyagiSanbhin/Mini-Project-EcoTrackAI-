let assessmentData = {};
let carbonResult = {};

let pieChart = null;
let lineChart = null;

try {
    assessmentData =
        JSON.parse(
            localStorage.getItem(
                "assessmentData"
            )
        ) || {};

    carbonResult =
        JSON.parse(
            localStorage.getItem(
                "carbonResult"
            )
        ) || {};

} catch (error) {
    console.error(
        "Unable to read saved data:",
        error
    );
}

document.addEventListener(
    "DOMContentLoaded",
    function () {

        if (
            !assessmentData ||
            !assessmentData.name
        ) {
            alert(
                "Please complete the climate assessment first."
            );

            window.location.href =
                "assessment.html";

            return;
        }

        loadWelcome();

        displayCarbon();

        createAnalytics();

        loadClimateCoach();

        setupFutureAI();

        setupPDF();
    }
);


function loadWelcome() {

    const element =
        document.getElementById(
            "welcome"
        );

    if (!element) {
        return;
    }

    element.innerHTML =
        `Welcome ${escapeHTML(
            assessmentData.name
        )} 👋`;
}


function displayCarbon() {

    const carbonData =
        carbonResult.carbon;

    if (!carbonData) {
        console.error(
            "Carbon result not found."
        );
        return;
    }

    const carbon =
        Number(
            carbonData.carbon
        ) || 0;

    setText(
        "carbon",
        carbon.toFixed(1) +
        " kg/day"
    );

    let score =
        Math.max(
            0,
            100 - carbon * 8
        );

    score =
        Math.round(score);

    setText(
        "score",
        score + "/100"
    );

    let badge;

    if (score >= 90) {
        badge = "🥇 Eco Hero";
    } else if (score >= 75) {
        badge = "🥈 Green Warrior";
    } else {
        badge = "🥉 Eco Learner";
    }

    setText(
        "badge",
        badge
    );
}


function createAnalytics() {

    const transport =
        String(
            assessmentData.transport ||
            ""
        ).toLowerCase();

    const distance =
        Number(
            assessmentData.distance
        ) || 0;

    const ac =
        Number(
            assessmentData.acHours
        ) || 0;

    const food =
        Number(
            assessmentData.meals
        ) || 0;

    const plastic =
        Number(
            assessmentData.plasticBottles
        ) || 0;

    let transportFactor = 0;

    if (
        transport.includes("car") ||
        transport.includes("petrol") ||
        transport.includes("diesel")
    ) {
        transportFactor = 0.21;

    } else if (
        transport.includes("bus")
    ) {
        transportFactor = 0.08;

    } else if (
        transport.includes("bike") ||
        transport.includes("motorcycle") ||
        transport.includes("scooter")
    ) {
        transportFactor = 0.10;

    } else if (
        transport.includes("bicycle") ||
        transport.includes("cycle") ||
        transport.includes("walk") ||
        transport.includes("walking")
    ) {
        transportFactor = 0;
    }

    const transportEmission =
        Number(
            (
                distance *
                transportFactor
            ).toFixed(2)
        );

    const acEmission =
        Number(
            (
                ac *
                0.4
            ).toFixed(2)
        );

    const foodEmission =
        Number(
            (
                food *
                0.3
            ).toFixed(2)
        );

    const plasticEmission =
        Number(
            (
                (
                    plastic /
                    7
                ) *
                0.05
            ).toFixed(2)
        );

    setText(
        "transportEmission",
        transportEmission +
        " kg/day"
    );

    setText(
        "acEmission",
        acEmission +
        " kg/day"
    );

    setText(
        "foodEmission",
        foodEmission +
        " kg/day"
    );

    setText(
        "plasticEmission",
        plasticEmission +
        " kg/day"
    );

    createPieChart(
        transportEmission,
        acEmission,
        foodEmission,
        plasticEmission
    );

    createLineChart();
}


function createPieChart(
    transport,
    ac,
    food,
    plastic
) {

    const canvas =
        document.getElementById(
            "pieChart"
        );

    if (!canvas) {
        return;
    }

    if (
        typeof Chart ===
        "undefined"
    ) {
        console.error(
            "Chart.js is not loaded."
        );
        return;
    }

    if (pieChart) {
        pieChart.destroy();
    }

    pieChart =
        new Chart(
            canvas,
            {
                type: "doughnut",

                data: {
                    labels: [
                        "Transport",
                        "AC Usage",
                        "Food",
                        "Plastic"
                    ],

                    datasets: [
                        {
                            data: [
                                transport,
                                ac,
                                food,
                                plastic
                            ],

                            borderWidth: 2
                        }
                    ]
                },

                options: {
                    responsive: true,

                    maintainAspectRatio:
                        false,

                    plugins: {
                        legend: {
                            position:
                                "bottom"
                        }
                    }
                }
            }
        );
}


function createLineChart() {

    const canvas =
        document.getElementById(
            "lineChart"
        );

    if (!canvas) {
        return;
    }

    if (
        typeof Chart ===
        "undefined"
    ) {
        return;
    }

    if (lineChart) {
        lineChart.destroy();
    }

    const carbon =
        Number(
            carbonResult?.carbon?.carbon
        ) || 0;

    lineChart =
        new Chart(
            canvas,
            {
                type: "line",

                data: {
                    labels: [
                        "Start",
                        "Assessment",
                        "Current"
                    ],

                    datasets: [
                        {
                            label:
                                "Carbon Footprint",

                            data: [
                                carbon + 0.5,
                                carbon + 0.2,
                                carbon
                            ],

                            borderWidth: 3,

                            tension: 0.4,

                            fill: true
                        }
                    ]
                },

                options: {
                    responsive: true,

                    maintainAspectRatio:
                        false,

                    plugins: {
                        legend: {
                            position:
                                "top"
                        }
                    },

                    scales: {
                        y: {
                            beginAtZero:
                                true
                        }
                    }
                }
            }
        );
}


async function loadClimateCoach() {

    const coachElement =
        document.getElementById(
            "coach"
        );

    if (!coachElement) {
        return;
    }

    coachElement.innerHTML =
        "🤖 Loading AI recommendations...";

    try {

        const response =
            await fetch(
                "/api/ai/coach",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            assessmentData
                        )
                }
            );

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.error ||
                data.message ||
                data.details ||
                "AI request failed."
            );
        }

        if (data.response) {

            coachElement.innerHTML =
                formatAIResponse(
                    data.response
                );

        } else {

            coachElement.innerHTML =
                "No AI recommendations available.";
        }

    } catch (error) {

        console.error(
            "AI Coach Error:",
            error
        );

        coachElement.innerHTML =
            "❌ Unable to load AI recommendations.";
    }
}


function setupFutureAI() {

    const askButton =
        document.getElementById(
            "askBtn"
        );

    if (!askButton) {
        return;
    }

    askButton.addEventListener(
        "click",
        askFutureQuestion
    );
}


async function askFutureQuestion() {

    const questionElement =
        document.getElementById(
            "futureQuestion"
        );

    const answerElement =
        document.getElementById(
            "futureAnswer"
        );

    if (
        !questionElement ||
        !answerElement
    ) {
        return;
    }

    const question =
        questionElement.value.trim();

    if (!question) {

        alert(
            "Please enter a question."
        );

        return;
    }

    answerElement.innerHTML =
        "🤖 Thinking...";

    try {

        const response =
            await fetch(
                "/api/ai/future",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            assessment:
                                assessmentData,

                            question:
                                question
                        })
                }
            );

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.error ||
                data.message ||
                data.details ||
                "AI request failed."
            );
        }

        answerElement.innerHTML =
            formatAIResponse(
                data.response ||
                "No answer received."
            );

    } catch (error) {

        console.error(
            "Future AI Error:",
            error
        );

        answerElement.innerHTML =
            "❌ AI is currently unavailable.";
    }
}


function setupPDF() {

    const downloadButton =
        document.getElementById(
            "downloadPdf"
        );

    if (!downloadButton) {
        return;
    }

    downloadButton.addEventListener(
        "click",
        generatePDF
    );
}


function generatePDF() {

    if (
        !window.jspdf ||
        !window.jspdf.jsPDF
    ) {

        alert(
            "PDF library is not loaded. Please refresh the page."
        );

        return;
    }

    try {

        const {
            jsPDF
        } = window.jspdf;

        const doc =
            new jsPDF();

        const name =
            assessmentData.name ||
            "User";

        const carbon =
            getElementText(
                "carbon",
                "N/A"
            );

        const score =
            getElementText(
                "score",
                "N/A"
            );

        const badge =
            getElementText(
                "badge",
                "N/A"
            );

        const transport =
            getElementText(
                "transportEmission",
                "N/A"
            );

        const ac =
            getElementText(
                "acEmission",
                "N/A"
            );

        const food =
            getElementText(
                "foodEmission",
                "N/A"
            );

        const plastic =
            getElementText(
                "plasticEmission",
                "N/A"
            );

        const coach =
            getElementText(
                "coach",
                "No AI recommendations available."
            );

        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.setFontSize(24);

        doc.text(
            "EcoTrack AI",
            20,
            25
        );

        doc.setFontSize(17);

        doc.text(
            "Sustainability Report",
            20,
            36
        );

        doc.setLineWidth(0.5);

        doc.line(
            20,
            42,
            190,
            42
        );

        doc.setFont(
            "helvetica",
            "normal"
        );

        doc.setFontSize(12);

        doc.text(
            "Name: " + name,
            20,
            55
        );

        doc.text(
            "Generated by EcoTrack AI",
            20,
            63
        );

        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.setFontSize(16);

        doc.text(
            "Environmental Summary",
            20,
            80
        );

        doc.setFont(
            "helvetica",
            "normal"
        );

        doc.setFontSize(12);

        doc.text(
            "Carbon Footprint: " +
            carbon,
            20,
            93
        );

        doc.text(
            "Eco Score: " +
            score,
            20,
            103
        );

        doc.text(
            "Eco Badge: " +
            badge,
            20,
            113
        );

        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.setFontSize(16);

        doc.text(
            "Carbon Breakdown",
            20,
            133
        );

        doc.setFont(
            "helvetica",
            "normal"
        );

        doc.setFontSize(12);

        doc.text(
            "Transport: " +
            transport,
            20,
            146
        );

        doc.text(
            "AC Usage: " +
            ac,
            20,
            156
        );

        doc.text(
            "Food: " +
            food,
            20,
            166
        );

        doc.text(
            "Plastic: " +
            plastic,
            20,
            176
        );

        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.setFontSize(16);

        doc.text(
            "AI Climate Coach",
            20,
            196
        );

        doc.setFont(
            "helvetica",
            "normal"
        );

        doc.setFontSize(11);

        const cleanCoach =
            coach.replace(
                /[^\x00-\x7F]/g,
                ""
            );

        const coachLines =
            doc.splitTextToSize(
                cleanCoach,
                170
            );

        let y = 208;

        coachLines.forEach(
            function (line) {

                if (y > 275) {

                    doc.addPage();

                    y = 20;
                }

                doc.text(
                    line,
                    20,
                    y
                );

                y += 6;
            }
        );

        if (y > 275) {

            doc.addPage();

            y = 20;
        }

        doc.setFontSize(9);

        doc.text(
            "EcoTrack AI | Sustainability Report",
            20,
            285
        );

        doc.save(
            "EcoTrack_AI_Sustainability_Report.pdf"
        );

    } catch (error) {

        console.error(
            "PDF generation failed:",
            error
        );

        alert(
            "PDF generation failed.\n\n" +
            error.message
        );
    }
}


function getElementText(
    id,
    fallback
) {

    const element =
        document.getElementById(id);

    if (!element) {
        return fallback;
    }

    return (
        element.innerText ||
        element.textContent ||
        fallback
    );
}


function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);

    if (element) {
        element.innerText =
            value;
    }
}


function formatAIResponse(text) {

    if (!text) {
        return "";
    }

    return escapeHTML(
        String(text)
    ).replace(
        /\n/g,
        "<br>"
    );
}


function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}