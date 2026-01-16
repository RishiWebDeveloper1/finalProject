async function register() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!name || !email || !password) {
        alert("Please fill all fields");
        return;
    }

    try {
        const response = await fetch("https://online-exchange-platform.vercel.app/register", { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Signup Successful! You can now log in.");
            window.location.href = "login.html";
        } else {
            alert(data.message || "Signup failed!");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong. Please try again.");
    }
}

// ✅ Google Signup/Login Function
function googleLogin() {
    window.location.href = "https://online-exchange-platform.vercel.app/auth/google";
}
