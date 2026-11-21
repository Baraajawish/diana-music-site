// Diana store: products, cart (localStorage), toast, quick view
// Stripe Payment Links — paste each product's link from the Stripe dashboard. Empty = demo mode.
const PAYMENT_LINKS={tee:'',hoodie:'',vinyl:'',poster:'',hat:''};
const PRODUCTS=[
 {id:'tee',n:'Album T-Shirt',p:35,sizes:['S','M','L','XL'],img:'tee',d:'Heavyweight black tee with the album art printed front and centre. 100% cotton, unisex fit.'},
 {id:'hoodie',n:'Debut Hoodie',p:65,sizes:['S','M','L','XL'],img:'hoodie',badge:['BEST SELLER',''],d:'Oversized fit with electric-blue embroidery. Brushed fleece inside — made for late studio nights.'},
 {id:'vinyl',n:'Limited Vinyl',p:30,sizes:null,img:'vinyl',badge:['LIMITED','dark'],d:'12" vinyl, hand-numbered edition of 500. Includes a lyric insert and a download code.'},
 {id:'poster',n:'Album Art Poster',p:20,sizes:null,img:'poster',d:'18×24" matte print of the album cover on heavy archival paper. Ships rolled in a tube.'},
 {id:'hat',n:'Classic Dad Hat',p:25,sizes:['One size'],img:'hat',d:'Washed cotton dad hat with embroidered DIANA logo and adjustable strap.'}];
const $=s=>document.querySelector(s);
let cart=[];try{cart=JSON.parse(localStorage.getItem('dianaCart')||'[]');}catch(e){cart=[];}
const save=()=>{try{localStorage.setItem('dianaCart',JSON.stringify(cart));}catch(e){}};
const money=v=>'$'+v.toFixed(2);
function count(){return cart.reduce((a,b)=>a+b.q,0);}
function renderBadge(pulse){const b=$('#badge');if(!b)return;b.textContent=count();b.style.display=count()?'grid':'none';if(pulse){b.classList.remove('pulse');void b.offsetWidth;b.classList.add('pulse');}}
function toast(msg){const t=$('#toast');t.textContent='✓ '+msg;t.classList.add('show');clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('show'),2000);}
function add(id,size){const P=PRODUCTS.find(x=>x.id===id);const ex=cart.find(x=>x.id===id&&x.s===size);if(ex)ex.q++;else cart.push({id,s:size,q:1});save();renderCart();renderBadge(true);toast(P.n+(size&&size!=='One size'?' ('+size+')':'')+' added to cart');}
function renderCart(){const box=$('#items');if(!box)return;
 if(!cart.length){box.innerHTML=`<div class="empty"><div class="ico">🛍️</div><p>Your cart is empty</p><button class="btn outline" onclick="closeCart();document.getElementById('shop')?.scrollIntoView({behavior:'smooth'})">Browse Merch</button></div>`;$('#subtotal').textContent=money(0);$('#checkout').disabled=true;return;}
 box.innerHTML=cart.map((c,i)=>{const P=PRODUCTS.find(x=>x.id===c.id);return `<div class="it"><img src="./images/${P.img}.jpg" alt="${P.n}"><div><div class="nm">${P.n}</div><div class="sz">${c.s?('Size: '+c.s):''}</div><div class="qty"><button aria-label="Decrease" onclick="qty(${i},-1)">−</button><span>${c.q}</span><button aria-label="Increase" onclick="qty(${i},1)">+</button><button class="rm" onclick="rm(${i})">Remove</button></div></div><b>${money(P.p*c.q)}</b></div>`;}).join('');
 $('#subtotal').textContent=money(cart.reduce((a,c)=>a+PRODUCTS.find(x=>x.id===c.id).p*c.q,0));$('#checkout').disabled=false;}
function qty(i,d){cart[i].q=Math.max(1,cart[i].q+d);save();renderCart();renderBadge();}
function rm(i){cart.splice(i,1);save();renderCart();renderBadge();}
function openCart(){$('#drawer').classList.add('open');$('#dbg').classList.add('open');}
function closeCart(){$('#drawer').classList.remove('open');$('#dbg').classList.remove('open');}
function checkout(){ // Option A: each product has its own Payment Link. With one item we go straight there; otherwise demo.
 const links=cart.map(c=>PAYMENT_LINKS[c.id]).filter(Boolean);
 if(cart.length===1&&links.length===1){location.href=links[0];return;}
 location.href='./thanks.html?demo=1';}
function buyNow(id,size){const l=PAYMENT_LINKS[id];if(l){window.open(l,'_blank','noopener');}else{cart=[{id,s:size,q:1}];save();location.href='./thanks.html?demo=1';}}
document.addEventListener('DOMContentLoaded',()=>{renderBadge();renderCart();$('#cartbtn')?.addEventListener('click',openCart);$('#dbg')?.addEventListener('click',closeCart);});
