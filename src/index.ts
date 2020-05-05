import AWS from 'aws-sdk'
import {
  formatURI,
  getFileExtension,
  getFilenameWithExtension,
  isAValidImageType,
} from './helpers'
import processor from './processor'

const S3 = new AWS.S3()

export const handler: AWSLambda.S3Handler = async (event) => {
  const bucketName = event.Records[0].s3.bucket.name
  const destinationBucketName = process.env.OUTPUT_BUCKET || bucketName

  const fileKey = formatURI(event.Records[0].s3.object.key)
  const fileExtension = getFileExtension(fileKey)
  const filename = getFilenameWithExtension(fileKey)

  if (!isAValidImageType(fileExtension)) {
    console.error(`Not a permited image type: ${fileExtension}`)
    return
  }

  try {
    const originalFileInBucket = await S3.getObject({ Bucket: bucketName, Key: fileKey }).promise()

    const processedImages = await processor(originalFileInBucket.Body as Buffer)

    const uploadImages = processedImages.map((imageInfo) => {
      return S3.putObject({
        Bucket: destinationBucketName,
        Key: `${imageInfo.directory}/${filename}`,
        Body: imageInfo.content,
        ContentType: `image/${fileExtension}`,
        ACL: 'public-read',
      }).promise()
    })

    await Promise.all(uploadImages)
  } catch (e) {
    console.error(e)
  }
}
