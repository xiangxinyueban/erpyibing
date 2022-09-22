<template>
  <div class="table-container">
    <el-button style="margin:6px;" type="primary" @click="handleInsert()">新增职位</el-button>
    <el-table
      :key="jobs.id"
      :data="jobs"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="编号" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" width="150px" align="center" />
      <el-table-column label="公司名称" prop="company_name" min-width="150px" align="center">
        <!-- <template slot-scope="{row}">
          <el-button size="mini" @click="checkResume(row)" type="primary">查看简历</el-button>
          <span>{{row.reviewer}}</span>
        </template> -->
      </el-table-column>
      <el-table-column label="岗位" prop="job_name" min-width="110px" align="center">
        <!-- <template slot-scope="{row}">
          <span>{{row.position}}</span>
        </template> -->
      </el-table-column>
      <el-table-column label="发布时间" prop="create_time" min-width="110px" align="center" />
      <el-table-column label="查看详情" min-width="100px" align="center">
        <template slot-scope="{row}">
          <el-button size="small" type="primary" @click="checkPosition(row)">查看职位</el-button>
        </template>
      </el-table-column>
      <el-table-column label="简历库匹配" min-width="100px" align="center">
        <template slot-scope="{row}">
          <el-button size="small" type="primary" @click="checkMatched(row)">匹配结果</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    
    <!-- -------------------------------- 查看职位信息 ------------------------------------ -->
    <el-dialog :visible.sync="positionVisible" title="基本信息">
      <el-form ref="ruleForm" :model="temp" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="公司名称" prop="company_name">
          <!-- <el-input v-model="temp.company_name" /> -->
                <el-autocomplete
                  v-model="temp.company_name"
                  :fetch-suggestions="(queryString, cb) => { queryCompanySearch(queryString, cb) }"
                  placeholder="请输入"
                  @select="handleSelect"
                />
        </el-form-item>
        <el-form-item label="公司部门" prop="department">
                <el-autocomplete
                  v-model="temp.department"
                  :fetch-suggestions="(queryString, cb) => { queryDepartmentSearch(temp.company_name, queryString, cb) }"
                  placeholder="请输入"
                  @select="handleSelect"
                />
        </el-form-item>
        <el-form-item label="岗位名称" prop="job_name">
          <el-input v-model="temp.job_name" />
        </el-form-item>
        <el-form-item label="月薪" prop="salary">
          <div style="display: flex; align-items:center;">
            <!-- <el-input v-model="temp.salary.from" class="inpurtStart" /> -->
            <el-input v-model.number="temp.salary.from" type="number" class="inputStart" placeholder="" />
            <div style="border:0.5px solid gray; width:30%; max-width: 50px; height:0; margin-left:4px; margin-right:4px;" />
            <!-- <el-input v-model="temp.salary.to" class="inputEnd" /> -->
            <el-input v-model.number="temp.salary.to" type="number" class="inputEnd" placeholder="" />
          </div>
        </el-form-item>
        <el-form-item label="年龄要求" prop="age_require">
          <div style="display: flex; align-items:center;">
            <!-- <el-input v-model="temp.age_require.from" class="inpurtStart" /> -->
            <el-input v-model.number="temp.age_require.from" type="number" class="inputStart" placeholder="" />
            <div style="border:0.5px solid gray; width:30%; max-width: 50px; height:0; margin-left:4px; margin-right:4px;" />
            <!-- <el-input v-model="temp.age_require.to" class="inputEnd" /> -->
            <el-input v-model.number="temp.age_require.to" type="number" class="inputEnd" placeholder="" />
          </div>
        </el-form-item>
        <el-form-item label="学历要求" prop="school_level_require">
          <!-- <el-input v-model="temp.school_level_require" /> -->
          <el-select v-model="temp.school_level_require" placeholder="学历">
                <el-option label="不限" :value="null">不限</el-option>
                <el-option label="小学" value="小学" />
                <el-option label="初中" value="初中" />
                <el-option label="高中" value="高中" />
                <el-option label="专科" value="专科" />
                <el-option label="本科" value="本科" />
                <el-option label="硕士及以上" value="硕士及以上" />
              </el-select>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="temp.sex" placeholder="性别">
                <el-option label="不限" :value="null" />
                <el-option label="男" value="男"></el-option>
                <el-option label="女" value="女" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input v-model="temp.note" type="textarea" rows="10" />
        </el-form-item>
        <el-form-item label="职位状态" prop="status">
          <el-radio v-model="temp.status" label="招聘中" />
          <el-radio v-model="temp.status" label="已完结" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="savePositionInfo()">保存并发布</el-button>
        <el-button @click="positionVisible = false">退出不保存</el-button>
      </span>
    </el-dialog>

    <!-- -------------------------------- 匹配结果------------------------------------ -->
    <el-dialog :visible.sync="matchedVisible" title="匹配结果">
      <div class="content">
        <el-table
          :data="matchList"
          style="width: 100%"
        >
          <el-table-column
            prop="id"
            label="编号"
            align="center"
          />
          <el-table-column
            prop="name"
            label="姓名"
            align="center"
          />
          <el-table-column
            prop=""
            label="简历"
            align="center"
          >
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="checkResume(scope.row)">查看简历</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirm()">确认并返回</el-button>
      </span> -->
    </el-dialog>

    <!------------------------------------------------>

    <el-dialog :visible.sync="matchArgsVisible" title="请选择匹配项目">
      <div class="content">
        <el-form :model="args">
          <el-form-item label="年龄">
            <el-radio v-model="args.is_age" :label="1">是</el-radio>
            <el-radio v-model="args.is_age" :label="0">否</el-radio>
          </el-form-item>
          <el-form-item label="学历">
            <el-radio v-model="args.is_school_level" :label="1">是</el-radio>
            <el-radio v-model="args.is_school_level" :label="0">否</el-radio>
          </el-form-item>
          <el-form-item label="薪资">
            <el-radio v-model="args.is_salary" :label="1">是</el-radio>
            <el-radio v-model="args.is_salary" :label="0">否</el-radio>
          </el-form-item>
          <el-form-item label="性别">
            <el-radio v-model="args.is_sex" :label="1">是</el-radio>
            <el-radio v-model="args.is_sex" :label="0">否</el-radio>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="matchResume()">确 定</el-button>
        <el-button @click="matchArgsVisible = false">取 消</el-button>
      </span>
    </el-dialog>


    <el-dialog :visible.sync="resumeVisible" title="基本信息">
      <el-form ref="ruleForm" :model="tempResume" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="tempResume.name" />
        </el-form-item>
        <el-form-item label="出生年月" prop="birthday">
          <el-date-picker v-model="tempResume.birthday" type="month" placeholder="选择日期" value-format="yyyy-MM" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="身份证号" prop="id_card">
          <el-input v-model="tempResume.id_card" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="tempResume.sex">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="籍贯" prop="native_place">
          <el-input v-model="tempResume.native_place" />
        </el-form-item>
        <el-form-item label="学历" prop="school_level">
           <el-select v-model="tempResume.school_level" placeholder="学历">
                <el-option label="不限" :value="null">不限</el-option>
                <el-option label="小学" value="小学" />
                <el-option label="初中" value="初中" />
                <el-option label="高中" value="高中" />
                <el-option label="专科" value="专科" />
                <el-option label="本科" value="本科" />
                <el-option label="硕士及以上" value="硕士及以上" />
              </el-select>
        </el-form-item>
        <el-form-item label="专业" prop="professional">
          <el-input v-model="tempResume.professional" />
        </el-form-item>
        <el-form-item label="是否在业" prop="is_unemployed">
          <el-radio-group v-model="tempResume.is_unemployed">
            <el-radio :label="1">在业</el-radio>
            <el-radio :label="0">待业</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否与凤凰人力合作" prop="is_cooperation">
          <el-radio-group v-model="tempResume.is_cooperation">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="期望薪资" prop="expected_salary">
          <el-input v-model="tempResume.expected_salary" />
        </el-form-item>
        <el-tabs value="first">
          <el-tab-pane label="工作经历" name="first">
            <el-card v-for="o in tempResume.work_experiences" :key="o.work_units" class="box-card">
              <div slot="header" class="clearfix">
                <span>{{ o.work_units }}</span>
                <el-button style="float: right; padding: 3px 0" type="primary">删除</el-button>
              </div>
              <el-form-item label="工作单位">
                <el-input v-model="o.work_units" />
              </el-form-item>
              <el-form-item label="工作部门">
                <el-input v-model="o.department" />
              </el-form-item>
              <el-form-item label="工作岗位">
                <el-input v-model="o.job" />
              </el-form-item>
              <el-form-item label="工作时间">
                <div style="display: flex; align-items:center;">
                  <el-input v-model="o.work_time.from" class="inpurtStart" />
                  <div style="border:0.5px solid gray; width:30%; max-width: 50px; height:0; margin-left:4px; margin-right:4px;" />
                  <el-input v-model="o.work_time.to" class="inputEnd" />
                </div>
              </el-form-item>
              <el-form-item label="是否还在工作">
                <el-radio-group v-model="o.at_work">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="工作内容">
                <el-input v-model="o.work_content" type="textarea" rows="3" />
              </el-form-item>
            </el-card>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resumeVisible = false">退出</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { saveEmployee, getResume } from '@/api/employee'
