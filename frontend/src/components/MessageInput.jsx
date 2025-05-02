import React, { useRef, useState } from "react";
import { Send, Image, X } from "lucide-react"; // Import the X icon
import { toast } from "react-hot-toast";
import { useChatStore } from "../store/useChatStore.js";

const MessageInput = () => {
  const [text, setText] = useState(""); // Correct usage of useState
  const [imagePreview, setImagePreview] = useState(null); // Correct usage of useState
  const fileInputRef = useRef(null); // Correct usage of useRef
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image");
      return; // Stop execution if the file is not an image
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result); // Set the image preview
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = ""; // Reset the file input
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return; // Prevent sending empty messages

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });
      setText(""); // Clear the text input
      setImagePreview(null); // Clear the image preview
      if (fileInputRef.current) fileInputRef.current.value = ""; // Reset the file input
    } catch (error) {
      console.error(`Error in Send Message: ${error.message}`);
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="p-4 w-full">
      {/* Image Preview */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      {/* Message Input Form */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          {/* Text Input */}
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          {/* File Input */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          {/* Image Upload Button */}
          <button
            type="button"
            className={`sm:flex btn btn-circle ${
              imagePreview ? "text-emerald-500" : "text-zinc-400"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>

        {/* Send Button */}
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;