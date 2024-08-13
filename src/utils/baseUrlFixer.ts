const fixUrl = (): void => {
  const href = window.location.href
    .replaceAll(/[/]{2,}/g, '/')
    .replace(':/', '://')

  if (window.history.replaceState) {
    // prevents browser from storing history with each change:
    window.history.replaceState({}, document.title, href)
  }
}

fixUrl()
