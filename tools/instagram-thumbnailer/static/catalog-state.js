const catalogStatus = document.getElementById("catalog-status");
const catalogGrid = document.getElementById("catalog-grid");
const catalogSummary = document.getElementById("catalog-summary");
const catalogTotal = document.getElementById("catalog-total");
const catalogFeatured = document.getElementById("catalog-featured");
const catalogAvailable = document.getElementById("catalog-available");
const catalogRented = document.getElementById("catalog-rented");
const catalogSold = document.getElementById("catalog-sold");

function setStatus(message, kind = "muted") {
  catalogStatus.textContent = message;
  catalogStatus.className = `status-box ${kind}`;
}

function statusLabel(value) {
  if (value === "rentada") return "rentada";
  if (value === "vendida") return "vendida";
  return "disponible";
}

function propertyCardMarkup(property) {
  const imageMarkup = property.image ? `<img src="${property.image}" alt="">` : "";
  return `
    <article class="result-card">
      ${imageMarkup}
      <div class="result-card-body">
        <small>${property.category || "catalogo"} · ${statusLabel(property.status)}</small>
        <strong>${property.title || property.id}</strong>
        <span>${property.location || ""}</span>
        <span>${property.priceLabel || ""}</span>
      </div>
    </article>
  `;
}

async function init() {
  setStatus("Cargando estado actual del catálogo...", "muted");

  try {
    const response = await fetch("/api/catalog-state", {
      cache: "no-store",
    });
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error || "No se pudo leer el catálogo publicado.");
    }

    const properties = payload.allProperties || [];
    const summary = payload.summary || {};

    catalogTotal.textContent = String(summary.total || 0);
    catalogFeatured.textContent = String(summary.featured || 0);
    catalogAvailable.textContent = String(summary.disponible || 0);
    catalogRented.textContent = String(summary.rentada || 0);
    catalogSold.textContent = String(summary.vendida || 0);

    if (!properties.length) {
      catalogGrid.classList.add("hidden");
      catalogSummary.classList.remove("hidden");
      setStatus("Todavía no hay propiedades publicadas en el JSON del catálogo.", "muted");
      return;
    }

    catalogGrid.innerHTML = properties.map(propertyCardMarkup).join("");
    catalogGrid.classList.remove("hidden");
    catalogSummary.classList.remove("hidden");
    setStatus(`Se encontraron ${properties.length} propiedades en el catálogo publicado.`, "success");
  } catch (error) {
    catalogGrid.classList.add("hidden");
    catalogSummary.classList.add("hidden");
    setStatus(error.message, "error");
  }
}

init();
