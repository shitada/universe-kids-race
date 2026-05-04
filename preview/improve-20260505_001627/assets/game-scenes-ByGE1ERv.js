const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/EncyclopediaOverlay-BQFxRB4c.js","assets/game-core-_HpAiBEL.js","assets/three-By3JikJA.js"])))=>i.map(i=>d[i]);
import{D as ht,S as z,T as D,g as et,a as At,L as It,b as kt,_ as ot,c as L,d as V,P as N,u as Dt,C as Ht,e as Gt,f as Lt,B as zt,h as _t,M as Ft,i as Nt,j as $t,A as jt,k as Ut,l as Zt,m as Tt,n as qt,o as Yt,p as Xt,q as st,t as it,r as Vt,s as Wt,v as Qt}from"./game-core-_HpAiBEL.js";import{m as ct,k as dt,i as ut,l as mt,G as W,o as Kt,a as Jt,p as te,M as B,g as k,D as Ct,R as Et,q as H,r as pt,s as Q,h as ft,P as gt,V as rt,t as ee,u as se}from"./three-By3JikJA.js";class yt{overlayEl=null;static COMPACT_HEIGHT_THRESHOLD=720;show(t){if(this.overlayEl)return;const s=document.getElementById("ui-overlay");if(!s)return;const e=this.isCompactHeight();this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-tutorial-overlay",""),this.overlayEl.style.cssText=`
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: ${e?"flex-start":"center"};
      background: rgba(0, 0, 32, 0.92);
      pointer-events: auto;
      z-index: 30;
      padding: ${e?"0.75rem":"1.25rem"};
      box-sizing: border-box;
    `;const i=document.createElement("div");i.setAttribute("data-tutorial-content",""),i.style.cssText=`
      width: min(960px, 100%);
      max-height: calc(100% - ${e?"0.5rem":"1rem"});
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow-y: auto;
      padding: ${e?"0.75rem 0.35rem 1rem":"0.5rem"};
      box-sizing: border-box;
    `;const a=document.createElement("div");a.setAttribute("data-tutorial-title",""),a.textContent="あそびかた",a.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${e?"1.8rem":"2.2rem"};
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
      margin-bottom: ${e?"0.9rem":"1.5rem"};
      text-align: center;
    `,i.appendChild(a);const n=document.createElement("div");n.style.cssText=`
      display: flex;
      gap: ${e?"0.8rem":"1.5rem"};
      flex-wrap: wrap;
      justify-content: center;
      width: 100%;
      max-width: 90%;
    `,n.appendChild(this.createCard("👆","ひだり・みぎ を タッチ","うちゅうせんが うごくよ","swipe 2s ease-in-out infinite",e)),n.appendChild(this.createCard("🚀","ブースト ボタン","はやく すすめるよ！","boostPulse 1.5s ease-in-out infinite",e)),n.appendChild(this.createCard("⭐","ほしを あつめて","ゴールを めざそう！","starGlow 3s linear infinite",e)),i.appendChild(n);const o=document.createElement("button");o.textContent="とじる",o.style.cssText=`
      margin-top: ${e?"0.9rem":"1.5rem"};
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${e?"1.15rem":"1.4rem"};
      font-weight: 700;
      padding: ${e?"0.7rem 2rem":"0.8rem 2.5rem"};
      border: none;
      border-radius: 2rem;
      background: linear-gradient(135deg, #FF6B6B, #FFE66D);
      color: #333;
      cursor: pointer;
      touch-action: manipulation;
      pointer-events: auto;
      box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
    `,o.addEventListener("pointerdown",h=>{h.stopPropagation(),t()}),i.appendChild(o),this.injectAnimations(),this.overlayEl.appendChild(i),s.appendChild(this.overlayEl)}hide(){this.overlayEl&&(this.overlayEl.remove(),this.overlayEl=null)}createCard(t,s,e,i,a){const n=document.createElement("div");n.setAttribute("data-tutorial-card",""),n.style.cssText=`
      background: rgba(255, 255, 255, 0.08);
      border-radius: 1.5rem;
      padding: ${a?"1rem 0.85rem":"1.5rem 1.2rem"};
      width: ${a?"150px":"180px"};
      text-align: center;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
    `;const o=document.createElement("div");o.textContent=t,o.style.cssText=`
      font-size: ${a?"2rem":"2.5rem"};
      margin-bottom: ${a?"0.55rem":"0.8rem"};
      animation: ${i};
    `;const h=document.createElement("div");h.textContent=s,h.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${a?"0.95rem":"1.1rem"};
      font-weight: 700;
      color: #fff;
      margin-bottom: 0.4rem;
    `;const d=document.createElement("div");return d.textContent=e,d.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${a?"0.8rem":"0.9rem"};
      color: rgba(255, 255, 255, 0.7);
    `,n.appendChild(o),n.appendChild(h),n.appendChild(d),n}isCompactHeight(){return window.innerHeight<=yt.COMPACT_HEIGHT_THRESHOLD}injectAnimations(){if(document.getElementById("tutorial-animations"))return;const t=document.createElement("style");t.id="tutorial-animations",t.textContent=`
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
    `,document.head.appendChild(t)}}class ie{overlayEl=null;activePressCleanups=new Set;show(t,s){if(this.overlayEl)return;const e=document.getElementById("ui-overlay");if(!e)return;this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-title-reset-confirm-overlay",""),this.overlayEl.setAttribute("role","dialog"),this.overlayEl.setAttribute("aria-modal","true"),this.overlayEl.setAttribute("aria-label","さいしょからに もどしますか"),this.overlayEl.style.cssText=`
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
    `;let i=!1;const a=()=>{i||(i=!0,this.hide(),s())},n=()=>{i||(i=!0,this.hide(),t())};this.overlayEl.addEventListener("pointerdown",m=>{m.target===this.overlayEl&&a()});const o=document.createElement("div");o.setAttribute("data-title-reset-confirm-card",""),o.style.cssText=`
      width: min(88vw, 26rem);
      padding: 1.6rem 1.4rem;
      border-radius: 1.7rem;
      background: rgba(0, 0, 64, 0.9);
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.42);
      text-align: center;
      color: #fff;
    `,o.addEventListener("pointerdown",m=>{m.stopPropagation()}),this.overlayEl.appendChild(o);const h=document.createElement("div");h.textContent="さいしょからに する？",h.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 1.7rem;
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 0 16px rgba(255, 215, 0, 0.45);
      margin-bottom: 0.8rem;
    `,o.appendChild(h);const d=document.createElement("div");d.textContent="いまの すすみぐあいだけ きえて、ステージ 1 から あそべるよ",d.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 1rem;
      font-weight: 700;
      line-height: 1.5;
      color: rgba(255, 255, 255, 0.92);
      margin-bottom: 1.2rem;
    `,o.appendChild(d);const l=document.createElement("div");l.style.cssText=`
      display: flex;
      gap: 0.8rem;
      justify-content: center;
      flex-wrap: wrap;
    `,o.appendChild(l);const p=`
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
    `,g=(m,x)=>{let v=!1,C=!1;const w=()=>{A(!0)},S=()=>{m.style.transform="scale(0.92)"},b=()=>{m.style.transform="scale(1)"},A=(M=!1)=>{v=!1,C=M,b(),this.activePressCleanups.delete(w),document.removeEventListener("pointerup",y,!0),document.removeEventListener("pointercancel",E,!0)},y=M=>{const _=M.target===m||M.target instanceof Node&&m.contains(M.target),Rt=v&&_;A(!_),Rt&&x()},E=()=>{A(!0)};m.addEventListener("pointerdown",M=>{M.stopPropagation(),v=!0,C=!1,S(),this.activePressCleanups.add(w),document.addEventListener("pointerup",y,!0),document.addEventListener("pointercancel",E,!0)}),m.addEventListener("pointerenter",()=>{v&&S()}),m.addEventListener("pointerleave",()=>{v&&b()}),m.addEventListener("pointercancel",()=>A(!0)),m.addEventListener("click",M=>{if(M.stopPropagation(),C){C=!1;return}v||x()})},u=document.createElement("button");u.setAttribute("data-title-reset-cancel",""),u.textContent="やめる",u.style.cssText=p,u.style.background="rgba(255, 255, 255, 0.18)",u.style.color="#ffffff",g(u,a),l.appendChild(u);const c=document.createElement("button");c.setAttribute("data-title-reset-confirm",""),c.textContent="うん！ さいしょから",c.style.cssText=p,c.style.background="linear-gradient(135deg, #FF9F68, #FFE66D)",c.style.color="#3b1f00",g(c,n),l.appendChild(c),e.appendChild(this.overlayEl)}hide(){if(!this.overlayEl)return;const t=Array.from(this.activePressCleanups);this.activePressCleanups.clear();for(const s of t)s();this.overlayEl.remove(),this.overlayEl=null}}function bt(r){const t=r.topRem??.8,s=window.innerHeight<=500,e=document.createElement("button");let i=r.initialMuted;const a=()=>{e.textContent=i?"🔇":"🔊",e.setAttribute("aria-label",i?"サウンド オフ":"サウンド オン")};e.setAttribute("data-mute-button",""),e.style.position="absolute",e.style.top=`${t}rem`,e.style.right="1rem",e.style.fontSize=s?"clamp(1.1rem, 3.5vmin, 1.4rem)":"clamp(1.4rem, 4vmin, 1.8rem)",e.style.background="rgba(255, 255, 255, 0.15)",e.style.border="none",e.style.borderRadius="50%",e.style.width=s?"2.4rem":"3rem",e.style.height=s?"2.4rem":"3rem",e.style.display="flex",e.style.alignItems="center",e.style.justifyContent="center",e.style.cursor="pointer",e.style.pointerEvents="auto",e.style.touchAction="manipulation",e.style.transform="scale(1)",e.style.transition="transform 0.08s ease-out",a();const n=()=>{e.style.transform="scale(1)"};return e.addEventListener("pointerdown",o=>{o.stopPropagation(),e.style.transform="scale(0.9)",r.onToggle()}),e.addEventListener("pointerup",n),e.addEventListener("pointercancel",n),e.addEventListener("pointerleave",n),r.container.appendChild(e),{element:e,setMuted(o){i=o,a()},remove(){e.remove()}}}class ae{overlay=null;toggleButton=null;descriptionEl=null;highContrast=!1;show(t){const s=document.getElementById("ui-overlay");if(s){if(this.highContrast=t.initialHighContrast,!this.overlay){this.overlay=document.createElement("div"),this.overlay.setAttribute("data-color-accessibility-settings",""),this.overlay.style.cssText=`
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.5rem;
        background: rgba(2, 8, 28, 0.76);
        backdrop-filter: blur(8px);
        z-index: 24;
      `;const e=document.createElement("div");e.style.cssText=`
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
      `,a.addEventListener("click",()=>this.hide()),e.appendChild(i),e.appendChild(this.descriptionEl),e.appendChild(this.toggleButton),e.appendChild(a),this.overlay.appendChild(e)}this.render(),s.appendChild(this.overlay)}}hide(){this.overlay?.remove()}isVisible(){return this.overlay?.isConnected===!0}render(){!this.toggleButton||!this.descriptionEl||(this.descriptionEl.textContent=this.highContrast?"いろだけじゃなく ふちや しまもようで わかりやすくしているよ。":"いろだけでなく かたちや うごきでも みわけられるようにするよ。",this.toggleButton.textContent=this.highContrast?"みやすくする: ON":"みやすくする: OFF",this.toggleButton.setAttribute("aria-pressed",this.highContrast?"true":"false"))}}function T(r,t){let s=!1,e=!1,i=null,a=null;const n=t.documentTarget??document,o=t.stopPropagation??!0,h=()=>{t.canActivate?.()!==!1&&t.onActivate()},d=y=>{t.onPressChange?.(y)},l=y=>{const E=y;return typeof E.clientX=="number"&&typeof E.clientY=="number"?{x:E.clientX,y:E.clientY}:null},p=y=>{const E=y;return typeof E.pointerId=="number"?E.pointerId:null},g=y=>{const E=p(y);return i===null||E===null||E===i},u=y=>{if(!s||a===null||t.moveTolerancePx===void 0)return!1;const E=l(y);return E===null?!1:Math.hypot(E.x-a.x,E.y-a.y)>t.moveTolerancePx},c=y=>{s=!1,e=y,i=null,a=null,d(!1),n.removeEventListener("pointermove",v,!0),n.removeEventListener("pointerup",m,!0),n.removeEventListener("pointercancel",x,!0)},m=y=>{if(!s||!g(y))return;if(u(y)){c(!0);return}const E=y.target,M=E===r||E instanceof Node&&r.contains(E),_=s&&M;c(_||!M),_&&h()},x=()=>{c(!0)},v=y=>{!s||!g(y)||u(y)&&c(!0)},C=y=>{t.canActivate?.()!==!1&&((t.preventDefaultOnPointerDown??!1)&&y.preventDefault(),o&&y.stopPropagation(),s=!0,e=!1,i=p(y),a=l(y),d(!0),t.moveTolerancePx!==void 0&&n.addEventListener("pointermove",v,!0),n.addEventListener("pointerup",m,!0),n.addEventListener("pointercancel",x,!0))},w=()=>{s&&d(!0)},S=()=>{s&&d(!1)},b=()=>{c(!0)},A=y=>{if(o&&y.stopPropagation(),(t.preventDefaultOnClick??!1)&&y.preventDefault(),e){e=!1;return}s||h()};return r.addEventListener("pointerdown",C),r.addEventListener("pointerenter",w),r.addEventListener("pointerleave",S),r.addEventListener("pointercancel",b),r.addEventListener("click",A),()=>{c(!1),r.removeEventListener("pointerdown",C),r.removeEventListener("pointerenter",w),r.removeEventListener("pointerleave",S),r.removeEventListener("pointercancel",b),r.removeEventListener("click",A)}}class ne{overlay=null;previewBody=null;previewNose=null;previewWings=null;buttonCleanups=new Set;optionButtons=new Map;draft={...ht};colorOptions=z.getColorOptions();show(t){this.hide();const s=document.getElementById("ui-overlay");if(!s)return;this.draft=z.normalizeCustomization(t.initialCustomization),this.overlay=document.createElement("div"),this.overlay.setAttribute("data-spaceship-customizer",""),this.overlay.setAttribute("role","dialog"),this.overlay.setAttribute("aria-modal","true"),this.overlay.setAttribute("aria-label","うちゅうせんを かざろう"),this.overlay.style.cssText=`
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      background: rgba(2, 8, 28, 0.82);
      backdrop-filter: blur(8px);
      z-index: 56;
      pointer-events: auto;
      box-sizing: border-box;
    `;const e=document.createElement("div");e.style.cssText=`
      width: min(92vw, 46rem);
      max-height: 100%;
      overflow-y: auto;
      padding: 1.2rem;
      border-radius: 1.8rem;
      background: linear-gradient(180deg, rgba(12, 25, 76, 0.98), rgba(7, 15, 48, 0.98));
      border: 3px solid rgba(255, 255, 255, 0.94);
      box-shadow: 0 24px 54px rgba(0, 0, 0, 0.4);
      color: #fff;
      font-family: 'Zen Maru Gothic', sans-serif;
      text-align: center;
      box-sizing: border-box;
    `,e.addEventListener("pointerdown",h=>h.stopPropagation()),this.overlay.appendChild(e);const i=document.createElement("h2");i.textContent="うちゅうせんを かざろう",i.style.cssText="margin: 0 0 0.5rem; font-size: clamp(1.35rem, 4.8vmin, 2rem); color: #ffe66d;";const a=document.createElement("p");a.textContent="おおきな ボタンで えらぶと、すぐに みためが かわるよ。",a.style.cssText="margin: 0 0 0.9rem; font-size: clamp(0.95rem, 3.4vmin, 1.1rem); line-height: 1.5;",e.appendChild(i),e.appendChild(a),e.appendChild(this.createPreviewCard());const n=document.createElement("div");n.style.cssText="display: flex; flex-direction: column; gap: 0.8rem; margin: 1rem 0;",n.appendChild(this.createPartSection("bodyColor","ほんたい")),n.appendChild(this.createPartSection("noseColor","ノーズ")),n.appendChild(this.createPartSection("wingColor","つばさ")),e.appendChild(n);const o=document.createElement("button");o.textContent="かんりょう",o.setAttribute("data-spaceship-customizer-done",""),o.style.cssText=`
      width: min(100%, 18rem);
      min-height: 72px;
      padding: 0.95rem 1.2rem;
      border: none;
      border-radius: 999px;
      background: linear-gradient(135deg, #ffcf6b, #ffe66d);
      color: #2b2140;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(1.05rem, 3.8vmin, 1.25rem);
      font-weight: 900;
      cursor: pointer;
      touch-action: manipulation;
      box-shadow: 0 8px 24px rgba(255, 207, 107, 0.35);
      transform: scale(1);
      transition: transform 0.08s ease-out;
    `,this.buttonCleanups.add(T(o,{onActivate:()=>{const h={...this.draft};this.hide(),t.onComplete(h)},onPressChange:h=>{o.style.transform=h?"scale(0.96)":"scale(1)"}})),e.appendChild(o),s.appendChild(this.overlay),this.render()}hide(){const t=Array.from(this.buttonCleanups);this.buttonCleanups.clear();for(const s of t)s();this.optionButtons.clear(),this.overlay?.remove(),this.overlay=null,this.previewBody=null,this.previewNose=null,this.previewWings=null}isVisible(){return this.overlay?.isConnected===!0}createPreviewCard(){const t=document.createElement("div");t.setAttribute("data-spaceship-customizer-preview-card",""),t.style.cssText=`
      width: min(100%, 22rem);
      margin: 0 auto;
      padding: 0.95rem;
      border-radius: 1.4rem;
      background: rgba(255, 255, 255, 0.1);
      box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.12);
    `;const s=document.createElement("div");s.textContent="プレビュー",s.style.cssText="margin-bottom: 0.6rem; font-size: 0.95rem; font-weight: 700; color: #dff4ff;",t.appendChild(s);const e=document.createElement("div");e.setAttribute("data-spaceship-customizer-preview",""),e.style.cssText=`
      position: relative;
      width: min(72vw, 16rem);
      height: 11rem;
      margin: 0 auto;
      border-radius: 1.4rem;
      background: radial-gradient(circle at top, rgba(123, 206, 255, 0.36), rgba(18, 28, 74, 0.95));
      overflow: hidden;
    `;const i=document.createElement("div");i.style.cssText=`
      position: absolute;
      inset: 0;
      background-image:
        radial-gradient(circle, rgba(255,255,255,0.9) 0 1px, transparent 1.5px),
        radial-gradient(circle, rgba(255,255,255,0.75) 0 1px, transparent 1.5px),
        radial-gradient(circle, rgba(255,255,255,0.65) 0 1px, transparent 1.5px);
      background-size: 48px 48px, 70px 70px, 88px 88px;
      background-position: 0 0, 14px 18px, 26px 8px;
      opacity: 0.85;
    `,e.appendChild(i),this.previewWings=document.createElement("div"),this.previewWings.style.cssText=`
      position: absolute;
      left: 50%;
      top: 58%;
      width: 76%;
      height: 18%;
      border-radius: 999px;
      transform: translate(-50%, -50%);
      box-shadow: 0 8px 18px rgba(0, 0, 0, 0.2);
    `,this.previewBody=document.createElement("div"),this.previewBody.style.cssText=`
      position: absolute;
      left: 50%;
      top: 57%;
      width: 24%;
      height: 58%;
      border-radius: 999px;
      transform: translate(-50%, -50%);
      box-shadow: 0 12px 20px rgba(0, 0, 0, 0.22);
    `,this.previewNose=document.createElement("div"),this.previewNose.style.cssText=`
      position: absolute;
      left: 50%;
      top: 8%;
      width: 0;
      height: 0;
      border-left: 24px solid transparent;
      border-right: 24px solid transparent;
      border-bottom: 54px solid #fff;
      transform: translateX(-50%);
      filter: drop-shadow(0 8px 12px rgba(0, 0, 0, 0.18));
    `;const a=document.createElement("div");return a.style.cssText=`
      position: absolute;
      left: 50%;
      top: 52%;
      width: 12%;
      height: 18%;
      border-radius: 999px;
      transform: translate(-50%, -50%);
      background: rgba(255, 255, 255, 0.82);
      border: 3px solid rgba(8, 16, 40, 0.18);
    `,e.appendChild(this.previewWings),e.appendChild(this.previewBody),e.appendChild(this.previewNose),e.appendChild(a),t.appendChild(e),t}createPartSection(t,s){const e=document.createElement("div");e.style.cssText=`
      padding: 0.8rem;
      border-radius: 1.2rem;
      background: rgba(255, 255, 255, 0.08);
      text-align: left;
    `;const i=document.createElement("div");i.textContent=s,i.style.cssText="margin-bottom: 0.55rem; font-size: 1rem; font-weight: 900; color: #ffe66d; text-align: center;",e.appendChild(i);const a=document.createElement("div");a.style.cssText="display: flex; justify-content: center; gap: 0.6rem; flex-wrap: wrap;";for(const n of this.colorOptions)a.appendChild(this.createColorButton(t,n));return e.appendChild(a),e}createColorButton(t,s){const e=document.createElement("button");e.type="button",e.setAttribute("data-spaceship-color-option",`${t}:${s.key}`),e.style.cssText=`
      min-width: 88px;
      min-height: 88px;
      padding: 0.7rem 0.75rem;
      border-radius: 1.25rem;
      border: 4px solid transparent;
      background: rgba(255, 255, 255, 0.12);
      color: #fff;
      cursor: pointer;
      touch-action: manipulation;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.45rem;
      transform: scale(1);
      transition: transform 0.08s ease-out, border-color 0.08s ease-out;
    `;const i=document.createElement("span");i.style.cssText=`
      display: block;
      width: 2rem;
      height: 2rem;
      border-radius: 999px;
      background: #${s.hex.toString(16).padStart(6,"0")};
      box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.24);
    `;const a=document.createElement("span");return a.textContent=s.label,a.style.cssText="font-family: Zen Maru Gothic, sans-serif; font-size: 0.95rem; font-weight: 700;",e.appendChild(i),e.appendChild(a),this.buttonCleanups.add(T(e,{onActivate:()=>this.selectColor(t,s.key),onPressChange:n=>{e.style.transform=n?"scale(0.95)":"scale(1)"}})),this.optionButtons.set(`${t}:${s.key}`,e),e}selectColor(t,s){this.draft={...this.draft,[t]:s},this.render()}render(){const t=z.normalizeCustomization(this.draft);this.draft=t,this.previewBody?.style.setProperty("background",`#${z.getColorHex(t.bodyColor).toString(16).padStart(6,"0")}`),this.previewWings?.style.setProperty("background",`#${z.getColorHex(t.wingColor).toString(16).padStart(6,"0")}`),this.previewNose&&(this.previewNose.style.borderBottomColor=`#${z.getColorHex(t.noseColor).toString(16).padStart(6,"0")}`);for(const s of this.colorOptions)this.renderOptionState("bodyColor",s.key,t.bodyColor===s.key),this.renderOptionState("noseColor",s.key,t.noseColor===s.key),this.renderOptionState("wingColor",s.key,t.wingColor===s.key)}renderOptionState(t,s,e){const i=this.optionButtons.get(`${t}:${s}`);i&&(i.setAttribute("aria-pressed",e?"true":"false"),i.style.borderColor=e?"#ffe66d":"transparent",i.style.background=e?"rgba(255, 230, 109, 0.18)":"rgba(255, 255, 255, 0.12)")}}function oe(r){return{totalPlayTimeSeconds:r?.totalPlayTimeSeconds??0,totalStarsCollected:r?.totalStarsCollected??0,totalBoostUses:r?.totalBoostUses??0,stageClearCounts:{...r?.stageClearCounts??{}}}}function re(r){const t=Math.max(0,Math.round(r)),s=Math.floor(t/3600),e=Math.floor(t%3600/60),i=t%60;return s>0?`${s}じかん ${e}ふん`:e>0?`${e}ふん ${i}びょう`:`${i}びょう`}class le{overlayEl=null;actionCleanups=new Set;show(t,s){this.hide();const e=document.getElementById("ui-overlay");if(!e)return;const i=oe(t),a=window.innerHeight<=720,n=document.createElement("div");n.setAttribute("data-stats-overlay",""),n.style.cssText=`
      position: absolute;
      inset: 0;
      z-index: 35;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: ${a?"0.8rem":"1.25rem"};
      box-sizing: border-box;
      background: rgba(0, 0, 32, 0.92);
      pointer-events: auto;
      touch-action: manipulation;
    `,this.overlayEl=n;const o=document.createElement("section");o.setAttribute("role","dialog"),o.setAttribute("aria-modal","true"),o.style.cssText=`
      width: min(92vw, 640px);
      max-height: min(88vh, 760px);
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      border-radius: 28px;
      padding: ${a?"1rem 0.9rem 1.2rem":"1.5rem 1.4rem 1.6rem"};
      box-sizing: border-box;
      background: linear-gradient(180deg, rgba(15, 30, 92, 0.96), rgba(6, 12, 44, 0.98));
      box-shadow: 0 20px 48px rgba(0, 0, 0, 0.3);
      color: #fff;
      text-align: center;
    `;const h=document.createElement("h2");h.textContent="あそびの きろく",h.style.cssText=`
      margin: 0 0 1rem;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${a?"1.8rem":"2.2rem"};
      font-weight: 900;
      color: #FFE66D;
    `,o.appendChild(h);const d=document.createElement("div");d.style.cssText=`
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(${a?"120px":"150px"}, 1fr));
      gap: 0.8rem;
      margin-bottom: 1rem;
    `,d.append(this.createSummaryCard("あそんだ じかん",re(i.totalPlayTimeSeconds),"data-stats-total-play-time"),this.createSummaryCard("とった ほし",`${i.totalStarsCollected}こ`,"data-stats-total-stars"),this.createSummaryCard("ブースト",`${i.totalBoostUses}かい`,"data-stats-total-boosts")),o.appendChild(d);const l=document.createElement("div");l.style.cssText=`
      margin-top: 0.5rem;
      padding: ${a?"0.9rem 0.8rem":"1rem"};
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.1);
    `;const p=document.createElement("div");p.textContent="ステージ クリア かいすう",p.style.cssText=`
      margin-bottom: 0.75rem;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${a?"1.1rem":"1.25rem"};
      font-weight: 900;
      color: #FFE66D;
    `,l.appendChild(p);const g=document.createElement("div");g.setAttribute("data-stats-stage-clears",""),g.style.cssText=`
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
      text-align: left;
    `;const u=Array.from({length:D},(m,x)=>x+1).map(m=>({stageNumber:m,clearCount:i.stageClearCounts[m]??0})).filter(m=>m.clearCount>0);if(u.length===0){const m=document.createElement("div");m.textContent="まだ きろくが ないよ",m.style.cssText=`
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${a?"1rem":"1.1rem"};
        font-weight: 700;
        text-align: center;
        color: rgba(255, 255, 255, 0.88);
      `,g.appendChild(m)}else for(const{stageNumber:m,clearCount:x}of u){const v=et(m),C=document.createElement("div");C.setAttribute("data-stats-stage-clear-row",String(m)),C.style.cssText=`
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          padding: 0.55rem 0.7rem;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.08);
          font-family: 'Zen Maru Gothic', sans-serif;
          font-size: ${a?"0.95rem":"1.05rem"};
          font-weight: 700;
        `;const w=document.createElement("span");w.textContent=`${v.emoji} ステージ ${m} ${v.destinationReading}`;const S=document.createElement("span");S.textContent=`${x}かい`,S.style.color="#FFE66D",C.append(w,S),g.appendChild(C)}l.appendChild(g),o.appendChild(l);const c=document.createElement("button");c.textContent="もどる",c.style.cssText=`
      margin-top: 1rem;
      min-width: min(70vw, 220px);
      min-height: 64px;
      border: none;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.18);
      color: #fff;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${a?"1.2rem":"1.35rem"};
      font-weight: 900;
      cursor: pointer;
      touch-action: manipulation;
      transform: scale(1);
      transition: transform 0.08s ease-out;
    `,this.actionCleanups.add(T(c,{onActivate:()=>{this.hide(),s()},onPressChange:m=>{c.style.transform=m?"scale(0.96)":"scale(1)"}})),o.appendChild(c),n.appendChild(o),e.appendChild(n)}hide(){const t=Array.from(this.actionCleanups);this.actionCleanups.clear();for(const s of t)s();this.overlayEl?.remove(),this.overlayEl=null}createSummaryCard(t,s,e){const i=document.createElement("div");i.setAttribute(e,""),i.style.cssText=`
      padding: 0.9rem 0.8rem;
      border-radius: 18px;
      background: rgba(255, 255, 255, 0.1);
    `;const a=document.createElement("div");a.textContent=t,a.style.cssText=`
      margin-bottom: 0.3rem;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 0.95rem;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.86);
    `;const n=document.createElement("div");return n.textContent=s,n.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(1.25rem, 4.4vmin, 1.8rem);
      font-weight: 900;
      color: #FFE66D;
    `,i.append(a,n),i}}function xt(r,t){if(!Number.isFinite(r)||r<=0||t<=0)return"ずかん";const s=Math.min(r,t);return s>=t?`ずかん ${t} / ${t} 🎉`:`ずかん ${s} / ${t}`}function he(r){switch(r){case"hero":return{gap:"0.35rem",label:"0.92rem",medal:"1.7rem",hint:"0.98rem"};case"compact":return{gap:"0.18rem",label:"0.7rem",medal:"1rem",hint:"0.76rem"};default:return{gap:"0.26rem",label:"0.8rem",medal:"1.25rem",hint:"0.84rem"}}}function lt(r,t,s={}){const e=At(r,t),i=s.size??"regular",a=he(i),n=document.createElement("div");if(n.setAttribute("data-stage-medal-display",""),n.setAttribute("data-stage-medal-stage",String(r)),n.setAttribute("data-stage-medal-tier",e.tier),n.setAttribute("data-stage-medal-earned",String(e.earnedCount)),s.scope&&n.setAttribute("data-stage-medal-scope",s.scope),n.style.cssText=`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${a.gap};
  `,s.label){const l=document.createElement("div");l.textContent=s.label,l.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${a.label};
      font-weight: 700;
      color: rgba(255, 255, 255, 0.84);
      letter-spacing: 0.06em;
    `,n.appendChild(l)}const o=document.createElement("div");o.style.cssText=`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${a.gap};
  `;for(const l of e.slots){const p=document.createElement("span");p.setAttribute("data-stage-medal-slot",l.tier),p.setAttribute("data-stage-medal-threshold",String(l.threshold)),p.setAttribute("data-stage-medal-reached",String(l.reached)),p.textContent=l.icon,p.style.cssText=`
      font-size: ${a.medal};
      line-height: 1;
      filter: ${l.reached?"drop-shadow(0 0 10px rgba(255, 215, 0, 0.45))":"none"};
      opacity: ${l.reached?"1":"0.3"};
      transform: ${l.reached?"scale(1)":"scale(0.92)"};
    `,o.appendChild(p)}n.appendChild(o);const h=s.hint??(e.nextThreshold===null?"かんぺき！":`つぎ ⭐ ${e.nextThreshold}`),d=document.createElement("div");return d.setAttribute("data-stage-medal-hint",""),d.textContent=h,d.style.cssText=`
    font-family: 'Zen Maru Gothic', sans-serif;
    font-size: ${a.hint};
    font-weight: 700;
    color: ${e.nextThreshold===null?"#FFE66D":"rgba(255, 255, 255, 0.86)"};
  `,n.appendChild(d),n}const St=2e3,K=new Map,J=new Map,tt=new Map;let q=null,Y=null;function X(r,t){if(typeof document>"u"){const e=typeof OffscreenCanvas=="function",i=e?new OffscreenCanvas(r,t):{width:r,height:t};return{canvas:i,ctx:e?i.getContext("2d"):null}}const s=document.createElement("canvas");return s.width=r,s.height=t,{canvas:s,ctx:s.getContext("2d")}}function F(r,t){let s=K.get(r);return s||(s=t(),s.generateMipmaps=!1,s.minFilter=te,s.needsUpdate=!0,K.set(r,s)),s}function P(r,t){let s=J.get(r);return s||(s=t(),J.set(r,s)),s}function O(r,t){let s=tt.get(r);return s||(s=t(),tt.set(r,s)),s}function R(r,t){const s=new Jt(r,t);return s.userData.sharedAssets=!0,s}function Mt(){if(!q){const r=new dt,t=new Float32Array(St*3);for(let s=0;s<St*3;s+=3)t[s]=(Math.random()-.5)*200,t[s+1]=(Math.random()-.5)*200,t[s+2]=(Math.random()-.5)*400;r.setAttribute("position",new ut(t,3)),q=r}Y||(Y=new mt({color:16777215,size:.2,sizeAttenuation:!0}))}function ce(){const{canvas:r,ctx:t}=X(256,256);if(!t)return new H(r);t.fillStyle="#888888",t.fillRect(0,0,256,256);for(let s=0;s<30;s++){const e=Math.random()*256,i=Math.random()*256,a=3+Math.random()*12;t.beginPath(),t.arc(e,i,a,0,Math.PI*2),t.fillStyle=`rgba(60,60,60,${.3+Math.random()*.4})`,t.fill()}return new H(r)}function de(){const{canvas:r,ctx:t}=X(256,256);if(!t)return new H(r);t.fillStyle="#ddaa44",t.fillRect(0,0,256,256);for(let s=0;s<8;s++){t.beginPath();const e=128+(Math.random()-.5)*100,i=128+(Math.random()-.5)*100;t.strokeStyle=`rgba(200,150,60,${.3+Math.random()*.3})`,t.lineWidth=3+Math.random()*5;for(let a=0;a<Math.PI*4;a+=.1){const n=10+a*8;t.lineTo(e+Math.cos(a)*n,i+Math.sin(a)*n)}t.stroke()}return new H(r)}function ue(){const{canvas:r,ctx:t}=X(256,256);if(!t)return new H(r);const s=["#cc7733","#dd9955","#bb6622","#eebb77","#aa5511","#ddaa66"];for(let e=0;e<256;e++){const i=Math.floor(e/(256/s.length))%s.length;t.fillStyle=s[i],t.fillRect(0,e,256,1)}return new H(r)}function me(){const{canvas:r,ctx:t}=X(512,256);return t?(t.fillStyle="#2266aa",t.fillRect(0,0,512,256),t.fillStyle="#886644",t.beginPath(),t.ellipse(300,80,80,40,.2,0,Math.PI*2),t.fill(),t.beginPath(),t.ellipse(280,150,30,50,.1,0,Math.PI*2),t.fill(),t.beginPath(),t.ellipse(100,90,25,60,.3,0,Math.PI*2),t.fill(),t.beginPath(),t.ellipse(110,170,20,40,-.2,0,Math.PI*2),t.fill(),t.beginPath(),t.ellipse(420,170,25,15,0,0,Math.PI*2),t.fill(),t.fillStyle="#447733",t.beginPath(),t.ellipse(290,75,40,20,.3,0,Math.PI*2),t.fill(),t.beginPath(),t.ellipse(95,85,15,30,.2,0,Math.PI*2),t.fill(),new H(r)):new H(r)}function pe(){const{canvas:r,ctx:t}=X(512,256);if(!t)return new H(r);t.clearRect(0,0,512,256),t.fillStyle="rgba(255,255,255,0.6)";for(let s=0;s<20;s++){const e=Math.random()*512,i=Math.random()*256;t.beginPath(),t.ellipse(e,i,20+Math.random()*40,8+Math.random()*15,Math.random()*Math.PI,0,Math.PI*2),t.fill()}return new H(r)}function fe(){K.clear(),J.clear(),tt.clear(),q=null,Y=null}const ge={planetTextureCache:K,planetGeometryCache:J,planetMaterialCache:tt,getBgStarsGeometry:()=>q,getBgStarsMaterial:()=>Y};function Bt(r,t,s){const e=new W;let i=null;switch(r){case 2:{const a=F("mercury",ce),n=P("mercury:sphere",()=>new k(10,24,24)),o=O("mercury:mat",()=>new B({map:a})),h=R(n,o);e.add(h),i=h;break}case 3:{const a=F("venus",de),n=P("venus:sphere",()=>new k(14,24,24)),o=O("venus:mat",()=>new B({map:a})),h=R(n,o);e.add(h),i=h;break}case 5:{const a=F("jupiter",ue),n=P("jupiter:sphere",()=>new k(20,24,24)),o=O("jupiter:mat",()=>new B({map:a})),h=R(n,o);e.add(h),i=h;break}case 6:{const a=P("saturn:sphere",()=>new k(15,24,24)),n=t.planetColor,o=O(`saturn:mat:${n}`,()=>new B({color:n})),h=R(a,o);e.add(h);const d=P("saturn:ring",()=>new Et(20,30,48)),l=O("saturn:ringMat",()=>new B({color:15645542,side:Ct})),p=R(d,l);p.rotation.x=Math.PI/3,e.add(p),i=h;break}case 7:{const a=P("uranus:sphere",()=>new k(16,24,24)),n=O("uranus:mat",()=>new B({color:6737117})),o=R(a,n);e.add(o);const h=P("uranus:ring",()=>new Et(21,28,48)),d=O("uranus:ringMat",()=>new B({color:10083822,side:Ct})),l=R(h,d);l.rotation.z=Math.PI/2,e.add(l),i=o;break}case 9:{const a=P("pluto:sphere",()=>new k(8,24,24)),n=O("pluto:mat",()=>new B({color:12298922})),o=R(a,n);e.add(o),i=o;break}case 10:{const a=P("sun:sphere",()=>new k(25,24,24)),n=O("sun:mat",()=>new B({color:16763904,emissive:16755200,emissiveIntensity:.5})),o=R(a,n);e.add(o),e.add(new Kt(16763904,2,200)),i=o;break}case 11:{const a=F("earth",me),n=P("earth:sphere",()=>new k(15,32,32)),o=O("earth:mat",()=>new B({map:a})),h=F("earth:cloud",pe),d=P("earth:cloudSphere",()=>new k(15.5,32,32)),l=O("earth:cloudMat",()=>new B({map:h,transparent:!0,opacity:.3})),p=new W;p.add(R(n,o)),p.add(R(d,l)),e.add(p),i=p;break}default:{const a=P("default:sphere",()=>new k(15,24,24)),n=t.planetColor,o=O(`default:mat:${n}`,()=>new B({color:n})),h=R(a,o);e.add(h),i=h;break}}return e.position.set(0,0,s),{planet:e,spinTarget:i}}function ye(r,t,s){return Bt(r,t,s)}function be(r){Mt();const t=new ct(q,Y);return t.userData.sharedAssets=!0,t.geometry.setDrawRange(0,r),t}function vt(r){!Number.isInteger(r)||r<1||r>D||typeof document>"u"&&typeof OffscreenCanvas!="function"||(Mt(),Bt(r,et(r),0))}let $=null,j=null;function ve(){if(!$){const r=new dt,t=new Float32Array(3e3);for(let s=0;s<3e3;s++)t[s]=(Math.random()-.5)*200;r.setAttribute("position",new ut(t,3)),$=r}return $}function Ce(){return j||(j=new mt({color:16777215,size:.3,sizeAttenuation:!0})),j}function Ee(){$=null,j=null}const xe={getBgStarsGeometry:()=>$,getBgStarsMaterial:()=>j};function Se(r){const t=window.requestIdleCallback;if(typeof t=="function"){t(r,{timeout:1500});return}window.setTimeout(r,800)}function Pt(r){return new Set(r.filter(t=>Number.isInteger(t)&&t>=1&&t<=D)).size}function we(r){return Pt(r)>=D}function at(r){const t=we(r.unlockedPlanets),s=t?1:Math.min(r.clearedStage+1,D),e=et(s),i=r.bestStageStars?.[s]??0;return t?{startStage:s,destination:e.destinationReading,emoji:e.emoji,statusLabel:"ぜんぶ あつめたよ！",destinationLabel:`${e.destinationReading}へ もういちど しゅっぱつ！`,buttonHint:`${e.emoji} ステージ ${s} から もういちど あそぶ`,bestStars:i}:{startStage:s,destination:e.destinationReading,emoji:e.emoji,statusLabel:r.clearedStage>0?"つづきから しゅっぱつ！":"はじめての しゅっぱつ！",destinationLabel:`${e.destinationReading}へ むかおう！`,buttonHint:`${e.emoji} ステージ ${s} から スタート`,bestStars:i}}function Ae(r){return r.clearedStage>0||Pt(r.unlockedPlanets)>0||Object.keys(r.bestStageStars??{}).length>0}class Te{threeScene;ambientLight=new pt(16777215,1);camera;lastAspect=0;sceneManager;saveManager;audioManager;stars=null;companionParade=null;overlay=null;muteHandle=null;tutorialOverlay=new yt;titleResetConfirmOverlay=new ie;colorAccessibilitySettings=new ae;spaceshipCustomizer=new ne;statsOverlay=new le;encyclopediaOverlay=null;encyclopediaOverlayPromise=null;companionFactory=null;companionFactoryPromise=null;loadEncyclopediaOverlay;loadTitleCompanionFactory;loadingOverlay;loadFailureOverlay;scheduleIdleTask;encyclopediaBtn=null;isOpeningEncyclopedia=!1;isActive=!1;encyclopediaRequestToken=0;companionParadeRequestToken=0;bgmPending=!1;overlayButtonCleanups=new Set;constructor(t,s,e,i={}){this.sceneManager=t,this.saveManager=s,this.audioManager=e,this.loadingOverlay=i.loadingOverlay??new It,this.loadFailureOverlay=i.loadFailureOverlay??new kt,this.scheduleIdleTask=i.scheduleIdleTask??Se,this.loadEncyclopediaOverlay=i.loadEncyclopediaOverlay??(()=>ot(()=>import("./EncyclopediaOverlay-BQFxRB4c.js"),__vite__mapDeps([0,1,2]))),this.loadTitleCompanionFactory=i.loadTitleCompanionFactory??(()=>ot(()=>import("./game-core-_HpAiBEL.js").then(o=>o.F),__vite__mapDeps([1,2]))),this.threeScene=new Q,this.threeScene.background=new ft(32);const{width:a,height:n}=L();this.camera=new gt(60,a/n,.1,1e3),this.camera.position.set(0,0,5)}enter(t){this.isActive=!0,this.encyclopediaRequestToken+=1,this.companionParadeRequestToken+=1,this.lastAspect=0,this.stars=new ct(ve(),Ce()),this.stars.userData.sharedAssets=!0,this.stars.rotation.set(0,0,0),this.threeScene.add(this.stars),this.ambientLight.parent||this.threeScene.add(this.ambientLight);const s=this.saveManager.load();this.createCompanionParade(s.unlockedPlanets),this.createOverlay(),this.createMuteButton(),this.prefetchEncyclopediaOnIdle(),this.prewarmNextAdventureOnIdle(at(s).startStage),this.audioManager.isInitialized()?(this.audioManager.playBGM(0),this.bgmPending=!1):this.bgmPending=!0,s.tutorialShown||this.tutorialOverlay.show(()=>{this.ensureTitleAudioInitialized(!0),this.tutorialOverlay.hide(),this.saveManager.markTutorialShown()})}createMuteButton(){const t=document.getElementById("hud")??document.getElementById("ui-overlay");t&&(this.muteHandle=bt({initialMuted:this.audioManager.isMuted(),container:t,onToggle:()=>{this.ensureTitleAudioInitialized(!0);const s=this.audioManager.toggleMute();this.muteHandle?.setMuted(s);const e=this.saveManager.load();e.muted=s,this.saveManager.save(e)}}))}getEncyclopediaOverlay(){return this.encyclopediaOverlay?Promise.resolve(this.encyclopediaOverlay):this.encyclopediaOverlayPromise?this.encyclopediaOverlayPromise:(this.encyclopediaOverlayPromise=this.loadEncyclopediaOverlay().then(({EncyclopediaOverlay:t})=>{const s=new t;return this.encyclopediaOverlay=s,s}).finally(()=>{this.encyclopediaOverlayPromise=null}),this.encyclopediaOverlayPromise)}getTitleCompanionFactory(){return this.companionFactory?Promise.resolve(this.companionFactory):this.companionFactoryPromise?this.companionFactoryPromise:(this.companionFactoryPromise=this.loadTitleCompanionFactory().then(t=>(this.companionFactory=t,t)).finally(()=>{this.companionFactoryPromise=null}),this.companionFactoryPromise)}showEncyclopedia(){if(!this.isActive||!this.encyclopediaOverlay)return;const t=this.saveManager.load();this.encyclopediaOverlay.show(t.unlockedPlanets,()=>this.refreshEncyclopediaButtonLabel(),s=>{this.ensureTitleAudioInitialized(!1),this.sceneManager.requestTransition("stage",{stageNumber:s,totalScore:0,totalStarCount:0,launchSource:"encyclopedia"})},t.bestStageStars??{})}isCurrentEncyclopediaRequest(t){return this.isActive&&this.encyclopediaRequestToken===t}prefetchEncyclopediaOnIdle(){const t=this.encyclopediaRequestToken;this.scheduleIdleTask(()=>{!this.isCurrentEncyclopediaRequest(t)||this.encyclopediaOverlay||this.encyclopediaOverlayPromise||this.getEncyclopediaOverlay().catch(()=>{})})}prewarmNextAdventureOnIdle(t){if(t>D)return;const s=this.encyclopediaRequestToken;this.scheduleIdleTask(()=>{this.isCurrentEncyclopediaRequest(s)&&vt(t)})}async openEncyclopedia(){if(!this.isActive)return;if(this.loadFailureOverlay.hide(),this.encyclopediaOverlay){this.showEncyclopedia();return}if(this.isOpeningEncyclopedia)return;const t=this.encyclopediaRequestToken;this.isOpeningEncyclopedia=!0,this.loadingOverlay.show("ずかんを よんでるよ...");try{if(await this.getEncyclopediaOverlay(),!this.isCurrentEncyclopediaRequest(t))return;this.loadingOverlay.hide(),this.showEncyclopedia()}catch(s){if(!this.isCurrentEncyclopediaRequest(t))return;this.loadingOverlay.hide(),console.error("Failed to load encyclopedia overlay",s),this.loadFailureOverlay.show({title:"ずかんを もういちど よんでみよう！",message:"「もういちど よむ」を おして つづきを たのしもう！",primaryAction:{label:"もういちど よむ",onSelect:()=>this.openEncyclopedia()}})}finally{this.encyclopediaRequestToken===t&&(this.isOpeningEncyclopedia=!1)}}persistHighContrastSetting(t){const s=this.saveManager.load();t?s.colorAccessibility={highContrast:!0}:delete s.colorAccessibility,this.saveManager.save(s)}createOverlay(){const t=document.getElementById("ui-overlay");if(!t)return;const s=this.saveManager.load(),e=at(s);this.overlay=document.createElement("div"),this.overlay.style.cssText=`
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
    `;const n=document.createElement("div");n.setAttribute("data-next-adventure-card",""),n.setAttribute("data-next-stage-number",String(e.startStage)),n.setAttribute("data-next-stage-destination",e.destination),n.style.cssText=`
      width: min(${i?"60vw":"70vw"}, ${i?"18rem":"26rem"});
      padding: ${i?"0.5rem 0.8rem":"1rem 1.4rem"};
      margin-bottom: ${i?"0.6rem":"1.25rem"};
      border-radius: ${i?"1rem":"1.5rem"};
      background: rgba(255, 255, 255, 0.14);
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.22);
      backdrop-filter: blur(6px);
      text-align: center;
      color: #fff;
    `;const o=document.createElement("div");o.textContent="つぎの ぼうけん",o.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${i?"0.8rem":"1rem"};
      font-weight: 700;
      color: #FFE66D;
      margin-bottom: ${i?"0.15rem":"0.35rem"};
    `;const h=document.createElement("div");h.textContent=e.statusLabel,h.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${i?"1rem":"1.25rem"};
      font-weight: 900;
      margin-bottom: ${i?"0.15rem":"0.35rem"};
    `;const d=document.createElement("div");d.textContent=`${e.emoji} ステージ ${e.startStage} ・ ${e.destination}`,d.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${i?"1.05rem":"1.35rem"};
      font-weight: 700;
      margin-bottom: 0.25rem;
    `;const l=document.createElement("div");l.textContent=e.destinationLabel,l.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${i?"0.85rem":"1rem"};
      font-weight: 700;
      color: rgba(255, 255, 255, 0.92);
    `;const p=At(e.startStage,e.bestStars),g=lt(e.startStage,e.bestStars,{label:"メダル",hint:p.nextThreshold===null?"かんぺき！":`${p.icon} いま ・ つぎ ⭐ ${p.nextThreshold}`,size:"regular",scope:"title-next-adventure"});g.style.marginTop="0.7rem",n.appendChild(o),n.appendChild(h),n.appendChild(d),n.appendChild(l),n.appendChild(g);const u=document.createElement("div");u.style.cssText=`
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.65rem;
    `;const c=document.createElement("button");c.textContent="あそぶ",c.style.cssText=`
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
    `,this.overlayButtonCleanups.add(T(c,{onActivate:()=>{this.ensureTitleAudioInitialized(!1);const b=this.saveManager.load(),A=at(b).startStage;this.sceneManager.requestTransition("stage",{stageNumber:A,totalScore:0,totalStarCount:0,launchSource:"campaign"})},onPressChange:b=>{c.style.transform=b?"scale(0.96)":"scale(1)"}}));const m=document.createElement("div");m.setAttribute("data-play-button-hint",""),m.textContent=e.buttonHint,m.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${i?"0.85rem":"1rem"};
      font-weight: 700;
      color: rgba(255, 255, 255, 0.88);
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
    `;const x=document.createElement("button");x.setAttribute("data-spaceship-customizer-button",""),x.textContent="うちゅうせんをかざろう",x.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${i?"1rem":"1.25rem"};
      font-weight: 900;
      padding: ${i?"0.65rem 1.2rem":"0.85rem 1.8rem"};
      min-width: min(76vw, 20rem);
      border: 3px solid rgba(255, 255, 255, 0.92);
      border-radius: 1.7rem;
      background: rgba(8, 16, 52, 0.76);
      color: #fff;
      cursor: pointer;
      touch-action: manipulation;
      box-shadow: 0 8px 18px rgba(0, 0, 0, 0.26);
      transform: scale(1);
      transition: transform 0.08s ease-out;
    `,this.overlayButtonCleanups.add(T(x,{onActivate:()=>{const b=this.saveManager.load();this.spaceshipCustomizer.show({initialCustomization:b.spaceshipCustomization??ht,onComplete:A=>{const y=this.saveManager.load();y.spaceshipCustomization=A,this.saveManager.save(y)}})},onPressChange:b=>{x.style.transform=b?"scale(0.96)":"scale(1)"}}));const v=document.createElement("button");v.setAttribute("data-stats-button",""),v.textContent="あそびの きろく",v.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${i?"1rem":"1.2rem"};
      font-weight: 900;
      padding: ${i?"0.65rem 1.2rem":"0.8rem 1.8rem"};
      min-width: min(76vw, 20rem);
      border: 3px solid rgba(255, 230, 109, 0.85);
      border-radius: 1.7rem;
      background: rgba(12, 22, 72, 0.82);
      color: #fff;
      cursor: pointer;
      touch-action: manipulation;
      box-shadow: 0 8px 18px rgba(0, 0, 0, 0.26);
      transform: scale(1);
      transition: transform 0.08s ease-out;
    `,this.overlayButtonCleanups.add(T(v,{onActivate:()=>{this.ensureTitleAudioInitialized(!0),this.statsOverlay.show(this.saveManager.load().gameplayStats,()=>{})},onPressChange:b=>{v.style.transform=b?"scale(0.96)":"scale(1)"}}));const C=document.createElement("button");C.textContent="あそびかた",C.style.cssText=`
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
    `,C.style.position="absolute",C.style.bottom=i?"1rem":"2rem",C.style.right=i?"1rem":"2rem",this.overlayButtonCleanups.add(T(C,{onActivate:()=>{this.ensureTitleAudioInitialized(!0),this.tutorialOverlay.show(()=>{this.ensureTitleAudioInitialized(!0),this.tutorialOverlay.hide()})},onPressChange:b=>{C.style.transform=b?"scale(0.96)":"scale(1)"}}));const w=document.createElement("button");w.setAttribute("data-color-settings-button",""),w.textContent="いろのせってい",w.style.cssText=`
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
    `,this.overlayButtonCleanups.add(T(w,{onActivate:()=>{this.ensureTitleAudioInitialized(!0),this.colorAccessibilitySettings.show({initialHighContrast:this.saveManager.load().colorAccessibility?.highContrast===!0,onToggle:b=>this.persistHighContrastSetting(b)})},onPressChange:b=>{w.style.transform=b?"translateX(-50%) scale(0.96)":"translateX(-50%) scale(1)"}}));const S=document.createElement("button");if(S.textContent=xt(s.unlockedPlanets.length,N.length),S.style.cssText=`
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
    `,S.style.position="absolute",S.style.bottom=i?"1rem":"2rem",S.style.left=i?"1rem":"2rem",this.encyclopediaBtn=S,this.overlayButtonCleanups.add(T(S,{onActivate:()=>{this.ensureTitleAudioInitialized(!0),this.openEncyclopedia()},onPressChange:b=>{S.style.transform=b?"scale(0.96)":"scale(1)"}})),u.appendChild(c),u.appendChild(m),u.appendChild(x),u.appendChild(v),Ae(s)){const b=document.createElement("button");b.setAttribute("data-reset-progress-button",""),b.textContent="さいしょから",b.style.cssText=`
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
      `,b.addEventListener("pointerdown",A=>{A.stopPropagation(),this.ensureTitleAudioInitialized(!0),this.titleResetConfirmOverlay.show(()=>{this.saveManager.resetProgressPreservingSettings(),this.startCampaign(1)},()=>{})}),u.appendChild(b)}this.overlay.appendChild(a),this.overlay.appendChild(n),this.overlay.appendChild(u),this.overlay.appendChild(C),this.overlay.appendChild(w),this.overlay.appendChild(S),t.appendChild(this.overlay),this.overlay.addEventListener("pointerdown",()=>{this.ensureTitleAudioInitialized(!0)},{once:!0})}ensureTitleAudioInitialized(t){!this.bgmPending&&this.audioManager.isInitialized()||(this.audioManager.initSync(),t&&this.bgmPending&&this.audioManager.playBGM(0),this.bgmPending=!1)}startCampaign(t){this.sceneManager.requestTransition("stage",{stageNumber:t,totalScore:0,totalStarCount:0,launchSource:"campaign"})}refreshEncyclopediaButtonLabel(){if(!this.encyclopediaBtn)return;const t=this.saveManager.load();this.encyclopediaBtn.textContent=xt(t.unlockedPlanets.length,N.length)}async createCompanionParade(t){this.clearCompanionParade();const s=[...new Set(t)].reduce((h,d)=>{const l=V(d);return l&&h.push(l),h},[]);if(s.length===0)return;const e=this.encyclopediaRequestToken,{createCompanionMesh:i}=await this.getTitleCompanionFactory();if(!this.isActive||this.encyclopediaRequestToken!==e)return;const a=new W;a.name="title-companion-parade",a.position.set(0,1.35,-1.2),a.rotation.x=-.12;const n=Math.min(2.1,1.1+s.length*.18),o=Math.min(.45,.18+s.length*.02);s.forEach((h,d)=>{const l=i(h),p=d/s.length*Math.PI*2;l.position.set(Math.cos(p)*n,Math.sin(p)*o,Math.sin(p)*n*.45),l.rotation.y=Math.PI*.15-p,l.scale.setScalar(.6),a.add(l)}),this.companionParade=a,this.threeScene.add(a)}clearCompanionParade(){this.companionParade&&(this.companionParade.parent?.remove(this.companionParade),this.companionParade=null)}update(t){this.stars&&(this.stars.rotation.y+=t*.05),this.companionParade&&(this.companionParade.rotation.y+=t*.35)}exit(){this.isActive=!1,this.encyclopediaRequestToken+=1,this.companionParadeRequestToken+=1,this.isOpeningEncyclopedia=!1,this.tutorialOverlay.hide(),this.titleResetConfirmOverlay.hide(),this.colorAccessibilitySettings.hide(),this.spaceshipCustomizer.hide(),this.statsOverlay.hide(),this.encyclopediaOverlay?.hide(),this.loadingOverlay.hide(),this.loadFailureOverlay.hide(),this.audioManager.stopBGM(),this.bgmPending=!1,this.clearCompanionParade(),this.stars&&(this.stars.parent?.remove(this.stars),this.stars=null),this.clearCompanionParade();const t=Array.from(this.overlayButtonCleanups);this.overlayButtonCleanups.clear();for(const s of t)s();this.overlay&&(this.overlay.remove(),this.overlay=null),this.encyclopediaBtn=null,this.muteHandle&&(this.muteHandle.remove(),this.muteHandle=null)}getThreeScene(){return this.threeScene}getCamera(){const{width:t,height:s}=L(),e=t/s;return e!==this.lastAspect&&Number.isFinite(e)&&e>0&&(this.camera.aspect=e,this.camera.updateProjectionMatrix(),this.lastAspect=e),this.camera}}const Ue=Object.freeze(Object.defineProperty({__proto__:null,TitleScene:Te,__resetTitleSceneSharedAssetsForTest:Ee,__titleSceneSharedAssetsForTest:xe},Symbol.toStringTag,{value:"Module"}));class Me{overlayEl=null;activePressCleanups=new Set;show(t,s){if(this.overlayEl)return;const e=document.getElementById("ui-overlay");if(!e)return;this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-home-confirm-overlay",""),this.overlayEl.setAttribute("role","dialog"),this.overlayEl.setAttribute("aria-modal","true"),this.overlayEl.setAttribute("aria-label","ホームへ もどりますか"),this.overlayEl.style.cssText=`
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
    `,this.overlayEl.style.background="rgba(0, 0, 32, 0.92)";let i=!1;const a=()=>{i||(i=!0,this.hide(),s())},n=()=>{i||(i=!0,this.hide(),t())};this.overlayEl.addEventListener("pointerdown",c=>{c.target===this.overlayEl&&a()});const o=document.createElement("div");o.setAttribute("data-home-confirm-card",""),o.style.cssText=`
      display: flex;
      flex-direction: column;
      align-items: center;
      background: rgba(0, 0, 64, 0.85);
      border-radius: 1.6rem;
      padding: 1.6rem 1.4rem;
      max-width: min(90vw, 420px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45);
    `,o.addEventListener("pointerdown",c=>{c.stopPropagation()}),this.overlayEl.appendChild(o);const h=document.createElement("div");h.textContent="タイトルへ もどる？",h.style.cssText=`
      font-size: 1.8rem;
      font-weight: 900;
      text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
      margin-bottom: 1.2rem;
      text-align: center;
      padding: 0 0.6rem;
      white-space: nowrap;
    `,h.style.fontFamily="'Zen Maru Gothic', sans-serif",h.style.color="#FFD700",o.appendChild(h);const d=document.createElement("div");d.style.cssText=`
      display: flex;
      flex-direction: row;
      gap: 1rem;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
    `,o.appendChild(d);const l=`
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
    `,p=(c,m)=>{const x=T(c,{onActivate:m,onPressChange:v=>{c.style.transform=v?"scale(0.9)":"scale(1)"}});this.activePressCleanups.add(x)},g=document.createElement("button");g.setAttribute("data-home-confirm-back",""),g.setAttribute("aria-label","タイトルへ もどる"),g.textContent="🏠 タイトルへ もどる",g.style.cssText=l,g.style.fontFamily="'Zen Maru Gothic', sans-serif",g.style.background="rgba(255, 255, 255, 0.18)",g.style.color="#ffffff",g.style.minWidth="88px",g.style.minHeight="88px",g.style.touchAction="manipulation",g.style.transform="scale(1)",g.style.transition="transform 0.08s ease-out",g.style.whiteSpace="nowrap",p(g,n),d.appendChild(g);const u=document.createElement("button");u.setAttribute("data-home-confirm-continue",""),u.setAttribute("aria-label","つづける"),u.textContent="✋ つづける",u.style.cssText=l,u.style.fontFamily="'Zen Maru Gothic', sans-serif",u.style.background="linear-gradient(135deg, #FF6B6B, #FFE66D)",u.style.color="#FFD700",u.style.textShadow="0 1px 2px rgba(0, 0, 32, 0.6)",u.style.minWidth="88px",u.style.minHeight="88px",u.style.touchAction="manipulation",u.style.transform="scale(1)",u.style.transition="transform 0.08s ease-out",u.style.whiteSpace="nowrap",p(u,a),d.appendChild(u),e.appendChild(this.overlayEl)}hide(){if(this.overlayEl){const t=Array.from(this.activePressCleanups);this.activePressCleanups.clear();for(const s of t)s();this.overlayEl.remove(),this.overlayEl=null}}isVisible(){return this.overlayEl!==null}}class Ot{overlayEl=null;activePressCleanups=new Set;show(t,s){if(this.overlayEl)return;const e=document.getElementById("ui-overlay")??document.body;this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-pause-overlay",""),this.overlayEl.setAttribute("role","dialog"),this.overlayEl.setAttribute("aria-modal","true"),this.overlayEl.setAttribute("aria-label","やすみちゅう"),this.overlayEl.style.cssText=`
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
    `,i.addEventListener("pointerdown",d=>{d.stopPropagation()}),this.overlayEl.appendChild(i);const a=document.createElement("div");a.textContent="ひとやすみ ちゅう",a.style.cssText=`
      font-size: clamp(1.8rem, 5vmin, 2.4rem);
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
    `,i.appendChild(a);const n=document.createElement("div");n.textContent="また じゅんびが できたら つづけよう",n.style.cssText=`
      font-size: clamp(1rem, 3.5vmin, 1.2rem);
      font-weight: 700;
      color: #ffffff;
      opacity: 0.92;
    `,i.appendChild(n);const o=document.createElement("div");o.style.cssText=`
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      justify-content: center;
      align-items: stretch;
      width: 100%;
    `,i.appendChild(o);const h=(d,l,p,g,u,c)=>{const m=document.createElement("button");m.setAttribute(l,""),m.setAttribute("aria-label",p),m.textContent=d,m.style.cssText=`
        flex: 1 1 140px;
        padding: 1rem 1.2rem;
        border: none;
        border-radius: 1.6rem;
        background: ${g};
        color: ${u};
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: clamp(1.1rem, 3.6vmin, 1.4rem);
        font-weight: 900;
        cursor: pointer;
        touch-action: manipulation;
        box-shadow: 0 4px 18px rgba(0, 0, 0, 0.35);
        transform: scale(1);
        transition: transform 0.08s ease-out;
        white-space: nowrap;
      `,m.style.minWidth="140px",m.style.minHeight="88px";const x=T(m,{onActivate:()=>{this.hide(),c()},onPressChange:v=>{m.style.transform=v?"scale(0.94)":"scale(1)"}});return this.activePressCleanups.add(x),m};o.appendChild(h("▶ つづける","data-pause-continue","つづける","linear-gradient(135deg, #FF6B6B, #FFE66D)","#1b1f52",t)),o.appendChild(h("🏠 おうちへ","data-pause-home","おうちへ","rgba(255, 255, 255, 0.18)","#ffffff",s)),e.appendChild(this.overlayEl)}hide(){if(!this.overlayEl)return;const t=Array.from(this.activePressCleanups);this.activePressCleanups.clear();for(const s of t)s();this.overlayEl.remove(),this.overlayEl=null}dispose(){this.hide()}isVisible(){return this.overlayEl!==null}}class Be{pendingTimeouts=new Set;container=null;stageNameEl=null;assistMessageEl=null;politeLiveRegionEl=null;assertiveLiveRegionEl=null;scoreEl=null;starCountEl=null;bestStarContainerEl=null;bestStarCountEl=null;boostButton=null;boostHintEl=null;homeButton=null;pauseButton=null;homeConfirmOverlay=new Me;pauseOverlay=new Ot;muteButton=null;muteHandle=null;cooldownContainer=null;cooldownBar=null;stageProgressContainer=null;stageProgressTrack=null;stageProgressFill=null;stageProgressGoalEl=null;onBoostCallback=null;onBoostDeniedCallback=null;onHomeCallback=null;onHomeConfirmOpenCallback=null;onHomeConfirmCancelCallback=null;onPauseCallback=null;onPauseOpenCallback=null;onPauseResumeCallback=null;onMuteCallback=null;muted=!1;highContrastMode=!1;boostLocked=!1;pauseEnabled=!0;pauseButtonCleanup=null;lastCooldownProgress=1;lastCooldownPct=-1;lastReadyState=null;lastStageProgressPct=-1;lastStageProgressComplete=null;lastScore=-1;lastStarCount=-1;bestStarCount=0;lastBestStarCount=-1;bestStarPulsed=!1;liveRegionWriteNonce=0;lastAnnouncedProgressThreshold=0;show(t,s){const e=document.getElementById("hud");if(!e)return;e.style.zIndex="10";const i=window.innerHeight<=500;this.homeButton=document.createElement("button"),this.homeButton.textContent="🏠",this.homeButton.setAttribute("aria-label","ホームへ もどる"),this.homeButton.style.position="absolute",this.homeButton.style.top="0.8rem",this.homeButton.style.left="1rem",this.homeButton.style.fontSize=i?"clamp(1.1rem, 3.5vmin, 1.4rem)":"clamp(1.4rem, 4vmin, 1.8rem)",this.homeButton.style.background="rgba(255, 255, 255, 0.15)",this.homeButton.style.border="none",this.homeButton.style.borderRadius="50%",this.homeButton.style.width=i?"2.4rem":"3rem",this.homeButton.style.height=i?"2.4rem":"3rem",this.homeButton.style.display="flex",this.homeButton.style.alignItems="center",this.homeButton.style.justifyContent="center",this.homeButton.style.cursor="pointer",this.homeButton.style.pointerEvents="auto",this.homeButton.style.touchAction="manipulation",this.homeButton.style.transform="scale(1)",this.homeButton.style.transition="transform 0.08s ease-out";const a=()=>{this.homeButton&&(this.homeButton.style.transform="scale(1)")};this.homeButton.addEventListener("pointerdown",h=>{h.stopPropagation(),this.homeButton&&(this.homeButton.style.transform="scale(0.9)"),!this.homeConfirmOverlay.isVisible()&&document.getElementById("ui-overlay")&&(this.onHomeConfirmOpenCallback?.(),this.homeConfirmOverlay.show(()=>this.onHomeCallback?.(),()=>this.onHomeConfirmCancelCallback?.()))}),this.homeButton.addEventListener("pointerup",a),this.homeButton.addEventListener("pointercancel",a),this.homeButton.addEventListener("pointerleave",a),e.appendChild(this.homeButton),t&&(this.stageNameEl=document.createElement("div"),this.stageNameEl.textContent=t,this.stageNameEl.style.cssText=`
        text-align: center;
        font-family: 'Zen Maru Gothic', sans-serif;
        color: #FFD700;
        font-size: ${i?"1.1rem":"1.5rem"};
        font-weight: 700;
        padding: ${i?"0.25rem":"0.5rem"};
        pointer-events: none;
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);
      `,e.appendChild(this.stageNameEl)),this.createPauseButton(),this.assistMessageEl=document.createElement("div"),this.assistMessageEl.setAttribute("data-hud-assist-message",""),this.assistMessageEl.setAttribute("aria-hidden","true"),this.assistMessageEl.style.cssText=`
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
    `,e.appendChild(this.assistMessageEl),this.createStageProgress(e,s),this.container=document.createElement("div"),this.container.style.cssText=`
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: ${i?"0.4rem 1rem":"1rem 2rem"};
      font-family: 'Zen Maru Gothic', sans-serif;
      color: #fff;
      font-size: ${i?"1.1rem":"1.4rem"};
      font-weight: 700;
      pointer-events: none;
    `;const n=document.createElement("div");this.scoreEl=document.createElement("span"),n.textContent="スコア: ",this.scoreEl.textContent="0",n.appendChild(this.scoreEl);const o=document.createElement("div");o.textContent="⭐ ",this.starCountEl=document.createElement("span"),this.starCountEl.textContent="0",o.appendChild(this.starCountEl),this.bestStarContainerEl=document.createElement("span"),this.bestStarContainerEl.setAttribute("data-hud-best-star",""),this.bestStarContainerEl.style.cssText=`
      margin-left: 0.6rem;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 0.6em;
      font-weight: 700;
      color: #9ec5ff;
      opacity: 0.7;
      display: none;
      vertical-align: middle;
      transform-origin: center;
    `,this.bestStarContainerEl.textContent="ベスト ⭐",this.bestStarCountEl=document.createElement("span"),this.bestStarCountEl.textContent="0",this.bestStarContainerEl.appendChild(this.bestStarCountEl),o.appendChild(this.bestStarContainerEl),this.container.appendChild(n),this.container.appendChild(o),e.appendChild(this.container),this.createBoostButton(),this.createMuteButton(),this.applyColorAccessibilityState(),this.createLiveRegions(e)}createStageProgress(t,s){const e=this.toCssColor(s??16766720),i=document.createElement("div");i.setAttribute("data-stage-progress-container",""),i.setAttribute("role","progressbar"),i.setAttribute("aria-label","ゴールまでの すすみ"),i.setAttribute("aria-valuemin","0"),i.setAttribute("aria-valuemax","100"),i.setAttribute("aria-valuenow","0"),i.setAttribute("aria-valuetext","ゴールまで あと 100%"),i.style.position="relative",i.style.display="flex",i.style.alignItems="center",i.style.justifyContent="center",i.style.gap="0.4rem",i.style.margin="0 auto 0.4rem",i.style.width=window.innerHeight<=500?"clamp(100px, 24vmin, 180px)":"clamp(160px, 32vmin, 280px)",i.style.pointerEvents="none",i.style.fontFamily="'Zen Maru Gothic', sans-serif";const a=document.createElement("div");a.setAttribute("data-stage-progress-ship",""),a.textContent="🚀",a.style.fontSize="clamp(0.9rem, 2.4vmin, 1.1rem)",a.style.lineHeight="1",a.style.pointerEvents="none";const n=document.createElement("div");n.setAttribute("data-stage-progress-track",""),n.style.flex="1",n.style.height="14px",n.style.background=this.highContrastMode?"rgba(6, 12, 28, 0.94)":"rgba(255, 255, 255, 0.18)",n.style.borderRadius="7px",n.style.overflow="hidden",n.style.boxShadow="inset 0 2px 6px rgba(0, 0, 0, 0.35)",n.style.border=this.highContrastMode?"3px solid rgba(255, 255, 255, 0.92)":"none";const o=document.createElement("div");o.setAttribute("data-stage-progress-fill",""),o.style.height="100%",o.style.width="0%",o.style.borderRadius="7px",o.style.background=this.highContrastMode?`repeating-linear-gradient(90deg, #ffffff 0 10px, #00ddff 10px 18px, ${e} 18px 30px)`:`linear-gradient(90deg, #00ddff, ${e})`,o.style.transition="width 0.15s linear",o.setAttribute("data-stage-progress-color",e),n.appendChild(o);const h=document.createElement("div");h.setAttribute("data-stage-progress-goal",""),h.textContent="🪐",h.style.fontSize="clamp(0.9rem, 2.4vmin, 1.1rem)",h.style.lineHeight="1",h.style.pointerEvents="none",h.style.textShadow=`0 0 8px ${e}`,i.appendChild(a),i.appendChild(n),i.appendChild(h),t.appendChild(i),this.stageProgressContainer=i,this.stageProgressTrack=n,this.stageProgressFill=o,this.stageProgressGoalEl=h}toCssColor(t){return`#${Math.max(0,Math.min(16777215,Math.floor(t))).toString(16).padStart(6,"0")}`}createMuteButton(){const t=document.getElementById("hud");t&&(this.muteHandle=bt({initialMuted:this.muted,container:t,onToggle:()=>this.onMuteCallback?.()}),this.muteButton=this.muteHandle.element)}createPauseButton(){const t=document.getElementById("hud");if(!t)return;const s=window.innerHeight<=500;this.pauseButton=document.createElement("button"),this.pauseButton.textContent="✋ やすむ",this.pauseButton.setAttribute("aria-label","やすむ"),this.pauseButton.style.position="absolute",this.pauseButton.style.top="0.8rem",this.pauseButton.style.left=s?"4rem":"4.7rem",this.pauseButton.style.fontFamily="'Zen Maru Gothic', sans-serif",this.pauseButton.style.fontSize=s?"clamp(0.9rem, 3.2vmin, 1rem)":"clamp(1rem, 3.5vmin, 1.15rem)",this.pauseButton.style.fontWeight="900",this.pauseButton.style.padding=s?"0.45rem 0.9rem":"0.7rem 1.2rem",this.pauseButton.style.border="none",this.pauseButton.style.borderRadius="999px",this.pauseButton.style.background="rgba(255, 255, 255, 0.16)",this.pauseButton.style.color="#fff",this.pauseButton.style.cursor="pointer",this.pauseButton.style.pointerEvents="auto",this.pauseButton.style.touchAction="manipulation",this.pauseButton.style.boxShadow="0 4px 14px rgba(0, 0, 0, 0.2)",this.pauseButton.style.transform="scale(1)",this.pauseButton.style.transition="transform 0.08s ease-out, opacity 0.12s ease-out",this.pauseButton.style.minHeight=s?"2.4rem":"3rem",this.pauseButton.style.minWidth=s?"5.6rem":"7rem",this.pauseButtonCleanup=T(this.pauseButton,{onActivate:()=>this.onPauseCallback?.(),canActivate:()=>this.pauseEnabled,onPressChange:e=>{this.pauseButton&&(this.pauseButton.style.transform=e?"scale(0.95)":"scale(1)")}}),t.appendChild(this.pauseButton),this.applyPauseButtonState()}createBoostButton(){const t=document.getElementById("ui-overlay");if(!t)return;this.injectBoostAnimations(),this.boostButton=document.createElement("button"),this.boostButton.textContent="🚀 ブースト!",this.boostButton.setAttribute("aria-label","ブースト"),this.boostButton.setAttribute("aria-disabled","false");const s=window.innerHeight<=500;this.boostButton.style.position="absolute",this.boostButton.style.bottom=s?"1rem":"2rem",this.boostButton.style.right=s?"1rem":"2rem",this.boostButton.style.fontFamily="'Zen Maru Gothic', sans-serif",this.boostButton.style.fontSize=s?"clamp(0.85rem, 2.8vmin, 1.05rem)":"clamp(1rem, 3.5vmin, 1.3rem)",this.boostButton.style.fontWeight="700",this.boostButton.style.padding=s?"0.5rem 1rem":"0.8rem 1.5rem",this.boostButton.style.border="none",this.boostButton.style.borderRadius="2rem",this.boostButton.style.background="linear-gradient(135deg, #FF6B6B, #FFD93D, #6BCB77)",this.boostButton.style.color="#fff",this.boostButton.style.cursor="pointer",this.boostButton.style.touchAction="manipulation",this.boostButton.style.pointerEvents="auto",this.boostButton.style.boxShadow="0 4px 15px rgba(255, 107, 107, 0.4)",this.boostButton.style.animation="boostBtnPulse 2s ease-in-out infinite",this.boostButton.addEventListener("pointerdown",e=>{e.stopPropagation();const i=this.boostButton;if(i&&!this.boostLocked){if(this.lastCooldownProgress<1){if(i.hasAttribute("data-boost-shake"))return;i.setAttribute("data-boost-shake",""),this.registerTimeout(()=>{i.removeAttribute("data-boost-shake")},250),this.onBoostDeniedCallback?.();return}i.style.transform="scale(0.9)",this.registerTimeout(()=>{i.style.transform="scale(1.0)"},150),this.onBoostCallback?.()}}),t.appendChild(this.boostButton),this.boostHintEl=document.createElement("div"),this.boostHintEl.setAttribute("data-boost-hint",""),this.boostHintEl.setAttribute("aria-hidden","true"),this.boostHintEl.style.cssText=`
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
      bottom: ${s?"0.4rem":"1rem"};
      right: ${s?"1rem":"2rem"};
      width: ${s?"60px":"80px"};
      height: 6px;
      border-radius: 3px;
      background: rgba(255, 255, 255, 0.2);
      pointer-events: none;
    `,this.cooldownContainer.style.position="absolute",this.cooldownContainer.style.bottom=s?"0.4rem":"1rem",this.cooldownContainer.style.right=s?"1rem":"2rem",this.cooldownBar=document.createElement("div"),this.cooldownBar.setAttribute("data-cooldown-bar",""),this.cooldownBar.style.cssText=`
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
    `,document.head.appendChild(t)}setBoostCallback(t){this.onBoostCallback=t}setBoostDeniedCallback(t){this.onBoostDeniedCallback=t}setBoostLocked(t){this.boostLocked=t,this.applyBoostButtonState()}setHomeCallback(t){this.onHomeCallback=t}setHomeConfirmOpenCallback(t){this.onHomeConfirmOpenCallback=t}setHomeConfirmCancelCallback(t){this.onHomeConfirmCancelCallback=t}setPauseCallback(t){this.onPauseCallback=t}setPauseEnabled(t){this.pauseEnabled=t,this.applyPauseButtonState()}setMuteCallback(t){this.onMuteCallback=t}setPauseOpenCallback(t){this.onPauseOpenCallback=t}setPauseResumeCallback(t){this.onPauseResumeCallback=t}setMuteState(t){this.muted=t,this.muteHandle?.setMuted(t)}setHighContrastMode(t){this.highContrastMode=t,this.applyColorAccessibilityState()}applyColorAccessibilityState(){if(this.stageNameEl&&(this.stageNameEl.style.color=this.highContrastMode?"#fff58f":"#FFD700",this.stageNameEl.style.textShadow=this.highContrastMode?"0 0 0 #000, 0 2px 8px rgba(0, 0, 0, 0.9), 0 0 20px rgba(255, 255, 255, 0.25)":"0 2px 8px rgba(0, 0, 0, 0.7)"),this.assistMessageEl&&(this.assistMessageEl.style.background=this.highContrastMode?"rgba(5, 10, 28, 0.96)":"rgba(255, 255, 255, 0.14)",this.assistMessageEl.style.border=this.highContrastMode?"3px solid rgba(255, 255, 255, 0.95)":"none",this.assistMessageEl.style.color=this.highContrastMode?"#ffffff":"#fff7bf"),this.bestStarContainerEl&&(this.bestStarContainerEl.style.color=this.highContrastMode?"#e6f4ff":"#9ec5ff",this.bestStarContainerEl.style.opacity=this.highContrastMode?"1":"0.7"),this.stageProgressTrack&&(this.stageProgressTrack.style.background=this.highContrastMode?"rgba(6, 12, 28, 0.94)":"rgba(255, 255, 255, 0.18)",this.stageProgressTrack.style.border=this.highContrastMode?"3px solid rgba(255, 255, 255, 0.92)":"none"),this.stageProgressFill){const t=this.stageProgressFill.getAttribute("data-stage-progress-color")??"#ffd700";this.stageProgressFill.style.background=this.highContrastMode?`repeating-linear-gradient(90deg, #ffffff 0 10px, #00ddff 10px 18px, ${t} 18px 30px)`:`linear-gradient(90deg, #00ddff, ${t})`}if(this.stageProgressGoalEl){const t=this.stageProgressFill?.getAttribute("data-stage-progress-color")??"#ffd700";this.stageProgressGoalEl.style.textShadow=this.highContrastMode?`0 0 0 #000, 0 0 12px #ffffff, 0 0 18px ${t}`:`0 0 8px ${t}`}this.boostButton&&(this.boostButton.style.border=this.highContrastMode?"4px solid rgba(255, 255, 255, 0.95)":"none",this.boostButton.style.background=this.highContrastMode?"linear-gradient(135deg, #fff27a, #76f0ff, #6BCB77)":"linear-gradient(135deg, #FF6B6B, #FFD93D, #6BCB77)",this.boostButton.style.color=this.highContrastMode?"#0b1535":"#fff"),this.cooldownContainer&&(this.cooldownContainer.style.background=this.highContrastMode?"rgba(6, 12, 28, 0.94)":"rgba(255, 255, 255, 0.2)",this.cooldownContainer.style.border=this.highContrastMode?"2px solid rgba(255, 255, 255, 0.95)":"none",this.cooldownContainer.style.height=this.highContrastMode?"10px":"6px"),this.cooldownBar&&(this.cooldownBar.style.background=this.highContrastMode?"repeating-linear-gradient(90deg, #ffffff 0 10px, #00ddff 10px 18px, #00ff88 18px 30px)":"linear-gradient(90deg, #00ddff, #00ff88)"),this.applyBoostButtonState()}showAssistMessage(t){this.assistMessageEl&&(this.assistMessageEl.textContent=t,this.assistMessageEl.style.display="block",this.announcePolite(t))}hideAssistMessage(){this.assistMessageEl&&(this.assistMessageEl.style.display="none",this.assistMessageEl.textContent="")}showBoostHint(t){!this.boostHintEl||!this.boostButton||!this.cooldownContainer||(this.boostHintEl.textContent=t,this.boostHintEl.style.display="block",this.boostHintEl.setAttribute("data-boost-hint-visible",""),this.boostHintEl.setAttribute("aria-hidden","false"),this.boostButton.setAttribute("data-boost-hint-active",""),this.cooldownContainer.setAttribute("data-boost-hint-active",""))}hideBoostHint(){this.boostHintEl&&(this.boostHintEl.style.display="none",this.boostHintEl.textContent="",this.boostHintEl.removeAttribute("data-boost-hint-visible"),this.boostHintEl.setAttribute("aria-hidden","true")),this.boostButton?.removeAttribute("data-boost-hint-active"),this.cooldownContainer?.removeAttribute("data-boost-hint-active")}isMuted(){return this.muted}update(t,s){if(this.scoreEl&&t!==this.lastScore){const e=this.lastScore;this.scoreEl.textContent=String(t),this.lastScore=t,e!==-1&&t>e&&this.flashCount(this.scoreEl)}if(this.starCountEl&&s!==this.lastStarCount){const e=this.lastStarCount;this.starCountEl.textContent=String(s),this.lastStarCount=s,e!==-1&&s>e&&(this.flashCount(this.starCountEl),this.announcePolite(`ほし ${s}こ ゲット！`))}this.bestStarCount>0&&!this.bestStarPulsed&&s>this.bestStarCount&&this.bestStarContainerEl&&this.bestStarContainerEl.style.display!=="none"&&(this.bestStarPulsed=!0,this.flashCount(this.bestStarContainerEl))}setBestStarCount(t){const s=Number.isInteger(t)&&t>0?t:0;this.bestStarCount=s,this.bestStarPulsed=!1,!(!this.bestStarContainerEl||!this.bestStarCountEl)&&(s>0?(this.lastBestStarCount!==s&&(this.bestStarCountEl.textContent=String(s),this.lastBestStarCount=s),this.bestStarContainerEl.style.display=""):(this.bestStarContainerEl.style.display="none",this.lastBestStarCount=-1))}flashCount(t){if(t.hasAttribute("data-hud-count-pop"))return;t.setAttribute("data-hud-count-pop","");let s=!1;const e=()=>{s||(s=!0,t.removeAttribute("data-hud-count-pop"),t.removeEventListener("animationend",i))},i=a=>{a.animationName==="hudCountPop"&&e()};t.addEventListener("animationend",i),this.registerTimeout(e,500)}registerTimeout(t,s){let e=0;return e=window.setTimeout(()=>{this.pendingTimeouts.delete(e),t()},s),this.pendingTimeouts.add(e),e}clearPendingTimeouts(){for(const t of this.pendingTimeouts)window.clearTimeout(t);this.pendingTimeouts.clear()}updateCooldown(t){if(!this.cooldownBar||!this.boostButton)return;const s=Math.max(0,Math.min(1,t)),e=Math.round(s*100);e!==this.lastCooldownPct&&(this.cooldownBar.style.width=`${e}%`,this.lastCooldownPct=e),this.lastCooldownProgress=s;const i=s>=1;i!==this.lastReadyState&&(this.lastReadyState=i,this.applyBoostButtonState())}updateStageProgress(t){if(!this.stageProgressContainer||!this.stageProgressFill)return;const s=Math.max(0,Math.min(1,t)),e=Math.round(s*100);e!==this.lastStageProgressPct&&(this.stageProgressFill.style.width=`${e}%`,this.stageProgressContainer.setAttribute("aria-valuenow",String(e)),this.stageProgressContainer.setAttribute("aria-valuetext",`ゴールまで あと ${100-e}%`),this.lastStageProgressPct=e),this.announceStageProgressMilestone(e);const i=s>=1;i!==this.lastStageProgressComplete&&(i?(this.stageProgressContainer.setAttribute("data-stage-progress-complete",""),this.flashStageGoal()):this.stageProgressContainer.removeAttribute("data-stage-progress-complete"),this.lastStageProgressComplete=i)}flashStageGoal(){const t=this.stageProgressGoalEl;if(!t||t.hasAttribute("data-stage-goal-flash"))return;t.setAttribute("data-stage-goal-flash","");let s=!1;const e=()=>{s||(s=!0,t.removeAttribute("data-stage-goal-flash"),t.removeEventListener("animationend",i))},i=a=>{a.animationName==="stageGoalFlash"&&e()};t.addEventListener("animationend",i),this.registerTimeout(e,500)}flashBoostReady(){const t=this.boostButton;if(!t||t.hasAttribute("data-boost-ready-flash"))return;this.announcePolite("ブースト じゅんび OK！"),t.setAttribute("data-boost-ready-flash","");let s=!1;const e=()=>{s||(s=!0,t.removeAttribute("data-boost-ready-flash"),t.removeEventListener("animationend",i),this.lastReadyState===!0&&(t.style.animation="boostBtnPulse 2s ease-in-out infinite, boostReadyRing 1.15s ease-in-out infinite"))},i=a=>{a.animationName==="boostBtnReadyFlash"&&e()};t.addEventListener("animationend",i),this.registerTimeout(e,500)}clearBoostReadyFlash(){this.boostButton?.hasAttribute("data-boost-ready-flash")&&this.boostButton.removeAttribute("data-boost-ready-flash")}announceMeteoriteHit(){this.announceAssertive("いんせきに ぶつかった！ シールド かいふくちゅう")}announceStageClear(t,s=!1,e=!1){const i=[`ステージ クリア！ ほし ${t}こ あつめたよ！`];e&&i.push("じこベスト こうしん！"),s&&i.push("あたらしい なかまも みつけたよ！"),this.announceAssertive(i.join(" "))}applyBoostButtonState(){if(!this.cooldownBar||!this.boostButton)return;const s=this.lastCooldownProgress>=1&&!this.boostLocked;this.cooldownBar.style.boxShadow=s?this.highContrastMode?"0 0 0 2px rgba(255, 255, 255, 0.7), 0 0 14px #00ff88":"0 0 10px #00ff88":"none",this.boostButton.style.opacity=s?"1":"0.5",this.boostButton.style.filter=s?"none":"grayscale(0.8)",this.boostButton.style.animation=s?"boostBtnPulse 2s ease-in-out infinite, boostReadyRing 1.15s ease-in-out infinite":"none",s?this.boostButton.setAttribute("data-boost-ready-ring",""):this.boostButton.removeAttribute("data-boost-ready-ring"),this.boostButton.setAttribute("aria-disabled",s?"false":"true"),s||(this.clearBoostReadyFlash(),this.hideBoostHint())}applyPauseButtonState(){this.pauseButton&&(this.pauseButton.style.opacity=this.pauseEnabled?"1":"0.45",this.pauseButton.style.filter=this.pauseEnabled?"none":"grayscale(0.8)",this.pauseButton.style.cursor=this.pauseEnabled?"pointer":"default",this.pauseButton.setAttribute("aria-disabled",this.pauseEnabled?"false":"true"))}createLiveRegions(t){this.politeLiveRegionEl=this.createLiveRegion("polite"),this.assertiveLiveRegionEl=this.createLiveRegion("assertive"),t.appendChild(this.politeLiveRegionEl),t.appendChild(this.assertiveLiveRegionEl)}createLiveRegion(t){const s=document.createElement("div");return s.setAttribute("data-hud-live-region",t),s.setAttribute("aria-live",t),s.setAttribute("aria-atomic","true"),s.setAttribute("role",t==="assertive"?"alert":"status"),s.style.cssText=`
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    `,s}announcePolite(t){this.writeLiveRegion(this.politeLiveRegionEl,t)}announceAssertive(t){this.writeLiveRegion(this.assertiveLiveRegionEl,t)}writeLiveRegion(t,s){if(!t||s.length===0)return;this.liveRegionWriteNonce+=1;const e=this.liveRegionWriteNonce%2===0?"​":"‌";t.textContent=`${s}${e}`,t.setAttribute("data-live-message",s)}announceStageProgressMilestone(t){if(t>=100){this.lastAnnouncedProgressThreshold<100&&(this.announcePolite("ゴール！"),this.lastAnnouncedProgressThreshold=100);return}const s=[{pct:75,remaining:25},{pct:50,remaining:50},{pct:25,remaining:75}];for(const e of s)t>=e.pct&&this.lastAnnouncedProgressThreshold<e.pct&&(this.lastAnnouncedProgressThreshold=e.pct,this.announcePolite(`ゴールまで あと ${e.remaining}%`))}hide(){this.clearPendingTimeouts(),this.homeConfirmOverlay.hide(),this.pauseOverlay.hide(),this.homeButton&&(this.homeButton.remove(),this.homeButton=null),this.pauseButtonCleanup?.(),this.pauseButtonCleanup=null,this.pauseButton&&(this.pauseButton.remove(),this.pauseButton=null),this.muteHandle&&(this.muteHandle.remove(),this.muteHandle=null),this.muteButton=null,this.stageNameEl&&(this.stageNameEl.remove(),this.stageNameEl=null),this.assistMessageEl&&(this.assistMessageEl.remove(),this.assistMessageEl=null),this.politeLiveRegionEl&&(this.politeLiveRegionEl.remove(),this.politeLiveRegionEl=null),this.assertiveLiveRegionEl&&(this.assertiveLiveRegionEl.remove(),this.assertiveLiveRegionEl=null),this.stageProgressContainer&&(this.stageProgressContainer.remove(),this.stageProgressContainer=null),this.stageProgressTrack=null,this.stageProgressFill=null,this.stageProgressGoalEl=null,this.container&&(this.container.remove(),this.container=null),this.boostButton&&(this.boostButton.remove(),this.boostButton=null),this.boostHintEl&&(this.boostHintEl.remove(),this.boostHintEl=null),this.cooldownContainer&&(this.cooldownContainer.remove(),this.cooldownContainer=null),this.cooldownBar=null,this.boostLocked=!1,this.pauseEnabled=!0,this.lastCooldownProgress=1,this.lastCooldownPct=-1,this.lastReadyState=null,this.lastStageProgressPct=-1,this.lastStageProgressComplete=null,this.lastScore=-1,this.lastStarCount=-1,this.scoreEl=null,this.starCountEl=null,this.bestStarContainerEl=null,this.bestStarCountEl=null,this.bestStarCount=0,this.lastBestStarCount=-1,this.bestStarPulsed=!1,this.liveRegionWriteNonce=0,this.lastAnnouncedProgressThreshold=0}}class Pe{overlayEl=null;bubbleEl=null;highContrastMode=!1;show(t,s){const e=document.getElementById("ui-overlay");e&&(this.injectStyles(),(!this.overlayEl||!this.bubbleEl)&&(this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-adaptive-tutorial-hint",""),this.overlayEl.setAttribute("aria-hidden","true"),this.overlayEl.style.cssText=`
        position: absolute;
        top: clamp(4.6rem, 13vh, 6.8rem);
        left: 50%;
        transform: translateX(-50%);
        pointer-events: none;
        z-index: 11;
      `,this.bubbleEl=document.createElement("div"),this.bubbleEl.setAttribute("data-adaptive-tutorial-bubble",""),this.bubbleEl.setAttribute("role","status"),this.bubbleEl.setAttribute("aria-live","polite"),this.bubbleEl.setAttribute("aria-atomic","true"),this.overlayEl.appendChild(this.bubbleEl)),this.overlayEl.setAttribute("aria-hidden","false"),this.overlayEl.style.display="block",this.overlayEl.setAttribute("data-adaptive-tutorial-kind",s),this.overlayEl.setAttribute("data-adaptive-tutorial-contrast",this.highContrastMode?"high":"default"),this.bubbleEl.textContent=t,this.applyStyles(s),this.overlayEl.isConnected||e.appendChild(this.overlayEl))}hide(){!this.overlayEl||!this.bubbleEl||(this.overlayEl.style.display="none",this.overlayEl.setAttribute("aria-hidden","true"),this.overlayEl.removeAttribute("data-adaptive-tutorial-kind"),this.bubbleEl.textContent="")}setHighContrastMode(t){this.highContrastMode=t,this.overlayEl?.setAttribute("data-adaptive-tutorial-contrast",t?"high":"default");const s=this.overlayEl?.getAttribute("data-adaptive-tutorial-kind");!this.bubbleEl||!s||this.applyStyles(s)}applyStyles(t){if(!this.bubbleEl)return;const s=t==="meteorite"?{background:this.highContrastMode?"rgba(5, 10, 28, 0.96)":"rgba(29, 35, 84, 0.92)",border:this.highContrastMode?"3px solid rgba(255, 255, 255, 0.95)":"2px solid rgba(255, 187, 117, 0.95)",color:"#ffffff",shadow:this.highContrastMode?"0 12px 28px rgba(0, 0, 0, 0.42)":"0 12px 28px rgba(255, 143, 61, 0.22)"}:{background:this.highContrastMode?"rgba(5, 10, 28, 0.96)":"rgba(15, 23, 58, 0.92)",border:this.highContrastMode?"3px solid rgba(255, 255, 255, 0.95)":"2px solid rgba(255, 227, 120, 0.95)",color:"#ffffff",shadow:this.highContrastMode?"0 12px 28px rgba(0, 0, 0, 0.42)":"0 12px 28px rgba(255, 215, 0, 0.2)"};this.bubbleEl.style.cssText=`
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 2.9rem;
      max-width: min(78vw, 28rem);
      padding: 0.7rem 1.15rem;
      border-radius: 999px;
      background: ${s.background};
      border: ${s.border};
      color: ${s.color};
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(1rem, 3.4vmin, 1.18rem);
      font-weight: 700;
      line-height: 1.35;
      text-align: center;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);
      box-shadow: ${s.shadow};
      white-space: nowrap;
    `}injectStyles(){if(document.getElementById("adaptive-tutorial-hint-styles"))return;const t=document.createElement("style");t.id="adaptive-tutorial-hint-styles",t.textContent=`
      @keyframes adaptiveTutorialHintFloat {
        0%, 100% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-3px) scale(1.02); }
      }

      [data-adaptive-tutorial-bubble] {
        animation: adaptiveTutorialHintFloat 1.2s ease-in-out infinite;
      }
    `,document.head.appendChild(t)}}const Oe=1,Re=.4;class wt{overlayEl=null;numberEl=null;phase="idle";elapsed=0;currentStep=0;stepDuration;goDuration;onTick;onGo;onComplete=null;steps=["3","2","1"];constructor(t={}){this.stepDuration=t.stepDuration??Oe,this.goDuration=t.goDuration??Re,this.onTick=t.onTick,this.onGo=t.onGo}show(t){if(this.phase!=="idle"&&this.phase!=="done")return;const s=document.getElementById("ui-overlay")??document.body;this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-countdown-overlay",""),this.overlayEl.style.cssText=`
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
    `,this.overlayEl.appendChild(this.numberEl),s.appendChild(this.overlayEl),this.phase="counting",this.elapsed=0,this.currentStep=0,this.onComplete=t,this.renderStep(this.steps[this.currentStep]),this.fireTick()}tick(t){if(!(this.phase==="idle"||this.phase==="done")){if(t<0&&(t=0),this.elapsed+=t,this.phase==="counting"){const s=this.elapsed;this.applyStepAnimation(s/this.stepDuration),s>=this.stepDuration&&(this.currentStep++,this.elapsed=0,this.currentStep<this.steps.length?(this.renderStep(this.steps[this.currentStep]),this.fireTick()):(this.phase="go",this.renderStep("スタート！"),this.fireGo()));return}this.phase==="go"&&(this.applyStepAnimation(this.elapsed/this.goDuration),this.elapsed>=this.goDuration&&this.complete())}}hide(){this.overlayEl&&(this.overlayEl.remove(),this.overlayEl=null),this.numberEl=null,this.phase="done",this.onComplete=null}dispose(){this.hide(),this.onTick=void 0,this.onGo=void 0}isActive(){return this.phase==="counting"||this.phase==="go"}getCurrentLabel(){return this.numberEl?.textContent??null}renderStep(t){this.numberEl&&(this.numberEl.textContent=t,this.numberEl.style.opacity="0",this.numberEl.style.transform="scale(0.6)")}applyStepAnimation(t){if(!this.numberEl)return;const s=Math.max(0,Math.min(1,t));let e,i;if(s<.2){const a=s/.2;e=.6+a*.5,i=a}else if(s<.7)e=1.1-(s-.2)/.5*.1,i=1;else{const a=(s-.7)/.3;e=1+a*.2,i=1-a}this.numberEl.style.transform=`scale(${e.toFixed(3)})`,this.numberEl.style.opacity=i.toFixed(3)}fireTick(){try{this.onTick?.()}catch{}}fireGo(){try{this.onGo?.()}catch{}}complete(){const t=this.onComplete;if(this.hide(),t)try{t()}catch{}}}const Ie=1.8;class ke{constructor(t,s={}){this.entry=t,this.totalDuration=s.totalDuration??Ie}overlayEl=null;cardEl=null;phase="idle";elapsed=0;onComplete=null;totalDuration;show(t){if(this.phase!=="idle"&&this.phase!=="done")return;const s=document.getElementById("ui-overlay")??document.body;Dt();const e=L().height<=500;this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-stage-intro-overlay",""),this.overlayEl.style.cssText=`
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: ${e?"0.75rem":"1.2rem"};
      pointer-events: none;
      z-index: 24;
      opacity: 0;
      will-change: opacity;
    `,this.cardEl=document.createElement("div"),this.cardEl.setAttribute("data-stage-intro-card",""),this.cardEl.setAttribute("data-stage-intro-compact",e?"true":"false"),this.cardEl.style.cssText=`
      width: min(${e?"88vw":"82vw"}, ${e?"22rem":"30rem"});
      max-width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: ${e?"0.25rem":"0.5rem"};
      padding: ${e?"0.9rem 1rem":"1.4rem 1.6rem"};
      border-radius: ${e?"24px":"32px"};
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
      font-size: ${e?"0.85rem":"1rem"};
      font-weight: 800;
      letter-spacing: 0.08em;
      color: #bcd9ff;
    `;const a=document.createElement("div");a.textContent=this.entry.emoji,a.setAttribute("data-stage-intro-emoji",""),a.style.cssText=`
      font-size: ${e?"clamp(3rem, 15vw, 4.2rem)":"clamp(4.4rem, 18vw, 6rem)"};
      line-height: 1;
      filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.28));
    `;const n=document.createElement("div");n.textContent=this.entry.reading,n.setAttribute("data-stage-intro-name",""),n.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${e?"clamp(1.8rem, 8vw, 2.6rem)":"clamp(2.5rem, 10vw, 3.4rem)"};
      font-weight: 900;
      line-height: 1.05;
      color: #ffffff;
      text-shadow: 0 0 18px rgba(126, 199, 255, 0.2);
    `;const o=document.createElement("div");o.textContent=this.entry.trivia,o.setAttribute("data-stage-intro-trivia",""),o.style.cssText=`
      max-width: 100%;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${e?"clamp(0.88rem, 3.4vmin, 1rem)":"clamp(1.02rem, 3.7vmin, 1.15rem)"};
      font-weight: 700;
      line-height: 1.35;
      color: #eef5ff;
      overflow-wrap: anywhere;
    `,this.cardEl.append(i,a,n,o),this.overlayEl.appendChild(this.cardEl),s.appendChild(this.overlayEl),this.phase="showing",this.elapsed=0,this.onComplete=t,this.applyAnimation(0)}tick(t){this.phase==="showing"&&(this.elapsed+=Math.max(0,t),this.applyAnimation(this.elapsed/this.totalDuration),this.elapsed>=this.totalDuration&&this.complete())}hide(){this.overlayEl&&(this.overlayEl.remove(),this.overlayEl=null),this.cardEl=null,this.phase="done",this.onComplete=null}dispose(){this.hide()}isActive(){return this.phase==="showing"}applyAnimation(t){if(!this.overlayEl||!this.cardEl)return;const s=Math.max(0,Math.min(1,t));let e=1,i=1,a=0,n=1;if(s<.18){const o=s/.18;i=o,e=o,a=24-24*o,n=.92+.1*o}else if(s<.72){const o=(s-.18)/.54;i=1,e=1,a=0,n=1.02-.02*o}else{const o=(s-.72)/.28;i=1-o*.8,e=1-o,a=-18*o,n=1-.04*o}this.overlayEl.style.opacity=i.toFixed(3),this.cardEl.style.opacity=e.toFixed(3),this.cardEl.style.transform=`translateY(${a.toFixed(1)}px) scale(${n.toFixed(3)})`}complete(){const t=this.onComplete;if(this.hide(),!!t)try{t()}catch{}}}class G{static STYLE_ID="score-popup-animations";static POOL_SIZE=6;static POPUP_LIFETIME_MS=720;root=null;pool=[];highContrastMode=!1;nextRecycleIndex=0;scratch=new rt;setHighContrastMode(t){this.highContrastMode=t}show(t,s,e){const i=this.ensureRoot();if(!i||(this.scratch.set(s.x,s.y,s.z).project(e),!Number.isFinite(this.scratch.x)||!Number.isFinite(this.scratch.y)||!Number.isFinite(this.scratch.z)))return;const a=Math.round((this.scratch.x*.5+.5)*1e5)/1e3,n=Math.round((-this.scratch.y*.5+.5)*1e5)/1e3,o=this.acquireEntry(i),h=t>=500,d=h?"#ff9cf7":"#ffe066",l=o.useAltAnimation?"scorePopupFloatB":"scorePopupFloatA";o.useAltAnimation=!o.useAltAnimation,o.currentAnimationName=l,o.el.textContent=`${h?"🌈":"⬢"} +${t}`,o.el.style.left=`${a}%`,o.el.style.top=`${n}%`,o.el.style.color=d,o.el.style.textShadow=`0 2px 10px ${h?"rgba(255, 156, 247, 0.55)":"rgba(255, 214, 102, 0.55)"}`,o.el.style.background=this.highContrastMode?h?"rgba(13, 18, 38, 0.92)":"rgba(0, 0, 0, 0.82)":"transparent",o.el.style.border=this.highContrastMode?h?"3px solid rgba(255, 255, 255, 0.95)":"2px dashed rgba(255, 255, 255, 0.95)":"none",o.el.style.borderRadius=this.highContrastMode?"999px":"0",o.el.style.padding=this.highContrastMode?"0.18rem 0.55rem":"0",o.el.style.setProperty("-webkit-text-stroke",this.highContrastMode?"0.6px #061126":"0"),o.el.setAttribute("data-score-popup-kind",h?"bonus":"normal"),o.el.style.visibility="visible",o.el.style.opacity="1",o.el.style.animationName=l,o.el.removeAttribute("data-score-popup-active"),o.el.setAttribute("data-score-popup-active",""),o.active=!0;const p=()=>{this.releaseEntry(o)};o.onAnimationEnd=g=>{g.animationName===o.currentAnimationName&&p()},o.el.addEventListener("animationend",o.onAnimationEnd),o.timeoutId=window.setTimeout(p,G.POPUP_LIFETIME_MS)}dispose(){for(const t of this.pool)this.clearEntry(t),t.el.remove();this.pool=[],this.root?.remove(),this.root=null,this.nextRecycleIndex=0}ensureRoot(){const t=document.getElementById("ui-overlay");return t?(this.root&&(this.root.parentElement!==t||!this.root.isConnected)&&this.dispose(),this.root?this.root:(this.injectStyles(),this.root=document.createElement("div"),this.root.setAttribute("data-score-popup-root",""),this.root.style.position="absolute",this.root.style.inset="0",this.root.style.overflow="hidden",this.root.style.pointerEvents="none",this.root.style.contain="layout style paint",t.appendChild(this.root),this.root)):null}acquireEntry(t){if(this.pool.length<G.POOL_SIZE){const e=this.createEntry();return this.pool.push(e),t.appendChild(e.el),e}const s=this.pool.find(e=>!e.active)??this.pool[this.nextRecycleIndex++%this.pool.length];return this.clearEntry(s),s}createEntry(){const t=document.createElement("div");return t.setAttribute("data-score-popup",""),t.style.position="absolute",t.style.transform="translate3d(-50%, -50%, 0)",t.style.fontFamily="'Zen Maru Gothic', sans-serif",t.style.fontSize="clamp(1rem, 3.5vmin, 1.4rem)",t.style.fontWeight="900",t.style.lineHeight="1",t.style.whiteSpace="nowrap",t.style.pointerEvents="none",t.style.willChange="transform, opacity",t.style.visibility="hidden",t.style.opacity="0",t.style.animationDuration=`${G.POPUP_LIFETIME_MS}ms`,t.style.animationTimingFunction="ease-out",t.style.animationIterationCount="1",{el:t,active:!1,timeoutId:null,onAnimationEnd:null,useAltAnimation:!1,currentAnimationName:"none"}}releaseEntry(t){this.clearEntry(t),t.el.style.visibility="hidden",t.el.style.opacity="0"}clearEntry(t){t.active=!1,t.currentAnimationName="none",t.el.removeAttribute("data-score-popup-active"),t.el.removeAttribute("data-score-popup-kind"),t.el.style.animationName="none",t.timeoutId!==null&&(window.clearTimeout(t.timeoutId),t.timeoutId=null),t.onAnimationEnd&&(t.el.removeEventListener("animationend",t.onAnimationEnd),t.onAnimationEnd=null)}injectStyles(){if(document.getElementById(G.STYLE_ID))return;const t=document.createElement("style");t.id=G.STYLE_ID,t.textContent=`
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
    `,document.head.appendChild(t)}}class De{overlayEl=null;leftGuideEl=null;rightGuideEl=null;instructionEl=null;currentMode=null;show(t="intro"){if(this.overlayEl){this.setMode(t);return}const s=document.getElementById("ui-overlay");s&&(this.injectStyles(),this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-touch-guide-overlay",""),this.overlayEl.setAttribute("role","region"),this.overlayEl.setAttribute("aria-label","そうさ ガイド"),this.overlayEl.style.cssText=`
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 12;
    `,this.leftGuideEl=this.createGuide("left","⬅️ ひだり"),this.rightGuideEl=this.createGuide("right","みぎ ➡️"),this.instructionEl=this.createInstruction(),this.overlayEl.appendChild(this.leftGuideEl),this.overlayEl.appendChild(this.rightGuideEl),this.overlayEl.appendChild(this.instructionEl),s.appendChild(this.overlayEl),this.setMode(t))}setMode(t){!this.overlayEl||this.currentMode===t||(this.currentMode=t,this.overlayEl.setAttribute("data-touch-guide-state",t),this.overlayEl.setAttribute("data-touch-guide-active-side",this.getActiveSide(t)),this.overlayEl.setAttribute("aria-hidden",t==="hidden"?"true":"false"),this.overlayEl.style.visibility=t==="hidden"?"hidden":"visible",this.leftGuideEl?.setAttribute("data-touch-guide-emphasis",this.getGuideEmphasis("left",t)),this.rightGuideEl?.setAttribute("data-touch-guide-emphasis",this.getGuideEmphasis("right",t)),this.updateInstruction(t))}hide(){this.overlayEl&&(this.overlayEl.remove(),this.overlayEl=null,this.leftGuideEl=null,this.rightGuideEl=null,this.instructionEl=null,this.currentMode=null)}createGuide(t,s){const e=document.createElement("div");return e.setAttribute("data-touch-guide",t),e.setAttribute("aria-hidden","true"),e.textContent=s,e.style.position="absolute",e.style.top="50%",e.style.transform="translateY(-50%)",e.style.maxWidth="min(24vw, 11rem)",e.style.padding="0.7rem 1rem",e.style.borderRadius="999px",e.style.background="rgba(6, 19, 58, 0.38)",e.style.border="2px solid rgba(255, 255, 255, 0.24)",e.style.color="#ffffff",e.style.fontFamily="'Zen Maru Gothic', sans-serif",e.style.fontSize="clamp(1rem, 2.8vmin, 1.3rem)",e.style.fontWeight="700",e.style.textShadow="0 2px 10px rgba(0, 0, 0, 0.45)",e.style.boxShadow="0 8px 24px rgba(0, 0, 0, 0.16)",e.style.transition="opacity 0.24s ease-out, transform 0.24s ease-out",e.style.whiteSpace="nowrap",e.style.opacity="0",t==="left"?(e.style.left="0.8rem",e.style.textAlign="left"):(e.style.right="0.8rem",e.style.textAlign="right"),e}createInstruction(){const t=document.createElement("div");return t.setAttribute("data-touch-guide-instruction",""),t.setAttribute("role","status"),t.setAttribute("aria-live","polite"),t.setAttribute("aria-atomic","true"),t.style.cssText=`
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
    `,document.head.appendChild(t)}getActiveSide(t){return t==="active-left"?"left":t==="active-right"?"right":t==="assist-left"?"left":t==="assist-right"?"right":t==="hidden"?"none":"both"}getGuideEmphasis(t,s){return s==="active-left"?t==="left"?"primary":"secondary":s==="active-right"?t==="right"?"primary":"secondary":s==="assist-left"?t==="left"?"primary":"secondary":s==="assist-right"?t==="right"?"primary":"secondary":s==="hidden"?"hidden":"balanced"}updateInstruction(t){if(!this.instructionEl)return;const s=this.getInstructionMessage(t);this.instructionEl.textContent=s,this.instructionEl.setAttribute("data-touch-guide-message",s)}getInstructionMessage(t){return t==="intro"?"ひだりか みぎを さわると うごけるよ":t==="idle"?"ひつような ときは ひだりか みぎを さわって うごこう":t==="assist-left"?"ひだりへ よけよう":t==="assist-right"?"みぎへ よけよう":""}}class He{overlayEl=null;continueButton=null;retryButton=null;rewardButton=null;isContinueEnabled=!1;hasHandledContinue=!1;isRewardOpen=!1;buttonCleanups=new Set;show(t){this.hide();const s=document.getElementById("ui-overlay");if(!s)return;this.isContinueEnabled=!1,this.hasHandledContinue=!1,this.isRewardOpen=!1,this.injectStageClearBurstAnimation();const e=document.createElement("div");if(e.setAttribute("data-stage-clear-overlay",""),e.style.cssText=`
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
    `,this.overlayEl=e,this.appendClearCelebrationBurst(),e.appendChild(this.createHeading("やったね！",`
      position: relative;
      z-index: 1;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 3rem;
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
      margin-bottom: 1rem;
    `)),t.isBestUpdated&&(this.injectBestStageStarsAnimation(),e.appendChild(this.createHeading(`✨ じこベストこうしん！ ⭐ ${t.starCount} こ`,`
        position: relative;
        z-index: 1;
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: 1.2rem;
        font-weight: 700;
        color: #FFD700;
        margin-bottom: 0.6rem;
        text-shadow: 0 0 12px rgba(255, 215, 0, 0.6);
        animation: bestStageStarsPop 0.6s ease-out;
      `))),e.appendChild(this.createHeading(`⭐ ${t.starCount} こ あつめたよ！`,`
      position: relative;
      z-index: 1;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 1.5rem;
      font-weight: 700;
      color: #fff;
    `)),e.appendChild(this.createMedalSummary(t.stageNumber,t.starCount,t.bestStarCount)),t.nextEntry&&e.appendChild(this.createNextAdventureCard(t.nextEntry)),t.rewardEntry){e.appendChild(this.createHeading(`${t.rewardEntry.emoji} ${t.rewardEntry.name}の ずかんカード ゲット！`,`
        position: relative;
        z-index: 1;
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: 1.2rem;
        font-weight: 700;
        color: #FFD700;
        margin-top: 1rem;
        text-shadow: 0 0 10px rgba(255, 215, 0, 0.4);
      `)),e.appendChild(this.createHeading(`${t.rewardEntry.emoji} ${t.rewardEntry.name}が なかまに なったよ！`,`
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
      `,i.addEventListener("pointerdown",n=>{n.preventDefault(),n.stopPropagation(),!this.isRewardOpen&&(i.style.transform="scale(0.96)",t.onReward?.())});const a=()=>{i.style.transform="scale(1)"};i.addEventListener("pointerup",a),i.addEventListener("pointercancel",a),i.addEventListener("pointerleave",a),this.rewardButton=i,e.appendChild(i)}e.appendChild(this.createActionButtons(t)),s.appendChild(e)}hide(){const t=Array.from(this.buttonCleanups);this.buttonCleanups.clear();for(const s of t)s();this.overlayEl?.remove(),this.overlayEl=null,this.continueButton=null,this.retryButton=null,this.rewardButton=null,this.isContinueEnabled=!1,this.hasHandledContinue=!1,this.isRewardOpen=!1}enableContinue(){if(!this.isContinueEnabled&&!(!this.continueButton||!this.retryButton)){this.isContinueEnabled=!0;for(const t of[this.retryButton,this.continueButton])t.disabled=!1,t.style.opacity="1",t.style.visibility="visible",t.style.pointerEvents="auto"}}setRewardOpen(t){this.isRewardOpen=t,this.rewardButton&&(this.rewardButton.style.pointerEvents=t?"none":"auto",this.rewardButton.style.transform="scale(1)")}createHeading(t,s){const e=document.createElement("div");return e.textContent=t,e.style.cssText=s,e}createMedalSummary(t,s,e){const i=document.createElement("div");i.setAttribute("data-stage-clear-medals",""),i.style.cssText=`
      position: relative;
      z-index: 1;
      display: flex;
      align-items: stretch;
      justify-content: center;
      gap: 0.8rem;
      flex-wrap: wrap;
      margin-top: 0.9rem;
    `;const a=lt(t,s,{label:"こんかい",hint:`⭐ ${s}`,size:"hero",scope:"stage-clear-current"});a.style.minWidth="150px",a.style.padding="0.75rem 0.9rem",a.style.borderRadius="20px",a.style.background="rgba(255, 255, 255, 0.12)";const n=lt(t,e,{label:"ベスト",hint:`⭐ ${e}`,size:"hero",scope:"stage-clear-best"});return n.style.minWidth="150px",n.style.padding="0.75rem 0.9rem",n.style.borderRadius="20px",n.style.background="rgba(255, 255, 255, 0.12)",i.append(a,n),i}createNextAdventureCard(t){const s=document.createElement("section");s.setAttribute("data-stage-clear-next-preview",""),s.style.cssText=`
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
    `;const e=this.createHeading("つぎのぼうけん",`
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
    `;const n=this.createHeading(t.reading,`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(1.35rem, 4.8vmin, 1.8rem);
      font-weight: 800;
      color: #ffffff;
    `);n.setAttribute("data-stage-clear-next-name","");const o=this.createHeading(t.trivia,`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(1.02rem, 3.9vmin, 1.2rem);
      font-weight: 700;
      color: #dfeaff;
      line-height: 1.45;
    `);return o.setAttribute("data-stage-clear-next-trivia",""),s.append(e,i,a,n,o),s}createActionButtons(t){const s=document.createElement("div");s.style.cssText=`
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.9rem;
      width: 100%;
      margin-top: 1.4rem;
    `;const e=document.createElement("button");e.setAttribute("data-stage-clear-retry",""),e.setAttribute("aria-label","もういちど"),e.textContent="もういちど",e.disabled=!0,e.style.cssText=`
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
    `,e.style.opacity="0",e.style.visibility="hidden",e.style.pointerEvents="none";const i=document.createElement("button");return i.setAttribute("data-stage-clear-continue",""),i.setAttribute("aria-label",t.continueLabel),i.textContent=t.continueLabel,i.disabled=!0,i.style.cssText=`
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
    `,i.style.opacity="0",i.style.visibility="hidden",i.style.pointerEvents="none",this.attachActionHandlers(e,t.onRetry),this.attachActionHandlers(i,t.onContinue),this.retryButton=e,this.continueButton=i,s.append(e,i),s}attachActionHandlers(t,s){const e=()=>!this.isRewardOpen&&this.isContinueEnabled&&!this.hasHandledContinue,i=T(t,{canActivate:e,onActivate:()=>{if(e()){this.hasHandledContinue=!0;for(const a of[this.retryButton,this.continueButton])a&&(a.disabled=!0,a.style.pointerEvents="none",a.style.transform="scale(1)");s()}},onPressChange:a=>{t.style.transform=a?"scale(0.96)":"scale(1)"},preventDefaultOnPointerDown:!0,preventDefaultOnClick:!0,stopPropagation:!0});this.buttonCleanups.add(i)}appendClearCelebrationBurst(){if(!this.overlayEl)return;const t=document.createElement("div");t.setAttribute("data-stage-clear-burst",""),t.style.cssText=`
      position: absolute;
      inset: 0;
      overflow: hidden;
      pointer-events: none;
      z-index: 0;
    `;const s=[{emoji:"⭐",x:"0px",y:"-164px",midX:"0px",midY:"-84px",size:"2.6rem",scale:"1.12",delay:"0ms",duration:"1500ms"},{emoji:"✨",x:"138px",y:"-108px",midX:"72px",midY:"-56px",size:"2.2rem",scale:"0.96",delay:"90ms",duration:"1440ms"},{emoji:"🌟",x:"176px",y:"-10px",midX:"96px",midY:"-8px",size:"2.5rem",scale:"1.04",delay:"150ms",duration:"1520ms"},{emoji:"⭐",x:"136px",y:"112px",midX:"74px",midY:"58px",size:"2.3rem",scale:"0.92",delay:"220ms",duration:"1480ms"},{emoji:"✨",x:"0px",y:"170px",midX:"0px",midY:"88px",size:"2rem",scale:"0.88",delay:"280ms",duration:"1400ms"},{emoji:"🌟",x:"-142px",y:"118px",midX:"-76px",midY:"60px",size:"2.4rem",scale:"1.02",delay:"340ms",duration:"1500ms"},{emoji:"⭐",x:"-182px",y:"-8px",midX:"-98px",midY:"-6px",size:"2.6rem",scale:"1.08",delay:"410ms",duration:"1560ms"},{emoji:"✨",x:"-126px",y:"-118px",midX:"-68px",midY:"-64px",size:"2.1rem",scale:"0.94",delay:"470ms",duration:"1460ms"},{emoji:"🌟",x:"78px",y:"-182px",midX:"40px",midY:"-96px",size:"2rem",scale:"0.86",delay:"520ms",duration:"1380ms"}];for(const e of s){const i=document.createElement("span");i.setAttribute("data-stage-clear-burst-emoji",""),i.setAttribute("aria-hidden","true"),i.textContent=e.emoji,i.style.cssText=`
        position: absolute;
        left: 50%;
        top: 50%;
        font-size: ${e.size};
        line-height: 1;
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.3);
        will-change: transform, opacity;
        animation: stageClearEmojiBurst ${e.duration} ease-out ${e.delay} forwards;
        --stage-clear-burst-mid-x: ${e.midX};
        --stage-clear-burst-mid-y: ${e.midY};
        --stage-clear-burst-x: ${e.x};
        --stage-clear-burst-y: ${e.y};
        --stage-clear-burst-scale: ${e.scale};
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
    `,document.head.appendChild(t)}}const nt=1,Ge=2e3;function Le(r){const t=window.requestIdleCallback;if(typeof t=="function"){t(r,{timeout:1500});return}window.setTimeout(r,800)}class f{static VISUAL_QUALITY_SCALE_BY_TIER=[.45,.7,1];static BG_STAR_COUNT=Ge;static ASSIST_TRIGGER_HIT_WINDOW=6;static ASSIST_TRIGGER_HIT_COUNT=2;static ASSIST_DURATION=5;static ASSIST_MESSAGE_DURATION=3;static ASSIST_METEORITE_INTERVAL_MULTIPLIER=1.7;static ASSIST_MESSAGE="だいじょうぶ！ ゆっくりいこう ✨";static ASSIST_DIRECTION_REFRESH_INTERVAL=.35;static ASSIST_DIRECTION_LOOKAHEAD=42;static ASSIST_DIRECTION_SIDE_TARGET_X=4.5;static ASSIST_DIRECTION_SIDE_RANGE=7.5;static ASSIST_DIRECTION_DIFF_THRESHOLD=1.1;static ASSIST_DIRECTION_DIFF_RATIO=.28;threeScene;camera;lastAspect=0;initialized=!1;sceneManager;inputSystem;audioManager;saveManager;ambientLight;directionalLight;spaceship;stars=[];meteorites=[];shootingStars=[];comets=[];collisionSystem=new Ht;scoreSystem=new Gt;spawnSystem=new Lt;boostSystem=new zt;lodSystem=new _t;meteoShowerEventSystem=new Ft;hud;scorePopupManager=new G;particleBurstManager=new Nt;planetRingEffect=new $t;airShield;meteoShowerEffect;stageConfig;stageNumber=1;launchSource="campaign";isCleared=!1;clearTimer=0;stageClearOverlay=new He;isClearRewardOpen=!1;isOpeningClearReward=!1;clearRewardOverlay=null;clearRewardOverlayPromise=null;static CLEAR_CONTINUE_DELAY=.6;stageEntryTotalScore=0;stageEntryTotalStarCount=0;playTime=0;meteoriteHitTimes=[];assistTimer=0;assistMessageTimer=0;assistDirection=null;assistDirectionRefreshTimer=0;damageTimer=0;static DAMAGE_FLASH_DURATION=.5;cameraShakeTimer=0;cameraShakeElapsed=0;cameraShakeOffset=new rt;static CAMERA_SHAKE_DURATION=.28;static CAMERA_SHAKE_AMPLITUDE_X=.18;static CAMERA_SHAKE_AMPLITUDE_Y=.12;static CAMERA_SHAKE_FREQUENCY=42;destinationPlanet=null;destinationPlanetSpinTarget=null;static DESTINATION_PLANET_SPIN_SPEED=.2;static BOOST_HINT_DURATION=2.4;static ADAPTIVE_HINT_DURATION=3;static SHOOTING_STAR_SCORE_BONUS_DURATION=6;static METEO_SHOWER_MESSAGE="りゅうせいぐんだ！ ✨";static METEO_SHOWER_MESSAGE_DURATION=2.4;bgStars=null;boostLinesEffect;companionManager=null;elapsedTime=0;boostFlameEffect;isStarting=!1;stageIntroOverlay=null;countdownOverlay=null;awaitingResume=!1;resumeCountdownOverlay=null;isHomeConfirmOpen=!1;shouldResumeAfterHomeConfirm=!1;pauseOverlay=new Ot;isPauseOpen=!1;shouldResumeAfterPause=!1;touchGuide=new De;touchGuideMode="intro";touchGuideIdleTimer=0;hasSeenMoveInput=!1;isActive=!1;boostHintDisplayTimer=0;adaptiveHintDisplayTimer=0;adaptiveTutorialSystem=new jt;adaptiveTutorialHint=new Pe;meteoShowerAnnouncementTimer=0;prewarmRequestToken=0;static TOUCH_GUIDE_IDLE_DELAY=3;visualQualityTier=f.VISUAL_QUALITY_SCALE_BY_TIER.length-1;scheduleIdleTask;loadEncyclopediaOverlay;clearRewardRequestToken=0;onPauseRequested=null;onResumeRequested=null;onExitHomeRequested=null;attemptStatsRecorded=!1;constructor(t,s,e,i,a={}){this.sceneManager=t,this.inputSystem=s,this.audioManager=e,this.saveManager=i,this.scheduleIdleTask=a.scheduleIdleTask??Le,this.loadEncyclopediaOverlay=a.loadEncyclopediaOverlay??(()=>ot(()=>import("./EncyclopediaOverlay-BQFxRB4c.js"),__vite__mapDeps([0,1,2]))),this.threeScene=new Q,this.threeScene.background=new ft(32);const{width:n,height:o}=L();this.camera=new gt(60,n/o,.1,2e3)}ensureInitialized(){this.initialized||(this.ambientLight=new pt(16777215,.6),this.directionalLight=new ee(16777215,.8),this.directionalLight.position.set(5,10,5),this.threeScene.add(this.ambientLight),this.threeScene.add(this.directionalLight),this.spaceship=new Ut,this.threeScene.add(this.spaceship.mesh),this.airShield=new Zt,this.threeScene.add(this.airShield.getMesh()),this.companionManager=new Tt([]),this.threeScene.add(this.companionManager.getGroup()),this.boostLinesEffect=new qt,this.boostLinesEffect.init(this.threeScene),this.boostFlameEffect=new Yt,this.boostFlameEffect.init(this.threeScene),this.meteoShowerEffect=new Xt,this.meteoShowerEffect.init(this.threeScene),this.hud=new Be,this.initialized=!0,this.applyVisualQualityTier())}setVisualQualityTier(t){this.visualQualityTier=f.clampVisualQualityTier(t),this.applyVisualQualityTier()}enter(t){this.ensureInitialized(),this.isActive=!0,this.prewarmRequestToken+=1,this.clearRewardRequestToken+=1,this.lastAspect=0,this.stageNumber=t.stageNumber??1,this.launchSource=t.launchSource??"campaign",this.stageConfig=et(this.stageNumber),this.prefetchEndingSceneModuleIfNeeded(),this.isCleared=!1,this.clearTimer=0,this.stageClearOverlay.hide(),this.isClearRewardOpen=!1,this.isOpeningClearReward=!1,this.damageTimer=0,this.elapsedTime=0,this.destinationPlanetSpinTarget=null,this.planetRingEffect.clear(),this.isHomeConfirmOpen=!1,this.shouldResumeAfterHomeConfirm=!1,this.isPauseOpen=!1,this.shouldResumeAfterPause=!1,this.pauseOverlay.hide(),this.touchGuideIdleTimer=0,this.hasSeenMoveInput=!1,this.touchGuideMode="intro",this.playTime=0,this.attemptStatsRecorded=!1,this.meteoriteHitTimes.length=0,this.meteoShowerAnnouncementTimer=0,this.assistTimer=0,this.assistMessageTimer=0,this.assistDirection=null,this.assistDirectionRefreshTimer=0,this.adaptiveTutorialSystem.reset(),this.adaptiveHintDisplayTimer=0,this.adaptiveTutorialHint.hide(),this.meteoShowerEventSystem.reset(),this.meteoShowerEffect.clear(),this.resetBoostHintState();const s=t.totalScore??0,e=t.totalStarCount??0,i=this.saveManager.load();this.spaceship.applyCustomization(i.spaceshipCustomization??ht);const a=i.colorAccessibility?.highContrast===!0;Wt(a),Qt(a),this.hud.setHighContrastMode(a),this.scorePopupManager.setHighContrastMode(a),this.adaptiveTutorialHint.setHighContrastMode(a),this.stageEntryTotalScore=s,this.stageEntryTotalStarCount=e,this.scoreSystem.setTotalScore(s),this.scoreSystem.setTotalStarCount(e),this.resetStageObjects(),this.spaceship.reset(),this.inputSystem.resetPointers?.(),this.airShield.reset(0,0,0),this.boostLinesEffect.update(!1,0,0),this.boostFlameEffect.remove(),this.companionManager?.resetUnlockedPlanets([]),this.createBackground(),this.applyVisualQualityTier(),this.camera.position.set(0,5,10),this.camera.lookAt(0,0,-10),this.createDestinationPlanet(),this.scheduleNextStageVisualPrewarm(),this.stars.length=0,this.meteorites.length=0,this.shootingStars.length=0,this.comets.length=0,this.spawnSystem.reset(),this.spawnSystem.setMeteoriteIntervalMultiplier(1),this.boostSystem.reset(),this.scoreSystem.resetStage();const n=`ステージ${this.stageConfig.stageNumber}: ${this.stageConfig.emoji} ${this.stageConfig.displayName}`;this.hud.show(n,this.stageConfig.planetColor),this.hud.setBoostCallback(()=>{this.inputSystem.setBoostPressed(!0)}),this.hud.setBoostDeniedCallback(()=>{this.audioManager.playSFX("boostDenied")}),this.hud.setHomeCallback(()=>{this.isHomeConfirmOpen=!1,this.shouldResumeAfterHomeConfirm=!1,this.syncBoostInputLock(),this.syncPauseAvailability(),this.sceneManager.requestTransition("title")}),this.hud.setHomeConfirmOpenCallback(()=>{this.shouldResumeAfterHomeConfirm=this.isPlaying(),this.clearBlockedGameplayInput(),this.isHomeConfirmOpen=!0,this.syncBoostInputLock(),this.syncPauseAvailability()}),this.hud.setHomeConfirmCancelCallback(()=>{const o=this.shouldResumeAfterHomeConfirm;if(this.isHomeConfirmOpen=!1,this.shouldResumeAfterHomeConfirm=!1,this.syncPauseAvailability(),o){this.requestResumeCountdown();return}this.syncBoostInputLock()}),this.hud.setPauseCallback(()=>{this.requestManualPause()}),this.hud.setMuteState(this.audioManager.isMuted()),this.hud.setMuteCallback(()=>{const o=this.audioManager.toggleMute();this.hud.setMuteState(o);const h=this.saveManager.load();h.muted=o,this.saveManager.save(h)}),this.hud.update(this.scoreSystem.getStageScore(),this.scoreSystem.getStarCount()),this.hud.hideAssistMessage(),this.adaptiveTutorialHint.hide(),this.touchGuide.show("intro"),this.syncPauseAvailability(),this.hud.setBestStarCount(i.bestStageStars?.[this.stageNumber]??0),this.companionManager?.resetUnlockedPlanets(i.unlockedPlanets),this.bgStars&&st(this.bgStars,this.spaceship.position.z,nt),this.audioManager.playBGM(this.stageNumber),this.stageIntroOverlay?.dispose(),this.stageIntroOverlay=null,this.startOpeningSequence(t)}prefetchEndingSceneModuleIfNeeded(){if(this.stageNumber<D-1)return;this.sceneManager.prefetchSceneModule?.call(this.sceneManager,"ending")?.catch(()=>{})}startOpeningSequence(t){if(this.isStarting=!0,this.syncBoostInputLock(),this.syncPauseAvailability(),!this.shouldShowStageIntro(t)){this.startCountdown();return}const s=V(this.stageNumber);if(!s){this.startCountdown();return}this.stageIntroOverlay=new ke(s),this.stageIntroOverlay.show(()=>{this.stageIntroOverlay=null,this.startCountdown()})}startCountdown(){if(this.isStarting=!0,this.syncBoostInputLock(),this.syncPauseAvailability(),this.shouldSkipCountdown()){this.isStarting=!1,this.countdownOverlay=null,this.syncBoostInputLock(),this.syncPauseAvailability();return}this.countdownOverlay=new wt({onTick:()=>{this.audioManager.playSFX("countdownTick")},onGo:()=>{this.audioManager.playSFX("countdownGo")}}),this.countdownOverlay.show(()=>{this.isStarting=!1,this.countdownOverlay=null,this.syncBoostInputLock(),this.syncPauseAvailability()})}shouldShowStageIntro(t){return this.shouldSkipCountdown()||this.launchSource!=="campaign"||t.replayToken!==void 0||t.totalScore===void 0||t.totalStarCount===void 0?!1:V(this.stageNumber)!==void 0}releasePointerInputForLock(){this.inputSystem.resetPointers?.()}syncBoostInputLock(){const t=this.isStarting||this.awaitingResume||this.isHomeConfirmOpen||this.isPauseOpen;this.hud.setBoostLocked(t),t&&(this.resetBoostHintState(),this.inputSystem.setBoostPressed?.(!1))}clearBlockedGameplayInput(){this.inputSystem.resetPointers?.(),this.inputSystem.setBoostPressed?.(!1)}syncPauseAvailability(){this.hud.setPauseEnabled(this.canPause())}shouldSkipCountdown(){try{return new URLSearchParams(window.location.search).get("nocount")==="1"}catch{return!1}}isPlaying(){return!(!this.stageConfig||this.isCleared||this.isClearRewardOpen||this.isOpeningClearReward||this.isStarting||this.awaitingResume||this.isHomeConfirmOpen||this.isPauseOpen)}isUserPaused(){return this.isPauseOpen}requestResumeCountdown(){this.isPlaying()&&(this.resumeCountdownOverlay||this.shouldSkipCountdown()||(this.clearBlockedGameplayInput(),this.awaitingResume=!0,this.syncBoostInputLock(),this.syncPauseAvailability(),this.resumeCountdownOverlay=new wt({onTick:()=>{this.audioManager.playSFX("countdownTick")},onGo:()=>{this.audioManager.playSFX("countdownGo")}}),this.resumeCountdownOverlay.show(()=>{this.awaitingResume=!1,this.resumeCountdownOverlay=null,this.syncBoostInputLock(),this.syncPauseAvailability()})))}setPauseHandlers(t){this.onPauseRequested=t.onPauseRequested??null,this.onResumeRequested=t.onResumeRequested??null,this.onExitHomeRequested=t.onExitHomeRequested??null}isManuallyPaused(){return this.isPauseOpen}requestManualPause(){this.canPause()&&(this.clearBlockedGameplayInput(),this.isPauseOpen=!0,this.syncBoostInputLock(),this.syncPauseAvailability(),this.pauseOverlay.show(()=>{this.isPauseOpen=!1,this.syncBoostInputLock(),this.syncPauseAvailability(),this.onResumeRequested?.()},()=>{this.isPauseOpen=!1,this.syncBoostInputLock(),this.syncPauseAvailability(),this.onExitHomeRequested?.()}),this.onPauseRequested?.())}canPause(){return!(!this.stageConfig||this.isCleared||this.isClearRewardOpen||this.isOpeningClearReward||this.isStarting||this.awaitingResume||this.isHomeConfirmOpen||this.isPauseOpen)}createBackground(){this.bgStars||(this.bgStars=be(this.getBackgroundStarDrawCount()),this.threeScene.add(this.bgStars))}createDestinationPlanet(){this.removeDestinationPlanet();const t=-(this.stageConfig.stageLength+50),{planet:s,spinTarget:e}=ye(this.stageNumber,this.stageConfig,t);this.destinationPlanet=s,this.destinationPlanetSpinTarget=e,this.threeScene.add(this.destinationPlanet)}scheduleNextStageVisualPrewarm(){const t=this.stageNumber+1;if(t>D)return;const s=this.prewarmRequestToken;this.scheduleIdleTask(()=>{!this.isActive||this.prewarmRequestToken!==s||vt(t)})}removeDestinationPlanet(){this.destinationPlanet&&(this.destinationPlanet.parent?.remove(this.destinationPlanet),this.destinationPlanet=null,this.destinationPlanetSpinTarget=null)}resetStageObjects(){this.clearRewardOverlay?.hide(),this.stageClearOverlay.hide(),this.isClearRewardOpen=!1,this.isOpeningClearReward=!1,this.removeDestinationPlanet(),this.resetCameraShake(),this.planetRingEffect.clear(),this.particleBurstManager.clear(this.threeScene),this.spawnSystem.recycleAll(),this.spawnSystem.setMeteoriteIntervalMultiplier(1),this.meteoShowerEventSystem.reset(),this.meteoShowerEffect.clear(),this.meteoShowerAnnouncementTimer=0,this.stars.length=0,this.meteorites.length=0,this.shootingStars.length=0,this.comets.length=0,this.hud?.hideAssistMessage(),this.resetBoostHintState()}update(t){if(!this.initialized)return;if(this.isCleared){this.resetBoostHintState(),this.clearTimer+=t,this.planetRingEffect.update(t),this.particleBurstManager.update(this.threeScene,t),this.companionManager?.update(t,this.spaceship.position.x,this.spaceship.position.y,this.spaceship.position.z),this.destinationPlanetSpinTarget&&(this.destinationPlanetSpinTarget.rotation.y+=t*f.DESTINATION_PLANET_SPIN_SPEED),this.revealClearActionButtonsIfReady();return}if(this.isStarting||this.awaitingResume||this.isHomeConfirmOpen||this.isPauseOpen){if(this.resetBoostHintState(),this.hideAdaptiveTutorialHint(),this.inputSystem.setBoostPressed?.(!1),!this.isHomeConfirmOpen&&!this.isPauseOpen){const l=this.stageIntroOverlay?.isActive()??!1;this.stageIntroOverlay?.tick(t),l||this.countdownOverlay?.tick(t),this.resumeCountdownOverlay?.tick(t)}this.destinationPlanetSpinTarget&&(this.destinationPlanetSpinTarget.rotation.y+=t*f.DESTINATION_PLANET_SPIN_SPEED),this.bgStars&&st(this.bgStars,this.spaceship.position.z,nt),this.airShield.setPosition(this.spaceship.position.x,this.spaceship.position.y,this.spaceship.position.z),this.airShield.update(t),this.hud.update(this.scoreSystem.getStageScore(),this.scoreSystem.getStarCount());return}const s=this.inputSystem.getState();this.playTime+=t,this.updateAssistTimers(t),this.updateMeteoShowerAnnouncement(t),this.updateAdaptiveHintDisplay(t),this.updateBoostHintDisplay(t),this.updateTouchGuide(s.moveDirection,t);const e=this.boostSystem.isActive(),i=this.boostSystem.isAvailable();s.boostPressed&&(this.boostSystem.activate()?(this.adaptiveTutorialSystem.recordBoostUsed(),this.audioManager.playSFX("boost"),it("boost"),this.audioManager.startBoostSFX(),this.boostFlameEffect.start()):this.audioManager.playSFX("boostDenied"),this.inputSystem.setBoostPressed(!1)),this.boostSystem.update(t),e&&!this.boostSystem.isActive()&&(this.audioManager.stopBoostSFX(),this.boostFlameEffect.stopEmitting()),!i&&this.boostSystem.isAvailable()&&(this.audioManager.playSFX("boostReady"),this.hud.flashBoostReady()),this.boostSystem.isActive()&&this.spaceship.speedState!=="BOOST"&&this.spaceship.activateBoost(),s.moveDirection===-1?this.spaceship.moveLeft(t):s.moveDirection===1&&this.spaceship.moveRight(t),this.spaceship.update(t);const a=this.meteoShowerEventSystem.update(t);a.started&&(this.audioManager.playSFX("meteorShowerStart"),this.meteoShowerEffect.start(),this.showMeteoShowerAnnouncement());const n=this.spawnSystem.update(t,this.spaceship.position.z,this.stageConfig,this.stars,this.meteorites,this.shootingStars,this.comets,{meteoShowerActive:a.active});for(const l of n.newStars)this.stars.push(l),this.threeScene.add(l.mesh);for(const l of n.newMeteorites)this.meteorites.push(l),this.threeScene.add(l.mesh);for(const l of n.newShootingStars)this.shootingStars.push(l),this.threeScene.add(l.mesh);for(const l of n.newComets)this.comets.push(l),this.threeScene.add(l.mesh);this.lodSystem.update(this.spaceship.position,this.stars),this.lodSystem.update(this.spaceship.position,this.meteorites),this.companionManager?.update(t,this.spaceship.position.x,this.spaceship.position.y,this.spaceship.position.z);const o=this.companionManager?.getStarAttractionBonus()??0,h=this.collisionSystem.check(this.spaceship,this.stars,this.meteorites,o,this.shootingStars,this.comets);if(h.shootingStarHit){const l=h.shootingStarHit;this.scoreSystem.activateShootingStarBonus(Math.max(f.SHOOTING_STAR_SCORE_BONUS_DURATION,l.bonusDuration)),this.audioManager.playSFX("shootingStarCollect"),this.particleBurstManager.emit(this.threeScene,l.position.x,l.position.y,l.position.z,16777215,50,!0)}if(h.cometHit){const l=h.cometHit;this.scoreSystem.addBonusScore(l.scoreBonus),this.scoreSystem.activateShootingStarBonus(l.bonusDuration),this.audioManager.playSFX("cometCollect"),this.particleBurstManager.emit(this.threeScene,l.position.x,l.position.y,l.position.z,12447743,50,!0),this.particleBurstManager.emit(this.threeScene,l.position.x,l.position.y,l.position.z,16777215,50,!0)}for(const l of h.starCollisions)this.scoreSystem.addStarScore(l.starType),l.starType==="RAINBOW"?(this.audioManager.playSFX("rainbowCollect"),this.particleBurstManager.emit(this.threeScene,l.position.x,l.position.y,l.position.z,16768256,50,!0)):(this.audioManager.playSFX("starCollect"),this.particleBurstManager.emit(this.threeScene,l.position.x,l.position.y,l.position.z,16768256,20,!1));if(h.meteoriteCollision){if(h.meteoriteHit){const l=h.meteoriteHit;typeof l.handleCollision=="function"?l.handleCollision():(l.isActive=!1,l.mesh.visible=!1,it("meteoriteHit")),this.particleBurstManager.emit(this.threeScene,l.position.x,l.position.y,l.position.z,16755268,24,!1)}this.spaceship.onMeteoriteHit(),this.hud.announceMeteoriteHit(),this.recordMeteoriteHit(),this.boostSystem.cancel(),this.damageTimer=f.DAMAGE_FLASH_DURATION,this.startCameraShake(),this.audioManager.playSFX("meteoriteHit"),this.audioManager.stopBoostSFX(),this.boostFlameEffect.remove()}this.updateDamageEffect(t),this.cleanupPassedObjects(t),this.updateAdaptiveTutorial(s.moveDirection,t),this.updateCameraFollow(t);for(const l of h.starCollisions)this.scorePopupManager.show(l.scoreValue,l.position,this.camera);if(this.stageNumber===10&&this.destinationPlanet){const l=1+Math.sin(this.elapsedTime*2)*.05;this.destinationPlanet.scale.set(l,l,l)}this.destinationPlanetSpinTarget&&(this.destinationPlanetSpinTarget.rotation.y+=t*f.DESTINATION_PLANET_SPIN_SPEED),this.elapsedTime+=t,this.bgStars&&st(this.bgStars,this.spaceship.position.z,nt),this.meteoShowerEffect.update(a.active,t,this.spaceship.position.x,this.spaceship.position.z),this.boostLinesEffect.update(this.boostSystem.isActive(),this.spaceship.position.x,this.spaceship.position.z),this.boostSystem.isActive()&&this.boostFlameEffect.emit(this.spaceship.position,this.boostSystem.getDurationProgress()),this.boostFlameEffect.update(t),this.airShield.setPosition(this.spaceship.position.x,this.spaceship.position.y,this.spaceship.position.z),this.boostSystem.isActive()?this.airShield.setShieldMode("BOOST"):this.spaceship.speedState==="SLOWDOWN"?this.airShield.setShieldMode("INVINCIBLE",1):this.spaceship.speedState==="RECOVERING"?this.airShield.setShieldMode("INVINCIBLE",this.spaceship.getSpeedStateRemainingRatio()):this.airShield.setShieldMode("OFF"),this.airShield.update(t),this.particleBurstManager.update(this.threeScene,t),this.scoreSystem.update(t),this.hud.update(this.scoreSystem.getStageScore(),this.scoreSystem.getStarCount()),this.hud.updateCooldown(this.boostSystem.getCooldownProgress());const d=this.spaceship.getProgress(this.stageConfig.stageLength);this.hud.updateStageProgress(d),d>=1&&this.onStageClear()}updateTouchGuide(t,s){if(this.assistTimer>0){this.setTouchGuideMode(this.getAssistTouchGuideMode());return}if(t!==0){this.touchGuideIdleTimer=0,this.hasSeenMoveInput=!0,this.setTouchGuideMode(t<0?"active-left":"active-right");return}if(!this.hasSeenMoveInput){this.setTouchGuideMode("intro");return}if(this.touchGuideIdleTimer+=s,this.touchGuideIdleTimer>=f.TOUCH_GUIDE_IDLE_DELAY){this.setTouchGuideMode("idle");return}this.setTouchGuideMode("hidden")}setTouchGuideMode(t){this.touchGuideMode!==t&&(this.touchGuideMode=t,this.touchGuide.setMode(t))}resetAssistNavigation(){this.meteoriteHitTimes.length=0,this.assistTimer=0,this.assistMessageTimer=0,this.assistDirection=null,this.assistDirectionRefreshTimer=0}updateAssistTimers(t){this.assistTimer>0&&(this.assistDirectionRefreshTimer=Math.max(0,this.assistDirectionRefreshTimer-t),this.assistDirectionRefreshTimer===0&&this.refreshAssistDirection(),this.assistTimer=Math.max(0,this.assistTimer-t),this.assistTimer===0&&(this.spawnSystem.setMeteoriteIntervalMultiplier(1),this.assistDirection=null,this.assistDirectionRefreshTimer=0)),this.assistMessageTimer>0&&(this.assistMessageTimer=Math.max(0,this.assistMessageTimer-t),this.assistMessageTimer===0&&(this.meteoShowerAnnouncementTimer>0?this.hud.showAssistMessage(f.METEO_SHOWER_MESSAGE):this.hud.hideAssistMessage()))}updateMeteoShowerAnnouncement(t){if(!(this.meteoShowerAnnouncementTimer<=0)&&(this.meteoShowerAnnouncementTimer=Math.max(0,this.meteoShowerAnnouncementTimer-t),!(this.meteoShowerAnnouncementTimer>0))){if(this.assistMessageTimer>0){this.hud.showAssistMessage(f.ASSIST_MESSAGE);return}this.hud.hideAssistMessage()}}showMeteoShowerAnnouncement(){this.meteoShowerAnnouncementTimer=f.METEO_SHOWER_MESSAGE_DURATION,this.hud.showAssistMessage(f.METEO_SHOWER_MESSAGE)}resetBoostHintState(){this.boostHintDisplayTimer=0,this.hud?.hideBoostHint()}updateBoostHintDisplay(t){this.boostHintDisplayTimer>0&&(this.boostHintDisplayTimer=Math.max(0,this.boostHintDisplayTimer-t),this.boostHintDisplayTimer===0&&this.hud.hideBoostHint())}updateAdaptiveHintDisplay(t){this.adaptiveHintDisplayTimer<=0||(this.adaptiveHintDisplayTimer=Math.max(0,this.adaptiveHintDisplayTimer-t),this.adaptiveHintDisplayTimer===0&&this.adaptiveTutorialHint.hide())}hideAdaptiveTutorialHint(){this.adaptiveHintDisplayTimer=0,this.adaptiveTutorialHint.hide()}updateAdaptiveTutorial(t,s){const e=this.adaptiveTutorialSystem.update({deltaTime:s,moveDirection:t,shipX:this.spaceship.position.x,shipZ:this.spaceship.position.z,boostAvailable:this.boostSystem.isAvailable(),boostActive:this.boostSystem.isActive(),meteorites:this.meteorites});e&&this.showAdaptiveTutorialEvent(e)}showAdaptiveTutorialEvent(t){if(t.type==="boost"){this.hideAdaptiveTutorialHint(),this.hud.showBoostHint(t.message),this.boostHintDisplayTimer=f.BOOST_HINT_DURATION;return}this.resetBoostHintState(),this.adaptiveTutorialHint.show(t.message,t.type),this.adaptiveHintDisplayTimer=f.ADAPTIVE_HINT_DURATION}recordMeteoriteHit(){const t=this.playTime;for(this.meteoriteHitTimes.push(t);this.meteoriteHitTimes.length>0&&t-this.meteoriteHitTimes[0]>f.ASSIST_TRIGGER_HIT_WINDOW;)this.meteoriteHitTimes.shift();this.assistTimer>0||this.meteoriteHitTimes.length<f.ASSIST_TRIGGER_HIT_COUNT||this.activateAssistMode()}activateAssistMode(){this.assistTimer=f.ASSIST_DURATION,this.assistMessageTimer=f.ASSIST_MESSAGE_DURATION,this.assistDirectionRefreshTimer=0,this.refreshAssistDirection(),this.spawnSystem.setMeteoriteIntervalMultiplier(f.ASSIST_METEORITE_INTERVAL_MULTIPLIER),this.hud.showAssistMessage(f.ASSIST_MESSAGE),this.meteoriteHitTimes.length=0}refreshAssistDirection(){this.assistDirection=this.getSaferAssistDirection(),this.assistDirectionRefreshTimer=f.ASSIST_DIRECTION_REFRESH_INTERVAL}getAssistTouchGuideMode(){return this.assistDirection==="left"?"assist-left":this.assistDirection==="right"?"assist-right":"hidden"}getSaferAssistDirection(){const t=this.spaceship.position.x,s=this.spaceship.position.z,e=Math.min(t-2.5,-f.ASSIST_DIRECTION_SIDE_TARGET_X),i=Math.max(t+2.5,f.ASSIST_DIRECTION_SIDE_TARGET_X);let a=0,n=0;for(const d of this.meteorites){if(!d.isActive)continue;const l=s-d.position.z;if(l<0||l>f.ASSIST_DIRECTION_LOOKAHEAD)continue;const p=1+(f.ASSIST_DIRECTION_LOOKAHEAD-l)/7,g=Math.abs(d.position.x-e),u=Math.abs(d.position.x-i),c=Math.max(0,1-g/f.ASSIST_DIRECTION_SIDE_RANGE),m=Math.max(0,1-u/f.ASSIST_DIRECTION_SIDE_RANGE);a+=p*c,n+=p*m}const o=Math.abs(a-n),h=Math.max(a,n);return o<f.ASSIST_DIRECTION_DIFF_THRESHOLD||h>0&&o<h*f.ASSIST_DIRECTION_DIFF_RATIO?null:a<n?"left":"right"}updateDamageEffect(t){if(this.damageTimer>0){if(this.damageTimer-=t,this.damageTimer<=0){this.damageTimer=0,this.spaceship.mesh.rotation.z=0,this.spaceship.mesh.rotation.y=0,this.spaceship.mesh.visible=!0;return}const s=Math.sin(this.damageTimer*30)*.3;this.spaceship.mesh.rotation.z=s,this.spaceship.mesh.rotation.y=0;const e=Math.sin(this.damageTimer*20)>0;this.spaceship.mesh.visible=e}else this.spaceship.mesh.visible=!0}resetCameraShake(){this.cameraShakeTimer=0,this.cameraShakeElapsed=0,this.cameraShakeOffset.set(0,0,0)}startCameraShake(){this.cameraShakeTimer=f.CAMERA_SHAKE_DURATION,this.cameraShakeElapsed=0}updateCameraShake(t){if(this.cameraShakeTimer<=0){this.cameraShakeOffset.set(0,0,0);return}if(this.cameraShakeElapsed+=t,this.cameraShakeTimer=Math.max(0,this.cameraShakeTimer-t),this.cameraShakeTimer===0){this.cameraShakeOffset.set(0,0,0);return}const s=this.cameraShakeTimer/f.CAMERA_SHAKE_DURATION,e=this.cameraShakeElapsed*f.CAMERA_SHAKE_FREQUENCY;this.cameraShakeOffset.set(Math.sin(e)*f.CAMERA_SHAKE_AMPLITUDE_X*s,Math.cos(e*.8)*f.CAMERA_SHAKE_AMPLITUDE_Y*s,0)}updateCameraFollow(t){this.updateCameraShake(t),this.camera.position.set(this.spaceship.position.x*.3+this.cameraShakeOffset.x,5+this.cameraShakeOffset.y,this.spaceship.position.z+12),this.camera.lookAt(this.spaceship.position.x*.5,0,this.spaceship.position.z-20)}cleanupPassedObjects(t){const s=this.spaceship.position.z,e=s+30,i=this.stars;let a=0,n=0;for(let u=0;u<i.length;u++){const c=i[u];c.isCollected||c.position.z>e?(!c.isCollected&&c.position.z>e&&(n+=1),this.spawnSystem.releaseStar(c)):(c.update(t,s),a!==u&&(i[a]=c),a++)}i.length=a,n>0&&this.adaptiveTutorialSystem.recordMissedStars(n);const o=this.meteorites;let h=0;for(let u=0;u<o.length;u++){const c=o[u];!c.isActive||c.position.z>e?this.spawnSystem.releaseMeteorite(c):(c.isActive&&c.update(t,s),h!==u&&(o[h]=c),h++)}o.length=h;const d=this.shootingStars;let l=0;for(let u=0;u<d.length;u++){const c=d[u];c.isCollected||c.position.z>e?this.spawnSystem.releaseShootingStar(c):(c.update(t,s),l!==u&&(d[l]=c),l++)}d.length=l;const p=this.comets;let g=0;for(let u=0;u<p.length;u++){const c=p[u];c.isCollected||c.position.z>e?this.spawnSystem.releaseComet(c):(c.update(t,s),g!==u&&(p[g]=c),g++)}p.length=g}onStageClear(){if(this.isCleared)return;this.isCleared=!0,this.clearTimer=0,this.stageClearOverlay.hide(),this.resetAssistNavigation(),this.meteoShowerAnnouncementTimer=0,this.meteoShowerEventSystem.reset(),this.meteoShowerEffect.clear(),this.resetBoostHintState(),this.touchGuide.hide(),this.syncPauseAvailability();const t=this.saveManager.markStageCleared(this.stageNumber);if(this.audioManager.playSFX("stageClear"),it("stageClear"),this.audioManager.stopBoostSFX(),this.boostFlameEffect.remove(),this.destinationPlanet){const n=this.getDestinationPlanetEffectRadius(this.destinationPlanet);this.planetRingEffect.start(this.threeScene,this.destinationPlanet,n,this.stageConfig.planetColor,this.particleBurstManager)}const s=this.scoreSystem.getStarCount(),e=this.saveManager.load().bestStageStars?.[this.stageNumber]??0;this.saveManager.updateBestStageStars(this.stageNumber,s),this.recordAttemptStats(!0);const i=Math.max(e,s),a=s>e;t&&(this.companionManager?.addCompanion(this.stageNumber),this.prefetchClearRewardOverlay()),this.showClearMessage(a,s,t,i),this.hud.announceStageClear(s,t,a),a&&this.audioManager.playSFX("rainbowCollect")}getClearRewardOverlay(){return this.clearRewardOverlay?Promise.resolve(this.clearRewardOverlay):this.clearRewardOverlayPromise?this.clearRewardOverlayPromise:(this.clearRewardOverlayPromise=this.loadEncyclopediaOverlay().then(({EncyclopediaOverlay:t})=>{const s=new t;return this.clearRewardOverlay=s,s}).finally(()=>{this.clearRewardOverlayPromise=null}),this.clearRewardOverlayPromise)}isCurrentClearRewardRequest(t){return this.isActive&&this.clearRewardRequestToken===t}restoreClearRewardButton(){this.stageClearOverlay.setRewardOpen(!1)}prefetchClearRewardOverlay(){this.clearRewardOverlay||this.clearRewardOverlayPromise||this.getClearRewardOverlay().catch(()=>{})}async openClearRewardOverlay(t){if(this.isClearRewardOpen||this.isOpeningClearReward)return;const s=this.clearRewardRequestToken;this.isOpeningClearReward=!0,this.stageClearOverlay.setRewardOpen(!0);try{const e=this.clearRewardOverlay??await this.getClearRewardOverlay();if(!this.isCurrentClearRewardRequest(s))return;if(!e.showStageDetail(this.stageNumber,()=>{this.isCurrentClearRewardRequest(s)&&(this.isClearRewardOpen=!1,this.syncPauseAvailability(),this.restoreClearRewardButton())},{bestStageStars:{[this.stageNumber]:t},backLabel:"クリアへ もどる",zIndex:50})){this.restoreClearRewardButton();return}this.isClearRewardOpen=!0,this.syncPauseAvailability()}catch{if(!this.isCurrentClearRewardRequest(s))return;this.restoreClearRewardButton()}finally{this.clearRewardRequestToken===s&&(this.isOpeningClearReward=!1,this.syncPauseAvailability(),this.isClearRewardOpen||this.restoreClearRewardButton())}}showClearMessage(t=!1,s,e=!1,i){const a=s??this.scoreSystem.getStarCount(),n=i??a,o=this.launchSource==="encyclopedia"?void 0:Vt(this.stageNumber),h=e?V(this.stageNumber):void 0;this.stageClearOverlay.show({stageNumber:this.stageNumber,starCount:a,bestStarCount:n,isBestUpdated:t,continueLabel:this.launchSource==="encyclopedia"?"タイトルへ":this.stageNumber>=D?"おいわいへ":"つぎへ",nextEntry:o,rewardEntry:h,onContinue:()=>{this.handleStageComplete()},onRetry:()=>{this.handleStageRetry()},onReward:h?()=>{this.openClearRewardOverlay(a)}:void 0})}revealClearActionButtonsIfReady(){this.clearTimer<f.CLEAR_CONTINUE_DELAY||this.stageClearOverlay.enableContinue()}getDestinationPlanetEffectRadius(t){const s=new se().setFromObject(t);if(s.isEmpty())return 15;const e=s.getSize(new rt);return Math.max(e.x,e.y,e.z)*.5}handleStageComplete(){const{totalScore:t,totalStarCount:s}=this.scoreSystem.finalizeStage();if(this.launchSource==="encyclopedia"){this.sceneManager.requestTransition("title");return}this.stageNumber>=D?this.sceneManager.requestTransition("ending",{totalScore:t,totalStarCount:s}):this.sceneManager.requestTransition("stage",{stageNumber:this.stageNumber+1,totalScore:t,totalStarCount:s})}handleStageRetry(){const t={stageNumber:this.stageNumber,totalScore:this.stageEntryTotalScore,totalStarCount:this.stageEntryTotalStarCount,replayToken:Date.now()+Math.random()};this.launchSource!=="campaign"&&(t.launchSource=this.launchSource),this.sceneManager.requestTransition("stage",t)}recordAttemptStats(t){this.attemptStatsRecorded||(this.attemptStatsRecorded=!0,this.saveManager.recordGameplaySession?.({stageNumber:this.stageNumber,playTimeSeconds:this.playTime,collectedStars:this.scoreSystem.getStarCount(),boostUses:this.boostSystem.getActivationCount(),stageCleared:t}))}exit(){this.initialized&&(this.recordAttemptStats(this.isCleared),this.isActive=!1,this.prewarmRequestToken+=1,this.clearRewardRequestToken+=1,this.clearRewardOverlay?.hide(),this.stageClearOverlay.hide(),this.isClearRewardOpen=!1,this.isOpeningClearReward=!1,this.pauseOverlay.hide(),this.touchGuide.hide(),this.adaptiveTutorialHint.hide(),this.hud.hide(),this.scorePopupManager.dispose(),this.audioManager.stopBGM(),this.audioManager.stopBoostSFX(),this.stageIntroOverlay&&(this.stageIntroOverlay.dispose(),this.stageIntroOverlay=null),this.countdownOverlay&&(this.countdownOverlay.dispose(),this.countdownOverlay=null),this.resumeCountdownOverlay&&(this.resumeCountdownOverlay.dispose(),this.resumeCountdownOverlay=null),this.isStarting=!1,this.awaitingResume=!1,this.isHomeConfirmOpen=!1,this.shouldResumeAfterHomeConfirm=!1,this.isPauseOpen=!1,this.shouldResumeAfterPause=!1,this.boostFlameEffect.remove(),this.boostLinesEffect.update(!1,this.spaceship.position.x,this.spaceship.position.z),this.airShield.reset(this.spaceship.position.x,this.spaceship.position.y,this.spaceship.position.z),this.planetRingEffect.clear(),this.resetStageObjects(),this.bgStars&&(this.bgStars.parent?.remove(this.bgStars),this.bgStars=null))}getThreeScene(){return this.threeScene}getCamera(){const{width:t,height:s}=L(),e=t/s;return e!==this.lastAspect&&Number.isFinite(e)&&e>0&&(this.camera.aspect=e,this.camera.updateProjectionMatrix(),this.lastAspect=e),this.camera}applyVisualQualityTier(){const t=f.clampVisualQualityTier(this.visualQualityTier);if(this.particleBurstManager.setQualityTier(t),!this.initialized){this.bgStars&&this.bgStars.geometry.setDrawRange(0,this.getBackgroundStarDrawCount());return}this.boostLinesEffect.setQualityTier(t),this.boostFlameEffect.setQualityTier(t),this.bgStars&&this.bgStars.geometry.setDrawRange(0,this.getBackgroundStarDrawCount())}getBackgroundStarDrawCount(){return Math.max(1,Math.round(f.BG_STAR_COUNT*f.getVisualQualityScale(this.visualQualityTier)))}static clampVisualQualityTier(t){const s=f.VISUAL_QUALITY_SCALE_BY_TIER.length-1;return Math.max(0,Math.min(s,Math.round(t)))}static getVisualQualityScale(t){return f.VISUAL_QUALITY_SCALE_BY_TIER[f.clampVisualQualityTier(t)]}}const Ze=Object.freeze(Object.defineProperty({__proto__:null,StageScene:f,__resetStageSceneSharedAssetCachesForTest:fe,__stageSceneSharedAssetCachesForTest:ge,prewarmStageVisualAssets:vt},Symbol.toStringTag,{value:"Module"}));let U=null,Z=null;function ze(){if(!U){const r=new dt,t=new Float32Array(3e3);for(let s=0;s<3e3;s++)t[s]=(Math.random()-.5)*200;r.setAttribute("position",new ut(t,3)),U=r}return U}function _e(){return Z||(Z=new mt({color:16777215,size:.3})),Z}function Fe(){U=null,Z=null}const Ne={getBgStarsGeometry:()=>U,getBgStarsMaterial:()=>Z};class I{static CIRCLE_RADIUS=3;static POPIN_DELAY=.2;static POPIN_DURATION=.3;static BOUNCE_SPEED=3;static BOUNCE_HEIGHT=.5;static THANK_YOU_DELAY=2.5;threeScene;camera;lastAspect=0;sceneManager;saveManager;audioManager;overlay=null;muteHandle=null;bgStars=null;companionMeshes=[];companionGroup=null;circleX=[];circleZ=[];popinSettled=[];celebrationElapsed=0;thankYouShown=!1;canExit=!1;exitTriggered=!1;exitCta=null;constructor(t,s,e){this.sceneManager=t,this.saveManager=s,this.audioManager=e,this.threeScene=new Q;const{width:i,height:a}=L();this.camera=new gt(60,i/a,.1,1e3),this.camera.position.set(0,0,5)}enter(t){this.lastAspect=0,this.canExit=!1,this.exitTriggered=!1,this.exitCta=null;const s=t.totalScore??0,e=t.totalStarCount??0;this.threeScene=new Q,this.threeScene.background=new ft(48),this.bgStars=new ct(ze(),_e()),this.bgStars.userData.sharedAssets=!0,this.bgStars.rotation.set(0,0,0),this.threeScene.add(this.bgStars),this.threeScene.add(new pt(16777215,1));const i=this.saveManager.load();i.clearedStage=0,this.saveManager.save(i),this.audioManager.playBGM(-1),this.setupCelebration(),this.createOverlay(s,e),this.createMuteButton()}createMuteButton(){const t=document.getElementById("hud")??document.getElementById("ui-overlay");t&&(this.muteHandle=bt({initialMuted:this.audioManager.isMuted(),container:t,onToggle:()=>{const s=this.audioManager.toggleMute();this.muteHandle?.setMuted(s);const e=this.saveManager.load();e.muted=s,this.saveManager.save(e)}}))}createOverlay(t,s){const e=document.getElementById("ui-overlay");if(!e)return;this.overlay=document.createElement("div"),this.overlay.setAttribute("data-ending-overlay",""),this.overlay.style.cssText=`
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      pointer-events: auto;
    `,this.overlay.addEventListener("pointerdown",o=>{this.handleOverlayPointerDown(o)});const i=document.createElement("div");i.textContent="うちゅうの たびは おしまい！",i.style.cssText=`
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
    `;const n=document.createElement("div");n.textContent=`⭐ ${s} こ あつめたよ！`,n.style.cssText=`
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
    `,this.overlay.appendChild(i),this.overlay.appendChild(a),this.overlay.appendChild(n),this.overlay.appendChild(this.exitCta),e.appendChild(this.overlay)}update(t){this.bgStars&&(this.bgStars.rotation.y+=t*.03),this.updateCelebration(t)}setupCelebration(){this.companionGroup=new W,this.companionMeshes=[],this.circleX.length=0,this.circleZ.length=0,this.popinSettled.length=0,this.celebrationElapsed=0,this.thankYouShown=!1,this.canExit=!1,this.exitTriggered=!1;for(let t=0;t<N.length;t++){const s=N[t],e=Tt.createCompanionMesh(s),i=t*(2*Math.PI/N.length),a=Math.cos(i)*I.CIRCLE_RADIUS,n=Math.sin(i)*I.CIRCLE_RADIUS;this.circleX.push(a),this.circleZ.push(n),e.position.set(a,0,n),e.scale.set(0,0,0),this.companionMeshes.push(e),this.popinSettled.push(!1),this.companionGroup.add(e)}this.threeScene.add(this.companionGroup)}updateCelebration(t){if(this.companionMeshes.length===0)return;this.celebrationElapsed+=t;const s=I.POPIN_DELAY*(this.companionMeshes.length-1)+I.POPIN_DURATION,e=this.celebrationElapsed>s,i=e?Math.abs(Math.sin(this.celebrationElapsed*I.BOUNCE_SPEED))*I.BOUNCE_HEIGHT:0;for(let a=0;a<this.companionMeshes.length;a++){const n=this.companionMeshes[a];if(this.popinSettled[a]){e&&(n.position.y=i),n.rotation.y+=t*2;continue}const o=a*I.POPIN_DELAY;if(!(this.celebrationElapsed<o)){if(this.celebrationElapsed<o+I.POPIN_DURATION){const h=(this.celebrationElapsed-o)/I.POPIN_DURATION,d=this.bounceEase(h);n.scale.set(d,d,d)}else n.scale.set(1,1,1),this.popinSettled[a]=!0;e&&(n.position.y=i),n.rotation.y+=t*2}}!this.thankYouShown&&this.celebrationElapsed>=I.THANK_YOU_DELAY&&(this.showThankYouText(),this.thankYouShown=!0)}bounceEase(t){return t<.6?t/.6*1.2:1.2-(t-.6)/.4*.2}showThankYouText(){if(!this.overlay||!this.exitCta)return;const t=document.createElement("div");t.setAttribute("data-ending-thank-you",""),t.textContent="みんな ありがとう！",t.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 2rem;
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
      margin-bottom: 1.5rem;
      opacity: 0;
      transition: opacity 0.5s ease-in;
    `,this.overlay.insertBefore(t,this.exitCta),this.exitCta.style.visibility="visible",this.canExit=!0,requestAnimationFrame(()=>{t.style.opacity="1",this.exitCta&&(this.exitCta.style.opacity="1")})}handleOverlayPointerDown(t){if(!this.canExit||this.exitTriggered)return;const s=t.target;s instanceof HTMLElement&&s.closest("[data-mute-button]")||(this.exitTriggered=!0,this.sceneManager.requestTransition("title"))}exit(){this.audioManager.stopBGM(),this.bgStars&&(this.threeScene.remove(this.bgStars),this.bgStars=null),this.companionGroup&&(this.threeScene.remove(this.companionGroup),this.companionMeshes=[],this.companionGroup=null),this.overlay&&(this.overlay.remove(),this.overlay=null),this.exitCta=null,this.canExit=!1,this.exitTriggered=!1,this.muteHandle&&(this.muteHandle.remove(),this.muteHandle=null)}getThreeScene(){return this.threeScene}getCamera(){const{width:t,height:s}=L(),e=t/s;return e!==this.lastAspect&&Number.isFinite(e)&&e>0&&(this.camera.aspect=e,this.camera.updateProjectionMatrix(),this.lastAspect=e),this.camera}}const qe=Object.freeze(Object.defineProperty({__proto__:null,EndingScene:I,__endingSceneSharedAssetsForTest:Ne,__resetEndingSceneSharedAssetsForTest:Fe},Symbol.toStringTag,{value:"Module"}));export{qe as E,Ze as S,Ue as T,T as a,lt as c};
