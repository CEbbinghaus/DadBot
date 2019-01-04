const {EventEmitter} = require("events");
const {MongoClient} = require("mongodb");
const {TrueType} = require("./utilities")

function partial(func /*, 0..n args */ ) {
    var args = Array.prototype.slice.call(arguments, 1);
    return function () {
        var allArguments = args.concat(Array.prototype.slice.call(arguments));
        return func.apply(this, allArguments);
    };
}
async function AsyncArray(a) {
    let e = a.shift();
    if (!e) return;
    await e();
    if (a)
        AsyncArray(a);
}
const loopObjects = (a, b) => {
    let res = [];
    for (let ak in a) {
        if (ak == "_id") continue;
        let found = false;
        for (let bk in b) {
            if (ak == bk) {
                if (typeof a[ak] == "object" && a[ak] != null) res.push([ak, loopObjects(a[ak], b[bk])]);
                found = true;
            }
        }
        if (!found) {
            res.push([ak, a[ak]]);
        }
    }
    ResObj = {};
    return res;
}
const compressArray = (a = [], s = "") => {
    if (s.length != 0) s += ".";
    let res = [];
    for (let o of a) {
        if (o.length != 2) continue;
        if (TrueType(o[1]) == "array") {
            res = res.concat(compressArray(o[1], s + o[0]));
        } else {
            res.push([s + o[0], o[1]]);
        }
    }
    return res;
}
const createObject = (a = []) => {
    let o = {};
    for (let i of a) {
        if (i.length == 2) {
            o[i[0]] = i[1];
        }
    }
    return o;
}
const getChanges = (a, b) => {
    let resultObj = {};
    let added = createObject(compressArray(loopObjects(b, a)));
    let removed = createObject(compressArray(loopObjects(a, b)));
    if (Object.keys(added).length) resultObj["$set"] = added;
    if (Object.keys(removed).length) resultObj["$unset"] = removed;
    return resultObj;
}
const Events = {
    read: "OnRead",
    write: "OnWrite",
    update: "OnUpdate",
    connect: "OnConnect",
    disconnect: "OnDisconnect",
    delete: "OnDelete"
};
const queryResult = function(result){
    this.result = result || null;
    this.resolved = result ? true : false;
};
const CacheResult = function(server){
    this.LastQuery = Date.now();
    this.Server = server;
}
module.exports.DataBaseEvents = Events;
class DataBase extends EventEmitter {
    constructor(host = "localhost", CollectionName, Username, Password) {
        super();
        if (!CollectionName) throw "A Collection Name Must be Specified";
        let hasAuth = (Username && Password) ? true : false;
        this.url = `mongodb://${hasAuth ? `${encodeURIComponent(Username)}:${encodeURIComponent(Password)}@` : ""}${host}:27017/?${hasAuth ? "authMechanism=SCRAM-SHA-1" : ""}&authSource=Bots`;
        this.name = CollectionName;
        this.host = new MongoClient(this.url, {
            useNewUrlParser: true
        });
        this.collection = null;
        this.database = null;
        this.connected = false;
        this._queue = [];
        this.connect(this.name);
    }
    connect(name) {
        this.host.connect((err) => {
            if (err) throw err;
            this.collection = this.host.db("Bots");
            this.database = this.collection.collection(name || this.name);
            this.connected = true;
            if (this._queue.length) AsyncArray(this._queue);
            this.emit(Events.connect, this);
        });
    }
    async read(o, c) {
        return this._runCommand(c, async c => {
            let v = await this.database.findOne(o);
            if (!v) throw "Nothing Was Found";
            c(v);
            this.emit(Events.read, v);
        });
    }
    async write(o, c) {
        return this._runCommand(c, async c => {
            let exists = (await this._queryObject(o)).resolved;
            if (!exists)
                this.database.insertOne(o).then(v => {
                    c(v.ops[0]);
                    this.emit(Events.write, v.ops[0]);
                });
            else {
                throw "This Element Exists Already";
            }
        });
    }
    async exists(o, c) {
        return this._runCommand(c, async c => {
            let exists = (await this._queryObject(o)).resolved;
            c(exists);
        });
    }
    async update(o1, o2, c) {
        return this._runCommand(c, async c => {
            let exists = (await this._queryObject(o1)).resolved;
            if (exists)
                this.database.updateOne(o1, {
                    $set: o2
                }).then(v => {
                    c(Object.assign(o1, o2));
                    this.emit(Events.update, Object.assign(o1, o2));
                });
            else throw "Element Doesnt Exist";
        });
    }
    async updateAll(o1 = {}, o2, c){
        return this._runCommand(c, async c => {
            let r = await this.database.updateMany(o1, o2)
            if(r)throw r;
            c({}, null);
        })
    }
    async delete(o, c) {
        return this._runCommand(c, async c => {
            let exists = (await this._queryObject(o)).resolved;
            if (exists)
                this.database.deleteOne(o).then(v => {
                    c(v);
                    this.emit(Events.delete, o);
                });
            else throw "Object Doesnt Exist";
        });
    }
    async fetchAll(c){
        return this._runCommand(c, async c => {
            this.database.find({}).toArray((err, res) => {
                if(err)return c(null, "Nothing Found");
                c(res);
            })
        })
    }
    _runCommand(c, f) {
        if (!f) throw "You Must Provide a Function";
        if (!c) return new Promise(res => this._runCommand(res, f));
        if (typeof c == "function") {
            if (this.connected){
                f(c).catch(v => {
                    console.error(v);
                    c(null, v);
                });
            }
            else this._queue.push(partial(f, c));
        }else throw "Callback Must be Specified";
    }
    
