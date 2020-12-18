import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import RoleManagement from './views/nav1/RoleManagement.vue'
import UserManagement from './views/nav1/UserManagement.vue'
import OperationLog from './views/nav1/OperationLog.vue'
import CardManagement from './views/nav2/CardManagement.vue'
import CertifiedPersonnel from './views/nav3/Certified_personnel.vue'
import OrdinaryUsers from './views/nav3/Ordinary_users.vue'
Vue.use(VueRouter)


const ValidateTalent = () => import('./views/nav3/ValidateTalent.vue')
import CreateNewCard from './views/nav2/CreateNewCard.vue'
const EditBasic = () => import('./views/nav3/editpage/basic.vue')
const EditCard = () => import('./views/nav3/editpage/card.vue')
const EditCategory = () => import('./views/nav3/editpage/category.vue')
const EditEdu = () => import('./views/nav3/editpage/edu.vue')
const EditHonour = () => import('./views/nav3/editpage/honour.vue')
const EditTitle = () => import('./views/nav3/editpage/title.vue')
const EditQuality = () => import('./views/nav3/editpage/quality.vue')
import PolicyManagement from './views/nav4/PolicyManagement.vue'
import PolicyApproval from './views/nav4/PolicyApproval.vue'

import EditPolicy from './views/nav4/EditPolicy.vue'
import Approval from './views/nav4/Approval.vue'
import DetailedPolicy from './views/nav4/DetailedPolicy.vue';
const PolicyType = () => import('./views/nav4/PolicyType')
const PopulationDetails =()=>  import('./views/nav4/PopulationDetails')
import ApprovedTalent from './views/nav3/ApprovedTalent.vue'
import TalentApproval from './views/nav3/TalentApproval.vue'
const ExtendTravel = () => import('./views/extendPages/travel/travelPage')
const AddOrEditTravel = () => import('./views/extendPages/travel/addOrEditTravel')
const TravelAbout = () => import('./views/extendPages/travel/about')
const ReadTravel = () => import('./views/extendPages/travel/readTravel')
const DataViewTravel = () => import('./views/extendPages/travel/dataview')

const TalentCategory = () => import('./views/nav5/TalentCategory')
const TalentHonor = () => import('./views/nav5/TalentHonor')

const ExtendAgritain = () => import('./views/extendPages/agritainment/agritainPage')
const AgritainAbout = () => import('./views/extendPages/agritainment/about')
const AddOrEditAgritain = () => import('./views/extendPages/agritainment/addOrEditAgritain')
const ReadAgritain = () => import('./views/extendPages/agritainment/readAgritain')
const DataViewAgritain = () => import('./views/extendPages/agritainment/dataview')
const ExtendStaff = () => import('./views/extendPages/staff')
const XcxBanner = () => import('./views/extendPages/xcxBanner/bannerTable')
const Feedback = () => import('./views/extendPages/feedback')
const Collection = () => import('./views/extendPages/collection')

const BatchHistory = () => import('./views/nav3/batchHistory')

