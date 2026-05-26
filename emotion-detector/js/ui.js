/**
 * @param {HTMLElement} element
 * @param {string} message
 * @param {'info'|'error'|'success'} type
 */
export function setStatus(element, message, type = "info") {
  element.textContent = message;
  element.className = `status status--${type}`;
}

/**
 * @param {HTMLElement} barElement   - El elemento <div class="bar-fill">
 * @param {HTMLElement} labelElement - El elemento que muestra el porcentaje
 * @param {number} value             - Valor entre 0 y 1
 */
export function updateProgressBar(barElement, labelElement, value) {
  const pct = Math.round(value * 100);
  barElement.style.width = `${pct}%`;
  labelElement.textContent = `${pct}%`;

  if (value >= 0.90) {
    barElement.style.backgroundColor = "#4caf50"; // Verde: Alta confianza
  } else if (value >= 0.50) {
    barElement.style.backgroundColor = "#ffeb3b"; // Amarillo: Confianza media
  } else {
    barElement.style.backgroundColor = "#f44336"; // Rojo: Baja confianza
  }
}

/**
 * @param {HTMLElement} container  - Contenedor donde se renderizan las filas
 * @param {Array<{label: string, probability: number}>} predictions
 */
export function renderPredictions(container, predictions) {
  container.innerHTML = "";

  predictions
    .sort((a, b) => b.probability - a.probability)
    .forEach((pred) => {
      const row = document.createElement("div");
      row.className = "prediction-row";

      const label = document.createElement("span");
      label.className = "prediction-label";
      label.textContent = pred.label;

      const barWrap = document.createElement("div");
      barWrap.className = "bar-wrap";

      const barFill = document.createElement("div");
      barFill.className = "bar-fill";

      const pctLabel = document.createElement("span");
      pctLabel.className = "pct-label";

      barWrap.appendChild(barFill);
      row.appendChild(label);
      row.appendChild(barWrap);
      row.appendChild(pctLabel);
      container.appendChild(row);

      requestAnimationFrame(() => {
        updateProgressBar(barFill, pctLabel, pred.probability);
      });
    });
}

/**
 * @param {HTMLElement} element
 * @param {boolean} visible
 */
export function setVisible(element, visible) {
  element.style.display = visible ? "" : "none";
}

/**
 * @param {HTMLButtonElement} button
 * @param {string} text
 * @param {boolean} enabled
 */
export function setButton(button, text, enabled) {
  button.textContent = text;
  button.disabled = !enabled;
}