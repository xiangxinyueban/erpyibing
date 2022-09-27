<template>
  <div class="app-container">
    <div class="search-top">
      <el-input v-model="companyName" placeholder="请输入内容" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="searchSalaryList()" />
      </el-input>
    </div>
    <div class="content">
      <el-table
        :data="companys"
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
          prop="department"
          align="center"
          label="部门名称"
        />
        <el-table-column
          label="上传考勤"
          align="center"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="uploadAttendance(scope.row)">上传考勤</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="city"
          label="工资表查询"
          align="center"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="editContract(scope.row)">工资表查询</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="display:flex; align-items:center; justify-content:center; width:100%; margin-top:10px;">
      <el-pagination
        :page-size="20"
        layout="total, prev, pager, next"
        @current-change="handleCurrentChange"
        :total="total"
      />
    </div>
    <el-dialog
      :visible.sync="attendanceVisible"
      width="30%"
    >

      <el-form ref="form" :model="temp" label-width="80px">
        <el-form-item label="公司名称">
          <el-input v-model="temp.company_name" />
        </el-form-item>
        <el-form-item label="部门名称">
          <el-input v-model="temp.department" />
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker v-model="temp.date"  type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 100%;" />

          <!-- <div v-for="(o, index) in temp.departments" :key="index" style="display:flex">
      <el-input v-model="o.name" style="width:70%"></el-input>
      <div v-if="index == temp.departments.length-1" style="display:flex; align-items: center; justify-content: space-evenly; width:20%;">
        <div class="edit" @click="departmentAdd()"><i class="el-icon-plus"></i></div>
        <div class="edit" @click="departmentDelete()"><i class="el-icon-minus"></i></div>
      </div>
      </div> -->
        </el-form-item>
        <el-form-item>
          <el-upload
            action="customize"
            list-type="file-list"
            :on-remove="handleRemove"
            :before-upload="checkBeforeUpload"
            :file-list="fileList"
            :http-request="(file) => {return httpRequest(file)}"
          >
            <el-button type="primary">点击上传excel</el-button>
            <el-button type="success" @click.stop="downTemplate()">下载模板</el-button>
          </el-upload>
          
          <el-dialog :visible.sync="picturePreviewVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="attendanceVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAttendance(temp)">保存</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="contractVisible" title="查询工资表">
      <div style="marin-bottom:4px;">
        <div class="tab">
          <div class="leftTab" />
          <div class="rightTab">查询工资表</div>
        </div>
        <div style="display:flex; justify-content: space-between; align-items: center;">
          <el-form ref="form" :model="temp" label-width="90px">
            <el-form-item label="选择时间段">
              <div style="display:flex;align-items: center;justify-content: space-around;">
                <!-- <el-input v-model="payslip.date.from" class="inputStart" /> -->
                <el-date-picker v-model="payslip.date.from" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 100%;" />
                <div style="border:0.5px solid gray; width:10%; height:0; margin:2px;" />
                <!-- <el-input v-model="payslip.date.to" class="inputEnd" /> -->
                <el-date-picker v-model="payslip.date.to" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 100%;" />
              </div>
              
            </el-form-item>
            
          </el-form>
          <el-button size="small" style="" type="primary" @click="handlePayslipSearch()">查询</el-button>
        </div>
        <span v-show="salaryInfoVisible" style="color:#1890FF; font-size: medium; line-height: 20px;">查询到该时间段内上传过 {{this.attendNum}} 次记录</span><br/>
        <span v-show="salaryInfoVisible" style="color:#1890FF; font-size: medium;">上传时间: {{this.attendDate}}</span>
      </div>
      <div style="background-color: rgb(215, 236, 226);padding: 4px;">
        
        <el-table
          :data="attendList"
          style="width: 100%"
        >
          <el-table-column
            fixed
            prop="name"
            label="姓名"
          />
          <el-table-column
            prop="card_no"
            label="身份证号"
          />
          <el-table-column
            prop="work_time_delta"
            label="计时时间"
          />
          <el-table-column
            prop="time_salary"
            label="计时工资"
          />
          <el-table-column
            prop="cal_count"
            label="计件件数"
          />
          <el-table-column
            prop="piece_salary"
            label="计件工资"
          />
          <el-table-column
            prop="sum"
            label="合计工资"
          />
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="exportSalaryTable()">导出Excel</el-button>
        <!-- <el-button type="primary" @click="customerVisible = false">保存</el-button>
        <el-button @click="customerVisible = false">退出不保存</el-button> -->
      </span>
    </el-dialog>
  </div>
