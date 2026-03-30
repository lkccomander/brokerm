const resultsStatus = document.getElementById("results-status");
const resultsGrid = document.getElementById("results-grid");
const resultsCount = document.getElementById("results-count");
const resultsProfile = document.getElementById("results-profile");
const resultsCopy = document.getElementById("results-copy");
const resultsProfileLink = document.getElementById("results-profile-link");

function setStatus(message, kind = "muted") {
  resultsStatus.textContent = message;
  resultsStatus.className = `status-box ${kind}`;
}

function getProfileUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("instagram_url") || "https://www.instagram.com/brokermike.cr/";
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

function resultCardMarkup(post) {
  const label = post.label || post.url;
  const kind = post.kind || "post";
  const targetUrl = new URL("/index.html", window.location.origin);
  const previewImage = post.thumbnailUrl
    ? `/api/source-asset?src=${encodeURIComponent(post.thumbnailUrl)}`
    : "";
  targetUrl.searchParams.set("post_url", post.url);
  if (post.thumbnailUrl) {
    targetUrl.searchParams.set("thumbnail_url", post.thumbnailUrl);
  }
  targetUrl.searchParams.set("label", label);
  targetUrl.searchParams.set("kind", kind);

  return `
    <article class="result-card">
      <a class="result-card-link" href="${targetUrl.toString()}">
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

async function init() {
  const profileUrl = getProfileUrl();
  const username = new URL(profileUrl).pathname.split("/").filter(Boolean)[0] || "perfil";

  resultsProfile.textContent = `@${username}`;
  resultsProfileLink.href = profileUrl;
  resultsProfileLink.classList.remove("hidden");
  resultsCopy.textContent = `Mostrando todos los posts disponibles del perfil @${username}.`;

  setStatus("Resolviendo posts recientes del perfil...", "muted");

  try {
    const payload = await fetchInstagramProfilePosts(profileUrl);
    resultsCount.textContent = String(payload.count);

    if (!payload.posts.length) {
      resultsGrid.classList.add("hidden");
      setStatus("No se encontraron posts disponibles para este perfil.", "error");
      return;
    }

    resultsGrid.innerHTML = payload.posts.map(resultCardMarkup).join("");
    resultsGrid.classList.remove("hidden");
    setStatus(`Se encontraron ${payload.count} resultados para este perfil.`, "success");
  } catch (error) {
    resultsGrid.classList.add("hidden");
    setStatus(error.message, "error");
  }
}

init();
