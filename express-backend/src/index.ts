import express from 'express';
import userRoute from './api/user/user.route';
import electionDataRoute from './api/election-data/electionData.route';
import authRoute from './api/auth/auth.route';
import router from './api/file-upload/file-upload.route';
import oraganizatinRoute from './api/organization/organizations.route'
import swaggerConfig from './swagger';
import path from 'path';
import cookieParser from 'cookie-parser'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'


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
  const app = express();
  const port = process.env.PORT;
  app.use(cors());
  app.use(express.static(path.join(__dirname, '../public')));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser())
  app.use(compress())
  app.use(helmet())
  app.use(cors())

  app.use('/api/v1/user', userRoute);
  app.use('/api/v1/auth', authRoute);
  app.use('/api/v1/file', router);
  app.use('/api/v1/oraganizatins', oraganizatinRoute);
  app.use('/api/v1/elections', electionDataRoute);

  swaggerConfig(app);
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    console.log(`Swagger is running at http://localhost:${port}/api-docs`);
  });

