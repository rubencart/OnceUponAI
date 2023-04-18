// const NextI18Next = require("next-i18next").default;
// const { initReactI18next } = require("react-i18next");

// module.exports = new NextI18Next({
//   defaultLanguage: "nl",
//   otherLanguages: ["en"],
//   fallbackLng: "nl",
//   i18next: {
//     use: [initReactI18next],
//   },
// });

module.exports = {
  i18n: {
    defaultLocale: "nl",
    locales: ["nl", "en"],
    fallbackLng: "nl",
  },
};
