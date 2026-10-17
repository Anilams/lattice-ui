import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const source = path.join(root, 'src', 'styles', 'tokens.css')
const css = await readFile(source, 'utf8')
const clean = css.replace(/\/\*[\s\S]*?\*\//g, '')
const blocks = {}
const blockPattern = /([^{}]+)\{([^{}]*)\}/g
let match

while ((match = blockPattern.exec(clean))) {
  const selector = match[1].replace(/\s+/g, ' ').trim()
  if (!selector || selector.startsWith('@')) continue
  const variables = {}
  const declarationPattern = /(--lat-[a-z0-9-]+)\s*:\s*([^;]+);/g
  let declaration
  while ((declaration = declarationPattern.exec(match[2]))) {
    variables[declaration[1]] = declaration[2].trim()
  }
  if (Object.keys(variables).length) {
    blocks[selector] = variables
  }
}

const output = {
  name: 'lattice-ui',
  version: '0.1.0',
  generatedFrom: 'src/styles/tokens.css',
  note: 'CSS remains the runtime source of truth in 0.1. This export is for tooling and review; regenerate it after token edits.',
  blocks,
}

await writeFile(path.join(root, 'tokens.json'), JSON.stringify(output, null, 2) + '\n')
console.log('Wrote tokens.json with ' + Object.keys(blocks).length + ' token blocks')
