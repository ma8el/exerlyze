import axios from 'axios'

const nutritionURL = 'https://world.openfoodfacts.org/api/v2/'
const productEndpoint = 'product/'
const searchEndpoint = 'search?categories_tags_en='

const fields = 'fields=_id,_keywords,product_name,image_front_thumb_url,ingredients,nutriments,nutriscore_grade,nutriscore_score'

export default function useNutritionApi() {
  async function getProduct(barcode: string) {
    const { data } = await axios.get(
      `${nutritionURL}${productEndpoint}${barcode}?${fields}`
    )
    return data
  }

  async function searchProduct(query: string) {
    const { data } = await axios.get(
      `${nutritionURL}${searchEndpoint}${query}&${fields}`
    )
    return data
  }

  return { getProduct, searchProduct }
}
