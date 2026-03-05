export type MakeOptional<T, K extends keyof T> = Partial<Pick<T, K>> &
  Omit<T, K>;

/**
 * Recursively generates all valid lodash-style paths for a given object type.
 * Supports nested objects and arrays (e.g. "options.fixed", "options.select_options[0].label").
 */
type PathImpl<T, Prefix extends string = ""> = T extends object
	? {
			[K in keyof T & string]: NonNullable<T[K]> extends (infer E)[]
				? E extends object
					?
							| `${Prefix}${K}`
							| `${Prefix}${K}[${number}]`
							| PathImpl<E, `${Prefix}${K}[${number}].`>
					: `${Prefix}${K}` | `${Prefix}${K}[${number}]`
				: NonNullable<T[K]> extends object
					? `${Prefix}${K}` | PathImpl<NonNullable<T[K]>, `${Prefix}${K}.`>
					: `${Prefix}${K}`;
		}[keyof T & string] extends infer D
		? Extract<D, string>
		: never
	: never;

export type Path<T> = PathImpl<T, "">;
