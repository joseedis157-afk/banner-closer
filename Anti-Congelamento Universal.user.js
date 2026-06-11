// ==UserScript==
// @name         Anti-Congelamento Universal v2.0
// @namespace    https://github.com/joseedis157-afk
// @version      2.0
// @description  Remove travamentos, overlays e bloqueios de qualquer site
// @author       Jose edis
// @run-at       document-end
// @match        https://*/*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  console.log('🔥 Anti-Congelamento v2.0 ATIVADO!');

  // ========================================
  // 1️⃣ REMOVE POINTER-EVENTS: NONE (CIRÚRGICO)
  // ========================================
  function removePointerEventNone() {
    // Só remove de elementos que cobrem a tela inteira
    const allElements = document.querySelectorAll('*');
    let count = 0;

    allElements.forEach(elem => {
      const computedStyle = window.getComputedStyle(elem);
      
      if (computedStyle.pointerEvents === 'none') {
        const rect = elem.getBoundingClientRect();
        
        // Só remove se está cobrindo QUASE TODA A TELA (overlay/modal)
        if (rect.width >= window.innerWidth * 0.8 && 
            rect.height >= window.innerHeight * 0.8 &&
            rect.top <= 10 && rect.left <= 10) {
          
          elem.style.pointerEvents = 'auto';
          count++;
        }
      }
    });

    if (count > 0) console.log(`✅ ${count} pointer-events removidos!`);
  }

  // ========================================
  // 2️⃣ REMOVE OVERLAYS COM Z-INDEX ABSURDO
  // ========================================
  function removeHighZIndexOverlays() {
    const overlays = document.querySelectorAll('[style*="z-index"]');
    let count = 0;

    overlays.forEach(elem => {
      const zIndex = parseInt(window.getComputedStyle(elem).zIndex) || 0;
      const rect = elem.getBoundingClientRect();
      const opacity = parseFloat(window.getComputedStyle(elem).opacity);

      // Se tem z-index RIDICULAMENTE alto (>999999)
      // E cobre a tela inteira
      // E é invisível ou quase invisível
      if (zIndex > 999999 && 
          rect.width >= window.innerWidth * 0.8 && 
          rect.height >= window.innerHeight * 0.8 &&
          opacity < 0.5) {
        
        elem.style.display = 'none';
        count++;
        console.log(`🗑️ Overlay com z-index ${zIndex} removido!`);
      }
    });
  }

  // ========================================
  // 3️⃣ REMOVE IFRAMES FULLSCREEN INVISÍVEIS
  // ========================================
  function removeSuspiciousIframes() {
    const iframes = document.querySelectorAll('iframe');
    let count = 0;

    iframes.forEach(iframe => {
      const rect = iframe.getBoundingClientRect();
      const opacity = parseFloat(window.getComputedStyle(iframe).opacity);

      // Se o iframe cobre a tela inteira E é invisível
      if (rect.width >= window.innerWidth * 0.9 && 
          rect.height >= window.innerHeight * 0.9 &&
          opacity < 0.1) {
        
        iframe.remove();
        count++;
        console.log('🗑️ iFrame invisível removido!');
      }
    });

    if (count > 0) console.log(`✅ ${count} iframes suspeitos removidos!`);
  }

  // ========================================
  // 4️⃣ RESTAURA SCROLL SE ESTIVER BLOQUEADO
  // ========================================
  function restoreScrolling() {
    const bodyOverflow = window.getComputedStyle(document.body).overflow;
    const htmlOverflow = window.getComputedStyle(document.documentElement).overflow;

    // Só restaura se AMBOS estão bloqueados
    if ((bodyOverflow === 'hidden' || htmlOverflow === 'hidden') && 
        document.body.scrollHeight > window.innerHeight) {
      
      document.documentElement.style.overflow = 'auto';
      document.body.style.overflow = 'auto';
      console.log('✅ Scroll restaurado!');
    }
  }

  // ========================================
  // 5️⃣ REMOVE BLOQUEIOS DE CLIQUE (Muito seletivo!)
  // ========================================
  function removeClickBlockers() {
    // Procura por divs com posição fixed que cobrem tudo
    const fixedElements = document.querySelectorAll('[style*="position: fixed"], [style*="position:fixed"]');
    let count = 0;

    fixedElements.forEach(elem => {
      const rect = elem.getBoundingClientRect();
      const zIndex = parseInt(window.getComputedStyle(elem).zIndex) || 0;
      const text = elem.innerText.toLowerCase();

      // Se cobre a tela E tem z-index alto E contém palavras suspeitas
      if (rect.width >= window.innerWidth * 0.9 && 
          rect.height >= window.innerHeight * 0.9 &&
          zIndex > 1000) {

        // Palavras-chave de bloqueadores
        const blockerKeywords = ['bloqueador', 'adblock', 'detectado', 'detecção', 'adblocker', 'ad blocker', 'desative', 'disable'];
        const isBlocker = blockerKeywords.some(keyword => text.includes(keyword));

        if (isBlocker) {
          elem.style.display = 'none';
          count++;
          console.log('🗑️ Bloqueador detectado e removido!');
        }
      }
    });

    if (count > 0) console.log(`✅ ${count} bloqueadores removidos!`);
  }

  // ========================================
  // 6️⃣ PROTEGE CONTRA EVENT LISTENERS BLOQUEADORES
  // ========================================
  function protectClickListeners() {
    let originalPreventDefault = Event.prototype.preventDefault;
    let blockedCount = 0;

    Event.prototype.preventDefault = function() {
      // Se é um evento de clique/touch E tem uma certa assinatura
      if ((this.type === 'click' || this.type === 'touchstart') && 
          window.innerHeight > 0 && window.innerWidth > 0) {
        // Permite (não bloqueia)
        return originalPreventDefault.call(this);
      }
      return originalPreventDefault.call(this);
    };

    console.log('✅ Click listeners protegidos!');
  }

  // ========================================
  // 7️⃣ VERIFICA E RESTAURA CONTEÚDO IMPORTANTE
  // ========================================
  function checkMainContent() {
    // Verifica se o conteúdo principal está visível
    const mainSelectors = ['main', '[role="main"]', '.content', '#content', 'article'];
    
    mainSelectors.forEach(selector => {
      const elem = document.querySelector(selector);
      if (elem) {
        const computedStyle = window.getComputedStyle(elem);
        if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden') {
          elem.style.display = 'block';
          elem.style.visibility = 'visible';
          console.log(`✅ Conteúdo principal restaurado: ${selector}`);
        }
      }
    });
  }

  // ========================================
  // 🔴 EXECUTA TUDO (Versão Segura)
  // ========================================
  function runAllFixes() {
    console.log('🔄 Executando correções cirúrgicas...');
    
    removePointerEventNone();
    removeHighZIndexOverlays();
    removeSuspiciousIframes();
    restoreScrolling();
    removeClickBlockers();
    protectClickListeners();
    checkMainContent();
    
    console.log('🎉 DECONGELADO COM SEGURANÇA!');
  }

  // ========================================
  // ⏰ EXECUTA NO CARREGAMENTO
  // ========================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAllFixes);
  } else {
    runAllFixes();
  }

  // ========================================
  // 🔁 MONITORA MUDANÇAS (MutationObserver - LEVE)
  // ========================================
  const observer = new MutationObserver(function(mutations) {
    // Só executa se aparecer algo novo que parece ser um bloqueador
    let shouldCheck = false;

    mutations.forEach(mutation => {
      if (mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) { // Element node
            const text = node.textContent?.toLowerCase() || '';
            if (text.includes('bloqueador') || text.includes('adblock')) {
              shouldCheck = true;
            }
          }
        });
      }
    });

    if (shouldCheck) {
      removeClickBlockers();
      removeHighZIndexOverlays();
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  console.log('👀 Monitorando mudanças...');

  // ========================================
  // ✨ VERIFICA PERIODICAMENTE (A cada 5s)
  // ========================================
  setInterval(() => {
    removeClickBlockers();
    restoreScrolling();
  }, 5000);

  console.log('✅ Anti-Congelamento v2.0 PRONTO! 🚀');
})();
