class BcPopover extends HTMLElement {
  connectedCallback() {
    if (this.dataset.initialized) return

    const trigger = this.querySelector(':scope > button')
    const content = this.querySelector(':scope > [data-popover]')

    if (!trigger || !content) {
      const missing = []
      if (!trigger) missing.push('trigger')
      if (!content) missing.push('content')
      console.error(`Popover initialisation failed. Missing element(s): ${missing.join(', ')}`, this)
      return
    }

    const closePopover = (focusOnTrigger = true) => {
      if (trigger.getAttribute('aria-expanded') === 'false') return
      trigger.setAttribute('aria-expanded', 'false')
      content.setAttribute('aria-hidden', 'true')
      if (focusOnTrigger) {
        trigger.focus()
      }
    }

    const openPopover = () => {
      document.dispatchEvent(
        new CustomEvent('basecoat:popover', {
          detail: { source: this },
        })
      )

      const elementToFocus = content.querySelector('[autofocus]')
      if (elementToFocus) {
        content.addEventListener(
          'transitionend',
          () => {
            elementToFocus.focus()
          },
          { once: true }
        )
      }

      trigger.setAttribute('aria-expanded', 'true')
      content.setAttribute('aria-hidden', 'false')
    }

    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true'
      if (isExpanded) {
        closePopover()
      } else {
        openPopover()
      }
    })

    this.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closePopover()
      }
    })

    document.addEventListener('click', (event) => {
      if (!this.contains(event.target)) {
        closePopover()
      }
    })

    document.addEventListener('basecoat:popover', (event) => {
      if (event.detail.source !== this) {
        closePopover(false)
      }
    })

    this.dataset.initialized = 'true'
    this.dispatchEvent(new CustomEvent('basecoat:initialized'))
  }
}
customElements.define('bc-popover', BcPopover)
