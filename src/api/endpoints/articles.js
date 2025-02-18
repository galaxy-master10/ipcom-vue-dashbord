import apiClient from '../config/axiosConfig';

export const articleApi = {
  getAll: (page = 1, pageSize = 10) =>
    apiClient.get(`/articles?pageNumber=${page}&pageSize=${pageSize}`),

  getById: (id) =>
    apiClient.get(`/articles/${id}`),

  filter: (filter) =>
    apiClient.get('/articles', { params: { ...filter } }),
};

