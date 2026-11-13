// OrderBanao v1 — pure business functions. Amounts are always integer minor units.
export const STORAGE_KEY='orderbanao:v1';
export const MAX_BACKUP_BYTES=6*1024*1024;
export const MAX_ORDERS=4000;
export const MAX_CUSTOMERS=3000;
export const MAX_PAYMENTS=14000;
export const CURRENCIES=['PKR','INR','BDT','AED','USD'];
export const STATUSES=['Pending','Packed','Shipped','Delivered','Cancelled'];
export const uid=()=>globalThis.crypto?.randomUUID?.()||`id${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
export const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
export const esc=(v='')=>String(v).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
export const validId=v=>typeof v==='string'&&/^[\w-]{1,80}$/.test(v);
export const validDate=v=>{if(typeof v!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(v))return false;const d=new Date(`${v}T12:00:00Z`);return !Number.isNaN(+d)&&d.toISOString().slice(0,10)===v&&v>='2000-01-01'&&v<='2100-12-31';};
const str=(x,max)=>typeof x==='string'&&x.length<=max;
export function parseMoney(x){const s=String(x??'').trim();if(!/^(?:0|[1-9]\d{0,8})(?:\.\d{1,2})?$/.test(s))throw Error('Enter a valid amount (maximum 2 decimal places).');const [a,b='']=s.split('.');return Number(a)*100+Number((b+'00').slice(0,2));}
export const displayMoney=n=>(n/100).toFixed(2);
export function money(n,currency='PKR'){const sym={PKR:'Rs',INR:'₹',BDT:'৳',AED:'AED',USD:'$'}[currency]||currency;return `${sym} ${new Intl.NumberFormat('en-PK',{minimumFractionDigits:2,maximumFractionDigits:2}).format(n/100)}`;}
export const number=n=>new Intl.NumberFormat('en-PK').format(n);
export const freshState=()=>({version:1,revision:0,settings:{business:'My Business',currency:'PKR',theme:'light',language:'en',phone:'',address:'',nextOrder:1},customers:[],orders:[],payments:[]});
export function orderTotal(o){const sub=o.items.reduce((s,i)=>s+i.qty*i.unitPrice,0);return sub-o.discount+o.deliveryFee;}
export function orderPaid(state,id){return state.payments.filter(p=>p.orderId===id).reduce((n,p)=>n+p.amount,0);}
export function paymentStatus(state,o){if(o.status==='Cancelled')return 'Cancelled';const total=orderTotal(o),paid=orderPaid(state,o.id);return paid>=total?'Paid':paid===0?'Unpaid':'Partial';}
export function metrics(s){const active=s.orders.filter(o=>o.status!=='Cancelled');const sales=active.reduce((n,o)=>n+orderTotal(o),0);const collected=active.reduce((n,o)=>n+orderPaid(s,o.id),0);return {orders:active.length,customers:s.customers.length,sales,collected,due:sales-collected,pending:active.filter(o=>o.status!=='Delivered').length,delivered:active.filter(o=>o.status==='Delivered').length};}
export const sortedOrders=o=>o.slice().sort((a,b)=>b.date.localeCompare(a.date)||b.number-a.number);
export const sortedPayments=p=>p.slice().sort((a,b)=>b.date.localeCompare(a.date)||b.id.localeCompare(a.id));
export function validateState(x){
 if(!x||typeof x!=='object'||Array.isArray(x)||x.version!==1||!Number.isSafeInteger(x.revision)||x.revision<0)throw Error('Invalid or unsupported backup.');
 const s=x.settings;
 if(!s||!str(s.business,100)||!s.business.trim()||!str(s.phone,60)||!str(s.address,400)||!CURRENCIES.includes(s.currency)||!['light','dark'].includes(s.theme)||!['en','ur'].includes(s.language)||!Number.isSafeInteger(s.nextOrder)||s.nextOrder<1||s.nextOrder>1000000)throw Error('Invalid settings.');
 if(!Array.isArray(x.customers)||x.customers.length>MAX_CUSTOMERS||!Array.isArray(x.orders)||x.orders.length>MAX_ORDERS||!Array.isArray(x.payments)||x.payments.length>MAX_PAYMENTS)throw Error('Too many records in backup.');
 const customers=new Set();for(const c of x.customers){if(!c||!validId(c.id)||customers.has(c.id)||!str(c.name,100)||!c.name.trim()||!str(c.phone,60)||!str(c.address,400)||!str(c.note,500))throw Error('Invalid customer record.');customers.add(c.id);}
 const orders=new Map(),numbers=new Set();
 for(const o of x.orders){
  if(!o||!validId(o.id)||orders.has(o.id)||!customers.has(o.customerId)||!Number.isSafeInteger(o.number)||o.number<1||o.number>=s.nextOrder||numbers.has(o.number)||!validDate(o.date)||!STATUSES.includes(o.status)||!str(o.note,500)||!Array.isArray(o.items)||o.items.length<1||o.items.length>25||!Number.isSafeInteger(o.discount)||o.discount<0||!Number.isSafeInteger(o.deliveryFee)||o.deliveryFee<0)throw Error('Invalid order record.');
  let sub=0;for(const i of o.items){if(!i||!str(i.name,100)||!i.name.trim()||!Number.isInteger(i.qty)||i.qty<1||i.qty>99999||!Number.isSafeInteger(i.unitPrice)||i.unitPrice<0||i.unitPrice>99999999999)throw Error('Invalid order item.');sub+=i.qty*i.unitPrice;}
  if(!Number.isSafeInteger(sub)||o.discount>sub||o.deliveryFee>99999999999||orderTotal(o)>999999999999)throw Error('Invalid order total.');orders.set(o.id,o);numbers.add(o.number);
 }
 const payments=new Set(),totals=new Map();for(const p of x.payments){if(!p||!validId(p.id)||payments.has(p.id)||!orders.has(p.orderId)||!validDate(p.date)||!Number.isSafeInteger(p.amount)||p.amount<=0||p.amount>999999999999||!str(p.note,300))throw Error('Invalid payment record.');payments.add(p.id);totals.set(p.orderId,(totals.get(p.orderId)||0)+p.amount);}
 for(const [id,o] of orders){if((totals.get(id)||0)>orderTotal(o)||o.status==='Cancelled'&&(totals.get(id)||0)>0)throw Error('Payments exceed order total or cancelled order has payments.');}
 return JSON.parse(JSON.stringify(x));
}
function csvCell(v){let s=String(v??'');if(/^\s*[=+@-]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}
export const csv=rows=>'\uFEFF'+rows.map(r=>r.map(csvCell).join(',')).join('\r\n');
export function ordersCSV(s){const names=new Map(s.customers.map(c=>[c.id,c.name]));return csv([['Order','Date','Customer','Delivery Status','Payment Status','Order Total','Paid','Due','Currency','Notes'],...sortedOrders(s.orders).map(o=>[ `ORD-${String(o.number).padStart(5,'0')}`,o.date,names.get(o.customerId)||'',o.status,paymentStatus(s,o),displayMoney(orderTotal(o)),displayMoney(orderPaid(s,o.id)),displayMoney(Math.max(0,orderTotal(o)-orderPaid(s,o.id))),s.settings.currency,o.note])]);}
export function customersCSV(s){return csv([['Customer','Phone','Address','Notes'],...s.customers.map(c=>[c.name,c.phone,c.address,c.note])]);}
export function paymentsCSV(s){const om=new Map(s.orders.map(o=>[o.id,o]));return csv([['Order','Date','Amount','Currency','Note'],...sortedPayments(s.payments).map(p=>[`ORD-${String(om.get(p.orderId)?.number||0).padStart(5,'0')}`,p.date,displayMoney(p.amount),s.settings.currency,p.note])]);}
