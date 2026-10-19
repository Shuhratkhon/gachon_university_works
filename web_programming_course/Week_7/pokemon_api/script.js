
async function loadPokemon() {
    const name = document.getElementById("pokemon").value.trim().toLowerCase();
    const result = document.getElementById("result");
    result.textContent = "Loading...";
    document.getElementById("error").textContent = "";

    if (!name) {
        result.textContent = "";
        document.getElementById("error").textContent = "Enter a Pokémon name.";
        return;
    }

    try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon/" + encodeURIComponent(name));

        if (!response.ok) {
            throw new Error();
        }

        const pokemon = await response.json();
        result.innerHTML = "";

        const title = document.createElement("h2");
        title.textContent = pokemon.name.toUpperCase();

        const image = document.createElement("img");
        image.src = pokemon.sprites.front_default;
        image.alt = pokemon.name;

        const types = document.createElement("p");
        types.textContent = "Types: " + pokemon.types.map(item => item.type.name).join(", ");

        const height = document.createElement("p");
        height.textContent = "Height: " + pokemon.height;

        result.append(title, image, types, height);
    } catch {
        result.textContent = "";
        document.getElementById("error").textContent = "Pokémon not found.";
    }
}
