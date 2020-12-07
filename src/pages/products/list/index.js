
import SortableTable from '../../../components/sortable-table/index.js';
import DoubleSlider from '../../../components/double-slider/index.js';

import header from './products-header.js';

export default class Page {
  element;
  subElements = {};
  components = {};
  from; 
  to; 
  status;

  get template () {

    return `
      <div class="products-list">
        <div class="content__top-panel">
          <h1 class="page-title">Товары</h1>
          <a href="/products/add" class="button-primary">Добавить товар</a>
        </div>
        <div class="content-box content-box_small">
          <form class="form-inline">
            <div class="form-group">
              <label class="form-label">Сортировать по:</label>
              <input type="text" data-element="filterName" class="form-control" placeholder="Название товара">
            </div>
            <div class="form-group" data-element="slider">
              <label class="form-label">Цена:</label>
            </div>
            <div class="form-group">
              <label class="form-label">Статус:</label>
              <select class="form-control" data-element="filterStatus">
                <option value="" selected="">Любой</option>
                <option value="1">Активный</option>
                <option value="0">Неактивный</option>
              </select>
            </div>
          </form>
        </div>

        <div data-element="sortableTable" class="products-list__container">
        </div

      </div>
      `;
  }

  getEmptyContent() {
    return `
      <div>
        <p>Не найдено товаров удовлетворяющих выбранному критерию</p>
        <button type="button" data-id="clearFilter" class="button-primary-outline">Очистить фильтры</button>
      </div>
      `;
  }

  getSubElements ($element) {
    const elements = $element.querySelectorAll('[data-element]');
    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;
      return accum;
    }, {});
  }

  async render() {
    const element = document.createElement('div');
    element.innerHTML = this.template;
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);

    await this.initComponents();

    this.renderComponents();
    this.initEventListeners();

    return this.element;
  }

  initComponents() {
    const slider = new DoubleSlider({ min: 0, max: 4000 });
    const sortableTable = new SortableTable(header, {
      url: `api/rest/products?_embed=subcategory.category`,
      isSortLocally: false,
      start: 0,
      step: 30
    });

    this.components = {
      slider,
      sortableTable
    };
    
  }

  renderComponents () {
    const { slider, sortableTable } = this.components;
    this.subElements.slider.append(slider.element);
    this.subElements.sortableTable.append(sortableTable.element);
    sortableTable.subElements.emptyPlaceholder.innerHTML = this.getEmptyContent();
  }

  initEventListeners () {
    this.components.slider.element.addEventListener('range-select', event => {
      const { from, to } = event.detail;
      this.from = from;
      this.to = to;
      this.components.sortableTable.setSearchParam('price_gte', from);
      this.components.sortableTable.setSearchParam('price_lte', to);
      this.components.sortableTable.updateData();
    });
    this.subElements.filterStatus.addEventListener("change", event => {
      this.status = event.target.value;
      this.components.sortableTable.setSearchParam('status', this.status);
      this.components.sortableTable.updateData();
    });
    this.subElements.filterName.addEventListener("input", event => {
      this.components.sortableTable.setSearchParam('title_like', event.target.value);
      this.components.sortableTable.updateData();
    });
    this.subElements.sortableTable.addEventListener("click", event => {
      const row = event.target.closest('.sortable-table__row');
      if (row && row.dataset.id) {
        console.log('row.dataset.id',row.dataset.id);
        window.location = '/products/'+row.dataset.id;
      }
    });
    const clearFilter = this.subElements.sortableTable.querySelector('[data-id="clearFilter"]');
    clearFilter.addEventListener("click", event => {
      this.subElements.filterName.value = '';
      this.subElements.filterStatus.value = '';
      this.components.slider.reset();
      this.components.sortableTable.clearSearchParams();
      this.components.sortableTable.updateData();
    });
  }

  destroy() {
    for (const component of Object.values(this.components)) {
      component.destroy();
    }
  }
}
