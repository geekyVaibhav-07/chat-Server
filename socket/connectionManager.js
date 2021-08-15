class ConnectionManager {
    constructor() {
        this.connections = {};
        this.pendingMessages = {};
    }

    sendMessage(socket, messageObject) {
        const { recipient, message, sendAt } = messageObject;
        const sender = socket.handshake.query.name;

        const conenctionIdofRecipient = this.connections[recipient];
        const messageToBeSent =  {
            message,
            sendAt,
            sender
        };
        if(conenctionIdofRecipient) {
            console.log('message is being sent', messageToBeSent);
            socket.to(conenctionIdofRecipient).emit('receiveMessage', messageToBeSent)
        } else {
            this.pendingMessages[recipient] = this.pendingMessages[recipient] ? this.pendingMessages[recipient].push(messageToBeSent) : new Array(messageToBeSent);
        }
    };

    connectionCallBack = socket => {
        const id = socket.id;
        const query = socket.handshake.query;
        const name = query.name;
        this.connections[name] = id;
        socket.emit('connected', 'The connection has been established');
        if(this.pendingMessages[name]) {
            while(this.pendingMessages[name].length) {
                socket.emit('receiveMessage', this.pendingMessages[name].pop());
            }
        }
        socket.on('sendMessage', (messageObject) => {
            return this.sendMessage(socket, messageObject);
        });
        socket.on('disconnect', (args) => this.doisconenctCallBack(socket, args));
        console.log(this.connections);
    }

    doisconenctCallBack = (socket,args) => {
        console.log(args);
        this.connections[socket.handshake.query.name] = undefined;
        console.log(this.connections);
    }

    registerEvents = io => {
        io.on('connection', this.connectionCallBack);   
    }
}

export default ConnectionManager;