(()=>{var i=new URL(window.location.href),m=e=>new URL(e,i.origin),y=(e,t)=>m(e).searchParams.has(t),u=(e,t)=>m(e).searchParams.get(t),k=(e,t)=>!!u(e,t),f=e=>{let t=m(e);return new URLSearchParams(t.search)},O=(e,t=[])=>{let r=m(e),a=[...new URLSearchParams(r.search)].filter(([n])=>t.some(c=>n===c));return new URLSearchParams(a)},p=(e,t=[])=>{let r=m(e);return t.forEach(([o,a])=>{r.searchParams.set(o,a)}),r},T=(e,t=[])=>{let r=m(e);return[...typeof t=="string"?[t]:t].forEach(o=>{r.searchParams.delete(o)}),r};var L=["utm_source","utm_medium","utm_campaign","utm_content","utm_term"],M=["id"],x=["sb_id","sbid"],le=["page","show"],v={offerSettings:["/pl/sales/offer/update","/pl/sales/offer/create"],userDealsPage:["/sales/control/userProduct/my"],cms:{editor:["/pl/cms/page"]}},R=v.offerSettings.some(e=>i.pathname.includes(e)),_=v.userDealsPage.some(e=>i.pathname.includes(e)),q=v.cms.editor.some(e=>i.pathname.includes(e))||y(i.href,"editMode"),w=window.self!==window.top,D=le.some(e=>window?.controllerId===e),S="data-recode-value-set",I={full:!0,clean:!1},{isAdmin:de,isTeacher:me}=window.userInfo,W=de||me;var $={"location.href":"current-window","window.open":"new-window"},ue={"new-window":e=>window.open(e,"_blank"),"current-window":e=>{w?window.top.location.href=e:window.location.href=e}},P=(e,t)=>{let r=m(e),o=ue[t];o(r)},N=(e,t)=>{let r=document.createElement(e);return t&&r.classList.add(t),r},H=(e,t)=>x.some(o=>t===o)?k(e,t):!0;var z=e=>e.reduce((t,r)=>{if(r?.id&&(r?.type?.toLowerCase()==="user"||r?.type?.toLowerCase()==="deal")){let o=`formParams[${r.type.toLowerCase()}CustomFields][${r.id}]`;t.push({name:o,title:r.title,fieldSelector:`[name="${o}"]`,valueType:r.valueType,trigger:r.trigger})}return t},[]),j=e=>e.filter(({name:t})=>t.includes("userCustomFields")),G=e=>e.filter(({valueType:t,trigger:r})=>t==="param"&&r),B=e=>e.filter(({valueType:t,trigger:r})=>t==="cookie"&&r),X=e=>e.filter(({valueType:t,trigger:r})=>t==="other"&&r);var fe=e=>{let t=j(e),r=(s,d)=>{let l=document.createElement("input");return d&&l.setAttribute("data-field-title",d),l.setAttribute("name",s),l.setAttribute("type","hidden"),l},o=()=>{let s=N("div");return s.setAttribute("data-for","recode-analytic-fields"),s.setAttribute("data-author","recode studio (tg: @recode_solutions)"),s},a=(s,d)=>d.filter(({title:l,fieldSelector:h,trigger:g})=>!(s.querySelector(h)||s.querySelector(`[data-field-title="${l}"]`))&&H(i,g)),n=(s,d,l)=>{let h=a(s,l),g=o();h.forEach(({name:A,title:b})=>{g.appendChild(r(A,b)),s.querySelector(d)?s.querySelector(d).appendChild(g):s.appendChild(g)})};(()=>{document.querySelectorAll("form.lt-form").forEach(s=>{s.querySelector('[name="formParams[offer_id][]"]')||s.closest(".need-create-deal")||s.closest(".recode-form-create-deal")?n(s,".builder",e):n(s,".builder",t)})})()},Z=fe;var he={getValue:e=>{try{return decodeURIComponent(document.cookie.match(new RegExp(`(?:^|; )${e.replace(/([.$?*|{}()[]\\\/\+^])/g,"\\$1")}=([^;]*)`))[1])}catch{return}}},{getValue:ge}=he,E=ge;var pe=e=>{let t=`recode-${e}-`,r=n=>{let c=[...n.classList].find(s=>s.startsWith(t));return c?c.match(new RegExp(`${t}(.+)`))[1]:null},o=n=>{switch(e){case"value":return r(n);case"param":return u(i.href,r(n));case"cookie":return E(r(n));default:return null}};[...document.querySelectorAll(`[class*="${t}"]`)].filter(n=>[...n.classList].some(c=>c.startsWith(t))).forEach(n=>{let c=o(n);if(!c)return;let s=n.querySelector(".form-control");!s||!(s.tagName==="INPUT"||s.tagName==="TEXTAREA")||(s.value=c)})},U=pe;var J=document.referrer||"none",Se=y(i.href,"loc")?new URL(u(i.href,"loc")).href:i.href,K="user",Q=e=>{let t=m(e),r=O(t.href,["id"]);return r.toString()?`${t.origin}${t.pathname}?${r}`:`${t.origin}${t.pathname}`},Y=w?Q(i.href):"none",ee=()=>{let e={timeZone:"Europe/Moscow",day:"numeric",month:"numeric",year:"numeric"},t=new Date().toLocaleString("ru-RU",e),[r,o,a]=t.split(".").map(Number),n=r<10?`0${r}`:r,c=o<10?`0${o}`:o;return`${n}.${c}.${a}`},V=e=>{let t=new URL(w?Se:i.href),r=Q(t.href);return I[e]?t.href:r||"none"};var we=e=>{switch(e){case"referrer":return J;case"url_full":return V("full");case"url_clean":return V("clean");case"created_date":return ee();case"created_type":return K;case"widget_url":return Y;default:return null}},ye=(e,t)=>{switch(e){case"param":return u(i.href,t);case"cookie":return E(t);case"other":return we(t);default:return null}},Pe=e=>{let t=()=>{e.forEach(({fieldSelector:r,valueType:o,trigger:a})=>{document.querySelectorAll(`${r}:not([${S}])`).forEach(n=>{let c=n;c.value=ye(o,a)??"",c.setAttribute(S,"")})})};t(),setInterval(()=>{t()},1e3)},F=Pe;var Ee=e=>{let t=[{elementSelector:"a[href]",elementAttributeLink:"href"}],r=(a,n)=>{[...document.querySelectorAll(`${a}:not([${S}])`)].filter(c=>/^(https?:\/)?\/.+/i.test(c.getAttribute(n))).forEach(c=>{let s=c.getAttribute(n);L.filter(ce=>[...f(s).keys()].some(ie=>ce===ie)).length>e.length&&(s=T(s,L).href),s=p(s,e);let{href:l,origin:h,pathname:g,search:A,hash:b}=s;c.setAttribute(n,window.location.origin===h?`${g}${A}${b}`:l),c.setAttribute(S,"")})},o=()=>{t.forEach(({elementSelector:a,elementAttributeLink:n})=>r(a,n,e))};o(e),setInterval(()=>{o(e)},1e3)},te=Ee;var re=(e,t)=>{if(!e)throw new Error("RE-CODE STUDIO. \u041F\u043B\u0430\u0433\u0438\u043D gcModuleAnalytics. \u041D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D \u0430\u0434\u0440\u0435\u0441 \u0434\u043B\u044F \u0440\u0435\u0434\u0438\u0440\u0435\u043A\u0442\u0430");P(p(e,[...f(i.href)]).href,t)};var Ue=()=>{let e=".recode-transfer-params";document.querySelectorAll(e).forEach(t=>{let r=t.querySelector("button"),o=t.querySelector("script");if(!r||!o)return;let a=o.innerHTML.match(/(?:location\.href\s*=\s*['"]([^'"]+)['"]|window\.open\s*\(\s*['"]([^'"]+)['"])/);if(!a)return;let n={method:a[1]?$["location.href"]:$["window.open"],value:a[1]||a[2]||""},c=r.cloneNode(!0);r.parentNode.replaceChild(c,r),c.addEventListener("click",s=>{s.preventDefault(),P(p(n.value,[...f(i.href)]).href,n.method)})})},oe=Ue;var Fe=()=>{let e=o=>{let a=o;a.value=a.value.trim()},t=o=>{let a=document.createElement("p");return a.classList.add("warning"),a.style.cssText+="color: #cc3300;",o&&(a.innerHTML=o),a},r=()=>{let o=document.querySelector("#offer-code"),a=u(i.href,"id");if(!(o&&a)||o.value===a)return;let n=t();o.before(n),o.value?Number.isNaN(Number(o.value))?n.innerHTML=`
      \u041B\u0443\u0447\u0448\u0435 \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u0432 \u044D\u0442\u043E\u043C \u043F\u043E\u043B\u0435 ID \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u044F \u0438\u0437 URL \u2014 <strong>${a}</strong>. \u041D\u043E \u0441\u043D\u0430\u0447\u0430\u043B\u0430 \u043D\u0443\u0436\u043D\u043E \u0443\u0431\u0435\u0434\u0438\u0442\u044C\u0441\u044F, \u0447\u0442\u043E \u0434\u0430\u043D\u043D\u044B\u0439 \u0438\u0434\u0435\u043D\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u043E\u0440 \u043D\u0435 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u0442\u0441\u044F \u0433\u0434\u0435-\u0442\u043E \u0432 \u0434\u0440\u0443\u0433\u043E\u043C \u043C\u0435\u0441\u0442\u0435 \u043D\u0430 \u043F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u0435 \u0438\u043B\u0438 \u043F\u0440\u0438 \u0438\u043D\u0442\u0435\u0433\u0440\u0430\u0446\u0438\u0438 \u0441 API
      `:(n.innerHTML=`
      \u0423\u043D\u0438\u043A\u0430\u043B\u044C\u043D\u044B\u0439 \u0438\u0434\u0435\u043D\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u043E\u0440 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u044F \u0438\u0437\u043C\u0435\u043D\u0435\u043D c <strong>${o.value}</strong> \u043D\u0430 <strong>${a}</strong>. \u041D\u0435 \u0437\u0430\u0431\u0443\u0434\u044C\u0442\u0435 \u0441\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F
      `,o.value=a):(o.value=a,n.innerHTML="\u0423\u043D\u0438\u043A\u0430\u043B\u044C\u043D\u044B\u0439 \u0438\u0434\u0435\u043D\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u043E\u0440 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u044F \u0438\u0437\u043C\u0435\u043D\u0435\u043D. \u041D\u0435 \u0437\u0430\u0431\u0443\u0434\u044C\u0442\u0435 \u0441\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F")};document.querySelectorAll("#offer-title, #offer-code, #paramsobject-after_payment_redirect_url, #paramsobject-form_title").forEach(o=>{e(o),o.addEventListener("change",()=>e(o))}),r()},se=Fe;var Ce=(e,t)=>{if(W&&!t)return;let r=a=>{let n=document.querySelectorAll(".main-page-block > .container > table > tbody > tr"),c=a.toLowerCase();n.forEach(s=>{[...s.querySelectorAll("td")].find(h=>h.innerText.toLowerCase().includes(c))&&s.classList.add("hide")})};e.forEach(a=>r(a)),(()=>{let a=["\u041D\u0435\u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043D\u044B\u0435 \u0437\u0430\u043A\u0430\u0437\u044B","\u041A\u0443\u043F\u043B\u0435\u043D\u043D\u044B\u0435 \u043F\u0440\u043E\u0434\u0443\u043A\u0442\u044B","\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043D\u044B\u0435 \u0437\u0430\u043A\u0430\u0437\u044B"];[...document.querySelectorAll("h3")].filter(c=>a.some(s=>c.textContent.trim()===s)).forEach(c=>{let s=c.nextElementSibling;!s?.classList.contains("table")||[...s.querySelectorAll("tbody > tr")].some(l=>!l.classList.contains("hide"))||(s.classList.add("hide"),c.classList.add("hide"))})})()},ae=Ce;var Ae={redirectMode:"new-window",hideSystemOrders:{searchWords:["\u0422\u0435\u0441\u0442","\u0427\u0435\u043A\u0438\u043D","\u0417\u0430\u044F\u0432\u043A\u0430","\u0422\u0430\u0431\u043B\u0438\u0446\u0430","\u0412\u043E\u0440\u043E\u043D\u043A\u0430","\u0412\u0435\u0431\u0438\u043D\u0430\u0440","\u0422\u0435\u0445\u043D\u0438\u0447\u0435\u0441\u043A","\u0421\u0438\u0441\u0442\u0435\u043C\u043D\u044B\u0439","\u041F\u0440\u0435\u0434\u0441\u043F\u0438\u0441\u043E\u043A","\u041F\u0440\u0435\u0434\u0437\u0430\u043F\u0438\u0441\u044C","\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F","\u0410\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u044F","systemic_","[systemic]"],hideFromEmpoyees:!0}},C=Ae;var be=e=>({fields:e?.fields??[],redirectMode:e?.redirectMode||C.redirectMode,hideSystemOrders:{searchWords:e?.hideSystemOrders?.searchWords||C.hideSystemOrders.searchWords,hideFromEmpoyees:e?.hideSystemOrders?.hideFromEmpoyees||C.hideSystemOrders.hideFromEmpoyees}}),ne=be;window.recode={...window.recode||{},gcModuleAnalytics:{init(e={}){if(this.config)throw new Error("RE-CODE STUDIO. \u041F\u043B\u0430\u0433\u0438\u043D gcModuleAnalytics. \u041F\u043E\u0432\u0442\u043E\u0440\u043D\u0430\u044F \u0438\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u044F \u0444\u0443\u043D\u043A\u0446\u0438\u043E\u043D\u0430\u043B\u0430 \u043D\u0435\u0432\u043E\u0437\u043C\u043E\u0436\u043D\u0430");this.config=ne(e);let t=z(this.config.fields),r=G(t),o=B(t),a=X(t);Z(t),F(a),U("value"),oe(),document.cookie&&(U("cookie"),F(o));let n=f(i.href),c=[...n],s=[...n].filter(([d])=>!M.some(l=>l===d));c.length&&(U("param"),F(r)),!q&&D&&s.length&&te(s),R&&se(),_&&ae(this.config.hideSystemOrders.searchWords,this.config.hideSystemOrders.hideFromEmpoyees)},redirectWithSearchParams(e,t=this.config.redirectMode){re(e,t)}}};})();
