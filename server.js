import express from 'express';
import myRouter from './routes/index';

const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());
myRouter(app);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
