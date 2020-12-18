export const config = [
    {
        label: '系统管理',
        key: 'admin',
        option: [
            {
                label: '角色管理',
                key: 'juese',
                checkAll: false,
                option: [
                    {
                        label: '查看角色',
                        key: 'roleQuery'
                    }
                ]
            },
            {
                label: '用户管理',
                key: 'yonghu',
                checkAll: false,
                option: [
                    {
                        label: '新建用户',
                        key: 'userCreate'
                    },
                    {
                        label: '修改用户',
                        key: 'userUpdate'
                    },
                    {
                        label: '查看用户',
                        key: 'userQuery'
                    },
                    {
                        label: '删除用户',
                        key: 'userDelete'
                    }
                ]
            },
            {
                label: '操作日志',
                key: 'journal',
                checkAll: false,
                option: [
                    {
                        label: '查看',
                        key: 'logQuery'
                    }
                ]
            },
        ]
    },
    {
        label: '卡片管理',
        key: 'card',
        option: [
            {
                label: '人才卡管理',
                key: 'personnelCard',
                checkAll: false,
                option: [
                    {
                        label: '新建卡片',
                        key: 'userCardCreate'
                    },
                    {
                        label: '修改卡片',
                        key: 'userCardUpdate'
                    },
                    {
                        label: '查看卡片',
                        key: 'userCardQuery'
                    },
                    {
                        label: '删除卡片',
                        key: 'userCardDelete'
                    }
                ]
            }
        ]
    },
    {
        label: '人才管理',
        key: 'personnel',
        option: [
            {
                label: '普通用户',
                key: 'ordinaryUsers',
                checkAll: false,
                option: [
                    {
                        label: '查看',
                        key: 'generalTalentQuery'
                    }
                ]
            },
            {
                label: '认证审批',
                key: 'certificationApproval',
                checkAll: false,
                option: [
                    {
                        label: '查看',
                        key: 'approvalTalentQuery'
                    },
                    {
                        label: '审批',
                        key: 'approvalTalentAction'
                    }
                ]
            },
            {
                label: '认证用户',
                key: 'certificationUsers',
                checkAll: false,
                option: [
                    {
                        label: '修改用户',
                        key: 'verifiedTalentUpdate'
                    },
                    {
                        label: '查看用户',
                        key: 'verifiedTalentQuery'
                    }
                ]
            }
        ]
    },
    {
        label: '人才政策管理',
        key: 'personnelRoles',
        option: [
            {
                label: '政策管理',
                key: 'rolesManage',
                checkAll: false,
                option: [
                    {
                        label: '新建政策',
                        key: 'policyCreate'
                    },
                    {
                        label: '修改政策',
                        key: 'policyUpdate'
                    },
                    {
                        label: '查看政策',
                        key: 'policyQuery'
                    }
                ]
            },
            {
                label: '政策类型',
                key: 'rulesApproval1',
                checkAll: false,
                option: [
                    {
                        label: '新建政策类型',
                        key: 'createPolicyType'
                    },
                    {
                        label: '编辑政策类型',
                        key: 'editPolicyType'
                    },
                    {
                        label: '查看',
                        key: 'policyTypeQuery'
                    },
                ]
            },
            {
                label: '政策审批',
                key: 'rulesApproval',
                checkAll: false,
                option: [
                    {
                        label: '查看',
                        key: 'approvalPolicyQuery'
                    },
                    {
                        label: '审批',
                        key: 'approvalPolicyAction'
                    }
                ]
            }
        ]
    },
    {
        label: '人才标签管理',
        key: 'personnelLabels',
        option: [
            {
                label: '人才类别管理',
                key: 'personnelCategory',
                checkAll: false,
                option: [
                    {
                        label: '查看',
                        key: 'talentCategoryQuery'
                    },
                    {
                        label: '新增人才类别',
                        key: 'talentCategoryAdd'
                    },
                    {
                        label: '编辑人才类别',
                        key: 'talentCategoryEdit'
                    },
                ]
            },
            {
                label: '人才荣誉管理',
                key: 'personnelHonor',
                checkAll: false,
                option: [
                    {
                        label: '查看',
                        key: 'talentHonourQuery'
                    },
                    {
                        label: '新增人才荣誉',
                        key: 'talentHonourAdd'
                    },
                    {
                        label: '编辑人才荣誉',
                        key: 'talentHonourEdit'
                    }
                ]
            }
        ]
    },
    {
        label: '其他服务',
        key: 'others',
        option: [
            {
                label: '人才活动',
                key: 'activity',
                checkAll: false,
                option: [
                    {
                        label: '查看',
                        key: 'eventQuery'
                    },
                    {
                        label: '新增人才活动',
                        key: 'eventAdd'
                    },
                    {
                        label: '编辑人才活动',
                        key: 'eventEdit'
                    },
                    {
                        label: '活动审批',
                        key: 'eventApproval'
                    }
                ]
            },
        ]
    },
    {
        label: '扩展功能',
        key: 'extend',
        option: [
            {
                label: 'banner配置',
                key: 'banner',
                checkAll: false,
                option: [
                    {
                        label: '查看',
                        key: 'bannerQuery'
                    },
                    {
                        label: '新建banner',
                        key: 'bannerCreate'
                    },
                ]
            },
            {
                label: '意见反馈',
                key: 'feedback',
                checkAll: false,
                option: [
                    {
                        label: '查看',
                        key: 'commentQuery'
                    }
                ]
            }, {
                label: '免费旅游',
                key: 'travel',
                checkAll: false,
                option: [
                    {
                        label: '查看',
                        key: 'tripQuery'
                    },
                    {
                        label: '新建景区',
                        key: 'tripCreate'
                    },
                    {
                        label: '编辑景区',
                        key: 'tripEdit'
                    },
                    {
                        label: '数据查看',
                        key: 'tripDataQuery'
                    }, {
                        label: '配置旅游数量',
                        key: 'tripSetTripNumber'
                    },
                    {
                        label: '配置关于信息',
                        key: 'tripSetRelatedInfo'
                    }, {
                        label: '导出数据',
                        key: 'tripGetData'
                    },
                ]
            },
            {
                label: '农家乐',
                key: 'agritainment',
                checkAll: false,
                option: [
                    {
                        label: '查看',
                        key: 'farmHouseQuery'
                    },
                    {
                        label: '新建农家乐',
                        key: 'farmHouseCreate'
                    },
                    {
                        label: '编辑农家乐',
                        key: 'farmHouseEdit'
                    },
                    {
                        label: '数据查看',
                        key: 'farmHouseDataQuery'
                    },
                    {
                        label: '配置关于信息',
                        key: 'farmHouseSetRelatedInfo'
                    },
                    {
                        label: '导出数据',
                        key: 'farmHouseGetData'
                    },
                ]
            },
            {
                label: '员工绑定信息',
                key: 'staffInfo',
                checkAll: false,
                option: [
                    {
                        label: '查看',
                        key: 'staffBindInfoQuery'
                    },
                    {
                        label: '删除',
                        key: 'staffBindInfoDelete'
                    },
                ]
            },
            {
                label: '问题收集',
                key: 'problem',
                checkAll: false,
                option: [
                    {
                        label: '查看',
                        key: 'questionCollectQuery'
                    }
                ]
            },
        ]
    },
    
]

