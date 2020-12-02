import { FormInstance } from "antd/lib/form"
import { produce } from "immer"
import { AMapLngLat, LngLat, LngLatPos } from "react-amap"
import { Reducer } from "redux"
import { BaseItem } from "../types/types"
const tag = "Products"
export const ActionsEnum = {
  SetState: "SetState",
  AddPause: "ActAddPause",
  RemovePause: "ActRemovePause",
  UpdateFormValue: "UpdatingFormValue",
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
}
const initState: TState = {
  pauses: [],
  pathform: {},
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

export const ActRemovePauses = () => ({
  type: ActionsEnum.RemovePause,
})

export const ActUpdateValue = (formdual: FormDual, idx: number) => ({
  type: ActionsEnum.UpdateFormValue,
  formdual,
  idx,
})

export type TAction = ReturnType<typeof ActSetState> &
  ReturnType<typeof ActAddPauses> &
  ReturnType<typeof ActRemovePauses> &
  ReturnType<typeof ActUpdateValue>

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
        draft.pauses.pop()
        return draft
      case ActionsEnum.UpdateFormValue:
        draft.pathform[action.idx] = action.formdual
        return draft
      default:
        return draft
    }
    return draft
  })
