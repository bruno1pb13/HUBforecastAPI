
const { validSession } = require('../controllers/sessions')
const { newDevice, removeDevice } = require('../controllers/display')
const indirectLogin = require('../controllers/indirectLogin')

const { generateToken } = require('../componentes/indirectLoginToken')

module.exports = function (io) {
    io.on('connection', function (socket) {
      socket.emit('message', 'This is a message from the dark side.');
  
      socket.on('authenticated', function (data) {
        socket.emit('authenticated', validSession(data.token));
      });
  
      socket.on('join', function (data) {
        socket.join(data);
  
        newDevice(data, socket.id)
          .then((response) => {
            socket.emit('message', 'Connection established');
          });
      });
  
      socket.on('indirectLoginToken', function () {
        token = generateToken();
  
        socket.join(token);
  
        indirectLogin()
          .register(token, socket.id)
          .then((response) => {
            socket.emit('indirectLoginToken', token);
          })
          .catch((err) => {
            console.log(err);
          });
      });
  
      socket.on('disconnect', function () {
        console.log('user disconnected');
        removeDevice(socket.id);
      });
    });
  };
  