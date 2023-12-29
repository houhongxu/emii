"use strict";
(() => {
  // client/live-reloading.ts
  new EventSource("/esbuild").addEventListener("change", (e) => {
    const { added, removed, updated } = JSON.parse(e.data);
    if (updated.length === 1 && !updated[0].includes(".css")) {
      location.reload();
    }
    if (added.length && removed.length) {
      location.reload();
    }
  });
})();
