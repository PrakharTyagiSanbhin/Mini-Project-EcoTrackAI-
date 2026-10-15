function calculateCarbon(data = {}) {
    const name = String(data.name || "User");

    const transport = String(
        data.transport || ""
    ).toLowerCase();

    const distance = Number(data.distance) || 0;

    const acHours = Number(data.acHours) || 0;

    const meals = Number(data.meals) || 0;

    const plasticBottles =
        Number(data.plasticBottles) || 0;

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
        distance * transportFactor;

    const acEmission =
        acHours * 0.4;

    const foodEmission =
        meals * 0.3;

    const plasticEmission =
        (plasticBottles / 7) * 0.05;

    const totalCarbon =
        transportEmission +
        acEmission +
        foodEmission +
        plasticEmission;

    return {
        name: name,

        carbon: Number(
            totalCarbon.toFixed(2)
        ),

        breakdown: {
            transport: Number(
                transportEmission.toFixed(2)
            ),

            ac: Number(
                acEmission.toFixed(2)
            ),

            food: Number(
                foodEmission.toFixed(2)
            ),

            plastic: Number(
                plasticEmission.toFixed(2)
            )
        }
    };
}

module.exports = calculateCarbon;