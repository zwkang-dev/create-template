import { Configure } from 'json-configure'

const config = new Configure()

export function set(name: string, value: Record<string, any> | string | number) {
  config.write(name, value)
}

export function get<T = any>(name: string) {
  return config.read(name) as T
}

export function clear() {
  config.clearCache()
}

export function clearCacheFile() {
  config.clear()
}
