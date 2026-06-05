const root = document.body.dataset.root || '../'
const projectSlug = document.body.dataset.projectSlug

const assetPath = (path) => `${root}${path}`
const isExternalUrl = (url) => /^https?:\/\//.test(url)
const pagePath = (url) => (isExternalUrl(url) ? url : `${root}${url}`)

const escapeHtml = (value = '') =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')

const renderHeader = (site) => {
  const header = document.querySelector('#site-header')
  if (!header) return

  header.innerHTML = `
    <header class="header">
      <div class="header__content">
        <div class="header__logo-container">
          <div class="header__logo-img-cont">
            <img
              src="${assetPath(site.profileImage)}"
              alt="Profile photo"
              class="header__logo-img" />
          </div>
          <span class="header__logo-sub">${escapeHtml(site.name)}</span>
        </div>
        <div class="header__main">
          <ul class="header__links">
            <li class="header__link-wrapper">
              <a href="${root}index.html" class="header__link">Home</a>
            </li>
            <li class="header__link-wrapper">
              <a href="${root}index.html#about" class="header__link">About</a>
            </li>
            <li class="header__link-wrapper">
              <a href="${root}index.html#projects" class="header__link">Projects</a>
            </li>
            <li class="header__link-wrapper">
              <a href="${root}index.html#contact" class="header__link">Contact</a>
            </li>
          </ul>
          <div class="header__main-ham-menu-cont">
            <img
              src="${assetPath('assets/svg/ham-menu.svg')}"
              alt="hamburger menu"
              class="header__main-ham-menu" />
            <img
              src="${assetPath('assets/svg/ham-menu-close.svg')}"
              alt="hamburger menu close"
              class="header__main-ham-menu-close d-none" />
          </div>
        </div>
      </div>
      <div class="header__sm-menu">
        <div class="header__sm-menu-content">
          <ul class="header__sm-menu-links">
            <li class="header__sm-menu-link">
              <a href="${root}index.html">Home</a>
            </li>
            <li class="header__sm-menu-link">
              <a href="${root}index.html#about">About</a>
            </li>
            <li class="header__sm-menu-link">
              <a href="${root}index.html#projects">Projects</a>
            </li>
            <li class="header__sm-menu-link">
              <a href="${root}index.html#contact">Contact</a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  `
}

const renderFooter = (site) => {
  const footer = document.querySelector('#site-footer')
  if (!footer) return

  const socialLinks = site.socialLinks
    .map(
      (link, index) => `
        <a
          target="_blank"
          rel="noreferrer"
          href="${escapeHtml(link.url)}">
          <img
            class="main-footer__icon${index === site.socialLinks.length - 1 ? ' main-footer__icon--mr-none' : ''}"
            src="${assetPath(link.icon)}"
            alt="${escapeHtml(link.label)}" />
        </a>
      `
    )
    .join('')

  footer.innerHTML = `
    <footer class="main-footer">
      <div class="main-container">
        <div class="main-footer__upper">
          <div class="main-footer__row main-footer__row-1">
            <h2 class="heading heading-sm main-footer__heading-sm">
              <span>Social</span>
            </h2>
            <div class="main-footer__social-cont">
              ${socialLinks}
            </div>
          </div>
          <div class="main-footer__row main-footer__row-2">
            <h4 class="heading heading-sm text-lt">${escapeHtml(site.name)}</h4>
            <p class="main-footer__short-desc">
              ${escapeHtml(site.footerDescription)}
            </p>
          </div>
        </div>
      </div>
    </footer>
  `
}

const renderDevice = (project) => {
  if (project.device === 'phone') {
    return `
      <div class="projects__phone-placeholder">
        <div class="projects__phone">
          <div class="projects__phone-speaker"></div>
          <div class="projects__phone-screen">
            <video
              class="projects__phone-screen-media"
              controls
              playsinline
              preload="metadata">
              <source src="${assetPath(project.video)}" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    `
  }

  return `
    <div class="projects__row-img-cont">
      <div class="projects__laptop-preview">
        <img
          src="${assetPath('assets/png/project-mockup-example.png')}"
          alt="Laptop mockup"
          class="projects__row-img"
          loading="lazy" />
        <video
          class="projects__laptop-video"
          controls
          playsinline
          preload="metadata">
          <source src="${assetPath(project.video)}" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  `
}