</template>

<script>
import clipboard from '@/utils/clipboard'
// import ComplexTable from './complex-table.vue'
import { lookupEmployee } from '@/api/employee'
import {getRandomString} from '@/utils/random'
import {uploadFile,getList,attendance,payslipSearch,downloadTemplate,checkAttendanceValid,downloadSalaryTable } from '@/api/salary'

export default {
  name: 'Salary',
  // components: {ComplexTable},
  data() {
    return {
      customers: [
        { id: 1, name: 'xxxxxxxxxxxx' }
      ],
      companys:[],
      attendList: [
        // { name: 'xxx', card_no: 'xxxxxxxxxxxxxxxxxxxx', attendNum: 28,	sum: 4200 }
      ],
      temp: { id: 1, company_name: 'xxxxxxxxxxxxxxx', date: ""
      // {
      //   start: '2022-07-1',
      //   end: '2022-07-31'
      // }
    },
    companyName:"",
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
      employees: [{ id: '001', username: 'xx' }],
      searching: true,
      customerVisible: false,
      picturePreviewVisible: false,
      dialogImageUrl: '',
      searchContent: '',
      contractName1: '',
      contractName2: '',
      contractVisible: false,
      attendanceVisible: false,
      payslip:{date:{
        from:"",
        to:""
      }},
      total:0,
      fileList:[],
      file:"",
      attendNum:0,
      attendDate:"",
      salaryInfoVisible:false
    }
  },
  methods: {
    msgSuccess(msg) {
      this.$message({
        message: msg,
        type: 'success'
      })
    },
    msgWarning(msg) {
      this.$message({
        message: msg,
        type: 'warning'
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
    handleCurrentChange(val) {
      this.initTableList(val);
    },
    downTemplate(){
      downloadTemplate().then(res =>{
        let aTag = document.createElement('a');
          // aTag.download = 'Testfile.xls';
          // aTag.href = window.URL.createObjectURL(blob);
          let randomValue = getRandomString()
          
          aTag.href = process.env.VUE_APP_IMAGE_BASE_URI + "/file/salary_template.xlsx?rand=" + randomValue
          aTag.click();
          URL.revokeObjectURL(aTag.href);
      })
    },
    uploadAttendance(row) {
      this.attendanceVisible = true
      console.log(row)
      this.temp.id = row.id
      this.temp.company_name = row.company_name
      this.temp.department = row.department
      this.fileList = []
      this.temp.date = ""
    },
    editContract(row) {
      console.log('编辑合同点击了')
      this.contractVisible = true;
      this.payslip.company_name = row.company_name;
      this.payslip.department = row.department;
      this.salaryInfoVisible = false;
    },
    departmentAdd() {
      this.temp.departments.push({ id: this.temp.departments.length, name: '' })
      console.log('departments:', this.temp.departments)
    },
    departmentDelete() {
      this.temp.departments.pop()
    },
    handlePictureCardPreview(file) {
      this.picturePreviewVisible = true
      // this.previewImgUri =
    },
    handleRemove(file) {
      console.log(file)
    },
    checkBeforeUpload(file){
      console.log("upload file", this.temp.date)
      if (!this.temp.date){
        this.msgWarning("请先选择时间");
        return false;
      } else {
        return true;
      }
    },
    searchSalaryList(){
      this.initTableList(0);
    },
    initTableList(page){
      getList({
        company_name:this.companyName,
        page:page,
        number:20
      }).then(res => {
        if (res.data.status == "success") {
          this.msgSuccess("获取列表成功");
          this.companys = res.data.data.data;
          this.total = res.data.data.total;
        } else {
          
        }
      }) 
    },
    handlePayslipSearch(){
      payslipSearch(this.payslip).then(res => {
        if (res.data.status == "success") {
          this.msgSuccess("查询成功");
          this.attendList = res.data.data.attendList;
          if (this.attendList.length == 0) {
            this.msgWarning("没有查到考勤");
          }
          this.file = res.data.data.file;
          this.attendNum = res.data.data.attendNum;
          this.attendDate = res.data.data.attendDate;
          this.salaryInfoVisible = true;
        }
      })
    },
    saveAttendance(data) {
      console.log(data);
      checkAttendanceValid({
        date:this.temp.date,
        department:this.temp.department,
        company_name: this.temp.company_name
      }).then(res =>{
        if (res.data.data) {
          this.$confirm(res.data.data.message, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          // this.$message({
          //   type: 'success',
          //   message: '删除成功!'
          // });
            
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });
        });
        } else {
          attendance(data).then(res => {
        if (res.data.status == "success") {
          this.msgSuccess("保存成功");
          this.attendanceVisible = !this.attendanceVisible;
        }
      })
        }
      })
      
    },
      httpRequest(item) {
      //       const isLt1M = item.file.size / 1024 / 1024 < 1
      // if (!isLt1M) {
      //   this.msgError('Upload file size cannot exceed 1MB!')
      // }
      // if (isLt1M === true) {
      const mf = new FormData()
      this.msgSuccess('正在上传')
      mf.append('file', item.file)
      uploadFile(mf).then(res => {
        console.log(res.data)
        if (res.data.status === 'success') {
          console.log("file item:", item);
          // item.url = process.env.VUE_APP_IMAGE_BASE_URI + res.data.data.file_url
          this.msgSuccess('Uploaded successfully')
          this.temp.file = { 
            uid: res.data.data.file_url, 
            url: res.data.data.file_url 
          };
          this.fileList = [{ 
            uid: res.data.data.file_url, 
            name: item.file.name,
            url: process.env.VUE_APP_IMAGE_BASE_URI + res.data.data.file_url 
          }];
          this.msgSuccess('Uploaded successfully')
          // this.upload.open = false
        }
      }).catch(err => {
        console.log(err)
      })
      // }
    },
    exportSalaryTable(){
        // downloadSalaryTable().then(res => {
          if (this.file){
            let aTag = document.createElement('a');
          // aTag.download = 'Testfile.xls';
          // aTag.href = window.URL.createObjectURL(blob);
          let randomValue = getRandomString()
          aTag.href = process.env.VUE_APP_IMAGE_BASE_URI + "/file/" + this.file;
          aTag.click();
          URL.revokeObjectURL(aTag.href);
          } else {
            this.msgWarning("未进行查询，无法导出工资表")
          }
          
        // })
      }

  },
  mounted() {
    this.initTableList(0);
  },
}
</script>

<style lang="scss" scoped>
.search-top{
  display: flex;
  justify-content: right;
  margin:10px;
}
.input-with-select{
  width:30%;
}

.edit :hover{
  border-radius: 2px;
  border:1px solid #1890FF;
  line-height: 20px;
  font-weight: 100;
}
.inputStart{
    width: 30%;
}

.inputEnd{
    width:30%;
}
.tab{
    display:flex;
    line-height: 40px;
    .leftTab{
        width:4px;
        background-color: #1890FF;
    }
    .rightTab{
        margin-left:4px
    }
}
.content{
  padding: 4px;
  background-color:  rgb(215, 236, 226);
}

</style>
