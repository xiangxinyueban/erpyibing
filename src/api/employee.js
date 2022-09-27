import request from '@/utils/request'

export function saveEmployee(data) {
  return request({
    url: '/employees/save',
    method: 'post',
    data
  })
}

export function lookupEmployee(data) {
  return request({
    url: '/employees/get_list',
    method: 'post',
    data
  })
}

export function getResume(data) {
  return request({
    url: '/employees/get_by_id',
    method: 'post',
    data
  })
}

export function getWorkExperience(data) {
  return request({
    url: '/employees/list_work_experience',
    method: 'post',
    data
  })
}

export function uploadForDynamic(data) {
  return request({
    url: '/upload/upload_image',
    method: 'post',
    data: data
  })
}

export function saveContract(data) {
  return request({
    url: '/contract/save_contract',
    method: 'post',
    data: data
  })
}

export function deleteEmployee(data) {
  return request({
    url: '/employees/delete',
    method: 'post',
    data
  })
}
export function downloadEmployee(data) {
  return request({
    url: '/employees/to_excel',
    method: 'get',
    responseType: "blob",
    data
  })
}