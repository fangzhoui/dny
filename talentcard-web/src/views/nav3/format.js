import store from '../../vuex'
export const talenttypes = [
    { text: "高端人才", value: 10 },
    { text: "专技人才", value: 9 },
    { text: "高学历人才", value: 8 },
    { text: "乡土人才", value: 7 },
    { text: "文化社科人才", value: 6 },
    { text: "高技能人才", value: 5 },
    { text: "企业经营管理人才", value: 4 },
    { text: "寓外人才", value: 3 },
    { text: "柔性人才", value: 2 },
    { text: "基础人才", value: 1 }
]
const selectMap = {
    "category": talenttypes,
    "honour": getConfig()
}

function getConfig () {
    let config = []
    try {
        config = JSON.parse(window.localStorage.getItem('config')).honours
    } catch(e) {}
    return config
}
export const categoryFormatterFn = (row, column, cellValue) => {
    const type = column.property
    const arr = selectMap[type]
    let cellValueStr = cellValue && cellValue.toString() || ''
    if (cellValueStr) {
        const cellArr = cellValueStr.split(',')
        let str = ''
        arr.map((i) => {
            cellArr.map((j) => {
                if (j == i.type || j == i.value) {
                    str += i.text + ','
                }
            })
        })
        if (str) {
            return str.slice(0, -1)
        } else {
            return '无'
        }
    } else {
        return '无'
    }
}
