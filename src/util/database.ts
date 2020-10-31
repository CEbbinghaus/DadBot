import { EventEmitter } from "events";

import { MongoClient, Db, Collection } from "mongodb";

import { TrueType } from "./utilities"

function partial(func: Function, ...args: any[]) {
	// var args = Array.prototype.slice.call(arguments, 1);
	return function() {
		var allArguments = args.concat(Array.prototype.slice.call(arguments));
		return func.apply({}, allArguments);
	};
}

async function AsyncArray(a: Array<Function>) {
	let e = a.shift();
	if(!e) return;
	await e();
	if(a)
		AsyncArray(a);
}

const loopObjects = (a: object, b: object): Array<Array<string>> => {
	let res: any[] = [];
	for(let ak in a) {
		if(ak == "_id") continue;
		let found = false;
		for(let bk in b) {
			if(ak == bk) {
				if(typeof a[ak] == "object" && a[ak] != null) res.push([ak, loopObjects(a[ak], b[bk])] as never);
				found = true;
			}
		}
		if(!found) {
			res.push([ak, a[ak]] as never);
		}
	}
	return res;
}

const compressArray = (a: Array<any> = [], s: string = ""): Array<Array<string>> => {
	if(s.length != 0) s += ".";
	let res: Array<Array<string>> = [];
	for(let o of a) {
		if(o.length != 2) continue;
		if(TrueType(o[1]) == "array") {
			res = res.concat(compressArray(o[1], s + o[0]));
		} else {
			res.push([s + o[0], o[1]]);
		}
	}
	return res;
}

const createObject = (a: Array<Array<string>> = []) => {
	let o = {};
	for(let i of a) {
		if(i.length == 2) {
			o[i[0]] = i[1];
		}
	}
	return o;
}

const getChanges = (a: object, b: object): object => {
	let resultObj = {};
	let added = createObject(compressArray(loopObjects(b, a)));
	let removed = createObject(compressArray(loopObjects(a, b)));
	if(Object.keys(added).length) resultObj["$set"] = added;
	if(Object.keys(removed).length) resultObj["$unset"] = removed;
	return resultObj;
}

export enum Events {
	read = "OnRead",
	write = "OnWrite",
	update = "OnUpdate",
	connect = "OnConnect",
	disconnect = "OnDisconnect",
	delete = "OnDelete"
};

class queryResult {
	result: any;
	resolved: boolean;
	constructor(result: any) {
		this.result = result || null;
		this.resolved = result ? true : false;
	}
};

class CacheResult {
	lastQuery: number;
	server: any;
	constructor(server: any) {
		this.lastQuery = Date.now();
		this.server = server;
	}
}

export interface IAuthOptions {
	username: string;
	password: string;
}

export interface IDatabaseOptions {
	database: string;
	collection: string;
	port?: number;
	auth?: IAuthOptions;
	host?: string;
	noThrow?: boolean;
}

export class DataBase extends EventEmitter {
	url: string;
	databaseName: string;

	host: MongoClient;
	collection: Db;
	database: Collection;

	connected: boolean;
	_queue: Array<Function>;

	options: IDatabaseOptions;

	constructor(Options?: IDatabaseOptions) {
		super();
		let defaults: IDatabaseOptions = {
			host: "localhost",
			database: "undefined",
			collection: "default",
			port: 27017,
			noThrow: true
		}

		this.options = Object.assign(defaults, Options);

		if(!this.options.database)
			throw "A Collection Name Must be Specified";

		let hasAuth = (this.options.auth) ? true : false;

		let authString = hasAuth ? `${encodeURIComponent(this.options.auth.username)}:${encodeURIComponent(this.options.auth.password)}@` : "";

		this.url = `mongodb://${authString}${this.options.host}:${this.options.port}${hasAuth ? "?authMechanism=SCRAM-SHA-1&authSource=" + this.options.database : ""}`;
		//console.log(this.url);
		//mongodb://GYter9Fv:DkQqAwl9mWu032uIP3tJcamVrBADBtTS@54.38.159.184:27017?authMechanism=SCRAM-SHA-1&authSource=Bots
		//mongodb://GYter9Fv:DkQqAwl9mWu032uIP3tJcamVrBADBtTS@54.38.159.184:27017?authMechanism=SCRAM-SHA-1&authSource=Bots
		// //@ts-ignore
		// this.url = `mongodb://${hasAuth ? `${encodeURIComponent(options.auth.username)}:${encodeURIComponent(options.auth.password)}@` : ""}${host}:${options.port}/?${hasAuth ? "authMechanism=SCRAM-SHA-1" : ""}&authSource=Bots`;


		this.databaseName = this.options.database;

		//this.host = new MongoClient(this.url, {useNewUrlParser: true, useUnifiedTopology: true});
		this.collection = {} as Db;
		this.database = null;
		this.connected = false;
		this._queue = [];
		this._connect(this.databaseName);
	}

