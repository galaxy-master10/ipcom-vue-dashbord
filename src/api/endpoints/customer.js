// api/endpoints/customer.js
import apiClient from '../config/axiosConfig';

export const customerApi = {
  getAll: (pageNumber = 1, pageSize = 10) =>
    apiClient.get(`/customers?pageNumber=${pageNumber}&pageSize=${pageSize}`),

  getById: (id) =>
    apiClient.get(`/customers/${id}`),

  filter: (filter, pageNumber = 1, pageSize = 10) =>
    apiClient.get('/customers', {
      params: {
        ...filter,
        pageNumber,
        pageSize
      }
    }),
};
