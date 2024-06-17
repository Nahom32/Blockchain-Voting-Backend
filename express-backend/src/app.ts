import express from 'express';
import userRoute from './api/user/user.route';
import authRoute from './api/auth/auth.route';
import electionRoute from './api/election-data/electionData.route';
import router from './api/file-upload/file-upload.route';
import oraganizatinRoute from './api/organization/organizations.route'
import path from 'path';
import cookieParser from 'cookie-parser'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'


  const app = express();
  app.use(cors());
  app.use(express.static(path.join(__dirname, '../public')));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser())
  app.use(compress())
  app.use(helmet())
  app.use(cors())

  app.get('/', (req, res) => {
    res.json({ message: 'Allo! Catch-all route.' });
  });

  app.use('/api/v1/user', userRoute);
  app.use('/api/v1/auth', authRoute);
  app.use('/api/v1/file', router);
  app.use('/api/v1/oraganizatins', oraganizatinRoute);
  app.use('/api/v1/elections', electionRoute);

  export default app;

  

