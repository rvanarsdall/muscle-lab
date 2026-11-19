/** Combined-unit overviews are taught in lessons, never posed as a single pinned component. */
export function pinTargets<T extends {quizEligible?:boolean}>(items:T[]):T[]{
 return items.filter(item=>item.quizEligible!==false);
}
