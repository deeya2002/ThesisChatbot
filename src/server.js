import React, { useState } from 'react';
import { makeRequest } from './apis/Api';
import './App.css';
import ChatMessage from './components/ChatMessage/ChatMessage';
import SideMenu from './components/SideMenu/Sidemenu';
import './css/reset.css';

function Server() {
    const [input, setInput] = useState("");
    const [chatLog, setChatLog] = useState([{
        user: "gpt",
        message: "Question?"
    }]);

    async function handleSubmit(e) {
        e.preventDefault();
        const user_id = localStorage?.getItem("user_id");

        let response = await makeRequest({ prompt: input, user_id: user_id });
        response = response.data.split('\n').map((line, index) => <p key={index}>{line}</p>);

        setChatLog([...chatLog, {
            user: 'me',
            message: `${input}`
        }, {
            user: 'gpt',
            message: response
        }]);
        setInput("");
    }

    return (
        <div className='App'>
            <SideMenu />
            <section className='chatbox'>
                <div className='chat-log'>
                    {chatLog.map((message, index) => (
                        <ChatMessage key={index} message={message} />
                    ))}
                </div>
                <div className='chat-input-holder'>
                    <form onSubmit={handleSubmit}>
                        <textarea
                            type='text'
                            className='chat-input-textarea'
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Ask me anything..."
                            rows={3}
                        />
                        <button type='submit' className='send-button'>
                            Send
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
}

export default Server;
