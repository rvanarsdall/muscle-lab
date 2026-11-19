import React from 'react';
import {createRoot} from 'react-dom/client';
import {HashRouter,Navigate,Route,Routes} from 'react-router-dom';
import {App} from './App';
import './style.css';
createRoot(document.getElementById('root')!).render(<React.StrictMode><HashRouter><Routes><Route path="/" element={<App/>}><Route index element={<Navigate to="/learn" replace/>}/><Route path="learn/:muscleId?" element={null}/><Route path="watch" element={null}/><Route path="challenge" element={null}/><Route path="*" element={<Navigate to="/learn" replace/>}/></Route></Routes></HashRouter></React.StrictMode>);
