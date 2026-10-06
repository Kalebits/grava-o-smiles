// Recebe os passos das páginas, tira o print e manda tudo para o app Emissões MP (que salva em dados/gravacoes).
// App fechado: os passos ficam guardados na extensão e vão na próxima vez que o app estiver aberto.
const APP = "http://127.0.0.1:8765/api/gravacao";
const COM_PRINT = new Set(["clique", "pagina", "mensagem", "marcador", "nota"]);
const MAX_FILA = 500;
let ultimoPrint = 0;
let corrente = Promise.resolve(); // um passo de cada vez, na ordem

chrome.runtime.onMessage.addListener((msg, sender) => {
  corrente = corrente.then(() => registrar(msg, sender.tab)).catch(() => {});
});

async function registrar(evento, aba) {
  const { gravando, sessao } = await chrome.storage.local.get(["gravando", "sessao"]);
  if (!gravando && evento.tipo !== "fim") return;
  aba = aba || (await chrome.tabs.query({ active: true, lastFocusedWindow: true }))[0];
  evento = { ...evento, sessao, quando: new Date().toISOString() };
  if (aba && COM_PRINT.has(evento.tipo) && Date.now() - ultimoPrint > 1200) {
    ultimoPrint = Date.now();
    await new Promise((ok) => setTimeout(ok, 500)); // deixa a tela reagir ao clique
    try {
      evento.print = await chrome.tabs.captureVisibleTab(aba.windowId, { format: "jpeg", quality: 55 });
    } catch { /* página que não deixa print (ex.: chrome://) */ }
  }
  const { fila = [], contagem = 0 } = await chrome.storage.local.get(["fila", "contagem"]);
  fila.push(evento);
  const pendentes = [];
  for (const e of fila) {
    if (pendentes.length) { pendentes.push(e); continue; } // app fora: guarda o resto na ordem
    try {
      const r = await fetch(APP, { method: "POST", headers: { "Content-Type": "application/json", "X-Gravador": "1" },
        body: JSON.stringify(e) });
      if (!r.ok) throw new Error(r.status);
    } catch {
      pendentes.push(e);
    }
  }
  await chrome.storage.local.set({ fila: pendentes.slice(-MAX_FILA), contagem: contagem + 1 });
}
