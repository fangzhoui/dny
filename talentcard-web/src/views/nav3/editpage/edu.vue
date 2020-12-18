<template>
  <el-container>
    <el-header>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/ValidateTalent' }">认证人才</el-breadcrumb-item>
        <el-breadcrumb-item>
          {{
          pageType == "edit" ? "编辑学历信息" : "新增学历信息"
          }}
        </el-breadcrumb-item>
      </el-breadcrumb>
      <el-divider></el-divider>
    </el-header>
    <el-main>
      <el-form ref="educform" :rules="rules" :model="educform" label-width="auto">
        <el-form-item label="学历：" prop="education">
          <el-select v-model="educform.education" placeholder="请选择">
            <el-option
              v-for="item in educations"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学校：" prop="school">
          <el-input
            v-model="educform.school"
            placeholder="请输入内容"
            maxlength="20"
            show-word-limit
            style="width:400px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="学历类型：" prop="firstClass">
          <el-select v-model="educform.firstClass" placeholder="请选择">
            <el-option
              v-for="item in natureTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专业：" prop="major">
          <el-input
            v-model="educform.major"
            placeholder="请输入内容"
            maxlength="20"
            show-word-limit
            style="width:400px;"
          ></el-input>
        </el-form-item>

        <el-form-item label="学历形式" prop="fullTime">
          <el-select v-model="educform.fullTime" placeholder="请选择" @change="onChange">
            <el-option
              v-for="item in fullTimeTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="毕业时间：" prop="graduateTime">
          <el-date-picker
            v-model="educform.graduateTime"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="政策权益：">
          <el-tag type="primary" v-for="item in list" :key="item.id">{{ item.name }}</el-tag>
        </el-form-item>
        <el-form-item label="学历证明照片/扫描件：" prop="educPicture">
          <mulitip-upload
            action="/tcmgr/file/upload"
            projectName="educPicture"
            :imgs="educform.educPicture"
            :maxCount="3"
            :limit="10"
            text="最多上传3张,支持扩展名：png .jpg"
            @successUpload="avatarInput"
          ></mulitip-upload>
        </el-form-item>
        <el-form-item label="操作原因：" prop="descp">
          <el-input
            type="textarea"
            v-model="educform.descp"
            maxlength="200"
            show-word-limit
            style="width:400px"
            :rows="8"
          ></el-input>
          <p style="color:#bbb">操作成功后将会通知用户操作原因</p>
        </el-form-item>
      </el-form>
    </el-main>
    <el-footer>
      <template>
        <el-button @click="goBack">返回</el-button>
        <el-button type="primary" @click="submitForm('educform')">确定编辑</el-button>
      </template>
    </el-footer>
  </el-container>
