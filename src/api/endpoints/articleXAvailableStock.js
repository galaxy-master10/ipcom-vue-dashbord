// src/api/endpoints/articleXAvailableStock.js
import apiClient from '../config/axiosConfig';

export const articleXAvailableStockApi = {
  getAll: (pageNumber = 1, pageSize = 10) =>
    apiClient.get(`/articleXAvailableStock?pageNumber=${pageNumber}&pageSize=${pageSize}`),

  getById: (id) =>
    apiClient.get(`/articleXAvailableStock/${id}`),

  filter: (filter, pageNumber = 1, pageSize = 10) =>
    apiClient.get('/articleXAvailableStock', {
      params: {
        ...filter,
        pageNumber,
        pageSize
      }
    })
};
