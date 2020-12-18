<template>
  <section>
    <!--title-->
    <div class="titlewrapper" v-if="tabs!=2">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/ValidateTalent' }">认证人才</el-breadcrumb-item>
        <el-breadcrumb-item>详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--form-->
    <div class="contentwrapper">
      <BasicInfo :basicInfo="basicInfo" :tabs="tabs"></BasicInfo>
      <PolicyInfo :policyList="policyList"></PolicyInfo>
      <CardInfo :cardInfo="cardInfo" :tabs="tabs"></CardInfo>
      <TalentType :talentInfo="basicInfo" :tabs="tabs"></TalentType>
      <HonourInfo :honourList="honourList" :openId="openId" :times="honourTimes" :tabs="tabs"></HonourInfo>
      <EduInfo :eduList="eduList" :openId="openId" :times="eduTimes" :tabs="tabs"></EduInfo>
      <TitleInfo :titleList="titleList" :openId="openId" :times="titleTimes" :tabs="tabs"></TitleInfo>
      <QualityInfo :qualityList="qualityList" :openId="openId" :times="qualityTimes" :tabs="tabs"></QualityInfo>
      <RecordTable :applyRecord="applyRecord"></RecordTable>
      <div style="margin:0 auto; margin-top:30px">
        <el-button @click="backtohome">返回</el-button>
      </div>
    </div>
  </section>
</template>

<script>
import { cTalentDetail, getRecordForm } from "../../api/api";
import { filterData } from "../../utils/config";
import BasicInfo from "./authorizedView/basic";
import CardInfo from "./authorizedView/card";
import TalentType from "./authorizedView/talent";
import HonourInfo from "./authorizedView/honour";
import EduInfo from "./authorizedView/edu";
import TitleInfo from "./authorizedView/title";
import QualityInfo from "./authorizedView/quality";
import PolicyInfo from "./authorizedView/totalpolicy";
import RecordTable from "@/components/RecordForm";

export default {
  components: {
    BasicInfo,
    CardInfo,
    TalentType,
    HonourInfo,
    EduInfo,
    TitleInfo,
    QualityInfo,
    PolicyInfo,
    RecordTable,
  },
  props: {
    tabs: { type: String, default: "1" },
    openId: { type: String, default: "" },
  },
  data() {
    return {
      basicInfo: {},
      cardInfo: {},
      policyList: [],
      honourList: [],
      eduList: [],
      titleList: [],
      qualityList: [],
      applyRecord: [],
      openId: "",
      honourTimes: "",
      eduTimes: "",
      titleTimes: "",
      qualityTimes: "",
    };
  },
  computed: {},
  methods: {
    backtohome() {
      this.tabs == 1 ? window.close() : this.$router.go(-1);
    },
    gotoEdit(path) {
      this.$router.push(path);
    },
    async getDetail() {
      try {
        let para = {
          openId: this.$route.query.openId,
        };
        const res = await cTalentDetail(para);
        this.basicInfo = {
          ...res.talentInfo,
          workUnit: res.talentInfo.security_workUnit || res.talentInfo.workUnit,
        };
        //剔除不要的数据
        delete this.basicInfo.educationPOList;
        delete this.basicInfo.profQualityPOList;
        delete this.basicInfo.profTitlePOList;
        delete this.basicInfo.talentHonourPOList;
        this.policyList = [...res.policyPOList];
        this.openId = res.talentInfo.openId;
        this.cardInfo = {
          ...res.cardInfo,
          cardNum: res.talentInfo.cardNum,
          talentId: res.talentInfo.talentId,
        };

        this.honourList = [...res.talentInfo.talentHonourPOList];
        this.eduList = [...res.talentInfo.educationPOList];
        this.titleList = [...res.talentInfo.profTitlePOList];
        this.qualityList = [...res.talentInfo.profQualityPOList];
        this.honourTimes = res.certificationTimes.honourTimes + "";
        this.eduTimes = res.certificationTimes.educationTimes + "";
        this.titleTimes = res.certificationTimes.titleTimes + "";
        this.qualityTimes = res.certificationTimes.qualityTimes + "";
      } catch (e) {}
    },
    async getRecordForm() {
      let para = {
        talentId: this.cardInfo.talentId,
      };
      const data = await getRecordForm(para);
      if (data) {
        this.applyRecord = data.data;
      }
    },
  },
  filters: {},
  created() {},
  async mounted() {
    await this.getDetail();
    await this.getRecordForm();
  },
};
</script>

<style scoped lang="less">
.el-tag {
  margin: 0 7px;
}
.homepageTitle {
  height: 10px;
  border-bottom: 2px solid #cccccc;
  opacity: 0.3;
}

.titlewrapper {
  background-color: white;
  padding-top: 25px;
  padding-left: 20px;
  padding-right: 20px;
}

.contentwrapper {
  background-color: white;
  padding: 0px 50px 50px 50px;
  display: flex;
  flex-wrap: wrap;
}
.label {
  font-size: 14px;
  color: #666666;
  font-weight: 100px;
}

.labelinfo {
  font-size: 14px;
  margin-left: 0px;
  color: #333333;
}
.honourPadding {
  margin-right: 7px;
}
.subtitle {
  font-size: 15px;
  margin-top: 16px;
  font-weight: bold;
  float: left;
}
.blue {
  content: "";
  display: inline-block;
  width: 4px;
  height: 18px;
  vertical-align: bottom;
  margin-right: 10px;
  background: rgba(0, 145, 231, 1);
  border-radius: 4px;
}

.editbtn {
  padding: 0;
  width: 80px;
  height: 30px;
  float: right;
  margin-top: 4px;
}
.addbtn {
  padding: 0;
  width: 100px;
  height: 30px;
  float: right;
  margin-top: 4px;
}
.formRow {
  width: 100%;
  margin-bottom: 10px;
  img {
    width: 400px;
    height: 200px;
  }
}
.el-form-item__content {
  line-height: 0px !important ;
}

.el-input--suffix .el-input__inner {
  font-size: 12px;
}

.el-textarea__inner {
  font-size: 12px;
}
.image-box {
  width: 300px;
  height: auto;
}
/deep/ .el-divider--horizontal {
  margin: 16px 0;
}
.subtitlerow {
  width: 100%;
}
</style>
