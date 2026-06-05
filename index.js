const initMobileMenu = () => {
  const menuButton = document.querySelector('.header__main-ham-menu-cont')
  const smallMenu = document.querySelector('.header__sm-menu')
  const openIcon = document.querySelector('.header__main-ham-menu')
  const closeIcon = document.querySelector('.header__main-ham-menu-close')
  const smallMenuLinks = document.querySelectorAll('.header__sm-menu-link')

  if (!menuButton || !smallMenu || !openIcon || !closeIcon) return
  if (menuButton.dataset.menuReady === 'true') return
  menuButton.dataset.menuReady = 'true'

  const closeMenu = () => {
    smallMenu.classList.remove('header__sm-menu--active')
    openIcon.classList.remove('d-none')
    closeIcon.classList.add('d-none')
  }

  menuButton.addEventListener('click', () => {
    smallMenu.classList.toggle('header__sm-menu--active')
    openIcon.classList.toggle('d-none')
    closeIcon.classList.toggle('d-none')
  })

  smallMenuLinks.forEach((link) => {
    link.addEventListener('click', closeMenu)
  })
}

const initHeaderLogo = () => {
  const headerLogoContainer = document.querySelector('.header__logo-container')
  if (!headerLogoContainer) return
  if (headerLogoContainer.dataset.logoReady === 'true') return
  headerLogoContainer.dataset.logoReady = 'true'

  headerLogoContainer.addEventListener('click', () => {
    const root = document.body.dataset.root || './'
    location.href = `${root}index.html`
  })
}

const getLaptopScreenBounds = (image) => {
  const width = image.naturalWidth
  const height = image.naturalHeight
  if (!width || !height) return null

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d', { willReadFrequently: true })
  context.drawImage(image, 0, 0)

  const pixels = context.getImageData(0, 0, width, height).data
  const visited = new Uint8Array(width * height)
  const maxY = Math.floor(height * 0.82)
  let best = null

  const isScreenWhite = (index) => {
    const offset = index * 4
    return (
      pixels[offset + 3] > 220 &&
      pixels[offset] > 245 &&
      pixels[offset + 1] > 245 &&
      pixels[offset + 2] > 245
    )
  }

  for (let y = 0; y < maxY; y++) {
    for (let x = 0; x < width; x++) {
      const start = y * width + x
      if (visited[start] || !isScreenWhite(start)) continue

      const stack = [start]
      visited[start] = 1
      let area = 0
      let minX = x
      let maxX = x
      let minY = y
      let componentMaxY = y

      while (stack.length) {
        const current = stack.pop()
        const cx = current % width
        const cy = Math.floor(current / width)

        area++
        if (cx < minX) minX = cx
        if (cx > maxX) maxX = cx
        if (cy < minY) minY = cy
        if (cy > componentMaxY) componentMaxY = cy

        const neighbors = [
          current - 1,
          current + 1,
          current - width,
          current + width,
        ]

        neighbors.forEach((next) => {
          if (next < 0 || next >= visited.length || visited[next]) return
          const nx = next % width
          const ny = Math.floor(next / width)
          if (ny >= maxY || Math.abs(nx - cx) > 1) return
          if (!isScreenWhite(next)) return

          visited[next] = 1
          stack.push(next)
        })
      }

      if (!best || area > best.area) {
        best = { area, minX, maxX, minY, maxY: componentMaxY }
      }
    }
  }

  if (!best) return null

  const bleedX = 0.012
  const bleedTop = 0.018
  const bleedBottom = 0.045
  const left = Math.max(0, best.minX / width - bleedX)
  const top = Math.max(0, best.minY / height - bleedTop)
  const right = Math.min(1, best.maxX / width + bleedX)
  const bottom = Math.min(1, best.maxY / height + bleedBottom)

  return {
    left: (left * 100).toFixed(2),
    top: (top * 100).toFixed(2),
    width: ((right - left) * 100).toFixed(2),
    height: ((bottom - top) * 100).toFixed(2),
  }
}

const fitLaptopVideosToScreens = () => {
  const previews = document.querySelectorAll('.projects__laptop-preview')

  previews.forEach((preview) => {
    const image = preview.querySelector('.projects__row-img')
    if (!image) return

    const applyScreenBounds = () => {
      const bounds = getLaptopScreenBounds(image)
      if (!bounds) return

      preview.style.setProperty('--laptop-screen-left', `${bounds.left}%`)
      preview.style.setProperty('--laptop-screen-top', `${bounds.top}%`)
      preview.style.setProperty('--laptop-screen-width', `${bounds.width}%`)
      preview.style.setProperty('--laptop-screen-height', `${bounds.height}%`)
    }

    if (image.complete) {
      applyScreenBounds()
    } else {
      image.addEventListener('load', applyScreenBounds, { once: true })
    }
  })
}

const initProjectButtonLogging = () => {
  document.querySelectorAll('.projects__row-content .btn').forEach((button) => {
    if (button.dataset.logReady === 'true') return
    button.dataset.logReady = 'true'

    button.addEventListener('click', () => {
      const row = button.closest('.projects__row')
      const title = row?.querySelector('.projects__row-content-title')?.textContent

      console.log('Opening project details:', {
        title: title?.trim(),
        href: button.getAttribute('href'),
      })
    })
  })
}

const initSiteInteractions = () => {
  initMobileMenu()
  initHeaderLogo()
  fitLaptopVideosToScreens()
  initProjectButtonLogging()
}

window.initSiteInteractions = initSiteInteractions
window.fitLaptopVideosToScreens = fitLaptopVideosToScreens

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSiteInteractions)
} else {
  initSiteInteractions()
}
