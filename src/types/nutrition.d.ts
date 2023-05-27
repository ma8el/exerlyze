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
    ingredients: Ingredient[],
//    nutriments: Nutriments,
    nutriments: any,
    nutriscore_grade: string,
    nutriscore_score: number
}

export interface NutritionApiSearchResponse {
    count: number,
    page: number,
    page_count: number,
    page_size: number,
    products: FilteredNutritionApiProduct[],
    skip: number,
}