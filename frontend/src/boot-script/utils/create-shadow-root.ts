import _style from '../boot-script.css?inline';

function loadStyles (shadowRoot: ShadowRoot) {
  // Find the preloaded stylesheet added by the boot script.
  const styleEl = document.createElement('style');
  styleEl.innerHTML = _style;
  shadowRoot.appendChild(styleEl);
}

export default function createShadowRoot (element: HTMLElement) {
  const shadowRoot = element.attachShadow({ mode: 'open' });
  loadStyles(shadowRoot)
  // const applyFocusVisible = window.applyFocusVisiblePolyfill;
  // if (applyFocusVisible) {
  //   applyFocusVisible(shadowRoot);
  // }

  return shadowRoot
}