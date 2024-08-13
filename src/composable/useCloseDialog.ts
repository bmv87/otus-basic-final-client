const useCloseDialog = () => {
  const closeDialog = (dialogOptions: any) => {
    if (dialogOptions) {
      Object.keys(dialogOptions).forEach(key => {
        dialogOptions[key] = key === 'show' ? false : null
      })
    }
  }
  return closeDialog
}

export default useCloseDialog
