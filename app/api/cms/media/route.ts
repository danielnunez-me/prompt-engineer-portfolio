import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import type { MediaAsset } from '@/lib/content'
import {
  deleteMediaFromUrl,
  getPageContent,
  SESSION_COOKIE,
  updatePageContent,
  uploadMedia,
  validateSession,
} from '@/lib/cms'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

async function requireAuth() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  const isAuthed = await validateSession(token)
  if (!isAuthed) return null
  return true
}

export async function POST(request: Request) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file')

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: 'File too large (max 5MB)' },
      { status: 400 },
    )
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const url = await uploadMedia(buffer, file.name, file.type)
    const content = await getPageContent()

    const asset: MediaAsset = {
      id: `media-${Date.now()}`,
      url,
      name: file.name,
      createdAt: new Date().toISOString(),
    }

    const updated = await updatePageContent('mediaLibrary', [
      ...content.mediaLibrary,
      asset,
    ])

    return NextResponse.json({ url, asset, content: updated })
  } catch (error) {
    console.error('Media upload failed:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const assetId = searchParams.get('id')

  if (!assetId) {
    return NextResponse.json({ error: 'Missing asset id' }, { status: 400 })
  }

  try {
    const content = await getPageContent()
    const asset = content.mediaLibrary.find((item) => item.id === assetId)

    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 })
    }

    if (asset.url.includes('storage.googleapis.com')) {
      await deleteMediaFromUrl(asset.url)
    }

    const updated = await updatePageContent(
      'mediaLibrary',
      content.mediaLibrary.filter((item) => item.id !== assetId),
    )

    return NextResponse.json({ content: updated })
  } catch (error) {
    console.error('Media delete failed:', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
