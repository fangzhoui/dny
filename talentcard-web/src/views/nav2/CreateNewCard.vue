<template>
  <section>
    <!--title-->
    <div class="titlewrapper">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/CardManagement' }"
          >人才卡管理</el-breadcrumb-item
        >
        <el-breadcrumb-item>{{ !id ? "添加卡片" : "编辑" }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--form-->
    <div class="contentwrapper">
      <el-form
        ref="form"
        :model="form"
        label-width="160px"
        :rules="rules"
        label-position="right"
      >
        <el-form-item label="商户名称:" prop="retailname">
          <el-input
            :disabled="!!id"
            v-model="form.retailname"
            maxlength="12"
            style="width:300px"
            show-word-limit
            placeholder="请输入商户名称"
          ></el-input>
          <p class="notice">*在人才卡上展示给用户的标题</p>
        </el-form-item>
        <el-form-item label="卡片名称:" prop="cardname">
          <el-input
            v-model="form.cardname"
            maxlength="9"
            show-word-limit
            style="width:300px"
            placeholder="请输入卡片名称"
          ></el-input>
          <p class="notice">*在人才卡上展示给用户的名称</p>
        </el-form-item>
        <el-form-item label="卡片编号前缀:" prop="precode">
          <el-input
            :disabled="!!id"
            v-model="form.precode"
            maxlength="4"
            show-word-limit
            style="width:300px"
            placeholder="请输入卡片编号前缀"
          ></el-input>
          <p class="notice">
            *前缀填写后无法修改，最多四位，可跟后缀拼成完成卡号，如Y010000001，W010000001，R010000001，用户获取卡后卡号编号自动加1。
          </p>
        </el-form-item>
        <!-- <el-form-item label="卡片编号后缀:" prop="endcode">
          <el-input
            :disabled="!!id"
            v-model="form.endcode"
            maxlength="6"
            show-word-limit
            style="width:300px"
            placeholder="请输入卡片编号后缀"
          ></el-input>
          <p class="notice">*后缀填写后无法修改，跟前缀组成完整的卡号，如D000000，JW0000000，RCK0000000，用户获取卡后卡号编号自动加1。</p>
        </el-form-item> -->
        <el-form-item label="卡片描述:" prop="desc">
          <el-input
            type="textarea"
            v-model="form.desc"
            maxlength="100"
            show-word-limit
            :autosize="{ minRows: 4 }"
            style="width:400px"
            placeholder="请输入卡片描述"
          ></el-input>
        </el-form-item>
        <el-form-item label="背景图:" prop="background" ref="uploadimg">
          <el-upload
            class="avatar-uploader"
            action
            :show-file-list="false"
            :http-request="uploadSectionFile"
            :on-change="handleChange"
            ref="uploaded"
          >
            <div
              v-if="showpreview"
              :style="{ backgroundImage: 'url(' + imageUrl + ')' }"
              class="avatar"
            >
              <span class="close" @click.stop="close">X</span>
              <div class="cardtitleArea">
                <div class="selfie"></div>
                <div class="cardNameArea">
                  <div class="cardTitle">{{ form.retailname }}</div>
                  <div class="cardName">{{ form.cardname }}</div>
                </div>
                <div class="cardCodeArea">
                  {{ form.precode }}{{ `${form.precode ? "010000001" : ""}` }}
                </div>
              </div>
            </div>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="notice" slot="tip">
              只能上传一张，尺寸1000*600，支持扩展名：png jpg
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="每年可领取旅游次数:" prop="tripTimes">
          <el-input
            v-model="form.tripTimes"
            placeholder="请输入每月旅游总数"
            maxlength="7"
            oninput="value=value.replace(/[^\d]/g,'')"
            style="width:300px"
          ></el-input
          >&nbsp次
        </el-form-item>
        <el-form-item style="text-align:center;margin-top:50px">
          <el-button @click="backToManagementPage">返 回</el-button>
          <el-button
            type="primary"
            @click="submit('form')"
            :disabled="createAble"
            >确 定</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </section>
</template>

<script>
import { addcard, findOne, editcard } from "../../api/api";
export default {
  data() {
    var validateImg = (rule, value, callback) => {
      if (this.form.background) {
        callback();
      } else {
        callback(new Error("请上传背景图"));
      }
    };
    return {
      id: "",
      closes: false,
      form: {
        retailname: "",
        cardname: "",
        precode: "",
        // endcode: "",
        desc: "",
        background: "",
        tripTimes: "",
      },
      fileList: [],
      imageUrl: "",
      showpreview: false,
      createAble: false,
      rules: {
        retailname: [
          {
            required: true,
            message: "请输入商户名称",
            trigger: ["blur", "change"],
          },
        ],
        cardname: [
          {
            required: true,
            message: "请输入卡片名称",
            trigger: ["blur", "change"],
          },
        ],
        precode: [
          {
            required: true,
            message: "请输入卡片编号前缀",
            trigger: ["blur", "change"],
          },
          { pattern: /^[A-Za-z]+$/, message: "只能输入英文" },
        ],
        tripTimes: [
          {
            required: true,
            message: "请输入每月旅游总数",
            trigger: ["blur", "change"],
          },
        ],
        desc: [
          {
            required: true,
            message: "请输入卡片描述",
            trigger: ["blur", "change"],
          },
        ],
        background: [
          {
            required: true,
            validator: validateImg,
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  methods: {
    handleChange(file, fileList) {
      var _this = this;
      const isTypeTrue = /^image\/(png|jpg|jpeg)$/.test(file.raw.type);
      if (!isTypeTrue) {
        this.$message.error("上传图片格式不对!");
        this.createAble = true;
        this.showpreview = false;
        return;
      }
      new Promise(function(resolve, reject) {
        let width = 1000;
        let height = 600;
        let _URL = window.URL || window.webkitURL;
        let img = new Image();
        img.onload = function() {
          let valid = img.width == width && img.height == height;
          valid ? resolve() : reject();
        };
        img.src = _URL.createObjectURL(file.raw); //onload是异步加载
      }).then(
        () => {
          _this.imageUrl = URL.createObjectURL(file.raw);
          this.createAble = false;
          this.showpreview = true;
        },
        () => {
          this.$message.error("图片尺寸有误，请重新上传");
          this.createAble = true;
          this.showpreview = false;
        }
      );

      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]]; // 这一步，是 展示最后一次选择的csv文件
      }
    },
    uploadSectionFile(params) {
      this.form.background = params.file;
      this.$refs["form"].validateField("background");
      this.imageUrl = URL.createObjectURL(params.file);
    },
    backToManagementPage() {
      this.$router.push("/CardManagement");
    },
    submit(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            const title = this.id ? "编辑操作" : "新建操作";
            const message = this.id ? "是否编辑此人才卡?" : "是否新建此人才卡?";
            this.$alert(message, title, {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              showCancelButton: true,
              beforeClose: async (action, instance, done) => {
                if (action === "confirm") {
                  instance.confirmButtonLoading = true;
                  let formData = new FormData();
                  formData.append("title", this.form.cardname);
                  formData.append("background", this.form.background);
                  formData.append("businessDescription", this.form.desc);
                  try {
                    if (this.id) {
                      formData.append("tripTimes", this.form.tripTimes);
                      formData.append("cardId", this.id);
                      await editcard(formData);
                    } else {
                      formData.append("name", this.form.retailname);
                      formData.append(
                        "initialWord",
                        this.form.precode.toUpperCase()
                      );
                      formData.append("tripTimes", this.form.tripTimes);
                      // formData.append("initialNumber", this.form.endcode);
                      formData.append("status", "2");
                      await addcard(formData);
                    }
                    this.$message({
                      message: `人才卡${this.id ? "修改" : "新建"}成功`,
                      type: "success",
                    });
                    instance.confirmButtonLoading = false;
                    done();
                    this.$router.push("/CardManagement");
                  } catch (e) {
                    done();
                    instance.confirmButtonLoading = false;
                  }
                } else {
                  done();
                }
              },
            });
          } catch (e) {}
        }
      });
    },
    async getdetailinfo(id) {
      if (!id) return;
      let para = {
        cardId: id,
      };
      try {
        const res = await findOne(para);
        this.$set(this.form, "retailname", res.name);
        this.$set(this.form, "cardname", res.title);
        this.$set(this.form, "precode", res.initialWord);
        // this.$set(this.form, "endcode", res.initialNum);
        this.$set(this.form, "desc", res.businessDescription);
        this.$set(this.form, "background", res.picture);
        this.$set(this.form, "tripTimes", res.tripTimes);
        if (res.picture) {
          this.createAble = false;
          this.showpreview = true;
          this.imageUrl = res.picture;
        }
      } catch (e) {}
    },
    close() {
      this.showpreview = false;
      this.closes = true;
      this.$set(this.form, "background", "");
      this.imageUrl = "";
      this.$refs["form"].validateField("background");
    },
  },
  created() {
    this.id = this.$route.query.id || "";
    this.getdetailinfo(this.id);
  },
};
</script>

