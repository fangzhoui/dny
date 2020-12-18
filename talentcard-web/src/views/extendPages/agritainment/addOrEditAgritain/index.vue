<template>
  <div class="form-container">
    <div class="form-container-header">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="bread-crumb-self">
        <el-breadcrumb-item :to="{ path: '/extend/agritainment' }">农家乐</el-breadcrumb-item>
        <el-breadcrumb-item>{{id ? '编辑农家乐' : '新建农家乐'}}</el-breadcrumb-item>
      </el-breadcrumb>
      <el-divider class="divider-self"></el-divider>
    </div>
    <div class="form-container-content">
      <el-form autocomplete="off" ref="form" :model="form" :rules="rules" label-width="140px">
        <el-form-item label="农家乐名称:" prop="name">
          <el-input
            v-model="form.name"
            autocomplete="off"
            show-word-limit
            type="text"
            placeholder="请输入农家乐名称"
            class="content-width"
            maxlength="8"
          ></el-input>
        </el-form-item>
        <el-form-item label="优惠折扣:" prop="discount">
          <el-input autocomplete="off" v-model="form.discount" placeholder="请输入优惠折扣" class="content-width"></el-input>
        </el-form-item>
        <el-form-item label="特色简介:" prop="intro">
          <el-input
            v-model="form.intro"
            show-word-limit
            type="text"
            placeholder="请输入特色简介"
            class="content-width"
            maxlength="20"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="农家乐位置:" prop="position">
          <el-select v-model="form.area" placeholder="请选择区域" class="content-width">
            <el-option
              v-for="item in areaConfig"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input
            style="margin-left: 7px"
            v-model="form.location"
            autocomplete="off"
            show-word-limit
            type="text"
            placeholder="请输入位置详情"
            class="content-width count_inner_padding"
            maxlength="20"
          ></el-input>
        </el-form-item>
        <el-form-item label="人均消费:" prop="consume">
          <el-input
            v-model.number="form.consume"
            type="text"
            autocomplete="off"
            :min="0"
            placeholder="请输入人均消费金额"
            class="content-width"
          >
            <template slot="append">元 / 人</template>
          </el-input>
        </el-form-item>
        <el-form-item label="享受群体:" prop="ids">
          <select-equity-index :form="form" @submit="submitIds" :type="2"/>
        </el-form-item>
        <el-form-item label="农家乐头图:" prop="avatar">
          <is-one-upload
            action="/tcmgr/farmhouse/upload"
            tip="只能上传1张，尺寸750*344，支持扩展名：png .jpg"
            class="upload-single-img"
            :fileList="form.avatar"
            :isReview="true"
            :isDel="true"
            @input="avatarInput"
            projectName="farmhouse"
          ></is-one-upload>
        </el-form-item>
        <el-form-item label="农家乐轮播图:" prop="picture">
          <mulitip-upload
            action="/tcmgr/farmhouse/upload"
            :imgs="form.picture"
            :maxCount="10"
            @successUpload="pictureInput"
            projectName="farmhouse"
            text="只能上传10张以内，尺寸750*344，支持扩展名：png .jpg"
          ></mulitip-upload>
        </el-form-item>
        <el-form-item label="农家乐介绍信息:" prop="desc">
          <span class="edit-span" @click="descEdit = true">编辑</span>
        </el-form-item>
        <el-form-item label="备注:" prop="extra">
          <span class="edit-span" @click="extraEdit = true">编辑</span>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancel" style="margin-left:400px;">返 回</el-button>
          <el-button type="primary" @click="valuecheck('form')">确 定</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog :visible.sync="descEdit" width="840px" :close-on-click-modal="false" append-to-body>
      <VueEditor
        ref="desc"
        placeholder="请输入农家乐介绍信息"
        id="desc"
        :visible="descEdit"
        :defaultContent="form.desc"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDesc('desc')">取 消</el-button>
        <el-button type="primary" @click="saveDesc('desc')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="extraEdit" width="840px" :close-on-click-modal="false" append-to-body>
      <VueEditor
        ref="extra"
        placeholder="请输入备注信息，可补充农家乐联系人，联系方式等信息"
        id="extra"
        :visible="extraEdit"
        :defaultContent="form.extra"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDesc('extra')">取 消</el-button>
        <el-button type="primary" @click="saveDesc('extra')" :loading="loading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getFarmhouseDetailsApi, saveFarmhouseDetailsApi } from "@/api/api";
