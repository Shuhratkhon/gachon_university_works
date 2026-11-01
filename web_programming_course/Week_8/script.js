const stages = {
    inspect: {
        label: "STAGE 01 / INSPECTION",
        title: "Start with the user experience",
        description: "Test incomplete fields, mismatched passwords, and keyboard navigation before changing the form. The goal is to identify where a user can get stuck.",
        list: [
            "Submit with required fields empty.",
            "Enter different values in the password fields.",
            "Check whether errors are clear and connected to inputs."
        ],
        preview: "INITIAL CHECK",
        message: "Check what happens when fields are invalid.",
        button: "Run test",
        foot: "The first pass establishes a baseline before changes are made."
    },
    improve: {
        label: "STAGE 02 / IMPLEMENTATION",
        title: "Make each fix address a real issue",
        description: "Apply a targeted change for each problem. Connect error text to the right input and make password mismatch validation explicit.",
        list: [
            "Update feedback as the user types.",
            "Use aria-describedby and aria-invalid for field errors.",
            "Use setCustomValidity() to check matching passwords."
        ],
        preview: "CHANGES APPLIED",
        message: "Validation and accessible feedback are now connected.",
        button: "Fix applied",
        foot: "Each code change maps back to an issue found during inspection."
    },
    verify: {
        label: "STAGE 03 / VERIFICATION",
        title: "Repeat the same tests",
        description: "Run the original checks again. Invalid values should be explained, mismatched passwords should be blocked, and valid input should receive confirmation.",
        list: [
            "Confirm invalid fields cannot submit.",
            "Confirm matching passwords clear the custom error.",
            "Submit valid data and check the success message."
        ],
        preview: "RE-TEST COMPLETE",
        message: "The same test cases now produce clear feedback.",
        button: "Passed",
        foot: "The process is complete only when expected behavior is verified."
    }
};

const tabs = [...document.querySelectorAll(".tab")];

function showStage(key) {
    const stage = stages[key];

    tabs.forEach((tab) => {
        const isActive = tab.dataset.stage === key;
        tab.classList.toggle("active", isActive);
        tab.setAttribute("aria-selected", String(isActive));
    });

    document.getElementById("stage-label").textContent = stage.label;
    document.getElementById("stage-title").textContent = stage.title;
    document.getElementById("stage-description").textContent = stage.description;

    const list = document.getElementById("stage-list");
    list.replaceChildren(
        ...stage.list.map((itemText) => {
            const item = document.createElement("li");
            item.textContent = itemText;
            return item;
        })
    );

    document.getElementById("preview-label").textContent = stage.preview;
    document.getElementById("preview-message").textContent = stage.message;
    document.getElementById("preview-button").textContent = stage.button;
    document.getElementById("preview-foot").textContent = stage.foot;

    const message = document.getElementById("preview-message");
    const isInspectStage = key === "inspect";

    message.style.background = isInspectStage ? "#3b3034" : "#203e42";
    message.style.color = isInspectStage ? "#f3c98a" : "#a6e6d0";
}

tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        showStage(tab.dataset.stage);
    });
});

document.querySelectorAll(".issue-toggle").forEach((button) => {
    button.addEventListener("click", () => {
        const isExpanded = button.getAttribute("aria-expanded") === "true";
        const panelId = button.getAttribute("aria-controls");
        const panel = document.getElementById(panelId);

        button.setAttribute("aria-expanded", String(!isExpanded));
        panel.hidden = isExpanded;
        button.querySelector(".chevron").textContent = isExpanded ? "+" : "−";
    });
});

document.getElementById("issue-filter").addEventListener("change", (event) => {
    const selectedCategory = event.target.value;

    document.querySelectorAll(".issue").forEach((issue) => {
        issue.hidden =
            selectedCategory !== "all" &&
            issue.dataset.category !== selectedCategory;
    });
});

showStage("inspect");
