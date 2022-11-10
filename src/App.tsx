import './App.css'
import type { ChangeEvent } from 'react'
import { useState } from 'react'
import { Stage, Layer, Image } from 'react-konva'
import { fileTobase64, base64pdfToCanvas } from './utils'
import Sign from './components/Sign'

function App() {
  const [stageWidth, setStageWidth] = useState(0)
  const [stageHeight, setStageHeight] = useState(0)
  const [baseFileCanvas, setBaseFileCanvas] = useState<HTMLCanvasElement | undefined>(undefined)

  const uploadPdf = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target && e.target.files) {
      const file = e.target.files.item(0) as Blob
      if (file.type !== 'application/pdf') return alert('請上傳 pdf 類型文件')

      const fileUrl = await fileTobase64(file)
      const pdfCanvas = await base64pdfToCanvas(fileUrl)

      setBaseFileCanvas(pdfCanvas)
      setStageWidth(pdfCanvas.width / window.devicePixelRatio)
      setStageHeight(pdfCanvas.height / window.devicePixelRatio)
    }
  }

  return (
    <div className="grid h-screen grid-cols-[70%_30%]">
      <Stage width={stageWidth} height={stageHeight} className="mx-auto">
        <Layer>
          <Image image={baseFileCanvas} />
        </Layer>
      </Stage>
      <div>
        <input type="file" onChange={uploadPdf} className="mb-10" />
        <Sign />
      </div>
    </div>
  )
}

export default App
