
export const isString = (val: unknown): val is string => {
    return !!(val) && (typeof val === 'string')
}