</template>
<script>
import { educations, natureTypes } from "../../../utils/config";
import { needlim } from "../viewpage/needlim";
import MulitipUpload from "@c/upload/multipleUpload";
import {
  findPolicy,
  addNewEduc,
  editEduc,
  cTalentDetail,
} from "../../../api/api";
export default {
  components: {
    MulitipUpload,
  },
  data() {
    return {
      fullTimeTypes: {
        1: { label: "全日制", value: 1 },
        2: { label: "在职", value: 2 },
      },
      educations,
      natureTypes,
      pageType: "",
      flag: true,
      educform: {
        descp: "",
        education: "",
        school: "",
        firstClass: "",
        fullTime: "",
        major: "",
        graduateTime: "",
        educPicture: [],
      },
      list: [],
      rules: {
        education: [
          {
            required: true,
            message: "请选择学历",
            trigger: ["change", "blur"],
          },
        ],
        school: [
          {
            required: true,
            message: "请输入学校",
            trigger: ["change", "blur"],
          },
        ],
        firstClass: [
          {
            required: true,
            message: "请选择学历类型",
            trigger: ["change", "blur"],
          },
        ],
        fullTime: [
          {
            required: true,
            message: "请选择学历形式",
            trigger: ["change", "blur"],
          },
        ],
        major: [
          {
            required: true,
            message: "请输入专业",
            trigger: ["change", "blur"],
          },
        ],
        graduateTime: [
          {
            required: true,
            message: "请选择毕业时间",
            trigger: ["change", "blur"],
          },
        ],
        educPicture: [
          {
            required: true,
            message: "请上传附件",
            trigger: ["change", "blur"],
          },
        ],
        descp: [
          {
            required: true,
            message: "请填写操作原因",
            trigger: ["change", "blur"],
          },
        ],
      },
    };
  },
  computed: {},
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    avatarInput(val) {
      this.$set(this.educform, "educPicture", val);
      this.$refs["educform"].validateField("educPicture");
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            const isDev = process.env.NODE_ENV == "development";
            const reg = isDev
              ? /http\:\/\/dev.localcards.gov.vbooster.cn/
              : new RegExp(location.origin);
            let params = {
              ...this.educform,
              educPicture: this.educform.educPicture
                .map((i) => i.url.replace(reg, ""))
                .join(","),
              openId: this.$route.query.openId,
              opinion: this.educform.descp,
            };
            if (this.pageType == "add") {
              const title = "新增操作";
              const message = "是否确定新增此用户的学历信息？";
              await this.$alert(message, title, {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                showCancelButton: true,
              });
              await addNewEduc(params);
              this.$router.go(-1);
              this.$message.success("新增成功");
            }
            if (this.pageType == "edit") {
              params.educId = this.educform.educId;
              const title = "编辑操作";
              const message = "是否确定编辑此用户的学历信息？";
              await this.$alert(message, title, {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                showCancelButton: true,
              });
              const res = await editEduc(params);
              this.$router.go(-1);
              this.$message.success("编辑成功");
            }
          } catch (e) {}
        } else {
          return false;
        }
      });
    },
    async getCurrentPolicies() {
      try {
        if (this.flag) {
          let para = {
            educationList: [this.educform.education],
          };
          console.log(para);
          const res = await findPolicy(para);
          this.list = res;
        }
      } catch (e) {}
    },
    async getDetail() {
      try {
        let para = {
          openId: this.$route.query.openId,
        };
        const res = await cTalentDetail(para);
        console.log(res);
        let eduList = res.talentInfo.educationPOList[this.$route.query.index];
        var url = eduList.educPicture;
        if (url) {
          var pictureList = url.split(",");
          let picture = [];
          pictureList.forEach((item) => {
            picture.push(needlim(item));
          });
          this.educform = {
            ...eduList,
            descp: eduList.descp ? eduList.descp : "",
            educPicture: picture.map((item) => {
              return { name: item, url: item };
            }),
          };
        } else {
          this.educform = {
            ...eduList,
            descp: eduList.descp ? eduList.descp : "",
            educPicture: [],
          };
        }

        this.educform.fullTime == 1 ? (this.flag = true) : (this.flag = false);
      } catch (e) {
        console.log(e, 111);
      }
    },
    onChange(val) {
      this.val == 1 ? (this.flag = true) : (this.flag = false);
    },
  },
  watch: {
    educform: {
      handler: function (newvalue, oldvalue) {
        this.getCurrentPolicies();
      },
      deep: true,
    },
  },
  filters: {},
  created() {},
  mounted() {
    if (this.$route.query.type == "add") {
      this.pageType = "add";
    }
    if (this.$route.query.type == "edit") {
      this.pageType = "edit";
      this.getDetail();
    }
  },
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
.content {
  background: #f5f5f5;
  margin-top: 20px;
  padding: 20px 32px;
  position: relative;
  border-radius: 5px;
  .deletebtn {
    width: 20px;
    height: 20px;
    position: absolute;
    top: -10px;
    right: -10px;
    z-index: 999;
    background: #999999;
    border-radius: 50%;
    color: white;
    font-size: 3px;
    text-align: center;
    line-height: 18px;
    cursor: pointer;
  }
}
.avatar-uploader-icon {
  border-radius: 6px;
  cursor: pointer;
  border: 1px solid #d9d9d9;
  font-size: 12px;
  color: #8c939d;
  width: 120px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.avatar {
  width: 300px;
  height: 190px;
  display: block;
  background-size: 100% 100%;
  position: relative;
  overflow: hidden;
  border-radius: 6px;
}
/deep/ .el-tag {
  margin-right: 16px;
}
</style>
