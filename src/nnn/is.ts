/**
 * A helper that checks if the given argument is of a certain type.
 */
export const is: {
  (type: BigIntConstructor, arg: any): arg is bigint;
  (type: BooleanConstructor, arg: any): arg is boolean;
  (type: NumberConstructor, arg: any): arg is number;
  (type: ObjectConstructor, arg: any): arg is Partial<Record<PropertyKey, any>>;
  (type: StringConstructor, arg: any): arg is string;
  (type: SymbolConstructor, arg: any): arg is symbol;
  (type: undefined, arg: any): arg is undefined | null;
  <T extends abstract new (...args: Partial<Array<any>>) => any>(type: T, arg: any): arg is InstanceType<T>;
} = <T extends abstract new (...args: Partial<Array<any>>) => any>(
  type: BigIntConstructor | BooleanConstructor | NumberConstructor | ObjectConstructor | StringConstructor | SymbolConstructor | undefined | T,
  arg: any
): arg is bigint | boolean | number | Partial<Record<PropertyKey, any>> | string | symbol | undefined | null | InstanceType<T> =>
    arg?.constructor === type
