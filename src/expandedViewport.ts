import {useEffect,useState} from 'react';
export function compositionForViewport(width:number,height:number){
 const compositionWidth=height>width?800:1200;
 return {width:compositionWidth,height:Math.round(compositionWidth*height/width)};
}
export function useExpandedViewport(){
 const read=()=>{const viewport=window.visualViewport;return {width:viewport?.width??window.innerWidth,height:viewport?.height??window.innerHeight,left:viewport?.offsetLeft??0,top:viewport?.offsetTop??0};};
 const [viewport,setViewport]=useState(read);
 useEffect(()=>{const update=()=>setViewport(read());window.addEventListener('resize',update);window.visualViewport?.addEventListener('resize',update);window.visualViewport?.addEventListener('scroll',update);return()=>{window.removeEventListener('resize',update);window.visualViewport?.removeEventListener('resize',update);window.visualViewport?.removeEventListener('scroll',update);};},[]);
 return viewport;
}
