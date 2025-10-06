import { useCookies } from "react-cookie";
let setCookieFunction;

export const useGlobalCookies = () => {
  const [cookies, setCookie] = useCookies(["secureUser"]);
  setCookieFunction = setCookie;
  return cookies;
};

export const updateCookie = (name, value, options = {}) => {
  if (setCookieFunction) {
    setCookieFunction(name, value, {
      path: "/",
      ...options,
    });
  } else {
    console.warn("Cookie setter not initialized yet.");
  }
};
