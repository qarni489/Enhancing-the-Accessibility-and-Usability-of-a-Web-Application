const form = document.getElementById("enquiry-form");

if (form) {
    const summary = document.getElementById("error-summary");
    const list = summary.querySelector("ul");
    const status = document.getElementById("status");
    const fields = ["car", "name", "email", "phone", "message"].map(id => document.getElementById(id));
    const messages = {
        car: "Choose a vehicle",
        name: "Enter your full name",
        email: "Enter an email address, such as name@example.com",
        phone: "Enter a telephone number using at least 10 digits",
        message: "Enter your message"
    };

    // Pre-select the car chosen on the home page
    const chosen = new URLSearchParams(window.location.search).get("car");
    if ([...form.elements.car.options].some(o => o.value && o.value === chosen)) {
        form.elements.car.value = chosen;
    }

    // Use our own error messages when JavaScript is available
    form.noValidate = true;

    function isValid(field) {
        const value = field.value.trim();
        if (field.id === "phone") {
            if (!value) return form.elements.contact.value !== "phone";
            return /^[0-9+() -]+$/.test(value) && value.replace(/\D/g, "").length >= 10;
        }
        return value !== "" && field.validity.valid;
    }

    function showError(field, text) {
        const error = document.getElementById(field.id + "-error");
        const hint = document.getElementById(field.id + "-hint");
        error.textContent = text ? "Error: " + text : "";
        error.hidden = !text;
        field.setAttribute("aria-invalid", text ? "true" : "false");
        const ids = [hint && hint.id, text && error.id].filter(Boolean).join(" ");
        if (ids) field.setAttribute("aria-describedby", ids);
        else field.removeAttribute("aria-describedby");
    }

    function clearErrors() {
        fields.forEach(field => showError(field, ""));
        list.textContent = "";
        summary.hidden = true;
    }

    form.addEventListener("submit", event => {
        event.preventDefault();
        clearErrors();
        status.textContent = "";

        fields.filter(field => !isValid(field)).forEach(field => {
            showError(field, messages[field.id]);
            const item = document.createElement("li");
            const link = document.createElement("a");
            link.href = "#" + field.id;
            link.textContent = messages[field.id];
            link.addEventListener("click", e => { e.preventDefault(); field.focus(); });
            item.appendChild(link);
            list.appendChild(item);
        });

        if (list.children.length) {
            summary.hidden = false;
            summary.focus();
        } else {
            // There is no server, so do not claim the enquiry was sent
            status.textContent = "Your details passed the checks, but this demonstration site cannot send them. Please call 01707 111 222.";
            status.scrollIntoView({ block: "nearest" });
        }
    });

    form.addEventListener("reset", event => {
        if (!window.confirm("Clear everything you have typed?")) {
            event.preventDefault();
            return;
        }
        clearErrors();
        status.textContent = "";
    });
}
