# 🚀 Banner Closer - Anti-Adblock Remover

> Um userscript que remove banners de detecção de bloqueador de anúncios e outros overlays indesejados de forma automática.

## ✨ Características

- ✅ **Remove banners anti-adblock** automaticamente
- 🎯 **Detecta overlays** que não têm botão de fechar
- ➕ **Adiciona botão X** em banners sem fechar
- 🔄 **Monitoramento contínuo** de novos elementos
- 📱 **Responsivo** - funciona em desktop e mobile
- ⚡ **Leve e rápido** - sem impacto de performance
- 🎨 **Interface limpa** com botão X vermelho

## 🎬 Como Funciona

O script funciona em duas frentes:

1. **Detecção de Anti-Adblock**: Procura por palavras-chave como "adblock", "bloqueador", "detectado" e remove automaticamente
2. **Remoção de Overlays**: Detecta banners/modais fixos com z-index alto e adiciona um botão X para fechá-los

## 📥 Instalação

### Pré-requisitos
- Um navegador com suporte a userscripts (Via Browser, Tampermonkey, Greasemonkey, etc)

### Passos
1. Abra o gerenciador de userscripts do seu navegador
2. Crie um novo script
3. Cole o conteúdo do arquivo `banner-closer.user.js`
4. Salve e ative!

## 🎯 Uso

Depois de instalado, o script funciona **automaticamente**:

- 🚫 Banners anti-adblock desaparecem sozinhos
- ➕ Banners sem X ganham um botão para fechar
- 🖱️ Clique no X vermelho para fechar qualquer banner

**É isso! Não precisa fazer mais nada!**

## 📊 Suporte

O script detecta e remove:
- ✅ Banners de detecção de adblocker
- ✅ Modais e pop-ups
- ✅ Overlays de notificação
- ✅ Avisos de cookies (parcialmente)
- ✅ Mensagens de alerta

## ⚙️ Configuração

O script já vem pré-configurado e funciona em todos os sites. Mas você pode editar os **keywords** se quiser:

```javascript
const antiAdblockKeywords = [
  'adblock',
  'bloqueador',
  'detectado',
  'detectamos',
  'desabilitar bloqueador',
  // adicione mais aqui
];
