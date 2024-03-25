/**
 * The type of arguments of the `escapeValues` and `escape` helpers.
 */
export type EscapeMap = Map<any, (value?: any) => string>;

/**
 * A generic helper for escaping `values` by given `escapeMap`.
 */
export declare const escapeValues: (escapeMap: EscapeMap, values: Partial<Array<any>>) => Partial<Array<string>>;

/**
 * A generic helper for escaping `values` by given `escapeMap` (in *TemplateStrings* flavor).
 */
export declare const escape: (escapeMap: EscapeMap, template: TemplateStringsArray, ...values: Partial<Array<any>>) => string;

/**
 * A helper that implements typographic corrections specific to Polish typography.
 */
export declare const fixTypography: (node: Node) => void;

/**
 * The type of arguments of the `h` and `s` helpers.
 */
export type HArgs1 = Partial<Record<PropertyKey, any>> | null | undefined | Node | string | number | HArgs;

/**
 * The type of arguments of the `h` and `s` helpers.
 */
export type HArgs = [string | Node, ...HArgs1[]];

/**
 * A lightweight [HyperScript](https://github.com/hyperhype/hyperscript)-style helper for creating and modifying `HTMLElement`s (see also `s`).
 *
 * - The first argument of type `string` specifies the tag of the element to be created.
 * - The first argument of type `Node` specifies the element to be modified.
 * - All other arguments of type `Partial<Record<PropertyKey, any>>` are mappings of attributes and properties.
 *   Keys starting with `$` specify *properties* (without the leading `$`) to be set on the element being created or modified.
 *   (Note that `$` is not a valid attribute name character.)
 *   All other keys specify *attributes* to be set by `setAttribute`.
 *   An attribute equal to `false` causes the attribute to be removed by `removeAttribute`.
 * - All other arguments of type `null` or `undefined` are simply ignored.
 * - All other arguments of type `Node` are appended to the element being created or modified.
 * - All other arguments of type `string`/`number` are converted to `Text` nodes and appended to the element being created or modified.
 * - All other arguments of type `HArgs` are passed to `h` and the results are appended to the element being created or modified.
 */
export declare const h: {
    <T extends keyof HTMLElementTagNameMap>(tag: T, ...args1: Partial<Array<HArgs1>>): HTMLElementTagNameMap[T];
    <N extends Node>(node: N, ...args1: Partial<Array<HArgs1>>): N;
    (tagOrNode: string | Node, ...args1: Partial<Array<HArgs1>>): Node;
};

/**
 * A lightweight [HyperScript](https://github.com/hyperhype/hyperscript)-style helper for creating and modifying `SVGElement`s (see also `h`).
 *
 * - The first argument of type `string` specifies the tag of the element to be created.
 * - The first argument of type `Node` specifies the element to be modified.
 * - All other arguments of type `Partial<Record<PropertyKey, any>>` are mappings of attributes and properties.
 *   Keys starting with `$` specify *properties* (without the leading `$`) to be set on the element being created or modified.
 *   (Note that `$` is not a valid attribute name character.)
 *   All other keys specify *attributes* to be set by `setAttributeNS`.
 *   An attribute equal to `false` causes the attribute to be removed by `removeAttributeNS`.
 * - All other arguments of type `null` or `undefined` are simply ignored.
 * - All other arguments of type `Node` are appended to the element being created or modified.
 * - All other arguments of type `string`/`number` are converted to `Text` nodes and appended to the element being created or modified.
 * - All other arguments of type `HArgs` are passed to `s` and the results are appended to the element being created or modified.
 */
export declare const s: {
    <T extends keyof SVGElementTagNameMap>(tag: T, ...args1: Partial<Array<HArgs1>>): SVGElementTagNameMap[T];
    <N extends Node>(node: N, ...args1: Partial<Array<HArgs1>>): N;
    (tagOrNode: string | Node, ...args1: Partial<Array<HArgs1>>): Node;
};

/**
 * A convenient shortcut for `s('svg', ['use', { 'xlink:href': '#' + id }], ...args)`.
 */
export declare const svgUse: (id: string, ...args: Partial<Array<HArgs1>>) => SVGSVGElement;

/**
 * A replacement for the `in` operator (not to be confused with the `for-in` loop) that works properly.
 */
export declare const has: (key: any, ref: any) => boolean;

/**
 * A helper that checks if the given argument is of a certain type.
 */
