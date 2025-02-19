// src/services/ArticlePackagingBreakdownService.js
import { articlePackagingBreakdownApi } from '../api/endpoints/articlePackagingBreakdown.js';

export class ArticlePackagingBreakdownService {
  async getArticlePackagingBreakdowns(filter, pageNumber, pageSize) {
    try {
      console.log('Service sending params:', { filter, pageNumber, pageSize });

      pageNumber = Number(pageNumber);
      pageSize = Number(pageSize);

      const response = await articlePackagingBreakdownApi.filter(filter, pageNumber, pageSize);
      console.log('API Response:', response.data);

      return {
        data: response.data.data,
        pageNumber: response.data.pageNumber,
        pageSize: response.data.pageSize,
        totalRecords: response.data.totalRecords,
        totalPages: response.data.totalPages
      };
    } catch (error) {
      console.error('Error fetching article packaging breakdowns:', error);
      throw error;
    }
  }

  async getArticlePackagingBreakdownById(id) {
    try {
      const response = await articlePackagingBreakdownApi.getById(id);
      return response.data;
    } catch (error) {
      console.error('Error fetching article packaging breakdown:', error);
      throw error;
    }
  }
}
