let currentJoke = null;

let favorites = JSON.parse(
    localStorage.getItem("favoriteJokes") || "[]"
);

const jokeButton = document.getElementById("jokeButton");
const favoriteButton = document.getElementById("favoriteButton");
const setupElement = document.getElementById("setup");
const punchlineElement = document.getElementById("punchline");
const loadingElement = document.getElementById("loading");
const errorElement = document.getElementById("error");
const favoritesList = document.getElementById("favoritesList");
const emptyFavorites = document.getElementById("emptyFavorites");

async function loadJoke() {
    jokeButton.disabled = true;
    favoriteButton.disabled = true;

    loadingElement.classList.remove("hidden");
    errorElement.classList.add("hidden");

    setupElement.textContent = "Please wait...";
    punchlineElement.textContent = "";

    try {
        const response = await fetch(
            "https://official-joke-api.appspot.com/random_joke"
        );

        if (!response.ok) {
            throw new Error("Failed to fetch joke");
        }

        const joke = await response.json();

        if (!joke.setup || !joke.punchline) {
            throw new Error("Invalid joke data");
        }

        currentJoke = {
            setup: joke.setup,
            punchline: joke.punchline
        };

        setupElement.textContent = currentJoke.setup;
        punchlineElement.textContent = currentJoke.punchline;

        updateFavoriteButton();

    } catch (error) {
        currentJoke = null;
        setupElement.textContent = "No joke available.";
        punchlineElement.textContent = "Please try again.";
        errorElement.classList.remove("hidden");

    } finally {
        loadingElement.classList.add("hidden");
        jokeButton.disabled = false;
    }
}

function toggleFavorite() {
    if (!currentJoke) {
        return;
    }

    const index = favorites.findIndex(joke =>
        joke.setup === currentJoke.setup &&
        joke.punchline === currentJoke.punchline
    );

    if (index !== -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(currentJoke);
    }

    localStorage.setItem(
        "favoriteJokes",
        JSON.stringify(favorites)
    );

    updateFavoriteButton();
    displayFavorites();
}

function updateFavoriteButton() {
    if (!currentJoke) {
        favoriteButton.disabled = true;
        favoriteButton.textContent = "♡ Save to favourites";
        return;
    }

    favoriteButton.disabled = false;

    const isFavorite = favorites.some(joke =>
        joke.setup === currentJoke.setup &&
        joke.punchline === currentJoke.punchline
    );

    favoriteButton.textContent = isFavorite
        ? "♥ Remove from favourites"
        : "♡ Save to favourites";
}

function displayFavorites() {
    favoritesList.innerHTML = "";

    emptyFavorites.classList.toggle(
        "hidden",
        favorites.length > 0
    );

    favorites.forEach((joke, index) => {
        const item = document.createElement("div");
        item.className = "favorite-item";

        const setup = document.createElement("p");
        setup.textContent = "Setup: " + joke.setup;

        const punchline = document.createElement("p");
        punchline.textContent = "Punchline: " + joke.punchline;

        const removeButton = document.createElement("button");
        removeButton.className = "remove-button";
        removeButton.textContent = "Remove";
        removeButton.onclick = () => removeFavorite(index);

        item.append(setup, punchline, removeButton);
        favoritesList.appendChild(item);
    });
}

function removeFavorite(index) {
    favorites.splice(index, 1);

    localStorage.setItem(
        "favoriteJokes",
        JSON.stringify(favorites)
    );

    updateFavoriteButton();
    displayFavorites();
}

displayFavorites();
