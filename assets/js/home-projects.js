const renderHomeDevice = (project) => {
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
              <source src="./${project.video}" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    `
  }

  return `
    <div class="projects__laptop-preview">
      <img
        src="./assets/png/project-mockup-example.png"
        alt="Laptop mockup"
        class="projects__row-img"
        loading="lazy" />
      <video
        class="projects__laptop-video"
        controls
        playsinline
        preload="metadata">
        <source src="./${project.video}" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  `
}

const renderHomeProjects = (projects) => {
  const container = document.querySelector('#projects-list')
  if (!container) return

  container.innerHTML = projects
    .map(
      (project) => `
        <div class="projects__row">
          <div class="projects__row-img-cont">
            ${renderHomeDevice(project)}
          </div>
          <div class="projects__row-content">
            <h3 class="projects__row-content-title">${project.title}</h3>
            <p class="projects__row-content-desc">${project.description}</p>
            <a
              href="./projects/${project.slug}/"
              class="btn btn--med btn--theme dynamicBgClr"
              target="_blank">
              See More Details
            </a>
          </div>
        </div>
      `
    )
    .join('')

  window.initSiteInteractions?.()
  window.fitLaptopVideosToScreens?.()
}

fetch('./assets/data/projects.json')
  .then((response) => {
    if (!response.ok) throw new Error('Project data failed to load')
    return response.json()
  })
  .then((data) => renderHomeProjects(data.projects))
  .catch(() => {
    const container = document.querySelector('#projects-list')
    if (!container) return

    container.innerHTML = `
      <p class="projects__row-content-desc">
        Project data could not load. Please refresh the page or run the site
        through a local server.
      </p>
    `
  })
