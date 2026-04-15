export function clickOutside(node: HTMLElement, callback: ()=> void){
 const handledClick = (event: MouseEvent) => {
    if (node && !node.contains(event.target as Node)){
        callback()
    }
 }
 document.addEventListener('click', handledClick, true);// agregamos el listener al documento entero
 return {
     // eliminamos el listener cuando el elemento desaparece del dont, para evitar fugar de memoria
    destroy() {
        document.removeEventListener('click', handledClick, true)
    }
 }
}