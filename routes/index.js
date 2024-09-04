import express from 'express';
import AppController from '../controllers/AppController';
import AuthController from '../controllers/AuthController';
import UsersController from '../controllers/UsersController';
import FileController from '../controllers/FilesController';

const router = express.Router();

function myRouter(app) {
  app.use('/', router);

  router.get('/status', (req, res) => {
    AppController.getStatus(req, res);
  });

  router.get('/stats', (req, res) => {
    AppController.getStats(req, res);
  });

  router.post('/users', (req, res) => {
    UsersController.postNew(req, res);
  });

  router.get('/connect', (req, res) => {
    AuthController.getConnect(req, res);
  });

  router.get('/disconnect', (req, res) => {
    AuthController.getDisconnect(req, res);
  });

  router.get('/users/me', (req, res) => {
    UsersController.getMe(req, res);
  });

  router.post('/files', FileController.postUpload);

  // GET /files/:id => FilesController.getShow
  router.get('/files/:id', FileController.getShow);

  // GET /files => FilesController.getIndex
  router.get('/files', FileController.getIndex);
}

export default myRouter;
