import SortableList from '../../components/sortable-list/index.js';

import fetchJson from '../../utils/fetch-json.js';

export default class Page {
    element;
    subElements = {};
    components = {};

    getSubcategory (data) {
        const element = document.createElement('div');
        element.innerHTML = `
            <li class="categories__sortable-list-item" data-grab-handle data-id="${data.id}">
                <strong>${data.title}</strong>
                <span><b>${data.count}</b> products</span>
            </li>`;
        return element.firstElementChild;
    }

    getCategory (data) {
        return `
            <div class="category category_open" data-id="${data.id}">
                <header class="category__header">
                    ${data.title}
                </header>
                <div class="category__body">
                    <div class="subcategory-list">
                    </div>
                </div>
            </div>`;
    }

    async initComponents (data) {
        data.forEach(category => {
            const subcategoryList = category.subcategories.map(subcategory => this.getSubcategory(subcategory));
            const sortableList = new SortableList({items: subcategoryList});
            this.components[category.id] = sortableList;
        });
    }

    get template () {
        return `
            <div class="categories">
                <div class="content__top-panel">
                    <h1 class="page-title">Категории товаров</h1>
                </div>
                <div data-element="categoriesContainer">
                </div>
            </div>
            `;
    }

    async render () {
        const element = document.createElement('div');

        element.innerHTML = this.template;

        this.element = element.firstElementChild;
        this.subElements = this.getSubElements(this.element);

        const data = await fetchJson(`${process.env.BACKEND_URL}api/rest/categories?_sort=weight&_refs=subcategory`);
        await this.initComponents(data);

        const categories = data.map(categoryData => this.getCategory(categoryData)).join('');
        this.subElements.categoriesContainer.innerHTML = categories;
        
        this.renderComponents();
        this.initEventListeners();

        return this.element;
    }

    renderComponents () {
        Object.keys(this.components).forEach(component => {
            const categoryElement = this.subElements.categoriesContainer.querySelector(`[data-id=${component}]`);
            const subcategorylist = categoryElement.querySelector('.subcategory-list');
            const { element } = this.components[component];
            subcategorylist.append(element)
        });
    }

    getSubElements ($element) {
        const elements = $element.querySelectorAll('[data-element]');

        return [...elements].reduce((accum, subElement) => {
            accum[subElement.dataset.element] = subElement;
            return accum;
            }, {}
        );
    }

    onHeaderClick = (event) => {
        const categoryElement = event.target.closest('.category');
        if (categoryElement) {
            categoryElement.classList.toggle('category_open');
        }

    }

    initEventListeners () {
        const categoryHeaderElements = this.subElements.categoriesContainer.querySelectorAll(`.category__header`);
        categoryHeaderElements.forEach(element => {
            element.addEventListener('click', this.onHeaderClick); 
        });
    }

    destroy () {
        const categoryHeaderElements = this.subElements.categoriesContainer.querySelectorAll(`.category__header`);
        categoryHeaderElements.forEach(element => {
            element.removeEventListener('click', this.onHeaderClick); 
        });
        
        for (const component of Object.values(this.components)) {
            component.destroy();
        }

        this.element = null;

    }
}
