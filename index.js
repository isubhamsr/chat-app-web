const express = require("express")
const app = express()
const server = require("http").createServer(app);
const io = require("socket.io").listen(server)

const connections = []
const user = []
const disConnectedUsers = []
console.log("USer Array init", user);


server.listen(3000);
console.log("server running");

// WARNING: app.listen(80) will NOT work here!

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.sockets.on("connection", function(socket){
    connections.push(socket)
    console.log(`${connections.length} User Connected`);

    socket.on("send-message",(data)=>{
        console.log(data);
        io.emit("new-message", {msg:data, user:socket.username})
    })

    socket.on("user-name", (data, calback)=>{
        calback(true)
        socket.username = data
        console.log("User name", data);
        
        user.push(socket.username)
        console.log("USer Array", user);
        
        // io.emit("get-users", user)
        updateUserNames()
    })

    function updateUserNames(){
        io.emit("get-users", user)
        console.log("USer from get update", user);
        
    }

     // Disconnected
     socket.on('disconnect', (data)=>{
         user.splice(user.indexOf(socket.username), 1)
         updateUserNames()

        // disConnectedUsers.push(socket.username)
        // io.emit("disConnectedUsers",disConnectedUsers)

        connections.splice(connections.indexOf(socket),1)
        console.log(`${connections.length} user disconnect`);
        console.log(`${socket.username} user disconnect`);
        disConnectedUsers.push(socket.username)
        console.log("disConnectedUsers",disConnectedUsers);
        
    })

    
})

