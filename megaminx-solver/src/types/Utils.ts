const BrandSymbol = Symbol("Brand")
/** Make a primitive type unique. Enforce that enums are checked. */
export type Brand<T, B> = T & { [BrandSymbol]: B }
