<template>
  <div class="app-container">
    <div class="search-top">
      <el-input v-model="searchContent" placeholder="请输入内容" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" />
      </el-input>
    </div>
    <div class="content">
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
          prop="name"
          align="center"
          label="公司名称"
        />
        <el-table-column
          prop="name"
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
      <div style="display:flex; align-items:center; justify-content:center; width:100%; margin-top:10px;">
      <el-pagination
        :page-size="20"
        layout="total, prev, pager, next"
        @current-change="handleCurrentChange"
        :total="total"
      />
    </div>
    </div>
    <el-dialog
      :visible.sync="attendanceVisible"
      width="30%"
      :before-close="handleClose"
    >

      <el-form ref="form" :model="temp" label-width="80px">
        <el-form-item label="公司名称">
          <el-input v-model="temp.company" />
        </el-form-item>
        <el-form-item label="日期">
          <el-input v-model="temp.date" />

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
            action="fileUpload"
            list-type="file-list"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :file-list="fileList"
          >
            <el-button type="primary">点击上传excel</el-button>
          </el-upload>
          <el-dialog :visible.sync="picturePreviewVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="attendanceVisible = false">取 消</el-button>
        <el-button type="primary" @click="attendanceVisible = false">保存</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="contractVisible" title="查询工资表">
      <div style="marin-bottom:4px;">
        <div class="tab">
          <div class="leftTab" />
          <div class="rightTab">查询工资表</div>
        </div>
        <div style="display:flex; justify-content: space-between; align-items: center;">
          <el-form ref="form" :model="temp" label-width="80px">
            <el-form-item label="日期">
              <div style="display:flex;align-items: center;justify-content: space-around;">
                <el-input v-model="temp.date.start" class="inputStart" />
                <div style="border:0.5px solid gray; width:5%; height:0; margin:2px;" />
                <el-input v-model="temp.date.end" class="inputEnd" />
              </div>
            </el-form-item>
          </el-form>
          <el-button size="small" style="" type="primary" @click="handleSearch()">查询</el-button>
        </div>
      </div>
      <div>
        <div style="display:flex;justify-content:right;">
          <el-button type="primary">导出Excel</el-button>
        </div>

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
            prop="attendNum"
            label="出勤数量"
          />
          <el-table-column
            prop="sum"
            label="工资合计"
          />
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="customerVisible = false">保存</el-button>
        <el-button @click="customerVisible = false">退出不保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import clipboard from '@/utils/clipboard'
// import ComplexTable from './complex-table.vue'
import { lookupEmployee } from '@/api/employee'

export default {
  name: 'Salary',
  // components: {ComplexTable},
  data() {
    return {
      customers: [
        { id: 1, name: 'xxxxxxxxxxxx' }
      ],
      attendList: [{ name: 'xxx', card_no: 'xxxxxxxxxxxxxxxxxxxx', attendNum: 28,	sum: 4200 }],
      temp: { id: 1, company: 'xxxxxxxxxxxxxxx', date: {
        start: '2022-07-1',
        end: '2022-07-31'
      }},
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
      fileList: [
        {
          name: 'salary.xls',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }, {
          name: 'salary2.xls',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }
      ],
      total:0,
    }
  },
  methods: {
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
      this.onSearch();
    },
    uploadAttendance(row) {
      this.attendanceVisible = true
    },
    editContract(row) {
      console.log('编辑合同点击了')
      this.contractVisible = true
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
    handleClose(file) {

    }

  }
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

</style>
