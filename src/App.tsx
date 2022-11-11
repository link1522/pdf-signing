import './App.css'
import type { ChangeEvent } from 'react'
import { useState, useRef } from 'react'
import konva from 'konva'
import type { KonvaNodeEvents } from 'react-konva'
import { Stage, Layer, Image } from 'react-konva'
import { jsPDF } from 'jspdf'
import { fileTobase64, base64pdfToCanvas } from './utils'
import Sign from './components/Sign'
import TransformableImage, { ImageAttr } from './components/TransformableImage'

function App() {
  const stage = useRef<konva.Stage>(null)
  const [stageWidth, setStageWidth] = useState(0)
  const [stageHeight, setStageHeight] = useState(0)
  const [baseFileCanvas, setBaseFileCanvas] = useState<HTMLCanvasElement | undefined>(undefined)
  const [signList, setSignList] = useState<ImageAttr[]>([])
  const [selectedSignIndex, setSelectedSignIndex] = useState(-1)

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

  const insertSign = (signCanvas: HTMLCanvasElement) => {
    setSignList([...signList, { image: signCanvas }])
  }

  const clickDeselect: KonvaNodeEvents['onMouseDown'] = e => {
    if (!e.target.attrs.draggable) {
      setSelectedSignIndex(-1)
    }
  }

  const touchDeselect: KonvaNodeEvents['onTouchStart'] = e => {
    if (!e.target.attrs.draggable) {
      setSelectedSignIndex(-1)
    }
  }

  const downloadPdf = () => {
    if (!stage.current) return

    const pdf = new jsPDF()
    const image = stage.current.toDataURL()
    const width = pdf.internal.pageSize.width
    const height = pdf.internal.pageSize.height
    pdf.addImage(image, 'png', 0, 0, width, height)

    pdf.save('download.pdf')
  }

  return (
    <div className="grid h-screen grid-cols-[70%_30%]">
      <Stage
        ref={stage}
        width={stageWidth}
        height={stageHeight}
        className="mx-auto"
        onMouseDown={clickDeselect}
        onTouchStart={touchDeselect}
      >
        <Layer>
          <Image image={baseFileCanvas} />
          {signList.map((sign, index) => (
            <TransformableImage
              key={index}
              imageAttr={sign}
              isSelected={index === selectedSignIndex}
              onSelect={() => {
                setSelectedSignIndex(index)
              }}
              onChange={(newAttr: ImageAttr) => {
                signList[index] = newAttr
                setSignList([...signList])
              }}
            />
          ))}
        </Layer>
      </Stage>
      <div>
        <input type="file" onChange={uploadPdf} className="mb-10" />
        {baseFileCanvas && <Sign insertSign={insertSign} />}
        {signList.length > 0 && (
          <button
            className="mt-10 block h-8 w-full rounded bg-red-700 text-white shadow"
            onClick={downloadPdf}
          >
            download !
          </button>
        )}
      </div>
    </div>
  )
}

export default App
