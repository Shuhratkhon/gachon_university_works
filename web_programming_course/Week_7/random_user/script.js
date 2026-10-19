
async function loadUser() {
    const userElement = document.getElementById("user");
    userElement.textContent = "Loading...";
    document.getElementById("error").textContent = "";

    try {
        const response = await fetch("https://randomuser.me/api/");

        if (!response.ok) {
            throw new Error();
        }

        const data = await response.json();
        const user = data.results[0];

        userElement.innerHTML = "";

        const image = document.createElement("img");
        image.src = user.picture.large;
        image.alt = "Random user";

        const name = document.createElement("h2");
        name.textContent = user.name.first + " " + user.name.last;

        const email = document.createElement("p");
        email.textContent = user.email;

        userElement.append(image, name, email);
    } catch {
        userElement.textContent = "";
        document.getElementById("error").textContent = "Could not load a user.";
    }
}
