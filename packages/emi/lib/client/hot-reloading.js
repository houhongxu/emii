"use strict";
(() => {
  // client/hot-reloading.ts
  new EventSource("/esbuild").addEventListener("change", (e) => {
    const { added, removed, updated } = JSON.parse(e.data);
    if (!added.length && !removed.length && updated.length === 1 && updated[0].includes(".css")) {
      for (const link of document.getElementsByTagName("link")) {
        const url = new URL(link.href);
        if (url.pathname === updated[0]) {
          const next = link.cloneNode();
          next.href = updated[0] + "?" + Math.random().toString(36).slice(2);
          next.onload = () => link.remove();
          link.parentNode?.insertBefore(next, link.nextSibling);
          return;
        }
      }
    }
    location.reload();
  });
})();
