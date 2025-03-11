// ArticleService.js
import { articleApi } from '../api/endpoints/articles.js';

export class ArticleService {
  async getArticles(filter, pageNumber, pageSize) {
    try {

      pageNumber = Number(pageNumber);
      pageSize = Number(pageSize);

      const response = await articleApi.filter(filter, pageNumber, pageSize);
      console.log('API Response:', response.data);

      return {
        data: response.data.data,
        pageNumber: response.data.pageNumber,
        pageSize: response.data.pageSize,
        totalRecords: response.data.totalRecords,
        totalPages: response.data.totalPages
      };
    } catch (error) {
      console.error('Error fetching articles:', error);
      throw error;
    }
  }

  async getArticleById(id) {
    try {
      const response = await articleApi.getById(id);
      return response.data;
    } catch (error) {
      console.error('Error fetching article:', error);
      throw error;
    }
  }
}
