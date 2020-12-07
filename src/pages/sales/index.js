import RangePicker from '../../components/range-picker/index.js';
import SortableTable from '../../components/sortable-table/index.js';
import header from './sales-header.js';

import fetchJson from '../../utils/fetch-json.js';

export default class Page {
    element;
    subElements = {};
    components = {};

    async updateTableComponent (from, to) {
        this.components.sortableTable.setSearchParam('createdAt_gte', from.toISOString());
        this.components.sortableTable.setSearchParam('createdAt_lte', to.toISOString());
        await this.components.sortableTable.updateData();
    }

    async initComponents () {
        const to = new Date();
        const from = new Date(to.getTime() - (30 * 24 * 60 * 60 * 1000));

        const rangePicker = new RangePicker({
            from,
            to
        });

        const sortableTable = new SortableTable(header, {
        url: `api/rest/orders`,
        isSortLocally: false,
        start: 0,
        step: 30,
        range: {from, to}
        });

        this.components = {
            rangePicker,
            sortableTable,
        };
    }

  get template () {
    return `
        <div class="sales full-height flex-column">
            <div class="content__top-panel">
                <h1 class="page-title">Продажи</h1>
                <div data-element="rangePicker"></div>
            </div>
            <div data-element="sortableTable">
                <!-- sortable-table component -->
            </div>
        </div>`;
  }

  async render () {
    const element = document.createElement('div');

    element.innerHTML = this.template;

    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);

    await this.initComponents();

    this.renderComponents();
    this.initEventListeners();

    return this.element;
  }

  renderComponents () {
    Object.keys(this.components).forEach(component => {
      const root = this.subElements[component];
      const { element } = this.components[component];

      root.append(element);
    });
  }

  getSubElements ($element) {
    const elements = $element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  initEventListeners () {
    this.components.rangePicker.element.addEventListener('date-select', event => {
      const { from, to } = event.detail;
      this.updateTableComponent(from, to);
    });
  }

  destroy () {
    for (const component of Object.values(this.components)) {
      component.destroy();
    }
  }
}
