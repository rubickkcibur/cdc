export const extracDate = (detailTime:string) => {
    return detailTime.split(/(T|Z)/)
}
export const extracLocation= (str:string|undefined)=>{
    return str?.split(",").map(e=>Number(e))
}