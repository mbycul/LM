const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "ak6obp",
  reporter: "mochawesome",
  reporterOptions: {
    "reportFilename": "[name]-report",
    "overwrite": true,
    "html": true,
    "json": true
  },
  e2e: {
    // viewportHeight: 1280,
    // viewportHeight: 800,
    baseUrl: 'https://www.leroymerlin.pl/',
    chromeWebSecurity: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
