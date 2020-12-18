import service, { downloadExcel } from '../axios';
import qs from 'qs'
const mockFix = process.env.NODE_ENV == 'development' ? '/mock' : '/tcmgr'
export function requestCheckcode() {
    return service({
        url: '/tcmgr/login/getCodeImg',
        method: 'post',
    })
};

export function requestLogin(data) {
    return service({
        url: '/tcmgr/login/checkLogin',
        method: 'post',
        data: qs.stringify(data)
    })
};

export function changePassword(data) {
    return service({
        url: '/tcmgr/user/updatePassword',
        method: 'post',
        data: qs.stringify(data)
    })
};

export function confirmlogout() {
    return service({
        url: '/tcmgr/login/logOut',
        method: 'post',
    })
};

export function getRoleList(data) {
    return service({
        url: '/tcmgr/role/queryByRole',
        method: 'post',
        data: qs.stringify(data)
    })
};

export function getUserList(data) {
    return service({
        url: '/tcmgr/user/queryByUser',
        method: 'post',
        data: qs.stringify(data)
    })
};

export function queryRoleIdMag() {
    return service({
        url: '/tcmgr/role/queryRoleIdMsg',
        method: 'get',
    })
};

export function managerChangePass(data) {
    return service({
        url: '/tcmgr/user/adminUpUserPassword',
        method: 'post',
        data: qs.stringify(data)
    })
};

export function editUser(data) {
    return service({
        url: '/tcmgr/user/editUser',
        method: 'post',
        data: qs.stringify(data)
    })
};

export function insertUser(data) {
    return service({
        url: '/tcmgr/user/insertUser',
        method: 'post',
        data: qs.stringify(data)
    })
};

export function deleteUser(data) {
    return service({
        url: '/tcmgr/user/deleteUser',
        method: 'post',
        data: qs.stringify(data)
    })
};

export function getCards(data) {
    return service({
        url: '/tcmgr/card/query',
        method: 'post',
        data: qs.stringify(data)
    })
};

export function getCardsFilterBase(data) {
    return service({
        url: '/tcmgr/card/findSeniorCard',
        method: 'post',
        data: qs.stringify(data)
    })
};

export function getAutList(data) {
    return service({
        url: '/tcmgr/cert/queryCertStatus',
        method: 'post',
        data: qs.stringify(data)
    })
};


export function getApprovalUser(data) {
    return service({
        url: '/tcmgr/certApproval/CertApprovalShow',
        method: 'post',
        data: qs.stringify(data)
    })
};

export function getPolicies(data) {
    return service({
        url: '/tcmgr/policy/query',
        method: 'post',
        data: qs.stringify(data)
    })
};


export function insertPolicy(data) {
    return service({
        url: '/tcmgr/policy/insert',
        method: 'post',
        data
    })
};

export function getpolicydetail(data) {
    return service({
        url: '/tcmgr/policy/detail',
        method: 'post',
        data: qs.stringify(data)
    })
};


export function getCardId() {
    return service({
        url: '/tcmgr/card/findSeniorCard',
        method: 'post',
    })
};

export function getuserId(data) {
    return service({
        url: '/tcmgrcertApproval/CertApprovalShow',
        method: 'get',
        data
    })
};

export function ApprovalTalentDetails(data) {
    return service({
        url: '/tcmgr/certApproval/DetailsLookItems',
        method: 'post',
        data: qs.stringify(data)
    })
};

export function getTalentDetail(data) {
    return service({
        url: '/tcmgr/certApproval/findOne',
        method: 'post',
        data: qs.stringify(data)
    })
};

export function ApprovalConfirmation(data) {
    return service({
        url: '/tcmgr/certApproval/CertConfirm',
        method: 'post',
        data: qs.stringify(data)
    })
};

export function deletePolicies(data) {
    return service({
        url: '/tcmgr/policy/delete',
        method: 'post',
        data: qs.stringify(data)
    })
};

export function editPolicies(data) {
    return service({
        url: '/tcmgr/policy/update',
        method: 'post',
        data
    })
};


export function queryApplications(data) {
    return service({
        url: '/tcmgr/policy_apply/query',
        method: 'post',
        data: qs.stringify(data)
    })
};

export function policyApplyDetail(data) {
    return service({
        url: '/tcmgr/policy_apply/detail',
        method: 'post',
        data: qs.stringify(data)
    })
};

