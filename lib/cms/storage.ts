import { getStorage } from 'firebase-admin/storage'
import { getFirebaseApp, getStorageBucketName } from './firebase'

function getBucket() {
  return getStorage(getFirebaseApp()).bucket(getStorageBucketName())
}

export function getPublicMediaUrl(bucketName: string, path: string): string {
  return `https://storage.googleapis.com/${bucketName}/${path}`
}

function parseStorageObjectPath(
  url: string,
  bucketName: string,
): string | null {
  const gcsPrefix = `https://storage.googleapis.com/${bucketName}/`
  if (url.startsWith(gcsPrefix)) {
    return url.slice(gcsPrefix.length)
  }

  const firebasePrefix = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/`
  if (url.startsWith(firebasePrefix)) {
    const encodedPath = url.slice(firebasePrefix.length).split('?')[0]
    return decodeURIComponent(encodedPath)
  }

  return null
}

export async function uploadMedia(
  buffer: Buffer,
  filename: string,
  contentType: string,
): Promise<string> {
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_')
  const path = `cms-media/${Date.now()}-${safeName}`
  const bucket = getBucket()
  const file = bucket.file(path)

  await file.save(buffer, {
    metadata: { contentType },
    public: true,
  })

  return getPublicMediaUrl(bucket.name, path)
}

export async function deleteMediaFromUrl(url: string): Promise<void> {
  const bucket = getBucket()
  const path = parseStorageObjectPath(url, bucket.name)
  if (!path) return

  await bucket.file(path).delete({ ignoreNotFound: true })
}
