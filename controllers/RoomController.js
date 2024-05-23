import {v4 as uuidv4} from 'uuid';
import redisClient from '../utils/redis';

// Handle room requests
class RoomController {
  // Room creation
  static async createRoom(req, res) {
    const roomId = uuidv4();
    const roomObj = {
      members: [],
    };
    const room = JSON.stringify(roomObj);
    console.log(`Details - ${roomId}, ${room}`);
    try {
      await redisClient.set(roomId, room, 300);
      res.redirect(`/room/${roomId}`);
    } catch (error) {
      res.status(500).send(`Error creating room: ${error}`);
    }
  }

  // Handle room joining
  static async joinRoom(req, res) {
    const roomId = req.params.roomId;
    if (req.method === 'GET') {
      // Redirect to form to retrieve name
      res.render('join', { roomId });
    } else if (req.method === 'POST') {
      // Add name to members and redirect to room
      const name = req.body.name;
      try {
        const room = await redisClient.get(roomId);
        let roomObj;
        if (room) {
          roomObj = JSON.parse(room);
        } else {
          res.status(404).send('Room not found');
          return;
        }
        const members = roomObj.members;
        if (members.includes(name)) {
          let newName = name;
          let count = 1;
          while(members.includes(newName)) {
            newName = `${name}_${count}`;
            count++;
          }
          members.push(newName);
        } else {
          members.push(name);
        }
        const value = JSON.stringify(roomObj);
        await redisClient.set(roomId, value, 60);
        // Cookie for tracking room request
        res.cookie(`room-${roomId}-name`, name, { maxAge: 300000, httpOnly: true });
        res.redirect(`/room/${roomId}`);
      } catch (error) {
        console.log(error);
        res.status(404).send('Room not found');
      }
    }
  };

  // Room page
  static async displayRoom(req, res) {
    const roomId = req.params.roomId;
    const name = req.cookies[`room-${roomId}-name`];
    if (!roomId) {
      res.redirect('/')
    } else if (!name) {
      res.redirect(`/room/${roomId}/join`);
    }else {
      try {
        const roomObjstr = await redisClient.get(roomId);
        const roomObj = JSON.parse(roomObjstr);
        if (!roomObj) {
          res.status(404).send('Room not found');
        } else {
          const members = roomObj.members;
          res.status(200).send(`<p>Room with ID: ${roomId}</p><p>Members: ${members}</p>`);
        }
      } catch (error) {
        res.status(404).send('Room not found');
      }
    }
  };
}

module.exports = RoomController;
