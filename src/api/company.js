import request from '@/utils/request'

export function getCompanyJobList() {
  return request({
    url: '/employees/get_units_jobs',
    method: 'post'
  })
}

export function lookupEmployee(data) {
  return request({
    url: '/employees/get_list',
    method: 'post',
    data
  })
}

export function saveCompany(data) {
  return request({
    url: '/customer/save',
    method: 'post',
    data
  })
}

export function getCompanyList(data) {
  return request({
    url: '/customer/get_list',
    method: 'post',
    data
  })
}

export function getCompanyInfo(data) {
  return request({
    url: '/customer/get_by_id',
    method: 'post',
    data
  })
}

export function getCompanyConstract(data) {
  return request({
    url: '/customer/get_contract',
    method: 'post',
    data
  })
}

export function saveCompanyConstract(data) {
  return request({
    url: '/customer/save_contract',
    method: 'post',
    data
  })
}

export function deleteCompany(data) {
  return request({
    url: '/customer/delete',
    method: 'post',
    data
  })
}