import { savePositionInfo, getPositionDetail, getMatchJobList } from '@/api/position'
import { getCompanyJobList } from '@/api/company'

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  props: ['loading', 'jobs'],
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      matchingRow: null,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      // 人员基本信息
      userInfo: {
        id: null,
        name: '',
        id_card: '',
        birthday: '',
        school_level: null,
        professional: '',
        native_place: '',
        expected_salary: '',
        is_unemployed: 0,
        is_cooperation: 0,
        work_experiences: []
      },
      // 工作经历
      workExperience: {
        work_units: '',
        department: '',
        job: '',
        work_content: '',
        work_time: {
          start: '',
          end: ''
        },
        at_work: 0
      },
      // 正在查看的人员信息
      temp: {
        company_name: '',
        department: '',
        job_name: '',
        salary: { from: 0,
          to: 0
        },
        age_require: {
          from: 0,
          to: 100
        },
        sex: null,
        school_level_require: null,
        note:"",
        status: '招聘中'
      },
      matchList: [
        { id: '0013', name: '师秀英', hasResume: true },
        { id: '0021', name: '宋子晋', hasResume: true },
        { id: '0022', name: '后丹雪', hasResume: true },
        { id: '0025', name: '斋芊丽', hasResume: true },
        { id: '0037', name: '王生萌', hasResume: true },
        { id: '0041', name: '殷康胜', hasResume: true },
        { id: '0042', name: '靖子舒', hasResume: true },
        { id: '0043', name: '汤林楠', hasResume: true },
        { id: '0048', name: '宿英光', hasResume: true },
        { id: '0069', name: '贡涵阳', hasResume: true },
        { id: '0081', name: '禹天亦', hasResume: true }
      ],
      args: {
        is_age: 1,
        is_school_level: 1,
        is_salary: 1,
        is_sex: 1
      },
      positionVisible: false,
      // 简历显示与否
      matchedVisible: false,
      matchArgsVisible: false,
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      dialogFormVisible: false,
      dialogInsertVisible: false,
      resumeVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false,
      tempResume: {},
      suggestionList:[],
    }
  },
  created() {
    // this.getList()
  },
  methods: {
    msgSuccess(msg) {
      this.$message({
        message: msg,
        type: 'success'
      })
    },
    savePositionInfo() {
      savePositionInfo(this.temp).then(res => {
        if (res.data.status == 'success') {
          this.msgSuccess('职位保存成功')
        }
      })
      this.positionVisible = false
    },
    checkMatched(row) {
      // this.matchedVisible = true;
      this.matchArgsVisible = true
      this.matchingRow = row
    },

    matchResume() {
      getMatchJobList({
        job_id: this.matchingRow.id,
        ...this.args,
        page: null,
        number: 20
      }).then(res => {
        if (res.data.status == 'success') {
          this.matchList = res.data.data.data
          this.matchedVisible = true
        }
      })
    },

    checkResume(row) {
      this.resumeVisible = true
      console.log('查看简历', row)
      getResume({ id: row.id }).then(response => {
        console.log('查看简历', response.data.data)
        this.tempResume = response.data.data
      })
      // this.temp = response.data.data
      console.log('查看简历触发了', this.tempResume)
    },

    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      console.log('updated')
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    checkPosition(row) {
      getPositionDetail({ id: row.id }).then(res => {
        if (res.data.status == 'success') {
          this.temp = res.data.data
          console.log('查看职位', this.temp)
        }
      })
      this.positionVisible = true
    },
    handleInsert() {
      this.positionVisible = true
    },

    handleAddWorkExp() {
      this.userInfo.work_experiences.push({
        work_units: '',
        department: '',
        job: '',
        work_content: '',
        work_time: '',
        at_work: 0
      })
    },
    async handleConf() {
      const { data } = await saveEmployee(this.userInfo)
      // const { data } = response
      // commit('SET_TOKEN', data.token)
      // setToken(data.token)
      console.log('返回值：', data)
      this.dialogInsertVisible = false
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
     // auto-complete  工作单位选择
    async queryCompanySearch(queryString, cb) {
      var companyList

      if (this.suggestionList.length == 0) {
        // console.log("company", this.suggestionList);
        const { data } = await getCompanyJobList()
        //  console.log("getCompanyJobList", data);
        this.suggestionList = data.data
      }
      companyList = this.suggestionList.map((companyObj) => {
        return { value: companyObj.company }
      })
      var results = queryString ? companyList.filter(this.createFilter(queryString)) : companyList
      // console.log("getCompanyJobList", companyList)
      // var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // // 调用 callback 返回建议列表的数据
      // console.log("callback", results);
      cb(results)
    },
    queryDepartmentSearch(company, queryString, cb) {
      console.log('getCompanyJobList',company, queryString, this.suggestionList)
      var companyJob = this.suggestionList.filter((companyObj) => {
        return companyObj.company == company
      })
      var jobs = []
      if (companyJob.length != 0) {
        jobs = companyJob[0].jobs
      }
      jobs = jobs.map((job) => {
        console.log('job', job)
        return { value: job.name }
      })

      var results = queryString ? jobs.filter(this.createFilter(queryString)) : jobs

      //   // console.log("getCompanyJobList", companyList)
      //   // var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      //   // // 调用 callback 返回建议列表的数据
      //   console.log("callback", results);
      cb(results)
    },
    createFilter(queryString) {
      return (obj) => {
        return (obj.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect(item) {
      console.log(item)
    },
  }
}
</script>
<style >
.table-container{
  padding-top: 10px;
  padding-bottom: 20px;
  background-color:rgb(215, 236, 226);
}

.addbutton{
  width:calc(100% - 4px);
  background-color: azure;
  height: 40px;
  border:1px dashed #1890FF;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  margin: 4px;
}
.addbutton:hover{
  border:1px solid #1890FF;
  box-shadow: inset 0px 0px 0px 1px #1890FF;

}

.inpurtStart {
  width:30%;
}

.inputEnd{
  width:30%;
}

.box-card{
  box-shadow: 0px 0px 0px 2px gray;
  margin-bottom: 4px;
}
.el-autocomplete{
  width:100%
}
</style>
