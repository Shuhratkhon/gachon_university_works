const form = document.getElementById("registrationForm");
const submitButton = document.getElementById("submitButton");
const successMessage = document.getElementById("successMessage");

const fields = [
    document.getElementById("name"),
    document.getElementById("email"),
    document.getElementById("password"),
    document.getElementById("confirmPassword")
];

const confirmPassword = document.getElementById("confirmPassword");
const password = document.getElementById("password");

function validateField(field) {
    field.setCustomValidity("");

    if (
        field === confirmPassword &&
        field.value !== "" &&
        field.value !== password.value
    ) {
        field.setCustomValidity("Passwords do not match.");
    }

    const error = document.getElementById(field.id + "Error");

    if (field.validity.valueMissing) {
        error.textContent = "This field is required.";
    } else if (field.validity.typeMismatch) {
        error.textContent = "Please enter a valid email address.";
    } else if (field.validity.tooShort) {
        error.textContent = `Please enter at least ${field.minLength} characters.`;
    } else if (field.validity.customError) {
        error.textContent = field.validationMessage;
    } else {
        error.textContent = "";
    }

    field.setAttribute("aria-invalid", field.validity.valid ? "false" : "true");
    updateSubmitButton();
}

function updateSubmitButton() {
    submitButton.disabled = !form.checkValidity();
}

fields.forEach(function (field) {
    field.addEventListener("input", function () {
        validateField(field);
        successMessage.textContent = "";

        if (field === password) {
            validateField(confirmPassword);
        }
    });

    field.addEventListener("blur", function () {
        if (field.value !== "") {
            validateField(field);
        }
    });
});

form.addEventListener("submit", function (event) {
    event.preventDefault();

    fields.forEach(function (field) {
        validateField(field);
    });

    if (!form.checkValidity()) {
        const firstInvalidField = fields.find(function (field) {
            return !field.validity.valid;
        });

        if (firstInvalidField) {
            firstInvalidField.focus();
        }

        return;
    }

    successMessage.textContent = "Registration successful! Your form is valid.";
    form.reset();

    fields.forEach(function (field) {
        field.setCustomValidity("");
        field.setAttribute("aria-invalid", "false");
        document.getElementById(field.id + "Error").textContent = "";
    });

    updateSubmitButton();
});
