export interface Ingredient {
    id: string,
    percent_estimate: number,
    percent_max: number,
    percent_min: number,
    text: string,
    vegan: string,
    vegetarian: string
}

export interface Nutriments {
}


export interface FilteredNutritionApiProduct {
    _id: string,
    _keywords: string[],
    product_name: string,
    image_front_thumb_url: string,
    image_front_small_url: string,
    image_front_url: string,
    ingredients: Ingredient[],
//    nutriments: Nutriments,
    nutriments: any,
    nutriscore_grade: string,
    nutriscore_score: number
    isFavorite: boolean,
}

export interface NutritionApiSearchResponse {
    count: number,
    page: number,
    page_count: number,
    page_size: number,
    products: FilteredNutritionApiProduct[],
    skip: number,
}

export interface FoodDiaryEntry {
    id: string,
    created_at: Date,
    food_id: string,
    food_name: string,
    quantity: number,
    unit: string,
    calories: number,
    carbohydrates: number,
    protein: number,
    fat: number,
    fiber: number,
    sugar: number,
    salt: number,
    sodium: number,
    image_front_thumb_url: string,
    deleted: boolean,
}