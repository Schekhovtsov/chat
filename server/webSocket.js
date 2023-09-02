const ws = require('ws');

const server = new ws.Server(
    {
        port: 5000,
    },
    () => console.log('WebSocket server has started')
);

const broadcastMessage = (message) => {
    server.clients.forEach((client) => {
        client.send(JSON.stringify(message));
    });
};

server.on(
    'connection',
    (connection = (ws) => {
        ws.on('message', (message) => {
            message = JSON.parse(message);

            switch (message.event) {
                case 'message':
                case 'connection': {
                    broadcastMessage(message);
                    break;
                }
            }
        });
    })
);
