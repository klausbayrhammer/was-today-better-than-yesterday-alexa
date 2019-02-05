const translationKeys = require('./translation-keys');

const DEFAULT_LOCALE = 'en-GB';

module.exports = function (locale, key, ...substitues) {
  const keys = translationKeys();
  const translationWithoutSubstitutions = (keys[locale] && keys[locale][key]) || keys[DEFAULT_LOCALE][key];
  return substitues.reduce((translation, substitute, idx) => translation.replace(`{${idx}}`, substitute), translationWithoutSubstitutions);
};
