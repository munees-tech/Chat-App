import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast";
import {io} from "socket.io-client"

const BASEURL = import.meta.env.MODE === "development" ? "http://localhost:5000/" : "/"

export const useAuthStore = create((set,get) => ({
    authUser: null, 
    isSigningUp: false,
    isLoggingIng: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers:[],
    socket:null,

    chackAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/chack");
            set({ authUser: res.data });
            get().connectSocket();
        } catch (error) {
            set({ authUser: null });
            console.log(`Error in chackAuth: ${error.response?.data?.message || error.message}`);
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signUp: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Account created successfully");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
            console.log(`Error in signup: ${error.response?.data?.message || error.message}`);
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIng: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Login successful");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            set({ isLoggingIng: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logout successfully");
            get().disconnectSocket()
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data });
        } catch (error) {
            console.log(`Error in updateProfile: ${error.response?.data?.message || error.message}`);
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket:()=>{
        const {authUser} = get()
        if(!authUser||get().socket?.connected) return
        const socket = io(BASEURL,{
            query : {
                userId:authUser._id
            }
        })
        socket.connect()
        set({socket:socket})

        socket.on("getOnlineUsers",(userId)=>{
            set({onlineUsers:userId})
        })
    },

    disconnectSocket:()=>{
        if(get().socket?.connected) get().socket.disconnect()
    }
}));