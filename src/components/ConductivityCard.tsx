// components/ConductivityCard.tsx
import React from "react";

interface ConductivityCardProps {
   conductivity?: number;
}

// Thresholds for evaluating conductivity status
const CONDUCTIVITY_THRESHOLDS = {
   ideal: { max: 300 },
   good: { max: 600 },
   acceptable: { max: 900 },
   warning: { max: 1200 },
   danger: { max: 1400 },
};

const ConductivityCard: React.FC<ConductivityCardProps> = ({ conductivity }) => {
   // Evaluate status based on conductivity value
   const evaluateConductivity = (value: number) => {
      if (value <= CONDUCTIVITY_THRESHOLDS.ideal.max) {
         return {
            status: "Excelente - Agua muy pura",
            class: "alert-success",
         };
      } else if (value <= CONDUCTIVITY_THRESHOLDS.good.max) {
         return {
            status: "Buena calidad - Rango normal",
            class: "alert-success",
         };
      } else if (value <= CONDUCTIVITY_THRESHOLDS.acceptable.max) {
         return {
            status: "Aceptable - Monitorear",
            class: "alert-info",
         };
      } else if (value <= CONDUCTIVITY_THRESHOLDS.warning.max) {
         return {
            status: "Advertencia: Conductividad elevada",
            class: "alert-warning",
         };
      } else {
         return {
            status: "PELIGRO: Conductividad muy alta",
            class: "alert-danger",
         };
      }
   };

   // Get status if conductivity value exists
   const status =
      conductivity !== undefined ? evaluateConductivity(conductivity) : { status: "Sin datos", class: "alert-info" };

   return (
      <div className="reading-card">
         <div className="reading-label">Conductividad</div>
         <div id="conductivity" className="reading-value">
            {conductivity !== undefined ? conductivity.toFixed(0) : "--"}
         </div>
         <div className="reading-label">μS/cm</div>
         <div id="conductivityStatus" className={`sensor-status ${status.class}`}>
            {status.status}
         </div>
      </div>
   );
};

export default ConductivityCard;
