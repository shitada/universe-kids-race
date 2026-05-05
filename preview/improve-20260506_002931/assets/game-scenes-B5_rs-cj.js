const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/EncyclopediaOverlay-BM1UKxxL.js","assets/game-core-C8flZALU.js","assets/three-CCkbs3tE.js"])))=>i.map(i=>d[i]);
import{g as et,D as vt,S as F,T as R,a as N,b as Lt,L as Yt,c as Vt,_ as yt,d as D,e as _,s as Ht,f as it,P as W,u as zt,C as Xt,h as Qt,i as Kt,B as Jt,j as te,M as ee,k as se,l as ie,m as ae,n as ne,o as oe,p as re,q as le,r as he,t as ce,v as Gt,W as de,A as ue,w as me,x as Nt,y as pe,z as St,E as fe,F as ge,R as ye,G as be,H as ve,I as Se,J as Ee,K as Pt,N as Ft,O as xe,Q as at,U as st,V as we,X as ut,Y as mt,Z as Ce,$ as Ae,a0 as Te,a1 as Me}from"./game-core-C8flZALU.js";import{m as Et,k as xt,i as wt,l as Ct,G as nt,q as Pe,a as Be,r as ke,M,g as H,D as Bt,R as kt,s as z,t as ct,u as V,h as X,P as dt,V as $,v as _t,w as Oe}from"./three-CCkbs3tE.js";class At{overlayEl=null;static COMPACT_HEIGHT_THRESHOLD=720;show(t){if(this.overlayEl)return;const e=document.getElementById("ui-overlay");if(!e)return;const s=this.isCompactHeight();this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-tutorial-overlay",""),this.overlayEl.style.cssText=`
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
    `,i.appendChild(a);const n=document.createElement("div");n.style.cssText=`
      display: flex;
      gap: ${s?"0.8rem":"1.5rem"};
      flex-wrap: wrap;
      justify-content: center;
      width: 100%;
      max-width: 90%;
    `,n.appendChild(this.createCard("👆","ひだり・みぎ を タッチ","うちゅうせんが うごくよ","swipe 2s ease-in-out infinite",s)),n.appendChild(this.createCard("🚀","ブースト ボタン","はやく すすめるよ！","boostPulse 1.5s ease-in-out infinite",s)),n.appendChild(this.createCard("⭐","ほしを あつめて","ゴールを めざそう！","starGlow 3s linear infinite",s)),i.appendChild(n);const o=document.createElement("button");o.textContent="とじる",o.style.cssText=`
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
    `,o.addEventListener("pointerdown",h=>{h.stopPropagation(),t()}),i.appendChild(o),this.injectAnimations(),this.overlayEl.appendChild(i),e.appendChild(this.overlayEl)}hide(){this.overlayEl&&(this.overlayEl.remove(),this.overlayEl=null)}createCard(t,e,s,i,a){const n=document.createElement("div");n.setAttribute("data-tutorial-card",""),n.style.cssText=`
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
    `;const h=document.createElement("div");h.textContent=e,h.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${a?"0.95rem":"1.1rem"};
      font-weight: 700;
      color: #fff;
      margin-bottom: 0.4rem;
    `;const d=document.createElement("div");return d.textContent=s,d.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${a?"0.8rem":"0.9rem"};
      color: rgba(255, 255, 255, 0.7);
    `,n.appendChild(o),n.appendChild(h),n.appendChild(d),n}isCompactHeight(){return window.innerHeight<=At.COMPACT_HEIGHT_THRESHOLD}injectAnimations(){if(document.getElementById("tutorial-animations"))return;const t=document.createElement("style");t.id="tutorial-animations",t.textContent=`
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
    `,document.head.appendChild(t)}}class Re{overlayEl=null;activePressCleanups=new Set;show(t,e){if(this.overlayEl)return;const s=document.getElementById("ui-overlay");if(!s)return;this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-title-reset-confirm-overlay",""),this.overlayEl.setAttribute("role","dialog"),this.overlayEl.setAttribute("aria-modal","true"),this.overlayEl.setAttribute("aria-label","さいしょからに もどしますか"),this.overlayEl.style.cssText=`
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
    `;let i=!1;const a=()=>{i||(i=!0,this.hide(),e())},n=()=>{i||(i=!0,this.hide(),t())};this.overlayEl.addEventListener("pointerdown",c=>{c.target===this.overlayEl&&a()});const o=document.createElement("div");o.setAttribute("data-title-reset-confirm-card",""),o.style.cssText=`
      width: min(88vw, 26rem);
      padding: 1.6rem 1.4rem;
      border-radius: 1.7rem;
      background: rgba(0, 0, 64, 0.9);
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.42);
      text-align: center;
      color: #fff;
    `,o.addEventListener("pointerdown",c=>{c.stopPropagation()}),this.overlayEl.appendChild(o);const h=document.createElement("div");h.textContent="さいしょからに する？",h.style.cssText=`
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
    `,o.appendChild(d);const u=document.createElement("div");u.style.cssText=`
      display: flex;
      gap: 0.8rem;
      justify-content: center;
      flex-wrap: wrap;
    `,o.appendChild(u);const g=`
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
    `,p=(c,m)=>{let S=!1,x=!1;const C=()=>{T(!0)},w=()=>{c.style.transform="scale(0.92)"},L=()=>{c.style.transform="scale(1)"},T=(b=!1)=>{S=!1,x=b,L(),this.activePressCleanups.delete(C),document.removeEventListener("pointerup",v,!0),document.removeEventListener("pointercancel",E,!0)},v=b=>{const I=b.target===c||b.target instanceof Node&&c.contains(b.target),tt=S&&I;T(!I),tt&&m()},E=()=>{T(!0)};c.addEventListener("pointerdown",b=>{b.stopPropagation(),S=!0,x=!1,w(),this.activePressCleanups.add(C),document.addEventListener("pointerup",v,!0),document.addEventListener("pointercancel",E,!0)}),c.addEventListener("pointerenter",()=>{S&&w()}),c.addEventListener("pointerleave",()=>{S&&L()}),c.addEventListener("pointercancel",()=>T(!0)),c.addEventListener("click",b=>{if(b.stopPropagation(),x){x=!1;return}S||m()})},r=document.createElement("button");r.setAttribute("data-title-reset-cancel",""),r.textContent="やめる",r.style.cssText=g,r.style.background="rgba(255, 255, 255, 0.18)",r.style.color="#ffffff",p(r,a),u.appendChild(r);const f=document.createElement("button");f.setAttribute("data-title-reset-confirm",""),f.textContent="うん！ さいしょから",f.style.cssText=g,f.style.background="linear-gradient(135deg, #FF9F68, #FFE66D)",f.style.color="#3b1f00",p(f,n),u.appendChild(f),s.appendChild(this.overlayEl)}hide(){if(!this.overlayEl)return;const t=Array.from(this.activePressCleanups);this.activePressCleanups.clear();for(const e of t)e();this.overlayEl.remove(),this.overlayEl=null}}function Tt(l){const t=l.topRem??.8,e=window.innerHeight<=500,s=document.createElement("button");let i=l.initialMuted;const a=()=>{s.textContent=i?"🔇":"🔊",s.setAttribute("aria-label",i?"サウンド オフ":"サウンド オン")};s.setAttribute("data-mute-button",""),s.style.position="absolute",s.style.top=`${t}rem`,s.style.right="1rem",s.style.fontSize=e?"clamp(1.1rem, 3.5vmin, 1.4rem)":"clamp(1.4rem, 4vmin, 1.8rem)",s.style.background="rgba(255, 255, 255, 0.15)",s.style.border="none",s.style.borderRadius="50%",s.style.width=e?"2.4rem":"3rem",s.style.height=e?"2.4rem":"3rem",s.style.display="flex",s.style.alignItems="center",s.style.justifyContent="center",s.style.cursor="pointer",s.style.pointerEvents="auto",s.style.touchAction="manipulation",s.style.transform="scale(1)",s.style.transition="transform 0.08s ease-out",a();const n=()=>{s.style.transform="scale(1)"};return s.addEventListener("pointerdown",o=>{o.stopPropagation(),s.style.transform="scale(0.9)",l.onToggle()}),s.addEventListener("pointerup",n),s.addEventListener("pointercancel",n),s.addEventListener("pointerleave",n),l.container.appendChild(s),{element:s,setMuted(o){i=o,a()},remove(){s.remove()}}}class Ie{overlay=null;toggleButton=null;descriptionEl=null;highContrast=!1;vibrationIntensity="medium";motionSensitivity="strong";vibrationDescriptionEl=null;vibrationButtons=new Map;motionDescriptionEl=null;motionButtons=new Map;motionPreviewEl=null;motionPreviewTokenEl=null;motionPreviewCaptionEl=null;motionPreviewTimeoutId=null;motionPreviewFrameId=null;onToggle=null;onVibrationIntensityChange=null;onMotionSensitivityChange=null;show(t){const e=document.getElementById("ui-overlay");if(e){if(this.highContrast=t.initialHighContrast,this.vibrationIntensity=t.initialVibrationIntensity,this.motionSensitivity=t.initialMotionSensitivity,this.onToggle=t.onToggle,this.onVibrationIntensityChange=t.onVibrationIntensityChange,this.onMotionSensitivityChange=t.onMotionSensitivityChange,!this.overlay){this.overlay=document.createElement("div"),this.overlay.setAttribute("data-color-accessibility-settings",""),this.overlay.style.cssText=`
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
      `;const i=document.createElement("h2");i.textContent="みやすさ・しんどう せってい",i.style.cssText="margin: 0 0 0.65rem; font-size: clamp(1.25rem, 4.6vmin, 1.7rem);",this.descriptionEl=document.createElement("p"),this.descriptionEl.style.cssText="margin: 0 0 1rem; font-size: clamp(0.95rem, 3.4vmin, 1.05rem); line-height: 1.55;",this.toggleButton=document.createElement("button"),this.toggleButton.setAttribute("data-color-accessibility-toggle",""),this.toggleButton.style.cssText=`
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
      `,this.toggleButton.addEventListener("click",()=>{this.highContrast=!this.highContrast,this.render(),this.onToggle?.(this.highContrast)});const a=document.createElement("h3");a.textContent="しんどうの つよさ",a.style.cssText="margin: 1.1rem 0 0.45rem; font-size: clamp(1rem, 3.8vmin, 1.2rem);",this.vibrationDescriptionEl=document.createElement("p"),this.vibrationDescriptionEl.style.cssText="margin: 0 0 0.8rem; font-size: clamp(0.9rem, 3.2vmin, 1rem); line-height: 1.5;";const n=document.createElement("div");n.setAttribute("data-vibration-intensity-group",""),n.style.cssText=`
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.65rem;
        margin-bottom: 0.95rem;
      `;const o=[{value:"strong",label:"つよい"},{value:"medium",label:"ふつう"},{value:"weak",label:"やさしい"},{value:"off",label:"オフ"}];for(const c of o){const m=document.createElement("button");m.setAttribute("data-vibration-intensity-button",c.value),m.textContent=c.label,m.style.cssText=`
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
        `,m.addEventListener("click",()=>{this.vibrationIntensity=c.value,this.render(),this.onVibrationIntensityChange?.(c.value)}),this.vibrationButtons.set(c.value,m),n.appendChild(m)}const h=document.createElement("h3");h.textContent="うごきの つよさ",h.style.cssText="margin: 1.1rem 0 0.45rem; font-size: clamp(1rem, 3.8vmin, 1.2rem);";const d=document.createElement("p");d.textContent="えらんで みると うごきの おためしが みえるよ",d.style.cssText="margin: 0 0 0.5rem; font-size: clamp(0.9rem, 3.2vmin, 1rem); line-height: 1.5;",this.motionDescriptionEl=document.createElement("p"),this.motionDescriptionEl.style.cssText="margin: 0 0 0.8rem; font-size: clamp(0.9rem, 3.2vmin, 1rem); line-height: 1.5;";const u=document.createElement("div");u.setAttribute("data-motion-sensitivity-group",""),u.style.cssText=`
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.65rem;
        margin-bottom: 0.95rem;
      `;const g=["strong","medium","gentle","minimal"];for(const c of g){const m=et(c),S=document.createElement("button");S.setAttribute("data-motion-sensitivity-button",c),S.style.cssText=`
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
        `;const x=document.createElement("span");x.textContent=m.emoji,x.style.cssText="font-size: clamp(1.25rem, 4.8vmin, 1.7rem); line-height: 1;";const C=document.createElement("span");C.textContent=m.stars,C.style.cssText="font-size: clamp(0.82rem, 2.9vmin, 0.95rem); letter-spacing: 0.08em;";const w=document.createElement("span");w.textContent=m.shortLabel,w.style.cssText="font-size: clamp(0.9rem, 3vmin, 1rem);",S.append(x,C,w),S.addEventListener("click",()=>{this.motionSensitivity=c,this.render(),this.playMotionPreview(),this.onMotionSensitivityChange?.(c)}),this.motionButtons.set(c,S),u.appendChild(S)}this.motionPreviewEl=document.createElement("div"),this.motionPreviewEl.setAttribute("data-motion-preview",""),this.motionPreviewEl.style.cssText=`
        position: relative;
        min-height: 5.8rem;
        margin: 0 0 1rem;
        padding: 0.8rem 0.9rem;
        border-radius: 1.25rem;
        border: 2px solid rgba(255, 255, 255, 0.2);
        background: linear-gradient(180deg, rgba(14, 24, 60, 0.92), rgba(8, 14, 38, 0.96));
        overflow: hidden;
      `;const p=document.createElement("div");p.style.cssText=`
        position: relative;
        height: 2.7rem;
        margin-bottom: 0.7rem;
        border-radius: 999px;
        background: linear-gradient(90deg, rgba(255, 255, 255, 0.12), rgba(118, 240, 255, 0.22));
        box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.12);
      `;const r=document.createElement("div");r.style.cssText=`
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
      `,this.motionPreviewCaptionEl=document.createElement("p"),this.motionPreviewCaptionEl.setAttribute("data-motion-preview-caption",""),this.motionPreviewCaptionEl.style.cssText="margin: 0; font-size: clamp(0.9rem, 3vmin, 1rem); line-height: 1.5;",p.append(r,this.motionPreviewTokenEl),this.motionPreviewEl.append(p,this.motionPreviewCaptionEl);const f=document.createElement("button");f.textContent="とじる",f.style.cssText=`
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
      `,f.addEventListener("click",()=>this.hide()),s.appendChild(i),s.appendChild(this.descriptionEl),s.appendChild(this.toggleButton),s.appendChild(a),s.appendChild(this.vibrationDescriptionEl),s.appendChild(n),s.appendChild(h),s.appendChild(d),s.appendChild(this.motionDescriptionEl),s.appendChild(u),s.appendChild(this.motionPreviewEl),s.appendChild(f),this.overlay.appendChild(s)}this.render(),e.appendChild(this.overlay)}}hide(){this.clearMotionPreviewTimers(),this.overlay?.remove()}isVisible(){return this.overlay?.isConnected===!0}render(){if(!this.toggleButton||!this.descriptionEl||!this.vibrationDescriptionEl||!this.motionDescriptionEl)return;this.descriptionEl.textContent=this.highContrast?"いろだけじゃなく ふちや しまもようで わかりやすくしているよ。":"いろだけでなく かたちや うごきでも みわけられるようにするよ。",this.toggleButton.textContent=this.highContrast?"みやすくする: ON":"みやすくする: OFF",this.toggleButton.setAttribute("aria-pressed",this.highContrast?"true":"false");const t={strong:"しっかり つたえる しんどうだよ。",medium:"ちょうどよく わかる つよさだよ。",weak:"やさしく ふるえて つたえるよ。",off:"しんどうの かわりに がめんが すこし ゆれるよ。"};this.vibrationDescriptionEl.textContent=t[this.vibrationIntensity];for(const[s,i]of this.vibrationButtons.entries()){const a=s===this.vibrationIntensity;i.setAttribute("aria-pressed",a?"true":"false"),i.style.borderColor=a?"#fff27a":"rgba(255, 255, 255, 0.4)",i.style.background=a?"linear-gradient(135deg, rgba(255, 242, 122, 0.94), rgba(118, 240, 255, 0.92))":"rgba(255, 255, 255, 0.08)",i.style.color=a?"#102040":"#fff",i.style.transform=a?"scale(1.02)":"scale(1)"}const e=et(this.motionSensitivity);this.motionDescriptionEl.textContent=e.description;for(const[s,i]of this.motionButtons.entries()){const a=s===this.motionSensitivity;i.setAttribute("aria-pressed",a?"true":"false"),i.style.borderColor=a?"#fff27a":"rgba(255, 255, 255, 0.4)",i.style.background=a?"linear-gradient(135deg, rgba(255, 242, 122, 0.94), rgba(118, 240, 255, 0.92))":"rgba(255, 255, 255, 0.08)",i.style.color=a?"#102040":"#fff",i.style.transform=a?"scale(1.02)":"scale(1)"}this.motionPreviewEl?.dataset.previewActive!=="true"&&this.resetMotionPreview()}playMotionPreview(){if(!this.motionPreviewEl||!this.motionPreviewTokenEl||!this.motionPreviewCaptionEl)return;this.clearMotionPreviewTimers();const t=et(this.motionSensitivity);this.motionPreviewEl.dataset.previewActive="true",this.motionPreviewTokenEl.textContent=t.emoji,this.motionPreviewTokenEl.style.background="rgba(255, 242, 122, 0.92)",this.motionPreviewTokenEl.style.boxShadow=t.previewGlow,this.motionPreviewTokenEl.style.transition="none",this.motionPreviewTokenEl.style.left="0.35rem",this.motionPreviewTokenEl.style.transform="translateY(-50%) scale(1)",this.motionPreviewCaptionEl.textContent=`${t.emoji} ${t.shortLabel} で おためしちゅう`,this.motionPreviewFrameId=window.requestAnimationFrame(()=>{this.motionPreviewTokenEl&&(this.motionPreviewTokenEl.style.transition=`left ${t.previewDurationMs}ms ease-in-out, transform ${t.previewDurationMs}ms ease-in-out`,this.motionPreviewTokenEl.style.left="calc(100% - 2.45rem)",this.motionPreviewTokenEl.style.transform=`translateY(-50%) scale(${t.previewScale})`)}),this.motionPreviewTimeoutId=window.setTimeout(()=>{this.resetMotionPreview()},t.previewDurationMs+260)}resetMotionPreview(){if(!this.motionPreviewEl||!this.motionPreviewTokenEl||!this.motionPreviewCaptionEl)return;const t=et(this.motionSensitivity);this.motionPreviewEl.dataset.previewActive="false",this.motionPreviewTokenEl.textContent=t.emoji,this.motionPreviewTokenEl.style.transition="none",this.motionPreviewTokenEl.style.left="0.35rem",this.motionPreviewTokenEl.style.transform="translateY(-50%) scale(1)",this.motionPreviewTokenEl.style.background="rgba(255, 242, 122, 0.92)",this.motionPreviewTokenEl.style.boxShadow=t.previewGlow,this.motionPreviewCaptionEl.textContent=`${t.stars} ${t.shortLabel} を えらぶと おためしするよ`}clearMotionPreviewTimers(){this.motionPreviewTimeoutId!==null&&(window.clearTimeout(this.motionPreviewTimeoutId),this.motionPreviewTimeoutId=null),this.motionPreviewFrameId!==null&&(window.cancelAnimationFrame(this.motionPreviewFrameId),this.motionPreviewFrameId=null)}}function A(l,t){let e=!1,s=!1,i=null,a=null;const n=t.documentTarget??document,o=t.stopPropagation??!0,h=()=>{t.canActivate?.()!==!1&&t.onActivate()},d=v=>{t.onPressChange?.(v)},u=v=>{const E=v;return typeof E.clientX=="number"&&typeof E.clientY=="number"?{x:E.clientX,y:E.clientY}:null},g=v=>{const E=v;return typeof E.pointerId=="number"?E.pointerId:null},p=v=>{const E=g(v);return i===null||E===null||E===i},r=v=>{if(!e||a===null||t.moveTolerancePx===void 0)return!1;const E=u(v);return E===null?!1:Math.hypot(E.x-a.x,E.y-a.y)>t.moveTolerancePx},f=v=>{e=!1,s=v,i=null,a=null,d(!1),n.removeEventListener("pointermove",S,!0),n.removeEventListener("pointerup",c,!0),n.removeEventListener("pointercancel",m,!0)},c=v=>{if(!e||!p(v))return;if(r(v)){f(!0);return}const E=v.target,b=E===l||E instanceof Node&&l.contains(E),I=e&&b;f(I||!b),I&&h()},m=()=>{f(!0)},S=v=>{!e||!p(v)||r(v)&&f(!0)},x=v=>{t.canActivate?.()!==!1&&((t.preventDefaultOnPointerDown??!1)&&v.preventDefault(),o&&v.stopPropagation(),e=!0,s=!1,i=g(v),a=u(v),d(!0),t.moveTolerancePx!==void 0&&n.addEventListener("pointermove",S,!0),n.addEventListener("pointerup",c,!0),n.addEventListener("pointercancel",m,!0))},C=()=>{e&&d(!0)},w=()=>{e&&d(!1)},L=()=>{f(!0)},T=v=>{if(o&&v.stopPropagation(),(t.preventDefaultOnClick??!1)&&v.preventDefault(),s){s=!1;return}e||h()};return l.addEventListener("pointerdown",x),l.addEventListener("pointerenter",C),l.addEventListener("pointerleave",w),l.addEventListener("pointercancel",L),l.addEventListener("click",T),()=>{f(!1),l.removeEventListener("pointerdown",x),l.removeEventListener("pointerenter",C),l.removeEventListener("pointerleave",w),l.removeEventListener("pointercancel",L),l.removeEventListener("click",T)}}class De{overlay=null;previewBody=null;previewNose=null;previewWings=null;buttonCleanups=new Set;optionButtons=new Map;draft={...vt};colorOptions=F.getColorOptions();show(t){this.hide();const e=document.getElementById("ui-overlay");if(!e)return;this.draft=F.normalizeCustomization(t.initialCustomization),this.overlay=document.createElement("div"),this.overlay.setAttribute("data-spaceship-customizer",""),this.overlay.setAttribute("role","dialog"),this.overlay.setAttribute("aria-modal","true"),this.overlay.setAttribute("aria-label","うちゅうせんを かざろう"),this.overlay.style.cssText=`
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
    `,s.style.overflowY="hidden",s.style.height="100%",s.style.maxHeight="720px",s.addEventListener("pointerdown",d=>d.stopPropagation()),this.overlay.appendChild(s);const i=document.createElement("h2");i.textContent="うちゅうせんを かざろう",i.style.cssText="margin: 0 0 0.3rem; font-size: clamp(1.25rem, 4.3vmin, 1.85rem); color: #ffe66d;";const a=document.createElement("p");a.textContent="おおきな ボタンで えらぶと、すぐに みためが かわるよ。",a.style.cssText="margin: 0 0 0.45rem; font-size: clamp(0.85rem, 2.8vmin, 1rem); line-height: 1.35;",s.appendChild(i),s.appendChild(a);const n=document.createElement("div");n.setAttribute("data-spaceship-customizer-content",""),n.style.cssText="display: grid; grid-template-columns: minmax(12rem, 15rem) minmax(0, 1fr); gap: 0.65rem; align-items: stretch; margin: 0.45rem 0 0.65rem;",n.appendChild(this.createPreviewCard());const o=document.createElement("div");o.setAttribute("data-spaceship-customizer-sections",""),o.style.cssText="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.5rem; align-items: stretch;",o.appendChild(this.createPartSection("bodyColor","ほんたい")),o.appendChild(this.createPartSection("noseColor","ノーズ")),o.appendChild(this.createPartSection("wingColor","つばさ")),n.appendChild(o),s.appendChild(n);const h=document.createElement("button");h.textContent="かんりょう",h.setAttribute("data-spaceship-customizer-done",""),h.style.cssText=`
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
    `,this.buttonCleanups.add(A(h,{onActivate:()=>{const d={...this.draft};this.hide(),t.onComplete(d)},onPressChange:d=>{h.style.transform=d?"scale(0.96)":"scale(1)"}})),s.appendChild(h),e.appendChild(this.overlay),this.render()}hide(){const t=Array.from(this.buttonCleanups);this.buttonCleanups.clear();for(const e of t)e();this.optionButtons.clear(),this.overlay?.remove(),this.overlay=null,this.previewBody=null,this.previewNose=null,this.previewWings=null}isVisible(){return this.overlay?.isConnected===!0}createPreviewCard(){const t=document.createElement("div");t.setAttribute("data-spaceship-customizer-preview-card",""),t.style.cssText=`
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
    `,s.appendChild(this.previewWings),s.appendChild(this.previewBody),s.appendChild(this.previewNose),s.appendChild(a),t.appendChild(s),t}createPartSection(t,e){const s=document.createElement("div");s.style.cssText=`
      padding: 0.5rem 0.45rem;
      border-radius: 1.1rem;
      background: rgba(255, 255, 255, 0.08);
      text-align: left;
      box-sizing: border-box;
    `;const i=document.createElement("div");i.textContent=e,i.style.cssText="margin-bottom: 0.25rem; font-size: 0.88rem; font-weight: 900; color: #ffe66d; text-align: center;",s.appendChild(i);const a=document.createElement("div");a.style.cssText="display: grid; grid-template-columns: minmax(0, 1fr); gap: 0.32rem;";for(const n of this.colorOptions)a.appendChild(this.createColorButton(t,n));return s.appendChild(a),s}createColorButton(t,e){const s=document.createElement("button");s.type="button",s.setAttribute("data-spaceship-color-option",`${t}:${e.key}`),s.style.cssText=`
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
    `;const a=document.createElement("span");return a.textContent=e.label,a.style.cssText="font-family: Zen Maru Gothic, sans-serif; font-size: 0.82rem; font-weight: 700;",s.appendChild(i),s.appendChild(a),this.buttonCleanups.add(A(s,{onActivate:()=>this.selectColor(t,e.key),onPressChange:n=>{s.style.transform=n?"scale(0.95)":"scale(1)"}})),this.optionButtons.set(`${t}:${e.key}`,s),s}selectColor(t,e){this.draft={...this.draft,[t]:e},this.render()}render(){const t=F.normalizeCustomization(this.draft);this.draft=t,this.previewBody?.style.setProperty("background",`#${F.getColorHex(t.bodyColor).toString(16).padStart(6,"0")}`),this.previewWings?.style.setProperty("background",`#${F.getColorHex(t.wingColor).toString(16).padStart(6,"0")}`),this.previewNose&&(this.previewNose.style.borderBottomColor=`#${F.getColorHex(t.noseColor).toString(16).padStart(6,"0")}`);for(const e of this.colorOptions)this.renderOptionState("bodyColor",e.key,t.bodyColor===e.key),this.renderOptionState("noseColor",e.key,t.noseColor===e.key),this.renderOptionState("wingColor",e.key,t.wingColor===e.key)}renderOptionState(t,e,s){const i=this.optionButtons.get(`${t}:${e}`);i&&(i.setAttribute("aria-pressed",s?"true":"false"),i.style.borderColor=s?"#ffe66d":"transparent",i.style.background=s?"rgba(255, 230, 109, 0.18)":"rgba(255, 255, 255, 0.12)")}}function Le(l){return{totalPlayTimeSeconds:l?.totalPlayTimeSeconds??0,totalStarsCollected:l?.totalStarsCollected??0,totalBoostUses:l?.totalBoostUses??0,stageClearCounts:{...l?.stageClearCounts??{}}}}function He(l){const t=Math.max(0,Math.round(l)),e=Math.floor(t/3600),s=Math.floor(t%3600/60),i=t%60;return e>0?`${e}じかん ${s}ふん`:s>0?`${s}ふん ${i}びょう`:`${i}びょう`}class ze{overlayEl=null;actionCleanups=new Set;show(t,e){this.hide();const s=document.getElementById("ui-overlay");if(!s)return;const i=Le(t),a=window.innerHeight<=720,n=document.createElement("div");n.setAttribute("data-stats-overlay",""),n.style.cssText=`
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
    `,d.append(this.createSummaryCard("あそんだ じかん",He(i.totalPlayTimeSeconds),"data-stats-total-play-time"),this.createSummaryCard("とった ほし",`${i.totalStarsCollected}こ`,"data-stats-total-stars"),this.createSummaryCard("ブースト",`${i.totalBoostUses}かい`,"data-stats-total-boosts")),o.appendChild(d);const u=document.createElement("div");u.style.cssText=`
      margin-top: 0.5rem;
      padding: ${a?"0.9rem 0.8rem":"1rem"};
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.1);
    `;const g=document.createElement("div");g.textContent="ステージ クリア かいすう",g.style.cssText=`
      margin-bottom: 0.75rem;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${a?"1.1rem":"1.25rem"};
      font-weight: 900;
      color: #FFE66D;
    `,u.appendChild(g);const p=document.createElement("div");p.setAttribute("data-stats-stage-clears",""),p.style.cssText=`
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
      text-align: left;
    `;const r=Array.from({length:R},(c,m)=>m+1).map(c=>({stageNumber:c,clearCount:i.stageClearCounts[c]??0})).filter(c=>c.clearCount>0);if(r.length===0){const c=document.createElement("div");c.textContent="まだ きろくが ないよ",c.style.cssText=`
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${a?"1rem":"1.1rem"};
        font-weight: 700;
        text-align: center;
        color: rgba(255, 255, 255, 0.88);
      `,p.appendChild(c)}else for(const{stageNumber:c,clearCount:m}of r){const S=N(c),x=document.createElement("div");x.setAttribute("data-stats-stage-clear-row",String(c)),x.style.cssText=`
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
        `;const C=document.createElement("span");C.textContent=`${S.emoji} ステージ ${c} ${S.destinationReading}`;const w=document.createElement("span");w.textContent=`${m}かい`,w.style.color="#FFE66D",x.append(C,w),p.appendChild(x)}u.appendChild(p),o.appendChild(u);const f=document.createElement("button");f.textContent="もどる",f.style.cssText=`
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
    `,this.actionCleanups.add(A(f,{onActivate:()=>{this.hide(),e()},onPressChange:c=>{f.style.transform=c?"scale(0.96)":"scale(1)"}})),o.appendChild(f),n.appendChild(o),s.appendChild(n)}hide(){const t=Array.from(this.actionCleanups);this.actionCleanups.clear();for(const e of t)e();this.overlayEl?.remove(),this.overlayEl=null}createSummaryCard(t,e,s){const i=document.createElement("div");i.setAttribute(s,""),i.style.cssText=`
      padding: 0.9rem 0.8rem;
      border-radius: 18px;
      background: rgba(255, 255, 255, 0.1);
    `;const a=document.createElement("div");a.textContent=t,a.style.cssText=`
      margin-bottom: 0.3rem;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 0.95rem;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.86);
    `;const n=document.createElement("div");return n.textContent=e,n.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(1.25rem, 4.4vmin, 1.8rem);
      font-weight: 900;
      color: #FFE66D;
    `,i.append(a,n),i}}function Ot(l,t){if(!Number.isFinite(l)||l<=0||t<=0)return"ずかん";const e=Math.min(l,t);return e>=t?`ずかん ${t} / ${t} 🎉`:`ずかん ${e} / ${t}`}function Ge(l){switch(l){case"hero":return{gap:"0.35rem",label:"0.92rem",medal:"1.7rem",hint:"0.98rem"};case"compact":return{gap:"0.18rem",label:"0.7rem",medal:"1rem",hint:"0.76rem"};default:return{gap:"0.26rem",label:"0.8rem",medal:"1.25rem",hint:"0.84rem"}}}function bt(l,t,e={}){const s=Lt(l,t),i=e.size??"regular",a=Ge(i),n=document.createElement("div");if(n.setAttribute("data-stage-medal-display",""),n.setAttribute("data-stage-medal-stage",String(l)),n.setAttribute("data-stage-medal-tier",s.tier),n.setAttribute("data-stage-medal-earned",String(s.earnedCount)),e.scope&&n.setAttribute("data-stage-medal-scope",e.scope),n.style.cssText=`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${a.gap};
  `,e.label){const u=document.createElement("div");u.textContent=e.label,u.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${a.label};
      font-weight: 700;
      color: rgba(255, 255, 255, 0.84);
      letter-spacing: 0.06em;
    `,n.appendChild(u)}const o=document.createElement("div");o.style.cssText=`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${a.gap};
  `;for(const u of s.slots){const g=document.createElement("span");g.setAttribute("data-stage-medal-slot",u.tier),g.setAttribute("data-stage-medal-threshold",String(u.threshold)),g.setAttribute("data-stage-medal-reached",String(u.reached)),g.textContent=u.icon,g.style.cssText=`
      font-size: ${a.medal};
      line-height: 1;
      filter: ${u.reached?"drop-shadow(0 0 10px rgba(255, 215, 0, 0.45))":"none"};
      opacity: ${u.reached?"1":"0.3"};
      transform: ${u.reached?"scale(1)":"scale(0.92)"};
    `,o.appendChild(g)}n.appendChild(o);const h=e.hint??(s.nextThreshold===null?"かんぺき！":`つぎ ⭐ ${s.nextThreshold}`),d=document.createElement("div");return d.setAttribute("data-stage-medal-hint",""),d.textContent=h,d.style.cssText=`
    font-family: 'Zen Maru Gothic', sans-serif;
    font-size: ${a.hint};
    font-weight: 700;
    color: ${s.nextThreshold===null?"#FFE66D":"rgba(255, 255, 255, 0.86)"};
  `,n.appendChild(d),n}const Rt=2e3,ot=new Map,rt=new Map,lt=new Map;let Q=null,K=null;function J(l,t){if(typeof document>"u"){const s=typeof OffscreenCanvas=="function",i=s?new OffscreenCanvas(l,t):{width:l,height:t};return{canvas:i,ctx:s?i.getContext("2d"):null}}const e=document.createElement("canvas");return e.width=l,e.height=t,{canvas:e,ctx:e.getContext("2d")}}function j(l,t){let e=ot.get(l);return e||(e=t(),e.generateMipmaps=!1,e.minFilter=ke,e.needsUpdate=!0,ot.set(l,e)),e}function P(l,t){let e=rt.get(l);return e||(e=t(),rt.set(l,e)),e}function B(l,t){let e=lt.get(l);return e||(e=t(),lt.set(l,e)),e}function k(l,t){const e=new Be(l,t);return e.userData.sharedAssets=!0,e}function $t(){if(!Q){const l=new xt,t=new Float32Array(Rt*3);for(let e=0;e<Rt*3;e+=3)t[e]=(Math.random()-.5)*200,t[e+1]=(Math.random()-.5)*200,t[e+2]=(Math.random()-.5)*400;l.setAttribute("position",new wt(t,3)),Q=l}K||(K=new Ct({color:16777215,size:.2,sizeAttenuation:!0}))}function Ne(){const{canvas:l,ctx:t}=J(256,256);if(!t)return new z(l);t.fillStyle="#888888",t.fillRect(0,0,256,256);for(let e=0;e<30;e++){const s=Math.random()*256,i=Math.random()*256,a=3+Math.random()*12;t.beginPath(),t.arc(s,i,a,0,Math.PI*2),t.fillStyle=`rgba(60,60,60,${.3+Math.random()*.4})`,t.fill()}return new z(l)}function Fe(){const{canvas:l,ctx:t}=J(256,256);if(!t)return new z(l);t.fillStyle="#ddaa44",t.fillRect(0,0,256,256);for(let e=0;e<8;e++){t.beginPath();const s=128+(Math.random()-.5)*100,i=128+(Math.random()-.5)*100;t.strokeStyle=`rgba(200,150,60,${.3+Math.random()*.3})`,t.lineWidth=3+Math.random()*5;for(let a=0;a<Math.PI*4;a+=.1){const n=10+a*8;t.lineTo(s+Math.cos(a)*n,i+Math.sin(a)*n)}t.stroke()}return new z(l)}function _e(){const{canvas:l,ctx:t}=J(256,256);if(!t)return new z(l);const e=["#cc7733","#dd9955","#bb6622","#eebb77","#aa5511","#ddaa66"];for(let s=0;s<256;s++){const i=Math.floor(s/(256/e.length))%e.length;t.fillStyle=e[i],t.fillRect(0,s,256,1)}return new z(l)}function $e(){const{canvas:l,ctx:t}=J(512,256);return t?(t.fillStyle="#2266aa",t.fillRect(0,0,512,256),t.fillStyle="#886644",t.beginPath(),t.ellipse(300,80,80,40,.2,0,Math.PI*2),t.fill(),t.beginPath(),t.ellipse(280,150,30,50,.1,0,Math.PI*2),t.fill(),t.beginPath(),t.ellipse(100,90,25,60,.3,0,Math.PI*2),t.fill(),t.beginPath(),t.ellipse(110,170,20,40,-.2,0,Math.PI*2),t.fill(),t.beginPath(),t.ellipse(420,170,25,15,0,0,Math.PI*2),t.fill(),t.fillStyle="#447733",t.beginPath(),t.ellipse(290,75,40,20,.3,0,Math.PI*2),t.fill(),t.beginPath(),t.ellipse(95,85,15,30,.2,0,Math.PI*2),t.fill(),new z(l)):new z(l)}function je(){const{canvas:l,ctx:t}=J(512,256);if(!t)return new z(l);t.clearRect(0,0,512,256),t.fillStyle="rgba(255,255,255,0.6)";for(let e=0;e<20;e++){const s=Math.random()*512,i=Math.random()*256;t.beginPath(),t.ellipse(s,i,20+Math.random()*40,8+Math.random()*15,Math.random()*Math.PI,0,Math.PI*2),t.fill()}return new z(l)}function We(){ot.clear(),rt.clear(),lt.clear(),Q=null,K=null}const Ue={planetTextureCache:ot,planetGeometryCache:rt,planetMaterialCache:lt,getBgStarsGeometry:()=>Q,getBgStarsMaterial:()=>K};function jt(l,t,e){const s=new nt;let i=null;switch(l){case 2:{const a=j("mercury",Ne),n=P("mercury:sphere",()=>new H(10,24,24)),o=B("mercury:mat",()=>new M({map:a})),h=k(n,o);s.add(h),i=h;break}case 3:{const a=j("venus",Fe),n=P("venus:sphere",()=>new H(14,24,24)),o=B("venus:mat",()=>new M({map:a})),h=k(n,o);s.add(h),i=h;break}case 5:{const a=j("jupiter",_e),n=P("jupiter:sphere",()=>new H(20,24,24)),o=B("jupiter:mat",()=>new M({map:a})),h=k(n,o);s.add(h),i=h;break}case 6:{const a=P("saturn:sphere",()=>new H(15,24,24)),n=t.planetColor,o=B(`saturn:mat:${n}`,()=>new M({color:n})),h=k(a,o);s.add(h);const d=P("saturn:ring",()=>new kt(20,30,48)),u=B("saturn:ringMat",()=>new M({color:15645542,side:Bt})),g=k(d,u);g.rotation.x=Math.PI/3,s.add(g),i=h;break}case 7:{const a=P("uranus:sphere",()=>new H(16,24,24)),n=B("uranus:mat",()=>new M({color:6737117})),o=k(a,n);s.add(o);const h=P("uranus:ring",()=>new kt(21,28,48)),d=B("uranus:ringMat",()=>new M({color:10083822,side:Bt})),u=k(h,d);u.rotation.z=Math.PI/2,s.add(u),i=o;break}case 9:{const a=P("pluto:sphere",()=>new H(8,24,24)),n=B("pluto:mat",()=>new M({color:12298922})),o=k(a,n);s.add(o),i=o;break}case 10:{const a=P("sun:sphere",()=>new H(25,24,24)),n=B("sun:mat",()=>new M({color:16763904,emissive:16755200,emissiveIntensity:.5})),o=k(a,n);s.add(o),s.add(new Pe(16763904,2,200)),i=o;break}case 11:{const a=j("earth",$e),n=P("earth:sphere",()=>new H(15,32,32)),o=B("earth:mat",()=>new M({map:a})),h=j("earth:cloud",je),d=P("earth:cloudSphere",()=>new H(15.5,32,32)),u=B("earth:cloudMat",()=>new M({map:h,transparent:!0,opacity:.3})),g=new nt;g.add(k(n,o)),g.add(k(d,u)),s.add(g),i=g;break}default:{const a=P("default:sphere",()=>new H(15,24,24)),n=t.planetColor,o=B(`default:mat:${n}`,()=>new M({color:n})),h=k(a,o);s.add(h),i=h;break}}return s.position.set(0,0,e),{planet:s,spinTarget:i}}function Wt(l,t,e){return jt(l,t,e)}function Ut(l){$t();const t=new Et(Q,K);return t.userData.sharedAssets=!0,t.geometry.setDrawRange(0,l),t}function Mt(l){!Number.isInteger(l)||l<1||l>R||typeof document>"u"&&typeof OffscreenCanvas!="function"||($t(),jt(l,N(l),0))}let U=null,Z=null;function Ze(){if(!U){const l=new xt,t=new Float32Array(3e3);for(let e=0;e<3e3;e++)t[e]=(Math.random()-.5)*200;l.setAttribute("position",new wt(t,3)),U=l}return U}function qe(){return Z||(Z=new Ct({color:16777215,size:.3,sizeAttenuation:!0})),Z}function Ye(){U=null,Z=null}const Ve={getBgStarsGeometry:()=>U,getBgStarsMaterial:()=>Z};function Xe(l){const t=window.requestIdleCallback;if(typeof t=="function"){t(l,{timeout:1500});return}window.setTimeout(l,800)}function Zt(l){return new Set(l.filter(t=>Number.isInteger(t)&&t>=1&&t<=R)).size}function Qe(l){return Zt(l)>=R}function pt(l){const t=Qe(l.unlockedPlanets),e=t?1:Math.min(l.clearedStage+1,R),s=N(e),i=l.bestStageStars?.[e]??0;return t?{startStage:e,destination:s.destinationReading,emoji:s.emoji,statusLabel:"ぜんぶ あつめたよ！",destinationLabel:`${s.destinationReading}へ もういちど しゅっぱつ！`,buttonHint:`${s.emoji} ステージ ${e} から もういちど あそぶ`,bestStars:i}:{startStage:e,destination:s.destinationReading,emoji:s.emoji,statusLabel:l.clearedStage>0?"つづきから しゅっぱつ！":"はじめての しゅっぱつ！",destinationLabel:`${s.destinationReading}へ むかおう！`,buttonHint:`${s.emoji} ステージ ${e} から スタート`,bestStars:i}}function Ke(l){return l.clearedStage>0||Zt(l.unlockedPlanets)>0||Object.keys(l.bestStageStars??{}).length>0}class Je{threeScene;ambientLight=new ct(16777215,1);camera;lastAspect=0;sceneManager;saveManager;audioManager;stars=null;companionParade=null;overlay=null;muteHandle=null;tutorialOverlay=new At;titleResetConfirmOverlay=new Re;colorAccessibilitySettings=new Ie;spaceshipCustomizer=new De;statsOverlay=new ze;encyclopediaOverlay=null;encyclopediaOverlayPromise=null;companionFactory=null;companionFactoryPromise=null;loadEncyclopediaOverlay;loadTitleCompanionFactory;loadingOverlay;loadFailureOverlay;scheduleIdleTask;encyclopediaBtn=null;isOpeningEncyclopedia=!1;isActive=!1;encyclopediaRequestToken=0;companionParadeRequestToken=0;bgmPending=!1;overlayButtonCleanups=new Set;constructor(t,e,s,i={}){this.sceneManager=t,this.saveManager=e,this.audioManager=s,this.loadingOverlay=i.loadingOverlay??new Yt,this.loadFailureOverlay=i.loadFailureOverlay??new Vt,this.scheduleIdleTask=i.scheduleIdleTask??Xe,this.loadEncyclopediaOverlay=i.loadEncyclopediaOverlay??(()=>yt(()=>import("./EncyclopediaOverlay-BM1UKxxL.js"),__vite__mapDeps([0,1,2]))),this.loadTitleCompanionFactory=i.loadTitleCompanionFactory??(()=>yt(()=>import("./game-core-C8flZALU.js").then(o=>o.a8),__vite__mapDeps([1,2]))),this.threeScene=new V,this.threeScene.background=new X(32);const{width:a,height:n}=D();this.camera=new dt(60,a/n,.1,1e3),this.camera.position.set(0,0,5)}enter(t){this.isActive=!0,this.encyclopediaRequestToken+=1,this.companionParadeRequestToken+=1,this.lastAspect=0,this.stars=new Et(Ze(),qe()),this.stars.userData.sharedAssets=!0,this.stars.rotation.set(0,0,0),this.threeScene.add(this.stars),this.ambientLight.parent||this.threeScene.add(this.ambientLight);const e=this.saveManager.load();this.createCompanionParade(e.unlockedPlanets),this.createOverlay(),this.createMuteButton(),this.prefetchEncyclopediaOnIdle(),this.prewarmNextAdventureOnIdle(pt(e).startStage),this.audioManager.isInitialized()?(this.audioManager.playBGM(0),this.bgmPending=!1):this.bgmPending=!0,e.tutorialShown||this.tutorialOverlay.show(()=>{this.ensureTitleAudioInitialized(!0),this.tutorialOverlay.hide(),this.saveManager.markTutorialShown()})}createMuteButton(){const t=document.getElementById("hud")??document.getElementById("ui-overlay");t&&(this.muteHandle=Tt({initialMuted:this.audioManager.isMuted(),container:t,onToggle:()=>{this.ensureTitleAudioInitialized(!0);const e=this.audioManager.toggleMute();this.muteHandle?.setMuted(e);const s=this.saveManager.load();s.muted=e,this.saveManager.save(s)}}))}getEncyclopediaOverlay(){return this.encyclopediaOverlay?Promise.resolve(this.encyclopediaOverlay):this.encyclopediaOverlayPromise?this.encyclopediaOverlayPromise:(this.encyclopediaOverlayPromise=this.loadEncyclopediaOverlay().then(({EncyclopediaOverlay:t})=>{const e=new t;return this.encyclopediaOverlay=e,e}).finally(()=>{this.encyclopediaOverlayPromise=null}),this.encyclopediaOverlayPromise)}getTitleCompanionFactory(){return this.companionFactory?Promise.resolve(this.companionFactory):this.companionFactoryPromise?this.companionFactoryPromise:(this.companionFactoryPromise=this.loadTitleCompanionFactory().then(t=>(this.companionFactory=t,t)).finally(()=>{this.companionFactoryPromise=null}),this.companionFactoryPromise)}showEncyclopedia(){if(!this.isActive||!this.encyclopediaOverlay)return;const t=this.saveManager.load();this.encyclopediaOverlay.show(t.unlockedPlanets,()=>this.refreshEncyclopediaButtonLabel(),e=>{this.ensureTitleAudioInitialized(!1),this.sceneManager.requestTransition("stage",{stageNumber:e,totalScore:0,totalStarCount:0,launchSource:"encyclopedia"})},t.bestStageStars??{},t.discoveredConstellations??[])}isCurrentEncyclopediaRequest(t){return this.isActive&&this.encyclopediaRequestToken===t}prefetchEncyclopediaOnIdle(){const t=this.encyclopediaRequestToken;this.scheduleIdleTask(()=>{!this.isCurrentEncyclopediaRequest(t)||this.encyclopediaOverlay||this.encyclopediaOverlayPromise||this.getEncyclopediaOverlay().catch(()=>{})})}prewarmNextAdventureOnIdle(t){if(t>R)return;const e=this.encyclopediaRequestToken;this.scheduleIdleTask(()=>{this.isCurrentEncyclopediaRequest(e)&&Mt(t)})}async openEncyclopedia(){if(!this.isActive)return;if(this.loadFailureOverlay.hide(),this.encyclopediaOverlay){this.showEncyclopedia();return}if(this.isOpeningEncyclopedia)return;const t=this.encyclopediaRequestToken;this.isOpeningEncyclopedia=!0,this.loadingOverlay.show("ずかんを よんでるよ...");try{if(await this.getEncyclopediaOverlay(),!this.isCurrentEncyclopediaRequest(t))return;this.loadingOverlay.hide(),this.showEncyclopedia()}catch(e){if(!this.isCurrentEncyclopediaRequest(t))return;this.loadingOverlay.hide(),console.error("Failed to load encyclopedia overlay",e),this.loadFailureOverlay.show({title:"ずかんを もういちど よんでみよう！",message:"「もういちど よむ」を おして つづきを たのしもう！",primaryAction:{label:"もういちど よむ",onSelect:()=>this.openEncyclopedia()}})}finally{this.encyclopediaRequestToken===t&&(this.isOpeningEncyclopedia=!1)}}persistHighContrastSetting(t){const e=this.saveManager.load(),s=e.colorAccessibility?.motionSensitivity??_;e.colorAccessibility=this.buildColorAccessibilitySettings(t,s),e.colorAccessibility||delete e.colorAccessibility,this.saveManager.save(e)}persistVibrationIntensitySetting(t){const e=this.saveManager.load();e.vibrationSettings={intensity:t},this.saveManager.save(e),Ht(t)}persistMotionSensitivitySetting(t){const e=this.saveManager.load(),s=e.colorAccessibility?.highContrast===!0;e.colorAccessibility=this.buildColorAccessibilitySettings(s,t),e.colorAccessibility||delete e.colorAccessibility,this.saveManager.save(e)}buildColorAccessibilitySettings(t,e){if(!(!t&&e===_))return{...t?{highContrast:!0}:{},...e!==_?{motionSensitivity:e}:{}}}createOverlay(){const t=document.getElementById("ui-overlay");if(!t)return;const e=this.saveManager.load(),s=pt(e),i=Ke(e);this.overlay=document.createElement("div"),this.overlay.style.cssText=`
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
    `;const a=window.innerHeight<=720,n=document.createElement("div");n.textContent="うちゅうの たび",n.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${a?"2rem":"3rem"};
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
      margin-bottom: ${a?"0.35rem":"1.1rem"};
    `;const o=document.createElement("div");o.setAttribute("data-next-adventure-card",""),o.setAttribute("data-next-stage-number",String(s.startStage)),o.setAttribute("data-next-stage-destination",s.destination),o.style.cssText=`
      width: min(${a?"64vw":"70vw"}, ${a?"20rem":"26rem"});
      padding: ${a?"0.5rem 0.8rem":"0.8rem 1.2rem"};
      margin-bottom: ${a?"0.45rem":"0.85rem"};
      border-radius: ${a?"1rem":"1.5rem"};
      background: rgba(255, 255, 255, 0.14);
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.22);
      backdrop-filter: blur(6px);
      text-align: center;
      color: #fff;
    `;const h=document.createElement("div");h.textContent="つぎの ぼうけん",h.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${a?"0.8rem":"1rem"};
      font-weight: 700;
      color: #FFE66D;
      margin-bottom: ${a?"0.15rem":"0.35rem"};
    `;const d=document.createElement("div");d.textContent=s.statusLabel,d.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${a?"1rem":"1.25rem"};
      font-weight: 900;
      margin-bottom: ${a?"0.15rem":"0.35rem"};
    `;const u=document.createElement("div");u.textContent=`${s.emoji} ステージ ${s.startStage} ・ ${s.destination}`,u.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${a?"1.05rem":"1.35rem"};
      font-weight: 700;
      margin-bottom: 0.25rem;
    `;const g=document.createElement("div");g.textContent=s.destinationLabel,g.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${a?"0.85rem":"1rem"};
      font-weight: 700;
      color: rgba(255, 255, 255, 0.92);
    `;const p=Lt(s.startStage,s.bestStars),r=bt(s.startStage,s.bestStars,{label:"メダル",hint:p.nextThreshold===null?"かんぺき！":`${p.icon} いま ・ つぎ ⭐ ${p.nextThreshold}`,size:"regular",scope:"title-next-adventure"});r.style.marginTop=a?"0.35rem":"0.55rem",o.appendChild(h),o.appendChild(d),o.appendChild(u),o.appendChild(g),o.appendChild(r);const f=document.createElement("div");f.style.cssText=`
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: ${a?"0.42rem":"0.55rem"};
      width: min(94vw, ${i?"44rem":"34rem"});
    `;const c=document.createElement("button");c.textContent="あそぶ",c.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${a?"1.4rem":"2rem"};
      font-weight: 700;
      padding: ${a?"0.6rem 2rem":"1rem 3rem"};
      border: none;
      border-radius: 2rem;
      background: linear-gradient(135deg, #FF6B6B, #FFE66D);
      color: #333;
      cursor: pointer;
      touch-action: manipulation;
      box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
      transform: scale(1);
      transition: transform 0.08s ease-out;
    `,this.overlayButtonCleanups.add(A(c,{onActivate:()=>{this.ensureTitleAudioInitialized(!1);const b=this.saveManager.load(),I=pt(b).startStage;this.sceneManager.requestTransition("stage",{stageNumber:I,totalScore:0,totalStarCount:0,launchSource:"campaign"})},onPressChange:b=>{c.style.transform=b?"scale(0.96)":"scale(1)"}}));const m=document.createElement("div");m.setAttribute("data-play-button-hint",""),m.textContent=s.buttonHint,m.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${a?"0.85rem":"1rem"};
      font-weight: 700;
      color: rgba(255, 255, 255, 0.88);
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
    `;const S=document.createElement("button");S.textContent="うちゅうで あそぶ",S.setAttribute("data-free-play-button",""),S.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${a?"1.05rem":"1.35rem"};
      font-weight: 900;
      padding: ${a?"0.55rem 1.6rem":"0.85rem 2.4rem"};
      border: none;
      border-radius: 2rem;
      background: linear-gradient(135deg, #7bd9ff, #b197fc);
      color: #1f2040;
      cursor: pointer;
      touch-action: manipulation;
      box-shadow: 0 4px 15px rgba(123, 217, 255, 0.35);
      transform: scale(1);
      transition: transform 0.08s ease-out;
    `,this.overlayButtonCleanups.add(A(S,{onActivate:()=>{this.ensureTitleAudioInitialized(!1),this.sceneManager.requestTransition("freePlay",{})},onPressChange:b=>{S.style.transform=b?"scale(0.96)":"scale(1)"}}));const x=document.createElement("div");x.setAttribute("data-title-secondary-actions",""),x.style.cssText=`
      display: grid;
      grid-template-columns: repeat(${i?3:2}, minmax(0, 1fr));
      gap: ${a?"0.45rem":"0.55rem"};
      width: 100%;
      align-items: stretch;
    `;const C=document.createElement("button");C.setAttribute("data-spaceship-customizer-button",""),C.textContent="うちゅうせんをかざろう",C.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${a?"0.9rem":"1.05rem"};
      font-weight: 900;
      padding: ${a?"0.55rem 0.65rem":"0.7rem 0.85rem"};
      min-width: 0;
      width: 100%;
      min-height: ${a?"48px":"56px"};
      border: 3px solid rgba(255, 255, 255, 0.92);
      border-radius: 1.7rem;
      background: rgba(8, 16, 52, 0.76);
      color: #fff;
      cursor: pointer;
      touch-action: manipulation;
      box-shadow: 0 8px 18px rgba(0, 0, 0, 0.26);
      transform: scale(1);
      transition: transform 0.08s ease-out;
    `,this.overlayButtonCleanups.add(A(C,{onActivate:()=>{const b=this.saveManager.load();this.spaceshipCustomizer.show({initialCustomization:b.spaceshipCustomization??vt,onComplete:I=>{const tt=this.saveManager.load();tt.spaceshipCustomization=I,this.saveManager.save(tt)}})},onPressChange:b=>{C.style.transform=b?"scale(0.96)":"scale(1)"}}));const w=document.createElement("button");w.setAttribute("data-stats-button",""),w.textContent="あそびの きろく",w.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${a?"0.9rem":"1.05rem"};
      font-weight: 900;
      padding: ${a?"0.55rem 0.65rem":"0.7rem 0.85rem"};
      min-width: 0;
      width: 100%;
      min-height: ${a?"48px":"56px"};
      border: 3px solid rgba(255, 230, 109, 0.85);
      border-radius: 1.7rem;
      background: rgba(12, 22, 72, 0.82);
      color: #fff;
      cursor: pointer;
      touch-action: manipulation;
      box-shadow: 0 8px 18px rgba(0, 0, 0, 0.26);
      transform: scale(1);
      transition: transform 0.08s ease-out;
    `,this.overlayButtonCleanups.add(A(w,{onActivate:()=>{this.ensureTitleAudioInitialized(!0),this.statsOverlay.show(this.saveManager.load().gameplayStats,()=>{})},onPressChange:b=>{w.style.transform=b?"scale(0.96)":"scale(1)"}}));const L=document.createElement("div");L.setAttribute("data-title-footer-actions",""),L.style.cssText=`
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: ${a?"0.45rem":"0.65rem"};
      width: min(94vw, 42rem);
      margin-top: ${a?"0.5rem":"0.8rem"};
      align-items: stretch;
    `;const T=document.createElement("button");T.textContent="あそびかた",T.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${a?"0.82rem":"1rem"};
      font-weight: 700;
      padding: ${a?"0.45rem 0.55rem":"0.55rem 0.8rem"};
      min-height: ${a?"42px":"48px"};
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
    `,this.overlayButtonCleanups.add(A(T,{onActivate:()=>{this.ensureTitleAudioInitialized(!0),this.tutorialOverlay.show(()=>{this.ensureTitleAudioInitialized(!0),this.tutorialOverlay.hide()})},onPressChange:b=>{T.style.transform=b?"scale(0.96)":"scale(1)"}}));const v=document.createElement("button");v.setAttribute("data-color-settings-button",""),v.textContent="みやすさ・しんどう",v.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${a?"0.82rem":"1rem"};
      font-weight: 700;
      padding: ${a?"0.45rem 0.55rem":"0.55rem 0.8rem"};
      min-height: ${a?"42px":"48px"};
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
    `,this.overlayButtonCleanups.add(A(v,{onActivate:()=>{this.ensureTitleAudioInitialized(!0),this.colorAccessibilitySettings.show({initialHighContrast:this.saveManager.load().colorAccessibility?.highContrast===!0,initialVibrationIntensity:this.saveManager.load().vibrationSettings?.intensity??"medium",initialMotionSensitivity:this.saveManager.load().colorAccessibility?.motionSensitivity??_,onToggle:b=>this.persistHighContrastSetting(b),onVibrationIntensityChange:b=>this.persistVibrationIntensitySetting(b),onMotionSensitivityChange:b=>this.persistMotionSensitivitySetting(b)})},onPressChange:b=>{v.style.transform=b?"scale(0.96)":"scale(1)"}}));const E=document.createElement("button");if(E.textContent=Ot(e.unlockedPlanets.length,W.length),E.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${a?"0.82rem":"1rem"};
      font-weight: 700;
      padding: ${a?"0.45rem 0.55rem":"0.55rem 0.8rem"};
      min-height: ${a?"42px":"48px"};
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
    `,this.encyclopediaBtn=E,this.overlayButtonCleanups.add(A(E,{onActivate:()=>{this.ensureTitleAudioInitialized(!0),this.openEncyclopedia()},onPressChange:b=>{E.style.transform=b?"scale(0.96)":"scale(1)"}})),f.appendChild(c),f.appendChild(S),f.appendChild(m),x.appendChild(C),x.appendChild(w),i){const b=document.createElement("button");b.setAttribute("data-reset-progress-button",""),b.textContent="さいしょから",b.style.cssText=`
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${a?"0.9rem":"1.05rem"};
        font-weight: 900;
        padding: ${a?"0.55rem 0.65rem":"0.7rem 0.85rem"};
        min-width: 0;
        width: 100%;
        min-height: ${a?"48px":"56px"};
        border: 2px solid rgba(255, 230, 109, 0.65);
        border-radius: 1.5rem;
        background: rgba(0, 0, 64, 0.32);
        color: #fff;
        cursor: pointer;
        touch-action: manipulation;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.24);
      `,b.addEventListener("pointerdown",I=>{I.stopPropagation(),this.ensureTitleAudioInitialized(!0),this.titleResetConfirmOverlay.show(()=>{this.saveManager.resetProgressPreservingSettings(),this.startCampaign(1)},()=>{})}),x.appendChild(b)}f.appendChild(x),L.append(E,v,T),this.overlay.appendChild(n),this.overlay.appendChild(o),this.overlay.appendChild(f),this.overlay.appendChild(L),t.appendChild(this.overlay),this.overlay.addEventListener("pointerdown",()=>{this.ensureTitleAudioInitialized(!0)},{once:!0})}ensureTitleAudioInitialized(t){!this.bgmPending&&this.audioManager.isInitialized()||(this.audioManager.initSync(),t&&this.bgmPending&&this.audioManager.playBGM(0),this.bgmPending=!1)}startCampaign(t){this.sceneManager.requestTransition("stage",{stageNumber:t,totalScore:0,totalStarCount:0,launchSource:"campaign"})}refreshEncyclopediaButtonLabel(){if(!this.encyclopediaBtn)return;const t=this.saveManager.load();this.encyclopediaBtn.textContent=Ot(t.unlockedPlanets.length,W.length)}async createCompanionParade(t){this.clearCompanionParade();const e=[...new Set(t)].reduce((h,d)=>{const u=it(d);return u&&h.push(u),h},[]);if(e.length===0)return;const s=this.encyclopediaRequestToken,{createCompanionMesh:i}=await this.getTitleCompanionFactory();if(!this.isActive||this.encyclopediaRequestToken!==s)return;const a=new nt;a.name="title-companion-parade",a.position.set(0,1.35,-1.2),a.rotation.x=-.12;const n=Math.min(2.1,1.1+e.length*.18),o=Math.min(.45,.18+e.length*.02);e.forEach((h,d)=>{const u=i(h),g=d/e.length*Math.PI*2;u.position.set(Math.cos(g)*n,Math.sin(g)*o,Math.sin(g)*n*.45),u.rotation.y=Math.PI*.15-g,u.scale.setScalar(.6),a.add(u)}),this.companionParade=a,this.threeScene.add(a)}clearCompanionParade(){this.companionParade&&(this.companionParade.parent?.remove(this.companionParade),this.companionParade=null)}update(t){this.stars&&(this.stars.rotation.y+=t*.05),this.companionParade&&(this.companionParade.rotation.y+=t*.35)}exit(){this.isActive=!1,this.encyclopediaRequestToken+=1,this.companionParadeRequestToken+=1,this.isOpeningEncyclopedia=!1,this.tutorialOverlay.hide(),this.titleResetConfirmOverlay.hide(),this.colorAccessibilitySettings.hide(),this.spaceshipCustomizer.hide(),this.statsOverlay.hide(),this.encyclopediaOverlay?.hide(),this.loadingOverlay.hide(),this.loadFailureOverlay.hide(),this.audioManager.stopBGM(),this.bgmPending=!1,this.clearCompanionParade(),this.stars&&(this.stars.parent?.remove(this.stars),this.stars=null),this.clearCompanionParade();const t=Array.from(this.overlayButtonCleanups);this.overlayButtonCleanups.clear();for(const e of t)e();this.overlay&&(this.overlay.remove(),this.overlay=null),this.encyclopediaBtn=null,this.muteHandle&&(this.muteHandle.remove(),this.muteHandle=null)}getThreeScene(){return this.threeScene}getCamera(){const{width:t,height:e}=D(),s=t/e;return s!==this.lastAspect&&Number.isFinite(s)&&s>0&&(this.camera.aspect=s,this.camera.updateProjectionMatrix(),this.lastAspect=s),this.camera}}const xs=Object.freeze(Object.defineProperty({__proto__:null,TitleScene:Je,__resetTitleSceneSharedAssetsForTest:Ye,__titleSceneSharedAssetsForTest:Ve},Symbol.toStringTag,{value:"Module"}));class ts{overlayEl=null;activePressCleanups=new Set;show(t,e){if(this.overlayEl)return;const s=document.getElementById("ui-overlay");if(!s)return;this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-home-confirm-overlay",""),this.overlayEl.setAttribute("role","dialog"),this.overlayEl.setAttribute("aria-modal","true"),this.overlayEl.setAttribute("aria-label","ホームへ もどりますか"),this.overlayEl.style.cssText=`
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
    `,this.overlayEl.style.background="rgba(0, 0, 32, 0.92)";let i=!1;const a=()=>{i||(i=!0,this.hide(),e())},n=()=>{i||(i=!0,this.hide(),t())};this.overlayEl.addEventListener("pointerdown",f=>{f.target===this.overlayEl&&a()});const o=document.createElement("div");o.setAttribute("data-home-confirm-card",""),o.style.cssText=`
      display: flex;
      flex-direction: column;
      align-items: center;
      background: rgba(0, 0, 64, 0.85);
      border-radius: 1.6rem;
      padding: 1.6rem 1.4rem;
      max-width: min(90vw, 420px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45);
    `,o.addEventListener("pointerdown",f=>{f.stopPropagation()}),this.overlayEl.appendChild(o);const h=document.createElement("div");h.textContent="タイトルへ もどる？",h.style.cssText=`
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
    `,o.appendChild(d);const u=`
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
    `,g=(f,c)=>{const m=A(f,{onActivate:c,onPressChange:S=>{f.style.transform=S?"scale(0.9)":"scale(1)"}});this.activePressCleanups.add(m)},p=document.createElement("button");p.setAttribute("data-home-confirm-back",""),p.setAttribute("aria-label","タイトルへ もどる"),p.textContent="🏠 タイトルへ もどる",p.style.cssText=u,p.style.fontFamily="'Zen Maru Gothic', sans-serif",p.style.background="rgba(255, 255, 255, 0.18)",p.style.color="#ffffff",p.style.minWidth="88px",p.style.minHeight="88px",p.style.touchAction="manipulation",p.style.transform="scale(1)",p.style.transition="transform 0.08s ease-out",p.style.whiteSpace="nowrap",g(p,n),d.appendChild(p);const r=document.createElement("button");r.setAttribute("data-home-confirm-continue",""),r.setAttribute("aria-label","つづける"),r.textContent="✋ つづける",r.style.cssText=u,r.style.fontFamily="'Zen Maru Gothic', sans-serif",r.style.background="linear-gradient(135deg, #FF6B6B, #FFE66D)",r.style.color="#FFD700",r.style.textShadow="0 1px 2px rgba(0, 0, 32, 0.6)",r.style.minWidth="88px",r.style.minHeight="88px",r.style.touchAction="manipulation",r.style.transform="scale(1)",r.style.transition="transform 0.08s ease-out",r.style.whiteSpace="nowrap",g(r,a),d.appendChild(r),s.appendChild(this.overlayEl)}hide(){if(this.overlayEl){const t=Array.from(this.activePressCleanups);this.activePressCleanups.clear();for(const e of t)e();this.overlayEl.remove(),this.overlayEl=null}}isVisible(){return this.overlayEl!==null}}class qt{overlayEl=null;activePressCleanups=new Set;show(t,e){if(this.overlayEl)return;const s=document.getElementById("ui-overlay")??document.body;this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-pause-overlay",""),this.overlayEl.setAttribute("role","dialog"),this.overlayEl.setAttribute("aria-modal","true"),this.overlayEl.setAttribute("aria-label","やすみちゅう"),this.overlayEl.style.cssText=`
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
    `,i.appendChild(o);const h=(d,u,g,p,r,f)=>{const c=document.createElement("button");c.setAttribute(u,""),c.setAttribute("aria-label",g),c.textContent=d,c.style.cssText=`
        flex: 1 1 140px;
        padding: 1rem 1.2rem;
        border: none;
        border-radius: 1.6rem;
        background: ${p};
        color: ${r};
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: clamp(1.1rem, 3.6vmin, 1.4rem);
        font-weight: 900;
        cursor: pointer;
        touch-action: manipulation;
        box-shadow: 0 4px 18px rgba(0, 0, 0, 0.35);
        transform: scale(1);
        transition: transform 0.08s ease-out;
        white-space: nowrap;
      `,c.style.minWidth="140px",c.style.minHeight="88px";const m=A(c,{onActivate:()=>{this.hide(),f()},onPressChange:S=>{c.style.transform=S?"scale(0.94)":"scale(1)"}});return this.activePressCleanups.add(m),c};o.appendChild(h("▶ つづける","data-pause-continue","つづける","linear-gradient(135deg, #FF6B6B, #FFE66D)","#1b1f52",t)),o.appendChild(h("🏠 おうちへ","data-pause-home","おうちへ","rgba(255, 255, 255, 0.18)","#ffffff",e)),s.appendChild(this.overlayEl)}hide(){if(!this.overlayEl)return;const t=Array.from(this.activePressCleanups);this.activePressCleanups.clear();for(const e of t)e();this.overlayEl.remove(),this.overlayEl=null}dispose(){this.hide()}isVisible(){return this.overlayEl!==null}}class es{pendingTimeouts=new Set;container=null;stageNameEl=null;assistMessageEl=null;politeLiveRegionEl=null;assertiveLiveRegionEl=null;scoreEl=null;starCountEl=null;bestStarContainerEl=null;bestStarCountEl=null;boostButton=null;boostHintEl=null;homeButton=null;pauseButton=null;homeConfirmOverlay=new ts;pauseOverlay=new qt;muteButton=null;muteHandle=null;cooldownContainer=null;cooldownBar=null;stageProgressContainer=null;stageProgressTrack=null;stageProgressFill=null;stageProgressGoalEl=null;onBoostCallback=null;onBoostDeniedCallback=null;onHomeCallback=null;onHomeConfirmOpenCallback=null;onHomeConfirmCancelCallback=null;onPauseCallback=null;onPauseOpenCallback=null;onPauseResumeCallback=null;onMuteCallback=null;muted=!1;highContrastMode=!1;boostLocked=!1;pauseEnabled=!0;pauseButtonCleanup=null;lastCooldownProgress=1;lastCooldownPct=-1;lastReadyState=null;lastCooldownBarBoxShadow=null;lastBoostButtonAriaDisabled=null;lastBoostReadyRingVisible=null;boostButtonStyleCache={opacity:null,filter:null,animation:null,transform:null};lastPauseButtonAriaDisabled=null;pauseButtonStyleCache={opacity:null,filter:null,cursor:null,transform:null};lastStageProgressPct=-1;lastStageProgressComplete=null;lastScore=-1;lastStarCount=-1;bestStarCount=0;lastBestStarCount=-1;bestStarPulsed=!1;liveRegionWriteNonce=0;lastAnnouncedProgressThreshold=0;show(t,e){const s=document.getElementById("hud");if(!s)return;s.style.zIndex="10";const i=window.innerHeight<=500;this.homeButton=document.createElement("button"),this.homeButton.textContent="🏠",this.homeButton.setAttribute("aria-label","ホームへ もどる"),this.homeButton.style.position="absolute",this.homeButton.style.top="0.8rem",this.homeButton.style.left="1rem",this.homeButton.style.fontSize=i?"clamp(1.1rem, 3.5vmin, 1.4rem)":"clamp(1.4rem, 4vmin, 1.8rem)",this.homeButton.style.background="rgba(255, 255, 255, 0.15)",this.homeButton.style.border="none",this.homeButton.style.borderRadius="50%",this.homeButton.style.width=i?"2.4rem":"3rem",this.homeButton.style.height=i?"2.4rem":"3rem",this.homeButton.style.display="flex",this.homeButton.style.alignItems="center",this.homeButton.style.justifyContent="center",this.homeButton.style.cursor="pointer",this.homeButton.style.pointerEvents="auto",this.homeButton.style.touchAction="manipulation",this.homeButton.style.transform="scale(1)",this.homeButton.style.transition="transform 0.08s ease-out";const a=()=>{this.homeButton&&(this.homeButton.style.transform="scale(1)")};this.homeButton.addEventListener("pointerdown",h=>{h.stopPropagation(),this.homeButton&&(this.homeButton.style.transform="scale(0.9)"),!this.homeConfirmOverlay.isVisible()&&document.getElementById("ui-overlay")&&(this.onHomeConfirmOpenCallback?.(),this.homeConfirmOverlay.show(()=>this.onHomeCallback?.(),()=>this.onHomeConfirmCancelCallback?.()))}),this.homeButton.addEventListener("pointerup",a),this.homeButton.addEventListener("pointercancel",a),this.homeButton.addEventListener("pointerleave",a),s.appendChild(this.homeButton),t&&(this.stageNameEl=document.createElement("div"),this.stageNameEl.textContent=t,this.stageNameEl.style.cssText=`
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
    `,this.bestStarContainerEl.textContent="ベスト ⭐",this.bestStarCountEl=document.createElement("span"),this.bestStarCountEl.textContent="0",this.bestStarContainerEl.appendChild(this.bestStarCountEl),o.appendChild(this.bestStarContainerEl),this.container.appendChild(n),this.container.appendChild(o),s.appendChild(this.container),this.createBoostButton(),this.createMuteButton(),this.applyColorAccessibilityState(),this.createLiveRegions(s)}createStageProgress(t,e){const s=this.toCssColor(e??16766720),i=document.createElement("div");i.setAttribute("data-stage-progress-container",""),i.setAttribute("role","progressbar"),i.setAttribute("aria-label","ゴールまでの すすみ"),i.setAttribute("aria-valuemin","0"),i.setAttribute("aria-valuemax","100"),i.setAttribute("aria-valuenow","0"),i.setAttribute("aria-valuetext","ゴールまで あと 100%"),i.style.position="relative",i.style.display="flex",i.style.alignItems="center",i.style.justifyContent="center",i.style.gap="0.4rem",i.style.margin="0 auto 0.4rem",i.style.width=window.innerHeight<=500?"clamp(100px, 24vmin, 180px)":"clamp(160px, 32vmin, 280px)",i.style.pointerEvents="none",i.style.fontFamily="'Zen Maru Gothic', sans-serif";const a=document.createElement("div");a.setAttribute("data-stage-progress-ship",""),a.textContent="🚀",a.style.fontSize="clamp(0.9rem, 2.4vmin, 1.1rem)",a.style.lineHeight="1",a.style.pointerEvents="none";const n=document.createElement("div");n.setAttribute("data-stage-progress-track",""),n.style.flex="1",n.style.height="14px",n.style.background=this.highContrastMode?"rgba(6, 12, 28, 0.94)":"rgba(255, 255, 255, 0.18)",n.style.borderRadius="7px",n.style.overflow="hidden",n.style.boxShadow="inset 0 2px 6px rgba(0, 0, 0, 0.35)",n.style.border=this.highContrastMode?"3px solid rgba(255, 255, 255, 0.92)":"none";const o=document.createElement("div");o.setAttribute("data-stage-progress-fill",""),o.style.height="100%",o.style.width="0%",o.style.borderRadius="7px",o.style.background=this.highContrastMode?`repeating-linear-gradient(90deg, #ffffff 0 10px, #00ddff 10px 18px, ${s} 18px 30px)`:`linear-gradient(90deg, #00ddff, ${s})`,o.style.transition="width 0.15s linear",o.setAttribute("data-stage-progress-color",s),n.appendChild(o);const h=document.createElement("div");h.setAttribute("data-stage-progress-goal",""),h.textContent="🪐",h.style.fontSize="clamp(0.9rem, 2.4vmin, 1.1rem)",h.style.lineHeight="1",h.style.pointerEvents="none",h.style.textShadow=`0 0 8px ${s}`,i.appendChild(a),i.appendChild(n),i.appendChild(h),t.appendChild(i),this.stageProgressContainer=i,this.stageProgressTrack=n,this.stageProgressFill=o,this.stageProgressGoalEl=h}toCssColor(t){return`#${Math.max(0,Math.min(16777215,Math.floor(t))).toString(16).padStart(6,"0")}`}createMuteButton(){const t=document.getElementById("hud");t&&(this.muteHandle=Tt({initialMuted:this.muted,container:t,onToggle:()=>this.onMuteCallback?.()}),this.muteButton=this.muteHandle.element)}createPauseButton(){const t=document.getElementById("hud");if(!t)return;const e=window.innerHeight<=500;this.pauseButton=document.createElement("button"),this.pauseButton.textContent="✋ やすむ",this.pauseButton.setAttribute("aria-label","やすむ"),this.pauseButton.style.position="absolute",this.pauseButton.style.top="0.8rem",this.pauseButton.style.left=e?"4rem":"4.7rem",this.pauseButton.style.fontFamily="'Zen Maru Gothic', sans-serif",this.pauseButton.style.fontSize=e?"clamp(0.9rem, 3.2vmin, 1rem)":"clamp(1rem, 3.5vmin, 1.15rem)",this.pauseButton.style.fontWeight="900",this.pauseButton.style.padding=e?"0.45rem 0.9rem":"0.7rem 1.2rem",this.pauseButton.style.border="none",this.pauseButton.style.borderRadius="999px",this.pauseButton.style.background="rgba(255, 255, 255, 0.16)",this.pauseButton.style.color="#fff",this.pauseButton.style.cursor="pointer",this.pauseButton.style.pointerEvents="auto",this.pauseButton.style.touchAction="manipulation",this.pauseButton.style.boxShadow="0 4px 14px rgba(0, 0, 0, 0.2)",this.pauseButton.style.transform="scale(1)",this.pauseButton.style.transition="transform 0.08s ease-out, opacity 0.12s ease-out",this.pauseButton.style.minHeight=e?"2.4rem":"3rem",this.pauseButton.style.minWidth=e?"5.6rem":"7rem",this.pauseButtonCleanup=A(this.pauseButton,{onActivate:()=>this.onPauseCallback?.(),canActivate:()=>this.pauseEnabled,onPressChange:s=>{this.writePauseButtonStyle("transform",s?"scale(0.95)":"scale(1)")}}),t.appendChild(this.pauseButton),this.applyPauseButtonState()}createBoostButton(){const t=document.getElementById("ui-overlay");if(!t)return;this.injectBoostAnimations(),this.boostButton=document.createElement("button"),this.boostButton.textContent="🚀 ブースト!",this.boostButton.setAttribute("aria-label","ブースト"),this.boostButton.setAttribute("aria-disabled","false");const e=window.innerHeight<=500;this.boostButton.style.position="absolute",this.boostButton.style.bottom=e?"1rem":"2rem",this.boostButton.style.right=e?"1rem":"2rem",this.boostButton.style.fontFamily="'Zen Maru Gothic', sans-serif",this.boostButton.style.fontSize=e?"clamp(0.85rem, 2.8vmin, 1.05rem)":"clamp(1rem, 3.5vmin, 1.3rem)",this.boostButton.style.fontWeight="700",this.boostButton.style.padding=e?"0.5rem 1rem":"0.8rem 1.5rem",this.boostButton.style.border="none",this.boostButton.style.borderRadius="2rem",this.boostButton.style.background="linear-gradient(135deg, #FF6B6B, #FFD93D, #6BCB77)",this.boostButton.style.color="#fff",this.boostButton.style.cursor="pointer",this.boostButton.style.touchAction="manipulation",this.boostButton.style.pointerEvents="auto",this.boostButton.style.boxShadow="0 4px 15px rgba(255, 107, 107, 0.4)",this.boostButton.style.animation="boostBtnPulse 2s ease-in-out infinite",this.boostButton.addEventListener("pointerdown",s=>{s.stopPropagation();const i=this.boostButton;if(i&&!this.boostLocked){if(this.lastCooldownProgress<1){if(i.hasAttribute("data-boost-shake"))return;i.setAttribute("data-boost-shake",""),this.registerTimeout(()=>{i.removeAttribute("data-boost-shake")},250),this.onBoostDeniedCallback?.();return}this.writeBoostButtonStyle("transform","scale(0.9)"),this.registerTimeout(()=>{this.writeBoostButtonStyle("transform","scale(1.0)")},150),this.onBoostCallback?.()}}),t.appendChild(this.boostButton),this.boostHintEl=document.createElement("div"),this.boostHintEl.setAttribute("data-boost-hint",""),this.boostHintEl.setAttribute("aria-hidden","true"),this.boostHintEl.style.cssText=`
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
    `,document.head.appendChild(t)}setBoostCallback(t){this.onBoostCallback=t}setBoostDeniedCallback(t){this.onBoostDeniedCallback=t}setBoostLocked(t){this.boostLocked=t,this.applyBoostButtonState()}setHomeCallback(t){this.onHomeCallback=t}setHomeConfirmOpenCallback(t){this.onHomeConfirmOpenCallback=t}setHomeConfirmCancelCallback(t){this.onHomeConfirmCancelCallback=t}setPauseCallback(t){this.onPauseCallback=t}setPauseEnabled(t){this.pauseEnabled=t,this.applyPauseButtonState()}setMuteCallback(t){this.onMuteCallback=t}setPauseOpenCallback(t){this.onPauseOpenCallback=t}setPauseResumeCallback(t){this.onPauseResumeCallback=t}setMuteState(t){this.muted=t,this.muteHandle?.setMuted(t)}setHighContrastMode(t){this.highContrastMode=t,this.applyColorAccessibilityState()}applyColorAccessibilityState(){if(this.stageNameEl&&(this.stageNameEl.style.color=this.highContrastMode?"#fff58f":"#FFD700",this.stageNameEl.style.textShadow=this.highContrastMode?"0 0 0 #000, 0 2px 8px rgba(0, 0, 0, 0.9), 0 0 20px rgba(255, 255, 255, 0.25)":"0 2px 8px rgba(0, 0, 0, 0.7)"),this.assistMessageEl&&(this.assistMessageEl.style.background=this.highContrastMode?"rgba(5, 10, 28, 0.96)":"rgba(255, 255, 255, 0.14)",this.assistMessageEl.style.border=this.highContrastMode?"3px solid rgba(255, 255, 255, 0.95)":"none",this.assistMessageEl.style.color=this.highContrastMode?"#ffffff":"#fff7bf"),this.bestStarContainerEl&&(this.bestStarContainerEl.style.color=this.highContrastMode?"#e6f4ff":"#9ec5ff",this.bestStarContainerEl.style.opacity=this.highContrastMode?"1":"0.7"),this.stageProgressTrack&&(this.stageProgressTrack.style.background=this.highContrastMode?"rgba(6, 12, 28, 0.94)":"rgba(255, 255, 255, 0.18)",this.stageProgressTrack.style.border=this.highContrastMode?"3px solid rgba(255, 255, 255, 0.92)":"none"),this.stageProgressFill){const t=this.stageProgressFill.getAttribute("data-stage-progress-color")??"#ffd700";this.stageProgressFill.style.background=this.highContrastMode?`repeating-linear-gradient(90deg, #ffffff 0 10px, #00ddff 10px 18px, ${t} 18px 30px)`:`linear-gradient(90deg, #00ddff, ${t})`}if(this.stageProgressGoalEl){const t=this.stageProgressFill?.getAttribute("data-stage-progress-color")??"#ffd700";this.stageProgressGoalEl.style.textShadow=this.highContrastMode?`0 0 0 #000, 0 0 12px #ffffff, 0 0 18px ${t}`:`0 0 8px ${t}`}this.boostButton&&(this.boostButton.style.border=this.highContrastMode?"4px solid rgba(255, 255, 255, 0.95)":"none",this.boostButton.style.background=this.highContrastMode?"linear-gradient(135deg, #fff27a, #76f0ff, #6BCB77)":"linear-gradient(135deg, #FF6B6B, #FFD93D, #6BCB77)",this.boostButton.style.color=this.highContrastMode?"#0b1535":"#fff"),this.cooldownContainer&&(this.cooldownContainer.style.background=this.highContrastMode?"rgba(6, 12, 28, 0.94)":"rgba(255, 255, 255, 0.2)",this.cooldownContainer.style.border=this.highContrastMode?"2px solid rgba(255, 255, 255, 0.95)":"none",this.cooldownContainer.style.height=this.highContrastMode?"10px":"6px"),this.cooldownBar&&(this.cooldownBar.style.background=this.highContrastMode?"repeating-linear-gradient(90deg, #ffffff 0 10px, #00ddff 10px 18px, #00ff88 18px 30px)":"linear-gradient(90deg, #00ddff, #00ff88)"),this.applyBoostButtonState()}showAssistMessage(t){this.assistMessageEl&&(this.assistMessageEl.textContent=t,this.assistMessageEl.style.display="block",this.announcePolite(t))}hideAssistMessage(){this.assistMessageEl&&(this.assistMessageEl.style.display="none",this.assistMessageEl.textContent="")}showBoostHint(t){!this.boostHintEl||!this.boostButton||!this.cooldownContainer||(this.boostHintEl.textContent=t,this.boostHintEl.style.display="block",this.boostHintEl.setAttribute("data-boost-hint-visible",""),this.boostHintEl.setAttribute("aria-hidden","false"),this.boostButton.setAttribute("data-boost-hint-active",""),this.cooldownContainer.setAttribute("data-boost-hint-active",""))}hideBoostHint(){this.boostHintEl&&(this.boostHintEl.style.display="none",this.boostHintEl.textContent="",this.boostHintEl.removeAttribute("data-boost-hint-visible"),this.boostHintEl.setAttribute("aria-hidden","true")),this.boostButton?.removeAttribute("data-boost-hint-active"),this.cooldownContainer?.removeAttribute("data-boost-hint-active")}isMuted(){return this.muted}update(t,e){if(this.scoreEl&&t!==this.lastScore){const s=this.lastScore;this.scoreEl.textContent=String(t),this.lastScore=t,s!==-1&&t>s&&this.flashCount(this.scoreEl)}if(this.starCountEl&&e!==this.lastStarCount){const s=this.lastStarCount;this.starCountEl.textContent=String(e),this.lastStarCount=e,s!==-1&&e>s&&(this.flashCount(this.starCountEl),this.announcePolite(`ほし ${e}こ ゲット！`))}this.bestStarCount>0&&!this.bestStarPulsed&&e>this.bestStarCount&&this.bestStarContainerEl&&this.bestStarContainerEl.style.display!=="none"&&(this.bestStarPulsed=!0,this.flashCount(this.bestStarContainerEl))}setBestStarCount(t){const e=Number.isInteger(t)&&t>0?t:0;this.bestStarCount=e,this.bestStarPulsed=!1,!(!this.bestStarContainerEl||!this.bestStarCountEl)&&(e>0?(this.lastBestStarCount!==e&&(this.bestStarCountEl.textContent=String(e),this.lastBestStarCount=e),this.bestStarContainerEl.style.display=""):(this.bestStarContainerEl.style.display="none",this.lastBestStarCount=-1))}flashCount(t){if(t.hasAttribute("data-hud-count-pop"))return;t.setAttribute("data-hud-count-pop","");let e=!1;const s=()=>{e||(e=!0,t.removeAttribute("data-hud-count-pop"),t.removeEventListener("animationend",i))},i=a=>{a.animationName==="hudCountPop"&&s()};t.addEventListener("animationend",i),this.registerTimeout(s,500)}registerTimeout(t,e){let s=0;return s=window.setTimeout(()=>{this.pendingTimeouts.delete(s),t()},e),this.pendingTimeouts.add(s),s}clearPendingTimeouts(){for(const t of this.pendingTimeouts)window.clearTimeout(t);this.pendingTimeouts.clear()}updateCooldown(t){if(!this.cooldownBar||!this.boostButton)return;const e=Math.max(0,Math.min(1,t)),s=Math.round(e*100);s!==this.lastCooldownPct&&(this.cooldownBar.style.width=`${s}%`,this.lastCooldownPct=s),this.lastCooldownProgress=e;const i=e>=1;i!==this.lastReadyState&&(this.lastReadyState=i,this.applyBoostButtonState())}updateStageProgress(t){if(!this.stageProgressContainer||!this.stageProgressFill)return;const e=Math.max(0,Math.min(1,t)),s=Math.round(e*100);s!==this.lastStageProgressPct&&(this.stageProgressFill.style.width=`${s}%`,this.stageProgressContainer.setAttribute("aria-valuenow",String(s)),this.stageProgressContainer.setAttribute("aria-valuetext",`ゴールまで あと ${100-s}%`),this.lastStageProgressPct=s),this.announceStageProgressMilestone(s);const i=e>=1;i!==this.lastStageProgressComplete&&(i?(this.stageProgressContainer.setAttribute("data-stage-progress-complete",""),this.flashStageGoal()):this.stageProgressContainer.removeAttribute("data-stage-progress-complete"),this.lastStageProgressComplete=i)}flashStageGoal(){const t=this.stageProgressGoalEl;if(!t||t.hasAttribute("data-stage-goal-flash"))return;t.setAttribute("data-stage-goal-flash","");let e=!1;const s=()=>{e||(e=!0,t.removeAttribute("data-stage-goal-flash"),t.removeEventListener("animationend",i))},i=a=>{a.animationName==="stageGoalFlash"&&s()};t.addEventListener("animationend",i),this.registerTimeout(s,500)}flashBoostReady(){const t=this.boostButton;if(!t||t.hasAttribute("data-boost-ready-flash"))return;this.announcePolite("ブースト じゅんび OK！"),t.setAttribute("data-boost-ready-flash","");let e=!1;const s=()=>{e||(e=!0,t.removeAttribute("data-boost-ready-flash"),t.removeEventListener("animationend",i),this.lastReadyState===!0&&this.writeBoostButtonStyle("animation","boostBtnPulse 2s ease-in-out infinite, boostReadyRing 1.15s ease-in-out infinite"))},i=a=>{a.animationName==="boostBtnReadyFlash"&&s()};t.addEventListener("animationend",i),this.registerTimeout(s,500)}clearBoostReadyFlash(){this.boostButton?.hasAttribute("data-boost-ready-flash")&&this.boostButton.removeAttribute("data-boost-ready-flash")}announceMeteoriteHit(){this.announceAssertive("いんせきに ぶつかった！ シールド かいふくちゅう")}announceStageClear(t,e=!1,s=!1){const i=[`ステージ クリア！ ほし ${t}こ あつめたよ！`];s&&i.push("じこベスト こうしん！"),e&&i.push("あたらしい なかまも みつけたよ！"),this.announceAssertive(i.join(" "))}applyBoostButtonState(){if(!this.cooldownBar||!this.boostButton)return;const e=this.lastCooldownProgress>=1&&!this.boostLocked;this.setCooldownBarBoxShadow(e?this.highContrastMode?"0 0 0 2px rgba(255, 255, 255, 0.7), 0 0 14px #00ff88":"0 0 10px #00ff88":"none"),this.writeBoostButtonStyle("opacity",e?"1":"0.5"),this.writeBoostButtonStyle("filter",e?"none":"grayscale(0.8)"),this.writeBoostButtonStyle("animation",e?"boostBtnPulse 2s ease-in-out infinite, boostReadyRing 1.15s ease-in-out infinite":"none"),this.setBoostReadyRing(e),this.setBoostButtonAriaDisabled(e?"false":"true"),e||(this.clearBoostReadyFlash(),this.hideBoostHint())}applyPauseButtonState(){this.pauseButton&&(this.writePauseButtonStyle("opacity",this.pauseEnabled?"1":"0.45"),this.writePauseButtonStyle("filter",this.pauseEnabled?"none":"grayscale(0.8)"),this.writePauseButtonStyle("cursor",this.pauseEnabled?"pointer":"default"),this.setPauseButtonAriaDisabled(this.pauseEnabled?"false":"true"))}writeBoostButtonStyle(t,e){!this.boostButton||this.boostButtonStyleCache[t]===e||(this.boostButton.style[t]=e,this.boostButtonStyleCache[t]=e)}writePauseButtonStyle(t,e){!this.pauseButton||this.pauseButtonStyleCache[t]===e||(this.pauseButton.style[t]=e,this.pauseButtonStyleCache[t]=e)}setCooldownBarBoxShadow(t){!this.cooldownBar||this.lastCooldownBarBoxShadow===t||(this.cooldownBar.style.boxShadow=t,this.lastCooldownBarBoxShadow=t)}setBoostReadyRing(t){!this.boostButton||this.lastBoostReadyRingVisible===t||(t?this.boostButton.setAttribute("data-boost-ready-ring",""):this.boostButton.removeAttribute("data-boost-ready-ring"),this.lastBoostReadyRingVisible=t)}setBoostButtonAriaDisabled(t){!this.boostButton||this.lastBoostButtonAriaDisabled===t||(this.boostButton.setAttribute("aria-disabled",t),this.lastBoostButtonAriaDisabled=t)}setPauseButtonAriaDisabled(t){!this.pauseButton||this.lastPauseButtonAriaDisabled===t||(this.pauseButton.setAttribute("aria-disabled",t),this.lastPauseButtonAriaDisabled=t)}createLiveRegions(t){this.politeLiveRegionEl=this.createLiveRegion("polite"),this.assertiveLiveRegionEl=this.createLiveRegion("assertive"),t.appendChild(this.politeLiveRegionEl),t.appendChild(this.assertiveLiveRegionEl)}createLiveRegion(t){const e=document.createElement("div");return e.setAttribute("data-hud-live-region",t),e.setAttribute("aria-live",t),e.setAttribute("aria-atomic","true"),e.setAttribute("role",t==="assertive"?"alert":"status"),e.style.cssText=`
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    `,e}announcePolite(t){this.writeLiveRegion(this.politeLiveRegionEl,t)}announceAssertive(t){this.writeLiveRegion(this.assertiveLiveRegionEl,t)}writeLiveRegion(t,e){if(!t||e.length===0)return;this.liveRegionWriteNonce+=1;const s=this.liveRegionWriteNonce%2===0?"​":"‌";t.textContent=`${e}${s}`,t.setAttribute("data-live-message",e)}announceStageProgressMilestone(t){if(t>=100){this.lastAnnouncedProgressThreshold<100&&(this.announcePolite("ゴール！"),this.lastAnnouncedProgressThreshold=100);return}const e=[{pct:75,remaining:25},{pct:50,remaining:50},{pct:25,remaining:75}];for(const s of e)t>=s.pct&&this.lastAnnouncedProgressThreshold<s.pct&&(this.lastAnnouncedProgressThreshold=s.pct,this.announcePolite(`ゴールまで あと ${s.remaining}%`))}hide(){this.clearPendingTimeouts(),this.homeConfirmOverlay.hide(),this.pauseOverlay.hide(),this.homeButton&&(this.homeButton.remove(),this.homeButton=null),this.pauseButtonCleanup?.(),this.pauseButtonCleanup=null,this.pauseButton&&(this.pauseButton.remove(),this.pauseButton=null),this.muteHandle&&(this.muteHandle.remove(),this.muteHandle=null),this.muteButton=null,this.stageNameEl&&(this.stageNameEl.remove(),this.stageNameEl=null),this.assistMessageEl&&(this.assistMessageEl.remove(),this.assistMessageEl=null),this.politeLiveRegionEl&&(this.politeLiveRegionEl.remove(),this.politeLiveRegionEl=null),this.assertiveLiveRegionEl&&(this.assertiveLiveRegionEl.remove(),this.assertiveLiveRegionEl=null),this.stageProgressContainer&&(this.stageProgressContainer.remove(),this.stageProgressContainer=null),this.stageProgressTrack=null,this.stageProgressFill=null,this.stageProgressGoalEl=null,this.container&&(this.container.remove(),this.container=null),this.boostButton&&(this.boostButton.remove(),this.boostButton=null),this.boostHintEl&&(this.boostHintEl.remove(),this.boostHintEl=null),this.cooldownContainer&&(this.cooldownContainer.remove(),this.cooldownContainer=null),this.cooldownBar=null,this.boostLocked=!1,this.pauseEnabled=!0,this.lastCooldownProgress=1,this.lastCooldownPct=-1,this.lastReadyState=null,this.lastCooldownBarBoxShadow=null,this.lastBoostButtonAriaDisabled=null,this.lastBoostReadyRingVisible=null,this.boostButtonStyleCache={opacity:null,filter:null,animation:null,transform:null},this.lastPauseButtonAriaDisabled=null,this.pauseButtonStyleCache={opacity:null,filter:null,cursor:null,transform:null},this.lastStageProgressPct=-1,this.lastStageProgressComplete=null,this.lastScore=-1,this.lastStarCount=-1,this.scoreEl=null,this.starCountEl=null,this.bestStarContainerEl=null,this.bestStarCountEl=null,this.bestStarCount=0,this.lastBestStarCount=-1,this.bestStarPulsed=!1,this.liveRegionWriteNonce=0,this.lastAnnouncedProgressThreshold=0}}class ss{overlayEl=null;bubbleEl=null;highContrastMode=!1;show(t,e){const s=document.getElementById("ui-overlay");s&&(this.injectStyles(),(!this.overlayEl||!this.bubbleEl)&&(this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-adaptive-tutorial-hint",""),this.overlayEl.setAttribute("aria-hidden","true"),this.overlayEl.style.cssText=`
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
    `,document.head.appendChild(t)}}const is=1,as=.4;class It{overlayEl=null;numberEl=null;phase="idle";elapsed=0;currentStep=0;stepDuration;goDuration;onTick;onGo;onComplete=null;steps=["3","2","1"];constructor(t={}){this.stepDuration=t.stepDuration??is,this.goDuration=t.goDuration??as,this.onTick=t.onTick,this.onGo=t.onGo}show(t){if(this.phase!=="idle"&&this.phase!=="done")return;const e=document.getElementById("ui-overlay")??document.body;this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-countdown-overlay",""),this.overlayEl.style.cssText=`
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
    `,this.overlayEl.appendChild(this.numberEl),e.appendChild(this.overlayEl),this.phase="counting",this.elapsed=0,this.currentStep=0,this.onComplete=t,this.renderStep(this.steps[this.currentStep]),this.fireTick()}tick(t){if(!(this.phase==="idle"||this.phase==="done")){if(t<0&&(t=0),this.elapsed+=t,this.phase==="counting"){const e=this.elapsed;this.applyStepAnimation(e/this.stepDuration),e>=this.stepDuration&&(this.currentStep++,this.elapsed=0,this.currentStep<this.steps.length?(this.renderStep(this.steps[this.currentStep]),this.fireTick()):(this.phase="go",this.renderStep("スタート！"),this.fireGo()));return}this.phase==="go"&&(this.applyStepAnimation(this.elapsed/this.goDuration),this.elapsed>=this.goDuration&&this.complete())}}hide(){this.overlayEl&&(this.overlayEl.remove(),this.overlayEl=null),this.numberEl=null,this.phase="done",this.onComplete=null}dispose(){this.hide(),this.onTick=void 0,this.onGo=void 0}isActive(){return this.phase==="counting"||this.phase==="go"}getCurrentLabel(){return this.numberEl?.textContent??null}renderStep(t){this.numberEl&&(this.numberEl.textContent=t,this.numberEl.style.opacity="0",this.numberEl.style.transform="scale(0.6)")}applyStepAnimation(t){if(!this.numberEl)return;const e=Math.max(0,Math.min(1,t));let s,i;if(e<.2){const a=e/.2;s=.6+a*.5,i=a}else if(e<.7)s=1.1-(e-.2)/.5*.1,i=1;else{const a=(e-.7)/.3;s=1+a*.2,i=1-a}this.numberEl.style.transform=`scale(${s.toFixed(3)})`,this.numberEl.style.opacity=i.toFixed(3)}fireTick(){try{this.onTick?.()}catch{}}fireGo(){try{this.onGo?.()}catch{}}complete(){const t=this.onComplete;if(this.hide(),t)try{t()}catch{}}}const ns=1.8;class os{constructor(t,e={}){this.entry=t,this.totalDuration=e.totalDuration??ns}overlayEl=null;cardEl=null;phase="idle";elapsed=0;onComplete=null;totalDuration;show(t){if(this.phase!=="idle"&&this.phase!=="done")return;const e=document.getElementById("ui-overlay")??document.body;zt();const s=D().height<=500;this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-stage-intro-overlay",""),this.overlayEl.style.cssText=`
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
    `;const n=document.createElement("div");n.textContent=this.entry.reading,n.setAttribute("data-stage-intro-name",""),n.style.cssText=`
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
    `,this.cardEl.append(i,a,n,o),this.overlayEl.appendChild(this.cardEl),e.appendChild(this.overlayEl),this.phase="showing",this.elapsed=0,this.onComplete=t,this.applyAnimation(0)}tick(t){this.phase==="showing"&&(this.elapsed+=Math.max(0,t),this.applyAnimation(this.elapsed/this.totalDuration),this.elapsed>=this.totalDuration&&this.complete())}hide(){this.overlayEl&&(this.overlayEl.remove(),this.overlayEl=null),this.cardEl=null,this.phase="done",this.onComplete=null}dispose(){this.hide()}isActive(){return this.phase==="showing"}applyAnimation(t){if(!this.overlayEl||!this.cardEl)return;const e=Math.max(0,Math.min(1,t));let s=1,i=1,a=0,n=1;if(e<.18){const o=e/.18;i=o,s=o,a=24-24*o,n=.92+.1*o}else if(e<.72){const o=(e-.18)/.54;i=1,s=1,a=0,n=1.02-.02*o}else{const o=(e-.72)/.28;i=1-o*.8,s=1-o,a=-18*o,n=1-.04*o}this.overlayEl.style.opacity=i.toFixed(3),this.cardEl.style.opacity=s.toFixed(3),this.cardEl.style.transform=`translateY(${a.toFixed(1)}px) scale(${n.toFixed(3)})`}complete(){const t=this.onComplete;if(this.hide(),!!t)try{t()}catch{}}}class G{static STYLE_ID="score-popup-animations";static POOL_SIZE=6;static POPUP_LIFETIME_MS=720;root=null;pool=[];highContrastMode=!1;nextRecycleIndex=0;scratch=new $;setHighContrastMode(t){this.highContrastMode=t}show(t,e,s){const i=t>=500;this.showPopup({text:`${i?"🌈":"⬢"} +${t}`,kind:i?"bonus":"normal",color:i?"#ff9cf7":"#ffe066",shadow:i?"rgba(255, 156, 247, 0.55)":"rgba(255, 214, 102, 0.55)"},e,s)}showLabel(t,e,s,i="normal"){const a=i==="shooting-star"||i==="special-star"?{text:t,kind:i,color:"rgb(255, 244, 179)",shadow:"rgba(191, 231, 255, 0.75)"}:{text:t,kind:i,color:"#ffe066",shadow:"rgba(255, 214, 102, 0.55)"};this.showPopup(a,e,s)}showPopup(t,e,s){const i=this.ensureRoot();if(!i||(this.scratch.set(e.x,e.y,e.z).project(s),!Number.isFinite(this.scratch.x)||!Number.isFinite(this.scratch.y)||!Number.isFinite(this.scratch.z)))return;const a=Math.round((this.scratch.x*.5+.5)*1e5)/1e3,n=Math.round((-this.scratch.y*.5+.5)*1e5)/1e3,o=this.acquireEntry(i),h=o.useAltAnimation?"scorePopupFloatB":"scorePopupFloatA";o.useAltAnimation=!o.useAltAnimation,o.currentAnimationName=h,o.el.textContent=t.text,o.el.style.left=`${a}%`,o.el.style.top=`${n}%`,o.el.style.color=t.color,o.el.style.textShadow=`0 2px 10px ${t.shadow}`,o.el.style.background=this.highContrastMode?t.kind==="bonus"||t.kind==="shooting-star"||t.kind==="special-star"?"rgba(13, 18, 38, 0.92)":"rgba(0, 0, 0, 0.82)":"transparent",o.el.style.border=this.highContrastMode?t.kind==="bonus"||t.kind==="shooting-star"||t.kind==="special-star"?"3px solid rgba(255, 255, 255, 0.95)":"2px dashed rgba(255, 255, 255, 0.95)":"none",o.el.style.borderRadius=this.highContrastMode?"999px":"0",o.el.style.padding=this.highContrastMode?"0.18rem 0.55rem":"0",o.el.style.setProperty("-webkit-text-stroke",this.highContrastMode?"0.6px #061126":"0"),o.el.setAttribute("data-score-popup-kind",t.kind),o.el.style.visibility="visible",o.el.style.opacity="1",o.el.style.animationName=h,o.el.removeAttribute("data-score-popup-active"),o.el.setAttribute("data-score-popup-active",""),o.active=!0;const d=()=>{this.releaseEntry(o)};o.onAnimationEnd=u=>{u.animationName===o.currentAnimationName&&d()},o.el.addEventListener("animationend",o.onAnimationEnd),o.timeoutId=window.setTimeout(d,G.POPUP_LIFETIME_MS)}dispose(){for(const t of this.pool)this.clearEntry(t),t.el.remove();this.pool=[],this.root?.remove(),this.root=null,this.nextRecycleIndex=0}ensureRoot(){const t=document.getElementById("ui-overlay");return t?(this.root&&(this.root.parentElement!==t||!this.root.isConnected)&&this.dispose(),this.root?this.root:(this.injectStyles(),this.root=document.createElement("div"),this.root.setAttribute("data-score-popup-root",""),this.root.style.position="absolute",this.root.style.inset="0",this.root.style.overflow="hidden",this.root.style.pointerEvents="none",this.root.style.contain="layout style paint",t.appendChild(this.root),this.root)):null}acquireEntry(t){if(this.pool.length<G.POOL_SIZE){const s=this.createEntry();return this.pool.push(s),t.appendChild(s.el),s}const e=this.pool.find(s=>!s.active)??this.pool[this.nextRecycleIndex++%this.pool.length];return this.clearEntry(e),e}createEntry(){const t=document.createElement("div");return t.setAttribute("data-score-popup",""),t.style.position="absolute",t.style.transform="translate3d(-50%, -50%, 0)",t.style.fontFamily="'Zen Maru Gothic', sans-serif",t.style.fontSize="clamp(1rem, 3.5vmin, 1.4rem)",t.style.fontWeight="900",t.style.lineHeight="1",t.style.whiteSpace="nowrap",t.style.pointerEvents="none",t.style.willChange="transform, opacity",t.style.visibility="hidden",t.style.opacity="0",t.style.animationDuration=`${G.POPUP_LIFETIME_MS}ms`,t.style.animationTimingFunction="ease-out",t.style.animationIterationCount="1",{el:t,active:!1,timeoutId:null,onAnimationEnd:null,useAltAnimation:!1,currentAnimationName:"none"}}releaseEntry(t){this.clearEntry(t),t.el.style.visibility="hidden",t.el.style.opacity="0"}clearEntry(t){t.active=!1,t.currentAnimationName="none",t.el.removeAttribute("data-score-popup-active"),t.el.removeAttribute("data-score-popup-kind"),t.el.style.animationName="none",t.timeoutId!==null&&(window.clearTimeout(t.timeoutId),t.timeoutId=null),t.onAnimationEnd&&(t.el.removeEventListener("animationend",t.onAnimationEnd),t.onAnimationEnd=null)}injectStyles(){if(document.getElementById(G.STYLE_ID))return;const t=document.createElement("style");t.id=G.STYLE_ID,t.textContent=`
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
    `,document.head.appendChild(t)}}class rs{overlayEl=null;leftGuideEl=null;rightGuideEl=null;instructionEl=null;currentMode=null;show(t="intro"){if(this.overlayEl){this.setMode(t);return}const e=document.getElementById("ui-overlay");e&&(this.injectStyles(),this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-touch-guide-overlay",""),this.overlayEl.setAttribute("role","region"),this.overlayEl.setAttribute("aria-label","そうさ ガイド"),this.overlayEl.style.cssText=`
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
    `,document.head.appendChild(t)}getActiveSide(t){return t==="active-left"?"left":t==="active-right"?"right":t==="assist-left"?"left":t==="assist-right"?"right":t==="hidden"?"none":"both"}getGuideEmphasis(t,e){return e==="active-left"?t==="left"?"primary":"secondary":e==="active-right"?t==="right"?"primary":"secondary":e==="assist-left"?t==="left"?"primary":"secondary":e==="assist-right"?t==="right"?"primary":"secondary":e==="hidden"?"hidden":"balanced"}updateInstruction(t){if(!this.instructionEl)return;const e=this.getInstructionMessage(t);this.instructionEl.textContent=e,this.instructionEl.setAttribute("data-touch-guide-message",e)}getInstructionMessage(t){return t==="intro"?"ひだりか みぎを さわると うごけるよ":t==="idle"?"ひつような ときは ひだりか みぎを さわって うごこう":t==="assist-left"?"ひだりへ よけよう":t==="assist-right"?"みぎへ よけよう":""}}class ht{static DEFAULT_DURATION=4.2;static CELEBRATION_DURATION=3.6;element=null;timer=0;message=null;highContrast=!1;showHint(t){this.showMessage(t,ht.DEFAULT_DURATION)}showCelebration(t){this.showMessage(t,ht.CELEBRATION_DURATION)}tick(t){this.timer<=0||(this.timer=Math.max(0,this.timer-t),this.timer===0&&this.hide())}hide(){this.timer=0,this.message=null,this.element&&(this.element.style.display="none",this.element.textContent="",this.element.removeAttribute("data-constellation-message"))}setHighContrastMode(t){this.highContrast=t,this.element&&this.applyElementStyle(this.element)}getMessage(){return this.message}showMessage(t,e){const s=this.ensureElement();this.timer=e,this.message=t,s.textContent=t,s.setAttribute("data-constellation-message",t),s.style.display="flex"}ensureElement(){if(this.element)return this.element;const t=document.getElementById("ui-overlay"),e=document.createElement("div");return e.setAttribute("data-constellation-hint",""),e.setAttribute("aria-live","polite"),this.applyElementStyle(e),e.style.display="none",t?.appendChild(e),this.element=e,e}applyElementStyle(t){t.style.cssText=`
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
    `}}const ls=4;class hs{overlayEl=null;cardEl=null;titleEl=null;messageEl=null;elapsed=0;visible=!1;highContrastMode=!1;totalDuration;constructor(t={}){this.totalDuration=t.totalDuration??ls}show(t){const e=document.getElementById("ui-overlay")??document.body;zt();const s=D().height<=500;(!this.overlayEl||!this.cardEl||!this.titleEl||!this.messageEl)&&(this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-seasonal-event-notice",""),this.overlayEl.style.cssText=`
        position: absolute;
        top: clamp(4.6rem, 12vh, 6.8rem);
        left: 50%;
        transform: translateX(-50%);
        z-index: 14;
        pointer-events: none;
      `,this.cardEl=document.createElement("div"),this.cardEl.setAttribute("data-seasonal-event-notice-card",""),this.titleEl=document.createElement("div"),this.titleEl.setAttribute("data-seasonal-event-notice-title",""),this.messageEl=document.createElement("div"),this.messageEl.setAttribute("data-seasonal-event-notice-message",""),this.messageEl.setAttribute("role","status"),this.messageEl.setAttribute("aria-live","polite"),this.messageEl.setAttribute("aria-atomic","true"),this.cardEl.append(this.titleEl,this.messageEl),this.overlayEl.appendChild(this.cardEl)),this.overlayEl.style.display="block",this.visible=!0,this.elapsed=0,this.titleEl.textContent=`${t.emoji} ${t.title}`,this.messageEl.textContent=t.noticeMessage,this.overlayEl.setAttribute("data-seasonal-event-id",t.id),this.overlayEl.setAttribute("aria-hidden","false"),this.applyStyles(t.accentColor,s),this.overlayEl.isConnected||e.appendChild(this.overlayEl)}tick(t){this.visible&&(this.elapsed+=Math.max(0,t),this.elapsed>=this.totalDuration&&this.hide())}hide(){this.overlayEl&&(this.visible=!1,this.elapsed=0,this.overlayEl.remove(),this.overlayEl=null,this.cardEl=null,this.titleEl=null,this.messageEl=null)}dispose(){this.hide()}isVisible(){return this.visible}setHighContrastMode(t){this.highContrastMode=t;const e=this.overlayEl?.getAttribute("data-seasonal-event-id")?this.overlayEl?.getAttribute("data-seasonal-event-accent"):null;!this.cardEl||!e||this.applyStyles(Number(e),D().height<=500)}applyStyles(t,e){if(!this.overlayEl||!this.cardEl||!this.titleEl||!this.messageEl)return;const s=`#${t.toString(16).padStart(6,"0")}`;this.overlayEl.setAttribute("data-seasonal-event-accent",String(t)),this.cardEl.style.cssText=`
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
    `}}class cs{overlayEl=null;continueButton=null;retryButton=null;rewardButton=null;isContinueEnabled=!1;hasHandledContinue=!1;isRewardOpen=!1;buttonCleanups=new Set;show(t){this.hide();const e=document.getElementById("ui-overlay");if(!e)return;this.isContinueEnabled=!1,this.hasHandledContinue=!1,this.isRewardOpen=!1,this.injectStageClearBurstAnimation();const s=document.createElement("div");s.setAttribute("data-stage-clear-overlay",""),s.style.cssText=`
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
    `;const a=bt(t,e,{label:"こんかい",hint:`⭐ ${e}`,size:"hero",scope:"stage-clear-current"});a.style.minWidth="136px",a.style.padding="0.65rem 0.8rem",a.style.borderRadius="20px",a.style.background="rgba(255, 255, 255, 0.12)";const n=bt(t,s,{label:"ベスト",hint:`⭐ ${s}`,size:"hero",scope:"stage-clear-best"});return n.style.minWidth="136px",n.style.padding="0.65rem 0.8rem",n.style.borderRadius="20px",n.style.background="rgba(255, 255, 255, 0.12)",i.append(a,n),i}createNextAdventureCard(t){const e=document.createElement("section");e.setAttribute("data-stage-clear-next-preview",""),e.style.cssText=`
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
    `);i.setAttribute("data-stage-clear-next-title","");const a=document.createElement("div");a.textContent=t.emoji,a.setAttribute("data-stage-clear-next-emoji",""),a.style.cssText=`
      font-size: clamp(2.6rem, 11vmin, 3.9rem);
      line-height: 1;
      filter: drop-shadow(0 8px 12px rgba(0, 0, 0, 0.24));
    `;const n=this.createHeading(t.reading,`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(1.2rem, 4.2vmin, 1.55rem);
      font-weight: 800;
      color: #ffffff;
    `);n.setAttribute("data-stage-clear-next-name","");const o=this.createHeading(t.trivia,`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(0.95rem, 3.4vmin, 1.05rem);
      font-weight: 700;
      color: #dfeaff;
      line-height: 1.35;
    `);return o.setAttribute("data-stage-clear-next-trivia",""),e.append(s,i,a,n,o),e}createActionButtons(t){const e=!!(t.rewardEntry&&t.onReward),s=document.createElement("div");s.setAttribute("data-stage-clear-actions",""),s.style.cssText=`
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
    `,i.style.opacity="0",i.style.visibility="hidden",i.style.pointerEvents="none";const a=document.createElement("button");return a.setAttribute("data-stage-clear-continue",""),a.setAttribute("aria-label",t.continueLabel),a.textContent=t.continueLabel,a.disabled=!0,a.style.cssText=`
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
    `,a.style.opacity="0",a.style.visibility="hidden",a.style.pointerEvents="none",this.attachActionHandlers(i,t.onRetry),this.attachActionHandlers(a,t.onContinue),this.retryButton=i,this.continueButton=a,s.append(i,a),s}createRewardButton(t){const e=document.createElement("button");return e.setAttribute("data-stage-clear-card",""),e.textContent="カードをみる",e.style.cssText=`
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
    `,this.buttonCleanups.add(A(e,{canActivate:()=>!this.isRewardOpen,onActivate:()=>{this.isRewardOpen||t.onReward?.()},onPressChange:s=>{e.style.transform=s?"scale(0.96)":"scale(1)"},preventDefaultOnPointerDown:!0,preventDefaultOnClick:!0,stopPropagation:!0})),this.rewardButton=e,e}attachActionHandlers(t,e){const s=()=>!this.isRewardOpen&&this.isContinueEnabled&&!this.hasHandledContinue,i=A(t,{canActivate:s,onActivate:()=>{if(s()){this.hasHandledContinue=!0;for(const a of[this.retryButton,this.continueButton])a&&(a.disabled=!0,a.style.pointerEvents="none",a.style.transform="scale(1)");e()}},onPressChange:a=>{t.style.transform=a?"scale(0.96)":"scale(1)"},preventDefaultOnPointerDown:!0,preventDefaultOnClick:!0,stopPropagation:!0});this.buttonCleanups.add(i)}appendClearCelebrationBurst(){if(!this.overlayEl)return;const t=document.createElement("div");t.setAttribute("data-stage-clear-burst",""),t.style.cssText=`
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
    `,document.head.appendChild(t)}}const ds=2600,Dt={gentle:{title:"うちゅうせんを かるくしたよ ⭐",detail:"ほしと きらきらを すこし やさしく したよ"},stronger:{title:"もっと かるくしたよ 🚀",detail:"なめらかに あそべるように えんしゅつを ぎゅっと したよ"}};class us{overlayEl=null;hideTimer=null;show(t){if(!this.overlayEl){const a=document.getElementById("ui-overlay")??document.body,n=document.createElement("div");n.setAttribute("data-frame-rate-hint-overlay",""),n.setAttribute("role","status"),n.setAttribute("aria-live","polite"),n.style.cssText=`
        position: absolute;
        top: max(18px, env(safe-area-inset-top));
        left: 50%;
        transform: translateX(-50%);
        width: min(86vw, 560px);
        pointer-events: none;
        z-index: 55;
        font-family: 'Zen Maru Gothic', sans-serif;
      `,n.innerHTML=`
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
      `,this.overlayEl=n,a.appendChild(n)}const e=t.level>=2?Dt.stronger:Dt.gentle,s=this.overlayEl.querySelector("[data-frame-rate-hint-title]"),i=this.overlayEl.querySelector("[data-frame-rate-hint-detail]");s&&(s.textContent=e.title),i&&(i.textContent=e.detail),this.hideTimer!==null&&window.clearTimeout(this.hideTimer),this.hideTimer=window.setTimeout(()=>{this.hide()},ds)}hide(){this.hideTimer!==null&&(window.clearTimeout(this.hideTimer),this.hideTimer=null),this.overlayEl?.remove(),this.overlayEl=null}dispose(){this.hide()}isVisible(){return this.overlayEl!==null}}const ft=1,ms=2e3,gt={starCollect:{duration:.09,amplitudeX:.04,amplitudeY:.025,frequency:34},rainbowCollect:{duration:.12,amplitudeX:.07,amplitudeY:.04,frequency:32},meteoriteHit:{duration:.28,amplitudeX:.18,amplitudeY:.12,frequency:42},boost:{duration:.14,amplitudeX:.08,amplitudeY:.045,frequency:28},stageClear:{duration:.3,amplitudeX:.1,amplitudeY:.06,frequency:22}};function ps(l){const t=window.requestIdleCallback;if(typeof t=="function"){t(l,{timeout:1500});return}window.setTimeout(l,800)}class y{static VISUAL_QUALITY_SCALE_BY_TIER=[.45,.7,1];static BG_STAR_COUNT=ms;static ASSIST_TRIGGER_HIT_WINDOW=6;static ASSIST_TRIGGER_HIT_COUNT=2;static ASSIST_DURATION=5;static ASSIST_MESSAGE_DURATION=3;static ASSIST_METEORITE_INTERVAL_MULTIPLIER=1.7;static ASSIST_MESSAGE="だいじょうぶ！ ゆっくりいこう ✨";static ASSIST_DIRECTION_REFRESH_INTERVAL=.35;static ASSIST_DIRECTION_LOOKAHEAD=42;static ASSIST_DIRECTION_SIDE_TARGET_X=4.5;static ASSIST_DIRECTION_SIDE_RANGE=7.5;static ASSIST_DIRECTION_DIFF_THRESHOLD=1.1;static ASSIST_DIRECTION_DIFF_RATIO=.28;threeScene;camera;lastAspect=0;initialized=!1;sceneManager;inputSystem;audioManager;saveManager;ambientLight;directionalLight;spaceship;stars=[];meteorites=[];shootingStars=[];comets=[];specialShootingStars=[];collisionSystem=new Xt;scoreSystem=new Qt;spawnSystem=new Kt;boostSystem=new Jt;lodSystem=new te;meteoShowerEventSystem=new ee;stageSpecialEventSystem=new se;spaceWeatherEventSystem=new ie;specialStarSpawnSystem=new ae;seasonalEventSystem;hud;scorePopupManager=new G;scorePopupEffect=new ne;particleBurstManager=new oe;planetRingEffect=new re;constellationLineEffect=new le;constellationSystem=new he;constellationHintOverlay=new ht;airShield;meteoShowerEffect;spaceWeatherEffect;stageSpecialEffects;seasonalEventEffects=new ce;rainbowTrailEffect;stageAtmosphereEffect=new Gt;wormholeTunnelEffect=new de;seasonalEventNotice=new hs;stageConfig;stageNumber=1;launchSource="campaign";isCleared=!1;clearTimer=0;stageClearOverlay=new cs;isClearRewardOpen=!1;isOpeningClearReward=!1;clearRewardOverlay=null;clearRewardOverlayPromise=null;static CLEAR_CONTINUE_DELAY=.6;stageEntryTotalScore=0;stageEntryTotalStarCount=0;playTime=0;meteoriteHitTimes=[];assistTimer=0;assistMessageTimer=0;assistDirection=null;assistDirectionRefreshTimer=0;damageTimer=0;static DAMAGE_FLASH_DURATION=.5;cameraShakeTimer=0;cameraShakeElapsed=0;cameraShakeOffset=new $;cameraShakeProfile=gt.meteoriteHit;motionSensitivity=_;cameraPositionTarget=new $(0,5,10);cameraLookAtTarget=new $(0,0,-10);destinationPlanet=null;destinationPlanetSpinTarget=null;static DESTINATION_PLANET_SPIN_SPEED=.2;static BOOST_HINT_DURATION=2.4;static ADAPTIVE_HINT_DURATION=3;static SHOOTING_STAR_SCORE_BONUS_DURATION=6;static METEO_SHOWER_MESSAGE="りゅうせいぐんだ！ ✨";static METEO_SHOWER_MESSAGE_DURATION=2.4;static STAGE_SPECIAL_MESSAGE_DURATION=2.8;static WORMHOLE_TRANSITION_DURATION=2.2;bgStars=null;boostLinesEffect;companionManager=null;elapsedTime=0;boostFlameEffect;isStarting=!1;stageIntroOverlay=null;countdownOverlay=null;awaitingResume=!1;resumeCountdownOverlay=null;isHomeConfirmOpen=!1;shouldResumeAfterHomeConfirm=!1;pauseOverlay=new qt;isPauseOpen=!1;shouldResumeAfterPause=!1;touchGuide=new rs;touchGuideMode="intro";touchGuideIdleTimer=0;hasSeenMoveInput=!1;isActive=!1;boostHintDisplayTimer=0;adaptiveHintDisplayTimer=0;adaptiveTutorialSystem=new ue;adaptiveTutorialHint=new ss;meteoShowerAnnouncementTimer=0;spaceWeatherAnnouncementTimer=0;spaceWeatherAnnouncementMessage="";stageSpecialAnnouncementTimer=0;stageSpecialAnnouncementMessage="";prewarmRequestToken=0;static TOUCH_GUIDE_IDLE_DELAY=3;visualQualityTier=y.VISUAL_QUALITY_SCALE_BY_TIER.length-1;performanceAdaptationLevel=0;frameRateHintOverlay=new us;scheduleIdleTask;loadEncyclopediaOverlay;clearRewardRequestToken=0;wormholeTransitionTimer=0;pendingWormholeTransition=null;onPauseRequested=null;onResumeRequested=null;onExitHomeRequested=null;attemptStatsRecorded=!1;constructor(t,e,s,i,a={}){this.sceneManager=t,this.inputSystem=e,this.audioManager=s,this.saveManager=i,this.scoreSystem.setScoreGainListener(h=>{h.worldPosition&&this.scorePopupEffect.emit(h.worldPosition,h.amount)}),this.scheduleIdleTask=a.scheduleIdleTask??ps,this.seasonalEventSystem=new me(a.seasonalEventDateProvider),this.loadEncyclopediaOverlay=a.loadEncyclopediaOverlay??(()=>yt(()=>import("./EncyclopediaOverlay-BM1UKxxL.js"),__vite__mapDeps([0,1,2]))),this.threeScene=new V,this.threeScene.background=new X(32);const{width:n,height:o}=D();this.camera=new dt(60,n/o,.1,2e3)}ensureInitialized(){this.initialized||(this.ambientLight=new ct(16777215,.6),this.directionalLight=new _t(16777215,.8),this.directionalLight.position.set(5,10,5),this.threeScene.add(this.ambientLight),this.threeScene.add(this.directionalLight),this.spaceship=new Nt,this.threeScene.add(this.spaceship.mesh),this.airShield=new pe,this.threeScene.add(this.airShield.getMesh()),this.companionManager=new St([]),this.threeScene.add(this.companionManager.getGroup()),this.boostLinesEffect=new fe,this.boostLinesEffect.init(this.threeScene),this.boostFlameEffect=new ge,this.boostFlameEffect.init(this.threeScene),this.rainbowTrailEffect=new ye,this.threeScene.add(this.rainbowTrailEffect.group),this.constellationLineEffect.init(this.threeScene),this.meteoShowerEffect=new be,this.meteoShowerEffect.init(this.threeScene),this.spaceWeatherEffect=new ve,this.spaceWeatherEffect.init(this.threeScene),this.stageSpecialEffects=new Se,this.stageSpecialEffects.init(this.threeScene),this.seasonalEventEffects.init(this.threeScene),this.stageAtmosphereEffect.init(this.threeScene),this.wormholeTunnelEffect.init(this.threeScene),this.scorePopupEffect.init(this.threeScene),this.hud=new es,this.initialized=!0,this.applyVisualQualityTier())}setVisualQualityTier(t){this.visualQualityTier=y.clampVisualQualityTier(t),this.applyVisualQualityTier()}setPerformanceAdaptationLevel(t){this.performanceAdaptationLevel=y.clampPerformanceAdaptationLevel(t),this.applyVisualQualityTier()}showFrameRateHint(t){this.isActive&&this.frameRateHintOverlay.show({level:t})}enter(t){this.ensureInitialized(),this.isActive=!0,this.prewarmRequestToken+=1,this.clearRewardRequestToken+=1,this.lastAspect=0,this.stageNumber=t.stageNumber??1,this.launchSource=t.launchSource??"campaign",this.stageConfig=N(this.stageNumber),this.prefetchEndingSceneModuleIfNeeded(),this.isCleared=!1,this.clearTimer=0,this.stageClearOverlay.hide(),this.isClearRewardOpen=!1,this.isOpeningClearReward=!1,this.wormholeTransitionTimer=0,this.pendingWormholeTransition=null,this.wormholeTunnelEffect.clear(),this.damageTimer=0,this.elapsedTime=0,this.destinationPlanetSpinTarget=null,this.planetRingEffect.clear(),this.isHomeConfirmOpen=!1,this.shouldResumeAfterHomeConfirm=!1,this.isPauseOpen=!1,this.shouldResumeAfterPause=!1,this.pauseOverlay.hide(),this.touchGuideIdleTimer=0,this.hasSeenMoveInput=!1,this.touchGuideMode="intro",this.playTime=0,this.attemptStatsRecorded=!1,this.meteoriteHitTimes.length=0,this.meteoShowerAnnouncementTimer=0,this.spaceWeatherAnnouncementTimer=0,this.spaceWeatherAnnouncementMessage="",this.stageSpecialAnnouncementTimer=0,this.stageSpecialAnnouncementMessage="",this.assistTimer=0,this.assistMessageTimer=0,this.assistDirection=null,this.assistDirectionRefreshTimer=0,this.adaptiveTutorialSystem.reset(),this.adaptiveHintDisplayTimer=0,this.adaptiveTutorialHint.hide(),this.meteoShowerEventSystem.reset(),this.spaceWeatherEventSystem.reset(),this.stageSpecialEventSystem.setStage(Ee(this.stageNumber)),this.meteoShowerEffect.clear(),this.spaceWeatherEffect.clear(),this.stageSpecialEffects.clear(),this.resetBoostHintState();const e=t.totalScore??0,s=t.totalStarCount??0,i=this.saveManager.load();this.spaceship.applyCustomization(i.spaceshipCustomization??vt);const a=i.colorAccessibility?.highContrast===!0;this.motionSensitivity=i.colorAccessibility?.motionSensitivity??_,Ht(i.vibrationSettings?.intensity??"medium"),Pt(d=>this.handleVibrationFallback(d)),Ae(a),Te(a),this.hud.setHighContrastMode(a),this.scorePopupManager.setHighContrastMode(a),this.adaptiveTutorialHint.setHighContrastMode(a),this.constellationHintOverlay.setHighContrastMode(a),this.seasonalEventNotice.setHighContrastMode(a),this.stageEntryTotalScore=e,this.stageEntryTotalStarCount=s,this.scoreSystem.setTotalScore(e),this.scoreSystem.setTotalStarCount(s),this.resetStageObjects(),this.spaceship.reset(),this.inputSystem.resetPointers?.(),this.airShield.reset(0,0,0),this.boostLinesEffect.update(!1,0,0),this.boostFlameEffect.remove(),this.rainbowTrailEffect.clear(),this.companionManager?.resetUnlockedPlanets([]),this.createBackground(),this.stageAtmosphereEffect.start(Ft(this.stageNumber)),this.applyMotionSensitivity(),this.applyVisualQualityTier();const n=this.seasonalEventSystem.refresh();n&&(this.seasonalEventEffects.start(n),this.seasonalEventNotice.show(n)),this.camera.position.set(0,5,10),this.camera.lookAt(0,0,-10),this.cameraLookAtTarget.set(0,0,-10),this.createDestinationPlanet(),this.scheduleNextStageVisualPrewarm(),this.stars.length=0,this.meteorites.length=0,this.shootingStars.length=0,this.comets.length=0,this.specialShootingStars.length=0,this.spawnSystem.reset(),this.spawnSystem.setMeteoriteIntervalMultiplier(1),this.specialStarSpawnSystem.reset(),this.boostSystem.reset(),this.scoreSystem.resetStage(),this.constellationSystem.reset(xe(this.stageNumber)),this.constellationLineEffect.clear(),this.spawnConstellationStars();const o=this.constellationSystem.getDefinition();o?this.constellationHintOverlay.showHint(o.hintMessage):this.constellationHintOverlay.hide();const h=`ステージ${this.stageConfig.stageNumber}: ${this.stageConfig.emoji} ${this.stageConfig.displayName}`;this.hud.show(h,this.stageConfig.planetColor),this.hud.setBoostCallback(()=>{this.inputSystem.setBoostPressed(!0)}),this.hud.setBoostDeniedCallback(()=>{this.audioManager.playSFX("boostDenied")}),this.hud.setHomeCallback(()=>{this.isHomeConfirmOpen=!1,this.shouldResumeAfterHomeConfirm=!1,this.syncBoostInputLock(),this.syncPauseAvailability(),this.sceneManager.requestTransition("title")}),this.hud.setHomeConfirmOpenCallback(()=>{this.shouldResumeAfterHomeConfirm=this.isPlaying(),this.clearBlockedGameplayInput(),this.isHomeConfirmOpen=!0,this.syncBoostInputLock(),this.syncPauseAvailability()}),this.hud.setHomeConfirmCancelCallback(()=>{const d=this.shouldResumeAfterHomeConfirm;if(this.isHomeConfirmOpen=!1,this.shouldResumeAfterHomeConfirm=!1,this.syncPauseAvailability(),d){this.requestResumeCountdown();return}this.syncBoostInputLock()}),this.hud.setPauseCallback(()=>{this.requestManualPause()}),this.hud.setMuteState(this.audioManager.isMuted()),this.hud.setMuteCallback(()=>{const d=this.audioManager.toggleMute();this.hud.setMuteState(d);const u=this.saveManager.load();u.muted=d,this.saveManager.save(u)}),this.hud.update(this.scoreSystem.getStageScore(),this.scoreSystem.getStarCount()),this.hud.hideAssistMessage(),this.adaptiveTutorialHint.hide(),this.touchGuide.show("intro"),this.syncPauseAvailability(),this.hud.setBestStarCount(i.bestStageStars?.[this.stageNumber]??0),this.companionManager?.resetUnlockedPlanets(i.unlockedPlanets),this.bgStars&&at(this.bgStars,this.spaceship.position.z,ft),this.audioManager.playBGM(this.stageNumber),this.stageIntroOverlay?.dispose(),this.stageIntroOverlay=null,this.startOpeningSequence(t)}prefetchEndingSceneModuleIfNeeded(){if(this.stageNumber<R-1)return;this.sceneManager.prefetchSceneModule?.call(this.sceneManager,"ending")?.catch(()=>{})}startOpeningSequence(t){if(this.isStarting=!0,this.syncBoostInputLock(),this.syncPauseAvailability(),!this.shouldShowStageIntro(t)){this.startCountdown();return}const e=it(this.stageNumber);if(!e){this.startCountdown();return}this.stageIntroOverlay=new os(e),this.stageIntroOverlay.show(()=>{this.stageIntroOverlay=null,this.startCountdown()})}startCountdown(){if(this.isStarting=!0,this.syncBoostInputLock(),this.syncPauseAvailability(),this.shouldSkipCountdown()){this.isStarting=!1,this.countdownOverlay=null,this.syncBoostInputLock(),this.syncPauseAvailability();return}this.countdownOverlay=new It({onTick:()=>{this.audioManager.playSFX("countdownTick")},onGo:()=>{this.audioManager.playSFX("countdownGo")}}),this.countdownOverlay.show(()=>{this.isStarting=!1,this.countdownOverlay=null,this.syncBoostInputLock(),this.syncPauseAvailability()})}shouldShowStageIntro(t){return this.shouldSkipCountdown()||this.launchSource!=="campaign"||t.replayToken!==void 0||t.totalScore===void 0||t.totalStarCount===void 0?!1:it(this.stageNumber)!==void 0}releasePointerInputForLock(){this.inputSystem.resetPointers?.()}syncBoostInputLock(){const t=this.isStarting||this.awaitingResume||this.isHomeConfirmOpen||this.isPauseOpen;this.hud.setBoostLocked(t),t&&(this.resetBoostHintState(),this.inputSystem.setBoostPressed?.(!1))}clearBlockedGameplayInput(){this.inputSystem.resetPointers?.(),this.inputSystem.setBoostPressed?.(!1)}syncPauseAvailability(){this.hud.setPauseEnabled(this.canPause())}shouldSkipCountdown(){try{return new URLSearchParams(window.location.search).get("nocount")==="1"}catch{return!1}}isPlaying(){return!(!this.stageConfig||this.isCleared||this.isClearRewardOpen||this.isOpeningClearReward||this.isStarting||this.awaitingResume||this.isHomeConfirmOpen||this.isPauseOpen)}isUserPaused(){return this.isPauseOpen}requestResumeCountdown(){this.isPlaying()&&(this.resumeCountdownOverlay||this.shouldSkipCountdown()||(this.clearBlockedGameplayInput(),this.awaitingResume=!0,this.syncBoostInputLock(),this.syncPauseAvailability(),this.resumeCountdownOverlay=new It({onTick:()=>{this.audioManager.playSFX("countdownTick")},onGo:()=>{this.audioManager.playSFX("countdownGo")}}),this.resumeCountdownOverlay.show(()=>{this.awaitingResume=!1,this.resumeCountdownOverlay=null,this.syncBoostInputLock(),this.syncPauseAvailability()})))}setPauseHandlers(t){this.onPauseRequested=t.onPauseRequested??null,this.onResumeRequested=t.onResumeRequested??null,this.onExitHomeRequested=t.onExitHomeRequested??null}isManuallyPaused(){return this.isPauseOpen}requestManualPause(){this.canPause()&&(this.clearBlockedGameplayInput(),this.isPauseOpen=!0,this.syncBoostInputLock(),this.syncPauseAvailability(),this.pauseOverlay.show(()=>{this.isPauseOpen=!1,this.syncBoostInputLock(),this.syncPauseAvailability(),this.onResumeRequested?.()},()=>{this.isPauseOpen=!1,this.syncBoostInputLock(),this.syncPauseAvailability(),this.onExitHomeRequested?.()}),this.onPauseRequested?.())}canPause(){return!(!this.stageConfig||this.isCleared||this.isClearRewardOpen||this.isOpeningClearReward||this.isStarting||this.awaitingResume||this.isHomeConfirmOpen||this.isPauseOpen)}createBackground(){this.bgStars||(this.bgStars=Ut(this.getBackgroundStarDrawCount()),this.threeScene.add(this.bgStars))}createDestinationPlanet(){this.removeDestinationPlanet();const t=-(this.stageConfig.stageLength+50),{planet:e,spinTarget:s}=Wt(this.stageNumber,this.stageConfig,t);this.destinationPlanet=e,this.destinationPlanetSpinTarget=s,this.threeScene.add(this.destinationPlanet)}scheduleNextStageVisualPrewarm(){const t=this.stageNumber+1;if(t>R)return;const e=this.prewarmRequestToken;this.scheduleIdleTask(()=>{!this.isActive||this.prewarmRequestToken!==e||Mt(t)})}removeDestinationPlanet(){this.destinationPlanet&&(this.destinationPlanet.parent?.remove(this.destinationPlanet),this.destinationPlanet=null,this.destinationPlanetSpinTarget=null)}resetStageObjects(){this.clearRewardOverlay?.hide(),this.stageClearOverlay.hide(),this.isClearRewardOpen=!1,this.isOpeningClearReward=!1,this.removeDestinationPlanet(),this.resetCameraShake(),this.planetRingEffect.clear(),this.scorePopupEffect.clear(),this.particleBurstManager.clear(this.threeScene),this.spawnSystem.recycleAll(),this.spawnSystem.setMeteoriteIntervalMultiplier(1),this.meteoShowerEventSystem.reset(),this.meteoShowerEffect.clear(),this.meteoShowerAnnouncementTimer=0,this.spaceWeatherEventSystem.reset(),this.spaceWeatherEffect.clear(),this.spaceWeatherAnnouncementTimer=0,this.spaceWeatherAnnouncementMessage="",this.stageSpecialEventSystem.reset(),this.stageSpecialEffects.clear(),this.seasonalEventSystem.clear(),this.seasonalEventEffects.clear(),this.stageAtmosphereEffect.clear(),this.wormholeTunnelEffect.clear(),this.wormholeTransitionTimer=0,this.pendingWormholeTransition=null,this.rainbowTrailEffect.clear(),this.stageSpecialAnnouncementTimer=0,this.stageSpecialAnnouncementMessage="",this.seasonalEventNotice.hide(),this.stars.length=0,this.meteorites.length=0,this.shootingStars.length=0,this.comets.length=0,this.specialShootingStars.length=0,this.specialStarSpawnSystem.recycleAll(),this.specialStarSpawnSystem.reset(),this.hud?.hideAssistMessage(),this.constellationHintOverlay.hide(),this.constellationLineEffect.clear(),this.constellationSystem.reset(),this.resetBoostHintState()}update(t){if(!this.initialized)return;if(this.isCleared)return this.resetBoostHintState(),this.clearTimer+=t,this.seasonalEventNotice.tick(t),this.constellationHintOverlay.tick(t),this.constellationLineEffect.update(t),this.planetRingEffect.update(t),this.scorePopupEffect.update(t),this.particleBurstManager.update(this.threeScene,t),this.companionManager?.update(t,this.spaceship.position.x,this.spaceship.position.y,this.spaceship.position.z),this.destinationPlanetSpinTarget&&(this.destinationPlanetSpinTarget.rotation.y+=t*y.DESTINATION_PLANET_SPIN_SPEED),this.seasonalEventEffects.update(t,this.spaceship.position.x,this.spaceship.position.z),this.pendingWormholeTransition||this.revealClearActionButtonsIfReady(),this.stageAtmosphereEffect.update(t,this.camera,this.spaceship.position.x,this.spaceship.position.z),this.updateWormholeTransition(t),void 0;if(this.isStarting||this.awaitingResume||this.isHomeConfirmOpen||this.isPauseOpen){if(this.resetBoostHintState(),this.hideAdaptiveTutorialHint(),this.seasonalEventNotice.tick(t),this.inputSystem.setBoostPressed?.(!1),!this.isHomeConfirmOpen&&!this.isPauseOpen){const r=this.stageIntroOverlay?.isActive()??!1;this.stageIntroOverlay?.tick(t),r||this.countdownOverlay?.tick(t),this.resumeCountdownOverlay?.tick(t)}this.destinationPlanetSpinTarget&&(this.destinationPlanetSpinTarget.rotation.y+=t*y.DESTINATION_PLANET_SPIN_SPEED),this.bgStars&&at(this.bgStars,this.spaceship.position.z,ft),this.airShield.setPosition(this.spaceship.position.x,this.spaceship.position.y,this.spaceship.position.z),this.airShield.update(t),this.hud.update(this.scoreSystem.getStageScore(),this.scoreSystem.getStarCount()),this.constellationHintOverlay.tick(t),this.constellationLineEffect.update(t),this.seasonalEventEffects.update(t,this.spaceship.position.x,this.spaceship.position.z),this.stageAtmosphereEffect.update(t,this.camera,this.spaceship.position.x,this.spaceship.position.z);return}const e=this.inputSystem.getState();this.playTime+=t,this.seasonalEventNotice.tick(t),this.updateAssistTimers(t),this.updateMeteoShowerAnnouncement(t),this.updateSpaceWeatherAnnouncement(t),this.updateStageSpecialAnnouncement(t),this.updateAdaptiveHintDisplay(t),this.updateBoostHintDisplay(t),this.updateTouchGuide(e.moveDirection,t);const s=this.boostSystem.isActive(),i=this.boostSystem.isAvailable();e.boostPressed&&(this.boostSystem.activate()?(this.adaptiveTutorialSystem.recordBoostUsed(),this.audioManager.playSFX("boost"),st("boost"),this.audioManager.startBoostSFX(),this.boostFlameEffect.start()):this.audioManager.playSFX("boostDenied"),this.inputSystem.setBoostPressed(!1)),this.boostSystem.update(t),s&&!this.boostSystem.isActive()&&(this.audioManager.stopBoostSFX(),this.boostFlameEffect.stopEmitting()),!i&&this.boostSystem.isAvailable()&&(this.audioManager.playSFX("boostReady"),this.hud.flashBoostReady()),this.boostSystem.isActive()&&this.spaceship.speedState!=="BOOST"&&this.spaceship.activateBoost(),e.moveDirection===-1?this.spaceship.moveLeft(t):e.moveDirection===1&&this.spaceship.moveRight(t),this.spaceship.update(t),this.seasonalEventEffects.update(t,this.spaceship.position.x,this.spaceship.position.z);const a=this.spaceship.getProgress(this.stageConfig.stageLength),n=this.stageSpecialEventSystem.update(a,t);n.started&&n.event&&(this.stageSpecialEffects.start(n.event),this.showStageSpecialAnnouncement(n.event.message));const o=this.meteoShowerEventSystem.update(t);o.started&&(this.audioManager.playSFX("meteorShowerStart"),this.meteoShowerEffect.start(),this.showMeteoShowerAnnouncement());const h=this.spaceWeatherEventSystem.update(t);this.scoreSystem.setEventStarMultiplier?.(h.active&&h.event?h.event.starScoreMultiplier:1),h.started&&h.event&&(this.spaceWeatherEffect.start(h.event),this.showSpaceWeatherAnnouncement(h.event.message));const d=this.spawnSystem.update(t,this.spaceship.position.z,this.stageConfig,this.stars,this.meteorites,this.shootingStars,this.comets,{meteoShowerActive:o.active});for(const r of d.newStars)this.stars.push(r),this.threeScene.add(r.mesh);for(const r of d.newMeteorites)this.meteorites.push(r),this.threeScene.add(r.mesh);for(const r of d.newShootingStars)this.shootingStars.push(r),this.threeScene.add(r.mesh);for(const r of d.newComets)this.comets.push(r),this.threeScene.add(r.mesh);const u=this.specialStarSpawnSystem.update(t,this.spaceship.position.z,this.specialShootingStars,this.shootingStars,this.comets);for(const r of u.newSpecialStars)this.specialShootingStars.push(r),this.threeScene.add(r.mesh);this.lodSystem.update(this.spaceship.position,this.stars),this.lodSystem.update(this.spaceship.position,this.meteorites),this.companionManager?.update(t,this.spaceship.position.x,this.spaceship.position.y,this.spaceship.position.z);const g=this.companionManager?.getStarAttractionBonus()??0,p=this.collisionSystem.check(this.spaceship,this.stars,this.meteorites,g,this.shootingStars,this.comets,this.specialShootingStars);if(p.shootingStarHit){const r=p.shootingStarHit;this.scoreSystem.addBonusScore(r.scoreBonus,r.position),this.scoreSystem.activateShootingStarBonus(Math.max(y.SHOOTING_STAR_SCORE_BONUS_DURATION,r.bonusDuration)),this.audioManager.playSFX("shootingStarCollect"),this.scorePopupManager.showLabel("☆ながれぼし☆",r.position,this.camera,"shooting-star"),this.particleBurstManager.emitShootingStar(this.threeScene,r.position.x,r.position.y,r.position.z)}if(p.cometHit){const r=p.cometHit;this.scoreSystem.addBonusScore(r.scoreBonus,r.position),this.scoreSystem.activateShootingStarBonus(r.bonusDuration),this.audioManager.playSFX("cometCollect"),this.particleBurstManager.emit(this.threeScene,r.position.x,r.position.y,r.position.z,12447743,50,!0),this.particleBurstManager.emit(this.threeScene,r.position.x,r.position.y,r.position.z,16777215,50,!0)}if(p.specialShootingStarHit){const r=p.specialShootingStarHit,f=we(r.specialType),c=this.saveManager.markSpecialStarDiscovered?.(r.specialType)??!1;this.scoreSystem.addBonusScore(r.scoreBonus,r.position),this.audioManager.playSFX("shootingStarCollect"),st("rainbowCollect"),this.particleBurstManager.emitShootingStar(this.threeScene,r.position.x,r.position.y,r.position.z),this.particleBurstManager.emit(this.threeScene,r.position.x,r.position.y,r.position.z,ut[r.specialType].visual.trailColor,50,!0),this.particleBurstManager.emit(this.threeScene,r.position.x,r.position.y,r.position.z,ut[r.specialType].visual.auraColor,50,!0),this.scorePopupManager.showLabel(c&&f?`${f.emoji} ${f.reading}`:ut[r.specialType].label,r.position,this.camera,"special-star")}for(const r of p.starCollisions)this.scoreSystem.addStarScore(r.starType,r.position),r.starType==="RAINBOW"?(this.audioManager.playSFX("rainbowCollect"),this.rainbowTrailEffect.start(this.spaceship.position),this.particleBurstManager.emit(this.threeScene,r.position.x,r.position.y,r.position.z,16768256,50,!0)):(this.audioManager.playSFX("starCollect"),this.particleBurstManager.emit(this.threeScene,r.position.x,r.position.y,r.position.z,16768256,20,!1)),this.handleConstellationStarCollected(r);if(p.meteoriteCollision){if(p.meteoriteHit){const r=p.meteoriteHit;typeof r.handleCollision=="function"?r.handleCollision():(r.isActive=!1,r.mesh.visible=!1,st("meteoriteHit")),this.particleBurstManager.emit(this.threeScene,r.position.x,r.position.y,r.position.z,16755268,24,!1)}this.spaceship.onMeteoriteHit(),this.hud.announceMeteoriteHit(),this.recordMeteoriteHit(),this.boostSystem.cancel(),this.damageTimer=y.DAMAGE_FLASH_DURATION,this.startCameraShake("meteoriteHit"),this.audioManager.playSFX("meteoriteHit"),this.audioManager.stopBoostSFX(),this.boostFlameEffect.remove()}this.updateDamageEffect(t),this.cleanupPassedObjects(t),this.updateAdaptiveTutorial(e.moveDirection,t),this.updateCameraFollow(t),this.stageAtmosphereEffect.update(t,this.camera,this.spaceship.position.x,this.spaceship.position.z),this.rainbowTrailEffect.update(t,this.spaceship.position);for(const r of p.starCollisions)this.scorePopupManager.show(r.scoreValue,r.position,this.camera);if(this.stageNumber===10&&this.destinationPlanet){const r=1+Math.sin(this.elapsedTime*2)*.05;this.destinationPlanet.scale.set(r,r,r)}this.destinationPlanetSpinTarget&&(this.destinationPlanetSpinTarget.rotation.y+=t*y.DESTINATION_PLANET_SPIN_SPEED),this.elapsedTime+=t,this.bgStars&&at(this.bgStars,this.spaceship.position.z,ft),this.meteoShowerEffect.update(o.active,t,this.spaceship.position.x,this.spaceship.position.z),this.stageSpecialEffects.update(n.active,t,this.spaceship.position.x,this.spaceship.position.z),this.spaceWeatherEffect.update(h.active,t,this.spaceship.position.x,this.spaceship.position.z),this.boostLinesEffect.update(this.boostSystem.isActive(),this.spaceship.position.x,this.spaceship.position.z),this.boostSystem.isActive()&&this.boostFlameEffect.emit(this.spaceship.position,this.boostSystem.getDurationProgress()),this.boostFlameEffect.update(t),this.airShield.setPosition(this.spaceship.position.x,this.spaceship.position.y,this.spaceship.position.z),this.boostSystem.isActive()?this.airShield.setShieldMode("BOOST"):this.spaceship.speedState==="SLOWDOWN"?this.airShield.setShieldMode("INVINCIBLE",1):this.spaceship.speedState==="RECOVERING"?this.airShield.setShieldMode("INVINCIBLE",this.spaceship.getSpeedStateRemainingRatio()):this.airShield.setShieldMode("OFF"),this.airShield.update(t),this.scorePopupEffect.update(t),this.particleBurstManager.update(this.threeScene,t),this.scoreSystem.update(t),this.constellationLineEffect.update(t),this.constellationHintOverlay.tick(t),this.hud.update(this.scoreSystem.getStageScore(),this.scoreSystem.getStarCount()),this.hud.updateCooldown(this.boostSystem.getCooldownProgress()),this.hud.updateStageProgress(a),a>=1&&this.onStageClear()}updateTouchGuide(t,e){if(this.assistTimer>0){this.setTouchGuideMode(this.getAssistTouchGuideMode());return}if(t!==0){this.touchGuideIdleTimer=0,this.hasSeenMoveInput=!0,this.setTouchGuideMode(t<0?"active-left":"active-right");return}if(!this.hasSeenMoveInput){this.setTouchGuideMode("intro");return}if(this.touchGuideIdleTimer+=e,this.touchGuideIdleTimer>=y.TOUCH_GUIDE_IDLE_DELAY){this.setTouchGuideMode("idle");return}this.setTouchGuideMode("hidden")}setTouchGuideMode(t){this.touchGuideMode!==t&&(this.touchGuideMode=t,this.touchGuide.setMode(t))}resetAssistNavigation(){this.meteoriteHitTimes.length=0,this.assistTimer=0,this.assistMessageTimer=0,this.assistDirection=null,this.assistDirectionRefreshTimer=0}updateAssistTimers(t){this.assistTimer>0&&(this.assistDirectionRefreshTimer=Math.max(0,this.assistDirectionRefreshTimer-t),this.assistDirectionRefreshTimer===0&&this.refreshAssistDirection(),this.assistTimer=Math.max(0,this.assistTimer-t),this.assistTimer===0&&(this.spawnSystem.setMeteoriteIntervalMultiplier(1),this.assistDirection=null,this.assistDirectionRefreshTimer=0)),this.assistMessageTimer>0&&(this.assistMessageTimer=Math.max(0,this.assistMessageTimer-t),this.assistMessageTimer===0&&this.syncAssistMessage())}updateMeteoShowerAnnouncement(t){this.meteoShowerAnnouncementTimer<=0||(this.meteoShowerAnnouncementTimer=Math.max(0,this.meteoShowerAnnouncementTimer-t),this.meteoShowerAnnouncementTimer===0&&this.syncAssistMessage())}updateSpaceWeatherAnnouncement(t){this.spaceWeatherAnnouncementTimer<=0||(this.spaceWeatherAnnouncementTimer=Math.max(0,this.spaceWeatherAnnouncementTimer-t),this.spaceWeatherAnnouncementTimer===0&&(this.spaceWeatherAnnouncementMessage="",this.syncAssistMessage()))}showMeteoShowerAnnouncement(){this.meteoShowerAnnouncementTimer=y.METEO_SHOWER_MESSAGE_DURATION,this.syncAssistMessage()}showSpaceWeatherAnnouncement(t){this.spaceWeatherAnnouncementMessage=t,this.spaceWeatherAnnouncementTimer=y.STAGE_SPECIAL_MESSAGE_DURATION,this.syncAssistMessage()}updateStageSpecialAnnouncement(t){this.stageSpecialAnnouncementTimer<=0||(this.stageSpecialAnnouncementTimer=Math.max(0,this.stageSpecialAnnouncementTimer-t),this.stageSpecialAnnouncementTimer===0&&(this.stageSpecialAnnouncementMessage="",this.syncAssistMessage()))}showStageSpecialAnnouncement(t){this.stageSpecialAnnouncementMessage=t,this.stageSpecialAnnouncementTimer=y.STAGE_SPECIAL_MESSAGE_DURATION,this.syncAssistMessage()}syncAssistMessage(){if(this.meteoShowerAnnouncementTimer>0){this.hud.showAssistMessage(y.METEO_SHOWER_MESSAGE);return}if(this.stageSpecialAnnouncementTimer>0&&this.stageSpecialAnnouncementMessage){this.hud.showAssistMessage(this.stageSpecialAnnouncementMessage);return}if(this.spaceWeatherAnnouncementTimer>0&&this.spaceWeatherAnnouncementMessage){this.hud.showAssistMessage(this.spaceWeatherAnnouncementMessage);return}if(this.assistMessageTimer>0){this.hud.showAssistMessage(y.ASSIST_MESSAGE);return}this.hud.hideAssistMessage()}resetBoostHintState(){this.boostHintDisplayTimer=0,this.hud?.hideBoostHint()}updateBoostHintDisplay(t){this.boostHintDisplayTimer>0&&(this.boostHintDisplayTimer=Math.max(0,this.boostHintDisplayTimer-t),this.boostHintDisplayTimer===0&&this.hud.hideBoostHint())}updateAdaptiveHintDisplay(t){this.adaptiveHintDisplayTimer<=0||(this.adaptiveHintDisplayTimer=Math.max(0,this.adaptiveHintDisplayTimer-t),this.adaptiveHintDisplayTimer===0&&this.adaptiveTutorialHint.hide())}hideAdaptiveTutorialHint(){this.adaptiveHintDisplayTimer=0,this.adaptiveTutorialHint.hide()}updateAdaptiveTutorial(t,e){const s=this.adaptiveTutorialSystem.update({deltaTime:e,moveDirection:t,shipX:this.spaceship.position.x,shipZ:this.spaceship.position.z,boostAvailable:this.boostSystem.isAvailable(),boostActive:this.boostSystem.isActive(),meteorites:this.meteorites});s&&this.showAdaptiveTutorialEvent(s)}showAdaptiveTutorialEvent(t){if(t.type==="boost"){this.hideAdaptiveTutorialHint(),this.hud.showBoostHint(t.message),this.boostHintDisplayTimer=y.BOOST_HINT_DURATION;return}this.resetBoostHintState(),this.adaptiveTutorialHint.show(t.message,t.type),this.adaptiveHintDisplayTimer=y.ADAPTIVE_HINT_DURATION}recordMeteoriteHit(){const t=this.playTime;for(this.meteoriteHitTimes.push(t);this.meteoriteHitTimes.length>0&&t-this.meteoriteHitTimes[0]>y.ASSIST_TRIGGER_HIT_WINDOW;)this.meteoriteHitTimes.shift();this.assistTimer>0||this.meteoriteHitTimes.length<y.ASSIST_TRIGGER_HIT_COUNT||this.activateAssistMode()}activateAssistMode(){this.assistTimer=y.ASSIST_DURATION,this.assistMessageTimer=y.ASSIST_MESSAGE_DURATION,this.assistDirectionRefreshTimer=0,this.refreshAssistDirection(),this.spawnSystem.setMeteoriteIntervalMultiplier(y.ASSIST_METEORITE_INTERVAL_MULTIPLIER),this.hud.showAssistMessage(y.ASSIST_MESSAGE),this.meteoriteHitTimes.length=0}refreshAssistDirection(){this.assistDirection=this.getSaferAssistDirection(),this.assistDirectionRefreshTimer=y.ASSIST_DIRECTION_REFRESH_INTERVAL}getAssistTouchGuideMode(){return this.assistDirection==="left"?"assist-left":this.assistDirection==="right"?"assist-right":"hidden"}getSaferAssistDirection(){const t=this.spaceship.position.x,e=this.spaceship.position.z,s=Math.min(t-2.5,-y.ASSIST_DIRECTION_SIDE_TARGET_X),i=Math.max(t+2.5,y.ASSIST_DIRECTION_SIDE_TARGET_X);let a=0,n=0;for(const d of this.meteorites){if(!d.isActive)continue;const u=e-d.position.z;if(u<0||u>y.ASSIST_DIRECTION_LOOKAHEAD)continue;const g=1+(y.ASSIST_DIRECTION_LOOKAHEAD-u)/7,p=Math.abs(d.position.x-s),r=Math.abs(d.position.x-i),f=Math.max(0,1-p/y.ASSIST_DIRECTION_SIDE_RANGE),c=Math.max(0,1-r/y.ASSIST_DIRECTION_SIDE_RANGE);a+=g*f,n+=g*c}const o=Math.abs(a-n),h=Math.max(a,n);return o<y.ASSIST_DIRECTION_DIFF_THRESHOLD||h>0&&o<h*y.ASSIST_DIRECTION_DIFF_RATIO?null:a<n?"left":"right"}updateDamageEffect(t){if(this.damageTimer>0){if(this.damageTimer-=t,this.damageTimer<=0){this.damageTimer=0,this.spaceship.mesh.rotation.z=0,this.spaceship.mesh.rotation.y=0,this.spaceship.mesh.visible=!0;return}const e=Math.sin(this.damageTimer*30)*.3;this.spaceship.mesh.rotation.z=e,this.spaceship.mesh.rotation.y=0;const s=Math.sin(this.damageTimer*20)>0;this.spaceship.mesh.visible=s}else this.spaceship.mesh.visible=!0}resetCameraShake(){this.cameraShakeTimer=0,this.cameraShakeElapsed=0,this.cameraShakeProfile=gt.meteoriteHit,this.cameraShakeOffset.set(0,0,0)}startCameraShake(t="meteoriteHit"){this.cameraShakeProfile=gt[t],this.cameraShakeTimer=this.cameraShakeProfile.duration,this.cameraShakeElapsed=0}handleVibrationFallback(t){t!=="meteoriteHit"&&this.startCameraShake(t)}updateCameraShake(t){if(this.cameraShakeTimer<=0){this.cameraShakeOffset.set(0,0,0);return}if(this.cameraShakeElapsed+=t,this.cameraShakeTimer=Math.max(0,this.cameraShakeTimer-t),this.cameraShakeTimer===0){this.cameraShakeOffset.set(0,0,0);return}const e=this.cameraShakeTimer/this.cameraShakeProfile.duration,s=this.cameraShakeElapsed*this.cameraShakeProfile.frequency,i=mt(this.motionSensitivity);this.cameraShakeOffset.set(Math.sin(s)*this.cameraShakeProfile.amplitudeX*e*i.cameraShakeScale,Math.cos(s*.8)*this.cameraShakeProfile.amplitudeY*e*i.cameraShakeScale,0)}updateCameraFollow(t){this.updateCameraShake(t);const e=mt(this.motionSensitivity),s=this.spaceship.position.x*.3+this.cameraShakeOffset.x,i=5+this.cameraShakeOffset.y,a=this.spaceship.position.z+12,n=e.cameraFollowResponsiveness;if(n>=1)this.camera.position.set(s,i,a);else{const o=1-Math.pow(1-n,Math.max(1,t*60));this.cameraPositionTarget.set(s,i,a),this.camera.position.lerp(this.cameraPositionTarget,o)}this.cameraLookAtTarget.set(this.spaceship.position.x*.5,0,this.spaceship.position.z-20),this.camera.lookAt(this.cameraLookAtTarget)}cleanupPassedObjects(t){const e=this.spaceship.position.z,s=e+30,i=this.stars;let a=0,n=0;for(let c=0;c<i.length;c++){const m=i[c];m.isCollected||m.position.z>s?(!m.isCollected&&m.position.z>s&&(n+=1),this.spawnSystem.releaseStar(m)):(m.update(t,e),a!==c&&(i[a]=m),a++)}i.length=a,n>0&&this.adaptiveTutorialSystem.recordMissedStars(n);const o=this.meteorites;let h=0;for(let c=0;c<o.length;c++){const m=o[c];!m.isActive||m.position.z>s?this.spawnSystem.releaseMeteorite(m):(m.isActive&&m.update(t,e),h!==c&&(o[h]=m),h++)}o.length=h;const d=this.shootingStars;let u=0;for(let c=0;c<d.length;c++){const m=d[c];m.isCollected||m.position.z>s?this.spawnSystem.releaseShootingStar(m):(m.update(t,e),u!==c&&(d[u]=m),u++)}d.length=u;const g=this.comets;let p=0;for(let c=0;c<g.length;c++){const m=g[c];m.isCollected||m.position.z>s?this.spawnSystem.releaseComet(m):(m.update(t,e),p!==c&&(g[p]=m),p++)}g.length=p;const r=this.specialShootingStars;let f=0;for(let c=0;c<r.length;c++){const m=r[c];m.isCollected||m.position.z>s?this.specialStarSpawnSystem.releaseSpecialStar(m):(m.update(t,e),f!==c&&(r[f]=m),f++)}r.length=f}spawnConstellationStars(){const t=this.constellationSystem.getDefinition();if(t)for(let e=0;e<t.points.length;e++){const s=t.points[e],i=this.spawnSystem.acquireStar(s.x,s.y,s.z,"RAINBOW");i.setConstellationMarker(t.id,t.stageNumber,e),this.stars.push(i),this.threeScene.add(i.mesh)}}handleConstellationStarCollected(t){const e=this.constellationSystem.registerCollectedStar(t);if(!e.advanced||(e.lineSegment&&this.constellationLineEffect.addSegment(e.lineSegment.from,e.lineSegment.to),!e.completed))return;const s=this.constellationSystem.getDefinition();s&&(this.saveManager.markConstellationDiscovered?.(this.stageNumber),this.constellationHintOverlay.showCelebration(s.celebrationMessage),this.audioManager.playSFX("rainbowCollect"),this.particleBurstManager.emit(this.threeScene,t.position.x,t.position.y,t.position.z,9103615,42,!0))}onStageClear(){if(this.isCleared)return;this.isCleared=!0,this.clearTimer=0,this.stageClearOverlay.hide(),this.resetAssistNavigation(),this.meteoShowerAnnouncementTimer=0,this.spaceWeatherAnnouncementTimer=0,this.spaceWeatherAnnouncementMessage="",this.stageSpecialAnnouncementTimer=0,this.stageSpecialAnnouncementMessage="",this.meteoShowerEventSystem.reset(),this.meteoShowerEffect.clear(),this.spaceWeatherEventSystem.reset(),this.spaceWeatherEffect.clear(),this.scoreSystem.setEventStarMultiplier?.(1),this.stageSpecialEventSystem.reset(),this.stageSpecialEffects.clear(),this.rainbowTrailEffect.clear(),this.resetBoostHintState(),this.touchGuide.hide(),this.syncPauseAvailability();const t=this.saveManager.markStageCleared(this.stageNumber);if(this.audioManager.playSFX("stageClear"),st("stageClear"),this.audioManager.stopBoostSFX(),this.boostFlameEffect.remove(),this.destinationPlanet){const n=this.getDestinationPlanetEffectRadius(this.destinationPlanet);this.planetRingEffect.start(this.threeScene,this.destinationPlanet,n,this.stageConfig.planetColor,this.particleBurstManager)}const e=this.scoreSystem.getStarCount(),s=this.saveManager.load().bestStageStars?.[this.stageNumber]??0;this.saveManager.updateBestStageStars(this.stageNumber,e),this.recordAttemptStats(!0);const i=Math.max(s,e),a=e>s;t&&(this.companionManager?.addCompanion(this.stageNumber),this.prefetchClearRewardOverlay()),this.showClearMessage(a,e,t,i),this.hud.announceStageClear(e,t,a),a&&this.audioManager.playSFX("rainbowCollect")}getClearRewardOverlay(){return this.clearRewardOverlay?Promise.resolve(this.clearRewardOverlay):this.clearRewardOverlayPromise?this.clearRewardOverlayPromise:(this.clearRewardOverlayPromise=this.loadEncyclopediaOverlay().then(({EncyclopediaOverlay:t})=>{const e=new t;return this.clearRewardOverlay=e,e}).finally(()=>{this.clearRewardOverlayPromise=null}),this.clearRewardOverlayPromise)}isCurrentClearRewardRequest(t){return this.isActive&&this.clearRewardRequestToken===t}restoreClearRewardButton(){this.stageClearOverlay.setRewardOpen(!1)}prefetchClearRewardOverlay(){this.clearRewardOverlay||this.clearRewardOverlayPromise||this.getClearRewardOverlay().catch(()=>{})}async openClearRewardOverlay(t){if(this.isClearRewardOpen||this.isOpeningClearReward)return;const e=this.clearRewardRequestToken;this.isOpeningClearReward=!0,this.stageClearOverlay.setRewardOpen(!0);try{const s=this.clearRewardOverlay??await this.getClearRewardOverlay();if(!this.isCurrentClearRewardRequest(e))return;if(!s.showStageDetail(this.stageNumber,()=>{this.isCurrentClearRewardRequest(e)&&(this.isClearRewardOpen=!1,this.syncPauseAvailability(),this.restoreClearRewardButton())},{bestStageStars:{[this.stageNumber]:t},backLabel:"クリアへ もどる",discoveredConstellations:this.saveManager.load().discoveredConstellations??[],zIndex:50})){this.restoreClearRewardButton();return}this.isClearRewardOpen=!0,this.syncPauseAvailability()}catch{if(!this.isCurrentClearRewardRequest(e))return;this.restoreClearRewardButton()}finally{this.clearRewardRequestToken===e&&(this.isOpeningClearReward=!1,this.syncPauseAvailability(),this.isClearRewardOpen||this.restoreClearRewardButton())}}showClearMessage(t=!1,e,s=!1,i){const a=e??this.scoreSystem.getStarCount(),n=i??a,o=this.launchSource==="encyclopedia"?void 0:Ce(this.stageNumber),h=s?it(this.stageNumber):void 0;this.stageClearOverlay.show({stageNumber:this.stageNumber,starCount:a,bestStarCount:n,isBestUpdated:t,continueLabel:this.launchSource==="encyclopedia"?"タイトルへ":this.stageNumber>=R?"おいわいへ":"つぎへ",nextEntry:o,rewardEntry:h,onContinue:()=>{this.handleStageComplete()},onRetry:()=>{this.handleStageRetry()},onReward:h?()=>{this.openClearRewardOverlay(a)}:void 0})}revealClearActionButtonsIfReady(){this.clearTimer<y.CLEAR_CONTINUE_DELAY||this.stageClearOverlay.enableContinue()}getDestinationPlanetEffectRadius(t){const e=new Oe().setFromObject(t);if(e.isEmpty())return 15;const s=e.getSize(new $);return Math.max(s.x,s.y,s.z)*.5}handleStageComplete(){const{totalScore:t,totalStarCount:e}=this.scoreSystem.finalizeStage();if(this.shouldPlayWormholeTransition()){this.startWormholeTransition({stageNumber:this.stageNumber+1,totalScore:t,totalStarCount:e});return}if(this.launchSource==="encyclopedia"){this.sceneManager.requestTransition("title");return}this.stageNumber>=R?this.sceneManager.requestTransition("ending",{totalScore:t,totalStarCount:e}):this.sceneManager.requestTransition("stage",{stageNumber:this.stageNumber+1,totalScore:t,totalStarCount:e})}shouldPlayWormholeTransition(){return this.launchSource==="campaign"&&this.stageNumber<R}startWormholeTransition(t){if(this.pendingWormholeTransition)return;const e=t.stageNumber??this.stageNumber+1,s=N(e);this.pendingWormholeTransition=t,this.wormholeTransitionTimer=0,this.stageClearOverlay.hide(),this.clearRewardOverlay?.hide(),this.isClearRewardOpen=!1,this.isOpeningClearReward=!1,this.wormholeTunnelEffect.start({sourceColor:this.stageConfig.planetColor,targetColor:s.planetColor,duration:y.WORMHOLE_TRANSITION_DURATION,particleCount:72,rayCount:20}),this.audioManager.playSFX("wormhole")}updateWormholeTransition(t){if(!this.pendingWormholeTransition||(this.wormholeTransitionTimer+=t,this.wormholeTunnelEffect.update(t,this.camera),this.wormholeTransitionTimer<y.WORMHOLE_TRANSITION_DURATION))return!1;const e=this.pendingWormholeTransition;return this.pendingWormholeTransition=null,this.wormholeTransitionTimer=0,this.wormholeTunnelEffect.clear(),this.sceneManager.requestTransition("stage",e),!0}handleStageRetry(){const t={stageNumber:this.stageNumber,totalScore:this.stageEntryTotalScore,totalStarCount:this.stageEntryTotalStarCount,replayToken:Date.now()+Math.random()};this.launchSource!=="campaign"&&(t.launchSource=this.launchSource),this.sceneManager.requestTransition("stage",t)}recordAttemptStats(t){this.attemptStatsRecorded||(this.attemptStatsRecorded=!0,this.saveManager.recordGameplaySession?.({stageNumber:this.stageNumber,playTimeSeconds:this.playTime,collectedStars:this.scoreSystem.getStarCount(),boostUses:this.boostSystem.getActivationCount(),stageCleared:t}))}exit(){this.initialized&&(this.recordAttemptStats(this.isCleared),this.isActive=!1,this.prewarmRequestToken+=1,this.clearRewardRequestToken+=1,this.clearRewardOverlay?.hide(),this.stageClearOverlay.hide(),this.isClearRewardOpen=!1,this.isOpeningClearReward=!1,this.pauseOverlay.hide(),this.touchGuide.hide(),this.adaptiveTutorialHint.hide(),this.constellationHintOverlay.hide(),this.seasonalEventNotice.dispose(),this.frameRateHintOverlay.hide(),this.hud.hide(),this.scorePopupManager.dispose(),Pt(null),this.audioManager.stopBGM(),this.audioManager.stopBoostSFX(),this.wormholeTunnelEffect.clear(),this.pendingWormholeTransition=null,this.wormholeTransitionTimer=0,this.stageIntroOverlay&&(this.stageIntroOverlay.dispose(),this.stageIntroOverlay=null),this.countdownOverlay&&(this.countdownOverlay.dispose(),this.countdownOverlay=null),this.resumeCountdownOverlay&&(this.resumeCountdownOverlay.dispose(),this.resumeCountdownOverlay=null),this.isStarting=!1,this.awaitingResume=!1,this.isHomeConfirmOpen=!1,this.shouldResumeAfterHomeConfirm=!1,this.isPauseOpen=!1,this.shouldResumeAfterPause=!1,this.boostFlameEffect.remove(),this.boostLinesEffect.update(!1,this.spaceship.position.x,this.spaceship.position.z),this.airShield.reset(this.spaceship.position.x,this.spaceship.position.y,this.spaceship.position.z),this.planetRingEffect.clear(),this.meteoShowerEffect.clear(),this.spaceWeatherEffect.clear(),this.stageSpecialEffects.clear(),this.seasonalEventEffects.clear(),this.spaceWeatherEventSystem.reset(),this.seasonalEventSystem.clear(),this.scoreSystem.setEventStarMultiplier?.(1),this.frameRateHintOverlay.dispose(),this.resetStageObjects(),this.bgStars&&(this.bgStars.parent?.remove(this.bgStars),this.bgStars=null))}getThreeScene(){return this.threeScene}getCamera(){const{width:t,height:e}=D(),s=t/e;return s!==this.lastAspect&&Number.isFinite(s)&&s>0&&(this.camera.aspect=s,this.camera.updateProjectionMatrix(),this.lastAspect=s),this.camera}applyVisualQualityTier(){const t=this.getEffectiveVisualQualityTier();if(this.particleBurstManager.setQualityTier(t),this.lodSystem.setQualityTier(t),!this.initialized){this.bgStars&&this.bgStars.geometry.setDrawRange(0,this.getBackgroundStarDrawCount());return}this.boostLinesEffect.setQualityTier(t),this.boostFlameEffect.setQualityTier(t),this.stageAtmosphereEffect.setQualityTier(t),this.wormholeTunnelEffect.setQualityTier(t),this.bgStars&&this.bgStars.geometry.setDrawRange(0,this.getBackgroundStarDrawCount())}getBackgroundStarDrawCount(){const t=mt(this.motionSensitivity);return Math.max(1,Math.round(y.BG_STAR_COUNT*y.getVisualQualityScale(this.getEffectiveVisualQualityTier())*t.particleDensityScale))}applyMotionSensitivity(){this.initialized&&(this.boostLinesEffect.setMotionSensitivity(this.motionSensitivity),this.boostFlameEffect.setMotionSensitivity(this.motionSensitivity),this.stageAtmosphereEffect.setMotionSensitivity(this.motionSensitivity),this.wormholeTunnelEffect.setMotionSensitivity(this.motionSensitivity))}static clampVisualQualityTier(t){const e=y.VISUAL_QUALITY_SCALE_BY_TIER.length-1;return Math.max(0,Math.min(e,Math.round(t)))}static clampPerformanceAdaptationLevel(t){const e=y.VISUAL_QUALITY_SCALE_BY_TIER.length-1;return Math.max(0,Math.min(e,Math.round(t)))}static getVisualQualityScale(t){return y.VISUAL_QUALITY_SCALE_BY_TIER[y.clampVisualQualityTier(t)]}getEffectiveVisualQualityTier(){return y.clampVisualQualityTier(this.visualQualityTier-this.performanceAdaptationLevel)}}const ws=Object.freeze(Object.defineProperty({__proto__:null,StageScene:y,__resetStageSceneSharedAssetCachesForTest:We,__stageSceneSharedAssetCachesForTest:Ue,prewarmStageVisualAssets:Mt},Symbol.toStringTag,{value:"Module"}));class fs{constructor(t,e,s,i,a={}){this.sceneManager=t,this.inputSystem=e,this.audioManager=s,this.saveManager=i,this.randomProvider=a.randomProvider??Math.random,this.effectSystem=a.effectSystem??new Me({randomProvider:this.randomProvider}),this.stageDurationSeconds=a.stageDurationSeconds??8;const{width:n,height:o}=D();this.camera=new dt(60,n/o,.1,1400),this.camera.position.set(0,2.8,12),this.threeScene.background=new X(32),this.directionalLight.position.set(4,6,5),this.stageAtmosphereEffect.init(this.threeScene),this.effectSystem.init(this.threeScene)}threeScene=new V;ambientLight=new ct(16777215,1.1);directionalLight=new _t(16777215,.7);camera;stageAtmosphereEffect=new Gt;randomProvider;effectSystem;stageDurationSeconds;overlayButtonCleanups=new Set;currentLookAt=new $;ship=null;companionManager=null;backgroundStars=null;currentPlanet=null;currentPlanetSpinTarget=null;overlay=null;stageLabel=null;companionBadge=null;currentStageNumber=1;currentStageConfig=N(1);stageTimeRemaining=0;lastAspect=0;isActive=!1;enter(t){this.isActive=!0,this.lastAspect=0,this.inputSystem.resetPointers?.(),this.setupSceneObjects(),this.createOverlay(),this.audioManager.playBGM(0)}update(t){if(!this.isActive||!this.ship)return;const e=Math.max(0,t),s=this.inputSystem.getState();s.moveDirection<0?this.ship.moveLeft(e):s.moveDirection>0&&this.ship.moveRight(e),this.ship.update(e);const i=this.ship.mesh.position;this.companionManager?.update(e,i.x,i.y+1.15,i.z+.8),this.effectSystem.update(e,i),this.stageAtmosphereEffect.update(e,this.camera,i.x,i.z),this.updateCamera(),this.updatePlanet(e),this.updateStageRotation(e),this.backgroundStars&&(this.backgroundStars.rotation.y+=e*.02,at(this.backgroundStars,i.z,1))}exit(){this.isActive=!1,this.inputSystem.resetPointers?.(),this.audioManager.stopBGM(),this.effectSystem.clear(),this.stageAtmosphereEffect.clear(),this.companionManager?.dispose(),this.companionManager=null,this.ship?.dispose(),this.ship=null,this.clearPlanet(),this.backgroundStars&&(this.backgroundStars.parent?.remove(this.backgroundStars),this.backgroundStars=null);const t=Array.from(this.overlayButtonCleanups);this.overlayButtonCleanups.clear();for(const e of t)e();this.overlay?.remove(),this.overlay=null,this.stageLabel=null,this.companionBadge=null}getThreeScene(){return this.threeScene}getCamera(){const{width:t,height:e}=D(),s=t/e;return s!==this.lastAspect&&Number.isFinite(s)&&s>0&&(this.camera.aspect=s,this.camera.updateProjectionMatrix(),this.lastAspect=s),this.camera}setupSceneObjects(){this.threeScene.background=new X(32),this.ambientLight.parent||this.threeScene.add(this.ambientLight),this.directionalLight.parent||this.threeScene.add(this.directionalLight),this.backgroundStars=Ut(2e3),this.backgroundStars.name="free-play-background-stars",this.threeScene.add(this.backgroundStars);const t=this.saveManager.load();this.ship=new Nt(t.spaceshipCustomization),this.ship.mesh.name="free-play-spaceship",this.ship.mesh.position.set(0,-.3,0),this.ship.boundaryMin=-9,this.ship.boundaryMax=9,this.threeScene.add(this.ship.mesh),this.companionManager=new St([...new Set(t.unlockedPlanets)]);const e=this.companionManager.getGroup();e.name="free-play-companions",this.threeScene.add(e),this.updateCompanionBadge(),this.applyStage(this.pickRandomStage())}createOverlay(){const t=document.getElementById("ui-overlay");if(!t)return;this.overlay=document.createElement("div"),this.overlay.setAttribute("data-free-play-overlay",""),this.overlay.style.cssText=`
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
    `,s.append(i,this.stageLabel,this.companionBadge);const a=document.createElement("button");a.textContent="もどる",a.setAttribute("data-free-play-back-button",""),a.style.cssText=`
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
    `,this.overlayButtonCleanups.add(A(a,{onActivate:()=>{this.inputSystem.resetPointers?.(),this.sceneManager.requestTransition("title")},onPressChange:o=>{a.style.transform=o?"scale(0.96)":"scale(1)"}})),e.append(s,a);const n=document.createElement("div");n.style.cssText=`
      align-self: center;
      padding: 0.7rem 1.1rem;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.28);
      color: #fff;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 0.95rem;
      font-weight: 700;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    `,n.textContent="← → で ゆったり うちゅうさんぽ",this.overlay.append(e,n),t.appendChild(this.overlay),this.updateStageLabel(),this.updateCompanionBadge()}updateCamera(){if(!this.ship)return;const t=this.ship.mesh.position;this.camera.position.x+=(t.x*.32-this.camera.position.x)*.12,this.camera.position.y=2.8,this.camera.position.z=t.z+12,this.currentLookAt.set(t.x*.18,t.y+.4,t.z-18),this.camera.lookAt(this.currentLookAt)}updatePlanet(t){!this.currentPlanet||!this.ship||(this.currentPlanet.position.set(0,.5,this.ship.mesh.position.z-52),this.currentPlanet.rotation.y+=t*.08,this.currentPlanetSpinTarget?.rotateY(t*.22))}updateStageRotation(t){this.stageTimeRemaining-=t,!(this.stageTimeRemaining>0)&&this.applyStage(this.pickRandomStage(this.currentStageNumber))}applyStage(t){this.currentStageNumber=t,this.currentStageConfig=N(t),this.stageTimeRemaining=this.sampleStageDuration(),this.clearPlanet();const{planet:e,spinTarget:s}=Wt(t,this.currentStageConfig,-52);e.name="free-play-stage-planet",this.currentPlanet=e,this.currentPlanetSpinTarget=s,this.threeScene.add(e),this.stageAtmosphereEffect.start(Ft(t)),this.effectSystem.setCurrentStage(t),this.updateStageLabel()}clearPlanet(){this.currentPlanet&&(this.currentPlanet.parent?.remove(this.currentPlanet),this.currentPlanet=null,this.currentPlanetSpinTarget=null)}updateStageLabel(){this.stageLabel&&(this.stageLabel.textContent=`${this.currentStageConfig.emoji} ${this.currentStageConfig.destinationReading}の そらで あそんでるよ`)}updateCompanionBadge(){if(!this.companionBadge)return;const t=this.companionManager?.getCount()??0;this.companionBadge.textContent=t>0?`👾 なかま ${t}にん と いっしょ！`:"👾 なかまを あつめると ここに くるよ！"}sampleStageDuration(){return this.stageDurationSeconds*(.8+this.randomProvider()*.4)}pickRandomStage(t){const e=Array.from({length:R},(a,n)=>n+1),s=t===void 0?e:e.filter(a=>a!==t),i=Math.min(s.length-1,Math.floor(this.randomProvider()*s.length));return s[i]}}const Cs=Object.freeze(Object.defineProperty({__proto__:null,FreePlayScene:fs},Symbol.toStringTag,{value:"Module"}));let q=null,Y=null;function gs(){if(!q){const l=new xt,t=new Float32Array(3e3);for(let e=0;e<3e3;e++)t[e]=(Math.random()-.5)*200;l.setAttribute("position",new wt(t,3)),q=l}return q}function ys(){return Y||(Y=new Ct({color:16777215,size:.3})),Y}function bs(){q=null,Y=null}const vs={getBgStarsGeometry:()=>q,getBgStarsMaterial:()=>Y};class O{static CIRCLE_RADIUS=3;static POPIN_DELAY=.2;static POPIN_DURATION=.3;static BOUNCE_SPEED=3;static BOUNCE_HEIGHT=.5;static THANK_YOU_DELAY=2.5;threeScene;camera;lastAspect=0;sceneManager;saveManager;audioManager;overlay=null;muteHandle=null;bgStars=null;companionMeshes=[];companionGroup=null;circleX=[];circleZ=[];popinSettled=[];celebrationElapsed=0;thankYouShown=!1;canExit=!1;exitTriggered=!1;exitCta=null;constructor(t,e,s){this.sceneManager=t,this.saveManager=e,this.audioManager=s,this.threeScene=new V;const{width:i,height:a}=D();this.camera=new dt(60,i/a,.1,1e3),this.camera.position.set(0,0,5)}enter(t){this.lastAspect=0,this.canExit=!1,this.exitTriggered=!1,this.exitCta=null;const e=t.totalScore??0,s=t.totalStarCount??0;this.threeScene=new V,this.threeScene.background=new X(48),this.bgStars=new Et(gs(),ys()),this.bgStars.userData.sharedAssets=!0,this.bgStars.rotation.set(0,0,0),this.threeScene.add(this.bgStars),this.threeScene.add(new ct(16777215,1));const i=this.saveManager.load();i.clearedStage=0,this.saveManager.save(i),this.audioManager.playBGM(-1),this.setupCelebration(),this.createOverlay(e,s),this.createMuteButton()}createMuteButton(){const t=document.getElementById("hud")??document.getElementById("ui-overlay");t&&(this.muteHandle=Tt({initialMuted:this.audioManager.isMuted(),container:t,onToggle:()=>{const e=this.audioManager.toggleMute();this.muteHandle?.setMuted(e);const s=this.saveManager.load();s.muted=e,this.saveManager.save(s)}}))}createOverlay(t,e){const s=document.getElementById("ui-overlay");if(!s)return;this.overlay=document.createElement("div"),this.overlay.setAttribute("data-ending-overlay",""),this.overlay.style.cssText=`
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
    `;const n=document.createElement("div");n.textContent=`⭐ ${e} こ あつめたよ！`,n.style.cssText=`
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
    `,this.overlay.appendChild(i),this.overlay.appendChild(a),this.overlay.appendChild(n),this.overlay.appendChild(this.exitCta),s.appendChild(this.overlay)}update(t){this.bgStars&&(this.bgStars.rotation.y+=t*.03),this.updateCelebration(t)}setupCelebration(){this.companionGroup=new nt,this.companionMeshes=[],this.circleX.length=0,this.circleZ.length=0,this.popinSettled.length=0,this.celebrationElapsed=0,this.thankYouShown=!1,this.canExit=!1,this.exitTriggered=!1;for(let t=0;t<W.length;t++){const e=W[t],s=St.createCompanionMesh(e),i=t*(2*Math.PI/W.length),a=Math.cos(i)*O.CIRCLE_RADIUS,n=Math.sin(i)*O.CIRCLE_RADIUS;this.circleX.push(a),this.circleZ.push(n),s.position.set(a,0,n),s.scale.set(0,0,0),this.companionMeshes.push(s),this.popinSettled.push(!1),this.companionGroup.add(s)}this.threeScene.add(this.companionGroup)}updateCelebration(t){if(this.companionMeshes.length===0)return;this.celebrationElapsed+=t;const e=O.POPIN_DELAY*(this.companionMeshes.length-1)+O.POPIN_DURATION,s=this.celebrationElapsed>e,i=s?Math.abs(Math.sin(this.celebrationElapsed*O.BOUNCE_SPEED))*O.BOUNCE_HEIGHT:0;for(let a=0;a<this.companionMeshes.length;a++){const n=this.companionMeshes[a];if(this.popinSettled[a]){s&&(n.position.y=i),n.rotation.y+=t*2;continue}const o=a*O.POPIN_DELAY;if(!(this.celebrationElapsed<o)){if(this.celebrationElapsed<o+O.POPIN_DURATION){const h=(this.celebrationElapsed-o)/O.POPIN_DURATION,d=this.bounceEase(h);n.scale.set(d,d,d)}else n.scale.set(1,1,1),this.popinSettled[a]=!0;s&&(n.position.y=i),n.rotation.y+=t*2}}!this.thankYouShown&&this.celebrationElapsed>=O.THANK_YOU_DELAY&&(this.showThankYouText(),this.thankYouShown=!0)}bounceEase(t){return t<.6?t/.6*1.2:1.2-(t-.6)/.4*.2}showThankYouText(){if(!this.overlay||!this.exitCta)return;const t=document.createElement("div");t.setAttribute("data-ending-thank-you",""),t.textContent="みんな ありがとう！",t.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 2rem;
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
      margin-bottom: 1.5rem;
      opacity: 0;
      transition: opacity 0.5s ease-in;
    `,this.overlay.insertBefore(t,this.exitCta),this.exitCta.style.visibility="visible",this.canExit=!0,requestAnimationFrame(()=>{t.style.opacity="1",this.exitCta&&(this.exitCta.style.opacity="1")})}handleOverlayPointerDown(t){if(!this.canExit||this.exitTriggered)return;const e=t.target;e instanceof HTMLElement&&e.closest("[data-mute-button]")||(this.exitTriggered=!0,this.sceneManager.requestTransition("title"))}exit(){this.audioManager.stopBGM(),this.bgStars&&(this.threeScene.remove(this.bgStars),this.bgStars=null),this.companionGroup&&(this.threeScene.remove(this.companionGroup),this.companionMeshes=[],this.companionGroup=null),this.overlay&&(this.overlay.remove(),this.overlay=null),this.exitCta=null,this.canExit=!1,this.exitTriggered=!1,this.muteHandle&&(this.muteHandle.remove(),this.muteHandle=null)}getThreeScene(){return this.threeScene}getCamera(){const{width:t,height:e}=D(),s=t/e;return s!==this.lastAspect&&Number.isFinite(s)&&s>0&&(this.camera.aspect=s,this.camera.updateProjectionMatrix(),this.lastAspect=s),this.camera}}const As=Object.freeze(Object.defineProperty({__proto__:null,EndingScene:O,__endingSceneSharedAssetsForTest:vs,__resetEndingSceneSharedAssetsForTest:bs},Symbol.toStringTag,{value:"Module"}));export{As as E,Cs as F,ws as S,xs as T,A as a,bt as c};
