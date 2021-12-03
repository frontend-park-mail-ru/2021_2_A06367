
export const validators = {
  /**
   * Проверяет валидность адреса почты
   * @function
   * @param {string} email - Адрес почты
   * @return {boolean} - Флаг соответсвия адреса требованиям
   */
  email: (email= '') => validateEmail(email),
  /**
   * Проверяет валидность адреса почты
   * @function
   * @param {string} username - Имя пользователя (юзернейм)
   * @return {boolean} - Флаг соответсвия юзернейма требованиям
   */
  username: (username) => validateUsername(username),
  /**
   * Проверяет валидность пароля
   * @function
   * @param {string} password - Пользовательский пароль в открытом виде
   * @return {boolean} - Флаг соответсвия пароля требованиям
   */
  password: (password) => validatePassword(password),
};

const MIN_PATH_LENGTH = 6;
const MAX_PATH_LENGTH = 16;
const MIN_USERNAME_LENGTH = 4;
const emailCheck =
    /^[^\\s@]+@[^\\s@]+.[^\\s@]+$/;

const validateEmail = (email = '') => {
  return emailCheck.test(email);
};

const validateUsername = (username) => {
  return username.length >= MIN_USERNAME_LENGTH;
};

const validatePassword = (password) => {
  return password.length >= MIN_PATH_LENGTH &&
      password.length <= MAX_PATH_LENGTH;
};

export const getTimeFromMins = (mins) => {
  const hours = Math.trunc(mins/60);
  const minutes = mins % 60;
  return hours + ' ч ' + minutes + ' мин';
};

export function getMonth(birth) {
  let birthDay = birth.getDate();
  switch (birth.getMonth()) {
    case 0:
      birthDay += ' января ';
      break;
    case 1:
      birthDay += ' февраля ';
      break;
    case 2:
      birthDay += ' марта ';
      break;
    case 3:
      birthDay += ' апреля ';
      break;
    case 4:
      birthDay += ' мая ';
      break;
    case 5:
      birthDay += ' июня ';
      break;
    case 6:
      birthDay += ' июля ';
      break;
    case 7:
      birthDay += ' августа ';
      break;
    case 8:
      birthDay += ' сентября ';
      break;
    case 9:
      birthDay += ' октября ';
      break;
    case 10:
      birthDay += ' ноября ';
      break;
    case 11:
      birthDay += ' декабря ';
      break;
  }
  birthDay += birth.getFullYear();
  return birthDay;
}

export function sklonenieSeries(number, txt) {
  const cases = [2, 0, 1, 1, 1, 2];
  return txt[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
};

export const Genres = [
  {id: 'comedy', title: 'Комедия', name: 'Комедия', src: 'comedy.png'},
  {id: 'fiantsy', title: 'Фентези', name: 'Фентези', src: 'fantasy.png'},
  {id: 'detective', title: 'Детективы', name: 'Детективы', src: 'detective.png'},
  {id: 'drama', title: 'Драмы', name: 'Драмы', src: 'drama.png'},
  {id: 'fantasy', title: 'Фантастика', name: 'Фантастика', src: 'future.png'},
  {id: 'thrillers', title: 'Триллер', name: 'Триллер', src: 'thrillers.png'},
  {id: 'fighter', title: 'Боевики', name: 'Боевики', src: 'fighters.png'},
  {id: 'adventure', title: 'Приключения', name: 'Приключения', src: 'journey.png'},
  {id: 'horrors', title: 'Ужасы', name: 'Ужасы', src: 'horrors.png'},
  {id: 'cartoons', title: 'Мультфильмы', name: 'Мультфильмы', src: 'mult.png'},
];
//
// function translit(word){
//   var answer = '';
//   var converter = {
//     'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
//     'е': 'e', 'ё': 'e', 'ж': 'zh', 'з': 'z', 'и': 'i',
//     'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
//     'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
//     'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch',
//     'ш': 'sh', 'щ': 'sch', 'ь': '', 'ы': 'y', 'ъ': '',
//     'э': 'e', 'ю': 'yu', 'я': 'ya',
//
//     'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D',
//     'Е': 'E', 'Ё': 'E', 'Ж': 'Zh', 'З': 'Z', 'И': 'I',
//     'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N',
//     'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T',
//     'У': 'U', 'Ф': 'F', 'Х': 'H', 'Ц': 'C', 'Ч': 'Ch',
//     'Ш': 'Sh', 'Щ': 'Sch', 'Ь': '', 'Ы': 'Y', 'Ъ': '',
//     'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya',
//   };
//
//   for (let i = 0; i < word.length; ++i ) {
//     if (converter[word[i]] === undefined){
//       answer += word[i];
//     } else {
//       answer += converter[word[i]];
//     }
//   }
//
//   return answer;
// }