import SelectEquityIndex from "@c/checkEquity";
import { emptyArr } from "@/utils/validator";
import { deepCopy } from "@/utils";
import MulitipUpload from "@c/upload/multipleUpload";
import IsOneUpload from "@c/upload/isOneUpload";
import VueEditor from "@c/editor";
import { areaConfig } from "../../config";
const FORM = {
  name: "",
  discount: null,
  intro: "",
  area: "",
  location: "",
  consume: null,
  cardIds: [],
  talentHonourIds: [],
  categoryIds: [],
  educIds: [],
  titleIds: [],
  qualityIds: [],
  avatar: [],
  picture: [],
  desc: "",
  extra: ""
};
export default {
  name: "ExtendPagesAddOrEditAgritain",
  components: {
    SelectEquityIndex,
    MulitipUpload,
    IsOneUpload,
    VueEditor
  },
  props: {},
  data() {
    const checkIds = (rule, value, callback) => {
      const {
        cardIds,
        categoryIds,
        educIds,
        titleIds,
        qualityIds,
        talentHonourIds
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
        callback(new Error("请设置享受群体"));
      } else {
        callback();
      }
    };
    const checkDiscount = (rule, value, callback) => {
      if (value) {
        let pattern = /^[0-9]{1}([.]{1}[0-9]{1}){0,1}$/;
        if (pattern.test(value)) {
          if (Number(value) <= 0) {
            callback(new Error("请输入0.1-9.9之间的数字，最多一位小数"));
          } else {
            callback();
          }
        } else {
          callback(new Error("请输入0.1-9.9之间的数字，最多一位小数"));
        }
      } else {
        callback(new Error("请输入优惠折扣"));
      }
    };
    const checkPosition = (rule, value, callback) => {
      const { area, location } = this.form;
      if (typeof area != "number" && !area) {
        callback(new Error("请选择区域"));
      }
      if (!location) {
        callback(new Error("请输入位置详情"));
      }
      if (area && location) {
        callback();
      }
    };
    return {
      id: "",
      loading: false,
      form: deepCopy(FORM),
      rules: {
        name: [
          {
            required: true,
            message: "请输入农家乐名称",
            trigger: ["change", "blur"]
          }
        ],
        ids: [
          { required: true, validator: checkIds, trigger: ["change", "blur"] }
        ],
        intro: [
          {
            required: true,
            message: "请输入特色简介",
            trigger: ["change", "blur"]
          }
        ],
        position: [
          {
            required: true,
            validator: checkPosition,
            trigger: ["change", "blur"]
          }
        ],
        consume: [
          {
            required: true,
            message: "请输入人均消费金额",
            trigger: ["change", "blur"]
          },
          { type: "number", min: 0, message: "人均消费金额必须是正整数" }
        ],
        avatar: [
          {
            required: true,
            validator: emptyArr,
            message: "请上传农家乐头图",
            trigger: ["blur", "change"]
          }
        ],
        picture: [
          {
            required: true,
            validator: emptyArr,
            message: "请上传农家乐轮播图",
            trigger: ["blur", "change"]
          }
        ],
        extra: [
          { required: true, message: "请输入备注", trigger: ["blur", "change"] }
        ],
        desc: [
          {
            required: true,
            message: "请输入农家乐介绍信息",
            trigger: ["blur", "change"]
          }
        ],
        discount: [
          {
            required: true,
            validator: checkDiscount,
            trigger: ["change", "blur"]
          }
        ]
      },
      descEdit: false,
      extraEdit: false,
      areaConfig
    };
  },
  created() {
    this.id = this.$route.query.id || "";
    if (this.id) {
      this.getScenicDetails(this.id);
    }
  },
  methods: {
    valuecheck(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            const params = {
              ...this.form,
              avatar: this.form.avatar[0].url,
              picture: this.form.picture.map(i => i.url)
            };
            this.loading = true;
            const title = this.id ? "编辑操作" : "新建操作";
            const message = this.id
              ? "是否确定编辑此农家乐？"
              : "是否确定创建此农家乐？";
            await this.$alert(message, title, {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              showCancelButton: true
            });
            await saveFarmhouseDetailsApi(params);
            this.$message.success(`${this.id ? "编辑" : "新建"}农家乐成功`);
            this.$router.go(-1);
          } catch (e) {
            if (e && e.status == 1101) {
              this.$message.error("农家乐名称已存在，请重填");
            }
          } finally {
            this.loading = false;
          }
        } else {
          return false;
        }
      });
    },
    async getScenicDetails(id) {
      try {
        const params = {
          farmhouseId: id
        };
        const res = await getFarmhouseDetailsApi(params);
        this.form = {
          ...res,
          talentHonourIds: res.talentHonourIds || [],
          avatar: res.avatar ? [{ url: res.avatar }] : [],
          picture:
            res.picture &&
            res.picture.map(i => {
              return {
                url: i
              };
            })
        };
      } catch (e) {}
    },
    cancel() {
      this.$router.go(-1);
    },
    submitIds(val) {
      this.form = {
        ...val
      };
      this.$refs["form"].validateField("ids");
    },
    avatarInput(val) {
      this.$set(this.form, "avatar", val);
      this.$refs["form"].validateField("avatar");
    },
    pictureInput(arr) {
      this.$set(this.form, "picture", arr);
      this.$refs["form"].validateField("picture");
    },
    cancelDesc(key) {
      this.$set(this.form, key, this.form[key]);
      this.closeDialog();
    },
    closeDialog() {
      this.descEdit = false;
      this.extraEdit = false;
    },
    saveDesc(key) {
      const content = this.$refs[key].content;
      this.$set(this.form, key, content);
      this.$refs["form"].validateField(key);
      this.closeDialog();
    }
  }
};
</script>

<style lang="less" scoped>
.edit-span {
  cursor: pointer;
  height: 20px;
  font-size: 14px;
  color: rgba(54, 152, 233, 1);
  text-decoration: underline;
}
</style>
