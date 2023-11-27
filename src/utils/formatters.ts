export const formatPhone = (phone?: string, defaultValue: string = ''): string => {
    if (!phone) {
        return defaultValue
    }

    return phone
}

export const booleanToYesNo = (val: boolean): string => {
    return val ? 'Yes' : 'No'
}

export const formatDate = (date?: string, defaultValue: string = ''): string => {
    if (!date) {
        return defaultValue
    }

    return date;
}

export const formatGender = (gender?: string, defaultValue: string = ''): string => {
    if (!gender) {
        return defaultValue
    }

    return gender;
}
