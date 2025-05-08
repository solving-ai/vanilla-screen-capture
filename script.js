(function () {
  function loadHtmlToImage(callback) {
    if (window.htmlToImage) {
      callback();
    } else {
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/html-to-image/1.11.11/html-to-image.min.js";
      script.onload = callback;
      script.onerror = () => console.error("Error cargando html-to-image");
      document.head.appendChild(script);
    }
  }

  function startPlugin() {
    if (!window.htmlToImage) {
      console.error("html-to-image no disponible");
      return;
    }

    const style = document.createElement("style");
    style.textContent = `
      #capture-screen-btn {
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: #6941C6;
        color: white;
        padding: 10px 16px;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        z-index: 99999;
        font-size: 14px;
      }
      #capture-screen-btn.capturing {
        background: #F79009;
      }
      #capture-screen-modal {
        display: none;
        position: fixed;
        z-index: 99998;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow-y: auto;
        background-color: rgba(0, 0, 0, 0.6);
      }
      #capture-screen-content {
        background: white;
        margin: 5% auto;
        padding: 20px;
        width: 90%;
        max-width: 600px;
        border-radius: 8px;
        text-align: center;
      }
      .capture-thumb img {
        max-width: 100%;
        border: 1px solid #ccc;
        margin: 10px 0;
      }
    `;
    document.head.appendChild(style);

    const html = `
      <button id="capture-screen-btn">Capturar imágenes</button>
      <div id="capture-screen-modal">
        <div id="capture-screen-content">
          <h3>Capturas</h3>
          <div id="capture-screen-results"></div>
          <br />
          <button onclick="document.getElementById('capture-screen-modal').style.display='none'">Cerrar</button>
        </div>
      </div>
    `;
    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.appendChild(container);

    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    async function startCapturing() {
      const btn = document.getElementById("capture-screen-btn");
      btn.disabled = true;
      btn.textContent = "Capturando...";
      btn.classList.add("capturing");

      const results = document.getElementById("capture-screen-results");
      results.innerHTML = "";
      document.getElementById("capture-screen-modal").style.display = "block";

      for (let i = 0; i < 5; i++) {
        try {
          const dataUrl = await htmlToImage.toPng(document.documentElement);
          const div = document.createElement("div");
          div.className = "capture-thumb";
          div.innerHTML = `
            <img src="${dataUrl}" />
            <br />
            <a href="${dataUrl}" download="captura-${
            i + 1
          }.png">Descargar captura ${i + 1}</a>
            <hr />
          `;
          results.appendChild(div);
        } catch (e) {
          console.error("Error al capturar:", e);
        }
        await sleep(1000);
      }

      btn.disabled = false;
      btn.textContent = "Capturar imágenes";
      btn.classList.remove("capturing");
    }

    document
      .getElementById("capture-screen-btn")
      .addEventListener("click", startCapturing);
  }

  document.addEventListener("DOMContentLoaded", () =>
    loadHtmlToImage(startPlugin)
  );
})();
