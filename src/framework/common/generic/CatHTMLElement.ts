import { v4 as uuidv4 } from 'uuid';
import Data from '@framework/common/generic/CatData'

/* interface IAttributesDictionary {
  [index: string]: string;
} */

class CatHTMLElement extends HTMLElement {
  _root: any;
  id: any;
  data: any;
  // attributes: HTMLElement;
  constructor() {
    super();
    this._root = this.attachShadow({ mode: 'closed' });
    // this.id = uuidv4();
  }

  disconnectedCallback() {
  }

  connectedCallback() {
    // console.log('ID::::::::::::::::', this.getAttribute('cat-data-id'))
    if (this.getAttribute('cat-data-id') === null) {
      this.id = uuidv4();
      this.setAttribute('cat-data-id', this.id)
    } else {
      this.id = this.getAttribute('cat-data-id');
    }
    this.data = new Data();
    this.data.id = this.id;
    // this.data.pull(this.id)
    //const dataBindingElements = this.querySelectorAll(".data-databinding-element")
    // this.mapComponentAttributes();
  }
}
export default CatHTMLElement;
