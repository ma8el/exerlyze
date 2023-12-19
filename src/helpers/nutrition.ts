export const nutritionDetails = [
    {
      name: 'Calories',
      value: 'energy-kcal_100g',
      unit: 'energy-kcal_unit'
    },
    {
      name: 'Carbohydrates',
      value: 'carbohydrates_100g',
      unit: 'carbohydrates_unit'
    },
    {
      name: 'Protein',
      value: 'proteins_100g',
      unit: 'proteins_unit'
    },
    {
      name: 'Fat',
      value: 'fat_100g',
      unit: 'fat_unit'
    },
    {
      name: 'Fiber',
      value: 'fiber_100g',
      unit: 'fiber_unit'
    },
    {
      name: 'Sugar',
      value: 'sugars_100g',
      unit: 'sugars_unit'
    },
    {
      name: 'Salt',
      value: 'salt_100g',
      unit: 'salt_unit'
    },
    {
      name: 'Sodium',
      value: 'sodium_100g',
      unit: 'sodium_unit'
    }
  ]

export const fixedDigits = (value: number, digits: number) => {
    return Number(value.toFixed(digits))
}

export const stringToFixedDigits = (value: string, digits: number): number => {
  const number = Number(value)
  if (isNaN(number)) {
    return 0
  } else if (number % 1 === 0) {
    return number
  } else {
    return parseFloat(Number(value).toFixed(digits))
  }
}

export const calcNuritionPer100g = (value: string, weight: string): number => {
    const scalingFactor = 0.01
    const weightToFixed = stringToFixedDigits(weight, 1)
    const valueToFixed = stringToFixedDigits(value, 1)
    return fixedDigits(scalingFactor * weightToFixed * valueToFixed, 1)
}