// Register new user
function registerUser(username, password) {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  if (users.find(u => u.username === username)) {
    return false;
  }
  users.push({ username, password });
  localStorage.setItem("users", JSON.stringify(users));
  return true;
}

// Login user
function loginUser(username, password) {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let validUser = users.find(u => u.username === username && u.password === password);
  if (validUser) {
    localStorage.setItem("loggedInUser", username);
    return true;
  }
  return false;
}

// Check authentication
function checkAuth() {
  if (!localStorage.getItem("loggedInUser")) {
    window.location.href = "index.html";
  }
}

// Logout user
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}
