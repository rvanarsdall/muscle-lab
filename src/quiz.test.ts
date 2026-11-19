import {test} from 'node:test';
import assert from 'node:assert/strict';
import {isCorrect,shuffle,recordAnswer} from './quiz.ts';
test('answers tolerate formatting but preserve anatomical distinctions',()=>{assert.ok(isCorrect(' Rectus  Femoris ','Rectus femoris'));assert.equal(isCorrect('vastus medialis','Vastus lateralis'),false);assert.equal(isCorrect('rectus','Rectus femoris'),false);assert.equal(isCorrect('','Sartorius'),false);assert.equal(isCorrect('sartoris','Sartorius'),false);});
test('a round retains every station without mutating the source',()=>{const src=['a','b','c','d','e','f'];for(let i=0;i<20;i++){const round=shuffle(src);assert.deepEqual([...round].sort(),src);assert.notEqual(round,src);}assert.deepEqual(src,['a','b','c','d','e','f']);});
test('misses count as attempts and never inflate correct recalls',()=>{const initial={};const missed=recordAnswer(initial,'a',false);const retried=recordAnswer(missed,'a',true);assert.deepEqual(initial,{});assert.equal(retried.a.seen,2);assert.equal(retried.a.correct,1);});
test('shuffleFresh changes order while retaining every muscle, including small review sets',async()=>{const {shuffleFresh}=await import('./quiz.ts');const source=['a','b','c','d','e','f'];for(let i=0;i<30;i++){const result=shuffleFresh(source,source);assert.notDeepEqual(result,source);assert.deepEqual([...result].sort(),source);}assert.deepEqual(shuffleFresh(['a']),['a']);assert.deepEqual(shuffleFresh([]),[]);});

test('spelling accepts two letter edits and rejects three, blanks and another exact name',async()=>{
 const {gradeSpelling,letterDistance}=await import('./quiz.ts');
 assert.equal(letterDistance('sartoris','Sartorius'),1);
 assert.equal(letterDistance('satroius','Sartorius'),3);
 const target={name:'Rectus femoris'};
 assert.equal(gradeSpelling('RECTUS  FEMORIS',target).exact,true);
 assert.equal(gradeSpelling('rectus femors',target).correct,true);
 assert.equal(gradeSpelling('rects femors',target).correct,true);
 assert.equal(gradeSpelling('rect femors',target).correct,false);
 assert.equal(gradeSpelling('',{name:'Soleus'}).correct,false);
 const other={name:'Zygomaticus minor'};
 assert.equal(gradeSpelling(other.name,{name:'Zygomaticus major'},[other]).correct,false);
 assert.equal(gradeSpelling('Achilles tendon',{name:'Tendo calcaneus',aliases:['Achilles tendon']}).exact,true);
 assert.equal(gradeSpelling('rectus',target).correct,false);
});
