import React, { useEffect, useState } from "react";
import "../styles/App.css";

const App = function () {
    const [contentModal, setContentModal] = useState(null);

    useEffect(() => {
        /**
         * Send information from parent window to child iframe
         */
        const button = document.querySelector("#sendMessage");
        const messageArea = document.querySelector("#messageArea");

        const sendMessage = () => {
            const message = document.querySelector("#message").value;
            const iframe = document.querySelector("iframe");
            iframe.contentWindow.postMessage({ type: "function", params: message }, "*");
        };

        /**
         * Send information from child to parent.
         */
        const onMessageHandler = (event) => {
            if (event?.data?.type === "dialog") {
                setContentModal(event?.data?.content);
            }
            messageArea.innerText = typeof event.data === "string" ? event.data : JSON.stringify(event.data);
        };

        button && button.addEventListener("click", sendMessage);
        window.addEventListener("message", onMessageHandler);

        return () => {
            button.removeEventListener("click", sendMessage);
            window.removeEventListener("message", onMessageHandler);
        };
    }, []);

    const oncloseModal = () => {
        setContentModal("");
    };

    return (
        <div className="App">
            <div id="app">
                <input id="message" type="text" placeholder="Send params to call api in iframe" />
                <button id="sendMessage">Send Message &rarr;</button>
                <h3>Messages Sent by the Child will be visible here:</h3>
                <div className="code">
                    <code id="messageArea">No message received from child yet.</code>
                </div>
            </div>
            <h2>Iframe:</h2>
            <iframe
                style={{ marginTop: "1em", width: "100%", height: 600, border: "solid 1px #ccc", borderRadius: 4, overflow: "hidden" }}
                title="Child iframe"
                src="http://192.168.0.95:3000/"
            />
            {contentModal && (
                <dialog className="bgModal">
                    <div className="content">
                        <div className="close" onClick={oncloseModal}>
                            <img src="close.svg" alt="" className="icon" />
                        </div>
                        <div dangerouslySetInnerHTML={{ __html: contentModal }} />
                    </div>
                </dialog>
            )}
        </div>
    );
};

export default App;
