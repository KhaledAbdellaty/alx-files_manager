import express from 'express';
import AppController from '../controllers/AppController';
import AuthController from '../controllers/AuthController';
import UsersController from '../controllers/UsersController';
import FilesController from '../controllers/FilesController';

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

  router.post('/files', FilesController.postUpload);

  // GET /files/:id => FilesController.getShow
  router.get('/files/:id', FilesController.getShow);

  // GET /files => FilesController.getIndex
  router.get('/files', FilesController.getIndex);

  // PUT /files/:id/publish => FilesController.putPublish
  router.put('/files/:id/publish', FilesController.putPublish);

  // PUT /files/:id/unpublish => FilesController.putUnpublish
  router.put('/files/:id/unpublish', FilesController.putUnpublish);

  // GET /files/:id/data => FilesController.getFile
  router.get('/files/:id/data', FilesController.getFile);
}

export default myRouter;
