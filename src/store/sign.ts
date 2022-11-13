import create from 'zustand'
import type { ImageAttr } from '../types'

interface SignState {
  list: ImageAttr[]
  selectedIndex: number
  add: (newSign: ImageAttr) => void
  modify: (index: number, newSign: ImageAttr) => void
  select: (index: number) => void
}

export const useSignStore = create<SignState>(set => ({
  list: [],
  selectedIndex: -1,
  add: newSign => set(state => ({ list: [...state.list, newSign] })),
  modify: (index, newSign) =>
    set(state => {
      state.list[index] = newSign
      return { list: [...state.list] }
    }),
  select: index => set(() => ({ selectedIndex: index }))
}))
