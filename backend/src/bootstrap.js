const dotenv = require('dotenv');


dotenv.config({
  path:
    process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'test'
      ? '.env.test'
      : '.env',
});
