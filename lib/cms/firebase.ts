import { cert, getApps, initializeApp, type App } from 'firebase-admin/app'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'

const globalForFirebase = globalThis as unknown as {
  firebaseApp: App | undefined
  firestore: Firestore | undefined
}

function getFirebaseCredentials() {
  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (!projectId || !clientEmail || !privateKey) {
    return null
  }

  return { projectId, clientEmail, privateKey }
}

export function getStorageBucketName(): string {
  const credentials = getFirebaseCredentials()
  if (!credentials) {
    throw new Error(
      'Firebase credentials not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.',
    )
  }

  return (
    process.env.FIREBASE_STORAGE_BUCKET ??
    `${credentials.projectId}.firebasestorage.app`
  )
}

export function isFirebaseConfigured(): boolean {
  return getFirebaseCredentials() !== null
}

export function getFirebaseApp(): App {
  if (globalForFirebase.firebaseApp) {
    return globalForFirebase.firebaseApp
  }

  const existing = getApps()[0]
  if (existing) {
    globalForFirebase.firebaseApp = existing
    return existing
  }

  const credentials = getFirebaseCredentials()
  if (!credentials) {
    throw new Error(
      'Firebase credentials not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.',
    )
  }

  const app = initializeApp({
    credential: cert(credentials),
    projectId: credentials.projectId,
    storageBucket: getStorageBucketName(),
  })

  globalForFirebase.firebaseApp = app
  return app
}

export function getDb(): Firestore {
  if (globalForFirebase.firestore) {
    return globalForFirebase.firestore
  }

  const db = getFirestore(getFirebaseApp())
  globalForFirebase.firestore = db
  return db
}
