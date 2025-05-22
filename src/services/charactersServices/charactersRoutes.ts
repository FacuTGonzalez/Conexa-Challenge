const BASE_URL = `${process.env.NEXT_PUBLIC_API}/character`;

export const charactersRoutes = {
    getAll : ( params?: string) => `${BASE_URL}/?${params}`
}