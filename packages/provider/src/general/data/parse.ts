import Parse from "parse/dist/parse.min.js";

console.log(process.env.SASHIDO_APP_ID);

if (!Parse.applicationId) {
	Parse.initialize(
		process.env.SASHIDO_APP_ID,
		process.env.SASHIDO_JS_KEY,
		process.env.SASHIDO_MASTER_KEY
	);
	Parse.serverURL = process.env.SASHIDO_API_URL;
}

console.log(Parse.applicationId);

export default Parse;
