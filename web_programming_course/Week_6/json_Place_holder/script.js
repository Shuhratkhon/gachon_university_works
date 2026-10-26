
async function loadPosts() {
    const posts = document.getElementById("posts");
    posts.textContent = "Loading...";
    document.getElementById("error").textContent = "";

    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=10");

        if (!response.ok) {
            throw new Error();
        }

        const data = await response.json();
        posts.innerHTML = "";

        data.forEach(post => {
            const article = document.createElement("article");
            const title = document.createElement("h2");
            const body = document.createElement("p");

            title.textContent = post.title;
            body.textContent = post.body;

            article.append(title, body);
            posts.appendChild(article);
        });
    } catch {
        posts.textContent = "";
        document.getElementById("error").textContent = "Could not load posts.";
    }
}
