const form = document.getElementById("resolve-form");
const instagramInput = document.getElementById("instagram-url");
const outputWidthInput = document.getElementById("output-width");
const outputHeightInput = document.getElementById("output-height");
const outputFormatInput = document.getElementById("output-format");
const jpegQualityInput = document.getElementById("jpeg-quality");
const zoomInput = document.getElementById("zoom");
const offsetXInput = document.getElementById("offset-x");
const offsetYInput = document.getElementById("offset-y");
const retouchEnabledInput = document.getElementById("retouch-enabled");
const retouchDirectionInput = document.getElementById("retouch-direction");
const retouchSoftnessInput = document.getElementById("retouch-softness");
const retouchWidthInput = document.getElementById("retouch-width");
const retouchHeightInput = document.getElementById("retouch-height");
const retouchXInput = document.getElementById("retouch-x");
const retouchYInput = document.getElementById("retouch-y");
const videoNudges = document.getElementById("video-nudges");
const videoTimeField = document.getElementById("video-time-field");
const videoTimeInput = document.getElementById("video-time");
const videoTimeLabel = document.getElementById("video-time-label");
const videoNudgeButtons = document.querySelectorAll("[data-video-nudge]");
const downloadButton = document.getElementById("download-button");
const statusBox = document.getElementById("status-box");
const sourceLink = document.getElementById("source-link");
const postMeta = document.getElementById("post-meta");
const postTitle = document.getElementById("post-title");
const profileBrowser = document.getElementById("profile-browser");
const profilePosts = document.getElementById("profile-posts");
const canvas = document.getElementById("preview-canvas");
const sourceVideo = document.getElementById("source-video");
const context = canvas.getContext("2d");

const state = {
  image: null,
  mediaKind: "image",
  title: "",
  canonicalUrl: "",
  filenameStem: "brokermike-thumbnail",
  videoObjectUrl: "",
};

function setStatus(message, kind = "muted") {
  statusBox.textContent = message;
  statusBox.className = `status-box ${kind}`;
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80) || "brokermike-thumbnail";
}

function currentSource() {
  if (state.mediaKind === "video" && sourceVideo.readyState >= 2) {
    return sourceVideo;
  }

  return state.image;
}

function isInstagramProfileUrl(value) {
  try {
    const parsed = new URL(value);
    const host = parsed.hostname.toLowerCase();
    if (!host.includes("instagram.com")) {
      return false;
    }

    const parts = parsed.pathname.split("/").filter(Boolean);
    return parts.length === 1 && !["p", "reel", "reels", "tv", "stories", "explore"].includes(parts[0]);
  } catch {
    return false;
  }
}

function hideProfileBrowser() {
  profilePosts.innerHTML = "";
  profileBrowser.classList.add("hidden");
}

function renderProfilePosts(posts) {
  profilePosts.innerHTML = "";

  posts.forEach((post) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "profile-card";
    button.innerHTML = `
      ${post.thumbnailUrl ? `<img src="${post.thumbnailUrl}" alt="">` : ""}
      <small>${post.kind}</small>
      <strong>${post.label || post.url}</strong>
    `;
    button.addEventListener("click", async () => {
      hideProfileBrowser();
      await loadProfileThumbnail(post);
    });
    profilePosts.appendChild(button);
  });

  profileBrowser.classList.remove("hidden");
}

async function loadProfileThumbnail(post) {
  if (!post.thumbnailUrl) {
    await submitResolveUrl(post.url);
    return;
  }

  setStatus("Cargando thumbnail limpio desde el perfil...", "muted");
  downloadButton.disabled = true;

  try {
    unloadVideo();
    await loadImage(`/api/source-asset?src=${encodeURIComponent(post.thumbnailUrl)}`);

    state.title = post.label || "Post de Instagram";
    state.canonicalUrl = post.url;
    state.filenameStem = slugify(state.title);
    state.mediaKind = "image";

    sourceLink.href = state.canonicalUrl;
    sourceLink.classList.remove("hidden");
    postTitle.textContent = `${state.title} (thumbnail del perfil)`;
    postMeta.classList.remove("hidden");

    paintCanvas();
    setStatus("Thumbnail limpio cargado desde la grilla del perfil.", "success");
  } catch (error) {
    state.image = null;
    state.mediaKind = "image";
    paintCanvas();
    sourceLink.classList.add("hidden");
    postMeta.classList.add("hidden");
    setStatus(error.message, "error");
  }
}

