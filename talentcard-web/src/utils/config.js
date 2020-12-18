
// 用于搜索栏的 常量
export let {
  bacthStatusMap,
  cardTypes,
  categories,
  certificationTypes,
  cityList,
  educations,
  equityList,
  honours,
  industries,
  natureTypes,
  placeTypes,
  politicals,
  qualities,
  recordTypes,
  sexs,
  states,
  talentSources,
  titles,
} = JSON.parse(localStorage.getItem("config"));

export const obj = {
  states,
  titles,
  qualities,
  educations,
  sexs,
  categories,
  honours,
  politicals,
  industries,
  bacthStatusMap,
  cardTypes,
  talentSources,
  certificationTypes,
  recordTypes,
  placeTypes,
  natureTypes,
};
export const filterData = (name, value) => {
  try {
    const config = obj[name][value].label;
    return config;
  } catch (e) {
    return "无";
  }
};

/**
 * @param {查询字段} label
 * @param {被查询对象} obj
 */
export const findIdByLabel = (label, obj) => {
  const findItem = Object.values(obj).find((item) => {
    return item.label == label;
  });
  if (findItem) {
    return findItem.value;
  } else {
    return "-";
  }
};

export const tableFormater = (cellValue, type) => {
  try {
    const config = obj[type][cellValue].label;
    return config;
  } catch (e) {
    return "无";
  }
};
