import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface BaseFileState {
  dataUrl: string
  previewSize: {
    width: number
    height: number
  }
}

const initialState: BaseFileState = {
  dataUrl: '',
  previewSize: {
    width: 0,
    height: 0
  }
}

export const baseFileSlice = createSlice({
  name: 'baseFile',
  initialState,
  reducers: {
    setBaseFileDataUrl: (state, { payload }: PayloadAction<{ dataUrl: string }>) => {
      state.dataUrl = payload.dataUrl
    },
    setBaseFilePreviewSize: (
      state,
      { payload }: PayloadAction<{ width: number; height: number }>
    ) => {
      state.previewSize.width = payload.width
      state.previewSize.height = payload.height
    }
  }
})

export const { setBaseFileDataUrl, setBaseFilePreviewSize } = baseFileSlice.actions

export const baseFileReducer = baseFileSlice.reducer
