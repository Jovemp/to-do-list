require('dotenv').config();
export const environment = {
  production: true,
  URL: "${process.env.URL}",
  PORT: "${process.env.PORT}"
};
