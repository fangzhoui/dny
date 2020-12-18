<template>
  <section>
    <!--title-->
    <div class="titlewrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/PolicyManagement' }">政策管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{ secondTitle}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--form-->
    <div class="contentwrapper">
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="政策名称:" prop="name">
          <el-input
            v-model="form.name"
            maxlength="10"
            show-word-limit
            style="width:400px"
            placeholder="请输入政策权益名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="政策编号:" prop="num">
          <el-input
            v-model="form.num"
            maxlength="10"
            style="width:400px"
            placeholder="请输入政策权益编号，如D00001"
            :disabled="disabled"
            show-word-limit
          ></el-input>
          <p class="notice">用于区分政策类型，能更好的精确查询到政策，可使用英文字母编号与数字组合，填写后不能修改。</p>
        </el-form-item>
        <el-form-item label="政策类型" prop="policyType">
          <my-option
            :policyType="form.policyType"
            :tableColumns="policy"
            :disabled="disabled"
            tableValue="政策类型"
            @changeValue="changeValue('policyType',$event)"
          ></my-option>
        </el-form-item>
        <el-form-item label="政策描述:" prop="desc">
          <my-textarea
            tableValue="请输入政策描述"
            :textarea="form.desc"
            @loseFocus="loseFocus('desc',$event)"
          ></my-textarea>
          <p class="applicationGuide">该信息会显示在公众号申报指南中</p>
        </el-form-item>
        <el-form-item label="责任单位" prop="roleId">
          <my-option
            :policyType="form.roleId"
            :tableColumns="responsible"
            tableValue="责任单位"
            @changeValue="changeValue('roleId',$event)"
          ></my-option>
        </el-form-item>
        <el-form-item label="社保要求:" prop="ifSocialSecurity">
          <el-radio-group v-model="form.ifSocialSecurity" class="insuranceBox">
            <el-radio :label="item.value" v-for="item in insuranceTypes" :key="item.value">
              <span>{{ item.label }}</span>
            </el-radio>
          </el-radio-group>
          <div class="changeCity" v-if="flag">
            <span>要求在</span>
            <my-option
              :policyType="form.socialArea"
              :tableColumns="cityTypes"
              @changeValue="changeValue('socialArea',$event)"
            ></my-option>
            <span style="margin-left:10px">缴纳社保,并连续缴纳满</span>
            <el-input-number v-model="form.socialTimes" :min="0" :max="100"></el-input-number>
            <my-option
              :policyType="form.socialUnit"
              :tableColumns="frequencyTypes"
              @changeValue="changeValue('socialUnit',$event)"
            ></my-option>
            <span style="margin-left:10px">社保</span>
          </div>
        </el-form-item>
        <el-form-item label="资金发放形式:" prop="fundsForm">
          <el-radio v-model="form.fundsForm" label= '1'>一次性发放</el-radio>
        </el-form-item>
        <el-form-item label="享受群体:" prop="ids">
          <select-equity-index :form="form" @submit="submitIds" />
        </el-form-item>
        <el-form-item label="申报对象">
          <my-textarea
            tableValue="请输入申报对象"
            :textarea="form.declarationTarget"
            @loseFocus="loseFocus('declarationTarget',$event)"
          ></my-textarea>
          <p class="applicationGuide">该信息会显示在公众号申报指南中</p>
        </el-form-item>
        <el-form-item label="标识颜色:" prop="color">
          <el-radio-group v-model="form.color">
            <el-radio :label="item.color" v-for="item in colorMap" :key="item.color">
              <span>{{ item.name }}</span>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="申请时间:" prop="startTime">
        
          <el-date-picker
            v-model="form.startTime"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择开始日期"
          ></el-date-picker>
          <el-date-picker
            v-model="form.endTime"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择结束日期"
          ></el-date-picker>
        </el-form-item>
        <template>
          <el-form-item label="申请资料:" prop="bankOrAnnex">
            <div>
              <el-checkbox v-model="form.bank">银行卡信息</el-checkbox>
            </div>
            <div style=" margin-bottom: 15px;">
              <el-checkbox v-model="form.annex">附件信息</el-checkbox>
              <template v-if="form.annex">
                <el-select v-model="form.option" style="margin:0px 10px 0px 10px; width:80px">
                  <el-option label="必填" :value="1" />
                  <el-option label="选填" :value="3" />
                </el-select>
                <el-input v-model="form.info" placeholder="附件信息描述" style="width:400px" />
              </template>
            </div>
            <my-textarea
              tableValue="请输入申请材料说明"
              :textarea="form.applyMaterials"
              @loseFocus="loseFocus('applyMaterials',$event)"
            ></my-textarea>
            <p class="applicationGuide">该信息会显示在公众号申报指南中</p>
            <p class="notice">用户提交申请时需要提交所选的信息</p>
          </el-form-item>

          <el-form-item label="政策资金 (元):" prop="funds">
            <el-input
              v-model="form.funds"
              oninput="value=value.replace(/[^\d]/g,'')"
              placeholder="请输入发放的政策资金数额"
              maxlength="9"
              style="width:400px"
            />
            <p class="notice">此数据用于统计发放给人才的政策资金数额，用于展示大数据“政策资金”。</p>
          </el-form-item>
          <el-form-item label="奖励/补助额度">
            <my-textarea
              tableValue="请输入奖励/补助额度"
              :textarea="form.bonus"
              @loseFocus="loseFocus('bonus',$event)"
            ></my-textarea>
            <p class="applicationGuide">该信息会显示在公众号申报指南中</p>
          </el-form-item>
          <el-form-item label="办事流程">
            <my-textarea
              tableValue="请输入办事流程"
              :textarea="form.businessProcess"
              @loseFocus="loseFocus('businessProcess',$event)"
            ></my-textarea>
            <p class="applicationGuide">该信息会显示在公众号申报指南中</p>
          </el-form-item>
          <el-form-item label="咨询电话">
            <my-textarea
              tableValue="请输入联系电话"
              :textarea="form.phone"
              @loseFocus="loseFocus('phone',$event)"
            ></my-textarea>
            <p class="applicationGuide">该信息会显示在公众号申报指南中</p>
          </el-form-item>
        </template>
        <el-form-item>
          <el-button @click="backtomanagement" style="margin-left:400px;">返 回</el-button>
          <el-button type="primary" @click="valuecheck('form')">{{buttonText}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </section>
</template>

<script>
import { getpolicydetail, insertPolicy, editPolicies } from "../../api/api";
import SelectEquityIndex from "@c/checkEquity";
import MyOption from "./components/MyOption";
import { mapState, mapActions, mapGetters } from "vuex";
import MyTextarea from "./components/MyTextarea";
import {
  colorMap,
  options,
  insuranceTypes,
  cityTypes,
  frequencyTypes,
} from "./config";
const SUBMITFORM = {
  name: "",
  num: "",
  desc: "",
  cardIds: [],
  categoryIds: [],
  educIds: [],
  titleIds: [],
  qualityIds: [],
  talentHonourIds: [],
  color: "",
  bank: "",
  annex: "",
  option: "",
  info: "",
  funds: "",
  policyType: 0,
  roleId: 0,
  socialArea: 0,
  socialTimes: 0,
  socialUnit: 1,
  declarationTarget: "",
  applyMaterials: "",
  bonus: "",
  businessProcess: "",
  phone: "",
  startTime: "",
  endTime: "",
};
export default {
  data() {
    const checkIds = (rule, value, callback) => {
      const {
        cardIds,
        categoryIds,
        educIds,
        titleIds,
        qualityIds,
        talentHonourIds,
      } = this.form;
      const arr = [].concat(
        cardIds,
        categoryIds,
        educIds,
        titleIds,
        qualityIds,
        talentHonourIds
      );
      if (arr.length <= 0) {
        callback(new Error("请选择享受群体"));
      } else {
        callback();
      }
    };
    const checkPolicyType = (rule, value, callback) => {
      if (this.form.policyType) {
        callback();
      } else {
        callback(new Error("请选择政策类型"));
      }
    };
    const checkTimeType = (rule, value, callback) => {
      if (this.form.startTime > this.form.endTime && this.form.endTime) {
        callback(new Error("开始时间不能大于结束时间"));
      } else if (this.form.startTime && this.form.endTime) {
        callback();
      } else if (this.form.startTime) {
        this.form.endTime? callback():callback(new Error("请选择结束时间"));
        callback();
      } else {
        callback(new Error("请选择开始时间和结束时间"));
      }
    };
    const checkResponsibility = (rule, value, callback) => {
      if (this.form.roleId) {
        callback();
      } else {
        callback(new Error("请选择责任单位"));
      }
    };
    const checkInsurance = (rule, value, callback) => {
      const {
        ifSocialSecurity,
        socialArea,
        socialTimes,
        socialUnit,
      } = this.form;
      if (!this.flag) {
        callback();
      } else if (ifSocialSecurity && socialArea && socialTimes+1 && socialUnit) {
        callback();
      } else {
        callback(new Error("请输入社保时长要求"));
      }
    };
    const checkBankOrAnnex = (rule, value, callback) => {
      const { bank, annex } = this.form;
      if (bank || annex) {
        callback();
      } else {
        callback(new Error("请选择申请资料"));
      }
    };
    return {
      options,
      insuranceTypes,
      cityTypes,
      frequencyTypes,
      id: "",
      flag: false,
      secondTitle: "",
      buttonText: "",
      type: 0,
      newform: {
        cardIds: [],
        categoryIds: [],
        educIds: [],
        titleIds: [],
        qualityIds: [],
      },
      form: {
        ...SUBMITFORM,
        option: 3,
        fundsForm: '1',
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入政策名称",
            trigger: ["change", "blur"],
          },
        ],
        num: [
          {
            required: true,
            message: "请输入政策编号",
            trigger: ["change", "blur"],
          },
        ],
        desc: [
          {
            required: true,
            message: "请输入政策描述",
            trigger: [ "blur"],
          },
        ],
        ids: [
          { required: true, validator: checkIds, trigger: [ "blur"] },
        ],
        fundsForm: [{ required: true, trigger: ["change", "blur"] }],
        roleId: [
          {
            required: true,
            validator: checkResponsibility,
            trigger: ["change", "blur"],
          },
        ],
        bankOrAnnex: [
          {
            required: true,
            validator: checkBankOrAnnex,
            trigger: ["change", "blur"],
          },
        ],
        policyType: [
          {
            required: true,
            validator: checkPolicyType,
            trigger: ["change", "blur"],
          },
        ],
        color: [
          {
            required: true,
            message: "请选择标识颜色",
            trigger: ["blur", "change"],
          },
        ],
        startTime: [
          {
            required: true,
            validator: checkTimeType,
            trigger: ["blur", "change"],
          },
        ],
        funds: [
          {
            required: true,
            message: "请填写政策资金",
            trigger: ["blur", "change"],
          },
        ],
        ifSocialSecurity: [
          {
            required: true,
            validator: checkInsurance,
            trigger: ["blur"],
          },
        ],
      },
      colorMap: colorMap,
    };
  },
  components: {
    SelectEquityIndex,
    MyOption,
    MyTextarea,
  },
  computed: {
    ...mapState({
      honours: (state) => state.options.honours,
      policy: (state) => state.options.policy,
      responsible: (state) => state.options.responsible,
    }),
    ...mapGetters(["canUserResponsible"]),
    disabled() {
      if (this.type == 3) {
        return false;
      }
      if (this.id) {
        return true;
      }
    },
  },
  watch: {
    "form.ifSocialSecurity"(val) {
      val == 1 ? (this.flag = true) : (this.flag = false);
    },
  },
  methods: {
    changeValue(val, e) {
      this.form[val] = e;
    },
    removetag(tag, arrkey) {
      const index = this.form[arrkey].indexOf(tag);
      this.form[arrkey].splice(index, 1);
    },
    dialogVis() {
      this.newform = {
        ...this.form,
      };
    },
    submitIds(val) {
      this.form = {
        ...val,
      };
      this.$refs["form"].validateField("ids");
    },
    loseFocus(val, e) {
      this.form[val] = e;
    },
    async getDetails(id) {
      this.cardListName = [];
      let para = {
        pid: id,
      };
      try {
        const res = await getpolicydetail(para);
        this.form = {
          ...res,
          cardIds: res.cardIds
            ? res.cardIds.filter((i) => i).map((i) => Number(i))
            : [],
          categoryIds: res.categoryIds
            ? res.categoryIds.filter((i) => i).map((i) => Number(i))
            : [],
          educIds: res.educIds
            ? res.educIds.filter((i) => i).map((i) => Number(i))
            : [],
          titleIds: res.titleIds
            ? res.titleIds.filter((i) => i).map((i) => Number(i))
            : [],
          qualityIds: res.qualityIds
            ? res.qualityIds.filter((i) => i).map((i) => Number(i))
            : [],
          talentHonourIds: res.talentHonourIds
            ? res.talentHonourIds.filter((i) => i).map((i) => Number(i))
            : [],
          bank: res.bank == 1 ? true : false,
          annex: res.annex != 2 ? true : false,
          option: res.annex != 2 ? res.annex : null,
          fundsForm:'1'
        };
        if (this.type == 3) {
          this.form.num = "";
        }
      } catch (e) {}
    },
    backtomanagement() {
      this.$router.go(-1);
    },
    valuecheck(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            const title = this.id ? "修改操作" : "新建操作";
            const message = this.id
              ? "是否确定修改此政策权益？"
              : "是否确定新增此政策权益？";
            await this.$alert(message, title, {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              showCancelButton: true,
            });
            const params = {
              ...this.form,
              bank: this.form.bank ? 1 : 2,
              annex: this.annexformat(),
            };
            delete params.option;
            let res;
            if (this.type == 2) {
              res = await editPolicies(params);
              this.$message.success("编辑政策成功");
            } else {
              res = await insertPolicy(params);
              this.$message.success("新增政策成功");
            }
            // this.$message.success(`${this.id ? "编辑" : "新建"}政策成功`);
            this.backtomanagement();
          } catch (e) {
            console.log(e);
          }
        } else {
          return false;
        }
      });
    },
    annexformat() {
      if (this.form.annex) {
        return this.form.option;
      } else {
        return 2;
      }
    },
  },
  created() {
    this.id = this.$route.query.pid || "";
    this.type = this.$route.query.type || 0;
    if (this.type == 3 || this.type == 1) {
      this.secondTitle = "新增政策";
      this.buttonText = "确认新建";
    } else if (this.type == 2) {
      this.secondTitle = "编辑政策";
      this.buttonText = "确认编辑";
    }
    if (this.id) {
      this.getDetails(this.id);
    }
  },
};
</script>

<style scoped lang="less">
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
.applicationGuide {
  color: #f59709;
}
.changeCity {
  display: flex;
  span {
    margin-right: 10px;
  }
}
// /deep/ .el-form-item__label {
//   width: 110px !important;
// }
.contentwrapper {
  background-color: white;
  padding: 50px;
  display: flex;
  flex-wrap: wrap;
}
.dialogDivider {
  margin-top: -20px;
}
.dialoglabel {
  padding: 0px;
  font-size: 16px !important;
  color: rgba(102, 102, 102, 1);
}
.el-form {
  width: 100%;
}
</style>
