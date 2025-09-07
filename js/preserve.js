const token = localStorage.getItem("token");

fetch("https://code-islah-official-website.onrender.com/api/auth/verify", {
  headers: { Authorization: "Bearer " + token }
})
  .then(res => {
    if (!res.ok) throw new Error("Token invalid or expired");
    return res.json();
  })
  .then(user => console.log("Logged in user:", user))
  .catch(err => {
    localStorage.clear();
    window.location.href = "/login.html"; // redirect if not logged in
  });
