(function () {
  "use strict";

  var form = document.getElementById("estimate-form");
  if (!form) return;

  var submitBtn = form.querySelector('button[type="submit"]');
  var formContainer = form.parentElement;

  function setError(input, group, message) {
    var errorEl = document.getElementById("error-" + input.id);
    group.classList.add("has-error");
    if (errorEl) errorEl.textContent = message;
  }

  function clearError(input, group) {
    var errorEl = document.getElementById("error-" + input.id);
    group.classList.remove("has-error");
    if (errorEl) errorEl.textContent = "";
  }

  function validate() {
    var valid = true;
    var fields = [
      { id: "full-name", check: function (v) { return v.trim().length > 1; }, msg: "Please enter your full name." },
      { id: "phone", check: function (v) { return /^[\d\s()+-]{7,20}$/.test(v.trim()); }, msg: "Please enter a valid phone number." },
      { id: "zip-code", check: function (v) { return /^\d{5}$/.test(v.trim()); }, msg: "Please enter a 5-digit ZIP code." },
      { id: "description", check: function (v) { return v.trim().length > 5; }, msg: "Please describe your project (a few words is fine)." }
    ];

    fields.forEach(function (f) {
      var input = document.getElementById(f.id);
      if (!input) return;
      var group = input.closest(".form-group");
      input.addEventListener("input", function () {
        if (group.classList.contains("has-error")) clearError(input, group);
      });
      if (!f.check(input.value)) {
        setError(input, group, f.msg);
        valid = false;
      } else {
        clearError(input, group);
      }
    });

    return valid;
  }

  function getTurnstileToken() {
    if (typeof window.turnstile !== "undefined" && window.turnstile.getResponse) {
      return window.turnstile.getResponse();
    }
    return "";
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!validate()) return;

    var token = getTurnstileToken();
    if (!token) {
      alert("Please complete the security check below the form, then submit again.");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    var payload = {
      full_name: document.getElementById("full-name").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      zip_code: document.getElementById("zip-code").value.trim(),
      description: document.getElementById("description").value.trim(),
      turnstile_token: token
    };

    fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        if (!res.ok) throw new Error("Request failed (" + res.status + ")");
        return res.json();
      })
      .then(function () {
        formContainer.innerHTML =
          '<div class="estimate-form" style="text-align: center;">' +
            '<h3 style="margin-bottom: var(--space-3);">Request received!</h3>' +
            '<p>Thanks — we\u2019ve got your details. We\u2019ll reach out with next steps and a clear estimate shortly.</p>' +
            '<p style="margin-top: var(--space-4);"><a href="tel:6232278884" class="btn btn-ghost">Prefer to talk? Call 623-227-8884</a></p>' +
          "</div>";
      })
      .catch(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit Request";
        alert("Something went wrong sending your request. Please try again, or text photos to 623-227-8884.");
      });
  });
})();
