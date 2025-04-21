import React, { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skelitons/MessageSkeliton";
import { useAuthStore } from "../store/useStoreAuth";
import { formatMessageTime } from "../lib/utils.js";

const ChatContainer = () => {
  const {
    messages,
    getMessage,
    isMessagesLoading,
    selectedUser,
    subscribedToMessage,
    unSubscribedMessage,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessage(selectedUser._id);
      subscribedToMessage();
      return () => unSubscribedMessage();
    }
  }, [selectedUser?._id, getMessage, subscribedToMessage, unSubscribedMessage]);

  useEffect(() => {
    if (messageEndRef.current && messages)
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-4">
        {messages.map((message) => {
          const isSentByAuthUser = message.senderId === authUser?._id;

          return (
            <div
              key={message._id}
              className={`chat ${isSentByAuthUser ? "chat-end" : "chat-start"}`}
              ref={messageEndRef}
            >
              {/* Avatar */}
              <div className="chat-image avatar">
                <div className="size-8 sm:size-10 rounded-full border">
                  <img
                    src={
                      isSentByAuthUser
                        ? authUser.profilePic || "avatar-placeholder.png"
                        : selectedUser?.profilePic || "avatar-placeholder.png"
                    }
                    alt="profile pic"
                  />
                </div>
              </div>

              {/* Header */}
              <div className="chat-header mb-1">
                <time className="text-xs text-zinc-400 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>

              {/* Message Bubble */}
              <div className="chat-bubble flex flex-col max-w-xs sm:max-w-md break-words">
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="max-w-full rounded-md mb-2"
                  />
                )}
                {message.text && <p>{message.text}</p>}
              </div>
            </div>
          );
        })}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
