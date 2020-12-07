import ProductForm from "../../../components/product-form";

export default class Page {
  element;
  subElements = {};
  components = {};

  getProductId() {
    const url = window.location.href;
    return url.substring(url.lastIndexOf('/') + 1);
  }

  get template () {
    return `
      <div class="products-edit">
        <div class="content__top-panel">
          <h1 class="page-title">
            <a href="/products" class="link">Товары</a> / Редактировать
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
    return this.element;
  }

  initComponents() {
    const productId = this.getProductId();
    this.components.productForm = new ProductForm(productId);
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
}
