import { apiClient } from '../axiosInstance';
import { ENDPOINTS } from '../../constants/endpoint';

const { get, post, put } = apiClient;

export const ProductList = (search: string, sort: string, page: number, record: number, categoryId: string) =>
  get(`${ENDPOINTS.PRODUCTS}?search=${search}&sort=${sort}&page=${page}&record=${record}&categoryId=${categoryId}`);
export const ProductDetail = (id: string) => get(`${ENDPOINTS.PRODUCTS}/detail?id=${id}`);
export const ProductUpdate = (params: {}) => post(`${ENDPOINTS.PRODUCTS}/edit`, params);
export const ProductAdd = (params: {}) => post(ENDPOINTS.PRODUCTS, params);
export const DeleteProduct = (id: string) => apiClient.delete(`${ENDPOINTS.PRODUCTS}/${id}`);

export const OrderList = (search: string, sort: string, page: number, record: number) =>
  get(`${ENDPOINTS.ORDER}?search=${search}&sort=${sort}&page=${page}&record=${record}`);
export const OrderDetail = (id: string) => get(`${ENDPOINTS.ORDER}/detail?id=${id}`);
export const OrderDelete = (id: string) => apiClient.delete(`${ENDPOINTS.ORDER}/${id}`);
export const OrderChangeStatus = (params: {}) => post(`${ENDPOINTS.ORDER}/change/status`, params);

export const CategoryList = (page: number, record: number) =>
  get(`${ENDPOINTS.CATEGORY}?page=${page}&record=${record}`);
export const CategoryDetail = (id: string) => get(`${ENDPOINTS.CATEGORY}/detail?id=${id}`);
export const CategoryDelete = (id: string) => apiClient.delete(`${ENDPOINTS.CATEGORY}/${id}`);
export const CategoryUpdate = (params: {}) => post(`${ENDPOINTS.CATEGORY}/edit`, params);
export const CategoryAdd = (params: {}) => post(ENDPOINTS.CATEGORY, params);
