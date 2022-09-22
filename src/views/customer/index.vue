<template>
  <div class="app-container">
    <div class="search-top">
      <el-button type="primary" @click="newCustomer()">新增客户</el-button>
      <el-input v-model="searchContent" placeholder="请输入内容" class="input-with-select">
        <el-button slot="append" @click="searchCustomers(0)" icon="el-icon-search" />
      </el-input>
    </div>
    <div class="content" style="min-height: 400px; background-color:rgb(215, 236, 226); padding:4px;">
      <el-table
        :data="customers"
        border
        fit
        style="width: 100%"
      >
        <el-table-column
          align="center"
          prop="id"
          label="编号"
          width="150"
        />
        <el-table-column
          prop="company_name"
          align="center"
          label="公司名称"
        />
        <el-table-column
          label="编辑客户"
          align="center"
        >
          <template slot-scope="scope">
            <!-- <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button> -->
            <el-button type="primary" size="small" @click="editCustomer(scope.row)">编辑客户</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="city"
          label="客户合同"
          align="center"
        >
          <template slot-scope="scope">
            <!-- <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button> -->
            <el-button type="primary" size="small" @click="editContract(scope.row)">编辑合同</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :visible.sync="customerVisible"
      width="30%"
    >

      <el-form ref="form" :model="temp" label-width="80px">
        <el-form-item label="公司名称">
          <el-input v-model="temp.company_name" />
        </el-form-item>
        <el-form-item label="公司部门">
          <div class="edit" v-if="temp.department.length == 0" @click="departmentAdd()"><i class="el-icon-plus" /></div>
          <div v-for="(o, index) in temp.department" :key="index" style="display:flex">
            <el-input v-model="o.name" style="width:70%" />
            <div v-if="index == temp.department.length-1" style="display:flex; align-items: center; justify-content: space-evenly; width:20%;">
              <div class="edit" @click="departmentAdd()"><i class="el-icon-plus" /></div>
              <div class="edit" @click="departmentDelete()"><i class="el-icon-minus" /></div>
            </div>
            <!-- {{o}} -->
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-popconfirm
          confirm-button-text='确认'
          cancel-button-text='取消'
          icon="el-icon-info"
          icon-color="red"
          title="您确认要删除吗？删除之后不能恢复！"
          @confirm="handleDeleteCustomer()"
        >
        <!-- <div slot="reference" style="margin-right: 10px;"> -->
        <el-button slot="reference" type="danger" style="margin-right:10px;" >删除客户</el-button>
        </el-popconfirm>
        <el-button @click="customerVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveCustomer()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="contractVisible" title="基本信息">
      <el-card v-for="(obj, index) in company_contrats.contract" :title="obj.name">
        <div style="display:flex;margin-bottom:5px;align-items: center;"><div style="width:10%;">合同名称</div><div style="margin-left:10px; width:90%;"><el-input v-model="obj.name" /> </div></div>
        <div style="display:flex; margin-bottom:10px;"><div style="width:10%;">合同图像</div></div>
        <el-upload
          ref="upload"
          action="customize"
          list-type="picture-card"
          accept=".png,.svg,.gif,.jpeg,.jpg"
          :on-preview="handlePictureCardPreview"
          :on-remove="(file) => {return handleRemove(index, file)}"
          :before-upload="handleBeforeUpload"
          :file-list="obj.image_urls"
          :http-request="(file) => {return httpRequest(index, file)}"
        >
          <i class="el-icon-plus" @click="submitFileForm" />
          <!-- <el-button type="primary">上传合同</el-button> -->
        </el-upload>
        <el-dialog :visible.sync="picturePreviewVisible" :append-to-body="true">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-card>
      <div style="display:flex; align-items:center;justify-content: space-evenly; margin-top:4px;">
        <div style="border:1px solid #1890FF; border-radius:4px;" @click="addContract()"><i style="font-size: 30px; color:#1890FF;" class="el-icon-plus" /></div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSaveContract()">保存</el-button>
        <el-button @click="contractVisible = false">退出不保存</el-button>
      </span>
    </el-dialog>
    <div style="display:flex; align-items:center; justify-content:center; width:100%; margin-top:10px;">
      <el-pagination
        :page-size="20"
        @current-change="handleCurrentChange"
        layout="total, prev, pager, next"
        :total="total"
      />
    </div>
  </div>
</template>

