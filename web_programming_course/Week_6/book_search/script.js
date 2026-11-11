const form = document.getElementById("search-form");
const input = document.getElementById("query");
const statusText = document.getElementById("status");
const booksBox = document.getElementById("books");
const button = form.querySelector("button");

async function searchBooks(query) {
    statusText.className = "status";
    statusText.textContent = "Searching...";
    booksBox.innerHTML = "";
    button.disabled = true;

    try {
        // only ask for the fields I actually use, it's a lot faster
        const url = "https://openlibrary.org/search.json?q=" + encodeURIComponent(query) +
            "&limit=20&fields=key,title,author_name,first_publish_year,cover_i,edition_count";
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error();
        }

        const data = await response.json();

        if (data.docs.length === 0) {
            statusText.textContent = "No books found for \"" + query + "\".";
            return;
        }

        statusText.textContent = "Showing " + data.docs.length + " of " + data.numFound.toLocaleString() + " results.";
        data.docs.forEach(book => booksBox.append(makeCard(book)));
    } catch {
        statusText.className = "status error";
        statusText.textContent = "Something went wrong. Check your internet and try again.";
    } finally {
        button.disabled = false;
    }
}

function makeCard(book) {
    const card = document.createElement("article");
    card.className = "book";

    let cover;
    if (book.cover_i) {
        cover = document.createElement("img");
        cover.src = "https://covers.openlibrary.org/b/id/" + book.cover_i + "-M.jpg";
        cover.alt = "Cover of " + book.title;
        cover.loading = "lazy";
    } else {
        cover = document.createElement("div");
        cover.className = "no-cover";
        cover.textContent = "No cover";
    }

    const info = document.createElement("div");

    const title = document.createElement("h2");
    title.textContent = book.title;

    const author = document.createElement("p");
    author.textContent = book.author_name ? book.author_name.slice(0, 3).join(", ") : "Unknown author";

    const year = document.createElement("p");
    year.textContent = book.first_publish_year ? "First published " + book.first_publish_year : "Year unknown";

    const editions = document.createElement("p");
    editions.textContent = (book.edition_count || 1) + " edition(s)";

    const link = document.createElement("a");
    link.href = "https://openlibrary.org" + book.key;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "View on Open Library ↗";

    info.append(title, author, year, editions, link);
    card.append(cover, info);
    return card;
}

form.addEventListener("submit", event => {
    event.preventDefault();
    const query = input.value.trim();

    if (!query) {
        statusText.className = "status error";
        statusText.textContent = "Please type a title or author first.";
        return;
    }

    searchBooks(query);
});

// the "Try:" buttons fill the input and search right away
document.querySelectorAll(".chip").forEach(chip => {
    chip.addEventListener("click", () => {
        input.value = chip.textContent;
        searchBooks(chip.textContent);
    });
});
