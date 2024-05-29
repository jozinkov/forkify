import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');

  _generateMarkup() {
    const currentPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // current page 1 + other pages exist
    if (currentPage === 1 && numPages > 1)
      return this._generateMarkupPagination(currentPage, 'next');
    // one of other pages
    if (currentPage !== 1 && currentPage < numPages)
      return (
        this._generateMarkupPagination(currentPage, 'prev') +
        this._generateMarkupPagination(currentPage, 'next')
      );
    // last page
    if (currentPage !== 1 && currentPage === numPages)
      return this._generateMarkupPagination(currentPage, 'prev');
    // current page 1 ..NO other pages
    return '';
  }

  _generateMarkupPagination(curPage, order) {
    return `
        <button data-page="${
          order === 'prev' ? curPage - 1 : curPage + 1
        }" class="btn--inline pagination__btn--${order}">
            <span>Page ${curPage + (order === 'prev' ? -1 : 1)}</span>
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-${
      order === 'prev' ? 'left' : 'right'
    }"></use>
            </svg>
        </button>
    `;
  }

  addHandlerPagination(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      handler(btn.dataset.page);
    });
  }
}
export default new PaginationView();
