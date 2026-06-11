// ==UserScript==
// @name         Anti-Blur Universal v1.0
// @namespace    https://github.com/joseedis157-afk
// @version      1.0
// @description  Remove blur, opacity baixa e embaçamento de sites
// @author       Jose edis
// @run-at       document-end
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  console.log('🎨 Anti-Blur Universal ATIVADO!');

  // ========================================
  // 1️⃣ REMOVE FILTER: BLUR()
  // ========================================
  function removeBlurFilter() {
    const allElements = document.querySelectorAll('*');
    let count = 0;

    allElements.forEach(elem => {
      const computedStyle = window.getComputedStyle(elem);
      const filter = computedStyle.filter;

      // Se tem blur no filter
      if (filter && filter.includes('blur')) {
        elem.style.filter = 'none';
        count++;
      }
    });

    if (count > 0) console.log(`✅ ${count} elementos com blur removidos!`);
  }

  // ========================================
  // 2️⃣ RESTAURA OPACITY BAIXA (Cirúrgico!)
  // ========================================
  function restoreOpacity() {
    const allElements = document.querySelectorAll('*');
    let count = 0;

    allElements.forEach(elem => {
      const opacity = parseFloat(window.getComputedStyle(elem).opacity);
      const rect = elem.getBoundingClientRect();

      // Se tem opacity muito baixa (0.1 até 0.5)
      // E está cobrindo uma área grande da tela
      if (opacity < 0.5 && opacity > 0 &&
          rect.width >= window.innerWidth * 0.5 && 
          rect.height >= window.innerHeight * 0.5) {

        // Verifica se é conteúdo importante (main, article, etc)
        const isMainContent = elem.tagName === 'MAIN' || 
                             elem.tagName === 'ARTICLE' ||
                             elem.className.includes('content') ||
                             elem.className.includes('main') ||
                             elem.id.includes('content') ||
                             elem.id.includes('main');

        if (isMainContent) {
          elem.style.opacity = '1';
          count++;
          console.log(`✅ Opacity restaurada em: ${elem.tagName} (${elem.className})`);
        }
      }
    });

    if (count > 0) console.log(`✅ ${count} elementos com opacity restaurada!`);
  }

  // ========================================
  // 3️⃣ REMOVE OVERLAY ESCURO (backdrop)
  // ========================================
  function removeBackdropOverlay() {
    const allElements = document.querySelectorAll('*');
    let count = 0;

    allElements.forEach(elem => {
      const computedStyle = window.getComputedStyle(elem);
      const bgColor = computedStyle.backgroundColor;
      const rect = elem.getBoundingClientRect();

      // Se tem background escuro/semi-transparente (rgba(0,0,0,...))
      // E cobre quase toda a tela
      if (bgColor && bgColor.includes('rgba') && 
          rect.width >= window.innerWidth * 0.8 && 
          rect.height >= window.innerHeight * 0.8) {

        // Extrai os valores RGBA
        const rgbaMatch = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        
        if (rgbaMatch) {
          const [, r, g, b, a] = rgbaMatch;
          const alpha = parseFloat(a) || 1;

          // Se é escuro (RGB baixo) e semi-transparente (alpha < 0.5)
          if (parseInt(r) < 100 && parseInt(g) < 100 && parseInt(b) < 100 && alpha > 0.2) {
            elem.style.backgroundColor = 'transparent';
            count++;
            console.log('🗑️ Backdrop escuro removido!');
          }
        }
      }
    });

    if (count > 0) console.log(`✅ ${count} backdrops escuros removidos!`);
  }

  // ========================================
  // 4️⃣ REMOVE BLOCOS COM OPACITY MUITO BAIXA
  // ========================================
  function removeGhostElements() {
    const allElements = document.querySelectorAll('*');
    let count = 0;

    allElements.forEach(elem => {
      const opacity = parseFloat(window.getComputedStyle(elem).opacity);
      const rect = elem.getBoundingClientRect();

      // Se tem opacity MUITO baixa (< 0.1)
      // E está no topo da tela (provavelmente é um bloqueador)
      if (opacity < 0.1 && 
          rect.width >= window.innerWidth * 0.8 && 
          rect.height >= window.innerHeight * 0.5 &&
          rect.top <= 50) {

        elem.style.display = 'none';
        count++;
        console.log('🗑️ Elemento fantasma removido!');
      }
    });

    if (count > 0) console.log(`✅ ${count} elementos fantasma removidos!`);
  }

  // ========================================
  // 5️⃣ RESTAURA VISIBILIDADE DE TEXTO
  // ========================================
  function restoreTextVisibility() {
    const allText = document.querySelectorAll('*');
    let count = 0;

    allText.forEach(elem => {
      const computedStyle = window.getComputedStyle(elem);
      const color = computedStyle.color;
      const bgColor = computedStyle.backgroundColor;

      // Se texto está muito claro ou muito escuro (invisível)
      // Restaura para cores legíveis
      if (color === 'rgba(0, 0, 0, 0)' || 
          color === 'transparent' ||
          color === 'rgba(255, 255, 255, 0)') {
        
        elem.style.color = 'inherit';
        count++;
      }
    });

    if (count > 0) console.log(`✅ ${count} textos restaurados!`);
  }

  // ========================================
  // 6️⃣ REMOVE BACKDROP-FILTER (blur nos pais)
  // ========================================
  function removeBackdropFilter() {
    const allElements = document.querySelectorAll('*');
    let count = 0;

    allElements.forEach(elem => {
      const computedStyle = window.getComputedStyle(elem);
      const backdropFilter = computedStyle.backdropFilter;

      if (backdropFilter && backdropFilter !== 'none') {
        elem.style.backdropFilter = 'none';
        count++;
      }
    });

    if (count > 0) console.log(`✅ ${count} backdrop-filters removidos!`);
  }

  // ========================================
  // 🔴 EXECUTA TUDO
  // ========================================
  function runAllFixes() {
    console.log('🔄 Removendo blur e embaçamento...');
    
    removeBlurFilter();
    restoreOpacity();
    removeBackdropOverlay();
    removeGhostElements();
    restoreTextVisibility();
    removeBackdropFilter();
    
    console.log('🎨 TUDO LIMPO E NÍTIDO!');
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
  // 🔁 MONITORA MUDANÇAS
  // ========================================
  const observer = new MutationObserver(function(mutations) {
    let shouldCheck = false;

    mutations.forEach(mutation => {
      if (mutation.type === 'attributes') {
        const elem = mutation.target;
        const style = window.getComputedStyle(elem);
        
        // Se mudou opacity ou filter, verifica
        if (mutation.attributeName === 'style') {
          shouldCheck = true;
        }
      }
    });

    if (shouldCheck) {
      removeBlurFilter();
      restoreOpacity();
      removeBackdropFilter();
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class']
  });

  console.log('👀 Monitorando mudanças de blur/opacity...');

  // ========================================
  // ✨ VERIFICA PERIODICAMENTE (A cada 4s)
  // ========================================
  setInterval(() => {
    removeBlurFilter();
    restoreOpacity();
    removeBackdropFilter();
  }, 4000);

  console.log('✅ Anti-Blur v1.0 PRONTO! 🚀');
})();
