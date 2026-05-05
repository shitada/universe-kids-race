const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/EncyclopediaOverlay-BQKCndtE.js","assets/game-core-DT7nMe0H.js","assets/three-BsQe5WE2.js"])))=>i.map(i=>d[i]);
import{g as lt,D as Tt,S as W,T as L,a as U,b as jt,L as oe,c as re,_ as wt,d as H,e as $,f as Z,s as Ut,h as ht,i as Wt,j as le,P as K,u as Zt,C as he,k as ce,l as de,B as ue,m as me,M as pe,n as ge,o as fe,p as ye,q as be,r as ve,t as Ee,v as Se,w as xe,x as Ce,y as we,z as Ae,A as qt,W as Te,E as Me,F as Pe,G as Yt,H as Be,I as Mt,J as Re,K as ke,R as Oe,N as Ie,O as De,Q as Ge,U as Le,V as Lt,X as Xt,Y as He,Z as ct,$ as X,a0 as ze,a1 as vt,a2 as Fe,a3 as Et,a4 as Ne,a5 as $e,a6 as _e,a7 as Ve,a8 as je}from"./game-core-DT7nMe0H.js";import{n as Pt,l as Bt,j as Rt,m as kt,G as dt,r as Ue,a as We,s as Ze,M as k,h as z,D as Ht,R as zt,t as F,u as ft,v as it,i as nt,P as yt,V as q,w as Qt,x as qe}from"./three-BsQe5WE2.js";class Ot{overlayEl=null;static COMPACT_HEIGHT_THRESHOLD=720;show(t){if(this.overlayEl)return;const e=document.getElementById("ui-overlay");if(!e)return;const s=this.isCompactHeight();this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-tutorial-overlay",""),this.overlayEl.style.cssText=`
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
    `;const n=document.createElement("div");n.setAttribute("data-tutorial-title",""),n.textContent="あそびかた",n.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${s?"1.8rem":"2.2rem"};
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
      margin-bottom: ${s?"0.9rem":"1.5rem"};
      text-align: center;
    `,i.appendChild(n);const a=document.createElement("div");a.style.cssText=`
      display: flex;
      gap: ${s?"0.8rem":"1.5rem"};
      flex-wrap: wrap;
      justify-content: center;
      width: 100%;
      max-width: 90%;
    `,a.appendChild(this.createCard("👆","ひだり・みぎ を タッチ","うちゅうせんが うごくよ","swipe 2s ease-in-out infinite",s)),a.appendChild(this.createCard("🚀","ブースト ボタン","はやく すすめるよ！","boostPulse 1.5s ease-in-out infinite",s)),a.appendChild(this.createCard("⭐","ほしを あつめて","ゴールを めざそう！","starGlow 3s linear infinite",s)),i.appendChild(a);const o=document.createElement("button");o.textContent="とじる",o.style.cssText=`
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
    `,o.addEventListener("pointerdown",h=>{h.stopPropagation(),t()}),i.appendChild(o),this.injectAnimations(),this.overlayEl.appendChild(i),e.appendChild(this.overlayEl)}hide(){this.overlayEl&&(this.overlayEl.remove(),this.overlayEl=null)}createCard(t,e,s,i,n){const a=document.createElement("div");a.setAttribute("data-tutorial-card",""),a.style.cssText=`
      background: rgba(255, 255, 255, 0.08);
      border-radius: 1.5rem;
      padding: ${n?"1rem 0.85rem":"1.5rem 1.2rem"};
      width: ${n?"150px":"180px"};
      text-align: center;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
    `;const o=document.createElement("div");o.textContent=t,o.style.cssText=`
      font-size: ${n?"2rem":"2.5rem"};
      margin-bottom: ${n?"0.55rem":"0.8rem"};
      animation: ${i};
    `;const h=document.createElement("div");h.textContent=e,h.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${n?"0.95rem":"1.1rem"};
      font-weight: 700;
      color: #fff;
      margin-bottom: 0.4rem;
    `;const c=document.createElement("div");return c.textContent=s,c.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${n?"0.8rem":"0.9rem"};
      color: rgba(255, 255, 255, 0.7);
    `,a.appendChild(o),a.appendChild(h),a.appendChild(c),a}isCompactHeight(){return window.innerHeight<=Ot.COMPACT_HEIGHT_THRESHOLD}injectAnimations(){if(document.getElementById("tutorial-animations"))return;const t=document.createElement("style");t.id="tutorial-animations",t.textContent=`
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
    `,document.head.appendChild(t)}}class Ye{overlayEl=null;activePressCleanups=new Set;show(t,e){if(this.overlayEl)return;const s=document.getElementById("ui-overlay");if(!s)return;this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-title-reset-confirm-overlay",""),this.overlayEl.setAttribute("role","dialog"),this.overlayEl.setAttribute("aria-modal","true"),this.overlayEl.setAttribute("aria-label","さいしょからに もどしますか"),this.overlayEl.style.cssText=`
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
    `;let i=!1;const n=()=>{i||(i=!0,this.hide(),e())},a=()=>{i||(i=!0,this.hide(),t())};this.overlayEl.addEventListener("pointerdown",u=>{u.target===this.overlayEl&&n()});const o=document.createElement("div");o.setAttribute("data-title-reset-confirm-card",""),o.style.cssText=`
      width: min(88vw, 26rem);
      padding: 1.6rem 1.4rem;
      border-radius: 1.7rem;
      background: rgba(0, 0, 64, 0.9);
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.42);
      text-align: center;
      color: #fff;
    `,o.addEventListener("pointerdown",u=>{u.stopPropagation()}),this.overlayEl.appendChild(o);const h=document.createElement("div");h.textContent="さいしょからに する？",h.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 1.7rem;
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 0 16px rgba(255, 215, 0, 0.45);
      margin-bottom: 0.8rem;
    `,o.appendChild(h);const c=document.createElement("div");c.textContent="いまの すすみぐあいだけ きえて、ステージ 1 から あそべるよ",c.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 1rem;
      font-weight: 700;
      line-height: 1.5;
      color: rgba(255, 255, 255, 0.92);
      margin-bottom: 1.2rem;
    `,o.appendChild(c);const m=document.createElement("div");m.style.cssText=`
      display: flex;
      gap: 0.8rem;
      justify-content: center;
      flex-wrap: wrap;
    `,o.appendChild(m);const f=`
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
    `,b=(u,x)=>{let y=!1,p=!1;const A=()=>{T(!0)},w=()=>{u.style.transform="scale(0.92)"},B=()=>{u.style.transform="scale(1)"},T=(d=!1)=>{y=!1,p=d,B(),this.activePressCleanups.delete(A),document.removeEventListener("pointerup",E,!0),document.removeEventListener("pointercancel",S,!0)},E=d=>{const C=d.target===u||d.target instanceof Node&&u.contains(d.target),P=y&&C;T(!C),P&&x()},S=()=>{T(!0)};u.addEventListener("pointerdown",d=>{d.stopPropagation(),y=!0,p=!1,w(),this.activePressCleanups.add(A),document.addEventListener("pointerup",E,!0),document.addEventListener("pointercancel",S,!0)}),u.addEventListener("pointerenter",()=>{y&&w()}),u.addEventListener("pointerleave",()=>{y&&B()}),u.addEventListener("pointercancel",()=>T(!0)),u.addEventListener("click",d=>{if(d.stopPropagation(),p){p=!1;return}y||x()})},g=document.createElement("button");g.setAttribute("data-title-reset-cancel",""),g.textContent="やめる",g.style.cssText=f,g.style.background="rgba(255, 255, 255, 0.18)",g.style.color="#ffffff",b(g,n),m.appendChild(g);const r=document.createElement("button");r.setAttribute("data-title-reset-confirm",""),r.textContent="うん！ さいしょから",r.style.cssText=f,r.style.background="linear-gradient(135deg, #FF9F68, #FFE66D)",r.style.color="#3b1f00",b(r,a),m.appendChild(r),s.appendChild(this.overlayEl)}hide(){if(!this.overlayEl)return;const t=Array.from(this.activePressCleanups);this.activePressCleanups.clear();for(const e of t)e();this.overlayEl.remove(),this.overlayEl=null}}function It(l){const t=l.topRem??.8,e=window.innerHeight<=500,s=document.createElement("button");let i=l.initialMuted;const n=()=>{s.textContent=i?"🔇":"🔊",s.setAttribute("aria-label",i?"サウンド オフ":"サウンド オン")};s.setAttribute("data-mute-button",""),s.style.position="absolute",s.style.top=`${t}rem`,s.style.right="1rem",s.style.fontSize=e?"clamp(1.1rem, 3.5vmin, 1.4rem)":"clamp(1.4rem, 4vmin, 1.8rem)",s.style.background="rgba(255, 255, 255, 0.15)",s.style.border="none",s.style.borderRadius="50%",s.style.width=e?"2.4rem":"3rem",s.style.height=e?"2.4rem":"3rem",s.style.display="flex",s.style.alignItems="center",s.style.justifyContent="center",s.style.cursor="pointer",s.style.pointerEvents="auto",s.style.touchAction="manipulation",s.style.transform="scale(1)",s.style.transition="transform 0.08s ease-out",n();const a=()=>{s.style.transform="scale(1)"};return s.addEventListener("pointerdown",o=>{o.stopPropagation(),s.style.transform="scale(0.9)",l.onToggle()}),s.addEventListener("pointerup",a),s.addEventListener("pointercancel",a),s.addEventListener("pointerleave",a),l.container.appendChild(s),{element:s,setMuted(o){i=o,n()},remove(){s.remove()}}}const Kt=[{value:0,label:"しずか"},{value:25,label:"ちいさい"},{value:50,label:"ふつう"},{value:75,label:"おおきい"},{value:100,label:"さいだい"}];function Ft(l){return Kt.find(t=>t.value===l)?.label??"ふつう"}class Xe{overlay=null;toggleButton=null;descriptionEl=null;highContrast=!1;colorVisionSupportMode="color-only";bgmVolume=100;sfxVolume=100;vibrationIntensity="medium";motionSensitivity="strong";restReminderEnabled=!0;bgmVolumeDescriptionEl=null;sfxVolumeDescriptionEl=null;bgmVolumeSlider=null;sfxVolumeSlider=null;colorVisionDescriptionEl=null;colorVisionButtons=new Map;vibrationDescriptionEl=null;vibrationButtons=new Map;motionDescriptionEl=null;motionButtons=new Map;restReminderDescriptionEl=null;restReminderToggleButton=null;motionPreviewEl=null;motionPreviewTokenEl=null;motionPreviewCaptionEl=null;motionPreviewTimeoutId=null;motionPreviewFrameId=null;onToggle=null;onColorVisionSupportModeChange=null;onBGMVolumeChange=null;onSFXVolumeChange=null;onVibrationIntensityChange=null;onMotionSensitivityChange=null;onRestReminderToggle=null;show(t){const e=document.getElementById("ui-overlay");if(e){if(this.highContrast=t.initialHighContrast,this.colorVisionSupportMode=t.initialColorVisionSupportMode,this.bgmVolume=t.initialBGMVolume,this.sfxVolume=t.initialSFXVolume,this.vibrationIntensity=t.initialVibrationIntensity,this.motionSensitivity=t.initialMotionSensitivity,this.restReminderEnabled=t.initialRestReminderEnabled,this.onToggle=t.onToggle,this.onColorVisionSupportModeChange=t.onColorVisionSupportModeChange,this.onBGMVolumeChange=t.onBGMVolumeChange,this.onSFXVolumeChange=t.onSFXVolumeChange,this.onVibrationIntensityChange=t.onVibrationIntensityChange,this.onMotionSensitivityChange=t.onMotionSensitivityChange,this.onRestReminderToggle=t.onRestReminderToggle,!this.overlay){const s=window.innerHeight<=760;this.overlay=document.createElement("div"),this.overlay.setAttribute("data-color-accessibility-settings",""),this.overlay.style.cssText=`
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.5rem;
        background: rgba(2, 8, 28, 0.76);
        backdrop-filter: blur(8px);
        z-index: 24;
      `;const i=document.createElement("div");i.style.cssText=`
        width: min(92vw, 30rem);
        padding: ${s?"1rem":"1.25rem"};
        border-radius: 1.5rem;
        background: rgba(15, 23, 58, 0.96);
        border: 3px solid rgba(255, 255, 255, 0.95);
        box-shadow: 0 20px 48px rgba(0, 0, 0, 0.35);
        color: #fff;
        font-family: 'Zen Maru Gothic', sans-serif;
        text-align: center;
        transform: ${s?"scale(0.93)":"none"};
        transform-origin: center center;
      `;const n=document.createElement("h2");n.textContent="みやすさ・おと・しんどう せってい",n.style.cssText="margin: 0 0 0.55rem; font-size: clamp(1.2rem, 4.4vmin, 1.6rem);",this.descriptionEl=document.createElement("p"),this.descriptionEl.style.cssText="margin: 0 0 1rem; font-size: clamp(0.95rem, 3.4vmin, 1.05rem); line-height: 1.55;",this.toggleButton=document.createElement("button"),this.toggleButton.setAttribute("data-color-accessibility-toggle",""),this.toggleButton.style.cssText=`
        display: block;
        width: 100%;
        min-height: 2.75rem;
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
      `,this.toggleButton.addEventListener("click",()=>{this.highContrast=!this.highContrast,this.render(),this.onToggle?.(this.highContrast)});const a=document.createElement("h3");a.textContent="おとの おおきさ",a.style.cssText="margin: 0.75rem 0 0.45rem; font-size: clamp(1rem, 3.8vmin, 1.2rem);";const o=document.createElement("p");o.textContent="すべらせて ききやすい おおきさに しよう",o.style.cssText="margin: 0 0 0.65rem; font-size: clamp(0.9rem, 3.1vmin, 1rem); line-height: 1.45;";const h=(d,C,P)=>{const _=document.createElement("div");_.style.cssText="margin-bottom: 0.85rem; text-align: left;";const V=document.createElement("p");V.textContent=C,V.style.cssText="margin: 0 0 0.3rem; font-size: clamp(0.95rem, 3.2vmin, 1rem); font-weight: 900;";const N=document.createElement("p");N.setAttribute(`data-${d}-volume-label`,""),N.style.cssText="margin: 0 0 0.45rem; font-size: clamp(0.88rem, 3vmin, 0.98rem); line-height: 1.4;";const R=document.createElement("input");R.type="range",R.min="0",R.max="100",R.step="25",R.value="100",R.setAttribute(`data-${d}-volume-slider`,""),R.style.cssText="width: 100%; margin: 0 0 0.3rem;",R.addEventListener("input",()=>{const Y=Number(R.value);d==="bgm"?this.bgmVolume=Y:this.sfxVolume=Y,this.render(),P(Y)});const bt=document.createElement("div");bt.style.cssText=`
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 0.2rem;
          font-size: clamp(0.68rem, 2.25vmin, 0.8rem);
          color: rgba(255, 255, 255, 0.86);
          text-align: center;
        `;for(const Y of Kt){const Gt=document.createElement("span");Gt.textContent=Y.label,bt.appendChild(Gt)}return d==="bgm"?(this.bgmVolumeDescriptionEl=N,this.bgmVolumeSlider=R):(this.sfxVolumeDescriptionEl=N,this.sfxVolumeSlider=R),_.append(V,N,R,bt),_},c=h("bgm","🎵 おんがく",d=>{this.onBGMVolumeChange?.(d)}),m=h("sfx","✨ こうかおん",d=>{this.onSFXVolumeChange?.(d)}),f=document.createElement("h3");f.textContent="やすみじかんの おしらせ",f.style.cssText="margin: 0.9rem 0 0.45rem; font-size: clamp(1rem, 3.8vmin, 1.2rem);",this.restReminderDescriptionEl=document.createElement("p"),this.restReminderDescriptionEl.style.cssText="margin: 0 0 0.6rem; font-size: clamp(0.9rem, 3.2vmin, 1rem); line-height: 1.5;",this.restReminderToggleButton=document.createElement("button"),this.restReminderToggleButton.setAttribute("data-rest-reminder-toggle",""),this.restReminderToggleButton.style.cssText=`
        display: block;
        width: 100%;
        min-height: 2.75rem;
        margin-bottom: 0.85rem;
        padding: 0.9rem 1rem;
        border-radius: 999px;
        border: 3px solid #fff;
        background: linear-gradient(135deg, #ffe58b, #9fd6ff);
        color: #102040;
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: clamp(1rem, 3.6vmin, 1.15rem);
        font-weight: 900;
        cursor: pointer;
        touch-action: manipulation;
      `,this.restReminderToggleButton.addEventListener("click",()=>{this.restReminderEnabled=!this.restReminderEnabled,this.render(),this.onRestReminderToggle?.(this.restReminderEnabled)});const b=document.createElement("h3");b.textContent="いろの みわけかた",b.style.cssText="margin: 0.9rem 0 0.45rem; font-size: clamp(1rem, 3.8vmin, 1.2rem);",this.colorVisionDescriptionEl=document.createElement("p"),this.colorVisionDescriptionEl.style.cssText="margin: 0 0 0.8rem; font-size: clamp(0.9rem, 3.2vmin, 1rem); line-height: 1.5;";const g=document.createElement("div");g.setAttribute("data-color-vision-mode-group",""),g.style.cssText=`
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.65rem;
        margin-bottom: 0.95rem;
      `;const r=[{value:"color-only",label:"いろだけ",icon:"🎨"},{value:"color-and-marks",label:"いろとマーク",icon:"★"}];for(const d of r){const C=document.createElement("button");C.setAttribute("data-color-vision-mode-button",d.value),C.textContent=`${d.icon} ${d.label}`,C.style.cssText=`
          min-height: 3.25rem;
          padding: 0.8rem 0.9rem;
          border-radius: 1rem;
          border: 2px solid rgba(255, 255, 255, 0.4);
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
          font-family: 'Zen Maru Gothic', sans-serif;
          font-size: clamp(0.9rem, 3.3vmin, 1rem);
          font-weight: 800;
          cursor: pointer;
          touch-action: manipulation;
          transition: transform 0.08s ease-out, border-color 0.12s ease-out, background 0.12s ease-out;
        `,C.addEventListener("click",()=>{this.colorVisionSupportMode=d.value,this.render(),this.onColorVisionSupportModeChange?.(d.value)}),this.colorVisionButtons.set(d.value,C),g.appendChild(C)}const u=document.createElement("h3");u.textContent="しんどうの つよさ",u.style.cssText="margin: 0.9rem 0 0.45rem; font-size: clamp(1rem, 3.8vmin, 1.2rem);",this.vibrationDescriptionEl=document.createElement("p"),this.vibrationDescriptionEl.style.cssText="margin: 0 0 0.8rem; font-size: clamp(0.9rem, 3.2vmin, 1rem); line-height: 1.5;";const x=document.createElement("div");x.setAttribute("data-vibration-intensity-group",""),x.style.cssText=`
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.65rem;
        margin-bottom: 0.95rem;
      `;const y=[{value:"strong",label:"つよい"},{value:"medium",label:"ふつう"},{value:"weak",label:"やさしい"},{value:"off",label:"オフ"}];for(const d of y){const C=document.createElement("button");C.setAttribute("data-vibration-intensity-button",d.value),C.textContent=d.label,C.style.cssText=`
          min-height: 3.25rem;
          padding: 0.8rem 0.9rem;
          border-radius: 1rem;
          border: 2px solid rgba(255, 255, 255, 0.4);
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
          font-family: 'Zen Maru Gothic', sans-serif;
          font-size: clamp(0.95rem, 3.4vmin, 1.05rem);
          font-weight: 800;
          cursor: pointer;
          touch-action: manipulation;
          transition: transform 0.08s ease-out, border-color 0.12s ease-out, background 0.12s ease-out;
        `,C.addEventListener("click",()=>{this.vibrationIntensity=d.value,this.render(),this.onVibrationIntensityChange?.(d.value)}),this.vibrationButtons.set(d.value,C),x.appendChild(C)}const p=document.createElement("h3");p.textContent="うごきの つよさ",p.style.cssText="margin: 1.1rem 0 0.45rem; font-size: clamp(1rem, 3.8vmin, 1.2rem);";const A=document.createElement("p");A.textContent="えらんで みると うごきの おためしが みえるよ",A.style.cssText="margin: 0 0 0.5rem; font-size: clamp(0.9rem, 3.2vmin, 1rem); line-height: 1.5;",this.motionDescriptionEl=document.createElement("p"),this.motionDescriptionEl.style.cssText="margin: 0 0 0.8rem; font-size: clamp(0.9rem, 3.2vmin, 1rem); line-height: 1.5;";const w=document.createElement("div");w.setAttribute("data-motion-sensitivity-group",""),w.style.cssText=`
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.65rem;
        margin-bottom: 0.95rem;
      `;const B=["strong","medium","gentle","minimal"];for(const d of B){const C=lt(d),P=document.createElement("button");P.setAttribute("data-motion-sensitivity-button",d),P.style.cssText=`
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.15rem;
          min-height: 5rem;
          padding: 0.8rem 0.9rem;
          border-radius: 1rem;
          border: 2px solid rgba(255, 255, 255, 0.4);
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
          font-family: 'Zen Maru Gothic', sans-serif;
          font-size: clamp(0.95rem, 3.2vmin, 1.02rem);
          font-weight: 800;
          cursor: pointer;
          touch-action: manipulation;
          transition: transform 0.08s ease-out, border-color 0.12s ease-out, background 0.12s ease-out;
        `;const _=document.createElement("span");_.textContent=C.emoji,_.style.cssText="font-size: clamp(1.25rem, 4.8vmin, 1.7rem); line-height: 1;";const V=document.createElement("span");V.textContent=C.stars,V.style.cssText="font-size: clamp(0.82rem, 2.9vmin, 0.95rem); letter-spacing: 0.08em;";const N=document.createElement("span");N.textContent=C.shortLabel,N.style.cssText="font-size: clamp(0.9rem, 3vmin, 1rem);",P.append(_,V,N),P.addEventListener("click",()=>{this.motionSensitivity=d,this.render(),this.playMotionPreview(),this.onMotionSensitivityChange?.(d)}),this.motionButtons.set(d,P),w.appendChild(P)}this.motionPreviewEl=document.createElement("div"),this.motionPreviewEl.setAttribute("data-motion-preview",""),this.motionPreviewEl.style.cssText=`
        position: relative;
        min-height: 5.8rem;
        margin: 0 0 1rem;
        padding: 0.8rem 0.9rem;
        border-radius: 1.25rem;
        border: 2px solid rgba(255, 255, 255, 0.2);
        background: linear-gradient(180deg, rgba(14, 24, 60, 0.92), rgba(8, 14, 38, 0.96));
        overflow: hidden;
      `;const T=document.createElement("div");T.style.cssText=`
        position: relative;
        height: 2.7rem;
        margin-bottom: 0.7rem;
        border-radius: 999px;
        background: linear-gradient(90deg, rgba(255, 255, 255, 0.12), rgba(118, 240, 255, 0.22));
        box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.12);
      `;const E=document.createElement("div");E.style.cssText=`
        position: absolute;
        left: 0.8rem;
        right: 0.8rem;
        top: 50%;
        height: 0.35rem;
        transform: translateY(-50%);
        border-radius: 999px;
        background: repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.34), rgba(255, 255, 255, 0.34) 0.55rem, rgba(255, 255, 255, 0.06) 0.55rem, rgba(255, 255, 255, 0.06) 1rem);
      `,this.motionPreviewTokenEl=document.createElement("div"),this.motionPreviewTokenEl.setAttribute("data-motion-preview-token",""),this.motionPreviewTokenEl.style.cssText=`
        position: absolute;
        left: 0.35rem;
        top: 50%;
        width: 2.1rem;
        height: 2.1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 999px;
        background: rgba(255, 242, 122, 0.92);
        color: #102040;
        font-size: 1.3rem;
        transform: translateY(-50%) scale(1);
      `,this.motionPreviewCaptionEl=document.createElement("p"),this.motionPreviewCaptionEl.setAttribute("data-motion-preview-caption",""),this.motionPreviewCaptionEl.style.cssText="margin: 0; font-size: clamp(0.9rem, 3vmin, 1rem); line-height: 1.5;",T.append(E,this.motionPreviewTokenEl),this.motionPreviewEl.append(T,this.motionPreviewCaptionEl);const S=document.createElement("button");S.textContent="とじる",S.style.cssText=`
        width: 100%;
        min-height: 2.75rem;
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
      `,S.addEventListener("click",()=>this.hide()),i.appendChild(n),i.appendChild(this.descriptionEl),i.appendChild(this.toggleButton),i.appendChild(a),i.appendChild(o),i.appendChild(c),i.appendChild(m),i.appendChild(f),i.appendChild(this.restReminderDescriptionEl),i.appendChild(this.restReminderToggleButton),i.appendChild(b),i.appendChild(this.colorVisionDescriptionEl),i.appendChild(g),i.appendChild(u),i.appendChild(this.vibrationDescriptionEl),i.appendChild(x),i.appendChild(p),i.appendChild(A),i.appendChild(this.motionDescriptionEl),i.appendChild(w),i.appendChild(this.motionPreviewEl),i.appendChild(S),this.overlay.appendChild(i)}this.render(),e.appendChild(this.overlay)}}hide(){this.clearMotionPreviewTimers(),this.overlay?.remove()}isVisible(){return this.overlay?.isConnected===!0}render(){if(!this.toggleButton||!this.descriptionEl||!this.bgmVolumeDescriptionEl||!this.sfxVolumeDescriptionEl||!this.bgmVolumeSlider||!this.sfxVolumeSlider||!this.restReminderDescriptionEl||!this.restReminderToggleButton||!this.colorVisionDescriptionEl||!this.vibrationDescriptionEl||!this.motionDescriptionEl)return;this.descriptionEl.textContent=this.highContrast?"ふちや しまもようを つよくして みやすく しているよ。":"ひかりかたを やさしくして いつもの みために しているよ。",this.toggleButton.textContent=this.highContrast?"みやすくする: ON":"みやすくする: OFF",this.toggleButton.setAttribute("aria-pressed",this.highContrast?"true":"false");const t=Ft(this.bgmVolume);this.bgmVolumeDescriptionEl.textContent=`🎵 ${t} (${this.bgmVolume}%)`,this.bgmVolumeSlider.value=String(this.bgmVolume),this.bgmVolumeSlider.setAttribute("aria-valuetext",`${t} ${this.bgmVolume}%`);const e=Ft(this.sfxVolume);this.sfxVolumeDescriptionEl.textContent=`✨ ${e} (${this.sfxVolume}%)`,this.sfxVolumeSlider.value=String(this.sfxVolume),this.sfxVolumeSlider.setAttribute("aria-valuetext",`${e} ${this.sfxVolume}%`),this.restReminderDescriptionEl.textContent=this.restReminderEnabled?"15ぷんごとに そっと やすもうって つたえるよ。":"いまは おしらせを ださずに あそべるよ。",this.restReminderToggleButton.textContent=this.restReminderEnabled?"やすみじかんの おしらせ: ON":"やすみじかんの おしらせ: OFF",this.restReminderToggleButton.setAttribute("aria-pressed",this.restReminderEnabled?"true":"false"),this.colorVisionDescriptionEl.textContent=this.colorVisionSupportMode==="color-and-marks"?"にじりゅうせいは ★、わくせいは しるしつきで わかるよ。":"いまは いろを みながら あそぶ モードだよ。";for(const[n,a]of this.colorVisionButtons.entries()){const o=n===this.colorVisionSupportMode;a.setAttribute("aria-pressed",o?"true":"false"),a.style.borderColor=o?"#fff27a":"rgba(255, 255, 255, 0.4)",a.style.background=o?"linear-gradient(135deg, rgba(255, 242, 122, 0.94), rgba(118, 240, 255, 0.92))":"rgba(255, 255, 255, 0.08)",a.style.color=o?"#102040":"#fff",a.style.transform=o?"scale(1.02)":"scale(1)"}const s={strong:"しっかり つたえる しんどうだよ。",medium:"ちょうどよく わかる つよさだよ。",weak:"やさしく ふるえて つたえるよ。",off:"しんどうの かわりに がめんが すこし ゆれるよ。"};this.vibrationDescriptionEl.textContent=s[this.vibrationIntensity];for(const[n,a]of this.vibrationButtons.entries()){const o=n===this.vibrationIntensity;a.setAttribute("aria-pressed",o?"true":"false"),a.style.borderColor=o?"#fff27a":"rgba(255, 255, 255, 0.4)",a.style.background=o?"linear-gradient(135deg, rgba(255, 242, 122, 0.94), rgba(118, 240, 255, 0.92))":"rgba(255, 255, 255, 0.08)",a.style.color=o?"#102040":"#fff",a.style.transform=o?"scale(1.02)":"scale(1)"}const i=lt(this.motionSensitivity);this.motionDescriptionEl.textContent=i.description;for(const[n,a]of this.motionButtons.entries()){const o=n===this.motionSensitivity;a.setAttribute("aria-pressed",o?"true":"false"),a.style.borderColor=o?"#fff27a":"rgba(255, 255, 255, 0.4)",a.style.background=o?"linear-gradient(135deg, rgba(255, 242, 122, 0.94), rgba(118, 240, 255, 0.92))":"rgba(255, 255, 255, 0.08)",a.style.color=o?"#102040":"#fff",a.style.transform=o?"scale(1.02)":"scale(1)"}this.motionPreviewEl?.dataset.previewActive!=="true"&&this.resetMotionPreview()}playMotionPreview(){if(!this.motionPreviewEl||!this.motionPreviewTokenEl||!this.motionPreviewCaptionEl)return;this.clearMotionPreviewTimers();const t=lt(this.motionSensitivity);this.motionPreviewEl.dataset.previewActive="true",this.motionPreviewTokenEl.textContent=t.emoji,this.motionPreviewTokenEl.style.background="rgba(255, 242, 122, 0.92)",this.motionPreviewTokenEl.style.boxShadow=t.previewGlow,this.motionPreviewTokenEl.style.transition="none",this.motionPreviewTokenEl.style.left="0.35rem",this.motionPreviewTokenEl.style.transform="translateY(-50%) scale(1)",this.motionPreviewCaptionEl.textContent=`${t.emoji} ${t.shortLabel} で おためしちゅう`,this.motionPreviewFrameId=window.requestAnimationFrame(()=>{this.motionPreviewTokenEl&&(this.motionPreviewTokenEl.style.transition=`left ${t.previewDurationMs}ms ease-in-out, transform ${t.previewDurationMs}ms ease-in-out`,this.motionPreviewTokenEl.style.left="calc(100% - 2.45rem)",this.motionPreviewTokenEl.style.transform=`translateY(-50%) scale(${t.previewScale})`)}),this.motionPreviewTimeoutId=window.setTimeout(()=>{this.resetMotionPreview()},t.previewDurationMs+260)}resetMotionPreview(){if(!this.motionPreviewEl||!this.motionPreviewTokenEl||!this.motionPreviewCaptionEl)return;const t=lt(this.motionSensitivity);this.motionPreviewEl.dataset.previewActive="false",this.motionPreviewTokenEl.textContent=t.emoji,this.motionPreviewTokenEl.style.transition="none",this.motionPreviewTokenEl.style.left="0.35rem",this.motionPreviewTokenEl.style.transform="translateY(-50%) scale(1)",this.motionPreviewTokenEl.style.background="rgba(255, 242, 122, 0.92)",this.motionPreviewTokenEl.style.boxShadow=t.previewGlow,this.motionPreviewCaptionEl.textContent=`${t.stars} ${t.shortLabel} を えらぶと おためしするよ`}clearMotionPreviewTimers(){this.motionPreviewTimeoutId!==null&&(window.clearTimeout(this.motionPreviewTimeoutId),this.motionPreviewTimeoutId=null),this.motionPreviewFrameId!==null&&(window.cancelAnimationFrame(this.motionPreviewFrameId),this.motionPreviewFrameId=null)}}function M(l,t){let e=!1,s=!1,i=null,n=null;const a=t.documentTarget??document,o=t.stopPropagation??!0,h=()=>{t.canActivate?.()!==!1&&t.onActivate()},c=E=>{t.onPressChange?.(E)},m=E=>{const S=E;return typeof S.clientX=="number"&&typeof S.clientY=="number"?{x:S.clientX,y:S.clientY}:null},f=E=>{const S=E;return typeof S.pointerId=="number"?S.pointerId:null},b=E=>{const S=f(E);return i===null||S===null||S===i},g=E=>{if(!e||n===null||t.moveTolerancePx===void 0)return!1;const S=m(E);return S===null?!1:Math.hypot(S.x-n.x,S.y-n.y)>t.moveTolerancePx},r=E=>{e=!1,s=E,i=null,n=null,c(!1),a.removeEventListener("pointermove",y,!0),a.removeEventListener("pointerup",u,!0),a.removeEventListener("pointercancel",x,!0)},u=E=>{if(!e||!b(E))return;if(g(E)){r(!0);return}const S=E.target,d=S===l||S instanceof Node&&l.contains(S),C=e&&d;r(C||!d),C&&h()},x=()=>{r(!0)},y=E=>{!e||!b(E)||g(E)&&r(!0)},p=E=>{t.canActivate?.()!==!1&&((t.preventDefaultOnPointerDown??!1)&&E.preventDefault(),o&&E.stopPropagation(),e=!0,s=!1,i=f(E),n=m(E),c(!0),t.moveTolerancePx!==void 0&&a.addEventListener("pointermove",y,!0),a.addEventListener("pointerup",u,!0),a.addEventListener("pointercancel",x,!0))},A=()=>{e&&c(!0)},w=()=>{e&&c(!1)},B=()=>{r(!0)},T=E=>{if(o&&E.stopPropagation(),(t.preventDefaultOnClick??!1)&&E.preventDefault(),s){s=!1;return}e||h()};return l.addEventListener("pointerdown",p),l.addEventListener("pointerenter",A),l.addEventListener("pointerleave",w),l.addEventListener("pointercancel",B),l.addEventListener("click",T),()=>{r(!1),l.removeEventListener("pointerdown",p),l.removeEventListener("pointerenter",A),l.removeEventListener("pointerleave",w),l.removeEventListener("pointercancel",B),l.removeEventListener("click",T)}}class Qe{overlay=null;previewBody=null;previewNose=null;previewWings=null;buttonCleanups=new Set;optionButtons=new Map;draft={...Tt};colorOptions=W.getColorOptions();show(t){this.hide();const e=document.getElementById("ui-overlay");if(!e)return;this.draft=W.normalizeCustomization(t.initialCustomization),this.overlay=document.createElement("div"),this.overlay.setAttribute("data-spaceship-customizer",""),this.overlay.setAttribute("role","dialog"),this.overlay.setAttribute("aria-modal","true"),this.overlay.setAttribute("aria-label","うちゅうせんを かざろう"),this.overlay.style.cssText=`
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.65rem;
      background: rgba(2, 8, 28, 0.82);
      backdrop-filter: blur(8px);
      z-index: 56;
      pointer-events: auto;
      box-sizing: border-box;
      overflow: hidden;
    `;const s=document.createElement("div");s.setAttribute("data-spaceship-customizer-panel",""),s.style.cssText=`
      width: min(96vw, 58rem);
      height: 100%;
      max-height: 720px;
      overflow-x: hidden;
      overflow-y: hidden;
      padding: 0.75rem;
      border-radius: 1.5rem;
      background: linear-gradient(180deg, rgba(12, 25, 76, 0.98), rgba(7, 15, 48, 0.98));
      border: 3px solid rgba(255, 255, 255, 0.94);
      box-shadow: 0 24px 54px rgba(0, 0, 0, 0.4);
      color: #fff;
      font-family: 'Zen Maru Gothic', sans-serif;
      text-align: center;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: center;
    `,s.style.overflowY="hidden",s.style.height="100%",s.style.maxHeight="720px",s.addEventListener("pointerdown",c=>c.stopPropagation()),this.overlay.appendChild(s);const i=document.createElement("h2");i.textContent="うちゅうせんを かざろう",i.style.cssText="margin: 0 0 0.3rem; font-size: clamp(1.25rem, 4.3vmin, 1.85rem); color: #ffe66d;";const n=document.createElement("p");n.textContent="おおきな ボタンで えらぶと、すぐに みためが かわるよ。",n.style.cssText="margin: 0 0 0.45rem; font-size: clamp(0.85rem, 2.8vmin, 1rem); line-height: 1.35;",s.appendChild(i),s.appendChild(n);const a=document.createElement("div");a.setAttribute("data-spaceship-customizer-content",""),a.style.cssText="display: grid; grid-template-columns: minmax(12rem, 15rem) minmax(0, 1fr); gap: 0.65rem; align-items: stretch; margin: 0.45rem 0 0.65rem;",a.appendChild(this.createPreviewCard());const o=document.createElement("div");o.setAttribute("data-spaceship-customizer-sections",""),o.style.cssText="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.5rem; align-items: stretch;",o.appendChild(this.createPartSection("bodyColor","ほんたい")),o.appendChild(this.createPartSection("noseColor","ノーズ")),o.appendChild(this.createPartSection("wingColor","つばさ")),a.appendChild(o),s.appendChild(a);const h=document.createElement("button");h.textContent="かんりょう",h.setAttribute("data-spaceship-customizer-done",""),h.style.cssText=`
      width: min(100%, 14rem);
      min-height: 54px;
      padding: 0.65rem 1rem;
      border: none;
      border-radius: 999px;
      background: linear-gradient(135deg, #ffcf6b, #ffe66d);
      color: #2b2140;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(1rem, 3.4vmin, 1.18rem);
      font-weight: 900;
      cursor: pointer;
      touch-action: manipulation;
      box-shadow: 0 8px 24px rgba(255, 207, 107, 0.35);
      transform: scale(1);
      transition: transform 0.08s ease-out;
    `,this.buttonCleanups.add(M(h,{onActivate:()=>{const c={...this.draft};this.hide(),t.onComplete(c)},onPressChange:c=>{h.style.transform=c?"scale(0.96)":"scale(1)"}})),s.appendChild(h),e.appendChild(this.overlay),this.render()}hide(){const t=Array.from(this.buttonCleanups);this.buttonCleanups.clear();for(const e of t)e();this.optionButtons.clear(),this.overlay?.remove(),this.overlay=null,this.previewBody=null,this.previewNose=null,this.previewWings=null}isVisible(){return this.overlay?.isConnected===!0}createPreviewCard(){const t=document.createElement("div");t.setAttribute("data-spaceship-customizer-preview-card",""),t.style.cssText=`
      width: 100%;
      margin: 0;
      height: 100%;
      padding: 0.6rem;
      border-radius: 1.4rem;
      background: rgba(255, 255, 255, 0.1);
      box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.12);
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: center;
    `;const e=document.createElement("div");e.textContent="プレビュー",e.style.cssText="margin-bottom: 0.35rem; font-size: 0.85rem; font-weight: 700; color: #dff4ff;",t.appendChild(e);const s=document.createElement("div");s.setAttribute("data-spaceship-customizer-preview",""),s.style.cssText=`
      position: relative;
      width: min(100%, 14rem);
      height: 7.5rem;
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
    `,s.appendChild(i),this.previewWings=document.createElement("div"),this.previewWings.style.cssText=`
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
    `;const n=document.createElement("div");return n.style.cssText=`
      position: absolute;
      left: 50%;
      top: 52%;
      width: 12%;
      height: 18%;
      border-radius: 999px;
      transform: translate(-50%, -50%);
      background: rgba(255, 255, 255, 0.82);
      border: 3px solid rgba(8, 16, 40, 0.18);
    `,s.appendChild(this.previewWings),s.appendChild(this.previewBody),s.appendChild(this.previewNose),s.appendChild(n),t.appendChild(s),t}createPartSection(t,e){const s=document.createElement("div");s.style.cssText=`
      padding: 0.5rem 0.45rem;
      border-radius: 1.1rem;
      background: rgba(255, 255, 255, 0.08);
      text-align: left;
      box-sizing: border-box;
    `;const i=document.createElement("div");i.textContent=e,i.style.cssText="margin-bottom: 0.25rem; font-size: 0.88rem; font-weight: 900; color: #ffe66d; text-align: center;",s.appendChild(i);const n=document.createElement("div");n.style.cssText="display: grid; grid-template-columns: minmax(0, 1fr); gap: 0.32rem;";for(const a of this.colorOptions)n.appendChild(this.createColorButton(t,a));return s.appendChild(n),s}createColorButton(t,e){const s=document.createElement("button");s.type="button",s.setAttribute("data-spaceship-color-option",`${t}:${e.key}`),s.style.cssText=`
      width: 100%;
      min-height: 46px;
      padding: 0.42rem 0.5rem;
      border-radius: 1rem;
      border: 3px solid transparent;
      background: rgba(255, 255, 255, 0.12);
      color: #fff;
      cursor: pointer;
      touch-action: manipulation;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 0.45rem;
      transform: scale(1);
      transition: transform 0.08s ease-out, border-color 0.08s ease-out;
    `;const i=document.createElement("span");i.setAttribute("data-spaceship-color-swatch",e.key),i.setAttribute("data-color-hex",`#${e.hex.toString(16).padStart(6,"0")}`),i.style.cssText=`
      display: block;
      width: 1.35rem;
      height: 1.35rem;
      border-radius: 999px;
      background: #${e.hex.toString(16).padStart(6,"0")};
      box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.24);
    `;const n=document.createElement("span");return n.textContent=e.label,n.style.cssText="font-family: Zen Maru Gothic, sans-serif; font-size: 0.82rem; font-weight: 700;",s.appendChild(i),s.appendChild(n),this.buttonCleanups.add(M(s,{onActivate:()=>this.selectColor(t,e.key),onPressChange:a=>{s.style.transform=a?"scale(0.95)":"scale(1)"}})),this.optionButtons.set(`${t}:${e.key}`,s),s}selectColor(t,e){this.draft={...this.draft,[t]:e},this.render()}render(){const t=W.normalizeCustomization(this.draft);this.draft=t,this.previewBody?.style.setProperty("background",`#${W.getColorHex(t.bodyColor).toString(16).padStart(6,"0")}`),this.previewWings?.style.setProperty("background",`#${W.getColorHex(t.wingColor).toString(16).padStart(6,"0")}`),this.previewNose&&(this.previewNose.style.borderBottomColor=`#${W.getColorHex(t.noseColor).toString(16).padStart(6,"0")}`);for(const e of this.colorOptions)this.renderOptionState("bodyColor",e.key,t.bodyColor===e.key),this.renderOptionState("noseColor",e.key,t.noseColor===e.key),this.renderOptionState("wingColor",e.key,t.wingColor===e.key)}renderOptionState(t,e,s){const i=this.optionButtons.get(`${t}:${e}`);i&&(i.setAttribute("aria-pressed",s?"true":"false"),i.style.borderColor=s?"#ffe66d":"transparent",i.style.background=s?"rgba(255, 230, 109, 0.18)":"rgba(255, 255, 255, 0.12)")}}function Ke(l){return{totalPlayTimeSeconds:l?.totalPlayTimeSeconds??0,totalStarsCollected:l?.totalStarsCollected??0,totalBoostUses:l?.totalBoostUses??0,stageClearCounts:{...l?.stageClearCounts??{}}}}function Je(l){const t=Math.max(0,Math.round(l)),e=Math.floor(t/3600),s=Math.floor(t%3600/60),i=t%60;return e>0?`${e}じかん ${s}ふん`:s>0?`${s}ふん ${i}びょう`:`${i}びょう`}class ts{overlayEl=null;actionCleanups=new Set;show(t,e){this.hide();const s=document.getElementById("ui-overlay");if(!s)return;const i=Ke(t),n=window.innerHeight<=720,a=document.createElement("div");a.setAttribute("data-stats-overlay",""),a.style.cssText=`
      position: absolute;
      inset: 0;
      z-index: 35;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: ${n?"0.8rem":"1.25rem"};
      box-sizing: border-box;
      background: rgba(0, 0, 32, 0.92);
      pointer-events: auto;
      touch-action: manipulation;
    `,this.overlayEl=a;const o=document.createElement("section");o.setAttribute("role","dialog"),o.setAttribute("aria-modal","true"),o.style.cssText=`
      width: min(92vw, 640px);
      max-height: min(88vh, 760px);
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      border-radius: 28px;
      padding: ${n?"1rem 0.9rem 1.2rem":"1.5rem 1.4rem 1.6rem"};
      box-sizing: border-box;
      background: linear-gradient(180deg, rgba(15, 30, 92, 0.96), rgba(6, 12, 44, 0.98));
      box-shadow: 0 20px 48px rgba(0, 0, 0, 0.3);
      color: #fff;
      text-align: center;
    `;const h=document.createElement("h2");h.textContent="あそびの きろく",h.style.cssText=`
      margin: 0 0 1rem;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${n?"1.8rem":"2.2rem"};
      font-weight: 900;
      color: #FFE66D;
    `,o.appendChild(h);const c=document.createElement("div");c.style.cssText=`
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(${n?"120px":"150px"}, 1fr));
      gap: 0.8rem;
      margin-bottom: 1rem;
    `,c.append(this.createSummaryCard("あそんだ じかん",Je(i.totalPlayTimeSeconds),"data-stats-total-play-time"),this.createSummaryCard("とった ほし",`${i.totalStarsCollected}こ`,"data-stats-total-stars"),this.createSummaryCard("ブースト",`${i.totalBoostUses}かい`,"data-stats-total-boosts")),o.appendChild(c);const m=document.createElement("div");m.style.cssText=`
      margin-top: 0.5rem;
      padding: ${n?"0.9rem 0.8rem":"1rem"};
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.1);
    `;const f=document.createElement("div");f.textContent="ステージ クリア かいすう",f.style.cssText=`
      margin-bottom: 0.75rem;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${n?"1.1rem":"1.25rem"};
      font-weight: 900;
      color: #FFE66D;
    `,m.appendChild(f);const b=document.createElement("div");b.setAttribute("data-stats-stage-clears",""),b.style.cssText=`
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
      text-align: left;
    `;const g=Array.from({length:L},(u,x)=>x+1).map(u=>({stageNumber:u,clearCount:i.stageClearCounts[u]??0})).filter(u=>u.clearCount>0);if(g.length===0){const u=document.createElement("div");u.textContent="まだ きろくが ないよ",u.style.cssText=`
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${n?"1rem":"1.1rem"};
        font-weight: 700;
        text-align: center;
        color: rgba(255, 255, 255, 0.88);
      `,b.appendChild(u)}else for(const{stageNumber:u,clearCount:x}of g){const y=U(u),p=document.createElement("div");p.setAttribute("data-stats-stage-clear-row",String(u)),p.style.cssText=`
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          padding: 0.55rem 0.7rem;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.08);
          font-family: 'Zen Maru Gothic', sans-serif;
          font-size: ${n?"0.95rem":"1.05rem"};
          font-weight: 700;
        `;const A=document.createElement("span");A.textContent=`${y.emoji} ステージ ${u} ${y.destinationReading}`;const w=document.createElement("span");w.textContent=`${x}かい`,w.style.color="#FFE66D",p.append(A,w),b.appendChild(p)}m.appendChild(b),o.appendChild(m);const r=document.createElement("button");r.textContent="もどる",r.style.cssText=`
      margin-top: 1rem;
      min-width: min(70vw, 220px);
      min-height: 64px;
      border: none;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.18);
      color: #fff;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${n?"1.2rem":"1.35rem"};
      font-weight: 900;
      cursor: pointer;
      touch-action: manipulation;
      transform: scale(1);
      transition: transform 0.08s ease-out;
    `,this.actionCleanups.add(M(r,{onActivate:()=>{this.hide(),e()},onPressChange:u=>{r.style.transform=u?"scale(0.96)":"scale(1)"}})),o.appendChild(r),a.appendChild(o),s.appendChild(a)}hide(){const t=Array.from(this.actionCleanups);this.actionCleanups.clear();for(const e of t)e();this.overlayEl?.remove(),this.overlayEl=null}createSummaryCard(t,e,s){const i=document.createElement("div");i.setAttribute(s,""),i.style.cssText=`
      padding: 0.9rem 0.8rem;
      border-radius: 18px;
      background: rgba(255, 255, 255, 0.1);
    `;const n=document.createElement("div");n.textContent=t,n.style.cssText=`
      margin-bottom: 0.3rem;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 0.95rem;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.86);
    `;const a=document.createElement("div");return a.textContent=e,a.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(1.25rem, 4.4vmin, 1.8rem);
      font-weight: 900;
      color: #FFE66D;
    `,i.append(n,a),i}}function Nt(l,t){if(!Number.isFinite(l)||l<=0||t<=0)return"ずかん";const e=Math.min(l,t);return e>=t?`ずかん ${t} / ${t} 🎉`:`ずかん ${e} / ${t}`}function es(l){switch(l){case"hero":return{gap:"0.35rem",label:"0.92rem",medal:"1.7rem",hint:"0.98rem"};case"compact":return{gap:"0.18rem",label:"0.7rem",medal:"1rem",hint:"0.76rem"};default:return{gap:"0.26rem",label:"0.8rem",medal:"1.25rem",hint:"0.84rem"}}}function At(l,t,e={}){const s=jt(l,t),i=e.size??"regular",n=es(i),a=document.createElement("div");if(a.setAttribute("data-stage-medal-display",""),a.setAttribute("data-stage-medal-stage",String(l)),a.setAttribute("data-stage-medal-tier",s.tier),a.setAttribute("data-stage-medal-earned",String(s.earnedCount)),e.scope&&a.setAttribute("data-stage-medal-scope",e.scope),a.style.cssText=`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${n.gap};
  `,e.label){const m=document.createElement("div");m.textContent=e.label,m.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${n.label};
      font-weight: 700;
      color: rgba(255, 255, 255, 0.84);
      letter-spacing: 0.06em;
    `,a.appendChild(m)}const o=document.createElement("div");o.style.cssText=`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${n.gap};
  `;for(const m of s.slots){const f=document.createElement("span");f.setAttribute("data-stage-medal-slot",m.tier),f.setAttribute("data-stage-medal-threshold",String(m.threshold)),f.setAttribute("data-stage-medal-reached",String(m.reached)),f.textContent=m.icon,f.style.cssText=`
      font-size: ${n.medal};
      line-height: 1;
      filter: ${m.reached?"drop-shadow(0 0 10px rgba(255, 215, 0, 0.45))":"none"};
      opacity: ${m.reached?"1":"0.3"};
      transform: ${m.reached?"scale(1)":"scale(0.92)"};
    `,o.appendChild(f)}a.appendChild(o);const h=e.hint??(s.nextThreshold===null?"かんぺき！":`つぎ ⭐ ${s.nextThreshold}`),c=document.createElement("div");return c.setAttribute("data-stage-medal-hint",""),c.textContent=h,c.style.cssText=`
    font-family: 'Zen Maru Gothic', sans-serif;
    font-size: ${n.hint};
    font-weight: 700;
    color: ${s.nextThreshold===null?"#FFE66D":"rgba(255, 255, 255, 0.86)"};
  `,a.appendChild(c),a}const $t=2e3,ut=new Map,mt=new Map,pt=new Map;let at=null,ot=null;function rt(l,t){if(typeof document>"u"){const s=typeof OffscreenCanvas=="function",i=s?new OffscreenCanvas(l,t):{width:l,height:t};return{canvas:i,ctx:s?i.getContext("2d"):null}}const e=document.createElement("canvas");return e.width=l,e.height=t,{canvas:e,ctx:e.getContext("2d")}}function Q(l,t){let e=ut.get(l);return e||(e=t(),e.generateMipmaps=!1,e.minFilter=Ze,e.needsUpdate=!0,ut.set(l,e)),e}function O(l,t){let e=mt.get(l);return e||(e=t(),mt.set(l,e)),e}function I(l,t){let e=pt.get(l);return e||(e=t(),pt.set(l,e)),e}function D(l,t){const e=new We(l,t);return e.userData.sharedAssets=!0,e}function Jt(){if(!at){const l=new Bt,t=new Float32Array($t*3);for(let e=0;e<$t*3;e+=3)t[e]=(Math.random()-.5)*200,t[e+1]=(Math.random()-.5)*200,t[e+2]=(Math.random()-.5)*400;l.setAttribute("position",new Rt(t,3)),at=l}ot||(ot=new kt({color:16777215,size:.2,sizeAttenuation:!0}))}function ss(){const{canvas:l,ctx:t}=rt(256,256);if(!t)return new F(l);t.fillStyle="#888888",t.fillRect(0,0,256,256);for(let e=0;e<30;e++){const s=Math.random()*256,i=Math.random()*256,n=3+Math.random()*12;t.beginPath(),t.arc(s,i,n,0,Math.PI*2),t.fillStyle=`rgba(60,60,60,${.3+Math.random()*.4})`,t.fill()}return new F(l)}function is(){const{canvas:l,ctx:t}=rt(256,256);if(!t)return new F(l);t.fillStyle="#ddaa44",t.fillRect(0,0,256,256);for(let e=0;e<8;e++){t.beginPath();const s=128+(Math.random()-.5)*100,i=128+(Math.random()-.5)*100;t.strokeStyle=`rgba(200,150,60,${.3+Math.random()*.3})`,t.lineWidth=3+Math.random()*5;for(let n=0;n<Math.PI*4;n+=.1){const a=10+n*8;t.lineTo(s+Math.cos(n)*a,i+Math.sin(n)*a)}t.stroke()}return new F(l)}function ns(){const{canvas:l,ctx:t}=rt(256,256);if(!t)return new F(l);const e=["#cc7733","#dd9955","#bb6622","#eebb77","#aa5511","#ddaa66"];for(let s=0;s<256;s++){const i=Math.floor(s/(256/e.length))%e.length;t.fillStyle=e[i],t.fillRect(0,s,256,1)}return new F(l)}function as(){const{canvas:l,ctx:t}=rt(512,256);return t?(t.fillStyle="#2266aa",t.fillRect(0,0,512,256),t.fillStyle="#886644",t.beginPath(),t.ellipse(300,80,80,40,.2,0,Math.PI*2),t.fill(),t.beginPath(),t.ellipse(280,150,30,50,.1,0,Math.PI*2),t.fill(),t.beginPath(),t.ellipse(100,90,25,60,.3,0,Math.PI*2),t.fill(),t.beginPath(),t.ellipse(110,170,20,40,-.2,0,Math.PI*2),t.fill(),t.beginPath(),t.ellipse(420,170,25,15,0,0,Math.PI*2),t.fill(),t.fillStyle="#447733",t.beginPath(),t.ellipse(290,75,40,20,.3,0,Math.PI*2),t.fill(),t.beginPath(),t.ellipse(95,85,15,30,.2,0,Math.PI*2),t.fill(),new F(l)):new F(l)}function os(){const{canvas:l,ctx:t}=rt(512,256);if(!t)return new F(l);t.clearRect(0,0,512,256),t.fillStyle="rgba(255,255,255,0.6)";for(let e=0;e<20;e++){const s=Math.random()*512,i=Math.random()*256;t.beginPath(),t.ellipse(s,i,20+Math.random()*40,8+Math.random()*15,Math.random()*Math.PI,0,Math.PI*2),t.fill()}return new F(l)}function rs(){ut.clear(),mt.clear(),pt.clear(),at=null,ot=null}const ls={planetTextureCache:ut,planetGeometryCache:mt,planetMaterialCache:pt,getBgStarsGeometry:()=>at,getBgStarsMaterial:()=>ot};function te(l,t,e){const s=new dt;let i=null;switch(l){case 2:{const n=Q("mercury",ss),a=O("mercury:sphere",()=>new z(10,24,24)),o=I("mercury:mat",()=>new k({map:n})),h=D(a,o);s.add(h),i=h;break}case 3:{const n=Q("venus",is),a=O("venus:sphere",()=>new z(14,24,24)),o=I("venus:mat",()=>new k({map:n})),h=D(a,o);s.add(h),i=h;break}case 5:{const n=Q("jupiter",ns),a=O("jupiter:sphere",()=>new z(20,24,24)),o=I("jupiter:mat",()=>new k({map:n})),h=D(a,o);s.add(h),i=h;break}case 6:{const n=O("saturn:sphere",()=>new z(15,24,24)),a=t.planetColor,o=I(`saturn:mat:${a}`,()=>new k({color:a})),h=D(n,o);s.add(h);const c=O("saturn:ring",()=>new zt(20,30,48)),m=I("saturn:ringMat",()=>new k({color:15645542,side:Ht})),f=D(c,m);f.rotation.x=Math.PI/3,s.add(f),i=h;break}case 7:{const n=O("uranus:sphere",()=>new z(16,24,24)),a=I("uranus:mat",()=>new k({color:6737117})),o=D(n,a);s.add(o);const h=O("uranus:ring",()=>new zt(21,28,48)),c=I("uranus:ringMat",()=>new k({color:10083822,side:Ht})),m=D(h,c);m.rotation.z=Math.PI/2,s.add(m),i=o;break}case 9:{const n=O("pluto:sphere",()=>new z(8,24,24)),a=I("pluto:mat",()=>new k({color:12298922})),o=D(n,a);s.add(o),i=o;break}case 10:{const n=O("sun:sphere",()=>new z(25,24,24)),a=I("sun:mat",()=>new k({color:16763904,emissive:16755200,emissiveIntensity:.5})),o=D(n,a);s.add(o),s.add(new Ue(16763904,2,200)),i=o;break}case 11:{const n=Q("earth",as),a=O("earth:sphere",()=>new z(15,32,32)),o=I("earth:mat",()=>new k({map:n})),h=Q("earth:cloud",os),c=O("earth:cloudSphere",()=>new z(15.5,32,32)),m=I("earth:cloudMat",()=>new k({map:h,transparent:!0,opacity:.3})),f=new dt;f.add(D(a,o)),f.add(D(c,m)),s.add(f),i=f;break}default:{const n=O("default:sphere",()=>new z(15,24,24)),a=t.planetColor,o=I(`default:mat:${a}`,()=>new k({color:a})),h=D(n,o);s.add(h),i=h;break}}return s.position.set(0,0,e),{planet:s,spinTarget:i}}function ee(l,t,e){return te(l,t,e)}function se(l){Jt();const t=new Pt(at,ot);return t.userData.sharedAssets=!0,t.geometry.setDrawRange(0,l),t}function Dt(l){!Number.isInteger(l)||l<1||l>L||typeof document>"u"&&typeof OffscreenCanvas!="function"||(Jt(),te(l,U(l),0))}let J=null,tt=null;function hs(){if(!J){const l=new Bt,t=new Float32Array(3e3);for(let e=0;e<3e3;e++)t[e]=(Math.random()-.5)*200;l.setAttribute("position",new Rt(t,3)),J=l}return J}function cs(){return tt||(tt=new kt({color:16777215,size:.3,sizeAttenuation:!0})),tt}function ds(){J=null,tt=null}const us={getBgStarsGeometry:()=>J,getBgStarsMaterial:()=>tt};function ms(l){const t=window.requestIdleCallback;if(typeof t=="function"){t(l,{timeout:1500});return}window.setTimeout(l,800)}function ie(l){return new Set(l.filter(t=>Number.isInteger(t)&&t>=1&&t<=L)).size}function ps(l){return ie(l)>=L}function St(l){const t=ps(l.unlockedPlanets),e=t?1:Math.min(l.clearedStage+1,L),s=U(e),i=l.bestStageStars?.[e]??0,n=l.colorAccessibility?.colorVisionSupportMode??$,a=Wt(e,s.destinationReading,n);return t?{startStage:e,destination:a,emoji:s.emoji,statusLabel:"ぜんぶ あつめたよ！",destinationLabel:`${a}へ もういちど しゅっぱつ！`,buttonHint:`${s.emoji} ステージ ${e} から もういちど あそぶ`,bestStars:i}:{startStage:e,destination:a,emoji:s.emoji,statusLabel:l.clearedStage>0?"つづきから しゅっぱつ！":"はじめての しゅっぱつ！",destinationLabel:`${a}へ むかおう！`,buttonHint:`${s.emoji} ステージ ${e} から スタート`,bestStars:i}}function gs(l){return l.clearedStage>0||ie(l.unlockedPlanets)>0||Object.keys(l.bestStageStars??{}).length>0}class fs{threeScene;ambientLight=new ft(16777215,1);camera;lastAspect=0;sceneManager;saveManager;audioManager;stars=null;companionParade=null;overlay=null;muteHandle=null;tutorialOverlay=new Ot;titleResetConfirmOverlay=new Ye;colorAccessibilitySettings=new Xe;spaceshipCustomizer=new Qe;statsOverlay=new ts;encyclopediaOverlay=null;encyclopediaOverlayPromise=null;companionFactory=null;companionFactoryPromise=null;loadEncyclopediaOverlay;loadTitleCompanionFactory;loadingOverlay;loadFailureOverlay;scheduleIdleTask;encyclopediaBtn=null;isOpeningEncyclopedia=!1;isActive=!1;encyclopediaRequestToken=0;companionParadeRequestToken=0;bgmPending=!1;overlayButtonCleanups=new Set;constructor(t,e,s,i={}){this.sceneManager=t,this.saveManager=e,this.audioManager=s,this.loadingOverlay=i.loadingOverlay??new oe,this.loadFailureOverlay=i.loadFailureOverlay??new re,this.scheduleIdleTask=i.scheduleIdleTask??ms,this.loadEncyclopediaOverlay=i.loadEncyclopediaOverlay??(()=>wt(()=>import("./EncyclopediaOverlay-BQKCndtE.js"),__vite__mapDeps([0,1,2]))),this.loadTitleCompanionFactory=i.loadTitleCompanionFactory??(()=>wt(()=>import("./game-core-DT7nMe0H.js").then(o=>o.ah),__vite__mapDeps([1,2]))),this.threeScene=new it,this.threeScene.background=new nt(32);const{width:n,height:a}=H();this.camera=new yt(60,n/a,.1,1e3),this.camera.position.set(0,0,5)}enter(t){this.isActive=!0,this.encyclopediaRequestToken+=1,this.companionParadeRequestToken+=1,this.lastAspect=0,this.stars=new Pt(hs(),cs()),this.stars.userData.sharedAssets=!0,this.stars.rotation.set(0,0,0),this.threeScene.add(this.stars),this.ambientLight.parent||this.threeScene.add(this.ambientLight);const e=this.saveManager.load();this.createCompanionParade(e.unlockedPlanets),this.createOverlay(),this.createMuteButton(),this.prefetchEncyclopediaOnIdle(),this.prewarmNextAdventureOnIdle(St(e).startStage),this.audioManager.isInitialized()?(this.audioManager.playBGM(0),this.bgmPending=!1):this.bgmPending=!0,e.tutorialShown||this.tutorialOverlay.show(()=>{this.ensureTitleAudioInitialized(!0),this.tutorialOverlay.hide(),this.saveManager.markTutorialShown()})}createMuteButton(){const t=document.getElementById("hud")??document.getElementById("ui-overlay");t&&(this.muteHandle=It({initialMuted:this.audioManager.isMuted(),container:t,onToggle:()=>{this.ensureTitleAudioInitialized(!0);const e=this.audioManager.toggleMute();this.muteHandle?.setMuted(e);const s=this.saveManager.load();s.muted=e,this.saveManager.save(s)}}))}getEncyclopediaOverlay(){return this.encyclopediaOverlay?Promise.resolve(this.encyclopediaOverlay):this.encyclopediaOverlayPromise?this.encyclopediaOverlayPromise:(this.encyclopediaOverlayPromise=this.loadEncyclopediaOverlay().then(({EncyclopediaOverlay:t})=>{const e=new t;return this.encyclopediaOverlay=e,e}).finally(()=>{this.encyclopediaOverlayPromise=null}),this.encyclopediaOverlayPromise)}getTitleCompanionFactory(){return this.companionFactory?Promise.resolve(this.companionFactory):this.companionFactoryPromise?this.companionFactoryPromise:(this.companionFactoryPromise=this.loadTitleCompanionFactory().then(t=>(this.companionFactory=t,t)).finally(()=>{this.companionFactoryPromise=null}),this.companionFactoryPromise)}showEncyclopedia(){if(!this.isActive||!this.encyclopediaOverlay)return;const t=this.saveManager.load();this.encyclopediaOverlay.show(t.unlockedPlanets,()=>this.refreshEncyclopediaButtonLabel(),e=>{this.ensureTitleAudioInitialized(!1),this.sceneManager.requestTransition("stage",{stageNumber:e,totalScore:0,totalStarCount:0,launchSource:"encyclopedia"})},t.bestStageStars??{},t.discoveredConstellations??[],t.colorAccessibility?.colorVisionSupportMode??$,t.discoveredMonthlyEncounters??[])}isCurrentEncyclopediaRequest(t){return this.isActive&&this.encyclopediaRequestToken===t}prefetchEncyclopediaOnIdle(){const t=this.encyclopediaRequestToken;this.scheduleIdleTask(()=>{!this.isCurrentEncyclopediaRequest(t)||this.encyclopediaOverlay||this.encyclopediaOverlayPromise||this.getEncyclopediaOverlay().catch(()=>{})})}prewarmNextAdventureOnIdle(t){if(t>L)return;const e=this.encyclopediaRequestToken;this.scheduleIdleTask(()=>{this.isCurrentEncyclopediaRequest(e)&&Dt(t)})}async openEncyclopedia(){if(!this.isActive)return;if(this.loadFailureOverlay.hide(),this.encyclopediaOverlay){this.showEncyclopedia();return}if(this.isOpeningEncyclopedia)return;const t=this.encyclopediaRequestToken;this.isOpeningEncyclopedia=!0,this.loadingOverlay.show("ずかんを よんでるよ...");try{if(await this.getEncyclopediaOverlay(),!this.isCurrentEncyclopediaRequest(t))return;this.loadingOverlay.hide(),this.showEncyclopedia()}catch(e){if(!this.isCurrentEncyclopediaRequest(t))return;this.loadingOverlay.hide(),console.error("Failed to load encyclopedia overlay",e),this.loadFailureOverlay.show({title:"ずかんを もういちど よんでみよう！",message:"「もういちど よむ」を おして つづきを たのしもう！",primaryAction:{label:"もういちど よむ",onSelect:()=>this.openEncyclopedia()}})}finally{this.encyclopediaRequestToken===t&&(this.isOpeningEncyclopedia=!1)}}persistHighContrastSetting(t){const e=this.saveManager.load(),s=e.colorAccessibility?.motionSensitivity??Z(),i=e.colorAccessibility?.colorVisionSupportMode??$;e.colorAccessibility=this.buildColorAccessibilitySettings(t,s,i),e.colorAccessibility||delete e.colorAccessibility,this.saveManager.save(e)}persistVibrationIntensitySetting(t){const e=this.saveManager.load();e.vibrationSettings={intensity:t},this.saveManager.save(e),Ut(t)}persistRestReminderSetting(t){const e=this.saveManager.load();e.restReminderSettings={enabled:t},this.saveManager.save(e)}persistBGMVolumeSetting(t){const e=this.saveManager.load();e.audioSettings=this.buildAudioSettings(t,e.audioSettings?.sfxVolume??100),e.audioSettings||delete e.audioSettings,this.saveManager.save(e),this.audioManager.setBGMVolume(t)}persistSFXVolumeSetting(t){const e=this.saveManager.load();e.audioSettings=this.buildAudioSettings(e.audioSettings?.bgmVolume??100,t),e.audioSettings||delete e.audioSettings,this.saveManager.save(e),this.audioManager.setSFXVolume(t)}persistMotionSensitivitySetting(t){const e=this.saveManager.load(),s=e.colorAccessibility?.highContrast===!0,i=e.colorAccessibility?.colorVisionSupportMode??$;e.colorAccessibility=this.buildColorAccessibilitySettings(s,t,i),e.colorAccessibility||delete e.colorAccessibility,this.saveManager.save(e)}persistColorVisionSupportModeSetting(t){const e=this.saveManager.load(),s=e.colorAccessibility?.highContrast===!0,i=e.colorAccessibility?.motionSensitivity??Z();e.colorAccessibility=this.buildColorAccessibilitySettings(s,i,t),e.colorAccessibility||delete e.colorAccessibility,this.saveManager.save(e)}buildColorAccessibilitySettings(t,e,s){const i=Z();if(!(!t&&e===i&&s===$))return{...t?{highContrast:!0}:{},...e!==i?{motionSensitivity:e}:{},...s!==$?{colorVisionSupportMode:s}:{}}}buildAudioSettings(t,e){if(!(t===100&&e===100))return{...t!==100?{bgmVolume:t}:{},...e!==100?{sfxVolume:e}:{}}}createOverlay(){const t=document.getElementById("ui-overlay");if(!t)return;const e=this.saveManager.load(),s=St(e),i=gs(e);this.overlay=document.createElement("div"),this.overlay.style.cssText=`
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0;
      width: 100%;
      height: 100%;
      pointer-events: auto;
      padding: 0.8rem 1rem;
      box-sizing: border-box;
      overflow: hidden;
    `;const n=window.innerHeight<=720,a=document.createElement("div");a.textContent="うちゅうの たび",a.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${n?"2rem":"3rem"};
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
      margin-bottom: ${n?"0.35rem":"1.1rem"};
    `;const o=document.createElement("div");o.setAttribute("data-next-adventure-card",""),o.setAttribute("data-next-stage-number",String(s.startStage)),o.setAttribute("data-next-stage-destination",s.destination),o.style.cssText=`
      width: min(${n?"64vw":"70vw"}, ${n?"20rem":"26rem"});
      padding: ${n?"0.5rem 0.8rem":"0.8rem 1.2rem"};
      margin-bottom: ${n?"0.45rem":"0.85rem"};
      border-radius: ${n?"1rem":"1.5rem"};
      background: rgba(255, 255, 255, 0.14);
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.22);
      backdrop-filter: blur(6px);
      text-align: center;
      color: #fff;
    `;const h=document.createElement("div");h.textContent="つぎの ぼうけん",h.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${n?"0.8rem":"1rem"};
      font-weight: 700;
      color: #FFE66D;
      margin-bottom: ${n?"0.15rem":"0.35rem"};
    `;const c=document.createElement("div");c.textContent=s.statusLabel,c.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${n?"1rem":"1.25rem"};
      font-weight: 900;
      margin-bottom: ${n?"0.15rem":"0.35rem"};
    `;const m=document.createElement("div");m.textContent=`${s.emoji} ステージ ${s.startStage} ・ ${s.destination}`,m.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${n?"1.05rem":"1.35rem"};
      font-weight: 700;
      margin-bottom: 0.25rem;
    `;const f=document.createElement("div");f.textContent=s.destinationLabel,f.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${n?"0.85rem":"1rem"};
      font-weight: 700;
      color: rgba(255, 255, 255, 0.92);
    `;const b=jt(s.startStage,s.bestStars),g=At(s.startStage,s.bestStars,{label:"メダル",hint:b.nextThreshold===null?"かんぺき！":`${b.icon} いま ・ つぎ ⭐ ${b.nextThreshold}`,size:"regular",scope:"title-next-adventure"});g.style.marginTop=n?"0.35rem":"0.55rem",o.appendChild(h),o.appendChild(c),o.appendChild(m),o.appendChild(f),o.appendChild(g);const r=document.createElement("div");r.style.cssText=`
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: ${n?"0.42rem":"0.55rem"};
      width: min(94vw, ${i?"44rem":"34rem"});
    `;const u=document.createElement("button");u.textContent="あそぶ",u.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${n?"1.4rem":"2rem"};
      font-weight: 700;
      padding: ${n?"0.6rem 2rem":"1rem 3rem"};
      border: none;
      border-radius: 2rem;
      background: linear-gradient(135deg, #FF6B6B, #FFE66D);
      color: #333;
      cursor: pointer;
      touch-action: manipulation;
      box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
      transform: scale(1);
      transition: transform 0.08s ease-out;
    `,this.overlayButtonCleanups.add(M(u,{onActivate:()=>{this.ensureTitleAudioInitialized(!1);const d=this.saveManager.load(),C=St(d).startStage;this.sceneManager.requestTransition("stage",{stageNumber:C,totalScore:0,totalStarCount:0,launchSource:"campaign"})},onPressChange:d=>{u.style.transform=d?"scale(0.96)":"scale(1)"}}));const x=document.createElement("div");x.setAttribute("data-play-button-hint",""),x.textContent=s.buttonHint,x.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${n?"0.85rem":"1rem"};
      font-weight: 700;
      color: rgba(255, 255, 255, 0.88);
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
    `;const y=document.createElement("button");y.textContent="うちゅうで あそぶ",y.setAttribute("data-free-play-button",""),y.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${n?"1.05rem":"1.35rem"};
      font-weight: 900;
      padding: ${n?"0.55rem 1.6rem":"0.85rem 2.4rem"};
      border: none;
      border-radius: 2rem;
      background: linear-gradient(135deg, #7bd9ff, #b197fc);
      color: #1f2040;
      cursor: pointer;
      touch-action: manipulation;
      box-shadow: 0 4px 15px rgba(123, 217, 255, 0.35);
      transform: scale(1);
      transition: transform 0.08s ease-out;
    `,this.overlayButtonCleanups.add(M(y,{onActivate:()=>{this.ensureTitleAudioInitialized(!1),this.sceneManager.requestTransition("freePlay",{})},onPressChange:d=>{y.style.transform=d?"scale(0.96)":"scale(1)"}}));const p=document.createElement("div");p.setAttribute("data-title-secondary-actions",""),p.style.cssText=`
      display: grid;
      grid-template-columns: repeat(${i?3:2}, minmax(0, 1fr));
      gap: ${n?"0.45rem":"0.55rem"};
      width: 100%;
      align-items: stretch;
    `;const A=document.createElement("button");A.setAttribute("data-spaceship-customizer-button",""),A.textContent="うちゅうせんをかざろう",A.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${n?"0.9rem":"1.05rem"};
      font-weight: 900;
      padding: ${n?"0.55rem 0.65rem":"0.7rem 0.85rem"};
      min-width: 0;
      width: 100%;
      min-height: ${n?"48px":"56px"};
      border: 3px solid rgba(255, 255, 255, 0.92);
      border-radius: 1.7rem;
      background: rgba(8, 16, 52, 0.76);
      color: #fff;
      cursor: pointer;
      touch-action: manipulation;
      box-shadow: 0 8px 18px rgba(0, 0, 0, 0.26);
      transform: scale(1);
      transition: transform 0.08s ease-out;
    `,this.overlayButtonCleanups.add(M(A,{onActivate:()=>{const d=this.saveManager.load();this.spaceshipCustomizer.show({initialCustomization:d.spaceshipCustomization??Tt,onComplete:C=>{const P=this.saveManager.load();P.spaceshipCustomization=C,this.saveManager.save(P)}})},onPressChange:d=>{A.style.transform=d?"scale(0.96)":"scale(1)"}}));const w=document.createElement("button");w.setAttribute("data-stats-button",""),w.textContent="あそびの きろく",w.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${n?"0.9rem":"1.05rem"};
      font-weight: 900;
      padding: ${n?"0.55rem 0.65rem":"0.7rem 0.85rem"};
      min-width: 0;
      width: 100%;
      min-height: ${n?"48px":"56px"};
      border: 3px solid rgba(255, 230, 109, 0.85);
      border-radius: 1.7rem;
      background: rgba(12, 22, 72, 0.82);
      color: #fff;
      cursor: pointer;
      touch-action: manipulation;
      box-shadow: 0 8px 18px rgba(0, 0, 0, 0.26);
      transform: scale(1);
      transition: transform 0.08s ease-out;
    `,this.overlayButtonCleanups.add(M(w,{onActivate:()=>{this.ensureTitleAudioInitialized(!0),this.statsOverlay.show(this.saveManager.load().gameplayStats,()=>{})},onPressChange:d=>{w.style.transform=d?"scale(0.96)":"scale(1)"}}));const B=document.createElement("div");B.setAttribute("data-title-footer-actions",""),B.style.cssText=`
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: ${n?"0.45rem":"0.65rem"};
      width: min(94vw, 42rem);
      margin-top: ${n?"0.5rem":"0.8rem"};
      align-items: stretch;
    `;const T=document.createElement("button");T.textContent="あそびかた",T.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${n?"0.82rem":"1rem"};
      font-weight: 700;
      padding: ${n?"0.45rem 0.55rem":"0.55rem 0.8rem"};
      min-height: ${n?"42px":"48px"};
      min-width: 0;
      width: 100%;
      border: none;
      border-radius: 1.5rem;
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
      cursor: pointer;
      touch-action: manipulation;
      transform: scale(1);
      transition: transform 0.08s ease-out;
    `,this.overlayButtonCleanups.add(M(T,{onActivate:()=>{this.ensureTitleAudioInitialized(!0),this.tutorialOverlay.show(()=>{this.ensureTitleAudioInitialized(!0),this.tutorialOverlay.hide()})},onPressChange:d=>{T.style.transform=d?"scale(0.96)":"scale(1)"}}));const E=document.createElement("button");E.setAttribute("data-color-settings-button",""),E.textContent="みやすさ・しんどう",E.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${n?"0.82rem":"1rem"};
      font-weight: 700;
      padding: ${n?"0.45rem 0.55rem":"0.55rem 0.8rem"};
      min-height: ${n?"42px":"48px"};
      min-width: 0;
      width: 100%;
      border: 3px solid rgba(255, 255, 255, 0.92);
      border-radius: 1.5rem;
      background: rgba(8, 16, 52, 0.72);
      color: #fff;
      cursor: pointer;
      touch-action: manipulation;
      transform: scale(1);
      transition: transform 0.08s ease-out;
      white-space: nowrap;
    `,this.overlayButtonCleanups.add(M(E,{onActivate:()=>{this.ensureTitleAudioInitialized(!0),this.colorAccessibilitySettings.show({initialHighContrast:this.saveManager.load().colorAccessibility?.highContrast===!0,initialColorVisionSupportMode:this.saveManager.load().colorAccessibility?.colorVisionSupportMode??$,initialBGMVolume:this.saveManager.load().audioSettings?.bgmVolume??100,initialSFXVolume:this.saveManager.load().audioSettings?.sfxVolume??100,initialVibrationIntensity:this.saveManager.load().vibrationSettings?.intensity??"medium",initialMotionSensitivity:this.saveManager.load().colorAccessibility?.motionSensitivity??Z(),initialRestReminderEnabled:this.saveManager.load().restReminderSettings?.enabled??le,onToggle:d=>this.persistHighContrastSetting(d),onColorVisionSupportModeChange:d=>this.persistColorVisionSupportModeSetting(d),onBGMVolumeChange:d=>this.persistBGMVolumeSetting(d),onSFXVolumeChange:d=>this.persistSFXVolumeSetting(d),onVibrationIntensityChange:d=>this.persistVibrationIntensitySetting(d),onMotionSensitivityChange:d=>this.persistMotionSensitivitySetting(d),onRestReminderToggle:d=>this.persistRestReminderSetting(d)})},onPressChange:d=>{E.style.transform=d?"scale(0.96)":"scale(1)"}}));const S=document.createElement("button");if(S.textContent=Nt(e.unlockedPlanets.length,K.length),S.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${n?"0.82rem":"1rem"};
      font-weight: 700;
      padding: ${n?"0.45rem 0.55rem":"0.55rem 0.8rem"};
      min-height: ${n?"42px":"48px"};
      min-width: 0;
      width: 100%;
      border: none;
      border-radius: 1.5rem;
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
      cursor: pointer;
      touch-action: manipulation;
      white-space: nowrap;
      transform: scale(1);
      transition: transform 0.08s ease-out;
    `,this.encyclopediaBtn=S,this.overlayButtonCleanups.add(M(S,{onActivate:()=>{this.ensureTitleAudioInitialized(!0),this.openEncyclopedia()},onPressChange:d=>{S.style.transform=d?"scale(0.96)":"scale(1)"}})),r.appendChild(u),r.appendChild(y),r.appendChild(x),p.appendChild(A),p.appendChild(w),i){const d=document.createElement("button");d.setAttribute("data-reset-progress-button",""),d.textContent="さいしょから",d.style.cssText=`
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${n?"0.9rem":"1.05rem"};
        font-weight: 900;
        padding: ${n?"0.55rem 0.65rem":"0.7rem 0.85rem"};
        min-width: 0;
        width: 100%;
        min-height: ${n?"48px":"56px"};
        border: 2px solid rgba(255, 230, 109, 0.65);
        border-radius: 1.5rem;
        background: rgba(0, 0, 64, 0.32);
        color: #fff;
        cursor: pointer;
        touch-action: manipulation;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.24);
      `,d.addEventListener("pointerdown",C=>{C.stopPropagation(),this.ensureTitleAudioInitialized(!0),this.titleResetConfirmOverlay.show(()=>{this.saveManager.resetProgressPreservingSettings(),this.startCampaign(1)},()=>{})}),p.appendChild(d)}r.appendChild(p),B.append(S,E,T),this.overlay.appendChild(a),this.overlay.appendChild(o),this.overlay.appendChild(r),this.overlay.appendChild(B),t.appendChild(this.overlay),this.overlay.addEventListener("pointerdown",()=>{this.ensureTitleAudioInitialized(!0)},{once:!0})}ensureTitleAudioInitialized(t){!this.bgmPending&&this.audioManager.isInitialized()||(this.audioManager.initSync(),t&&this.bgmPending&&this.audioManager.playBGM(0),this.bgmPending=!1)}startCampaign(t){this.sceneManager.requestTransition("stage",{stageNumber:t,totalScore:0,totalStarCount:0,launchSource:"campaign"})}refreshEncyclopediaButtonLabel(){if(!this.encyclopediaBtn)return;const t=this.saveManager.load();this.encyclopediaBtn.textContent=Nt(t.unlockedPlanets.length,K.length)}async createCompanionParade(t){this.clearCompanionParade();const e=[...new Set(t)].reduce((h,c)=>{const m=ht(c);return m&&h.push(m),h},[]);if(e.length===0)return;const s=this.encyclopediaRequestToken,{createCompanionMesh:i}=await this.getTitleCompanionFactory();if(!this.isActive||this.encyclopediaRequestToken!==s)return;const n=new dt;n.name="title-companion-parade",n.position.set(0,1.35,-1.2),n.rotation.x=-.12;const a=Math.min(2.1,1.1+e.length*.18),o=Math.min(.45,.18+e.length*.02);e.forEach((h,c)=>{const m=i(h),f=c/e.length*Math.PI*2;m.position.set(Math.cos(f)*a,Math.sin(f)*o,Math.sin(f)*a*.45),m.rotation.y=Math.PI*.15-f,m.scale.setScalar(.6),n.add(m)}),this.companionParade=n,this.threeScene.add(n)}clearCompanionParade(){this.companionParade&&(this.companionParade.parent?.remove(this.companionParade),this.companionParade=null)}update(t){this.stars&&(this.stars.rotation.y+=t*.05),this.companionParade&&(this.companionParade.rotation.y+=t*.35)}exit(){this.isActive=!1,this.encyclopediaRequestToken+=1,this.companionParadeRequestToken+=1,this.isOpeningEncyclopedia=!1,this.tutorialOverlay.hide(),this.titleResetConfirmOverlay.hide(),this.colorAccessibilitySettings.hide(),this.spaceshipCustomizer.hide(),this.statsOverlay.hide(),this.encyclopediaOverlay?.hide(),this.loadingOverlay.hide(),this.loadFailureOverlay.hide(),this.audioManager.stopBGM(),this.bgmPending=!1,this.clearCompanionParade(),this.stars&&(this.stars.parent?.remove(this.stars),this.stars=null),this.clearCompanionParade();const t=Array.from(this.overlayButtonCleanups);this.overlayButtonCleanups.clear();for(const e of t)e();this.overlay&&(this.overlay.remove(),this.overlay=null),this.encyclopediaBtn=null,this.muteHandle&&(this.muteHandle.remove(),this.muteHandle=null)}getThreeScene(){return this.threeScene}getCamera(){const{width:t,height:e}=H(),s=t/e;return s!==this.lastAspect&&Number.isFinite(s)&&s>0&&(this.camera.aspect=s,this.camera.updateProjectionMatrix(),this.lastAspect=s),this.camera}}const Fs=Object.freeze(Object.defineProperty({__proto__:null,TitleScene:fs,__resetTitleSceneSharedAssetsForTest:ds,__titleSceneSharedAssetsForTest:us},Symbol.toStringTag,{value:"Module"}));class ys{overlayEl=null;activePressCleanups=new Set;show(t,e){if(this.overlayEl)return;const s=document.getElementById("ui-overlay");if(!s)return;this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-home-confirm-overlay",""),this.overlayEl.setAttribute("role","dialog"),this.overlayEl.setAttribute("aria-modal","true"),this.overlayEl.setAttribute("aria-label","ホームへ もどりますか"),this.overlayEl.style.cssText=`
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
    `,this.overlayEl.style.background="rgba(0, 0, 32, 0.92)";let i=!1;const n=()=>{i||(i=!0,this.hide(),e())},a=()=>{i||(i=!0,this.hide(),t())};this.overlayEl.addEventListener("pointerdown",r=>{r.target===this.overlayEl&&n()});const o=document.createElement("div");o.setAttribute("data-home-confirm-card",""),o.style.cssText=`
      display: flex;
      flex-direction: column;
      align-items: center;
      background: rgba(0, 0, 64, 0.85);
      border-radius: 1.6rem;
      padding: 1.6rem 1.4rem;
      max-width: min(90vw, 420px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45);
    `,o.addEventListener("pointerdown",r=>{r.stopPropagation()}),this.overlayEl.appendChild(o);const h=document.createElement("div");h.textContent="タイトルへ もどる？",h.style.cssText=`
      font-size: 1.8rem;
      font-weight: 900;
      text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
      margin-bottom: 1.2rem;
      text-align: center;
      padding: 0 0.6rem;
      white-space: nowrap;
    `,h.style.fontFamily="'Zen Maru Gothic', sans-serif",h.style.color="#FFD700",o.appendChild(h);const c=document.createElement("div");c.style.cssText=`
      display: flex;
      flex-direction: row;
      gap: 1rem;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
    `,o.appendChild(c);const m=`
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
    `,f=(r,u)=>{const x=M(r,{onActivate:u,onPressChange:y=>{r.style.transform=y?"scale(0.9)":"scale(1)"}});this.activePressCleanups.add(x)},b=document.createElement("button");b.setAttribute("data-home-confirm-back",""),b.setAttribute("aria-label","タイトルへ もどる"),b.textContent="🏠 タイトルへ もどる",b.style.cssText=m,b.style.fontFamily="'Zen Maru Gothic', sans-serif",b.style.background="rgba(255, 255, 255, 0.18)",b.style.color="#ffffff",b.style.minWidth="88px",b.style.minHeight="88px",b.style.touchAction="manipulation",b.style.transform="scale(1)",b.style.transition="transform 0.08s ease-out",b.style.whiteSpace="nowrap",f(b,a),c.appendChild(b);const g=document.createElement("button");g.setAttribute("data-home-confirm-continue",""),g.setAttribute("aria-label","つづける"),g.textContent="✋ つづける",g.style.cssText=m,g.style.fontFamily="'Zen Maru Gothic', sans-serif",g.style.background="linear-gradient(135deg, #FF6B6B, #FFE66D)",g.style.color="#FFD700",g.style.textShadow="0 1px 2px rgba(0, 0, 32, 0.6)",g.style.minWidth="88px",g.style.minHeight="88px",g.style.touchAction="manipulation",g.style.transform="scale(1)",g.style.transition="transform 0.08s ease-out",g.style.whiteSpace="nowrap",f(g,n),c.appendChild(g),s.appendChild(this.overlayEl)}hide(){if(this.overlayEl){const t=Array.from(this.activePressCleanups);this.activePressCleanups.clear();for(const e of t)e();this.overlayEl.remove(),this.overlayEl=null}}isVisible(){return this.overlayEl!==null}}class ne{overlayEl=null;activePressCleanups=new Set;show(t,e){if(this.overlayEl)return;const s=document.getElementById("ui-overlay")??document.body;this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-pause-overlay",""),this.overlayEl.setAttribute("role","dialog"),this.overlayEl.setAttribute("aria-modal","true"),this.overlayEl.setAttribute("aria-label","やすみちゅう"),this.overlayEl.style.cssText=`
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
    `,i.addEventListener("pointerdown",c=>{c.stopPropagation()}),this.overlayEl.appendChild(i);const n=document.createElement("div");n.textContent="ひとやすみ ちゅう",n.style.cssText=`
      font-size: clamp(1.8rem, 5vmin, 2.4rem);
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
    `,i.appendChild(n);const a=document.createElement("div");a.textContent="また じゅんびが できたら つづけよう",a.style.cssText=`
      font-size: clamp(1rem, 3.5vmin, 1.2rem);
      font-weight: 700;
      color: #ffffff;
      opacity: 0.92;
    `,i.appendChild(a);const o=document.createElement("div");o.style.cssText=`
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      justify-content: center;
      align-items: stretch;
      width: 100%;
    `,i.appendChild(o);const h=(c,m,f,b,g,r)=>{const u=document.createElement("button");u.setAttribute(m,""),u.setAttribute("aria-label",f),u.textContent=c,u.style.cssText=`
        flex: 1 1 140px;
        padding: 1rem 1.2rem;
        border: none;
        border-radius: 1.6rem;
        background: ${b};
        color: ${g};
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: clamp(1.1rem, 3.6vmin, 1.4rem);
        font-weight: 900;
        cursor: pointer;
        touch-action: manipulation;
        box-shadow: 0 4px 18px rgba(0, 0, 0, 0.35);
        transform: scale(1);
        transition: transform 0.08s ease-out;
        white-space: nowrap;
      `,u.style.minWidth="140px",u.style.minHeight="88px";const x=M(u,{onActivate:()=>{this.hide(),r()},onPressChange:y=>{u.style.transform=y?"scale(0.94)":"scale(1)"}});return this.activePressCleanups.add(x),u};o.appendChild(h("▶ つづける","data-pause-continue","つづける","linear-gradient(135deg, #FF6B6B, #FFE66D)","#1b1f52",t)),o.appendChild(h("🏠 おうちへ","data-pause-home","おうちへ","rgba(255, 255, 255, 0.18)","#ffffff",e)),s.appendChild(this.overlayEl)}hide(){if(!this.overlayEl)return;const t=Array.from(this.activePressCleanups);this.activePressCleanups.clear();for(const e of t)e();this.overlayEl.remove(),this.overlayEl=null}dispose(){this.hide()}isVisible(){return this.overlayEl!==null}}function ae(l){const t=l>=500;return{worldText:`${t?"🌈":"⬢"} +${l}`,hudText:`+${l}`,kind:t?"bonus":"normal",color:t?"#ff9cf7":"#ffe066",shadow:t?"rgba(255, 156, 247, 0.55)":"rgba(255, 214, 102, 0.55)"}}class j{static STYLE_ID="score-popup-animations";static POOL_SIZE=6;static POPUP_LIFETIME_MS=720;root=null;pool=[];highContrastMode=!1;nextRecycleIndex=0;scratch=new q;setHighContrastMode(t){this.highContrastMode=t}show(t,e,s){const i=ae(t);this.showPopup({text:i.worldText,kind:i.kind,color:i.color,shadow:i.shadow},e,s)}showLabel(t,e,s,i="normal"){const n=i==="shooting-star"||i==="special-star"||i==="monthly-encounter"?{text:t,kind:i,color:"rgb(255, 244, 179)",shadow:"rgba(191, 231, 255, 0.75)"}:{text:t,kind:i,color:"#ffe066",shadow:"rgba(255, 214, 102, 0.55)"};this.showPopup(n,e,s)}showPopup(t,e,s){const i=this.ensureRoot();if(!i||(this.scratch.set(e.x,e.y,e.z).project(s),!Number.isFinite(this.scratch.x)||!Number.isFinite(this.scratch.y)||!Number.isFinite(this.scratch.z)))return;const n=Math.round((this.scratch.x*.5+.5)*1e5)/1e3,a=Math.round((-this.scratch.y*.5+.5)*1e5)/1e3,o=this.acquireEntry(i),h=o.useAltAnimation?"scorePopupFloatB":"scorePopupFloatA";o.useAltAnimation=!o.useAltAnimation,o.currentAnimationName=h,o.el.textContent=t.text,o.el.style.left=`${n}%`,o.el.style.top=`${a}%`,o.el.style.color=t.color,o.el.style.textShadow=`0 2px 10px ${t.shadow}`,o.el.style.background=this.highContrastMode?t.kind==="bonus"||t.kind==="shooting-star"||t.kind==="special-star"||t.kind==="monthly-encounter"?"rgba(13, 18, 38, 0.92)":"rgba(0, 0, 0, 0.82)":"transparent",o.el.style.border=this.highContrastMode?t.kind==="bonus"||t.kind==="shooting-star"||t.kind==="special-star"||t.kind==="monthly-encounter"?"3px solid rgba(255, 255, 255, 0.95)":"2px dashed rgba(255, 255, 255, 0.95)":"none",o.el.style.borderRadius=this.highContrastMode?"999px":"0",o.el.style.padding=this.highContrastMode?"0.18rem 0.55rem":"0",o.el.style.setProperty("-webkit-text-stroke",this.highContrastMode?"0.6px #061126":"0"),o.el.setAttribute("data-score-popup-kind",t.kind),o.el.style.visibility="visible",o.el.style.opacity="1",o.el.style.animationName=h,o.el.removeAttribute("data-score-popup-active"),o.el.setAttribute("data-score-popup-active",""),o.active=!0;const c=()=>{this.releaseEntry(o)};o.onAnimationEnd=m=>{m.animationName===o.currentAnimationName&&c()},o.el.addEventListener("animationend",o.onAnimationEnd),o.timeoutId=window.setTimeout(c,j.POPUP_LIFETIME_MS)}dispose(){for(const t of this.pool)this.clearEntry(t),t.el.remove();this.pool=[],this.root?.remove(),this.root=null,this.nextRecycleIndex=0}ensureRoot(){const t=document.getElementById("ui-overlay");return t?(this.root&&(this.root.parentElement!==t||!this.root.isConnected)&&this.dispose(),this.root?this.root:(this.injectStyles(),this.root=document.createElement("div"),this.root.setAttribute("data-score-popup-root",""),this.root.style.position="absolute",this.root.style.inset="0",this.root.style.overflow="hidden",this.root.style.pointerEvents="none",this.root.style.contain="layout style paint",t.appendChild(this.root),this.root)):null}acquireEntry(t){if(this.pool.length<j.POOL_SIZE){const s=this.createEntry();return this.pool.push(s),t.appendChild(s.el),s}const e=this.pool.find(s=>!s.active)??this.pool[this.nextRecycleIndex++%this.pool.length];return this.clearEntry(e),e}createEntry(){const t=document.createElement("div");return t.setAttribute("data-score-popup",""),t.style.position="absolute",t.style.transform="translate3d(-50%, -50%, 0)",t.style.fontFamily="'Zen Maru Gothic', sans-serif",t.style.fontSize="clamp(1rem, 3.5vmin, 1.4rem)",t.style.fontWeight="900",t.style.lineHeight="1",t.style.whiteSpace="nowrap",t.style.pointerEvents="none",t.style.willChange="transform, opacity",t.style.visibility="hidden",t.style.opacity="0",t.style.animationDuration=`${j.POPUP_LIFETIME_MS}ms`,t.style.animationTimingFunction="ease-out",t.style.animationIterationCount="1",{el:t,active:!1,timeoutId:null,onAnimationEnd:null,useAltAnimation:!1,currentAnimationName:"none"}}releaseEntry(t){this.clearEntry(t),t.el.style.visibility="hidden",t.el.style.opacity="0"}clearEntry(t){t.active=!1,t.currentAnimationName="none",t.el.removeAttribute("data-score-popup-active"),t.el.removeAttribute("data-score-popup-kind"),t.el.style.animationName="none",t.timeoutId!==null&&(window.clearTimeout(t.timeoutId),t.timeoutId=null),t.onAnimationEnd&&(t.el.removeEventListener("animationend",t.onAnimationEnd),t.onAnimationEnd=null)}injectStyles(){if(document.getElementById(j.STYLE_ID))return;const t=document.createElement("style");t.id=j.STYLE_ID,t.textContent=`
      @keyframes scorePopupFloatA {
        0% {
          opacity: 0;
          transform: translate3d(-50%, -32%, 0) scale(0.82);
        }
        18% {
          opacity: 1;
          transform: translate3d(-50%, -54%, 0) scale(1.16);
        }
        34% {
          opacity: 1;
          transform: translate3d(-50%, -48%, 0) scale(0.96);
        }
        52% {
          opacity: 1;
          transform: translate3d(-50%, -62%, 0) scale(1.05);
        }
        100% {
          opacity: 0;
          transform: translate3d(-50%, -105%, 0) scale(1.02);
        }
      }
      @keyframes scorePopupFloatB {
        0% {
          opacity: 0;
          transform: translate3d(-50%, -32%, 0) scale(0.82);
        }
        18% {
          opacity: 1;
          transform: translate3d(-50%, -54%, 0) scale(1.16);
        }
        34% {
          opacity: 1;
          transform: translate3d(-48%, -48%, 0) scale(0.96);
        }
        72% {
          opacity: 1;
          transform: translate3d(-43%, -84%, 0) scale(1.05);
        }
        100% {
          opacity: 0;
          transform: translate3d(-38%, -105%, 0) scale(1.03);
        }
      }
    `,document.head.appendChild(t)}}class bs{pendingTimeouts=new Set;container=null;stageNameEl=null;assistMessageEl=null;politeLiveRegionEl=null;assertiveLiveRegionEl=null;scoreEl=null;scoreGainEl=null;starCountEl=null;bestStarContainerEl=null;bestStarCountEl=null;boostButton=null;boostHintEl=null;homeButton=null;pauseButton=null;homeConfirmOverlay=new ys;pauseOverlay=new ne;muteButton=null;muteHandle=null;cooldownContainer=null;cooldownBar=null;stageProgressContainer=null;stageProgressTrack=null;stageProgressFill=null;stageProgressGoalEl=null;onBoostCallback=null;onBoostDeniedCallback=null;onHomeCallback=null;onHomeConfirmOpenCallback=null;onHomeConfirmCancelCallback=null;onPauseCallback=null;onPauseOpenCallback=null;onPauseResumeCallback=null;onMuteCallback=null;muted=!1;highContrastMode=!1;boostLocked=!1;pauseEnabled=!0;pauseButtonCleanup=null;lastCooldownProgress=1;lastCooldownPct=-1;lastReadyState=null;lastCooldownBarBoxShadow=null;lastBoostButtonAriaDisabled=null;lastBoostReadyRingVisible=null;boostButtonStyleCache={opacity:null,filter:null,animation:null,transform:null};lastPauseButtonAriaDisabled=null;pauseButtonStyleCache={opacity:null,filter:null,cursor:null,transform:null};lastStageProgressPct=-1;lastStageProgressComplete=null;lastScore=-1;lastStarCount=-1;displayedScore=0;scoreAnimationToken=0;scoreGainUseAltAnimation=!1;scoreGainAnimationEndHandler=null;bestStarCount=0;lastBestStarCount=-1;bestStarPulsed=!1;liveRegionWriteNonce=0;lastAnnouncedProgressThreshold=0;show(t,e){const s=document.getElementById("hud");if(!s)return;s.style.zIndex="10";const i=window.innerHeight<=500;this.homeButton=document.createElement("button"),this.homeButton.textContent="🏠",this.homeButton.setAttribute("aria-label","ホームへ もどる"),this.homeButton.style.position="absolute",this.homeButton.style.top="0.8rem",this.homeButton.style.left="1rem",this.homeButton.style.fontSize=i?"clamp(1.1rem, 3.5vmin, 1.4rem)":"clamp(1.4rem, 4vmin, 1.8rem)",this.homeButton.style.background="rgba(255, 255, 255, 0.15)",this.homeButton.style.border="none",this.homeButton.style.borderRadius="50%",this.homeButton.style.width=i?"2.4rem":"3rem",this.homeButton.style.height=i?"2.4rem":"3rem",this.homeButton.style.display="flex",this.homeButton.style.alignItems="center",this.homeButton.style.justifyContent="center",this.homeButton.style.cursor="pointer",this.homeButton.style.pointerEvents="auto",this.homeButton.style.touchAction="manipulation",this.homeButton.style.transform="scale(1)",this.homeButton.style.transition="transform 0.08s ease-out";const n=()=>{this.homeButton&&(this.homeButton.style.transform="scale(1)")};this.homeButton.addEventListener("pointerdown",h=>{h.stopPropagation(),this.homeButton&&(this.homeButton.style.transform="scale(0.9)"),!this.homeConfirmOverlay.isVisible()&&document.getElementById("ui-overlay")&&(this.onHomeConfirmOpenCallback?.(),this.homeConfirmOverlay.show(()=>this.onHomeCallback?.(),()=>this.onHomeConfirmCancelCallback?.()))}),this.homeButton.addEventListener("pointerup",n),this.homeButton.addEventListener("pointercancel",n),this.homeButton.addEventListener("pointerleave",n),s.appendChild(this.homeButton),t&&(this.stageNameEl=document.createElement("div"),this.stageNameEl.textContent=t,this.stageNameEl.style.cssText=`
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
    `;const a=document.createElement("div");a.style.position="relative",a.style.display="inline-flex",a.style.alignItems="baseline",a.style.gap="0.08rem",this.scoreEl=document.createElement("span"),this.scoreEl.setAttribute("data-hud-score-value",""),a.textContent="スコア: ",this.scoreEl.textContent="0",a.appendChild(this.scoreEl),this.scoreGainEl=document.createElement("div"),this.scoreGainEl.setAttribute("data-hud-score-gain",""),this.scoreGainEl.style.position="absolute",this.scoreGainEl.style.top="-0.95rem",this.scoreGainEl.style.right="-0.35rem",this.scoreGainEl.style.fontSize="0.68em",this.scoreGainEl.style.fontWeight="900",this.scoreGainEl.style.lineHeight="1",this.scoreGainEl.style.whiteSpace="nowrap",this.scoreGainEl.style.pointerEvents="none",this.scoreGainEl.style.visibility="hidden",this.scoreGainEl.style.opacity="0",this.scoreGainEl.style.willChange="transform, opacity",this.scoreGainEl.style.animationDuration="560ms",this.scoreGainEl.style.animationTimingFunction="ease-out",this.scoreGainEl.style.animationIterationCount="1",a.appendChild(this.scoreGainEl);const o=document.createElement("div");o.textContent="⭐ ",this.starCountEl=document.createElement("span"),this.starCountEl.textContent="0",o.appendChild(this.starCountEl),this.bestStarContainerEl=document.createElement("span"),this.bestStarContainerEl.setAttribute("data-hud-best-star",""),this.bestStarContainerEl.style.cssText=`
      margin-left: 0.6rem;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 0.6em;
      font-weight: 700;
      color: #9ec5ff;
      opacity: 0.7;
      display: none;
      vertical-align: middle;
      transform-origin: center;
    `,this.bestStarContainerEl.textContent="ベスト ⭐",this.bestStarCountEl=document.createElement("span"),this.bestStarCountEl.textContent="0",this.bestStarContainerEl.appendChild(this.bestStarCountEl),o.appendChild(this.bestStarContainerEl),this.container.appendChild(a),this.container.appendChild(o),s.appendChild(this.container),this.createBoostButton(),this.createMuteButton(),this.applyColorAccessibilityState(),this.createLiveRegions(s)}createStageProgress(t,e){const s=this.toCssColor(e??16766720),i=document.createElement("div");i.setAttribute("data-stage-progress-container",""),i.setAttribute("role","progressbar"),i.setAttribute("aria-label","ゴールまでの すすみ"),i.setAttribute("aria-valuemin","0"),i.setAttribute("aria-valuemax","100"),i.setAttribute("aria-valuenow","0"),i.setAttribute("aria-valuetext","ゴールまで あと 100%"),i.style.position="relative",i.style.display="flex",i.style.alignItems="center",i.style.justifyContent="center",i.style.gap="0.4rem",i.style.margin="0 auto 0.4rem",i.style.width=window.innerHeight<=500?"clamp(100px, 24vmin, 180px)":"clamp(160px, 32vmin, 280px)",i.style.pointerEvents="none",i.style.fontFamily="'Zen Maru Gothic', sans-serif";const n=document.createElement("div");n.setAttribute("data-stage-progress-ship",""),n.textContent="🚀",n.style.fontSize="clamp(0.9rem, 2.4vmin, 1.1rem)",n.style.lineHeight="1",n.style.pointerEvents="none";const a=document.createElement("div");a.setAttribute("data-stage-progress-track",""),a.style.flex="1",a.style.height="14px",a.style.background=this.highContrastMode?"rgba(6, 12, 28, 0.94)":"rgba(255, 255, 255, 0.18)",a.style.borderRadius="7px",a.style.overflow="hidden",a.style.boxShadow="inset 0 2px 6px rgba(0, 0, 0, 0.35)",a.style.border=this.highContrastMode?"3px solid rgba(255, 255, 255, 0.92)":"none";const o=document.createElement("div");o.setAttribute("data-stage-progress-fill",""),o.style.height="100%",o.style.width="0%",o.style.borderRadius="7px",o.style.background=this.highContrastMode?`repeating-linear-gradient(90deg, #ffffff 0 10px, #00ddff 10px 18px, ${s} 18px 30px)`:`linear-gradient(90deg, #00ddff, ${s})`,o.style.transition="width 0.15s linear",o.setAttribute("data-stage-progress-color",s),a.appendChild(o);const h=document.createElement("div");h.setAttribute("data-stage-progress-goal",""),h.textContent="🪐",h.style.fontSize="clamp(0.9rem, 2.4vmin, 1.1rem)",h.style.lineHeight="1",h.style.pointerEvents="none",h.style.textShadow=`0 0 8px ${s}`,i.appendChild(n),i.appendChild(a),i.appendChild(h),t.appendChild(i),this.stageProgressContainer=i,this.stageProgressTrack=a,this.stageProgressFill=o,this.stageProgressGoalEl=h}toCssColor(t){return`#${Math.max(0,Math.min(16777215,Math.floor(t))).toString(16).padStart(6,"0")}`}createMuteButton(){const t=document.getElementById("hud");t&&(this.muteHandle=It({initialMuted:this.muted,container:t,onToggle:()=>this.onMuteCallback?.()}),this.muteButton=this.muteHandle.element)}createPauseButton(){const t=document.getElementById("hud");if(!t)return;const e=window.innerHeight<=500;this.pauseButton=document.createElement("button"),this.pauseButton.textContent="✋ やすむ",this.pauseButton.setAttribute("aria-label","やすむ"),this.pauseButton.style.position="absolute",this.pauseButton.style.top="0.8rem",this.pauseButton.style.left=e?"4rem":"4.7rem",this.pauseButton.style.fontFamily="'Zen Maru Gothic', sans-serif",this.pauseButton.style.fontSize=e?"clamp(0.9rem, 3.2vmin, 1rem)":"clamp(1rem, 3.5vmin, 1.15rem)",this.pauseButton.style.fontWeight="900",this.pauseButton.style.padding=e?"0.45rem 0.9rem":"0.7rem 1.2rem",this.pauseButton.style.border="none",this.pauseButton.style.borderRadius="999px",this.pauseButton.style.background="rgba(255, 255, 255, 0.16)",this.pauseButton.style.color="#fff",this.pauseButton.style.cursor="pointer",this.pauseButton.style.pointerEvents="auto",this.pauseButton.style.touchAction="manipulation",this.pauseButton.style.boxShadow="0 4px 14px rgba(0, 0, 0, 0.2)",this.pauseButton.style.transform="scale(1)",this.pauseButton.style.transition="transform 0.08s ease-out, opacity 0.12s ease-out",this.pauseButton.style.minHeight=e?"2.4rem":"3rem",this.pauseButton.style.minWidth=e?"5.6rem":"7rem",this.pauseButtonCleanup=M(this.pauseButton,{onActivate:()=>this.onPauseCallback?.(),canActivate:()=>this.pauseEnabled,onPressChange:s=>{this.writePauseButtonStyle("transform",s?"scale(0.95)":"scale(1)")}}),t.appendChild(this.pauseButton),this.applyPauseButtonState()}createBoostButton(){const t=document.getElementById("ui-overlay");if(!t)return;this.injectBoostAnimations(),this.boostButton=document.createElement("button"),this.boostButton.textContent="🚀 ブースト!",this.boostButton.setAttribute("aria-label","ブースト"),this.boostButton.setAttribute("aria-disabled","false");const e=window.innerHeight<=500;this.boostButton.style.position="absolute",this.boostButton.style.bottom=e?"1rem":"2rem",this.boostButton.style.right=e?"1rem":"2rem",this.boostButton.style.fontFamily="'Zen Maru Gothic', sans-serif",this.boostButton.style.fontSize=e?"clamp(0.85rem, 2.8vmin, 1.05rem)":"clamp(1rem, 3.5vmin, 1.3rem)",this.boostButton.style.fontWeight="700",this.boostButton.style.padding=e?"0.5rem 1rem":"0.8rem 1.5rem",this.boostButton.style.border="none",this.boostButton.style.borderRadius="2rem",this.boostButton.style.background="linear-gradient(135deg, #FF6B6B, #FFD93D, #6BCB77)",this.boostButton.style.color="#fff",this.boostButton.style.cursor="pointer",this.boostButton.style.touchAction="manipulation",this.boostButton.style.pointerEvents="auto",this.boostButton.style.boxShadow="0 4px 15px rgba(255, 107, 107, 0.4)",this.boostButton.style.animation="boostBtnPulse 2s ease-in-out infinite",this.boostButton.addEventListener("pointerdown",s=>{s.stopPropagation();const i=this.boostButton;if(i&&!this.boostLocked){if(this.lastCooldownProgress<1){if(i.hasAttribute("data-boost-shake"))return;i.setAttribute("data-boost-shake",""),this.registerTimeout(()=>{i.removeAttribute("data-boost-shake")},250),this.onBoostDeniedCallback?.();return}this.writeBoostButtonStyle("transform","scale(0.9)"),this.registerTimeout(()=>{this.writeBoostButtonStyle("transform","scale(1.0)")},150),this.onBoostCallback?.()}}),t.appendChild(this.boostButton),this.boostHintEl=document.createElement("div"),this.boostHintEl.setAttribute("data-boost-hint",""),this.boostHintEl.setAttribute("aria-hidden","true"),this.boostHintEl.style.cssText=`
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
      @keyframes hudScoreGainFloatA {
        0%   { opacity: 0; transform: translate3d(8%, 12%, 0) scale(0.82); }
        22%  { opacity: 1; transform: translate3d(12%, -10%, 0) scale(1.12); }
        58%  { opacity: 1; transform: translate3d(10%, -36%, 0) scale(0.98); }
        100% { opacity: 0; transform: translate3d(8%, -72%, 0) scale(1.03); }
      }
      @keyframes hudScoreGainFloatB {
        0%   { opacity: 0; transform: translate3d(6%, 12%, 0) scale(0.82); }
        22%  { opacity: 1; transform: translate3d(2%, -10%, 0) scale(1.12); }
        58%  { opacity: 1; transform: translate3d(-2%, -36%, 0) scale(0.98); }
        100% { opacity: 0; transform: translate3d(-6%, -72%, 0) scale(1.03); }
      }
      span[data-hud-count-pop] {
        animation: hudCountPop 0.35s ease-out 1;
        display: inline-block;
        transform-origin: center;
      }
    `,document.head.appendChild(t)}setBoostCallback(t){this.onBoostCallback=t}setBoostDeniedCallback(t){this.onBoostDeniedCallback=t}setBoostLocked(t){this.boostLocked=t,this.applyBoostButtonState()}setHomeCallback(t){this.onHomeCallback=t}setHomeConfirmOpenCallback(t){this.onHomeConfirmOpenCallback=t}setHomeConfirmCancelCallback(t){this.onHomeConfirmCancelCallback=t}setPauseCallback(t){this.onPauseCallback=t}setPauseEnabled(t){this.pauseEnabled=t,this.applyPauseButtonState()}setMuteCallback(t){this.onMuteCallback=t}setPauseOpenCallback(t){this.onPauseOpenCallback=t}setPauseResumeCallback(t){this.onPauseResumeCallback=t}setMuteState(t){this.muted=t,this.muteHandle?.setMuted(t)}setHighContrastMode(t){this.highContrastMode=t,this.applyColorAccessibilityState()}applyColorAccessibilityState(){if(this.stageNameEl&&(this.stageNameEl.style.color=this.highContrastMode?"#fff58f":"#FFD700",this.stageNameEl.style.textShadow=this.highContrastMode?"0 0 0 #000, 0 2px 8px rgba(0, 0, 0, 0.9), 0 0 20px rgba(255, 255, 255, 0.25)":"0 2px 8px rgba(0, 0, 0, 0.7)"),this.assistMessageEl&&(this.assistMessageEl.style.background=this.highContrastMode?"rgba(5, 10, 28, 0.96)":"rgba(255, 255, 255, 0.14)",this.assistMessageEl.style.border=this.highContrastMode?"3px solid rgba(255, 255, 255, 0.95)":"none",this.assistMessageEl.style.color=this.highContrastMode?"#ffffff":"#fff7bf"),this.bestStarContainerEl&&(this.bestStarContainerEl.style.color=this.highContrastMode?"#e6f4ff":"#9ec5ff",this.bestStarContainerEl.style.opacity=this.highContrastMode?"1":"0.7"),this.stageProgressTrack&&(this.stageProgressTrack.style.background=this.highContrastMode?"rgba(6, 12, 28, 0.94)":"rgba(255, 255, 255, 0.18)",this.stageProgressTrack.style.border=this.highContrastMode?"3px solid rgba(255, 255, 255, 0.92)":"none"),this.stageProgressFill){const t=this.stageProgressFill.getAttribute("data-stage-progress-color")??"#ffd700";this.stageProgressFill.style.background=this.highContrastMode?`repeating-linear-gradient(90deg, #ffffff 0 10px, #00ddff 10px 18px, ${t} 18px 30px)`:`linear-gradient(90deg, #00ddff, ${t})`}if(this.stageProgressGoalEl){const t=this.stageProgressFill?.getAttribute("data-stage-progress-color")??"#ffd700";this.stageProgressGoalEl.style.textShadow=this.highContrastMode?`0 0 0 #000, 0 0 12px #ffffff, 0 0 18px ${t}`:`0 0 8px ${t}`}this.boostButton&&(this.boostButton.style.border=this.highContrastMode?"4px solid rgba(255, 255, 255, 0.95)":"none",this.boostButton.style.background=this.highContrastMode?"linear-gradient(135deg, #fff27a, #76f0ff, #6BCB77)":"linear-gradient(135deg, #FF6B6B, #FFD93D, #6BCB77)",this.boostButton.style.color=this.highContrastMode?"#0b1535":"#fff"),this.cooldownContainer&&(this.cooldownContainer.style.background=this.highContrastMode?"rgba(6, 12, 28, 0.94)":"rgba(255, 255, 255, 0.2)",this.cooldownContainer.style.border=this.highContrastMode?"2px solid rgba(255, 255, 255, 0.95)":"none",this.cooldownContainer.style.height=this.highContrastMode?"10px":"6px"),this.cooldownBar&&(this.cooldownBar.style.background=this.highContrastMode?"repeating-linear-gradient(90deg, #ffffff 0 10px, #00ddff 10px 18px, #00ff88 18px 30px)":"linear-gradient(90deg, #00ddff, #00ff88)"),this.applyBoostButtonState()}showAssistMessage(t){this.assistMessageEl&&(this.assistMessageEl.textContent=t,this.assistMessageEl.style.display="block",this.announcePolite(t))}hideAssistMessage(){this.assistMessageEl&&(this.assistMessageEl.style.display="none",this.assistMessageEl.textContent="")}showBoostHint(t){!this.boostHintEl||!this.boostButton||!this.cooldownContainer||(this.boostHintEl.textContent=t,this.boostHintEl.style.display="block",this.boostHintEl.setAttribute("data-boost-hint-visible",""),this.boostHintEl.setAttribute("aria-hidden","false"),this.boostButton.setAttribute("data-boost-hint-active",""),this.cooldownContainer.setAttribute("data-boost-hint-active",""))}hideBoostHint(){this.boostHintEl&&(this.boostHintEl.style.display="none",this.boostHintEl.textContent="",this.boostHintEl.removeAttribute("data-boost-hint-visible"),this.boostHintEl.setAttribute("aria-hidden","true")),this.boostButton?.removeAttribute("data-boost-hint-active"),this.cooldownContainer?.removeAttribute("data-boost-hint-active")}isMuted(){return this.muted}update(t,e){if(this.scoreEl&&t!==this.lastScore){const s=this.lastScore;this.setDisplayedScore(t),this.lastScore=t,s!==-1&&t>s&&this.flashCount(this.scoreEl)}if(this.starCountEl&&e!==this.lastStarCount){const s=this.lastStarCount;this.starCountEl.textContent=String(e),this.lastStarCount=e,s!==-1&&e>s&&(this.flashCount(this.starCountEl),this.announcePolite(`ほし ${e}こ ゲット！`))}this.bestStarCount>0&&!this.bestStarPulsed&&e>this.bestStarCount&&this.bestStarContainerEl&&this.bestStarContainerEl.style.display!=="none"&&(this.bestStarPulsed=!0,this.flashCount(this.bestStarContainerEl))}animateScoreGain(t,e){if(!this.scoreEl)return;const s=Math.max(0,Math.round(e)),i=Math.max(0,Math.round(t));if(i<=0){this.setDisplayedScore(s),this.lastScore=s;return}this.lastScore=s,this.flashCount(this.scoreEl),this.showScoreGainPopup(i),this.animateScoreValue(s)}setBestStarCount(t){const e=Number.isInteger(t)&&t>0?t:0;this.bestStarCount=e,this.bestStarPulsed=!1,!(!this.bestStarContainerEl||!this.bestStarCountEl)&&(e>0?(this.lastBestStarCount!==e&&(this.bestStarCountEl.textContent=String(e),this.lastBestStarCount=e),this.bestStarContainerEl.style.display=""):(this.bestStarContainerEl.style.display="none",this.lastBestStarCount=-1))}flashCount(t){if(t.hasAttribute("data-hud-count-pop"))return;t.setAttribute("data-hud-count-pop","");let e=!1;const s=()=>{e||(e=!0,t.removeAttribute("data-hud-count-pop"),t.removeEventListener("animationend",i))},i=n=>{n.animationName==="hudCountPop"&&s()};t.addEventListener("animationend",i),this.registerTimeout(s,500)}setDisplayedScore(t){this.scoreEl&&this.displayedScore!==t&&(this.scoreEl.textContent=String(t)),this.displayedScore=t}animateScoreValue(t){const e=this.displayedScore;if(t<=e){this.setDisplayedScore(t);return}this.scoreAnimationToken+=1;const s=this.scoreAnimationToken,i=t-e,n=Math.min(7,Math.max(4,Math.ceil(i/120))),a=40;for(let o=1;o<=n;o+=1)this.registerTimeout(()=>{if(s!==this.scoreAnimationToken)return;const h=o/n,c=1-(1-h)*(1-h),m=o===n?t:Math.min(t,e+Math.round(i*c));this.setDisplayedScore(m)},o*a)}showScoreGainPopup(t){const e=this.scoreGainEl;if(!e)return;const s=ae(t),i=this.scoreGainUseAltAnimation?"hudScoreGainFloatB":"hudScoreGainFloatA";this.scoreGainUseAltAnimation=!this.scoreGainUseAltAnimation,this.scoreGainAnimationEndHandler&&(e.removeEventListener("animationend",this.scoreGainAnimationEndHandler),this.scoreGainAnimationEndHandler=null),e.textContent=s.hudText,e.style.color=s.color,e.style.textShadow=`0 2px 10px ${s.shadow}`,e.style.animationName=i,e.style.visibility="visible",e.style.opacity="1",e.setAttribute("data-hud-score-gain-kind",s.kind),e.removeAttribute("data-hud-score-gain-active"),e.setAttribute("data-hud-score-gain-active","");let n=!1;const a=()=>{n||(n=!0,e.removeAttribute("data-hud-score-gain-active"),e.style.visibility="hidden",e.style.opacity="0",e.style.animationName="none",e.removeEventListener("animationend",o),this.scoreGainAnimationEndHandler===o&&(this.scoreGainAnimationEndHandler=null))},o=h=>{h.animationName===i&&a()};this.scoreGainAnimationEndHandler=o,e.addEventListener("animationend",o),this.registerTimeout(a,620)}registerTimeout(t,e){let s=0;return s=window.setTimeout(()=>{this.pendingTimeouts.delete(s),t()},e),this.pendingTimeouts.add(s),s}clearPendingTimeouts(){for(const t of this.pendingTimeouts)window.clearTimeout(t);this.pendingTimeouts.clear()}updateCooldown(t){if(!this.cooldownBar||!this.boostButton)return;const e=Math.max(0,Math.min(1,t)),s=Math.round(e*100);s!==this.lastCooldownPct&&(this.cooldownBar.style.width=`${s}%`,this.lastCooldownPct=s),this.lastCooldownProgress=e;const i=e>=1;i!==this.lastReadyState&&(this.lastReadyState=i,this.applyBoostButtonState())}updateStageProgress(t){if(!this.stageProgressContainer||!this.stageProgressFill)return;const e=Math.max(0,Math.min(1,t)),s=Math.round(e*100);s!==this.lastStageProgressPct&&(this.stageProgressFill.style.width=`${s}%`,this.stageProgressContainer.setAttribute("aria-valuenow",String(s)),this.stageProgressContainer.setAttribute("aria-valuetext",`ゴールまで あと ${100-s}%`),this.lastStageProgressPct=s),this.announceStageProgressMilestone(s);const i=e>=1;i!==this.lastStageProgressComplete&&(i?(this.stageProgressContainer.setAttribute("data-stage-progress-complete",""),this.flashStageGoal()):this.stageProgressContainer.removeAttribute("data-stage-progress-complete"),this.lastStageProgressComplete=i)}flashStageGoal(){const t=this.stageProgressGoalEl;if(!t||t.hasAttribute("data-stage-goal-flash"))return;t.setAttribute("data-stage-goal-flash","");let e=!1;const s=()=>{e||(e=!0,t.removeAttribute("data-stage-goal-flash"),t.removeEventListener("animationend",i))},i=n=>{n.animationName==="stageGoalFlash"&&s()};t.addEventListener("animationend",i),this.registerTimeout(s,500)}flashBoostReady(){const t=this.boostButton;if(!t||t.hasAttribute("data-boost-ready-flash"))return;this.announcePolite("ブースト じゅんび OK！"),t.setAttribute("data-boost-ready-flash","");let e=!1;const s=()=>{e||(e=!0,t.removeAttribute("data-boost-ready-flash"),t.removeEventListener("animationend",i),this.lastReadyState===!0&&this.writeBoostButtonStyle("animation","boostBtnPulse 2s ease-in-out infinite, boostReadyRing 1.15s ease-in-out infinite"))},i=n=>{n.animationName==="boostBtnReadyFlash"&&s()};t.addEventListener("animationend",i),this.registerTimeout(s,500)}clearBoostReadyFlash(){this.boostButton?.hasAttribute("data-boost-ready-flash")&&this.boostButton.removeAttribute("data-boost-ready-flash")}announceMeteoriteHit(){this.announceAssertive("いんせきに ぶつかった！ シールド かいふくちゅう")}announceStageClear(t,e=!1,s=!1){const i=[`ステージ クリア！ ほし ${t}こ あつめたよ！`];s&&i.push("じこベスト こうしん！"),e&&i.push("あたらしい なかまも みつけたよ！"),this.announceAssertive(i.join(" "))}applyBoostButtonState(){if(!this.cooldownBar||!this.boostButton)return;const e=this.lastCooldownProgress>=1&&!this.boostLocked;this.setCooldownBarBoxShadow(e?this.highContrastMode?"0 0 0 2px rgba(255, 255, 255, 0.7), 0 0 14px #00ff88":"0 0 10px #00ff88":"none"),this.writeBoostButtonStyle("opacity",e?"1":"0.5"),this.writeBoostButtonStyle("filter",e?"none":"grayscale(0.8)"),this.writeBoostButtonStyle("animation",e?"boostBtnPulse 2s ease-in-out infinite, boostReadyRing 1.15s ease-in-out infinite":"none"),this.setBoostReadyRing(e),this.setBoostButtonAriaDisabled(e?"false":"true"),e||(this.clearBoostReadyFlash(),this.hideBoostHint())}applyPauseButtonState(){this.pauseButton&&(this.writePauseButtonStyle("opacity",this.pauseEnabled?"1":"0.45"),this.writePauseButtonStyle("filter",this.pauseEnabled?"none":"grayscale(0.8)"),this.writePauseButtonStyle("cursor",this.pauseEnabled?"pointer":"default"),this.setPauseButtonAriaDisabled(this.pauseEnabled?"false":"true"))}writeBoostButtonStyle(t,e){!this.boostButton||this.boostButtonStyleCache[t]===e||(this.boostButton.style[t]=e,this.boostButtonStyleCache[t]=e)}writePauseButtonStyle(t,e){!this.pauseButton||this.pauseButtonStyleCache[t]===e||(this.pauseButton.style[t]=e,this.pauseButtonStyleCache[t]=e)}setCooldownBarBoxShadow(t){!this.cooldownBar||this.lastCooldownBarBoxShadow===t||(this.cooldownBar.style.boxShadow=t,this.lastCooldownBarBoxShadow=t)}setBoostReadyRing(t){!this.boostButton||this.lastBoostReadyRingVisible===t||(t?this.boostButton.setAttribute("data-boost-ready-ring",""):this.boostButton.removeAttribute("data-boost-ready-ring"),this.lastBoostReadyRingVisible=t)}setBoostButtonAriaDisabled(t){!this.boostButton||this.lastBoostButtonAriaDisabled===t||(this.boostButton.setAttribute("aria-disabled",t),this.lastBoostButtonAriaDisabled=t)}setPauseButtonAriaDisabled(t){!this.pauseButton||this.lastPauseButtonAriaDisabled===t||(this.pauseButton.setAttribute("aria-disabled",t),this.lastPauseButtonAriaDisabled=t)}createLiveRegions(t){this.politeLiveRegionEl=this.createLiveRegion("polite"),this.assertiveLiveRegionEl=this.createLiveRegion("assertive"),t.appendChild(this.politeLiveRegionEl),t.appendChild(this.assertiveLiveRegionEl)}createLiveRegion(t){const e=document.createElement("div");return e.setAttribute("data-hud-live-region",t),e.setAttribute("aria-live",t),e.setAttribute("aria-atomic","true"),e.setAttribute("role",t==="assertive"?"alert":"status"),e.style.cssText=`
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    `,e}announcePolite(t){this.writeLiveRegion(this.politeLiveRegionEl,t)}announceAssertive(t){this.writeLiveRegion(this.assertiveLiveRegionEl,t)}writeLiveRegion(t,e){if(!t||e.length===0)return;this.liveRegionWriteNonce+=1;const s=this.liveRegionWriteNonce%2===0?"​":"‌";t.textContent=`${e}${s}`,t.setAttribute("data-live-message",e)}announceStageProgressMilestone(t){if(t>=100){this.lastAnnouncedProgressThreshold<100&&(this.announcePolite("ゴール！"),this.lastAnnouncedProgressThreshold=100);return}const e=[{pct:75,remaining:25},{pct:50,remaining:50},{pct:25,remaining:75}];for(const s of e)t>=s.pct&&this.lastAnnouncedProgressThreshold<s.pct&&(this.lastAnnouncedProgressThreshold=s.pct,this.announcePolite(`ゴールまで あと ${s.remaining}%`))}hide(){this.clearPendingTimeouts(),this.homeConfirmOverlay.hide(),this.pauseOverlay.hide(),this.homeButton&&(this.homeButton.remove(),this.homeButton=null),this.pauseButtonCleanup?.(),this.pauseButtonCleanup=null,this.pauseButton&&(this.pauseButton.remove(),this.pauseButton=null),this.muteHandle&&(this.muteHandle.remove(),this.muteHandle=null),this.muteButton=null,this.stageNameEl&&(this.stageNameEl.remove(),this.stageNameEl=null),this.assistMessageEl&&(this.assistMessageEl.remove(),this.assistMessageEl=null),this.politeLiveRegionEl&&(this.politeLiveRegionEl.remove(),this.politeLiveRegionEl=null),this.assertiveLiveRegionEl&&(this.assertiveLiveRegionEl.remove(),this.assertiveLiveRegionEl=null),this.stageProgressContainer&&(this.stageProgressContainer.remove(),this.stageProgressContainer=null),this.stageProgressTrack=null,this.stageProgressFill=null,this.stageProgressGoalEl=null,this.container&&(this.container.remove(),this.container=null),this.boostButton&&(this.boostButton.remove(),this.boostButton=null),this.boostHintEl&&(this.boostHintEl.remove(),this.boostHintEl=null),this.cooldownContainer&&(this.cooldownContainer.remove(),this.cooldownContainer=null),this.cooldownBar=null,this.boostLocked=!1,this.pauseEnabled=!0,this.lastCooldownProgress=1,this.lastCooldownPct=-1,this.lastReadyState=null,this.lastCooldownBarBoxShadow=null,this.lastBoostButtonAriaDisabled=null,this.lastBoostReadyRingVisible=null,this.boostButtonStyleCache={opacity:null,filter:null,animation:null,transform:null},this.lastPauseButtonAriaDisabled=null,this.pauseButtonStyleCache={opacity:null,filter:null,cursor:null,transform:null},this.lastStageProgressPct=-1,this.lastStageProgressComplete=null,this.lastScore=-1,this.lastStarCount=-1,this.displayedScore=0,this.scoreAnimationToken=0,this.scoreGainUseAltAnimation=!1,this.scoreGainAnimationEndHandler=null,this.scoreEl=null,this.scoreGainEl=null,this.starCountEl=null,this.bestStarContainerEl=null,this.bestStarCountEl=null,this.bestStarCount=0,this.lastBestStarCount=-1,this.bestStarPulsed=!1,this.liveRegionWriteNonce=0,this.lastAnnouncedProgressThreshold=0}}class vs{overlayEl=null;bubbleEl=null;highContrastMode=!1;show(t,e){const s=document.getElementById("ui-overlay");s&&(this.injectStyles(),(!this.overlayEl||!this.bubbleEl)&&(this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-adaptive-tutorial-hint",""),this.overlayEl.setAttribute("aria-hidden","true"),this.overlayEl.style.cssText=`
        position: absolute;
        top: clamp(4.6rem, 13vh, 6.8rem);
        left: 50%;
        transform: translateX(-50%);
        pointer-events: none;
        z-index: 11;
      `,this.bubbleEl=document.createElement("div"),this.bubbleEl.setAttribute("data-adaptive-tutorial-bubble",""),this.bubbleEl.setAttribute("role","status"),this.bubbleEl.setAttribute("aria-live","polite"),this.bubbleEl.setAttribute("aria-atomic","true"),this.overlayEl.appendChild(this.bubbleEl)),this.overlayEl.setAttribute("aria-hidden","false"),this.overlayEl.style.display="block",this.overlayEl.setAttribute("data-adaptive-tutorial-kind",e),this.overlayEl.setAttribute("data-adaptive-tutorial-contrast",this.highContrastMode?"high":"default"),this.bubbleEl.textContent=t,this.applyStyles(e),this.overlayEl.isConnected||s.appendChild(this.overlayEl))}hide(){!this.overlayEl||!this.bubbleEl||(this.overlayEl.style.display="none",this.overlayEl.setAttribute("aria-hidden","true"),this.overlayEl.removeAttribute("data-adaptive-tutorial-kind"),this.bubbleEl.textContent="")}setHighContrastMode(t){this.highContrastMode=t,this.overlayEl?.setAttribute("data-adaptive-tutorial-contrast",t?"high":"default");const e=this.overlayEl?.getAttribute("data-adaptive-tutorial-kind");!this.bubbleEl||!e||this.applyStyles(e)}applyStyles(t){if(!this.bubbleEl)return;const e=t==="meteorite"?{background:this.highContrastMode?"rgba(5, 10, 28, 0.96)":"rgba(29, 35, 84, 0.92)",border:this.highContrastMode?"3px solid rgba(255, 255, 255, 0.95)":"2px solid rgba(255, 187, 117, 0.95)",color:"#ffffff",shadow:this.highContrastMode?"0 12px 28px rgba(0, 0, 0, 0.42)":"0 12px 28px rgba(255, 143, 61, 0.22)"}:{background:this.highContrastMode?"rgba(5, 10, 28, 0.96)":"rgba(15, 23, 58, 0.92)",border:this.highContrastMode?"3px solid rgba(255, 255, 255, 0.95)":"2px solid rgba(255, 227, 120, 0.95)",color:"#ffffff",shadow:this.highContrastMode?"0 12px 28px rgba(0, 0, 0, 0.42)":"0 12px 28px rgba(255, 215, 0, 0.2)"};this.bubbleEl.style.cssText=`
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 2.9rem;
      max-width: min(78vw, 28rem);
      padding: 0.7rem 1.15rem;
      border-radius: 999px;
      background: ${e.background};
      border: ${e.border};
      color: ${e.color};
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(1rem, 3.4vmin, 1.18rem);
      font-weight: 700;
      line-height: 1.35;
      text-align: center;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);
      box-shadow: ${e.shadow};
      white-space: nowrap;
    `}injectStyles(){if(document.getElementById("adaptive-tutorial-hint-styles"))return;const t=document.createElement("style");t.id="adaptive-tutorial-hint-styles",t.textContent=`
      @keyframes adaptiveTutorialHintFloat {
        0%, 100% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-3px) scale(1.02); }
      }

      [data-adaptive-tutorial-bubble] {
        animation: adaptiveTutorialHintFloat 1.2s ease-in-out infinite;
      }
    `,document.head.appendChild(t)}}const Es=1,Ss=.4;class _t{overlayEl=null;numberEl=null;phase="idle";elapsed=0;currentStep=0;stepDuration;goDuration;onTick;onGo;onComplete=null;steps=["3","2","1"];constructor(t={}){this.stepDuration=t.stepDuration??Es,this.goDuration=t.goDuration??Ss,this.onTick=t.onTick,this.onGo=t.onGo}show(t){if(this.phase!=="idle"&&this.phase!=="done")return;const e=document.getElementById("ui-overlay")??document.body;this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-countdown-overlay",""),this.overlayEl.style.cssText=`
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
    `,this.overlayEl.appendChild(this.numberEl),e.appendChild(this.overlayEl),this.phase="counting",this.elapsed=0,this.currentStep=0,this.onComplete=t,this.renderStep(this.steps[this.currentStep]),this.fireTick()}tick(t){if(!(this.phase==="idle"||this.phase==="done")){if(t<0&&(t=0),this.elapsed+=t,this.phase==="counting"){const e=this.elapsed;this.applyStepAnimation(e/this.stepDuration),e>=this.stepDuration&&(this.currentStep++,this.elapsed=0,this.currentStep<this.steps.length?(this.renderStep(this.steps[this.currentStep]),this.fireTick()):(this.phase="go",this.renderStep("スタート！"),this.fireGo()));return}this.phase==="go"&&(this.applyStepAnimation(this.elapsed/this.goDuration),this.elapsed>=this.goDuration&&this.complete())}}hide(){this.overlayEl&&(this.overlayEl.remove(),this.overlayEl=null),this.numberEl=null,this.phase="done",this.onComplete=null}dispose(){this.hide(),this.onTick=void 0,this.onGo=void 0}isActive(){return this.phase==="counting"||this.phase==="go"}getCurrentLabel(){return this.numberEl?.textContent??null}renderStep(t){this.numberEl&&(this.numberEl.textContent=t,this.numberEl.style.opacity="0",this.numberEl.style.transform="scale(0.6)")}applyStepAnimation(t){if(!this.numberEl)return;const e=Math.max(0,Math.min(1,t));let s,i;if(e<.2){const n=e/.2;s=.6+n*.5,i=n}else if(e<.7)s=1.1-(e-.2)/.5*.1,i=1;else{const n=(e-.7)/.3;s=1+n*.2,i=1-n}this.numberEl.style.transform=`scale(${s.toFixed(3)})`,this.numberEl.style.opacity=i.toFixed(3)}fireTick(){try{this.onTick?.()}catch{}}fireGo(){try{this.onGo?.()}catch{}}complete(){const t=this.onComplete;if(this.hide(),t)try{t()}catch{}}}const xs=1.8;class Cs{constructor(t,e={}){this.entry=t,this.totalDuration=e.totalDuration??xs}overlayEl=null;cardEl=null;phase="idle";elapsed=0;onComplete=null;totalDuration;show(t){if(this.phase!=="idle"&&this.phase!=="done")return;const e=document.getElementById("ui-overlay")??document.body;Zt();const s=H().height<=500;this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-stage-intro-overlay",""),this.overlayEl.style.cssText=`
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
    `;const n=document.createElement("div");n.textContent=this.entry.emoji,n.setAttribute("data-stage-intro-emoji",""),n.style.cssText=`
      font-size: ${s?"clamp(3rem, 15vw, 4.2rem)":"clamp(4.4rem, 18vw, 6rem)"};
      line-height: 1;
      filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.28));
    `;const a=document.createElement("div");a.textContent=this.entry.reading,a.setAttribute("data-stage-intro-name",""),a.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${s?"clamp(1.8rem, 8vw, 2.6rem)":"clamp(2.5rem, 10vw, 3.4rem)"};
      font-weight: 900;
      line-height: 1.05;
      color: #ffffff;
      text-shadow: 0 0 18px rgba(126, 199, 255, 0.2);
    `;const o=document.createElement("div");o.textContent=this.entry.trivia,o.setAttribute("data-stage-intro-trivia",""),o.style.cssText=`
      max-width: 100%;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${s?"clamp(0.88rem, 3.4vmin, 1rem)":"clamp(1.02rem, 3.7vmin, 1.15rem)"};
      font-weight: 700;
      line-height: 1.35;
      color: #eef5ff;
      overflow-wrap: anywhere;
    `,this.cardEl.append(i,n,a,o),this.overlayEl.appendChild(this.cardEl),e.appendChild(this.overlayEl),this.phase="showing",this.elapsed=0,this.onComplete=t,this.applyAnimation(0)}tick(t){this.phase==="showing"&&(this.elapsed+=Math.max(0,t),this.applyAnimation(this.elapsed/this.totalDuration),this.elapsed>=this.totalDuration&&this.complete())}hide(){this.overlayEl&&(this.overlayEl.remove(),this.overlayEl=null),this.cardEl=null,this.phase="done",this.onComplete=null}dispose(){this.hide()}isActive(){return this.phase==="showing"}applyAnimation(t){if(!this.overlayEl||!this.cardEl)return;const e=Math.max(0,Math.min(1,t));let s=1,i=1,n=0,a=1;if(e<.18){const o=e/.18;i=o,s=o,n=24-24*o,a=.92+.1*o}else if(e<.72){const o=(e-.18)/.54;i=1,s=1,n=0,a=1.02-.02*o}else{const o=(e-.72)/.28;i=1-o*.8,s=1-o,n=-18*o,a=1-.04*o}this.overlayEl.style.opacity=i.toFixed(3),this.cardEl.style.opacity=s.toFixed(3),this.cardEl.style.transform=`translateY(${n.toFixed(1)}px) scale(${a.toFixed(3)})`}complete(){const t=this.onComplete;if(this.hide(),!!t)try{t()}catch{}}}class ws{overlayEl=null;leftGuideEl=null;rightGuideEl=null;instructionEl=null;currentMode=null;show(t="intro"){if(this.overlayEl){this.setMode(t);return}const e=document.getElementById("ui-overlay");e&&(this.injectStyles(),this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-touch-guide-overlay",""),this.overlayEl.setAttribute("role","region"),this.overlayEl.setAttribute("aria-label","そうさ ガイド"),this.overlayEl.style.cssText=`
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
    `,document.head.appendChild(t)}getActiveSide(t){return t==="active-left"?"left":t==="active-right"?"right":t==="assist-left"?"left":t==="assist-right"?"right":t==="hidden"?"none":"both"}getGuideEmphasis(t,e){return e==="active-left"?t==="left"?"primary":"secondary":e==="active-right"?t==="right"?"primary":"secondary":e==="assist-left"?t==="left"?"primary":"secondary":e==="assist-right"?t==="right"?"primary":"secondary":e==="hidden"?"hidden":"balanced"}updateInstruction(t){if(!this.instructionEl)return;const e=this.getInstructionMessage(t);this.instructionEl.textContent=e,this.instructionEl.setAttribute("data-touch-guide-message",e)}getInstructionMessage(t){return t==="intro"?"ひだりか みぎを さわると うごけるよ":t==="idle"?"ひつような ときは ひだりか みぎを さわって うごこう":t==="assist-left"?"ひだりへ よけよう":t==="assist-right"?"みぎへ よけよう":""}}class gt{static DEFAULT_DURATION=4.2;static CELEBRATION_DURATION=3.6;element=null;timer=0;message=null;highContrast=!1;showHint(t){this.showMessage(t,gt.DEFAULT_DURATION)}showCelebration(t){this.showMessage(t,gt.CELEBRATION_DURATION)}tick(t){this.timer<=0||(this.timer=Math.max(0,this.timer-t),this.timer===0&&this.hide())}hide(){this.timer=0,this.message=null,this.element&&(this.element.style.display="none",this.element.textContent="",this.element.removeAttribute("data-constellation-message"))}setHighContrastMode(t){this.highContrast=t,this.element&&this.applyElementStyle(this.element)}getMessage(){return this.message}showMessage(t,e){const s=this.ensureElement();this.timer=e,this.message=t,s.textContent=t,s.setAttribute("data-constellation-message",t),s.style.display="flex"}ensureElement(){if(this.element)return this.element;const t=document.getElementById("ui-overlay"),e=document.createElement("div");return e.setAttribute("data-constellation-hint",""),e.setAttribute("aria-live","polite"),this.applyElementStyle(e),e.style.display="none",t?.appendChild(e),this.element=e,e}applyElementStyle(t){t.style.cssText=`
      position: absolute;
      top: 1rem;
      left: 50%;
      transform: translateX(-50%);
      min-width: min(78vw, 22rem);
      max-width: min(88vw, 26rem);
      padding: 0.7rem 1rem;
      border-radius: 999px;
      background: ${this.highContrast?"rgba(255, 255, 255, 0.96)":"rgba(18, 34, 96, 0.88)"};
      border: 2px solid ${this.highContrast?"#102040":"rgba(255, 255, 255, 0.28)"};
      color: ${this.highContrast?"#102040":"#fff8c8"};
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 1rem;
      font-weight: 700;
      justify-content: center;
      text-align: center;
      pointer-events: none;
      z-index: 35;
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.24);
    `}}const As=4;class Ts{overlayEl=null;cardEl=null;titleEl=null;messageEl=null;elapsed=0;visible=!1;highContrastMode=!1;totalDuration;constructor(t={}){this.totalDuration=t.totalDuration??As}show(t){const e=document.getElementById("ui-overlay")??document.body;Zt();const s=H().height<=500;(!this.overlayEl||!this.cardEl||!this.titleEl||!this.messageEl)&&(this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-seasonal-event-notice",""),this.overlayEl.style.cssText=`
        position: absolute;
        top: clamp(4.6rem, 12vh, 6.8rem);
        left: 50%;
        transform: translateX(-50%);
        z-index: 14;
        pointer-events: none;
      `,this.cardEl=document.createElement("div"),this.cardEl.setAttribute("data-seasonal-event-notice-card",""),this.titleEl=document.createElement("div"),this.titleEl.setAttribute("data-seasonal-event-notice-title",""),this.messageEl=document.createElement("div"),this.messageEl.setAttribute("data-seasonal-event-notice-message",""),this.messageEl.setAttribute("role","status"),this.messageEl.setAttribute("aria-live","polite"),this.messageEl.setAttribute("aria-atomic","true"),this.cardEl.append(this.titleEl,this.messageEl),this.overlayEl.appendChild(this.cardEl)),this.overlayEl.style.display="block",this.visible=!0,this.elapsed=0,this.titleEl.textContent=`${t.emoji} ${t.title}`,this.messageEl.textContent=t.noticeMessage,this.overlayEl.setAttribute("data-seasonal-event-id",t.id),this.overlayEl.setAttribute("aria-hidden","false"),this.applyStyles(t.accentColor,s),this.overlayEl.isConnected||e.appendChild(this.overlayEl)}tick(t){this.visible&&(this.elapsed+=Math.max(0,t),this.elapsed>=this.totalDuration&&this.hide())}hide(){this.overlayEl&&(this.visible=!1,this.elapsed=0,this.overlayEl.remove(),this.overlayEl=null,this.cardEl=null,this.titleEl=null,this.messageEl=null)}dispose(){this.hide()}isVisible(){return this.visible}setHighContrastMode(t){this.highContrastMode=t;const e=this.overlayEl?.getAttribute("data-seasonal-event-id")?this.overlayEl?.getAttribute("data-seasonal-event-accent"):null;!this.cardEl||!e||this.applyStyles(Number(e),H().height<=500)}applyStyles(t,e){if(!this.overlayEl||!this.cardEl||!this.titleEl||!this.messageEl)return;const s=`#${t.toString(16).padStart(6,"0")}`;this.overlayEl.setAttribute("data-seasonal-event-accent",String(t)),this.cardEl.style.cssText=`
      min-width: min(${e?"86vw":"70vw"}, ${e?"19rem":"28rem"});
      max-width: min(90vw, 32rem);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: ${e?"0.25rem":"0.45rem"};
      padding: ${e?"0.9rem 1rem":"1rem 1.3rem"};
      border-radius: ${e?"22px":"28px"};
      background: ${this.highContrastMode?"rgba(5, 10, 28, 0.96)":"rgba(12, 31, 78, 0.92)"};
      border: ${this.highContrastMode?"3px solid #ffffff":`2px solid ${s}`};
      box-shadow: 0 14px 34px rgba(0, 0, 0, 0.28);
      text-align: center;
    `,this.titleEl.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${e?"clamp(1.1rem, 4.2vmin, 1.35rem)":"clamp(1.25rem, 4vmin, 1.55rem)"};
      font-weight: 900;
      color: #ffffff;
    `,this.messageEl.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${e?"clamp(0.95rem, 3.5vmin, 1.08rem)":"clamp(1rem, 3.2vmin, 1.15rem)"};
      font-weight: 700;
      line-height: 1.35;
      color: ${this.highContrastMode?"#ffffff":"#eef6ff"};
    `}}class Ms{overlayEl=null;continueButton=null;retryButton=null;rewardButton=null;isContinueEnabled=!1;hasHandledContinue=!1;isRewardOpen=!1;buttonCleanups=new Set;show(t){this.hide();const e=document.getElementById("ui-overlay");if(!e)return;this.isContinueEnabled=!1,this.hasHandledContinue=!1,this.isRewardOpen=!1,this.injectStageClearBurstAnimation();const s=document.createElement("div");s.setAttribute("data-stage-clear-overlay",""),s.style.cssText=`
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
      padding: 0.9rem;
      box-sizing: border-box;
      text-align: center;
      overflow-x: hidden;
      overflow-y: hidden;
      gap: 0.3rem;
    `,s.style.overflowY="hidden",this.overlayEl=s,this.appendClearCelebrationBurst(),s.appendChild(this.createHeading("やったね！",`
      position: relative;
      z-index: 1;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(2.3rem, 8vmin, 3rem);
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
      margin-bottom: 0.5rem;
    `)),t.isBestUpdated&&(this.injectBestStageStarsAnimation(),s.appendChild(this.createHeading(`✨ じこベストこうしん！ ⭐ ${t.starCount} こ`,`
        position: relative;
        z-index: 1;
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: clamp(1rem, 3.8vmin, 1.15rem);
        font-weight: 700;
        color: #FFD700;
        margin-bottom: 0.35rem;
        text-shadow: 0 0 12px rgba(255, 215, 0, 0.6);
        animation: bestStageStarsPop 0.6s ease-out;
      `))),s.appendChild(this.createHeading(`⭐ ${t.starCount} こ あつめたよ！`,`
      position: relative;
      z-index: 1;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(1.15rem, 4.2vmin, 1.35rem);
      font-weight: 700;
      color: #fff;
    `)),s.appendChild(this.createMedalSummary(t.stageNumber,t.starCount,t.bestStarCount)),t.nextEntry&&s.appendChild(this.createNextAdventureCard(t.nextEntry)),t.rewardEntry&&s.appendChild(this.createHeading(`${t.rewardEntry.emoji} ${t.rewardEntry.name}の ずかんカード ゲット！ なかまに なったよ！`,`
        position: relative;
        z-index: 1;
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: clamp(0.95rem, 3.2vmin, 1.08rem);
        font-weight: 700;
        color: #FFD700;
        margin-top: 0.45rem;
        text-shadow: 0 0 10px rgba(255, 215, 0, 0.4);
      `)),s.appendChild(this.createActionButtons(t)),e.appendChild(s)}hide(){const t=Array.from(this.buttonCleanups);this.buttonCleanups.clear();for(const e of t)e();this.overlayEl?.remove(),this.overlayEl=null,this.continueButton=null,this.retryButton=null,this.rewardButton=null,this.isContinueEnabled=!1,this.hasHandledContinue=!1,this.isRewardOpen=!1}enableContinue(){if(!this.isContinueEnabled&&!(!this.continueButton||!this.retryButton)){this.isContinueEnabled=!0;for(const t of[this.retryButton,this.continueButton])t.disabled=!1,t.style.opacity="1",t.style.visibility="visible",t.style.pointerEvents="auto"}}setRewardOpen(t){this.isRewardOpen=t,this.rewardButton&&(this.rewardButton.style.pointerEvents=t?"none":"auto",this.rewardButton.style.transform="scale(1)")}createHeading(t,e){const s=document.createElement("div");return s.textContent=t,s.style.cssText=e,s}createMedalSummary(t,e,s){const i=document.createElement("div");i.setAttribute("data-stage-clear-medals",""),i.style.cssText=`
      position: relative;
      z-index: 1;
      display: flex;
      align-items: stretch;
      justify-content: center;
      gap: 0.65rem;
      flex-wrap: wrap;
      margin-top: 0.55rem;
    `;const n=At(t,e,{label:"こんかい",hint:`⭐ ${e}`,size:"hero",scope:"stage-clear-current"});n.style.minWidth="136px",n.style.padding="0.65rem 0.8rem",n.style.borderRadius="20px",n.style.background="rgba(255, 255, 255, 0.12)";const a=At(t,s,{label:"ベスト",hint:`⭐ ${s}`,size:"hero",scope:"stage-clear-best"});return a.style.minWidth="136px",a.style.padding="0.65rem 0.8rem",a.style.borderRadius="20px",a.style.background="rgba(255, 255, 255, 0.12)",i.append(n,a),i}createNextAdventureCard(t){const e=document.createElement("section");e.setAttribute("data-stage-clear-next-preview",""),e.style.cssText=`
      margin-top: 0.8rem;
      width: min(88vw, 400px);
      padding: 0.8rem 0.95rem 0.95rem;
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
      font-size: 0.95rem;
      font-weight: 700;
      color: #b9d7ff;
      letter-spacing: 0.08em;
    `),i=this.createHeading(`つぎは ${t.reading}！`,`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(1.25rem, 4.6vmin, 1.7rem);
      font-weight: 900;
      color: #fff4a3;
      text-shadow: 0 0 14px rgba(255, 230, 120, 0.25);
    `);i.setAttribute("data-stage-clear-next-title","");const n=document.createElement("div");n.textContent=t.emoji,n.setAttribute("data-stage-clear-next-emoji",""),n.style.cssText=`
      font-size: clamp(2.6rem, 11vmin, 3.9rem);
      line-height: 1;
      filter: drop-shadow(0 8px 12px rgba(0, 0, 0, 0.24));
    `;const a=this.createHeading(t.reading,`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(1.2rem, 4.2vmin, 1.55rem);
      font-weight: 800;
      color: #ffffff;
    `);a.setAttribute("data-stage-clear-next-name","");const o=this.createHeading(t.trivia,`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(0.95rem, 3.4vmin, 1.05rem);
      font-weight: 700;
      color: #dfeaff;
      line-height: 1.35;
    `);return o.setAttribute("data-stage-clear-next-trivia",""),e.append(s,i,n,a,o),e}createActionButtons(t){const e=!!(t.rewardEntry&&t.onReward),s=document.createElement("div");s.setAttribute("data-stage-clear-actions",""),s.style.cssText=`
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: repeat(${e?3:2}, minmax(0, 1fr));
      align-items: stretch;
      justify-content: center;
      gap: clamp(0.4rem, 1.8vmin, 0.7rem);
      width: min(100%, ${e?"42rem":"30rem"});
      margin-top: 0.7rem;
    `,e&&s.appendChild(this.createRewardButton(t));const i=document.createElement("button");i.setAttribute("data-stage-clear-retry",""),i.setAttribute("aria-label","もういちど"),i.textContent="もういちど",i.disabled=!0,i.style.cssText=`
      width: 100%;
      min-width: 0;
      min-height: 58px;
      padding: 0.65rem 0.7rem;
      border: none;
      border-radius: 999px;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(0.95rem, 3.4vmin, 1.24rem);
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
    `,i.style.opacity="0",i.style.visibility="hidden",i.style.pointerEvents="none";const n=document.createElement("button");return n.setAttribute("data-stage-clear-continue",""),n.setAttribute("aria-label",t.continueLabel),n.textContent=t.continueLabel,n.disabled=!0,n.style.cssText=`
      width: 100%;
      min-width: 0;
      min-height: 58px;
      padding: 0.65rem 0.7rem;
      border: none;
      border-radius: 999px;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(1rem, 3.6vmin, 1.3rem);
      font-weight: 900;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      touch-action: manipulation;
      transform: scale(1);
      transition: opacity 0.18s ease-out, transform 0.08s ease-out;
    `,n.style.opacity="0",n.style.visibility="hidden",n.style.pointerEvents="none",this.attachActionHandlers(i,t.onRetry),this.attachActionHandlers(n,t.onContinue),this.retryButton=i,this.continueButton=n,s.append(i,n),s}createRewardButton(t){const e=document.createElement("button");return e.setAttribute("data-stage-clear-card",""),e.textContent="カードをみる",e.style.cssText=`
      width: 100%;
      min-width: 0;
      min-height: 58px;
      padding: 0.65rem 0.7rem;
      border: none;
      border-radius: 999px;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(0.95rem, 3.4vmin, 1.24rem);
      font-weight: 900;
      color: #fff;
      background: rgba(255, 255, 255, 0.18);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.24);
      cursor: pointer;
      touch-action: manipulation;
      transform: scale(1);
      transition: transform 0.08s ease-out, opacity 0.18s ease-out;
    `,this.buttonCleanups.add(M(e,{canActivate:()=>!this.isRewardOpen,onActivate:()=>{this.isRewardOpen||t.onReward?.()},onPressChange:s=>{e.style.transform=s?"scale(0.96)":"scale(1)"},preventDefaultOnPointerDown:!0,preventDefaultOnClick:!0,stopPropagation:!0})),this.rewardButton=e,e}attachActionHandlers(t,e){const s=()=>!this.isRewardOpen&&this.isContinueEnabled&&!this.hasHandledContinue,i=M(t,{canActivate:s,onActivate:()=>{if(s()){this.hasHandledContinue=!0;for(const n of[this.retryButton,this.continueButton])n&&(n.disabled=!0,n.style.pointerEvents="none",n.style.transform="scale(1)");e()}},onPressChange:n=>{t.style.transform=n?"scale(0.96)":"scale(1)"},preventDefaultOnPointerDown:!0,preventDefaultOnClick:!0,stopPropagation:!0});this.buttonCleanups.add(i)}appendClearCelebrationBurst(){if(!this.overlayEl)return;const t=document.createElement("div");t.setAttribute("data-stage-clear-burst",""),t.style.cssText=`
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
    `,document.head.appendChild(t)}}const Ps=2600,Vt={gentle:{title:"うちゅうせんを かるくしたよ ⭐",detail:"ほしと きらきらを すこし やさしく したよ"},stronger:{title:"もっと かるくしたよ 🚀",detail:"なめらかに あそべるように えんしゅつを ぎゅっと したよ"}};class Bs{overlayEl=null;hideTimer=null;show(t){if(!this.overlayEl){const n=document.getElementById("ui-overlay")??document.body,a=document.createElement("div");a.setAttribute("data-frame-rate-hint-overlay",""),a.setAttribute("role","status"),a.setAttribute("aria-live","polite"),a.style.cssText=`
        position: absolute;
        top: max(18px, env(safe-area-inset-top));
        left: 50%;
        transform: translateX(-50%);
        width: min(86vw, 560px);
        pointer-events: none;
        z-index: 55;
        font-family: 'Zen Maru Gothic', sans-serif;
      `,a.innerHTML=`
        <div style="
          border-radius: 28px;
          padding: 16px 20px;
          background: rgba(16, 28, 72, 0.92);
          box-shadow:
            0 0 24px rgba(120, 180, 255, 0.28),
            0 8px 22px rgba(0, 0, 0, 0.3);
          color: #fff;
          text-align: center;
        ">
          <div data-frame-rate-hint-title style="font-size: clamp(18px, 3vw, 28px); font-weight: 900;"></div>
          <div data-frame-rate-hint-detail style="margin-top: 6px; font-size: clamp(14px, 2.2vw, 20px); font-weight: 700; line-height: 1.5; opacity: 0.92;"></div>
        </div>
      `,this.overlayEl=a,n.appendChild(a)}const e=t.level>=2?Vt.stronger:Vt.gentle,s=this.overlayEl.querySelector("[data-frame-rate-hint-title]"),i=this.overlayEl.querySelector("[data-frame-rate-hint-detail]");s&&(s.textContent=e.title),i&&(i.textContent=e.detail),this.hideTimer!==null&&window.clearTimeout(this.hideTimer),this.hideTimer=window.setTimeout(()=>{this.hide()},Ps)}hide(){this.hideTimer!==null&&(window.clearTimeout(this.hideTimer),this.hideTimer=null),this.overlayEl?.remove(),this.overlayEl=null}dispose(){this.hide()}isVisible(){return this.overlayEl!==null}}const xt=1,Rs=2e3,Ct={starCollect:{duration:.09,amplitudeX:.04,amplitudeY:.025,frequency:34},rainbowCollect:{duration:.12,amplitudeX:.07,amplitudeY:.04,frequency:32},meteoriteHit:{duration:.28,amplitudeX:.18,amplitudeY:.12,frequency:42},boost:{duration:.14,amplitudeX:.08,amplitudeY:.045,frequency:28},stageClear:{duration:.3,amplitudeX:.1,amplitudeY:.06,frequency:22}};function ks(l){const t=window.requestIdleCallback;if(typeof t=="function"){t(l,{timeout:1500});return}window.setTimeout(l,800)}class v{static VISUAL_QUALITY_SCALE_BY_TIER=[.45,.7,1];static BG_STAR_COUNT=Rs;static ASSIST_TRIGGER_HIT_WINDOW=6;static ASSIST_TRIGGER_HIT_COUNT=2;static ASSIST_DURATION=5;static ASSIST_MESSAGE_DURATION=3;static ASSIST_METEORITE_INTERVAL_MULTIPLIER=1.7;static ASSIST_MESSAGE="だいじょうぶ！ ゆっくりいこう ✨";static ASSIST_DIRECTION_REFRESH_INTERVAL=.35;static ASSIST_DIRECTION_LOOKAHEAD=42;static ASSIST_DIRECTION_SIDE_TARGET_X=4.5;static ASSIST_DIRECTION_SIDE_RANGE=7.5;static ASSIST_DIRECTION_DIFF_THRESHOLD=1.1;static ASSIST_DIRECTION_DIFF_RATIO=.28;threeScene;camera;lastAspect=0;initialized=!1;sceneManager;inputSystem;audioManager;saveManager;ambientLight;directionalLight;spaceship;stars=[];meteorites=[];shootingStars=[];comets=[];specialShootingStars=[];monthlyEncounters=[];collisionSystem=new he;scoreSystem=new ce;spawnSystem=new de;boostSystem=new ue;lodSystem=new me;meteoShowerEventSystem=new pe;stageSpecialEventSystem=new ge;spaceWeatherEventSystem=new fe;specialStarSpawnSystem=new ye;seasonalEventSystem;monthlyEncounterSystem=new be;hud;scorePopupManager=new j;scorePopupEffect=new ve;particleBurstManager=new Ee;planetRingEffect=new Se;constellationLineEffect=new xe;constellationSystem=new Ce;constellationHintOverlay=new gt;airShield;meteoShowerEffect;spaceWeatherEffect;stageSpecialEffects;seasonalEventEffects=new we;monthlyEncounterEffect=new Ae;rainbowTrailEffect;stageAtmosphereEffect=new qt;wormholeTunnelEffect=new Te;seasonalEventNotice=new Ts;stageConfig;stageNumber=1;launchSource="campaign";isCleared=!1;clearTimer=0;stageClearOverlay=new Ms;isClearRewardOpen=!1;isOpeningClearReward=!1;clearRewardOverlay=null;clearRewardOverlayPromise=null;static CLEAR_CONTINUE_DELAY=.6;stageEntryTotalScore=0;stageEntryTotalStarCount=0;playTime=0;meteoriteHitTimes=[];assistTimer=0;assistMessageTimer=0;assistDirection=null;assistDirectionRefreshTimer=0;damageTimer=0;static DAMAGE_FLASH_DURATION=.5;cameraShakeTimer=0;cameraShakeElapsed=0;cameraShakeOffset=new q;cameraShakeProfile=Ct.meteoriteHit;motionSensitivity=Z();cameraPositionTarget=new q(0,5,10);cameraLookAtTarget=new q(0,0,-10);destinationPlanet=null;destinationPlanetSpinTarget=null;static DESTINATION_PLANET_SPIN_SPEED=.2;static BOOST_HINT_DURATION=2.4;static ADAPTIVE_HINT_DURATION=3;static SHOOTING_STAR_SCORE_BONUS_DURATION=6;static METEO_SHOWER_MESSAGE="りゅうせいぐんだ！ ✨";static METEO_SHOWER_MESSAGE_DURATION=2.4;static STAGE_SPECIAL_MESSAGE_DURATION=2.8;static WORMHOLE_TRANSITION_DURATION=2.2;bgStars=null;boostLinesEffect;companionManager=null;elapsedTime=0;boostFlameEffect;isStarting=!1;stageIntroOverlay=null;countdownOverlay=null;awaitingResume=!1;resumeCountdownOverlay=null;isHomeConfirmOpen=!1;shouldResumeAfterHomeConfirm=!1;pauseOverlay=new ne;isPauseOpen=!1;shouldResumeAfterPause=!1;touchGuide=new ws;touchGuideMode="intro";touchGuideIdleTimer=0;hasSeenMoveInput=!1;isActive=!1;boostHintDisplayTimer=0;adaptiveHintDisplayTimer=0;adaptiveTutorialSystem=new Me;adaptiveTutorialHint=new vs;meteoShowerAnnouncementTimer=0;spaceWeatherAnnouncementTimer=0;spaceWeatherAnnouncementMessage="";stageSpecialAnnouncementTimer=0;stageSpecialAnnouncementMessage="";prewarmRequestToken=0;static TOUCH_GUIDE_IDLE_DELAY=3;visualQualityTier=v.VISUAL_QUALITY_SCALE_BY_TIER.length-1;performanceAdaptationLevel=0;frameRateHintOverlay=new Bs;scheduleIdleTask;loadEncyclopediaOverlay;clearRewardRequestToken=0;wormholeTransitionTimer=0;pendingWormholeTransition=null;onPauseRequested=null;onResumeRequested=null;onExitHomeRequested=null;attemptStatsRecorded=!1;constructor(t,e,s,i,n={}){this.sceneManager=t,this.inputSystem=e,this.audioManager=s,this.saveManager=i,this.scoreSystem.setScoreGainListener(h=>{this.initialized&&this.hud.animateScoreGain(h.amount,h.stageScore),h.worldPosition&&(this.scorePopupEffect.emit(h.worldPosition,h.amount),h.kind==="bonus"&&this.scorePopupManager.show(h.amount,h.worldPosition,this.camera))}),this.scheduleIdleTask=n.scheduleIdleTask??ks,this.seasonalEventSystem=new Pe(n.seasonalEventDateProvider),this.loadEncyclopediaOverlay=n.loadEncyclopediaOverlay??(()=>wt(()=>import("./EncyclopediaOverlay-BQKCndtE.js"),__vite__mapDeps([0,1,2]))),this.threeScene=new it,this.threeScene.background=new nt(32);const{width:a,height:o}=H();this.camera=new yt(60,a/o,.1,2e3)}ensureInitialized(){this.initialized||(this.ambientLight=new ft(16777215,.6),this.directionalLight=new Qt(16777215,.8),this.directionalLight.position.set(5,10,5),this.threeScene.add(this.ambientLight),this.threeScene.add(this.directionalLight),this.spaceship=new Yt,this.threeScene.add(this.spaceship.mesh),this.airShield=new Be,this.threeScene.add(this.airShield.getMesh()),this.companionManager=new Mt([]),this.threeScene.add(this.companionManager.getGroup()),this.boostLinesEffect=new Re,this.boostLinesEffect.init(this.threeScene),this.boostFlameEffect=new ke,this.boostFlameEffect.init(this.threeScene),this.rainbowTrailEffect=new Oe,this.threeScene.add(this.rainbowTrailEffect.group),this.constellationLineEffect.init(this.threeScene),this.meteoShowerEffect=new Ie,this.meteoShowerEffect.init(this.threeScene),this.spaceWeatherEffect=new De,this.spaceWeatherEffect.init(this.threeScene),this.stageSpecialEffects=new Ge,this.stageSpecialEffects.init(this.threeScene),this.seasonalEventEffects.init(this.threeScene),this.stageAtmosphereEffect.init(this.threeScene),this.wormholeTunnelEffect.init(this.threeScene),this.scorePopupEffect.init(this.threeScene),this.monthlyEncounterEffect.init(this.threeScene),this.hud=new bs,this.initialized=!0,this.applyVisualQualityTier())}setVisualQualityTier(t){this.visualQualityTier=v.clampVisualQualityTier(t),this.applyVisualQualityTier()}setPerformanceAdaptationLevel(t){this.performanceAdaptationLevel=v.clampPerformanceAdaptationLevel(t),this.applyVisualQualityTier()}showFrameRateHint(t){this.isActive&&this.frameRateHintOverlay.show({level:t})}enter(t){this.ensureInitialized(),this.isActive=!0,this.prewarmRequestToken+=1,this.clearRewardRequestToken+=1,this.lastAspect=0,this.stageNumber=t.stageNumber??1,this.launchSource=t.launchSource??"campaign",this.stageConfig=U(this.stageNumber),this.prefetchEndingSceneModuleIfNeeded(),this.isCleared=!1,this.clearTimer=0,this.stageClearOverlay.hide(),this.isClearRewardOpen=!1,this.isOpeningClearReward=!1,this.wormholeTransitionTimer=0,this.pendingWormholeTransition=null,this.wormholeTunnelEffect.clear(),this.damageTimer=0,this.elapsedTime=0,this.destinationPlanetSpinTarget=null,this.planetRingEffect.clear(),this.isHomeConfirmOpen=!1,this.shouldResumeAfterHomeConfirm=!1,this.isPauseOpen=!1,this.shouldResumeAfterPause=!1,this.pauseOverlay.hide(),this.touchGuideIdleTimer=0,this.hasSeenMoveInput=!1,this.touchGuideMode="intro",this.playTime=0,this.attemptStatsRecorded=!1,this.meteoriteHitTimes.length=0,this.meteoShowerAnnouncementTimer=0,this.spaceWeatherAnnouncementTimer=0,this.spaceWeatherAnnouncementMessage="",this.stageSpecialAnnouncementTimer=0,this.stageSpecialAnnouncementMessage="",this.assistTimer=0,this.assistMessageTimer=0,this.assistDirection=null,this.assistDirectionRefreshTimer=0,this.adaptiveTutorialSystem.reset(),this.adaptiveHintDisplayTimer=0,this.adaptiveTutorialHint.hide(),this.meteoShowerEventSystem.reset(),this.spaceWeatherEventSystem.reset(),this.stageSpecialEventSystem.setStage(Le(this.stageNumber)),this.meteoShowerEffect.clear(),this.spaceWeatherEffect.clear(),this.stageSpecialEffects.clear(),this.resetBoostHintState();const e=t.totalScore??0,s=t.totalStarCount??0,i=this.saveManager.load();this.spaceship.applyCustomization(i.spaceshipCustomization??Tt);const n=i.colorAccessibility?.highContrast===!0;this.motionSensitivity=i.colorAccessibility?.motionSensitivity??Z();const a=i.colorAccessibility?.colorVisionSupportMode??$;Ut(i.vibrationSettings?.intensity??"medium"),Lt(f=>this.handleVibrationFallback(f)),$e(n),_e(a),Ve(n),this.hud.setHighContrastMode(n),this.scorePopupManager.setHighContrastMode(n),this.adaptiveTutorialHint.setHighContrastMode(n),this.constellationHintOverlay.setHighContrastMode(n),this.seasonalEventNotice.setHighContrastMode(n),this.stageEntryTotalScore=e,this.stageEntryTotalStarCount=s,this.scoreSystem.setTotalScore(e),this.scoreSystem.setTotalStarCount(s),this.resetStageObjects(),this.spaceship.reset(),this.inputSystem.resetPointers?.(),this.airShield.reset(0,0,0),this.boostLinesEffect.update(!1,0,0),this.boostFlameEffect.remove(),this.rainbowTrailEffect.clear(),this.companionManager?.resetUnlockedPlanets([]),this.createBackground(),this.stageAtmosphereEffect.start(Xt(this.stageNumber)),this.applyMotionSensitivity(),this.applyVisualQualityTier();const o=this.seasonalEventSystem.refresh();o&&(this.seasonalEventEffects.start(o),this.seasonalEventNotice.show(o)),this.camera.position.set(0,5,10),this.camera.lookAt(0,0,-10),this.cameraLookAtTarget.set(0,0,-10),this.createDestinationPlanet(),this.scheduleNextStageVisualPrewarm(),this.stars.length=0,this.meteorites.length=0,this.shootingStars.length=0,this.comets.length=0,this.specialShootingStars.length=0,this.monthlyEncounters.length=0,this.spawnSystem.reset(),this.spawnSystem.setMeteoriteIntervalMultiplier(1),this.specialStarSpawnSystem.reset(),this.monthlyEncounterSystem.reset(),this.boostSystem.reset(),this.scoreSystem.resetStage(),this.constellationSystem.reset(He(this.stageNumber)),this.constellationLineEffect.clear(),this.spawnConstellationStars();const h=this.constellationSystem.getDefinition();h?this.constellationHintOverlay.showHint(h.hintMessage):this.constellationHintOverlay.hide();const c=Wt(this.stageNumber,this.stageConfig.destinationReading,a),m=`ステージ${this.stageConfig.stageNumber}: ${this.stageConfig.emoji} ${c}を めざせ！`;this.hud.show(m,this.stageConfig.planetColor),this.hud.setBoostCallback(()=>{this.inputSystem.setBoostPressed(!0)}),this.hud.setBoostDeniedCallback(()=>{this.audioManager.playSFX("boostDenied")}),this.hud.setHomeCallback(()=>{this.isHomeConfirmOpen=!1,this.shouldResumeAfterHomeConfirm=!1,this.syncBoostInputLock(),this.syncPauseAvailability(),this.sceneManager.requestTransition("title")}),this.hud.setHomeConfirmOpenCallback(()=>{this.shouldResumeAfterHomeConfirm=this.isPlaying(),this.clearBlockedGameplayInput(),this.isHomeConfirmOpen=!0,this.syncBoostInputLock(),this.syncPauseAvailability()}),this.hud.setHomeConfirmCancelCallback(()=>{const f=this.shouldResumeAfterHomeConfirm;if(this.isHomeConfirmOpen=!1,this.shouldResumeAfterHomeConfirm=!1,this.syncPauseAvailability(),f){this.requestResumeCountdown();return}this.syncBoostInputLock()}),this.hud.setPauseCallback(()=>{this.requestManualPause()}),this.hud.setMuteState(this.audioManager.isMuted()),this.hud.setMuteCallback(()=>{const f=this.audioManager.toggleMute();this.hud.setMuteState(f);const b=this.saveManager.load();b.muted=f,this.saveManager.save(b)}),this.hud.update(this.scoreSystem.getStageScore(),this.scoreSystem.getStarCount()),this.hud.hideAssistMessage(),this.adaptiveTutorialHint.hide(),this.touchGuide.show("intro"),this.syncPauseAvailability(),this.hud.setBestStarCount(i.bestStageStars?.[this.stageNumber]??0),this.companionManager?.resetUnlockedPlanets(i.unlockedPlanets),this.bgStars&&ct(this.bgStars,this.spaceship.position.z,xt),this.audioManager.playBGM(this.stageNumber),this.stageIntroOverlay?.dispose(),this.stageIntroOverlay=null,this.startOpeningSequence(t)}prefetchEndingSceneModuleIfNeeded(){if(this.stageNumber<L-1)return;this.sceneManager.prefetchSceneModule?.call(this.sceneManager,"ending")?.catch(()=>{})}startOpeningSequence(t){if(this.isStarting=!0,this.syncBoostInputLock(),this.syncPauseAvailability(),!this.shouldShowStageIntro(t)){this.startCountdown();return}const e=ht(this.stageNumber);if(!e){this.startCountdown();return}this.stageIntroOverlay=new Cs(e),this.stageIntroOverlay.show(()=>{this.stageIntroOverlay=null,this.startCountdown()})}startCountdown(){if(this.isStarting=!0,this.syncBoostInputLock(),this.syncPauseAvailability(),this.shouldSkipCountdown()){this.isStarting=!1,this.countdownOverlay=null,this.syncBoostInputLock(),this.syncPauseAvailability();return}this.countdownOverlay=new _t({onTick:()=>{this.audioManager.playSFX("countdownTick")},onGo:()=>{this.audioManager.playSFX("countdownGo")}}),this.countdownOverlay.show(()=>{this.isStarting=!1,this.countdownOverlay=null,this.syncBoostInputLock(),this.syncPauseAvailability()})}shouldShowStageIntro(t){return this.shouldSkipCountdown()||this.launchSource!=="campaign"||t.replayToken!==void 0||t.totalScore===void 0||t.totalStarCount===void 0?!1:ht(this.stageNumber)!==void 0}releasePointerInputForLock(){this.inputSystem.resetPointers?.()}syncBoostInputLock(){const t=this.isStarting||this.awaitingResume||this.isHomeConfirmOpen||this.isPauseOpen;this.hud.setBoostLocked(t),t&&(this.resetBoostHintState(),this.inputSystem.setBoostPressed?.(!1))}clearBlockedGameplayInput(){this.inputSystem.resetPointers?.(),this.inputSystem.setBoostPressed?.(!1)}syncPauseAvailability(){this.hud.setPauseEnabled(this.canPause())}shouldSkipCountdown(){try{return new URLSearchParams(window.location.search).get("nocount")==="1"}catch{return!1}}isPlaying(){return!(!this.stageConfig||this.isCleared||this.isClearRewardOpen||this.isOpeningClearReward||this.isStarting||this.awaitingResume||this.isHomeConfirmOpen||this.isPauseOpen)}isUserPaused(){return this.isPauseOpen}requestResumeCountdown(){this.isPlaying()&&(this.resumeCountdownOverlay||this.shouldSkipCountdown()||(this.clearBlockedGameplayInput(),this.awaitingResume=!0,this.syncBoostInputLock(),this.syncPauseAvailability(),this.resumeCountdownOverlay=new _t({onTick:()=>{this.audioManager.playSFX("countdownTick")},onGo:()=>{this.audioManager.playSFX("countdownGo")}}),this.resumeCountdownOverlay.show(()=>{this.awaitingResume=!1,this.resumeCountdownOverlay=null,this.syncBoostInputLock(),this.syncPauseAvailability()})))}setPauseHandlers(t){this.onPauseRequested=t.onPauseRequested??null,this.onResumeRequested=t.onResumeRequested??null,this.onExitHomeRequested=t.onExitHomeRequested??null}isManuallyPaused(){return this.isPauseOpen}requestManualPause(){this.canPause()&&(this.clearBlockedGameplayInput(),this.isPauseOpen=!0,this.syncBoostInputLock(),this.syncPauseAvailability(),this.pauseOverlay.show(()=>{this.isPauseOpen=!1,this.syncBoostInputLock(),this.syncPauseAvailability(),this.onResumeRequested?.()},()=>{this.isPauseOpen=!1,this.syncBoostInputLock(),this.syncPauseAvailability(),this.onExitHomeRequested?.()}),this.onPauseRequested?.())}canPause(){return!(!this.stageConfig||this.isCleared||this.isClearRewardOpen||this.isOpeningClearReward||this.isStarting||this.awaitingResume||this.isHomeConfirmOpen||this.isPauseOpen)}createBackground(){this.bgStars||(this.bgStars=se(this.getBackgroundStarDrawCount()),this.threeScene.add(this.bgStars))}createDestinationPlanet(){this.removeDestinationPlanet();const t=-(this.stageConfig.stageLength+50),{planet:e,spinTarget:s}=ee(this.stageNumber,this.stageConfig,t);this.destinationPlanet=e,this.destinationPlanetSpinTarget=s,this.threeScene.add(this.destinationPlanet)}scheduleNextStageVisualPrewarm(){const t=this.stageNumber+1;if(t>L)return;const e=this.prewarmRequestToken;this.scheduleIdleTask(()=>{!this.isActive||this.prewarmRequestToken!==e||Dt(t)})}removeDestinationPlanet(){this.destinationPlanet&&(this.destinationPlanet.parent?.remove(this.destinationPlanet),this.destinationPlanet=null,this.destinationPlanetSpinTarget=null)}resetStageObjects(){this.clearRewardOverlay?.hide(),this.stageClearOverlay.hide(),this.isClearRewardOpen=!1,this.isOpeningClearReward=!1,this.removeDestinationPlanet(),this.resetCameraShake(),this.planetRingEffect.clear(),this.scorePopupEffect.clear(),this.particleBurstManager.clear(this.threeScene),this.spawnSystem.recycleAll(),this.spawnSystem.setMeteoriteIntervalMultiplier(1),this.meteoShowerEventSystem.reset(),this.meteoShowerEffect.clear(),this.meteoShowerAnnouncementTimer=0,this.spaceWeatherEventSystem.reset(),this.spaceWeatherEffect.clear(),this.spaceWeatherAnnouncementTimer=0,this.spaceWeatherAnnouncementMessage="",this.stageSpecialEventSystem.reset(),this.stageSpecialEffects.clear(),this.seasonalEventSystem.clear(),this.seasonalEventEffects.clear(),this.monthlyEncounterEffect.clear(),this.stageAtmosphereEffect.clear(),this.wormholeTunnelEffect.clear(),this.wormholeTransitionTimer=0,this.pendingWormholeTransition=null,this.rainbowTrailEffect.clear(),this.stageSpecialAnnouncementTimer=0,this.stageSpecialAnnouncementMessage="",this.seasonalEventNotice.hide(),this.stars.length=0,this.meteorites.length=0,this.shootingStars.length=0,this.comets.length=0,this.specialShootingStars.length=0,this.monthlyEncounters.length=0,this.specialStarSpawnSystem.recycleAll(),this.specialStarSpawnSystem.reset(),this.monthlyEncounterSystem.recycleAll(),this.monthlyEncounterSystem.reset(),this.hud?.hideAssistMessage(),this.constellationHintOverlay.hide(),this.constellationLineEffect.clear(),this.constellationSystem.reset(),this.resetBoostHintState()}update(t){if(!this.initialized)return;if(this.isCleared)return this.resetBoostHintState(),this.clearTimer+=t,this.seasonalEventNotice.tick(t),this.constellationHintOverlay.tick(t),this.constellationLineEffect.update(t),this.planetRingEffect.update(t),this.monthlyEncounterEffect.update(t),this.scorePopupEffect.update(t),this.particleBurstManager.update(this.threeScene,t),this.companionManager?.update(t,this.spaceship.position.x,this.spaceship.position.y,this.spaceship.position.z),this.destinationPlanetSpinTarget&&(this.destinationPlanetSpinTarget.rotation.y+=t*v.DESTINATION_PLANET_SPIN_SPEED),this.seasonalEventEffects.update(t,this.spaceship.position.x,this.spaceship.position.z),this.pendingWormholeTransition||this.revealClearActionButtonsIfReady(),this.stageAtmosphereEffect.update(t,this.camera,this.spaceship.position.x,this.spaceship.position.z),this.updateWormholeTransition(t),void 0;if(this.isStarting||this.awaitingResume||this.isHomeConfirmOpen||this.isPauseOpen){if(this.resetBoostHintState(),this.hideAdaptiveTutorialHint(),this.seasonalEventNotice.tick(t),this.inputSystem.setBoostPressed?.(!1),!this.isHomeConfirmOpen&&!this.isPauseOpen){const r=this.stageIntroOverlay?.isActive()??!1;this.stageIntroOverlay?.tick(t),r||this.countdownOverlay?.tick(t),this.resumeCountdownOverlay?.tick(t)}this.destinationPlanetSpinTarget&&(this.destinationPlanetSpinTarget.rotation.y+=t*v.DESTINATION_PLANET_SPIN_SPEED),this.bgStars&&ct(this.bgStars,this.spaceship.position.z,xt),this.airShield.setPosition(this.spaceship.position.x,this.spaceship.position.y,this.spaceship.position.z),this.airShield.update(t),this.hud.update(this.scoreSystem.getStageScore(),this.scoreSystem.getStarCount()),this.constellationHintOverlay.tick(t),this.constellationLineEffect.update(t),this.seasonalEventEffects.update(t,this.spaceship.position.x,this.spaceship.position.z),this.monthlyEncounterEffect.update(t),this.stageAtmosphereEffect.update(t,this.camera,this.spaceship.position.x,this.spaceship.position.z);return}const e=this.inputSystem.getState();this.playTime+=t,this.seasonalEventNotice.tick(t),this.updateAssistTimers(t),this.updateMeteoShowerAnnouncement(t),this.updateSpaceWeatherAnnouncement(t),this.updateStageSpecialAnnouncement(t),this.updateAdaptiveHintDisplay(t),this.updateBoostHintDisplay(t),this.updateTouchGuide(e.moveDirection,t);const s=this.boostSystem.isActive(),i=this.boostSystem.isAvailable();e.boostPressed&&(this.boostSystem.activate()?(this.adaptiveTutorialSystem.recordBoostUsed(),this.audioManager.playSFX("boost"),X("boost"),this.audioManager.startBoostSFX(),this.boostFlameEffect.start()):this.audioManager.playSFX("boostDenied"),this.inputSystem.setBoostPressed(!1)),this.boostSystem.update(t),s&&!this.boostSystem.isActive()&&(this.audioManager.stopBoostSFX(),this.boostFlameEffect.stopEmitting()),!i&&this.boostSystem.isAvailable()&&(this.audioManager.playSFX("boostReady"),this.hud.flashBoostReady()),this.boostSystem.isActive()&&this.spaceship.speedState!=="BOOST"&&this.spaceship.activateBoost(),e.moveDirection===-1?this.spaceship.moveLeft(t):e.moveDirection===1&&this.spaceship.moveRight(t),this.spaceship.update(t),this.seasonalEventEffects.update(t,this.spaceship.position.x,this.spaceship.position.z);const n=this.spaceship.getProgress(this.stageConfig.stageLength),a=this.stageSpecialEventSystem.update(n,t);a.started&&a.event&&(this.stageSpecialEffects.start(a.event),this.showStageSpecialAnnouncement(a.event.message));const o=this.meteoShowerEventSystem.update(t);o.started&&(this.audioManager.playSFX("meteorShowerStart"),this.meteoShowerEffect.start(),this.showMeteoShowerAnnouncement());const h=this.spaceWeatherEventSystem.update(t);this.scoreSystem.setEventStarMultiplier?.(h.active&&h.event?h.event.starScoreMultiplier:1),h.started&&h.event&&(this.spaceWeatherEffect.start(h.event),this.showSpaceWeatherAnnouncement(h.event.message));const c=this.spawnSystem.update(t,this.spaceship.position.z,this.stageConfig,this.stars,this.meteorites,this.shootingStars,this.comets,{meteoShowerActive:o.active});for(const r of c.newStars)this.stars.push(r),this.threeScene.add(r.mesh);for(const r of c.newMeteorites)this.meteorites.push(r),this.threeScene.add(r.mesh);for(const r of c.newShootingStars)this.shootingStars.push(r),this.threeScene.add(r.mesh);for(const r of c.newComets)this.comets.push(r),this.threeScene.add(r.mesh);const m=this.specialStarSpawnSystem.update(t,this.spaceship.position.z,this.specialShootingStars,this.shootingStars,this.comets);for(const r of m.newSpecialStars)this.specialShootingStars.push(r),this.threeScene.add(r.mesh);const f=this.monthlyEncounterSystem.update(t,this.spaceship.position.z,this.monthlyEncounters,this.specialShootingStars,this.shootingStars,this.comets);for(const r of f.newMonthlyEncounters)this.monthlyEncounters.push(r),this.threeScene.add(r.mesh);this.lodSystem.update(this.spaceship.position,this.stars),this.lodSystem.update(this.spaceship.position,this.meteorites),this.companionManager?.update(t,this.spaceship.position.x,this.spaceship.position.y,this.spaceship.position.z);const b=this.companionManager?.getStarAttractionBonus()??0,g=this.collisionSystem.check(this.spaceship,this.stars,this.meteorites,b,this.shootingStars,this.comets,this.specialShootingStars,this.monthlyEncounters);if(g.shootingStarHit){const r=g.shootingStarHit;this.scoreSystem.addBonusScore(r.scoreBonus,r.position),this.scoreSystem.activateShootingStarBonus(Math.max(v.SHOOTING_STAR_SCORE_BONUS_DURATION,r.bonusDuration)),this.audioManager.playSFX("shootingStarCollect"),this.scorePopupManager.showLabel("☆ながれぼし☆",r.position,this.camera,"shooting-star"),this.particleBurstManager.emitShootingStar(this.threeScene,r.position.x,r.position.y,r.position.z)}if(g.cometHit){const r=g.cometHit;this.scoreSystem.addBonusScore(r.scoreBonus,r.position),this.scoreSystem.activateShootingStarBonus(r.bonusDuration),this.audioManager.playSFX("cometCollect"),this.particleBurstManager.emit(this.threeScene,r.position.x,r.position.y,r.position.z,12447743,50,!0),this.particleBurstManager.emit(this.threeScene,r.position.x,r.position.y,r.position.z,16777215,50,!0)}if(g.specialShootingStarHit){const r=g.specialShootingStarHit,u=ze(r.specialType),x=this.saveManager.markSpecialStarDiscovered?.(r.specialType)??!1;this.scoreSystem.addBonusScore(r.scoreBonus,r.position),this.audioManager.playSFX("shootingStarCollect"),X("rainbowCollect"),this.particleBurstManager.emitShootingStar(this.threeScene,r.position.x,r.position.y,r.position.z),this.particleBurstManager.emit(this.threeScene,r.position.x,r.position.y,r.position.z,vt[r.specialType].visual.trailColor,50,!0),this.particleBurstManager.emit(this.threeScene,r.position.x,r.position.y,r.position.z,vt[r.specialType].visual.auraColor,50,!0),this.scorePopupManager.showLabel(x&&u?`${u.emoji} ${u.reading}`:vt[r.specialType].label,r.position,this.camera,"special-star")}if(g.monthlyEncounterHit){const r=g.monthlyEncounterHit,u=Fe(r.encounterId),x=this.saveManager.markMonthlyEncounterDiscovered?.(r.encounterId)??!1;this.scoreSystem.addBonusScore(r.scoreBonus,r.position),this.audioManager.playSFX("shootingStarCollect"),X("rainbowCollect"),this.monthlyEncounterEffect.emit(r.position,u?.accentColor??16777215),this.particleBurstManager.emitShootingStar(this.threeScene,r.position.x,r.position.y,r.position.z),this.scorePopupManager.showLabel(x?"✨ あたらしい てんたい はっけん！":`${u?.emoji??"✨"} ${u?.reading??"てんたい"}`,r.position,this.camera,"monthly-encounter")}for(const r of g.starCollisions)this.scoreSystem.addStarScore(r.starType,r.position),r.starType==="RAINBOW"?(this.audioManager.playSFX("rainbowCollect"),this.rainbowTrailEffect.start(this.spaceship.position),this.particleBurstManager.emit(this.threeScene,r.position.x,r.position.y,r.position.z,16768256,50,!0)):(this.audioManager.playSFX("starCollect"),this.particleBurstManager.emit(this.threeScene,r.position.x,r.position.y,r.position.z,16768256,20,!1)),this.handleConstellationStarCollected(r);if(g.meteoriteCollision){if(g.meteoriteHit){const r=g.meteoriteHit;typeof r.handleCollision=="function"?r.handleCollision():(r.isActive=!1,r.mesh.visible=!1,X("meteoriteHit")),this.particleBurstManager.emit(this.threeScene,r.position.x,r.position.y,r.position.z,16755268,24,!1)}this.spaceship.onMeteoriteHit(),this.hud.announceMeteoriteHit(),this.recordMeteoriteHit(),this.boostSystem.cancel(),this.damageTimer=v.DAMAGE_FLASH_DURATION,this.startCameraShake("meteoriteHit"),this.audioManager.playSFX("meteoriteHit"),this.audioManager.stopBoostSFX(),this.boostFlameEffect.remove()}this.updateDamageEffect(t),this.cleanupPassedObjects(t),this.updateAdaptiveTutorial(e.moveDirection,t),this.updateCameraFollow(t),this.stageAtmosphereEffect.update(t,this.camera,this.spaceship.position.x,this.spaceship.position.z),this.monthlyEncounterEffect.update(t),this.rainbowTrailEffect.update(t,this.spaceship.position);for(const r of g.starCollisions)this.scorePopupManager.show(r.scoreValue,r.position,this.camera);if(this.stageNumber===10&&this.destinationPlanet){const r=1+Math.sin(this.elapsedTime*2)*.05;this.destinationPlanet.scale.set(r,r,r)}this.destinationPlanetSpinTarget&&(this.destinationPlanetSpinTarget.rotation.y+=t*v.DESTINATION_PLANET_SPIN_SPEED),this.elapsedTime+=t,this.bgStars&&ct(this.bgStars,this.spaceship.position.z,xt),this.meteoShowerEffect.update(o.active,t,this.spaceship.position.x,this.spaceship.position.z),this.stageSpecialEffects.update(a.active,t,this.spaceship.position.x,this.spaceship.position.z),this.spaceWeatherEffect.update(h.active,t,this.spaceship.position.x,this.spaceship.position.z),this.boostLinesEffect.update(this.boostSystem.isActive(),this.spaceship.position.x,this.spaceship.position.z),this.boostSystem.isActive()&&this.boostFlameEffect.emit(this.spaceship.position,this.boostSystem.getDurationProgress()),this.boostFlameEffect.update(t),this.airShield.setPosition(this.spaceship.position.x,this.spaceship.position.y,this.spaceship.position.z),this.boostSystem.isActive()?this.airShield.setShieldMode("BOOST"):this.spaceship.speedState==="SLOWDOWN"?this.airShield.setShieldMode("INVINCIBLE",1):this.spaceship.speedState==="RECOVERING"?this.airShield.setShieldMode("INVINCIBLE",this.spaceship.getSpeedStateRemainingRatio()):this.airShield.setShieldMode("OFF"),this.airShield.update(t),this.scorePopupEffect.update(t),this.particleBurstManager.update(this.threeScene,t),this.scoreSystem.update(t),this.constellationLineEffect.update(t),this.constellationHintOverlay.tick(t),this.hud.update(this.scoreSystem.getStageScore(),this.scoreSystem.getStarCount()),this.hud.updateCooldown(this.boostSystem.getCooldownProgress()),this.hud.updateStageProgress(n),n>=1&&this.onStageClear()}updateTouchGuide(t,e){if(this.assistTimer>0){this.setTouchGuideMode(this.getAssistTouchGuideMode());return}if(t!==0){this.touchGuideIdleTimer=0,this.hasSeenMoveInput=!0,this.setTouchGuideMode(t<0?"active-left":"active-right");return}if(!this.hasSeenMoveInput){this.setTouchGuideMode("intro");return}if(this.touchGuideIdleTimer+=e,this.touchGuideIdleTimer>=v.TOUCH_GUIDE_IDLE_DELAY){this.setTouchGuideMode("idle");return}this.setTouchGuideMode("hidden")}setTouchGuideMode(t){this.touchGuideMode!==t&&(this.touchGuideMode=t,this.touchGuide.setMode(t))}resetAssistNavigation(){this.meteoriteHitTimes.length=0,this.assistTimer=0,this.assistMessageTimer=0,this.assistDirection=null,this.assistDirectionRefreshTimer=0}updateAssistTimers(t){this.assistTimer>0&&(this.assistDirectionRefreshTimer=Math.max(0,this.assistDirectionRefreshTimer-t),this.assistDirectionRefreshTimer===0&&this.refreshAssistDirection(),this.assistTimer=Math.max(0,this.assistTimer-t),this.assistTimer===0&&(this.spawnSystem.setMeteoriteIntervalMultiplier(1),this.assistDirection=null,this.assistDirectionRefreshTimer=0)),this.assistMessageTimer>0&&(this.assistMessageTimer=Math.max(0,this.assistMessageTimer-t),this.assistMessageTimer===0&&this.syncAssistMessage())}updateMeteoShowerAnnouncement(t){this.meteoShowerAnnouncementTimer<=0||(this.meteoShowerAnnouncementTimer=Math.max(0,this.meteoShowerAnnouncementTimer-t),this.meteoShowerAnnouncementTimer===0&&this.syncAssistMessage())}updateSpaceWeatherAnnouncement(t){this.spaceWeatherAnnouncementTimer<=0||(this.spaceWeatherAnnouncementTimer=Math.max(0,this.spaceWeatherAnnouncementTimer-t),this.spaceWeatherAnnouncementTimer===0&&(this.spaceWeatherAnnouncementMessage="",this.syncAssistMessage()))}showMeteoShowerAnnouncement(){this.meteoShowerAnnouncementTimer=v.METEO_SHOWER_MESSAGE_DURATION,this.syncAssistMessage()}showSpaceWeatherAnnouncement(t){this.spaceWeatherAnnouncementMessage=t,this.spaceWeatherAnnouncementTimer=v.STAGE_SPECIAL_MESSAGE_DURATION,this.syncAssistMessage()}updateStageSpecialAnnouncement(t){this.stageSpecialAnnouncementTimer<=0||(this.stageSpecialAnnouncementTimer=Math.max(0,this.stageSpecialAnnouncementTimer-t),this.stageSpecialAnnouncementTimer===0&&(this.stageSpecialAnnouncementMessage="",this.syncAssistMessage()))}showStageSpecialAnnouncement(t){this.stageSpecialAnnouncementMessage=t,this.stageSpecialAnnouncementTimer=v.STAGE_SPECIAL_MESSAGE_DURATION,this.syncAssistMessage()}syncAssistMessage(){if(this.meteoShowerAnnouncementTimer>0){this.hud.showAssistMessage(v.METEO_SHOWER_MESSAGE);return}if(this.stageSpecialAnnouncementTimer>0&&this.stageSpecialAnnouncementMessage){this.hud.showAssistMessage(this.stageSpecialAnnouncementMessage);return}if(this.spaceWeatherAnnouncementTimer>0&&this.spaceWeatherAnnouncementMessage){this.hud.showAssistMessage(this.spaceWeatherAnnouncementMessage);return}if(this.assistMessageTimer>0){this.hud.showAssistMessage(v.ASSIST_MESSAGE);return}this.hud.hideAssistMessage()}resetBoostHintState(){this.boostHintDisplayTimer=0,this.hud?.hideBoostHint()}updateBoostHintDisplay(t){this.boostHintDisplayTimer>0&&(this.boostHintDisplayTimer=Math.max(0,this.boostHintDisplayTimer-t),this.boostHintDisplayTimer===0&&this.hud.hideBoostHint())}updateAdaptiveHintDisplay(t){this.adaptiveHintDisplayTimer<=0||(this.adaptiveHintDisplayTimer=Math.max(0,this.adaptiveHintDisplayTimer-t),this.adaptiveHintDisplayTimer===0&&this.adaptiveTutorialHint.hide())}hideAdaptiveTutorialHint(){this.adaptiveHintDisplayTimer=0,this.adaptiveTutorialHint.hide()}updateAdaptiveTutorial(t,e){const s=this.adaptiveTutorialSystem.update({deltaTime:e,moveDirection:t,shipX:this.spaceship.position.x,shipZ:this.spaceship.position.z,boostAvailable:this.boostSystem.isAvailable(),boostActive:this.boostSystem.isActive(),meteorites:this.meteorites});s&&this.showAdaptiveTutorialEvent(s)}showAdaptiveTutorialEvent(t){if(t.type==="boost"){this.hideAdaptiveTutorialHint(),this.hud.showBoostHint(t.message),this.boostHintDisplayTimer=v.BOOST_HINT_DURATION;return}this.resetBoostHintState(),this.adaptiveTutorialHint.show(t.message,t.type),this.adaptiveHintDisplayTimer=v.ADAPTIVE_HINT_DURATION}recordMeteoriteHit(){const t=this.playTime;for(this.meteoriteHitTimes.push(t);this.meteoriteHitTimes.length>0&&t-this.meteoriteHitTimes[0]>v.ASSIST_TRIGGER_HIT_WINDOW;)this.meteoriteHitTimes.shift();this.assistTimer>0||this.meteoriteHitTimes.length<v.ASSIST_TRIGGER_HIT_COUNT||this.activateAssistMode()}activateAssistMode(){this.assistTimer=v.ASSIST_DURATION,this.assistMessageTimer=v.ASSIST_MESSAGE_DURATION,this.assistDirectionRefreshTimer=0,this.refreshAssistDirection(),this.spawnSystem.setMeteoriteIntervalMultiplier(v.ASSIST_METEORITE_INTERVAL_MULTIPLIER),this.hud.showAssistMessage(v.ASSIST_MESSAGE),this.meteoriteHitTimes.length=0}refreshAssistDirection(){this.assistDirection=this.getSaferAssistDirection(),this.assistDirectionRefreshTimer=v.ASSIST_DIRECTION_REFRESH_INTERVAL}getAssistTouchGuideMode(){return this.assistDirection==="left"?"assist-left":this.assistDirection==="right"?"assist-right":"hidden"}getSaferAssistDirection(){const t=this.spaceship.position.x,e=this.spaceship.position.z,s=Math.min(t-2.5,-v.ASSIST_DIRECTION_SIDE_TARGET_X),i=Math.max(t+2.5,v.ASSIST_DIRECTION_SIDE_TARGET_X);let n=0,a=0;for(const c of this.meteorites){if(!c.isActive)continue;const m=e-c.position.z;if(m<0||m>v.ASSIST_DIRECTION_LOOKAHEAD)continue;const f=1+(v.ASSIST_DIRECTION_LOOKAHEAD-m)/7,b=Math.abs(c.position.x-s),g=Math.abs(c.position.x-i),r=Math.max(0,1-b/v.ASSIST_DIRECTION_SIDE_RANGE),u=Math.max(0,1-g/v.ASSIST_DIRECTION_SIDE_RANGE);n+=f*r,a+=f*u}const o=Math.abs(n-a),h=Math.max(n,a);return o<v.ASSIST_DIRECTION_DIFF_THRESHOLD||h>0&&o<h*v.ASSIST_DIRECTION_DIFF_RATIO?null:n<a?"left":"right"}updateDamageEffect(t){if(this.damageTimer>0){if(this.damageTimer-=t,this.damageTimer<=0){this.damageTimer=0,this.spaceship.mesh.rotation.z=0,this.spaceship.mesh.rotation.y=0,this.spaceship.mesh.visible=!0;return}const e=Math.sin(this.damageTimer*30)*.3;this.spaceship.mesh.rotation.z=e,this.spaceship.mesh.rotation.y=0;const s=Math.sin(this.damageTimer*20)>0;this.spaceship.mesh.visible=s}else this.spaceship.mesh.visible=!0}resetCameraShake(){this.cameraShakeTimer=0,this.cameraShakeElapsed=0,this.cameraShakeProfile=Ct.meteoriteHit,this.cameraShakeOffset.set(0,0,0)}startCameraShake(t="meteoriteHit"){this.cameraShakeProfile=Ct[t],this.cameraShakeTimer=this.cameraShakeProfile.duration,this.cameraShakeElapsed=0}handleVibrationFallback(t){t!=="meteoriteHit"&&this.startCameraShake(t)}updateCameraShake(t){if(this.cameraShakeTimer<=0){this.cameraShakeOffset.set(0,0,0);return}if(this.cameraShakeElapsed+=t,this.cameraShakeTimer=Math.max(0,this.cameraShakeTimer-t),this.cameraShakeTimer===0){this.cameraShakeOffset.set(0,0,0);return}const e=this.cameraShakeTimer/this.cameraShakeProfile.duration,s=this.cameraShakeElapsed*this.cameraShakeProfile.frequency,i=Et(this.motionSensitivity);this.cameraShakeOffset.set(Math.sin(s)*this.cameraShakeProfile.amplitudeX*e*i.cameraShakeScale,Math.cos(s*.8)*this.cameraShakeProfile.amplitudeY*e*i.cameraShakeScale,0)}updateCameraFollow(t){this.updateCameraShake(t);const e=Et(this.motionSensitivity),s=this.spaceship.position.x*.3+this.cameraShakeOffset.x,i=5+this.cameraShakeOffset.y,n=this.spaceship.position.z+12,a=e.cameraFollowResponsiveness;if(a>=1)this.camera.position.set(s,i,n);else{const o=1-Math.pow(1-a,Math.max(1,t*60));this.cameraPositionTarget.set(s,i,n),this.camera.position.lerp(this.cameraPositionTarget,o)}this.cameraLookAtTarget.set(this.spaceship.position.x*.5,0,this.spaceship.position.z-20),this.camera.lookAt(this.cameraLookAtTarget)}cleanupPassedObjects(t){const e=this.spaceship.position.z,s=e+30,i=this.stars;let n=0,a=0;for(let y=0;y<i.length;y++){const p=i[y];p.isCollected||p.position.z>s?(!p.isCollected&&p.position.z>s&&(a+=1),this.spawnSystem.releaseStar(p)):(p.update(t,e),n!==y&&(i[n]=p),n++)}i.length=n,a>0&&this.adaptiveTutorialSystem.recordMissedStars(a);const o=this.meteorites;let h=0;for(let y=0;y<o.length;y++){const p=o[y];!p.isActive||p.position.z>s?this.spawnSystem.releaseMeteorite(p):(p.isActive&&p.update(t,e),h!==y&&(o[h]=p),h++)}o.length=h;const c=this.shootingStars;let m=0;for(let y=0;y<c.length;y++){const p=c[y];p.isCollected||p.position.z>s?this.spawnSystem.releaseShootingStar(p):(p.update(t,e),m!==y&&(c[m]=p),m++)}c.length=m;const f=this.comets;let b=0;for(let y=0;y<f.length;y++){const p=f[y];p.isCollected||p.position.z>s?this.spawnSystem.releaseComet(p):(p.update(t,e),b!==y&&(f[b]=p),b++)}f.length=b;const g=this.specialShootingStars;let r=0;for(let y=0;y<g.length;y++){const p=g[y];p.isCollected||p.position.z>s?this.specialStarSpawnSystem.releaseSpecialStar(p):(p.update(t,e),r!==y&&(g[r]=p),r++)}g.length=r;const u=this.monthlyEncounters;let x=0;for(let y=0;y<u.length;y++){const p=u[y];p.isCollected||p.position.z>s?this.monthlyEncounterSystem.releaseMonthlyEncounter(p):(p.update(t,e),x!==y&&(u[x]=p),x++)}u.length=x}spawnConstellationStars(){const t=this.constellationSystem.getDefinition();if(t)for(let e=0;e<t.points.length;e++){const s=t.points[e],i=this.spawnSystem.acquireStar(s.x,s.y,s.z,"RAINBOW");i.setConstellationMarker(t.id,t.stageNumber,e),this.stars.push(i),this.threeScene.add(i.mesh)}}handleConstellationStarCollected(t){const e=this.constellationSystem.registerCollectedStar(t);if(!e.advanced||(e.lineSegment&&this.constellationLineEffect.addSegment(e.lineSegment.from,e.lineSegment.to),!e.completed))return;const s=this.constellationSystem.getDefinition();s&&(this.saveManager.markConstellationDiscovered?.(this.stageNumber),this.constellationHintOverlay.showCelebration(s.celebrationMessage),this.audioManager.playSFX("rainbowCollect"),this.particleBurstManager.emit(this.threeScene,t.position.x,t.position.y,t.position.z,9103615,42,!0))}onStageClear(){if(this.isCleared)return;this.isCleared=!0,this.clearTimer=0,this.stageClearOverlay.hide(),this.resetAssistNavigation(),this.meteoShowerAnnouncementTimer=0,this.spaceWeatherAnnouncementTimer=0,this.spaceWeatherAnnouncementMessage="",this.stageSpecialAnnouncementTimer=0,this.stageSpecialAnnouncementMessage="",this.meteoShowerEventSystem.reset(),this.meteoShowerEffect.clear(),this.spaceWeatherEventSystem.reset(),this.spaceWeatherEffect.clear(),this.scoreSystem.setEventStarMultiplier?.(1),this.stageSpecialEventSystem.reset(),this.stageSpecialEffects.clear(),this.rainbowTrailEffect.clear(),this.resetBoostHintState(),this.touchGuide.hide(),this.syncPauseAvailability();const t=this.saveManager.markStageCleared(this.stageNumber);if(this.audioManager.playSFX("stageClear"),X("stageClear"),this.audioManager.stopBoostSFX(),this.boostFlameEffect.remove(),this.destinationPlanet){const a=this.getDestinationPlanetEffectRadius(this.destinationPlanet);this.planetRingEffect.start(this.threeScene,this.destinationPlanet,a,this.stageConfig.planetColor,this.particleBurstManager)}const e=this.scoreSystem.getStarCount(),s=this.saveManager.load().bestStageStars?.[this.stageNumber]??0;this.saveManager.updateBestStageStars(this.stageNumber,e),this.recordAttemptStats(!0);const i=Math.max(s,e),n=e>s;t&&(this.companionManager?.addCompanion(this.stageNumber),this.prefetchClearRewardOverlay()),this.showClearMessage(n,e,t,i),this.hud.announceStageClear(e,t,n),n&&this.audioManager.playSFX("rainbowCollect")}getClearRewardOverlay(){return this.clearRewardOverlay?Promise.resolve(this.clearRewardOverlay):this.clearRewardOverlayPromise?this.clearRewardOverlayPromise:(this.clearRewardOverlayPromise=this.loadEncyclopediaOverlay().then(({EncyclopediaOverlay:t})=>{const e=new t;return this.clearRewardOverlay=e,e}).finally(()=>{this.clearRewardOverlayPromise=null}),this.clearRewardOverlayPromise)}isCurrentClearRewardRequest(t){return this.isActive&&this.clearRewardRequestToken===t}restoreClearRewardButton(){this.stageClearOverlay.setRewardOpen(!1)}prefetchClearRewardOverlay(){this.clearRewardOverlay||this.clearRewardOverlayPromise||this.getClearRewardOverlay().catch(()=>{})}async openClearRewardOverlay(t){if(this.isClearRewardOpen||this.isOpeningClearReward)return;const e=this.clearRewardRequestToken;this.isOpeningClearReward=!0,this.stageClearOverlay.setRewardOpen(!0);try{const s=this.clearRewardOverlay??await this.getClearRewardOverlay();if(!this.isCurrentClearRewardRequest(e))return;if(!s.showStageDetail(this.stageNumber,()=>{this.isCurrentClearRewardRequest(e)&&(this.isClearRewardOpen=!1,this.syncPauseAvailability(),this.restoreClearRewardButton())},{bestStageStars:{[this.stageNumber]:t},backLabel:"クリアへ もどる",colorVisionSupportMode:this.saveManager.load().colorAccessibility?.colorVisionSupportMode??$,discoveredConstellations:this.saveManager.load().discoveredConstellations??[],zIndex:50})){this.restoreClearRewardButton();return}this.isClearRewardOpen=!0,this.syncPauseAvailability()}catch{if(!this.isCurrentClearRewardRequest(e))return;this.restoreClearRewardButton()}finally{this.clearRewardRequestToken===e&&(this.isOpeningClearReward=!1,this.syncPauseAvailability(),this.isClearRewardOpen||this.restoreClearRewardButton())}}showClearMessage(t=!1,e,s=!1,i){const n=e??this.scoreSystem.getStarCount(),a=i??n,o=this.launchSource==="encyclopedia"?void 0:Ne(this.stageNumber),h=s?ht(this.stageNumber):void 0;this.stageClearOverlay.show({stageNumber:this.stageNumber,starCount:n,bestStarCount:a,isBestUpdated:t,continueLabel:this.launchSource==="encyclopedia"?"タイトルへ":this.stageNumber>=L?"おいわいへ":"つぎへ",nextEntry:o,rewardEntry:h,onContinue:()=>{this.handleStageComplete()},onRetry:()=>{this.handleStageRetry()},onReward:h?()=>{this.openClearRewardOverlay(n)}:void 0})}revealClearActionButtonsIfReady(){this.clearTimer<v.CLEAR_CONTINUE_DELAY||this.stageClearOverlay.enableContinue()}getDestinationPlanetEffectRadius(t){const e=new qe().setFromObject(t);if(e.isEmpty())return 15;const s=e.getSize(new q);return Math.max(s.x,s.y,s.z)*.5}handleStageComplete(){const{totalScore:t,totalStarCount:e}=this.scoreSystem.finalizeStage();if(this.shouldPlayWormholeTransition()){this.startWormholeTransition({stageNumber:this.stageNumber+1,totalScore:t,totalStarCount:e});return}if(this.launchSource==="encyclopedia"){this.sceneManager.requestTransition("title");return}this.stageNumber>=L?this.sceneManager.requestTransition("ending",{totalScore:t,totalStarCount:e}):this.sceneManager.requestTransition("stage",{stageNumber:this.stageNumber+1,totalScore:t,totalStarCount:e})}shouldPlayWormholeTransition(){return this.launchSource==="campaign"&&this.stageNumber<L}startWormholeTransition(t){if(this.pendingWormholeTransition)return;const e=t.stageNumber??this.stageNumber+1,s=U(e);this.pendingWormholeTransition=t,this.wormholeTransitionTimer=0,this.stageClearOverlay.hide(),this.clearRewardOverlay?.hide(),this.isClearRewardOpen=!1,this.isOpeningClearReward=!1,this.wormholeTunnelEffect.start({sourceColor:this.stageConfig.planetColor,targetColor:s.planetColor,duration:v.WORMHOLE_TRANSITION_DURATION,particleCount:72,rayCount:20}),this.audioManager.playSFX("wormhole")}updateWormholeTransition(t){if(!this.pendingWormholeTransition||(this.wormholeTransitionTimer+=t,this.wormholeTunnelEffect.update(t,this.camera),this.wormholeTransitionTimer<v.WORMHOLE_TRANSITION_DURATION))return!1;const e=this.pendingWormholeTransition;return this.pendingWormholeTransition=null,this.wormholeTransitionTimer=0,this.wormholeTunnelEffect.clear(),this.sceneManager.requestTransition("stage",e),!0}handleStageRetry(){const t={stageNumber:this.stageNumber,totalScore:this.stageEntryTotalScore,totalStarCount:this.stageEntryTotalStarCount,replayToken:Date.now()+Math.random()};this.launchSource!=="campaign"&&(t.launchSource=this.launchSource),this.sceneManager.requestTransition("stage",t)}recordAttemptStats(t){this.attemptStatsRecorded||(this.attemptStatsRecorded=!0,this.saveManager.recordGameplaySession?.({stageNumber:this.stageNumber,playTimeSeconds:this.playTime,collectedStars:this.scoreSystem.getStarCount(),boostUses:this.boostSystem.getActivationCount(),stageCleared:t}))}exit(){this.initialized&&(this.recordAttemptStats(this.isCleared),this.isActive=!1,this.prewarmRequestToken+=1,this.clearRewardRequestToken+=1,this.clearRewardOverlay?.hide(),this.stageClearOverlay.hide(),this.isClearRewardOpen=!1,this.isOpeningClearReward=!1,this.pauseOverlay.hide(),this.touchGuide.hide(),this.adaptiveTutorialHint.hide(),this.constellationHintOverlay.hide(),this.seasonalEventNotice.dispose(),this.frameRateHintOverlay.hide(),this.hud.hide(),this.scorePopupManager.dispose(),Lt(null),this.audioManager.stopBGM(),this.audioManager.stopBoostSFX(),this.wormholeTunnelEffect.clear(),this.pendingWormholeTransition=null,this.wormholeTransitionTimer=0,this.stageIntroOverlay&&(this.stageIntroOverlay.dispose(),this.stageIntroOverlay=null),this.countdownOverlay&&(this.countdownOverlay.dispose(),this.countdownOverlay=null),this.resumeCountdownOverlay&&(this.resumeCountdownOverlay.dispose(),this.resumeCountdownOverlay=null),this.isStarting=!1,this.awaitingResume=!1,this.isHomeConfirmOpen=!1,this.shouldResumeAfterHomeConfirm=!1,this.isPauseOpen=!1,this.shouldResumeAfterPause=!1,this.boostFlameEffect.remove(),this.boostLinesEffect.update(!1,this.spaceship.position.x,this.spaceship.position.z),this.airShield.reset(this.spaceship.position.x,this.spaceship.position.y,this.spaceship.position.z),this.planetRingEffect.clear(),this.meteoShowerEffect.clear(),this.spaceWeatherEffect.clear(),this.stageSpecialEffects.clear(),this.seasonalEventEffects.clear(),this.spaceWeatherEventSystem.reset(),this.seasonalEventSystem.clear(),this.scoreSystem.setEventStarMultiplier?.(1),this.frameRateHintOverlay.dispose(),this.resetStageObjects(),this.bgStars&&(this.bgStars.parent?.remove(this.bgStars),this.bgStars=null))}getThreeScene(){return this.threeScene}getCamera(){const{width:t,height:e}=H(),s=t/e;return s!==this.lastAspect&&Number.isFinite(s)&&s>0&&(this.camera.aspect=s,this.camera.updateProjectionMatrix(),this.lastAspect=s),this.camera}applyVisualQualityTier(){const t=this.getEffectiveVisualQualityTier();if(this.particleBurstManager.setQualityTier(t),this.lodSystem.setQualityTier(t),!this.initialized){this.bgStars&&this.bgStars.geometry.setDrawRange(0,this.getBackgroundStarDrawCount());return}this.boostLinesEffect.setQualityTier(t),this.boostFlameEffect.setQualityTier(t),this.stageAtmosphereEffect.setQualityTier(t),this.wormholeTunnelEffect.setQualityTier(t),this.bgStars&&this.bgStars.geometry.setDrawRange(0,this.getBackgroundStarDrawCount())}getBackgroundStarDrawCount(){const t=Et(this.motionSensitivity);return Math.max(1,Math.round(v.BG_STAR_COUNT*v.getVisualQualityScale(this.getEffectiveVisualQualityTier())*t.particleDensityScale))}applyMotionSensitivity(){this.initialized&&(this.boostLinesEffect.setMotionSensitivity(this.motionSensitivity),this.boostFlameEffect.setMotionSensitivity(this.motionSensitivity),this.stageAtmosphereEffect.setMotionSensitivity(this.motionSensitivity),this.wormholeTunnelEffect.setMotionSensitivity(this.motionSensitivity))}static clampVisualQualityTier(t){const e=v.VISUAL_QUALITY_SCALE_BY_TIER.length-1;return Math.max(0,Math.min(e,Math.round(t)))}static clampPerformanceAdaptationLevel(t){const e=v.VISUAL_QUALITY_SCALE_BY_TIER.length-1;return Math.max(0,Math.min(e,Math.round(t)))}static getVisualQualityScale(t){return v.VISUAL_QUALITY_SCALE_BY_TIER[v.clampVisualQualityTier(t)]}getEffectiveVisualQualityTier(){return v.clampVisualQualityTier(this.visualQualityTier-this.performanceAdaptationLevel)}}const Ns=Object.freeze(Object.defineProperty({__proto__:null,StageScene:v,__resetStageSceneSharedAssetCachesForTest:rs,__stageSceneSharedAssetCachesForTest:ls,prewarmStageVisualAssets:Dt},Symbol.toStringTag,{value:"Module"}));class Os{constructor(t,e,s,i,n={}){this.sceneManager=t,this.inputSystem=e,this.audioManager=s,this.saveManager=i,this.randomProvider=n.randomProvider??Math.random,this.effectSystem=n.effectSystem??new je({randomProvider:this.randomProvider}),this.stageDurationSeconds=n.stageDurationSeconds??8;const{width:a,height:o}=H();this.camera=new yt(60,a/o,.1,1400),this.camera.position.set(0,2.8,12),this.threeScene.background=new nt(32),this.directionalLight.position.set(4,6,5),this.stageAtmosphereEffect.init(this.threeScene),this.effectSystem.init(this.threeScene)}threeScene=new it;ambientLight=new ft(16777215,1.1);directionalLight=new Qt(16777215,.7);camera;stageAtmosphereEffect=new qt;randomProvider;effectSystem;stageDurationSeconds;overlayButtonCleanups=new Set;currentLookAt=new q;ship=null;companionManager=null;backgroundStars=null;currentPlanet=null;currentPlanetSpinTarget=null;overlay=null;stageLabel=null;companionBadge=null;currentStageNumber=1;currentStageConfig=U(1);stageTimeRemaining=0;lastAspect=0;isActive=!1;enter(t){this.isActive=!0,this.lastAspect=0,this.inputSystem.resetPointers?.(),this.setupSceneObjects(),this.createOverlay(),this.audioManager.playBGM(0)}update(t){if(!this.isActive||!this.ship)return;const e=Math.max(0,t),s=this.inputSystem.getState();s.moveDirection<0?this.ship.moveLeft(e):s.moveDirection>0&&this.ship.moveRight(e),this.ship.update(e);const i=this.ship.mesh.position;this.companionManager?.update(e,i.x,i.y+1.15,i.z+.8),this.effectSystem.update(e,i),this.stageAtmosphereEffect.update(e,this.camera,i.x,i.z),this.updateCamera(),this.updatePlanet(e),this.updateStageRotation(e),this.backgroundStars&&(this.backgroundStars.rotation.y+=e*.02,ct(this.backgroundStars,i.z,1))}exit(){this.isActive=!1,this.inputSystem.resetPointers?.(),this.audioManager.stopBGM(),this.effectSystem.clear(),this.stageAtmosphereEffect.clear(),this.companionManager?.dispose(),this.companionManager=null,this.ship?.dispose(),this.ship=null,this.clearPlanet(),this.backgroundStars&&(this.backgroundStars.parent?.remove(this.backgroundStars),this.backgroundStars=null);const t=Array.from(this.overlayButtonCleanups);this.overlayButtonCleanups.clear();for(const e of t)e();this.overlay?.remove(),this.overlay=null,this.stageLabel=null,this.companionBadge=null}getThreeScene(){return this.threeScene}getCamera(){const{width:t,height:e}=H(),s=t/e;return s!==this.lastAspect&&Number.isFinite(s)&&s>0&&(this.camera.aspect=s,this.camera.updateProjectionMatrix(),this.lastAspect=s),this.camera}setupSceneObjects(){this.threeScene.background=new nt(32),this.ambientLight.parent||this.threeScene.add(this.ambientLight),this.directionalLight.parent||this.threeScene.add(this.directionalLight),this.backgroundStars=se(2e3),this.backgroundStars.name="free-play-background-stars",this.threeScene.add(this.backgroundStars);const t=this.saveManager.load();this.ship=new Yt(t.spaceshipCustomization),this.ship.mesh.name="free-play-spaceship",this.ship.mesh.position.set(0,-.3,0),this.ship.boundaryMin=-9,this.ship.boundaryMax=9,this.threeScene.add(this.ship.mesh),this.companionManager=new Mt([...new Set(t.unlockedPlanets)]);const e=this.companionManager.getGroup();e.name="free-play-companions",this.threeScene.add(e),this.updateCompanionBadge(),this.applyStage(this.pickRandomStage())}createOverlay(){const t=document.getElementById("ui-overlay");if(!t)return;this.overlay=document.createElement("div"),this.overlay.setAttribute("data-free-play-overlay",""),this.overlay.style.cssText=`
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 100%;
      height: 100%;
      padding: 1rem 1.25rem;
      box-sizing: border-box;
      pointer-events: none;
    `;const e=document.createElement("div");e.style.cssText=`
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
    `;const s=document.createElement("div");s.style.cssText=`
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      padding: 0.85rem 1rem;
      border-radius: 1.5rem;
      background: rgba(7, 16, 56, 0.62);
      color: #fff;
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.24);
    `;const i=document.createElement("div");i.textContent="あそびの うちゅう",i.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 1.55rem;
      font-weight: 900;
      color: #ffe66d;
    `,this.stageLabel=document.createElement("div"),this.stageLabel.setAttribute("data-free-play-stage-label",""),this.stageLabel.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 1rem;
      font-weight: 700;
    `,this.companionBadge=document.createElement("div"),this.companionBadge.setAttribute("data-free-play-companion-count",""),this.companionBadge.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 0.95rem;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.92);
    `,s.append(i,this.stageLabel,this.companionBadge);const n=document.createElement("button");n.textContent="もどる",n.setAttribute("data-free-play-back-button",""),n.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 1.15rem;
      font-weight: 900;
      padding: 0.75rem 1.6rem;
      border: none;
      border-radius: 999px;
      background: linear-gradient(135deg, #7bd9ff, #b197fc);
      color: #1f2040;
      cursor: pointer;
      pointer-events: auto;
      touch-action: manipulation;
      transform: scale(1);
      transition: transform 0.08s ease-out;
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.22);
    `,this.overlayButtonCleanups.add(M(n,{onActivate:()=>{this.inputSystem.resetPointers?.(),this.sceneManager.requestTransition("title")},onPressChange:o=>{n.style.transform=o?"scale(0.96)":"scale(1)"}})),e.append(s,n);const a=document.createElement("div");a.style.cssText=`
      align-self: center;
      padding: 0.7rem 1.1rem;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.28);
      color: #fff;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 0.95rem;
      font-weight: 700;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    `,a.textContent="← → で ゆったり うちゅうさんぽ",this.overlay.append(e,a),t.appendChild(this.overlay),this.updateStageLabel(),this.updateCompanionBadge()}updateCamera(){if(!this.ship)return;const t=this.ship.mesh.position;this.camera.position.x+=(t.x*.32-this.camera.position.x)*.12,this.camera.position.y=2.8,this.camera.position.z=t.z+12,this.currentLookAt.set(t.x*.18,t.y+.4,t.z-18),this.camera.lookAt(this.currentLookAt)}updatePlanet(t){!this.currentPlanet||!this.ship||(this.currentPlanet.position.set(0,.5,this.ship.mesh.position.z-52),this.currentPlanet.rotation.y+=t*.08,this.currentPlanetSpinTarget?.rotateY(t*.22))}updateStageRotation(t){this.stageTimeRemaining-=t,!(this.stageTimeRemaining>0)&&this.applyStage(this.pickRandomStage(this.currentStageNumber))}applyStage(t){this.currentStageNumber=t,this.currentStageConfig=U(t),this.stageTimeRemaining=this.sampleStageDuration(),this.clearPlanet();const{planet:e,spinTarget:s}=ee(t,this.currentStageConfig,-52);e.name="free-play-stage-planet",this.currentPlanet=e,this.currentPlanetSpinTarget=s,this.threeScene.add(e),this.stageAtmosphereEffect.start(Xt(t)),this.effectSystem.setCurrentStage(t),this.updateStageLabel()}clearPlanet(){this.currentPlanet&&(this.currentPlanet.parent?.remove(this.currentPlanet),this.currentPlanet=null,this.currentPlanetSpinTarget=null)}updateStageLabel(){this.stageLabel&&(this.stageLabel.textContent=`${this.currentStageConfig.emoji} ${this.currentStageConfig.destinationReading}の そらで あそんでるよ`)}updateCompanionBadge(){if(!this.companionBadge)return;const t=this.companionManager?.getCount()??0;this.companionBadge.textContent=t>0?`👾 なかま ${t}にん と いっしょ！`:"👾 なかまを あつめると ここに くるよ！"}sampleStageDuration(){return this.stageDurationSeconds*(.8+this.randomProvider()*.4)}pickRandomStage(t){const e=Array.from({length:L},(n,a)=>a+1),s=t===void 0?e:e.filter(n=>n!==t),i=Math.min(s.length-1,Math.floor(this.randomProvider()*s.length));return s[i]}}const $s=Object.freeze(Object.defineProperty({__proto__:null,FreePlayScene:Os},Symbol.toStringTag,{value:"Module"}));let et=null,st=null;function Is(){if(!et){const l=new Bt,t=new Float32Array(3e3);for(let e=0;e<3e3;e++)t[e]=(Math.random()-.5)*200;l.setAttribute("position",new Rt(t,3)),et=l}return et}function Ds(){return st||(st=new kt({color:16777215,size:.3})),st}function Gs(){et=null,st=null}const Ls={getBgStarsGeometry:()=>et,getBgStarsMaterial:()=>st};class G{static CIRCLE_RADIUS=3;static POPIN_DELAY=.2;static POPIN_DURATION=.3;static BOUNCE_SPEED=3;static BOUNCE_HEIGHT=.5;static THANK_YOU_DELAY=2.5;threeScene;camera;lastAspect=0;sceneManager;saveManager;audioManager;overlay=null;muteHandle=null;bgStars=null;companionMeshes=[];companionGroup=null;circleX=[];circleZ=[];popinSettled=[];celebrationElapsed=0;thankYouShown=!1;canExit=!1;exitTriggered=!1;exitCta=null;constructor(t,e,s){this.sceneManager=t,this.saveManager=e,this.audioManager=s,this.threeScene=new it;const{width:i,height:n}=H();this.camera=new yt(60,i/n,.1,1e3),this.camera.position.set(0,0,5)}enter(t){this.lastAspect=0,this.canExit=!1,this.exitTriggered=!1,this.exitCta=null;const e=t.totalScore??0,s=t.totalStarCount??0;this.threeScene=new it,this.threeScene.background=new nt(48),this.bgStars=new Pt(Is(),Ds()),this.bgStars.userData.sharedAssets=!0,this.bgStars.rotation.set(0,0,0),this.threeScene.add(this.bgStars),this.threeScene.add(new ft(16777215,1));const i=this.saveManager.load();i.clearedStage=0,this.saveManager.save(i),this.audioManager.playBGM(-1),this.setupCelebration(),this.createOverlay(e,s),this.createMuteButton()}createMuteButton(){const t=document.getElementById("hud")??document.getElementById("ui-overlay");t&&(this.muteHandle=It({initialMuted:this.audioManager.isMuted(),container:t,onToggle:()=>{const e=this.audioManager.toggleMute();this.muteHandle?.setMuted(e);const s=this.saveManager.load();s.muted=e,this.saveManager.save(s)}}))}createOverlay(t,e){const s=document.getElementById("ui-overlay");if(!s)return;this.overlay=document.createElement("div"),this.overlay.setAttribute("data-ending-overlay",""),this.overlay.style.cssText=`
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
    `;const n=document.createElement("div");n.textContent=`スコア: ${t}`,n.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 1.8rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 0.5rem;
    `;const a=document.createElement("div");a.textContent=`⭐ ${e} こ あつめたよ！`,a.style.cssText=`
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
    `,this.overlay.appendChild(i),this.overlay.appendChild(n),this.overlay.appendChild(a),this.overlay.appendChild(this.exitCta),s.appendChild(this.overlay)}update(t){this.bgStars&&(this.bgStars.rotation.y+=t*.03),this.updateCelebration(t)}setupCelebration(){this.companionGroup=new dt,this.companionMeshes=[],this.circleX.length=0,this.circleZ.length=0,this.popinSettled.length=0,this.celebrationElapsed=0,this.thankYouShown=!1,this.canExit=!1,this.exitTriggered=!1;for(let t=0;t<K.length;t++){const e=K[t],s=Mt.createCompanionMesh(e),i=t*(2*Math.PI/K.length),n=Math.cos(i)*G.CIRCLE_RADIUS,a=Math.sin(i)*G.CIRCLE_RADIUS;this.circleX.push(n),this.circleZ.push(a),s.position.set(n,0,a),s.scale.set(0,0,0),this.companionMeshes.push(s),this.popinSettled.push(!1),this.companionGroup.add(s)}this.threeScene.add(this.companionGroup)}updateCelebration(t){if(this.companionMeshes.length===0)return;this.celebrationElapsed+=t;const e=G.POPIN_DELAY*(this.companionMeshes.length-1)+G.POPIN_DURATION,s=this.celebrationElapsed>e,i=s?Math.abs(Math.sin(this.celebrationElapsed*G.BOUNCE_SPEED))*G.BOUNCE_HEIGHT:0;for(let n=0;n<this.companionMeshes.length;n++){const a=this.companionMeshes[n];if(this.popinSettled[n]){s&&(a.position.y=i),a.rotation.y+=t*2;continue}const o=n*G.POPIN_DELAY;if(!(this.celebrationElapsed<o)){if(this.celebrationElapsed<o+G.POPIN_DURATION){const h=(this.celebrationElapsed-o)/G.POPIN_DURATION,c=this.bounceEase(h);a.scale.set(c,c,c)}else a.scale.set(1,1,1),this.popinSettled[n]=!0;s&&(a.position.y=i),a.rotation.y+=t*2}}!this.thankYouShown&&this.celebrationElapsed>=G.THANK_YOU_DELAY&&(this.showThankYouText(),this.thankYouShown=!0)}bounceEase(t){return t<.6?t/.6*1.2:1.2-(t-.6)/.4*.2}showThankYouText(){if(!this.overlay||!this.exitCta)return;const t=document.createElement("div");t.setAttribute("data-ending-thank-you",""),t.textContent="みんな ありがとう！",t.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 2rem;
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
      margin-bottom: 1.5rem;
      opacity: 0;
      transition: opacity 0.5s ease-in;
    `,this.overlay.insertBefore(t,this.exitCta),this.exitCta.style.visibility="visible",this.canExit=!0,requestAnimationFrame(()=>{t.style.opacity="1",this.exitCta&&(this.exitCta.style.opacity="1")})}handleOverlayPointerDown(t){if(!this.canExit||this.exitTriggered)return;const e=t.target;e instanceof HTMLElement&&e.closest("[data-mute-button]")||(this.exitTriggered=!0,this.sceneManager.requestTransition("title"))}exit(){this.audioManager.stopBGM(),this.bgStars&&(this.threeScene.remove(this.bgStars),this.bgStars=null),this.companionGroup&&(this.threeScene.remove(this.companionGroup),this.companionMeshes=[],this.companionGroup=null),this.overlay&&(this.overlay.remove(),this.overlay=null),this.exitCta=null,this.canExit=!1,this.exitTriggered=!1,this.muteHandle&&(this.muteHandle.remove(),this.muteHandle=null)}getThreeScene(){return this.threeScene}getCamera(){const{width:t,height:e}=H(),s=t/e;return s!==this.lastAspect&&Number.isFinite(s)&&s>0&&(this.camera.aspect=s,this.camera.updateProjectionMatrix(),this.lastAspect=s),this.camera}}const _s=Object.freeze(Object.defineProperty({__proto__:null,EndingScene:G,__endingSceneSharedAssetsForTest:Ls,__resetEndingSceneSharedAssetsForTest:Gs},Symbol.toStringTag,{value:"Module"}));export{_s as E,$s as F,Ns as S,Fs as T,M as a,At as c};
