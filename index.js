document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#primary-nav");
  const searchButton = document.querySelector(".search-toggle");
  const searchPanel = document.querySelector("#site-search");
  const searchInput = document.querySelector("#search-query");
  const year = document.querySelector("#year");

  if (year) year.textContent = new Date().getFullYear();

  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    });
    navigation.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      navigation.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
    }));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        navigation.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
      }
    });
  }

  if (searchButton && searchPanel) {
    searchButton.addEventListener("click", () => {
      const willOpen = searchPanel.hidden;
      searchPanel.hidden = !willOpen;
      searchButton.setAttribute("aria-expanded", String(willOpen));
      if (willOpen && searchInput) searchInput.focus();
    });
  }

  if (searchPanel && searchInput) {
    searchPanel.addEventListener("submit", event => {
      event.preventDefault();
      const query = searchInput.value.trim();
      if (!query) { searchInput.focus(); return; }
      const url = "https://www.google.com/search?q=" + encodeURIComponent('"The Damage Done When No One Is Listening" ' + query);
      window.open(url, "_blank", "noopener,noreferrer");
    });
  }
});