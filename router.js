import Router from 'express';
// import AppController from './controllers/AppController';
import RoomController from './controllers/RoomController';

// Initialize instance of express Router
const router = Router();

// Index page
router.get('/', (req, res) => {
  res.sendFile(__dirname + '/static/index.html');
});

// Room creation route
router.get('/room/create', RoomController.createRoom);

// Name retrieval form and room joining
router.all(`/room/:roomId/join`, RoomController.joinRoom);

// Room page
router.get(`/room/:roomId`, RoomController.displayRoom);

// Export router
module.exports = router;