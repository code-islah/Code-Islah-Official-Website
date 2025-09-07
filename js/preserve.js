const token = localStorage.getItem("token");

if (token) {
  fetch("https://code-islah-official-website.onrender.com/api/protected", {
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.error("Error:", err));
} else {
  console.log("No token found, please log in.");
}
