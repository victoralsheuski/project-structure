import ProductForm from "../../../components/product-form";
import NotificationMessage from "../../../components/notification";

export default class Page {
  element;
  subElements = {};
  components = {};

  get template () {
    return `
      <div class="products-edit">
        <div class="content__top-panel">
          <h1 class="page-title">
            <a href="/products" class="link">Товары</a> / Добавить
          </h1>
        </div>
        <div class="content-box" data-element="productForm">
        </div>
      </div>
      `;
  }

  async render() {
    const element = document.createElement('div');
    element.innerHTML = this.template;
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);

    this.initComponents();
    await this.renderComponents();
    this.initEventListeners();
    return this.element;
  }

  initComponents() {
    this.components.productForm = new ProductForm();
  }

  async renderComponents() {
    const element = await this.components.productForm.render();
    this.subElements.productForm.append(element);
  }

  getSubElements ($element) {
    const elements = $element.querySelectorAll('[data-element]');
    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;
      return accum;
    }, {});
  }

  destroy() {
    for (const component of Object.values(this.components)) {
      component.destroy();
    }
  }

  initEventListeners () {
    this.components.productForm.element.addEventListener('product-saved', event => {
      window.location = '/products/' + encodeURIComponent(event.detail);
      (new NotificationMessage("Товар сохранен", {
        duration: 3000
      })).show(); 
    });

  }

}
