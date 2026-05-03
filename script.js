const data = window.portfolioData;
const audioGrid = document.querySelector("#audioGrid");
const modelGrid = document.querySelector("#modelGrid");
const audioFilters = document.querySelector("#audioFilters");
const modelFilters = document.querySelector("#modelFilters");
const copy = data.copy || {};
let activeAudio = "All";
let activeModel = "All";
let currentAudio = null;
let currentButton = null;

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element && value) element.textContent = value;
}

if (data.pageTitle) document.title = data.pageTitle;
const description = document.querySelector('meta[name="description"]');
if (description && data.pageDescription) description.content = data.pageDescription;

document.querySelector("#footerName").textContent = data.siteName;
document.querySelector(".brand strong").textContent = data.siteName;
document.querySelector("#discordLink").href = data.discordUrl;
document.querySelector("#emailLink").href = `mailto:${data.email}`;
document.querySelector("#audioCount").textContent = data.audio.length;
document.querySelector("#modelCount").textContent = data.models.length;

setText(".brand small", copy.brandSubline);
setText('[href="#audio"]', copy.navAudio);
setText('[href="#models"]', copy.navModels);
setText('[href="#process"]', copy.navProcess);
setText(".nav-cta", copy.navContact);
setText("[data-copy='hero-eyebrow']", copy.heroEyebrow);
setText("[data-copy='hero-title']", copy.heroTitle);
setText("[data-copy='hero-text']", copy.heroText);
setText("[data-copy='hero-primary']", copy.heroPrimaryButton);
setText("[data-copy='hero-secondary']", copy.heroSecondaryButton);
setText("[data-copy='audio-eyebrow']", copy.audioEyebrow);
setText("[data-copy='audio-title']", copy.audioTitle);
setText("[data-copy='models-eyebrow']", copy.modelsEyebrow);
setText("[data-copy='models-title']", copy.modelsTitle);
setText("[data-copy='process-eyebrow']", copy.processEyebrow);
setText("[data-copy='process-title']", copy.processTitle);
setText("[data-copy='contact-eyebrow']", copy.contactEyebrow);
setText("[data-copy='contact-title']", copy.contactTitle);
setText("[data-copy='contact-text']", copy.contactText);
setText("#discordLink", copy.discordButton);
setText("#emailLink", copy.emailButton);
setText("[data-copy='footer-note']", copy.footerNote);

if (Array.isArray(copy.processSteps)) {
  document.querySelectorAll("[data-step]").forEach((step, index) => {
    const item = copy.processSteps[index];
    if (!item) return;
    const title = step.querySelector("strong");
    const text = step.querySelector("span");
    if (title) title.textContent = item.title;
    if (text) text.textContent = item.text;
  });
}

function categories(items) {
  return ["All", ...new Set(items.map((item) => item.category))];
}

function renderFilters(container, items, activeValue, onSelect) {
  container.innerHTML = "";
  categories(items).forEach((category) => {
    const button = document.createElement("button");
    button.className = `filter-button${category === activeValue ? " active" : ""}`;
    button.type = "button";
    button.textContent = category;
    button.addEventListener("click", () => onSelect(category));
    container.appendChild(button);
  });
}

function formatSeconds(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainder}`;
}

function renderAudio() {
  audioGrid.innerHTML = "";
  const visible = data.audio.filter((item) => activeAudio === "All" || item.category === activeAudio);

  visible.forEach((item) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="card-body">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <div class="meta-row">
          <span class="tag">${item.category}</span>
          <span class="tag">${item.mood}</span>
          <span class="tag">${item.length}</span>
        </div>
        <div class="player">
          <button class="play-button" type="button" aria-label="Play ${item.title}">&gt;</button>
          <div class="progress" aria-hidden="true"><span></span></div>
          <span class="time">0:00</span>
        </div>
      </div>
    `;

    const audio = new Audio(item.file);
    audio.preload = "metadata";
    audio.controlsList = "nodownload";
    const button = card.querySelector(".play-button");
    const bar = card.querySelector(".progress span");
    const time = card.querySelector(".time");

    button.addEventListener("click", () => {
      if (currentAudio && currentAudio !== audio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentButton.textContent = ">";
      }

      if (audio.paused) {
        audio.play();
        button.textContent = "||";
        currentAudio = audio;
        currentButton = button;
      } else {
        audio.pause();
        button.textContent = ">";
      }
    });

    audio.addEventListener("timeupdate", () => {
      const progress = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
      bar.style.width = `${progress}%`;
      time.textContent = formatSeconds(audio.currentTime);
    });

    audio.addEventListener("ended", () => {
      button.textContent = ">";
      bar.style.width = "0%";
      time.textContent = "0:00";
    });

    audioGrid.appendChild(card);
  });
}

function youtubeEmbed(url) {
  const parsed = new URL(url);
  const id = parsed.hostname.includes("youtu.be")
    ? parsed.pathname.slice(1)
    : parsed.searchParams.get("v");
  return `https://www.youtube.com/embed/${id}`;
}

function modelMedia(item) {
  if (item.type === "placeholder") {
    return `
      <div class="preview-scene" aria-label="${item.title} preview placeholder">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;
  }

  if (item.type === "youtube") {
    return `<iframe src="${youtubeEmbed(item.src)}" title="${item.title}" allowfullscreen loading="lazy"></iframe>`;
  }

  if (item.type === "model") {
    return `<model-viewer src="${item.src}" poster="${item.poster || ""}" camera-controls auto-rotate shadow-intensity="1" interaction-prompt="auto" ar></model-viewer>`;
  }

  return `<img src="${item.src}" alt="${item.title} preview" loading="lazy">`;
}

function renderModels() {
  modelGrid.innerHTML = "";
  const visible = data.models.filter((item) => activeModel === "All" || item.category === activeModel);

  visible.forEach((item) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="model-media">${modelMedia(item)}</div>
      <div class="card-body">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <div class="meta-row">
          <span class="tag">${item.category}</span>
          ${item.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
        </div>
      </div>
    `;
    modelGrid.appendChild(card);
  });
}

function boot() {
  const selectAudioCategory = (category) => {
    activeAudio = category;
    renderFilters(audioFilters, data.audio, activeAudio, selectAudioCategory);
    renderAudio();
  };

  const selectModelCategory = (category) => {
    activeModel = category;
    renderFilters(modelFilters, data.models, activeModel, selectModelCategory);
    renderModels();
  };

  renderFilters(audioFilters, data.audio, activeAudio, selectAudioCategory);
  renderFilters(modelFilters, data.models, activeModel, selectModelCategory);

  renderAudio();
  renderModels();
}

boot();
