document.querySelectorAll("a").forEach((a) => {
  const path = window.location.pathname
    .replace("/index.html", "/")
    .replace("/index", "/");
  const target = a.pathname.replace("/index.html", "/");
  if (target === path || target.slice(0, -5) == path) {
    a.classList.add("active-link");
  }
});

document.getElementById("slide").addEventListener("click", () => {
  let sidebar = document.getElementById("sidebar");
  sidebar.style.width = "100%";
});

document.getElementById("close").addEventListener("click", () => {
  let sidebar = document.getElementById("sidebar");
  sidebar.style.width = "0";
});

function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  const timeString = `${hours}:${minutes}:${seconds}`;
  document.getElementById("clock").textContent = timeString;
}

updateClock();
setInterval(updateClock, 1000);
