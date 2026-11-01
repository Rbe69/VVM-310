"use strict";
// Översikten visar grafer och inställningar. Alla förklarande texter (klassen "help") samlas
// på sidan Hjälp, grupperade efter rubriken de hör till. Hjälpsidan byggs av kopior, så inga
// element som app.js använder flyttas eller ändras.
(() => {
  const main = document.getElementById("page-main");
  const helpPage = document.getElementById("page-help");
  const tabMain = document.getElementById("tab-main");
  const tabHelp = document.getElementById("tab-help");
  if (!main || !helpPage) return;
  let built = false;
  const titleOf = (el) => {
    const section = el.closest("section.card, section.hero, details.fold");
    if (!section) return "Övrigt";
    if (section.dataset.helpTitle) return section.dataset.helpTitle;
    const heading = section.matches("details.fold")
      ? section.querySelector(":scope > summary strong") : section.querySelector("h2, summary");
    return heading ? heading.textContent.trim() : "Övrigt";
  };
  const build = () => {
    const intro = document.createElement("section");
    intro.className = "card";
    intro.innerHTML = "<span class=\"section-number\">FÖRKLARINGAR</span><h2>Hjälp</h2>"
      + "<p>Här samlas texterna som förklarar sidorna. Graferna och inställningarna finns på Översikt.</p>";
    helpPage.append(intro);
    const groups = new Map();
    for (const el of main.querySelectorAll(".help")) {
      if (el.parentElement?.closest(".help")) continue;
      const title = titleOf(el);
      if (!groups.has(title)) groups.set(title, []);
      groups.get(title).push(el);
    }
    for (const [title, items] of groups) {
      const card = document.createElement("section");
      card.className = "card help-group";
      const heading = document.createElement("h2");
      heading.textContent = title;
      card.append(heading);
      for (const item of items) {
        const copy = item.cloneNode(true);
        copy.removeAttribute("id");
        copy.querySelectorAll("[id]").forEach((node) => node.removeAttribute("id"));
        copy.hidden = false;
        if (copy.tagName === "DETAILS") copy.open = true;
        card.append(copy);
      }
      helpPage.append(card);
    }
    built = true;
  };
  const show = () => {
    const help = location.hash === "#hjalp";
    if (help && !built) build();
    document.body.classList.toggle("page-help", help);
    main.hidden = help;
    helpPage.hidden = !help;
    tabMain.toggleAttribute("aria-current", !help);
    tabHelp.toggleAttribute("aria-current", help);
    if (!help) return;
    window.scrollTo(0, 0);
  };
  window.addEventListener("hashchange", show);
  show();
})();
