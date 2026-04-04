const previewStatus = document.getElementById("preview-status");
const previewList = document.getElementById("preview-list");
const previewTotal = document.getElementById("preview-total");
const previewFeatured = document.getElementById("preview-featured");
const previewFilters = document.getElementById("preview-filters");
const previewCountTodas = document.getElementById("preview-count-todas");
const previewCountAlquiler = document.getElementById("preview-count-alquiler");
const previewCountVenta = document.getElementById("preview-count-venta");
const previewCountBodegas = document.getElementById("preview-count-bodegas");
const previewCountLocationPending = document.getElementById("preview-count-location-pending");
const previewEditorTitle = document.getElementById("preview-editor-title");
const previewSaveButton = document.getElementById("preview-save-button");
const previewImage = document.getElementById("preview-image");

const previewId = document.getElementById("preview-id");
const previewSourceUrl = document.getElementById("preview-source-url");
const previewTitleInput = document.getElementById("preview-title-input");
const previewLocationInput = document.getElementById("preview-location-input");
const previewCategoryInput = document.getElementById("preview-category-input");
const previewStatusInput = document.getElementById("preview-status-input");
const previewPriceInput = document.getElementById("preview-price-input");
const previewPriceLabelInput = document.getElementById("preview-price-label-input");
const previewBedsInput = document.getElementById("preview-beds-input");
const previewBathsInput = document.getElementById("preview-baths-input");
const previewBadgeTextInput = document.getElementById("preview-badge-text-input");
const previewBadgeVariantInput = document.getElementById("preview-badge-variant-input");
const previewPhoneInput = document.getElementById("preview-phone-input");
const previewInquirySourceInput = document.getElementById("preview-inquiry-source-input");
const previewImageInput = document.getElementById("preview-image-input");
const previewFeaturedInput = document.getElementById("preview-featured-input");
const previewDetailsInput = document.getElementById("preview-details-input");

const state = {
  bundle: null,
  selectedId: "",
  activeFilter: "todas",
};

function setStatus(message, kind = "muted") {
  previewStatus.textContent = message;
  previewStatus.className = `status-box ${kind}`;
}

function propertySummaryMarkup(property, selected) {
  return `
    <button type="button" class="catalog-preview-item ${selected ? "is-selected" : ""}" data-property-id="${property.id}">
      <small>${property.category || "catalogo"} · ${property.status || "disponible"}</small>
      <strong>${property.title || property.id}</strong>
      <span>${property.location || ""}</span>
    </button>
  `;
}

function filteredProperties() {
  const properties = state.bundle?.allProperties || [];
  if (state.activeFilter === "todas") {
    return properties;
  }

  if (state.activeFilter === "ubicacion-por-confirmar") {
    return properties.filter((property) => (property.location || "").trim() === "Ubicación por confirmar");
  }

  return properties.filter((property) => (property.category || "alquiler") === state.activeFilter);
}

function renderFilterCounts() {
  const properties = state.bundle?.allProperties || [];
  const counts = {
    todas: properties.length,
    alquiler: properties.filter((property) => property.category === "alquiler").length,
    venta: properties.filter((property) => property.category === "venta").length,
    bodegas: properties.filter((property) => property.category === "bodegas").length,
    ubicacionPorConfirmar: properties.filter((property) => (property.location || "").trim() === "Ubicación por confirmar").length,
  };

  previewCountTodas.textContent = String(counts.todas);
  previewCountAlquiler.textContent = String(counts.alquiler);
  previewCountVenta.textContent = String(counts.venta);
  previewCountBodegas.textContent = String(counts.bodegas);
  previewCountLocationPending.textContent = String(counts.ubicacionPorConfirmar);

  previewFilters.querySelectorAll("[data-filter]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.filter === state.activeFilter);
  });
}

function renderPropertyList() {
  const properties = filteredProperties();

  if (state.selectedId && !properties.some((property) => property.id === state.selectedId)) {
    state.selectedId = properties[0]?.id || "";
  }

  previewList.innerHTML = properties
    .map((property) => propertySummaryMarkup(property, property.id === state.selectedId))
    .join("");

  previewList.querySelectorAll("[data-property-id]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedId = button.dataset.propertyId || "";
      renderPropertyList();
      hydrateEditor();
    });
  });
}

function currentProperty() {
  return (state.bundle?.allProperties || []).find((property) => property.id === state.selectedId) || null;
}

