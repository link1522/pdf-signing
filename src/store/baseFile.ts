import create from 'zustand'

interface BaseFileState {
  canvasEl: HTMLCanvasElement | undefined
  previewSize: {
    width: number
    height: number
  }
  setCanvasEl: (canvasEl: HTMLCanvasElement) => void
  setPreviewSize: (previewSize: { width: number; height: number }) => void
}

export const useBaseFileStore = create<BaseFileState>(set => ({
  canvasEl: undefined,
  previewSize: {
    width: 0,
    height: 0
  },
  setCanvasEl: canvasEl => set(() => ({ canvasEl })),
  setPreviewSize: ({ width, height }) => set(() => ({ previewSize: { width, height } }))
}))
