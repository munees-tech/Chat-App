import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useStoreAuth.js"

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isMessagesLoading: false,

  // Fetch users
  getUsers: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosInstance.get("/message/users");
      set({ users: res.data });
    } catch (error) {
      toast.error("Failed to fetch users");
      console.error("Error in getUsers:", error.response?.data?.message || error.message);
    } finally {
      set({ isUserLoading: false });
    }
  },

  // Fetch messages
  getMessage: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      console.log(res)
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch messages");
      console.error("Error in getMessage:", error.response?.data?.message || error.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // Send a message
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
      set({
        messages: [...messages, res.data]
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
      console.error("Error in sendMessage:", error.response?.data?.message || error.message);
    }
  },

  subscribedToMessage: () => {

    const { selectedUser } = get();
    if (!selectedUser) return;
    const socket = useAuthStore.getState().socket;
    if (!socket || !socket.connected) return;
    
    socket.on("newMessage", (newMessage) => {
      if (newMessage.senderId !== selectedUser._id) return;
      set((state) => ({
        messages: [...state.messages, newMessage],
      }));
    });

  },

  unSubscribedMessage: () => {
    const socket = useAuthStore.getState().socket
    socket.off("newMessage")
  },

  // Set selected user
  setSelectedUser: (selectedUser) => set({ selectedUser }),
}))