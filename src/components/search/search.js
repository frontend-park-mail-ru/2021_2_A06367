import {serverLocate} from '../../utils/locale.js';
import searchPagePug from '../pages/search/search.pug';
import {showErrors} from '../utils/errors.js';
import Router from '../../utils/router';
import {fetchRequest} from '../network/fetch';

export const createSearchPage = (keyword) => {
  const url = serverLocate+'/search/'+keyword;
  fetchRequest(url, 'GET', null,
  ).then(
      (response) => response.json(),
  ).then(
      (result) => {
        const root = document.getElementById('stuff');
        root.innerHTML = searchPagePug({result: result});
      },
      // добавить листенеры
  ).catch((error) => {
    console.log(error);
    showErrors(error);
  },
  );
};


const addListeners = (result) => {
  const root = document.getElementById('search_results');
  for (let i = 0; i < result.films.length; i++) {
    const element = document.getElementById(result.films[i].id);
    element.addEventListener('click', function(evt) {
      evt.preventDefault();
      Router.go('/film/' + result.films[i].id, 'film');
    });
  }


  for (let i = 0; i < result.actors.length; i++) {
    const element = document.getElementById(result.actors[i].id);
    element.addEventListener('click', function(evt) {
      evt.preventDefault();
      Router.go('/actor/'+result[i].id, 'actor');
    });
  }

  //TODO: profiles


};