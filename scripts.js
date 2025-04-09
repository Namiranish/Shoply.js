// SIGN UP
if (document.getElementById("signup-form")) {
  document.getElementById("signup-form").addEventListener("submit", function(e) {
    e.preventDefault();
    const username = document.getElementById("signup-username").value;
    const password = document.getElementById("signup-password").value;

    localStorage.setItem("user", JSON.stringify({ username, password }));
    alert("Signup successful! You can now login.");
    window.location.href = "login.html";
  });
}

// LOGIN
if (document.getElementById("login-form")) {
  document.getElementById("login-form").addEventListener("submit", function(e) {
    e.preventDefault();
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (savedUser && username === savedUser.username && password === savedUser.password) {
      alert("Login successful!");
      window.location.href = "dashboard/dashboard.html"; // ✅ Redirect to dashboard page
    } else {
      alert("Invalid credentials!");
    }
  });
}
