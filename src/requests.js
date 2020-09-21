import axios from 'axios'

export const firstRequest = axios.create({
  baseURL: 'https://sport11.ru/erp/'
})

export const defaultRequest = function (token) {
  return axios.create({
    baseURL: 'https://sport11.ru/erp/',
    headers: {
      Authorization: 'Token ' + token
    }
  })
}
