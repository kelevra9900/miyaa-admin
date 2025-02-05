export interface BlogResponse {
  data: Note[]
  total: number
  totalPages: number
  currentPage: number
  perPage: number
}

export interface Note {
  id: number | string
  image: string
  content: string
  title: string
  createdBy: number
  is_approved: boolean
  category_id?: number
  slug: string
  createdAt: string
  updatedAt: string
}

export interface CreateInputNote extends Note {
  noteId?: number
}
