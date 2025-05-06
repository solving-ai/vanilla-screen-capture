document.getElementById("capture-btn").addEventListener("click", async () => {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: { mediaSource: "screen" },
    });

    const video = document.createElement("video");
    video.srcObject = stream;

    video.onloadedmetadata = () => {
      video.play();

      const canvas = document.getElementById("screenshot-canvas");
      const context = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Detener stream después de capturar
      stream.getTracks().forEach((track) => track.stop());

      // Mostrar y permitir descargar
      canvas.style.display = "block";
      const downloadLink = document.getElementById("download-link");
      downloadLink.href = canvas.toDataURL("image/png");
      downloadLink.style.display = "inline";
      downloadLink.textContent = "Descargar Captura";
    };
  } catch (err) {
    alert("Error al capturar pantalla: " + err);
  }
});
