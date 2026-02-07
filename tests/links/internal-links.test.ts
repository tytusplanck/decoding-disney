import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const DIST_DIR = path.resolve(process.cwd(), 'dist')

function getHtmlFiles(dir: string): string[] {
  const files: string[] = []
  const entries = readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...getHtmlFiles(fullPath))
      continue
    }

    if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(fullPath)
    }
  }

  return files
}

function resolveLinkPath(href: string, sourceFile: string): string | undefined {
  const cleanHref = href.split('#')[0]?.split('?')[0] ?? ''
  if (!cleanHref || cleanHref.startsWith('#')) {
    return undefined
  }

  const isExternal =
    cleanHref.startsWith('http://') ||
    cleanHref.startsWith('https://') ||
    cleanHref.startsWith('mailto:') ||
    cleanHref.startsWith('tel:')
  if (isExternal) {
    return undefined
  }

  const sourceDir = path.dirname(sourceFile)
  const hasExtension = path.extname(cleanHref).length > 0
  const basePath = cleanHref.startsWith('/')
    ? path.join(DIST_DIR, cleanHref.slice(1))
    : path.resolve(sourceDir, cleanHref)

  if (hasExtension) {
    return basePath
  }

  if (cleanHref === '/' || cleanHref.endsWith('/')) {
    return path.join(basePath, 'index.html')
  }

  return path.join(basePath, 'index.html')
}

describe('internal link integrity', () => {
  it('keeps all internal anchor href targets valid in built HTML', () => {
    const htmlFiles = getHtmlFiles(DIST_DIR)
    const brokenLinks: string[] = []

    for (const htmlFile of htmlFiles) {
      const html = readFileSync(htmlFile, 'utf8')
      const linkPattern = /<a\b[^>]*href=(["'])([\s\S]*?)\1/gi
      let match: RegExpExecArray | null

      while ((match = linkPattern.exec(html)) !== null) {
        const href = match[2]
        const resolvedPath = resolveLinkPath(href, htmlFile)
        if (!resolvedPath) {
          continue
        }

        if (!existsSync(resolvedPath)) {
          const relativeSource = path.relative(DIST_DIR, htmlFile)
          const relativeTarget = path.relative(DIST_DIR, resolvedPath)
          brokenLinks.push(`${relativeSource} -> ${href} (missing: ${relativeTarget})`)
        }
      }
    }

    expect(brokenLinks).toEqual([])
  })
})
