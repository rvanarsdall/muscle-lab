import {readFileSync,writeFileSync,existsSync,mkdirSync} from 'node:fs';
import {homedir} from 'node:os';
import {muscles,introScript} from '../src/content.ts';
const config=JSON.parse(readFileSync(`${homedir()}/.config/codezone-media/elevenlabs.json`,'utf8'));
const status=JSON.parse(readFileSync(`${homedir()}/.config/codezone-media/elevenlabs-status.json`,'utf8'));
const voice=status.voices.find(v=>v.name==='Rob Clone');
if(!voice)throw Error('Configured voice not found');
mkdirSync(new URL('../public/audio/',import.meta.url),{recursive:true});
mkdirSync(new URL('../src/timing/',import.meta.url),{recursive:true});
const clips=[{id:'intro',script:introScript},...muscles];
const only=process.argv.find(arg=>arg.startsWith('--clip='))?.slice(7);
if(only&&!clips.some(clip=>clip.id===only))throw Error('Unknown clip');
for(const clip of clips.filter(clip=>!only||clip.id===only)){
 const file=new URL(`../public/audio/${clip.id}.mp3`,import.meta.url);
 if(existsSync(file)&&!process.argv.includes('--force')){console.log(`${clip.id}: exists`);continue;}
 const response=await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice.voice_id}/with-timestamps`,{method:'POST',headers:{'xi-api-key':config.api_key,'Content-Type':'application/json'},body:JSON.stringify({text:clip.script,model_id:'eleven_v3',voice_settings:{stability:0.5,similarity_boost:0.78,speed:clip.id==='intro'?1.15:1.12}})});
 if(!response.ok)throw Error(`Audio generation failed: ${response.status} ${await response.text()}`);
 const data=await response.json();
 writeFileSync(file,Buffer.from(data.audio_base64,'base64'));
 writeFileSync(new URL(`../src/timing/${clip.id}.json`,import.meta.url),JSON.stringify(data.normalized_alignment??data.alignment));
 console.log(`${clip.id}: generated with timing`);
}