export declare const is: {
    (type: ArrayConstructor, arg: any): arg is Partial<Array<any>>;
    (type: BigIntConstructor, arg: any): arg is bigint;
    (type: BooleanConstructor, arg: any): arg is boolean;
    (type: NumberConstructor, arg: any): arg is number;
    (type: ObjectConstructor, arg: any): arg is Partial<Record<PropertyKey, any>>;
    (type: StringConstructor, arg: any): arg is string;
    (type: SymbolConstructor, arg: any): arg is symbol;
    (type: undefined, arg: any): arg is undefined | null;
    <T extends abstract new (...args: Partial<Array<any>>) => any>(type: T, arg: any): arg is InstanceType<T>;
};

/**
 * The type of arguments of the `jc` helper.
 */
export type JcNode = {
    [attributeOrSelector: string]: string | number | JcNode | undefined;
};

/**
 * The type of arguments of the `jc` helper.
 */
export type JcRoot = Partial<Record<PropertyKey, JcNode>>;

/**
 * A simple JS-to-CSS (aka CSS-in-JS) helper.
 *
 * The `root` parameter provides a hierarchical description of CSS rules.
 *
 * - Keys of sub-objects whose values are NOT objects are treated as CSS attribute, and values are treated as values of those CSS attributes; the concatenation of keys of all parent objects is a CSS rule.
 * - All keys ignore the part starting with a splitter (default: `$$`) sign until the end of the key (e.g. `src$$1` → `src`, `@font-face$$1` → `@font-face`).
 * - In keys specifying CSS attribute, all uppercase letters are replaced by lowercase letters with an additional `-` character preceding them (e.g. `fontFamily` → `font-family`).
 * - Commas in keys that makes a CSS rule cause it to “split” and create separate rules for each part (e.g. `{div:{margin:1,'.a,.b,.c':{margin:2}}}` → `div{margin:1}div.a,div.b,div.c{margin:2}`).
 * - Top-level keys that begin with `@` are not concatenated with sub-object keys.
 */
export declare const jc: (root: JcRoot, splitter?: string) => string;

/**
 * `JSON.parse` with “JavaScript turned on”.
 *
 * Objects having *exactly* one property which is present in the `handlers` map, i.e. objects of the form:
 *
 * ```js
 * { "«handlerName»": [«params»] }
 * ```
 *
 * are replaced by the result of call
 *
 * ```js
 * handlers['«handlerName»'](...«params»)
 * ```
 */
export declare const jsOnParse: (handlers: Partial<Record<PropertyKey, Function>>, text: string) => any;

/**
 * Language translations helper.
 */
export declare const locale: (map: Partial<Record<PropertyKey, Partial<Record<PropertyKey, string>>>>, defaultVersion: string) => (text: string, version?: string) => string;

/**
 * A generic helper for syntax highlighting (see also `nanolightJs`).
 */
export declare const nanolight: (pattern: RegExp, highlighters: ((chunk: string, index: number) => HArgs1)[], code: string) => HArgs1[];

/**
 * A helper for highlighting JavaScript.
 */
export declare const nanolightJs: (code: string) => HArgs1[];

/**
 * A helper that implements TypeScript’s `Pick` utility type.
 */
export declare const pick: <T extends Partial<Record<PropertyKey, any>>, K extends (keyof T)[]>(obj: Partial<Record<PropertyKey, any>>, keys: Partial<Array<any>>) => Pick<T, K[number]>;

/**
 * A helper that implements TypeScript’s `Omit` utility type.
 */
export declare const omit: <T extends Partial<Record<PropertyKey, any>>, K extends (keyof T)[]>(obj: Partial<Record<PropertyKey, any>>, keys: Partial<Array<any>>) => Omit<T, K[number]>;

/**
 * A helper for choosing the correct singular and plural.
 */
export declare const plUral: (singular: string, plural2: string, plural5: string, value: number) => string;

/**
 * A helper that protects calls to nested properties by a `Proxy` that initializes non-existent values with an empty object.
 */
export declare const pro: (ref: any) => any;

/**
 * A helper that provides information about the given `refs`.
 *
 * It returns an array of triples: `[«name», «prototype-name», «array-of-own-property-names»]`.
 */
export declare const refsInfo: (...refs: Partial<Array<any>>) => [string, string, (string | undefined)[]][];

/**
 * A helper that generates a UUID v1 identifier (with a creation timestamp).
 *
 * - The optional `node` parameter should have the format `/^[0123456789abcdef]+$/`.
 *   Its value will be trimmed to last 12 characters and left padded with zeros.
 */
export declare const uuid1: ({ date, node }?: {
    date?: Date | undefined;
    node?: string | undefined;
}) => string;
