import {serverLocate} from '../../utils/locale.js';
import searchPagePug from '../pages/search/search.pug';
import Router from '../../utils/router';
import {fetchRequest} from '../network/fetch';

export const createSearchPage = (keyword) => {
  const url = serverLocate+'/search/'+keyword;
  fetchRequest(url, 'GET', null,
  ).then(
      (response) => response.json(),
  ).then(
      (result) => {
        const searchForm = document.getElementById('text-search');
        const root = document.getElementById('close_focus');
        root.innerHTML = searchPagePug({
          result: result,
          salt: 'close_focus',
          isResult: true,
        });
        const res = ['actors', 'films'];
        for (let j = 0; j <= 1; j++) {
          if (result[res[j]] !== null && result[res[j]].length !== 0) {
            for (let i = 0; i < result[res[j]].length; i++) {
              // eslint-disable-next-line max-len
              const film = document.getElementById(result[res[j]][i].id + 'close_focus');
              film.addEventListener('click', function(event) {
                event.preventDefault();
                if (j === 0) {
                  // eslint-disable-next-line max-len
                  Router.go('/actor/' + result[res[j]][i].id.toString(), result[res[j]][i].name+' '+result[res[j]][i].surname);
                } else {
                  const film = {
                    name: result[res[j]][i].title,
                    slug: result[res[j]][i].slug,
                  };
                  Router.go('/film/' + result[res[j]][i].id.toString(), film);
                }
                searchForm.value = '';
                // eslint-disable-next-line max-len
                const searchBtn = document.querySelector('.container-new-search__btn');
                // eslint-disable-next-line max-len
                const cancelBtn = document.querySelector('.container-new-cancel__btn');
                const form = document.querySelector('form');
                searchBtn.classList.remove('hide');
                cancelBtn.classList.remove('show');
                form.classList.remove('active');
              });
            }
          }
        }
        const closeSearch = document.getElementById('cl-search');
        closeSearch.addEventListener('click', function(event) {
          event.preventDefault();
          root.parentNode.removeChild(root);
          const searchForm = document.getElementById('text-search');
          searchForm.value = '';
        });
      },
  ).catch(() => {
    const searchForm = document.getElementById('text-search');
    const root = document.getElementById('close_focus');
    if (searchForm.value === '') {
      const result = {'actors': [], 'films': []};
      root.innerHTML = searchPagePug({result: result, isResult: false});
      const form = document.querySelector('form');
      const closeSearch = document.getElementById('cl-search');
      const searchBtn = document.querySelector('.container-new-search__btn');
      const cancelBtn = document.querySelector('.container-new-cancel__btn');
      closeSearch.addEventListener('click', function(event) {
        event.preventDefault();
        searchBtn.classList.remove('hide');
        cancelBtn.classList.remove('show');
        form.classList.remove('active');
        const search = document.getElementById('close_focus');
        search.parentNode.removeChild(search);
        const searchForm = document.getElementById('text-search');
        searchForm.value = '';
      });
    }
  },
  );
};
