import { sha256Hex } from '../domain/hash'
import type { PhotoRef } from '../domain/types'

const MAX_EDGE = 1600

/** Shrinks a camera photo for field upload and fingerprints it at the moment of capture. */
export async function processPhoto(file: File): Promise<{ blob: Blob; ref: Omit<PhotoRef, 'key'> }> {
  const capturedAt = new Date().toISOString()
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not encode photo'))), 'image/jpeg', 0.8),
  )
  const sha256 = await sha256Hex(await blob.arrayBuffer())
  return { blob, ref: { sha256, capturedAt, width, height } }
}
