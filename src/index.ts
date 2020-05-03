import AWS from 'aws-sdk'
import sharp from 'sharp'
import {
  formatURI,
  getFileExtension,
  getFilenameWithExtension,
  isAValidImageType,
} from './helpers'

const S3 = new AWS.S3()

export const handler: AWSLambda.S3Handler = async (event) => {
  const bucketName = event.Records[0].s3.bucket.name
  const destinationBucketName = process.env.DESTINATION_BUCKET || bucketName

  const fileKey = formatURI(event.Records[0].s3.object.key)
  const fileExtension = getFileExtension(fileKey)
  const filename = getFilenameWithExtension(fileKey)

  if (!isAValidImageType(fileExtension)) {
    console.error(`Not a permited image type: ${fileExtension}`)
    return
  }

  try {
    const originalFileInBucket = await S3.getObject({ Bucket: bucketName, Key: fileKey }).promise()

    const processedImage = await sharp(originalFileInBucket.Body as Buffer)
      .resize({ width: 500, withoutEnlargement: true })
      .jpeg({ quality: 80, progressive: true, force: false })
      .webp({ quality: 80, lossless: true, force: false })
      .png({ quality: 80, compressionLevel: 8, force: false })
      .toBuffer()

    await S3.putObject({
      Bucket: destinationBucketName,
      Key: `${process.env.DESTINATION_FILE}/${filename}`,
      Body: processedImage,
      ContentType: `image/${fileExtension}`,
      ACL: 'public-read',
    }).promise()
  } catch (e) {
    console.error(e)
  }
}
