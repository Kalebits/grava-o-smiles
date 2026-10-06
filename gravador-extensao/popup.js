const $ = (s) => document.querySelector(s);

async function desenhar() {
  const { gravando, fila = [], contagem = 0 } = await chrome.storage.local.get(["gravando", "fila", "contagem"]);
  $("#estado").innerHTML = "";
  const linha = document.createElement("span");
  linha.textContent = gravando ? `● Gravando (${contagem} passos)` : "Parado";
  linha.className = gravando ? "gravando" : "";
  $("#estado").append(linha);
  if (fila.length) $("#estado").append(` · ${fila.length} esperando o app abrir`);
  $("#alternar").textContent = gravando ? "Parar gravação" : "Começar a gravar";
  $("#alternar").classList.toggle("parar", !!gravando);
  $("#marcador").disabled = $("#salvar-nota").disabled = !gravando;
}

$("#alternar").onclick = async () => {
  const { gravando } = await chrome.storage.local.get("gravando");
  if (gravando) {
    await chrome.runtime.sendMessage({ tipo: "fim" });
    await chrome.storage.local.set({ gravando: false });
  } else {
    const sessao = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    await chrome.storage.local.set({ gravando: true, sessao, contagem: 0 });
    await chrome.runtime.sendMessage({ tipo: "inicio" });
  }
  desenhar();
};

$("#marcador").onclick = async () => { await chrome.runtime.sendMessage({ tipo: "marcador" }); desenhar(); };
$("#salvar-nota").onclick = async () => {
  const texto = $("#nota").value.trim();
  if (!texto) return;
  await chrome.runtime.sendMessage({ tipo: "nota", texto });
  $("#nota").value = "";
  desenhar();
};

desenhar();
