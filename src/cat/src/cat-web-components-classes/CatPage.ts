import CatContext from '@cat/cat-classes/CatContext'

class CatPage extends HTMLElement {
  
  constructor() {
    super();
    const context = CatContext.instance
    console.log('INNER HTML::::::', context)
  }

  connectedCallback() {
    console.log('INNER HTML::::::', this.innerHTML)
  }

  disconnectedCallback() {
    // console.log("Custom element removed from page.");
  }

  adoptedCallback() {
    // console.log("Custom element moved to new page.");
  }

  /* attributeChangedCallback(name: string) {
    // console.log(`Attribute ${name} has changed.`);
  } */
}

export default CatPage