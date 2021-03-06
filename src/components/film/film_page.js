import '../pages/film/film_page.scss';
import '../pages/menu/menu.scss';
import {showErrors} from '../utils/errors.js';
import filmPagePug from '../pages/film/film_page.pug';
import actorsLinePug from '../pages/film/actorsLine.pug';
import {serverLocate} from '../../utils/locale.js';
import Router from '../../utils/router.js';
import {getMonth, getTimeFromMins, sklonenieSeries} from '../utils/validate.js';
import {fetchRequest} from '../network/fetch.js';
import {createMenu} from '../menu/menu';

// eslint-disable-next-line valid-jsdoc
/**
 * Модуль создания страницы фильма
 * @function
 */
export const createFilmPage = (id) => {
  createBase(id);
};

const createBase = (id) => {
  if (document.getElementById('navbar') === null) {
    createMenu();
  }
  if (document.getElementById('stuff') === null) {
    const root = document.getElementById('root');
    root.innerHTML = '';
    const stuff = document.createElement('div');
    stuff.setAttribute('id', 'stuff');
    stuff.setAttribute('class', 'stuff');
    root.appendChild(stuff);
  }
  const stuff = document.getElementById('stuff');
  stuff.innerHTML = '';
  stuff.setAttribute('class', 'stuff');

  const rootFilm = document.createElement('div');
  rootFilm.setAttribute('id', 'root-film');
  stuff.appendChild(rootFilm);

  showFilm(id);
};


const showFilm = (filmId) => {
  const url = serverLocate+'/films/film/'+filmId;
  fetch(url, {
    method: 'GET',
  },
  ).then(
      (response) => response.json(),
  ).then(
      (result) => {
        const rootFilm = document.getElementById('root-film');
        result.duration = getTimeFromMins(result.duration);
        result.release = getMonth(new Date(result.release));
        result.release_rus = getMonth(new Date(result.release_rus));
        // eslint-disable-next-line max-len
        const countSeries = (result.is_series) ? result.seasons.length+' '+sklonenieSeries(result.seasons.length, ['сезон', 'сезона', 'сезонов']) : '';
        rootFilm.innerHTML = filmPagePug({
          result: result,
          seasons: result.seasons,
          countSeries: countSeries,
        });
        if (result.available) {
          const watchBtn = document.querySelector('.btn-watch');
          watchBtn.addEventListener('click', function(event) {
            event.preventDefault();
            if (result.is_series) {
              result.seasons[0].Pics.current = 0;
              // eslint-disable-next-line max-len
              Router.go('/player/' + result.src[0], result.title, result.seasons[0].Pics, true, false, result.slug);
            } else {
              // eslint-disable-next-line max-len
              Router.go('/player/' + result.src[0], result.title, null, true, false, result.slug);
            }
          });
        }

        if (result.is_series && result.available) {
          for (let i = 0; i < result.seasons.length; i++) {
            for (let j = 0; j < result.seasons[i].Pics.length; j++) {
              // eslint-disable-next-line max-len
              const actorContainer = document.getElementById(result.seasons[i].Src[j]);
              actorContainer.addEventListener('click', function(event) {
                event.preventDefault();
                result.seasons[i].Pics.current = j;
                console.log(result.slug);
                // eslint-disable-next-line max-len
                Router.go('/player/'+result.seasons[i].Pics[j], result.title, result.seasons[i].Pics, true, false, result.slug);
              });
            }
          }
        } else {
          if (result.is_series) {
            for (let i = 0; i < result.seasons.length; i++) {
              for (let j = 0; j < result.seasons[i].Pics.length; j++) {
                // eslint-disable-next-line max-len
                const actorContainer = document.getElementById(result.seasons[i].Src[j] + 'info');
                actorContainer.classList.add('info-b');
              }
            }
          }
        }

        for (let i = 0; i < result.genres.length; i++) {
          const film = document.getElementById(result.genres[i]);
          film.addEventListener('click', function(event) {
            event.preventDefault();
            Router.go('/genre/' + result.genres[i], result.genres[i]);
          });
        }

        const url = serverLocate+'/films/starred/check/'+ filmId;
        fetchRequest(url, 'GET', null).then(
            (res) => {
              if (res.ok) {
                const likeBtn = document.getElementById('re-like');
                likeBtn.classList.toggle('re-btn-unwatch');
              }
            }).catch((error) => {
          console.log(error);
          showErrors(error);
        },
        );

        const WLurl = serverLocate+'/films/wl/check/'+ filmId;
        fetchRequest(WLurl, 'GET', null).then(
            (res) => {
              if (res.ok) {
                const wlBtn = document.getElementById('wl');
                wlBtn.classList.toggle('btn-unwatch-later');
              }
            }).catch((error) => {
          console.log(error);
          showErrors(error);
        },
        );

        // авторизован ли пользователь или нет,
        // отрисовываем по разному кнопки лайка и отложенного просмотра
        checkPayed(result.available);
        checkAuth(filmId);

        showActors(result.actors);
      },
  ).catch((error) => {
    console.log(error);
    showErrors(error);
  },
  );
};

