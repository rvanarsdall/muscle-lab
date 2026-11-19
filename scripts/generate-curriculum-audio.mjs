import {readFileSync,writeFileSync,existsSync,mkdirSync} from 'node:fs';
import {homedir} from 'node:os';
const root=new URL('../',import.meta.url);
const items=JSON.parse(readFileSync(new URL('src/data/curriculum.json',root)));
const groups=JSON.parse(readFileSync(new URL('src/data/groups.json',root)));
const config=JSON.parse(readFileSync(`${homedir()}/.config/codezone-media/elevenlabs.json`));
const status=JSON.parse(readFileSync(`${homedir()}/.config/codezone-media/elevenlabs-status.json`));
const voice=status.voices.find(v=>v.name==='Rob Clone');if(!voice)throw Error('Voice unavailable');
const clips=[...items,...groups.filter(g=>g.id!=='anterior-thigh').map(g=>({id:`intro-${g.id}`,script:`[excited] Let's explore ${g.title.replace('·','—')}! ${g.summary} [upbeat] Watch the focus marker, follow the shape, and connect each name to its location and action. [confident] One small group. One more step toward knowing your way around the lab.`}))];
const only=process.argv.find(a=>a.startsWith('--clip='))?.slice(7);
mkdirSync(new URL('public/audio',root),{recursive:true});mkdirSync(new URL('src/timing',root),{recursive:true});
let cursor=0;let errors=0;
async function worker(){while(cursor<clips.length){const clip=clips[cursor++];if(only&&clip.id!==only)continue;const file=new URL(`public/audio/${clip.id}.mp3`,root);if(existsSync(file)&&existsSync(new URL(`src/timing/${clip.id}.json`,root))&&!process.argv.includes('--force'))continue;let success=false;
 for(let attempt=0;attempt<3&&!success;attempt++){try{const r=await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice.voice_id}/with-timestamps`,{method:'POST',headers:{'xi-api-key':config.api_key,'Content-Type':'application/json'},body:JSON.stringify({text:clip.script,model_id:'eleven_v3',voice_settings:{stability:.5,similarity_boost:.78,speed:1.12}})});if(!r.ok)throw Error(`HTTP ${r.status}: ${(await r.text()).slice(0,200)}`);const d=await r.json();writeFileSync(file,Buffer.from(d.audio_base64,'base64'));writeFileSync(new URL(`src/timing/${clip.id}.json`,root),JSON.stringify(d.normalized_alignment??d.alignment));console.log(`${clip.id}: generated`);success=true;}catch(e){console.log(`${clip.id}: attempt ${attempt+1}: ${e.message}`);if(attempt<2)await new Promise(r=>setTimeout(r,3000));}}
 if(!success)errors++;
}}
await Promise.all([worker(),worker(),worker()]);if(errors)throw Error(`${errors} clips failed`);
