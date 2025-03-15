export type MakeOptional<T, K extends keyof T> = Partial<Pick<T, K>> &
    Omit<T, K>;
