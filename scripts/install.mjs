import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const args = process.argv.slice(2)
const options = { target: process.cwd(), from: 'public/r', src: 'src', force: false, dryRun: false }
const names = []

for (let index = 0; index < args.length; index += 1) {
  const arg = args[index]
  if (arg === '--target') options.target = path.resolve(args[++index])
  else if (arg === '--from') options.from = path.resolve(args[++index])
  else if (arg === '--src') options.src = args[++index]
  else if (arg === '--force') options.force = true
  else if (arg === '--dry-run') options.dryRun = true
  else if (arg === '--help' || arg === '-h') {
    console.log('Usage: node scripts/install.mjs <item...> [--target <project>] [--src <source-root>] [--from <registry>] [--force] [--dry-run]')
    console.log('The source root defaults to src. Use --src . when the app keeps components at the project root.')
    process.exit(0)
  } else if (arg.startsWith('-')) {
    console.error('Unknown option: ' + arg)
    process.exit(1)
  } else {
    names.push(arg)
  }
}

if (!names.length) {
  console.error('Choose at least one item, for example: data-table detail-panel')
  process.exit(1)
}

const resolved = new Map()
const packages = new Set()

async function load(name) {
  let local = name
  if (name.startsWith('http')) {
    local = path.basename(new URL(name).pathname).replace(/\.json$/, '')
  }
  if (resolved.has(local)) return
  const file = path.join(options.from, local + '.json')
  let record
  try {
    record = JSON.parse(await readFile(file, 'utf8'))
  } catch {
    throw new Error('Registry dependency not found: ' + name + ' (expected ' + file + ')')
  }
  resolved.set(local, record)
  for (const dependency of record.registryDependencies ?? []) {
    await load(dependency)
  }
  for (const dependency of record.dependencies ?? []) {
    packages.add(dependency)
  }
}

for (const name of names) await load(name)

const safeTarget = path.resolve(options.target)
const sourceRoot = path.resolve(safeTarget, options.src)
if (sourceRoot !== safeTarget && !sourceRoot.startsWith(safeTarget + path.sep)) {
  throw new Error('Refusing a source root outside the target project: ' + options.src)
}

const planned = []

for (const [name, record] of resolved) {
  for (const file of record.files ?? []) {
    const destination = path.resolve(sourceRoot, file.target)
    if (destination !== sourceRoot && !destination.startsWith(sourceRoot + path.sep)) {
      throw new Error('Refusing to write outside the source root: ' + file.target)
    }
    let existing = null
    try {
      existing = await readFile(destination, 'utf8')
    } catch {
      existing = null
    }
    planned.push({ name, file, destination, existing })
  }
}

const conflicts = planned.filter(
  (entry) => entry.existing !== null && entry.existing !== entry.file.content && !options.force,
)

if (conflicts.length) {
  for (const entry of conflicts) {
    console.error('conflict   ' + path.relative(safeTarget, entry.destination))
  }
  console.error('Installation aborted before writing: ' + conflicts.length + ' existing file(s) differ.')
  console.error('Review the differences, then rerun with --force or merge manually.')
  process.exit(1)
}

let written = 0
let unchanged = 0
for (const entry of planned) {
  const relative = path.relative(safeTarget, entry.destination)
  if (entry.existing === entry.file.content) {
    console.log('unchanged  ' + relative)
    unchanged += 1
    continue
  }
  if (options.dryRun) {
    console.log('would write ' + relative)
    continue
  }
  await mkdir(path.dirname(entry.destination), { recursive: true })
  await writeFile(entry.destination, entry.file.content)
  console.log('wrote      ' + relative)
  written += 1
}

console.log('\nInstalled ' + resolved.size + ' items; wrote ' + written + ' files, left ' + unchanged + ' unchanged.')
if (packages.size) {
  console.log('Install npm dependencies:')
  console.log('  pnpm add ' + Array.from(packages).sort().join(' '))
}
console.log('Import the theme once in your global stylesheet (relative to the source root):')
console.log('  @import "./styles/lattice/lattice.css";')
