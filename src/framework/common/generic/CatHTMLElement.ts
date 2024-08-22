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
    this.id = uuidv4();
    this.data = new Data();
    this.data.id = this.id;
    // this.data.pull(this.id)
    this.setAttribute('cat-data-id', this.id)
    // this.mapComponentAttributes();
  }
}
export default CatHTMLElement;
