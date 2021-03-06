import Router from '../../utils/router.js';
import {serverLocate} from '../../utils/locale.js';
import genresPage from '../pages/genres/genres.pug';
import {fetchRequest} from '../network/fetch';
import '../pages/menu/menu.scss';

export const createGenres = (genre) => {
  if (document.getElementById('stuff') === null) {
    const root = document.getElementById('root');
    root.innerHTML = '';
    const stuff = document.createElement('div');
    stuff.setAttribute('id', 'stuff');
    root.appendChild(stuff);
  }
  const stuff = document.getElementById('stuff');
  stuff.innerHTML = '';
  stuff.setAttribute('class', 'stuff');

  showGenresFilms(genre);
};

const showGenresFilms = (genre) => {
  const url = serverLocate+'/films/genre/'+ genre;
  fetchRequest(url, 'GET', null).then(
      (res) => {
        return res.ok ? res : Promise.reject(res);
      }).then(
      (response) => response.json(),
  ).then(
      (result) => {
        const root = document.getElementById('stuff');
        root.innerHTML = genresPage({
          genres: genre,
          genre: result,
        });

        for (let i = 0; i < result.length; i++) {
          const film = document.getElementById(result[i].id);
          film.addEventListener('click', function(event) {
            event.preventDefault();
            const film = {
              name: result[i].title,
              slug: result[i].slug,
            };
            Router.go('/film/' + result[i].id.toString(), film);
          });
        }
      },
  ).catch((error) => {
    console.log(error);
  });
};

