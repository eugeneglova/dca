(this.webpackJsonpdca=this.webpackJsonpdca||[]).push([[0],{66:function(e,t,n){e.exports=n(77)},77:function(e,t,n){"use strict";n.r(t);var r=n(0),a=n.n(r),i=n(12),o=n.n(i),c=n(24),u=n(48),l=n.n(u),m=n(23),s=n.n(m),p=function(e){return e<1?6:e<1e3?2:e<1e4?1:0},d=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:p(e);return Math.floor(e*Math.pow(10,t))/Math.pow(10,t)},f=function(e,t){return d(e*t)},P=function(e,t,n,r){var a=(t-e)*n,i=t*Math.abs(n)*r;return d(a-i)},g=function(e,t,n){var r=P(e,t,n,0),a=function(e,t,n){var r=Math.abs(n);return n<0?Math.max(r*e,r*t,0):Math.max(r*e,0)}(e,t,n);return r&&0!==a?r/a*100:0},b=function(e,t,n,r){var a=function(e,t,n,r){return d((f(e,t)+f(n,r))/(t+r))}(e,t,n,r),i=d(t+r),o=P(a,n,i,.002),c=d(g(a,n,i));return{id:s.a.uniqueId(),price:a,amount:i,op:n,oa:r,pl:o,plp:c}},v=function(e,t){return d(parseFloat(e)+parseFloat(e)*(parseFloat(t)/100))},h=function(e,t,n,r){return d(e+n*e*t*Math.log10(1.3*(r+2)))},E=function(e,t,n){return d(e*t)},C=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:e.length-1;return e.reduce((function(e,n,r){if(r>t)return e;var a=s.a.isEmpty(e)?{price:0,amount:0}:e,i=a.price,o=a.amount;return b(i,o,parseFloat(n.op),parseFloat(n.oa))}),{})},O=function(e){for(var t=e.entryPrice,n=void 0===t?6046.3:t,r=e.entryAmount,a=void 0===r?.001:r,i=e.pricePercent,o=void 0===i?-10:i,c=e.xPrice,u=void 0===c?.009:c,l=e.xAmount,m=void 0===l?1.35:l,p=[],d=parseFloat(n),f=parseFloat(a),P=Math.sign(o),g=v(parseFloat(n),parseFloat(o));d*P<P*g;){p.push({id:s.a.uniqueId(),op:d,oa:f});var b=p.length-1;d=h(d,u,P,b),f=E(f,m)}return p},x=n(42),y=n(41),j=n(56),S=n(8),A=n(25),w=function(e){return e.id},M=function(e){var t=e.onClick,n=Object(j.a)(e,["onClick"]);return a.a.createElement(A.b.Cell,Object.assign({},n,{tabIndex:0,onFocus:t}))};var I=function(e){var t=e.rows,n=e.columns,i=e.onChange,o=void 0===i?function(){}:i,u=Object(r.useState)(t),l=Object(c.a)(u,2),m=l[0],s=l[1],p=Object(r.useState)([]),d=Object(c.a)(p,2),f=d[0],P=d[1];Object(r.useEffect)((function(){s(t)}),[t]);var g=function(e){var t,n=e.added,r=e.changed,a=e.deleted;if(n){var i=m.length>0?m[m.length-1].id+1:0;t=[].concat(Object(y.a)(m),Object(y.a)(n.map((function(e,t){return Object(x.a)({id:i+t},e)}))))}if(r&&(t=m.map((function(e){return r[e.id]?Object(x.a)({},e,{},r[e.id]):e}))),a){var c=new Set(a);t=m.filter((function(e){return!c.has(e.id)}))}s(t),o(t)};return a.a.createElement(A.a,{rows:m,columns:n,getRowId:w},a.a.createElement(S.c,{onCommitChanges:g,editingCells:f,onEditingCellsChange:P,addedRows:[],onAddedRowsChange:function(){return g({added:[{}]})}}),a.a.createElement(A.b,{cellComponent:M}),a.a.createElement(A.d,null),a.a.createElement(A.e,{selectTextOnEditStart:!0}),a.a.createElement(A.c,{showAddCommand:!0,showDeleteCommand:!0}))};var V=function(){var e=Object(r.useState)({id:"settings",symbol:"tBTCEUR",entryPrice:6046.3,entryAmount:.005,pricePercent:-10,xPrice:.011,xPositionAmount:0,xAmount:1.2}),t=Object(c.a)(e,2),n=t[0],i=t[1],o=Object(r.useState)(O(n)),u=Object(c.a)(o,2),m=u[0],p=u[1],b=Object(r.useState)(function(e){var t=C(e);return[{id:"exit1",price:t.price,amount:t.amount,exitPrice:v(t.price,1)},{id:"exit2",price:t.price,amount:t.amount,exitPrice:v(t.price,2)},{id:"exit3",price:t.price,amount:t.amount,exitPrice:v(t.price,3)}]}(m)),h=Object(c.a)(b,2),E=h[0],x=h[1];Object(r.useEffect)((function(){p(O(n))}),[n]);var y,j=[{name:"symbol",title:"Symbol"},{name:"entryPrice",title:"Entry Price"},{name:"entryAmount",title:"Entry Amount"},{name:"pricePercent",title:"Price Percent"},{name:"price",title:"Price",getCellValue:function(e){return v(e.entryPrice,e.pricePercent)}},{name:"xPrice",title:"x Price"},{name:"xAmount",title:"x Amount"}];return a.a.createElement("div",null,a.a.createElement("center",null,a.a.createElement("h3",null,"Settings")),a.a.createElement(I,{rows:[n],columns:j,onChange:function(e){return i(e[0])}}),a.a.createElement("center",null,a.a.createElement("h3",null,"Positions / Orders")),a.a.createElement("button",{onClick:function(){return p([])}},"Clear positions / orders"),a.a.createElement("button",{onClick:function(){var e=JSON.parse(prompt("copy(__state().data)"));if(e){var t=s.a.filter(e.positions,(function(e){return e.pair===n.symbol&&"ACTIVE"===e.status})).map((function(e){return{id:e.id,op:e.basePrice,oa:e.amount}})),r=s.a.filter(e.orders.all,(function(e){return e.symbol===n.symbol.slice(1)&&"ACTIVE"===e.status&&"LIMIT"===e.type&&Math.sign(e.amount)===Math.sign(n.entryAmount)})).map((function(e){return{id:e.id,op:e.price,oa:e.amount}}));p(t.concat(r))}}},"Import Data"),a.a.createElement("button",{onClick:function(){var e=function(e,t){return t.map((function(t){var n=t.op,r=t.oa,a={type:"LIMIT",symbol:e,flags:0,price:String(n),amount:String(r)};return"__dispatch("+JSON.stringify({type:"WS_REQUEST_SEND",meta:{isPublic:!1,throttle:!0},payload:JSON.stringify([0,"on",null,a])})+")"})).join("\n")}(n.symbol,m);console.log(e),l()(e)}},"Copy orders"),a.a.createElement(I,{rows:m,columns:(y=m,[{name:"price",title:"Pos Price",getCellValue:function(e){return C(y,y.indexOf(e)).price}},{name:"price diff",title:"Pos Price diff",getCellValue:function(e){var t=C(y,y.indexOf(e)-1).price,n=t-C(y,y.indexOf(e)).price,r=n/t*100;return"".concat(d(n||0)," (").concat(d(r||0,2),"%)")}},{name:"amount",title:"Pos Amount",getCellValue:function(e){return C(y,y.indexOf(e)).amount}},{name:"pc",title:"Pos Cost",getCellValue:function(e){var t=C(y,y.indexOf(e)),n=t.price,r=t.amount;return f(n,r)}},{name:"op",title:"Ord Price"},{name:"opp",title:"Ord Price diff",getCellValue:function(e){var t=(y[y.indexOf(e)-1]||{}).op,n=t-e.op,r=n/t*100;return"".concat(d(n||0)," (").concat(d(r||0,2),"%)")}},{name:"oa",title:"Ord Amount"},{name:"oc",title:"Ord Cost",getCellValue:function(e){return f(e.op,e.oa)}},{name:"pl",title:"P/L",getCellValue:function(e){var t=C(y,y.indexOf(e)),n=t.pl,r=t.plp;return"".concat(d(n,3)," (").concat(d(r,2),"%)")}}]),onChange:p}),a.a.createElement("center",null,a.a.createElement("h3",null,"Profit / Loss")),a.a.createElement(I,{rows:E,columns:[{name:"price",title:"Pos Price"},{name:"amount",title:"Pos Amount"},{name:"exitPrice",title:"Exit Price"},{name:"pl",title:"P/L",getCellValue:function(e){return P(e.price,e.exitPrice,e.amount,.002)}},{name:"plp",title:"P/L%",getCellValue:function(e){return d(g(e.price,e.exitPrice,e.amount))}}],onChange:x}))};o.a.render(a.a.createElement(a.a.StrictMode,null,a.a.createElement(V,null)),document.getElementById("root"))}},[[66,1,2]]]);
//# sourceMappingURL=main.189484ea.chunk.js.map