export let pageType = {
    1: { label: "系统管理", value: 1 },
    2: { label: "卡片管理", value: 2 },
    3: { label: "人才管理", value: 3 },
    4: { label: "人才政策管理", value: 4 },
    5: { label: "人才标签管理", value: 5 },
    6: { label: "扩展功能", value: 6 },
    7: { label: "其他服务", value: 7 }
}
export let EducationLevel = {
    1: { label: "角色管理", value: 1 },
    2: { label: "用户管理", value: 2 },
    3: { label: "操作日志", value: 3 }
}
export let medicalCareLevel = {
    1: { label: "人才卡管理", value: 1 }
}
export let familyLevel = {
    1: { label: "普通用户", value: 1 },
    2: { label: "认证审批", value: 2 },
    3: { label: "认证人才", value: 3 }
}
export let houseLevel = {
    1: { label: "政策管理", value: 1 },
    2: { label: "政策审批", value: 2 }
}
export let pagLevel = {
    1: { label: "人才类别", value: 1 },
    2: { label: "人才荣誉", value: 2 }
}

export let extendLevel = {
    1: { label: "banner配置", value: 1 },
    2: { label: "意见反馈", value: 2 },
    3: { label: "免费旅游", value: 3 },
    4: { label: "农家乐", value: 4 },
    5: { label: "员工绑定信息", value: 5 },
    6: { label: "问题收集", value: 6 }
}

export let others = {
    1: { label: "人才活动", value: 1 }
}