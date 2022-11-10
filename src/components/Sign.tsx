import { useState, useRef } from 'react'
import konva from 'konva'
import { Stage, Layer, Line, KonvaNodeEvents } from 'react-konva'

const Sign = () => {
  const stage = useRef<konva.Stage>(null)
  const isDrawing = useRef(false)
  const [lines, setLines] = useState<number[][]>([])

  const handleMouseDown: KonvaNodeEvents['onMouseDown'] = () => {
    isDrawing.current = true
    if (!stage.current) return

    const pos = stage.current.getPointerPosition()
    if (!pos) return
    setLines([...lines, [pos.x, pos.y]])
  }

  const handleMouseMove: KonvaNodeEvents['onMouseMove'] = () => {
    if (!isDrawing.current) return
    if (!stage.current) return

    const point = stage.current.getPointerPosition()
    if (!point) return

    let lastLine = lines.at(-1)
    if (!lastLine) return
    // add line point
    lastLine = lastLine.concat([point.x, point.y])

    // replace last line
    lines.splice(-1, 1, lastLine)
    // update lines
    setLines([...lines])
  }

  const handleMouseUp: KonvaNodeEvents['onMouseUp'] = () => {
    isDrawing.current = false
  }

  const clearSign = () => {
    if (!stage.current) return
    setLines([])
  }

  return (
    <div>
      <h4 className="font-bold">Sign</h4>
      <Stage
        ref={stage}
        className="border-2 border-black bg-white"
        width={window.innerWidth * 0.3 - 4}
        height={150}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
      >
        <Layer>
          {lines.map((points, i) => (
            <Line
              key={i}
              points={points}
              stroke="#000"
              strokeWidth={3}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
            />
          ))}
        </Layer>
      </Stage>
      <div className="mt-2 flex justify-end gap-2">
        <button className="rounded bg-white px-2 py-1 shadow">insert into pdf</button>
        <button onClick={clearSign} className="rounded bg-white px-2 py-1 shadow">
          clear
        </button>
      </div>
    </div>
  )
}

export default Sign
