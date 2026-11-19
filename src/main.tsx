import React from 'react';
import {createRoot} from 'react-dom/client';
import {HashRouter,Navigate,Route,Routes} from 'react-router-dom';
import {App} from './App';
import './style.css';
createRoot(document.getElementById('root')!).render(<React.StrictMode><HashRouter><Routes><Route path="/" element={<App/>}><Route index element={<Navigate to="/groups" replace/>}/><Route path="groups" element={null}/><Route path="review" element={null}/><Route path="group/:groupId/learn/:muscleId?" element={null}/><Route path="group/:groupId/watch" element={null}/><Route path="group/:groupId/challenge" element={null}/><Route path="learn/:muscleId?" element={null}/><Route path="watch" element={null}/><Route path="challenge" element={null}/><Route path="*" element={<Navigate to="/groups" replace/>}/></Route></Routes></HashRouter></React.StrictMode>);