    async disconnect() {
        this.connected = false;
        this.emit(Events.disconnect);
        this.disconnect();
    }
    _queryObject(o) {
        return new Promise(res => {
            let run = () => {
                this.database.findOne(o).then(v => {
                    res(new queryResult(v));
                });
            };
            if (this.connected) run();
            else this._queue.push(run);
        });
    }

}
module.exports.DataBase = DataBase;

class CachedDataBase extends DataBase {
    constructor(host, CollectionName, Username, Password) {
        super(host, CollectionName, Username, Password);
        this.Cache = new Map();
        this.on(Events.read, this.handleEvents);
        this.on(Events.write, this.handleEvents);
        this.on(Events.update, o => this.handleEvents(o, 'Update'));
        this.on(Events.delete, o => this.handleEvents(o, 'Delete'));
        this.LastPass = Date.now();
        this.CollectGarbage();
    }
    handleEvents(o, options){
        if (!o || !o.id) return;
        switch (options) {
            case "Update":
                this.Cache.set(o.id, Object.assign(this.Cache.has(o.id) ? this.Cache.get(o.id) : this._queryObject(o), new CacheResult(o)));
                break;
            case "Delete":
                if (this.Cache.has(o.id)) {
                    this.Cache.delete(o.id);
                }
                break;
            default:
                this.Cache.set(o.id, new CacheResult(o))
        }
    };
    CollectGarbage(){
        if(this.Cache.size){
            let cleared = [];
            for (let [k, v] of this.Cache) {
                if(v.LastQuery < this.LastPass){
                    cleared.push(k);
                    this.Cache.delete(k);
                }
            }
            if (Date.now() - this.LastPass > 100) console.log(`Cleared ${cleared.length} Servers from the Cache`);
        };
        this.LastPass = Date.now();
        setTimeout(this.CollectGarbage.bind(this), 6e4 * 30);
    }
    modifyShema(object, c){
        return this._runCommand(c, async c => {
            let oldObj = await this.read({});
            let Change = getChanges(oldObj, object)
            if(Object.keys(Change).length){
                this.updateAll({}, Change, c)
            }
            c(null, "Nothing To Change");
        })
    }
    async _queryObject(o) {
        return new Promise(res => {
            if(o.id && this.Cache.has(o.id)){
                let result = this.Cache.get(o.id);
                res(new queryResult(result.Server));
                result.LastQuery = Date.now();
                return;
            }
            let run = () => {
                this.database.findOne(o).then(v => {
                    res(new queryResult(v));
                });
            };
            if (this.connected) run();
            else this._queue.push(run);
        });
    }
}
module.exports.CachedDataBase = CachedDataBase;