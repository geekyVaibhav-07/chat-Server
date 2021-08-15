import express from 'express';
import cors from 'cors';
import http from 'http';
import corsOptions from './socket/cosrSetting.js';
import { Server } from 'socket.io';
import ConnectionManager from './socket/connectionManager.js';

const app = express();
app.use(cors())
app.get('/', function(req, res) {
    res.json({
        message: 'request received'
    })
})

const server = http.createServer(app);
server.listen(5000, (err) => {
    if(err) {
        console.log(err);
    } else {
        console.log('server started');
    }
});

const io = new Server(server, {
    cors: corsOptions
});

const connectionManager = new ConnectionManager();
connectionManager.registerEvents(io);
