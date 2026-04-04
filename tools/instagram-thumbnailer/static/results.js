const resultsStatus = document.getElementById("results-status");
const resultsGrid = document.getElementById("results-grid");
const priorityGrid = document.getElementById("priority-grid");
const resultsCount = document.getElementById("results-count");
const resultsProfile = document.getElementById("results-profile");
const resultsCopy = document.getElementById("results-copy");
const resultsProfileLink = document.getElementById("results-profile-link");
const prepareStatus = document.getElementById("prepare-status");
const preparePriorityButton = document.getElementById("prepare-priority-button");
const prepareAllButton = document.getElementById("prepare-all-button");
const publishCatalogButton = document.getElementById("publish-catalog-button");
const analyzeListButton = document.getElementById("analyze-list-button");
const priorityOpenedCount = document.getElementById("priority-opened-count");
const priorityFailedCount = document.getElementById("priority-failed-count");
const duplicatesStatus = document.getElementById("duplicates-status");
const duplicatesGrid = document.getElementById("duplicates-grid");
const duplicatesTotalDrafts = document.getElementById("duplicates-total-drafts");
const duplicatesTotalGroups = document.getElementById("duplicates-total-groups");
const syncDraftsButton = document.getElementById("sync-drafts-button");
const resultsProgressLabel = document.getElementById("results-progress-label");
const resultsProgressValue = document.getElementById("results-progress-value");
const resultsProgressBar = document.getElementById("results-progress-bar");

const state = {
  priorityOpened: [],
  priorityFailed: [],
  profileResults: [],
  mergedResults: [],
};

function setStatus(message, kind = "muted") {
  resultsStatus.textContent = message;
  resultsStatus.className = `status-box ${kind}`;
}

function setPrepareStatus(message, kind = "muted") {
  prepareStatus.textContent = message;
  prepareStatus.className = `status-box ${kind}`;
}

function setDuplicatesStatus(message, kind = "muted") {
  duplicatesStatus.textContent = message;
  duplicatesStatus.className = `status-box ${kind}`;
}

function setResultsProgress(label, percent) {
  const safePercent = Math.max(0, Math.min(100, Math.round(percent)));
  resultsProgressLabel.textContent = label;
  resultsProgressValue.textContent = `${safePercent}%`;
  resultsProgressBar.style.width = `${safePercent}%`;
}

function getProfileUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("instagram_url") || "https://www.instagram.com/brokermike.cr/";
}

async function fetchPriorityLinks() {
  const response = await fetch("/api/priority-links", {
    cache: "no-store",
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || "No se pudo resolver lista.md.");
  }

  return payload;
}

async function fetchInstagramProfilePosts(instagramUrl) {
  const response = await fetch("/api/profile-posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ instagram_url: instagramUrl }),
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || "No se pudo cargar el perfil.");
  }

  return {
    posts: payload.posts || [],
    count: payload.count ?? (payload.posts || []).length,
  };
}

async function prepareBatch(items) {
  const response = await fetch("/api/prepare-batch-import", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ items }),
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || "No se pudo preparar el lote.");
  }

  return payload;
}

async function fetchImportDraftsAnalysis() {
  const response = await fetch("/api/import-drafts-analysis", {
    cache: "no-store",
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || "No se pudo analizar catalog-import-drafts.json.");
  }

  return payload;
}

async function syncDraftOrder() {
  const response = await fetch("/api/sync-draft-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || "No se pudo sincronizar el orden de los borradores.");
  }

  return payload;
}

async function publishDraftsCatalog() {
  const response = await fetch("/api/publish-drafts-catalog", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || "No se pudo publicar el catálogo a la landing.");
  }

  return payload;
}

function createEditorUrl(post) {
  const targetUrl = new URL("/index.html", window.location.origin);
  targetUrl.searchParams.set("post_url", post.url);
  if (post.thumbnailUrl) {
    targetUrl.searchParams.set("thumbnail_url", post.thumbnailUrl);
  }
  targetUrl.searchParams.set("label", post.label || post.url);
  targetUrl.searchParams.set("kind", post.kind || "post");
  return targetUrl.toString();
}

function resultCardMarkup(post, { failed = false } = {}) {
  const label = post.label || post.url;
  const kind = post.kind || "post";
  const previewImage = post.thumbnailUrl
    ? `/api/source-asset?src=${encodeURIComponent(post.thumbnailUrl)}`
    : "";

  if (failed) {
    return `
      <article class="result-card">
        <div class="result-card-body">
          <small>${kind} · falló</small>
          <strong>${label}</strong>
          <span>${post.error || "No se pudo abrir este link."}</span>
        </div>
      </article>
    `;
  }

  return `
    <article class="result-card">
      <a class="result-card-link" href="${createEditorUrl(post)}">
        ${previewImage ? `<img src="${previewImage}" alt="">` : ""}
        <div class="result-card-body">
          <small>${kind}</small>
          <strong>${label}</strong>
          <span>Usar este thumbnail en el editor</span>
        </div>
      </a>
    </article>
  `;
}

