export const normalize=(s:string)=>s.normalize('NFKD').toLowerCase().replace(/[^a-z]/g,'');
export function isCorrect(answer:string,name:string){return normalize(answer)===normalize(name);}
export function shuffle<T>(items:T[]):T[]{const result=[...items];for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;}
export type Progress=Record<string,{seen:number;correct:number;lastSeen:number}>;
export function loadProgress(key='muscle-lab-progress-v1'):Progress{try{const raw=JSON.parse(localStorage.getItem(key)||'{}');if(!raw||Array.isArray(raw)||typeof raw!=='object')return {};return Object.fromEntries(Object.entries(raw).filter(([,v])=>{const x=v as Progress[string];return x&&Number.isFinite(x.seen)&&Number.isFinite(x.correct)&&Number.isFinite(x.lastSeen)&&x.seen>=x.correct&&x.correct>=0;})) as Progress;}catch{return {};}}
export function recordAnswer(progress:Progress,id:string,correct:boolean):Progress{const p=progress[id]??{seen:0,correct:0,lastSeen:0};return {...progress,[id]:{seen:p.seen+1,correct:p.correct+Number(correct),lastSeen:Date.now()}};}
export function shuffleFresh<T>(items:T[],previous:T[]=items):T[]{const result=shuffle(items);if(result.length>1&&result.every((item,i)=>item===previous[i]))result.push(result.shift()!);return result;}

// Levenshtein distance: each inserted, deleted, or substituted letter costs one.
export function letterDistance(a:string,b:string):number{
 const left=normalize(a),right=normalize(b);let previous=Array.from({length:right.length+1},(_,i)=>i);
 for(let i=1;i<=left.length;i++){const row=[i];for(let j=1;j<=right.length;j++)row[j]=Math.min(row[j-1]+1,previous[j]+1,previous[j-1]+Number(left[i-1]!==right[j-1]));previous=row;}
 return previous[right.length];
}
export function gradeSpelling(answer:string,target:{name:string;aliases?:string[]},others:{name:string;aliases?:string[]}[]=[]){
 const normalized=normalize(answer);const accepted=[target.name,...target.aliases??[]];const edits=Math.min(...accepted.map(name=>letterDistance(answer,name)));
 const wrongName=others.some(other=>!accepted.some(n=>normalize(n)===normalize(other.name))&&[other.name,...other.aliases??[]].some(n=>normalize(n)===normalized));
 return {correct:!!normalized&&!wrongName&&edits<=2,edits,exact:edits===0,wrongName};
}