const showActors = (actors) => {
  const url = serverLocate+'/actors/film';
  const actorsBody = [];
  for (let i = 0; i < actors.length; i++) {
    const bdy = {
      id: actors[i].toString(),
    };
    actorsBody.push(bdy);
  }

  fetch(url, {
    method: 'POST',
    body: JSON.stringify(actorsBody),
  },
  ).then(
      (response) => response.json(),
  ).then(
      (result) => {
        let salt = 'many-actors';
        const manyActors = document.getElementById('many-actors');
        manyActors.innerHTML = actorsLinePug({
          actors: result,
          salt: salt,
        });

        for (let i = 0; i < result.length; i++) {
          const actorContainer = document.getElementById(result[i].id+salt);
          actorContainer.addEventListener('click', function(event) {
            event.preventDefault();
            const rootPage = document.getElementById('stuff');
            rootPage.innerHTML = '';
            // eslint-disable-next-line max-len
            Router.go('/actor/'+result[i].id, result[i].name+' '+result[i].surname);
          });
        }

        salt = 'root-actors';
        const root = document.getElementById('root-actors');
        let result2 = result;
        if (result.length > 3) {
          result2 = result.slice(0, 3);
        }
        root.innerHTML = actorsLinePug({
          actors: result2,
          salt: salt,
        });
        for (let i = 0; i < result.length; i++) {
          const actorContainer = document.getElementById(result[i].id+salt);
          actorContainer.addEventListener('click', function(event) {
            event.preventDefault();
            const rootPage = document.getElementById('stuff');
            rootPage.innerHTML = '';
            // eslint-disable-next-line max-len
            Router.go('/actor/'+result[i].id, result[i].name+' '+result[i].surname);
          });
        }
      },
  ).catch((error) => {
    console.log(error);
    showErrors(error);
  },
  );
};


const likeFilm = (filmId) => {
  const url = serverLocate + '/films/starred/' + filmId;
  fetchRequest(url);
};

const dislikeFilm = (filmId) => {
  const url = serverLocate + '/films/starred/' + filmId;
  fetchRequest(url, 'DELETE');
};

const watchLater = (filmId) => {
  const url = serverLocate + '/films/wl/' + filmId;
  fetchRequest(url);
};

const unwatchLater = (filmId) => {
  const url = serverLocate + '/films/wl/' + filmId;
  fetchRequest(url, 'DELETE');
};


