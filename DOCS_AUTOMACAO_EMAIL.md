# 📧 Manual da Automação de Notícias via E-mail

Este documento contém o **Script de Automação** e o **Modelo de E-mail** para publicar notícias no Site do CARB diretamente do Gmail.

---

## 1. Modelo de E-mail

Para postar uma notícia, envie um e-mail para você mesmo com este formato:

*   **Assunto:** Título da Notícia
*   **Corpo:** Conteúdo da notícia (Texto/HTML)
*   **Anexo:** (Opcional) Uma imagem para ser a capa.
*   **Ação Final:** Aplique a etiqueta **`SaveToSite`** no e-mail.

---

## 2. Código do Google Apps Script (Versão Limpa)

Cole este código em [script.google.com](https://script.google.com). **Dica:** Apague tudo o que estiver lá antes de colar.

```javascript
function processEmailToSiteOnly() {
  const LABEL_NAME = "SaveToSite";
  
  // --- CONFIGURACOES DE ACESSO ---
  const API_URL = "https://nonanaemic-polygamously-jerrie.ngrok-free.dev/api/upload"; 
  const API_KEY = "CARB_SECURE_KEY_2026_X9Z"; 

  // --- LISTA DE E-MAILS AUTORIZADOS ---
  const ALLOWED_SENDERS = [
    "carbsiteoficial@gmail.com"
  ];

  let label = GmailApp.getUserLabelByName(LABEL_NAME);
  if (!label) {
    console.log("Etiqueta '" + LABEL_NAME + "' nao encontrada.");
    return;
  }
  
  let threads = label.getThreads();
  if (threads.length === 0) {
    console.log("Nenhum e-mail novo para processar.");
    return;
  }

  for (let i = 0; i < threads.length; i++) {
    let messages = threads[i].getMessages();
    let message = messages[messages.length - 1]; 
    
    // VALIDACAO DO REMETENTE
    let sender = message.getFrom();
    let senderEmail = "";
    if (sender.indexOf("<") !== -1) {
        senderEmail = sender.match(/<([^>]+)>/)[1];
    } else {
        senderEmail = sender;
    }

    if (ALLOWED_SENDERS.indexOf(senderEmail) === -1) {
      console.warn("BLOQUEADO: Remetente nao autorizado: " + senderEmail);
      threads[i].removeLabel(label);
      continue;
    }

    let subject = message.getSubject();
    let coverImage = extractCoverImage(message);
    
    // Processa HTML e REMOVE a imagem de capa do corpo se ela estiver la
    let messageHTML = processHtmlWithImages(message, coverImage ? coverImage.nome : null); 

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
          "ngrok-skip-browser-warning": "true"
        },
        "payload": JSON.stringify(payload),
        "muteHttpExceptions": true
      };

      let response = UrlFetchApp.fetch(API_URL, options);
      let responseCode = response.getResponseCode();
      
      if (responseCode === 200) {
        console.log("SUCESSO: Publicado.");
        threads[i].removeLabel(label); 
      } else {
        console.error("ERRO SERVIDOR: " + response.getContentText());
      }

    } catch (e) {
      console.error("FALHA DE CONEXAO: " + e.message);
    }
  }
}

function extractCoverImage(message) {
  let attachments = message.getAttachments();
  for (let k = 0; k < attachments.length; k++) {
    let att = attachments[k];
    if (att.getContentType().indexOf("image/") !== -1) {
      return { "nome": att.getName(), "base64": Utilities.base64Encode(att.getBytes()) };
    }
  }
  return null;
}

function processHtmlWithImages(message, skipImageName) {
  let html = message.getBody();
  let inlineImages = message.getAttachments({includeInlineImages: true});
  let cidRegex = /src="cid:([^"]+)"/g;
  let match, cidMatches = [];
  while ((match = cidRegex.exec(html)) !== null) cidMatches.push(match[1]);
  let imgAttachments = inlineImages.filter(function(att) {
     return att.getContentType().indexOf("image/") !== -1;
  });
  if (cidMatches.length > 0 && imgAttachments.length > 0) {
    for (let j = 0; j < Math.min(cidMatches.length, imgAttachments.length); j++) {
      let cid = cidMatches[j], blob = imgAttachments[j];
      
      // Se esta imagem e a mesma que usamos na Capa, removemos ela do corpo
      if (skipImageName && blob.getName() === skipImageName) {
         html = html.replace(/<img[^>]+src="cid:([^"]+)"[^>]*>/, "");
         continue;
      }

      let b64 = Utilities.base64Encode(blob.getBytes());
      html = html.replace("cid:" + cid, "data:" + blob.getContentType() + ";base64," + b64);
    }
  }
  return html;
}
```
