// Lets `npm start` serve the serverless functions in /api, so the Now page's
// Goodreads and Spotify columns work locally. On Vercel these functions run on
// their own and this file isn't used (Create React App only reads it in dev).
// The functions read their settings from .env.local, which `npm start` loads.

const path = require("path");
const fs = require("fs");

const API_DIR = path.join(__dirname, "..", "api");

module.exports = function setupApi(app) {
  app.get("/api/:name", async (req, res, next) => {
    const file = path.join(API_DIR, `${path.basename(req.params.name)}.js`);
    if (!fs.existsSync(file)) return next();

    // Re-read the function on every request so edits apply without a restart
    delete require.cache[require.resolve(file)];
    try {
      await require(file)(req, res);
    } catch (error) {
      next(error);
    }
  });
};
