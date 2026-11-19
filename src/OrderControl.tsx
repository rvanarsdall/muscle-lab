export function OrderControl({shuffled,onOrdered,onShuffle}:{shuffled:boolean;onOrdered:()=>void;onShuffle:()=>void}){
 return <div className="order-control"><span>Muscle order</span><div role="group" aria-label="Muscle presentation order"><button type="button" aria-pressed={!shuffled} className={!shuffled?'selected':''} onClick={onOrdered}>In order</button><button type="button" aria-pressed={shuffled} className={shuffled?'selected':''} onClick={onShuffle}>{shuffled?'Shuffle again':'Shuffle'}</button></div></div>;
}
