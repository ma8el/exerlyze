import axios from 'axios'

const nutritionURL = 'https://world.openfoodfacts.org/'
const productEndpoint = 'api/v2/product/'
const searchEndpoint = "cgi/search.pl?search_terms="

const fields = 'fields=_id,_keywords,product_name,image_front_thumb_url,image_front_small_url,image_front_url,ingredients,nutriments,nutriscore_grade,nutriscore_score'

export default function useNutritionApi() {
  async function getProduct(barcode: string) {
    const { data } = await axios.get(
      `${nutritionURL}${productEndpoint}${barcode}?${fields}`
    )
    return data
  }

  async function searchProduct(query: string) {
    const { data } = await axios.get(
      `${nutritionURL}${searchEndpoint}${query}&${fields}&action=process&json=1`
    )
    return data
  }

  return { getProduct, searchProduct }
}
