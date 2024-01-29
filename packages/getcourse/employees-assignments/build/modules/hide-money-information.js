(()=>{var n=new URL(window.location.href);var a={dealPages:["/pl/sales/deal","/pl/sales/control/payment"],traffic:["/pl/metrika/traffic","/pl/stat/channel/index","/pl/stat/charge/index","/pl/metrika/cohort/report"],statistic:["/user/control/user/statistic","/pl/sales/dealstat/index"],cms:{editor:["/pl/cms/page"]}},r=t=>t.some(c=>n.pathname.includes(c)),i=r(a.dealPages),s=r(a.traffic),l=r(a.statistic);var h=t=>{window.location.href=t},m=h;var d=t=>{let u=[s,s,l].some(e=>e),o=document.createElement("style");o.innerHTML=`
  .gc-account-user-submenu .menu-item-stat,
  .gc-account-user-submenu .menu-item-statistic {
    display: none !important;
  }
  `,document.head.appendChild(o),i&&(document.querySelectorAll(".stat-table").forEach(e=>e.remove()),[...document.querySelectorAll("button.btn")].filter(e=>e.textContent==="\u041F\u043E\u0441\u043C\u043E\u0442\u0440\u0435\u0442\u044C \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0443 \u043D\u0430 \u0433\u0440\u0430\u0444\u0438\u043A\u0435").forEach(e=>e.remove())),u&&m(t)},x=d;})();
