
import { articleApi } from '../api/endpoints/articles.js';

export class ArticleService {
  async getArticles(filter, page, pageSize) {
    try {
      const response = await articleApi.filter({ ...filter, page, pageSize });
      return response.data;
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
