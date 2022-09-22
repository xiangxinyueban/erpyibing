<template>
  <div class="app-container">
    <div class="search-container">
      <div class="search-top">
        <div class="left">
          <el-form :model="searchInfo" label-position="right" label-width="80px" class="demo-form-inline">
            <el-form-item label="年龄">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <el-input v-model.number="searchInfo.age_require.from" type="number" class="inputstart" placeholder="" />
                <div style="border:0.5px solid gray; width:20%; height:0; margin:2px;" />
                <el-input v-model.number="searchInfo.age_require.to" type="number" class="inputend" placeholder="" />
              </div>
            </el-form-item>
            <el-form-item label="学历">
              <el-select v-model="searchInfo.school_level_require" placeholder="学历">
                <el-option label="不限" :value="null">不限</el-option>
                <el-option label="小学" value="小学" />
                <el-option label="初中" value="初中" />
                <el-option label="高中" value="高中" />
                <el-option label="专科" value="专科" />
                <el-option label="本科" value="本科" />
                <el-option label="硕士及以上" value="硕士及以上" />
              </el-select>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="searchInfo.status" placeholder="">
                <el-option label="招聘中" value="招聘中" />
                <el-option label="已完结" value="已完结" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="middle">
          <el-form label-position="right" :model="searchInfo" label-width="80px">
            <el-form-item label="专业">
              <el-input v-model="searchInfo.professional" placeholder="请输入专业">
              </el-input>
            </el-form-item>
            <el-form-item label="工资情况">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <el-input v-model.number="searchInfo.salary.from" type="number" class="inputstart" placeholder="" />
                <div style="border:0.5px solid gray; width:20%; height:0; margin:2px;" />
                <el-input v-model.number="searchInfo.salary.to" type="number" class="inputend" placeholder="" />
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div class="right">
          <el-form label-position="right" :model="searchInfo" label-width="80px">
            <el-form-item label="发布时间">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <el-date-picker v-model="searchInfo.create_time.from" type="date" value-format="yyyy-MM-dd" class="inputstart" placeholder="" />
                <div style="border:0.5px solid gray; width:20%; height:0; margin:2px;" />
                <el-date-picker v-model="searchInfo.create_time.to" type="date" value-format="yyyy-MM-dd" class="inputend" placeholder="" />
              </div>
            </el-form-item>
            <el-form-item label="公司名称">
              <el-autocomplete
                  v-model="searchInfo.company_name"
                  :fetch-suggestions="(queryString, cb) => { queryCompanySearch(queryString, cb) }"
                  placeholder="请输入"
                  @select="handleSelect"
                />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <el-button type="primary" @click="onSearch(0)">查询      <svg-icon icon-class="search" /></el-button>
    </div>

    <complex-table :jobs="jobs" :loading="searching" />

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
// import svgIcons from './svg-icons'
// import elementIcons from './element-icons'
import ComplexTable from './complex-table.vue'
import { getPositionList } from '@/api/position'
import { getCompanyJobList } from '@/api/company'

export default {
  name: 'Employee',
  components: { ComplexTable },
  data() {
    return {
      total: 0,
      //   svgIcons,
      //   elementIcons,
      // formInline: {
      //     user: '',
      //     region: '区域一'
      // },
      searchInfo: {
        age_require: {
          from: 0,
          to: 0
        },
        status: '招聘中',
        school_level_require: null,
        salary: {
          from: 0,
          to: 0
        },
        create_time: {
          from: '',
          to: ''
        },
        company_name: '',
        number: 20
      },
      jobs: [],
      searching: true,
      suggestionList:[]
    }
  },
  mounted() {
    this.onSearch(0);
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
    onSearch(currentPage) {
      var tmpSearchInfo = {...this.searchInfo};
      tmpSearchInfo.page = currentPage;
      tmpSearchInfo.total = currentPage ? this.total : null;
      getPositionList(tmpSearchInfo).then(response => {
        if (response.data.status == 'success') {
          this.jobs = response.data.data.data
          this.total = response.data.data.total
          this.$notify({
              title: '查询',
              message: '成功',
              type: 'success',
              duration: 2000
            });
          console.log('职位列表', this.jobs)
        }
      })
    },
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
    handleCurrentChange(val) {
      this.onSearch(val);
    }
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
