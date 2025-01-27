// Titan JS – Leaks, Language, and File Handling

// 1. Sprachdaten für DE/EN
const texts = {
  de: {
    navTitle: "TITAN",
    navHome: "Home",
    navLeaks: "Leaks",
    navContact: "Kontakt",

    homeTitle: "Willkommen bei Titan!",
    homeSubtitle: "Deine ultimative Cyber-Dominanz im Clean-Style.",

    leaksTitle: "Leaks",
    leaksSubtitle: "Neueste Enthüllungen",

    contactTitle: "Kontakt",
    contactSubtitle: "Hier findest du alles rund um unseren Discord etc.",
    discordLabel: "Unser Discord-Server",

    dateLabel: "Datum",
    descLabel: "Beschreibung",
    fileLabel: "Dateien",
    noLeaks: "Keine Leaks verfügbar."
  },
  en: {
    navTitle: "TITAN",
    navHome: "Home",
    navLeaks: "Leaks",
    navContact: "Contact",

    homeTitle: "Welcome to Titan!",
    homeSubtitle: "Your ultimate cyber dominance in a clean style.",

    leaksTitle: "Leaks",
    leaksSubtitle: "Latest revelations",

    contactTitle: "Contact",
    contactSubtitle: "Here's everything about our Discord etc.",
    discordLabel: "Our Discord Server",

    dateLabel: "Date",
    descLabel: "Description",
    fileLabel: "Files",
    noLeaks: "No leaks available."
  }
};

// 2. Aktuelle Sprache (default = DE)
let currentLang = "de";

// 3. DOM geladen → Sprache anwenden, Leaks laden
document.addEventListener("DOMContentLoaded", () => {
  const storedLang = localStorage.getItem("lang");
  if (storedLang) currentLang = storedLang;
  applyLanguage(currentLang);

  // Sprache wechseln
  const btnDe = document.getElementById("btn-de");
  const btnEn = document.getElementById("btn-en");
  if (btnDe) btnDe.addEventListener("click", () => switchLanguage("de"));
  if (btnEn) btnEn.addEventListener("click", () => switchLanguage("en"));

  // Wenn leaks.html → Leaks laden
  if (window.location.pathname.endsWith("leaks.html")) {
    loadLeaks();
  }
});

// 4. Sprache wechseln
function switchLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);
  applyLanguage(lang);
}

// 5. Texte auf der Seite anwenden
function applyLanguage(lang) {
  const elements = document.querySelectorAll("[data-key]");
  elements.forEach(el => {
    const key = el.getAttribute("data-key");
    el.textContent = texts[lang][key] || "???";
  });
}

// 6. Leaks aus leaks.json laden
function loadLeaks() {
  fetch("leaks/leaks.json")
    .then(res => res.json())
    .then(data => {
      // Sortierung: Neueste zuerst
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
      renderLeaks(data);
    })
    .catch(err => {
      console.error("Fehler beim Laden der Leaks:", err);
      const container = document.getElementById("leaks-container");
      if (container) container.innerHTML = `<p>${texts[currentLang].noLeaks}</p>`;
    });
}

// 7. Leaks rendern (inkl. description.txt)
function renderLeaks(leaks) {
  const container = document.getElementById("leaks-container");
  if (!container) return;

  if (!leaks || leaks.length === 0) {
    container.innerHTML = `<p>${texts[currentLang].noLeaks}</p>`;
    return;
  }

  let html = "";
  leaks.forEach(leak => {
    const descriptionPath = `leaks/${leak.description}`;
    fetch(descriptionPath)
      .then(res => res.text())
      .then(descriptionText => {
        // Leak-HTML aufbauen
        html += `
          <article class="leak-item">
            <h2>${leak.title}</h2>
            <div class="leak-date">${texts[currentLang].dateLabel}: ${new Date(leak.date).toDateString()}</div>
            <p><strong>${texts[currentLang].descLabel}:</strong><br>${descriptionText.replace(/\n/g, "<br>")}</p>
            <h3>${texts[currentLang].fileLabel}:</h3>
            <ul>
        `;

        // Dateien hinzufügen
        leak.files.forEach(file => {
          html += `<li><a href="leaks/${file}" download>${file}</a></li>`;
        });

        html += `
            </ul>
          </article>
        `;

        // HTML dem Container hinzufügen
        container.innerHTML = html;
      })
      .catch(err => {
        console.error(`Fehler beim Laden der Beschreibung (${leak.title}):`, err);
      });
  });
}
