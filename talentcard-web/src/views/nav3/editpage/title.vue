<template>
  <el-container>
    <el-header>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/ValidateTalent' }">认证人才</el-breadcrumb-item>
        <el-breadcrumb-item>
          {{
          pageType == "edit" ? "编辑职称信息" : "新增职称信息"
          }}
        </el-breadcrumb-item>
      </el-breadcrumb>
      <el-divider></el-divider>
    </el-header>
    <el-main>
      <el-form ref="titleform" :rules="rules" :model="titleform" label-width="auto">
        <el-form-item label="职称：" prop="category">
          <el-select v-model="titleform.category" placeholder="请选择">
            <el-option
              v-for="item in titles"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职称信息：" prop="info">
          <el-input
            v-model="titleform.info"
            placeholder="请输入内容"
            maxlength="20"
            show-word-limit
            style="width:400px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="政策权益：">
          <el-tag type="primary" v-for="item in policyList" :key="item.id">{{ item.name }}</el-tag>
        </el-form-item>
        <el-form-item label="专业技术资格照片/扫描件：" prop="picture">
          <mulitip-upload
            action="/tcmgr/file/upload"
            projectName="profTitle"
            :imgs="titleform.picture"
            :maxCount="3"
            :limit="10"
            text="最多上传3张,支持扩展名：png .jpg"
            @successUpload="avatarInput"
          ></mulitip-upload>
        </el-form-item>
        <el-form-item label="操作原因：" prop="descp">
          <el-input
            type="textarea"
            v-model="titleform.descp"
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
        <el-button type="primary" @click="submitForm('titleform')">确定编辑</el-button>
      </template>
    </el-footer>
  </el-container>
</template>

<script>
import { titles } from "../../../utils/config";
import MulitipUpload from "@c/upload/multipleUpload";
import { needlim } from "../viewpage/needlim";
import {
  findPolicy,
  addNewTitle,
  editTitle,
  cTalentDetail,
} from "../../../api/api";
export default {
  data() {
    return {
      titles,
      pageType: "",
      titleform: {
        category: "",
        info: "",
        picture: [],
        descp: "",
      },
      policyList: [],

      rules: {
        category: [
          {
            required: true,
            message: "请选择职称",
            trigger: ["change", "blur"],
          },
        ],
        info: [
          {
            required: true,
            message: "请输入职称信息",
            trigger: ["change", "blur"],
          },
        ],
        picture: [
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
  components: { MulitipUpload },
  computed: {},
  methods: {
    deleteTitle(index) {
      this.editList.splice(index, 1);
    },
    newTitle() {
      this.editList.push({ name: "" });
    },
    goBack() {
      this.$router.go(-1);
    },
    avatarInput(val) {
      this.$set(this.titleform, "picture", val);
      this.$refs["titleform"].validateField("picture");
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
              ...this.titleform,
              picture: this.titleform.picture
                .map((i) => i.url.replace(reg, ""))
                .join(","),
              openId: this.$route.query.openId,
              opinion: this.titleform.descp,
            };
            if (this.pageType == "add") {
              const title = "新增操作";
              const message = "是否确定新增此用户的职称信息？";
              await this.$alert(message, title, {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                showCancelButton: true,
              });
              await addNewTitle(params);
              this.$router.go(-1);
              this.$message.success("新增成功");
            }
            if (this.pageType == "edit") {
              params.ptId = this.titleform.ptId;
              delete params.certId;
              delete params.ifCertificate;
              delete params.status;
              delete params.talentId;
              const title = "编辑操作";
              const message = "是否确定编辑此用户的职称信息？";
              await this.$alert(message, title, {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                showCancelButton: true,
              });
              const res = await editTitle(params);
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
        let para = {
          titleList: [this.titleform.category],
        };
        const res = await findPolicy(para);
        this.policyList = res;
      } catch (e) {}
    },
    async getDetail() {
      try {
        let para = {
          openId: this.$route.query.openId,
        };
        const res = await cTalentDetail(para);
        console.log(res, 111111111);
        let titleList = res.talentInfo.profTitlePOList[this.$route.query.index];
        var url = titleList.picture;
        if (url) {
          var pictureList = url.split(",");
          let picture = [];
          pictureList.forEach((item) => {
            picture.push(needlim(item));
          });
          this.titleform = {
            ...titleList,
            descp: titleList.descp ? titleList.descp : "",
            picture: picture.map((item) => {
              return { name: item, url: item };
            }),
          };
        } else {
          this.titleform = {
            ...titleList,
            descp: titleList.descp ? titleList.descp : "",
            picture: [],
          };
        }
      } catch (e) {}
    },
  },
  watch: {
    titleform: {
      handler: function (newvalue, oldvalue) {
        this.getCurrentPolicies();
      },
      deep: true,
    },
  },
  filters: {},
  created() {},
  mounted() {
    if (this.$route.query.type == "edit") {
      this.pageType = "edit";
      this.getDetail();
    }
    if (this.$route.query.type == "add") {
      this.pageType = "add";
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
