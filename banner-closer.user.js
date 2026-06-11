// ==UserScript==
// @name         Banner Closer - Fechar Banners e Anti-Adblock
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Adiciona X em banners/overlays e remove anti-adblock
// @author       Jose Edis
// @match        *://*/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
  'use strict';

  // ═══════════════════════════════════════════════════════════════
  // CONFIGURAÇÃO
  // ═══════════════════════════════════════════════════════════════
  const COLORS = {
    closeBtn: '#FF6B6B',
    closeBtnHover: '#FF5252',
    text: '#FFFFFF',
  };

  // ═══════════════════════════════════════════════════════════════
  // CLASSE PRINCIPAL
  // ═══════════════════════════════════════════════════════════════
  class BannerCloser {
    constructor() {
      this.closedBanners = [];
      this.monitoredElements = new WeakSet();
      this.init();
    }

    // ═══════════════════════════════════════════════════════════════
    // INICIALIZAÇÃO
    // ═══════════════════════════════════════════════════════════════
    init() {
      this.injectStyles();
      this.removeAntiAdblockDirectly();
      this.scanForBanners();
      this.setupMutationObserver();
      this.setupPeriodicScan();
    }

    // ═══════════════════════════════════════════════════════════════
    // INJETAR ESTILOS CSS
    // ═══════════════════════════════════════════════════════════════
    injectStyles() {
      const style = document.createElement('style');
      style.textContent = `
        /* BOTÃO X PARA FECHAR BANNERS */
        .bc-close-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 40px;
          height: 40px;
          background: ${COLORS.closeBtn} !important;
          border: none !important;
          border-radius: 50% !important;
          color: ${COLORS.text} !important;
          font-size: 24px !important;
          font-weight: bold !important;
          cursor: pointer !important;
          z-index: 9999999999 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          transition: all 0.2s ease !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
          padding: 0 !important;
          line-height: 1 !important;
        }

        .bc-close-btn:hover {
          background: ${COLORS.closeBtnHover} !important;
          transform: scale(1.1) !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
        }

        .bc-close-btn:active {
          transform: scale(0.95) !important;
        }

        .bc-monitored {
          position: relative !important;
        }

        @media (max-width: 480px) {
          .bc-close-btn {
            width: 48px !important;
            height: 48px !important;
            font-size: 28px !important;
            top: 5px !important;
            right: 5px !important;
          }
        }
      `;
      document.head.appendChild(style);
    }

    // ═══════════════════════════════════════════════════════════════
    // REMOVER ANTI-ADBLOCK DIRETAMENTE
    // ═══════════════════════════════════════════════════════════════
    removeAntiAdblockDirectly() {
      // Palavras-chave relacionadas a anti-adblock
      const antiAdblockKeywords = [
        'adblock',
        'ad-block',
        'adblocker',
        'ad-blocker',
        'disable ad',
        'desabilitar bloqueador',
        'bloqueador de anúncios',
        'detector de bloqueador',
        'block detector',
        'ad blocker detected',
        'bloqueador detectado',
        'detectamos',
        'detectado',
        'uBlocker',
        'ublock',
        'adguard',
      ];

      const allElements = document.querySelectorAll('*');
      
      allElements.forEach(elem => {
        const text = elem.textContent.toLowerCase();
        const classList = elem.className.toLowerCase();
        const id = elem.id.toLowerCase();

        // Verificar se é anti-adblock
        const isAntiAdblock = antiAdblockKeywords.some(keyword =>
          text.includes(keyword) ||
          classList.includes(keyword) ||
          id.includes(keyword)
        );

        if (isAntiAdblock) {
          const style = window.getComputedStyle(elem);
          const isOverlay = style.position === 'fixed' || style.position === 'absolute';
          const hasHighZIndex = parseInt(style.zIndex) > 100;
          
          if (isOverlay && hasHighZIndex) {
            console.log('🚫 Anti-adblock detectado e removido:', elem);
            elem.style.display = 'none';
            elem.style.pointerEvents = 'none';
            return;
          }
        }
      });
    }

    // ═══════════════════════════════════════════════════════════════
    // ESCANEAR POR BANNERS
    // ═══════════════════════════════════════════════════════════════
    scanForBanners() {
      const allElements = document.querySelectorAll('[style*="position"]');

      allElements.forEach(elem => {
        if (this.monitoredElements.has(elem)) return;
        if (this.isBannerOrOverlay(elem)) {
          this.processBanner(elem);
          this.monitoredElements.add(elem);
        }
      });
    }

    // ═══════════════════════════════════════════════════════════════
    // VERIFICAR SE É UM BANNER/OVERLAY
    // ═══════════════════════════════════════════════════════════════
    isBannerOrOverlay(elem) {
      const style = window.getComputedStyle(elem);
      const rect = elem.getBoundingClientRect();
      
      const isFixed = style.position === 'fixed';
      const isAbsolute = style.position === 'absolute';
      const hasHighZIndex = parseInt(style.zIndex) > 50;
      const hasVisibleContent = rect.width > 0 && rect.height > 0;
      const isNotScript = elem.tagName !== 'SCRIPT' && elem.tagName !== 'STYLE';
      const isNotInvisible = style.display !== 'none' && style.visibility !== 'hidden';

      // Palavras-chave
      const isBannerLike = 
        elem.className.includes('banner') ||
        elem.className.includes('modal') ||
        elem.className.includes('overlay') ||
        elem.className.includes('popup') ||
        elem.className.includes('alert') ||
        elem.className.includes('notification') ||
        elem.className.includes('notice') ||
        elem.className.includes('dialog') ||
        elem.className.includes('message') ||
        elem.id.includes('banner') ||
        elem.id.includes('modal') ||
        elem.id.includes('overlay') ||
        elem.id.includes('popup') ||
        elem.id.includes('alert');

      const hasCloseBtn = this.hasCloseButton(elem);

      const shouldProcess = (
        (isFixed || isAbsolute) &&
        hasHighZIndex &&
        hasVisibleContent &&
        isNotScript &&
        isNotInvisible &&
        isBannerLike &&
        !hasCloseBtn
      );

      return shouldProcess;
    }

    // ═══════════════════════════════════════════════════════════════
    // VERIFICAR SE JÁ TEM BOTÃO DE FECHAR
    // ═══════════════════════════════════════════════════════════════
    hasCloseButton(elem) {
      const closeButtons = elem.querySelectorAll(
        'button[aria-label*="close"], button[aria-label*="Close"], ' +
        'button.close, button.closeBtn, ' +
        'a.close, a.closeBtn, [class*="close-btn"], ' +
        '[class*="closeButton"], .bc-close-btn, ' +
        '[role="button"][aria-label*="close"]'
      );

      if (closeButtons.length > 0) return true;

      const allButtons = elem.querySelectorAll('button, a, [role="button"]');
      for (let btn of allButtons) {
        const text = btn.textContent.trim();
        if (['x', '×', '✕', 'fechar', 'close', 'dismiss', 'descartar'].includes(text.toLowerCase())) {
          return true;
        }
      }

      return false;
    }

    // ═══════════════════════════════════════════════════════════════
    // PROCESSAR BANNER
    // ═══════════════════════════════════════════════════════════════
    processBanner(elem) {
      if (elem.querySelector('.bc-close-btn')) {
        return;
      }

      const closeBtn = document.createElement('button');
      closeBtn.className = 'bc-close-btn';
      closeBtn.textContent = '✕';
      closeBtn.setAttribute('aria-label', 'Fechar');
      closeBtn.setAttribute('title', 'Fechar banner');
      closeBtn.type = 'button';

      if (window.getComputedStyle(elem).position === 'static') {
        elem.style.position = 'relative';
      }

      elem.appendChild(closeBtn);
      elem.classList.add('bc-monitored');

      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.closeBanner(elem);
      });

      console.log('🎯 Banner detectado e X adicionado:', elem);
    }

    // ═══════════════════════════════════════════════════════════════
    // FECHAR BANNER
    // ═══════════════════════════════════════════════════════════════
    closeBanner(elem) {
      elem.style.transition = 'all 0.3s ease';
      elem.style.opacity = '0';
      elem.style.transform = 'scale(0.95)';

      setTimeout(() => {
        elem.style.display = 'none';
        elem.style.pointerEvents = 'none';
        this.closedBanners.push(elem);
        console.log('✅ Banner fechado!');
      }, 300);
    }

    // ═══════════════════════════════════════════════════════════════
    // OBSERVADOR DE MUTAÇÕES
    // ═══════════════════════════════════════════════════════════════
    setupMutationObserver() {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === 1) {
                // Verificar anti-adblock primeiro
                this.removeAntiAdblockDirectly();
                // Depois escanear por banners normais
                this.scanForBanners();
              }
            });
          }
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
      });
    }

    // ═══════════════════════════════════════════════════════════════
    // SCAN PERIÓDICO
    // ═══════════════════════════════════════════════════════════════
    setupPeriodicScan() {
      setInterval(() => {
        this.removeAntiAdblockDirectly();
        this.scanForBanners();
      }, 2000);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // INICIAR
  // ═══════════════════════════════════════════════════════════════
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new BannerCloser();
    });
  } else {
    new BannerCloser();
  }
})();
