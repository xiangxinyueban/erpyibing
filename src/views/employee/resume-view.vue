<template>
  <el-form ref="form" :model="form">
    <h1 class="h1-page">简历详情</h1>
    <table border="1" cellspacing="0" class="table-page">
      <tr>
        <td class="h1">姓名</td><td>{{ form.name }}</td>
        <td >出生年月</td><td>{{ form.birthday }}</td>
      </tr>
      <tr>
        <td>身份证号</td><td colspan="4">{{ form.id_card }}</td>
      </tr>
      <tr>
        <td>性别</td><td>{{ form.sex}}</td>
        <td>籍贯</td><td>{{ form.native_place }}</td>
      </tr>
      <tr>
        <td>学历</td><td>{{ form.school_level }}</td>
        <td>专业</td><td>{{ form.professional }}</td>
      </tr>
      <tr>
        <td>是否在业</td><td>
          <span v-if="form.is_unemployed">是</span><span v-else>否</span>
        </td>
        <td>是否与凤凰人力合作</td><td>
          <span v-if="form.is_cooperation">是</span><span v-else>否</span>
        </td>
      </tr>
      <tr>
        <td>期望薪资</td><td colspan="4">
            {{form.expected_salary}}
        </td>
      </tr>
    <!-- <tr>
       <span><strong>工作经历</strong></span>
    </tr> -->
    </table>
    <span>工作经历</span>
    <table class="table-page-l" v-for="(obj, index) in form.work_experiences" :key="index">
        <tr>
            <td>工作单位</td><td colspan="4"> {{ obj.work_units }} </td>
        </tr>
        <tr>
            <td>工作部门</td><td> {{ obj.department }} </td>
            <td>工作岗位</td><td>  {{ obj.job }} </td>
        </tr>
        <tr>
            <td>工作时间</td><td> {{ obj.work_time.from }} ~ {{ obj.work_time.to }} </td>
            <td>是否还在工作</td><td> <span v-if="obj.at_work">是</span><span v-else>否</span></td>
        </tr>
        <tr>
            <td>工作内容</td><td colspan="4">{{ obj.work_content }}</td>
        </tr>
    </table>

    <!-- <div style="position: static;margin-top: 5mm;font-size: 10px">
      <div style="text-align: center;margin: 0 auto;position: absolute;width: 100%;">
        <span>第 {{ pageSize }} 页</span> /
        <span>共 {{ count }} 页</span>
      </div>
      <div style="margin-right: 15mm;position: absolute;right: 0mm;">市区档案局印制</div>
    </div> -->
  </el-form>

