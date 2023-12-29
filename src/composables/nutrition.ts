import axios from 'axios'

const nutritionURL = 'https://world.openfoodfacts.org/'
const productEndpoint = 'api/v2/product/'
const searchEndpoint = "cgi/search.pl?search_terms="

const fields = 'fields=_id,_keywords,product_name,image_front_thumb_url,image_front_small_url,image_front_url,ingredients,nutriments,nutriscore_grade,nutriscore_score'

const axiosInstance = axios.create({
  baseURL: nutritionURL,
  timeout: 10000,
})

export default function useNutritionApi() {
  async function getProductByBarcode(barcode: string) {
    try {
      const { data } = await axiosInstance.get(`${productEndpoint}${barcode}?${fields}`)
      return data
    } catch (error) {
      return { error: true}
    }
  }

  async function getProductById(id: string) {
    try {
      const { data } = await axiosInstance.get(`${productEndpoint}${id}?${fields}`)
      return data
    } catch (error) {
      return { error: true}
    }
 }

  async function searchProduct(query: string) {
    try {
      const { data } = await axiosInstance.get(
        `${searchEndpoint}${query}&${fields}&action=process&json=1`
      )
      return data
    } catch (error) {
      return { error: true}
    }
  }

  return { getProductById, getProductByBarcode, searchProduct }
}
