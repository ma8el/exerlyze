import axios from 'axios'
import { supabase } from '@/supabase'
import { useFoodDiaryStore } from '@/store/foodDiary'
import { FilteredNutritionApiProduct } from '@/types/nutrition'

interface Response {
  data: any,
  error: boolean
}

const nutritionURL = 'https://world.openfoodfacts.org/'
const productEndpoint = 'api/v2/product/'
const searchEndpoint = "cgi/search.pl?search_terms="

const fields = 'fields=_id,_keywords,product_name,image_front_thumb_url,image_front_small_url,image_front_url,ingredients,nutriments,nutriscore_grade,nutriscore_score'

const axiosInstance = axios.create({
  baseURL: nutritionURL,
  timeout: 10000,
})

export default function useNutritionApi() {
  async function getFavoriteProductIds(): Promise<Response>{
    try {
      const session = await supabase.auth.getSession()
      if (session.data.session === null) {
        return {
          data: [],
          error: false
        }
      }
      const { data, error } = await supabase.from('favorite_nutrition_items').select('food_id')
      if (data !== null) {
        return {
          data: data.map((item: any) => item.food_id),
          error: false
        }
      } else {
        return {
          data: [],
          error: false
      }
    }
    } catch (error) {
      return { 
        data: null,
        error: true
      }
    }
  }

  async function getFavoriteProducts(): Promise<Response> {
    try {
      const { data, error } = await getFavoriteProductIds()
      if (!error && data.length > 0) {
        const favoriteItems = await data.map(async (food_id: any) => {
          const { data } = await axiosInstance.get(`${productEndpoint}${food_id}?${fields}`)
          return {
            ...data.product,
            isFavorite: true
          }
        })
        return {
          data: await Promise.all(favoriteItems),
          error: false
        } 
      } else {
        return {
          data: [],
          error: false
      }
    }
    } catch (error) {
      return { 
        data: null,
        error: true
      }
    }
  }

  async function getProductByBarcode(barcode: string): Promise<Response> {
    try {
      const favoriteItems = await getFavoriteProductIds()
      const { data } = await axiosInstance.get(`${productEndpoint}${barcode}?${fields}`)
      if (data.status === 0) {
        return {
          data: null,
          error: true
        }
      }
      return {
        data: {
          ...data.product,
          isFavorite: favoriteItems.data.includes(barcode)
        },
        error: false
      }
    } catch (error) {
      return { 
        data: null,
        error: true
      }
    }
  }

  async function getProductById(id: string): Promise<Response> {
    try {
      const favoriteItems = await getFavoriteProductIds()
      const { data } = await axiosInstance.get(`${productEndpoint}${id}?${fields}`)
      return {
        data: {
          ...data,
          isFavorite: favoriteItems.data.includes(id)
        },
        error: false
      }
    } catch (error) {
      return { 
        data: null,
        error: true
      }
    }
 }

  async function searchProduct(query: string) {
    try {
      const favoriteItems = await getFavoriteProductIds()
      const { data } = await axiosInstance.get(
        `${searchEndpoint}${query}&${fields}&action=process&json=1`
      )
      return {
        count: data.count,
        page: data.page,
        page_count: data.page_count,
        page_size: data.page_size,
        products: data.products.map((product: FilteredNutritionApiProduct) => ({
          ...product,
          isFavorite: favoriteItems.data.includes(product._id)
        })),
        skip: data.skip,
        error: false
      }
    } catch (error) {
      return {
        count: null,
        page: null,
        page_count: null,
        page_size: null,
        products: null,
        skip: null,
        error: true
      }
    }
  }

  async function getRecentlyAddedProducts(): Promise<Response> {
    try {
      const foodDiaryStore = useFoodDiaryStore()
      const recentlyAddedItems = foodDiaryStore.getRecentlyAddedFoodIds
      const favoriteItems = await getFavoriteProductIds()

      const recentlyAddedProducts = recentlyAddedItems.map(async (food_id: string) => {
        const { data } = await axiosInstance.get(`${productEndpoint}${food_id}?${fields}`)
        return {
          ...data.product,
          isFavorite: favoriteItems.data.includes(food_id)
        }
      })
      const data = await Promise.all(recentlyAddedProducts)
      return {
        data: data,
        error: false
      }
    } catch (error) {
      return {
        data: null,
        error: true
      }
    }
  }

  return { getFavoriteProducts, getProductById, getProductByBarcode, searchProduct, getRecentlyAddedProducts }
}
