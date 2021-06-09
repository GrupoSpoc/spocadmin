import * as Cookies from "js-cookie";

export const setJWT = jwt => {
  clearJWT();
  Cookies.set("jwt", jwt, { expires: 14 });
};

export const clearJWT = () => {
  Cookies.remove("jwt");
};

export const getJWT = () => {
  const jwt = Cookies.get("jwt");

  if (jwt) {
    return jwt;
  } else {
    return null;
  }

};

export const authenticated = () => getJWT() != null;