const checkAuth = (filmId) => {
  const url = serverLocate+'/users/auth';
  fetch(url, {
    method: 'GET',
    credentials: 'include',
  },
  ).then(
      (response) => {
        if (!response.ok) {
          throw error;
        }
      },
  ).then(() => {
    const likeBtn = document.getElementById('re-like');
    likeBtn.addEventListener('click', function(event) {
      event.preventDefault();
      const isStarred = likeBtn.classList.contains('re-btn-unwatch');
      if (isStarred) {
        dislikeFilm(filmId);
      } else {
        likeFilm(filmId);
      }
      likeBtn.classList.toggle('re-btn-unwatch');
    });

    const wlBtn = document.getElementById('wl');
    wlBtn.addEventListener('click', function(event) {
      event.preventDefault();
      const isInWatchList = wlBtn.classList.contains('btn-unwatch-later');
      if (isInWatchList) {
        unwatchLater(filmId);
      } else {
        watchLater(filmId);
      }
      wlBtn.classList.toggle('btn-unwatch-later');
    });

    // Ставить рейтинг может только авторизованный пользователь
    for (let i = 1; i <= 5; i++) {
      const star = document.getElementById('rating-star-' + i);
      let time;
      star.addEventListener('click', function(event) {
        event.preventDefault();
        for (let j = 1; j <= i; j++) {
          const starSec = document.getElementById('rating-star-' + j);
          if (!starSec.classList.contains('star-select-user')) {
            starSec.classList.toggle('star-select-user');
          }
        }
        for (let j = i+1; j <= 5; j++) {
          const starSec = document.getElementById('rating-star-' + j);
          if (starSec.classList.contains('star-select-user')) {
            starSec.classList.toggle('star-select-user');
          }
        }
        // eslint-disable-next-line max-len
        const ratingUrl = serverLocate+'/films/film/' + filmId + '/rating?rating=' + i;
        clearTimeout(time);
        time = setTimeout(sendRating, 450, ratingUrl, filmId);
      });
    }

    const ratingUrl = serverLocate+'/films/film/' + filmId + '/user/rating';
    fetchRequest(ratingUrl, 'GET', null).then(
        (response) => response.json(),
    ).then(
        (res) => {
          const rating = res.rating%6;
          for (let j = 1; j <= rating; j++) {
            const starSec = document.getElementById('rating-star-' + j);
            if (!starSec.classList.contains('star-select-user')) {
              starSec.classList.toggle('star-select-user');
            }
          }
          for (let j = rating + 1; j <= 5; j++) {
            const starSec = document.getElementById('rating-star-' + j);
            if (starSec.classList.contains('star-select-user')) {
              starSec.classList.toggle('star-select-user');
            }
          }
        }).catch((error) => {
      console.log(error);
      showErrors(error);
    },
    );
  },
  ).catch(() => {
    const likeBtn = document.getElementById('re-like');
    likeBtn.classList.add('info-b');
    const wlBtn = document.getElementById('wl');
    wlBtn.classList.add('info-b');
    const ratingBtn = document.getElementById('rating');
    ratingBtn.classList.add('info-b');

    const ratingUrl = serverLocate+'/films/film/'+filmId;
    fetchRequest(ratingUrl, 'GET', null).then(
        (response) => response.json(),
    ).then(
        (res) => {
          const rating = res.rating%6;
          for (let j = 1; j <= rating; j++) {
            const starSec = document.getElementById('rating-star-' + j);
            if (!starSec.classList.contains('star-select')) {
              starSec.classList.toggle('star-select');
            }
          }
          for (let j = rating + 1; j <= 5; j++) {
            const starSec = document.getElementById('rating-star-' + j);
            if (starSec.classList.contains('star-select')) {
              starSec.classList.toggle('star-select');
            }
          }
        }).catch((error) => {
      console.log(error);
      showErrors(error);
    },
    );
  },
  );
};

const sendRating = (ratingUrl, filmId) => {
  fetchRequest(ratingUrl, 'POST').then(() => {
    const ratingReUrl = serverLocate+'/films/film/'+filmId;
    fetchRequest(ratingReUrl, 'GET', null).then(
        (response) => response.json(),
    ).then(
        (res) => {
          const rating = res.rating%6;
          const idRating = document.getElementById('rating-num');
          idRating.innerHTML = 'Рейтинг: '+rating.toFixed(1);
        }).catch((error) => {
      showErrors(error);
    });
  });
};

const checkPayed = (available) => {
  if (available) {
    return;
  }
  const url = serverLocate+'/users/profile';
  fetch(url, {
    method: 'GET',
    credentials: 'include',
  },
  ).then(
      (response) => {
        if (!response.ok) {
          throw error;
        }
      },
  ).then(
      (result) => {
        if (result.IsValid) {
          return;
        }
        const watchBtn = document.getElementById('wb');
        watchBtn.addEventListener('click', function(event) {
          event.preventDefault();
          watchBtn.classList.add('info-b');
        });
      },
  ).catch(() => {
    const watchBtn = document.querySelector('.btn-watch');
    watchBtn.classList.add('info-b');
  });
};
