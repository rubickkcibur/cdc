import { FormInstance } from "antd/lib/form"
import Axios from "axios"
import { produce } from "immer"
import { AMapLngLat, LngLat, LngLatPos } from "react-amap"
import { Reducer } from "redux"
import { Action } from "rxjs/internal/scheduler/Action"
import { BaseItem, Basic, Epidemic, RForm } from "../types/types"
import Constant from '../../lib/constant'
const tag = "Products"
export const ActionsEnum = {
  SetState: "SetState",
  AddPause: "ActAddPause",
  RemovePause: "ActRemovePause",
  UpdateFormValue: "UpdatingFormValue",
  SetShowedRoutes: "SetShowedRoutes",
  SendData2Store: "SendData2Store",
  ActSetAggr: "ActSetAggr"
}

export interface Pause {
  name: string
  lnglat: LngLatPos

  fidx?: number
  companions?: any[]
  arrive_time?: string
  depart_time?: string
  protection?: string
  crowd?: string
  ventilation?: string
  remarks?: string
}
type FormDual = [FormInstance | undefined, FormInstance | undefined]

export type TState = {
  amap?: any
  __map__?: any
  pauses: Pause[]
  searchedResult?: BaseItem[]
  personalSearchedResults?: BaseItem[]
  loaded_form?: BaseItem
  basicform?: any,
  pathform_value?: any,
  pathform: {
    [key: number]: FormDual
  }
  newRouteBuffer?: RForm
  loadedBasic?:Basic
  loadedRoutes?:RForm[]
  loadedEpiKey?:any
  showedRoutes:Number[]
  rfIns?:any
  epidemics?:any
  loadedRelatedInfo?:any
  aggrGraph?:any
  chain?:any
  distance?:number
  time?:number
  all_patients?:any
  graph?:any
  patient_route?:any
}

const getEpi=()=>{
  let re
  Axios.get(`${Constant.apihost}/getAllEpidemics`)
    .then(e=>{
      re = e
    })
  return re
}

const getAggr=()=>{
  let re
  Axios.post(`${Constant.apihost}/getAggr`)
    .then(e=>{
      re = e
    })
  return re
}

const initState: TState = {
  pauses: [],
  pathform: {},
  showedRoutes:[],
  // epidemics:getEpi()
}

export const ActSetState = (data: Partial<TState>) => ({
  type: ActionsEnum.SetState,
  data,
})

export const ActAddPauses = (idx: number, pau: Pause) => ({
  type: ActionsEnum.AddPause,
  idx,
  pau,
})

export const ActRemovePauses = (idx:number) => ({
  type: ActionsEnum.RemovePause,
  idx,
})

export const ActUpdateValue = (formdual: FormDual, idx: number) => ({
  type: ActionsEnum.UpdateFormValue,
  formdual,
  idx,
})

export const ActSetShowedRoutes = (idx:number) =>({
  type: ActionsEnum.SetShowedRoutes,
  idx
})

export const SendData2Store = (dis:number,time:number) =>({
  type: ActionsEnum.SendData2Store,
  dis,
  time
})

export const ActSetAggr = (aggr:any) =>({
  type: ActionsEnum.ActSetAggr,
  aggr
})

export type TAction = ReturnType<typeof ActSetState> &
  ReturnType<typeof ActAddPauses> &
  ReturnType<typeof ActRemovePauses> &
  ReturnType<typeof ActUpdateValue> &
  ReturnType<typeof ActSetShowedRoutes> &
  ReturnType<typeof SendData2Store> &
  ReturnType<typeof ActSetAggr>

export const PAGlobalReducer: Reducer<TState, TAction> = (
  state = initState,
  action
) =>
  produce(state, (draft) => {
    switch (action.type) {
      case ActionsEnum.SetState:
        draft = Object.assign(draft, action.data)
        return draft
      case ActionsEnum.AddPause:
        if (action.idx === draft.pauses.length) draft.pauses.push(action.pau)
        else draft.pauses.splice(action.idx, 1, action.pau)
        return draft
      case ActionsEnum.RemovePause:
        //draft.pauses.pop()
        draft.pauses.splice(action.idx,1)
        return draft
      case ActionsEnum.UpdateFormValue:
        draft.pathform[action.idx] = action.formdual
        return draft
      case ActionsEnum.SetShowedRoutes:
        draft.showedRoutes[action.idx] = draft.showedRoutes[action.idx]?0:1
        return draft
      case ActionsEnum.SendData2Store:
        draft.distance=action.dis
        draft.time=action.time
        return draft
      case ActionsEnum.ActSetAggr:
        draft.aggrGraph=action.aggr
        return draft
      default:
        return draft
    }
    return draft
  })
