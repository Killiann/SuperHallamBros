exports.join = (socket, socketList) => {
  socket.id = Math.random()*10;
  socketList[socket.id] = socket;
  console.log("New connection on the server for socket id: " + socket.id);
}
