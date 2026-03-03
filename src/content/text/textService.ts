// UI 텍스트 번들(JSON) 로딩/조회 유틸입니다.
import registrySource from './text-bundles.json'
import globalBundleSource from './global.ko.json'
import homeBundleSource from './home.ko.json'
import monad2026BundleSource from './monad2026.ko.json'
import achievementsBundleSource from './achievements.ko.json'
import membersBundleSource from './members.ko.json'
import projectsBundleSource from './projects.ko.json'

export interface TextEntry {
  id: string
  value: string
  description?: string
}

export interface TextBundle {
  id: string
  locale: string
  entries: TextEntry[]
}

interface TextRegistryItem {
  id: string
  label: string
  locale: string
  description: string
  file: string
}

interface TextRegistry {
  version: number
  defaultLocale: string
  bundles: TextRegistryItem[]
}

const textRegistry: TextRegistry = registrySource

const textBundles: Record<string, TextBundle> = {
  global: globalBundleSource,
  home: homeBundleSource,
  monad2026: monad2026BundleSource,
  achievements: achievementsBundleSource,
  members: membersBundleSource,
  projects: projectsBundleSource,
}

const textMapsByBundle: Record<string, Record<string, string>> = Object.fromEntries(
  Object.entries(textBundles).map(([bundleId, bundle]) => {
    const map = Object.fromEntries(bundle.entries.map((entry) => [entry.id, entry.value]))
    return [bundleId, map]
  }),
)

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) {
    return template
  }

  return template.replace(/\{([a-zA-Z0-9_]+)\}/g, (raw, key) => {
    const value = params[key]
    return value === undefined ? raw : String(value)
  })
}

export class TextService {
  public static getRegistry(): TextRegistry {
    return textRegistry
  }

  public static getBundleMap(): Readonly<Record<string, TextBundle>> {
    return textBundles
  }

  public static get(bundleId: string, entryId: string, fallback = ''): string {
    return textMapsByBundle[bundleId]?.[entryId] ?? fallback
  }

  public static getLines(bundleId: string, entryId: string, fallback = ''): string[] {
    const value = TextService.get(bundleId, entryId, fallback)
    return value.split('\n')
  }

  public static format(
    bundleId: string,
    entryId: string,
    params?: Record<string, string | number>,
    fallback = '',
  ): string {
    const template = TextService.get(bundleId, entryId, fallback)
    return interpolate(template, params)
  }
}

export function text(bundleId: string, entryId: string, fallback = ''): string {
  return TextService.get(bundleId, entryId, fallback)
}

export function textLines(bundleId: string, entryId: string, fallback = ''): string[] {
  return TextService.getLines(bundleId, entryId, fallback)
}

export function textFormat(
  bundleId: string,
  entryId: string,
  params?: Record<string, string | number>,
  fallback = '',
): string {
  return TextService.format(bundleId, entryId, params, fallback)
}
