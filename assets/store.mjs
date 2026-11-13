import {STORAGE_KEY,freshState,validateState} from './core.mjs';
export class Store {
 constructor(storage=localStorage){this.storage=storage;}
 read(){const raw=this.storage.getItem(STORAGE_KEY);if(!raw)return freshState();try{return validateState(JSON.parse(raw));}catch{throw Error('Saved records could not be opened. Do not clear this browser data until you have a backup.');}}
 write(s){const safe=validateState(s);this.storage.setItem(STORAGE_KEY,JSON.stringify(safe));return safe;}
 update(fn){const s=this.read();fn(s);s.revision++;return this.write(s);}
 restore(s){return this.write(validateState(s));}
}