export function approval(data) {
    return service({
        url: '/tcmgr/policy_apply/approval',
        method: 'post',
        data: qs.stringify(data)
    })
};

export function exportApplications(data) {
    return service({
        url: '/tcmgr/policy_apply/export',
        method: 'get',
        data: qs.stringify(data)
    })
};

export function talentquery(data) {
    return service({
        url: '/tcmgr/talent/query',
        method: 'post',
        data: qs.stringify(data)
    })
};

export function querytalentdetail(data) {
    return service({
        url: '/tcmgr/talent/detail',
        method: 'post',
        data: qs.stringify(data)
    })
};

export function querycardinfo(data) {
    return service({
        url: '/tcmgr/card/queryCardIdName',
        method: 'post',
        data: qs.stringify(data)
    })
};


export function certConfirm(data) {
    return service({
        url: '/tcmgr/certApproval/CertConfirm',
        method: 'post',
        data: qs.stringify(data)
    })
};

export function queryCertTalent(data) {
    return service({
        url: '/tcmgr/talent/queryCert',
        method: 'post',
        data: qs.stringify(data)
    })
};


export function addcard(data) {
    return service({
        url: '/tcmgr/card/add',
        method: 'post',
        headers: { 'Content-Type': 'multipart/form-data' },
        data
    })
};

export function editcard(data) {
    return service({
        url: '/tcmgr/card/edit',
        method: 'post',
        headers: { 'Content-Type': 'multipart/form-data' },
        data
    })
};

export function deletecards(data) {
    return service({
        url: '/tcmgr/card/delete',
        method: 'post',
        data: qs.stringify(data)
    })
};


export function findOne(data) {
    return service({
        url: '/tcmgr/card/findOne',
        method: 'post',
        data: qs.stringify(data)
    })
};

export function talentpop(data) {
    return service({
        url: '/tcmgr/certApproval/queryByNumApproval',
        method: 'GET',
        data: qs.stringify(data)
    })
};


export function policypop(data) {
    return service({
        url: '/tcmgr/policy_apply/count',
        method: 'GET',
        data: qs.stringify(data)
    })
};

// 获取景区列表
export const getScenicList = (params) => {
    return service({
        url: `/tcmgr/scenic/query`,
        method: 'post',
        data: qs.stringify(params)
    })
}

// 更改景区上下架状态
export const changeScenicStatusApi = (params) => {
    return service({
        url: `/tcmgr/scenic/status`,
        method: 'get',
        data: qs.stringify(params)
    })
}

// 获取景区详情
export const getScenicDetailsApi = (params) => {
    return service({
        url: `/tcmgr/scenic/detail`,
        method: 'get',
        data: qs.stringify(params)
    })
}
// 保存/编辑景区详情
export const saveScenicDetailsApi = (params) => {
    return service({
        url: `/tcmgr/scenic/edit`,
        method: 'post',
        data: params
    })
}

// 获取单个全局配置
export const getConfig = (params) => {
    return service({
        url: `/tcmgr/config/query`,
        method: 'get',
        data: qs.stringify(params)
    })
}

// 修改单个全局配置
export const setConfig = (params) => {
    return service({
        url: `/tcmgr/config/edit`,
        method: 'post',
        data: qs.stringify(params)
    })
}

// 获取农家乐列表
export const getFarmhouseList = (params) => {
    return service({
        url: `/tcmgr/farmhouse/query`,
        method: 'post',
        data: qs.stringify(params)
    })
}

// 更改农家乐上下架状态
export const changeFarmhouseStatusApi = (params) => {
    return service({
        url: `/tcmgr/farmhouse/status`,
        method: 'get',
        data: qs.stringify(params)
    })
}

// 保存/编辑农家乐详情
export const saveFarmhouseDetailsApi = (params) => {
    return service({
        url: `/tcmgr/farmhouse/edit`,
        method: 'post',
        data: params
    })
}

// 获取农家乐详情
export const getFarmhouseDetailsApi = (params) => {
    return service({
        url: `/tcmgr/farmhouse/detail`,
        method: 'get',
        data: qs.stringify(params)
    })
}
// 员工查询接口
export const getStaffList = (params) => {
    return service({
        url: `/tcmgr/staff/query`,
        method: 'post',
        data: qs.stringify(params)
    })
}
// 员工删除接口
export const deleteStaffApi = (params) => {
    return service({
        url: `/tcmgr/staff/delete`,
        method: 'post',
        data: qs.stringify(params)
    })
}

