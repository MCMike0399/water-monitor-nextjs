"use client";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useSocket } from "../utils/socketClient";
import ConnectionStatus from "../components/ConnectionStatus";
import ConductivityCard from "../components/ConductivityCard";

// Import Plotly component with no SSR
const ConductivityChart = dynamic(() => import("../components/ConductivityChart"), { ssr: false });

export default function Home() {
   const { isConnected, lastUpdate, data } = useSocket();

   return (
      <div className="container">
         <Head>
            <title>Monitor de Conductividad del Agua</title>
            <meta name="description" content="Monitor de calidad de agua en tiempo real" />
            <link rel="icon" href="/favicon.ico" />
         </Head>

         <h1>Monitor de Conductividad del Agua</h1>

         <div className="panel">
            <ConnectionStatus isConnected={isConnected} />
            <div id="lastUpdate">{lastUpdate}</div>
         </div>

         <ConductivityCard conductivity={data?.C} />

         <ConductivityChart data={data} />
      </div>
   );
}