function duplicateCardMarkup(group) {
  return `
    <article class="result-card">
      <div class="result-card-body">
        <small>duplicado · ${group.count} veces</small>
        <strong>${group.sourceUrl}</strong>
        <span>${group.draftIds.join(", ")}</span>
      </div>
    </article>
  `;
}

function mergeWithoutDuplicates(primary, secondary) {
  const seen = new Set();
  const merged = [];

  [...primary, ...secondary].forEach((item) => {
    const url = String(item.url || "").replace(/\/+$/, "") + "/";
    if (!url || seen.has(url)) {
      return;
    }
    seen.add(url);
    merged.push(item);
  });

  return merged;
}

function renderPrioritySection() {
  priorityOpenedCount.textContent = String(state.priorityOpened.length);
  priorityFailedCount.textContent = String(state.priorityFailed.length);

  const priorityCards = [
    ...state.priorityOpened.map((item) => resultCardMarkup(item)),
    ...state.priorityFailed.map((item) => resultCardMarkup(item, { failed: true })),
  ];

  if (priorityCards.length) {
    priorityGrid.innerHTML = priorityCards.join("");
    priorityGrid.classList.remove("hidden");
  } else {
    priorityGrid.classList.add("hidden");
  }

  preparePriorityButton.disabled = !state.priorityOpened.length;
}

function renderMergedResultsSection() {
  const remainder = state.mergedResults.filter((item) => {
    const url = String(item.url || "").replace(/\/+$/, "") + "/";
    return !state.priorityOpened.some((opened) => (String(opened.url || "").replace(/\/+$/, "") + "/") === url);
  });

  resultsCount.textContent = String(state.mergedResults.length);

  if (remainder.length) {
    resultsGrid.innerHTML = remainder.map((item) => resultCardMarkup(item)).join("");
    resultsGrid.classList.remove("hidden");
  } else {
    resultsGrid.classList.add("hidden");
  }

  prepareAllButton.disabled = !state.mergedResults.length;
}

function rebuildVisibleResults() {
  state.mergedResults = mergeWithoutDuplicates(state.priorityOpened, state.profileResults);
  renderPrioritySection();
  renderMergedResultsSection();
}

function renderDuplicatesSection(duplicatesPayload) {
  duplicatesTotalDrafts.textContent = String(duplicatesPayload.totalDrafts || 0);
  duplicatesTotalGroups.textContent = String((duplicatesPayload.duplicateGroups || []).length);

  if (duplicatesPayload.invalid) {
    duplicatesGrid.classList.add("hidden");
    setDuplicatesStatus("El archivo catalog-import-drafts.json existe pero no contiene JSON válido.", "error");
  } else if (!duplicatesPayload.exists) {
    duplicatesGrid.classList.add("hidden");
    setDuplicatesStatus("Todavía no existe catalog-import-drafts.json.", "muted");
  } else if ((duplicatesPayload.duplicateGroups || []).length) {
    duplicatesGrid.innerHTML = duplicatesPayload.duplicateGroups.map(duplicateCardMarkup).join("");
    duplicatesGrid.classList.remove("hidden");
    setDuplicatesStatus(`Se encontraron ${(duplicatesPayload.duplicateGroups || []).length} grupos duplicados en los borradores.`, "error");
  } else {
    duplicatesGrid.classList.add("hidden");
    setDuplicatesStatus("No se detectaron duplicados por sourceUrl en catalog-import-drafts.json.", "success");
  }
}

async function analyzePriorityList() {
  analyzeListButton.disabled = true;
  setResultsProgress("Analizando links de lista.md", 24);
  setStatus("Analizando links priorizados de lista.md...", "muted");

  try {
    const priorityPayload = await fetchPriorityLinks();
    state.priorityOpened = priorityPayload.opened || [];
    state.priorityFailed = priorityPayload.failed || [];
    rebuildVisibleResults();
    setResultsProgress("Lista prioritaria resuelta", 45);
    setStatus(
      `Lista analizada. Abiertos: ${state.priorityOpened.length}. Fallidos: ${state.priorityFailed.length}.`,
      "success",
    );
  } catch (error) {
    setResultsProgress("Error al analizar lista", 100);
    setStatus(error.message, "error");
  } finally {
    analyzeListButton.disabled = false;
  }
}

async function onSyncDrafts() {
  syncDraftsButton.disabled = true;
  setResultsProgress("Sincronizando orden del JSON", 88);
  setDuplicatesStatus("Sincronizando catalog-import-drafts.json con lista.md...", "muted");

  try {
    const payload = await syncDraftOrder();
    const duplicatesPayload = await fetchImportDraftsAnalysis();
    renderDuplicatesSection(duplicatesPayload);
    setResultsProgress("JSON sincronizado", 100);
    setDuplicatesStatus(
      `Sync completado. Drafts: ${payload.count}. Primer sourceUrl: ${payload.firstSourceUrl || "n/a"}.`,
      "success",
    );
  } catch (error) {
    setResultsProgress("Error en sync", 100);
    setDuplicatesStatus(error.message, "error");
  } finally {
    syncDraftsButton.disabled = false;
  }
}

