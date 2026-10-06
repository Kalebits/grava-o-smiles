// Anota o que você faz na página: páginas, cliques, escolhas e mensagens de erro.
// NUNCA lê o que você digita: de campos de texto só vai o nome do campo ("digitou em Senha").
(() => {
  const limpar = (s, n = 100) => (s || "").replace(/\s+/g, " ").trim().slice(0, n);
  const CAMPO = ["input", "select", "textarea"];

  function nomeDoCampo(el) {
    const label = el.labels?.[0]?.innerText || el.closest("label")?.innerText;
    return limpar(label || el.getAttribute("aria-label") || el.placeholder || el.name || el.id, 60);
  }

  function descrever(el) {
    const alvo = el.closest("button, a, [role=button], [role=option], [role=tab], [role=menuitem], [role=radio], " +
      "[role=checkbox], label, input, select, textarea") || el;
    const tag = alvo.tagName.toLowerCase();
    const campo = CAMPO.includes(tag);
    return {
      elemento: alvo.getAttribute("role") || (tag === "input" ? `input:${alvo.type}` : tag),
      texto: campo ? "" : limpar(alvo.innerText || alvo.getAttribute("aria-label") || alvo.title),
      campo: campo ? nomeDoCampo(alvo) : "",
      id: alvo.id || alvo.getAttribute("data-testid") || "",
    };
  }

  function enviar(tipo, dados = {}) {
    try {
      chrome.runtime.sendMessage({ tipo, ...dados, url: location.origin + location.pathname, titulo: document.title });
    } catch { /* extensão recarregada: esta aba volta a gravar depois de atualizar a página */ }
  }

  document.addEventListener("click", (ev) => enviar("clique", descrever(ev.target)), true);

  document.addEventListener("change", (ev) => {
    const el = ev.target;
    if (!(el instanceof Element) || !CAMPO.includes(el.tagName.toLowerCase())) return;
    const campo = nomeDoCampo(el);
    if (el.tagName === "SELECT") enviar("escolheu", { campo, valor: limpar(el.selectedOptions[0]?.text, 60) });
    else if (el.type === "checkbox" || el.type === "radio") enviar("marcou", { campo, valor: el.checked ? "sim" : "não" });
    else enviar("digitou", { campo });  // só o nome do campo, nunca o valor
  }, true);

  // Mensagens de erro/aviso que aparecem na tela (alertas, toasts, textos de erro).
  const vistas = new Set();
  new MutationObserver(() => {
    for (const el of document.querySelectorAll("[role=alert], [aria-live=assertive], [class*=error i], [class*=erro i], [class*=alert i]")) {
      const texto = limpar(el.innerText, 200);
      if (texto && el.offsetParent && !vistas.has(texto)) {
        vistas.add(texto);
        enviar("mensagem", { texto });
      }
    }
  }).observe(document.documentElement, { childList: true, subtree: true });

  if (window === window.top) enviar("pagina");
})();
