import express from 'express';
import userRoute from './api/user/user.route';
import authRoute from './api/auth/auth.route';
import swaggerConfig from './swagger';
import path from 'path';
import cookieParser from 'cookie-parser'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'

const app = express();
const port = 3000;
app.use(express.static(path.join(__dirname, '../public')));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(compress())
app.use(helmet())
app.use(cors())

app.use('/api/v1/user', userRoute);
app.use('/api/v1/auth', authRoute);
swaggerConfig(app); 
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });

