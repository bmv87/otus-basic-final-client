import { defineStore } from 'pinia'
import { hosts as $h } from '@/plugins/host-configurator'
import { URL_USERS, URL_NOTES } from '@/constants/urls'
import { useAxiosStore } from '@/store/axios'
import { useErrorsStore } from '@/store/errors'
import { NoteCreateModel, NoteInfo, GradeCreateModel } from '@/interfaces/notes'

export interface IState {
  notes: Array<NoteInfo>
}

export const useNotesStore = defineStore('notes', {
  // convert to a function
  state: (): IState => {
    return {
      notes: []
    }
  },
  actions: {
    // mutations can now become actions, instead of `state` as first argument use `this`
    async getUserNotes (userId: string) {
      const requestParams = {
        url: `${$h().getServer()}${URL_USERS}/${userId}/notes`
      }
      const axiosStore = useAxiosStore()

      const resp = await axiosStore.getAxiosRequest(requestParams)
      const errorsStore = useErrorsStore()
      await errorsStore.hideError()
      const data = resp?.data as Array<NoteInfo>
      this.notes = data
    },
    async addNote (model: NoteCreateModel) {
      const requestParams = {
        url: `${$h().getServer()}${URL_NOTES}`,
        model
      }
      const axiosStore = useAxiosStore()

      await axiosStore.postAxiosRequest(requestParams)
      const errorsStore = useErrorsStore()
      await errorsStore.hideError()
    },
    async addCommentForNote (noteId: string, model: NoteCreateModel) {
      const requestParams = {
        url: `${$h().getServer()}${URL_NOTES}/${noteId}`,
        model
      }
      const axiosStore = useAxiosStore()

      await axiosStore.postAxiosRequest(requestParams)
      const errorsStore = useErrorsStore()
      await errorsStore.hideError()
    },
    async editNote (noteId: string, model: NoteCreateModel) {
      const requestParams = {
        url: `${$h().getServer()}${URL_NOTES}/${noteId}`,
        model
      }
      const axiosStore = useAxiosStore()

      await axiosStore.putAxiosRequest(requestParams)
      const errorsStore = useErrorsStore()
      await errorsStore.hideError()
    },
    async deleteNote (noteId: string) {
      const requestParams = {
        url: `${$h().getServer()}${URL_NOTES}/${noteId}`
      }
      const axiosStore = useAxiosStore()

      await axiosStore.deleteAxiosRequest(requestParams)
      const errorsStore = useErrorsStore()
      await errorsStore.hideError()
    },
    async addGrade (noteId: string, model: GradeCreateModel) {
      const requestParams = {
        url: `${$h().getServer()}${URL_NOTES}/${noteId}/grades`,
        model
      }
      const axiosStore = useAxiosStore()

      await axiosStore.postAxiosRequest(requestParams)
      const errorsStore = useErrorsStore()
      await errorsStore.hideError()
    },
    async clearUserNotes () {
      this.notes = []
    }
  }
})
