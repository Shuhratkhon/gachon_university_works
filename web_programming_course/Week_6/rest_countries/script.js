const form = document.getElementById("search-form");
const input = document.getElementById("country");
const result = document.getElementById("result");
const message = document.getElementById("message");
const button = form.querySelector("button");

form.addEventListener("submit", function (event) {
    event.preventDefault();
    loadCountry();
});

async function loadCountry() {
    const name = input.value.trim();

    result.replaceChildren();
    message.textContent = "";

    if (!name) {
        message.textContent = "Please enter a country name.";
        return;
    }

    button.disabled = true;
    message.textContent = "Loading...";

    try {
        const response = await fetch(
            "https://countries.dev/name/" + encodeURIComponent(name)
        );

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("Country not found. Try another name.");
            }

            throw new Error("The API returned an error. Please try again.");
        }

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
            throw new Error("Country not found. Try another name.");
        }

        const searchName = name.toLowerCase();

        const country = data.find(item =>
            item.name.toLowerCase() === searchName
        ) || data[0];

        message.textContent = "";
        showCountry(country);
    } catch (error) {
        result.replaceChildren();

        message.textContent = error instanceof TypeError
            ? "Could not connect to the API. Check your internet connection and try again."
            : error.message;

        console.error(error);
    } finally {
        button.disabled = false;
    }
}

function showCountry(country) {
    const title = document.createElement("h2");
    title.textContent = country.name;

    result.appendChild(title);

    const flagUrl = country.flags?.svg || country.flags?.png;

    if (flagUrl) {
        const flag = document.createElement("img");
        flag.src = flagUrl;
        flag.alt = country.name + " flag";
        flag.onerror = function () {
            flag.remove();
        };

        result.appendChild(flag);
    }

    addDetail("Capital", country.capital || "Unknown");

    addDetail(
        "Population",
        typeof country.population === "number"
            ? country.population.toLocaleString()
            : "Unknown"
    );

    addDetail("Region", country.region || "Unknown");

    addDetail("Country code", country.alpha2Code || "Unknown");
}

function addDetail(label, value) {
    const paragraph = document.createElement("p");
    paragraph.textContent = label + ": " + value;
    result.appendChild(paragraph);
}
