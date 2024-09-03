import React, { useState, useEffect, useRef } from "react";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import db from "../../../Firebase/firebase";
import noMassage from "../../../assets/Images/No_Message.png";

const Chat = ({ userId, recipientId, sessionId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      where("sessionId", "==", sessionId)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push(doc.data());
      });
      msgs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      setMessages(msgs);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [sessionId]);

  const sendMessage = async () => {
    if (newMessage.trim() === "") return;

    await addDoc(collection(db, "messages"), {
      text: newMessage,
      users: [userId, recipientId],
      sender: userId,
      timestamp: Date.now(),
      sessionId: sessionId,
    });

    setNewMessage("");
    scrollToBottom();
  };

  useEffect(() => {
    if (messages.length > 0) {
      setIsDropdownOpen(true);
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className=" w-full flex h-full border-2 shadow-sm rounded-3xl relative">
      <div className="w-full ">
        <div className="p-4 w-full">
          <div className="mb-4 max-h-[60vh]  md:px-10  overflow-y-auto">
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 ${
                    msg.sender === userId
                      ? "flex w-full items-end justify-end"
                      : "flex w-full"
                  }`}
                  ref={index === messages.length - 1 ? messagesEndRef : null}
                >
                  <p
                    className={`p-2 ${
                      msg.sender === userId
                        ? "flex w-fit border rounded-3xl px-4 items-end justify-end"
                        : "bg-gray-200 flex w-fit border rounded-3xl px-4"
                    }`}
                  >
                    {msg.text}
                  </p>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center">
                <img className="w-[100px]" src={noMassage} alt="" />
                <p className="text-gray-400 text-[13px] font-semibold ">
                  Currently, there are no messages.
                </p>
                <p
                  onClick={toggleDropdown}
                  className={` text-[13px] font-semibold text-lightblueButton hover:scale-105 ${
                    isDropdownOpen ? "hidden" : "flex"
                  }`}
                >
                  Start message
                </p>
              </div>
            )}

            {/* <div ref={messagesEndRef} /> */}
          </div>

          <div className="w-full absolute bottom-5 flex items-end justify-end">
            {isDropdownOpen && (
              <div className="flex w-full items-center justify-center gap-5 px-10">
                <input
                  type="text"
                  placeholder="Type a message"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="border-2  px-5 py-3 rounded-full w-full"
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-500 text-white border px-8 py-3 rounded-full hover:scale-105"
                >
                  Send
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
