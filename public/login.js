async function loginUser() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const rememberMe = document.getElementById("rememberMe").checked;

    if (!email || !password) {
        alert("Please enter email and password");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            if (rememberMe) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user)); // User data bhi save karega
            } else {
                sessionStorage.setItem("token", data.token);
            }
            alert("Login Successful");
            window.location.href = "index.html";
        } else {
            alert(data.error || "Invalid credentials");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong. Please try again.");
    }
}

// Google Sign-In
document.getElementById("googleSignIn").addEventListener("click", () => {
    window.open("https://accounts.google.com/signin", "_blank");
});
