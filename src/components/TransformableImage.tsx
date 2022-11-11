import { useRef, useEffect } from 'react'
import konva from 'konva'
import type { KonvaNodeEvents } from 'react-konva'
import { Image, Transformer } from 'react-konva'

export interface ImageAttr {
  image: HTMLCanvasElement | HTMLImageElement
  x?: undefined | number
  y?: undefined | number
  width?: undefined | number
  height?: undefined | number
}

interface Props {
  imageAttr: ImageAttr
  isSelected: boolean
  onSelect: () => void
  onChange: (newAttr: ImageAttr) => void
}

const TransformableImage = (props: Props) => {
  const { imageAttr, isSelected, onSelect, onChange } = props

  const imageRef = useRef<konva.Image>(null)
  const trRef = useRef<konva.Transformer>(null)

  useEffect(() => {
    if (isSelected) {
      if (!trRef.current || !imageRef.current) return
      // we need to attach transformer manually
      trRef.current.nodes([imageRef.current])

      const layer = trRef.current.getLayer()
      if (!layer) return
      layer.batchDraw()
    }
  }, [isSelected])

  const handleDragEnd: KonvaNodeEvents['onDragEnd'] = e => {
    // update image attribute x and y
    onChange({
      ...imageAttr,
      x: e.target.x(),
      y: e.target.y()
    })
  }

  const handleTransformEnd: KonvaNodeEvents['onTransformEnd'] = e => {
    /**
     * transformer is changing scale of the node
     * and NOT its width or height
     * but in the store we have only width and height
     * to match the data better we will reset scale on transform end
     */

    const node = imageRef.current
    if (!node) return

    // get the scale after transform
    const scaleX = node.scaleX()
    const scaleY = node.scaleY()

    // reset scale back to 1
    node.scaleX(1)
    node.scaleY(1)

    // update
    onChange({
      ...imageAttr,
      x: node.x(),
      y: node.y(),
      width: node.width() * scaleX,
      height: node.height() * scaleY
    })
  }

  return (
    <>
      <Image
        {...imageAttr}
        ref={imageRef}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox
            }
            return newBox
          }}
        />
      )}
    </>
  )
}

export default TransformableImage
