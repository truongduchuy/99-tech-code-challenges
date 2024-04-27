
function sumToN1(num) {
    let sum = 0
    for (let i = 1; i <= num; i++) {
        sum += i
    }
    return sum
}

function sumToN2(num) {
    let sum = 0
    const arr = Array.from({ length: num }, (_, i) => i + 1)
    const mid = Math.floor(num / 2)
    for (let i = 0; i < mid; i++) {
        sum += arr[i] + arr[arr.length - 1 - i]
    }
    if (num % 2 !== 0) {
        sum += arr[mid]
    }
    return sum
}

function sumToN3(num) {
    const mid = Math.floor(num / 2)
    let sum = (1 + num) * mid
    if (num % 2 !== 0) {
        sum += mid + 1
    }
    return sum
}