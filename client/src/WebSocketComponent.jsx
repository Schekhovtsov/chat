import { useState, useRef } from 'react';

export const WebSocketComponent = () => {
    const [username, setUsername] = useState('');
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [value, setValue] = useState('');
    const socket = useRef();

    const sendMessage = async () => {
        const message = {
            username,
            message: value,
            id: Date.now(),
            event: 'message',
        };

        socket.current.send(JSON.stringify(message));
        setValue('');
    };

    const connect = () => {
        socket.current = new WebSocket('ws://localhost:5000');

        socket.current.onopen = () => {
            setIsConnected(true);
            const message = {
                event: 'connection',
                username,
                id: Date.now(),
            };
            socket.current.send(JSON.stringify(message));
        };

        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setMessages((prev) => [...prev, message]);
        };

        socket.current.onclose = () => {
            console.log('Socket has been closed');
        };

        socket.current.onerror = () => {
            console.log('WebSocket error');
        };
    };

    if (!isConnected) {
        return (
            <div>
                <div>Вы не подключены</div>
                <input
                    type="text"
                    placeholder="Введите ваше имя"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <button onClick={connect}>Connect</button>
            </div>
        );
    }

    return (
        <div>
            <div>
                <input
                    type="text"
                    placeholder="Текст сообщения"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
                <button onClick={sendMessage}>Send</button>
            </div>

            <div>
                {messages.map(({ id, event, username, message }) => (
                    <div key={{ id }}>
                        {event === 'connection' ? (
                            <em>User {message} was connected</em>
                        ) : (
                            <p>
                                <em>{username}</em>: {message}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
