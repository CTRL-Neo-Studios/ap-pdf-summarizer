export interface CursorPagination {
    cursor: number,
    pageSize: number
}

export interface OffsetPagination {
    offset: number,
    limit: number
}

export interface UserMe {
    user: {
        id: string,
        email: string
    },
    profile: Profile | null
}