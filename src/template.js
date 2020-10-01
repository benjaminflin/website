class LoadableTemplate extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.preload();
    this.getHTML();
  }
  async preload() {
    this.preloadSlot = document.createElement("slot");
    this.preloadSlot.setAttribute("name", "preload");
    this.shadowRoot.appendChild(this.preloadSlot);
  }

  async getHTML() {
    const href = this.attributes.href.value;
    const res = await fetch(href, { credentials: "same-origin" });
    const text = await res.text();
    const root = document.createElement("div");
    root.innerHTML = text;
    this.shadowRoot.appendChild(root);
  }
}
customElements.define("loadable-template", LoadableTemplate);
