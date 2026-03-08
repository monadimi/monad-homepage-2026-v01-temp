// 저장소 내 JSON 파일이 모두 파싱 가능한지 검증하는 스크립트입니다.
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const rootDirectory = process.cwd()
const excludedDirectories = new Set([
  '.git',
  '.github',
  '.omx',
  'dist',
  'node_modules',
])
const excludedJsonFileNames = new Set([
  // TypeScript 설정 파일은 JSONC(주석 허용) 형식이라 순수 JSON 파서 대상에서 제외합니다.
  'tsconfig.json',
  'tsconfig.app.json',
  'tsconfig.node.json',
])

const jsonFiles = []
const jsonParseErrors = []

async function collectJsonFiles(currentDirectory) {
  const directoryEntries = await readdir(currentDirectory, { withFileTypes: true })

  await Promise.all(
    directoryEntries.map(async (directoryEntry) => {
      if (directoryEntry.name.startsWith('.DS_Store')) {
        return
      }

      const absolutePath = path.join(currentDirectory, directoryEntry.name)
      const relativePath = path.relative(rootDirectory, absolutePath)

      if (directoryEntry.isDirectory()) {
        if (excludedDirectories.has(directoryEntry.name)) {
          return
        }

        await collectJsonFiles(absolutePath)
        return
      }

      if (!directoryEntry.isFile() || !directoryEntry.name.endsWith('.json')) {
        return
      }

      if (excludedJsonFileNames.has(directoryEntry.name)) {
        return
      }

      jsonFiles.push(relativePath)
    }),
  )
}

async function validateJsonFile(filePath) {
  const rawText = await readFile(path.join(rootDirectory, filePath), 'utf-8')

  try {
    JSON.parse(rawText)
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error)
    jsonParseErrors.push(`${filePath} -> ${detail}`)
  }
}

await collectJsonFiles(rootDirectory)
jsonFiles.sort((left, right) => left.localeCompare(right))

await Promise.all(jsonFiles.map((filePath) => validateJsonFile(filePath)))

if (jsonParseErrors.length > 0) {
  console.error('[validate:json] FAIL')
  jsonParseErrors.forEach((message) => {
    console.error(`  - ${message}`)
  })
  process.exit(1)
}

console.log(`[validate:json] OK · files=${jsonFiles.length}`)
