import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

export type SensorData = {
   C?: number;
   PH?: number;
   T?: number;
   [key: string]: any;
};

export interface SocketState {
   isConnected: boolean;
   lastUpdate: string;
   data: SensorData | null;
}

export function useSocket(): SocketState {
   const [isConnected, setIsConnected] = useState(false);
   const [lastUpdate, setLastUpdate] = useState("Esperando datos...");
   const [data, setData] = useState<SensorData | null>(null);
   const socket = useRef<Socket | null>(null);

   useEffect(() => {
      // Function to get socket.io connection
      const connectSocket = async () => {
         // Only create a socket connection on the client
         const socketInitializer = async () => {
            // Make sure we're only creating one socket instance
            if (!socket.current) {
               // Connect to the socket server
               const socketConnection = io();
               socket.current = socketConnection;

               // Register as a subscriber
               socketConnection.emit("register", "subscriber");

               // Setup event handlers
               socketConnection.on("connect", () => {
                  console.log("WebSocket Connected");
                  setIsConnected(true);
               });

               socketConnection.on("disconnect", () => {
                  console.log("WebSocket Disconnected");
                  setIsConnected(false);
               });

               socketConnection.on("connect_error", (err) => {
                  console.log("WebSocket Connection Error:", err);
                  setIsConnected(false);
               });

               socketConnection.on("sensor-data", (newData: SensorData) => {
                  console.log("Received sensor data:", newData);
                  setData(newData);
                  setLastUpdate(`Última actualización: ${new Date().toLocaleTimeString()}`);
               });
            }
         };

         await socketInitializer();
      };

      connectSocket();

      // Cleanup function to close the socket when component unmounts
      return () => {
         if (socket.current) {
            socket.current.disconnect();
            socket.current = null;
         }
      };
   }, []);

   return { isConnected, lastUpdate, data };
}
