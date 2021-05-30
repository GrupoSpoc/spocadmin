import * as Cookies from "js-cookie";

export const setJWT = session => {
  clearJWT();
  Cookies.set("jwt", session, { expires: 14 });
  console.log(getJWT())
};

export const clearJWT = () => {
  Cookies.remove("jwt");
};

export const getJWT = () => {
  const sessionCookie = Cookies.get("jwt");

  if (sessionCookie) {
    return JSON.parse(sessionCookie);
  } else {
    return null;
  }

};

export const authenticated = () => true;

