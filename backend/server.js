const { config } = require('./src/config/env');
const app = require('./src/app');

const PORT = config.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Syria Cable Zone backend running on port ${PORT} [${config.NODE_ENV}]`);
});

module.exports = app;
