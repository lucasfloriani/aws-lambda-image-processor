import sharp from 'sharp'

interface ProcessorData {
  directory: string
  content: Buffer
}

type ProcessorAction = (fileBuffer: Buffer) => Promise<Buffer>

const processImage = (originalFile: Buffer) => {
  return async (processorAction: ProcessorAction, directory: string): Promise<ProcessorData> => {
    return ({ content: await processorAction(originalFile), directory })
  }
}

const largeSize = (originalFile: Buffer) => sharp(originalFile)
  .resize({ width: 1200, withoutEnlargement: true })
  .jpeg({ quality: 70, progressive: true, force: false })
  .webp({ quality: 70, lossless: true, force: false })
  .png({ quality: 70, compressionLevel: 8, force: false })
  .toBuffer()

const mediumSize = (originalFile: Buffer) => sharp(originalFile)
  .resize({ height: 150, withoutEnlargement: true })
  .jpeg({ quality: 70, progressive: true, force: false })
  .webp({ quality: 70, lossless: true, force: false })
  .png({ quality: 70, compressionLevel: 8, force: false })
  .toBuffer()

const smallSize = (originalFile: Buffer) => sharp(originalFile)
  .resize({ width: 100, withoutEnlargement: true })
  .jpeg({ quality: 70, progressive: true, force: false })
  .webp({ quality: 70, lossless: true, force: false })
  .png({ quality: 70, compressionLevel: 8, force: false })
  .toBuffer()

const extraSmallSize = (originalFile: Buffer) => sharp(originalFile)
  .resize({ width: 70, withoutEnlargement: true })
  .jpeg({ quality: 70, progressive: true, force: false })
  .webp({ quality: 70, lossless: true, force: false })
  .png({ quality: 70, compressionLevel: 8, force: false })
  .toBuffer()

const processor = async (originalFile: Buffer): Promise<ProcessorData[]> => {
  const processImageToBe = processImage(originalFile)
  return Promise.all([
    processImageToBe(largeSize, 'resized/large'),
    processImageToBe(mediumSize, 'resized/medium'),
    processImageToBe(smallSize, 'resized/small'),
    processImageToBe(extraSmallSize, 'resized/extra-small'),
  ])
}

export default processor
