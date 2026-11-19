import {AbsoluteFill,Sequence,Img,useCurrentFrame,useVideoConfig,interpolate} from 'remotion';
import {Audio} from '@remotion/media';
import {muscles,introScript} from './content';
import durations from './audio-durations.json';
const clips=[{id:'intro',name:'Six muscles. One small mission.',hook:'Straight. Outside. Inside. Underneath.',landmark:'Four quadriceps + two straps. Find a landmark, then give it a name.',image:muscles[0].image,script:introScript},...muscles];
const length=(id:string)=>Math.ceil((durations[id as keyof typeof durations]+1)*30);
export const tourFrames=clips.reduce((n,c)=>n+length(c.id),0);
function Scene({clip,index}:{clip:typeof clips[number];index:number}){
 const frame=useCurrentFrame();const {fps}=useVideoConfig();
 const prompt=frame>length(clip.id)-fps*3;
 return <AbsoluteFill style={{background:'#102e2d',fontFamily:'Arial, sans-serif',color:'#fff',padding:48,display:'flex',flexDirection:'row',gap:40,opacity:interpolate(frame,[0,fps*.3],[0,1],{extrapolateRight:'clamp'})}}><div style={{width:'43%',background:'#fff',borderRadius:24,overflow:'hidden',position:'relative'}}><Img src={clip.image} style={{width:'100%',height:'100%',objectFit:'contain',scale:interpolate(frame,[0,length(clip.id)],[1,1.035])}}/><div style={{position:'absolute',bottom:18,left:18,fontSize:16,color:'#36514e',background:'#edf4ef',padding:'10px 14px',borderRadius:8}}>Anterior thigh · course illustration</div></div><div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center'}}><div style={{fontSize:18,letterSpacing:3,color:'#c3df8b',marginBottom:24}}>{index===0?'YOUR MEMORY TOUR':`MUSCLE ${index} OF 6`}</div><h1 style={{color:'#ffffff',fontSize:52,lineHeight:1.08,margin:'0 0 24px',fontWeight:600}}>{clip.name}</h1><div style={{height:3,width:60,background:'#dbe9a7',marginBottom:26}}/><p style={{fontSize:29,lineHeight:1.35,color:'#e1edc1',margin:'0 0 24px'}}>{clip.hook}</p><p style={{fontSize:23,lineHeight:1.5,color:'#d0dedb',margin:0}}>{clip.landmark}</p><p style={{marginTop:36,fontSize:20,color:'#c6d5d1'}}>{prompt?'Pause here. Look away. Say it back.':'Listen • locate • say it back'}</p></div><Audio src={`${import.meta.env.BASE_URL}audio/${clip.id}.mp3?v=2`} premountFor={fps}/></AbsoluteFill>;
}
export function MemoryTour(){const {fps}=useVideoConfig();let offset=0;return <AbsoluteFill>{clips.map((clip,index)=>{const from=offset;offset+=length(clip.id);return <Sequence key={clip.id} from={from} durationInFrames={length(clip.id)} premountFor={fps}><Scene clip={clip} index={index}/></Sequence>;})}</AbsoluteFill>;}
