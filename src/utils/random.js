export function getRandomString(length = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const maxLength = chars.length
    let str = ''
    for (let i = 0; i < length; i++) {
        str = str + chars.charAt(Math.floor(Math.random() * maxLength))
    }
    return str
}