	async _connect(databaseName: string) {
		await MongoClient.connect(this.url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
			if(err) throw err;
			this.host = client;
			this.collection = this.host.db(this.databaseName);
			this.database = this.collection.collection(this.options.collection);
			this.connected = true;
			if(this._queue.length) AsyncArray(this._queue);
			this.emit(Events.connect, this);
		})
	}

	async read(o: object, c?: Function): Promise<any> {
		return this._runCommand(c, async (c: Function) => {
			let v = await this.database.findOne(o);
			if(!v)
				if(this.options.noThrow)
					c(null);
				else
					throw "Nothing Was Found";
			c(v);
			this.emit(Events.read, v);
		});
	}

	async write(o: object, c?: Function) {
		return this._runCommand(c, async (c: Function) => {
			let exists = (await this._queryObject(o)).resolved;
			if(!exists)
				this.database.insertOne(o).then((v: any) => {
					c(v.ops[0]);
					this.emit(Events.write, v.ops[0]);
				});
			else {
				if(this.options.noThrow)
					c(null);
				else
					throw "This Element Exists Already";
			}
		});
	}

	async exists(o: object, c?: Function) {
		return this._runCommand(c, async (c: Function) => {
			let exists = (await this._queryObject(o)).resolved;
			c(exists);
		});
	}

	async update(o1: object, o2: object, c?: Function) {
		return this._runCommand(c, async (c: Function) => {
			let exists = (await this._queryObject(o1)).resolved;
			if(exists)
				this.database.updateOne(o1, {
					$set: o2
				}).then((v: any) => {
					c(Object.assign(o1, o2));
					this.emit(Events.update, Object.assign(o1, o2));
				});
			else
				if(this.options.noThrow)
					c(null);
				else
					throw "Element Doesnt Exist";
		});
	}

	async updateAll(o1: object = {}, o2: object, c?: Function) {
		return this._runCommand(c, async (c: Function) => {
			let r = await this.database.updateMany(o1, o2)
			if(r)
				if(this.options.noThrow)
					c(null);
				else
					throw r;
			c({}, null);
		})
	}

	async delete(o: object, c?: Function) {
		return this._runCommand(c, async (c: Function) => {
			let exists = (await this._queryObject(o)).resolved;
			if(exists)
				this.database.deleteOne(o).then((v: any) => {
					c(v);
					this.emit(Events.delete, o);
				});
			else
				if(this.options.noThrow)
					c(null);
				else
					throw "Object Doesnt Exist";
		});
	}

	async fetchAll(c?: Function) {
		return this._runCommand(c, async (c: any) => {
			this.database.find({}).toArray((err: any, res: Array<any>) => {
				if(err)
					if(this.options.noThrow)
						c(null);
					else
						throw "No Data Found: " + err;
				c(res);
			})
		})
	}

	_runCommand(c: Function | undefined, f: Function): undefined | Promise<Function> {
		if(!f)
			if(this.options.noThrow)
				c(null);
			else
				throw "You Must Provide a Function";

		//Promisify the Function if no Callback Exists
		if(!c) return new Promise(res => this._runCommand(res, f));

		//Double Check that its a function (you never know)
		if(typeof c == "function") {

			//Check if the Database is currently Connected
			if(this.connected) {

				//If so Execute the function and Catch any possible Errors to Prevent Exiting the Main Loop
				f(c).catch((err: any) => {

					//Logs the Error and Calls the Callback/Promise with null as the first Argument and the Error as the Second
					console.error(err);
					c(null, err);

				});

				//Otherwise Push Command Onto Queue to be Executed When Database Regains Connection
			} else
				this._queue.push(partial(f, c));

			//If its Not a Function All hell Breaks loose
		} else {

			throw "Fatal Error Executing Function";
		}
	}

	async disconnect() {
		this.connected = false;
		this.emit(Events.disconnect);
		this.disconnect();
	}

	protected _queryObject(o: object): Promise<queryResult> {
		return new Promise(res => {
			let run = () => {
				this.database.findOne(o).then((v: any) => {
					res(new queryResult(v));
				});
			};
			if(this.connected) run();
			else this._queue.push(run);
		});
	}

}

export class CachedDataBase extends DataBase {
	Cache: Map<string, CacheResult>;
	LastPass: number;

	constructor(Options?: IDatabaseOptions) {
		super(Options);
		this.Cache = new Map();
		this.on(Events.read, this.handleEvents);
		this.on(Events.write, this.handleEvents);
		this.on(Events.update, (o: any) => this.handleEvents(o, 'Update'));
		this.on(Events.delete, (o: any) => this.handleEvents(o, 'Delete'));
		this.LastPass = Date.now();
		this.CollectGarbage();
	}
	handleEvents(o: any, options: string | null) {
		if(!o || !o.id) return;
		switch(options) {
			case "Update":
				this.Cache.set(o.id, Object.assign(this.Cache.has(o.id) ? this.Cache.get(o.id) : this._queryObject(o), new CacheResult(o)));
				break;
			case "Delete":
				if(this.Cache.has(o.id)) {
					this.Cache.delete(o.id);
				}
				break;
			default:
				this.Cache.set(o.id, new CacheResult(o))
		}
	};
	CollectGarbage() {
		if(this.Cache.size) {
			let cleared = [];
			for(let [k, v] of this.Cache) {
				if(v.lastQuery < this.LastPass) {
					cleared.push(k);
					this.Cache.delete(k);
				}
			}
			if(Date.now() - this.LastPass > 100)
				console.log(`Cleared ${cleared.length} Servers from the Cache`);
		};
		this.LastPass = Date.now();
		setTimeout(this.CollectGarbage.bind(this), 6e4 * 30);
	}
	modifySchema(object: object, c: Function) {
		return this._runCommand(c, async (c: any) => {
			let oldObj = await this.read({});
			let Change = getChanges(oldObj, object)
			if(Object.keys(Change).length) {
				this.updateAll({}, Change, c)
				c();
			}else
				c(null, "Nothing To Change");
		})
	}
	protected _queryObject(o: any): Promise<queryResult> {
		return new Promise(res => {
			if(o.id && this.Cache.has(o.id)) {
				let result = this.Cache.get(o.id);
				res(new queryResult(result.server));
				result.lastQuery = Date.now();
				return;
			}
			let run = () => {
				this.database.findOne(o).then((v: any) => {
					res(new queryResult(v));
				});
			};
			if(this.connected) run();
			else this._queue.push(run);
		});
	}
}