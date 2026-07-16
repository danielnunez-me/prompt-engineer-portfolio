import { randomBytes } from 'node:crypto'
import bcrypt from 'bcryptjs'
import { Timestamp } from 'firebase-admin/firestore'
import { getDb, isFirebaseConfigured } from './firebase'

const SESSION_COOKIE = 'cms_session'
const SESSION_HOURS = 8
const SESSIONS_COLLECTION = 'adminSessions'

export { SESSION_COOKIE }

export function getAdminPasswordHash(): string {
  const password = process.env.ADMIN_PASSWORD ?? 'admin123'
  if (password.startsWith('$2')) {
    return password
  }
  return bcrypt.hashSync(password, 10)
}

export async function verifyPassword(password: string): Promise<boolean> {
  const envPassword = process.env.ADMIN_PASSWORD ?? 'admin123'
  if (envPassword.startsWith('$2')) {
    return bcrypt.compare(password, envPassword)
  }
  return password === envPassword
}

export async function createSession(): Promise<string> {
  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + SESSION_HOURS * 60 * 60 * 1000)

  if (!isFirebaseConfigured()) {
    throw new Error('Firebase credentials not configured')
  }

  await getDb().collection(SESSIONS_COLLECTION).doc(token).set({
    expiresAt: Timestamp.fromDate(expiresAt),
    createdAt: Timestamp.now(),
  })

  return token
}

export async function validateSession(
  token: string | undefined,
): Promise<boolean> {
  if (!token || !isFirebaseConfigured()) return false

  const snapshot = await getDb()
    .collection(SESSIONS_COLLECTION)
    .doc(token)
    .get()

  if (!snapshot.exists) return false

  const expiresAt = snapshot.data()?.expiresAt?.toDate() as Date | undefined
  if (!expiresAt || expiresAt < new Date()) {
    await getDb().collection(SESSIONS_COLLECTION).doc(token).delete()
    return false
  }

  return true
}

export async function deleteSession(token: string): Promise<void> {
  await getDb().collection(SESSIONS_COLLECTION).doc(token).delete()
}

export function isValidEditKey(editKey: string | undefined): boolean {
  const expected = process.env.EDIT_KEY ?? 'dev-edit-key'
  return !!editKey && editKey === expected
}

export const SESSION_MAX_AGE_SECONDS = SESSION_HOURS * 60 * 60
