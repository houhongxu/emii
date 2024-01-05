// css是无状态的热更新
new EventSource('/esbuild').addEventListener('change', (e) => {
  // 记录了带后缀文件名
  const { added, removed, updated } = JSON.parse(e.data)

  // 只有更新一个css时触发
  if (
    !added.length &&
    !removed.length &&
    updated.length === 1 &&
    updated[0].includes('.css')
  ) {
    for (const link of document.getElementsByTagName('link')) {
      const url = new URL(link.href)

      if (url.pathname === updated[0]) {
        // 通过改变link的href参数来重新加载css
        const next = link.cloneNode() as HTMLLinkElement
        next.href = updated[0] + '?' + Math.random().toString(36).slice(2)
        next.onload = () => link.remove()
        link.parentNode?.insertBefore(next, link.nextSibling)
        return
      }
    }
  }

  // 其余情况live-reload刷新
  // 因为esbuild尚不实现，js热更新，js是有状态的热更新，esbuild文档建议使用其他打包工具，或者使用sessionStorge在reload时重新加载状态，因为打包很快所以也很快
  location.reload()
})
