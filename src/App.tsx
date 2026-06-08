import React from 'react';
import Sidebar from './components/Sidebar';
import Scene from './components/Scene';

export default function App() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 font-sans">
      <Sidebar />
      <Scene />
    </div>
  );
}
