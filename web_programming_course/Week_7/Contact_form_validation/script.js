const form = document.getElementById("contact-form");
const fullName = document.getElementById("full-name");
const email = document.getElementById("email");
const subject = document.getElementById("subject");
const message = document.getElementById("message");
const messageCount = document.getElementById("message-count");
const formStatus = document.getElementById("form-status");

const fields = [
    { input: fullName, error: document.getElementById("name-error") },
    { input: email, error: document.getElementById("email-error") },
    { input: subject, error: document.getElementById("subject-error") },
    { input: message, error: document.getElementById("message-error") }
];

function getError(input) {
    const value = input.value.trim();

    if (!value) {
        return "This field is required.";
    }

    if (input === fullName && value.length < 2) {
        return "Please enter at least 2 characters.";
    }

    if (input === subject && value.length < 3) {
        return "Subject must contain at least 3 characters.";
    }

    if (input === message && value.length < 10) {
        return "Message must contain at least 10 characters.";
    }

    if (input.validity.typeMismatch) {
        return "Please enter a valid email address.";
    }

    if (input.validity.tooLong) {
        return "The text is too long.";
    }

    return "";
}

function validateField(input, errorElement) {
    const error = getError(input);
    errorElement.textContent = error;
    input.classList.toggle("invalid", Boolean(error));
    input.setAttribute("aria-invalid", String(Boolean(error)));
    return !error;
}

fields.forEach(({ input, error }) => {
    input.addEventListener("blur", () => {
        validateField(input, error);
    });

    input.addEventListener("input", () => {
        if (input.classList.contains("invalid")) {
            validateField(input, error);
        }
        formStatus.textContent = "";
        formStatus.classList.remove("error-status");
    });
});

message.addEventListener("input", () => {
    messageCount.textContent = `${message.value.length} / 500`;
});

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const isValid = fields
        .map(({ input, error }) => validateField(input, error))
        .every(Boolean);

    if (!isValid) {
        formStatus.textContent = "Please fix the highlighted fields and try again.";
        formStatus.classList.add("error-status");
        const firstInvalid = form.querySelector(".invalid");
        if (firstInvalid) {
            firstInvalid.focus();
        }
        return;
    }

    formStatus.textContent = "Your message has been validated successfully!";
    formStatus.classList.remove("error-status");
    form.reset();
    messageCount.textContent = "0 / 500";
    fields.forEach(({ input, error }) => {
        error.textContent = "";
        input.classList.remove("invalid");
        input.removeAttribute("aria-invalid");
    });
});

form.addEventListener("reset", () => {
    window.setTimeout(() => {
        fields.forEach(({ input, error }) => {
            error.textContent = "";
            input.classList.remove("invalid");
            input.removeAttribute("aria-invalid");
        });
        messageCount.textContent = "0 / 500";
        formStatus.textContent = "";
        formStatus.classList.remove("error-status");
    }, 0);
});
