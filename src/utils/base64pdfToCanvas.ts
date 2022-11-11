import * as pdfjsLib from 'pdfjs-dist'
import { pathConverter } from './pathConverter'

pdfjsLib.GlobalWorkerOptions.workerSrc = pathConverter('/lib/pdf.worker.min.js')

export const base64pdfToCanvas = async (base64pdf: string) => {
  const data = atob(base64pdf.replace(/.*base64,/, ''))

  const pdfDoc = await pdfjsLib.getDocument({ data }).promise
  const pdfPage = await pdfDoc.getPage(1)

  // get pdf height when scale = 1
  // and use it to calculate current scale
  const viewportBase = pdfPage.getViewport({ scale: 1 })
  const pdfHeightBase = viewportBase.height
  const windowHeight = window.innerHeight
  const currentScale = windowHeight / pdfHeightBase
  const viewport = pdfPage.getViewport({ scale: currentScale })

  const canvas = document.createElement('canvas')
  canvas.height = viewport.height
  canvas.width = viewport.width
  const canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D

  await pdfPage.render({
    canvasContext,
    viewport
  }).promise

  return canvas
}
