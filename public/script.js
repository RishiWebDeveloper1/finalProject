document.addEventListener("DOMContentLoaded", function () {
    const startSellingButton = document.getElementById('startSelling');

    if (startSellingButton) {
        startSellingButton.addEventListener('click', function () {
            const user = localStorage.getItem('user'); // 🔍 Check if user is logged in

            if (!user) {
                alert("❌ Please login first!");
                window.location.href = '/login.html';  // 🔄 Redirect to login page
            } else {
                window.location.href = '/seller.html'; // ✅ Redirect to seller page
            }
        });
    }
});


// async function checkLogin() {
//     try {
//         const response = await fetch("http://localhost:5000/auth/status");
//         const data = await response.json();

//         if (data.loggedIn) {
//             document.getElementById("loginBtn").style.display = "none";
//             const profileImg = document.getElementById("profileImg");

//             // ✅ Agar user ke pass profile image nahi hai, to default image use karo
//             // profileImg.src = data.user.profileImg || "images/account.png";
//             profileImg.src = "images/account.png";
//             profileImg.style.display = "block";

//             // ✅ LocalStorage me user data store karo
//             localStorage.setItem("user", JSON.stringify(data.user));
//         }
//     } catch (error) {
//         console.error("Error checking login:", error);
//     }
// }

// window.onload = checkLogin;



async function checkLogin() {
    try {
        const response = await fetch("http://localhost:5000/auth/status");
        const data = await response.json();

        if (data.loggedIn) {
            document.getElementById("loginBtn").style.display = "none"; // ✅ Login button hide

            const profileImg = document.getElementById("profileImg");

            if (profileImg) { // ✅ Ensure profileImg exists
                profileImg.src = "images/account.png"; // ✅ Always use default image
                profileImg.style.display = "block"; // ✅ Show profile image
            }

            // ✅ LocalStorage me user data store karo
            localStorage.setItem("user", JSON.stringify(data.user));
        } 
    } catch (error) {
        console.error("❌ Error checking login:", error);
    }
}

window.onload = checkLogin;
