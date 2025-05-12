import React from "react";

interface ConnectionStatusProps {
   isConnected: boolean;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ isConnected }) => {
   return (
      <div id="connection" className={`status ${isConnected ? "connected" : "disconnected"}`}>
         {isConnected ? "Conectado" : "Desconectado"}
      </div>
   );
};

export default ConnectionStatus;
