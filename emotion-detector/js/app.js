

import { startCamera, stopCamera, isCameraActive } from "./webcam.js";
import { setStatus, renderPredictions, setVisible, setButton } from "./ui.js";
import { loadModel, predict, isModelLoaded } from "./model.js";


const video        = document.getElementById("video");
const canvas       = document.getElementById("canvas");
const statusEl     = document.getElementById("status");
const resultsEl    = document.getElementById("results");
const btnStart     = document.getElementById("btn-start");
const btnStop      = document.getElementById("btn-stop");
const btnCapture   = document.getElementById("btn-capture");
const loaderEl     = document.getElementById("loader");

const ctx = canvas.getContext("2d");

let inferenceLoop = null;


async function init() {
  setStatus(statusEl, "Cargando modelo TensorFlow.js…", "info");
  setButton(btnStart, "Iniciar cámara", false);
  setVisible(loaderEl, true);

  try {
    await loadModel();
    setStatus(statusEl, "Modelo listo. Pulsa «Iniciar cámara».", "success");
    setButton(btnStart, "Iniciar cámara", true);
  } catch (err) {
    setStatus(statusEl, `Error al cargar el modelo: ${err.message}`, "error");
  } finally {
    setVisible(loaderEl, false);
  }
}


btnStart.addEventListener("click", async () => {
  try {
    setStatus(statusEl, "Solicitando permiso de cámara…", "info");
    setButton(btnStart, "Iniciando…", false);

    await startCamera(video);

    setStatus(statusEl, "Cámara activa. Analizando en tiempo real…", "success");
    setButton(btnStart, "Iniciar cámara", false);
    setButton(btnStop, "Detener", true);
    setButton(btnCapture, "Capturar frame", true);

    startInferenceLoop();
  } catch (err) {
    setStatus(statusEl, err.message, "error");
    setButton(btnStart, "Iniciar cámara", true);
  }
});


btnStop.addEventListener("click", () => {
  stopInferenceLoop();
  stopCamera(video);

  setStatus(statusEl, "Cámara detenida.", "info");
  setButton(btnStart, "Iniciar cámara", true);
  setButton(btnStop, "Detener", false);
  setButton(btnCapture, "Capturar frame", false);
  resultsEl.innerHTML = "";
});


btnCapture.addEventListener("click", async () => {
  if (!isCameraActive()) return;
  stopInferenceLoop(); // Pausa el loop automático

  canvas.width  = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0);

  setStatus(statusEl, "Analizando frame capturado…", "info");
  try {
    const preds = await predict(canvas);
    renderPredictions(resultsEl, preds);
    setStatus(statusEl, "Análisis completado.", "success");
  } catch (err) {
    setStatus(statusEl, `Error en inferencia: ${err.message}`, "error");
  }

  startInferenceLoop();
});


function startInferenceLoop() {
  if (inferenceLoop) return;
  inferenceLoop = setInterval(async () => {
    if (!isCameraActive() || !isModelLoaded()) return;

    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    try {
      const preds = await predict(canvas);
      renderPredictions(resultsEl, preds);
    } catch (_) {
    }
  }, 800);
}

function stopInferenceLoop() {
  if (inferenceLoop) {
    clearInterval(inferenceLoop);
    inferenceLoop = null;
  }
}


init();
