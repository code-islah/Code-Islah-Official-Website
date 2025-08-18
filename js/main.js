
const navbarToggler = document.querySelector(".navbarToggler");
const header = document.querySelector("header");
const close = document.querySelector(".close");
const banner = document.querySelector(".banner");

navbarToggler.addEventListener("click", () => {
  const navbar = document.querySelector("#navbar");
  navbar.classList.toggle("height-solid");
  banner.classList.toggle("d-none");
  navbar.classList.toggle("opacity-0");
});

// FIXING THE TOP HEADER
window.onscroll = () => {
  if (document.documentElement.scrollHeight > 2000) {
    if (
      document.body.scrollTop > 200 ||
      document.documentElement.scrollTop > 200
    ) {
      header.classList.add("pos-fixed");
    } else {
      header.classList.remove("pos-fixed");
    }
  }
};

// CHALLENGES COUNTED ON DOM LOAD
window.onload = () => {
  const chlngCountDisplayer = document.querySelector(
    "#navbar > ul li:nth-child(4)"
  );

  fetch("/challenges/data/countData.json")
    .then((res) => res.json())
    .then((count) => {
      chlngCountDisplayer.setAttribute("data-counted", count["count"]);
    });
};

// TOOLTIP ON FOOTER
const tooltipWindow = document.querySelector(".tooltipWindow");
function tooltip(elem) {
  const tooltipDisplayer = document.querySelector(".tooltipDisplayer");
  let message = elem.getAttribute("data-text");
  let header = elem.getAttribute("data-header");
  tooltipWindow.classList.toggle("tXtoggler");
  tooltipDisplayer.innerHTML = `<h4 class="h4 clr-text-accent">${header}</h4><br>${message}`;
}

// CLOSE BUTTON
if (close) {
  close.addEventListener("click", () => {
    tooltipWindow.classList.remove("tXtoggler");
  });
}

//Intersection Observer
document.addEventListener("DOMContentLoaded", function () {
  // Select all elements with any animate- class
  const animatedElements = document.querySelectorAll('[class*="animate-"]');

  // Set up Intersection Observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add active class to trigger animations
          entry.target.classList.add("animate");

          // Optional: Unobserve after animation to improve performance
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1, // Trigger when 10% of element is visible
      rootMargin: "-100px 0px 0px 0px", // Adjust trigger point
    }
  );

  // Observe all animated elements
  animatedElements.forEach((element) => {
    observer.observe(element);
  });
});

// NAVIGATE TO ANY CHALLENGE

function navigate() {
  const list = document.querySelectorAll(".counter div");

  let input = document.querySelector('.goTo input[type="number"]').value;

  for (let i = 0; i < list.length; i++) {
    list[i].setAttribute("ID", "item" + (i + 1));

    if ("#item" + input) {
      window.location.replace("#item" + input);
    }
  }
}
