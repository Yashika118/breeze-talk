import {create} from "zustand";
import { axiosInstance } from "../lib/axios";
import { LucideToyBrick } from "lucide-react";
import toast from "react-hot-toast";
import {io} from "socket.io-client";

const BASE_URL="http://localhost:5001";         // backend url

export const useAuthStore=create((set,get)=>({
    authUser:null,
    isSigningUp:false,      // loading state
    isLoggingIn:false,      // loading state
    isUpdatingProfile:false,    // loading state
    isCheckingAuth:true,
    onlineUsers:[],
    socket:null,            // for real time

    checkAuth:async()=>{
        try {
            const res=await axiosInstance.get("/auth/check");
            set({authUser:res.data});

             // for real time --->
             get().connectSocket();
             // -->

        } catch (error) {
            console.log("Error in checkAuth: ",error)
            set({authUser:null});

        }finally{
            set({isCheckingAuth:false});
        }
    },

    signup:async(data)=>{
        set({isSigningUp:true});
        try {
            const res=await axiosInstance.post("/auth/signup",data);
            set({authUser:res.data});
            toast.success("Account created successfully");

             // for real time --->
             get().connectSocket();
             // -->
            
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isSigningUp:false}); 
        }
    },

    login:async(data)=>{
        set({isLoggingIn:true});
        try {
            // alert("test");
            const res=await axiosInstance.post("/auth/login",data);
            set({authUser:res.data});
            toast.success("Logged in successfully");

            // for real time --->
            get().connectSocket();
            // -->

        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isLoggingIn:false});
        }
    },

    logout:async()=>{
        try {
           await axiosInstance.post("/auth/logout");
           set({authUser:null});
           toast.success("Logged out successfully"); 

        //    for real time-->
        get().disconnectSocket();
        // --->

        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    updateProfile:async(data)=>{
        set({isUpdatingProfile:true});
        try {
            const res=await axiosInstance.put("/auth/update-profile",data);
            set({authUser:res.data});
            toast.success("Profile updated succcessfully");
        } catch (error) {
            console.log("error in profile update");
            toast.error(error.response.data.message)
            
        }finally{
            set({isUpdatingProfile:false});
        }
    },

    connectSocket:()=>{
        const {authUser}=get()
        // if user is not authenticated or socket is already connected then
        if(!authUser || get().socket?.connected) return;
        const socket=io(BASE_URL,{
            query:{
                userId:authUser._id,
            },
        });
        socket.connect();

        set({socket:socket});

        // listening for online users
        socket.on("getOnlineUsers", (userIds)=>{
            set({onlineUsers:userIds })
        })
    },
    disconnectSocket:()=>{
        if(get().socket?.connected) get().socket.disconnect();
    }

}))