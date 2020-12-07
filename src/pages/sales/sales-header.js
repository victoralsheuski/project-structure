const header = [
  {
    id: 'id',
    title: 'ID',
    sortable: false
  },
  {
    id: 'user',
    title: 'Клиент',
    sortable: true,
    sortType: 'string'
  },
  
  {
    id: 'createdAt',
    title: 'Дата',
    sortable: true,
    sortType: 'custom',
    customSorting: (a, b) => { return (new Date(b.createdAt)).getTime() - (new Date(a.createdAt)).getTime(); },
    template: data => {
      return `<div class="sortable-table__cell">`
        + `${(new Date(data)).toLocaleString('en', { month: 'short'})} `
        + `${(new Date(data)).getUTCDate()}, ` 
        + `${(new Date(data)).getFullYear()}`
        + `</div>`;
    }
  },
  {
    id: 'totalCost',
    title: 'Стоимость',
    sortable: true,
    sortType: 'number',
    template: data => {
      return `<div class="sortable-table__cell">
         $${data}
        </div>`;
    }
  },
  {
    id: 'delivery',
    title: 'Статус',
    sortable: true,
    sortType: 'string'
    
  },
];

export default header;
