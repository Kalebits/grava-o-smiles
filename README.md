# Grava o Smiles

A emissão na Smiles é feita à mão, do começo ao fim, e quase tudo o que importa nela não está escrito em lugar
nenhum: qual pop-up fechar, quando manter a tarifa atual, o que fazer quando aparece "Ops, algo deu errado". Isso mora
na cabeça de quem emite. Explicar depois, com prints soltos, perde justamente o que acontece entre uma tela e outra.

O Grava o Smiles é uma extensão de navegador que anota o que você faz enquanto emite. Você liga, emite normalmente,
desliga. Depois, com a sequência de passos na mão, dá para escrever o processo, ver onde ele trava e tirar dúvidas.

## O que ela anota

Só enquanto a gravação está ligada:

| Anota | Exemplo |
|---|---|
| Cada página aberta | endereço e título da página |
| Cada clique, pelo texto do botão | "Continuar para pagamento", "Manter tarifa atual" |
| Escolhas em listas e caixas | tarifa "Smiles & Money", "Quero seguro: não" |
| Mensagens de erro que aparecem na tela | "Ocorreu um erro inesperado" |
| Um print da tela a cada clique | |
| Marcações e notas suas | "começou outra emissão", "aqui sempre trava, eu faço X" |

## O que ela nunca anota

**O que você digita.** De um campo de texto ela registra só o nome do campo ("digitou em CPF", "digitou em Senha"),
nunca o valor. Senha, CPF, cartão e nome do passageiro digitados não entram na gravação.

Os prints, porém, mostram a tela como ela está, e a tela pode ter nome e CPF de passageiro. Por isso eles não saem do
seu computador (veja abaixo).

## Para onde vai a gravação

A extensão não guarda a gravação sozinha: ela manda cada passo para o **app Emissões MP**, que roda no seu computador
(`http://127.0.0.1:8765`) e salva tudo em `dados/gravacoes/<data e hora>/`, um arquivo com os passos e os prints.

- Se o app estiver fechado, a extensão segura os passos (até 500) e manda quando ele abrir.
- Nada vai para a internet: o envio é para o próprio computador.
- O app apaga as gravações depois de 90 dias.

Sem o app Emissões MP, a extensão grava, mas os passos ficam parados na fila dela.

## Como usar

1. Clique no ícone da extensão e em **Começar a gravar**. O botão fica vermelho e mostra quantos passos já foram.
2. Emita normalmente.
3. A cada emissão nova, clique em **Marcar: começou outra emissão**, para separar uma da outra.
4. Viu algo que merece explicação? Escreva na **nota rápida** e clique em **Salvar nota**.
5. No fim, **Parar gravação**.

Pode gravar várias emissões seguidas e olhar tudo depois.

## Instalar

A extensão não está na loja do Chrome: você baixa daqui e o navegador carrega a pasta direto do seu computador.
Funciona no Chrome, Brave, Opera, Opera GX e Edge (no Firefox, não).

1. Nesta página, clique no botão verde **Code** → **Download ZIP**. Extraia o ZIP numa pasta fixa, por exemplo em
   Documentos, e não apague nem mova essa pasta depois: o navegador lê a extensão de lá.
2. Abra a página de extensões do navegador: `chrome://extensions`, `brave://extensions`, `opera://extensions` ou
   `edge://extensions`.
3. Ligue o **Modo do desenvolvedor** (chave no canto de cima; no Edge, no menu da esquerda).
4. Clique em **Carregar sem compactação** e escolha a pasta **`gravador-extensao`** (a que tem o `manifest.json`).
5. Fixe o ícone: quebra-cabeça da barra do navegador → alfinete ao lado de "Gravador de Emissões MP".

Não dê dois cliques nos arquivos `.js`: eles só funcionam dentro do navegador.

## Privacidade (LGPD)

- A extensão pede acesso a todos os sites porque a emissão passa por várias páginas, mas **só anota com a gravação
  ligada**. Desligada, ela não faz nada.
- O que é digitado nunca é gravado. Os prints podem mostrar dados de passageiros: ficam só no seu computador, são
  apagados em 90 dias e **não devem ser mandados para ninguém**.
- Quando o processo for escrito a partir das gravações, entra só o passo a passo, nunca dado de cliente.
