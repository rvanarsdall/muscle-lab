import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {muscles} from './content.ts';
const read=(p:string)=>JSON.parse(readFileSync(new URL(p,import.meta.url),'utf8'));
const extra=read('./data/curriculum.json');const groups=read('./data/groups.json');const timing=read('./tour-timing.json');
test('every curriculum target belongs to one small group and has a complete source lesson',()=>{
 const all=[...muscles,...extra];const ids=all.map(m=>m.id);assert.equal(new Set(ids).size,116);assert.equal(ids.length,116);
 const grouped=groups.flatMap((g:{ids:string[]})=>g.ids);assert.deepEqual([...grouped].sort(),[...ids].sort());
 for(const g of groups){assert.ok(g.ids.length>=3&&g.ids.length<=6);assert.ok([8,9,10].includes(g.week));assert.ok(g.video.endsWith('.html'));}
 for(const m of extra){for(const field of ['location','shape','action','decode','hook','contrast','script','sourcePage'])assert.ok(m[field],`${m.id}: ${field}`);assert.ok(m.width>0&&m.height>0);assert.ok(m.pin.every((n:number)=>n>0&&n<100));if(m.image.startsWith('course/'))assert.ok(existsSync(new URL('../public/'+m.image,import.meta.url)));}
});
test('every tour has audio and synchronized captions with ordered teaching phases',()=>{
 const ids=['intro',...muscles.map(m=>m.id),...extra.map((m:{id:string})=>m.id),...groups.filter((g:{id:string})=>g.id!=='anterior-thigh').map((g:{id:string})=>'intro-'+g.id)];
 for(const id of ids){assert.ok(existsSync(new URL('../public/audio/'+id+'.mp3',import.meta.url)),id);const t=timing[id];assert.ok(t.duration>5&&t.duration<90,id);assert.ok(t.captions.length>0,id);for(const c of t.captions){assert.ok(c.start>=0&&c.end>=c.start&&c.end<=t.duration+.5,`${id}: caption timing`);}if(!id.startsWith('intro'))assert.ok(t.shape<t.action&&t.action<t.meaning&&t.meaning<t.memory,`${id}: phases`);}
});

test('the published Exam 3 checklist is covered, including named parts and old spelling variants',async()=>{
 const {gradeSpelling}=await import('./quiz.ts');
 const checklist=read('../scripts/source/exam3-checklist-terms.json');
 const collective=['Rotator Cuff','Hamstrings','Qudriceps Femoris'];
 const all=[...muscles,...extra];
 for(const name of checklist){if(collective.includes(name))continue;assert.ok(all.some(target=>gradeSpelling(name,target).correct),name);}
});
