import Cookies from 'js-cookie';

export function getCookie(name: string) {
  return Cookies.get(name);
}

export function setCookie(name: string, value: string, expires = 400) {
  return Cookies.set(name, value, { expires });
}
