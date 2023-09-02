const express = require('express');
const cors = require('cors');
const events = require('events');

const PORT = 5000;

const emitter = new events.EventEmitter();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/get-messages', (_, res) => {
    emitter.once('newMessage', (message) => {
        res.json(message);
    });

    setTimeout(() => {
        res.end();
    }, 2000);
});

app.post('/new-messages', (req, res) => {
    const message = req.body;
    console.log(message);
    emitter.emit('newMessage', message);

    res.status(200);
    res.end();
});

app.listen(PORT, () => console.log(`server started on ${PORT} port`));
