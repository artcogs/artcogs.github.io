function createSocialIcon(type, url) {
  const icons = {
    linkedin: "imgs/social/linkedin.png",
    scholar: "imgs/social/gscholar.png",
    orcid: "imgs/social/orcid.png",
    scopus: "imgs/social/scopus.png",
    webpage: "imgs/social/webpage.png",
    academia: "imgs/social/academia.png",
    researchgate: "imgs/social/ResearchGate.png"
  };

  if (!icons[type] || !url) return "";

  return `
    <a href="${url}" target="_blank" rel="noopener">
      <img src="${icons[type]}" alt="${type}" class="social-icon">
    </a>
  `;
}

function renderPeople(list, containerId, size = "normal") {
  const container = document.getElementById(containerId);

  if (!container) {
    console.error("Container not found:", containerId);
    return;
  }

  // 🎯 Size configurations
  const sizeConfig = {
    normal: {
      col: "col-12 col-sm-6 col-md-4 col-lg-3",
      card: "",
      imgStyle: "aspect-ratio:1/1; object-fit:cover;"
    },
    small: {
      col: "col-6 col-sm-4 col-md-3 col-lg-2",
      card: "small-card",
      imgStyle: "aspect-ratio:1/1; object-fit:cover; max-height:140px;"
    },
    xsmall: {
      col: "col-6 col-sm-3 col-md-2 col-lg-2",
      card: "xsmall-card",
      imgStyle: "aspect-ratio:1/1; object-fit:cover; max-height:100px;"
    }
  };

  const config = sizeConfig[size] || sizeConfig.normal;

  container.innerHTML = "";

  list.forEach(person => {

    const roles = (person.role || [])
      .map(r => `<h6 class="card-title mb-0">${r}</h6>`)
      .join("");

    const email = person.email
      ? `<h6>${person.email}</h6>`
      : "";

    const links = Object.entries(person.links || {})
      .map(([key, url]) => createSocialIcon(key, url))
      .join("");

    const card = `
      <div class="${config.col} mb-3">
        <div class="card text-center h-100 shadow-sm ${config.card}">
          <div class="card-body">

            <img src="${person.img}" 
                 class="card-img-top mb-2"
                 alt="${person.name}"
                 style="${config.imgStyle}">

            <h5 class="card-title mb-2">${person.name}</h5>

            ${roles}
            ${email}

            <div class="d-flex justify-content-center gap-2 mt-2 flex-wrap">
              ${links}
            </div>

          </div>
        </div>
      </div>
    `;

    container.innerHTML += card;
  });
}