const OtherActive = () => import('./views/others/active')
const OtherActiveDetail = () => import('./views/others/active/detail')
const QuotaDetail = () => import('./views/others/active/quotaDetail')

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        name: '首页',
        redirect: '/main',
        iconCls: 'el-icon-house',//图标样式class
        leaf: true,//只有一个节点
        children: [
            { path: '/main', component: Main, name: '首页' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '系统管理',
        iconCls: 'el-icon-setting',//图标样式class
        children: [
            { path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/RoleManagement', component: RoleManagement, name: "角色管理" },
            { path: '/UserManagement', component: UserManagement, name: '用户管理' },
            { path: '/OperationLog', component: OperationLog, name: '操作日志' },
            
        ]
    },
    {
        path: '/',
        component: Home,
        name: '卡片管理',
        iconCls: 'el-icon-bank-card',
        children: [
            { path: '/CardManagement', component: CardManagement, name: '人才卡管理' },
            { path: '/CreateNewCard', component: CreateNewCard, name: '', hidden: true },
            { path: '/EditCard', component: CreateNewCard, name: '', hidden: true },

        ]
    },
    {
        path: '/',
        component: Home,
        name: '人才管理',
        iconCls: 'el-icon-user',
        children: [
            { path: '/OrdinaryUsers', component: OrdinaryUsers, name: '普通用户' },
            { path: '/OrdinaryUsers/batchHistory', component: BatchHistory, name: '上传记录' },
            { path: '/CertifiedPersonnel', component: CertifiedPersonnel, name: '认证审批', pop: true },
            { path: '/TalentApproval', component: TalentApproval, name: '审批', hidden: true },
            { path: '/Details', component: TalentApproval, name: '查看', hidden: true },
            { path: '/ValidateTalent', component: ValidateTalent, name: '认证人才' },
            { path: '/ViewTalent', component: ApprovedTalent, name: '查看', hidden: true },
            { path: '/Edit/basic', component: EditBasic, name: '编辑基础信息', hidden: true },
            { path: '/Edit/card', component: EditCard, name: '编辑人才卡', hidden: true },
            { path: '/Edit/category', component: EditCategory, name: '编辑人才类别', hidden: true },
            { path: '/Edit/edu', component: EditEdu, name: '编辑学历信息', hidden: true },
            { path: '/Edit/honour', component: EditHonour, name: '编辑人才荣誉', hidden: true },
            { path: '/Edit/title', component: EditTitle, name: '编辑职称信息', hidden: true },
            { path: '/Edit/quality', component: EditQuality, name: '编辑职业资格信息', hidden: true },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '人才政策管理',
        iconCls: 'el-icon-document-copy',
        children: [
            { path: '/PolicyManagement', component: PolicyManagement, name: '政策管理' },
            { path: '/PolicyApproval', component: PolicyApproval, name: '政策审批' },
            { path: '/PolicyType', component: PolicyType, name: '政策类型' },
            { path: '/PopulationDetails', component: PopulationDetails, hidden: true },
            { path: '/CreateNewPolicy', component: EditPolicy, name: '', hidden: true },
            { path: '/PolicyManagement/DetailedPolicy', component: DetailedPolicy, name: '', hidden: true },
            { path: '/EditPolicy', component: EditPolicy, name: '', hidden: true },
            { path: '/Approval', component: Approval, name: '', hidden: true },
            { path: '/DetailedApproval', component: Approval, name: '', hidden: true },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '人才标签管理',
        iconCls: 'el-icon-document-copy',
        children: [
            { path: '/talentCategory', component: TalentCategory, name: '人才类别' },
            { path: '/talentHonor', component: TalentHonor, name: '人才荣誉' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '其他服务',
        iconCls: 'el-icon-document-copy',
        children: [
            { path: '/other/active', component: OtherActive, name: '人才活动' },
            { path: '/other/active/detail', component: OtherActiveDetail, name: '人才活动详情' },
            { path: '/other/active/quotaDetail/:id', component: QuotaDetail, name: '报名详情' },
            
        ]
    },
    {
        path: '/',
        component: Home,
        name: '扩展功能',
        iconCls: 'el-icon-document-copy',
        children: [
            { path: '/extend/travel', component: ExtendTravel, name: '免费旅游' },
            { path: '/extend/travel/addoredit', component: AddOrEditTravel, name: '新建/编辑' },
            { path: '/extend/travel/about', component: TravelAbout, name: '关于信息' },
            { path: '/extend/travel/read', component: ReadTravel, name: '查看' },
            { path: '/extend/travel/dataview', component: DataViewTravel, name: '数据查看' },
            { path: '/extend/agritainment', component: ExtendAgritain, name: '农家乐' },
            { path: '/extend/agritainment/addoredit', component: AddOrEditAgritain, name: '新建/编辑' },
            { path: '/extend/agritainment/about', component: AgritainAbout, name: '关于信息' },
            { path: '/extend/agritainment/read', component: ReadAgritain, name: '查看' },
            { path: '/extend/agritainment/dataview', component: DataViewAgritain, name: '数据查看' },
            { path: '/extend/staff', component: ExtendStaff, name: '员工绑定信息' },
            { path: '/extend/xcxbanner', component: XcxBanner, name: 'banner配置' },
            { path: '/extend/feedback', component: Feedback, name: '意见反馈' },
            { path: '/extend/collection', component: Collection, name: '问题收集' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    },

];

const router = new VueRouter({
    mode: 'hash',
    scrollBehavior: () => ({ y: 0 }),
    routes: routes
})
export default router;