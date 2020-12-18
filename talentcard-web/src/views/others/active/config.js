export const activityStatus = {
    2: { label: '已通过', value: 2 },
    5: { label: '用户取消', value: 5 },
    4: { label: '管理员取消', value: 4 },
    6: { label: '报名中', value: 6 },
    7: { label: '已结束', value: 7 },
    8: { label: '已下架', value: 8 },
    10: { label: '活动进行中', value: 10 },

    
}

export const approvalStatus = {
    1: { label: '提交待审批', value: 1 },
    2: { label: '已通过', value: 2 },
    3: { label: '已驳回', value: 3 },
    4: { label: '管理员取消', value: 4 },
    5: { label: '用户取消', value: 5 },
    7: { label: '已结束', value: 7 },
    10: { label: '活动进行中', value: 10 }
}


export const activityType = {
    2: { label: '后台创建', value: 2 },
    1: { label: '小程序发起', value: 1 }
}

export const sexConfig = {
    1: { label: '男', value: 1 },
    2: { label: '女', value: 2 }
}

export const talentStatus = {
    1: { label: '报名', value: 1 },
    2: { label: '已取消', value: 2 }
}

export const timeAreas = {
    // 1: { label: '00:00 ~ 00:30', value: 1 },
    // 2: { label: '00:30 ~ 01:00', value: 2 },
    // 3: { label: '01:00 ~ 01:30', value: 3 },
    // 4: { label: '01:30 ~ 02:00', value: 4 },
    // 5: { label: '02:00 ~ 02:30', value: 5 },
    // 6: { label: '02:30 ~ 03:00', value: 6 },
    // 7: { label: '03:00 ~ 03:30', value: 7 },
    // 8: { label: '03:30 ~ 04:00', value: 8 },
    // 9: { label: '04:00 ~ 04:30', value: 9 },
    // 10: { label: '04:30 ~ 05:00', value: 10 },
    // 11: { label: '05:00 ~ 05:30', value: 11 },
    // 12: { label: '05:30 ~ 06:00', value: 12 },
    // 13: { label: '06:00 ~ 06:30', value: 13 },
    // 14: { label: '06:30 ~ 07:00', value: 14 },
    15: { label: '07:00 ~ 07:30', value: 15 },
    16: { label: '07:30 ~ 08:00', value: 16 },
    17: { label: '08:00 ~ 08:30', value: 17 },
    18: { label: '08:30 ~ 09:00', value: 18 },
    19: { label: '09:00 ~ 09:30', value: 19 },
    20: { label: '09:30 ~ 10:00', value: 20 },
    21: { label: '10:00 ~ 10:30', value: 21 },
    22: { label: '10:30 ~ 11:00', value: 22 },
    23: { label: '11:00 ~ 11:30', value: 23 },
    24: { label: '11:30 ~ 12:00', value: 24 },
    25: { label: '12:00 ~ 12:30', value: 25 },
    26: { label: '12:30 ~ 13:00', value: 26 },
    27: { label: '13:00 ~ 13:30', value: 27 },
    28: { label: '13:30 ~ 14:00', value: 28 },
    29: { label: '14:00 ~ 14:30', value: 29 },
    30: { label: '14:30 ~ 15:00', value: 30 },
    31: { label: '15:00 ~ 15:30', value: 31 },
    32: { label: '15:30 ~ 16:00', value: 32 },
    33: { label: '16:00 ~ 16:30', value: 33 },
    34: { label: '16:30 ~ 17:00', value: 34 },
    35: { label: '17:00 ~ 17:30', value: 35 },
    36: { label: '17:30 ~ 18:00', value: 36 },
    37: { label: '18:00 ~ 18:30', value: 37 },
    38: { label: '18:30 ~ 19:00', value: 38 },
    39: { label: '19:00 ~ 19:30', value: 39 },
    40: { label: '19:30 ~ 20:00', value: 40 },
    41: { label: '20:00 ~ 20:30', value: 41 },
    42: { label: '20:30 ~ 21:00', value: 42 },
    43: { label: '21:00 ~ 21:30', value: 43 },
    44: { label: '21:30 ~ 22:00', value: 44 },
    45: { label: '22:00 ~ 22:30', value: 45 },
    46: { label: '22:30 ~ 23:00', value: 46 },
    // 47: { label: '23:00 ~ 23:30', value: 47 },
    // 48: { label: '23:30 ~ 24:00', value: 48 }
}


export const getTimes = (num) => {
    num = Number(num)
    if (!num) {
        return
    }

    let js = (num / 2) | 0;
    let jo = num & 1;
    let start, end;
    jo ? (js < 10 ? start = `0${js}:00` : start = `${js}:00`) : (js <= 10 ? start = `0${js - 1}:30` : start = `${js - 1}:30`);
    jo ? (js < 10 ? end = `0${js}:30` : end = `${js}:30`) : (js < 10 ? end = `0${js}:00` : end = `${js}:00`);
    return [
        start,
        end
    ]
}

export const getTimesMap = (arr) => {
    if (!(arr instanceof Array)) {
        return
    }
    let map = new Map()
    arr.map((i) => {
        i.map((j) => {
            if (map.get(j)) {
                map.set(j, 2)
            } else {
                map.set(j, 1)
            }
        })
    })
    return map
}

export const getTimesArr = (arr) => {
    if (!(arr instanceof Array)) {
        return
    }
    arr = arr.sort((a, b) => Number(a) - Number(b))
    const newArr = arr.map((i) => {
        return getTimes(i)
    })
    const timeMap = getTimesMap(newArr)
    for (let i of timeMap) {
        let flag = i[1] & 1
        if (!flag) {
            timeMap.delete(i[0])
        }
    }
    const JsonArr = timeMap.toJSON()
    const timeArr = []
    toString(JsonArr, timeArr)
    return timeArr.toString().replace(/\,/g, '、')
}

export const toString = (JsonArr, timeArr) => {
    const flag = JsonArr.length >= 2
    if (flag) {
        timeArr.push(`${JsonArr[0][0]}~${JsonArr[1][0]}`)
        JsonArr = JsonArr.splice(2)
        toString(JsonArr, timeArr)
    }
}
