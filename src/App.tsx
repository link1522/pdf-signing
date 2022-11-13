import './App.css'
import type { ChangeEvent } from 'react'
import { useRef } from 'react'
import konva from 'konva'
import type { KonvaNodeEvents } from 'react-konva'
import { Stage, Layer, Image } from 'react-konva'
import { jsPDF } from 'jspdf'
import { fileTobase64, base64pdfToCanvas } from './utils'
import Sign from './components/Sign'
import TransformableImage from './components/TransformableImage'
import { useBaseFileStore, useSignStore } from './store'

function App() {
  const stage = useRef<konva.Stage>(null)
  // const [signList, setSignList] = useState<ImageAttr[]>([])
  // const [selectedSignIndex, setSelectedSignIndex] = useState(-1)

  const baseFile = useBaseFileStore()
  const sign = useSignStore()

  const uploadPdf = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target && e.target.files) {
      const file = e.target.files.item(0) as Blob
      if (file.type !== 'application/pdf') return alert('請上傳 pdf 類型文件')

      const fileUrl = await fileTobase64(file)
      const pdfCanvas = await base64pdfToCanvas(fileUrl)

      baseFile.setCanvasEl(pdfCanvas)
      baseFile.setPreviewSize({
        width: pdfCanvas.width / window.devicePixelRatio,
        height: pdfCanvas.height / window.devicePixelRatio
      })
    }
  }

  // const insertSign = (signCanvas: HTMLCanvasElement) => {
  //   setSignList([...signList, { image: signCanvas }])
  // }

  const clickDeselect: KonvaNodeEvents['onMouseDown'] = e => {
    if (!e.target.attrs.draggable) {
      sign.select(-1)
    }
  }

  const touchDeselect: KonvaNodeEvents['onTouchStart'] = e => {
    if (!e.target.attrs.draggable) {
      sign.select(-1)
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
        width={baseFile.previewSize.width}
        height={baseFile.previewSize.height}
        className="mx-auto"
        onMouseDown={clickDeselect}
        onTouchStart={touchDeselect}
      >
        <Layer>
          <Image image={baseFile.canvasEl} />
          {sign.list.map((s, index) => (
            <TransformableImage
              key={index}
              index={index}
              imageAttr={s}
              isSelected={index === sign.selectedIndex}
            />
          ))}
        </Layer>
      </Stage>
      <div>
        <input type="file" onChange={uploadPdf} className="mb-10" />
        {baseFile.canvasEl ? <Sign /> : null}
        {sign.list.length > 0 ? (
          <button
            className="mt-10 block h-8 w-full rounded bg-red-700 text-white shadow"
            onClick={downloadPdf}
          >
            download !
          </button>
        ) : null}
      </div>
    </div>
  )
}

export default App
