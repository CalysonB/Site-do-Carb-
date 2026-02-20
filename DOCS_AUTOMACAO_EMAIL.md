# 📧 Manual da Automação de Notícias via E-mail

Este documento contém o **Script de Automação** e o **Modelo de E-mail** para publicar notícias no Site do CARB diretamente do Gmail.

---

## 1. Modelo de E-mail

Para postar uma notícia, envie um e-mail para você mesmo (ou qualquer conta monitorada) com este formato:

*   **Assunto:** Título da Notícia (Ex: `Resultado da Eleição 2026`)
*   **Corpo:** O texto da notícia. Pode conter negrito, itálico e listas.
*   **Anexo:** (Opcional) Uma imagem JPG/PNG para ser a capa.
*   **Ação Final:** Aplique a etiqueta **`SaveToSite`** no e-mail no Gmail.

---

## 2. Código do Google Apps Script (Backup)

Cole este código em [script.google.com](https://script.google.com).

```javascript
/**
 * Envia e-mails com a etiqueta "SaveToSite" DIRETAMENTE para o Site do CARB.
 * SEGURANÇA 1: Protegido por API Key no Header.
 * SEGURANÇA 2: Filtro de Remetentes Autorizados (Whitelist).
 */
function processEmailToSiteOnly() {
  const LABEL_NAME = "SaveToSite";
  
  // --- CONFIGURAÇÕES DE ACESSO ---
  // *** MANTENHA SEU LINK DO NGROK AQUI ***
  const API_URL = "https://nonanaemic-polygamously-jerrie.ngrok-free.dev/api/upload"; 
  const API_KEY = "CARB_SECURE_KEY_2026_X9Z"; 

  // --- 🛡️ LISTA DE E-MAILS AUTORIZADOS ---
  // Adicione aqui apenas os e-mails que podem publicar no site
  const ALLOWED_SENDERS = [
    "carbsiteoficial@gmail.com" // ✅ SOMENTE ELE PODE PUBLICAR
  ];

  // 1. Localiza a etiqueta
  let label = GmailApp.getUserLabelByName(LABEL_NAME);
  if (!label) {
    console.log("Etiqueta '" + LABEL_NAME + "' não encontrada.");
    return;
  }
  
  let threads = label.getThreads();
  if (threads.length === 0) {
    console.log("Nenhum e-mail novo para processar.");
    return;
  }

  // 2. Processa cada conversa
  for (let i = 0; i < threads.length; i++) {
    let messages = threads[i].getMessages();
    let message = messages[messages.length - 1]; 
    
    // --- 🛡️ VALIDAÇÃO DE SEGURANÇA DO REMETENTE ---
    let sender = message.getFrom();
    // Extrai apenas o e-mail (remove o nome se houver: "Nome <email@abc.com>")
    let senderEmail = "";
    if (sender.includes("<")) {
        senderEmail = sender.match(/<([^>]+)>/)[1];
    } else {
        senderEmail = sender;
    }

    if (!ALLOWED_SENDERS.includes(senderEmail)) {
      console.warn(`⚠️ BLOQUEADO: Tentativa de postagem por remetente não autorizado: ${senderEmail}`);
      threads[i].removeLabel(label); // Tira a etiqueta para não processar mais esse e-mail
      continue; // Pula para o próximo e-mail da lista
    }

    let subject = message.getSubject();
    let messageHTML = processHtmlWithImages(message); 
    let coverImage = extractCoverImage(message);

    // --- ENVIO SEGURO PARA O NODE.JS ---
    try {
      let payload = {
        "titulo": subject,
        "conteudo": messageHTML,
        "imagem": coverImage 
      };

      let options = {
        "method": "post",
        "contentType": "application/json",
        "headers": { 
          "x-api-key": API_KEY,
          "ngrok-skip-browser-warning": "true" // Evita página de aviso do ngrok
        },
        "payload": JSON.stringify(payload),
        "muteHttpExceptions": true
      };

      let response = UrlFetchApp.fetch(API_URL, options);
      let responseCode = response.getResponseCode();
      
      if (responseCode === 200) {
        console.log(`✅ SUCESSO: "${subject}" publicado.`);
        threads[i].removeLabel(label); 
      } else {
        console.error(`❌ ERRO SERVIDOR [${responseCode}]: ` + response.getContentText());
      }

    } catch (e) {
      console.error("🚨 ERRO CRÍTICO DE CONEXÃO: " + e.message);
    }
  }
}

// --- Funções Auxiliares ---
function extractCoverImage(message) {
  let attachments = message.getAttachments();
  for (let k = 0; k < attachments.length; k++) {
    let att = attachments[k];
    if (att.getContentType().startsWith("image/")) {
      return { "nome": att.getName(), "base64": Utilities.base64Encode(att.getBytes()) };
    }
  }
  return null;
}

function processHtmlWithImages(message) {
  let html = message.getBody();
  let inlineImages = message.getAttachments({includeInlineImages: true});
  let cidRegex = /src="cid:([^"]+)"/g;
  let match, cidMatches = [];
  while ((match = cidRegex.exec(html)) !== null) cidMatches.push(match[1]);
  let imgAttachments = inlineImages.filter(att => att.getContentType().startsWith("image/"));
  if (cidMatches.length > 0 && imgAttachments.length > 0) {
    for (let j = 0; j < Math.min(cidMatches.length, imgAttachments.length); j++) {
      let cid = cidMatches[j], blob = imgAttachments[j], b64 = Utilities.base64Encode(blob.getBytes());
      html = html.replace("cid:" + cid, "data:" + blob.getContentType() + ";base64," + b64);
    }
  }
  return html;
}
```