const renderProjectButton = ({
  label,
  url,
  style = 'primary',
  unavailableLabel = 'Unavailable',
}) => {
  if (!url) {
    return `
      <span
        class="btn btn--med btn--disabled project-details__links-btn"
        aria-disabled="true">
        ${escapeHtml(label)} ${escapeHtml(unavailableLabel)}
      </span>
    `
  }

  const isExternal = isExternalUrl(url)
  const className =
    style === 'secondary'
      ? 'btn btn--med btn--theme-inv project-details__links-btn'
      : 'btn btn--med btn--theme project-details__links-btn'

  return `
    <a
      href="${escapeHtml(pagePath(url))}"
      class="${className}"
      ${isExternal ? 'target="_blank" rel="noreferrer"' : ''}>
      ${escapeHtml(label)}
    </a>
  `
}

const renderLinks = (project) =>
  [
    { label: 'Back to Projects', url: 'index.html#projects', style: 'primary' },
    {
      label: 'Hosted Link',
      url: project.links?.hosted,
      style: 'secondary',
      unavailableLabel: project.links?.unavailableLabel,
    },
    {
      label: 'Code',
      url: project.links?.code,
      style: 'secondary',
      unavailableLabel: project.links?.unavailableLabel,
    },
  ]
    .map(renderProjectButton)
    .join('')

const renderProject = (project) => {
  const container = document.querySelector('#project-detail')
  if (!container) return

  document.title = `${project.title} Details | Manar Alshaikh`
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription) metaDescription.setAttribute('content', project.description)

  container.innerHTML = `
    <section class="project-cs-hero">
      <div class="project-cs-hero__content">
        <h1 class="heading-primary">${escapeHtml(project.title)}</h1>
        <div class="project-cs-hero__info">
          <p class="text-primary">${escapeHtml(project.description)}</p>
        </div>
        <div class="project-cs-hero__cta">
          <a href="${root}index.html#projects" class="btn btn--bg">Back to Projects</a>
        </div>
      </div>
    </section>

    <section class="project-details">
      <div class="main-container">
        <div class="project-details__content">
          <div class="project-details__showcase-img-cont">
            ${renderDevice(project)}
          </div>

          <div class="project-details__content-main">
            <div class="project-details__desc">
              <h3 class="project-details__content-title">Project Overview</h3>
              ${project.overview
                .map(
                  (paragraph) => `
                    <p class="project-details__desc-para">
                      ${escapeHtml(paragraph)}
                    </p>
                  `
                )
                .join('')}
            </div>

            <div class="project-details__tools-used">
              <h3 class="project-details__content-title">Tools Used</h3>
              <div class="skills">
                ${project.tools
                  .map(
                    (tool) => `
                      <div class="skills__skill">${escapeHtml(tool)}</div>
                    `
                  )
                  .join('')}
              </div>
            </div>

            <div class="project-details__links">
              <h3 class="project-details__content-title">Project Links</h3>
              <div class="project-details__links-actions">
                ${renderLinks(project)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
}

const renderError = () => {
  const container = document.querySelector('#project-detail')
  if (!container) return

  container.innerHTML = `
    <section class="project-cs-hero">
      <div class="project-cs-hero__content">
        <h1 class="heading-primary">Project Not Found</h1>
        <div class="project-cs-hero__info">
          <p class="text-primary">
            This project page could not load. Please return to the projects section.
          </p>
        </div>
        <div class="project-cs-hero__cta">
          <a href="${root}index.html#projects" class="btn btn--bg">Back to Projects</a>
        </div>
      </div>
    </section>
  `
}

fetch(assetPath('assets/data/projects.json'))
  .then((response) => {
    if (!response.ok) throw new Error('Project data failed to load')
    return response.json()
  })
  .then((data) => {
    const project = data.projects.find((item) => item.slug === projectSlug)
    renderHeader(data.site)
    renderFooter(data.site)

    if (!project) {
      renderError()
      return
    }

    renderProject(project)
    window.initSiteInteractions?.()
    window.fitLaptopVideosToScreens?.()
  })
  .catch(() => {
    renderError()
  })
