import path from 'path'

export const formatURI = (text: string) => decodeURIComponent(text.replace(/\+/g, ' '))

export const getFileExtension = (filename: string) => filename.split('.').slice(-1)[0]

export const getFilenameWithExtension = (text: string) => path.basename(text)

export const isAValidImageType = (type: string) => ['jpg', 'jpeg', 'png', 'webp'].includes(type)
