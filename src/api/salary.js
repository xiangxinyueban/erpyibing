import request from '@/utils/request'

export function uploadFile(data) {
    return request({
      url: '/upload/upload_file',
      method: 'post',
      data: data
    })
  }

  export function getList(data) {
    return request({
      url: '/salary/get_list',
      method: 'post',
      data: data
    })
  }

  export function attendance(data) {
    return request({
      url: '/salary/attendance',
      method: 'post',
      data: data
    })
  }

  export function payslipSearch(data) {
    return request({
      url: '/salary/payslip_search',
      method: 'post',
      data: data
    })
  }

  export function downloadTemplate(params) {
    return request({
      url: '/file/salary_template.xlsx',
      method: 'get',
      params
    })
  }

  export function checkAttendanceValid(data) {
    return request({
      url: '/salary/check',
      method: 'post',
      data: data
    })
  }

  export function downloadSalaryTable(params) {
    return request({
      url: '/salary/exportsalarytable',
      method: 'get',
      params
    })
  }