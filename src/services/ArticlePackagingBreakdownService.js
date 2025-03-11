// src/services/ArticlePackagingBreakdownService.js
import { articlePackagingBreakdownApi } from '../api/endpoints/articlePackagingBreakdown.js';

export class ArticlePackagingBreakdownService {
  async getArticlePackagingBreakdowns(filter, pageNumber, pageSize) {
    try {

      pageNumber = Number(pageNumber);
      pageSize = Number(pageSize);

      const response = await articlePackagingBreakdownApi.filter(filter, pageNumber, pageSize);

      return {
        data: response.data.data,
        pageNumber: response.data.pageNumber,
        pageSize: response.data.pageSize,
        totalRecords: response.data.totalRecords,
        totalPages: response.data.totalPages
      };
    } catch (error) {
      throw error;
    }
  }

  async getArticlePackagingBreakdownById(id) {
    try {
      const response = await articlePackagingBreakdownApi.getById(id);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
