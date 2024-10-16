import { produce } from 'immer'

import { ActionsType } from './actions'

export interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

interface CyclesState {
  cycles: Cycle[]
  activeCycleId: string | null
}

type PropertyProps = 'finishedDate' | 'interruptedDate'

type ActionProps = { type: ActionsType, payload?: any }

export const cyclesReducer = (state: CyclesState, action: ActionProps) => {
  const setPropertyToNewDate = (property: PropertyProps) => {
    const currCycleIndex = state.cycles.findIndex(
      ({ id }) => id === state.activeCycleId,
    )

    if (currCycleIndex < 0) return state

    return produce(state, (draft) => {
      draft.activeCycleId = null
      draft.cycles[currCycleIndex][property] = new Date()
    })
  }

  switch (action.type) {
    case ActionsType.ADD_NEW_CYCLE:
      return produce(state, (draft) => {
        draft.cycles.push(action.payload.newCycle)
        draft.activeCycleId = action.payload.activeCycleId
      })
    case ActionsType.INTERRUPT_CURRENT_CYCLE:
      return setPropertyToNewDate('interruptedDate')
    case ActionsType.MARK_CURRENT_CYCLE_AS_FINISHED:
      return setPropertyToNewDate('finishedDate')
    default:
      return state
  }
}
