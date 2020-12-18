<template>
  <section>
    <!--title-->
    <div class="titlewrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/PolicyManagement' }">政策管理</el-breadcrumb-item>
        <el-breadcrumb-item>查看政策</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--form-->
    <div class="contentwrapper">
      <el-form ref="form" :model="form" label-width="80px" style="padding:0 0 0 50px">
        <el-form-item label="政策名称:">
          <el-input v-model="form.name" maxlength="10" style="width:400px" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="政策编号:">
          <el-input v-model="form.code" maxlength="10" style="width:400px" :disabled="true"></el-input>
          <div
            style="color:#999999;font-size:12px;margin-top:5px"
          >用于区分政策类型，能更好的精确查询到政策，可使用英文字母编号与数字组合，填写后不能修改。</div>
        </el-form-item>
        <el-form-item label="政策类型">
          <my-option
            :tableColumns="policy"
            tableValue="政策类型"
            :policyType="formData.policyType"
            :disabled="true"
          ></my-option>
        </el-form-item>
        <el-form-item label="政策描述:">
          <el-input
            type="textarea"
            v-model="form.descp"
            maxlength="500"
            style="width:400px"
            :rows="8"
            :disabled="true"
          ></el-input>
          <p class="applicationGuide">该信息会显示在公众号申报指南中</p>
        </el-form-item>
        <el-form-item label="符合条件人数:">
          <div @click="seeNumpeople" class="peopleNum">{{peopleNum}}</div>
        </el-form-item>
        <el-form-item label="状态:">
          <span v-if="formData.status==1" class="success">可申请</span>
          <span v-else-if="formData.status==2" class="danger">未开启</span>
          <span v-else-if="formData.status==3">已失效</span>
          <span v-else>已下架</span>
        </el-form-item>
        <el-form-item label="责任单位">
          <my-option
            :disabled="true"
            :tableColumns="canUserResponsible"
            tableValue="政策类型"
            :policyType="formData.roleId"
          ></my-option>
        </el-form-item>
        <el-form-item label="社保要求:" prop="ifSocialSecurity">
          <div
            v-if="formData.ifSocialSecurity==1"
          >要求在衢江区缴纳社保，并连续缴纳社保{{formData.socialTimes}}{{formData.socialUnit==1?'个月':'年'}}</div>
          <span v-else>不要求</span>
        </el-form-item>
        <el-form-item label="资金发放形式:">
          <span>一次性发放</span>
        </el-form-item>
        <el-form-item label="享受群体:">
          <select-equity-index :form="form" :isRead="true" />
        </el-form-item>
        <el-form-item label="申报对象" prop="declarationTarget">
          <my-textarea
            :disabled="true"
            tableValue="请输入申报对象"
            :textarea="formData.declarationTarget"
            @loseFocus="loseFocus('declarationTarget',$event)"
          ></my-textarea>
          <p class="applicationGuide">该信息会显示在公众号申报指南中</p>
        </el-form-item>
        <el-form-item label="标识颜色:">{{color | colorFormat }}</el-form-item>
        <el-form-item label="申请时间：">{{formData.startTime }} - {{formData.endTime}}</el-form-item>
        <el-form-item label="申请资料:">
          <div>
            <el-checkbox v-model="formData.bank" disabled>银行卡信息</el-checkbox>
          </div>
          <div style=" margin-bottom: 15px;margin-left: 25px;">
            <el-checkbox v-model="formData.annex" disabled>附件信息</el-checkbox>
            <template v-if="formData.annex">
              <el-select
                v-model="formData.option"
                style="margin:0px 10px 0px 10px; width:80px"
                disabled
              >
                <el-option label="必填" :value="1" />
                <el-option label="选填" :value="3" />
              </el-select>
              <el-input v-model="formData.info" placeholder="附件信息描述" style="width:400px" disabled />
            </template>
          </div>
          <div style="margin-left: 25px;">
            <my-textarea
              :disabled="true"
              tableValue="请输入申请材料说明"
              :textarea="formData.applyMaterials"
              @loseFocus="loseFocus('applyMaterials',$event)"
            ></my-textarea>
          </div>
          <p class="applicationGuide">该信息会显示在公众号申报指南中</p>
          <p class="notice">用户提交申请时需要提交所选的信息</p>
        </el-form-item>

        <div v-if="apply==='需要申请'">
          <el-form-item label="申请频次:">{{rate}}{{unit}}/{{times}}次</el-form-item>

          <el-form-item label="申请资料:">
            <span class="bankfile" v-if="bank">{{bank}}</span>
            <span v-if="annex!=2">附件信息 ({{annex|annexFilter}}) {{info|infoFilter}}</span>
            <span v-else>附件信息</span>
          </el-form-item>

          <el-form-item label="政策资金(元):" label-width="100px">{{funds? funds:'无'}}</el-form-item>
        </div>
        <el-form-item label="政策资金 (元):" prop="funds">
          <el-input
            v-model="formData.funds"
            disabled
            oninput="value=value.replace(/[^\d]/g,'')"
            placeholder="请输入发放的政策资金数额"
            maxlength="9"
            style="width:400px"
          />
          <p class="notice">此数据用于统计发放给人才的政策资金数额，用于展示大数据“政策资金”。</p>
        </el-form-item>
        <el-form-item label="奖励/补助额度:" prop="bonus">
          <my-textarea
            :disabled="true"
            tableValue="请输入奖励/补助额度"
            :textarea="formData.bonus"
            @loseFocus="loseFocus('bonus',$event)"
          ></my-textarea>
          <p class="applicationGuide">该信息会显示在公众号申报指南中</p>
        </el-form-item>
        <el-form-item label="办事流程:" prop="businessProcess">
          <my-textarea
            :disabled="true"
            tableValue="请输入办事流程"
            :textarea="formData.businessProcess"
            @loseFocus="loseFocus('businessProcess',$event)"
          ></my-textarea>
          <p class="applicationGuide">该信息会显示在公众号申报指南中</p>
        </el-form-item>
        <el-form-item label="咨询电话:" prop="phone">
          <my-textarea
            :disabled="true"
            tableValue="请输入联系电话"
            :textarea="formData.phone"
            @loseFocus="loseFocus('phone',$event)"
          ></my-textarea>
          <p class="applicationGuide">该信息会显示在公众号申报指南中</p>
        </el-form-item>
        <el-form-item>
          <el-button style="margin-left:500px" @click="backtomanagement">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </section>
