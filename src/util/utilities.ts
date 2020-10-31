export type valueType =
	| "object"
	| "null"
	| "array"
	| "object"
	| "nan"
	| "number"
	| "function"
	| "undefined"
	| "boolean"
	| "string";
export function TrueType(v: any): valueType {
	switch (typeof v) {
		case "object":
			if (v === null) return "null";
			if (v.length !== undefined) return "array";
			return "object";
		case "number":
			if (isNaN(v)) return "nan";
			return "number";
		case "function":
			try {
				let k = new v();
				return v.name;
			} catch (err) {
				return "function";
			}
		default:
			return typeof v as valueType;
	}
}

class PermissionResponse {
	hasPerm: boolean;
	message: string;
	constructor(succeeded = false, error = "") {
		this.hasPerm = succeeded;
		this.message = error;
	}
}
export function checkPermissions(helpObj, message, bot) {
	if (helpObj.owner && message.author.id != bot.owner.id) return false;
	if (helpObj.server && message.channel.type != "text") {
		return false;
	} else if (!helpObj.server) {
		return true;
	}

	if (message.author.id == bot.owner.id) {
		return true;
	}

	if (!helpObj.owner) {
		if (message.member.hasPermission(helpObj.perms || [])) return true;
	}
	return false;
}

export function Cleanup(callback = () => {}) {
	process.on("cleanup", callback);

	process.on("exit", function () {
		//@ts-ignore
		process.emit("cleanup");
	});

	process.on("SIGINT", function () {
		console.log("Ctrl-C...");
		process.exit(2);
	});

	process.on("uncaughtException", function (e) {
		console.log("Uncaught Exception...");
		console.log(e.stack);
		process.exit(99);
	});
}

export function clearLogs() {
	console.log(Array(40).join("\n"));
}
