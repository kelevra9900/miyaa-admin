
export type SectorRegistration = {
    name: string
  }
  
  export type sectorPargination = {
      data: SectorReponse[]
      total: number
      totalPages: number
      hasNextPage: boolean
      hasPreviousPage: boolean
    }
    
    export interface SectorReponse {
      id: number
      name: string
      createdAt: string,
      updateAt: string,

    }