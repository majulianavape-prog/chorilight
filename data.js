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
  cart: 'cl_cart'
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

function getCart(){return readLS(LS_KEYS.cart, []);}
function saveCart(cart){writeLS(LS_KEYS.cart, cart);}
function clearCart(){saveCart([]);}

function uid(prefix){return prefix+'_'+Math.random().toString(36).slice(2,9);}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function money(n){return '$'+Number(n||0).toLocaleString('es-CO');}
function starsHtml(rating){const full=Math.round(Number(rating)||0);let s='';for(let i=0;i<5;i++)s+=i<full?'★':'☆';return s;}
