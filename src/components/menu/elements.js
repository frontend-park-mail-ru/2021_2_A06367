'use strict';
import {createProfilePage} from '../../view/createProfilePage.js';
import Router from '../../utils/router.js';
import '../pages/menu/menu.scss';

const authElements = {
  profile: 'Профиль',
  logout: 'Выйти',
};

// элементы для незарегистрированных пользователей
const unauthElements = {
  login: 'Войти',
  signup: 'Регистрация',
};


/**
 * Модуль создания элементов меню
 * @function
 */
// создание элементов для меню
export const createElements = (authed) => {
  const menuLogo = document.getElementById('container-new-logo__column');
  menuLogo.addEventListener('click', function(event) {
    event.preventDefault();
    Router.go('/', 'LimeTV', null, true, false);
    closeMenu();
    const navbar = document.getElementById('navbar');
    const navbarToggle = navbar.querySelector('.container-new__toggle');
    navbar.classList.remove('opened');
    navbarToggle.setAttribute('aria-expanded', 'false');
  });
  const root = document.getElementById('navbar__btn');
  root.innerHTML = '';

  const ul = document.createElement('ul');
  ul.setAttribute('class', 'navbar-links');
  root.appendChild(ul);

  if (authed) {
    Object.keys(authElements).forEach(function(key) {
      const li = document.createElement('li');
      li.setAttribute('class', 'navbar-item');
      ul.appendChild(li);
      const menuItem = document.createElement('a');
      menuItem.setAttribute('class', key);
      if (key === 'profile') {
        menuItem.setAttribute('class', 'navbar-link');
        menuItem.id = `/${key}`;
        if (key === 'profile') {
          createProfilePage(true);
        }
      } else {
        menuItem.setAttribute('class', 'navbar-link');
        const menuImg = document.createElement('img');
        menuImg.setAttribute('class', 'menu-logout');
        menuImg.src = 'exit.ico';
        menuItem.appendChild(menuImg);
        menuItem.id = `/${key}`;
      }
      li.appendChild(menuItem);
      menuItem.addEventListener('click', function(event) {
        event.preventDefault();
        if (key === 'logout') {
          Router.go(`/${key}`, authElements[key], null, true, true);
        } else {
          Router.go(`/${key}`, authElements[key], null, true, false);
        }
        const rt = document.getElementById('navbar');
        rt.setAttribute('class', '');
        closeMenu();
      });
    });
  } else {
    Object.keys(unauthElements).forEach(function(key) {
      const li = document.createElement('li');
      li.setAttribute('class', 'navbar-item');
      ul.appendChild(li);

      const menuItem = document.createElement('a');
      menuItem.setAttribute('class', 'navbar-link btn-in first');
      menuItem.textContent = unauthElements[key];
      menuItem.dataset.section = key;
      menuItem.id = `/${key}`;
      li.appendChild(menuItem);
      menuItem.addEventListener('click', function(event) {
        event.preventDefault();
        Router.go(`/${key}`, unauthElements[key], null, true, false);
        const rt = document.getElementById('navbar');
        rt.setAttribute('class', '');
        closeMenu();
      });
    });
  }
  menu();
};

const menu = () => {
  const navbar = document.getElementById('navbar');
  const navbarToggle = navbar.querySelector('.container-new__toggle');
  const area = document.getElementById('navbar__btn');

  const openMobileNavbar = () => {
    navbar.classList.add('opened');
    navbarToggle.setAttribute('aria-expanded', 'true');
  };

  const closeMobileNavbar = () => {
    navbar.classList.remove('opened');
    navbarToggle.setAttribute('aria-expanded', 'false');
  };

  navbarToggle.addEventListener('click', () => {
    if (navbar.classList.contains('opened')) {
      closeMobileNavbar();
    } else {
      openMobileNavbar();
      closeMenu();
    }
  });

  area.addEventListener('click', (event) => {
    event.preventDefault();
    closeMobileNavbar();
  });

  const navbarLinksContainer = navbar.querySelector('.navbar-links');

  navbarLinksContainer.addEventListener('click', (clickEvent) => {
    clickEvent.stopPropagation();
  });
};

const closeMenu = () => {
  const searchBtn = document.querySelector('.container-new-search__btn');
  const cancelBtn = document.querySelector('.container-new-cancel__btn');
  const form = document.querySelector('form');
  searchBtn.classList.remove('hide');
  cancelBtn.classList.remove('show');
  form.classList.remove('active');
  const search = document.getElementById('close_focus');
  if (search) {
    search.parentNode.removeChild(search);
  }
  const searchForm = document.getElementById('text-search');
  searchForm.value = '';
};