function fitCover(source, targetWidth, targetHeight, zoom, offsetX, offsetY) {
  const scale = Math.max(targetWidth / source.width, targetHeight / source.height) * zoom;
  const drawWidth = source.width * scale;
  const drawHeight = source.height * scale;
  const maxOffsetX = Math.max(0, (drawWidth - targetWidth) / 2);
  const maxOffsetY = Math.max(0, (drawHeight - targetHeight) / 2);

  const x = (targetWidth - drawWidth) / 2 + (maxOffsetX * offsetX) / 100;
  const y = (targetHeight - drawHeight) / 2 + (maxOffsetY * offsetY) / 100;

  return { x, y, drawWidth, drawHeight };
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function safeInitialVideoSecond(duration) {
  if (!duration || duration <= 0) {
    return 0;
  }

  return clamp(Math.min(1, duration * 0.12), 0, Math.max(0, duration - 0.1));
}

function toCanvasCenterOffset(inputValue, size, limit) {
  const freeSpace = Math.max(0, limit - size);
  return (freeSpace / 2) * (Number(inputValue) / 100);
}

function averageColorFromRegion(imageData, startX, startY, width, height) {
  const x1 = clamp(Math.round(startX), 0, imageData.width);
  const y1 = clamp(Math.round(startY), 0, imageData.height);
  const x2 = clamp(Math.round(startX + width), 0, imageData.width);
  const y2 = clamp(Math.round(startY + height), 0, imageData.height);

  let red = 0;
  let green = 0;
  let blue = 0;
  let alpha = 0;
  let count = 0;

  for (let y = y1; y < y2; y += 1) {
    for (let x = x1; x < x2; x += 1) {
      const index = (y * imageData.width + x) * 4;
      red += imageData.data[index];
      green += imageData.data[index + 1];
      blue += imageData.data[index + 2];
      alpha += imageData.data[index + 3];
      count += 1;
    }
  }

  if (!count) {
    return { red: 20, green: 28, blue: 40, alpha: 255 };
  }

  return {
    red: Math.round(red / count),
    green: Math.round(green / count),
    blue: Math.round(blue / count),
    alpha: Math.round(alpha / count),
  };
}

function applyRetouchPatch(width, height) {
  if (!retouchEnabledInput.checked) {
    return;
  }

  const patchWidth = clamp(Number(retouchWidthInput.value) || 0, 24, width);
  const patchHeight = clamp(Number(retouchHeightInput.value) || 0, 24, height);
  const patchX = (width - patchWidth) / 2 + toCanvasCenterOffset(retouchXInput.value, patchWidth, width);
  const patchY = (height - patchHeight) / 2 + toCanvasCenterOffset(retouchYInput.value, patchHeight, height);
  const softness = clamp(Number(retouchSoftnessInput.value) || 0, 0, 24);
  const direction = retouchDirectionInput.value;

  let sourceX = patchX;
  let sourceY = patchY;

  if (direction === "up") {
    sourceY = patchY - patchHeight;
  } else if (direction === "down") {
    sourceY = patchY + patchHeight;
  } else if (direction === "left") {
    sourceX = patchX - patchWidth;
  } else if (direction === "right") {
    sourceX = patchX + patchWidth;
  }

  sourceX = clamp(sourceX, 0, width - patchWidth);
  sourceY = clamp(sourceY, 0, height - patchHeight);

  const snapshot = document.createElement("canvas");
  snapshot.width = width;
  snapshot.height = height;
  const snapshotContext = snapshot.getContext("2d");
  snapshotContext.drawImage(canvas, 0, 0);

  context.save();
  context.filter = `blur(${softness}px)`;
  context.drawImage(
    snapshot,
    sourceX,
    sourceY,
    patchWidth,
    patchHeight,
    patchX,
    patchY,
    patchWidth,
    patchHeight,
  );
  context.restore();

  const colorRegion = snapshotContext.getImageData(
    Math.floor(sourceX),
    Math.floor(sourceY),
    Math.max(1, Math.floor(patchWidth)),
    Math.max(1, Math.floor(patchHeight)),
  );
  const averageColor = averageColorFromRegion(colorRegion, 0, 0, colorRegion.width, colorRegion.height);

  context.save();
  context.fillStyle = `rgba(${averageColor.red}, ${averageColor.green}, ${averageColor.blue}, 0.16)`;
  context.beginPath();
  context.roundRect(patchX, patchY, patchWidth, patchHeight, Math.min(softness + 12, 22));
  context.fill();
  context.restore();
}

function paintCanvas() {
  const width = Number(outputWidthInput.value) || 512;
  const height = Number(outputHeightInput.value) || 288;
  const source = currentSource();

  canvas.width = width;
  canvas.height = height;

  context.clearRect(0, 0, width, height);
  context.fillStyle = "#eef2f5";
  context.fillRect(0, 0, width, height);

  if (!source) {
    context.fillStyle = "#51606d";
    context.font = "600 16px Segoe UI";
    context.fillText("Resuelva un post de Instagram para ver el preview", 24, height / 2);
    downloadButton.disabled = true;
    return;
  }

  const naturalWidth = source.videoWidth || source.naturalWidth || source.width;
  const naturalHeight = source.videoHeight || source.naturalHeight || source.height;
  const cover = fitCover(
    { width: naturalWidth, height: naturalHeight },
    width,
    height,
    Number(zoomInput.value),
    Number(offsetXInput.value),
    Number(offsetYInput.value),
  );

  context.drawImage(source, cover.x, cover.y, cover.drawWidth, cover.drawHeight);
  applyRetouchPatch(width, height);
  downloadButton.disabled = false;
}

async function loadImage(proxyImageUrl) {
  const response = await fetch(proxyImageUrl);
  if (!response.ok) {
    throw new Error("No se pudo descargar la portada del post.");
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);

  try {
    const image = new Image();
    image.decoding = "async";

    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = () => reject(new Error("No se pudo cargar la imagen descargada."));
      image.src = objectUrl;
    });

    state.image = image;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

async function loadVideo(proxyVideoUrl) {
  const response = await fetch(proxyVideoUrl);
  if (!response.ok) {
    throw new Error("No se pudo descargar el video del post.");
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  if (state.videoObjectUrl) {
    URL.revokeObjectURL(state.videoObjectUrl);
  }
  state.videoObjectUrl = objectUrl;
  sourceVideo.pause();

  await new Promise((resolve, reject) => {
    const onLoadedMetadata = () => {
      sourceVideo.removeEventListener("error", onError);
      resolve();
    };

    const onError = () => {
      sourceVideo.removeEventListener("loadedmetadata", onLoadedMetadata);
      reject(new Error("No se pudo cargar el video descargado."));
    };

    sourceVideo.addEventListener("loadedmetadata", onLoadedMetadata, { once: true });
    sourceVideo.addEventListener("error", onError, { once: true });
    sourceVideo.src = objectUrl;
    sourceVideo.load();
  });

  const initialSecond = safeInitialVideoSecond(sourceVideo.duration || 0);
  videoTimeInput.max = String(Math.max(0, sourceVideo.duration || 0));
  videoTimeInput.value = String(initialSecond);
  videoTimeLabel.textContent = `${initialSecond.toFixed(1)} s`;
  videoTimeField.classList.remove("hidden");
  videoNudges.classList.remove("hidden");
  await seekVideo(initialSecond);
}

function unloadVideo() {
  sourceVideo.pause();
  sourceVideo.removeAttribute("src");
  sourceVideo.load();
  if (state.videoObjectUrl) {
    URL.revokeObjectURL(state.videoObjectUrl);
    state.videoObjectUrl = "";
  }
  videoTimeField.classList.add("hidden");
  videoNudges.classList.add("hidden");
  videoTimeInput.value = "0";
  videoTimeInput.max = "0";
  videoTimeLabel.textContent = "0.0 s";
}

function seekVideo(seconds) {
  return new Promise((resolve, reject) => {
    if (state.mediaKind !== "video") {
      resolve();
      return;
    }

    const target = Math.min(Math.max(seconds, 0), sourceVideo.duration || 0);
    const onSeeked = () => {
      sourceVideo.removeEventListener("error", onError);
      resolve();
    };

    const onError = () => {
      sourceVideo.removeEventListener("seeked", onSeeked);
      reject(new Error("No se pudo mover el video al segundo solicitado."));
    };

    sourceVideo.addEventListener("seeked", onSeeked, { once: true });
    sourceVideo.addEventListener("error", onError, { once: true });
    sourceVideo.currentTime = target;
  });
}

async function updateVideoSecond(seconds) {
  const clamped = clamp(seconds, 0, Number(videoTimeInput.max) || 0);
  videoTimeInput.value = String(clamped);
  videoTimeLabel.textContent = `${clamped.toFixed(1)} s`;

  if (state.mediaKind !== "video") {
    return;
  }

  await seekVideo(clamped);
  paintCanvas();
}

async function resolveInstagramPost(instagramUrl) {
  const response = await fetch("/api/resolve", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ instagram_url: instagramUrl }),
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || "No se pudo resolver el post.");
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

  return payload.posts || [];
}

