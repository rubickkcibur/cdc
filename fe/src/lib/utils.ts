export const extracDate = (detailTime:string) => {
    return detailTime.split(/(T|Z)/)
}
export const extracLocation= (str:string|undefined)=>{
    return str?.split(",").map(e=>Number(e))
}

export const replaceAt = (str:string, index:number, replacement:string)=>{
    return str.substr(0, index) + replacement+ str.substr(index + 1);
}