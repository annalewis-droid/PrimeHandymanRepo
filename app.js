// 1. Grab your local Supabase credentials from your terminal receipt
const SUPABASE_URL = "http://127.0.0.1:54321";
const SUPABASE_ANON_KEY = " sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH";

// 2. Wait for the website layout to load completely
document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault(); // Stop the page from reloading on click

            // 3. Grab the values the customer typed into the form inputs
            const formData = {
                name: document.getElementById("name").value,
                email: document.getElementById("email").value,
                phone: document.getElementById("phone").value,
                message: document.getElementById("message").value
            };

            try {
                // 4. Shoot the data over to your local Supabase database
                const response = await fetch(`${https://kixyxjyizvragzaqyfsx.supabase.co`, {
                    method: "POST",
                    headers: {
                        "apikey": sb_publishable_P4Eyho - PFpTu7zR5LB8dJQ_MPV82uXZ,
                        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
                        "Content-Type": "application/json",
                        "Prefer": "return=minimal"
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    alert("Awesome! Your message has been sent successfully.");
                    contactForm.reset(); // Clear the form fields for the next entry
                } else {
                    throw new Error("Database rejected the submission");
                }

            } catch (error) {
                console.error("Submission Error:", error);
                alert("Oops! Something went wrong behind the scenes. Please try again.");
            }
        });
    }
});