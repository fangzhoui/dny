<template>
  <div class="upload-container">
    <div class="container">
      <p class="b-name" v-if="files.name">{{files.name}}</p>
      <div class="btn-box">
        <el-button icon="el-icon-upload2">{{showBtnText}}</el-button>
        <input class="b-input" type="file" :accept="accept" @change="onChange" />
      </div>
    </div>
    <p class="tip">
      <slot name="tip">
        支持扩展名：.xlsx
      </slot>
    </p>
    <p class="tem">
      <slot name="tem">
        如果没有文件模板，<a :href="downUrl" target="_blank">点我下载</a>
      </slot>
    </p>
  </div>
</template>

<script>
export default {
  name: "inputFile",
  props: {
    limitSize: {
      type: Number,
      default: 1,
      desc: "上传文件大小限制"
    },
    accept: {
      type: String,
      default: '.xlsx'
    }
  },
  computed: {
    showBtnText () {
      const { files } = this
      if (files.name) {
        return '重新上传'
      } else {
        return '上传文件'
      }
    }
  },
  data() {
    return {
      files: {},
      downUrl: `${window.location.origin}/talentcard/excel/default/batch_certification_template.xlsx`
    };
  },
  methods: {
    onChange (e) {
      const file = e.target.files[0]
      if (file) {
        const canUp = this.beforeUpload(file)
        if (canUp) {
          this.files = file
          this.$emit('input', file)
        }
      }
    },
    beforeUpload(file) {
      // 某些电脑取不到 file type 
      const name = file.name;
      const isXls = file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type == 'application/vnd.ms-excel' || (name && /\.xlsx$/.test(name))
      this.size = file.size / 1024 / 1024; // 单位Mb
      if (!isXls) {
        this.$message.error(`请上传${this.accept}格式的文件`);
        return false;
      }
      // 超过阻止
      if (this.limitSize && this.size > this.limitSize) {
        this.$message.error(`上传文件大小不能超过 ${this.limitSize}MB!`);
        return false;
      }
      return (
        isXls &&
        ((this.limitSize && this.size <= this.limitSize) || !this.limitSize)
      );
    }
  }
};
</script>

<style lang="less" scoped>
.upload-container {
  .container {
    display: flex;
    .b-name {
      width: 300px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin-right: 20px;
    }
    .btn-box {
      position: relative;
      width: 117px;
      height: 40px;
      .b-input {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        opacity: 0;
        width: 117px;
        height: 40px;
      }
    }
  }
  .tip {
    font-size: 12px;
    color: #606266;
    line-height: 22px;
  }
  .tem {
    font-size: 12px;
    color: #333;
    line-height: 12px;
    a {
      color: #66b1ff;
    }
  }
}

</style>
