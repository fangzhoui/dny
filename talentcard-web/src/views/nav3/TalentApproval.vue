<template>
  <div>
    <!--title-->
    <div class="titlewrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/CertifiedPersonnel' }">认证审批</el-breadcrumb-item>
        <el-breadcrumb-item>
          {{
          viewType == "edit" ? "审批" : "详情"
          }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!--基础信息表格-->
    <div class="contentwrapper" v-loading.fullscreen.lock="fullscreenLoading">
      <el-divider></el-divider>
      <BasicInfo :basicform="basicform"></BasicInfo>
      <!--主要人才荣誉表格-->
      <HonourForm :honourform="honourform" @openPic="openPic" v-if="honourform"></HonourForm>
      <!--学历信息表格-->
      <EduForm :eduform="eduform" @openPic="openPic" v-if="eduform"></EduForm>
      <!--职称信息表格-->
      <TitleForm :titleform="titleform" @openPic="openPic" v-if="titleform"></TitleForm>
      <!--职业资格信息表格-->
      <QualityForm :qualityform="qualityform" @openPic="openPic" v-if="qualityform"></QualityForm>
      <!--审批记录表格-->
      <RecordTable :applyRecord="applyRecord"></RecordTable>
      <div style="margin:0 auto; margin-top:30px">
        <el-button @click="backtohome">返回</el-button>
        <el-button v-if="viewType == 'edit'" type="primary" @click="dialogVisible = true">审批</el-button>
      </div>
    </div>
    <!--Pic Dialog-->
    <el-dialog
      :title="showImgTitle"
      :visible.sync="showImgFlag"
      width="340px"
      :close-on-click-modal="false"
      :close="this.imgTitle = ''"
    >
      <viewer>
        <div v-for="(item,index) in imgUrl" :key="index">
          <img :src="item" class="image-box" />
        </div>
      </viewer>
      <div style="text-align:center;margin-top:20px">
        <el-button @click="resetImg">返回</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="审批"
      :visible.sync="dialogVisible"
      width="640px"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <div
        style="width:100%; height:1px; border-bottom:1px solid #ccc;margin-top:-20px; margin-bottom:20px"
      ></div>
      <div style="padding:10px;margin-left:40px">
        <el-form
          label-position="right"
          label-width="100px"
          :model="approvalForm"
          ref="approvalForm"
          :rules="rules"
          required
        >
          <el-form-item label="是否通过:" prop="radio">
            <el-radio-group v-model="approvalForm.radio">
              <el-radio :label="1">通过</el-radio>
              <el-radio :label="2">驳回</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="approvalForm.radio == 1" label="设置人才卡:" prop="talentCardId">
            <el-select
              v-model="approvalForm.talentCardId"
              placeholder="请选择人才卡"
              style="width:300px"
              :disabled="this.$route.query.type == 2"
            >
              <el-option
                v-for="item in cardIds"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="approvalForm.radio == 1" label="设置人才类别:" prop="checkboxGroup1">
            <el-tag
              class="tag-margin"
              :key="item"
              v-for="item in approvalForm.checkboxGroup1"
              closable
              @close="handleClose(item)"
            >{{ formatCategory(item) }}</el-tag>
            <el-button
              type="text"
              @click="newtypeVis = true"
              :disabled="this.approvalForm.radio == 2"
            >添加类别</el-button>
          </el-form-item>
          <el-form-item label="审批意见:" prop="textarea">
            <el-input
              style="width:300px"
              type="textarea"
              :rows="4"
              placeholder="请输入审批意见"
              v-model="approvalForm.textarea"
              maxlength="200"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button style="margin-left:180px;" @click="resetForm('approvalForm')">取 消</el-button>
            <el-button
              :loading="subLoadingflag"
              type="primary"
              @click="passApproval('approvalForm')"
            >确 定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

    <el-dialog
      title="添加人才类别"
      width="640px"
      :visible.sync="newtypeVis"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <el-checkbox-group v-model="approvalForm.checkboxGroup1">
        <el-checkbox-button
          v-for="item in canUserCategories"
          :label="item.value"
          :key="item.value"
        >{{ item.label}}</el-checkbox-button>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetCategory">取 消</el-button>
        <el-button type="primary" @click="newtypeVis = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import BasicInfo from "./viewpage/basic.vue";
import HonourForm from "./viewpage/honour.vue";
import EduForm from "./viewpage/edu.vue";
import TitleForm from "./viewpage/title.vue";
import QualityForm from "./viewpage/quality.vue";
import RecordTable from "./viewpage/record.vue";
import { mapState, mapActions,mapGetters } from "vuex";
import {
  getApprovalUser,
  querycardinfo,
  certConfirm,
  getTalentDetail,
  getCardsFilterBase,
  insertCertification,
  insertCertResult,
} from "../../api/api";
import { talenttypes, categoryFormatterFn } from "./format";
import { filterData, tableFormater } from "../../utils/config";

export default {
  components: {
    BasicInfo,
    HonourForm,
    EduForm,
    TitleForm,
    QualityForm,
    RecordTable,
  },
  watch: {
    imgTitle(newval, oldval) {
      if (oldval != newval && newval == "honour") {
        this.showImgFlag = true;
        this.showImgTitle = "荣誉照片";
      }
      if (oldval != newval && newval == "edu") {
        this.showImgFlag = true;
        this.showImgTitle = "学历照片";
      }
      if (oldval != newval && newval == "title") {
        this.showImgFlag = true;
        this.showImgTitle = "职业照片";
      }
      if (oldval != newval && newval == "quality") {
        this.showImgFlag = true;
        this.showImgTitle = "职业资格照片";
      }
    },
    "basicform.category"(val) {
      const newarr = (val && val.map((item) => Number(item))) || [];
      this.$set(this.approvalForm, "checkboxGroup1", [...newarr]);
    },
  },
  data() {
    return {
      fullscreenLoading: true,
      imgTitle: "",
      imgUrl: [],
      basicform: {},
      honourform: {},
      eduform: {},
      titleform: {},
      qualityform: {},
      applyRecord: [],
      viewType: "",
      dialogVisible: false,
      //dialog的数据
      certId: "",
      showImgTitle: "",
      showImgFlag: false,
      cardIds: [],
      subLoadingflag: false,
      newtypeVis: false,
      types: talenttypes,
      approvalForm: {
        //表单数据
        radio: 1,
        talentCardId: "",
        textarea: "",
        checkboxGroup1: [],
      },
      rules: {
        radio: [
          {
            required: true,
            message: "请选择是否通过",
            trigger: ["blur", "change"],
          },
        ],
        textarea: [
          {
            required: true,
            message: "请输入审批意见",
            trigger: ["blur", "change"],
          },
        ],
        talentCardId: [
          {
            required: true,
            message: "请选择人才卡",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  computed: {
    ...mapState({
      talentapp: (state) => state.common.talentapp,
      categories: (state) => state.options.categories,
    }),
    ...mapGetters(["canUserCategories","canUserHonours"]),
    showRongyu() {
      const { talentHonourPOList = [] } = this.form;
      const picArr = talentHonourPOList
        .map((item) => item.honourPicture)
        .filter((item) => item);
      if (picArr.length > 0) {
        return true;
      } else {
        return false;
      }
    },
    formatCategory() {
      return function (val) {
        for (let i = 0; i < this.categories.length; i++) {
          if (this.categories[i].value == val) {
            return this.categories[i].label;
          }
        }
      };
    },
  },
  methods: {
    ...mapActions(["getTalentapp"]),
    openPic: function (childValue, childValue2) {
      this.imgTitle = childValue;
      this.imgUrl = childValue2;
    },
    handleClose(item) {
      this.approvalForm.checkboxGroup1.splice(
        this.approvalForm.checkboxGroup1.indexOf(item),
        1
      );
    },
    backtohome() {
      this.$router.push("/CertifiedPersonnel");
    },
    passApproval(formName) {
      let approvalTalent = [];
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.subLoadingflag = true;
          let para = {
            talentId: this.$route.query.id,
            certId: this.certId,
            result: this.approvalForm.radio,
            cardId: this.approvalForm.talentCardId,
            category: this.approvalForm.checkboxGroup1.toString(),
            opinion: this.approvalForm.textarea,
          };
          let para2 = {
            talentId: this.$route.query.id,
            insertCertId: this.certId,
            result: this.approvalForm.radio,
            opinion: this.approvalForm.textarea,
            talentCategory: this.approvalForm.checkboxGroup1.toString(),
          };
          try {
            if (this.$route.query.type == 2) {
              const res = await insertCertResult(para2);
              this.subLoadingflag = false;
              this.dialogVisible = false;
              this.$router.push("/CertifiedPersonnel");
              this.getTalentapp();
              this.$message({
                message: "审批成功",
                type: "success",
              });
            } else {
              const res = await certConfirm(para);
              this.subLoadingflag = false;
              this.dialogVisible = false;
              this.$router.push("/CertifiedPersonnel");
              this.getTalentapp();
              this.$message({
                message: "审批成功",
                type: "success",
              });
            }
          } catch (e) {
            this.subLoadingflag = true;
          }
        } else {
          return false;
        }
      });
    },
    resetCategory() {
      this.newtypeVis = false;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible = false;
    },
    resetImg() {
      this.showImgFlag = false;
      this.imgTitle = "";
    },
    async getCard() {
      let para = {};
      try {
        const res = await getCardsFilterBase(para);
        res.map((item) => {
          let title = item.title + "/" + item.initialWord;
          this.cardIds.push({ title: title, id: item.cardId });
        });
      } catch (e) {}
    },
    async getDetails() {
      try {
        this.fullscreenLoading = true;
        let para = {
          talentId: this.$route.query.id,
          certId: this.$route.query.certId,
        };
        const res = await getTalentDetail(para);
        this.basicform = {
          ...res,
          category: res.category ? res.category.split(",") : [],
        };
        this.certId = this.basicform.certId;
        this.honourform = res.talentHonourPOList[0];
        this.eduform = res.educationPOList[0];
        this.titleform = res.profTitlePOList[0];
        this.qualityform = res.profQualityPOList[0];
        this.applyRecord = res.certApprovalBOList;
      } catch (e) {
      } finally {
        this.fullscreenLoading = false;
      }
    },
    async getAddDetails() {
      try {
        this.fullscreenLoading = true;
        let para = {
          talentId: this.$route.query.id,
          insertCertId: this.$route.query.certId,
        };
        const res = await insertCertification(para);
        this.basicform = {
          ...res.basicInfo,
          category: res.basicInfo.category
            ? res.basicInfo.category.split(",")
            : [],
        };
        this.certId = res.insertCertInfo.insertCertId;
        this.honourform = res.insertCertInfo.insertHonourPO;
        this.eduform = res.insertCertInfo.insertEducationPO;
        this.titleform = res.insertCertInfo.insertTitlePO;
        this.qualityform = res.insertCertInfo.insertQualityPO;
        this.applyRecord = res.record;
        this.approvalForm.talentCardId = res.basicInfo.cardId;
      } catch (e) {
      } finally {
        this.fullscreenLoading = false;
      }
    },
  },
  async created() {
    this.viewType = this.$route.query.viewType;
    await this.getCard();
    if (this.$route.query.type == 2) {
      this.getAddDetails();
    } else {
      this.getDetails();
    }
  },
};
</script>

<style lang="less" scoped>
.tag-margin {
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

.subtitleRow {
  width: 100%;
  margin-bottom: 10px;
}

.formRow {
  width: 100%;
  margin-bottom: 10px;
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
/deep/.el-checkbox-button__inner {
  border-left: 1px solid #dcdfe6;
}
</style>
