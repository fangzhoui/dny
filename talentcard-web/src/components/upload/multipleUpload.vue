<template>
  <div>
    <el-upload
      v-loading="loading"
      element-loading-text="图片上传中"
      class="upload"
      :action="action"
      ref="upload"
      name="file"
      list-type="picture-card"
      :on-success="success"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :http-request="http"
      :before-upload="beforeUpload"
      :on-exceed="handleExceed"
      multiple
      :limit="maxCount"
      :file-list="fileList"
    >
      <i class="el-icon-plus"></i>
      <div slot="tip" class="el-upload__tip">{{text}}</div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>
/**
*
<multiple-upload></multiple-upload>
* import MultipleUpload from '@/components/Upload/multipleUpload'
* @param {Array} list  已有的数据列表[{url: ''}]
* @param {Number} maxCount  最大上传张数
*/
<script>
import { host } from "@/common/js/env";
export default {
  name: "index",
  model: {
    prop: "imgs",
    event: "change"
  },
  props: {
    maxCount: {
      type: Number,
      default: 10000
    },
    isCropper: {
      type: Boolean,
      default: false
    },
    imgs: {
      type: Array,
      default: () => []
    },
    text: {
      type: String,
      default: ""
    },
    action: {
      type: String,
      default: ""
    },
    limit: {
      type: Number,
      default: 1
    },
    projectName: {
      type: String,
      default: ""
    }
  },
  watch: {
    imgs: {
      immediate: true,
      handler(val) {
        this.fileList = val || [];
      }
    }
  },
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      dialogShow: false,
      visibleCropper: false,
      curIndex: "",
      fileList: [],
      loading: false,
      num: 0
    };
  },
  methods: {
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.size ? file.response.result : file.url;
      this.fileList.map((o, index) => {
        if (o.url === file.url) this.curIndex = index;
      });
      this.dialogVisible = true;
    },
    success(file, data, cur) {
      this.fileList.push({ url: this.needlim(file.data) });
      this.num -= 1;
      if (this.num === 0) {
        this.loading = false;
      }
      console.log(this.fileList);
      this.$emit("successUpload", this.fileList);
    },
    // 移除操作
    handleRemove(file, fileList) {
      let arr = [];
      this.fileList.map(list => {
        if (list.url !== file.url) {
          arr.push(list);
        }
      });
      this.fileList = arr;
      this.$emit("successUpload", arr);
    },
    async http(val) {
      let file = val.file;
      let param = new FormData(); // 创建form对象
      param.append("file", file, file.name); // 通过append向form对象添加数据
      param.append("projectName", this.projectName);
      let config = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      };
      this.num += 1;
      this.loading = true;
      try {
        let response = await this.$axios.post(this.action, param, config);
        if (response.status === 200) {
          const code = response.data && response.data.status;
          if ([1000, "1000"].includes(code)) {
            this.success(response.data);
          } else {
           throw error()
          }
        } else {
          throw error()
        }
      } catch (e) {
        this.num -= 1;
        this.loading = false;
        this.$message.error(`图片上传失败!`);
        let ul = this.$el.getElementsByClassName(
          "el-upload-list__item is-success"
        );
        let len = ul.length - 1;
        ul.removeChild(ul[len]);
      }
    },
    // 查看操作
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.size ? file.response.result : file.url;
      this.fileList.map((o, index) => {
        if (o.url === file.url) this.curIndex = index;
      });
      this.dialogVisible = true;
    },
    // 图片上传之前判断文件类型和大小
    beforeUpload(file) {
      const isJPG = file.type === "image/png" || file.type === "image/jpeg";
      const isLt1M = file.size / 1024 / 1024 < this.limit;
      if (!isJPG) {
        this.loading = false;
        this.$message.error("请上传png,jpg格式的图片");
        return false;
      }
      if (!isLt1M) {
        this.loading = false;
        this.$message.error(`上传图片大小不能超过 ${this.limit}MB!`);
        return false;
      }
      return isJPG;
    },
    // 超出上传个数限制>maxCount 时
    handleExceed() {
      this.loading = false;
      this.$message({
        message: "不可上传多于" + this.maxCount + "张的图片",
        type: "warning",
        duration: 1000
      });
    },
    needlim(url = "") {
      const httpReg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
      const isDev = process.env.NODE_ENV == "development";
      const origin = window.location.origin;
      if (httpReg.test(url)) {
        return url;
      } else {
        if (!/^\//.test(url)) url = "/" + url;
        if (isDev) {
          return `http://dev.localcards.gov.vbooster.cn${url}`;
        } else {
          return `${origin}${url}`;
        }
      }
    }
  }
};
</script>
