
async function loadWeather() {
    const result = document.getElementById("weather");
    result.textContent = "Loading...";
    document.getElementById("error").textContent = "";

    try {
        const response = await fetch(
            "https://api.open-meteo.com/v1/forecast?latitude=37.5665&longitude=126.9780&current=temperature_2m,relative_humidity_2m"
        );

        if (!response.ok) {
            throw new Error();
        }

        const data = await response.json();

        result.textContent =
            "Temperature: " + data.current.temperature_2m + " °C | " +
            "Humidity: " + data.current.relative_humidity_2m + "%";
    } catch {
        result.textContent = "";
        document.getElementById("error").textContent = "Could not load weather.";
    }
}
