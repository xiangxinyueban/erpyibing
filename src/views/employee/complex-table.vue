<template>
  <div class="table-container">
    <div>
      <el-button style="margin:6px;" type="primary" @click="handleInsert()">新建人员</el-button>
      <el-button type="success" @click="downLoadExcel()">下载excel</el-button>
    </div>
    
    <el-table
      :key="employees.id"
      :data="employees"
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
      <el-table-column label="姓名" prop="name" width="150px" align="center">
        <!-- <template slot-scope="{row}">
          <span>{{ row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template> -->
      </el-table-column>
      <el-table-column label="简历查看/编辑" min-width="150px" align="center">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary" @click="checkResume(row)">查看简历</el-button>
          <span>{{ row.reviewer }}</span>
        </template>
      </el-table-column>
      <el-table-column label="合同查看" min-width="110px" align="center">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary" @click="checkContract(row)">查看合同</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- -------------------------------- 添加人员信息 ------------------------------------ -->
    <el-dialog :visible.sync="dialogInsertVisible" title="基本信息">
      <el-form ref="ruleForm" :model="userInfo" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="userInfo.name" />
        </el-form-item>
        <el-form-item label="出生年月" prop="birthday">
          <el-date-picker v-model="userInfo.birthday"  type="month" placeholder="选择日期" value-format="yyyy-MM" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="身份证号" prop="id_card">
          <el-input v-model="userInfo.id_card" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="userInfo.sex">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="籍贯" prop="native_place">
          <el-input v-model="userInfo.native_place" />
        </el-form-item>
        <el-form-item label="学历" prop="school_level">
          <el-select v-model="userInfo.school_level">
                <el-option label="不限" :value="null">不限</el-option>
                <el-option label="小学" value="小学" />
                <el-option label="初中" value="初中" />
                <el-option label="高中" value="高中" />
                <el-option label="专科" value="专科" />
                <el-option label="本科" value="本科" />
                <el-option label="硕士及以上" value="硕士及以上" />
              </el-select>
        </el-form-item>
        
          <el-row>
          <el-col :span="8">
            <el-form-item label="紧急联系人" prop="urgent_contact">
            <el-input v-model="userInfo.urgent_contact" placeholder="联系人姓名"/>
          </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人电话" prop="urgent_contact">
            <el-input placeholder="联系人电话" v-model="userInfo.urgent_contact_cell_number"/>
          </el-form-item>
        </el-col>
        </el-row>

        <el-tabs value="first">
          <el-tab-pane label="保险&健康信息" name="first">
            <el-form-item label="健康情况" prop="health">
              <!-- <el-input v-model="" /> -->
              <el-select v-model="userInfo.insurance_health_info.health" placeholder="请选择">
              <el-option
                label="健康"
                value="健康">
              </el-option>
              <el-option
                label="不健康"
                value="不健康">
              </el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="健康证明" prop="health_certificate">
              <el-upload
              ref="uploadHealth"
              action="customize"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="(file) => {return handleHealthRemove(file)}"
              :before-upload="handleBeforeUpload"
              :file-list="userInfo.insurance_health_info.health_certificate"
              :http-request="(file) => {return httpHealthRequest(file)}"
            >
            <i class="el-icon-plus" @click="submitHealthFileForm" />
            </el-upload>
            <el-dialog :visible.sync="picturePreviewVisible" :append-to-body="true">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
            </el-form-item>
        <el-row>
          <el-col :span="10">
            <el-form-item label="参保类型" prop="partic_insu_type" label-width="100px">
              <el-select v-model="userInfo.insurance_health_info.partic_insu_type" placeholder="请选择">
              <el-option
                label="社保五险"
                value="社保五险">
              </el-option>
              <el-option
                label="团体意外险"
                value="团体意外险">
              </el-option>
              <el-option
                label="雇主责任险"
                value="雇主责任险">
              </el-option>
            </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="保费金额" prop="partic_insu_amount">
              <el-input v-model.number="userInfo.insurance_health_info.partic_insu_amount" type="number" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
          <el-form-item label="参保时间" prop="partic_insu_time">
            <el-date-picker v-model="userInfo.insurance_health_info.partic_insu_time"  type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 100%;" />  
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="离保时间" prop="leave_insu_time">
              <el-date-picker v-model="userInfo.insurance_health_info.leave_insu_time"  type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>
          </el-tab-pane>
        </el-tabs>

        <el-tabs value="first">
          <el-tab-pane label="工作信息" name="first">
            <el-form-item label="现在是否在职" prop="at_work">
              <!-- <el-input v-model="userInfo.work_info.at_work" /> -->
              <el-select v-model="userInfo.work_info.at_work" placeholder="请选择">
              <el-option
                label="是"
                :value="1">
              </el-option>
              <el-option
                label="否"
                :value="0">
              </el-option>
            </el-select>
            </el-form-item>
            <el-col :span="10">
            <el-form-item label="入职时间" prop="onboarding_time">
              <el-date-picker v-model="userInfo.work_info.onboarding_time"  type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="离职时间" prop="resign_time">
              <el-date-picker v-model="userInfo.work_info.resign_time"  type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="计时工资" prop="time_salary">
              <el-input v-model.number="userInfo.work_info.time_salary" type="number" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="计件工资" prop="piece_salary">
              <el-input v-model.number="userInfo.work_info.piece_salary" type="number" />
            </el-form-item>
          </el-col>
          </el-tab-pane>
          
        </el-tabs>

        <el-tabs value="first">
          <el-tab-pane label="工作经历" name="first">
            <el-card v-for="(o,index) in userInfo.work_experiences" :key="index" class="box-card">
              <div slot="header" class="clearfix">
                <span>{{ o.work_units }}</span>
                <el-button style="float: right; padding: 3px 0" type="primary" @click="deleteWorkExperience(index)">删除</el-button>
              </div>
              <el-form-item label="工作单位" prop="name">
                <el-autocomplete
                  v-model="o.work_units"
                  :fetch-suggestions="(queryString, cb) => { queryCompanySearch(queryString, cb) }"
                  placeholder="请输入"
                  @select="handleSelect"
                />
              </el-form-item>
              <el-form-item label="工作部门" prop="name">
                <el-autocomplete
                  v-model="o.department"
                  :fetch-suggestions="(queryString, cb) => { queryDepartmentSearch(o.work_units, queryString, cb) }"
                  placeholder="请输入"
                  @select="handleSelect"
                />
              </el-form-item>
              <el-form-item label="工作岗位" prop="name">
                <el-input v-model="o.job" />
              </el-form-item>
              <el-form-item label="工作时间" prop="name">
                <!-- <div style="display: flex; align-items:center;">
                  <el-input v-model="o.work_time.from" class="inpurtStart" />
                  <div style="border:0.5px solid gray; width:30%; max-width: 50px; height:0; margin-left:4px; margin-right:4px;" />
                  <el-input v-model="o.work_time.to" class="inputEnd" />
                </div> -->
                <div style="display: flex; align-items:center;">
                  <!-- <el-input v-model="o.work_time.from" class="inpurtStart" /> -->
                  <el-date-picker v-model="o.work_time.from"  type="month" placeholder="选择日期" value-format="yyyy-MM" style="width: 100%;" />
                  <div style="border:0.5px solid gray; width:30%; max-width: 50px; height:0; margin-left:4px; margin-right:4px;" />
                  <el-input v-if="o.work_time.to=='至今'" v-model="o.work_time.to" class="inputEnd" />
                  <el-date-picker v-else v-model="o.work_time.to"  type="month" placeholder="选择日期" :picker-options="pickerOptions" value-format="yyyy-MM" style="width: 100%;" />

                  <!-- <el-input v-model="o.work_time.to" class="inputEnd" /> -->
                </div>
              </el-form-item>
              <el-form-item label="是否还在工作" prop="is_cooperation">
                <el-radio-group v-model="o.at_work">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="工作内容" prop="name">
                <el-input v-model="o.work_content" type="textarea" />
              </el-form-item>
              <el-form-item label="合同类型" prop="name">
                <el-select v-model="o.contract_type">
                  <el-option label="劳务合同" value="劳务合同"/>
                  <el-option label="劳动合同" value="劳动合同"/>
                </el-select>
              </el-form-item>
            </el-card>
            <div class="addbutton" @click="handleAddWorkExp()">
              <i style="font-size: 30px;" class="el-icon-circle-plus" />
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleConf()">保存</el-button>
        <el-button @click="dialogInsertVisible = false">退出不保存</el-button>
      </span>
    </el-dialog>

    <!-- -------------------------------- 查看简历 ------------------------------------ -->
    <el-dialog :visible.sync="resumeVisible" title="基本信息">
    <div id="printArea">
      <el-form ref="ruleForm" :model="userInfo" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="userInfo.name" />
        </el-form-item>
        <el-form-item label="出生年月" prop="birthday">
          <el-date-picker v-model="userInfo.birthday"  type="month" placeholder="选择日期" value-format="yyyy-MM" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="身份证号" prop="id_card">
          <el-input v-model="userInfo.id_card" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="userInfo.sex">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="籍贯" prop="native_place">
          <el-input v-model="userInfo.native_place" />
        </el-form-item>
        <el-form-item label="学历" prop="school_level">
          <el-select v-model="userInfo.school_level">
                <el-option label="不限" :value="null">不限</el-option>
                <el-option label="小学" value="小学" />
                <el-option label="初中" value="初中" />
                <el-option label="高中" value="高中" />
                <el-option label="专科" value="专科" />
                <el-option label="本科" value="本科" />
                <el-option label="硕士及以上" value="硕士及以上" />
              </el-select>
        </el-form-item>
        
          <el-row>
          <el-col :span="8">
            <el-form-item label="紧急联系人" prop="urgent_contact">
            <el-input v-model="userInfo.urgent_contact" placeholder="联系人姓名"/>
          </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人电话" prop="urgent_contact">
            <el-input placeholder="联系人电话" v-model="userInfo.urgent_contact_cell_number"/>
          </el-form-item>
        </el-col>
        </el-row>

        <el-tabs value="first">
          <el-tab-pane label="保险&健康信息" name="first">
            <el-form-item label="健康情况" prop="health">
              <!-- <el-input v-model="temp.insurance_health_info.health" /> -->
              <el-select v-model="userInfo.insurance_health_info.health" placeholder="请选择">
              <el-option
                label="健康"
                value="健康">
              </el-option>
              <el-option
                label="不健康"
                value="不健康">
              </el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="健康证明" prop="health_certificate">
              <el-upload
              ref="uploadHealth"
              action="customize"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="(file) => {return handleHealthRemove(file)}"
              :before-upload="handleBeforeUpload"
              :file-list="userInfo.insurance_health_info.health_certificate"
              :http-request="(file) => {return httpHealthRequest(file)}"
            >
            <i class="el-icon-plus" @click="submitHealthFileForm" />
            </el-upload>
            <el-dialog :visible.sync="picturePreviewVisible" :append-to-body="true">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
            </el-form-item>
        <el-row>
          <el-col :span="10">
            <el-form-item label="参保类型" prop="partic_insu_type" label-width="100px">
              <el-select v-model="userInfo.insurance_health_info.partic_insu_type" placeholder="请选择">
              <el-option
                label="社保五险"
                value="社保五险">
              </el-option>
              <el-option
                label="团体意外险"
                value="团体意外险">
              </el-option>
              <el-option
                label="雇主责任险"
                value="雇主责任险">
              </el-option>
            </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="保费金额" prop="partic_insu_amount">
              <el-input v-model.number="userInfo.insurance_health_info.partic_insu_amount" type="number" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
          <el-form-item label="参保时间" prop="partic_insu_time">
            <el-date-picker v-model="userInfo.insurance_health_info.partic_insu_time"  type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 100%;" />  
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="离保时间" prop="leave_insu_time">
              <el-date-picker v-model="userInfo.insurance_health_info.leave_insu_time"  type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>
          </el-tab-pane>
        </el-tabs>

        <el-tabs value="first">
          <el-tab-pane label="工作信息" name="first">
            <el-form-item label="现在是否在职" prop="at_work">
              <el-select v-model="userInfo.work_info.at_work" placeholder="请选择">
              <el-option
                label="是"
                :value="1">
              </el-option>
              <el-option
                label="否"
                :value="0">
              </el-option>
            </el-select>
            </el-form-item>
            <el-col :span="10">
            <el-form-item label="入职时间" prop="onboarding_time">
              <el-date-picker v-model="userInfo.work_info.onboarding_time"  type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="离职时间" prop="resign_time">
              <el-date-picker v-model="userInfo.work_info.resign_time"  type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="计时工资" prop="time_salary">
              <el-input v-model.number="userInfo.work_info.time_salary" type="number" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="计件工资" prop="piece_salary">
              <el-input v-model.number="userInfo.work_info.piece_salary" type="number" />
            </el-form-item>
          </el-col>
          </el-tab-pane>
          
        </el-tabs>

        <el-tabs value="first">
          <el-tab-pane label="工作经历" name="first">
            <el-card v-for="(o,index) in userInfo.work_experiences" :key="index" class="box-card">
              <div slot="header" class="clearfix">
                <span>{{ o.work_units }}</span>
                <el-button style="float: right; padding: 3px 0" type="primary" @click="deleteWorkExperience(index)">删除</el-button>
              </div>
              <el-form-item label="工作单位" prop="name">
                <el-autocomplete
                  v-model="o.work_units"
                  :fetch-suggestions="(queryString, cb) => { queryCompanySearch(queryString, cb) }"
                  placeholder="请输入"
                  @select="handleSelect"
                />
              </el-form-item>
              <el-form-item label="工作部门" prop="name">
                <el-autocomplete
                  v-model="o.department"
                  :fetch-suggestions="(queryString, cb) => { queryDepartmentSearch(o.work_units, queryString, cb) }"
                  placeholder="请输入"
                  @select="handleSelect"
                />
              </el-form-item> 
              <el-form-item label="工作岗位" prop="name">
                <el-input v-model="o.job" />
              </el-form-item>
              <el-form-item label="工作时间" prop="name">
                <!-- <div style="display: flex; align-items:center;">
                  <el-input v-model="o.work_time.from" class="inpurtStart" />
                  <div style="border:0.5px solid gray; width:30%; max-width: 50px; height:0; margin-left:4px; margin-right:4px;" />
                  <el-input v-model="o.work_time.to" class="inputEnd" />
                </div> -->
                <div style="display: flex; align-items:center;">
                  <!-- <el-input v-model="o.work_time.from" class="inpurtStart" /> -->
                  <el-date-picker v-model="o.work_time.from"  type="month" placeholder="选择日期" value-format="yyyy-MM" style="width: 100%;" />
                  <div style="border:0.5px solid gray; width:30%; max-width: 50px; height:0; margin-left:4px; margin-right:4px;" />
                  <el-input v-if="o.work_time.to=='至今'" v-model="o.work_time.to" class="inputEnd" />
                  <el-date-picker v-else v-model="o.work_time.to"  type="month" placeholder="选择日期" :picker-options="pickerOptions" value-format="yyyy-MM" style="width: 100%;" />

                  <!-- <el-input v-model="o.work_time.to" class="inputEnd" /> -->
                </div>
              </el-form-item>
              <el-form-item label="是否还在工作" prop="is_cooperation">
                <el-radio-group v-model="o.at_work">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="工作内容" prop="name">
                <el-input v-model="o.work_content" type="textarea" />
              </el-form-item>
              <el-form-item label="合同类型" prop="name">
                <el-select v-model="o.contract_type">
                  <el-option label="劳务合同" value="劳务合同"/>
                  <el-option label="劳动合同" value="劳动合同"/>
                </el-select>
              </el-form-item>
            </el-card>
            <div class="addbutton" @click="handleAddTempWorkExp()">
              <i style="font-size: 30px;" class="el-icon-circle-plus" />
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-popconfirm
          confirm-button-text='确认'
          cancel-button-text='取消'
          icon="el-icon-info"
          icon-color="red"
          title="您确认要删除吗？"
          @confirm="handleDeleteEmployee()"
        >
        <!-- <div slot="reference" style="margin-right: 10px;"> -->
        <el-button slot="reference" type="danger" style="margin-right:10px;" >删除人员</el-button>
        </el-popconfirm>
        <el-button type="primary" @click="handleSave()">保存</el-button>
        <el-button type="primary" @click="printVisible=true">打印简历</el-button>
        <!-- <button v-print="print">Print!</button> -->
        <el-button @click="resumeVisible = false">退出不保存</el-button>
      </span>
    </el-dialog>

    <!-- -------------------------------- 查看合同 ------------------------------------ -->
    <el-dialog :visible.sync="contractVisible" title="基本信息">
      <div v-for="(obj, index) in temp.work_experiences" :key="index">
        <el-tabs value="first">
          <el-tab-pane :label="'工作经历'+(index+1)" name="first">
            <div style="display:flex;margin-bottom:5px"><div style="width:10%;">公司名称</div><div style="margin-left:10px; width:90%;">{{ obj.work_units }} </div></div>
            <div style="display:flex;margin-bottom:5px"><div style="width:10%;">工作时间</div><div style="margin-left:10px; width:90%; display: flex; align-items: center;">{{ obj.work_time.from }} <div style="border:0.5px solid gray; width:5%; max-width: 50px; height:0; margin-left:4px; margin-right:4px;" /> {{ obj.work_time.to }}</div> </div>
            <div style="display:flex; align-items:center;margin-bottom:5px"><div style="width:10%;">合同号</div><div style="margin-left:10px; width:50%;"><el-input v-model="obj.contract_number"></el-input></div></div>
            <div style="display:flex; margin-bottom:10px;"><div style="width:10%;">合同情况</div></div>
            <el-upload
              ref="upload"
              action="customize"
              list-type="picture-card"
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
          </el-tab-pane>
        </el-tabs>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSaveContract()">保存</el-button>
        <el-button @click="contractVisible = false">退出不保存</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="printVisible" class="printDialog">
      <div ref="print">
        <section class="print-page page-a4">
          <resume-view :form="userInfo"/>
          <div class="print-bottom hidden-print noPrint" />
        </section>
      </div>
      <div style="margin-top: 1px; margin-left: 16px" class="noPrint">
        <el-button type="primary" size="medium" class="el-icon-printer" @click="print">&nbsp;&nbsp;打印</el-button>
      </div>
    </el-dialog>
    
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { saveEmployee, deleteEmployee } from '@/api/employee'
import { getCompanyJobList } from '@/api/company'
import {getRandomString} from '@/utils/random'
import { getResume, getWorkExperience, uploadForDynamic, saveContract, downloadEmployee } from '@/api/employee'
import resumeView from './resume-view.vue'
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
  components: { Pagination, resumeView },
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
  props: ['loading', 'employees'],
  data() {
    return {
      total: 0,
      tableKey: 0,
      list: null,
      listLoading: true,
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
        id_card: '',
        sex: '',
        native_place: '',
        name: '',
        id_card: '',
        birthday: '',
        school_level: '',
        native_place: '',
        work_experiences: [],
        work_info:{
          at_work:1,
          onboarding_time:"",
          resign_time:"",
          time_salary:null,
          piece_salary:null
        },
        insurance_health_info:{
          health:"",
          health_certificate:null,
          partic_insu_type:"",
          partic_insu_amount:null,
          partic_insu_time:"",
          leave_insu_time:""
        }
      },
      // 工作经历
      workExperience: {
        work_units: '',
        department: '',
        job: '',
        work_content: '',
        work_time: {
          from: '',
          to: ''
        },
        at_work: 0
      },
      // 正在查看的人员信息
      temp: {
        id: null,
        id_card: '',
        sex: '',
        native_place: '',
        name: '',
        id_card: '',
        birthday: '',
        school_level: '',
        native_place: '',
        work_experiences: [],
        work_info:{
          at_work:1,
          onboarding_time:"",
          resign_time:"",
          time_salary:null,
          piece_salary:null
        },
        insurance_health_info:{
          health:"",
          health_certificate:null,
          partic_insu_type:"",
          partic_insu_amount:null,
          partic_insu_time:"",
          leave_insu_time:""
        }
      },
      // temp: {
      //   id: '001',
      //   name: '兰森',
      //   id_card: '513424199509210014',
      //   birthday: '1995-09',
      //   school_level: '本科',
      //   native_place: '',

      //   work_experiences: [{
      //     work_units: '德昌穗捷财税服务有限公司',
      //     department: '无',
      //     job: '财务经理',
      //     work_content: '* 负责50+客户的财务问题对接；\r\n* 负责帮助客户传达政策变化，为客户做税务筹划，帮助客户整理财务报表，沟通银行贷款等事项；\r\n* 曾成功帮助3家客户解决税务风险评估事件。',
      //     work_time: {
      //       from: '2021.10',
      //       to: '至今'
      //     },
      //     at_work: '是'
      //   },
      //   {
      //     work_units: '德昌佳晋包装有限公司',
      //     department: '财务部',
      //     job: '初级会计',
      //     work_content: '* 负责经营生产的票据整理；\r\n* 负责出财务报表并进行报税；\r\n* 负责进行账簿装订。',
      //     work_time: {
      //       from: '2020.05',
      //       to: '2021.10'
      //     },
      //     at_work: '否'
      //   }]
      // },
      // 简历显示与否
      resumeVisible: false,
      contractVisible: false,
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      // temp: {
      //   id: 0,
      //   name: "",
      //   birthday: "",
      //   major:"",
      //   isEmployyed:"",
      //   isCooperated:"",
      //   workExperience:[],
      // },
      dialogFormVisible: false,
      dialogInsertVisible: false,
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
      picturePreviewVisible: false,
      companyDepartmentList: [],
      dialogImageUrl: '',
      suggestionList: [],
      pickerOptions: {
      shortcuts: [
        {
          text: "至今",
          onClick: (picker) => {
            picker.$emit("pick", "至今");
          }
        }
      ],
     
    },
     printVisible:false,
    }
  },
  created() {
    this.getList()
  },
  methods: {
     print() {
      this.$print(this.$refs.print)
    },
    deleteWorkExperience(index) {
      this.userInfo.work_experiences.splice(index, 1)
    },
    msgSuccess(msg) {
      this.$message({
        message: msg,
        type: 'success'
      })
    },
    getList() {
      this.listLoading = true
      // fetchList(this.listQuery).then(response => {
      //   this.list = response.data.items
      //   this.total = response.data.total

      //   // Just to simulate the time of the request
      //   setTimeout(() => {
      //     this.listLoading = false
      //   }, 1.5 * 1000)
      // })
    },

    downLoadExcel(){
    downloadEmployee()
      .then(response => {
      console.log("下载", response);
      // let blob = new Blob([response.data], {
      //     type: 'application/vnd.ms-excel'
      // });
          //  兼容chrome/firefox
          let aTag = document.createElement('a');
          // aTag.download = 'Testfile.xls';
          // aTag.href = window.URL.createObjectURL(blob);
          let randomValue = getRandomString()
          
          aTag.href = process.env.VUE_APP_IMAGE_BASE_URI + "/employees/to_excel?rand=" + randomValue
          aTag.click();
          URL.revokeObjectURL(aTag.href);
      
    })
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
          item.url = process.env.VUE_APP_IMAGE_BASE_URI + res.data.data.image_url
          if (this.temp.work_experiences[index].image_urls == null) {
            this.temp.work_experiences[index].image_urls = []
          }
          this.temp.work_experiences[index].image_urls.push({ 
            uid: res.data.data.image_url, 
            url: process.env.VUE_APP_IMAGE_BASE_URI + res.data.data.image_url 
          })
          this.msgSuccess('Uploaded successfully')
          // this.upload.open = false
        }
      }).catch(err => {
        console.log(err)
      })
      // }
    },
    handleRemove(index, file) {
      var idx = this.temp.work_experiences[index].image_urls.findIndex(item => {
        return item.uid == file.uid
      })
      this.temp.work_experiences[index].image_urls.splice(idx, 1)
    },
    submitFileForm() {
      this.$refs.upload.submit()
    },

    // 上传健康证明接口 ------------------------------------------------------------------------------
    httpHealthRequest(item) {
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
          const fileUrl = process.env.VUE_APP_IMAGE_BASE_URI.concat(res.data.data.image_url)
          console.log("success:", fileUrl);
          item.url = fileUrl
          if (this.userInfo.insurance_health_info.health_certificate == null|undefined) {
            this.userInfo.insurance_health_info.health_certificate = []
          }
          
          this.userInfo.insurance_health_info.health_certificate.push({ 
            uid: res.data.data.image_url, 
            url: fileUrl
          })
          console.log("success:", this.userInfo.insurance_health_info.health_certificate);
          // this.userInfo.insurance_health_info.health_certificate = { 
          //   uid: res.data.data.image_url, 
          //   url: process.env.VUE_APP_IMAGE_BASE_URI + res.data.data.image_url 
          // }
          this.msgSuccess('Uploaded successfully')
          // this.upload.open = false
        }
      }).catch(err => {
        console.log(err)
      })
      // }
    },
    handleHealthRemove(file) {
      // var idx = this.userInfo.insurance_health_info.health_certificate.findIndex(item => {
      //   return item.uid == file.uid
      // })
      // this.userInfo.insurance_health_info.health_certificate.splice(idx, 1)
      this.userInfo.insurance_health_info.health_certificate = undefined;
    },

    submitHealthFileForm() {
      this.$refs.uploadHealth.submit()
    },

    handleSave() {
      var filterList = this.userInfo.work_experiences.filter(item => {
          return item.at_work == 1
        });
        if (filterList.length > 1) {
          console.log("多家工作提示")
          this.$confirm('人员不能同时在多家公司工作', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
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
      saveEmployee(this.userInfo).then(response => {
        if (response.data.status == 'success') {
          this.msgSuccess('保存成功')
          this.resumeVisible = false
        }
        // if
        console.log('保存成功')
      })
        }
    },

    handleDeleteEmployee(){
      deleteEmployee({id:this.userInfo.id}).then(response => {
        if (response.data.status == 'success') {
          this.msgSuccess('删除成功')
          this.resumeVisible = false
        }
      })
    },

    // ---------------------------------------------------------------------------------------------------
    handleSaveContract() {
      this.msgSuccess('正在保存')
      saveContract({ data: this.temp.work_experiences }).then(res => {
        if (res.data.status == 'success') {
          this.msgSuccess('合同保存成功')
        }
      })
      this.contractVisible = false
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
    checkResume(row) {
      this.resumeVisible = true
      console.log('查看简历', row)
      getResume({ id: row.id }).then(response => {
        console.log('查看简历', response.data.data)
        this.userInfo = response.data.data
      })
      // this.temp = response.data.data
      console.log('查看简历触发了', this.temp)
    },
    handleBeforeUpload(file) {
      console.log(file)
    },
    checkContract(row) {
      this.contractVisible = true
      getWorkExperience({ employees_id: row.id }).then(response => {
        console.log('查看合同', response)
        this.temp.work_experiences = response.data.data
      })
    },
    handleInsert() {
      this.dialogInsertVisible = true
      this.userInfo =  {
        id: null,
        id_card: '',
        sex: '',
        native_place: '',
        name: '',
        id_card: '',
        birthday: '',
        school_level: '',
        native_place: '',
        work_experiences: [],
        work_info:{
          at_work:1,
          onboarding_time:"",
          resign_time:"",
          time_salary:null,
          piece_salary:null
        },
        insurance_health_info:{
          health:"",
          health_certificate:null,
          partic_insu_type:"",
          partic_insu_amount:null,
          partic_insu_time:"",
          leave_insu_time:""
        }
      }
    },

    handlePictureCardPreview(args) {
      console.log('预览', args)
      this.picturePreviewVisible = true
      this.dialogImageUrl =  args.url
    },

    handleAddWorkExp() {
      // this.msgSuccess("添加工作经历")
      this.userInfo.work_experiences.push({
        work_units: '',
        department: '',
        job: '',
        work_content: '',
        work_time: {
          from: '',
          to: ''
        },
        at_work: 0,
        contract_type: "劳务合同" 
      })
    },
    handleAddTempWorkExp() {
      this.userInfo.work_experiences.push({
        work_units: '',
        department: '',
        job: '',
        work_content: '',
        work_time: {
          from: '',
          to: ''
        },
        at_work: 0,
        contract_type: "劳务合同" 
      })
    },
    async handleConf() {

        var filterList = this.userInfo.work_experiences.filter(item => {
          return item.at_work == 1
        });
        if (filterList.length > 1) {
          console.log("多家工作提示")
          this.$confirm('人员不能同时在多家公司工作', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
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
           const { data } = await saveEmployee(this.userInfo)
          // const { data } = response
          // commit('SET_TOKEN', data.token)
          // setToken(data.token)
          console.log('返回值：', data)
          this.dialogInsertVisible = false
        }
      // if {this.userInfo.}
      
     
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
    // handleDelete(row, index) {
    //   this.$notify({
    //     title: 'Success',
    //     message: 'Delete Successfully',
    //     type: 'success',
    //     duration: 2000
    //   })
    //   this.list.splice(index, 1)
    // },
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
    }
  },
  resetUserInfo(){
    this.userInfo = {
        id: null,
        id_card: '',
        sex: '',
        native_place: '',
        name: '',
        id_card: '',
        birthday: '',
        school_level: '',
        native_place: '',
        work_experiences: []
      };
  },
  
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

  .printDialog .el-dialog{
    width: 210mm;
  }
  
  .page-a4{
    width: 180mm;
    margin: 0;
    position: relative
  }
  
  .print-page{
    width: 170mm;
    height: 190mm;
    margin: 0 auto;
    text-align: center;
    /* margin-bottom: 14mm; */
    border: 1px solid #bbb;
    border-bottom: 0;
  }

</style>
