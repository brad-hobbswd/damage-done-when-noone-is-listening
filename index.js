document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#primary-nav");
  const searchButton = document.querySelector(".search-toggle");
  const searchPanel = document.querySelector("#site-search");
  const searchInput = document.querySelector("#search-query");
  const year = document.querySelector("#year");
  const resultsPage = document.querySelector("#search-page-results");

  // Build one consistent navigation on every page that loads this script.
  if (navigation) {
    const currentFile = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
    const groups = [
      { label: "Home", href: "index.html", direct: true, files: ["index.html"] },
      { label: "The Teaching", items: [
        ["Introduction", "intro-page.html", ["intro-page.html"]],
        ["Chapter Directory", "chapters.html", ["chapters.html"]],
        ["Part One", "part-one.html", ["part-one.html", "chapter-1.html", "chapter-2.html", "chapter-3.html"]],
        ["Part Two", "part-two.html", ["part-two.html", "chapter-4.html", "chapter-5.html", "chapter-6.html"]],
        ["Part Three", "part-three.html", ["part-three.html", "chapter-7.html", "chapter-8.html", "chapter-9.html"]],
        ["Conclusion", "conclusion.html", ["conclusion.html"]]
      ]},
      { label: "Study & Learn", items: [
        ["Study Guides", "study-guides.html", ["study-guides.html"]],
        ["Curriculum", "curriculum.html", ["curriculum.html"]],
        ["Course Syllabus", "syllabus.html", ["syllabus.html"]],
        ["Resources", "resources.html", ["resources.html"]]
      ]},
      { label: "About", items: [
        ["About the Author and Book", "about.html", ["about.html"]],
        ["Contact", "contact.html", ["contact.html"]],
        ["Copyright", "copyright.html", ["copyright.html"]],
        ["Terms of Use", "terms.html", ["terms.html"]],
        ["Privacy Policy", "privacy.html", ["privacy.html"]]
      ]}
    ];
    navigation.innerHTML = groups.map((group, index) => {
      if (group.direct) {
        const active = group.files.includes(currentFile);
        return '<a href="' + group.href + '"' + (active ? ' class="active" aria-current="page"' : '') + '>Home</a>';
      }
      const active = group.items.some(item => item[2].includes(currentFile));
      const id = "nav-dropdown-" + index;
      const links = group.items.map(item => {
        const isCurrent = item[2].includes(currentFile);
        return '<a href="' + item[1] + '"' + (isCurrent ? ' class="active" aria-current="page"' : '') + '>' + item[0] + '</a>';
      }).join("");
      return '<div class="nav-dropdown' + (active ? ' has-current' : '') + '">' +
        '<button class="nav-dropdown-toggle" type="button" aria-expanded="false" aria-controls="' + id + '">' +
        group.label + '<span class="dropdown-caret" aria-hidden="true">⌄</span></button>' +
        '<div class="nav-dropdown-menu" id="' + id + '">' + links + '</div></div>';
    }).join("");
    navigation.querySelectorAll(".nav-dropdown-toggle").forEach(button => {
      button.addEventListener("click", () => {
        const wrapper = button.closest(".nav-dropdown");
        const willOpen = !wrapper.classList.contains("dropdown-open");
        navigation.querySelectorAll(".nav-dropdown").forEach(item => {
          item.classList.remove("dropdown-open");
          item.querySelector(".nav-dropdown-toggle")?.setAttribute("aria-expanded", "false");
        });
        if (willOpen) {
          wrapper.classList.add("dropdown-open");
          button.setAttribute("aria-expanded", "true");
        }
      });
    });
    document.addEventListener("click", event => {
      if (!navigation.contains(event.target)) {
        navigation.querySelectorAll(".nav-dropdown").forEach(item => {
          item.classList.remove("dropdown-open");
          item.querySelector(".nav-dropdown-toggle")?.setAttribute("aria-expanded", "false");
        });
      }
    });
  }
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

  const pages = [
    ["index.html", "Home"], ["intro-page.html", "Introduction"],
    ["part-one.html", "Part One"], ["part-two.html", "Part Two"], ["part-three.html", "Part Three"],
    ["chapter-1.html", "Chapter 1: The Illusion of a Private Conversation"],
    ["chapter-2.html", "Chapter 2: The God Who Knows the Heart"],
    ["chapter-3.html", "Chapter 3: Accountability When No One Is Watching"],
    ["chapter-4.html", "Chapter 4: The Damage Begins Before the Person Finds Out"],
    ["chapter-5.html", "Chapter 5: A Person's Absence Is Not Permission"],
    ["chapter-6.html", "Chapter 6: When Words Leave Wounds Behind"],
    ["chapter-7.html", "Chapter 7: Not Every Prayer Request Is an Act of Love"],
    ["chapter-8.html", "Chapter 8: The Gift Does Not Excuse the Character"],
    ["chapter-9.html", "Chapter 9: When Spiritual Language Hides the Heart"],
    ["curriculum.html", "Study Curriculum"], ["syllabus.html", "Four Week Syllabus"],
    ["study-guides.html", "Study Guides"], ["resources.html", "Resources"],
    ["about.html", "About the Author"], ["contact.html", "Contact"]
  ];
  const normalize = value => value.toLocaleLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "");
  const getExcerpt = (text, query) => {
    const clean = text.replace(/\\s+/g, " ").trim();
    const lower = normalize(clean);
    const terms = normalize(query).split(/\\s+/).filter(Boolean);
    let at = -1;
    for (const term of terms) { at = lower.indexOf(term); if (at >= 0) break; }
    if (at < 0) return clean.slice(0, 180) + (clean.length > 180 ? "…" : "");
    const start = Math.max(0, at - 65);
    const end = Math.min(clean.length, at + 135);
    return (start ? "…" : "") + clean.slice(start, end) + (end < clean.length ? "…" : "");
  };

  async function runSearch(query, resultsBox, limit) {
    resultsBox.replaceChildren();
    const status = document.createElement("p");
    status.className = "search-status";
    status.textContent = "Searching the teaching…";
    resultsBox.appendChild(status);
    const terms = normalize(query).split(/\\s+/).filter(term => term.length > 1);
    try {
      const pagesContent = await Promise.all(pages.map(async ([path, label]) => {
        try {
          const response = await fetch(path);
          if (!response.ok) return null;
          const source = await response.text();
          const parsed = new DOMParser().parseFromString(source, "text/html");
          const main = parsed.querySelector("main") || parsed.body;
          main.querySelectorAll("script, style, nav, form, button, footer, header").forEach(node => node.remove());
          const text = (main.innerText || main.textContent || "").replace(/\\s+/g, " ").trim();
          const title = parsed.querySelector("h1")?.textContent.trim() || label;
          const normalizedText = normalize(title + " " + text);
          const score = terms.filter(term => normalizedText.includes(term)).length;
          return score ? { path, title, text, score, excerpt: getExcerpt(text, query) } : null;
        } catch { return null; }
      }));
      const matches = pagesContent.filter(Boolean).sort((a, b) => b.score - a.score);
      resultsBox.replaceChildren();
      const summary = document.createElement("p");
      summary.className = "search-status";
      summary.textContent = matches.length
        ? matches.length + " page" + (matches.length === 1 ? "" : "s") + " found for “" + query + "”."
        : "No matching pages found. Try a different word or phrase.";
      resultsBox.appendChild(summary);
      matches.slice(0, limit || matches.length).forEach(result => {
        const item = document.createElement("a");
        item.className = "search-result";
        item.href = result.path;
        const heading = document.createElement("strong");
        heading.textContent = result.title;
        const excerpt = document.createElement("span");
        excerpt.textContent = result.excerpt;
        item.append(heading, excerpt);
        resultsBox.appendChild(item);
      });
    } catch {
      resultsBox.replaceChildren();
      const error = document.createElement("p");
      error.className = "search-status";
      error.textContent = "Search could not load right now. Please try again.";
      resultsBox.appendChild(error);
    }
  }

  if (searchPanel && searchInput) {
    let resultsBox = searchPanel.querySelector(".site-search-results");
    if (!resultsBox) {
      resultsBox = document.createElement("div");
      resultsBox.className = "site-search-results";
      resultsBox.setAttribute("aria-live", "polite");
      resultsBox.setAttribute("role", "status");
      searchPanel.appendChild(resultsBox);
    }
    searchPanel.addEventListener("submit", event => {
      event.preventDefault();
      const query = searchInput.value.trim();
      if (!query) { searchInput.focus(); return; }
      window.location.href = "search.html?q=" + encodeURIComponent(query);
    });
  }

  if (resultsPage) {
    const params = new URLSearchParams(window.location.search);
    const query = (params.get("q") || "").trim();
    const pageInput = document.querySelector("#search-page-query");
    const form = document.querySelector("#search-page-form");
    if (pageInput) pageInput.value = query;
    if (form) form.addEventListener("submit", event => {
      event.preventDefault();
      const nextQuery = pageInput.value.trim();
      if (nextQuery) window.location.href = "search.html?q=" + encodeURIComponent(nextQuery);
    });
    if (query) runSearch(query, resultsPage);
    else {
      const note = document.createElement("p");
      note.className = "search-status";
      note.textContent = "Enter a word or phrase above to search the chapters and study resources.";
      resultsPage.appendChild(note);
    }
  }
});