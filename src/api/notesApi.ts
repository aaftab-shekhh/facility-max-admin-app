import {instance, instanceFile} from './instances';

export const notesAPI = {
  getNotes(params: {searchId: string; offset?: number; limit?: number}) {
    return instance.get('notes/many', {params});
  },

  createNote(note: any) {
    return instanceFile.post('notes/create-note', note);
  },
};
