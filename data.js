// Shared client-side data store for ChoriLight.
// Products, banners, payment methods and online orders live in localStorage —
// there is no shared backend for them yet (only the manual "Pedidos" sheet in
// /admin talks to the Google Apps Script). If ChoriLight grows past one
// browser/admin, this should move to a real database.

const LS_KEYS = {
  products: 'cl_products',
  banners: 'cl_banners',
  payments: 'cl_payments',
  onlineOrders: 'cl_online_orders',
  cart: 'cl_cart',
  subscribers: 'cl_subscribers'
};

const SEED_PRODUCTS = [
  {id:'p1', nombre:'Chorizo Artesanal Clásico', categoria:'Clásicos', precio:12000, stock:40, rating:4.8, resenas:34, img:''},
  {id:'p2', nombre:'Chorizo Picante Diablo', categoria:'Picantes', precio:13500, stock:25, rating:4.6, resenas:21, img:''},
  {id:'p3', nombre:'Chorizo Ahumado de Roble', categoria:'Ahumados', precio:15000, stock:18, rating:4.9, resenas:42, img:''},
  {id:'p4', nombre:'Chorizo de Pollo Finas Hierbas', categoria:'Especiales', precio:11000, stock:30, rating:4.5, resenas:15, img:''},
  {id:'p5', nombre:'Chorizo Santarrosano', categoria:'Clásicos', precio:12500, stock:0, rating:4.7, resenas:28, img:''},
  {id:'p6', nombre:'Chorizo Extra Picante Habanero', categoria:'Picantes', precio:14000, stock:12, rating:4.4, resenas:9, img:''}
];

const SEED_BANNERS = [
  {id:'b1', titulo:'Chorizos artesanales, directo a tu parrilla', subtitulo:'Hechos a mano todos los días', activo:true},
  {id:'b2', titulo:'2x1 en Chorizo Picante Diablo', subtitulo:'Solo esta semana', activo:true}
];

const SEED_PAYMENTS = [
  {id:'efectivo', nombre:'Efectivo', activo:true},
  {id:'nequi', nombre:'Nequi', activo:true},
  {id:'transferencia', nombre:'Transferencia bancaria', activo:true},
  {id:'tarjeta', nombre:'Tarjeta crédito/débito', activo:false}
];

function readLS(key, fallback){try{const raw=localStorage.getItem(key);if(!raw)return fallback;return JSON.parse(raw);}catch(e){return fallback;}}
function writeLS(key, value){localStorage.setItem(key, JSON.stringify(value));}

function getProducts(){return readLS(LS_KEYS.products, SEED_PRODUCTS);}
function saveProducts(list){writeLS(LS_KEYS.products, list);}

function getBanners(){return readLS(LS_KEYS.banners, SEED_BANNERS);}
function saveBanners(list){writeLS(LS_KEYS.banners, list);}

function getPayments(){return readLS(LS_KEYS.payments, SEED_PAYMENTS);}
function savePayments(list){writeLS(LS_KEYS.payments, list);}

function getOnlineOrders(){return readLS(LS_KEYS.onlineOrders, []);}
function saveOnlineOrders(list){writeLS(LS_KEYS.onlineOrders, list);}
function addOnlineOrder(order){const list=getOnlineOrders();list.unshift(order);saveOnlineOrders(list);return list;}

function getSubscribers(){return readLS(LS_KEYS.subscribers, []);}
function saveSubscribers(list){writeLS(LS_KEYS.subscribers, list);}
function addSubscriber(sub){const list=getSubscribers();list.unshift(sub);saveSubscribers(list);return list;}

function getCart(){return readLS(LS_KEYS.cart, []);}
function saveCart(cart){writeLS(LS_KEYS.cart, cart);}
function clearCart(){saveCart([]);}

function uid(prefix){return prefix+'_'+Math.random().toString(36).slice(2,9);}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function money(n){return '$'+Number(n||0).toLocaleString('es-CO');}

/* ---------- SVG icons (no emojis anywhere) ---------- */
function svgStar(filled){return `<svg viewBox="0 0 20 20" width="14" height="14" fill="${filled?'#e0a800':'none'}" stroke="#e0a800" stroke-width="1.2" style="vertical-align:-2px"><polygon points="10,1.5 12.6,7.2 19,7.8 14,12 15.5,18.3 10,15 4.5,18.3 6,12 1,7.8 7.4,7.2"/></svg>`;}
function starsHtml(rating){const full=Math.round(Number(rating)||0);let s='<span style="display:inline-flex;gap:1px">';for(let i=0;i<5;i++)s+=svgStar(i<full);return s+'</span>';}
function iconBag(size){return `<svg viewBox="0 0 24 24" width="${size||20}" height="${size||20}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`;}
function iconCart(size){return `<svg viewBox="0 0 24 24" width="${size||18}" height="${size||18}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`;}
function iconChart(size){return `<svg viewBox="0 0 24 24" width="${size||16}" height="${size||16}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`;}
function iconPackage(size){return `<svg viewBox="0 0 24 24" width="${size||16}" height="${size||16}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`;}
function iconImage(size,color){return `<svg viewBox="0 0 24 24" width="${size||16}" height="${size||16}" fill="none" stroke="${color||'currentColor'}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`;}
function iconCard(size){return `<svg viewBox="0 0 24 24" width="${size||16}" height="${size||16}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`;}
function iconClose(size){return `<svg viewBox="0 0 24 24" width="${size||18}" height="${size||18}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;}
function iconRefresh(size){return `<svg viewBox="0 0 24 24" width="${size||14}" height="${size||14}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`;}
function iconPlus(size){return `<svg viewBox="0 0 24 24" width="${size||14}" height="${size||14}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`;}
function iconMinus(size){return `<svg viewBox="0 0 24 24" width="${size||14}" height="${size||14}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>`;}
function iconUsers(size){return `<svg viewBox="0 0 24 24" width="${size||16}" height="${size||16}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;}
function iconDownload(size){return `<svg viewBox="0 0 24 24" width="${size||14}" height="${size||14}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;}
