const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/EncyclopediaOverlay-BWmJIwdV.js","assets/game-core-CGxcHf3H.js","assets/three-DTigyTdQ.js"])))=>i.map(i=>d[i]);
import{g as Ct,T as I,a as nt,L as Pt,b as Ot,_ as it,c as H,d as X,P as N,u as Rt,C as It,S as kt,e as Dt,B as Lt,f as Ht,h as _t,A as Gt,i as xt,j as Ft,k as Nt,l as tt,m as zt,s as $t,n as jt}from"./game-core-CGxcHf3H.js";import{i as ot,g as rt,f as lt,h as ht,G as V,m as qt,M as Ut,n as Yt,a as w,j as P,l as gt,R as yt,o as O,p as ct,q as W,e as ut,P as dt,V as St,r as Zt}from"./three-DTigyTdQ.js";class mt{overlayEl=null;static COMPACT_HEIGHT_THRESHOLD=720;show(t){if(this.overlayEl)return;const e=document.getElementById("ui-overlay");if(!e)return;const s=this.isCompactHeight();this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-tutorial-overlay",""),this.overlayEl.style.cssText=`
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: ${s?"flex-start":"center"};
      background: rgba(0, 0, 32, 0.92);
      pointer-events: auto;
      z-index: 30;
      padding: ${s?"0.75rem":"1.25rem"};
      box-sizing: border-box;
    `;const i=document.createElement("div");i.setAttribute("data-tutorial-content",""),i.style.cssText=`
      width: min(960px, 100%);
      max-height: calc(100% - ${s?"0.5rem":"1rem"});
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow-y: auto;
      padding: ${s?"0.75rem 0.35rem 1rem":"0.5rem"};
      box-sizing: border-box;
    `;const a=document.createElement("div");a.setAttribute("data-tutorial-title",""),a.textContent="あそびかた",a.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${s?"1.8rem":"2.2rem"};
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
      margin-bottom: ${s?"0.9rem":"1.5rem"};
      text-align: center;
    `,i.appendChild(a);const o=document.createElement("div");o.style.cssText=`
      display: flex;
      gap: ${s?"0.8rem":"1.5rem"};
      flex-wrap: wrap;
      justify-content: center;
      width: 100%;
      max-width: 90%;
    `,o.appendChild(this.createCard("👆","ひだり・みぎ を タッチ","うちゅうせんが うごくよ","swipe 2s ease-in-out infinite",s)),o.appendChild(this.createCard("🚀","ブースト ボタン","はやく すすめるよ！","boostPulse 1.5s ease-in-out infinite",s)),o.appendChild(this.createCard("⭐","ほしを あつめて","ゴールを めざそう！","starGlow 3s linear infinite",s)),i.appendChild(o);const n=document.createElement("button");n.textContent="とじる",n.style.cssText=`
      margin-top: ${s?"0.9rem":"1.5rem"};
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${s?"1.15rem":"1.4rem"};
      font-weight: 700;
      padding: ${s?"0.7rem 2rem":"0.8rem 2.5rem"};
      border: none;
      border-radius: 2rem;
      background: linear-gradient(135deg, #FF6B6B, #FFE66D);
      color: #333;
      cursor: pointer;
      touch-action: manipulation;
      pointer-events: auto;
      box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
    `,n.addEventListener("pointerdown",h=>{h.stopPropagation(),t()}),i.appendChild(n),this.injectAnimations(),this.overlayEl.appendChild(i),e.appendChild(this.overlayEl)}hide(){this.overlayEl&&(this.overlayEl.remove(),this.overlayEl=null)}createCard(t,e,s,i,a){const o=document.createElement("div");o.setAttribute("data-tutorial-card",""),o.style.cssText=`
      background: rgba(255, 255, 255, 0.08);
      border-radius: 1.5rem;
      padding: ${a?"1rem 0.85rem":"1.5rem 1.2rem"};
      width: ${a?"150px":"180px"};
      text-align: center;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
    `;const n=document.createElement("div");n.textContent=t,n.style.cssText=`
      font-size: ${a?"2rem":"2.5rem"};
      margin-bottom: ${a?"0.55rem":"0.8rem"};
      animation: ${i};
    `;const h=document.createElement("div");h.textContent=e,h.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${a?"0.95rem":"1.1rem"};
      font-weight: 700;
      color: #fff;
      margin-bottom: 0.4rem;
    `;const l=document.createElement("div");return l.textContent=s,l.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${a?"0.8rem":"0.9rem"};
      color: rgba(255, 255, 255, 0.7);
    `,o.appendChild(n),o.appendChild(h),o.appendChild(l),o}isCompactHeight(){return window.innerHeight<=mt.COMPACT_HEIGHT_THRESHOLD}injectAnimations(){if(document.getElementById("tutorial-animations"))return;const t=document.createElement("style");t.id="tutorial-animations",t.textContent=`
      @keyframes swipe {
        0%, 100% { transform: translateX(-20px); }
        50% { transform: translateX(20px); }
      }
      @keyframes boostPulse {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      @keyframes starGlow {
        0% { transform: rotate(0deg); opacity: 0.7; }
        50% { transform: rotate(180deg); opacity: 1; }
        100% { transform: rotate(360deg); opacity: 0.7; }
      }
    `,document.head.appendChild(t)}}class Xt{overlayEl=null;activePressCleanups=new Set;show(t,e){if(this.overlayEl)return;const s=document.getElementById("ui-overlay");if(!s)return;this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-title-reset-confirm-overlay",""),this.overlayEl.setAttribute("role","dialog"),this.overlayEl.setAttribute("aria-modal","true"),this.overlayEl.setAttribute("aria-label","さいしょからに もどしますか"),this.overlayEl.style.cssText=`
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: auto;
      z-index: 55;
      padding: 1.5rem;
      background: rgba(0, 0, 32, 0.92);
    `;let i=!1;const a=()=>{i||(i=!0,this.hide(),e())},o=()=>{i||(i=!0,this.hide(),t())};this.overlayEl.addEventListener("pointerdown",p=>{p.target===this.overlayEl&&a()});const n=document.createElement("div");n.setAttribute("data-title-reset-confirm-card",""),n.style.cssText=`
      width: min(88vw, 26rem);
      padding: 1.6rem 1.4rem;
      border-radius: 1.7rem;
      background: rgba(0, 0, 64, 0.9);
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.42);
      text-align: center;
      color: #fff;
    `,n.addEventListener("pointerdown",p=>{p.stopPropagation()}),this.overlayEl.appendChild(n);const h=document.createElement("div");h.textContent="さいしょからに する？",h.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 1.7rem;
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 0 16px rgba(255, 215, 0, 0.45);
      margin-bottom: 0.8rem;
    `,n.appendChild(h);const l=document.createElement("div");l.textContent="いまの すすみぐあいだけ きえて、ステージ 1 から あそべるよ",l.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 1rem;
      font-weight: 700;
      line-height: 1.5;
      color: rgba(255, 255, 255, 0.92);
      margin-bottom: 1.2rem;
    `,n.appendChild(l);const c=document.createElement("div");c.style.cssText=`
      display: flex;
      gap: 0.8rem;
      justify-content: center;
      flex-wrap: wrap;
    `,n.appendChild(c);const u=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 1.1rem;
      font-weight: 900;
      min-width: 88px;
      min-height: 88px;
      padding: 0.9rem 1.2rem;
      border: none;
      border-radius: 1.5rem;
      cursor: pointer;
      touch-action: manipulation;
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.35);
      transform: scale(1);
      transition: transform 0.08s ease-out;
      white-space: nowrap;
    `,g=(p,C)=>{let E=!1,x=!1;const b=()=>{D(!0)},R=()=>{p.style.transform="scale(0.92)"},_=()=>{p.style.transform="scale(1)"},D=(S=!1)=>{E=!1,x=S,_(),this.activePressCleanups.delete(b),document.removeEventListener("pointerup",y,!0),document.removeEventListener("pointercancel",v,!0)},y=S=>{const G=S.target===p||S.target instanceof Node&&p.contains(S.target),Bt=E&&G;D(!G),Bt&&C()},v=()=>{D(!0)};p.addEventListener("pointerdown",S=>{S.stopPropagation(),E=!0,x=!1,R(),this.activePressCleanups.add(b),document.addEventListener("pointerup",y,!0),document.addEventListener("pointercancel",v,!0)}),p.addEventListener("pointerenter",()=>{E&&R()}),p.addEventListener("pointerleave",()=>{E&&_()}),p.addEventListener("pointercancel",()=>D(!0)),p.addEventListener("click",S=>{if(S.stopPropagation(),x){x=!1;return}E||C()})},m=document.createElement("button");m.setAttribute("data-title-reset-cancel",""),m.textContent="やめる",m.style.cssText=u,m.style.background="rgba(255, 255, 255, 0.18)",m.style.color="#ffffff",g(m,a),c.appendChild(m);const f=document.createElement("button");f.setAttribute("data-title-reset-confirm",""),f.textContent="うん！ さいしょから",f.style.cssText=u,f.style.background="linear-gradient(135deg, #FF9F68, #FFE66D)",f.style.color="#3b1f00",g(f,o),c.appendChild(f),s.appendChild(this.overlayEl)}hide(){if(!this.overlayEl)return;const t=Array.from(this.activePressCleanups);this.activePressCleanups.clear();for(const e of t)e();this.overlayEl.remove(),this.overlayEl=null}}function pt(r){const t=r.topRem??.8,e=window.innerHeight<=500,s=document.createElement("button");let i=r.initialMuted;const a=()=>{s.textContent=i?"🔇":"🔊",s.setAttribute("aria-label",i?"サウンド オフ":"サウンド オン")};s.setAttribute("data-mute-button",""),s.style.position="absolute",s.style.top=`${t}rem`,s.style.right="1rem",s.style.fontSize=e?"clamp(1.1rem, 3.5vmin, 1.4rem)":"clamp(1.4rem, 4vmin, 1.8rem)",s.style.background="rgba(255, 255, 255, 0.15)",s.style.border="none",s.style.borderRadius="50%",s.style.width=e?"2.4rem":"3rem",s.style.height=e?"2.4rem":"3rem",s.style.display="flex",s.style.alignItems="center",s.style.justifyContent="center",s.style.cursor="pointer",s.style.pointerEvents="auto",s.style.touchAction="manipulation",s.style.transform="scale(1)",s.style.transition="transform 0.08s ease-out",a();const o=()=>{s.style.transform="scale(1)"};return s.addEventListener("pointerdown",n=>{n.stopPropagation(),s.style.transform="scale(0.9)",r.onToggle()}),s.addEventListener("pointerup",o),s.addEventListener("pointercancel",o),s.addEventListener("pointerleave",o),r.container.appendChild(s),{element:s,setMuted(n){i=n,a()},remove(){s.remove()}}}class Vt{overlay=null;toggleButton=null;descriptionEl=null;highContrast=!1;show(t){const e=document.getElementById("ui-overlay");if(e){if(this.highContrast=t.initialHighContrast,!this.overlay){this.overlay=document.createElement("div"),this.overlay.setAttribute("data-color-accessibility-settings",""),this.overlay.style.cssText=`
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.5rem;
        background: rgba(2, 8, 28, 0.76);
        backdrop-filter: blur(8px);
        z-index: 24;
      `;const s=document.createElement("div");s.style.cssText=`
        width: min(88vw, 28rem);
        padding: 1.25rem;
        border-radius: 1.5rem;
        background: rgba(15, 23, 58, 0.96);
        border: 3px solid rgba(255, 255, 255, 0.95);
        box-shadow: 0 20px 48px rgba(0, 0, 0, 0.35);
        color: #fff;
        font-family: 'Zen Maru Gothic', sans-serif;
        text-align: center;
      `;const i=document.createElement("h2");i.textContent="いろのせってい",i.style.cssText="margin: 0 0 0.65rem; font-size: clamp(1.25rem, 4.6vmin, 1.7rem);",this.descriptionEl=document.createElement("p"),this.descriptionEl.style.cssText="margin: 0 0 1rem; font-size: clamp(0.95rem, 3.4vmin, 1.05rem); line-height: 1.55;",this.toggleButton=document.createElement("button"),this.toggleButton.setAttribute("data-color-accessibility-toggle",""),this.toggleButton.style.cssText=`
        display: block;
        width: 100%;
        margin-bottom: 0.75rem;
        padding: 0.9rem 1rem;
        border-radius: 999px;
        border: 3px solid #fff;
        background: linear-gradient(135deg, #fff27a, #76f0ff);
        color: #102040;
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: clamp(1rem, 3.8vmin, 1.2rem);
        font-weight: 900;
        cursor: pointer;
        touch-action: manipulation;
      `,this.toggleButton.addEventListener("click",()=>{this.highContrast=!this.highContrast,this.render(),t.onToggle(this.highContrast)});const a=document.createElement("button");a.textContent="とじる",a.style.cssText=`
        width: 100%;
        padding: 0.8rem 1rem;
        border-radius: 999px;
        border: 2px solid rgba(255, 255, 255, 0.55);
        background: rgba(255, 255, 255, 0.12);
        color: #fff;
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: clamp(0.95rem, 3.6vmin, 1.1rem);
        font-weight: 700;
        cursor: pointer;
        touch-action: manipulation;
      `,a.addEventListener("click",()=>this.hide()),s.appendChild(i),s.appendChild(this.descriptionEl),s.appendChild(this.toggleButton),s.appendChild(a),this.overlay.appendChild(s)}this.render(),e.appendChild(this.overlay)}}hide(){this.overlay?.remove()}isVisible(){return this.overlay?.isConnected===!0}render(){!this.toggleButton||!this.descriptionEl||(this.descriptionEl.textContent=this.highContrast?"いろだけじゃなく ふちや しまもようで わかりやすくしているよ。":"いろだけでなく かたちや うごきでも みわけられるようにするよ。",this.toggleButton.textContent=this.highContrast?"みやすくする: ON":"みやすくする: OFF",this.toggleButton.setAttribute("aria-pressed",this.highContrast?"true":"false"))}}function bt(r,t){if(!Number.isFinite(r)||r<=0||t<=0)return"ずかん";const e=Math.min(r,t);return e>=t?`ずかん ${t} / ${t} 🎉`:`ずかん ${e} / ${t}`}function k(r,t){let e=!1,s=!1,i=null,a=null;const o=t.documentTarget??document,n=t.stopPropagation??!0,h=()=>{t.canActivate?.()!==!1&&t.onActivate()},l=y=>{t.onPressChange?.(y)},c=y=>{const v=y;return typeof v.clientX=="number"&&typeof v.clientY=="number"?{x:v.clientX,y:v.clientY}:null},u=y=>{const v=y;return typeof v.pointerId=="number"?v.pointerId:null},g=y=>{const v=u(y);return i===null||v===null||v===i},m=y=>{if(!e||a===null||t.moveTolerancePx===void 0)return!1;const v=c(y);return v===null?!1:Math.hypot(v.x-a.x,v.y-a.y)>t.moveTolerancePx},f=y=>{e=!1,s=y,i=null,a=null,l(!1),o.removeEventListener("pointermove",E,!0),o.removeEventListener("pointerup",p,!0),o.removeEventListener("pointercancel",C,!0)},p=y=>{if(!e||!g(y))return;if(m(y)){f(!0);return}const v=y.target,S=v===r||v instanceof Node&&r.contains(v),G=e&&S;f(G||!S),G&&h()},C=()=>{f(!0)},E=y=>{!e||!g(y)||m(y)&&f(!0)},x=y=>{t.canActivate?.()!==!1&&((t.preventDefaultOnPointerDown??!1)&&y.preventDefault(),n&&y.stopPropagation(),e=!0,s=!1,i=u(y),a=c(y),l(!0),t.moveTolerancePx!==void 0&&o.addEventListener("pointermove",E,!0),o.addEventListener("pointerup",p,!0),o.addEventListener("pointercancel",C,!0))},b=()=>{e&&l(!0)},R=()=>{e&&l(!1)},_=()=>{f(!0)},D=y=>{if(n&&y.stopPropagation(),(t.preventDefaultOnClick??!1)&&y.preventDefault(),s){s=!1;return}e||h()};return r.addEventListener("pointerdown",x),r.addEventListener("pointerenter",b),r.addEventListener("pointerleave",R),r.addEventListener("pointercancel",_),r.addEventListener("click",D),()=>{f(!1),r.removeEventListener("pointerdown",x),r.removeEventListener("pointerenter",b),r.removeEventListener("pointerleave",R),r.removeEventListener("pointercancel",_),r.removeEventListener("click",D)}}function Wt(r){switch(r){case"hero":return{gap:"0.35rem",label:"0.92rem",medal:"1.7rem",hint:"0.98rem"};case"compact":return{gap:"0.18rem",label:"0.7rem",medal:"1rem",hint:"0.76rem"};default:return{gap:"0.26rem",label:"0.8rem",medal:"1.25rem",hint:"0.84rem"}}}function at(r,t,e={}){const s=Ct(r,t),i=e.size??"regular",a=Wt(i),o=document.createElement("div");if(o.setAttribute("data-stage-medal-display",""),o.setAttribute("data-stage-medal-stage",String(r)),o.setAttribute("data-stage-medal-tier",s.tier),o.setAttribute("data-stage-medal-earned",String(s.earnedCount)),e.scope&&o.setAttribute("data-stage-medal-scope",e.scope),o.style.cssText=`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${a.gap};
  `,e.label){const c=document.createElement("div");c.textContent=e.label,c.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${a.label};
      font-weight: 700;
      color: rgba(255, 255, 255, 0.84);
      letter-spacing: 0.06em;
    `,o.appendChild(c)}const n=document.createElement("div");n.style.cssText=`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${a.gap};
  `;for(const c of s.slots){const u=document.createElement("span");u.setAttribute("data-stage-medal-slot",c.tier),u.setAttribute("data-stage-medal-threshold",String(c.threshold)),u.setAttribute("data-stage-medal-reached",String(c.reached)),u.textContent=c.icon,u.style.cssText=`
      font-size: ${a.medal};
      line-height: 1;
      filter: ${c.reached?"drop-shadow(0 0 10px rgba(255, 215, 0, 0.45))":"none"};
      opacity: ${c.reached?"1":"0.3"};
      transform: ${c.reached?"scale(1)":"scale(0.92)"};
    `,n.appendChild(u)}o.appendChild(n);const h=e.hint??(s.nextThreshold===null?"かんぺき！":`つぎ ⭐ ${s.nextThreshold}`),l=document.createElement("div");return l.setAttribute("data-stage-medal-hint",""),l.textContent=h,l.style.cssText=`
    font-family: 'Zen Maru Gothic', sans-serif;
    font-size: ${a.hint};
    font-weight: 700;
    color: ${s.nextThreshold===null?"#FFE66D":"rgba(255, 255, 255, 0.86)"};
  `,o.appendChild(l),o}const vt=2e3,Q=new Map,K=new Map,J=new Map;let U=null,Y=null;function Z(r,t){if(typeof document>"u"){const s=typeof OffscreenCanvas=="function",i=s?new OffscreenCanvas(r,t):{width:r,height:t};return{canvas:i,ctx:s?i.getContext("2d"):null}}const e=document.createElement("canvas");return e.width=r,e.height=t,{canvas:e,ctx:e.getContext("2d")}}function F(r,t){let e=Q.get(r);return e||(e=t(),e.generateMipmaps=!1,e.minFilter=Yt,e.needsUpdate=!0,Q.set(r,e)),e}function A(r,t){let e=K.get(r);return e||(e=t(),K.set(r,e)),e}function T(r,t){let e=J.get(r);return e||(e=t(),J.set(r,e)),e}function M(r,t){const e=new Ut(r,t);return e.userData.sharedAssets=!0,e}function wt(){if(!U){const r=new rt,t=new Float32Array(vt*3);for(let e=0;e<vt*3;e+=3)t[e]=(Math.random()-.5)*200,t[e+1]=(Math.random()-.5)*200,t[e+2]=(Math.random()-.5)*400;r.setAttribute("position",new lt(t,3)),U=r}Y||(Y=new ht({color:16777215,size:.2,sizeAttenuation:!0}))}function Qt(){const{canvas:r,ctx:t}=Z(256,256);if(!t)return new O(r);t.fillStyle="#888888",t.fillRect(0,0,256,256);for(let e=0;e<30;e++){const s=Math.random()*256,i=Math.random()*256,a=3+Math.random()*12;t.beginPath(),t.arc(s,i,a,0,Math.PI*2),t.fillStyle=`rgba(60,60,60,${.3+Math.random()*.4})`,t.fill()}return new O(r)}function Kt(){const{canvas:r,ctx:t}=Z(256,256);if(!t)return new O(r);t.fillStyle="#ddaa44",t.fillRect(0,0,256,256);for(let e=0;e<8;e++){t.beginPath();const s=128+(Math.random()-.5)*100,i=128+(Math.random()-.5)*100;t.strokeStyle=`rgba(200,150,60,${.3+Math.random()*.3})`,t.lineWidth=3+Math.random()*5;for(let a=0;a<Math.PI*4;a+=.1){const o=10+a*8;t.lineTo(s+Math.cos(a)*o,i+Math.sin(a)*o)}t.stroke()}return new O(r)}function Jt(){const{canvas:r,ctx:t}=Z(256,256);if(!t)return new O(r);const e=["#cc7733","#dd9955","#bb6622","#eebb77","#aa5511","#ddaa66"];for(let s=0;s<256;s++){const i=Math.floor(s/(256/e.length))%e.length;t.fillStyle=e[i],t.fillRect(0,s,256,1)}return new O(r)}function te(){const{canvas:r,ctx:t}=Z(512,256);return t?(t.fillStyle="#2266aa",t.fillRect(0,0,512,256),t.fillStyle="#886644",t.beginPath(),t.ellipse(300,80,80,40,.2,0,Math.PI*2),t.fill(),t.beginPath(),t.ellipse(280,150,30,50,.1,0,Math.PI*2),t.fill(),t.beginPath(),t.ellipse(100,90,25,60,.3,0,Math.PI*2),t.fill(),t.beginPath(),t.ellipse(110,170,20,40,-.2,0,Math.PI*2),t.fill(),t.beginPath(),t.ellipse(420,170,25,15,0,0,Math.PI*2),t.fill(),t.fillStyle="#447733",t.beginPath(),t.ellipse(290,75,40,20,.3,0,Math.PI*2),t.fill(),t.beginPath(),t.ellipse(95,85,15,30,.2,0,Math.PI*2),t.fill(),new O(r)):new O(r)}function ee(){const{canvas:r,ctx:t}=Z(512,256);if(!t)return new O(r);t.clearRect(0,0,512,256),t.fillStyle="rgba(255,255,255,0.6)";for(let e=0;e<20;e++){const s=Math.random()*512,i=Math.random()*256;t.beginPath(),t.ellipse(s,i,20+Math.random()*40,8+Math.random()*15,Math.random()*Math.PI,0,Math.PI*2),t.fill()}return new O(r)}function se(){Q.clear(),K.clear(),J.clear(),U=null,Y=null}const ie={planetTextureCache:Q,planetGeometryCache:K,planetMaterialCache:J,getBgStarsGeometry:()=>U,getBgStarsMaterial:()=>Y};function At(r,t,e){const s=new V;let i=null;switch(r){case 2:{const a=F("mercury",Qt),o=A("mercury:sphere",()=>new P(10,24,24)),n=T("mercury:mat",()=>new w({map:a})),h=M(o,n);s.add(h),i=h;break}case 3:{const a=F("venus",Kt),o=A("venus:sphere",()=>new P(14,24,24)),n=T("venus:mat",()=>new w({map:a})),h=M(o,n);s.add(h),i=h;break}case 5:{const a=F("jupiter",Jt),o=A("jupiter:sphere",()=>new P(20,24,24)),n=T("jupiter:mat",()=>new w({map:a})),h=M(o,n);s.add(h),i=h;break}case 6:{const a=A("saturn:sphere",()=>new P(15,24,24)),o=t.planetColor,n=T(`saturn:mat:${o}`,()=>new w({color:o})),h=M(a,n);s.add(h);const l=A("saturn:ring",()=>new yt(20,30,48)),c=T("saturn:ringMat",()=>new w({color:15645542,side:gt})),u=M(l,c);u.rotation.x=Math.PI/3,s.add(u),i=h;break}case 7:{const a=A("uranus:sphere",()=>new P(16,24,24)),o=T("uranus:mat",()=>new w({color:6737117})),n=M(a,o);s.add(n);const h=A("uranus:ring",()=>new yt(21,28,48)),l=T("uranus:ringMat",()=>new w({color:10083822,side:gt})),c=M(h,l);c.rotation.z=Math.PI/2,s.add(c),i=n;break}case 9:{const a=A("pluto:sphere",()=>new P(8,24,24)),o=T("pluto:mat",()=>new w({color:12298922})),n=M(a,o);s.add(n),i=n;break}case 10:{const a=A("sun:sphere",()=>new P(25,24,24)),o=T("sun:mat",()=>new w({color:16763904,emissive:16755200,emissiveIntensity:.5})),n=M(a,o);s.add(n),s.add(new qt(16763904,2,200)),i=n;break}case 11:{const a=F("earth",te),o=A("earth:sphere",()=>new P(15,32,32)),n=T("earth:mat",()=>new w({map:a})),h=F("earth:cloud",ee),l=A("earth:cloudSphere",()=>new P(15.5,32,32)),c=T("earth:cloudMat",()=>new w({map:h,transparent:!0,opacity:.3})),u=new V;u.add(M(o,n)),u.add(M(l,c)),s.add(u),i=u;break}default:{const a=A("default:sphere",()=>new P(15,24,24)),o=t.planetColor,n=T(`default:mat:${o}`,()=>new w({color:o})),h=M(a,n);s.add(h),i=h;break}}return s.position.set(0,0,e),{planet:s,spinTarget:i}}function ae(r,t,e){return At(r,t,e)}function ne(r){wt();const t=new ot(U,Y);return t.userData.sharedAssets=!0,t.geometry.setDrawRange(0,r),t}function ft(r){!Number.isInteger(r)||r<1||r>I||typeof document>"u"&&typeof OffscreenCanvas!="function"||(wt(),At(r,nt(r),0))}let z=null,$=null;function oe(){if(!z){const r=new rt,t=new Float32Array(3e3);for(let e=0;e<3e3;e++)t[e]=(Math.random()-.5)*200;r.setAttribute("position",new lt(t,3)),z=r}return z}function re(){return $||($=new ht({color:16777215,size:.3,sizeAttenuation:!0})),$}function le(){z=null,$=null}const he={getBgStarsGeometry:()=>z,getBgStarsMaterial:()=>$};function ce(r){const t=window.requestIdleCallback;if(typeof t=="function"){t(r,{timeout:1500});return}window.setTimeout(r,800)}function Tt(r){return new Set(r.filter(t=>Number.isInteger(t)&&t>=1&&t<=I)).size}function ue(r){return Tt(r)>=I}function et(r){const t=ue(r.unlockedPlanets),e=t?1:Math.min(r.clearedStage+1,I),s=nt(e),i=r.bestStageStars?.[e]??0;return t?{startStage:e,destination:s.destinationReading,emoji:s.emoji,statusLabel:"ぜんぶ あつめたよ！",destinationLabel:`${s.destinationReading}へ もういちど しゅっぱつ！`,buttonHint:`${s.emoji} ステージ ${e} から もういちど あそぶ`,bestStars:i}:{startStage:e,destination:s.destinationReading,emoji:s.emoji,statusLabel:r.clearedStage>0?"つづきから しゅっぱつ！":"はじめての しゅっぱつ！",destinationLabel:`${s.destinationReading}へ むかおう！`,buttonHint:`${s.emoji} ステージ ${e} から スタート`,bestStars:i}}function de(r){return r.clearedStage>0||Tt(r.unlockedPlanets)>0||Object.keys(r.bestStageStars??{}).length>0}class me{threeScene;ambientLight=new ct(16777215,1);camera;lastAspect=0;sceneManager;saveManager;audioManager;stars=null;companionParade=null;overlay=null;muteHandle=null;tutorialOverlay=new mt;titleResetConfirmOverlay=new Xt;colorAccessibilitySettings=new Vt;encyclopediaOverlay=null;encyclopediaOverlayPromise=null;companionFactory=null;companionFactoryPromise=null;loadEncyclopediaOverlay;loadTitleCompanionFactory;loadingOverlay;loadFailureOverlay;scheduleIdleTask;encyclopediaBtn=null;isOpeningEncyclopedia=!1;isActive=!1;encyclopediaRequestToken=0;companionParadeRequestToken=0;bgmPending=!1;overlayButtonCleanups=new Set;constructor(t,e,s,i={}){this.sceneManager=t,this.saveManager=e,this.audioManager=s,this.loadingOverlay=i.loadingOverlay??new Pt,this.loadFailureOverlay=i.loadFailureOverlay??new Ot,this.scheduleIdleTask=i.scheduleIdleTask??ce,this.loadEncyclopediaOverlay=i.loadEncyclopediaOverlay??(()=>it(()=>import("./EncyclopediaOverlay-BWmJIwdV.js"),__vite__mapDeps([0,1,2]))),this.loadTitleCompanionFactory=i.loadTitleCompanionFactory??(()=>it(()=>import("./game-core-CGxcHf3H.js").then(n=>n.v),__vite__mapDeps([1,2]))),this.threeScene=new W,this.threeScene.background=new ut(32);const{width:a,height:o}=H();this.camera=new dt(60,a/o,.1,1e3),this.camera.position.set(0,0,5)}enter(t){this.isActive=!0,this.encyclopediaRequestToken+=1,this.companionParadeRequestToken+=1,this.lastAspect=0,this.stars=new ot(oe(),re()),this.stars.userData.sharedAssets=!0,this.stars.rotation.set(0,0,0),this.threeScene.add(this.stars),this.ambientLight.parent||this.threeScene.add(this.ambientLight);const e=this.saveManager.load();this.createCompanionParade(e.unlockedPlanets),this.createOverlay(),this.createMuteButton(),this.prefetchEncyclopediaOnIdle(),this.prewarmNextAdventureOnIdle(et(e).startStage),this.audioManager.isInitialized()?(this.audioManager.playBGM(0),this.bgmPending=!1):this.bgmPending=!0,e.tutorialShown||this.tutorialOverlay.show(()=>{this.ensureTitleAudioInitialized(!0),this.tutorialOverlay.hide(),this.saveManager.markTutorialShown()})}createMuteButton(){const t=document.getElementById("hud")??document.getElementById("ui-overlay");t&&(this.muteHandle=pt({initialMuted:this.audioManager.isMuted(),container:t,onToggle:()=>{this.ensureTitleAudioInitialized(!0);const e=this.audioManager.toggleMute();this.muteHandle?.setMuted(e);const s=this.saveManager.load();s.muted=e,this.saveManager.save(s)}}))}getEncyclopediaOverlay(){return this.encyclopediaOverlay?Promise.resolve(this.encyclopediaOverlay):this.encyclopediaOverlayPromise?this.encyclopediaOverlayPromise:(this.encyclopediaOverlayPromise=this.loadEncyclopediaOverlay().then(({EncyclopediaOverlay:t})=>{const e=new t;return this.encyclopediaOverlay=e,e}).finally(()=>{this.encyclopediaOverlayPromise=null}),this.encyclopediaOverlayPromise)}getTitleCompanionFactory(){return this.companionFactory?Promise.resolve(this.companionFactory):this.companionFactoryPromise?this.companionFactoryPromise:(this.companionFactoryPromise=this.loadTitleCompanionFactory().then(t=>(this.companionFactory=t,t)).finally(()=>{this.companionFactoryPromise=null}),this.companionFactoryPromise)}showEncyclopedia(){if(!this.isActive||!this.encyclopediaOverlay)return;const t=this.saveManager.load();this.encyclopediaOverlay.show(t.unlockedPlanets,()=>this.refreshEncyclopediaButtonLabel(),e=>{this.ensureTitleAudioInitialized(!1),this.sceneManager.requestTransition("stage",{stageNumber:e,totalScore:0,totalStarCount:0,launchSource:"encyclopedia"})},t.bestStageStars??{})}isCurrentEncyclopediaRequest(t){return this.isActive&&this.encyclopediaRequestToken===t}prefetchEncyclopediaOnIdle(){const t=this.encyclopediaRequestToken;this.scheduleIdleTask(()=>{!this.isCurrentEncyclopediaRequest(t)||this.encyclopediaOverlay||this.encyclopediaOverlayPromise||this.getEncyclopediaOverlay().catch(()=>{})})}prewarmNextAdventureOnIdle(t){if(t>I)return;const e=this.encyclopediaRequestToken;this.scheduleIdleTask(()=>{this.isCurrentEncyclopediaRequest(e)&&ft(t)})}async openEncyclopedia(){if(!this.isActive)return;if(this.loadFailureOverlay.hide(),this.encyclopediaOverlay){this.showEncyclopedia();return}if(this.isOpeningEncyclopedia)return;const t=this.encyclopediaRequestToken;this.isOpeningEncyclopedia=!0,this.loadingOverlay.show("ずかんを よんでるよ...");try{if(await this.getEncyclopediaOverlay(),!this.isCurrentEncyclopediaRequest(t))return;this.loadingOverlay.hide(),this.showEncyclopedia()}catch(e){if(!this.isCurrentEncyclopediaRequest(t))return;this.loadingOverlay.hide(),console.error("Failed to load encyclopedia overlay",e),this.loadFailureOverlay.show({title:"ずかんの じゅんびが できなかったよ",message:"「もういちど よむ」を おしてね",primaryAction:{label:"もういちど よむ",onSelect:()=>this.openEncyclopedia()}})}finally{this.encyclopediaRequestToken===t&&(this.isOpeningEncyclopedia=!1)}}persistHighContrastSetting(t){const e=this.saveManager.load();t?e.colorAccessibility={highContrast:!0}:delete e.colorAccessibility,this.saveManager.save(e)}createOverlay(){const t=document.getElementById("ui-overlay");if(!t)return;const e=this.saveManager.load(),s=et(e);this.overlay=document.createElement("div"),this.overlay.style.cssText=`
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      pointer-events: auto;
    `;const i=window.innerHeight<=500,a=document.createElement("div");a.textContent="うちゅうの たび",a.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${i?"2rem":"3rem"};
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
      margin-bottom: ${i?"0.6rem":"2rem"};
    `;const o=document.createElement("div");o.setAttribute("data-next-adventure-card",""),o.setAttribute("data-next-stage-number",String(s.startStage)),o.setAttribute("data-next-stage-destination",s.destination),o.style.cssText=`
      width: min(${i?"60vw":"70vw"}, ${i?"18rem":"26rem"});
      padding: ${i?"0.5rem 0.8rem":"1rem 1.4rem"};
      margin-bottom: ${i?"0.6rem":"1.25rem"};
      border-radius: ${i?"1rem":"1.5rem"};
      background: rgba(255, 255, 255, 0.14);
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.22);
      backdrop-filter: blur(6px);
      text-align: center;
      color: #fff;
    `;const n=document.createElement("div");n.textContent="つぎの ぼうけん",n.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${i?"0.8rem":"1rem"};
      font-weight: 700;
      color: #FFE66D;
      margin-bottom: ${i?"0.15rem":"0.35rem"};
    `;const h=document.createElement("div");h.textContent=s.statusLabel,h.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${i?"1rem":"1.25rem"};
      font-weight: 900;
      margin-bottom: ${i?"0.15rem":"0.35rem"};
    `;const l=document.createElement("div");l.textContent=`${s.emoji} ステージ ${s.startStage} ・ ${s.destination}`,l.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${i?"1.05rem":"1.35rem"};
      font-weight: 700;
      margin-bottom: 0.25rem;
    `;const c=document.createElement("div");c.textContent=s.destinationLabel,c.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${i?"0.85rem":"1rem"};
      font-weight: 700;
      color: rgba(255, 255, 255, 0.92);
    `;const u=Ct(s.startStage,s.bestStars),g=at(s.startStage,s.bestStars,{label:"メダル",hint:u.nextThreshold===null?"かんぺき！":`${u.icon} いま ・ つぎ ⭐ ${u.nextThreshold}`,size:"regular",scope:"title-next-adventure"});g.style.marginTop="0.7rem",o.appendChild(n),o.appendChild(h),o.appendChild(l),o.appendChild(c),o.appendChild(g);const m=document.createElement("div");m.style.cssText=`
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.65rem;
    `;const f=document.createElement("button");f.textContent="あそぶ",f.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${i?"1.4rem":"2rem"};
      font-weight: 700;
      padding: ${i?"0.6rem 2rem":"1rem 3rem"};
      border: none;
      border-radius: 2rem;
      background: linear-gradient(135deg, #FF6B6B, #FFE66D);
      color: #333;
      cursor: pointer;
      touch-action: manipulation;
      box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
      transform: scale(1);
      transition: transform 0.08s ease-out;
    `,this.overlayButtonCleanups.add(k(f,{onActivate:()=>{this.ensureTitleAudioInitialized(!1);const b=this.saveManager.load(),R=et(b).startStage;this.sceneManager.requestTransition("stage",{stageNumber:R,totalScore:0,totalStarCount:0,launchSource:"campaign"})},onPressChange:b=>{f.style.transform=b?"scale(0.96)":"scale(1)"}}));const p=document.createElement("div");p.setAttribute("data-play-button-hint",""),p.textContent=s.buttonHint,p.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${i?"0.85rem":"1rem"};
      font-weight: 700;
      color: rgba(255, 255, 255, 0.88);
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
    `;const C=document.createElement("button");C.textContent="あそびかた",C.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${i?"0.95rem":"1.2rem"};
      font-weight: 700;
      padding: ${i?"0.4rem 1rem":"0.6rem 1.5rem"};
      border: none;
      border-radius: 1.5rem;
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
      cursor: pointer;
      touch-action: manipulation;
      position: absolute;
      bottom: ${i?"1rem":"2rem"};
      right: ${i?"1rem":"2rem"};
      transform: scale(1);
      transition: transform 0.08s ease-out;
    `,C.style.position="absolute",C.style.bottom=i?"1rem":"2rem",C.style.right=i?"1rem":"2rem",this.overlayButtonCleanups.add(k(C,{onActivate:()=>{this.ensureTitleAudioInitialized(!0),this.tutorialOverlay.show(()=>{this.ensureTitleAudioInitialized(!0),this.tutorialOverlay.hide()})},onPressChange:b=>{C.style.transform=b?"scale(0.96)":"scale(1)"}}));const E=document.createElement("button");E.setAttribute("data-color-settings-button",""),E.textContent="いろのせってい",E.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${i?"0.95rem":"1.15rem"};
      font-weight: 700;
      padding: ${i?"0.4rem 1rem":"0.6rem 1.4rem"};
      border: 3px solid rgba(255, 255, 255, 0.92);
      border-radius: 1.5rem;
      background: rgba(8, 16, 52, 0.72);
      color: #fff;
      cursor: pointer;
      touch-action: manipulation;
      position: absolute;
      bottom: ${i?"1rem":"2rem"};
      left: 50%;
      transform: translateX(-50%) scale(1);
      transition: transform 0.08s ease-out;
      white-space: nowrap;
    `,this.overlayButtonCleanups.add(k(E,{onActivate:()=>{this.ensureTitleAudioInitialized(!0),this.colorAccessibilitySettings.show({initialHighContrast:this.saveManager.load().colorAccessibility?.highContrast===!0,onToggle:b=>this.persistHighContrastSetting(b)})},onPressChange:b=>{E.style.transform=b?"translateX(-50%) scale(0.96)":"translateX(-50%) scale(1)"}}));const x=document.createElement("button");if(x.textContent=bt(e.unlockedPlanets.length,N.length),x.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${i?"0.95rem":"1.2rem"};
      font-weight: 700;
      padding: ${i?"0.4rem 1rem":"0.6rem 1.5rem"};
      border: none;
      border-radius: 1.5rem;
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
      cursor: pointer;
      touch-action: manipulation;
      white-space: nowrap;
      position: absolute;
      bottom: ${i?"1rem":"2rem"};
      left: ${i?"1rem":"2rem"};
      transform: scale(1);
      transition: transform 0.08s ease-out;
    `,x.style.position="absolute",x.style.bottom=i?"1rem":"2rem",x.style.left=i?"1rem":"2rem",this.encyclopediaBtn=x,this.overlayButtonCleanups.add(k(x,{onActivate:()=>{this.ensureTitleAudioInitialized(!0),this.openEncyclopedia()},onPressChange:b=>{x.style.transform=b?"scale(0.96)":"scale(1)"}})),m.appendChild(f),m.appendChild(p),de(e)){const b=document.createElement("button");b.setAttribute("data-reset-progress-button",""),b.textContent="さいしょから",b.style.cssText=`
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: 1.15rem;
        font-weight: 900;
        padding: 0.8rem 1.8rem;
        border: 2px solid rgba(255, 230, 109, 0.65);
        border-radius: 1.5rem;
        background: rgba(0, 0, 64, 0.32);
        color: #fff;
        cursor: pointer;
        touch-action: manipulation;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.24);
      `,b.addEventListener("pointerdown",R=>{R.stopPropagation(),this.ensureTitleAudioInitialized(!0),this.titleResetConfirmOverlay.show(()=>{this.saveManager.resetProgressPreservingSettings(),this.startCampaign(1)},()=>{})}),m.appendChild(b)}this.overlay.appendChild(a),this.overlay.appendChild(o),this.overlay.appendChild(m),this.overlay.appendChild(C),this.overlay.appendChild(E),this.overlay.appendChild(x),t.appendChild(this.overlay),this.overlay.addEventListener("pointerdown",()=>{this.ensureTitleAudioInitialized(!0)},{once:!0})}ensureTitleAudioInitialized(t){!this.bgmPending&&this.audioManager.isInitialized()||(this.audioManager.initSync(),t&&this.bgmPending&&this.audioManager.playBGM(0),this.bgmPending=!1)}startCampaign(t){this.sceneManager.requestTransition("stage",{stageNumber:t,totalScore:0,totalStarCount:0,launchSource:"campaign"})}refreshEncyclopediaButtonLabel(){if(!this.encyclopediaBtn)return;const t=this.saveManager.load();this.encyclopediaBtn.textContent=bt(t.unlockedPlanets.length,N.length)}async createCompanionParade(t){this.clearCompanionParade();const e=[...new Set(t)].reduce((h,l)=>{const c=X(l);return c&&h.push(c),h},[]);if(e.length===0)return;const s=this.encyclopediaRequestToken,{createCompanionMesh:i}=await this.getTitleCompanionFactory();if(!this.isActive||this.encyclopediaRequestToken!==s)return;const a=new V;a.name="title-companion-parade",a.position.set(0,1.35,-1.2),a.rotation.x=-.12;const o=Math.min(2.1,1.1+e.length*.18),n=Math.min(.45,.18+e.length*.02);e.forEach((h,l)=>{const c=i(h),u=l/e.length*Math.PI*2;c.position.set(Math.cos(u)*o,Math.sin(u)*n,Math.sin(u)*o*.45),c.rotation.y=Math.PI*.15-u,c.scale.setScalar(.6),a.add(c)}),this.companionParade=a,this.threeScene.add(a)}clearCompanionParade(){this.companionParade&&(this.companionParade.parent?.remove(this.companionParade),this.companionParade=null)}update(t){this.stars&&(this.stars.rotation.y+=t*.05),this.companionParade&&(this.companionParade.rotation.y+=t*.35)}exit(){this.isActive=!1,this.encyclopediaRequestToken+=1,this.companionParadeRequestToken+=1,this.isOpeningEncyclopedia=!1,this.tutorialOverlay.hide(),this.titleResetConfirmOverlay.hide(),this.colorAccessibilitySettings.hide(),this.encyclopediaOverlay?.hide(),this.loadingOverlay.hide(),this.loadFailureOverlay.hide(),this.audioManager.stopBGM(),this.bgmPending=!1,this.clearCompanionParade(),this.stars&&(this.stars.parent?.remove(this.stars),this.stars=null),this.clearCompanionParade();const t=Array.from(this.overlayButtonCleanups);this.overlayButtonCleanups.clear();for(const e of t)e();this.overlay&&(this.overlay.remove(),this.overlay=null),this.encyclopediaBtn=null,this.muteHandle&&(this.muteHandle.remove(),this.muteHandle=null)}getThreeScene(){return this.threeScene}getCamera(){const{width:t,height:e}=H(),s=t/e;return s!==this.lastAspect&&Number.isFinite(s)&&s>0&&(this.camera.aspect=s,this.camera.updateProjectionMatrix(),this.lastAspect=s),this.camera}}const Oe=Object.freeze(Object.defineProperty({__proto__:null,TitleScene:me,__resetTitleSceneSharedAssetsForTest:le,__titleSceneSharedAssetsForTest:he},Symbol.toStringTag,{value:"Module"}));class pe{overlayEl=null;activePressCleanups=new Set;show(t,e){if(this.overlayEl)return;const s=document.getElementById("ui-overlay");if(!s)return;this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-home-confirm-overlay",""),this.overlayEl.setAttribute("role","dialog"),this.overlayEl.setAttribute("aria-modal","true"),this.overlayEl.setAttribute("aria-label","ホームへ もどりますか"),this.overlayEl.style.cssText=`
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      pointer-events: auto;
      z-index: 60;
    `,this.overlayEl.style.background="rgba(0, 0, 32, 0.92)";let i=!1;const a=()=>{i||(i=!0,this.hide(),e())},o=()=>{i||(i=!0,this.hide(),t())};this.overlayEl.addEventListener("pointerdown",f=>{f.target===this.overlayEl&&a()});const n=document.createElement("div");n.setAttribute("data-home-confirm-card",""),n.style.cssText=`
      display: flex;
      flex-direction: column;
      align-items: center;
      background: rgba(0, 0, 64, 0.85);
      border-radius: 1.6rem;
      padding: 1.6rem 1.4rem;
      max-width: min(90vw, 420px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45);
    `,n.addEventListener("pointerdown",f=>{f.stopPropagation()}),this.overlayEl.appendChild(n);const h=document.createElement("div");h.textContent="タイトルへ もどる？",h.style.cssText=`
      font-size: 1.8rem;
      font-weight: 900;
      text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
      margin-bottom: 1.2rem;
      text-align: center;
      padding: 0 0.6rem;
      white-space: nowrap;
    `,h.style.fontFamily="'Zen Maru Gothic', sans-serif",h.style.color="#FFD700",n.appendChild(h);const l=document.createElement("div");l.style.cssText=`
      display: flex;
      flex-direction: row;
      gap: 1rem;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
    `,n.appendChild(l);const c=`
      font-size: clamp(1.1rem, 3.6vmin, 1.4rem);
      font-weight: 900;
      padding: 1rem 1.4rem;
      border: none;
      border-radius: 1.6rem;
      cursor: pointer;
      pointer-events: auto;
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.35);
      transform: scale(1);
      transition: transform 0.08s ease-out;
      white-space: nowrap;
    `,u=(f,p)=>{const C=k(f,{onActivate:p,onPressChange:E=>{f.style.transform=E?"scale(0.9)":"scale(1)"}});this.activePressCleanups.add(C)},g=document.createElement("button");g.setAttribute("data-home-confirm-back",""),g.setAttribute("aria-label","タイトルへ もどる"),g.textContent="🏠 タイトルへ もどる",g.style.cssText=c,g.style.fontFamily="'Zen Maru Gothic', sans-serif",g.style.background="rgba(255, 255, 255, 0.18)",g.style.color="#ffffff",g.style.minWidth="88px",g.style.minHeight="88px",g.style.touchAction="manipulation",g.style.transform="scale(1)",g.style.transition="transform 0.08s ease-out",g.style.whiteSpace="nowrap",u(g,o),l.appendChild(g);const m=document.createElement("button");m.setAttribute("data-home-confirm-continue",""),m.setAttribute("aria-label","つづける"),m.textContent="✋ つづける",m.style.cssText=c,m.style.fontFamily="'Zen Maru Gothic', sans-serif",m.style.background="linear-gradient(135deg, #FF6B6B, #FFE66D)",m.style.color="#FFD700",m.style.textShadow="0 1px 2px rgba(0, 0, 32, 0.6)",m.style.minWidth="88px",m.style.minHeight="88px",m.style.touchAction="manipulation",m.style.transform="scale(1)",m.style.transition="transform 0.08s ease-out",m.style.whiteSpace="nowrap",u(m,a),l.appendChild(m),s.appendChild(this.overlayEl)}hide(){if(this.overlayEl){const t=Array.from(this.activePressCleanups);this.activePressCleanups.clear();for(const e of t)e();this.overlayEl.remove(),this.overlayEl=null}}isVisible(){return this.overlayEl!==null}}class Mt{overlayEl=null;activePressCleanups=new Set;show(t,e){if(this.overlayEl)return;const s=document.getElementById("ui-overlay")??document.body;this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-pause-overlay",""),this.overlayEl.setAttribute("role","dialog"),this.overlayEl.setAttribute("aria-modal","true"),this.overlayEl.setAttribute("aria-label","やすみちゅう"),this.overlayEl.style.cssText=`
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: auto;
      z-index: 60;
      background: rgba(0, 0, 32, 0.92);
    `;const i=document.createElement("div");i.setAttribute("data-pause-card",""),i.style.cssText=`
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      width: min(90vw, 420px);
      padding: 1.6rem 1.4rem;
      border-radius: 1.8rem;
      background: rgba(0, 0, 64, 0.85);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45);
      text-align: center;
      font-family: 'Zen Maru Gothic', sans-serif;
    `,i.addEventListener("pointerdown",l=>{l.stopPropagation()}),this.overlayEl.appendChild(i);const a=document.createElement("div");a.textContent="ひとやすみ ちゅう",a.style.cssText=`
      font-size: clamp(1.8rem, 5vmin, 2.4rem);
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
    `,i.appendChild(a);const o=document.createElement("div");o.textContent="また じゅんびが できたら つづけよう",o.style.cssText=`
      font-size: clamp(1rem, 3.5vmin, 1.2rem);
      font-weight: 700;
      color: #ffffff;
      opacity: 0.92;
    `,i.appendChild(o);const n=document.createElement("div");n.style.cssText=`
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      justify-content: center;
      align-items: stretch;
      width: 100%;
    `,i.appendChild(n);const h=(l,c,u,g,m,f)=>{const p=document.createElement("button");p.setAttribute(c,""),p.setAttribute("aria-label",u),p.textContent=l,p.style.cssText=`
        flex: 1 1 140px;
        padding: 1rem 1.2rem;
        border: none;
        border-radius: 1.6rem;
        background: ${g};
        color: ${m};
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: clamp(1.1rem, 3.6vmin, 1.4rem);
        font-weight: 900;
        cursor: pointer;
        touch-action: manipulation;
        box-shadow: 0 4px 18px rgba(0, 0, 0, 0.35);
        transform: scale(1);
        transition: transform 0.08s ease-out;
        white-space: nowrap;
      `,p.style.minWidth="140px",p.style.minHeight="88px";const C=k(p,{onActivate:()=>{this.hide(),f()},onPressChange:E=>{p.style.transform=E?"scale(0.94)":"scale(1)"}});return this.activePressCleanups.add(C),p};n.appendChild(h("▶ つづける","data-pause-continue","つづける","linear-gradient(135deg, #FF6B6B, #FFE66D)","#1b1f52",t)),n.appendChild(h("🏠 おうちへ","data-pause-home","おうちへ","rgba(255, 255, 255, 0.18)","#ffffff",e)),s.appendChild(this.overlayEl)}hide(){if(!this.overlayEl)return;const t=Array.from(this.activePressCleanups);this.activePressCleanups.clear();for(const e of t)e();this.overlayEl.remove(),this.overlayEl=null}dispose(){this.hide()}isVisible(){return this.overlayEl!==null}}class fe{pendingTimeouts=new Set;container=null;stageNameEl=null;assistMessageEl=null;politeLiveRegionEl=null;assertiveLiveRegionEl=null;scoreEl=null;starCountEl=null;bestStarContainerEl=null;bestStarCountEl=null;boostButton=null;boostHintEl=null;homeButton=null;pauseButton=null;homeConfirmOverlay=new pe;pauseOverlay=new Mt;muteButton=null;muteHandle=null;cooldownContainer=null;cooldownBar=null;stageProgressContainer=null;stageProgressTrack=null;stageProgressFill=null;stageProgressGoalEl=null;onBoostCallback=null;onBoostDeniedCallback=null;onHomeCallback=null;onHomeConfirmOpenCallback=null;onHomeConfirmCancelCallback=null;onPauseCallback=null;onPauseOpenCallback=null;onPauseResumeCallback=null;onMuteCallback=null;muted=!1;highContrastMode=!1;boostLocked=!1;pauseEnabled=!0;pauseButtonCleanup=null;lastCooldownProgress=1;lastCooldownPct=-1;lastReadyState=null;lastStageProgressPct=-1;lastStageProgressComplete=null;lastScore=-1;lastStarCount=-1;bestStarCount=0;lastBestStarCount=-1;bestStarPulsed=!1;liveRegionWriteNonce=0;lastAnnouncedProgressThreshold=0;show(t,e){const s=document.getElementById("hud");if(!s)return;s.style.zIndex="10";const i=window.innerHeight<=500;this.homeButton=document.createElement("button"),this.homeButton.textContent="🏠",this.homeButton.setAttribute("aria-label","ホームへ もどる"),this.homeButton.style.position="absolute",this.homeButton.style.top="0.8rem",this.homeButton.style.left="1rem",this.homeButton.style.fontSize=i?"clamp(1.1rem, 3.5vmin, 1.4rem)":"clamp(1.4rem, 4vmin, 1.8rem)",this.homeButton.style.background="rgba(255, 255, 255, 0.15)",this.homeButton.style.border="none",this.homeButton.style.borderRadius="50%",this.homeButton.style.width=i?"2.4rem":"3rem",this.homeButton.style.height=i?"2.4rem":"3rem",this.homeButton.style.display="flex",this.homeButton.style.alignItems="center",this.homeButton.style.justifyContent="center",this.homeButton.style.cursor="pointer",this.homeButton.style.pointerEvents="auto",this.homeButton.style.touchAction="manipulation",this.homeButton.style.transform="scale(1)",this.homeButton.style.transition="transform 0.08s ease-out";const a=()=>{this.homeButton&&(this.homeButton.style.transform="scale(1)")};this.homeButton.addEventListener("pointerdown",h=>{h.stopPropagation(),this.homeButton&&(this.homeButton.style.transform="scale(0.9)"),!this.homeConfirmOverlay.isVisible()&&document.getElementById("ui-overlay")&&(this.onHomeConfirmOpenCallback?.(),this.homeConfirmOverlay.show(()=>this.onHomeCallback?.(),()=>this.onHomeConfirmCancelCallback?.()))}),this.homeButton.addEventListener("pointerup",a),this.homeButton.addEventListener("pointercancel",a),this.homeButton.addEventListener("pointerleave",a),s.appendChild(this.homeButton),t&&(this.stageNameEl=document.createElement("div"),this.stageNameEl.textContent=t,this.stageNameEl.style.cssText=`
        text-align: center;
        font-family: 'Zen Maru Gothic', sans-serif;
        color: #FFD700;
        font-size: ${i?"1.1rem":"1.5rem"};
        font-weight: 700;
        padding: ${i?"0.25rem":"0.5rem"};
        pointer-events: none;
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);
      `,s.appendChild(this.stageNameEl)),this.createPauseButton(),this.assistMessageEl=document.createElement("div"),this.assistMessageEl.setAttribute("data-hud-assist-message",""),this.assistMessageEl.setAttribute("aria-hidden","true"),this.assistMessageEl.style.cssText=`
      display: none;
      margin: 0 auto 0.5rem;
      width: fit-content;
      max-width: min(88vw, 560px);
      padding: 0.35rem 0.9rem;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.14);
      color: #fff7bf;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(0.95rem, 3.2vmin, 1.15rem);
      font-weight: 700;
      text-align: center;
      pointer-events: none;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.16);
    `,s.appendChild(this.assistMessageEl),this.createStageProgress(s,e),this.container=document.createElement("div"),this.container.style.cssText=`
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: ${i?"0.4rem 1rem":"1rem 2rem"};
      font-family: 'Zen Maru Gothic', sans-serif;
      color: #fff;
      font-size: ${i?"1.1rem":"1.4rem"};
      font-weight: 700;
      pointer-events: none;
    `;const o=document.createElement("div");this.scoreEl=document.createElement("span"),o.textContent="スコア: ",this.scoreEl.textContent="0",o.appendChild(this.scoreEl);const n=document.createElement("div");n.textContent="⭐ ",this.starCountEl=document.createElement("span"),this.starCountEl.textContent="0",n.appendChild(this.starCountEl),this.bestStarContainerEl=document.createElement("span"),this.bestStarContainerEl.setAttribute("data-hud-best-star",""),this.bestStarContainerEl.style.cssText=`
      margin-left: 0.6rem;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 0.6em;
      font-weight: 700;
      color: #9ec5ff;
      opacity: 0.7;
      display: none;
      vertical-align: middle;
      transform-origin: center;
    `,this.bestStarContainerEl.textContent="ベスト ⭐",this.bestStarCountEl=document.createElement("span"),this.bestStarCountEl.textContent="0",this.bestStarContainerEl.appendChild(this.bestStarCountEl),n.appendChild(this.bestStarContainerEl),this.container.appendChild(o),this.container.appendChild(n),s.appendChild(this.container),this.createBoostButton(),this.createMuteButton(),this.applyColorAccessibilityState(),this.createLiveRegions(s)}createStageProgress(t,e){const s=this.toCssColor(e??16766720),i=document.createElement("div");i.setAttribute("data-stage-progress-container",""),i.setAttribute("role","progressbar"),i.setAttribute("aria-label","ゴールまでの すすみ"),i.setAttribute("aria-valuemin","0"),i.setAttribute("aria-valuemax","100"),i.setAttribute("aria-valuenow","0"),i.setAttribute("aria-valuetext","ゴールまで あと 100%"),i.style.position="relative",i.style.display="flex",i.style.alignItems="center",i.style.justifyContent="center",i.style.gap="0.4rem",i.style.margin="0 auto 0.4rem",i.style.width=window.innerHeight<=500?"clamp(100px, 24vmin, 180px)":"clamp(160px, 32vmin, 280px)",i.style.pointerEvents="none",i.style.fontFamily="'Zen Maru Gothic', sans-serif";const a=document.createElement("div");a.setAttribute("data-stage-progress-ship",""),a.textContent="🚀",a.style.fontSize="clamp(0.9rem, 2.4vmin, 1.1rem)",a.style.lineHeight="1",a.style.pointerEvents="none";const o=document.createElement("div");o.setAttribute("data-stage-progress-track",""),o.style.flex="1",o.style.height="14px",o.style.background=this.highContrastMode?"rgba(6, 12, 28, 0.94)":"rgba(255, 255, 255, 0.18)",o.style.borderRadius="7px",o.style.overflow="hidden",o.style.boxShadow="inset 0 2px 6px rgba(0, 0, 0, 0.35)",o.style.border=this.highContrastMode?"3px solid rgba(255, 255, 255, 0.92)":"none";const n=document.createElement("div");n.setAttribute("data-stage-progress-fill",""),n.style.height="100%",n.style.width="0%",n.style.borderRadius="7px",n.style.background=this.highContrastMode?`repeating-linear-gradient(90deg, #ffffff 0 10px, #00ddff 10px 18px, ${s} 18px 30px)`:`linear-gradient(90deg, #00ddff, ${s})`,n.style.transition="width 0.15s linear",n.setAttribute("data-stage-progress-color",s),o.appendChild(n);const h=document.createElement("div");h.setAttribute("data-stage-progress-goal",""),h.textContent="🪐",h.style.fontSize="clamp(0.9rem, 2.4vmin, 1.1rem)",h.style.lineHeight="1",h.style.pointerEvents="none",h.style.textShadow=`0 0 8px ${s}`,i.appendChild(a),i.appendChild(o),i.appendChild(h),t.appendChild(i),this.stageProgressContainer=i,this.stageProgressTrack=o,this.stageProgressFill=n,this.stageProgressGoalEl=h}toCssColor(t){return`#${Math.max(0,Math.min(16777215,Math.floor(t))).toString(16).padStart(6,"0")}`}createMuteButton(){const t=document.getElementById("hud");t&&(this.muteHandle=pt({initialMuted:this.muted,container:t,onToggle:()=>this.onMuteCallback?.()}),this.muteButton=this.muteHandle.element)}createPauseButton(){const t=document.getElementById("hud");if(!t)return;const e=window.innerHeight<=500;this.pauseButton=document.createElement("button"),this.pauseButton.textContent="✋ やすむ",this.pauseButton.setAttribute("aria-label","やすむ"),this.pauseButton.style.position="absolute",this.pauseButton.style.top="0.8rem",this.pauseButton.style.left=e?"4rem":"4.7rem",this.pauseButton.style.fontFamily="'Zen Maru Gothic', sans-serif",this.pauseButton.style.fontSize=e?"clamp(0.9rem, 3.2vmin, 1rem)":"clamp(1rem, 3.5vmin, 1.15rem)",this.pauseButton.style.fontWeight="900",this.pauseButton.style.padding=e?"0.45rem 0.9rem":"0.7rem 1.2rem",this.pauseButton.style.border="none",this.pauseButton.style.borderRadius="999px",this.pauseButton.style.background="rgba(255, 255, 255, 0.16)",this.pauseButton.style.color="#fff",this.pauseButton.style.cursor="pointer",this.pauseButton.style.pointerEvents="auto",this.pauseButton.style.touchAction="manipulation",this.pauseButton.style.boxShadow="0 4px 14px rgba(0, 0, 0, 0.2)",this.pauseButton.style.transform="scale(1)",this.pauseButton.style.transition="transform 0.08s ease-out, opacity 0.12s ease-out",this.pauseButton.style.minHeight=e?"2.4rem":"3rem",this.pauseButton.style.minWidth=e?"5.6rem":"7rem",this.pauseButtonCleanup=k(this.pauseButton,{onActivate:()=>this.onPauseCallback?.(),canActivate:()=>this.pauseEnabled,onPressChange:s=>{this.pauseButton&&(this.pauseButton.style.transform=s?"scale(0.95)":"scale(1)")}}),t.appendChild(this.pauseButton),this.applyPauseButtonState()}createBoostButton(){const t=document.getElementById("ui-overlay");if(!t)return;this.injectBoostAnimations(),this.boostButton=document.createElement("button"),this.boostButton.textContent="🚀 ブースト!",this.boostButton.setAttribute("aria-label","ブースト"),this.boostButton.setAttribute("aria-disabled","false");const e=window.innerHeight<=500;this.boostButton.style.position="absolute",this.boostButton.style.bottom=e?"1rem":"2rem",this.boostButton.style.right=e?"1rem":"2rem",this.boostButton.style.fontFamily="'Zen Maru Gothic', sans-serif",this.boostButton.style.fontSize=e?"clamp(0.85rem, 2.8vmin, 1.05rem)":"clamp(1rem, 3.5vmin, 1.3rem)",this.boostButton.style.fontWeight="700",this.boostButton.style.padding=e?"0.5rem 1rem":"0.8rem 1.5rem",this.boostButton.style.border="none",this.boostButton.style.borderRadius="2rem",this.boostButton.style.background="linear-gradient(135deg, #FF6B6B, #FFD93D, #6BCB77)",this.boostButton.style.color="#fff",this.boostButton.style.cursor="pointer",this.boostButton.style.touchAction="manipulation",this.boostButton.style.pointerEvents="auto",this.boostButton.style.boxShadow="0 4px 15px rgba(255, 107, 107, 0.4)",this.boostButton.style.animation="boostBtnPulse 2s ease-in-out infinite",this.boostButton.addEventListener("pointerdown",s=>{s.stopPropagation();const i=this.boostButton;if(i&&!this.boostLocked){if(this.lastCooldownProgress<1){if(i.hasAttribute("data-boost-shake"))return;i.setAttribute("data-boost-shake",""),this.registerTimeout(()=>{i.removeAttribute("data-boost-shake")},250),this.onBoostDeniedCallback?.();return}i.style.transform="scale(0.9)",this.registerTimeout(()=>{i.style.transform="scale(1.0)"},150),this.onBoostCallback?.()}}),t.appendChild(this.boostButton),this.boostHintEl=document.createElement("div"),this.boostHintEl.setAttribute("data-boost-hint",""),this.boostHintEl.setAttribute("aria-hidden","true"),this.boostHintEl.style.cssText=`
      position: absolute;
      right: 2rem;
      bottom: 6.25rem;
      display: none;
      max-width: min(54vw, 240px);
      padding: 0.45rem 0.85rem;
      border-radius: 999px;
      background: rgba(14, 20, 60, 0.9);
      border: 2px solid rgba(255, 217, 61, 0.9);
      color: #fff7bf;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(0.95rem, 3.2vmin, 1.12rem);
      font-weight: 700;
      text-align: center;
      pointer-events: none;
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.24);
      transform-origin: right bottom;
      z-index: 12;
      white-space: nowrap;
    `,t.appendChild(this.boostHintEl),this.cooldownContainer=document.createElement("div"),this.cooldownContainer.setAttribute("data-cooldown-container",""),this.cooldownContainer.style.cssText=`
      position: absolute;
      bottom: ${e?"0.4rem":"1rem"};
      right: ${e?"1rem":"2rem"};
      width: ${e?"60px":"80px"};
      height: 6px;
      border-radius: 3px;
      background: rgba(255, 255, 255, 0.2);
      pointer-events: none;
    `,this.cooldownContainer.style.position="absolute",this.cooldownContainer.style.bottom=e?"0.4rem":"1rem",this.cooldownContainer.style.right=e?"1rem":"2rem",this.cooldownBar=document.createElement("div"),this.cooldownBar.setAttribute("data-cooldown-bar",""),this.cooldownBar.style.cssText=`
      height: 100%;
      border-radius: 3px;
      background: linear-gradient(90deg, #00ddff, #00ff88);
      transition: width 0.1s;
      width: 100%;
      box-shadow: none;
    `,this.cooldownContainer.appendChild(this.cooldownBar),t.appendChild(this.cooldownContainer),this.applyBoostButtonState()}injectBoostAnimations(){if(document.getElementById("boost-animations"))return;const t=document.createElement("style");t.id="boost-animations",t.textContent=`
      @keyframes boostBtnPulse {
        0%, 100% { transform: scale(1.0); }
        50% { transform: scale(1.05); }
      }
      @keyframes boostShake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-4px); }
        40% { transform: translateX(4px); }
        60% { transform: translateX(-4px); }
        80% { transform: translateX(4px); }
      }
      button[data-boost-shake] {
        animation: boostShake 0.25s ease-in-out 1 !important;
      }
      @keyframes boostReadyRing {
        0%, 100% { box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4); }
        50% { box-shadow: 0 0 0 8px rgba(255, 255, 255, 0), 0 10px 28px rgba(255, 217, 61, 0.7); }
      }
      @keyframes boostBtnReadyFlash {
        0%   { transform: scale(1.0); }
        40%  { transform: scale(1.18); }
        100% { transform: scale(1.0); }
      }
      button[data-boost-ready-flash] {
        animation: boostBtnReadyFlash 0.45s ease-out 1 !important;
      }
      @keyframes boostHintBob {
        0%, 100% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-4px) scale(1.04); }
      }
      [data-boost-hint][data-boost-hint-visible] {
        animation: boostHintBob 0.9s ease-in-out infinite;
      }
      button[data-boost-hint-active] {
        box-shadow:
          0 0 0 6px rgba(255, 217, 61, 0.18),
          0 10px 28px rgba(255, 107, 107, 0.62);
        transform: scale(1.08);
      }
      div[data-cooldown-container][data-boost-hint-active] {
        box-shadow: 0 0 14px rgba(255, 217, 61, 0.9);
      }
      @keyframes stageGoalFlash {
        0%   { transform: scale(1.0); }
        40%  { transform: scale(1.35); }
        100% { transform: scale(1.0); }
      }
      span[data-stage-goal-flash], div[data-stage-goal-flash] {
        animation: stageGoalFlash 0.45s ease-out 1;
        display: inline-block;
      }
      @keyframes hudCountPop {
        0%   { transform: scale(1.0); }
        40%  { transform: scale(1.25); }
        100% { transform: scale(1.0); }
      }
      span[data-hud-count-pop] {
        animation: hudCountPop 0.35s ease-out 1;
        display: inline-block;
        transform-origin: center;
      }
    `,document.head.appendChild(t)}setBoostCallback(t){this.onBoostCallback=t}setBoostDeniedCallback(t){this.onBoostDeniedCallback=t}setBoostLocked(t){this.boostLocked=t,this.applyBoostButtonState()}setHomeCallback(t){this.onHomeCallback=t}setHomeConfirmOpenCallback(t){this.onHomeConfirmOpenCallback=t}setHomeConfirmCancelCallback(t){this.onHomeConfirmCancelCallback=t}setPauseCallback(t){this.onPauseCallback=t}setPauseEnabled(t){this.pauseEnabled=t,this.applyPauseButtonState()}setMuteCallback(t){this.onMuteCallback=t}setPauseOpenCallback(t){this.onPauseOpenCallback=t}setPauseResumeCallback(t){this.onPauseResumeCallback=t}setMuteState(t){this.muted=t,this.muteHandle?.setMuted(t)}setHighContrastMode(t){this.highContrastMode=t,this.applyColorAccessibilityState()}applyColorAccessibilityState(){if(this.stageNameEl&&(this.stageNameEl.style.color=this.highContrastMode?"#fff58f":"#FFD700",this.stageNameEl.style.textShadow=this.highContrastMode?"0 0 0 #000, 0 2px 8px rgba(0, 0, 0, 0.9), 0 0 20px rgba(255, 255, 255, 0.25)":"0 2px 8px rgba(0, 0, 0, 0.7)"),this.assistMessageEl&&(this.assistMessageEl.style.background=this.highContrastMode?"rgba(5, 10, 28, 0.96)":"rgba(255, 255, 255, 0.14)",this.assistMessageEl.style.border=this.highContrastMode?"3px solid rgba(255, 255, 255, 0.95)":"none",this.assistMessageEl.style.color=this.highContrastMode?"#ffffff":"#fff7bf"),this.bestStarContainerEl&&(this.bestStarContainerEl.style.color=this.highContrastMode?"#e6f4ff":"#9ec5ff",this.bestStarContainerEl.style.opacity=this.highContrastMode?"1":"0.7"),this.stageProgressTrack&&(this.stageProgressTrack.style.background=this.highContrastMode?"rgba(6, 12, 28, 0.94)":"rgba(255, 255, 255, 0.18)",this.stageProgressTrack.style.border=this.highContrastMode?"3px solid rgba(255, 255, 255, 0.92)":"none"),this.stageProgressFill){const t=this.stageProgressFill.getAttribute("data-stage-progress-color")??"#ffd700";this.stageProgressFill.style.background=this.highContrastMode?`repeating-linear-gradient(90deg, #ffffff 0 10px, #00ddff 10px 18px, ${t} 18px 30px)`:`linear-gradient(90deg, #00ddff, ${t})`}if(this.stageProgressGoalEl){const t=this.stageProgressFill?.getAttribute("data-stage-progress-color")??"#ffd700";this.stageProgressGoalEl.style.textShadow=this.highContrastMode?`0 0 0 #000, 0 0 12px #ffffff, 0 0 18px ${t}`:`0 0 8px ${t}`}this.boostButton&&(this.boostButton.style.border=this.highContrastMode?"4px solid rgba(255, 255, 255, 0.95)":"none",this.boostButton.style.background=this.highContrastMode?"linear-gradient(135deg, #fff27a, #76f0ff, #6BCB77)":"linear-gradient(135deg, #FF6B6B, #FFD93D, #6BCB77)",this.boostButton.style.color=this.highContrastMode?"#0b1535":"#fff"),this.cooldownContainer&&(this.cooldownContainer.style.background=this.highContrastMode?"rgba(6, 12, 28, 0.94)":"rgba(255, 255, 255, 0.2)",this.cooldownContainer.style.border=this.highContrastMode?"2px solid rgba(255, 255, 255, 0.95)":"none",this.cooldownContainer.style.height=this.highContrastMode?"10px":"6px"),this.cooldownBar&&(this.cooldownBar.style.background=this.highContrastMode?"repeating-linear-gradient(90deg, #ffffff 0 10px, #00ddff 10px 18px, #00ff88 18px 30px)":"linear-gradient(90deg, #00ddff, #00ff88)"),this.applyBoostButtonState()}showAssistMessage(t){this.assistMessageEl&&(this.assistMessageEl.textContent=t,this.assistMessageEl.style.display="block",this.announcePolite(t))}hideAssistMessage(){this.assistMessageEl&&(this.assistMessageEl.style.display="none",this.assistMessageEl.textContent="")}showBoostHint(t){!this.boostHintEl||!this.boostButton||!this.cooldownContainer||(this.boostHintEl.textContent=t,this.boostHintEl.style.display="block",this.boostHintEl.setAttribute("data-boost-hint-visible",""),this.boostHintEl.setAttribute("aria-hidden","false"),this.boostButton.setAttribute("data-boost-hint-active",""),this.cooldownContainer.setAttribute("data-boost-hint-active",""))}hideBoostHint(){this.boostHintEl&&(this.boostHintEl.style.display="none",this.boostHintEl.textContent="",this.boostHintEl.removeAttribute("data-boost-hint-visible"),this.boostHintEl.setAttribute("aria-hidden","true")),this.boostButton?.removeAttribute("data-boost-hint-active"),this.cooldownContainer?.removeAttribute("data-boost-hint-active")}isMuted(){return this.muted}update(t,e){if(this.scoreEl&&t!==this.lastScore){const s=this.lastScore;this.scoreEl.textContent=String(t),this.lastScore=t,s!==-1&&t>s&&this.flashCount(this.scoreEl)}if(this.starCountEl&&e!==this.lastStarCount){const s=this.lastStarCount;this.starCountEl.textContent=String(e),this.lastStarCount=e,s!==-1&&e>s&&(this.flashCount(this.starCountEl),this.announcePolite(`ほし ${e}こ ゲット！`))}this.bestStarCount>0&&!this.bestStarPulsed&&e>this.bestStarCount&&this.bestStarContainerEl&&this.bestStarContainerEl.style.display!=="none"&&(this.bestStarPulsed=!0,this.flashCount(this.bestStarContainerEl))}setBestStarCount(t){const e=Number.isInteger(t)&&t>0?t:0;this.bestStarCount=e,this.bestStarPulsed=!1,!(!this.bestStarContainerEl||!this.bestStarCountEl)&&(e>0?(this.lastBestStarCount!==e&&(this.bestStarCountEl.textContent=String(e),this.lastBestStarCount=e),this.bestStarContainerEl.style.display=""):(this.bestStarContainerEl.style.display="none",this.lastBestStarCount=-1))}flashCount(t){if(t.hasAttribute("data-hud-count-pop"))return;t.setAttribute("data-hud-count-pop","");let e=!1;const s=()=>{e||(e=!0,t.removeAttribute("data-hud-count-pop"),t.removeEventListener("animationend",i))},i=a=>{a.animationName==="hudCountPop"&&s()};t.addEventListener("animationend",i),this.registerTimeout(s,500)}registerTimeout(t,e){let s=0;return s=window.setTimeout(()=>{this.pendingTimeouts.delete(s),t()},e),this.pendingTimeouts.add(s),s}clearPendingTimeouts(){for(const t of this.pendingTimeouts)window.clearTimeout(t);this.pendingTimeouts.clear()}updateCooldown(t){if(!this.cooldownBar||!this.boostButton)return;const e=Math.max(0,Math.min(1,t)),s=Math.round(e*100);s!==this.lastCooldownPct&&(this.cooldownBar.style.width=`${s}%`,this.lastCooldownPct=s),this.lastCooldownProgress=e;const i=e>=1;i!==this.lastReadyState&&(this.lastReadyState=i,this.applyBoostButtonState())}updateStageProgress(t){if(!this.stageProgressContainer||!this.stageProgressFill)return;const e=Math.max(0,Math.min(1,t)),s=Math.round(e*100);s!==this.lastStageProgressPct&&(this.stageProgressFill.style.width=`${s}%`,this.stageProgressContainer.setAttribute("aria-valuenow",String(s)),this.stageProgressContainer.setAttribute("aria-valuetext",`ゴールまで あと ${100-s}%`),this.lastStageProgressPct=s),this.announceStageProgressMilestone(s);const i=e>=1;i!==this.lastStageProgressComplete&&(i?(this.stageProgressContainer.setAttribute("data-stage-progress-complete",""),this.flashStageGoal()):this.stageProgressContainer.removeAttribute("data-stage-progress-complete"),this.lastStageProgressComplete=i)}flashStageGoal(){const t=this.stageProgressGoalEl;if(!t||t.hasAttribute("data-stage-goal-flash"))return;t.setAttribute("data-stage-goal-flash","");let e=!1;const s=()=>{e||(e=!0,t.removeAttribute("data-stage-goal-flash"),t.removeEventListener("animationend",i))},i=a=>{a.animationName==="stageGoalFlash"&&s()};t.addEventListener("animationend",i),this.registerTimeout(s,500)}flashBoostReady(){const t=this.boostButton;if(!t||t.hasAttribute("data-boost-ready-flash"))return;this.announcePolite("ブースト じゅんび OK！"),t.setAttribute("data-boost-ready-flash","");let e=!1;const s=()=>{e||(e=!0,t.removeAttribute("data-boost-ready-flash"),t.removeEventListener("animationend",i),this.lastReadyState===!0&&(t.style.animation="boostBtnPulse 2s ease-in-out infinite, boostReadyRing 1.15s ease-in-out infinite"))},i=a=>{a.animationName==="boostBtnReadyFlash"&&s()};t.addEventListener("animationend",i),this.registerTimeout(s,500)}clearBoostReadyFlash(){this.boostButton?.hasAttribute("data-boost-ready-flash")&&this.boostButton.removeAttribute("data-boost-ready-flash")}announceMeteoriteHit(){this.announceAssertive("いんせきに ぶつかった！ シールド かいふくちゅう")}announceStageClear(t,e=!1,s=!1){const i=[`ステージ クリア！ ほし ${t}こ あつめたよ！`];s&&i.push("じこベスト こうしん！"),e&&i.push("あたらしい なかまも みつけたよ！"),this.announceAssertive(i.join(" "))}applyBoostButtonState(){if(!this.cooldownBar||!this.boostButton)return;const e=this.lastCooldownProgress>=1&&!this.boostLocked;this.cooldownBar.style.boxShadow=e?this.highContrastMode?"0 0 0 2px rgba(255, 255, 255, 0.7), 0 0 14px #00ff88":"0 0 10px #00ff88":"none",this.boostButton.style.opacity=e?"1":"0.5",this.boostButton.style.filter=e?"none":"grayscale(0.8)",this.boostButton.style.animation=e?"boostBtnPulse 2s ease-in-out infinite, boostReadyRing 1.15s ease-in-out infinite":"none",e?this.boostButton.setAttribute("data-boost-ready-ring",""):this.boostButton.removeAttribute("data-boost-ready-ring"),this.boostButton.setAttribute("aria-disabled",e?"false":"true"),e||(this.clearBoostReadyFlash(),this.hideBoostHint())}applyPauseButtonState(){this.pauseButton&&(this.pauseButton.style.opacity=this.pauseEnabled?"1":"0.45",this.pauseButton.style.filter=this.pauseEnabled?"none":"grayscale(0.8)",this.pauseButton.style.cursor=this.pauseEnabled?"pointer":"default",this.pauseButton.setAttribute("aria-disabled",this.pauseEnabled?"false":"true"))}createLiveRegions(t){this.politeLiveRegionEl=this.createLiveRegion("polite"),this.assertiveLiveRegionEl=this.createLiveRegion("assertive"),t.appendChild(this.politeLiveRegionEl),t.appendChild(this.assertiveLiveRegionEl)}createLiveRegion(t){const e=document.createElement("div");return e.setAttribute("data-hud-live-region",t),e.setAttribute("aria-live",t),e.setAttribute("aria-atomic","true"),e.setAttribute("role",t==="assertive"?"alert":"status"),e.style.cssText=`
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    `,e}announcePolite(t){this.writeLiveRegion(this.politeLiveRegionEl,t)}announceAssertive(t){this.writeLiveRegion(this.assertiveLiveRegionEl,t)}writeLiveRegion(t,e){if(!t||e.length===0)return;this.liveRegionWriteNonce+=1;const s=this.liveRegionWriteNonce%2===0?"​":"‌";t.textContent=`${e}${s}`,t.setAttribute("data-live-message",e)}announceStageProgressMilestone(t){if(t>=100){this.lastAnnouncedProgressThreshold<100&&(this.announcePolite("ゴール！"),this.lastAnnouncedProgressThreshold=100);return}const e=[{pct:75,remaining:25},{pct:50,remaining:50},{pct:25,remaining:75}];for(const s of e)t>=s.pct&&this.lastAnnouncedProgressThreshold<s.pct&&(this.lastAnnouncedProgressThreshold=s.pct,this.announcePolite(`ゴールまで あと ${s.remaining}%`))}hide(){this.clearPendingTimeouts(),this.homeConfirmOverlay.hide(),this.pauseOverlay.hide(),this.homeButton&&(this.homeButton.remove(),this.homeButton=null),this.pauseButtonCleanup?.(),this.pauseButtonCleanup=null,this.pauseButton&&(this.pauseButton.remove(),this.pauseButton=null),this.muteHandle&&(this.muteHandle.remove(),this.muteHandle=null),this.muteButton=null,this.stageNameEl&&(this.stageNameEl.remove(),this.stageNameEl=null),this.assistMessageEl&&(this.assistMessageEl.remove(),this.assistMessageEl=null),this.politeLiveRegionEl&&(this.politeLiveRegionEl.remove(),this.politeLiveRegionEl=null),this.assertiveLiveRegionEl&&(this.assertiveLiveRegionEl.remove(),this.assertiveLiveRegionEl=null),this.stageProgressContainer&&(this.stageProgressContainer.remove(),this.stageProgressContainer=null),this.stageProgressTrack=null,this.stageProgressFill=null,this.stageProgressGoalEl=null,this.container&&(this.container.remove(),this.container=null),this.boostButton&&(this.boostButton.remove(),this.boostButton=null),this.boostHintEl&&(this.boostHintEl.remove(),this.boostHintEl=null),this.cooldownContainer&&(this.cooldownContainer.remove(),this.cooldownContainer=null),this.cooldownBar=null,this.boostLocked=!1,this.pauseEnabled=!0,this.lastCooldownProgress=1,this.lastCooldownPct=-1,this.lastReadyState=null,this.lastStageProgressPct=-1,this.lastStageProgressComplete=null,this.lastScore=-1,this.lastStarCount=-1,this.scoreEl=null,this.starCountEl=null,this.bestStarContainerEl=null,this.bestStarCountEl=null,this.bestStarCount=0,this.lastBestStarCount=-1,this.bestStarPulsed=!1,this.liveRegionWriteNonce=0,this.lastAnnouncedProgressThreshold=0}}const ge=1,ye=.4;class Et{overlayEl=null;numberEl=null;phase="idle";elapsed=0;currentStep=0;stepDuration;goDuration;onTick;onGo;onComplete=null;steps=["3","2","1"];constructor(t={}){this.stepDuration=t.stepDuration??ge,this.goDuration=t.goDuration??ye,this.onTick=t.onTick,this.onGo=t.onGo}show(t){if(this.phase!=="idle"&&this.phase!=="done")return;const e=document.getElementById("ui-overlay")??document.body;this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-countdown-overlay",""),this.overlayEl.style.cssText=`
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      z-index: 25;
    `,this.numberEl=document.createElement("div"),this.numberEl.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-weight: 900;
      font-size: clamp(96px, 18vw, 220px);
      color: #fff;
      text-shadow:
        0 0 24px rgba(255, 215, 0, 0.85),
        0 0 48px rgba(120, 180, 255, 0.6);
      transform: scale(0.6);
      opacity: 0;
      will-change: transform, opacity;
    `,this.overlayEl.appendChild(this.numberEl),e.appendChild(this.overlayEl),this.phase="counting",this.elapsed=0,this.currentStep=0,this.onComplete=t,this.renderStep(this.steps[this.currentStep]),this.fireTick()}tick(t){if(!(this.phase==="idle"||this.phase==="done")){if(t<0&&(t=0),this.elapsed+=t,this.phase==="counting"){const e=this.elapsed;this.applyStepAnimation(e/this.stepDuration),e>=this.stepDuration&&(this.currentStep++,this.elapsed=0,this.currentStep<this.steps.length?(this.renderStep(this.steps[this.currentStep]),this.fireTick()):(this.phase="go",this.renderStep("スタート！"),this.fireGo()));return}this.phase==="go"&&(this.applyStepAnimation(this.elapsed/this.goDuration),this.elapsed>=this.goDuration&&this.complete())}}hide(){this.overlayEl&&(this.overlayEl.remove(),this.overlayEl=null),this.numberEl=null,this.phase="done",this.onComplete=null}dispose(){this.hide(),this.onTick=void 0,this.onGo=void 0}isActive(){return this.phase==="counting"||this.phase==="go"}getCurrentLabel(){return this.numberEl?.textContent??null}renderStep(t){this.numberEl&&(this.numberEl.textContent=t,this.numberEl.style.opacity="0",this.numberEl.style.transform="scale(0.6)")}applyStepAnimation(t){if(!this.numberEl)return;const e=Math.max(0,Math.min(1,t));let s,i;if(e<.2){const a=e/.2;s=.6+a*.5,i=a}else if(e<.7)s=1.1-(e-.2)/.5*.1,i=1;else{const a=(e-.7)/.3;s=1+a*.2,i=1-a}this.numberEl.style.transform=`scale(${s.toFixed(3)})`,this.numberEl.style.opacity=i.toFixed(3)}fireTick(){try{this.onTick?.()}catch{}}fireGo(){try{this.onGo?.()}catch{}}complete(){const t=this.onComplete;if(this.hide(),t)try{t()}catch{}}}const be=1.8;class ve{constructor(t,e={}){this.entry=t,this.totalDuration=e.totalDuration??be}overlayEl=null;cardEl=null;phase="idle";elapsed=0;onComplete=null;totalDuration;show(t){if(this.phase!=="idle"&&this.phase!=="done")return;const e=document.getElementById("ui-overlay")??document.body;Rt();const s=H().height<=500;this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-stage-intro-overlay",""),this.overlayEl.style.cssText=`
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: ${s?"0.75rem":"1.2rem"};
      pointer-events: none;
      z-index: 24;
      opacity: 0;
      will-change: opacity;
    `,this.cardEl=document.createElement("div"),this.cardEl.setAttribute("data-stage-intro-card",""),this.cardEl.setAttribute("data-stage-intro-compact",s?"true":"false"),this.cardEl.style.cssText=`
      width: min(${s?"88vw":"82vw"}, ${s?"22rem":"30rem"});
      max-width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: ${s?"0.25rem":"0.5rem"};
      padding: ${s?"0.9rem 1rem":"1.4rem 1.6rem"};
      border-radius: ${s?"24px":"32px"};
      background:
        linear-gradient(180deg, rgba(8, 24, 72, 0.92), rgba(25, 65, 148, 0.9)),
        rgba(8, 24, 72, 0.92);
      border: 2px solid rgba(255, 255, 255, 0.22);
      box-shadow:
        0 18px 50px rgba(0, 0, 0, 0.34),
        0 0 28px rgba(120, 180, 255, 0.22);
      text-align: center;
      transform: translateY(24px) scale(0.92);
      opacity: 0;
      will-change: transform, opacity;
    `;const i=document.createElement("div");i.textContent="つぎは ここ！",i.setAttribute("data-stage-intro-label",""),i.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${s?"0.85rem":"1rem"};
      font-weight: 800;
      letter-spacing: 0.08em;
      color: #bcd9ff;
    `;const a=document.createElement("div");a.textContent=this.entry.emoji,a.setAttribute("data-stage-intro-emoji",""),a.style.cssText=`
      font-size: ${s?"clamp(3rem, 15vw, 4.2rem)":"clamp(4.4rem, 18vw, 6rem)"};
      line-height: 1;
      filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.28));
    `;const o=document.createElement("div");o.textContent=this.entry.reading,o.setAttribute("data-stage-intro-name",""),o.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${s?"clamp(1.8rem, 8vw, 2.6rem)":"clamp(2.5rem, 10vw, 3.4rem)"};
      font-weight: 900;
      line-height: 1.05;
      color: #ffffff;
      text-shadow: 0 0 18px rgba(126, 199, 255, 0.2);
    `;const n=document.createElement("div");n.textContent=this.entry.trivia,n.setAttribute("data-stage-intro-trivia",""),n.style.cssText=`
      max-width: 100%;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${s?"clamp(0.88rem, 3.4vmin, 1rem)":"clamp(1.02rem, 3.7vmin, 1.15rem)"};
      font-weight: 700;
      line-height: 1.35;
      color: #eef5ff;
      overflow-wrap: anywhere;
    `,this.cardEl.append(i,a,o,n),this.overlayEl.appendChild(this.cardEl),e.appendChild(this.overlayEl),this.phase="showing",this.elapsed=0,this.onComplete=t,this.applyAnimation(0)}tick(t){this.phase==="showing"&&(this.elapsed+=Math.max(0,t),this.applyAnimation(this.elapsed/this.totalDuration),this.elapsed>=this.totalDuration&&this.complete())}hide(){this.overlayEl&&(this.overlayEl.remove(),this.overlayEl=null),this.cardEl=null,this.phase="done",this.onComplete=null}dispose(){this.hide()}isActive(){return this.phase==="showing"}applyAnimation(t){if(!this.overlayEl||!this.cardEl)return;const e=Math.max(0,Math.min(1,t));let s=1,i=1,a=0,o=1;if(e<.18){const n=e/.18;i=n,s=n,a=24-24*n,o=.92+.1*n}else if(e<.72){const n=(e-.18)/.54;i=1,s=1,a=0,o=1.02-.02*n}else{const n=(e-.72)/.28;i=1-n*.8,s=1-n,a=-18*n,o=1-.04*n}this.overlayEl.style.opacity=i.toFixed(3),this.cardEl.style.opacity=s.toFixed(3),this.cardEl.style.transform=`translateY(${a.toFixed(1)}px) scale(${o.toFixed(3)})`}complete(){const t=this.onComplete;if(this.hide(),!!t)try{t()}catch{}}}class L{static STYLE_ID="score-popup-animations";static POOL_SIZE=6;static POPUP_LIFETIME_MS=720;root=null;pool=[];highContrastMode=!1;nextRecycleIndex=0;scratch=new St;setHighContrastMode(t){this.highContrastMode=t}show(t,e,s){const i=this.ensureRoot();if(!i||(this.scratch.set(e.x,e.y,e.z).project(s),!Number.isFinite(this.scratch.x)||!Number.isFinite(this.scratch.y)||!Number.isFinite(this.scratch.z)))return;const a=Math.round((this.scratch.x*.5+.5)*1e5)/1e3,o=Math.round((-this.scratch.y*.5+.5)*1e5)/1e3,n=this.acquireEntry(i),h=t>=500,l=h?"#ff9cf7":"#ffe066",c=n.useAltAnimation?"scorePopupFloatB":"scorePopupFloatA";n.useAltAnimation=!n.useAltAnimation,n.currentAnimationName=c,n.el.textContent=`${h?"🌈":"⬢"} +${t}`,n.el.style.left=`${a}%`,n.el.style.top=`${o}%`,n.el.style.color=l,n.el.style.textShadow=`0 2px 10px ${h?"rgba(255, 156, 247, 0.55)":"rgba(255, 214, 102, 0.55)"}`,n.el.style.background=this.highContrastMode?h?"rgba(13, 18, 38, 0.92)":"rgba(0, 0, 0, 0.82)":"transparent",n.el.style.border=this.highContrastMode?h?"3px solid rgba(255, 255, 255, 0.95)":"2px dashed rgba(255, 255, 255, 0.95)":"none",n.el.style.borderRadius=this.highContrastMode?"999px":"0",n.el.style.padding=this.highContrastMode?"0.18rem 0.55rem":"0",n.el.style.setProperty("-webkit-text-stroke",this.highContrastMode?"0.6px #061126":"0"),n.el.setAttribute("data-score-popup-kind",h?"bonus":"normal"),n.el.style.visibility="visible",n.el.style.opacity="1",n.el.style.animationName=c,n.el.removeAttribute("data-score-popup-active"),n.el.setAttribute("data-score-popup-active",""),n.active=!0;const u=()=>{this.releaseEntry(n)};n.onAnimationEnd=g=>{g.animationName===n.currentAnimationName&&u()},n.el.addEventListener("animationend",n.onAnimationEnd),n.timeoutId=window.setTimeout(u,L.POPUP_LIFETIME_MS)}dispose(){for(const t of this.pool)this.clearEntry(t),t.el.remove();this.pool=[],this.root?.remove(),this.root=null,this.nextRecycleIndex=0}ensureRoot(){const t=document.getElementById("ui-overlay");return t?(this.root&&(this.root.parentElement!==t||!this.root.isConnected)&&this.dispose(),this.root?this.root:(this.injectStyles(),this.root=document.createElement("div"),this.root.setAttribute("data-score-popup-root",""),this.root.style.position="absolute",this.root.style.inset="0",this.root.style.overflow="hidden",this.root.style.pointerEvents="none",this.root.style.contain="layout style paint",t.appendChild(this.root),this.root)):null}acquireEntry(t){if(this.pool.length<L.POOL_SIZE){const s=this.createEntry();return this.pool.push(s),t.appendChild(s.el),s}const e=this.pool.find(s=>!s.active)??this.pool[this.nextRecycleIndex++%this.pool.length];return this.clearEntry(e),e}createEntry(){const t=document.createElement("div");return t.setAttribute("data-score-popup",""),t.style.position="absolute",t.style.transform="translate3d(-50%, -50%, 0)",t.style.fontFamily="'Zen Maru Gothic', sans-serif",t.style.fontSize="clamp(1rem, 3.5vmin, 1.4rem)",t.style.fontWeight="900",t.style.lineHeight="1",t.style.whiteSpace="nowrap",t.style.pointerEvents="none",t.style.willChange="transform, opacity",t.style.visibility="hidden",t.style.opacity="0",t.style.animationDuration=`${L.POPUP_LIFETIME_MS}ms`,t.style.animationTimingFunction="ease-out",t.style.animationIterationCount="1",{el:t,active:!1,timeoutId:null,onAnimationEnd:null,useAltAnimation:!1,currentAnimationName:"none"}}releaseEntry(t){this.clearEntry(t),t.el.style.visibility="hidden",t.el.style.opacity="0"}clearEntry(t){t.active=!1,t.currentAnimationName="none",t.el.removeAttribute("data-score-popup-active"),t.el.removeAttribute("data-score-popup-kind"),t.el.style.animationName="none",t.timeoutId!==null&&(window.clearTimeout(t.timeoutId),t.timeoutId=null),t.onAnimationEnd&&(t.el.removeEventListener("animationend",t.onAnimationEnd),t.onAnimationEnd=null)}injectStyles(){if(document.getElementById(L.STYLE_ID))return;const t=document.createElement("style");t.id=L.STYLE_ID,t.textContent=`
      @keyframes scorePopupFloatA {
        0% {
          opacity: 0;
          transform: translate3d(-50%, -35%, 0) scale(0.92);
        }
        18% {
          opacity: 1;
          transform: translate3d(-50%, -50%, 0) scale(1);
        }
        100% {
          opacity: 0;
          transform: translate3d(-50%, -105%, 0) scale(1.04);
        }
      }
      @keyframes scorePopupFloatB {
        0% {
          opacity: 0;
          transform: translate3d(-50%, -35%, 0) scale(0.92);
        }
        18% {
          opacity: 1;
          transform: translate3d(-50%, -50%, 0) scale(1);
        }
        72% {
          opacity: 1;
          transform: translate3d(-43%, -84%, 0) scale(1.02);
        }
        100% {
          opacity: 0;
          transform: translate3d(-38%, -105%, 0) scale(1.04);
        }
      }
    `,document.head.appendChild(t)}}class Ee{overlayEl=null;leftGuideEl=null;rightGuideEl=null;instructionEl=null;currentMode=null;show(t="intro"){if(this.overlayEl){this.setMode(t);return}const e=document.getElementById("ui-overlay");e&&(this.injectStyles(),this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-touch-guide-overlay",""),this.overlayEl.setAttribute("role","region"),this.overlayEl.setAttribute("aria-label","そうさ ガイド"),this.overlayEl.style.cssText=`
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 12;
    `,this.leftGuideEl=this.createGuide("left","⬅️ ひだり"),this.rightGuideEl=this.createGuide("right","みぎ ➡️"),this.instructionEl=this.createInstruction(),this.overlayEl.appendChild(this.leftGuideEl),this.overlayEl.appendChild(this.rightGuideEl),this.overlayEl.appendChild(this.instructionEl),e.appendChild(this.overlayEl),this.setMode(t))}setMode(t){!this.overlayEl||this.currentMode===t||(this.currentMode=t,this.overlayEl.setAttribute("data-touch-guide-state",t),this.overlayEl.setAttribute("data-touch-guide-active-side",this.getActiveSide(t)),this.overlayEl.setAttribute("aria-hidden",t==="hidden"?"true":"false"),this.overlayEl.style.visibility=t==="hidden"?"hidden":"visible",this.leftGuideEl?.setAttribute("data-touch-guide-emphasis",this.getGuideEmphasis("left",t)),this.rightGuideEl?.setAttribute("data-touch-guide-emphasis",this.getGuideEmphasis("right",t)),this.updateInstruction(t))}hide(){this.overlayEl&&(this.overlayEl.remove(),this.overlayEl=null,this.leftGuideEl=null,this.rightGuideEl=null,this.instructionEl=null,this.currentMode=null)}createGuide(t,e){const s=document.createElement("div");return s.setAttribute("data-touch-guide",t),s.setAttribute("aria-hidden","true"),s.textContent=e,s.style.position="absolute",s.style.top="50%",s.style.transform="translateY(-50%)",s.style.maxWidth="min(24vw, 11rem)",s.style.padding="0.7rem 1rem",s.style.borderRadius="999px",s.style.background="rgba(6, 19, 58, 0.38)",s.style.border="2px solid rgba(255, 255, 255, 0.24)",s.style.color="#ffffff",s.style.fontFamily="'Zen Maru Gothic', sans-serif",s.style.fontSize="clamp(1rem, 2.8vmin, 1.3rem)",s.style.fontWeight="700",s.style.textShadow="0 2px 10px rgba(0, 0, 0, 0.45)",s.style.boxShadow="0 8px 24px rgba(0, 0, 0, 0.16)",s.style.transition="opacity 0.24s ease-out, transform 0.24s ease-out",s.style.whiteSpace="nowrap",s.style.opacity="0",t==="left"?(s.style.left="0.8rem",s.style.textAlign="left"):(s.style.right="0.8rem",s.style.textAlign="right"),s}createInstruction(){const t=document.createElement("div");return t.setAttribute("data-touch-guide-instruction",""),t.setAttribute("role","status"),t.setAttribute("aria-live","polite"),t.setAttribute("aria-atomic","true"),t.style.cssText=`
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    `,t}injectStyles(){if(document.getElementById("touch-guide-overlay-styles"))return;const t=document.createElement("style");t.id="touch-guide-overlay-styles",t.textContent=`
      @keyframes touchGuideBlink {
        0%, 100% { opacity: 0.52; }
        50% { opacity: 0.95; }
      }

      @keyframes touchGuideAssistPulse {
        0%, 100% {
          transform: translateY(-50%) scale(1);
          box-shadow: 0 0 0 rgba(109, 214, 255, 0);
        }
        50% {
          transform: translateY(-50%) scale(1.08);
          box-shadow: 0 0 28px rgba(109, 214, 255, 0.48);
        }
      }

      [data-touch-guide-overlay][data-touch-guide-state^="active-"] [data-touch-guide] {
        animation: none;
      }

      [data-touch-guide-overlay][data-touch-guide-state^="active-"] [data-touch-guide][data-touch-guide-emphasis="primary"] {
        opacity: 1;
        background: rgba(38, 94, 182, 0.78);
        border-color: rgba(255, 255, 255, 0.78);
        transform: translateY(-50%) scale(1.05);
        box-shadow: 0 0 24px rgba(109, 214, 255, 0.38);
      }

      [data-touch-guide-overlay][data-touch-guide-state^="active-"] [data-touch-guide][data-touch-guide-emphasis="secondary"] {
        opacity: 0.18;
        transform: translateY(-50%) scale(0.96);
      }

      [data-touch-guide-overlay][data-touch-guide-state="intro"] [data-touch-guide] {
        opacity: 0.82;
        animation: touchGuideBlink 1.8s ease-in-out infinite;
      }

      [data-touch-guide-overlay][data-touch-guide-state="idle"] [data-touch-guide] {
        opacity: 0.42;
        animation: none;
        transform: translateY(-50%);
      }

      [data-touch-guide-overlay][data-touch-guide-state="hidden"] [data-touch-guide] {
        opacity: 0;
        animation: none;
        transform: translateY(calc(-50% + 8px));
      }

      [data-touch-guide-overlay][data-touch-guide-state^="assist-"] [data-touch-guide] {
        animation: none;
      }

      [data-touch-guide-overlay][data-touch-guide-state^="assist-"] [data-touch-guide][data-touch-guide-emphasis="primary"] {
        opacity: 1;
        background: rgba(38, 94, 182, 0.72);
        border-color: rgba(255, 255, 255, 0.72);
        transform: translateY(-50%) scale(1.04);
        box-shadow: 0 0 26px rgba(109, 214, 255, 0.45);
        animation: touchGuideAssistPulse 0.92s ease-in-out infinite;
      }

      [data-touch-guide-overlay][data-touch-guide-state^="assist-"] [data-touch-guide][data-touch-guide-emphasis="secondary"] {
        opacity: 0.2;
        transform: translateY(-50%) scale(0.96);
      }
    `,document.head.appendChild(t)}getActiveSide(t){return t==="active-left"?"left":t==="active-right"?"right":t==="assist-left"?"left":t==="assist-right"?"right":t==="hidden"?"none":"both"}getGuideEmphasis(t,e){return e==="active-left"?t==="left"?"primary":"secondary":e==="active-right"?t==="right"?"primary":"secondary":e==="assist-left"?t==="left"?"primary":"secondary":e==="assist-right"?t==="right"?"primary":"secondary":e==="hidden"?"hidden":"balanced"}updateInstruction(t){if(!this.instructionEl)return;const e=this.getInstructionMessage(t);this.instructionEl.textContent=e,this.instructionEl.setAttribute("data-touch-guide-message",e)}getInstructionMessage(t){return t==="intro"?"ひだりか みぎを さわると うごけるよ":t==="idle"?"ひつような ときは ひだりか みぎを さわって うごこう":t==="assist-left"?"ひだりへ よけよう":t==="assist-right"?"みぎへ よけよう":""}}class Ce{overlayEl=null;continueButton=null;retryButton=null;rewardButton=null;isContinueEnabled=!1;hasHandledContinue=!1;isRewardOpen=!1;buttonCleanups=new Set;show(t){this.hide();const e=document.getElementById("ui-overlay");if(!e)return;this.isContinueEnabled=!1,this.hasHandledContinue=!1,this.isRewardOpen=!1,this.injectStageClearBurstAnimation();const s=document.createElement("div");if(s.setAttribute("data-stage-clear-overlay",""),s.style.cssText=`
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: safe center;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 32, 0.6);
      pointer-events: auto;
      touch-action: manipulation;
      z-index: 40;
      padding: 1.2rem;
      box-sizing: border-box;
      text-align: center;
      overflow-x: hidden;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    `,this.overlayEl=s,this.appendClearCelebrationBurst(),s.appendChild(this.createHeading("やったね！",`
      position: relative;
      z-index: 1;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 3rem;
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
      margin-bottom: 1rem;
    `)),t.isBestUpdated&&(this.injectBestStageStarsAnimation(),s.appendChild(this.createHeading(`✨ じこベストこうしん！ ⭐ ${t.starCount} こ`,`
        position: relative;
        z-index: 1;
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: 1.2rem;
        font-weight: 700;
        color: #FFD700;
        margin-bottom: 0.6rem;
        text-shadow: 0 0 12px rgba(255, 215, 0, 0.6);
        animation: bestStageStarsPop 0.6s ease-out;
      `))),s.appendChild(this.createHeading(`⭐ ${t.starCount} こ あつめたよ！`,`
      position: relative;
      z-index: 1;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 1.5rem;
      font-weight: 700;
      color: #fff;
    `)),s.appendChild(this.createMedalSummary(t.stageNumber,t.starCount,t.bestStarCount)),t.nextEntry&&s.appendChild(this.createNextAdventureCard(t.nextEntry)),t.rewardEntry){s.appendChild(this.createHeading(`${t.rewardEntry.emoji} ${t.rewardEntry.name}の ずかんカード ゲット！`,`
        position: relative;
        z-index: 1;
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: 1.2rem;
        font-weight: 700;
        color: #FFD700;
        margin-top: 1rem;
        text-shadow: 0 0 10px rgba(255, 215, 0, 0.4);
      `)),s.appendChild(this.createHeading(`${t.rewardEntry.emoji} ${t.rewardEntry.name}が なかまに なったよ！`,`
        position: relative;
        z-index: 1;
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: 1.2rem;
        font-weight: 700;
        color: #FFD700;
        margin-top: 0.5rem;
        text-shadow: 0 0 10px rgba(255, 215, 0, 0.4);
      `));const i=document.createElement("button");i.setAttribute("data-stage-clear-card",""),i.textContent="カードをみる",i.style.cssText=`
        position: relative;
        z-index: 1;
        margin-top: 1rem;
        min-width: min(72vw, 280px);
        min-height: 72px;
        padding: 0.9rem 1.6rem;
        border: none;
        border-radius: 999px;
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: clamp(1.3rem, 4.4vmin, 1.7rem);
        font-weight: 900;
        color: #fff;
        background: rgba(255, 255, 255, 0.18);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.24);
        cursor: pointer;
        touch-action: manipulation;
        transform: scale(1);
        transition: transform 0.08s ease-out, opacity 0.18s ease-out;
      `,i.addEventListener("pointerdown",o=>{o.preventDefault(),o.stopPropagation(),!this.isRewardOpen&&(i.style.transform="scale(0.96)",t.onReward?.())});const a=()=>{i.style.transform="scale(1)"};i.addEventListener("pointerup",a),i.addEventListener("pointercancel",a),i.addEventListener("pointerleave",a),this.rewardButton=i,s.appendChild(i)}s.appendChild(this.createActionButtons(t)),e.appendChild(s)}hide(){const t=Array.from(this.buttonCleanups);this.buttonCleanups.clear();for(const e of t)e();this.overlayEl?.remove(),this.overlayEl=null,this.continueButton=null,this.retryButton=null,this.rewardButton=null,this.isContinueEnabled=!1,this.hasHandledContinue=!1,this.isRewardOpen=!1}enableContinue(){if(!this.isContinueEnabled&&!(!this.continueButton||!this.retryButton)){this.isContinueEnabled=!0;for(const t of[this.retryButton,this.continueButton])t.disabled=!1,t.style.opacity="1",t.style.visibility="visible",t.style.pointerEvents="auto"}}setRewardOpen(t){this.isRewardOpen=t,this.rewardButton&&(this.rewardButton.style.pointerEvents=t?"none":"auto",this.rewardButton.style.transform="scale(1)")}createHeading(t,e){const s=document.createElement("div");return s.textContent=t,s.style.cssText=e,s}createMedalSummary(t,e,s){const i=document.createElement("div");i.setAttribute("data-stage-clear-medals",""),i.style.cssText=`
      position: relative;
      z-index: 1;
      display: flex;
      align-items: stretch;
      justify-content: center;
      gap: 0.8rem;
      flex-wrap: wrap;
      margin-top: 0.9rem;
    `;const a=at(t,e,{label:"こんかい",hint:`⭐ ${e}`,size:"hero",scope:"stage-clear-current"});a.style.minWidth="150px",a.style.padding="0.75rem 0.9rem",a.style.borderRadius="20px",a.style.background="rgba(255, 255, 255, 0.12)";const o=at(t,s,{label:"ベスト",hint:`⭐ ${s}`,size:"hero",scope:"stage-clear-best"});return o.style.minWidth="150px",o.style.padding="0.75rem 0.9rem",o.style.borderRadius="20px",o.style.background="rgba(255, 255, 255, 0.12)",i.append(a,o),i}createNextAdventureCard(t){const e=document.createElement("section");e.setAttribute("data-stage-clear-next-preview",""),e.style.cssText=`
      margin-top: 1.1rem;
      width: min(88vw, 420px);
      padding: 1rem 1.1rem 1.15rem;
      border-radius: 28px;
      background: linear-gradient(180deg, rgba(30, 46, 112, 0.92), rgba(12, 22, 66, 0.96));
      border: 2px solid rgba(255, 255, 255, 0.18);
      box-shadow: 0 14px 32px rgba(0, 0, 0, 0.26);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.45rem;
    `;const s=this.createHeading("つぎのぼうけん",`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 1rem;
      font-weight: 700;
      color: #b9d7ff;
      letter-spacing: 0.08em;
    `),i=this.createHeading(`つぎは ${t.reading}！`,`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(1.5rem, 5.2vmin, 2.05rem);
      font-weight: 900;
      color: #fff4a3;
      text-shadow: 0 0 14px rgba(255, 230, 120, 0.25);
    `);i.setAttribute("data-stage-clear-next-title","");const a=document.createElement("div");a.textContent=t.emoji,a.setAttribute("data-stage-clear-next-emoji",""),a.style.cssText=`
      font-size: clamp(3.2rem, 13vmin, 4.8rem);
      line-height: 1;
      filter: drop-shadow(0 8px 12px rgba(0, 0, 0, 0.24));
    `;const o=this.createHeading(t.reading,`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(1.35rem, 4.8vmin, 1.8rem);
      font-weight: 800;
      color: #ffffff;
    `);o.setAttribute("data-stage-clear-next-name","");const n=this.createHeading(t.trivia,`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(1.02rem, 3.9vmin, 1.2rem);
      font-weight: 700;
      color: #dfeaff;
      line-height: 1.45;
    `);return n.setAttribute("data-stage-clear-next-trivia",""),e.append(s,i,a,o,n),e}createActionButtons(t){const e=document.createElement("div");e.style.cssText=`
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.9rem;
      width: 100%;
      margin-top: 1.4rem;
    `;const s=document.createElement("button");s.setAttribute("data-stage-clear-retry",""),s.setAttribute("aria-label","もういちど"),s.textContent="もういちど",s.disabled=!0,s.style.cssText=`
      min-width: min(72vw, 300px);
      min-height: 88px;
      padding: 0.95rem 1.7rem;
      border: none;
      border-radius: 999px;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(1.35rem, 4.6vmin, 1.9rem);
      font-weight: 900;
      color: #fff;
      background: rgba(255, 255, 255, 0.2);
      box-shadow: 0 10px 26px rgba(0, 0, 0, 0.26);
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      touch-action: manipulation;
      transform: scale(1);
      transition: opacity 0.18s ease-out, transform 0.08s ease-out;
    `,s.style.opacity="0",s.style.visibility="hidden",s.style.pointerEvents="none";const i=document.createElement("button");return i.setAttribute("data-stage-clear-continue",""),i.setAttribute("aria-label",t.continueLabel),i.textContent=t.continueLabel,i.disabled=!0,i.style.cssText=`
      min-width: min(78vw, 320px);
      min-height: 88px;
      padding: 1rem 1.8rem;
      border: none;
      border-radius: 999px;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(1.5rem, 5vmin, 2.1rem);
      font-weight: 900;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      touch-action: manipulation;
      transform: scale(1);
      transition: opacity 0.18s ease-out, transform 0.08s ease-out;
    `,i.style.opacity="0",i.style.visibility="hidden",i.style.pointerEvents="none",this.attachActionHandlers(s,t.onRetry),this.attachActionHandlers(i,t.onContinue),this.retryButton=s,this.continueButton=i,e.append(s,i),e}attachActionHandlers(t,e){const s=()=>!this.isRewardOpen&&this.isContinueEnabled&&!this.hasHandledContinue,i=k(t,{canActivate:s,onActivate:()=>{if(s()){this.hasHandledContinue=!0;for(const a of[this.retryButton,this.continueButton])a&&(a.disabled=!0,a.style.pointerEvents="none",a.style.transform="scale(1)");e()}},onPressChange:a=>{t.style.transform=a?"scale(0.96)":"scale(1)"},preventDefaultOnPointerDown:!0,preventDefaultOnClick:!0,stopPropagation:!0});this.buttonCleanups.add(i)}appendClearCelebrationBurst(){if(!this.overlayEl)return;const t=document.createElement("div");t.setAttribute("data-stage-clear-burst",""),t.style.cssText=`
      position: absolute;
      inset: 0;
      overflow: hidden;
      pointer-events: none;
      z-index: 0;
    `;const e=[{emoji:"⭐",x:"0px",y:"-164px",midX:"0px",midY:"-84px",size:"2.6rem",scale:"1.12",delay:"0ms",duration:"1500ms"},{emoji:"✨",x:"138px",y:"-108px",midX:"72px",midY:"-56px",size:"2.2rem",scale:"0.96",delay:"90ms",duration:"1440ms"},{emoji:"🌟",x:"176px",y:"-10px",midX:"96px",midY:"-8px",size:"2.5rem",scale:"1.04",delay:"150ms",duration:"1520ms"},{emoji:"⭐",x:"136px",y:"112px",midX:"74px",midY:"58px",size:"2.3rem",scale:"0.92",delay:"220ms",duration:"1480ms"},{emoji:"✨",x:"0px",y:"170px",midX:"0px",midY:"88px",size:"2rem",scale:"0.88",delay:"280ms",duration:"1400ms"},{emoji:"🌟",x:"-142px",y:"118px",midX:"-76px",midY:"60px",size:"2.4rem",scale:"1.02",delay:"340ms",duration:"1500ms"},{emoji:"⭐",x:"-182px",y:"-8px",midX:"-98px",midY:"-6px",size:"2.6rem",scale:"1.08",delay:"410ms",duration:"1560ms"},{emoji:"✨",x:"-126px",y:"-118px",midX:"-68px",midY:"-64px",size:"2.1rem",scale:"0.94",delay:"470ms",duration:"1460ms"},{emoji:"🌟",x:"78px",y:"-182px",midX:"40px",midY:"-96px",size:"2rem",scale:"0.86",delay:"520ms",duration:"1380ms"}];for(const s of e){const i=document.createElement("span");i.setAttribute("data-stage-clear-burst-emoji",""),i.setAttribute("aria-hidden","true"),i.textContent=s.emoji,i.style.cssText=`
        position: absolute;
        left: 50%;
        top: 50%;
        font-size: ${s.size};
        line-height: 1;
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.3);
        will-change: transform, opacity;
        animation: stageClearEmojiBurst ${s.duration} ease-out ${s.delay} forwards;
        --stage-clear-burst-mid-x: ${s.midX};
        --stage-clear-burst-mid-y: ${s.midY};
        --stage-clear-burst-x: ${s.x};
        --stage-clear-burst-y: ${s.y};
        --stage-clear-burst-scale: ${s.scale};
      `,t.appendChild(i)}this.overlayEl.appendChild(t)}injectBestStageStarsAnimation(){if(document.getElementById("best-stage-stars-animation"))return;const t=document.createElement("style");t.id="best-stage-stars-animation",t.textContent=`
      @keyframes bestStageStarsPop {
        0%   { transform: scale(0.6); opacity: 0; }
        60%  { transform: scale(1.2); opacity: 1; }
        100% { transform: scale(1.0); opacity: 1; }
      }
    `,document.head.appendChild(t)}injectStageClearBurstAnimation(){if(document.getElementById("stage-clear-burst-animation"))return;const t=document.createElement("style");t.id="stage-clear-burst-animation",t.textContent=`
      @keyframes stageClearEmojiBurst {
        0% {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.3);
        }
        22% {
          opacity: 1;
          transform: translate(
            calc(-50% + var(--stage-clear-burst-mid-x)),
            calc(-50% + var(--stage-clear-burst-mid-y))
          ) scale(calc(var(--stage-clear-burst-scale) * 0.82));
        }
        100% {
          opacity: 0;
          transform: translate(
            calc(-50% + var(--stage-clear-burst-x)),
            calc(-50% + var(--stage-clear-burst-y))
          ) scale(var(--stage-clear-burst-scale));
        }
      }
    `,document.head.appendChild(t)}}const st=1,xe=2e3;function Se(r){const t=window.requestIdleCallback;if(typeof t=="function"){t(r,{timeout:1500});return}window.setTimeout(r,800)}class d{static VISUAL_QUALITY_SCALE_BY_TIER=[.45,.7,1];static BG_STAR_COUNT=xe;static ASSIST_TRIGGER_HIT_WINDOW=6;static ASSIST_TRIGGER_HIT_COUNT=2;static ASSIST_DURATION=5;static ASSIST_MESSAGE_DURATION=3;static ASSIST_METEORITE_INTERVAL_MULTIPLIER=1.7;static ASSIST_MESSAGE="だいじょうぶ！ ゆっくりいこう ✨";static ASSIST_DIRECTION_REFRESH_INTERVAL=.35;static ASSIST_DIRECTION_LOOKAHEAD=42;static ASSIST_DIRECTION_SIDE_TARGET_X=4.5;static ASSIST_DIRECTION_SIDE_RANGE=7.5;static ASSIST_DIRECTION_DIFF_THRESHOLD=1.1;static ASSIST_DIRECTION_DIFF_RATIO=.28;threeScene;camera;lastAspect=0;initialized=!1;sceneManager;inputSystem;audioManager;saveManager;ambientLight;directionalLight;spaceship;stars=[];meteorites=[];collisionSystem=new It;scoreSystem=new kt;spawnSystem=new Dt;boostSystem=new Lt;hud;scorePopupManager=new L;particleBurstManager=new Ht;airShield;stageConfig;stageNumber=1;launchSource="campaign";isCleared=!1;clearTimer=0;stageClearOverlay=new Ce;isClearRewardOpen=!1;isOpeningClearReward=!1;clearRewardOverlay=null;clearRewardOverlayPromise=null;static CLEAR_CONTINUE_DELAY=.6;stageEntryTotalScore=0;stageEntryTotalStarCount=0;playTime=0;meteoriteHitTimes=[];assistTimer=0;assistMessageTimer=0;assistDirection=null;assistDirectionRefreshTimer=0;damageTimer=0;static DAMAGE_FLASH_DURATION=.5;cameraShakeTimer=0;cameraShakeElapsed=0;cameraShakeOffset=new St;static CAMERA_SHAKE_DURATION=.28;static CAMERA_SHAKE_AMPLITUDE_X=.18;static CAMERA_SHAKE_AMPLITUDE_Y=.12;static CAMERA_SHAKE_FREQUENCY=42;destinationPlanet=null;destinationPlanetSpinTarget=null;static DESTINATION_PLANET_SPIN_SPEED=.2;static BOOST_HINT_INITIAL_DELAY=3.5;static BOOST_HINT_REPEAT_DELAY=12;static BOOST_HINT_DURATION=2.4;static BOOST_HINT_MESSAGE="🚀 いまだよ！";bgStars=null;boostLinesEffect;companionManager=null;elapsedTime=0;boostFlameEffect;isStarting=!1;stageIntroOverlay=null;countdownOverlay=null;awaitingResume=!1;resumeCountdownOverlay=null;isHomeConfirmOpen=!1;shouldResumeAfterHomeConfirm=!1;pauseOverlay=new Mt;isPauseOpen=!1;shouldResumeAfterPause=!1;touchGuide=new Ee;touchGuideMode="intro";touchGuideIdleTimer=0;hasSeenMoveInput=!1;isActive=!1;boostHintReadyTimer=0;boostHintDisplayTimer=0;boostHintNextTrigger=d.BOOST_HINT_INITIAL_DELAY;prewarmRequestToken=0;static TOUCH_GUIDE_IDLE_DELAY=3;visualQualityTier=d.VISUAL_QUALITY_SCALE_BY_TIER.length-1;scheduleIdleTask;loadEncyclopediaOverlay;clearRewardRequestToken=0;onPauseRequested=null;onResumeRequested=null;onExitHomeRequested=null;constructor(t,e,s,i,a={}){this.sceneManager=t,this.inputSystem=e,this.audioManager=s,this.saveManager=i,this.scheduleIdleTask=a.scheduleIdleTask??Se,this.loadEncyclopediaOverlay=a.loadEncyclopediaOverlay??(()=>it(()=>import("./EncyclopediaOverlay-BWmJIwdV.js"),__vite__mapDeps([0,1,2]))),this.threeScene=new W,this.threeScene.background=new ut(32);const{width:o,height:n}=H();this.camera=new dt(60,o/n,.1,2e3)}ensureInitialized(){this.initialized||(this.ambientLight=new ct(16777215,.6),this.directionalLight=new Zt(16777215,.8),this.directionalLight.position.set(5,10,5),this.threeScene.add(this.ambientLight),this.threeScene.add(this.directionalLight),this.spaceship=new _t,this.threeScene.add(this.spaceship.mesh),this.airShield=new Gt,this.threeScene.add(this.airShield.getMesh()),this.companionManager=new xt([]),this.threeScene.add(this.companionManager.getGroup()),this.boostLinesEffect=new Ft,this.boostLinesEffect.init(this.threeScene),this.boostFlameEffect=new Nt,this.boostFlameEffect.init(this.threeScene),this.hud=new fe,this.initialized=!0,this.applyVisualQualityTier())}setVisualQualityTier(t){this.visualQualityTier=d.clampVisualQualityTier(t),this.applyVisualQualityTier()}enter(t){this.ensureInitialized(),this.isActive=!0,this.prewarmRequestToken+=1,this.clearRewardRequestToken+=1,this.lastAspect=0,this.stageNumber=t.stageNumber??1,this.launchSource=t.launchSource??"campaign",this.stageConfig=nt(this.stageNumber),this.prefetchEndingSceneModuleIfNeeded(),this.isCleared=!1,this.clearTimer=0,this.stageClearOverlay.hide(),this.isClearRewardOpen=!1,this.isOpeningClearReward=!1,this.damageTimer=0,this.elapsedTime=0,this.destinationPlanetSpinTarget=null,this.isHomeConfirmOpen=!1,this.shouldResumeAfterHomeConfirm=!1,this.isPauseOpen=!1,this.shouldResumeAfterPause=!1,this.pauseOverlay.hide(),this.touchGuideIdleTimer=0,this.hasSeenMoveInput=!1,this.touchGuideMode="intro",this.playTime=0,this.meteoriteHitTimes.length=0,this.assistTimer=0,this.assistMessageTimer=0,this.assistDirection=null,this.assistDirectionRefreshTimer=0,this.resetBoostHintState();const e=t.totalScore??0,s=t.totalStarCount??0,i=this.saveManager.load(),a=i.colorAccessibility?.highContrast===!0;$t(a),jt(a),this.hud.setHighContrastMode(a),this.scorePopupManager.setHighContrastMode(a),this.stageEntryTotalScore=e,this.stageEntryTotalStarCount=s,this.scoreSystem.setTotalScore(e),this.scoreSystem.setTotalStarCount(s),this.resetStageObjects(),this.spaceship.reset(),this.inputSystem.resetPointers?.(),this.airShield.reset(0,0,0),this.boostLinesEffect.update(!1,0,0),this.boostFlameEffect.remove(),this.companionManager?.resetUnlockedPlanets([]),this.createBackground(),this.applyVisualQualityTier(),this.camera.position.set(0,5,10),this.camera.lookAt(0,0,-10),this.createDestinationPlanet(),this.scheduleNextStageVisualPrewarm(),this.stars.length=0,this.meteorites.length=0,this.spawnSystem.reset(),this.spawnSystem.setMeteoriteIntervalMultiplier(1),this.boostSystem.reset(),this.scoreSystem.resetStage();const o=`ステージ${this.stageConfig.stageNumber}: ${this.stageConfig.emoji} ${this.stageConfig.displayName}`;this.hud.show(o,this.stageConfig.planetColor),this.hud.setBoostCallback(()=>{this.inputSystem.setBoostPressed(!0)}),this.hud.setBoostDeniedCallback(()=>{this.audioManager.playSFX("boostDenied")}),this.hud.setHomeCallback(()=>{this.isHomeConfirmOpen=!1,this.shouldResumeAfterHomeConfirm=!1,this.syncBoostInputLock(),this.syncPauseAvailability(),this.sceneManager.requestTransition("title")}),this.hud.setHomeConfirmOpenCallback(()=>{this.shouldResumeAfterHomeConfirm=this.isPlaying(),this.clearBlockedGameplayInput(),this.isHomeConfirmOpen=!0,this.syncBoostInputLock(),this.syncPauseAvailability()}),this.hud.setHomeConfirmCancelCallback(()=>{const n=this.shouldResumeAfterHomeConfirm;if(this.isHomeConfirmOpen=!1,this.shouldResumeAfterHomeConfirm=!1,this.syncPauseAvailability(),n){this.requestResumeCountdown();return}this.syncBoostInputLock()}),this.hud.setPauseCallback(()=>{this.requestManualPause()}),this.hud.setMuteState(this.audioManager.isMuted()),this.hud.setMuteCallback(()=>{const n=this.audioManager.toggleMute();this.hud.setMuteState(n);const h=this.saveManager.load();h.muted=n,this.saveManager.save(h)}),this.hud.update(this.scoreSystem.getStageScore(),this.scoreSystem.getStarCount()),this.hud.hideAssistMessage(),this.touchGuide.show("intro"),this.syncPauseAvailability(),this.hud.setBestStarCount(i.bestStageStars?.[this.stageNumber]??0),this.companionManager?.resetUnlockedPlanets(i.unlockedPlanets),this.bgStars&&tt(this.bgStars,this.spaceship.position.z,st),this.audioManager.playBGM(this.stageNumber),this.stageIntroOverlay?.dispose(),this.stageIntroOverlay=null,this.startOpeningSequence(t)}prefetchEndingSceneModuleIfNeeded(){if(this.stageNumber<I-1)return;this.sceneManager.prefetchSceneModule?.call(this.sceneManager,"ending")?.catch(()=>{})}startOpeningSequence(t){if(this.isStarting=!0,this.syncBoostInputLock(),this.syncPauseAvailability(),!this.shouldShowStageIntro(t)){this.startCountdown();return}const e=X(this.stageNumber);if(!e){this.startCountdown();return}this.stageIntroOverlay=new ve(e),this.stageIntroOverlay.show(()=>{this.stageIntroOverlay=null,this.startCountdown()})}startCountdown(){if(this.isStarting=!0,this.syncBoostInputLock(),this.syncPauseAvailability(),this.shouldSkipCountdown()){this.isStarting=!1,this.countdownOverlay=null,this.syncBoostInputLock(),this.syncPauseAvailability();return}this.countdownOverlay=new Et({onTick:()=>{this.audioManager.playSFX("countdownTick")},onGo:()=>{this.audioManager.playSFX("countdownGo")}}),this.countdownOverlay.show(()=>{this.isStarting=!1,this.countdownOverlay=null,this.syncBoostInputLock(),this.syncPauseAvailability()})}shouldShowStageIntro(t){return this.shouldSkipCountdown()||this.launchSource!=="campaign"||t.replayToken!==void 0||t.totalScore===void 0||t.totalStarCount===void 0?!1:X(this.stageNumber)!==void 0}releasePointerInputForLock(){this.inputSystem.resetPointers?.()}syncBoostInputLock(){const t=this.isStarting||this.awaitingResume||this.isHomeConfirmOpen||this.isPauseOpen;this.hud.setBoostLocked(t),t&&(this.resetBoostHintState(),this.inputSystem.setBoostPressed?.(!1))}clearBlockedGameplayInput(){this.inputSystem.resetPointers?.(),this.inputSystem.setBoostPressed?.(!1)}syncPauseAvailability(){this.hud.setPauseEnabled(this.canPause())}shouldSkipCountdown(){try{return new URLSearchParams(window.location.search).get("nocount")==="1"}catch{return!1}}isPlaying(){return!(!this.stageConfig||this.isCleared||this.isClearRewardOpen||this.isOpeningClearReward||this.isStarting||this.awaitingResume||this.isHomeConfirmOpen||this.isPauseOpen)}isUserPaused(){return this.isPauseOpen}requestResumeCountdown(){this.isPlaying()&&(this.resumeCountdownOverlay||this.shouldSkipCountdown()||(this.clearBlockedGameplayInput(),this.awaitingResume=!0,this.syncBoostInputLock(),this.syncPauseAvailability(),this.resumeCountdownOverlay=new Et({onTick:()=>{this.audioManager.playSFX("countdownTick")},onGo:()=>{this.audioManager.playSFX("countdownGo")}}),this.resumeCountdownOverlay.show(()=>{this.awaitingResume=!1,this.resumeCountdownOverlay=null,this.syncBoostInputLock(),this.syncPauseAvailability()})))}setPauseHandlers(t){this.onPauseRequested=t.onPauseRequested??null,this.onResumeRequested=t.onResumeRequested??null,this.onExitHomeRequested=t.onExitHomeRequested??null}isManuallyPaused(){return this.isPauseOpen}requestManualPause(){this.canPause()&&(this.clearBlockedGameplayInput(),this.isPauseOpen=!0,this.syncBoostInputLock(),this.syncPauseAvailability(),this.pauseOverlay.show(()=>{this.isPauseOpen=!1,this.syncBoostInputLock(),this.syncPauseAvailability(),this.onResumeRequested?.()},()=>{this.isPauseOpen=!1,this.syncBoostInputLock(),this.syncPauseAvailability(),this.onExitHomeRequested?.()}),this.onPauseRequested?.())}canPause(){return!(!this.stageConfig||this.isCleared||this.isClearRewardOpen||this.isOpeningClearReward||this.isStarting||this.awaitingResume||this.isHomeConfirmOpen||this.isPauseOpen)}createBackground(){this.bgStars||(this.bgStars=ne(this.getBackgroundStarDrawCount()),this.threeScene.add(this.bgStars))}createDestinationPlanet(){this.removeDestinationPlanet();const t=-(this.stageConfig.stageLength+50),{planet:e,spinTarget:s}=ae(this.stageNumber,this.stageConfig,t);this.destinationPlanet=e,this.destinationPlanetSpinTarget=s,this.threeScene.add(this.destinationPlanet)}scheduleNextStageVisualPrewarm(){const t=this.stageNumber+1;if(t>I)return;const e=this.prewarmRequestToken;this.scheduleIdleTask(()=>{!this.isActive||this.prewarmRequestToken!==e||ft(t)})}removeDestinationPlanet(){this.destinationPlanet&&(this.destinationPlanet.parent?.remove(this.destinationPlanet),this.destinationPlanet=null,this.destinationPlanetSpinTarget=null)}resetStageObjects(){this.clearRewardOverlay?.hide(),this.stageClearOverlay.hide(),this.isClearRewardOpen=!1,this.isOpeningClearReward=!1,this.removeDestinationPlanet(),this.resetCameraShake(),this.particleBurstManager.clear(this.threeScene),this.spawnSystem.recycleAll(),this.spawnSystem.setMeteoriteIntervalMultiplier(1),this.stars.length=0,this.meteorites.length=0,this.hud?.hideAssistMessage(),this.resetBoostHintState()}update(t){if(!this.initialized)return;if(this.isCleared){this.resetBoostHintState(),this.clearTimer+=t,this.companionManager?.update(t,this.spaceship.position.x,this.spaceship.position.y,this.spaceship.position.z),this.revealClearActionButtonsIfReady();return}if(this.isStarting||this.awaitingResume||this.isHomeConfirmOpen||this.isPauseOpen){if(this.resetBoostHintState(),this.inputSystem.setBoostPressed?.(!1),!this.isHomeConfirmOpen&&!this.isPauseOpen){const l=this.stageIntroOverlay?.isActive()??!1;this.stageIntroOverlay?.tick(t),l||this.countdownOverlay?.tick(t),this.resumeCountdownOverlay?.tick(t)}this.destinationPlanetSpinTarget&&(this.destinationPlanetSpinTarget.rotation.y+=t*d.DESTINATION_PLANET_SPIN_SPEED),this.bgStars&&tt(this.bgStars,this.spaceship.position.z,st),this.airShield.setPosition(this.spaceship.position.x,this.spaceship.position.y,this.spaceship.position.z),this.airShield.update(t),this.hud.update(this.scoreSystem.getStageScore(),this.scoreSystem.getStarCount());return}const e=this.inputSystem.getState();this.playTime+=t,this.updateAssistTimers(t),this.updateTouchGuide(e.moveDirection,t);const s=this.boostSystem.isActive(),i=this.boostSystem.isAvailable();e.boostPressed&&(this.boostSystem.activate()?(this.audioManager.playSFX("boost"),this.audioManager.startBoostSFX(),this.boostFlameEffect.start()):this.audioManager.playSFX("boostDenied"),this.inputSystem.setBoostPressed(!1)),this.boostSystem.update(t),s&&!this.boostSystem.isActive()&&(this.audioManager.stopBoostSFX(),this.boostFlameEffect.stopEmitting()),!i&&this.boostSystem.isAvailable()&&(this.audioManager.playSFX("boostReady"),this.hud.flashBoostReady()),this.updateBoostHint(t),this.boostSystem.isActive()&&this.spaceship.speedState!=="BOOST"&&this.spaceship.activateBoost(),e.moveDirection===-1?this.spaceship.moveLeft(t):e.moveDirection===1&&this.spaceship.moveRight(t),this.spaceship.update(t);const a=this.spawnSystem.update(t,this.spaceship.position.z,this.stageConfig,this.stars,this.meteorites);for(const l of a.newStars)this.stars.push(l),this.threeScene.add(l.mesh);for(const l of a.newMeteorites)this.meteorites.push(l),this.threeScene.add(l.mesh);this.companionManager?.update(t,this.spaceship.position.x,this.spaceship.position.y,this.spaceship.position.z);const o=this.companionManager?.getStarAttractionBonus()??0,n=this.collisionSystem.check(this.spaceship,this.stars,this.meteorites,o);for(const l of n.starCollisions)this.scoreSystem.addStarScore(l.starType),l.starType==="RAINBOW"?(this.audioManager.playSFX("rainbowCollect"),this.particleBurstManager.emit(this.threeScene,l.position.x,l.position.y,l.position.z,16768256,50,!0)):(this.audioManager.playSFX("starCollect"),this.particleBurstManager.emit(this.threeScene,l.position.x,l.position.y,l.position.z,16768256,20,!1));if(n.meteoriteCollision){if(n.meteoriteHit){const l=n.meteoriteHit;l.isActive=!1,l.mesh.visible=!1,this.particleBurstManager.emit(this.threeScene,l.position.x,l.position.y,l.position.z,16755268,24,!1)}this.spaceship.onMeteoriteHit(),this.hud.announceMeteoriteHit(),this.recordMeteoriteHit(),this.boostSystem.cancel(),this.damageTimer=d.DAMAGE_FLASH_DURATION,this.startCameraShake(),this.audioManager.playSFX("meteoriteHit"),this.audioManager.stopBoostSFX(),this.boostFlameEffect.remove()}this.updateDamageEffect(t),this.cleanupPassedObjects(t),this.updateCameraFollow(t);for(const l of n.starCollisions)this.scorePopupManager.show(l.scoreValue,l.position,this.camera);if(this.stageNumber===10&&this.destinationPlanet){const l=1+Math.sin(this.elapsedTime*2)*.05;this.destinationPlanet.scale.set(l,l,l)}this.destinationPlanetSpinTarget&&(this.destinationPlanetSpinTarget.rotation.y+=t*d.DESTINATION_PLANET_SPIN_SPEED),this.elapsedTime+=t,this.bgStars&&tt(this.bgStars,this.spaceship.position.z,st),this.boostLinesEffect.update(this.boostSystem.isActive(),this.spaceship.position.x,this.spaceship.position.z),this.boostSystem.isActive()&&this.boostFlameEffect.emit(this.spaceship.position,this.boostSystem.getDurationProgress()),this.boostFlameEffect.update(t),this.airShield.setPosition(this.spaceship.position.x,this.spaceship.position.y,this.spaceship.position.z),this.boostSystem.isActive()?this.airShield.setShieldMode("BOOST"):this.spaceship.speedState==="SLOWDOWN"?this.airShield.setShieldMode("INVINCIBLE",1):this.spaceship.speedState==="RECOVERING"?this.airShield.setShieldMode("INVINCIBLE",this.spaceship.getSpeedStateRemainingRatio()):this.airShield.setShieldMode("OFF"),this.airShield.update(t),this.particleBurstManager.update(this.threeScene,t),this.hud.update(this.scoreSystem.getStageScore(),this.scoreSystem.getStarCount()),this.hud.updateCooldown(this.boostSystem.getCooldownProgress());const h=this.spaceship.getProgress(this.stageConfig.stageLength);this.hud.updateStageProgress(h),h>=1&&this.onStageClear()}updateTouchGuide(t,e){if(this.assistTimer>0){this.setTouchGuideMode(this.getAssistTouchGuideMode());return}if(t!==0){this.touchGuideIdleTimer=0,this.hasSeenMoveInput=!0,this.setTouchGuideMode(t<0?"active-left":"active-right");return}if(!this.hasSeenMoveInput){this.setTouchGuideMode("intro");return}if(this.touchGuideIdleTimer+=e,this.touchGuideIdleTimer>=d.TOUCH_GUIDE_IDLE_DELAY){this.setTouchGuideMode("idle");return}this.setTouchGuideMode("hidden")}setTouchGuideMode(t){this.touchGuideMode!==t&&(this.touchGuideMode=t,this.touchGuide.setMode(t))}resetAssistNavigation(){this.meteoriteHitTimes.length=0,this.assistTimer=0,this.assistMessageTimer=0,this.assistDirection=null,this.assistDirectionRefreshTimer=0}updateAssistTimers(t){this.assistTimer>0&&(this.assistDirectionRefreshTimer=Math.max(0,this.assistDirectionRefreshTimer-t),this.assistDirectionRefreshTimer===0&&this.refreshAssistDirection(),this.assistTimer=Math.max(0,this.assistTimer-t),this.assistTimer===0&&(this.spawnSystem.setMeteoriteIntervalMultiplier(1),this.assistDirection=null,this.assistDirectionRefreshTimer=0)),this.assistMessageTimer>0&&(this.assistMessageTimer=Math.max(0,this.assistMessageTimer-t),this.assistMessageTimer===0&&this.hud.hideAssistMessage())}resetBoostHintState(){this.boostHintReadyTimer=0,this.boostHintDisplayTimer=0,this.boostHintNextTrigger=d.BOOST_HINT_INITIAL_DELAY,this.hud?.hideBoostHint()}updateBoostHint(t){if(!(this.boostSystem.isAvailable()&&!this.boostSystem.isActive())){this.resetBoostHintState();return}this.boostHintDisplayTimer>0&&(this.boostHintDisplayTimer=Math.max(0,this.boostHintDisplayTimer-t),this.boostHintDisplayTimer===0&&this.hud.hideBoostHint()),this.boostHintReadyTimer+=t,!(this.boostHintReadyTimer<this.boostHintNextTrigger)&&(this.hud.showBoostHint(d.BOOST_HINT_MESSAGE),this.boostHintDisplayTimer=d.BOOST_HINT_DURATION,this.boostHintReadyTimer=0,this.boostHintNextTrigger=d.BOOST_HINT_REPEAT_DELAY)}recordMeteoriteHit(){const t=this.playTime;for(this.meteoriteHitTimes.push(t);this.meteoriteHitTimes.length>0&&t-this.meteoriteHitTimes[0]>d.ASSIST_TRIGGER_HIT_WINDOW;)this.meteoriteHitTimes.shift();this.assistTimer>0||this.meteoriteHitTimes.length<d.ASSIST_TRIGGER_HIT_COUNT||this.activateAssistMode()}activateAssistMode(){this.assistTimer=d.ASSIST_DURATION,this.assistMessageTimer=d.ASSIST_MESSAGE_DURATION,this.assistDirectionRefreshTimer=0,this.refreshAssistDirection(),this.spawnSystem.setMeteoriteIntervalMultiplier(d.ASSIST_METEORITE_INTERVAL_MULTIPLIER),this.hud.showAssistMessage(d.ASSIST_MESSAGE),this.meteoriteHitTimes.length=0}refreshAssistDirection(){this.assistDirection=this.getSaferAssistDirection(),this.assistDirectionRefreshTimer=d.ASSIST_DIRECTION_REFRESH_INTERVAL}getAssistTouchGuideMode(){return this.assistDirection==="left"?"assist-left":this.assistDirection==="right"?"assist-right":"hidden"}getSaferAssistDirection(){const t=this.spaceship.position.x,e=this.spaceship.position.z,s=Math.min(t-2.5,-d.ASSIST_DIRECTION_SIDE_TARGET_X),i=Math.max(t+2.5,d.ASSIST_DIRECTION_SIDE_TARGET_X);let a=0,o=0;for(const l of this.meteorites){if(!l.isActive)continue;const c=e-l.position.z;if(c<0||c>d.ASSIST_DIRECTION_LOOKAHEAD)continue;const u=1+(d.ASSIST_DIRECTION_LOOKAHEAD-c)/7,g=Math.abs(l.position.x-s),m=Math.abs(l.position.x-i),f=Math.max(0,1-g/d.ASSIST_DIRECTION_SIDE_RANGE),p=Math.max(0,1-m/d.ASSIST_DIRECTION_SIDE_RANGE);a+=u*f,o+=u*p}const n=Math.abs(a-o),h=Math.max(a,o);return n<d.ASSIST_DIRECTION_DIFF_THRESHOLD||h>0&&n<h*d.ASSIST_DIRECTION_DIFF_RATIO?null:a<o?"left":"right"}updateDamageEffect(t){if(this.damageTimer>0){if(this.damageTimer-=t,this.damageTimer<=0){this.damageTimer=0,this.spaceship.mesh.rotation.z=0,this.spaceship.mesh.rotation.y=0,this.spaceship.mesh.visible=!0;return}const e=Math.sin(this.damageTimer*30)*.3;this.spaceship.mesh.rotation.z=e,this.spaceship.mesh.rotation.y=0;const s=Math.sin(this.damageTimer*20)>0;this.spaceship.mesh.visible=s}else this.spaceship.mesh.visible=!0}resetCameraShake(){this.cameraShakeTimer=0,this.cameraShakeElapsed=0,this.cameraShakeOffset.set(0,0,0)}startCameraShake(){this.cameraShakeTimer=d.CAMERA_SHAKE_DURATION,this.cameraShakeElapsed=0}updateCameraShake(t){if(this.cameraShakeTimer<=0){this.cameraShakeOffset.set(0,0,0);return}if(this.cameraShakeElapsed+=t,this.cameraShakeTimer=Math.max(0,this.cameraShakeTimer-t),this.cameraShakeTimer===0){this.cameraShakeOffset.set(0,0,0);return}const e=this.cameraShakeTimer/d.CAMERA_SHAKE_DURATION,s=this.cameraShakeElapsed*d.CAMERA_SHAKE_FREQUENCY;this.cameraShakeOffset.set(Math.sin(s)*d.CAMERA_SHAKE_AMPLITUDE_X*e,Math.cos(s*.8)*d.CAMERA_SHAKE_AMPLITUDE_Y*e,0)}updateCameraFollow(t){this.updateCameraShake(t),this.camera.position.set(this.spaceship.position.x*.3+this.cameraShakeOffset.x,5+this.cameraShakeOffset.y,this.spaceship.position.z+12),this.camera.lookAt(this.spaceship.position.x*.5,0,this.spaceship.position.z-20)}cleanupPassedObjects(t){const e=this.spaceship.position.z,s=e+30,i=this.stars;let a=0;for(let h=0;h<i.length;h++){const l=i[h];l.isCollected||l.position.z>s?this.spawnSystem.releaseStar(l):(l.update(t,e),a!==h&&(i[a]=l),a++)}i.length=a;const o=this.meteorites;let n=0;for(let h=0;h<o.length;h++){const l=o[h];!l.isActive||l.position.z>s?this.spawnSystem.releaseMeteorite(l):(l.isActive&&l.update(t,e),n!==h&&(o[n]=l),n++)}o.length=n}onStageClear(){this.isCleared=!0,this.clearTimer=0,this.stageClearOverlay.hide(),this.resetAssistNavigation(),this.resetBoostHintState(),this.touchGuide.hide(),this.syncPauseAvailability();const t=this.saveManager.markStageCleared(this.stageNumber);this.audioManager.playSFX("stageClear"),this.audioManager.stopBoostSFX(),this.boostFlameEffect.remove();const e=this.scoreSystem.getStarCount(),s=this.saveManager.load().bestStageStars?.[this.stageNumber]??0;this.saveManager.updateBestStageStars(this.stageNumber,e);const i=Math.max(s,e),a=e>s;t&&(this.companionManager?.addCompanion(this.stageNumber),this.prefetchClearRewardOverlay()),this.showClearMessage(a,e,t,i),this.hud.announceStageClear(e,t,a),a&&this.audioManager.playSFX("rainbowCollect")}getClearRewardOverlay(){return this.clearRewardOverlay?Promise.resolve(this.clearRewardOverlay):this.clearRewardOverlayPromise?this.clearRewardOverlayPromise:(this.clearRewardOverlayPromise=this.loadEncyclopediaOverlay().then(({EncyclopediaOverlay:t})=>{const e=new t;return this.clearRewardOverlay=e,e}).finally(()=>{this.clearRewardOverlayPromise=null}),this.clearRewardOverlayPromise)}isCurrentClearRewardRequest(t){return this.isActive&&this.clearRewardRequestToken===t}restoreClearRewardButton(){this.stageClearOverlay.setRewardOpen(!1)}prefetchClearRewardOverlay(){this.clearRewardOverlay||this.clearRewardOverlayPromise||this.getClearRewardOverlay().catch(()=>{})}async openClearRewardOverlay(t){if(this.isClearRewardOpen||this.isOpeningClearReward)return;const e=this.clearRewardRequestToken;this.isOpeningClearReward=!0,this.stageClearOverlay.setRewardOpen(!0);try{const s=this.clearRewardOverlay??await this.getClearRewardOverlay();if(!this.isCurrentClearRewardRequest(e))return;if(!s.showStageDetail(this.stageNumber,()=>{this.isCurrentClearRewardRequest(e)&&(this.isClearRewardOpen=!1,this.syncPauseAvailability(),this.restoreClearRewardButton())},{bestStageStars:{[this.stageNumber]:t},backLabel:"クリアへ もどる",zIndex:50})){this.restoreClearRewardButton();return}this.isClearRewardOpen=!0,this.syncPauseAvailability()}catch{if(!this.isCurrentClearRewardRequest(e))return;this.restoreClearRewardButton()}finally{this.clearRewardRequestToken===e&&(this.isOpeningClearReward=!1,this.syncPauseAvailability(),this.isClearRewardOpen||this.restoreClearRewardButton())}}showClearMessage(t=!1,e,s=!1,i){const a=e??this.scoreSystem.getStarCount(),o=i??a,n=this.launchSource==="encyclopedia"?void 0:zt(this.stageNumber),h=s?X(this.stageNumber):void 0;this.stageClearOverlay.show({stageNumber:this.stageNumber,starCount:a,bestStarCount:o,isBestUpdated:t,continueLabel:this.launchSource==="encyclopedia"?"タイトルへ":this.stageNumber>=I?"おいわいへ":"つぎへ",nextEntry:n,rewardEntry:h,onContinue:()=>{this.handleStageComplete()},onRetry:()=>{this.handleStageRetry()},onReward:h?()=>{this.openClearRewardOverlay(a)}:void 0})}revealClearActionButtonsIfReady(){this.clearTimer<d.CLEAR_CONTINUE_DELAY||this.stageClearOverlay.enableContinue()}handleStageComplete(){const{totalScore:t,totalStarCount:e}=this.scoreSystem.finalizeStage();if(this.launchSource==="encyclopedia"){this.sceneManager.requestTransition("title");return}this.stageNumber>=I?this.sceneManager.requestTransition("ending",{totalScore:t,totalStarCount:e}):this.sceneManager.requestTransition("stage",{stageNumber:this.stageNumber+1,totalScore:t,totalStarCount:e})}handleStageRetry(){const t={stageNumber:this.stageNumber,totalScore:this.stageEntryTotalScore,totalStarCount:this.stageEntryTotalStarCount,replayToken:Date.now()+Math.random()};this.launchSource!=="campaign"&&(t.launchSource=this.launchSource),this.sceneManager.requestTransition("stage",t)}exit(){this.initialized&&(this.isActive=!1,this.prewarmRequestToken+=1,this.clearRewardRequestToken+=1,this.clearRewardOverlay?.hide(),this.stageClearOverlay.hide(),this.isClearRewardOpen=!1,this.isOpeningClearReward=!1,this.pauseOverlay.hide(),this.touchGuide.hide(),this.hud.hide(),this.scorePopupManager.dispose(),this.audioManager.stopBGM(),this.audioManager.stopBoostSFX(),this.stageIntroOverlay&&(this.stageIntroOverlay.dispose(),this.stageIntroOverlay=null),this.countdownOverlay&&(this.countdownOverlay.dispose(),this.countdownOverlay=null),this.resumeCountdownOverlay&&(this.resumeCountdownOverlay.dispose(),this.resumeCountdownOverlay=null),this.isStarting=!1,this.awaitingResume=!1,this.isHomeConfirmOpen=!1,this.shouldResumeAfterHomeConfirm=!1,this.isPauseOpen=!1,this.shouldResumeAfterPause=!1,this.boostFlameEffect.remove(),this.boostLinesEffect.update(!1,this.spaceship.position.x,this.spaceship.position.z),this.airShield.reset(this.spaceship.position.x,this.spaceship.position.y,this.spaceship.position.z),this.resetStageObjects(),this.bgStars&&(this.bgStars.parent?.remove(this.bgStars),this.bgStars=null))}getThreeScene(){return this.threeScene}getCamera(){const{width:t,height:e}=H(),s=t/e;return s!==this.lastAspect&&Number.isFinite(s)&&s>0&&(this.camera.aspect=s,this.camera.updateProjectionMatrix(),this.lastAspect=s),this.camera}applyVisualQualityTier(){const t=d.clampVisualQualityTier(this.visualQualityTier);if(this.particleBurstManager.setQualityTier(t),!this.initialized){this.bgStars&&this.bgStars.geometry.setDrawRange(0,this.getBackgroundStarDrawCount());return}this.boostLinesEffect.setQualityTier(t),this.boostFlameEffect.setQualityTier(t),this.bgStars&&this.bgStars.geometry.setDrawRange(0,this.getBackgroundStarDrawCount())}getBackgroundStarDrawCount(){return Math.max(1,Math.round(d.BG_STAR_COUNT*d.getVisualQualityScale(this.visualQualityTier)))}static clampVisualQualityTier(t){const e=d.VISUAL_QUALITY_SCALE_BY_TIER.length-1;return Math.max(0,Math.min(e,Math.round(t)))}static getVisualQualityScale(t){return d.VISUAL_QUALITY_SCALE_BY_TIER[d.clampVisualQualityTier(t)]}}const Re=Object.freeze(Object.defineProperty({__proto__:null,StageScene:d,__resetStageSceneSharedAssetCachesForTest:se,__stageSceneSharedAssetCachesForTest:ie,prewarmStageVisualAssets:ft},Symbol.toStringTag,{value:"Module"}));let j=null,q=null;function we(){if(!j){const r=new rt,t=new Float32Array(3e3);for(let e=0;e<3e3;e++)t[e]=(Math.random()-.5)*200;r.setAttribute("position",new lt(t,3)),j=r}return j}function Ae(){return q||(q=new ht({color:16777215,size:.3})),q}function Te(){j=null,q=null}const Me={getBgStarsGeometry:()=>j,getBgStarsMaterial:()=>q};class B{static CIRCLE_RADIUS=3;static POPIN_DELAY=.2;static POPIN_DURATION=.3;static BOUNCE_SPEED=3;static BOUNCE_HEIGHT=.5;static THANK_YOU_DELAY=2.5;threeScene;camera;lastAspect=0;sceneManager;saveManager;audioManager;overlay=null;muteHandle=null;bgStars=null;companionMeshes=[];companionGroup=null;circleX=[];circleZ=[];popinSettled=[];celebrationElapsed=0;thankYouShown=!1;canExit=!1;exitTriggered=!1;exitCta=null;constructor(t,e,s){this.sceneManager=t,this.saveManager=e,this.audioManager=s,this.threeScene=new W;const{width:i,height:a}=H();this.camera=new dt(60,i/a,.1,1e3),this.camera.position.set(0,0,5)}enter(t){this.lastAspect=0,this.canExit=!1,this.exitTriggered=!1,this.exitCta=null;const e=t.totalScore??0,s=t.totalStarCount??0;this.threeScene=new W,this.threeScene.background=new ut(48),this.bgStars=new ot(we(),Ae()),this.bgStars.userData.sharedAssets=!0,this.bgStars.rotation.set(0,0,0),this.threeScene.add(this.bgStars),this.threeScene.add(new ct(16777215,1));const i=this.saveManager.load();i.clearedStage=0,this.saveManager.save(i),this.audioManager.playBGM(-1),this.setupCelebration(),this.createOverlay(e,s),this.createMuteButton()}createMuteButton(){const t=document.getElementById("hud")??document.getElementById("ui-overlay");t&&(this.muteHandle=pt({initialMuted:this.audioManager.isMuted(),container:t,onToggle:()=>{const e=this.audioManager.toggleMute();this.muteHandle?.setMuted(e);const s=this.saveManager.load();s.muted=e,this.saveManager.save(s)}}))}createOverlay(t,e){const s=document.getElementById("ui-overlay");if(!s)return;this.overlay=document.createElement("div"),this.overlay.setAttribute("data-ending-overlay",""),this.overlay.style.cssText=`
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      pointer-events: auto;
    `,this.overlay.addEventListener("pointerdown",n=>{this.handleOverlayPointerDown(n)});const i=document.createElement("div");i.textContent="うちゅうの たびは おしまい！",i.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 2.5rem;
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
      margin-bottom: 1.5rem;
    `;const a=document.createElement("div");a.textContent=`スコア: ${t}`,a.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 1.8rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 0.5rem;
    `;const o=document.createElement("div");o.textContent=`⭐ ${e} こ あつめたよ！`,o.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 1.5rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 2rem;
    `,this.exitCta=document.createElement("div"),this.exitCta.setAttribute("data-ending-exit-cta",""),this.exitCta.textContent="どこでもタップでタイトルへ",this.exitCta.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 1.5rem;
      font-weight: 900;
      color: #fff;
      background: rgba(107, 107, 255, 0.28);
      border-radius: 999px;
      padding: 0.8rem 2rem;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease-in;
      box-shadow: 0 4px 15px rgba(107, 107, 255, 0.25);
    `,this.overlay.appendChild(i),this.overlay.appendChild(a),this.overlay.appendChild(o),this.overlay.appendChild(this.exitCta),s.appendChild(this.overlay)}update(t){this.bgStars&&(this.bgStars.rotation.y+=t*.03),this.updateCelebration(t)}setupCelebration(){this.companionGroup=new V,this.companionMeshes=[],this.circleX.length=0,this.circleZ.length=0,this.popinSettled.length=0,this.celebrationElapsed=0,this.thankYouShown=!1,this.canExit=!1,this.exitTriggered=!1;for(let t=0;t<N.length;t++){const e=N[t],s=xt.createCompanionMesh(e),i=t*(2*Math.PI/N.length),a=Math.cos(i)*B.CIRCLE_RADIUS,o=Math.sin(i)*B.CIRCLE_RADIUS;this.circleX.push(a),this.circleZ.push(o),s.position.set(a,0,o),s.scale.set(0,0,0),this.companionMeshes.push(s),this.popinSettled.push(!1),this.companionGroup.add(s)}this.threeScene.add(this.companionGroup)}updateCelebration(t){if(this.companionMeshes.length===0)return;this.celebrationElapsed+=t;const e=B.POPIN_DELAY*(this.companionMeshes.length-1)+B.POPIN_DURATION,s=this.celebrationElapsed>e,i=s?Math.abs(Math.sin(this.celebrationElapsed*B.BOUNCE_SPEED))*B.BOUNCE_HEIGHT:0;for(let a=0;a<this.companionMeshes.length;a++){const o=this.companionMeshes[a];if(this.popinSettled[a]){s&&(o.position.y=i),o.rotation.y+=t*2;continue}const n=a*B.POPIN_DELAY;if(!(this.celebrationElapsed<n)){if(this.celebrationElapsed<n+B.POPIN_DURATION){const h=(this.celebrationElapsed-n)/B.POPIN_DURATION,l=this.bounceEase(h);o.scale.set(l,l,l)}else o.scale.set(1,1,1),this.popinSettled[a]=!0;s&&(o.position.y=i),o.rotation.y+=t*2}}!this.thankYouShown&&this.celebrationElapsed>=B.THANK_YOU_DELAY&&(this.showThankYouText(),this.thankYouShown=!0)}bounceEase(t){return t<.6?t/.6*1.2:1.2-(t-.6)/.4*.2}showThankYouText(){if(!this.overlay||!this.exitCta)return;const t=document.createElement("div");t.setAttribute("data-ending-thank-you",""),t.textContent="みんな ありがとう！",t.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 2rem;
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
      margin-bottom: 1.5rem;
      opacity: 0;
      transition: opacity 0.5s ease-in;
    `,this.overlay.insertBefore(t,this.exitCta),this.exitCta.style.visibility="visible",this.canExit=!0,requestAnimationFrame(()=>{t.style.opacity="1",this.exitCta&&(this.exitCta.style.opacity="1")})}handleOverlayPointerDown(t){if(!this.canExit||this.exitTriggered)return;const e=t.target;e instanceof HTMLElement&&e.closest("[data-mute-button]")||(this.exitTriggered=!0,this.sceneManager.requestTransition("title"))}exit(){this.audioManager.stopBGM(),this.bgStars&&(this.threeScene.remove(this.bgStars),this.bgStars=null),this.companionGroup&&(this.threeScene.remove(this.companionGroup),this.companionMeshes=[],this.companionGroup=null),this.overlay&&(this.overlay.remove(),this.overlay=null),this.exitCta=null,this.canExit=!1,this.exitTriggered=!1,this.muteHandle&&(this.muteHandle.remove(),this.muteHandle=null)}getThreeScene(){return this.threeScene}getCamera(){const{width:t,height:e}=H(),s=t/e;return s!==this.lastAspect&&Number.isFinite(s)&&s>0&&(this.camera.aspect=s,this.camera.updateProjectionMatrix(),this.lastAspect=s),this.camera}}const Ie=Object.freeze(Object.defineProperty({__proto__:null,EndingScene:B,__endingSceneSharedAssetsForTest:Me,__resetEndingSceneSharedAssetsForTest:Te},Symbol.toStringTag,{value:"Module"}));export{Ie as E,Re as S,Oe as T,k as a,at as c};
