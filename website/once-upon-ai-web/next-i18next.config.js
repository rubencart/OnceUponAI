const path = require("path");

module.exports = {
  i18n: {
    defaultLocale: "nl",
    locales: ["nl", "en"],
    fallbackLng: "nl",
    localePath: path.resolve("./public/static/locales"),
  },
};