function openProfileResults(instagramUrl) {
  const targetUrl = new URL("/resultados.html", window.location.origin);
  targetUrl.searchParams.set("instagram_url", instagramUrl);
  window.location.href = targetUrl.toString();
}

async function submitResolveUrl(instagramUrl) {
  setStatus("Resolviendo media del post...", "muted");
  downloadButton.disabled = true;

  try {
    const payload = await resolveInstagramPost(instagramUrl);
    hideProfileBrowser();

    state.title = payload.title || "Post de Instagram";
    state.canonicalUrl = payload.canonicalUrl || instagramUrl;
    state.filenameStem = slugify(state.title);
    state.mediaKind = payload.mediaKind || "image";
    state.image = null;

    if (state.mediaKind === "video" && payload.proxyVideoUrl) {
      await loadVideo(payload.proxyVideoUrl);
      setStatus(
        payload.note || "Video listo. Elija el segundo exacto, ajuste el recorte y descargue el thumbnail.",
        "success",
      );
    } else {
      unloadVideo();
      await loadImage(payload.proxyImageUrl);
      setStatus(payload.note || "Imagen lista. Ajuste el recorte y descargue el thumbnail.", "success");
    }

    sourceLink.href = state.canonicalUrl;
    sourceLink.classList.remove("hidden");
    postTitle.textContent = `${state.title} (${state.mediaKind === "video" ? "video" : "imagen"})`;
    postMeta.classList.remove("hidden");

    paintCanvas();
  } catch (error) {
    state.image = null;
    state.mediaKind = "image";
    unloadVideo();
    paintCanvas();
    sourceLink.classList.add("hidden");
    postMeta.classList.add("hidden");
    setStatus(error.message, "error");
  }
}

