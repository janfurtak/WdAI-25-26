document.getElementById("clear").addEventListener("click", () => {
  document.getElementById("form").reset();
});

function getErrorMessage(input) {
  const v = input.validity;
  if (v.valueMissing) return "This field cannot be empty.";
  if (v.tooShort && input.name === "name") return "Name is too short.";
  if (v.typeMismatch && input.type === "email")
    return "Enter a valid email address.";
  return "";
}

const form = document.querySelector("form");
form.setAttribute("novalidate", "true");

form.addEventListener("input", (e) => {
  const error = e.target.parentElement.querySelector(".form-error");
  if (error) error.textContent = "";
  e.target.style.borderColor = "var(--font-color)";
});

form.addEventListener("submit", (e) => {
  let hasError = false;

  form.querySelectorAll("input, textarea, select").forEach((input) => {
    const msg = getErrorMessage(input);
    const error = input.parentElement.querySelector(".form-error");

    if (msg) {
      if (error) error.textContent = msg;
      input.style.borderColor = "var(--sec-font-color)";
      hasError = true;
    }
  });

  if (hasError) e.preventDefault();
});
