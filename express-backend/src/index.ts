import express from 'express';
import userRoute from './api/user/user.route';
import authRoute from './api/auth/auth.route';
import swaggerConfig from './swagger';
import path from 'path';



const app = express();
const port = 3000;
app.use(express.static(path.join(__dirname, '../public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);
swaggerConfig(app); 
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });

