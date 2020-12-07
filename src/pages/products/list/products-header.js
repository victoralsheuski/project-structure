const header = [
    {
      id: 'images',
      title: 'Фото',
      sortable: false,
      template: data => {
        return `
            <div class="sortable-table__cell">
              <img class="sortable-table-image" alt="Image" src="${data[0] ? data[0].url : undefined}">
            </div>
          `;
      }
    },
    {
      id: 'title',
      title: 'Название',
      sortable: true,
      sortType: 'string'
    },
    {
      id: 'subcategory',
      title: 'Категория',
      sortable: false,
      sortType: 'number',
      template: data => {
        return `
            <div class="sortable-table__cell">
                <span data-tooltip="
                <div class=&quot;sortable-table-tooltip&quot;>
                <span class=&quot;sortable-table-tooltip__category&quot;>${data.category.title}</span> /
                <b class=&quot;sortable-table-tooltip__subcategory&quot;>${data.title}</b>
                </div>">${data.title}</span>
            </div>
            `;
      }
    },
    {
        id: 'quantity',
        title: 'Количество',
        sortable: true,
        sortType: 'number'
    },
    {
      id: 'price',
      title: 'Цена',
      sortable: true,
      sortType: 'number'
    },
    {
      id: 'status',
      title: 'Статус',
      sortable: true,
      sortType: 'number',
      template: data => {
        return `<div class="sortable-table__cell">
            ${data > 0 ? 'Активный' : 'Неактивный'}
          </div>`;
      }
    },
  ];
  
  export default header;
  