<style scoped>
.close {
  position: absolute;
  color: #fff;
  top: 5px;
  right: 5px;
  font-weight: 700;
  font-size: 16px;
  display: inline-block;
  width: 30px;
  height: 30px;
  line-height: 30px;
  border-radius: 50%;
  color: rgb(238, 96, 96);
  background-color: #fff;
  z-index: 999;
}
.none {
  display: none;
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
  padding: 50px;
  display: flex;
  flex-wrap: wrap;
}
.notice {
  color: #999999;
  font-size: 10px;
  margin: 5px 0 0 0;
  padding: 0;
  line-height: 16px;
}

.avatar-uploader-icon {
  border-radius: 6px;
  cursor: pointer;
  border: 1px dashed #d9d9d9;
  font-size: 28px;
  color: #8c939d;
  width: 300px;
  height: 178px;
  line-height: 178px;
  text-align: center;
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

.cardtitleArea {
  color: white;
}
.selfie {
  width: 45px;
  height: 40px;
  float: left;
  background-image: url(../../assets/quzhou-logo.png);
  background-size: 100% 100%;
  margin-top: 20px;
  margin-left: 10px;
}
.cardNameArea {
  margin-top: 5px;
  width: 80px;
  height: 178px;
  float: left;
}
.cardNameArea .cardTitle {
  position: absolute;
  margin-top: 5px;
  margin-left: 15px;
}
.cardNameArea .cardName {
  position: absolute;
  margin-top: 30px;
  margin-left: 15px;
  font-size: 12px;
}
.cardCodeArea {
  width: 60px;
  float: left;
  margin-top: 35px;
  margin-left: 50px;
}
.checkcode {
  margin-top: -30px;
  margin-left: 200px;
}
</style>
