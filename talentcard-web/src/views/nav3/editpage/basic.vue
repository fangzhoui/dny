<template>
  <el-container class="editwrapper">
    <el-header>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/ValidateTalent' }">认证人才</el-breadcrumb-item>
        <el-breadcrumb-item>编辑基础信息</el-breadcrumb-item>
      </el-breadcrumb>
      <el-divider></el-divider>
    </el-header>
    <el-main>
      <el-form ref="basicInfo" :model="basicInfo" label-width="auto" :rules="rules">
        <el-form-item label="姓名：">{{ basicInfo.name }}</el-form-item>
        <el-form-item label="性别：">{{ basicInfo.sex| sexFilter }}</el-form-item>
        <el-form-item label="证件类型：">{{ showZJ() }}</el-form-item>
        <el-form-item label="人才来源：">{{ basicInfo.talentSource | talentSourceFilter }}</el-form-item>
        <el-form-item label="政治面貌：" prop="political">
          <el-select v-model="basicInfo.political" placeholder="请选择">
            <el-option
              v-for="item in politicals"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号码：" prop="phone">
          <el-input
            v-model="basicInfo.phone"
            maxlength="11"
            onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="所在行业：" prop="industry">
          <el-select v-model="basicInfo.industry" placeholder="请选择">
            <el-option
              v-for="item in industries"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="现工作单位：" prop="workUnit">
          <el-input v-model="basicInfo.workUnit" maxlength="20" show-word-limit />
        </el-form-item>

        <el-form-item label="工作区域：" prop="workLocationType">
          <el-select v-model="basicInfo.workLocationType" placeholder="请选择">
            <el-option
              v-for="item in placeTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工作地点：" prop="workLocation" v-if="basicInfo.workLocationType == 1">
          <el-cascader
            v-model="locationCodeList"
            :options="cityList"
            :props="{ value: 'label', label: 'label' }"
          />
        </el-form-item>
        <el-form-item label="操作原因：" prop="opinion">
          <el-input
            type="textarea"
            show-word-limit
            v-model="basicInfo.opinion"
            :maxlength="200"
            style="width:400px"
            :rows="8"
          ></el-input>
          <p style="color:#bbb">操作成功后将会通知用户操作原因</p>
        </el-form-item>
        <el-form-item label="注册时间：">{{ basicInfo.createTime }}</el-form-item>
        <el-form-item label="完成认证时间：">{{ basicInfo.firstCertificationTime }}</el-form-item>
      </el-form>
    </el-main>
    <el-footer>
      <template>
        <el-button @click="goBack">返回</el-button>
        <el-button type="primary" @click="submitForm('basicInfo')">确定编辑</el-button>
      </template>
    </el-footer>
  </el-container>
</template>

<script>
import {
  politicals,
  industries,
  cityList,
  placeTypes,
  filterData
} from "../../../utils/config.js";
import { editBasicInfo, cTalentDetail } from "../../../api/api";
export default {
  data() {
    return {
      basicInfo: {},
      rules: {
        political: [
          {
            required: true,
            message: "请选择政治面貌",
            trigger: ["change", "blur"]
          }
        ],
        phone: [
          {
            required: true,
            message: "请输入联系号码",
            trigger: ["change", "blur"]
          }
        ],
        industry: [
          {
            required: true,
            message: "请选择所在行业",
            trigger: ["change", "blur"]
          }
        ],
        workUnit: [
          {
            required: true,
            message: "请输入现工作单位",
            trigger: ["change", "blur"]
          }
        ],
        workLocationType: [
          {
            required: true,
            message: "请选择工作区域",
            trigger: ["change", "blur"]
          }
        ],
        workLocation: [
          {
            required: true,
            message: "请选择工作地点",
            trigger: ["change", "blur"],
          },
        ],
        opinion: [
          {
            required: true,
            message: "请填写操作原因",
            trigger: ["change", "blur"],
          },
        ],
      },
      // descp
      politicals,
      cityList,
    };
  },
  computed: {
    locationCodeList: {
      get() {
        var flag = Array.isArray(this.basicInfo.workLocation);
        if (flag) {
          return this.basicInfo.workLocation;
        } else {
          return this.basicInfo.workLocation.split(",");
        }
      },
      set(val) {
        this.basicInfo.workLocation = val;
      }
    },
    industries() {
      return {
        ...industries,
        0: { label: "无", value: 0 },
      };
    },
    placeTypes() {
      return {
        ...placeTypes,
        0: { label: "无", value: 0 },
      };
    },
  },
  methods: {
    showZJ() {
      const { cardType, idCard, passport, driverCard } = this.basicInfo;
      if (cardType == 1) {
        return `身份证 (${idCard})`;
      }
      if (cardType == 2) {
        return `护照 (${passport})`;
      }
      if (cardType == 3) {
        return `驾照 (${driverCard})`;
      }
    },
    goBack() {
      this.$router.go(-1);
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            const params = {
              ...this.basicInfo,
              openId: this.$route.query.openId,
              workLocation:
                this.basicInfo.workLocationType == 1
                  ? this.basicInfo.workLocation + ""
                  : "",
              workUnit: this.basicInfo.workUnit ? this.basicInfo.workUnit : "",
            };
            const title = "编辑操作";
            const message = "是否编辑此用户的基本信息？";
            await this.$alert(message, title, {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              showCancelButton: true
            });
            await editBasicInfo(params);
            this.$router.go(-1);
            this.$message.success("编辑成功");
          } catch (e) {
            console.log(e);
          }
        } else {
          return false;
        }
      });
    },
    async getDetail() {
      try {
        let para = {
          openId: this.$route.query.openId
        };
        const res = await cTalentDetail(para);
        this.basicInfo = {
          ...res.talentInfo,
          workUnit: res.talentInfo.workUnit ? res.talentInfo.workUnit : "无",
          industry: res.talentInfo.industry == 11 ? 0 : res.talentInfo.industry,
          workLocationType:res.talentInfo.workLocationType == 3 ? 0 : res.talentInfo.workLocationType,
        };

        //剔除不要的数据
        delete this.basicInfo.educationPOList;
        delete this.basicInfo.profQualityPOList;
        delete this.basicInfo.profTitlePOList;
        delete this.basicInfo.talentHonourPOList;
      } catch (e) {}
    }
  },
  filters: {
    sexFilter(value) {
      return filterData("sexs", value);
    },
    politicalFilter(value) {
      return filterData("politicals", value);
    },
    industryFilter(value) {
      return filterData("industries", value);
    },
    talentSourceFilter(value) {
      return filterData("talentSources", value);
    }
  },
  created() {
    this.getDetail();
  }
};
</script>

<style scoped lang="less">
.el-header {
  background: white;
  padding: 20px;
}
.el-main {
  background: white;
}
.el-footer {
  background: white;
  text-align: center;
  .el-button {
    width: 120px;
    margin-right: 40px;
  }
}
/deep/ .el-input {
  width: 360px;
}
/deep/ .el-form {
  margin-top: 16px;
}
/deep/ .el-form-item {
  margin-bottom: 16px;
}
</style>
