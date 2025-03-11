// src/services/ArticleXAvailableStockService.js
import { articleXAvailableStockApi } from '../api/endpoints/articleXAvailableStock.js';

export class ArticleXAvailableStockService {
  async getArticleXAvailableStocks(filter, pageNumber, pageSize) {
    try {

      pageNumber = Number(pageNumber);
      pageSize = Number(pageSize);

      const response = await articleXAvailableStockApi.filter(filter, pageNumber, pageSize);

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

  async getArticleXAvailableStockById(id) {
    try {
      const response = await articleXAvailableStockApi.getById(id);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getArticlesXAvailableStockByIdAndCompanyStockLocationId(id, companyStockLocationId) {
    try {
      const response = await articleXAvailableStockApi.getByIdAndCompanyStockLocationId(id, companyStockLocationId);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
