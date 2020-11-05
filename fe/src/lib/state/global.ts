import { produce } from "immer"
import { AMapLngLat, LngLat, LngLatPos } from "react-amap"
import { Reducer } from "redux"
const tag = "Products"
export const ActionsEnum = {
  SetState: "SetState",
  AddPause: "ActAddPause",
  RemovePause: "ActRemovePause",
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

export type TState = {
  amap?: any
  __map__?: any
  pauses: Pause[]
}
const initState: TState = {
  pauses: [],
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

export type TAction = ReturnType<typeof ActSetState> &
  ReturnType<typeof ActAddPauses> &
  ReturnType<typeof ActRemovePauses>

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
        const old = draft.pauses.findIndex((e) => e.fidx === action.idx)
        if (old != -1) {
          draft.pauses[old] = {
            ...action.pau,
            fidx: action.idx,
          }
        } else {
          draft.pauses.push({
            ...action.pau,
            fidx: action.idx,
          })
        }

        return draft
      case ActionsEnum.RemovePause:
        draft.pauses.pop()
        return draft
    }
    return draft
  })
