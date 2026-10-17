import { copyFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const index = path.join(root, 'dist', 'index.html')
const fallback = path.join(root, 'dist', '404.html')

await copyFile(index, fallback)
console.log('Wrote dist/404.html for static-host deep links')
