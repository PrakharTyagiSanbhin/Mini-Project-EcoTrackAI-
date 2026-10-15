const questions = [
    "What's your name?",
    "How do you travel daily? (Car / Bus / Bike / Bicycle / Walk)",
    "How many kilometres do you travel daily?",
    "How many hours do you use AC?",
    "How many meals do you eat daily?",
    "How many plastic bottles do you use each week?"
];

let current = 0;
const answers = [];

const question = document.getElementById("question");
const answer = document.getElementById("answer");
const nextBtn = document.getElementById("nextBtn");

function showQuestion() {
    question.textContent = questions[current];
    answer.value = "";
    answer.focus();

    nextBtn.textContent =
        current === questions.length - 1
            ? "Calculate My Footprint →"
            : "Next →";
}

showQuestion();

nextBtn.addEventListener("click", submitAnswer);

answer.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        submitAnswer();
    }
});

async function submitAnswer() {
    const value = answer.value.trim();

    if (!value) {
        alert("Please enter your answer.");
        answer.focus();
        return;
    }

    answers[current] = value;
    current++;

    if (current < questions.length) {
        showQuestion();
        return;
    }

    const data = {
        name: answers[0],
        transport: answers[1],
        distance: Number(answers[2]),
        acHours: Number(answers[3]),
        meals: Number(answers[4]),
        plasticBottles: Number(answers[5])
    };

    if (
        !Number.isFinite(data.distance) ||
        data.distance < 0
    ) {
        alert("Please enter a valid travel distance.");
        current = 2;
        showQuestion();
        return;
    }

    if (
        !Number.isFinite(data.acHours) ||
        data.acHours < 0
    ) {
        alert("Please enter valid AC hours.");
        current = 3;
        showQuestion();
        return;
    }

    if (
        !Number.isFinite(data.meals) ||
        data.meals < 0
    ) {
        alert("Please enter a valid number of meals.");
        current = 4;
        showQuestion();
        return;
    }

    if (
        !Number.isFinite(data.plasticBottles) ||
        data.plasticBottles < 0
    ) {
        alert("Please enter a valid number of plastic bottles.");
        current = 5;
        showQuestion();
        return;
    }

    nextBtn.disabled = true;
    nextBtn.textContent = "Calculating...";

    try {
        const response = await fetch("/api/carbon/calculate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message ||
                result.error ||
                "Carbon calculation failed."
            );
        }

        localStorage.setItem(
            "assessmentData",
            JSON.stringify(data)
        );

        localStorage.setItem(
            "carbonResult",
            JSON.stringify(result)
        );

        localStorage.setItem(
            "answers",
            JSON.stringify(answers)
        );

        window.location.href = "dashboard.html";

    } catch (error) {
        console.error("Assessment error:", error);

        alert(
            "Unable to calculate your carbon footprint.\n\n" +
            error.message
        );

        nextBtn.disabled = false;
        nextBtn.textContent = "Calculate My Footprint →";
    }
}
