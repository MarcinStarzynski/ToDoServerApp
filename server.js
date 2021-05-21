const express = require('express');
const cors = require('cors');
const socket = require('socket.io');

const app = express();

app.use(cors());

let tasks = [];

const server = app.listen(process.env.PORT || 8000, () => {
    console.log('Server is running on port 8000');
});

const io = socket(server);

io.on('connection', (socket) => {
    socket.on('updateData', () => {
        socket.emit('updateTasks', tasks);
    })
    socket.on('addTask', ({ id, name }) => {
        const newTask = { id, name };
        tasks.push(newTask);
        
        socket.broadcast.emit('addTask', newTask);
    })
    socket.on('removeTask', (id) => {
        tasks.splice(id, 1);
        socket.broadcast.emit('removeTask', id);
    })
    console.log('New client! Its id – ' + socket.id);
})