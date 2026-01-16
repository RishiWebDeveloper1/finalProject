/* <script>
        async function fetchUserProfile() {
            try {
                const response = await fetch('/api/user/profile'); // Replace with your actual API endpoint
                const data = await response.json();
                document.getElementById('username').textContent = data.name;
          i      document.getElementById('phone').textContent = data.phone;
                document.getElementById('joined').textContent = `Joined ${data.joined}`;
                document.getElementById('earnings').textContent = `₹ ${data.earnings}`;
                document.getElementById('withdrawable').textContent = `₹ ${data.withdrawable}`;
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        }
        
        function logout() {
            alert('Logging out...');
            window.location.href = '/login';
        }
        
        fetchUserProfile();
    </script> */

//      document.addEventListener("DOMContentLoaded", function () {
//     const user = JSON.parse(localStorage.getItem('user'));
    
//     if (!user) {
//         window.location.href = '/login.html';  // ❌ User not logged in, redirect to login
//         return;
//     }

//     document.getElementById('username').textContent = user.name;
//     document.getElementById('email').textContent = user.email;
//     // document.getElementById('joined').textContent = user.joined;
//     document.getElementById('joined').textContent = `Joined ${data.joined}`;





//     // ✅ Fetch user data from server
//     fetch(`https://online-exchange-platform.vercel.app/profile?userId=${user._id}`)
//         .then(response => response.json())
//         .then(userData => {
//             displayProducts(userData.products, 'userProducts');
//             displayProducts(userData.cart, 'cartItems');
//         })
//         .catch(error => console.error("❌ Profile Fetch Error:", error));
// });

//         document.addEventListener("DOMContentLoaded", async function () {
//             const user = JSON.parse(localStorage.getItem('user'));
//             if (!user) {
//                 window.location.href = '/login.html';
//                 return;
//             }

//             document.getElementById('username').textContent = user.name;
//             document.getElementById('useremail').textContent = user.email;

//             // Fetch User Data
//             const response = await fetch(`https://online-exchange-platform.vercel.app/profile?userId=${user._id}`);
//             const userData = await response.json();
            
//             // Display products & cart items
//             displayProducts(userData.products, 'userProducts');
//             displayProducts(userData.cart, 'cartItems');
//         });

//         function displayProducts(products, containerId) {
//             const container = document.getElementById(containerId);
//             if (products.length === 0) {
//                 container.innerHTML = "<p>No items found</p>";
//                 return;
//             }
//             container.innerHTML = products.map(p => `<div>${p.name} - $${p.price}</div>`).join('');
//         }

//         // Logout Function
//         document.getElementById('logoutButton').addEventListener('click', function () {
//             localStorage.removeItem('user');
//             window.location.href = '/login.html';
//         });