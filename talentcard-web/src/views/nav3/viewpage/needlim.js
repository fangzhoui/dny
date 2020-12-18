
  export function needlim(url = ""){
    const httpReg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
    const isDev = process.env.NODE_ENV == "development";
    const origin = window.location.origin;
    if (httpReg.test(url)) {
      return url;
    } else {
      if (!/^\//.test(url)) url = "/" + url;
      if (isDev) {
        return `http://dev.localcards.gov.vbooster.cn${url}`;
      } else {
        return `${origin}${url}`;
      }
    }
  }