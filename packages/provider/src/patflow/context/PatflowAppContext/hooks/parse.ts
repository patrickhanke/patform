import Parse from "parse/dist/parse.min.js";

console.log({ appId: process.env.SASHIDO_APP_ID });
console.log({ jsKey: process.env.SASHIDO_JS_KEY });
console.log({ masterKey: process.env.SASHIDO_MASTER_KEY });
console.log({ apiUrl: process.env.SASHIDO_API_URL });

if (!Parse.applicationId) {
	Parse.initialize(
		process.env.SASHIDO_APP_ID ,
		process.env.SASHIDO_JS_KEY,
		process.env.SASHIDO_MASTER_KEY
	);
	Parse.serverURL = process.env.SASHIDO_API_URL;
}

export default Parse;