function hydrateEditor() {
  const property = currentProperty();
  if (!property) {
    previewEditorTitle.textContent = "Seleccione una propiedad";
    previewSaveButton.disabled = true;
    previewImage.classList.add("hidden");
    return;
  }

  previewEditorTitle.textContent = `${property.id} · ${property.title || "Propiedad"}`;
  previewId.value = property.id || "";
  previewSourceUrl.value = property.sourceUrl || "";
  previewTitleInput.value = property.title || "";
  previewLocationInput.value = property.location || "";
  previewCategoryInput.value = property.category || "alquiler";
  previewStatusInput.value = property.status || "disponible";
  previewPriceInput.value = property.price ?? 0;
  previewPriceLabelInput.value = property.priceLabel || "";
  previewBedsInput.value = property.beds ?? 0;
  previewBathsInput.value = property.baths ?? 0;
  previewBadgeTextInput.value = property.badge?.text || "";
  previewBadgeVariantInput.value = property.badge?.variant || "primary";
  previewPhoneInput.value = property.contactPhone || "";
  previewInquirySourceInput.value = property.inquirySource || "catalogo";
  previewImageInput.value = property.image || "";
  previewFeaturedInput.checked = Boolean(property.featured);
  previewDetailsInput.value = (property.details || []).join("\n");

  if (property.image) {
    previewImage.src = property.image;
    previewImage.classList.remove("hidden");
  } else {
    previewImage.removeAttribute("src");
    previewImage.classList.add("hidden");
  }

  previewSaveButton.disabled = false;
}

async function fetchCatalogState() {
  const response = await fetch("/api/catalog-state", { cache: "no-store" });
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || "No se pudo cargar el catálogo publicado.");
  }
  return payload;
}

async function saveCurrentProperty() {
  const property = currentProperty();
  if (!property) {
    return;
  }

  previewSaveButton.disabled = true;
  setStatus(`Guardando cambios en ${property.id}...`, "muted");

  try {
    const response = await fetch("/api/update-catalog-property", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: previewId.value,
        sourceUrl: previewSourceUrl.value,
        title: previewTitleInput.value,
        location: previewLocationInput.value,
        category: previewCategoryInput.value,
        status: previewStatusInput.value,
        price: Number(previewPriceInput.value || 0),
        priceLabel: previewPriceLabelInput.value,
        beds: Number(previewBedsInput.value || 0),
        baths: Number(previewBathsInput.value || 0),
        image: previewImageInput.value,
        details: previewDetailsInput.value,
        badge: {
          text: previewBadgeTextInput.value,
          variant: previewBadgeVariantInput.value,
        },
        contactPhone: previewPhoneInput.value,
        inquirySource: previewInquirySourceInput.value,
        featured: previewFeaturedInput.checked,
      }),
    });

    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.error || "No se pudo guardar la propiedad.");
    }

    state.bundle = await fetchCatalogState();
    previewTotal.textContent = String(state.bundle.summary?.total || 0);
    previewFeatured.textContent = String(state.bundle.summary?.featured || 0);
    renderFilterCounts();
    renderPropertyList();
    hydrateEditor();
    setStatus(`Cambios guardados en ${payload.property?.id || property.id}.`, "success");
  } catch (error) {
    setStatus(error.message, "error");
  } finally {
    previewSaveButton.disabled = false;
  }
}

async function init() {
  setStatus("Cargando catálogo editable...", "muted");

  try {
    state.bundle = await fetchCatalogState();
    const properties = state.bundle.allProperties || [];
    previewTotal.textContent = String(state.bundle.summary?.total || 0);
    previewFeatured.textContent = String(state.bundle.summary?.featured || 0);
    renderFilterCounts();

    if (!properties.length) {
      setStatus("Todavía no hay propiedades publicadas en el catálogo.", "muted");
      previewList.innerHTML = "";
      previewSaveButton.disabled = true;
      return;
    }

    state.selectedId = properties[0].id;
    renderPropertyList();
    hydrateEditor();
    setStatus(`Catálogo editable listo con ${properties.length} propiedades.`, "success");
  } catch (error) {
    setStatus(error.message, "error");
  }
}

previewSaveButton.addEventListener("click", () => {
  void saveCurrentProperty();
});

previewFilters.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    state.activeFilter = button.dataset.filter || "todas";
    renderFilterCounts();
    renderPropertyList();
    hydrateEditor();
  });
});

init();