</template>
<script>
import {
  getpolicydetail,
  insertPolicy,
  getCardsFilterBase,
} from "../../api/api";
import MyOption from "./components/MyOption";
import { mapState, mapActions, mapGetters } from "vuex";
import MyTextarea from "./components/MyTextarea";
import SelectEquityIndex from "@c/checkEquity";
import {
  colorMap,
  options,
  insuranceTypes,
  cityTypes,
  frequencyTypes,
} from "./config";
export default {
  components: {
    MyOption,
    MyTextarea,
    SelectEquityIndex,
  },
  data() {
    return {
      form: {
        name: "",
        code: "",
        descp: "",
        cardIds: [],
        categoryIds: [],
        educIds: [],
        titleIds: [],
        qualityIds: [],
        talentHonourIds: [],
      },
      peopleNum: 0,
      policyName: "",
      formData: {},
      rate: 0,
      unit: "",
      times: 0,
      bank: "",
      color: "",
      annex: "",
      apply: "",
      funds: "",
      info: "",
      cardListName: [], //用于储存 人才卡的name属性 for example['金卡 ',' 银卡']
      talentListName: [], //用于储存 人才类别的name属性 for example['乡土人才 ',' 高技能人才']
      educationListName: [], //用于储存 人才学历的name属性 for example['大学专科 ',' 硕士研究生']
      jobTitleListName: [], //用于储存 人才职称的name属性 for example['中级 ',' 助理级']
      certificateListName: [], //用于储存 人才职业资格的name属性 for example['高级技师 ',' 技师']
      talentHonourListName: [],
      cardinfoList: [],
      colorMap: colorMap,
      cardList: [], //从mounted函数 后端拿到所有卡片信息
      options,
      insuranceTypes,
      cityTypes,
      frequencyTypes,
    };
  },
  computed: {
    ...mapState({
      honours: (state) => state.options.honours,
      categories: (state) => state.options.categories,
      policy: (state) => state.options.policy,
      responsible: (state) => state.options.responsible,
      titles: (state) => state.options.titles,
      qualities: (state) => state.options.qualities,
      educations: (state) => state.options.educations,
    }),
    ...mapGetters(["canUserHonours", "canUserResponsible"]),
  },
  methods: {
    seeNumpeople() {
      this.$router.push({
        path: "/PopulationDetails",
        query: {
          policyId: this.$route.query.pid,
          num: this.form.code,
          policyName: this.policyName,
        },
      });
    },
    async getcardsinfo() {
      let para = {};
      try {
        this.cardList = await getCardsFilterBase({});
      } catch (e) {}
    },
    async getDetails() {
      let para = {
        pid: this.$route.query.pid,
      };
      try {
        const res = await getpolicydetail(para);
        this.form.name = res.name;
        this.form.code = res.num;
        this.form.descp = res.desc;
        this.form = {
          name: res.name,
          code: res.num,
          descp: res.desc,
          cardIds: res.cardIds ? res.cardIds.map((i) => Number(i)) : [],
          categoryIds: res.categoryIds ? res.categoryIds.map((i) => Number(i)) : [],
          educIds: res.educIds ? res.educIds.map((i) => Number(i)) : [],
          titleIds: res.titleIds ? res.titleIds.map((i) => Number(i)) : [],
          qualityIds: res.qualityIds ? res.qualityIds.map((i) => Number(i)) : [],
          talentHonourIds: res.talentHonourIds ? res.talentHonourIds.map((i) => Number(i)) : []
        }
        this.rate = res.rate;
        this.funds = res.funds;
        this.info = res.info;
        this.annex = res.annex;
        this.formData = { ...res };
        this.formData.bank = this.formData.bank == 1 ? true : false;
        if (this.formData.annex == 2) {
          this.formData.annex = false;
        } else if (this.formData.annex == 1) {
          this.formData.option = 1;
          this.formData.annex = true;
        } else if (this.formData.annex == 3) {
          this.formData.option = 3;
          this.formData.annex = true;
        }
        this.color = res.color || "";
        if (res.unit == 1) {
          this.unit = "年";
        }
        if (res.unit == 2) {
          this.unit = "季";
        }
        if (res.unit == 3) {
          this.unit = "月";
        }
        this.times = res.times;
        if (res.bank == 1) {
          this.bank = "银行卡信息";
        }
        // if (res.annex != 2) {
        //   this.annex = "附件信息";
        // }
        if (res.apply == 1) {
          this.apply = "需要申请";
        }
        if (res.apply == 2) {
          this.apply = "不需要申请";
        }
      } catch (e) {}
    },
    backtomanagement() {
      this.$router.push("/PolicyManagement");
    },
  },
  filters: {
    colorFormat(val) {
      if (val) {
        try {
          const f = colorMap.filter((item) => item.color == val);
          return f[0].name;
        } catch (e) {
          return "无";
        }
      } else {
        return "无";
      }
    },
    annexFilter(val) {
      if (val == 1) {
        return "必填";
      }
      if (val == 3) {
        return "选填";
      }
    },
    infoFilter(val) {
      if (val) {
        return "申请需要上传" + val;
      }
    },
  },
  async mounted() {
    await this.getcardsinfo();
    await this.getDetails();
    this.peopleNum = this.$route.query.num;
    this.policyName = this.$route.query.policyName;
  },
};
</script>

<style scoped lang="less">
.homepageTitle {
  height: 10px;
  border-bottom: 2px solid #cccccc;
  opacity: 0.3;
}
/deep/ .el-form-item__label {
  width: 104px !important;
}
.titlewrapper {
  background-color: white;
  padding-top: 25px;
  padding-left: 20px;
  padding-right: 20px;
}
.contentwrapper {
  background-color: white;
  padding: 50px;
  display: flex;
  flex-wrap: wrap;
}
.bankfile {
  margin-right: 30px;
}
.applicationGuide {
  margin-left: 22px;
  color: #f59709;
}
.changeCity {
  display: flex;
  span {
    margin-right: 10px;
  }
}
.success {
  color: #67c23a;
}
.danger {
  color: #f56c6c;
}
.notice {
  margin-left: 23px;
}
.peopleNum {
  cursor: pointer;
  color: #66b1ff;
}
</style>
