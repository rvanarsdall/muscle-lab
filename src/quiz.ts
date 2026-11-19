export const normalize=(s:string)=>s.normalize('NFKD').toLowerCase().replace(/[^a-z]/g,'');
export function isCorrect(answer:string,name:string){return normalize(answer)===normalize(name);}
export function shuffle<T>(items:T[]):T[]{const result=[...items];for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;}
export type Progress=Record<string,{seen:number;correct:number;lastSeen:number}>;
export function loadProgress():Progress{try{const raw=JSON.parse(localStorage.getItem('muscle-lab-progress-v1')||'{}');if(!raw||Array.isArray(raw)||typeof raw!=='object')return {};return Object.fromEntries(Object.entries(raw).filter(([,v])=>{const x=v as Progress[string];return x&&Number.isFinite(x.seen)&&Number.isFinite(x.correct)&&Number.isFinite(x.lastSeen)&&x.seen>=x.correct&&x.correct>=0;})) as Progress;}catch{return {};}}
export function recordAnswer(progress:Progress,id:string,correct:boolean):Progress{const p=progress[id]??{seen:0,correct:0,lastSeen:0};return {...progress,[id]:{seen:p.seen+1,correct:p.correct+Number(correct),lastSeen:Date.now()}};}
export function shuffleFresh<T>(items:T[],previous:T[]=items):T[]{const result=shuffle(items);if(result.length>1&&result.every((item,i)=>item===previous[i]))result.push(result.shift()!);return result;}
