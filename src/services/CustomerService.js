import { customerApi } from '../api/endpoints/customer.js';
// customer service js file
export class CustomerService {
  async getCustomers(filter, pageNumber, pageSize) {
    try {

      pageNumber = Number(pageNumber);
      pageSize = Number(pageSize);

      const response = await customerApi.filter(filter, pageNumber, pageSize);
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

  async getCustomerById(id) {
    try {
      const response = await customerApi.getById(id);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
