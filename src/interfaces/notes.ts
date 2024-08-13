import { GradeEnum } from '@/constants/enums'

export interface GradeCreateModel {
  gradeType: GradeEnum
}
export interface NoteCreateModel {
  content: string
}
export interface NoteInfo {
  noteId: string
  parentNoteId: string | null
  userId: string
  username: string
  created: string
  content: string
  grades: Array<GradeInfo>
  notes: Array<NoteInfo>
}

export interface GradeInfo {
  gradeId: string
  noteId: string
  userId: string
  username: string
  gradeType: GradeEnum
}
