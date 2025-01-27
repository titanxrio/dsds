// Titan JS – Right-Side Nav + language + leaks

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

    dateLabel: "Hochgeladen am",
    descLabel: "Beschreibung",
    fileLabel: "Datei",
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

    dateLabel: "Uploaded on",
    descLabel: "Description",
    fileLabel: "File",
    noLeaks: "No leaks available."
  }
};

let currentLang = "de";

document.addEventListener("DOMContentLoaded", () => {
  const storedLang = localStorage.getItem("lang");
  if(storedLang) currentLang = storedLang;
  applyLanguage(currentLang);

  const btnDe = document.getElementById("btn-de");
  const btnEn = document.getElementById("btn-en");
  if(btnDe) btnDe.addEventListener("click", () => switchLanguage("de"));
  if(btnEn) btnEn.addEventListener("click", () => switchLanguage("en"));

  // Leaks laden, falls leaks.html
  if(window.location.pathname.endsWith("leaks.html")){
    loadLeaks();
  }
});

function switchLanguage(lang){
  currentLang = lang;
  localStorage.setItem("lang", lang);
  applyLanguage(lang);
}

function applyLanguage(lang){
  const elements = document.querySelectorAll("[data-key]");
  elements.forEach(el => {
    const key = el.getAttribute("data-key");
    el.textContent = texts[lang][key] || "???";
  });
}

function loadLeaks(){
  fetch("leaks/leaks.json")
    .then(res => res.json())
    .then(data => {
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
      renderLeaks(data);
    })
    .catch(err => {
      console.error("Fehler beim Laden der Leaks:", err);
      const container = document.getElementById("leaks-container");
      if(container) container.innerHTML = `<p>${texts[currentLang].noLeaks}</p>`;
    });
}

function renderLeaks(leaks){
  const container = document.getElementById("leaks-container");
  if(!container) return;

  if(!leaks || leaks.length === 0){
    container.innerHTML = `<p>${texts[currentLang].noLeaks}</p>`;
    return;
  }

  let html = "";
  leaks.forEach(leak => {
    html += `
      <article class="leak-item">
        <div class="leak-date">${texts[currentLang].dateLabel}: ${new Date(leak.date).toDateString()}</div>
        <h2>${leak.title}</h2>
        <p><strong>${texts[currentLang].descLabel}:</strong><br/>${leak.description || ""}</p>
        <p><strong>${texts[currentLang].fileLabel}:</strong></p>
        <ul>
    `;
    if(leak.files && leak.files.length > 0){
      leak.files.forEach(file => {
        html += `<li><a href="leaks/${file}" download>${file}</a></li>`;
      });
    } else {
      html += `<li>—</li>`;
    }
    html += `</ul></article>`;
  });
  container.innerHTML = html;
}
