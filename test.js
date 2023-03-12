let a = []
let b = {}

console.log(a instanceof Array)
console.log(a instanceof Object)
console.log(b instanceof Object)
console.log(b instanceof Array)

let objs = [
    {
        a: 1,
        b: 2,
    },
    {
        a: 11,
        b: 22,
    },
    {
        a: 111,
        b: 222,
    }
]
console.log(objs.map(o => {
    o.id = 555
    return o
}).map(o => Object.values(o)))