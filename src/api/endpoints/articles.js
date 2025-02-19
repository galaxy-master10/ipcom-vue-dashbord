// articles.js (API endpoint)
import apiClient from '../config/axiosConfig';

export const articleApi = {
  getAll: (pageNumber = 1, pageSize = 10) =>
    apiClient.get(`/articles?pageNumber=${pageNumber}&pageSize=${pageSize}`),

  getById: (id) =>
    apiClient.get(`/articles/${id}`),

  filter: (filter, pageNumber = 1, pageSize = 10) =>
    apiClient.get('/articles', {
      params: {
        ...filter,
        pageNumber,
        pageSize
      }
    })
};
