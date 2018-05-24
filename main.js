let fileIndex
let prevEl

document.addEventListener('keydown', ({target, code}) => {
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

  // Cache it so that we can revert in case the new index is illegitimate
  const prevFileIndex = fileIndex;
  
  if (code === 'KeyN') {
    fileIndex = fileIndex == null ? 0 : fileIndex + 1
  } else if (code === 'KeyP') {
    fileIndex = fileIndex == null ? 0 : fileIndex - 1
  }
  
  const el = fileIndex > -1 ? document.getElementById('diff-' + fileIndex) : null
  if (!el) {
    fileIndex = prevFileIndex
    return
  }

  if (prevEl) {
    prevEl.style.boxShadow = ''
    prevEl.style.zIndex = 0
    prevEl.style.background = ''
}
  prevEl = el

  el.style.boxShadow = '0 5px 50px rgba(0, 0, 0, .7)'
  el.style.zIndex = 1000
  el.style.background = 'white'
  
  const rect = el.getBoundingClientRect()
  window.scrollTo(0, rect.top - 65) // -65 because of fixed position header
})
