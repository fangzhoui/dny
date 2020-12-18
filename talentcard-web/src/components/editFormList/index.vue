<template>
    
        <el-form ref="form" :model="content" label-width="auto">
        <!--荣誉-->
            <el-form-item v-if="type=='honour'" label="人才荣誉：" required>
                <el-select v-model="content.name" placeholder="请选择">
                    <el-option
                    v-for="item in categories"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    >
                    </el-option>
                </el-select>
            </el-form-item >
            <el-form-item label="政策权益：" v-if="type=='honour'">
                <el-tag type="primary" v-for="item in items" :key="item.id"> {{item.name}}</el-tag>
            </el-form-item >

            <el-form-item label="人才荣誉证明照片/扫描件：" v-if="type=='honour'" required>
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
                    :style="{backgroundImage: 'url(' + (imageUrl) + ')'} "
                    class="avatar"
                    > 
                    <span class="close" @click.stop="close">X</span>
                    </div>
                    <div v-else class="avatar-uploader-icon">
                    <i class="el-icon-plus"></i>
                    <p>上传附件</p>
                    </div>
                </el-upload>
            </el-form-item >
            <!--学历-->
            <el-form-item v-if="type=='edu'" label="学历：" required>
                <el-select v-model="content.name" placeholder="请选择">
                    <el-option
                    v-for="item in educations"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    >
                    </el-option>
                </el-select>
            </el-form-item >
            <el-form-item v-if="type=='edu'" label="学校：" required>
                <el-input v-model="content.school" placeholder="请输入内容" maxlength="20" show-word-limit style="width:400px;"></el-input>
            </el-form-item >
            <el-form-item v-if="type=='edu'" label="学历类型：">
                <el-select v-model="content.name" placeholder="请选择">
                    <el-option
                    v-for="item in natureTypes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    >
                    </el-option>
                </el-select>
            </el-form-item >
            <el-form-item v-if="type=='edu'" label="专业：" required>
                <el-input v-model="content.major" placeholder="请输入内容" maxlength="20" show-word-limit style="width:400px;"></el-input>
            </el-form-item >
            <el-form-item v-if="type=='edu'" label="毕业时间：" required>
                <el-date-picker  v-model="value1"  type="date"  placeholder="选择日期"></el-date-picker>
            </el-form-item >
            <el-form-item label="政策权益：" v-if="type=='edu'">
                <el-tag type="primary" v-for="item in items" :key="item.id"> {{item.name}}</el-tag>
            </el-form-item >
            <el-form-item label="学历证书或学信网学历证明照片/扫描件：" v-if="type=='edu'" required>
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
                    :style="{backgroundImage: 'url(' + (imageUrl) + ')'} "
                    class="avatar"
                    > 
                    <span class="close" @click.stop="close">X</span>
                    </div>
                    <div v-else class="avatar-uploader-icon">
                    <i class="el-icon-plus"></i>
                    <p>上传附件</p>
                    </div>
                </el-upload>
            </el-form-item >
            <!--职称title-->
            <el-form-item v-if="type=='title'" label="职称：" required>
                <el-select v-model="content.name" placeholder="请选择">
                    <el-option
                    v-for="item in titles"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    >
                    </el-option>
                </el-select>
            </el-form-item >
            <el-form-item v-if="type=='title'" label="职称信息：" required>
                <el-input v-model="content.major" placeholder="请输入内容" maxlength="20" show-word-limit style="width:400px;"></el-input>
            </el-form-item >
            <el-form-item label="政策权益：" v-if="type=='title'">
                <el-tag type="primary" v-for="item in items" :key="item.id"> {{item.name}}</el-tag>
            </el-form-item >
            <el-form-item label="专业技术资格照片/扫描件：" v-if="type=='title'" required>
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
                    :style="{backgroundImage: 'url(' + (imageUrl) + ')'} "
                    class="avatar"
                    > 
                    <span class="close" @click.stop="close">X</span>
                    </div>
                    <div v-else class="avatar-uploader-icon">
                    <i class="el-icon-plus"></i>
                    <p>上传附件</p>
                    </div>
                </el-upload>
            </el-form-item >
            <!--职业资格quality-->
            <el-form-item v-if="type=='quality'" label="职业资格：" required>
                <el-select v-model="content.name" placeholder="请选择">
                    <el-option
                    v-for="item in titles"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    >
                    </el-option>
                </el-select>
            </el-form-item >
            <el-form-item v-if="type=='quality'" label="职业资格信息：" required>
                <el-input v-model="content.major" placeholder="请输入内容" maxlength="20" show-word-limit style="width:400px;"></el-input>
            </el-form-item >
            <el-form-item label="政策权益：" v-if="type=='quality'">
                <el-tag type="primary" v-for="item in items" :key="item.id"> {{item.name}}</el-tag>
            </el-form-item >
            <el-form-item label="职业资格证书资格照片/扫描件：" v-if="type=='quality'" required>
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
                    :style="{backgroundImage: 'url(' + (imageUrl) + ')'} "
                    class="avatar"
                    > 
                    <span class="close" @click.stop="close">X</span>
                    </div>
                    <div v-else class="avatar-uploader-icon">
                    <i class="el-icon-plus"></i>
                    <p>上传附件</p>
                    </div>
                </el-upload>
            </el-form-item >
        </el-form>

</template>

<script>

import {categories, educations, titles, qualities, natureTypes} from '../../utils/config'
export default {
    name: "editFormList",
    props:{
        type:{
            type:String,
            default:'',
        },
        content: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            categories,
            educations,
            titles,
            qualities,
            natureTypes,
            items:[{id:1,name:'权益1'},{id:2, name:'权益2'}],
            showpreview:false,
        }
    },
    computed: {},
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
                //let width = 1000;
               // let height = 600;
                let _URL = window.URL || window.webkitURL;
                let img = new Image();
                img.onload = function() {
                //let valid = img.width == width && img.height == height;
                resolve() 
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
            this.$refs['form'].validateField('background')
            this.imageUrl = URL.createObjectURL(params.file);
        },
        close(){
            this.showpreview=false
           // this.$set(this.form, "background", '');
            this.imageUrl = ''
           // this.$refs['form'].validateField('background')
        },
    },
    filters: {},
    created() {
    //    this.categories= window.localStorage.getItem("config").categories
    }
};
</script>

<style scoped lang="less">

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
/deep/ .el-icon-plus{
  width:10px;
  height:10px;
}
/deep/ .el-tag{
    margin-right:16px;
}

</style>

