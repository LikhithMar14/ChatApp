"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const RoomChat = () => {
  const [message, setMessage] = useState<string>(""); // For the current input message
  const [messages, setMessages] = useState<string[]>([]); // For storing all chat messages
  const wsRef = useRef<WebSocket | null>(null); // WebSocket reference
  const params = useParams();
  const roomId = params.roomId;

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080"); // Use ws:// for WebSocket connections

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId,
          },
        })
      );

      wsRef.current = ws;
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "chat") {
        setMessages((prevMessages) => [...prevMessages, data.payload.message]);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close(); // Clean up WebSocket connection on component unmount
    };
  }, [roomId]);

  const sendMessage = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && message.trim() !== "") {
      wsRef.current.send(
        JSON.stringify({
          type: "chat",
          payload: {
            message,
            roomId,
          },
        })
      );
      setMessage(""); // Clear input after sending
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to Room {roomId}</h1>

      {/* Chat Messages */}
      <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-4 mb-4 overflow-y-auto h-80">
        {messages.length === 0 ? (
          <p className="text-gray-500">No messages yet. Start the conversation!</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className="p-2 bg-gray-200 rounded-md mb-2"
            >
              {msg}
            </div>
          ))
        )}
      </div>

      {/* Input and Send Button */}
      <div className="w-full max-w-lg flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded-md"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default RoomChat;
