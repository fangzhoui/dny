<template>
  <div class="wrapper">
    <el-row class="subtitlerow">
      <span class="subtitle">学历信息</span>
      <el-button
        type="primary"
        class="addbtn"
        @click="gotoAdd('/Edit/edu')"
        v-if="times < 3 && tabs == 1"
        v-permission="'verifiedTalentUpdate'"
      >新增学历信息</el-button>
    </el-row>
    <el-divider></el-divider>
    <el-row v-if="eduList.length == 0" type="flex" justify="center" align="middle">
      <div class="noinfo">当前没有学历信息</div>
    </el-row>
    <template v-for="(item, index) in eduList">
      <el-divider :key="index" content-position="center" v-if="index != 0">学历信息</el-divider>
      <el-row :key="index" class="formRow">
        <el-col :span="8">
          <span class="label">学历：</span>
          <span class="labelinfo">{{ item.education | educationFilter }}</span>
        </el-col>
        <el-col :span="8">
          <span class="label">学校：</span>
          <span class="labelinfo">{{ item.school }}</span>
          &nbsp
          <span class="labelinfo">
            {{
            item.firstClass | firstClassFilter
            }}
          </span>
        </el-col>
        <el-col :span="8">
          <div class="btnGroup">
            <el-button
              type="primary"
              class="editbtn"
              @click="gotoEdit('/Edit/edu', index)"
              v-permission="'verifiedTalentUpdate'"
               v-if="tabs!=2"
            >编辑</el-button>
            <el-button
              type="primary"
              class="deletebtn"
              @click="goDelete(item)"
              v-permission="'verifiedTalentUpdate'"
               v-if="tabs!=2"
            >删除</el-button>
          </div>
        </el-col>
      </el-row>
      <el-row :key="index" class="formRow">
        <el-col :span="8">
          <span class="label">专业：</span>
          <span class="labelinfo">{{ item.major }}</span>
        </el-col>
        <el-col :span="8">
          <span class="label">毕业时间：</span>
          <span class="labelinfo">{{ item.graduateTime }}</span>
        </el-col>
      </el-row>
      <el-row :key="index" class="formRow">
        <el-col :span="8">
          <span class="label">政策权益：</span>
          <el-link type="primary" @click.native="showBenefits(item)">查看</el-link>
        </el-col>
        <el-col>
          <span class="label">学习形式：</span>
          <span class="labelinfo">{{ item.fullTime==1?'全日制':'在职' }}</span>
        </el-col>
      </el-row>
      <el-row :key="index" class="formRow">
        <span class="label">学历信息证明照片/扫描件：</span>
        <el-link type="primary" @click.native="showImg(item)">查看</el-link>
      </el-row>
    </template>
    <el-dialog title="学历信息对应政策权益" :visible.sync="dialogVisible" width="30%">
      <el-form ref="cardInfo" :model="eduInfo" label-width="100px" v-loading="loading">
        <el-form-item label="学历:">{{ eduInfo.eduId | educationFilter }}</el-form-item>
        <el-form-item label="政策权益：">
          <div v-if="!list.length">无</div>
          <ul v-else class="policyList">
            <li v-for="(item,index) in list" :key="index">{{ item.name }}</li>
          </ul>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="学历信息证明照片/扫描件"
      :visible.sync="showImgFlag"
      width="30%"
      :close-on-click-modal="false"
    >
      <viewer>
        <div v-for="(item,index) in imgUrl" :key="index">
          <img :src="item" class="image-box" />
        </div>
      </viewer>
      <div style="text-align:center;margin-top:20px">
        <el-button @click="showImgFlag = false">返回</el-button>
      </div>
    </el-dialog>
    <el-dialog title="删除操作" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="formName">
        <el-form-item
          label="操作原因"
          prop="text"
          :rules="[
          { required: true, message: '请输入删除原因', trigger: 'blur' },
        ]"
        >
          <el-input
            type="textarea"
            :rows="4"
            show-word-limit
            maxlength="200"
            placeholder="请输入内容"
            v-model="form.text"
          ></el-input>
          <p style="color:#bbb">操作成功后将会通知用户操作原因</p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="surePopUp">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { filterData } from "../../../utils/config";
import { findPolicy, deleteEdu } from "../../../api/api";
import { needlim } from "../viewpage/needlim";
export default {
  props: {
    eduList: {
      type: Array,
      default: () => {},
    },
    openId: {
      type: String,
      default: "",
    },
    times: {
      type: String,
      default: "",
    },
    tabs: { type: String, default: "1" },
  },
  data() {
    return {
      dialogVisible: false,
      showImgFlag: false,
      imgUrl: [],
      eduInfo: {
        eduId: 1,
      },
      list: [],
      loading: true,
      educId: 0,
      dialogFormVisible: false,
      form: {
        text: "",
      },
    };
  },
  computed: {},
  methods: {
    gotoAdd(path) {
      this.$router.push({
        path: path,
        query: {
          type: "add",
          openId: this.openId,
        },
      });
    },
    gotoEdit(path, index) {
      this.$router.push({
        path: path,
        query: {
          type: "edit",
          openId: this.openId,
          index: index,
        },
      });
    },
    async goDelete(item) {
      this.dialogFormVisible = true;
      this.educId = item.educId;
    },
    showBenefits(item) {
      this.dialogVisible = true;
      this.eduInfo.eduId = item.education;
      this.getPolicy();
    },
    showImg(item) {
      this.showImgFlag = true;
      let educPicture = [];
      item.educPicture.split(",").forEach((item) => {
        educPicture.push(needlim(item));
      });
      this.imgUrl = educPicture;
    },
    async getPolicy() {
      try {
        this.loading = true;
        let para = {
          educationList: [this.eduInfo.eduId],
        };
        console.log(para);
        const res = await findPolicy(para);
        this.list = res;
      } catch (e) {
      } finally {
        this.loading = false;
      }
    },
    async surePopUp() {
      this.$refs.formName.validate(async (valid) => {
        if (valid) {
          try {
            let para = {
              openId: this.openId,
              educId: this.educId,
              opinion: this.form.text,
            };
            console.log(11111);
            await deleteEdu(para);
            this.$message.success("删除成功");
            this.$parent.getDetail();
            this.$parent.getRecordForm();
            this.dialogFormVisible = false;
            this.form.text = "";
          } catch (e) {
            this.dialogFormVisible = false;
            console.log(e);
          }
        }
      });
    },
  },

  filters: {
    educationFilter(value) {
      return filterData("educations", value);
    },
    firstClassFilter(value) {
      //3时不显示数据 而不是 ‘以上都不是’
      if (value == 3) {
        return "";
      } else {
        return filterData("natureTypes", value);
      }
    },
  },
  created() {},
};
</script>

<style lang="less" scoped>
.wrapper {
  width: 100%;
  position: relative;
}
.addbtn {
  padding: 0;
  width: 100px;
  height: 30px;
  float: right;
  margin-top: 4px;
}
.btnGroup {
  text-align: right;
  .editbtn {
    padding: 0;
    width: 80px;
    height: 30px;
  }
  .deletebtn {
    padding: 0;
    width: 80px;
    height: 30px;
  }
}
.subtitlerow {
  width: 100%;
}
.subtitle {
  font-size: 15px;
  margin-top: 16px;
  font-weight: bold;
  float: left;
}
.formRow {
  width: 100%;
  margin-bottom: 10px;
  line-height: 30px;
  img {
    width: 400px;
    height: 200px;
  }
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
.noinfo {
  height: 60px;
  color: #999999;
}
.image-box {
  width: 100%;
}
.policyList {
  margin: 0px;
}
</style>
