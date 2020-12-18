import axios from "axios";
import { Message } from "element-ui";
import qs from "qs";
import router from "./routes";
// 创建一个 axios 实例
let instance = axios.create({
  baseURL: "",
  timeout: 5000,
  headers: {},
});
let loginFlag = true;

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    if (config.data && config.method === "get") {
      config.url = config.url + "?" + config.data;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    const { status, data } = response;
    if (status === undefined) {
      Message.error("未知异常，请联系管理员");
    } else {
      if (data.status == 2104 || data.status == 2741) {
        if (loginFlag) {
          loginFlag = false;
          Message({
            type: "error",
            message: "用户过期",
            customClass: "zZindex",
          });
          router.replace({
            path: "/login",
          });
        }
      } else {
        const { flag, message } = statusCallBack(data.status);
        if (flag) {
          return data.data;
        } else {
          if (message != "pageTips") {
            Message({
              type: "error",
              message: message,
              customClass: "zZindex",
            });
          }
          return Promise.reject({
            status: data.status,
            message: message,
          });
        }
      }
    }
  },
  (error) => {
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = "请求错误";
          break;
        case 401:
          error.message = "未授权，请登录";
          break;
        case 403:
          error.message = "拒绝访问";
          break;
        case 404:
          error.message = `请求地址出错: ${error.response.config.url}`;
          break;
        case 408:
          error.message = "请求超时";
          break;
        case 500:
          error.message = "服务器内部错误";
          break;
        case 501:
          error.message = "服务未实现";
          break;
        case 502:
          error.message = "网关错误";
          break;
        case 503:
          error.message = "服务不可用";
          break;
        case 504:
          error.message = "网关超时";
          break;
        case 505:
          error.message = "HTTP版本不受支持";
          break;
        default:
          error.message = "服务器异常，请联系管理员";
          break;
      }
      Message.error(error.message);
    }
    return Promise.reject(error);
  }
);

export default instance;

const statusCallBack = (status) => {
  let message, flag;
  switch (status) {
    case 1000:
      flag = true;
      message = "请求成功";
      break;
    case 2310:
      flag = false;
      message = "人卡表里已经存在待使用的卡了，最多同时只能有一张卡";
      break;
    case 2320:
      flag = false;
      message = "会员卡创建失败";
      break;
    case 2321:
      flag = false;
      message = "会员卡背景图CDN上传失败";
      break;
    case 2322:
      flag = false;
      message = "会员卡人数不为0，删除失败";
      break;
    case 2323:
      flag = false;
      message = "会员卡删除失败，微信服务器原因";
      break;
    case 2324:
      flag = false;
      message = "会员卡编辑失败，啥参数都没给啊";
      break;
    case 2325:
      flag = false;
      message = "会员卡logo图CDN上传失败";
      break;
    case 2326:
      flag = false;
      message = "已存在基础卡";
      break;
    case 2327:
      flag = false;
      message = "会员卡logo图CDN上传失败";
      break;
    case 2328:
      flag = false;
      message = "此卡片前缀已存在";
      break;
    case 2330:
      flag = false;
      message = "激活失败";
      break;
    case 2100:
      flag = false;
      message = "用户名错误";
      break;
    case 2101:
      flag = false;
      message = "密码错误";
      break;
    case 2102:
      flag = false;
      message = "验证码过期";
      break;
    case 2103:
      flag = false;
      message = "验证码错误";
      break;
    case 2105:
      flag = false;
      message = "旧密码输入错误";
      break;
    case 2106:
      flag = false;
      message = "用户名已存在";
      break;
    case 2107:
      flag = false;
      message = "新建用户失败";
      break;
    case 2108:
      flag = false;
      message = "编辑用户失败";
      break;
    case 2109:
      flag = false;
      message = "管理员更新密码失败";
      break;
    case 2110:
      flag = false;
      message = "删除用户失败";
      break;
    case 2111:
      flag = false;
      message = "角色列表查询失败";
      break;
    case 2112:
      flag = false;
      message = "认证审批记录插入失败";
      break;
    case 2113:
      flag = false;
      message = "人才表更新失败";
      break;
    case 2114:
      flag = false;
      message = "认证表更新失败";
      break;
    case 2115:
      flag = false;
      message = "当前用户没有审批需求";
      break;
    case 2165:
      flag = false;
      message = "当前未有人才卡";
      break;
    case 2368:
      flag = false;
      message = "更新学历表状态失败";
      break;
    case 2369:
      flag = false;
      message = "更新职称表状态失败";
      break;
    case 2370:
      flag = false;
      message = "更新职业资格表状态失败";
      break;
    case 1101:
      flag = false;
      message = "pageTips";
      break;
    case 1102:
      flag = false;
      message = "数据不存在或已被删除";
      break;
    case 2311:
      flag = false;
      message = "此卡已被删除，无法进行审批";
      break;
    case 2800:
      flag = false;
      message = "pageTips";
      break;
    case 2500:
      flag = false;
      message = "查无此人";
      break;
    case 2661:
      flag = false;
      message = "查无此认证";
      break;
    case 2670:
      flag = false;
      message = "您的此项认证信息（含待认证）已达到3个，不可提交";
      break;
    case 2671:
      flag = false;
      message = "更新卡与原本拥有卡号重复";
      break;
    case 2558:
      flag = false;
      message = "当前人才已有该认证信息";
      break;
    case 2422:
      flag = false;
      message = "已有此权益编号，请重填";
      break;
    case 1103:
      flag = false;
      message = "名称重复，请重新输入";
      break;
    case 2801:
        flag = false;
        message = "pageTips";
        break;
    case 2730:
      flag = false;
      message = "pageTips";
      break;
    case 2743:
      flag = false;
      message = "政策状态不对";
      break;
    case 2745:
      flag = false;
      message = "pageTips";
      break;
    case 1010:
      flag = false;
      message = "该政策类型已存在，请重新输入";
      break;
    default:
      flag = false;
      message = "服务器异常，请联系管理员";
  }
  return { flag, message };
};


export const downloadExcel = ({ url, name = '下载文件名', data = null }) => {
  if (data) {
    url = url + '?' + qs.stringify(data)
  }
  axios
    .get(url, {
      headers: {
        "Content-Type": "application/octet-stream"
      },
      responseType: "arraybuffer"
    })
    .then(res => {
      let b = new Blob([res.data], { type: "application/vnd.ms-excel" });
      let url = URL.createObjectURL(b);
      let link = document.createElement("a");
      link.download = `${name}.xlsx`;
      link.href = url;
      link.click();
    });
}
