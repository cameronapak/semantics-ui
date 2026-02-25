class BcSidebar extends HTMLElement {
  connectedCallback() {
    if (this.dataset.initialized) return

    const initialOpen = this.hasAttribute('open')
    const initialMobileOpen = this.getAttribute('mobile-open') === 'true'
    const breakpoint = parseInt(this.getAttribute('breakpoint')) || 768

    let open = breakpoint > 0 ? (window.innerWidth >= breakpoint ? initialOpen : initialMobileOpen) : initialOpen

    const updateState = () => {
      this.setAttribute('aria-hidden', !open)
      if (open) {
        this.removeAttribute('inert')
      } else {
        this.setAttribute('inert', '')
      }
    }

    const setState = (state) => {
      open = state
      updateState()
    }

    const sidebarId = this.id

    document.addEventListener('basecoat:sidebar', (event) => {
      if (event.detail?.id && event.detail.id !== sidebarId) return

      switch (event.detail?.action) {
        case 'open':
          setState(true)
          break
        case 'close':
          setState(false)
          break
        default:
          setState(!open)
          break
      }
    })

    this.addEventListener('click', (event) => {
      const target = event.target
      const nav = this.querySelector('nav')

      const isMobile = window.innerWidth < breakpoint

      if (isMobile && target.closest('a, button') && !target.closest('[data-keep-mobile-sidebar-open]')) {
        if (document.activeElement) document.activeElement.blur()
        setState(false)
        return
      }

      if (target === this || (nav && !nav.contains(target))) {
        if (document.activeElement) document.activeElement.blur()
        setState(false)
      }
    })

    updateState()
    this.dataset.initialized = 'true'
    this.dispatchEvent(new CustomEvent('basecoat:initialized'))
  }
}
customElements.define('bc-sidebar', BcSidebar)
