
async function loadCountry() {
    const name = document.getElementById("country").value.trim();
    const result = document.getElementById("result");
    result.textContent = "Loading...";
    document.getElementById("error").textContent = "";

    if (!name) {
        result.textContent = "";
        document.getElementById("error").textContent = "Enter a country name.";
        return;
    }

    try {
        const response = await fetch(
            "https://restcountries.com/v3.1/name/" + encodeURIComponent(name)
        );

        if (!response.ok) {
            throw new Error();
        }

        const data = await response.json();
        const country = data[0];

        result.innerHTML = "";

        const title = document.createElement("h2");
        title.textContent = country.name.common;

        const flag = document.createElement("img");
        flag.src = country.flags.png;
        flag.alt = country.flags.alt || "Country flag";

        const capital = document.createElement("p");
        capital.textContent = "Capital: " + (country.capital?.[0] || "Unknown");

        const population = document.createElement("p");
        population.textContent = "Population: " + country.population.toLocaleString();

        result.append(title, flag, capital, population);
    } catch {
        result.textContent = "";
        document.getElementById("error").textContent = "Country not found.";
    }
}
