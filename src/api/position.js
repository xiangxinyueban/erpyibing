import request from '@/utils/request'

export function savePositionInfo(data) {
  return request({
    url: '/job/save',
    method: 'post',
    data
  })
}

export function getPositionList(data) {
  return request({
    url: '/job/get_list',
    method: 'post',
    data
  })
}

export function getPositionDetail(data) {
  return request({
    url: '/job/get_by_id',
    method: 'post',
    data
  })
}

export function getMatchJobList(data) {
  return request({
    url: '/job/match_job',
    method: 'post',
    data
  })
}
