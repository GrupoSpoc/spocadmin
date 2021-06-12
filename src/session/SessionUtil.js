import * as Cookies from "js-cookie";

export const setJWT = jwt => {
  clearJWT();
  Cookies.set("jwt", jwt, { expires: 180 });
};

export const setUser = user => {
  clearUser();
  Cookies.set("user", user, { expires: 180 });
};


export const clearJWT = () => {
  Cookies.remove("jwt");
};

export const clearUser = () => {
  Cookies.remove("user");
};

export const getJWT = () => {
  const jwt = Cookies.get("jwt");

  if (jwt) {
    return jwt;
  } else {
    return null;
  }

};

export const getUser = () => {
  const user = Cookies.get("user");

  if (user) {
    return user;
  } else {
    return null;
  }

};

export const authenticated = () => getJWT() != null;

