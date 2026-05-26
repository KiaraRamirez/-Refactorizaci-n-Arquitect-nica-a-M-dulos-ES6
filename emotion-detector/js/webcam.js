
let stream = null;

/**
 * @param {HTMLVideoElement} videoElement 
 * @returns {Promise<MediaStream>}
 */
export async function startCamera(videoElement) {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480, facingMode: "user" },
      audio: false,
    });
    videoElement.srcObject = stream;
    await videoElement.play();
    return stream;
  } catch (error) {
    throw new Error(`No se pudo acceder a la cámara: ${error.message}`);
  }
}

/**
 * @param {HTMLVideoElement} videoElement
 */
export function stopCamera(videoElement) {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    stream = null;
  }
  if (videoElement) {
    videoElement.srcObject = null;
  }
}

/**
 * @returns {boolean}
 */
export function isCameraActive() {
  return stream !== null && stream.active;
}
