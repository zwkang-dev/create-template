import picomatch from 'picomatch'

export function createFilter(exclude: string[]) {
  const excludeFilters = exclude.map(pattern => picomatch(pattern))

  const cache = new Map<string, boolean>()

  // 返回过滤器函数
  return function filter(id: string) {
    // 如果包含数组为空，则默认包含所有文件
    if (excludeFilters.length === 0)
      return true
    if (cache.has(id))
      return cache.get(id)

    const result = excludeFilters.some(filter => filter(id))
    cache.set(id, !result)

    // 如果文件不匹配包含数组中的任何模式，则排除该文件
    return !result
  }
}