async function handleSubmit(event) {
  event.preventDefault();
  const instagramUrl = instagramInput.value.trim();
  if (!instagramUrl) {
    return;
  }

  if (isInstagramProfileUrl(instagramUrl)) {
    setStatus("Abriendo pagina de resultados del perfil...", "muted");
    openProfileResults(instagramUrl);
    return;
  }

  await submitResolveUrl(instagramUrl);
}

function downloadCurrentCanvas() {
  if (!currentSource()) {
    return;
  }

  const mimeType = outputFormatInput.value;
  const extension = mimeType === "image/png" ? "png" : "jpg";
  const quality = mimeType === "image/jpeg" ? Number(jpegQualityInput.value) : undefined;

  canvas.toBlob(
    (blob) => {
      if (!blob) {
        setStatus("No se pudo generar el archivo descargable.", "error");
        return;
      }

      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `${state.filenameStem}-${canvas.width}x${canvas.height}.${extension}`;
      link.click();
      URL.revokeObjectURL(objectUrl);
    },
    mimeType,
    quality,
  );
}

form.addEventListener("submit", handleSubmit);
downloadButton.addEventListener("click", downloadCurrentCanvas);
[outputWidthInput, zoomInput, offsetXInput, offsetYInput].forEach((input) => {
  input.addEventListener("input", paintCanvas);
});

[
  retouchEnabledInput,
  retouchDirectionInput,
  retouchSoftnessInput,
  retouchWidthInput,
  retouchHeightInput,
  retouchXInput,
  retouchYInput,
].forEach((input) => {
  input.addEventListener("input", paintCanvas);
  input.addEventListener("change", paintCanvas);
});

videoTimeInput.addEventListener("input", async () => {
  try {
    await updateVideoSecond(Number(videoTimeInput.value) || 0);
  } catch (error) {
    setStatus(error.message, "error");
  }
});

videoNudgeButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    if (state.mediaKind !== "video") {
      return;
    }

    try {
      const nextSecond = (Number(videoTimeInput.value) || 0) + Number(button.dataset.videoNudge || 0);
      await updateVideoSecond(nextSecond);
    } catch (error) {
      setStatus(error.message, "error");
    }
  });
});

outputFormatInput.addEventListener("change", () => {
  jpegQualityInput.disabled = outputFormatInput.value !== "image/jpeg";
});

async function hydrateFromQueryParams() {
  const params = new URLSearchParams(window.location.search);
  const postUrl = params.get("post_url");
  const thumbnailUrl = params.get("thumbnail_url");
  const label = params.get("label");
  const kind = params.get("kind");

  if (!postUrl) {
    return;
  }

  if (thumbnailUrl) {
    await loadProfileThumbnail({
      url: postUrl,
      thumbnailUrl,
      label: label || postUrl,
      kind: kind || "post",
    });
    return;
  }

  await submitResolveUrl(postUrl);
}

paintCanvas();
hydrateFromQueryParams().catch((error) => {
  setStatus(error.message, "error");
});
