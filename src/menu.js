class Menu extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    // this.style.visibility = "hidden";
    const linkElem = document.createElement("link");
    linkElem.setAttribute("rel", "stylesheet");
    linkElem.setAttribute("href", "src/menu.css");
    this.hamburger = document.createElement("div");
    this.hamburger.classList.add("hamburger");
    this.hamburgerWrapper = document.createElement("div");
    this.hamburgerWrapper.innerHTML = `
        <div></div>
        <div></div>
        <div></div>
    `;
    this.hamburgerWrapper.style.display = "fixed";
    this.hamburger.appendChild(this.hamburgerWrapper);
    this.hamburgerWrapper.classList.add("hamburger-wrapper");
    this.hamburger.addEventListener("click", () => {
      const state = this.getAttribute("open") == "true";
      this.setAttribute("open", !state);
    });
    this.slotContainer = document.createElement("div");
    this.slotContainer.classList.add("slotContainer");
    this.defaultSlot = document.createElement("slot");
    this.slotContainer.appendChild(this.defaultSlot);
    // this.slotContainer.style.display = "none";
    this.slotContainer.addEventListener("change", console.log);
    this.shadowRoot.append(linkElem, this.hamburger, this.slotContainer);
    // setTimeout(() => {
    //   this.slotContainer.style.display = "block";
    // });
  }

  open() {
    this.hamburgerWrapper.classList.add("open");
    this.slotContainer.classList.add("open");
  }

  close() {
    this.hamburgerWrapper.classList.remove("open");
    this.slotContainer.classList.remove("open");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "open":
        newValue === "true" ? this.open() : this.close();
        break;
      default:
        break;
    }
  }

  static get observedAttributes() {
    return ["open"];
  }
}

customElements.define("nav-menu", Menu);
