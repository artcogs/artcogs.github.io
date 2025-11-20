async function renderBibtexList(bibPath, containerId) {
  try {
    const res = await fetch(bibPath);
    const bibText = await res.text();

    const entries = bibtexParse.toJSON(bibText);
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    entries.forEach((entry, idx) => {
      const tags = entry.entryTags || {};

      const title    = tags.title    || "Untitled";
      const authors  = tags.author   || "";
      const year     = tags.year     || "";
      const journal  = tags.journal  || tags.booktitle || "";
      const volume   = tags.volume   || "";
      const number   = tags.number   || "";
      const pages    = tags.pages    || "";
      const url      = tags.url      || "";
      const pdf      = tags.pdf      || "";
      const code     = tags.code     || tags.github || "";
      const doi      = tags.doi      || "";

      // APA-like formatting
      const authorsAPA = authors ? authors.replace(/\s+and\s+/g, ", ") : "";

      let apa = "";
      if (authorsAPA) apa += authorsAPA + ". ";
      if (year)       apa += `(${year}). `;
      apa += `${title}. `;
      if (journal) {
        apa += `<em>${journal}</em>`;
        if (volume) apa += `, ${volume}`;
        if (number) apa += `(${number})`;
        if (pages)  apa += `, ${pages}`;
        apa += ".";
      }
      if (doi) {
        apa += ` https://doi.org/${doi}`;
      } else if (url) {
        apa += ` ${url}`;
      }

      // BibTeX string
      const bibtexString =
        `@${entry.entryType}{${entry.citationKey},\n` +
        Object.entries(tags)
          .map(([k, v]) => `  ${k} = {${v}}`)
          .join(",\n") +
        `\n}`;

      // Unique id for collapse per card
      const collapseId = `actions-${containerId}-${idx}`;

      const card = document.createElement("div");
      // smaller vertical spacing between cards (mb-2 instead of mb-3)
      card.className = "card mb-2 shadow-sm border-0";


      card.innerHTML = `
  <div class="card-body" style="background-color:#f7f7f7; border-radius:6px; padding:0.2rem 0.4rem;">

    <!-- INLINE APA TEXT + ARROW BUTTON -->
    <div class="d-flex justify-content-between align-items-start">
      <p class="mb-1 flex-grow-1" style="padding-right:10px;">${apa}</p>

      <div style="flex: 0 0 32px; display:flex; justify-content:center;">
      <button class="btn btn-sm p-0 toggle-arrow btn-outline-info"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#${collapseId}"
              aria-expanded="false"
              aria-controls="${collapseId}"
              style="width:28px; height:28px; border-radius:10%; font-size:1.1rem; line-height:1;">
        ▾
      </button>
      </div>
    </div>

    <!-- Collapsible actions -->
    <div class="collapse mt-2" id="${collapseId}">
      <div class="d-flex flex-wrap gap-2 btn-group-area"></div>
    </div>

  </div>
`;
     

      const btnGroup = card.querySelector(".btn-group-area");

      if (url) {
        const linkBtn = document.createElement("a");
        linkBtn.href = url;
        linkBtn.target = "_blank";
        linkBtn.rel = "noopener";
        linkBtn.className = "btn btn-outline-dark btn-sm";
        linkBtn.textContent = "Paper";
        btnGroup.appendChild(linkBtn);
      }

      if (pdf) {
        const pdfBtn = document.createElement("a");
        pdfBtn.href = pdf;
        pdfBtn.target = "_blank";
        pdfBtn.rel = "noopener";
        pdfBtn.className = "btn btn-outline-dark btn-sm";
        pdfBtn.textContent = "PDF";
        btnGroup.appendChild(pdfBtn);
      }

      if (code) {
        const codeBtn = document.createElement("a");
        codeBtn.href = code;
        codeBtn.target = "_blank";
        codeBtn.rel = "noopener";
        codeBtn.className = "btn btn-outline-dark btn-sm";
        codeBtn.textContent = "Code";
        btnGroup.appendChild(codeBtn);
      }

      if (doi) {
        const doiBtn = document.createElement("a");
        doiBtn.href = `https://doi.org/${doi}`;
        doiBtn.target = "_blank";
        doiBtn.rel = "noopener";
        doiBtn.className = "btn btn-outline-dark btn-sm";
        doiBtn.textContent = "DOI";
        btnGroup.appendChild(doiBtn);
      }

      const copyBtn = document.createElement("button");
      copyBtn.type = "button";
      copyBtn.className = "btn btn-outline-dark btn-sm";
      copyBtn.textContent = "Copy BibTeX";
      copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(bibtexString)
          .then(() => {
            copyBtn.textContent = "Copied!";
            setTimeout(() => (copyBtn.textContent = "Copy BibTeX"), 1500);
          })
          .catch(err => console.error("Clipboard error:", err));
      });
      btnGroup.appendChild(copyBtn);

      container.appendChild(card);
    });
  } catch (e) {
    console.error("Error loading bib file:", bibPath, e);
    const container = document.getElementById(containerId);
    container.innerHTML =
      `<p class="text-danger">Failed to load publications from <code>${bibPath}</code>.</p>`;
  }
}

// Run after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  renderBibtexList("publications/journals.bib",    "journal-list");
  renderBibtexList("publications/conferences.bib", "conference-list");
});
