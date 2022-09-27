<template>
  <div class="app-container">
    <div class="search-container">
      <div class="search-top">
        <div class="left">
          <el-form :model="searchInfo" label-position="right" label-width="80px" class="demo-form-inline">
            <el-form-item label="姓名">
              <el-input v-model="searchInfo.name" placeholder="" />
            </el-form-item>
            <el-form-item label="年龄">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <el-input v-model="searchInfo.age.from" class="inputstart" placeholder="" />
                <div style="border:0.5px solid gray; width:20%; height:0; margin:2px;" />
                <el-input v-model="searchInfo.age.to" class="inputend" placeholder="" />
              </div>
            </el-form-item>
            <el-form-item label="学历">
              <el-select v-model="searchInfo.school_level">
                <el-option label="不限" :value="null">不限</el-option>
                <el-option label="小学" value="小学" />
                <el-option label="初中" value="初中" />
                <el-option label="高中" value="高中" />
                <el-option label="专科" value="专科" />
                <el-option label="本科" value="本科" />
                <el-option label="硕士及以上" value="硕士及以上" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="middle">
          <el-form label-position="right" :model="searchInfo" label-width="80px">
            <el-form-item label="是否在业">
              <el-select v-model="searchInfo.is_unemployed" placeholder="是否在业">
                <el-option label="不限" :value="null" />
                <el-option label="是" :value="1" />
                <el-option label="否" :value="0" />
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="合作情况">
              <el-select v-model="searchInfo.is_cooperation" placeholder="合作情况">
                <el-option label="不限" :value="null" />
                <el-option label="是" :value="1" />
                <el-option label="否" :value="0" />
              </el-select>
            </el-form-item> -->
            <el-form-item label="在职公司">
              <el-autocomplete
                  v-model="searchInfo.company_online"
                  :fetch-suggestions="(queryString, cb) => { queryCompanySearch(queryString, cb)}"
                  placeholder="请输入"
                  @select="handleSelect"
                />
            </el-form-item>
          </el-form>
        </div>
        <div class="right">
          <el-form label-position="right" :model="searchInfo" label-width="80px">
            <el-form-item label="专业">
              <el-input v-model="searchInfo.professional"></el-input>
              <!-- <el-select v-model="searchInfo.professional">
                <el-option label="不限" value="''">不限</el-option>
                <el-option label="社会工程学" value="社会工程学" />
                <el-option label="园林艺术与风水秘术" value="园林艺术与风水秘术" />
                <el-option label="财务" value="财务" />
              </el-select> -->
            </el-form-item>
            <!-- <el-form-item label="预期薪资">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <el-input v-model="searchInfo.expected_salary.from"  class="inputstart" />
                <div style="border:0.5px solid gray; width:20%; height:0; margin:2px;" />
                <el-input v-model="searchInfo.expected_salary.to" class="inputend" />
              </div>
            </el-form-item> -->
            <el-form-item label="部门">
              <el-autocomplete
                  v-model="searchInfo.department"
                  :fetch-suggestions="(queryString, cb) => {queryDepartmentSearch(searchInfo.company_online, queryString, cb)}"
                  placeholder="请输入"
                  @select="handleSelect"
                />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <el-button type="primary" @click="onSearch(0)">查询      <svg-icon icon-class="search" /></el-button>
    </div>

    <complex-table :employees="employees" :loading="searching" />

    <div style="display:flex; align-items:center; justify-content:center; width:100%; margin-top:10px;">
      <el-pagination
        :page-size="20"
        layout="total, prev, pager, next"
        @current-change="handleCurrentChange"
        :total="total"
      />
    </div>
  </div>
</template>

<script>
import clipboard from '@/utils/clipboard'
import svgIcons from './svg-icons'
import elementIcons from './element-icons'
import ComplexTable from './complex-table.vue'
import { lookupEmployee } from '@/api/employee'
import { getCompanyJobList } from '@/api/company'

export default {
  name: 'Employee',
  components: { ComplexTable },
  data() {
    return {
      svgIcons,
      elementIcons,
      // formInline: {
      //     user: '',
      //     region: '区域一'
      // },
      searchInfo: {
        name: '',
        age: {
          from: 0,
          to: 0
        },
        school_level: null,
        is_unemployed: null,
        professional: null,
        company_online: '',
        department: '',
        number: 20
      },
      total: 0,
      employees: [],
      searching: true,
      suggestionList:[]
    }
  },
  methods: {
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
    async queryDepartmentSearch(company, queryString, cb) {
      console.log('getCompanyJobList', this.suggestionList)
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
    generateIconCode(symbol) {
      return `<svg-icon icon-class="${symbol}" />`
    },
    generateElementIconCode(symbol) {
      return `<i class="el-icon-${symbol}" />`
    },
    handleClipboard(text, event) {
      clipboard(text, event)
    },
    onSearch(currentPage) {
      var tmpSearchInfo = { ...this.searchInfo }
      tmpSearchInfo.page = currentPage;
      tmpSearchInfo.total = currentPage?this.total:null
      // if (tmpSearchInfo.is_unemployed == '是') {
      //   tmpSearchInfo.is_unemployed = 1
      // } else {
      //   tmpSearchInfo.is_unemployed = 0
      // }
      // if (tmpSearchInfo.is_cooperation == '是') {
      //   tmpSearchInfo.is_cooperation = 1
      // } else {
      //   tmpSearchInfo.is_cooperation = 0
      // }
      if (tmpSearchInfo.professional == '不限') {
        tmpSearchInfo.professional = ''
      }
      if (tmpSearchInfo.school_level == '不限') {
        tmpSearchInfo.school_level = ''
      }
      lookupEmployee(tmpSearchInfo).then(response => {
        console.log('查询的人员信息', response.data.data.data)
        this.employees = response.data.data.data
        this.total = response.data.data.total
      })
    },
    handleCurrentChange(val) {
      this.onSearch(val);
    }

  },
  mounted(){
    this.onSearch(0);
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  margin: 10px 20px 0;
  overflow: hidden;
  padding: 20px;
  .search-container{
    padding:6px;
    margin:4px;
    box-shadow: 0px  0px 0px 1px #8f969d;
    display: flex;
    align-items:  center;
    justify-content: center;
    flex-direction: column;
    .search-top{
    width: 100%;
    display: flex;
    border-radius: 3px;
    .left{
      width:33%;
      padding-right: 40px;
    }
    .middle{
      width: 33%;
      padding-right: 40px;
    }
    .right{
      width:34%;
      padding-right: 40px;
    }
    }

    .el-button{
      width:10%;
    }
  }
  .grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }

  .icon-item {
    margin: 20px;
    height: 85px;
    text-align: center;
    width: 100px;
    float: left;
    font-size: 30px;
    color: #24292e;
    cursor: pointer;
  }

  span {
    display: block;
    font-size: 16px;
    margin-top: 10px;
  }

  .disabled {
    pointer-events: none;
  }

  .inputstart{
    width: 30%;
  }
  .inputend{
    width: 30%;
  }
  .el-form-item{
    margin-bottom: 4px;
}
.el-select{
  width:100%;
}
}
</style>
