import { useState, useEffect } from 'react';
import axios from 'axios';

export const LongPolling = () => {
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState('');

    const sendMessage = async () => {
        await axios.post('http://localhost:5000/new-messages', {
            message: value,
            id: Date.now(),
        });
    };

    const subscribe = async () => {
        try {
            const { data } = await axios.get(
                'http://localhost:5000/get-messages'
            );
            setMessages((prev) => [...prev, data]);
            await subscribe();
        } catch (e) {
            setTimeout(() => {
                subscribe();
            }, 5000);
        }
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
