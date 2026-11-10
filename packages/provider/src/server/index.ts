import "server-only";
import * as dataRoute from "./dataRoute";
import * as deployHookRoute from "./deployHookRoute";
import * as graphqlRoute from "./graphqlRoute";

export { dataRoute, deployHookRoute, graphqlRoute };
export * from "./access";
export * from "./sashido";
export {
	isActiveAccessGrant,
	modulesForAccessClass,
	recordAccessPath,
	recordIdFromPath
} from "../general/functions/userAccess";
export {
	canDeleteRecord,
	canEnterModule,
	canEnterRecord,
	canReadField,
	canWriteField,
	pageGrantRecords
} from "../general/functions/fieldAccess";
export type { AccessRole } from "../general/functions/fieldAccess";
export {
	classNameForGraphqlField,
	enforceContentDelete,
	enforceContentWrite,
	loadAccessRoles,
	loadContentAccess,
	loadProjectModules,
	prepareContentRead,
	stripGraphqlData,
	stripReadResult
} from "./contentAccess";
export type { StoredAccessModule } from "./contentAccess";
