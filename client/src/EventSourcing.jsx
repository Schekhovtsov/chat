import { useState, useEffect } from 'react';
import axios from 'axios';

export const EventSourcing = () => {
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState('');

    const sendMessage = async () => {
        await axios.post('http://localhost:5000/new-messages', {
            message: value,
            id: Date.now(),
        });
    };

    const subscribe = async () => {
        const eventSource = new EventSource('http://localhost:5000/connect');
        eventSource.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log(message);
            setMessages((prev) => [...prev, message]);
        };
    };

    useEffect(() => {
        subscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <div>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
                <button onClick={sendMessage}>Send</button>
            </div>

            <div>
                {messages.map(({ id, message }) => (
                    <div key={{ id }}>{message}</div>
                ))}
            </div>
        </div>
    );
};
