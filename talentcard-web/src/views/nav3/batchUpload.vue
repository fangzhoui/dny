<template>
  <el-dialog
    title="批量认证"
    :visible.sync="show"
    :show-close="false"
    :close-on-click-modal="false"
    width="640px"
  >
    <div class="dialog-line" style="margin-bottom: 10px" />
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
      <el-form-item label="文件上传：" prop="file">
        <select-file @input="sInput" :limitSize='5' ref="selectFile" v-if="show" />
      </el-form-item>
      <el-form-item label="设置人才卡：" prop="cardId">
        <el-select v-model="ruleForm.cardId" placeholder="请选择人才卡">
          <el-option
            v-for="item in cardList"
            :key="item.cardId"
            :label="`${item.title}/${item.initialWord}`"
            :value="item.cardId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设置人才类别：">
        <el-select v-model="ruleForm.talentCategory" multiple placeholder="请选择">
          <el-option
            v-for="item in canUserCategories"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设置人才荣誉：">
        <el-select v-model="ruleForm.talentHonour" placeholder="请选择">
          <el-option
            v-for="item in canUserHonours"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button :loading="loading" type="primary" @click="submit">确 定</el-button>
    </span>
    </el-dialog>
</template>

<script>
import SelectFile from './inputFile'
import { getCardsFilterBase, batchCertificate  } from '@/api/api'
import { categories  } from '../../utils/config'
import { mapToForm } from '@/utils'
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  name: 'batch-upload',
  components: {
    SelectFile
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  computed:{
     ...mapGetters(["canUserCategories","canUserHonours"]),
  },
  watch: {
    show (val) {
      if (val) {
        this.$nextTick(() => {
          this.ruleForm = {
            file: '',
            cardId: '',
            talentCategory: [],
            talentHonour: ''
          }
          this.$refs['ruleForm'].resetFields();
        })
      }
    }
  },
  data () {
    return {
      cardList: [],
      loading: false,
      categories,
      ruleForm: {
        file: '',
        cardId: '',
        talentCategory: [],
        talentHonour: ''
      },
      rules: {
        file: [
          { required: true, message: '请上传文件', trigger: ['change', 'blur'] }
        ],
        cardId: [
          { required: true, message: '请选择人才卡', trigger: ['change', 'blur'] }
        ]
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    async init() {
      try {
        const res = await getCardsFilterBase();
        this.cardList = [ ...res ];
      } catch (e) {
        console.log(e)
      }
    },
    sInput (file) {
      console.log('xxxx')
      this.$set(this.ruleForm, 'file', file)
      this.$refs['ruleForm'].validateField('file')
    },
    submit () {
      this.$refs['ruleForm'].validate(async (valid) => {
        if (valid) {
          try {
            const data = {
              ...this.ruleForm,
              talentCategory: this.ruleForm.talentCategory.toString(),
              talentHonour: this.ruleForm.talentHonour.toString()
            }
            this.loading = true
            const params = mapToForm(data)
            await batchCertificate(params)
            await this.$alert('认证信息已经提交，详情可在“认证记录”页面查看', '提交成功', {
              confirmButtonText: '确定',
              showCancelButton: true,
              cancelButtonText: '取消',
            });
            
            this.loading = false
            this.$emit('close')
          } catch (e) {
            this.loading = false
            if (e && e.status == 2800) {
              try {
                await this.$alert('文件数据表头有误，请修改后重新上传', '提交失败', {
                  confirmButtonText: '确定',
                  showCancelButton: true,
                  cancelButtonText: '取消'
                });
              } catch (e) {}
            }
          }
        } else {
          return false
        }
      })
    },
    cancel () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
.title{
  line-height: 24px;
  font-size: 18px;
  color: #303133;
  border-bottom: 1px solid rgb(238, 238, 238);
}
</style>