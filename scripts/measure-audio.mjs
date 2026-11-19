import {readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {muscles} from '../src/content.ts';
const extras=JSON.parse(readFileSync(new URL('../src/data/curriculum.json',import.meta.url)));
const groups=JSON.parse(readFileSync(new URL('../src/data/groups.json',import.meta.url)));
const extraIds=extras.map(m=>m.id);
const introIds=groups.filter(g=>g.id!=='anterior-thigh').map(g=>'intro-'+g.id);
const ids=['intro',...muscles.map(m=>m.id),...extraIds,...introIds];
const shapes={rectus:'To identify',lateralis:'Look for',medialis:'Its easiest',intermedius:'To identify',sartorius:'Follow its',gracilis:'To identify'};
const metadata={};const durations={};
for(const id of ids){
 const duration=Number(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','csv=p=0',new URL(`../public/audio/${id}.mp3`,import.meta.url).pathname],{encoding:'utf8'}));durations[id]=duration;
 const alignment=JSON.parse(readFileSync(new URL(`../src/timing/${id}.json`,import.meta.url),'utf8'));
 const text=alignment.characters.join('');
 const when=(phrase,fallback)=>{const at=text.toLowerCase().indexOf(phrase.toLowerCase());return at<0?fallback:alignment.character_start_times_seconds[at];};
 const tokens=[...text.matchAll(/\[[^\]]*\]|\S+/g)].filter(m=>!m[0].startsWith('['));
 const captions=[];let words=[];
 for(const token of tokens){words.push(token);if(words.length>=8||/[.!?][”"]?$/.test(token[0])){const first=words[0];const last=words.at(-1);captions.push({text:words.map(w=>w[0]).join(' '),start:alignment.character_start_times_seconds[first.index],end:alignment.character_end_times_seconds[last.index+last[0].length-1]});words=[];}}
 if(words.length){const first=words[0];const last=words.at(-1);captions.push({text:words.map(w=>w[0]).join(' '),start:alignment.character_start_times_seconds[first.index],end:alignment.character_end_times_seconds[last.index+last[0].length-1]});}
 metadata[id]={duration,shape:when(shapes[id]??(extraIds.includes(id)?'To identify':'Watch the'),duration*.25),action:extraIds.includes(id)?when(extras.find(m=>m.id===id).action.replace(/^[A-Z]/,c=>c.toLowerCase()),duration*.45):when('It helps',duration*.45),meaning:extraIds.includes(id)?when(extras.find(m=>m.id===id).roots[0][0]+' means',duration*.7):Math.min(when('“Rectus”',999),when('“Vastus”',999),when('“Gracilis”',999),when('Its name',999),duration*.8),memory:when('Your memory cue',duration*.85),captions};
}
writeFileSync(new URL('../src/audio-durations.json',import.meta.url),JSON.stringify(durations,null,2));
writeFileSync(new URL('../src/tour-timing.json',import.meta.url),JSON.stringify(metadata,null,2));
console.log(durations);
