// src/api/endpoints/articlePackagingBreakdown.js
import apiClient from '../config/axiosConfig';

export const articlePackagingBreakdownApi = {
  getAll: (pageNumber = 1, pageSize = 10) =>
    apiClient.get(`/articlePackagingBreakdown?pageNumber=${pageNumber}&pageSize=${pageSize}`),

  getById: (id) =>
    apiClient.get(`/articlePackagingBreakdown/${id}`),

  filter: (filter, pageNumber = 1, pageSize = 10) =>
    apiClient.get('/articlePackagingBreakdown', {
      params: {
        ...filter,
        pageNumber,
        pageSize
      }
    })
};
