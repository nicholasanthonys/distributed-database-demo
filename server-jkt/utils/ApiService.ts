import axios, { AxiosRequestConfig } from "axios"

const ApiService = {
    init(baseUrl: string, authorization: any) {
        console.log("base url is ")
        console.log(baseUrl);
        console.log('authorization is ')
        console.log(authorization);
        axios.defaults.baseURL = baseUrl
        axios.defaults.headers = {
            common : {
                "Authorization" : authorization
            } 
        }

        axios.defaults.headers["Content-Type"] = "application/json";
        
    },

    setHeaderMultipartFormData() {
        axios.defaults.headers.post['Content-Type'] = 'multipart/form-data'
    },


    get(resource: string, params: any) {
        return axios.get(`${resource}`, params)
    },

    async post(resource: string, data: any,) {
        console.log("post to ")
        console.log(axios.defaults.baseURL);
        return await axios.post(`${resource}`, data)
    },


    put(resource: string, data : any) {
        return axios.put(`${resource}`, data)
    },

    delete(resource: string, params: any) {
        return axios.delete(resource, params);
    }
}

export default ApiService