const token = localStorage.getItem("token");

fetch("https://code-islah-official-website.onrender.com/api/auth/verify", {
  headers: { Authorization: "Bearer " + token },
})
  .then((res) => {
    if (!res.ok) throw new Error("Token invalid or expired");
    return res.json();
  })
  .then((user) => {
    console.log("Logged in user:", user);
  })
  .catch((err) => {
    console.log("You are not logged in!");
  });

const list = document.createElement("div");
function loggedProfile() {
  const profile = document.createElement("div");
  profile.classList.add("profile");
  profile.innerHTML = `<span data-close="true">╳</span>
   <img src="../img/profile.png" class="circle">
   <div class="d-none profName p-normal">
   <h4 class="clr-text-dark">${JSON.parse(localStorage.getItem('user') || 'null')?.name ?? undefined}</h4>
   <p class="clr-text-primary">${JSON.parse(localStorage.getItem('user') || 'null')?.email ?? undefined}</p>
   </div>
 <div>
  <span data-update="true"><i class="bi bi-repeat clr-text-white"></i></span>
   <span><a href="../chlng.html"><i class="bi bi-plus-circle-fill clr-text-white"></i></a></span>
   <span data-settings="true"><i class="bi bi-gear-fill clr-text-white"></i></span>
   <span data-logout="true"><i class="bi bi-power clr-text-white"></i></span>
   </div>

   `;
  document.body.insertBefore(profile, document.body.firstChild);

  profile.querySelector("img").addEventListener("click", (e) => {
    profile.classList.add("active");
    e.target.src = "../img/profile.png";

    profile.querySelector(".profName").style.display = "block";
  });

  window.document.addEventListener("scroll", () => {
    profile.classList.remove("active");
    profile.querySelector(".profName").style.display = "none";
  });

  function widthChecker() {
    if (window.innerWidth > 1024) {
      profile.classList.add("active");
    }
  }

  for (let elem of profile.children) {
    elem.addEventListener("click", (e) => {
      e.stopPropagation();
      for (let data in e.target.dataset) {
        switch (data) {
          case "update":
            updateNodeModules(profile);
            widthChecker();
            break;
          case "settings":
            settings();
            break;
          case "logout":
            logout(profile);
            widthChecker();
            break;
          case "close":
            closeContainer(profile);
            break;
        }
      }
    });
  }

  function closeContainer(e) {
    e.classList.remove("active");
    profile.querySelector(".profName").style.display = "none";
    list.innerHTML = "";
  }
}
loggedProfile();

function updateNodeModules(container) {
  function writer(txt) {
    let text = "";

    let count = -1;

    let int = setInterval(() => {
      count++;
      text += txt[count];

      list.innerHTML = `<div data-lastChild class="p-medium clr-text-white">
      <h4 class="h5 clr-bg-glass p-tiny rounded">Current Node Modules</h4>
      ${text}
      
      </div>`;

      if (txt.length - 1 <= count) {
        clearInterval(int);
        runUpdate();
      }
    }, 30);

    async function runUpdate() {
      const res = await fetch(
        "https://code-islah-official-website.onrender.com/api/admin/run-updates",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();
      alert(data.message);
      console.log("Output:", data.output);
    }
  }

  writer(
    `<p>1. Challenges page <span style="color:#cbcb41">'grabber.js'</span> <span class="clr-text-light">updated</span>.</p> <p>2. Challenges counter <span style="color:#cbcb41">'countOnMain.js'</span> <span class="clr-text-light">updated</span>.</p> <p>3. Playground List <span style="color:#cbcb41">'playObj.js'</span> <span class="clr-text-light">updated</span>.</p>`
  );

  container.appendChild(list);
}

let notice = document.createElement("div");
document.body.insertBefore(notice, document.querySelector("div"));
function logout(container) {
  list.innerHTML = `<div><h4 class="h4">Are you sure?</h4> <div class="gap-300" style="display: flex !important;place-content:center !important; padding-bottom: var(--size-200)"><span class="clr-text-light">Yes</span><span class="clr-text-warn">No</span></div></div>`;

  Array.from(list.firstElementChild.children).forEach((e) => {
    e.style.cursor = "pointer";
    e.addEventListener("click", (e) => {
      if (e.target.textContent === "Yes") {
        localStorage.clear(token);
        notice.classList.add("notice");
        notice.style.backgroundColor = "var(--clr-warn)";
        notice.textContent = "Logout successful!";
        setTimeout(() => {
          window.location.href = "../login.html";
        }, 1000);
        notice.addEventListener("transitionend", () => {
          notice.style.transform = "translateY(-100%)";
        });
      } else if (e.target.textContent === "No") {
        container.removeChild(list);
      }
    });
  });

  container.appendChild(list);
}

function settings() {
  window.location.href = "../settings.html";
}
