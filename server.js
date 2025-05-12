// Custom server with Socket.io integration
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

// Sensor data storage
let latestData = { C: 0 };
const subscribers = new Set();
let publisher = null;

app.prepare().then(() => {
   const server = createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
   });

   // Initialize Socket.io
   const io = new Server(server);

   io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);

      // Check if connection is from publisher (Arduino)
      socket.on("register", (type) => {
         if (type === "publisher") {
            // If we already have a publisher, disconnect old one
            if (publisher) {
               console.log("Disconnecting previous publisher");
               io.to(publisher).emit("disconnect-publisher");
            }
            publisher = socket.id;
            console.log("Publisher registered:", socket.id);
         } else {
            subscribers.add(socket.id);
            console.log(`Subscriber registered: ${socket.id}, total: ${subscribers.size}`);

            // Send latest data to new subscriber
            if (latestData.C) {
               socket.emit("sensor-data", latestData);
            }
         }
      });

      // Handle sensor data from publisher
      socket.on("sensor-data", (data) => {
         console.log("Received sensor data:", data);

         // Only accept data from registered publisher
         if (socket.id === publisher && data && data.C !== undefined) {
            latestData = data;

            // Broadcast to all subscribers
            subscribers.forEach((id) => {
               io.to(id).emit("sensor-data", data);
            });
         }
      });

      // Handle disconnection
      socket.on("disconnect", () => {
         console.log("Client disconnected:", socket.id);

         if (socket.id === publisher) {
            publisher = null;
            console.log("Publisher disconnected");
         } else if (subscribers.has(socket.id)) {
            subscribers.delete(socket.id);
            console.log(`Subscriber disconnected, remaining: ${subscribers.size}`);
         }
      });
   });

   server.listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
   });
});
