import 'module-alias/register';
import swaggerConfig from './swagger';
import app from './app';

function isAllEnvSet() {
  const envsName = [
    'PORT',
    'DATABASE_URL',
    'ACCESS_TOKEN_SECRET_KEY',
    'REFRESH_TOKEN_SECRET_KEY',
    'ACCESS_TOKEN_EXPIRES_IN',
    'REFRESH_TOKEN_EXPIRES_IN',

    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USERNAME',
    'SMTP_PASSWORD',
    'SMTP_SENDER',
  ]

  for (const envName of envsName) {
    if (!process.env[envName]) {
      console.error(`${envName} is not set in .env file`);
      return false;
    }
  }
  return true;
}

if (!isAllEnvSet()) {
  process.exit(1);
}
  const port = process.env.PORT;
  swaggerConfig(app);
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    console.log(`Swagger is running at http://localhost:${port}/api-docs`);
  });

