import { get, set } from "lodash-es";

type Primitive =
	| string
	| number
	| boolean
	| bigint
	| symbol
	| null
	| undefined
	| Date;

type Prev = [never, 0, 1, 2, 3, 4];

type IsNestedObject<T> = T extends Primitive
	? false
	: T extends (...args: never[]) => unknown
		? false
		: T extends readonly unknown[]
			? false
			: T extends object
				? true
				: false;

/**
 * Dotted paths into an object, e.g. `"saison.name"`.
 * Arrays, dates and functions are treated as leaves.
 */
export type DotPaths<T, Depth extends number = 3> = [Depth] extends [never]
	? never
	: T extends Primitive
		? never
		: T extends readonly unknown[]
			? never
			: {
					[K in keyof T & string]: IsNestedObject<
						NonNullable<T[K]>
					> extends true
						? K | `${K}.${DotPaths<NonNullable<T[K]>, Prev[Depth]>}`
						: K;
				}[keyof T & string];

export type PathValue<
	T,
	P extends string
> = P extends `${infer Key}.${infer Rest}`
	? Key extends keyof T
		? PathValue<NonNullable<T[Key]>, Rest>
		: unknown
	: P extends keyof T
		? T[P]
		: unknown;

type FieldMapping<TOld, TNew, TOldPath extends string> = {
	[TNewPath in DotPaths<TNew>]: {
		to: TNewPath;
		map: (
			oldValue: PathValue<TOld, TOldPath> | undefined,
			source: TOld
		) => PathValue<TNew, TNewPath> | Promise<PathValue<TNew, TNewPath>>;
	};
}[DotPaths<TNew>];

/**
 * Old dotted keys → new keys. `map` must return a value assignable to the
 * chosen `to` field on `TNew` (or a Promise of that value).
 */
export type DataMapping<TOld, TNew> = {
	[TOldPath in DotPaths<TOld>]?: FieldMapping<TOld, TNew, TOldPath>;
};

export type DataTransporterOptions<TOld, TNew> = {
	data: TOld[];
	mapping: DataMapping<TOld, TNew>;
	className: string;
	projectId?: string;
	userId?: string;
	moduleId?: string;
	useMasterKey?: boolean;
	apiBase?: string;
};

export type DataTransporterResult<TNew> = {
	success: boolean;
	message: string;
	data: {
		transformed: TNew[];
		created: Array<{ objectId?: string; object: TNew }>;
		errors: Array<{ index: number; message: string }>;
	};
};

type RuntimeField = {
	to: string;
	map: (oldValue: unknown, source: unknown) => unknown | Promise<unknown>;
};

/** Identity helper so mapping objects stay typed against `TOld` / `TNew`. */
export const defineDataMapping = <TOld, TNew>(
	mapping: DataMapping<TOld, TNew>
): DataMapping<TOld, TNew> => mapping;

const resolveMappedValue = async <T>(
	mapper: (oldValue: unknown, source: unknown) => T | Promise<T>,
	oldValue: unknown,
	source: unknown
): Promise<T> => {
	return mapper(oldValue, source);
};

export const transformMappedData = async <TOld, TNew>(
	data: TOld[],
	mapping: DataMapping<TOld, TNew>
): Promise<TNew[]> => {
	const entries = Object.entries(mapping) as Array<[string, RuntimeField]>;

	return Promise.all(
		data.map(async (source) => {
			const next: Record<string, unknown> = {};
			for (const [from, field] of entries) {
				if (!field?.to || typeof field.map !== "function") {
					continue;
				}
				const oldValue = from.includes(".")
					? get(source, from)
					: (source as Record<string, unknown>)[from];
				const mapped = await resolveMappedValue(
					field.map,
					oldValue,
					source
				);
				if (field.to.includes(".")) {
					set(next, field.to, mapped);
				} else {
					next[field.to] = mapped;
				}
			}
			return next as TNew;
		})
	);
};

const createClassOnServer = async ({
	className,
	updateObject,
	projectId,
	userId,
	useMasterKey,
	apiBase
}: {
	className: string;
	updateObject: Record<string, unknown>;
	projectId?: string;
	userId?: string;
	useMasterKey?: boolean;
	apiBase: string;
}) => {
	const response = await fetch(`${apiBase}/data`, {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			className: className === "User" ? "_User" : className,
			updateObject,
			useMasterKey: Boolean(useMasterKey),
			userId,
			projectId
		})
	});

	const result = await response.json();
	if (!response.ok) {
		throw new Error(result.error || result.message || "Create failed");
	}
	return result as { objectId?: string };
};

/**
 * Maps an array of old objects onto a new class shape and creates them
 * via `POST /api/data`.
 *
 * @example
 * const mapping = defineDataMapping<OldVerein, ClubClass>({
 *   name: { to: "title", map: (value) => value ?? "" },
 *   "saison.name": { to: "season", map: async (value) => value ?? "" }
 * });
 *
 * await dataTransporter({
 *   data: vereine,
 *   mapping,
 *   className: "Club",
 *   projectId: project.objectId
 * });
 */
const dataTransporter = async <TOld, TNew>(
	options: DataTransporterOptions<TOld, TNew>
): Promise<DataTransporterResult<TNew>> => {
	const {
		data,
		mapping,
		className,
		projectId,
		userId,
		moduleId,
		useMasterKey = false,
		apiBase = "/api"
	} = options;

	try {
		const transformed = await transformMappedData(data, mapping);
		const created: DataTransporterResult<TNew>["data"]["created"] = [];
		const errors: DataTransporterResult<TNew>["data"]["errors"] = [];

		for (const [index, object] of transformed.entries()) {
			try {
				const updateObject: Record<string, unknown> = {
					...(object as Record<string, unknown>)
				};
				if (moduleId) {
					updateObject.module = {
						__type: "Pointer",
						className: "Module",
						objectId: moduleId
					};
				}
				const result = await createClassOnServer({
					className,
					updateObject,
					projectId,
					userId,
					useMasterKey,
					apiBase
				});
				created.push({ objectId: result.objectId, object });
			} catch (error) {
				errors.push({
					index,
					message:
						error instanceof Error
							? error.message
							: "An error occurred while creating the class"
				});
			}
		}

		return {
			success: errors.length === 0,
			message:
				errors.length === 0
					? "Classes created successfully"
					: `${created.length} created, ${errors.length} failed`,
			data: { transformed, created, errors }
		};
	} catch (error) {
		return {
			success: false,
			message:
				error instanceof Error
					? error.message
					: "An error occurred while creating the classes",
			data: { transformed: [], created: [], errors: [] }
		};
	}
};

export default dataTransporter;
