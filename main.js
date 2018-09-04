console.info("Github Make Better")


/**
 * Toggle tests
 */

let testsAreHidden

function getFileName(fileEl) {
  return fileEl.querySelector('.file-info a').textContent
}

function toggleTests() {
  testsAreHidden = !testsAreHidden
  const filesContainer = document.getElementById('files')
  filesContainer.querySelectorAll('.js-details-container').forEach(fileEl => {
    const fileName = getFileName(fileEl)
    if (testsAreHidden
      && (fileName.includes('__tests__') || fileName.includes('__mocks__') || fileName.includes('__fixtures__'))
    ) {
      fileEl.style.display = 'none'
    } else {
      fileEl.style.display = ''
    }
  })
}

/**
 * Navigate to next/prev file
 */

let fileIndex
let prevEl

function getActiveEl() {
  return document.getElementById('diff-' + fileIndex)
}

function findEl(isNext) {
  const el = fileIndex > -1 ? getActiveEl() : null
  if (!el || el.style.display !== 'none') return el

  // Keep searching for the next element if the found one is hidden
  fileIndex += isNext ? 1 : -1
  return findEl(isNext)
}

function navigateFile(code) {
  // Cache it so that we can revert in case the new index is illegitimate
  const prevFileIndex = fileIndex
  const isNext = code === 'KeyN'

  if (isNext) {
    fileIndex = fileIndex == null ? 0 : fileIndex + 1
  } else {
    fileIndex = fileIndex == null ? 0 : fileIndex - 1
  }

  const el = findEl(isNext)
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
  window.scrollTo(0, rect.top + window.pageYOffset)
}

/**
 * Copy file name
 */

function copyHandler(e) {
  e.preventDefault()
  e.clipboardData.setData("text/plain", clipboardText)
}

function copyToClipboard(text) {
  clipboardText = text
  document.addEventListener("copy", copyHandler)
  document.execCommand("copy")
  document.removeEventListener("copy", copyHandler)
}

function copyFileName() {
  const el = getActiveEl()
  if (!el) return
  copyToClipboard(getFileName(el))
}

function copyCorrespondingTests() {
  let paths = []
  
  for (const el of document.getElementsByClassName('file')) {
    const name = getFileName(el)
    if (name.includes('__tests__')) continue
    const lastSlash = name.lastIndexOf('/') + 1
    const dirname = name.slice(0, lastSlash)
    const basename = name.slice(lastSlash, name.lastIndexOf('.'))
    paths.push(`${dirname}__tests__/${basename}.test`)
  }

  copyToClipboard(`jw ${paths.join(' ')}`)
}

const pr = /.+\/.+\/pull\/[0-9]+\/files/
const commit = /.+\/commit[s]?\/.+/

/**
 * Event listeners
 * Uses capture phase so that stopPropagation can block all other listeners
 */
document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.metaKey) return
  if (!pr.test(window.location.pathname) && !commit.test(window.location.pathname)) return // PR page

  switch(e.key) {
    case 'n':
    case 'p':
      e.stopPropagation()
      return navigateFile(e.code)

    case 'h': {
      e.stopPropagation()
      return toggleTests()
    }

    case 'c': {
      e.stopPropagation()
      return copyFileName()
    }

    case 'a': {
      e.stopPropagation()
      return copyCorrespondingTests()
    }
  }
}, true)