</template>
<script>
const nowDate = new Date()
export default {
  name: 'ResumeView',
  props: { form: { type: Object, default: undefined }},
  data() {
    return {
      form: {},
      DH: [],
      first_DH: [], // 第一页
      pageSize: 1,
      count: '',
      year: nowDate.getFullYear(),
      month: nowDate.getMonth() + 1,
      date: nowDate.getDate(),
    }
  },
  watch: {
  },
  created() {
  },
  mounted() {
  },
  methods: {
    // CheckItem: function(item) {
    //   item.state = !item.state
    // },
    // getList() {
    //   this.DH = []
    //   this.first_DH = []
    //   this.$refs.check1.checked = false
    //   this.$refs.check2.checked = false
    //   this.$refs.check3.checked = false
    //   this.$refs.check4.checked = false
    //   this.$refs.check5.checked = false
    //   this.$refs.check6.checked = false
    //   this.$refs.check7.checked = false
    //   this.$refs.regReceiptStatus0.checked = false
    //   this.$refs.regReceiptStatus1.checked = false
    //   this.$refs.check_type0.checked = false
    //   this.$refs.check_type1.checked = false
    //   this.form.regReceiptContent = ''
    //   getPrintAcceptance(this.regId).then(res => {
    //     let arr = publicConversionRadio(res.data)
    //     arr = areaCode(res.data)
    //     if (res.data.regPassiveQueryPurposes === 1) {
    //       this.$refs.check1.checked = true
    //     } else if (res.data.regPassiveQueryPurposes === 2) {
    //       this.$refs.check2.checked = true
    //     } else if (res.data.regPassiveQueryPurposes === 3) {
    //       this.$refs.check3.checked = true
    //     } else if (res.data.regPassiveQueryPurposes === 4) {
    //       this.$refs.check4.checked = true
    //     } else if (res.data.regPassiveQueryPurposes === 5) {
    //       this.$refs.check5.checked = true
    //     } else if (res.data.regPassiveQueryPurposes === 6) {
    //       this.$refs.check6.checked = true
    //     } else if (res.data.regPassiveQueryPurposes === 7) {
    //       this.$refs.check7.checked = true
    //     }
    //     if (res.data.regReceiptStatus === '0' || res.data.regReceiptStatus === 0) {
    //       this.$refs.regReceiptStatus0.checked = true
    //     } else {
    //       this.$refs.regReceiptStatus1.checked = true
    //     }
    //     let DH = ''
    //     let tmp = ''
    //     for (let i = 0; i < arr.date.length; i++) {
    //       tmp = JSON.parse(arr.date[i])
    //       if (tmp.QZ === undefined) {
    //         tmp.QZ = ''
    //       }
    //       if (tmp.ML === undefined) {
    //         tmp.ML = ''
    //       }
    //       if (tmp.AJ === undefined) {
    //         tmp.AJ = ''
    //       }
    //       if (tmp.FJ === undefined) {
    //         tmp.FJ = ''
    //       }
    //       if (tmp.JH === undefined) {
    //         tmp.JH = ''
    //       }
    //       if (tmp.FY === undefined) {
    //         tmp.FY = ''
    //       }
    //       DH = tmp.QZ + tmp.ML + tmp.AJ + tmp.FJ + tmp.JH + tmp.FY
    //       // 查询方式为手工提档,拼接档号
    //       if (arr.regQueryPattern === '手工提档') {
    //         this.DH.push(DH)
    //       } else {
    //         this.DH.push(tmp.DH + '(件号:' + tmp.JH + ')')
    //       }
    //     }
    //     // 如果第一页档号超过10个,剩余部分放下一页
    //     const Num = 10
    //     if (this.DH.length > Num) {
    //       const forEachNum = Math.ceil((this.DH.length - Num) / 20)
    //       this.count = forEachNum + 1
    //       this.first_DH = this.DH.slice(0, Num)
    //       const newArr = this.DH.slice(Num, this.DH.length)

    //       // 子组件向父组件传递参数:
    //       // true: 显示下一页
    //       // forEachNum: 循环acceptance-form-copy次数
    //       // newArr: 第一页去掉10个,剩余作为新的数组传递给下一个页面
    //       // count: 共多少页
    //       this.$emit('child-event', true, forEachNum, newArr, this.count, this.pageSize)
    //     } else {
    //       this.$emit('child-event', false)
    //       this.first_DH = this.DH
    //       this.count = 1
    //     }
    //     this.form = arr
    //   })
    // }
  }

}
</script>
<style scoped>
  @page{
    size:auto;
    margin: 0;
  }
  table,table tr th, table tr td { border:1px solid ; }
  table { line-height: 25px;text-align: center;  border-collapse: collapse;}
  .table-box {
    border: 1px solid;

  }
  .el-radio{
    color:black;
  }
  .h1-page{
    position: relative;
    font-weight: 400;
    margin: 0 auto;
    text-align: center;
    top: 20mm;
  }
  .span-page{
    float: right;
    margin-right: 15mm;
    margin-top: 24mm;
  }
  .table-page{
    width: 150mm;
    margin:0 auto;
    margin-top: 31mm;
  }
  .table-page-l{
    width: 150mm;
    margin:0 auto;
    /* margin-top: 31mm; */
  }
  .h1{
    width:20mm;
  }
  @media print{
    
  }
   @page {
    /* 打印A4大小 */
    size: auto A4 landscape;
    margin: 3mm;
  }


</style>
