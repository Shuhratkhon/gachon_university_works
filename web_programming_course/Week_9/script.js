// numbers from checking every html file in Week_1 - Week_8
const weeks = [
    { name: "Week 1", pages: 9, title: 0, lang: 0, viewport: 0, main: 9 },
    { name: "Week 2", pages: 25, title: 21, lang: 21, viewport: 24, main: 15 },
    { name: "Week 3", pages: 33, title: 23, lang: 4, viewport: 24, main: 33 },
    { name: "Week 3.2", pages: 22, title: 22, lang: 2, viewport: 19, main: 20 },
    { name: "Week 4", pages: 22, title: 0, lang: 0, viewport: 17, main: 19 },
    { name: "Week 5", pages: 2, title: 0, lang: 0, viewport: 0, main: 0 },
    { name: "Week 6", pages: 6, title: 0, lang: 0, viewport: 0, main: 5 },
    { name: "Week 7", pages: 2, title: 0, lang: 0, viewport: 0, main: 1 },
    { name: "Week 8", pages: 1, title: 0, lang: 0, viewport: 0, main: 0 }
];

const notes = {
    main: "Pages with no <main> element. This is the most common problem, almost every early page has it.",
    viewport: "Pages with no viewport meta tag, so they look zoomed out on a phone.",
    title: "Pages with no <title>, the browser tab only shows the file name.",
    lang: "Pages where <html> has no lang attribute (mostly Week 2 files that have no <html> tag at all)."
};

const select = document.getElementById("issue-select");
const bars = document.getElementById("bars");

function drawBars() {
    const issue = select.value;
    document.getElementById("issue-note").textContent = notes[issue];
    bars.innerHTML = "";

    weeks.forEach(week => {
        const bad = week[issue];
        const percent = Math.round(bad / week.pages * 100);

        const row = document.createElement("div");
        row.className = bad === 0 ? "bar-row clean" : "bar-row";
        row.innerHTML =
            "<span>" + week.name + "</span>" +
            "<div class='bar-track'><div class='bar-fill'></div></div>" +
            "<span class='count'>" + bad + " / " + week.pages + "</span>";

        bars.append(row);

        // clean weeks get a small green bar so they don't look empty
        const width = bad === 0 ? 4 : percent;
        setTimeout(() => {
            row.querySelector(".bar-fill").style.width = width + "%";
        }, 30);
    });
}

select.addEventListener("change", drawBars);
drawBars();

// open / close the problem cards
document.querySelectorAll(".issue-toggle").forEach(button => {
    button.addEventListener("click", () => {
        const content = document.getElementById(button.getAttribute("aria-controls"));
        const isOpen = button.getAttribute("aria-expanded") === "true";

        button.setAttribute("aria-expanded", !isOpen);
        content.hidden = isOpen;
        button.querySelector(".chevron").textContent = isOpen ? "+" : "−";
    });
});

// checklist counter
const boxes = document.querySelectorAll("#checklist input");
boxes.forEach(box => {
    box.addEventListener("change", () => {
        box.parentElement.classList.toggle("done", box.checked);
        const checked = document.querySelectorAll("#checklist input:checked").length;
        document.getElementById("check-count").textContent = checked + " of " + boxes.length + " checked";
    });
});
