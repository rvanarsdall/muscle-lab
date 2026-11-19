import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {homedir} from 'node:os';
import {muscles,introScript} from '../src/content.ts';
const config=JSON.parse(readFileSync(`${homedir()}/.config/codezone-media/elevenlabs.json`,'utf8'));
const status=JSON.parse(readFileSync(`${homedir()}/.config/codezone-media/elevenlabs-status.json`,'utf8'));
const voice=status.voices.find(v=>v.name==='Rob Clone');
if(!voice)throw Error('Configured voice not found');
for(const clip of [{id:'intro',script:introScript},...muscles]){
 const file=new URL(`../public/audio/${clip.id}.mp3`,import.meta.url);
 if(existsSync(file)&&!process.argv.includes('--force')){console.log(`${clip.id}: exists`);continue;}
 const response=await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice.voice_id}`,{method:'POST',headers:{'xi-api-key':config.api_key,'Content-Type':'application/json',Accept:'audio/mpeg'},body:JSON.stringify({text:clip.script,model_id:'eleven_v3',voice_settings:{stability:0.5,similarity_boost:0.78,speed:1.12}})});
 if(!response.ok)throw Error(`Audio generation failed: ${response.status} ${await response.text()}`);
 writeFileSync(file,Buffer.from(await response.arrayBuffer()));console.log(`${clip.id}: generated`);
}