async function onPreparePriority() {
  if (!state.priorityOpened.length) {
    return;
  }

  preparePriorityButton.disabled = true;
  setResultsProgress("Preparando borradores priorizados", 78);
  setPrepareStatus("Preparando borradores desde la lista abierta...", "muted");

  try {
    const payload = await prepareBatch(state.priorityOpened);
    setResultsProgress("Borradores priorizados listos", 100);
    setPrepareStatus(`Total: ${payload.count}. Nuevos: ${payload.added || 0}. Duplicados omitidos: ${payload.skippedDuplicates || 0}. Archivo: ${payload.file}`, "success");
  } catch (error) {
    setResultsProgress("Error al preparar priorizados", 100);
    setPrepareStatus(error.message, "error");
  } finally {
    preparePriorityButton.disabled = !state.priorityOpened.length;
  }
}

async function onPrepareAll() {
  if (!state.mergedResults.length) {
    return;
  }

  prepareAllButton.disabled = true;
  setResultsProgress("Preparando todos los resultados", 82);
  setPrepareStatus("Preparando borradores con todos los resultados visibles...", "muted");

  try {
    const payload = await prepareBatch(state.mergedResults);
    setResultsProgress("Lote completo listo", 100);
    setPrepareStatus(`Total: ${payload.count}. Nuevos: ${payload.added || 0}. Duplicados omitidos: ${payload.skippedDuplicates || 0}. Archivo: ${payload.file}`, "success");
  } catch (error) {
    setResultsProgress("Error al preparar lote", 100);
    setPrepareStatus(error.message, "error");
  } finally {
    prepareAllButton.disabled = !state.mergedResults.length;
  }
}

async function onPublishCatalog() {
  publishCatalogButton.disabled = true;
  setResultsProgress("Publicando catálogo en landing", 90);
  setPrepareStatus("Publicando property-catalog.json hacia landingpage...", "muted");

  try {
    const payload = await publishDraftsCatalog();
    setResultsProgress("Catálogo publicado", 100);
    setPrepareStatus(
      `Catálogo publicado. Total: ${payload.summary?.total || 0}. Featured: ${payload.summary?.featured || 0}.`,
      "success",
    );
  } catch (error) {
    setResultsProgress("Error al publicar catálogo", 100);
    setPrepareStatus(error.message, "error");
  } finally {
    publishCatalogButton.disabled = false;
  }
}

async function init() {
  const profileUrl = getProfileUrl();
  const username = new URL(profileUrl).pathname.split("/").filter(Boolean)[0] || "perfil";

  resultsProfile.textContent = `@${username}`;
  resultsProfileLink.href = profileUrl;
  resultsProfileLink.classList.remove("hidden");
  resultsCopy.textContent = `Primero se revisa lista.md y luego se completa con los posts del perfil @${username}.`;

  setStatus("Resolviendo lista prioritaria y luego el perfil...", "muted");
  setResultsProgress("Resolviendo lista prioritaria", 12);
  setPrepareStatus("Todavía no hay resultados preparados.", "muted");
  setDuplicatesStatus("Analizando borradores actuales...", "muted");

  try {
    const priorityPayload = await fetchPriorityLinks();
    setResultsProgress("Lista prioritaria resuelta", 35);
    const profilePayload = await fetchInstagramProfilePosts(profileUrl);
    setResultsProgress("Perfil cargado", 68);
    const duplicatesPayload = await fetchImportDraftsAnalysis();
    setResultsProgress("Analizando duplicados", 85);

    state.priorityOpened = priorityPayload.opened || [];
    state.priorityFailed = priorityPayload.failed || [];
    state.profileResults = profilePayload.posts || [];
    rebuildVisibleResults();
    renderDuplicatesSection(duplicatesPayload);

    if (!state.mergedResults.length) {
      setResultsProgress("Sin resultados", 100);
      setStatus("No se encontraron resultados ni en lista.md ni en el perfil.", "error");
      return;
    }

    setResultsProgress("Resultados listos", 100);
    setStatus(
      `Lista abierta: ${state.priorityOpened.length}. Fallidos: ${state.priorityFailed.length}. Total visible: ${state.mergedResults.length}.`,
      "success",
    );
  } catch (error) {
    priorityGrid.classList.add("hidden");
    resultsGrid.classList.add("hidden");
    duplicatesGrid.classList.add("hidden");
    preparePriorityButton.disabled = true;
    prepareAllButton.disabled = true;
    setResultsProgress("Error en resultados", 100);
    setStatus(error.message, "error");
    setDuplicatesStatus(error.message, "error");
  }
}

preparePriorityButton.addEventListener("click", () => {
  void onPreparePriority();
});

prepareAllButton.addEventListener("click", () => {
  void onPrepareAll();
});

publishCatalogButton.addEventListener("click", () => {
  void onPublishCatalog();
});

analyzeListButton.addEventListener("click", () => {
  void analyzePriorityList();
});

syncDraftsButton.addEventListener("click", () => {
  void onSyncDrafts();
});

init();
