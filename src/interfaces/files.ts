
export interface FileUploadingResponse {
  fileId: string
  fileName: string
}
export interface FileListItem {
  fileId: string
  fileName: string
  extension: string
}

export interface FileItem {
  file: globalThis.File
  name: string
  size: number
  type: string
}
