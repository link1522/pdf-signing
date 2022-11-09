import './App.css'
import type { ChangeEvent } from 'react'
import { useState, useRef, useEffect } from 'react'
import { Stage, Layer } from 'react-konva'
import { fileTobase64 } from './utils'
import UrlImage from './components/UrlImage'

function App() {
  const [baseFileUrl, setBaseFileUrl] = useState('')

  const uploadPdf = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target && e.target.files) {
      const file = e.target.files.item(0) as Blob
      const fileUrl = await fileTobase64(file)

      await setBaseFileUrl(fileUrl)
    }
  }

  return (
    <div className="grid h-screen grid-cols-[70%_30%]">
      <div>
        <Stage width={window.innerWidth * 0.7} height={window.innerHeight}>
          <Layer>
            <UrlImage url={baseFileUrl} />
          </Layer>
        </Stage>
      </div>
      <div>
        <input type="file" onChange={uploadPdf} />
      </div>
    </div>
  )
}

export default App
