import { TableFeature } from './types';

export type KeyWithValueType<T, V> = {
  [Key in keyof T]-?: T[Key] extends V ? Key : never;
}[keyof T];

export type DisallowCharacters<
  T extends string,
  TInvalidCharacter extends string
> = T extends `${string}${TInvalidCharacter}${string}` ? never : T;

export type DiscriminatedArgs<TBoolDiscriminatorKey extends string, TArgs> =
  | ({ [key in TBoolDiscriminatorKey]: true } & TArgs)
  | { [key in TBoolDiscriminatorKey]?: false };

/**
 * MergedArgs takes two object types which may or may not include feature sub-objects
 * (any two pieces of the partially-constructed TableBatteries object)
 * and combines them, deeply merging the properties in the feature objects.
 * This is used to construct the TableBatteries type from its parts.
 * @see mergeArgs
 */
export type MergedArgs<
  A extends Partial<Record<TableFeature, object>>,
  B extends Partial<Record<TableFeature, object>>,
  TIncludedFeatures extends TableFeature = TableFeature
> = Omit<A, TableFeature> & Omit<B, TableFeature> & { [key in TIncludedFeatures]: A[key] & B[key] };
