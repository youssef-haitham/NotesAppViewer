export enum Colors {
  YELLOW = 'YELLOW',
  BLUE = 'BLUE',
  GREY = 'GREY',
}

export interface Note {
  id: string;
  title: string;
  content: string;
  backgroundColor: Colors;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteRequest {
  title: string;
  content: string;
  backgroundColor: Colors;
}

export interface UpdateNoteRequest {
  title: string;
  content: string;
  backgroundColor: Colors;
}