<script>
import clipboard from '@/utils/clipboard'
// import ComplexTable from './complex-table.vue'
import { lookupEmployee } from '@/api/employee'
import { saveCompany, getCompanyList, getCompanyInfo, getCompanyConstract, saveCompanyConstract, deleteCompany } from '@/api/company'
import { uploadForDynamic } from '@/api/employee'
export default {
  name: 'Customer',
  // components: {ComplexTable},
  data() {
    return {
      customers: [
      ],
      total: 0,
      temp: { id: 1, company_name: '凉山州华奕餐饮有限公司', department: [
        { name: '生产车间' },
        { name: '经营部' },
        { name: '筛烟部' }
      ] },
      searchInfo: {
        username: '',
        age: {
          start: 25,
          end: 30
        },
        contractVisible: false,
        school_level: '本科及以上',
        is_unemployed: '是',
        professional: '财务',
        is_cooperation: '是',
        expected_salary: {
          start: '5000',
          end: '7000'
        },
        company_online: '',
        department: ''
      },
      employees: [{ id: '001', username: '兰森' }, { id: '002', username: '吴倩' }, { id: '003', username: '何朝雯' }],
      searching: true,
      customerVisible: false,
      picturePreviewVisible: false,
      dialogImageUrl: '',
      searchContent: '',
      company_contrats: {
        customer_id: 0,
        contract: []
      },
      contractVisible: false
    }
  },
  mounted() {
    this.initCompanyList()
  },
  methods: {
    msgSuccess(msg) {
      this.$message({
        message: msg,
        type: 'success'
      })
    },
    handleDeleteCustomer(){
      deleteCompany({id:this.temp.id}).then(res => {
        if (res.data.status == "success") {
          this.$notify({
              title: '删除',
              message: '成功',
              type: 'success',
              duration: 2000
            })
          this.customerVisible = false;
          this.initCompanyList();
        } else {
          this.$notify({
              title: '删除',
              message: '失败',
              type: 'error',
              duration: 2000
            })
        }
      })
    },
    initCompanyList() {
      var data = {
        company_name: '',
        page: 0,
        number: 20
      }
      getCompanyList(data).then(res => {
        if (res.data.status == 'success') {
          this.msgSuccess('获取列表成功')
          this.customers = res.data.data.data
          this.total = res.data.data.total
        }
      })
    },
    searchCustomers(currentPage){
       var data = {
        company_name: this.searchContent,
        page: currentPage,
        number: 20,
        total: currentPage?this.total:null
      }
      getCompanyList(data).then(res => {
        if (res.data.status == 'success') {
          this.msgSuccess('获取列表成功')
          this.customers = res.data.data.data
          this.total = res.data.data.total
        }
      })
    },
    generateIconCode(symbol) {
      return `<svg-icon icon-class="${symbol}" />`
    },
    generateElementIconCode(symbol) {
      return `<i class="el-icon-${symbol}" />`
    },
    handleClipboard(text, event) {
      clipboard(text, event)
    },
    onSearch() {
      lookupEmployee(this.searchInfo).then(response => {

      })
    },
    handleBeforeUpload() {

    },
    editCustomer(row) {
      this.customerVisible = true
      this.temp = row
      getCompanyInfo({ id: row.id }).then(res => {
        this.temp = res.data.data
      })
    },
    newCustomer() {
      this.temp = { id: null, company_name: '', department: [
        { name: '' }
      ] },
      this.customerVisible = true
    },
    saveCustomer() {
      saveCompany(this.temp).then(res => {
        if (res.data.status == 'success') {
          this.customerVisible = false
          this.initCompanyList()
          this.msgSuccess('保存成功')
        }
      })
    },
    editContract(row) {
      console.log('编辑合同点击了')
      this.contractVisible = true
      getCompanyConstract({ customer_id: row.id }).then(res => {
        if (res.data.status == 'success') {
          this.company_contrats.customer_id = row.id
          if (res.data.data.length == 0) {
            this.company_contrats = {
              customer_id: row.id,
              contract: [{
                name: '',
                image_urls: []
              }]
            }
          } else {
            this.company_contrats = {
              customer_id: row.id,
              contract: res.data.data
            }
          }
        }
      })
    },

    // 上传图片接口 ------------------------------------------------------------------------------
    httpRequest(index, item) {
      //       const isLt1M = item.file.size / 1024 / 1024 < 1
      // if (!isLt1M) {
      //   this.msgError('Upload file size cannot exceed 1MB!')
      // }
      // if (isLt1M === true) {
      const mf = new FormData()
      this.msgSuccess('正在上传')
      mf.append('file', item.file)
      uploadForDynamic(mf).then(res => {
        if (res.data.status === 'success') {
          item.url = 'http://43.142.50.173:5000/' + res.data.image_url
          // console.log("工作经历", this.temp.work_experiences[0].image_urls)
          this.company_contrats.contract[index].image_urls.push({
            uid: res.data.data.image_url,
            url: 'http://43.142.50.173:5000/' + res.data.data.image_url
          })
          console.log('工作经历', this.company_contrats.contract[index].image_urls)
          this.msgSuccess('Uploaded successfully')
          // this.upload.open = false
        }
      }).catch(err => {
        console.log(err)
      })
      // }
    },
    handleRemove(index, file) {
      this.msgSuccess('removeing')
      var idx
      idx = this.company_contrats.contract[index].image_urls.findIndex(item => {
        return item.url == file.url
      })
      this.msgSuccess('' + idx)
      this.company_contrats.contract[index].image_urls.splice(idx, 1)
    },
    submitFileForm() {
      this.$refs.upload.submit()
    },
    handleSave() {
      saveEmployee(this.temp).then(response => {
        // if
        console.log('保存成功')
      })
    },

    // ---------------------------------------------------------------------------------------------------
    addContract() {
      this.company_contrats.contract.push({
        name: '',
        image_urls: []
      })
    },
    departmentAdd() {
      this.temp.department.push({ name: '' })
      console.log('department:', this.temp.department)
    },
    departmentDelete() {
      this.temp.department.pop()
    },
    handlePictureCardPreview(file) {
      this.picturePreviewVisible = true
      console.log('预览', file)
      this.dialogImageUrl = file.url
    },
    handleSaveContract() {
      saveCompanyConstract(this.company_contrats).then(res => {
        if (res.data.status == 'success') {
          this.msgSuccess('合同保存成功')
          this.contractVisible = false
        }
      })
    },

    handleClose(file) {
    },

    handleCurrentChange(val) {
      this.searchCustomers(val);
    }
  }
}
</script>

<style lang="scss" scoped>
.search-top{
  display: flex;
  justify-content: space-between;
  margin:10px;
}
.input-with-select{
  width:30%;
}

.edit :hover{
  border-radius: 2px;
  border:1px solid #7a8085;
  line-height: 20px;
  font-weight: 100;
}
.edit :hover{
  border-radius: 2px;
  border:1px solid #1890FF;
  line-height: 20px;
  font-weight: 100;
}
</style>
