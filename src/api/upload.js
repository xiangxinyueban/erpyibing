import request from '@/utils/request'

export const fileRequest = (url, data) => {
  return request({
    url: url,
    method: 'post',
    data
  })
}
