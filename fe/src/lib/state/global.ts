import { produce } from "immer"
import { Reducer } from "redux"
const tag = "Products"
export const ActionsEnum = {
  SetState: "SetState",
}

export interface Pause {
  name: string
  lnglat: number[]

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
  pauses: Pause[]
}
const initState: TState = {
  pauses: [],
}

export const ActSetState = (data: Partial<TState>) => ({
  type: ActionsEnum.SetState,
  data,
})

export type TAction = ReturnType<typeof ActSetState>

export const PAGlobalReducer: Reducer<TState, TAction> = (
  state = initState,
  action
) =>
  produce(state, (draft) => {
    switch (action.type) {
      case ActionsEnum.SetState:
        draft = Object.assign(draft, action.data)
        return draft
    }
    return draft
  })
