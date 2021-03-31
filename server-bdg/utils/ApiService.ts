import axios, { AxiosRequestConfig } from "axios"

const ApiService = {
    init(baseUrl: string, authorization: any) {
        axios.defaults.baseURL = baseUrl
        axios.defaults.headers = authorization
        axios.defaults.headers.post['Content-Type'] =
            'application/json'
    },

    setHeaderMultipartFormData() {
        axios.defaults.headers.post['Content-Type'] = 'multipart/form-data'
    },


    get(resource: string, params: any) {
        return axios.get(`${resource}`, params)
    },

    post(resource: string, data: any,) {
        return axios.post(`${resource}`, data)
    },


    put(resource: string, params: any) {
        return axios.put(`${resource}`, params)
    },

    delete(resource: string, params: any) {
        return axios.delete(resource, params);
    }
}

export default ApiService