/** Role ids allowed to perform an action. `undefined` inherits; `[]` denies everyone. */
export type FieldPermission = {
	read?: string[];
	write?: string[];
};

/** One user may open one record subpage. Role actions stay unset. */
export type ModulePageAccess = {
	className: string;
	userId: string;
	id: string;
	/**
	 * Set when the grant was copied from another record, e.g. the primary club
	 * of a Spielgemeinschaft. Holds the id of that record. Managed by the cloud
	 * function `check_union_rights`.
	 */
	derived_from?: string;
};

/**
 * Role ids for a module. A missing action keeps the role's module list.
 * An empty array denies that action.
 */
export type ModulePermission = {
	access?: string[];
	read?: string[];
	write?: string[];
	create?: string[];
	update?: string[];
	delete?: string[];
	pages?: ModulePageAccess[];
};

export type ModuleRoleAction = Exclude<keyof ModulePermission, "pages">;
