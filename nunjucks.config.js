// fallback in case the value is not set in ENV variables.
const LOCALE_DEFAULT = 'fr'

const fr = require('./locales/fr/index')

const locale = LOCALE_DEFAULT
const strings = {
  fr: fr
}

module.exports = {
  options: { noCache: true },
  root: ["./templates", "."],
  data: {
    locale: locale,
    strings: strings[locale]
  },
  filters: {
    json: (value, spaces) => {
      return JSON.stringify(value, null, spaces).replace(/</g, '\\u003c')
    },
    img_require: (path) => {
      return path;
    },
    retina: (filename) => {
      const uri = filename.split('.');
      const extension = uri.pop();

      return `${uri.join('.')}@2x.${extension}`;
    },
    split: (value, separator) => {
      return value.split(separator);
    },
    facebook: (url) => {
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURI(url)}`;
    },
    twitter: (url, title = null) => {
      const attrs = [];

      if( url ) attrs.push(`url=${encodeURI(url)}`);
      if( title ) attrs.push(`text=${encodeURI(title)}`);

      return `http://twitter.com/share?${attrs.join('&')}`;
    },
    email: (url, subject = null) => {
      const attrs = [];

      if( subject ) attrs.push(`subject=${encodeURI(subject)}`);
      if( url ) attrs.push(`body=${encodeURI(url)}`);

      return `mailto:?${attrs.join('&')}`;
    }
  }
}