// 批量认证
export const batchCertificate = (data) => {
    return service({
        url: '/tcmgr/talent/batchCertificate',
        method: 'post',
        headers: { 'Content-Type': 'multipart/form-data' },
        data
    })
}

// 批量查询历史记录
export const getBatchAuthList = (data) => {
    return service({
        url: `/tcmgr/talent/findBatchCertificate`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 查询banner列表
export const getBannerList = (data) => {
    return service({
        url: `/tcmgr/banner/query`,
        method: 'get',
        data: qs.stringify(data)
    })
}

// banner上下架
export const changeBannerStatusApi = (data) => {
    return service({
        url: `/tcmgr/banner/status`,
        method: 'get',
        data: qs.stringify(data)
    })
}

// banner删除
export const deleteBannerApi = (data) => {
    return service({
        url: `/tcmgr/banner/delete`,
        method: 'get',
        data: qs.stringify(data)
    })
}

// 新建banner
export const insertBannerApi = (data) => {
    return service({
        url: `/tcmgr/banner/insert`,
        method: 'post',
        data
    })
}

// 意见反馈列表
export const getFeedbackList = (data) => {
    return service({
        url: `/tcmgr/feedback/query`,
        method: 'get',
        data: qs.stringify(data)
    })
}

export function insertCertificationQuery(data) {
    return service({
        url: '/tcmgr/insertCertification/query',
        method: 'post',
        data: qs.stringify(data)
    })
};

// 认证审批-添加认证-编辑/审批
export const insertCertification = (data) => {
    return service({
        url: `/tcmgr/insertCertification/findOne`,
        method: 'get',
        data: qs.stringify(data)
    })
}

// 认证审批-添加认证-编辑/审批 通过/驳回
export const insertCertResult = (data) => {
    return service({
        url: `/tcmgr/insertCertification/certResult`,
        method: 'post',
        data: qs.stringify(data)
    })
}

//认证人才-编辑基本信息
export const editBasicInfo = (data) => {
    return service({
        url: `/tcmgr/editTalent/editBasicInfo`,
        method: 'post',
        data
    })
}

//认证人才-查看 查询
export const cTalentDetail = (data) => {
    return service({
        url: `/tcmgr/editTalent/findTalentCertificationDetail`,
        method: 'post',
        data: qs.stringify(data)
    })
}

//认证人才-查看 查询所拥有的权益
export const findPolicy = (data) => {
    return service({
        url: `/tcmgr/editTalent/findPolicy`,
        method: 'post',
        data
    })
}


//认证人才-查看 人才卡 查询可以换的卡
export const ChangeableCard = (data) => {
    return service({
        url: `/tcmgr/editTalent/findEnableChangeCard`,
        method: 'post',
        data: qs.stringify(data)
    })
}


//认证人才-查看 荣誉 新增荣誉
export const addNewHonour = (data) => {
    return service({
        url: `/tcmgr/addDeleteTalent/addTalentHonour`,
        method: 'post',
        data
    })
}

//认证人才-查看 荣誉 删除荣誉
export const deleteHonour = (data) => {
    return service({
        url: `/tcmgr/addDeleteTalent/deleteTalentHonour`,
        method: 'post',
        data: qs.stringify(data)
    })
}

//认证人才-查看 荣誉 编辑荣誉
export const editHonour = (data) => {
    return service({
        url: `/tcmgr/editTalent/editTalentHonour`,
        method: 'post',
        data,
    })
}


//认证人才-查看 学历 新增学历
export const addNewEduc = (data) => {
    return service({
        url: `/tcmgr/addDeleteTalent/addEducation`,
        method: 'post',
        data
    })
}


//认证人才-查看 学历 编辑学历
export const editEduc = (data) => {
    return service({
        url: `/tcmgr/editTalent/editEducation`,
        method: 'post',
        data,
    })
}

//认证人才-查看 学历 删除学历
export const deleteEdu = (data) => {
    return service({
        url: `/tcmgr/addDeleteTalent/deleteEducation`,
        method: 'post',
        data: qs.stringify(data)
    })
}

//认证人才-查看 职称信息 新增职称信息
export const addNewTitle = (data) => {
    return service({
        url: `/tcmgr/addDeleteTalent/addProfTitle`,
        method: 'post',
        data
    })
}

//认证人才-查看 职称信息 编辑职称信息
export const editTitle = (data) => {
    return service({
        url: `/tcmgr/editTalent/editProfTitle`,
        method: 'post',
        data,
    })
}

//认证人才-查看 职称信息 删除职称信息
export const deleteTitle = (data) => {
    return service({
        url: `/tcmgr/addDeleteTalent/deleteProfTitle`,
        method: 'post',
        data: qs.stringify(data)
    })
}

//认证人才-查看 职业资格 新增职业资格信息
export const addNewQuality = (data) => {
    return service({
        url: `/tcmgr/addDeleteTalent/addProfQuality`,
        method: 'post',
        data
    })
}

//认证人才-查看 职业资格 编辑职业资格信息
export const editQuality = (data) => {
    return service({
        url: `/tcmgr/editTalent/editProfQuality`,
        method: 'post',
        data
    })
}

//认证人才-查看 职业资格 删除职业资格
export const deleteQuality = (data) => {
    return service({
        url: `/tcmgr/addDeleteTalent/deleteProfQuality`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 认证审批  编辑人才类别
export const editCategory = (data) => {
    return service({
        url: `/tcmgr/editTalent/editTalentCategory`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 认证审批  换卡
export const ChangeCard = (data) => {
    return service({
        url: `/tcmgr/editTalent/changeCard`,
        method: 'post',
        data: qs.stringify(data)
    })
}

//配置人才卡的可旅游次数
export const setTripTimes = (data) => {
    return service({
        url: `/tcmgr/scenic/setTripTimes`,
        method: 'post',
        data
    })
}

// 意见反馈
export const questionCollection = (data) => {
    return service({
        url: `/tcmgr/userfeedback/query`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 农家乐实时数据查询
export const farmhouseDataQuery = (data) => {
    return service({
        url: `/tcmgr/farmhouse_use_realtime/query`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 农家乐日统计数据查询
export const farmhouseDailyQuery = (data) => {
    return service({
        url: `/tcmgr/farmhouse_use_daily/query`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 农家乐月统计数据查询
export const farmhouseMonthQuery = (data) => {
    return service({
        url: `/tcmgr/farmhouse_month/query`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 农家乐月统计合计数据
export const farmhouseMonthTotal = (data) => {
    return service({
        url: `/tcmgr/farmhouse_month/total`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 农家乐实时数据导出
export const farmhouseRealtimeExport = () => {
    return downloadExcel({
        url: `/tcmgr/farmhouse_use_realtime/export`,
        name: '实时数据'
    })
}

// 农家乐日统计导出
export const farmhouseDailyExport = () => {
    return downloadExcel({
        url: `/tcmgr/farmhouse_use_daily/export`,
        name: "日统计"
    })
}

// 农家乐月统计导出
export const farmhouseMonthExport = () => {
    return downloadExcel({
        url: `/tcmgr/farmhouse_month/export`,
        name: '月统计'
    })
}

// 旅游头部数据查询
export const travelHeaderData = (data) => {
    return service({
        url: `/tcmgr/trip_header_month/count`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 旅游实时数据查询
export const travelRealtimeQuery = (data) => {
    return service({
        url: `/tcmgr/trip_realtime/query`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 旅游日统计数据查询
export const travelDailyQuery = (data) => {
    return service({
        url: `/tcmgr/trip_daily/query`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 旅游月统计数据查询
export const travelMonthQuery = (data) => {
    return service({
        url: `/tcmgr/trip_month/query`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 旅游实时数据导出
export const travelRealtimeExport = () => {
    return downloadExcel({
        url: `/tcmgr/trip_realtime/export`,
        name: '实时统计'
    })
}

// 旅游日统计数据导出
export const travelDailyExport = () => {
    return downloadExcel({
        url: `/tcmgr/trip_daily/export`,
        name: '日统计'
    })
}

// 旅游月统计数据导出
export const travelMonthExport = () => {
    return downloadExcel({
        url: `/tcmgr/trip_month/export`,
        name: '月统计'
    })
}

// 操作日志
export const queryJournal = (data) => {
    return service({
        url: `/tcmgr/action/query`,
        method: 'post',
        data: qs.stringify(data)
    })
}

// 操作日志
export const getRecordForm = (data) => {
    return service({
        url: `/tcmgr/talent/getAllCert`,
        method: 'post',
        data: qs.stringify(data)
    })
}
export const travelMonthTotal = (data) => {
    return service({
        url: `/tcmgr/trip_month/total`,
        method: 'post',
        data: qs.stringify(data)
    })
}
//  新增人才类别
export const addTalentCategory = (data) => {
    return service({
        url: `/tcmgr/category/add`,
        method: 'post',
        data: qs.stringify(data)
    })
}
//  编辑人才类别
export const editTalentCategory = (data) => {
    return service({
        url: `/tcmgr/category/edit`,
        method: 'post',
        data: qs.stringify(data)
    })
}
// 上下架人才类别
export const upDownTalentCategory = (data) => {
    return service({
        url: `/tcmgr/category/upDown`,
        method: 'post',
        data: qs.stringify(data)
    })
}
// 查询人才类别
export const queryTalentCategory = (data) => {
    return service({
        url: `/tcmgr/category/query`,
        method: 'post',
        data: qs.stringify(data)
    })
}
// 人才类别详情
export const findOneTalentCategory = (data) => {
    return service({
        url: `/tcmgr/category/findOne`,
        method: 'post',
        data: qs.stringify(data)
    })
}
// 新增人才荣誉
export const addTalentHonor = (data) => {
    return service({
        url: `/tcmgr/honour/add`,
        method: 'post',
        data: qs.stringify(data)
    })
}
// 编辑人才荣誉
export const editTalentHonor = (data) => {
    return service({
        url: `/tcmgr/honour/edit`,
        method: 'post',
        data: qs.stringify(data)
    })
}
// 上下架人才荣誉
export const upDownTalentHonor = (data) => {
    return service({
        url: `/tcmgr/honour/upDown`,
        method: 'post',
        data: qs.stringify(data)
    })
}
// 查询人才荣誉
export const queryTalentHonor = (data) => {
    return service({
        url: `/tcmgr/honour/query`,
        method: 'post',
        data: qs.stringify(data)
    })
}
// 人才荣誉详情
export const findOneTalentHonor = (data) => {
    return service({
        url: `/tcmgr/honour/findOne`,
        method: 'post',
        data: qs.stringify(data)
    })
}
// 政策审批查询
export const queryPolicyApproval = (data) => {
    return service({
        url: `/tcmgr/policy_apply/query`,
        method: 'post',
        data: qs.stringify(data)
    })
}
// 政策管理上下架
export const PolicyTypeUpDown = (data) => {
    return service({
        url: `/tcmgr/policy/upDown`,
        method: 'post',
        data: qs.stringify(data)
    })
}
// 政策类型查询
export const queryPolicyType = (data) => {
    return service({
        url: `/tcmgr/policyType/pageQuery`,
        method: 'post',
        data
    })
}
// 政策类型查询
export const queryPolicyName = (data) => {
    return service({
        url: `/tcmgr/policyType/queryExIdAndName`,
        method: 'post',
        data
    })
}
// 政策类型新增
export const addPolicy = (data) => {
    return service({
        url: `/tcmgr/policyType/insert`,
        method: 'post',
        data
    })
}
// 政策类型编辑
export const editPolicy = (data) => {
    return service({
        url: `/tcmgr/policyType/update`,
        method: 'post',
        data
    })
}
// 政策类型上下架
export const changeStatusPolicy = (data) => {
    return service({
        url: `/tcmgr/policyType/changeStatus`,
        method: 'post',
        data
    })
}
// 查询角色相关
export const queryResponsibleUnit = (data) => {
    return service({
        url: `/tcmgr/role/queryResponsibleUnit`,
        method: 'post',
        data
    })
}
// 登录用户的角色信息
export const findRoleBySession = (data) => {
    return service({
        url: `/tcmgr/user/findRoleBySession`,
        method: 'post',
        data: qs.stringify(data)
    })
}
//撤回审批
export const revokeApproval = (data) => {
    return service({
        url: `/tcmgr/policy_apply/cancel`,
        method: 'post',
        data: qs.stringify(data)
    })
}
//各项审批人数查询
export const applyNumCount = (data) => {
    return service({
        url: `/tcmgr/policy_apply/applyNumCount`,
        method: 'post',
        data
    })
}

//符合条件人数查询
export const queryCompliance = (data) => {
    return service({
        url: `/tcmgr/compliance/pageQuery`,
        method: 'post',
        data
    })
}
//符合条件人数查询
export const queryCoincideNum = (data) => {
    return service({
        url: `/tcmgr/compliance/queryNum`,
        method: 'post',
        data
    })
}
//一键推送获取
export const OnekeyPush = (data) => {
    return service({
        url: `/tcmgr/compliance/pushRecordQuery`,
        method: 'post',
        data
    })
}
//一键推送获取
export const compliancePush = (data) => {
    return service({
        url: `/tcmgr/compliance/push`,
        method: 'post',
        data
    })
}
//符合条件人数导出表格
export const ComplianceExporExcel = (data, name) => {
    return downloadExcel({
        url: `/tcmgr/compliance/exporExcel`,
        name,
        data,
    })
}
//查询certid
export const ComplianceQueryCertId = (data) => {
    return service({
        url: `/tcmgr/compliance/queryCertId`,
        method: 'post',
        data
    })
}

// 人才活动审批数量
export const approvalNum = () => {
    return service({
        url: `/tcmgr/activities/notApprovalNum`,
        method: 'post',
    })
}

// 人才活动列表
export const getActivityList = (data) => {
    return service({
        url: `/tcmgr/talentEvent/query`,
        method: 'post',
        data: qs.stringify(data)
    })
}


// 人才活动审批列表
export const getApprovalList = (data) => {
    return service({
        url: `/tcmgr/activities/approvalQuery`,
        method: 'post',
        data
    })
}

// 报名人才导出
export const talentInfoExport = (name, data) => {
    return downloadExcel({
        url: `/tcmgr/event/talentInfoExport`,
        name,
        data
    })
}


export const getEventIdDetailsApi = (data) => {
    return service({
        url: `/tcmgr/event/findOne`,
        method: 'post',
        data: qs.stringify(data)
    })
}

export const getEventIdDetailsXcxApi = (data) => {
    return service({
        url: `/tcmgr/activities/detail`,
        method: 'post',
        data: data
    })
}

export const getActivitiesQueryApprovalByFeidApi = (data) => {
    return service({
        url: '/tcmgr/activities/queryApprovalByFeid',
        method: 'post',
        data: data
    })
}

export const getEventFieldQuery = () => {
    return service({
        url: '/tcmgr/eventField/queryAll',
        method: 'post'
    })
}

export const getTalentInfoQuery = (data) => {
    return service({
        url: '/tcmgr/event/talentInfoQuery',
        method: 'post',
        data: qs.stringify(data)
    })
}

export const getNumByEventId = (data) => {
    return service({
        url: '/tcmgr/talentEvent/countNum',
        method: 'get',
        data: qs.stringify(data)
    })
}

export const saveEventEditApi = (data) => {
    return service({
        url: '/tcmgr/event/edit',
        method: 'post',
        data
    })
}

export const saveEventAddApi = (data) => {
    return service({
        url: '/tcmgr/event/add',
        method: 'post',
        data
    })
}

export const checkActivities = (data) => {
    return service({
        url: '/tcmgr/activities/approval',
        method: 'post',
        data
    })
}

//导出认证人才
export const peopleExporExcel = (name) => {
    return downloadExcel({
        url: `/tcmgr/talent/exporCertInfo`,
        name,
    })
}

// 活动上下架接口
export const othersActivityUpDown = (data) => {
    return service({
        url: '/tcmgr/event/upDown',
        method: 'post',
        data: qs.stringify(data)
    })
}

// 活动取消接口
export const othersActivityCancel = (data) => {
    if (data.type == 1) {
        const params = {
            feid: data.eventId,
            opinion: data.opinion,
            role: 1
        }
        return service({
            url: '/tcmgr/activities/cancel',
            method: 'post',
            data: params
        })
    } else {
        return service({
            url: '/tcmgr/event/cancel',
            method: 'post',
            data: qs.stringify(data)
        })
    }
}

export const findEventTime = (data) => {
    return service({
        url: '/tcmgr/event/findEventTime',
        method: 'post',
        data
    })
}

// 政策审批导出
export const policyExporExcel = (data, name) => {
    return downloadExcel({
      url: `/tcmgr/policy_apply/export`,
      name,
      data,
    });
  };

