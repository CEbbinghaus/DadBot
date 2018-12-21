const {MongoClient} = require('mongodb');
const {EventEmitter} = require("events");
const {TrueType} = require("./utilities");

class DataBase extends EventEmitter{
    constructor(name, DBname = "Bots", url = 'localhost'){
        super();
        this.auth = process.env.DB_Auth;
        this.DataBaseName = DBname;
        this.name = name;
        this.url = url;
        this.client = 
        this.database;
        this.table;
        this.ready = false;
        this.init();
    }
    async init(){
        const user = encodeURIComponent('dave');
        const password = encodeURIComponent('abc123');
        const authMechanism = 'DEFAULT';
    
        // Connection URL
        const url = `mongodb://${user}:${password}@${url}:27017/?authMechanism=${authMechanism}`;
        MongoClient.connect(this.url, { useNewUrlParser: true },async (err, client) => {
            if(!client)throw "Missing Client Object. Could not Load Database";
            this.client = client;
            this.database = this.client.db(this.DataBaseName);
            this.table = this.database.collection(this.name);
            this.ready = true;
            this.emit("ready", this);
        });
    }
    async write(o, c){
        if(c && TrueType(c) == "function"){
            this.__Write(o, c);
        }else{
            return new Promise((res, rej) => {
                try{
                    this.__Write(o, res);
                }catch(err){
                    rej(err);
                }
            })
        }
    }
    async __Write(o, c){
        let type = TrueType(o)
        if(type != "array" && type != "object")throw "You can only Write a Object or an array of objects";
        if(!this.ready)await this.ready;
        if(type == "object")o = [o];
        this.emit("write", o);
        this.table.insertMany(o, (err, res) => {
            if(err)throw err;
            c(res);
        })
    }
    async read(o, c){
        if(c && TrueType(c) == "function"){
            this.__Read(o, c);
        }else{
            return new Promise((res, rej) => {
                try{
                    this.__Read(o, res);
                }catch(err){
                    rej(err);
                }
            })
        }
    }
    async __Read(o, c){
        this.table.find(o).toArray((err, r) => {
            if(err)throw err;
            this.emit("read", r);
            c(r);
        })
    }
    async delete(o, c){
        if(c && TrueType(c) == "function"){
            this.__Delete(o, c);
        }else{
            return new Promise((res, rej) => {
                try{
                    this.delete(o, res)
                }catch(err){
                    rej(err);
                }
            })
        }
    }
    async __Delete(o, c){
        this.emit("delete", o);
        this.table.deleteMany(o, () => {
            c();
        })
    }
    async update(f, o, c){
        if(c && TrueType(c) == "function"){
            this.__Update(f, o, c);
        }else{
            return new Promise((res, rej) => {
                try{
                    this.__Update(f, o, res);
                }catch(err){
                    rej(err);
                }
            })
        }
    }
    async __Update(f, o, c){
        this.table.updateMany(f, {$set: o}, (err, r) => {
            if(err)throw err;
            c(r);
        })
    }
    close(){
        this.client.close();
    }
}
module.exports.DataBase = DataBase;