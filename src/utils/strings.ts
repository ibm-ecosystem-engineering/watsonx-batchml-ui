
export const isString = (val: unknown): val is string => {
    return !!(val) && (typeof val === 'string')
}

export const joinList = (list: string[], join: string = 'and'): string => {
    if (list.length === 0) {
        return ''
    }

    if (list.length === 1) {
        return list[0]
    }

    if (list.length === 2) {
        return list.join(' ' + join + ' ')
    }

    return joinList([list.slice(0, list.length - 1).join(', '), list.slice(list.length - 1)[0]], join)
}
