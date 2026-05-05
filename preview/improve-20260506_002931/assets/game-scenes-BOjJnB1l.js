const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/EncyclopediaOverlay-C94utvHg.js","assets/game-core-f8ZFdM4I.js","assets/three-KssZoWM0.js"])))=>i.map(i=>d[i]);
import{D as pt,i as A,g as wt,a as It,S as J,T as z,b as Q,c as ie,L as ye,d as be,_ as Bt,e as H,s as Rt,f as j,h as X,j as se,k as gt,l as ae,m as ve,P as st,u as ne,C as Se,n as Ee,o as xe,B as Ce,p as we,M as Te,q as Ae,r as Me,t as Pe,v as ke,w as Be,x as Re,y as Oe,z as Ie,A as De,E as Le,F as Ge,G as Fe,H as ze,I as He,J as Ne,K as oe,W as _e,N as $e,O as Ve,Q as Ue,R as je,U as We,V as re,X as Ye,Y as Dt,Z as Ze,$ as Xe,a0 as qe,a1 as Ke,a2 as Qe,a3 as Je,a4 as ti,a5 as Vt,a6 as le,a7 as ei,a8 as ft,a9 as Y,aa as ii,ab as Tt,ac as si,ad as ai,ae as ni,af as At,ag as oi,ah as ri,ai as li,aj as ci,ak as hi}from"./game-core-f8ZFdM4I.js";import{s as Lt,q as Gt,o as Ft,r as zt,G as at,w as ui,c as di,x as mi,e as D,m as _,C as Ut,B as jt,D as Wt,R as Yt,y as N,z as Et,S as ct,n as ht,d as xt,V as W,H as ce,J as pi}from"./three-KssZoWM0.js";class Ht{overlayEl=null;static COMPACT_HEIGHT_THRESHOLD=720;show(t){if(this.overlayEl)return;const e=document.getElementById("ui-overlay");if(!e)return;const i=this.isCompactHeight();this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-tutorial-overlay",""),this.overlayEl.style.cssText=`
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: ${i?"flex-start":"center"};
      background: rgba(0, 0, 32, 0.92);
      pointer-events: auto;
      z-index: 30;
      padding: ${i?"0.75rem":"1.25rem"};
      box-sizing: border-box;
    `;const s=document.createElement("div");s.setAttribute("data-tutorial-content",""),s.style.cssText=`
      width: min(960px, 100%);
      max-height: calc(100% - ${i?"0.5rem":"1rem"});
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow-y: auto;
      padding: ${i?"0.75rem 0.35rem 1rem":"0.5rem"};
      box-sizing: border-box;
    `;const a=document.createElement("div");a.setAttribute("data-tutorial-title",""),a.textContent="あそびかた",a.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${i?"1.8rem":"2.2rem"};
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
      margin-bottom: ${i?"0.9rem":"1.5rem"};
      text-align: center;
    `,s.appendChild(a);const n=document.createElement("div");n.style.cssText=`
      display: flex;
      gap: ${i?"0.8rem":"1.5rem"};
      flex-wrap: wrap;
      justify-content: center;
      width: 100%;
      max-width: 90%;
    `,n.appendChild(this.createCard("👆","ひだり・みぎ を タッチ","うちゅうせんが うごくよ","swipe 2s ease-in-out infinite",i)),n.appendChild(this.createCard("🚀","ブースト ボタン","はやく すすめるよ！","boostPulse 1.5s ease-in-out infinite",i)),n.appendChild(this.createCard("⭐","ほしを あつめて","ゴールを めざそう！","starGlow 3s linear infinite",i)),s.appendChild(n);const o=document.createElement("button");o.textContent="とじる",o.style.cssText=`
      margin-top: ${i?"0.9rem":"1.5rem"};
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${i?"1.15rem":"1.4rem"};
      font-weight: 700;
      padding: ${i?"0.7rem 2rem":"0.8rem 2.5rem"};
      border: none;
      border-radius: 2rem;
      background: linear-gradient(135deg, #FF6B6B, #FFE66D);
      color: #333;
      cursor: pointer;
      touch-action: manipulation;
      pointer-events: auto;
      box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
    `,o.addEventListener("pointerdown",c=>{c.stopPropagation(),t()}),s.appendChild(o),this.injectAnimations(),this.overlayEl.appendChild(s),e.appendChild(this.overlayEl)}hide(){this.overlayEl&&(this.overlayEl.remove(),this.overlayEl=null)}createCard(t,e,i,s,a){const n=document.createElement("div");n.setAttribute("data-tutorial-card",""),n.style.cssText=`
      background: rgba(255, 255, 255, 0.08);
      border-radius: 1.5rem;
      padding: ${a?"1rem 0.85rem":"1.5rem 1.2rem"};
      width: ${a?"150px":"180px"};
      text-align: center;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
    `;const o=document.createElement("div");o.textContent=t,o.style.cssText=`
      font-size: ${a?"2rem":"2.5rem"};
      margin-bottom: ${a?"0.55rem":"0.8rem"};
      animation: ${s};
    `;const c=document.createElement("div");c.textContent=e,c.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${a?"0.95rem":"1.1rem"};
      font-weight: 700;
      color: #fff;
      margin-bottom: 0.4rem;
    `;const u=document.createElement("div");return u.textContent=i,u.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${a?"0.8rem":"0.9rem"};
      color: rgba(255, 255, 255, 0.7);
    `,n.appendChild(o),n.appendChild(c),n.appendChild(u),n}isCompactHeight(){return window.innerHeight<=Ht.COMPACT_HEIGHT_THRESHOLD}injectAnimations(){if(document.getElementById("tutorial-animations"))return;const t=document.createElement("style");t.id="tutorial-animations",t.textContent=`
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
    `,document.head.appendChild(t)}}class gi{overlayEl=null;activePressCleanups=new Set;show(t,e){if(this.overlayEl)return;const i=document.getElementById("ui-overlay");if(!i)return;this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-title-reset-confirm-overlay",""),this.overlayEl.setAttribute("role","dialog"),this.overlayEl.setAttribute("aria-modal","true"),this.overlayEl.setAttribute("aria-label","さいしょからに もどしますか"),this.overlayEl.style.cssText=`
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
    `;let s=!1;const a=()=>{s||(s=!0,this.hide(),e())},n=()=>{s||(s=!0,this.hide(),t())};this.overlayEl.addEventListener("pointerdown",d=>{d.target===this.overlayEl&&a()});const o=document.createElement("div");o.setAttribute("data-title-reset-confirm-card",""),o.style.cssText=`
      width: min(88vw, 26rem);
      padding: 1.6rem 1.4rem;
      border-radius: 1.7rem;
      background: rgba(0, 0, 64, 0.9);
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.42);
      text-align: center;
      color: #fff;
    `,o.addEventListener("pointerdown",d=>{d.stopPropagation()}),this.overlayEl.appendChild(o);const c=document.createElement("div");c.textContent="さいしょからに する？",c.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 1.7rem;
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 0 16px rgba(255, 215, 0, 0.45);
      margin-bottom: 0.8rem;
    `,o.appendChild(c);const u=document.createElement("div");u.textContent="いまの すすみぐあいだけ きえて、ステージ 1 から あそべるよ",u.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 1rem;
      font-weight: 700;
      line-height: 1.5;
      color: rgba(255, 255, 255, 0.92);
      margin-bottom: 1.2rem;
    `,o.appendChild(u);const m=document.createElement("div");m.style.cssText=`
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
    `,b=(d,S)=>{let x=!1,T=!1;const y=()=>{k(!0)},p=()=>{d.style.transform="scale(0.92)"},M=()=>{d.style.transform="scale(1)"},k=(h=!1)=>{x=!1,T=h,M(),this.activePressCleanups.delete(y),document.removeEventListener("pointerup",C,!0),document.removeEventListener("pointercancel",w,!0)},C=h=>{const E=h.target===d||h.target instanceof Node&&d.contains(h.target),P=x&&E;k(!E),P&&S()},w=()=>{k(!0)};d.addEventListener("pointerdown",h=>{h.stopPropagation(),x=!0,T=!1,p(),this.activePressCleanups.add(y),document.addEventListener("pointerup",C,!0),document.addEventListener("pointercancel",w,!0)}),d.addEventListener("pointerenter",()=>{x&&p()}),d.addEventListener("pointerleave",()=>{x&&M()}),d.addEventListener("pointercancel",()=>k(!0)),d.addEventListener("click",h=>{if(h.stopPropagation(),T){T=!1;return}x||S()})},g=document.createElement("button");g.setAttribute("data-title-reset-cancel",""),g.textContent="やめる",g.style.cssText=f,g.style.background="rgba(255, 255, 255, 0.18)",g.style.color="#ffffff",b(g,a),m.appendChild(g);const r=document.createElement("button");r.setAttribute("data-title-reset-confirm",""),r.textContent="うん！ さいしょから",r.style.cssText=f,r.style.background="linear-gradient(135deg, #FF9F68, #FFE66D)",r.style.color="#3b1f00",b(r,n),m.appendChild(r),i.appendChild(this.overlayEl)}hide(){if(!this.overlayEl)return;const t=Array.from(this.activePressCleanups);this.activePressCleanups.clear();for(const e of t)e();this.overlayEl.remove(),this.overlayEl=null}}function Nt(l){const t=l.topRem??.8,e=window.innerHeight<=500,i=document.createElement("button");let s=l.initialMuted;const a=()=>{i.textContent=s?"🔇":"🔊",i.setAttribute("aria-label",s?"サウンド オフ":"サウンド オン")};i.setAttribute("data-mute-button",""),i.style.position="absolute",i.style.top=`${t}rem`,i.style.right="1rem",i.style.fontSize=e?"clamp(1.1rem, 3.5vmin, 1.4rem)":"clamp(1.4rem, 4vmin, 1.8rem)",i.style.background="rgba(255, 255, 255, 0.15)",i.style.border="none",i.style.borderRadius="50%",i.style.width=e?"2.4rem":"3rem",i.style.height=e?"2.4rem":"3rem",i.style.display="flex",i.style.alignItems="center",i.style.justifyContent="center",i.style.cursor="pointer",i.style.pointerEvents="auto",i.style.touchAction="manipulation",i.style.transform="scale(1)",i.style.transition="transform 0.08s ease-out",a();const n=()=>{i.style.transform="scale(1)"};return i.addEventListener("pointerdown",o=>{o.stopPropagation(),i.style.transform="scale(0.9)",l.onToggle()}),i.addEventListener("pointerup",n),i.addEventListener("pointercancel",n),i.addEventListener("pointerleave",n),l.container.appendChild(i),{element:i,setMuted(o){s=o,a()},remove(){i.remove()}}}const yt=[{value:0,labelKey:"colorSettings.audio.volume.quiet"},{value:25,labelKey:"colorSettings.audio.volume.small"},{value:50,labelKey:"colorSettings.audio.volume.normal"},{value:75,labelKey:"colorSettings.audio.volume.loud"},{value:100,labelKey:"colorSettings.audio.volume.max"}],mt=[{value:"color-only",labelKey:"colorSettings.colorVision.option.colorOnly",descriptionKey:"colorSettings.colorVision.description.colorOnly",icon:"🎨"},{value:"color-and-marks",labelKey:"colorSettings.colorVision.option.colorAndMarks",descriptionKey:"colorSettings.colorVision.description.colorAndMarks",icon:"★"},{value:"protanopia-filter",labelKey:"colorSettings.colorVision.option.protanopiaFilter",descriptionKey:"colorSettings.colorVision.description.protanopiaFilter",icon:"🔴"},{value:"deuteranopia-filter",labelKey:"colorSettings.colorVision.option.deuteranopiaFilter",descriptionKey:"colorSettings.colorVision.description.deuteranopiaFilter",icon:"🟢"},{value:"tritanopia-filter",labelKey:"colorSettings.colorVision.option.tritanopiaFilter",descriptionKey:"colorSettings.colorVision.description.tritanopiaFilter",icon:"🔵"}],Zt=[{value:"strong",labelKey:"colorSettings.visualFeedback.option.strong"},{value:"medium",labelKey:"colorSettings.visualFeedback.option.medium"},{value:"weak",labelKey:"colorSettings.visualFeedback.option.weak"},{value:"off",labelKey:"colorSettings.visualFeedback.option.off"}],Xt=[{value:"ja",labelKey:"colorSettings.language.option.ja",icon:"🇯🇵"},{value:"en",labelKey:"colorSettings.language.option.en",icon:"🇬🇧"}],qt={strong:{shortLabel:"colorSettings.motion.option.strong.shortLabel",description:"colorSettings.motion.option.strong.description"},medium:{shortLabel:"colorSettings.motion.option.medium.shortLabel",description:"colorSettings.motion.option.medium.description"},gentle:{shortLabel:"colorSettings.motion.option.gentle.shortLabel",description:"colorSettings.motion.option.gentle.description"},minimal:{shortLabel:"colorSettings.motion.option.minimal.shortLabel",description:"colorSettings.motion.option.minimal.description"}};function Kt(l){const t=yt.find(e=>e.value===l)??yt[2];return A.t(t.labelKey)}class fi{overlay=null;toggleButton=null;descriptionEl=null;highContrast=!1;colorVisionSupportMode="color-only";bgmVolume=100;sfxVolume=100;visualFeedbackIntensity="medium";motionSensitivity="strong";restReminderEnabled=!0;language=pt;bgmVolumeDescriptionEl=null;sfxVolumeDescriptionEl=null;bgmVolumeSlider=null;sfxVolumeSlider=null;colorVisionDescriptionEl=null;colorVisionButtons=new Map;visualFeedbackDescriptionEl=null;visualFeedbackButtons=new Map;motionDescriptionEl=null;motionButtons=new Map;restReminderDescriptionEl=null;restReminderToggleButton=null;motionPreviewEl=null;motionPreviewTokenEl=null;motionPreviewCaptionEl=null;languageDescriptionEl=null;languageButtons=new Map;motionPreviewTimeoutId=null;motionPreviewFrameId=null;onToggle=null;onColorVisionSupportModeChange=null;onBGMVolumeChange=null;onSFXVolumeChange=null;onVisualEffectIntensityChange=null;onMotionSensitivityChange=null;onRestReminderToggle=null;onLanguageChange=null;languageUnsubscribe=null;show(t){const e=document.getElementById("ui-overlay");if(e){if(this.highContrast=t.initialHighContrast,this.colorVisionSupportMode=t.initialColorVisionSupportMode,this.bgmVolume=t.initialBGMVolume,this.sfxVolume=t.initialSFXVolume,this.visualFeedbackIntensity=t.initialVisualEffectIntensity,this.motionSensitivity=t.initialMotionSensitivity,this.restReminderEnabled=t.initialRestReminderEnabled,this.language=t.initialLanguage,this.onToggle=t.onToggle,this.onColorVisionSupportModeChange=t.onColorVisionSupportModeChange,this.onBGMVolumeChange=t.onBGMVolumeChange,this.onSFXVolumeChange=t.onSFXVolumeChange,this.onVisualEffectIntensityChange=t.onVisualEffectIntensityChange,this.onMotionSensitivityChange=t.onMotionSensitivityChange,this.onRestReminderToggle=t.onRestReminderToggle,this.onLanguageChange=t.onLanguageChange,A.setLanguage(this.language,{notify:!1}),this.languageUnsubscribe?.(),this.languageUnsubscribe=A.subscribe(i=>{this.language=i,this.render()}),!this.overlay){const i=window.innerHeight<=760;this.overlay=document.createElement("div"),this.overlay.setAttribute("data-color-accessibility-settings",""),this.overlay.style.cssText=`
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
        width: min(92vw, 30rem);
        padding: ${i?"1rem":"1.25rem"};
        border-radius: 1.5rem;
        background: rgba(15, 23, 58, 0.96);
        border: 3px solid rgba(255, 255, 255, 0.95);
        box-shadow: 0 20px 48px rgba(0, 0, 0, 0.35);
        color: #fff;
        font-family: 'Zen Maru Gothic', sans-serif;
        text-align: center;
        transform: ${i?"scale(0.93)":"none"};
        transform-origin: center center;
      `;const a=document.createElement("h2");a.setAttribute("data-color-settings-title",""),a.style.cssText="margin: 0 0 0.55rem; font-size: clamp(1.2rem, 4.4vmin, 1.6rem);",this.descriptionEl=document.createElement("p"),this.descriptionEl.style.cssText="margin: 0 0 1rem; font-size: clamp(0.95rem, 3.4vmin, 1.05rem); line-height: 1.55;",this.toggleButton=document.createElement("button"),this.toggleButton.setAttribute("data-color-accessibility-toggle",""),this.toggleButton.style.cssText=`
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
      `,this.toggleButton.addEventListener("click",()=>{this.highContrast=!this.highContrast,this.render(),this.onToggle?.(this.highContrast)});const n=document.createElement("h3");n.setAttribute("data-audio-title",""),n.style.cssText="margin: 0.75rem 0 0.45rem; font-size: clamp(1rem, 3.8vmin, 1.2rem);";const o=document.createElement("p");o.setAttribute("data-audio-hint",""),o.style.cssText="margin: 0 0 0.65rem; font-size: clamp(0.9rem, 3.1vmin, 1rem); line-height: 1.45;";const c=(h,E,P)=>{const $=document.createElement("div");$.style.cssText="margin-bottom: 0.85rem; text-align: left;";const V=document.createElement("p");V.setAttribute(`data-${h}-volume-heading`,""),V.dataset.i18nKey=E,V.style.cssText="margin: 0 0 0.3rem; font-size: clamp(0.95rem, 3.2vmin, 1rem); font-weight: 900;";const U=document.createElement("p");U.setAttribute(`data-${h}-volume-label`,""),U.style.cssText="margin: 0 0 0.45rem; font-size: clamp(0.88rem, 3vmin, 0.98rem); line-height: 1.4;";const G=document.createElement("input");G.type="range",G.min="0",G.max="100",G.step="25",G.value="100",G.setAttribute(`data-${h}-volume-slider`,""),G.style.cssText="width: 100%; margin: 0 0 0.3rem;",G.addEventListener("input",()=>{const it=Number(G.value);h==="bgm"?this.bgmVolume=it:this.sfxVolume=it,this.render(),P(it)});const Ct=document.createElement("div");Ct.style.cssText=`
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 0.2rem;
          font-size: clamp(0.68rem, 2.25vmin, 0.8rem);
          color: rgba(255, 255, 255, 0.86);
          text-align: center;
        `;for(const it of yt){const $t=document.createElement("span");$t.setAttribute("data-volume-option",String(it.value)),Ct.appendChild($t)}return h==="bgm"?(this.bgmVolumeDescriptionEl=U,this.bgmVolumeSlider=G):(this.sfxVolumeDescriptionEl=U,this.sfxVolumeSlider=G),$.append(V,U,G,Ct),$},u=c("bgm","colorSettings.audio.bgm",h=>{this.onBGMVolumeChange?.(h)}),m=c("sfx","colorSettings.audio.sfx",h=>{this.onSFXVolumeChange?.(h)}),f=document.createElement("h3");f.setAttribute("data-rest-reminder-title",""),f.style.cssText="margin: 0.9rem 0 0.45rem; font-size: clamp(1rem, 3.8vmin, 1.2rem);",this.restReminderDescriptionEl=document.createElement("p"),this.restReminderDescriptionEl.style.cssText="margin: 0 0 0.6rem; font-size: clamp(0.9rem, 3.2vmin, 1rem); line-height: 1.5;",this.restReminderToggleButton=document.createElement("button"),this.restReminderToggleButton.setAttribute("data-rest-reminder-toggle",""),this.restReminderToggleButton.style.cssText=`
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
      `,this.restReminderToggleButton.addEventListener("click",()=>{this.restReminderEnabled=!this.restReminderEnabled,this.render(),this.onRestReminderToggle?.(this.restReminderEnabled)});const b=document.createElement("h3");b.setAttribute("data-language-title",""),b.style.cssText="margin: 0.9rem 0 0.45rem; font-size: clamp(1rem, 3.8vmin, 1.2rem);",this.languageDescriptionEl=document.createElement("p"),this.languageDescriptionEl.style.cssText="margin: 0 0 0.8rem; font-size: clamp(0.9rem, 3.2vmin, 1rem); line-height: 1.5;";const g=document.createElement("div");g.setAttribute("data-language-group",""),g.style.cssText=`
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.65rem;
        margin-bottom: 0.95rem;
      `;for(const h of Xt){const E=document.createElement("button");E.setAttribute("data-language-button",h.value),E.style.cssText=`
          min-height: 2.95rem;
          padding: 0.7rem 0.65rem;
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
        `,E.addEventListener("click",()=>{A.setLanguage(h.value),this.onLanguageChange?.(h.value)}),this.languageButtons.set(h.value,E),g.appendChild(E)}const r=document.createElement("h3");r.setAttribute("data-color-vision-title",""),r.style.cssText="margin: 0.9rem 0 0.45rem; font-size: clamp(1rem, 3.8vmin, 1.2rem);",this.colorVisionDescriptionEl=document.createElement("p"),this.colorVisionDescriptionEl.style.cssText="margin: 0 0 0.8rem; font-size: clamp(0.9rem, 3.2vmin, 1rem); line-height: 1.5;";const d=document.createElement("div");d.setAttribute("data-color-vision-mode-group",""),d.style.cssText=`
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 0.55rem;
        margin-bottom: 0.95rem;
      `;for(const h of mt){const E=document.createElement("button");E.setAttribute("data-color-vision-mode-button",h.value),E.style.cssText=`
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
        `,E.addEventListener("click",()=>{this.colorVisionSupportMode=h.value,this.render(),this.onColorVisionSupportModeChange?.(h.value)}),this.colorVisionButtons.set(h.value,E),d.appendChild(E)}const S=document.createElement("h3");S.setAttribute("data-visual-feedback-title",""),S.style.cssText="margin: 0.9rem 0 0.45rem; font-size: clamp(1rem, 3.8vmin, 1.2rem);",this.visualFeedbackDescriptionEl=document.createElement("p"),this.visualFeedbackDescriptionEl.style.cssText="margin: 0 0 0.8rem; font-size: clamp(0.9rem, 3.2vmin, 1rem); line-height: 1.5;";const x=document.createElement("div");x.setAttribute("data-visual-feedback-intensity-group",""),x.style.cssText=`
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.65rem;
        margin-bottom: 0.95rem;
      `;for(const h of Zt){const E=document.createElement("button");E.setAttribute("data-visual-feedback-intensity-button",h.value),E.style.cssText=`
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
        `,E.addEventListener("click",()=>{this.visualFeedbackIntensity=h.value,this.render(),this.onVisualEffectIntensityChange?.(h.value)}),this.visualFeedbackButtons.set(h.value,E),x.appendChild(E)}const T=document.createElement("h3");T.setAttribute("data-motion-title",""),T.style.cssText="margin: 1.1rem 0 0.45rem; font-size: clamp(1rem, 3.8vmin, 1.2rem);";const y=document.createElement("p");y.setAttribute("data-motion-hint",""),y.style.cssText="margin: 0 0 0.5rem; font-size: clamp(0.9rem, 3.2vmin, 1rem); line-height: 1.5;",this.motionDescriptionEl=document.createElement("p"),this.motionDescriptionEl.style.cssText="margin: 0 0 0.8rem; font-size: clamp(0.9rem, 3.2vmin, 1rem); line-height: 1.5;";const p=document.createElement("div");p.setAttribute("data-motion-sensitivity-group",""),p.style.cssText=`
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.65rem;
        margin-bottom: 0.95rem;
      `;const M=["strong","medium","gentle","minimal"];for(const h of M){const E=wt(h),P=document.createElement("button");P.setAttribute("data-motion-sensitivity-button",h),P.style.cssText=`
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
        `;const $=document.createElement("span");$.textContent=E.emoji,$.style.cssText="font-size: clamp(1.25rem, 4.8vmin, 1.7rem); line-height: 1;";const V=document.createElement("span");V.textContent=E.stars,V.style.cssText="font-size: clamp(0.82rem, 2.9vmin, 0.95rem); letter-spacing: 0.08em;";const U=document.createElement("span");U.setAttribute("data-motion-label",h),U.style.cssText="font-size: clamp(0.9rem, 3vmin, 1rem);",P.append($,V,U),P.addEventListener("click",()=>{this.motionSensitivity=h,this.render(),this.playMotionPreview(),this.onMotionSensitivityChange?.(h)}),this.motionButtons.set(h,P),p.appendChild(P)}this.motionPreviewEl=document.createElement("div"),this.motionPreviewEl.setAttribute("data-motion-preview",""),this.motionPreviewEl.style.cssText=`
        position: relative;
        min-height: 5.8rem;
        margin: 0 0 1rem;
        padding: 0.8rem 0.9rem;
        border-radius: 1.25rem;
        border: 2px solid rgba(255, 255, 255, 0.2);
        background: linear-gradient(180deg, rgba(14, 24, 60, 0.92), rgba(8, 14, 38, 0.96));
        overflow: hidden;
      `;const k=document.createElement("div");k.style.cssText=`
        position: relative;
        height: 2.7rem;
        margin-bottom: 0.7rem;
        border-radius: 999px;
        background: linear-gradient(90deg, rgba(255, 255, 255, 0.12), rgba(118, 240, 255, 0.22));
        box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.12);
      `;const C=document.createElement("div");C.style.cssText=`
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
      `,this.motionPreviewCaptionEl=document.createElement("p"),this.motionPreviewCaptionEl.setAttribute("data-motion-preview-caption",""),this.motionPreviewCaptionEl.style.cssText="margin: 0; font-size: clamp(0.9rem, 3vmin, 1rem); line-height: 1.5;",k.append(C,this.motionPreviewTokenEl),this.motionPreviewEl.append(k,this.motionPreviewCaptionEl);const w=document.createElement("button");w.setAttribute("data-color-settings-close",""),w.style.cssText=`
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
      `,w.addEventListener("click",()=>this.hide()),s.appendChild(a),s.appendChild(this.descriptionEl),s.appendChild(this.toggleButton),s.appendChild(n),s.appendChild(o),s.appendChild(u),s.appendChild(m),s.appendChild(f),s.appendChild(this.restReminderDescriptionEl),s.appendChild(this.restReminderToggleButton),s.appendChild(b),s.appendChild(this.languageDescriptionEl),s.appendChild(g),s.appendChild(r),s.appendChild(this.colorVisionDescriptionEl),s.appendChild(d),s.appendChild(S),s.appendChild(this.visualFeedbackDescriptionEl),s.appendChild(x),s.appendChild(T),s.appendChild(y),s.appendChild(this.motionDescriptionEl),s.appendChild(p),s.appendChild(this.motionPreviewEl),s.appendChild(w),this.overlay.appendChild(s)}this.render(),e.appendChild(this.overlay)}}hide(){this.clearMotionPreviewTimers(),this.languageUnsubscribe?.(),this.languageUnsubscribe=null,this.overlay?.remove()}isVisible(){return this.overlay?.isConnected===!0}getMotionShortLabel(t){return A.t(qt[t].shortLabel)}getMotionDescription(t){return A.t(qt[t].description)}setStaticText(t,e){const i=this.overlay?.querySelector(t);i&&(i.textContent=A.t(e))}render(){if(!this.toggleButton||!this.descriptionEl||!this.bgmVolumeDescriptionEl||!this.sfxVolumeDescriptionEl||!this.bgmVolumeSlider||!this.sfxVolumeSlider||!this.restReminderDescriptionEl||!this.restReminderToggleButton||!this.languageDescriptionEl||!this.colorVisionDescriptionEl||!this.visualFeedbackDescriptionEl||!this.motionDescriptionEl)return;this.setStaticText("[data-color-settings-title]","colorSettings.title"),this.setStaticText("[data-audio-title]","colorSettings.audio.title"),this.setStaticText("[data-audio-hint]","colorSettings.audio.hint"),this.setStaticText("[data-bgm-volume-heading]","colorSettings.audio.bgm"),this.setStaticText("[data-sfx-volume-heading]","colorSettings.audio.sfx"),this.setStaticText("[data-rest-reminder-title]","colorSettings.restReminder.title"),this.setStaticText("[data-language-title]","colorSettings.language.title"),this.setStaticText("[data-color-vision-title]","colorSettings.colorVision.title"),this.setStaticText("[data-visual-feedback-title]","colorSettings.visualFeedback.title"),this.setStaticText("[data-motion-title]","colorSettings.motion.title"),this.setStaticText("[data-motion-hint]","colorSettings.motion.hint"),this.setStaticText("[data-color-settings-close]","colorSettings.close"),this.descriptionEl.textContent=this.highContrast?A.t("colorSettings.description.on"):A.t("colorSettings.description.off"),this.toggleButton.textContent=this.highContrast?A.t("colorSettings.toggle.on"):A.t("colorSettings.toggle.off"),this.toggleButton.setAttribute("aria-pressed",this.highContrast?"true":"false");const t=Kt(this.bgmVolume);this.bgmVolumeDescriptionEl.textContent=`🎵 ${t} (${this.bgmVolume}%)`,this.bgmVolumeSlider.value=String(this.bgmVolume),this.bgmVolumeSlider.setAttribute("aria-valuetext",`${t} ${this.bgmVolume}%`);const e=Kt(this.sfxVolume);this.sfxVolumeDescriptionEl.textContent=`✨ ${e} (${this.sfxVolume}%)`,this.sfxVolumeSlider.value=String(this.sfxVolume),this.sfxVolumeSlider.setAttribute("aria-valuetext",`${e} ${this.sfxVolume}%`);for(const a of yt){const n=this.overlay?.querySelector(`[data-volume-option="${a.value}"]`);n&&(n.textContent=A.t(a.labelKey))}this.restReminderDescriptionEl.textContent=this.restReminderEnabled?A.t("colorSettings.restReminder.description.on"):A.t("colorSettings.restReminder.description.off"),this.restReminderToggleButton.textContent=this.restReminderEnabled?A.t("colorSettings.restReminder.toggle.on"):A.t("colorSettings.restReminder.toggle.off"),this.restReminderToggleButton.setAttribute("aria-pressed",this.restReminderEnabled?"true":"false"),this.languageDescriptionEl.textContent=A.t("colorSettings.language.description");for(const a of Xt){const n=this.languageButtons.get(a.value);if(!n)continue;const o=a.value===this.language;n.textContent=`${a.icon} ${A.t(a.labelKey)}`,n.setAttribute("aria-pressed",o?"true":"false"),n.style.borderColor=o?"#fff27a":"rgba(255, 255, 255, 0.4)",n.style.background=o?"linear-gradient(135deg, rgba(255, 242, 122, 0.94), rgba(118, 240, 255, 0.92))":"rgba(255, 255, 255, 0.08)",n.style.color=o?"#102040":"#fff",n.style.transform=o?"scale(1.02)":"scale(1)"}const i=mt.find(a=>a.value===this.colorVisionSupportMode)??mt[0];this.colorVisionDescriptionEl.textContent=A.t(i.descriptionKey);for(const a of mt){const n=this.colorVisionButtons.get(a.value);if(!n)continue;const o=a.value===this.colorVisionSupportMode;n.textContent=`${a.icon} ${A.t(a.labelKey)}`,n.setAttribute("aria-pressed",o?"true":"false"),n.style.borderColor=o?"#fff27a":"rgba(255, 255, 255, 0.4)",n.style.background=o?"linear-gradient(135deg, rgba(255, 242, 122, 0.94), rgba(118, 240, 255, 0.92))":"rgba(255, 255, 255, 0.08)",n.style.color=o?"#102040":"#fff",n.style.transform=o?"scale(1.02)":"scale(1)"}const s={strong:A.t("colorSettings.visualFeedback.description.strong"),medium:A.t("colorSettings.visualFeedback.description.medium"),weak:A.t("colorSettings.visualFeedback.description.weak"),off:A.t("colorSettings.visualFeedback.description.off")};this.visualFeedbackDescriptionEl.textContent=s[this.visualFeedbackIntensity];for(const a of Zt){const n=this.visualFeedbackButtons.get(a.value);if(!n)continue;const o=a.value===this.visualFeedbackIntensity;n.textContent=A.t(a.labelKey),n.setAttribute("aria-pressed",o?"true":"false"),n.style.borderColor=o?"#fff27a":"rgba(255, 255, 255, 0.4)",n.style.background=o?"linear-gradient(135deg, rgba(255, 242, 122, 0.94), rgba(118, 240, 255, 0.92))":"rgba(255, 255, 255, 0.08)",n.style.color=o?"#102040":"#fff",n.style.transform=o?"scale(1.02)":"scale(1)"}this.motionDescriptionEl.textContent=this.getMotionDescription(this.motionSensitivity);for(const[a,n]of this.motionButtons.entries()){const o=a===this.motionSensitivity,c=n.querySelector(`[data-motion-label="${a}"]`);c&&(c.textContent=this.getMotionShortLabel(a)),n.setAttribute("aria-pressed",o?"true":"false"),n.style.borderColor=o?"#fff27a":"rgba(255, 255, 255, 0.4)",n.style.background=o?"linear-gradient(135deg, rgba(255, 242, 122, 0.94), rgba(118, 240, 255, 0.92))":"rgba(255, 255, 255, 0.08)",n.style.color=o?"#102040":"#fff",n.style.transform=o?"scale(1.02)":"scale(1)"}this.motionPreviewEl?.dataset.previewActive!=="true"&&this.resetMotionPreview()}playMotionPreview(){if(!this.motionPreviewEl||!this.motionPreviewTokenEl||!this.motionPreviewCaptionEl)return;this.clearMotionPreviewTimers();const t=wt(this.motionSensitivity),e=this.getMotionShortLabel(this.motionSensitivity);this.motionPreviewEl.dataset.previewActive="true",this.motionPreviewTokenEl.textContent=t.emoji,this.motionPreviewTokenEl.style.background="rgba(255, 242, 122, 0.92)",this.motionPreviewTokenEl.style.boxShadow=t.previewGlow,this.motionPreviewTokenEl.style.transition="none",this.motionPreviewTokenEl.style.left="0.35rem",this.motionPreviewTokenEl.style.transform="translateY(-50%) scale(1)",this.motionPreviewCaptionEl.textContent=A.t("colorSettings.motion.preview.playing",{emoji:t.emoji,label:e}),this.motionPreviewFrameId=window.requestAnimationFrame(()=>{this.motionPreviewTokenEl&&(this.motionPreviewTokenEl.style.transition=`left ${t.previewDurationMs}ms ease-in-out, transform ${t.previewDurationMs}ms ease-in-out`,this.motionPreviewTokenEl.style.left="calc(100% - 2.45rem)",this.motionPreviewTokenEl.style.transform=`translateY(-50%) scale(${t.previewScale})`)}),this.motionPreviewTimeoutId=window.setTimeout(()=>{this.resetMotionPreview()},t.previewDurationMs+260)}resetMotionPreview(){if(!this.motionPreviewEl||!this.motionPreviewTokenEl||!this.motionPreviewCaptionEl)return;const t=wt(this.motionSensitivity),e=this.getMotionShortLabel(this.motionSensitivity);this.motionPreviewEl.dataset.previewActive="false",this.motionPreviewTokenEl.textContent=t.emoji,this.motionPreviewTokenEl.style.transition="none",this.motionPreviewTokenEl.style.left="0.35rem",this.motionPreviewTokenEl.style.transform="translateY(-50%) scale(1)",this.motionPreviewTokenEl.style.background="rgba(255, 242, 122, 0.92)",this.motionPreviewTokenEl.style.boxShadow=t.previewGlow,this.motionPreviewCaptionEl.textContent=A.t("colorSettings.motion.preview.idle",{stars:t.stars,label:e})}clearMotionPreviewTimers(){this.motionPreviewTimeoutId!==null&&(window.clearTimeout(this.motionPreviewTimeoutId),this.motionPreviewTimeoutId=null),this.motionPreviewFrameId!==null&&(window.cancelAnimationFrame(this.motionPreviewFrameId),this.motionPreviewFrameId=null)}}function I(l,t){let e=!1,i=!1,s=null,a=null;const n=t.documentTarget??document,o=t.stopPropagation??!0,c=()=>{t.canActivate?.()!==!1&&t.onActivate()},u=C=>{t.onPressChange?.(C)},m=C=>{const w=C;return typeof w.clientX=="number"&&typeof w.clientY=="number"?{x:w.clientX,y:w.clientY}:null},f=C=>{const w=C;return typeof w.pointerId=="number"?w.pointerId:null},b=C=>{const w=f(C);return s===null||w===null||w===s},g=C=>{if(!e||a===null||t.moveTolerancePx===void 0)return!1;const w=m(C);return w===null?!1:Math.hypot(w.x-a.x,w.y-a.y)>t.moveTolerancePx},r=C=>{e=!1,i=C,s=null,a=null,u(!1),n.removeEventListener("pointermove",x,!0),n.removeEventListener("pointerup",d,!0),n.removeEventListener("pointercancel",S,!0)},d=C=>{if(!e||!b(C))return;if(g(C)){r(!0);return}const w=C.target,h=w===l||w instanceof Node&&l.contains(w),E=e&&h;r(E||!h),E&&c()},S=()=>{r(!0)},x=C=>{!e||!b(C)||g(C)&&r(!0)},T=C=>{t.canActivate?.()!==!1&&((t.preventDefaultOnPointerDown??!1)&&C.preventDefault(),o&&C.stopPropagation(),e=!0,i=!1,s=f(C),a=m(C),u(!0),t.moveTolerancePx!==void 0&&n.addEventListener("pointermove",x,!0),n.addEventListener("pointerup",d,!0),n.addEventListener("pointercancel",S,!0))},y=()=>{e&&u(!0)},p=()=>{e&&u(!1)},M=()=>{r(!0)},k=C=>{if(o&&C.stopPropagation(),(t.preventDefaultOnClick??!1)&&C.preventDefault(),i){i=!1;return}e||c()};return l.addEventListener("pointerdown",T),l.addEventListener("pointerenter",y),l.addEventListener("pointerleave",p),l.addEventListener("pointercancel",M),l.addEventListener("click",k),()=>{r(!1),l.removeEventListener("pointerdown",T),l.removeEventListener("pointerenter",y),l.removeEventListener("pointerleave",p),l.removeEventListener("pointercancel",M),l.removeEventListener("click",k)}}class yi{overlay=null;previewBody=null;previewNose=null;previewWings=null;buttonCleanups=new Set;optionButtons=new Map;draft={...It};colorOptions=J.getColorOptions();show(t){this.hide();const e=document.getElementById("ui-overlay");if(!e)return;this.draft=J.normalizeCustomization(t.initialCustomization),this.overlay=document.createElement("div"),this.overlay.setAttribute("data-spaceship-customizer",""),this.overlay.setAttribute("role","dialog"),this.overlay.setAttribute("aria-modal","true"),this.overlay.setAttribute("aria-label","うちゅうせんを かざろう"),this.overlay.style.cssText=`
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
    `;const i=document.createElement("div");i.setAttribute("data-spaceship-customizer-panel",""),i.style.cssText=`
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
    `,i.style.overflowY="hidden",i.style.height="100%",i.style.maxHeight="720px",i.addEventListener("pointerdown",u=>u.stopPropagation()),this.overlay.appendChild(i);const s=document.createElement("h2");s.textContent="うちゅうせんを かざろう",s.style.cssText="margin: 0 0 0.3rem; font-size: clamp(1.25rem, 4.3vmin, 1.85rem); color: #ffe66d;";const a=document.createElement("p");a.textContent="おおきな ボタンで えらぶと、すぐに みためが かわるよ。",a.style.cssText="margin: 0 0 0.45rem; font-size: clamp(0.85rem, 2.8vmin, 1rem); line-height: 1.35;",i.appendChild(s),i.appendChild(a);const n=document.createElement("div");n.setAttribute("data-spaceship-customizer-content",""),n.style.cssText="display: grid; grid-template-columns: minmax(12rem, 15rem) minmax(0, 1fr); gap: 0.65rem; align-items: stretch; margin: 0.45rem 0 0.65rem;",n.appendChild(this.createPreviewCard());const o=document.createElement("div");o.setAttribute("data-spaceship-customizer-sections",""),o.style.cssText="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.5rem; align-items: stretch;",o.appendChild(this.createPartSection("bodyColor","ほんたい")),o.appendChild(this.createPartSection("noseColor","ノーズ")),o.appendChild(this.createPartSection("wingColor","つばさ")),n.appendChild(o),i.appendChild(n);const c=document.createElement("button");c.textContent="かんりょう",c.setAttribute("data-spaceship-customizer-done",""),c.style.cssText=`
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
    `,this.buttonCleanups.add(I(c,{onActivate:()=>{const u={...this.draft};this.hide(),t.onComplete(u)},onPressChange:u=>{c.style.transform=u?"scale(0.96)":"scale(1)"}})),i.appendChild(c),e.appendChild(this.overlay),this.render()}hide(){const t=Array.from(this.buttonCleanups);this.buttonCleanups.clear();for(const e of t)e();this.optionButtons.clear(),this.overlay?.remove(),this.overlay=null,this.previewBody=null,this.previewNose=null,this.previewWings=null}isVisible(){return this.overlay?.isConnected===!0}createPreviewCard(){const t=document.createElement("div");t.setAttribute("data-spaceship-customizer-preview-card",""),t.style.cssText=`
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
    `;const e=document.createElement("div");e.textContent="プレビュー",e.style.cssText="margin-bottom: 0.35rem; font-size: 0.85rem; font-weight: 700; color: #dff4ff;",t.appendChild(e);const i=document.createElement("div");i.setAttribute("data-spaceship-customizer-preview",""),i.style.cssText=`
      position: relative;
      width: min(100%, 14rem);
      height: 7.5rem;
      margin: 0 auto;
      border-radius: 1.4rem;
      background: radial-gradient(circle at top, rgba(123, 206, 255, 0.36), rgba(18, 28, 74, 0.95));
      overflow: hidden;
    `;const s=document.createElement("div");s.style.cssText=`
      position: absolute;
      inset: 0;
      background-image:
        radial-gradient(circle, rgba(255,255,255,0.9) 0 1px, transparent 1.5px),
        radial-gradient(circle, rgba(255,255,255,0.75) 0 1px, transparent 1.5px),
        radial-gradient(circle, rgba(255,255,255,0.65) 0 1px, transparent 1.5px);
      background-size: 48px 48px, 70px 70px, 88px 88px;
      background-position: 0 0, 14px 18px, 26px 8px;
      opacity: 0.85;
    `,i.appendChild(s),this.previewWings=document.createElement("div"),this.previewWings.style.cssText=`
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
    `,i.appendChild(this.previewWings),i.appendChild(this.previewBody),i.appendChild(this.previewNose),i.appendChild(a),t.appendChild(i),t}createPartSection(t,e){const i=document.createElement("div");i.style.cssText=`
      padding: 0.5rem 0.45rem;
      border-radius: 1.1rem;
      background: rgba(255, 255, 255, 0.08);
      text-align: left;
      box-sizing: border-box;
    `;const s=document.createElement("div");s.textContent=e,s.style.cssText="margin-bottom: 0.25rem; font-size: 0.88rem; font-weight: 900; color: #ffe66d; text-align: center;",i.appendChild(s);const a=document.createElement("div");a.style.cssText="display: grid; grid-template-columns: minmax(0, 1fr); gap: 0.32rem;";for(const n of this.colorOptions)a.appendChild(this.createColorButton(t,n));return i.appendChild(a),i}createColorButton(t,e){const i=document.createElement("button");i.type="button",i.setAttribute("data-spaceship-color-option",`${t}:${e.key}`),i.style.cssText=`
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
    `;const s=document.createElement("span");s.setAttribute("data-spaceship-color-swatch",e.key),s.setAttribute("data-color-hex",`#${e.hex.toString(16).padStart(6,"0")}`),s.style.cssText=`
      display: block;
      width: 1.35rem;
      height: 1.35rem;
      border-radius: 999px;
      background: #${e.hex.toString(16).padStart(6,"0")};
      box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.24);
    `;const a=document.createElement("span");return a.textContent=e.label,a.style.cssText="font-family: Zen Maru Gothic, sans-serif; font-size: 0.82rem; font-weight: 700;",i.appendChild(s),i.appendChild(a),this.buttonCleanups.add(I(i,{onActivate:()=>this.selectColor(t,e.key),onPressChange:n=>{i.style.transform=n?"scale(0.95)":"scale(1)"}})),this.optionButtons.set(`${t}:${e.key}`,i),i}selectColor(t,e){this.draft={...this.draft,[t]:e},this.render()}render(){const t=J.normalizeCustomization(this.draft);this.draft=t,this.previewBody?.style.setProperty("background",`#${J.getColorHex(t.bodyColor).toString(16).padStart(6,"0")}`),this.previewWings?.style.setProperty("background",`#${J.getColorHex(t.wingColor).toString(16).padStart(6,"0")}`),this.previewNose&&(this.previewNose.style.borderBottomColor=`#${J.getColorHex(t.noseColor).toString(16).padStart(6,"0")}`);for(const e of this.colorOptions)this.renderOptionState("bodyColor",e.key,t.bodyColor===e.key),this.renderOptionState("noseColor",e.key,t.noseColor===e.key),this.renderOptionState("wingColor",e.key,t.wingColor===e.key)}renderOptionState(t,e,i){const s=this.optionButtons.get(`${t}:${e}`);s&&(s.setAttribute("aria-pressed",i?"true":"false"),s.style.borderColor=i?"#ffe66d":"transparent",s.style.background=i?"rgba(255, 230, 109, 0.18)":"rgba(255, 255, 255, 0.12)")}}function bi(l){return{totalPlayTimeSeconds:l?.totalPlayTimeSeconds??0,totalStarsCollected:l?.totalStarsCollected??0,totalBoostUses:l?.totalBoostUses??0,stageClearCounts:{...l?.stageClearCounts??{}}}}function vi(l){const t=Math.max(0,Math.round(l)),e=Math.floor(t/3600),i=Math.floor(t%3600/60),s=t%60;return e>0?`${e}じかん ${i}ふん`:i>0?`${i}ふん ${s}びょう`:`${s}びょう`}class Si{overlayEl=null;actionCleanups=new Set;show(t,e){this.hide();const i=document.getElementById("ui-overlay");if(!i)return;const s=bi(t),a=window.innerHeight<=720,n=document.createElement("div");n.setAttribute("data-stats-overlay",""),n.style.cssText=`
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
    `;const c=document.createElement("h2");c.textContent="あそびの きろく",c.style.cssText=`
      margin: 0 0 1rem;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${a?"1.8rem":"2.2rem"};
      font-weight: 900;
      color: #FFE66D;
    `,o.appendChild(c);const u=document.createElement("div");u.style.cssText=`
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(${a?"120px":"150px"}, 1fr));
      gap: 0.8rem;
      margin-bottom: 1rem;
    `,u.append(this.createSummaryCard("あそんだ じかん",vi(s.totalPlayTimeSeconds),"data-stats-total-play-time"),this.createSummaryCard("とった ほし",`${s.totalStarsCollected}こ`,"data-stats-total-stars"),this.createSummaryCard("ブースト",`${s.totalBoostUses}かい`,"data-stats-total-boosts")),o.appendChild(u);const m=document.createElement("div");m.style.cssText=`
      margin-top: 0.5rem;
      padding: ${a?"0.9rem 0.8rem":"1rem"};
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.1);
    `;const f=document.createElement("div");f.textContent="ステージ クリア かいすう",f.style.cssText=`
      margin-bottom: 0.75rem;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${a?"1.1rem":"1.25rem"};
      font-weight: 900;
      color: #FFE66D;
    `,m.appendChild(f);const b=document.createElement("div");b.setAttribute("data-stats-stage-clears",""),b.style.cssText=`
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
      text-align: left;
    `;const g=Array.from({length:z},(d,S)=>S+1).map(d=>({stageNumber:d,clearCount:s.stageClearCounts[d]??0})).filter(d=>d.clearCount>0);if(g.length===0){const d=document.createElement("div");d.textContent="まだ きろくが ないよ",d.style.cssText=`
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${a?"1rem":"1.1rem"};
        font-weight: 700;
        text-align: center;
        color: rgba(255, 255, 255, 0.88);
      `,b.appendChild(d)}else for(const{stageNumber:d,clearCount:S}of g){const x=Q(d),T=document.createElement("div");T.setAttribute("data-stats-stage-clear-row",String(d)),T.style.cssText=`
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
        `;const y=document.createElement("span");y.textContent=`${x.emoji} ステージ ${d} ${x.destinationReading}`;const p=document.createElement("span");p.textContent=`${S}かい`,p.style.color="#FFE66D",T.append(y,p),b.appendChild(T)}m.appendChild(b),o.appendChild(m);const r=document.createElement("button");r.textContent="もどる",r.style.cssText=`
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
    `,this.actionCleanups.add(I(r,{onActivate:()=>{this.hide(),e()},onPressChange:d=>{r.style.transform=d?"scale(0.96)":"scale(1)"}})),o.appendChild(r),n.appendChild(o),i.appendChild(n)}hide(){const t=Array.from(this.actionCleanups);this.actionCleanups.clear();for(const e of t)e();this.overlayEl?.remove(),this.overlayEl=null}createSummaryCard(t,e,i){const s=document.createElement("div");s.setAttribute(i,""),s.style.cssText=`
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
    `,s.append(a,n),s}}const Z={strong:{rippleDurationMs:360,markerDurationMs:300,rippleScale:2.35,markerScale:1},medium:{rippleDurationMs:340,markerDurationMs:300,rippleScale:2.05,markerScale:.98},gentle:{rippleDurationMs:320,markerDurationMs:280,rippleScale:1.75,markerScale:.94},minimal:{rippleDurationMs:280,markerDurationMs:240,rippleScale:1.45,markerScale:.9}};class K{static STYLE_ID="touch-feedback-overlay-styles";static UI_ROOT_LISTENER_OPTIONS={capture:!0,passive:!0};root=null;activeEntries=new Map;pooledEntries=[];uiRootCleanups=new Set;motionSensitivity="strong";attach(){const t=this.ensureRoot();t.isConnected||document.body.appendChild(t)}hide(){this.clearUiRoots();for(const t of this.activeEntries.keys())this.releaseGameplayTouch(t);for(this.activeEntries.clear();this.pooledEntries.length>0;)this.pooledEntries.pop()?.host.remove();this.root?.remove()}dispose(){this.hide(),this.root=null}setMotionSensitivity(t){this.motionSensitivity=t;const e=this.ensureRoot(),i=Z[t];e.style.setProperty("--touch-feedback-ripple-duration",`${i.rippleDurationMs}ms`),e.style.setProperty("--touch-feedback-marker-duration",`${i.markerDurationMs}ms`),e.style.setProperty("--touch-feedback-ripple-scale",`${i.rippleScale}`),e.style.setProperty("--touch-feedback-marker-scale",`${i.markerScale}`)}bindUiRoots(t){this.clearUiRoots();for(const e of t){if(!e)continue;const i=s=>{const a=s.target;if(!(a instanceof Element)||this.root?.contains(a))return;const n=a.closest('button, [role="button"], [data-touch-feedback-button]');if(!(n instanceof HTMLElement)||!e.contains(n))return;const o=s;typeof o.clientX!="number"||typeof o.clientY!="number"||this.showUiTouch(o.clientX,o.clientY)};e.addEventListener("pointerdown",i,K.UI_ROOT_LISTENER_OPTIONS),this.uiRootCleanups.add(()=>{e.removeEventListener("pointerdown",i,K.UI_ROOT_LISTENER_OPTIONS)})}}showGameplayTouch(t,e,i,s){const a=this.activeEntries.get(t)??this.acquireEntry(t);this.activeEntries.set(t,a),this.activateEntry(a,e,i,this.toGameplayVariant(s))}moveGameplayTouch(t,e,i,s){this.showGameplayTouch(t,e,i,s)}releaseGameplayTouch(t){const e=this.activeEntries.get(t);e&&(this.activeEntries.delete(t),e.activePointerId=null,this.recycleWhenIdle(e))}showUiTouch(t,e){const i=this.acquireEntry(null);this.activateEntry(i,t,e,"ui"),this.recycleWhenIdle(i)}ensureRoot(){if(this.root)return this.root;this.injectStyles();const t=document.createElement("div");return t.setAttribute("data-touch-feedback-root",""),t.style.cssText=`
      position: fixed;
      inset: 0;
      overflow: hidden;
      pointer-events: none;
      z-index: 25;
      contain: layout style paint;
      --touch-feedback-ripple-duration: ${Z.strong.rippleDurationMs}ms;
      --touch-feedback-marker-duration: ${Z.strong.markerDurationMs}ms;
      --touch-feedback-ripple-scale: ${Z.strong.rippleScale};
      --touch-feedback-marker-scale: ${Z.strong.markerScale};
    `,this.root=t,this.setMotionSensitivity(this.motionSensitivity),t}injectStyles(){if(document.getElementById(K.STYLE_ID))return;const t=document.createElement("style");t.id=K.STYLE_ID,t.textContent=`
      @keyframes touchFeedbackRippleA {
        0% { opacity: 0.7; transform: translate(-50%, -50%) scale(0.35); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(var(--touch-feedback-ripple-scale)); }
      }
      @keyframes touchFeedbackRippleB {
        0% { opacity: 0.74; transform: translate(-50%, -50%) scale(0.42); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(calc(var(--touch-feedback-ripple-scale) * 0.94)); }
      }
      @keyframes touchFeedbackMarkerA {
        0% { opacity: 0.82; transform: translate(-50%, -50%) scale(calc(var(--touch-feedback-marker-scale) * 0.82)); }
        70% { opacity: 0.56; transform: translate(-50%, -50%) scale(var(--touch-feedback-marker-scale)); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(calc(var(--touch-feedback-marker-scale) * 1.06)); }
      }
      @keyframes touchFeedbackMarkerB {
        0% { opacity: 0.78; transform: translate(-50%, -50%) scale(calc(var(--touch-feedback-marker-scale) * 0.88)); }
        70% { opacity: 0.52; transform: translate(-50%, -50%) scale(var(--touch-feedback-marker-scale)); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(calc(var(--touch-feedback-marker-scale) * 1.03)); }
      }
      [data-touch-feedback-entry] {
        position: absolute;
        inset: 0 auto auto 0;
        width: 0;
        height: 0;
      }
      [data-touch-feedback-ripple],
      [data-touch-feedback-marker] {
        position: absolute;
        left: 0;
        top: 0;
        transform: translate(-50%, -50%);
        will-change: transform, opacity;
      }
      [data-touch-feedback-ripple] {
        width: 4rem;
        height: 4rem;
        border-radius: 999px;
        border: 0.24rem solid var(--touch-feedback-color, rgba(255,255,255,0.9));
        box-shadow: 0 0 24px var(--touch-feedback-color, rgba(255,255,255,0.3));
        opacity: 0;
      }
      [data-touch-feedback-marker] {
        width: 1.25rem;
        height: 1.25rem;
        border-radius: 999px;
        background:
          radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.96), transparent 36%),
          var(--touch-feedback-color, rgba(255,255,255,0.9));
        border: 0.16rem solid rgba(255, 255, 255, 0.94);
        box-shadow:
          0 0 18px var(--touch-feedback-color, rgba(255,255,255,0.35)),
          0 0 0 0.18rem rgba(255, 255, 255, 0.2);
        opacity: 0;
      }
      [data-touch-feedback-variant="game-left"] {
        --touch-feedback-color: rgba(119, 220, 255, 0.95);
      }
      [data-touch-feedback-variant="game-right"] {
        --touch-feedback-color: rgba(255, 162, 231, 0.96);
      }
      [data-touch-feedback-variant="game-center"] {
        --touch-feedback-color: rgba(255, 255, 255, 0.92);
      }
      [data-touch-feedback-variant="ui"] {
        --touch-feedback-color: rgba(255, 223, 120, 0.97);
      }
      [data-touch-feedback-ripple][data-touch-feedback-anim="a"] {
        animation: touchFeedbackRippleA var(--touch-feedback-ripple-duration) ease-out forwards;
      }
      [data-touch-feedback-ripple][data-touch-feedback-anim="b"] {
        animation: touchFeedbackRippleB var(--touch-feedback-ripple-duration) ease-out forwards;
      }
      [data-touch-feedback-marker][data-touch-feedback-anim="a"] {
        animation: touchFeedbackMarkerA var(--touch-feedback-marker-duration) ease-out forwards;
      }
      [data-touch-feedback-marker][data-touch-feedback-anim="b"] {
        animation: touchFeedbackMarkerB var(--touch-feedback-marker-duration) ease-out forwards;
      }
    `,document.head.appendChild(t)}acquireEntry(t){const e=this.pooledEntries.pop()??this.createEntry();return e.activePointerId=t,e.releaseScheduled=!1,this.ensureRoot().appendChild(e.host),e}createEntry(){const t=document.createElement("div");t.setAttribute("data-touch-feedback-entry","");const e=document.createElement("div");e.setAttribute("data-touch-feedback-ripple","");const i=document.createElement("div");i.setAttribute("data-touch-feedback-marker",""),t.append(e,i);const s={host:t,marker:i,ripple:e,markerTimeoutId:null,rippleTimeoutId:null,releaseScheduled:!1,activePointerId:null,animationToggle:!1},a=n=>{n.target instanceof HTMLElement&&(n.target.removeAttribute("data-touch-feedback-anim"),this.recycleWhenIdle(s))};return e.addEventListener("animationend",a),i.addEventListener("animationend",a),s}activateEntry(t,e,i,s){const a=t.animationToggle?"a":"b";t.animationToggle=!t.animationToggle,t.releaseScheduled=!1,t.host.style.left=`${e}px`,t.host.style.top=`${i}px`,t.host.setAttribute("data-touch-feedback-variant",s),t.ripple.setAttribute("data-touch-feedback-anim",a),t.marker.setAttribute("data-touch-feedback-anim",a),t.markerTimeoutId!==null&&window.clearTimeout(t.markerTimeoutId),t.rippleTimeoutId!==null&&window.clearTimeout(t.rippleTimeoutId);const n=Z[this.motionSensitivity].rippleDurationMs,o=Z[this.motionSensitivity].markerDurationMs;t.rippleTimeoutId=window.setTimeout(()=>{t.rippleTimeoutId=null,t.ripple.removeAttribute("data-touch-feedback-anim"),this.recycleWhenIdle(t)},n+24),t.markerTimeoutId=window.setTimeout(()=>{t.markerTimeoutId=null,t.marker.removeAttribute("data-touch-feedback-anim"),this.recycleWhenIdle(t)},o+24)}recycleWhenIdle(t){if(t.activePointerId!==null||t.releaseScheduled)return;const e=t.ripple.hasAttribute("data-touch-feedback-anim"),i=t.marker.hasAttribute("data-touch-feedback-anim");e||i||(t.releaseScheduled=!0,t.host.remove(),t.host.removeAttribute("data-touch-feedback-variant"),t.markerTimeoutId!==null&&(window.clearTimeout(t.markerTimeoutId),t.markerTimeoutId=null),t.rippleTimeoutId!==null&&(window.clearTimeout(t.rippleTimeoutId),t.rippleTimeoutId=null),this.pooledEntries.push(t))}clearUiRoots(){const t=Array.from(this.uiRootCleanups);this.uiRootCleanups.clear();for(const e of t)e()}toGameplayVariant(t){switch(t){case"left":return"game-left";case"right":return"game-right";default:return"game-center"}}}function Qt(l,t){if(!Number.isFinite(l)||l<=0||t<=0)return"ずかん";const e=Math.min(l,t);return e>=t?`ずかん ${t} / ${t} 🎉`:`ずかん ${e} / ${t}`}function Ei(l){switch(l){case"hero":return{gap:"0.35rem",label:"0.92rem",medal:"1.7rem",hint:"0.98rem"};case"compact":return{gap:"0.18rem",label:"0.7rem",medal:"1rem",hint:"0.76rem"};default:return{gap:"0.26rem",label:"0.8rem",medal:"1.25rem",hint:"0.84rem"}}}function Ot(l,t,e={}){const i=ie(l,t),s=e.size??"regular",a=Ei(s),n=document.createElement("div");if(n.setAttribute("data-stage-medal-display",""),n.setAttribute("data-stage-medal-stage",String(l)),n.setAttribute("data-stage-medal-tier",i.tier),n.setAttribute("data-stage-medal-earned",String(i.earnedCount)),e.scope&&n.setAttribute("data-stage-medal-scope",e.scope),n.style.cssText=`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${a.gap};
  `,e.label){const m=document.createElement("div");m.textContent=e.label,m.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${a.label};
      font-weight: 700;
      color: rgba(255, 255, 255, 0.84);
      letter-spacing: 0.06em;
    `,n.appendChild(m)}const o=document.createElement("div");o.style.cssText=`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${a.gap};
  `;for(const m of i.slots){const f=document.createElement("span");f.setAttribute("data-stage-medal-slot",m.tier),f.setAttribute("data-stage-medal-threshold",String(m.threshold)),f.setAttribute("data-stage-medal-reached",String(m.reached)),f.textContent=m.icon,f.style.cssText=`
      font-size: ${a.medal};
      line-height: 1;
      filter: ${m.reached?"drop-shadow(0 0 10px rgba(255, 215, 0, 0.45))":"none"};
      opacity: ${m.reached?"1":"0.3"};
      transform: ${m.reached?"scale(1)":"scale(0.92)"};
    `,o.appendChild(f)}n.appendChild(o);const c=e.hint??(i.nextThreshold===null?"かんぺき！":`つぎ ⭐ ${i.nextThreshold}`),u=document.createElement("div");return u.setAttribute("data-stage-medal-hint",""),u.textContent=c,u.style.cssText=`
    font-family: 'Zen Maru Gothic', sans-serif;
    font-size: ${a.hint};
    font-weight: 700;
    color: ${i.nextThreshold===null?"#FFE66D":"rgba(255, 255, 255, 0.86)"};
  `,n.appendChild(u),n}const Jt=2e3,bt=new Map,vt=new Map,St=new Map;let ut=null,dt=null;function et(l,t){if(typeof document>"u"){const i=typeof OffscreenCanvas=="function",s=i?new OffscreenCanvas(l,t):{width:l,height:t};return{canvas:s,ctx:i?s.getContext("2d"):null}}const e=document.createElement("canvas");return e.width=l,e.height=t,{canvas:e,ctx:e.getContext("2d")}}function tt(l,t){let e=bt.get(l);return e||(e=t(),e.generateMipmaps=!1,e.minFilter=mi,e.needsUpdate=!0,bt.set(l,e)),e}function O(l,t){let e=vt.get(l);return e||(e=t(),vt.set(l,e)),e}function L(l,t){let e=St.get(l);return e||(e=t(),St.set(l,e)),e}function B(l,t){const e=new di(l,t);return e.userData.sharedAssets=!0,e}function he(){if(!ut){const l=new Gt,t=new Float32Array(Jt*3);for(let e=0;e<Jt*3;e+=3)t[e]=(Math.random()-.5)*200,t[e+1]=(Math.random()-.5)*200,t[e+2]=(Math.random()-.5)*400;l.setAttribute("position",new Ft(t,3)),ut=l}dt||(dt=new zt({color:16777215,size:.2,sizeAttenuation:!0}))}function xi(){const{canvas:l,ctx:t}=et(256,256);if(!t)return new N(l);t.fillStyle="#888888",t.fillRect(0,0,256,256);for(let e=0;e<30;e++){const i=Math.random()*256,s=Math.random()*256,a=3+Math.random()*12;t.beginPath(),t.arc(i,s,a,0,Math.PI*2),t.fillStyle=`rgba(60,60,60,${.3+Math.random()*.4})`,t.fill()}return new N(l)}function Ci(){const{canvas:l,ctx:t}=et(256,256);if(!t)return new N(l);t.fillStyle="#ddaa44",t.fillRect(0,0,256,256);for(let e=0;e<8;e++){t.beginPath();const i=128+(Math.random()-.5)*100,s=128+(Math.random()-.5)*100;t.strokeStyle=`rgba(200,150,60,${.3+Math.random()*.3})`,t.lineWidth=3+Math.random()*5;for(let a=0;a<Math.PI*4;a+=.1){const n=10+a*8;t.lineTo(i+Math.cos(a)*n,s+Math.sin(a)*n)}t.stroke()}return new N(l)}function wi(){const{canvas:l,ctx:t}=et(256,256);if(!t)return new N(l);const e=["#cc7733","#dd9955","#bb6622","#eebb77","#aa5511","#ddaa66"];for(let i=0;i<256;i++){const s=Math.floor(i/(256/e.length))%e.length;t.fillStyle=e[s],t.fillRect(0,i,256,1)}return new N(l)}function Ti(){const{canvas:l,ctx:t}=et(512,256);return t?(t.fillStyle="#2266aa",t.fillRect(0,0,512,256),t.fillStyle="#886644",t.beginPath(),t.ellipse(300,80,80,40,.2,0,Math.PI*2),t.fill(),t.beginPath(),t.ellipse(280,150,30,50,.1,0,Math.PI*2),t.fill(),t.beginPath(),t.ellipse(100,90,25,60,.3,0,Math.PI*2),t.fill(),t.beginPath(),t.ellipse(110,170,20,40,-.2,0,Math.PI*2),t.fill(),t.beginPath(),t.ellipse(420,170,25,15,0,0,Math.PI*2),t.fill(),t.fillStyle="#447733",t.beginPath(),t.ellipse(290,75,40,20,.3,0,Math.PI*2),t.fill(),t.beginPath(),t.ellipse(95,85,15,30,.2,0,Math.PI*2),t.fill(),new N(l)):new N(l)}function Ai(){const{canvas:l,ctx:t}=et(512,256);if(!t)return new N(l);t.clearRect(0,0,512,256),t.fillStyle="rgba(255,255,255,0.6)";for(let e=0;e<20;e++){const i=Math.random()*512,s=Math.random()*256;t.beginPath(),t.ellipse(i,s,20+Math.random()*40,8+Math.random()*15,Math.random()*Math.PI,0,Math.PI*2),t.fill()}return new N(l)}function Mi(){const{canvas:l,ctx:t}=et(256,128);if(!t)return new N(l);t.fillStyle="#d7dde8",t.fillRect(0,0,256,128),t.fillStyle="#8bbcff",t.fillRect(0,0,256,28),t.fillStyle="#90a4bf";for(let e=0;e<256;e+=24)t.fillRect(e,40,4,88);t.fillStyle="#4a6c9a";for(let e=44;e<128;e+=16)t.fillRect(0,e,256,6);return new N(l)}function Pi(){bt.clear(),vt.clear(),St.clear(),ut=null,dt=null}const ki={planetTextureCache:bt,planetGeometryCache:vt,planetMaterialCache:St,getBgStarsGeometry:()=>ut,getBgStarsMaterial:()=>dt};function ue(l,t,e){const i=new at;let s=null;switch(l){case 2:{const a=tt("mercury",xi),n=O("mercury:sphere",()=>new _(10,24,24)),o=L("mercury:mat",()=>new D({map:a})),c=B(n,o);i.add(c),s=c;break}case 3:{const a=tt("venus",Ci),n=O("venus:sphere",()=>new _(14,24,24)),o=L("venus:mat",()=>new D({map:a})),c=B(n,o);i.add(c),s=c;break}case 5:{const a=tt("jupiter",wi),n=O("jupiter:sphere",()=>new _(20,24,24)),o=L("jupiter:mat",()=>new D({map:a})),c=B(n,o);i.add(c),s=c;break}case 6:{const a=O("saturn:sphere",()=>new _(15,24,24)),n=t.planetColor,o=L(`saturn:mat:${n}`,()=>new D({color:n})),c=B(a,o);i.add(c);const u=O("saturn:ring",()=>new Yt(20,30,48)),m=L("saturn:ringMat",()=>new D({color:15645542,side:Wt})),f=B(u,m);f.rotation.x=Math.PI/3,i.add(f),s=c;break}case 7:{const a=O("uranus:sphere",()=>new _(16,24,24)),n=L("uranus:mat",()=>new D({color:6737117})),o=B(a,n);i.add(o);const c=O("uranus:ring",()=>new Yt(21,28,48)),u=L("uranus:ringMat",()=>new D({color:10083822,side:Wt})),m=B(c,u);m.rotation.z=Math.PI/2,i.add(m),s=o;break}case 9:{const a=O("pluto:sphere",()=>new _(8,24,24)),n=L("pluto:mat",()=>new D({color:12298922})),o=B(a,n);i.add(o),s=o;break}case 10:{const a=O("sun:sphere",()=>new _(25,24,24)),n=L("sun:mat",()=>new D({color:16763904,emissive:16755200,emissiveIntensity:.5})),o=B(a,n);i.add(o),i.add(new ui(16763904,2,200)),s=o;break}case 11:{const a=tt("station:panel",Mi),n=O("station:core",()=>new Ut(3.2,3.2,12,12)),o=O("station:module",()=>new Ut(1.7,1.7,6,10)),c=O("station:truss",()=>new jt(18,.9,.9)),u=O("station:panelGeo",()=>new jt(8,3.6,.18)),m=O("station:dish",()=>new _(1.4,12,12,0,Math.PI)),f=L("station:metal",()=>new D({color:14213354})),b=L("station:moduleMat",()=>new D({color:11057099})),g=L("station:panelMat",()=>new D({map:a,color:16777215})),r=new at,d=B(n,f);d.rotation.z=Math.PI/2,r.add(d);const S=B(c,b);r.add(S);const x=B(o,b);x.position.x=-6,x.rotation.z=Math.PI/2,r.add(x);const T=B(o,b);T.position.x=6,T.rotation.z=Math.PI/2,r.add(T);const y=B(u,g);y.position.set(-11,0,0),r.add(y);const p=B(u,g);p.position.set(11,0,0),r.add(p);const M=B(m,f);M.position.set(0,3.2,0),M.rotation.x=-Math.PI/2,r.add(M),i.add(r),s=r;break}case 12:{const a=tt("earth",Ti),n=O("earth:sphere",()=>new _(15,32,32)),o=L("earth:mat",()=>new D({map:a})),c=tt("earth:cloud",Ai),u=O("earth:cloudSphere",()=>new _(15.5,32,32)),m=L("earth:cloudMat",()=>new D({map:c,transparent:!0,opacity:.3})),f=new at;f.add(B(n,o)),f.add(B(u,m)),i.add(f),s=f;break}default:{const a=O("default:sphere",()=>new _(15,24,24)),n=t.planetColor,o=L(`default:mat:${n}`,()=>new D({color:n})),c=B(a,o);i.add(c),s=c;break}}return i.position.set(0,0,e),{planet:i,spinTarget:s}}function de(l,t,e){return ue(l,t,e)}function me(l){he();const t=new Lt(ut,dt);return t.userData.sharedAssets=!0,t.geometry.setDrawRange(0,l),t}function _t(l){!Number.isInteger(l)||l<1||l>z||typeof document>"u"&&typeof OffscreenCanvas!="function"||(he(),ue(l,Q(l),0))}let nt=null,ot=null;function Bi(){if(!nt){const l=new Gt,t=new Float32Array(3e3);for(let e=0;e<3e3;e++)t[e]=(Math.random()-.5)*200;l.setAttribute("position",new Ft(t,3)),nt=l}return nt}function Ri(){return ot||(ot=new zt({color:16777215,size:.3,sizeAttenuation:!0})),ot}function Oi(){nt=null,ot=null}const Ii={getBgStarsGeometry:()=>nt,getBgStarsMaterial:()=>ot};function Di(l){const t=window.requestIdleCallback;if(typeof t=="function"){t(l,{timeout:1500});return}window.setTimeout(l,800)}function pe(l){return new Set(l.filter(t=>Number.isInteger(t)&&t>=1&&t<=z)).size}function Li(l){return pe(l)>=z}function Mt(l){const t=Li(l.unlockedPlanets),e=t?1:Math.min(l.clearedStage+1,z),i=Q(e),s=l.bestStageStars?.[e]??0,a=l.colorAccessibility?.colorVisionSupportMode??j,n=ae(e,i.destinationReading,a);return t?{startStage:e,destination:n,emoji:i.emoji,statusLabel:"ぜんぶ あつめたよ！",destinationLabel:`${n}へ もういちど しゅっぱつ！`,buttonHint:`${i.emoji} ステージ ${e} から もういちど あそぶ`,bestStars:s}:{startStage:e,destination:n,emoji:i.emoji,statusLabel:l.clearedStage>0?"つづきから しゅっぱつ！":"はじめての しゅっぱつ！",destinationLabel:`${n}へ むかおう！`,buttonHint:`${i.emoji} ステージ ${e} から スタート`,bestStars:s}}function Gi(l){return l.clearedStage>0||pe(l.unlockedPlanets)>0||Object.keys(l.bestStageStars??{}).length>0}class Fi{threeScene;ambientLight=new Et(16777215,1);camera;lastAspect=0;sceneManager;saveManager;audioManager;stars=null;companionParade=null;overlay=null;muteHandle=null;tutorialOverlay=new Ht;titleResetConfirmOverlay=new gi;colorAccessibilitySettings=new fi;spaceshipCustomizer=new yi;statsOverlay=new Si;encyclopediaOverlay=null;encyclopediaOverlayPromise=null;companionFactory=null;companionFactoryPromise=null;loadEncyclopediaOverlay;loadTitleCompanionFactory;loadingOverlay;loadFailureOverlay;scheduleIdleTask;encyclopediaBtn=null;isOpeningEncyclopedia=!1;isActive=!1;touchFeedbackOverlay=new K;encyclopediaRequestToken=0;companionParadeRequestToken=0;bgmPending=!1;overlayButtonCleanups=new Set;colorSettingsButton=null;unsubscribeLanguageChange=null;constructor(t,e,i,s={}){this.sceneManager=t,this.saveManager=e,this.audioManager=i,this.loadingOverlay=s.loadingOverlay??new ye,this.loadFailureOverlay=s.loadFailureOverlay??new be,this.scheduleIdleTask=s.scheduleIdleTask??Di,this.loadEncyclopediaOverlay=s.loadEncyclopediaOverlay??(()=>Bt(()=>import("./EncyclopediaOverlay-C94utvHg.js"),__vite__mapDeps([0,1,2]))),this.loadTitleCompanionFactory=s.loadTitleCompanionFactory??(()=>Bt(()=>import("./game-core-f8ZFdM4I.js").then(o=>o.au),__vite__mapDeps([1,2]))),this.threeScene=new ct,this.threeScene.background=new ht(32);const{width:a,height:n}=H();this.camera=new xt(60,a/n,.1,1e3),this.camera.position.set(0,0,5)}enter(t){this.isActive=!0,this.encyclopediaRequestToken+=1,this.companionParadeRequestToken+=1,this.lastAspect=0,this.stars=new Lt(Bi(),Ri()),this.stars.userData.sharedAssets=!0,this.stars.rotation.set(0,0,0),this.threeScene.add(this.stars),this.ambientLight.parent||this.threeScene.add(this.ambientLight);const e=this.saveManager.load();A.setLanguage(e.language??pt,{notify:!1}),Rt(e.colorAccessibility?.colorVisionSupportMode??j),this.createCompanionParade(e.unlockedPlanets),this.createOverlay(),this.createMuteButton(),this.touchFeedbackOverlay.setMotionSensitivity(e.colorAccessibility?.motionSensitivity??X()),this.touchFeedbackOverlay.attach(),this.touchFeedbackOverlay.bindUiRoots([document.getElementById("hud"),document.getElementById("ui-overlay")]),this.prefetchEncyclopediaOnIdle(),this.prewarmNextAdventureOnIdle(Mt(e).startStage),this.audioManager.isInitialized()?(this.audioManager.playBGM(0),this.bgmPending=!1):this.bgmPending=!0,e.tutorialShown||this.tutorialOverlay.show(()=>{this.ensureTitleAudioInitialized(!0),this.tutorialOverlay.hide(),this.saveManager.markTutorialShown()})}createMuteButton(){const t=document.getElementById("hud")??document.getElementById("ui-overlay");t&&(this.muteHandle=Nt({initialMuted:this.audioManager.isMuted(),container:t,onToggle:()=>{this.ensureTitleAudioInitialized(!0);const e=this.audioManager.toggleMute();this.muteHandle?.setMuted(e);const i=this.saveManager.load();i.muted=e,this.saveManager.save(i)}}))}getEncyclopediaOverlay(){return this.encyclopediaOverlay?Promise.resolve(this.encyclopediaOverlay):this.encyclopediaOverlayPromise?this.encyclopediaOverlayPromise:(this.encyclopediaOverlayPromise=this.loadEncyclopediaOverlay().then(({EncyclopediaOverlay:t})=>{const e=new t;return this.encyclopediaOverlay=e,e}).finally(()=>{this.encyclopediaOverlayPromise=null}),this.encyclopediaOverlayPromise)}getTitleCompanionFactory(){return this.companionFactory?Promise.resolve(this.companionFactory):this.companionFactoryPromise?this.companionFactoryPromise:(this.companionFactoryPromise=this.loadTitleCompanionFactory().then(t=>(this.companionFactory=t,t)).finally(()=>{this.companionFactoryPromise=null}),this.companionFactoryPromise)}showEncyclopedia(){if(!this.isActive||!this.encyclopediaOverlay)return;const t=this.saveManager.load();this.encyclopediaOverlay.show(t.unlockedPlanets,()=>this.refreshEncyclopediaButtonLabel(),e=>{this.ensureTitleAudioInitialized(!1),this.sceneManager.requestTransition("stage",{stageNumber:e,totalScore:0,totalStarCount:0,launchSource:"encyclopedia"})},t.bestStageStars??{},t.discoveredConstellations??[],t.colorAccessibility?.colorVisionSupportMode??j,t.discoveredMonthlyEncounters??[],t.discoveredSpaceGems??[])}isCurrentEncyclopediaRequest(t){return this.isActive&&this.encyclopediaRequestToken===t}prefetchEncyclopediaOnIdle(){const t=this.encyclopediaRequestToken;this.scheduleIdleTask(()=>{!this.isCurrentEncyclopediaRequest(t)||this.encyclopediaOverlay||this.encyclopediaOverlayPromise||this.getEncyclopediaOverlay().catch(()=>{})})}prewarmNextAdventureOnIdle(t){if(t>z)return;const e=this.encyclopediaRequestToken;this.scheduleIdleTask(()=>{this.isCurrentEncyclopediaRequest(e)&&_t(t)})}async openEncyclopedia(){if(!this.isActive)return;if(this.loadFailureOverlay.hide(),this.encyclopediaOverlay){this.showEncyclopedia();return}if(this.isOpeningEncyclopedia)return;const t=this.encyclopediaRequestToken;this.isOpeningEncyclopedia=!0,this.loadingOverlay.show("ずかんを よんでるよ...");try{if(await this.getEncyclopediaOverlay(),!this.isCurrentEncyclopediaRequest(t))return;this.loadingOverlay.hide(),this.showEncyclopedia()}catch(e){if(!this.isCurrentEncyclopediaRequest(t))return;this.loadingOverlay.hide(),console.error("Failed to load encyclopedia overlay",e),this.loadFailureOverlay.show({title:"ずかんを もういちど よんでみよう！",message:"「もういちど よむ」を おして つづきを たのしもう！",primaryAction:{label:"もういちど よむ",onSelect:()=>this.openEncyclopedia()}})}finally{this.encyclopediaRequestToken===t&&(this.isOpeningEncyclopedia=!1)}}persistHighContrastSetting(t){const e=this.saveManager.load(),i=e.colorAccessibility?.motionSensitivity??X(),s=e.colorAccessibility?.colorVisionSupportMode??j;e.colorAccessibility=this.buildColorAccessibilitySettings(t,i,s),e.colorAccessibility||delete e.colorAccessibility,this.saveManager.save(e)}persistVisualFeedbackIntensitySetting(t){const e=this.saveManager.load();e.visualFeedbackSettings={intensity:t},this.saveManager.save(e),se(t)}persistRestReminderSetting(t){const e=this.saveManager.load();e.restReminderSettings={enabled:t},this.saveManager.save(e)}persistLanguageSetting(t){const e=this.saveManager.load();t===pt?delete e.language:e.language=t,this.saveManager.save(e)}persistBGMVolumeSetting(t){const e=this.saveManager.load();e.audioSettings=this.buildAudioSettings(t,e.audioSettings?.sfxVolume??100),e.audioSettings||delete e.audioSettings,this.saveManager.save(e),this.audioManager.setBGMVolume(t)}persistSFXVolumeSetting(t){const e=this.saveManager.load();e.audioSettings=this.buildAudioSettings(e.audioSettings?.bgmVolume??100,t),e.audioSettings||delete e.audioSettings,this.saveManager.save(e),this.audioManager.setSFXVolume(t)}persistMotionSensitivitySetting(t){const e=this.saveManager.load(),i=e.colorAccessibility?.highContrast===!0,s=e.colorAccessibility?.colorVisionSupportMode??j;e.colorAccessibility=this.buildColorAccessibilitySettings(i,t,s),e.colorAccessibility||delete e.colorAccessibility,this.saveManager.save(e)}persistColorVisionSupportModeSetting(t){const e=this.saveManager.load(),i=e.colorAccessibility?.highContrast===!0,s=e.colorAccessibility?.motionSensitivity??X();e.colorAccessibility=this.buildColorAccessibilitySettings(i,s,t),e.colorAccessibility||delete e.colorAccessibility,this.saveManager.save(e),Rt(t)}buildColorAccessibilitySettings(t,e,i){const s=X();if(!(!t&&e===s&&i===j))return{...t?{highContrast:!0}:{},...e!==s?{motionSensitivity:e}:{},...i!==j?{colorVisionSupportMode:i}:{}}}buildAudioSettings(t,e){if(!(t===100&&e===100))return{...t!==100?{bgmVolume:t}:{},...e!==100?{sfxVolume:e}:{}}}createOverlay(){const t=document.getElementById("ui-overlay");if(!t)return;const e=this.saveManager.load(),i=Mt(e),s=Gi(e);this.overlay=document.createElement("div"),this.unsubscribeLanguageChange?.(),this.unsubscribeLanguageChange=A.subscribe(()=>this.applyLocalizedText()),this.overlay.style.cssText=`
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
    `;const o=document.createElement("div");o.setAttribute("data-next-adventure-card",""),o.setAttribute("data-next-stage-number",String(i.startStage)),o.setAttribute("data-next-stage-destination",i.destination),o.style.cssText=`
      width: min(${a?"64vw":"70vw"}, ${a?"20rem":"26rem"});
      padding: ${a?"0.5rem 0.8rem":"0.8rem 1.2rem"};
      margin-bottom: ${a?"0.45rem":"0.85rem"};
      border-radius: ${a?"1rem":"1.5rem"};
      background: rgba(255, 255, 255, 0.14);
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.22);
      backdrop-filter: blur(6px);
      text-align: center;
      color: #fff;
    `;const c=document.createElement("div");c.textContent="つぎの ぼうけん",c.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${a?"0.8rem":"1rem"};
      font-weight: 700;
      color: #FFE66D;
      margin-bottom: ${a?"0.15rem":"0.35rem"};
    `;const u=document.createElement("div");u.textContent=i.statusLabel,u.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${a?"1rem":"1.25rem"};
      font-weight: 900;
      margin-bottom: ${a?"0.15rem":"0.35rem"};
    `;const m=document.createElement("div");m.textContent=`${i.emoji} ステージ ${i.startStage} ・ ${i.destination}`,m.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${a?"1.05rem":"1.35rem"};
      font-weight: 700;
      margin-bottom: 0.25rem;
    `;const f=document.createElement("div");f.textContent=i.destinationLabel,f.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${a?"0.85rem":"1rem"};
      font-weight: 700;
      color: rgba(255, 255, 255, 0.92);
    `;const b=ie(i.startStage,i.bestStars),g=Ot(i.startStage,i.bestStars,{label:"メダル",hint:b.nextThreshold===null?"かんぺき！":`${b.icon} いま ・ つぎ ⭐ ${b.nextThreshold}`,size:"regular",scope:"title-next-adventure"});g.style.marginTop=a?"0.35rem":"0.55rem",o.appendChild(c),o.appendChild(u),o.appendChild(m),o.appendChild(f),o.appendChild(g);const r=document.createElement("div");r.style.cssText=`
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: ${a?"0.42rem":"0.55rem"};
      width: min(94vw, ${s?"44rem":"34rem"});
    `;const d=document.createElement("button");d.textContent="あそぶ",d.style.cssText=`
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
    `,this.overlayButtonCleanups.add(I(d,{onActivate:()=>{this.ensureTitleAudioInitialized(!1);const h=this.saveManager.load(),E=Mt(h).startStage;this.sceneManager.requestTransition("stage",{stageNumber:E,totalScore:0,totalStarCount:0,launchSource:"campaign"})},onPressChange:h=>{d.style.transform=h?"scale(0.96)":"scale(1)"}}));const S=document.createElement("div");S.setAttribute("data-play-button-hint",""),S.textContent=i.buttonHint,S.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${a?"0.85rem":"1rem"};
      font-weight: 700;
      color: rgba(255, 255, 255, 0.88);
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
    `;const x=document.createElement("button");x.textContent="うちゅうで あそぶ",x.setAttribute("data-free-play-button",""),x.style.cssText=`
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
    `,this.overlayButtonCleanups.add(I(x,{onActivate:()=>{this.ensureTitleAudioInitialized(!1),this.sceneManager.requestTransition("freePlay",{})},onPressChange:h=>{x.style.transform=h?"scale(0.96)":"scale(1)"}}));const T=document.createElement("div");T.setAttribute("data-title-secondary-actions",""),T.style.cssText=`
      display: grid;
      grid-template-columns: repeat(${s?3:2}, minmax(0, 1fr));
      gap: ${a?"0.45rem":"0.55rem"};
      width: 100%;
      align-items: stretch;
    `;const y=document.createElement("button");y.setAttribute("data-spaceship-customizer-button",""),y.textContent="うちゅうせんをかざろう",y.style.cssText=`
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
    `,this.overlayButtonCleanups.add(I(y,{onActivate:()=>{const h=this.saveManager.load();this.spaceshipCustomizer.show({initialCustomization:h.spaceshipCustomization??It,onComplete:E=>{const P=this.saveManager.load();P.spaceshipCustomization=E,this.saveManager.save(P)}})},onPressChange:h=>{y.style.transform=h?"scale(0.96)":"scale(1)"}}));const p=document.createElement("button");p.setAttribute("data-stats-button",""),p.textContent="あそびの きろく",p.style.cssText=`
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
    `,this.overlayButtonCleanups.add(I(p,{onActivate:()=>{this.ensureTitleAudioInitialized(!0),this.statsOverlay.show(this.saveManager.load().gameplayStats,()=>{})},onPressChange:h=>{p.style.transform=h?"scale(0.96)":"scale(1)"}}));const M=document.createElement("div");M.setAttribute("data-title-footer-actions",""),M.style.cssText=`
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: ${a?"0.45rem":"0.65rem"};
      width: min(94vw, 42rem);
      margin-top: ${a?"0.5rem":"0.8rem"};
      align-items: stretch;
    `;const k=document.createElement("button");k.textContent="あそびかた",k.style.cssText=`
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
    `,this.overlayButtonCleanups.add(I(k,{onActivate:()=>{this.ensureTitleAudioInitialized(!0),this.tutorialOverlay.show(()=>{this.ensureTitleAudioInitialized(!0),this.tutorialOverlay.hide()})},onPressChange:h=>{k.style.transform=h?"scale(0.96)":"scale(1)"}}));const C=document.createElement("button");C.setAttribute("data-color-settings-button",""),C.textContent=A.t("titleScene.colorSettingsButton"),this.colorSettingsButton=C,C.style.cssText=`
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
    `,this.overlayButtonCleanups.add(I(C,{onActivate:()=>{this.ensureTitleAudioInitialized(!0),this.colorAccessibilitySettings.show({initialHighContrast:this.saveManager.load().colorAccessibility?.highContrast===!0,initialColorVisionSupportMode:this.saveManager.load().colorAccessibility?.colorVisionSupportMode??j,initialBGMVolume:this.saveManager.load().audioSettings?.bgmVolume??100,initialSFXVolume:this.saveManager.load().audioSettings?.sfxVolume??100,initialVisualEffectIntensity:this.saveManager.load().visualFeedbackSettings?.intensity??"medium",initialMotionSensitivity:this.saveManager.load().colorAccessibility?.motionSensitivity??X(),initialRestReminderEnabled:this.saveManager.load().restReminderSettings?.enabled??ve,initialLanguage:this.saveManager.load().language??pt,onToggle:h=>this.persistHighContrastSetting(h),onColorVisionSupportModeChange:h=>this.persistColorVisionSupportModeSetting(h),onBGMVolumeChange:h=>this.persistBGMVolumeSetting(h),onSFXVolumeChange:h=>this.persistSFXVolumeSetting(h),onVisualEffectIntensityChange:h=>this.persistVisualFeedbackIntensitySetting(h),onMotionSensitivityChange:h=>this.persistMotionSensitivitySetting(h),onRestReminderToggle:h=>this.persistRestReminderSetting(h),onLanguageChange:h=>this.persistLanguageSetting(h)})},onPressChange:h=>{C.style.transform=h?"scale(0.96)":"scale(1)"}}));const w=document.createElement("button");if(w.textContent=Qt(e.unlockedPlanets.length,st.length),w.style.cssText=`
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
    `,this.encyclopediaBtn=w,this.overlayButtonCleanups.add(I(w,{onActivate:()=>{this.ensureTitleAudioInitialized(!0),this.openEncyclopedia()},onPressChange:h=>{w.style.transform=h?"scale(0.96)":"scale(1)"}})),r.appendChild(d),r.appendChild(x),r.appendChild(S),T.appendChild(y),T.appendChild(p),s){const h=document.createElement("button");h.setAttribute("data-reset-progress-button",""),h.textContent="さいしょから",h.style.cssText=`
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
      `,h.addEventListener("pointerdown",E=>{E.stopPropagation(),this.ensureTitleAudioInitialized(!0),this.titleResetConfirmOverlay.show(()=>{this.saveManager.resetProgressPreservingSettings(),this.startCampaign(1)},()=>{})}),T.appendChild(h)}r.appendChild(T),M.append(w,C,k),this.overlay.appendChild(n),this.overlay.appendChild(o),this.overlay.appendChild(r),this.overlay.appendChild(M),t.appendChild(this.overlay),this.overlay.addEventListener("pointerdown",()=>{this.ensureTitleAudioInitialized(!0)},{once:!0})}applyLocalizedText(){this.colorSettingsButton&&(this.colorSettingsButton.textContent=A.t("titleScene.colorSettingsButton"))}ensureTitleAudioInitialized(t){!this.bgmPending&&this.audioManager.isInitialized()||(this.audioManager.initSync(),t&&this.bgmPending&&this.audioManager.playBGM(0),this.bgmPending=!1)}startCampaign(t){this.sceneManager.requestTransition("stage",{stageNumber:t,totalScore:0,totalStarCount:0,launchSource:"campaign"})}refreshEncyclopediaButtonLabel(){if(!this.encyclopediaBtn)return;const t=this.saveManager.load();this.encyclopediaBtn.textContent=Qt(t.unlockedPlanets.length,st.length)}async createCompanionParade(t){this.clearCompanionParade();const e=[...new Set(t)].reduce((c,u)=>{const m=gt(u);return m&&c.push(m),c},[]);if(e.length===0)return;const i=this.encyclopediaRequestToken,{createCompanionMesh:s}=await this.getTitleCompanionFactory();if(!this.isActive||this.encyclopediaRequestToken!==i)return;const a=new at;a.name="title-companion-parade",a.position.set(0,1.35,-1.2),a.rotation.x=-.12;const n=Math.min(2.1,1.1+e.length*.18),o=Math.min(.45,.18+e.length*.02);e.forEach((c,u)=>{const m=s(c),f=u/e.length*Math.PI*2;m.position.set(Math.cos(f)*n,Math.sin(f)*o,Math.sin(f)*n*.45),m.rotation.y=Math.PI*.15-f,m.scale.setScalar(.6),a.add(m)}),this.companionParade=a,this.threeScene.add(a)}clearCompanionParade(){this.companionParade&&(this.companionParade.parent?.remove(this.companionParade),this.companionParade=null)}update(t){this.stars&&(this.stars.rotation.y+=t*.05),this.companionParade&&(this.companionParade.rotation.y+=t*.35)}exit(){this.isActive=!1,this.encyclopediaRequestToken+=1,this.companionParadeRequestToken+=1,this.isOpeningEncyclopedia=!1,this.tutorialOverlay.hide(),this.titleResetConfirmOverlay.hide(),this.colorAccessibilitySettings.hide(),this.spaceshipCustomizer.hide(),this.statsOverlay.hide(),this.encyclopediaOverlay?.hide(),this.loadingOverlay.hide(),this.loadFailureOverlay.hide(),this.audioManager.stopBGM(),this.bgmPending=!1,this.touchFeedbackOverlay.hide(),this.clearCompanionParade(),this.stars&&(this.stars.parent?.remove(this.stars),this.stars=null),this.clearCompanionParade();const t=Array.from(this.overlayButtonCleanups);this.overlayButtonCleanups.clear();for(const e of t)e();this.overlay&&(this.overlay.remove(),this.overlay=null),this.encyclopediaBtn=null,this.colorSettingsButton=null,this.unsubscribeLanguageChange?.(),this.unsubscribeLanguageChange=null,this.muteHandle&&(this.muteHandle.remove(),this.muteHandle=null)}getThreeScene(){return this.threeScene}getCamera(){const{width:t,height:e}=H(),i=t/e;return i!==this.lastAspect&&Number.isFinite(i)&&i>0&&(this.camera.aspect=i,this.camera.updateProjectionMatrix(),this.lastAspect=i),this.camera}}const rs=Object.freeze(Object.defineProperty({__proto__:null,TitleScene:Fi,__resetTitleSceneSharedAssetsForTest:Oi,__titleSceneSharedAssetsForTest:Ii},Symbol.toStringTag,{value:"Module"}));class zi{overlayEl=null;activePressCleanups=new Set;show(t,e){if(this.overlayEl)return;const i=document.getElementById("ui-overlay");if(!i)return;this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-home-confirm-overlay",""),this.overlayEl.setAttribute("role","dialog"),this.overlayEl.setAttribute("aria-modal","true"),this.overlayEl.setAttribute("aria-label","ホームへ もどりますか"),this.overlayEl.style.cssText=`
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
    `,this.overlayEl.style.background="rgba(0, 0, 32, 0.92)";let s=!1;const a=()=>{s||(s=!0,this.hide(),e())},n=()=>{s||(s=!0,this.hide(),t())};this.overlayEl.addEventListener("pointerdown",r=>{r.target===this.overlayEl&&a()});const o=document.createElement("div");o.setAttribute("data-home-confirm-card",""),o.style.cssText=`
      display: flex;
      flex-direction: column;
      align-items: center;
      background: rgba(0, 0, 64, 0.85);
      border-radius: 1.6rem;
      padding: 1.6rem 1.4rem;
      max-width: min(90vw, 420px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45);
    `,o.addEventListener("pointerdown",r=>{r.stopPropagation()}),this.overlayEl.appendChild(o);const c=document.createElement("div");c.textContent="タイトルへ もどる？",c.style.cssText=`
      font-size: 1.8rem;
      font-weight: 900;
      text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
      margin-bottom: 1.2rem;
      text-align: center;
      padding: 0 0.6rem;
      white-space: nowrap;
    `,c.style.fontFamily="'Zen Maru Gothic', sans-serif",c.style.color="#FFD700",o.appendChild(c);const u=document.createElement("div");u.style.cssText=`
      display: flex;
      flex-direction: row;
      gap: 1rem;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
    `,o.appendChild(u);const m=`
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
    `,f=(r,d)=>{const S=I(r,{onActivate:d,onPressChange:x=>{r.style.transform=x?"scale(0.9)":"scale(1)"}});this.activePressCleanups.add(S)},b=document.createElement("button");b.setAttribute("data-home-confirm-back",""),b.setAttribute("aria-label","タイトルへ もどる"),b.textContent="🏠 タイトルへ もどる",b.style.cssText=m,b.style.fontFamily="'Zen Maru Gothic', sans-serif",b.style.background="rgba(255, 255, 255, 0.18)",b.style.color="#ffffff",b.style.minWidth="88px",b.style.minHeight="88px",b.style.touchAction="manipulation",b.style.transform="scale(1)",b.style.transition="transform 0.08s ease-out",b.style.whiteSpace="nowrap",f(b,n),u.appendChild(b);const g=document.createElement("button");g.setAttribute("data-home-confirm-continue",""),g.setAttribute("aria-label","つづける"),g.textContent="✋ つづける",g.style.cssText=m,g.style.fontFamily="'Zen Maru Gothic', sans-serif",g.style.background="linear-gradient(135deg, #FF6B6B, #FFE66D)",g.style.color="#FFD700",g.style.textShadow="0 1px 2px rgba(0, 0, 32, 0.6)",g.style.minWidth="88px",g.style.minHeight="88px",g.style.touchAction="manipulation",g.style.transform="scale(1)",g.style.transition="transform 0.08s ease-out",g.style.whiteSpace="nowrap",f(g,a),u.appendChild(g),i.appendChild(this.overlayEl)}hide(){if(this.overlayEl){const t=Array.from(this.activePressCleanups);this.activePressCleanups.clear();for(const e of t)e();this.overlayEl.remove(),this.overlayEl=null}}isVisible(){return this.overlayEl!==null}}class ge{overlayEl=null;activePressCleanups=new Set;show(t,e){if(this.overlayEl)return;const i=document.getElementById("ui-overlay")??document.body;this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-pause-overlay",""),this.overlayEl.setAttribute("role","dialog"),this.overlayEl.setAttribute("aria-modal","true"),this.overlayEl.setAttribute("aria-label","やすみちゅう"),this.overlayEl.style.cssText=`
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: auto;
      z-index: 60;
      background: rgba(0, 0, 32, 0.92);
    `;const s=document.createElement("div");s.setAttribute("data-pause-card",""),s.style.cssText=`
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
    `,s.addEventListener("pointerdown",u=>{u.stopPropagation()}),this.overlayEl.appendChild(s);const a=document.createElement("div");a.textContent="ひとやすみ ちゅう",a.style.cssText=`
      font-size: clamp(1.8rem, 5vmin, 2.4rem);
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
    `,s.appendChild(a);const n=document.createElement("div");n.textContent="また じゅんびが できたら つづけよう",n.style.cssText=`
      font-size: clamp(1rem, 3.5vmin, 1.2rem);
      font-weight: 700;
      color: #ffffff;
      opacity: 0.92;
    `,s.appendChild(n);const o=document.createElement("div");o.style.cssText=`
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      justify-content: center;
      align-items: stretch;
      width: 100%;
    `,s.appendChild(o);const c=(u,m,f,b,g,r)=>{const d=document.createElement("button");d.setAttribute(m,""),d.setAttribute("aria-label",f),d.textContent=u,d.style.cssText=`
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
      `,d.style.minWidth="140px",d.style.minHeight="88px";const S=I(d,{onActivate:()=>{this.hide(),r()},onPressChange:x=>{d.style.transform=x?"scale(0.94)":"scale(1)"}});return this.activePressCleanups.add(S),d};o.appendChild(c("▶ つづける","data-pause-continue","つづける","linear-gradient(135deg, #FF6B6B, #FFE66D)","#1b1f52",t)),o.appendChild(c("🏠 おうちへ","data-pause-home","おうちへ","rgba(255, 255, 255, 0.18)","#ffffff",e)),i.appendChild(this.overlayEl)}hide(){if(!this.overlayEl)return;const t=Array.from(this.activePressCleanups);this.activePressCleanups.clear();for(const e of t)e();this.overlayEl.remove(),this.overlayEl=null}dispose(){this.hide()}isVisible(){return this.overlayEl!==null}}function fe(l,t){if(t==="LOVELY")return{worldText:`💖 +${l}`,hudText:`+${l}`,kind:"lovely-star",color:"#ff8fd6",shadow:"rgba(255, 143, 214, 0.65)"};const e=l>=500;return{worldText:`${e?"🌈":"⬢"} +${l}`,hudText:`+${l}`,kind:e?"bonus":"normal",color:e?"#ff9cf7":"#ffe066",shadow:e?"rgba(255, 156, 247, 0.55)":"rgba(255, 214, 102, 0.55)"}}class q{static STYLE_ID="score-popup-animations";static POOL_SIZE=6;static POPUP_LIFETIME_MS=720;root=null;pool=[];highContrastMode=!1;nextRecycleIndex=0;scratch=new W;setHighContrastMode(t){this.highContrastMode=t}show(t,e,i,s){const a=fe(t,s);this.showPopup({text:a.worldText,kind:a.kind,color:a.color,shadow:a.shadow},e,i)}showLabel(t,e,i,s="normal"){const a=s==="shooting-star"||s==="special-star"||s==="monthly-encounter"||s==="space-gem"||s==="lovely-star"?{text:t,kind:s,color:s==="lovely-star"?"#ff8fd6":s==="space-gem"?"#dff8ff":"rgb(255, 244, 179)",shadow:s==="lovely-star"?"rgba(255, 143, 214, 0.65)":s==="space-gem"?"rgba(167, 244, 255, 0.78)":"rgba(191, 231, 255, 0.75)"}:{text:t,kind:s,color:"#ffe066",shadow:"rgba(255, 214, 102, 0.55)"};this.showPopup(a,e,i)}showPopup(t,e,i){const s=this.ensureRoot();if(!s||(this.scratch.set(e.x,e.y,e.z).project(i),!Number.isFinite(this.scratch.x)||!Number.isFinite(this.scratch.y)||!Number.isFinite(this.scratch.z)))return;const a=Math.round((this.scratch.x*.5+.5)*1e5)/1e3,n=Math.round((-this.scratch.y*.5+.5)*1e5)/1e3,o=this.acquireEntry(s),c=o.useAltAnimation?"scorePopupFloatB":"scorePopupFloatA";o.useAltAnimation=!o.useAltAnimation,o.currentAnimationName=c,o.el.textContent=t.text,o.el.style.left=`${a}%`,o.el.style.top=`${n}%`,o.el.style.color=t.color,o.el.style.textShadow=`0 2px 10px ${t.shadow}`,o.el.style.background=this.highContrastMode?t.kind==="bonus"||t.kind==="shooting-star"||t.kind==="special-star"||t.kind==="monthly-encounter"||t.kind==="space-gem"||t.kind==="lovely-star"?"rgba(13, 18, 38, 0.92)":"rgba(0, 0, 0, 0.82)":"transparent",o.el.style.border=this.highContrastMode?t.kind==="bonus"||t.kind==="shooting-star"||t.kind==="special-star"||t.kind==="monthly-encounter"||t.kind==="space-gem"||t.kind==="lovely-star"?"3px solid rgba(255, 255, 255, 0.95)":"2px dashed rgba(255, 255, 255, 0.95)":"none",o.el.style.borderRadius=this.highContrastMode?"999px":"0",o.el.style.padding=this.highContrastMode?"0.18rem 0.55rem":"0",o.el.style.setProperty("-webkit-text-stroke",this.highContrastMode?"0.6px #061126":"0"),o.el.setAttribute("data-score-popup-kind",t.kind),o.el.style.visibility="visible",o.el.style.opacity="1",o.el.style.animationName=c,o.el.removeAttribute("data-score-popup-active"),o.el.setAttribute("data-score-popup-active",""),o.active=!0;const u=()=>{this.releaseEntry(o)};o.onAnimationEnd=m=>{m.animationName===o.currentAnimationName&&u()},o.el.addEventListener("animationend",o.onAnimationEnd),o.timeoutId=window.setTimeout(u,q.POPUP_LIFETIME_MS)}dispose(){for(const t of this.pool)this.clearEntry(t),t.el.remove();this.pool=[],this.root?.remove(),this.root=null,this.nextRecycleIndex=0}ensureRoot(){const t=document.getElementById("ui-overlay");return t?(this.root&&(this.root.parentElement!==t||!this.root.isConnected)&&this.dispose(),this.root?this.root:(this.injectStyles(),this.root=document.createElement("div"),this.root.setAttribute("data-score-popup-root",""),this.root.style.position="absolute",this.root.style.inset="0",this.root.style.overflow="hidden",this.root.style.pointerEvents="none",this.root.style.contain="layout style paint",t.appendChild(this.root),this.root)):null}acquireEntry(t){if(this.pool.length<q.POOL_SIZE){const i=this.createEntry();return this.pool.push(i),t.appendChild(i.el),i}const e=this.pool.find(i=>!i.active)??this.pool[this.nextRecycleIndex++%this.pool.length];return this.clearEntry(e),e}createEntry(){const t=document.createElement("div");return t.setAttribute("data-score-popup",""),t.style.position="absolute",t.style.transform="translate3d(-50%, -50%, 0)",t.style.fontFamily="'Zen Maru Gothic', sans-serif",t.style.fontSize="clamp(1rem, 3.5vmin, 1.4rem)",t.style.fontWeight="900",t.style.lineHeight="1",t.style.whiteSpace="nowrap",t.style.pointerEvents="none",t.style.willChange="transform, opacity",t.style.visibility="hidden",t.style.opacity="0",t.style.animationDuration=`${q.POPUP_LIFETIME_MS}ms`,t.style.animationTimingFunction="ease-out",t.style.animationIterationCount="1",{el:t,active:!1,timeoutId:null,onAnimationEnd:null,useAltAnimation:!1,currentAnimationName:"none"}}releaseEntry(t){this.clearEntry(t),t.el.style.visibility="hidden",t.el.style.opacity="0"}clearEntry(t){t.active=!1,t.currentAnimationName="none",t.el.removeAttribute("data-score-popup-active"),t.el.removeAttribute("data-score-popup-kind"),t.el.style.animationName="none",t.timeoutId!==null&&(window.clearTimeout(t.timeoutId),t.timeoutId=null),t.onAnimationEnd&&(t.el.removeEventListener("animationend",t.onAnimationEnd),t.onAnimationEnd=null)}injectStyles(){if(document.getElementById(q.STYLE_ID))return;const t=document.createElement("style");t.id=q.STYLE_ID,t.textContent=`
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
    `,document.head.appendChild(t)}}class Hi{pendingTimeouts=new Set;container=null;stageNameEl=null;assistMessageEl=null;politeLiveRegionEl=null;assertiveLiveRegionEl=null;scoreEl=null;scoreGainEl=null;starCountEl=null;bestStarContainerEl=null;bestStarCountEl=null;boostButton=null;boostHintEl=null;homeButton=null;pauseButton=null;homeConfirmOverlay=new zi;pauseOverlay=new ge;muteButton=null;muteHandle=null;cooldownContainer=null;cooldownBar=null;stageProgressContainer=null;stageProgressTrack=null;stageProgressFill=null;stageProgressGoalEl=null;onBoostCallback=null;onBoostDeniedCallback=null;onHomeCallback=null;onHomeConfirmOpenCallback=null;onHomeConfirmCancelCallback=null;onPauseCallback=null;onPauseOpenCallback=null;onPauseResumeCallback=null;onMuteCallback=null;muted=!1;highContrastMode=!1;boostLocked=!1;pauseEnabled=!0;pauseButtonCleanup=null;lastCooldownProgress=1;lastCooldownPct=-1;lastReadyState=null;lastCooldownBarBoxShadow=null;lastBoostButtonAriaDisabled=null;lastBoostReadyRingVisible=null;boostButtonStyleCache={opacity:null,filter:null,animation:null,transform:null};lastPauseButtonAriaDisabled=null;pauseButtonStyleCache={opacity:null,filter:null,cursor:null,transform:null};lastStageProgressPct=-1;lastStageProgressComplete=null;lastScore=-1;lastStarCount=-1;displayedScore=0;scoreAnimationToken=0;scoreGainUseAltAnimation=!1;scoreGainAnimationEndHandler=null;bestStarCount=0;lastBestStarCount=-1;bestStarPulsed=!1;liveRegionWriteNonce=0;lastAnnouncedProgressThreshold=0;show(t,e){const i=document.getElementById("hud");if(!i)return;i.style.zIndex="10";const s=window.innerHeight<=500;this.homeButton=document.createElement("button"),this.homeButton.textContent="🏠",this.homeButton.setAttribute("aria-label","ホームへ もどる"),this.homeButton.style.position="absolute",this.homeButton.style.top="0.8rem",this.homeButton.style.left="1rem",this.homeButton.style.fontSize=s?"clamp(1.1rem, 3.5vmin, 1.4rem)":"clamp(1.4rem, 4vmin, 1.8rem)",this.homeButton.style.background="rgba(255, 255, 255, 0.15)",this.homeButton.style.border="none",this.homeButton.style.borderRadius="50%",this.homeButton.style.width=s?"2.4rem":"3rem",this.homeButton.style.height=s?"2.4rem":"3rem",this.homeButton.style.display="flex",this.homeButton.style.alignItems="center",this.homeButton.style.justifyContent="center",this.homeButton.style.cursor="pointer",this.homeButton.style.pointerEvents="auto",this.homeButton.style.touchAction="manipulation",this.homeButton.style.transform="scale(1)",this.homeButton.style.transition="transform 0.08s ease-out";const a=()=>{this.homeButton&&(this.homeButton.style.transform="scale(1)")};this.homeButton.addEventListener("pointerdown",c=>{c.stopPropagation(),this.homeButton&&(this.homeButton.style.transform="scale(0.9)"),!this.homeConfirmOverlay.isVisible()&&document.getElementById("ui-overlay")&&(this.onHomeConfirmOpenCallback?.(),this.homeConfirmOverlay.show(()=>this.onHomeCallback?.(),()=>this.onHomeConfirmCancelCallback?.()))}),this.homeButton.addEventListener("pointerup",a),this.homeButton.addEventListener("pointercancel",a),this.homeButton.addEventListener("pointerleave",a),i.appendChild(this.homeButton),t&&(this.stageNameEl=document.createElement("div"),this.stageNameEl.textContent=t,this.stageNameEl.style.cssText=`
        text-align: center;
        font-family: 'Zen Maru Gothic', sans-serif;
        color: #FFD700;
        font-size: ${s?"1.1rem":"1.5rem"};
        font-weight: 700;
        padding: ${s?"0.25rem":"0.5rem"};
        pointer-events: none;
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);
      `,i.appendChild(this.stageNameEl)),this.createPauseButton(),this.assistMessageEl=document.createElement("div"),this.assistMessageEl.setAttribute("data-hud-assist-message",""),this.assistMessageEl.setAttribute("aria-hidden","true"),this.assistMessageEl.style.cssText=`
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
    `,i.appendChild(this.assistMessageEl),this.createStageProgress(i,e),this.container=document.createElement("div"),this.container.style.cssText=`
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: ${s?"0.4rem 1rem":"1rem 2rem"};
      font-family: 'Zen Maru Gothic', sans-serif;
      color: #fff;
      font-size: ${s?"1.1rem":"1.4rem"};
      font-weight: 700;
      pointer-events: none;
    `;const n=document.createElement("div");n.style.position="relative",n.style.display="inline-flex",n.style.alignItems="baseline",n.style.gap="0.08rem",this.scoreEl=document.createElement("span"),this.scoreEl.setAttribute("data-hud-score-value",""),n.textContent="スコア: ",this.scoreEl.textContent="0",n.appendChild(this.scoreEl),this.scoreGainEl=document.createElement("div"),this.scoreGainEl.setAttribute("data-hud-score-gain",""),this.scoreGainEl.style.position="absolute",this.scoreGainEl.style.top="-0.95rem",this.scoreGainEl.style.right="-0.35rem",this.scoreGainEl.style.fontSize="0.68em",this.scoreGainEl.style.fontWeight="900",this.scoreGainEl.style.lineHeight="1",this.scoreGainEl.style.whiteSpace="nowrap",this.scoreGainEl.style.pointerEvents="none",this.scoreGainEl.style.visibility="hidden",this.scoreGainEl.style.opacity="0",this.scoreGainEl.style.willChange="transform, opacity",this.scoreGainEl.style.animationDuration="560ms",this.scoreGainEl.style.animationTimingFunction="ease-out",this.scoreGainEl.style.animationIterationCount="1",n.appendChild(this.scoreGainEl);const o=document.createElement("div");o.textContent="⭐ ",this.starCountEl=document.createElement("span"),this.starCountEl.textContent="0",o.appendChild(this.starCountEl),this.bestStarContainerEl=document.createElement("span"),this.bestStarContainerEl.setAttribute("data-hud-best-star",""),this.bestStarContainerEl.style.cssText=`
      margin-left: 0.6rem;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 0.6em;
      font-weight: 700;
      color: #9ec5ff;
      opacity: 0.7;
      display: none;
      vertical-align: middle;
      transform-origin: center;
    `,this.bestStarContainerEl.textContent="ベスト ⭐",this.bestStarCountEl=document.createElement("span"),this.bestStarCountEl.textContent="0",this.bestStarContainerEl.appendChild(this.bestStarCountEl),o.appendChild(this.bestStarContainerEl),this.container.appendChild(n),this.container.appendChild(o),i.appendChild(this.container),this.createBoostButton(),this.createMuteButton(),this.applyColorAccessibilityState(),this.createLiveRegions(i)}createStageProgress(t,e){const i=this.toCssColor(e??16766720),s=document.createElement("div");s.setAttribute("data-stage-progress-container",""),s.setAttribute("role","progressbar"),s.setAttribute("aria-label","ゴールまでの すすみ"),s.setAttribute("aria-valuemin","0"),s.setAttribute("aria-valuemax","100"),s.setAttribute("aria-valuenow","0"),s.setAttribute("aria-valuetext","ゴールまで あと 100%"),s.style.position="relative",s.style.display="flex",s.style.alignItems="center",s.style.justifyContent="center",s.style.gap="0.4rem",s.style.margin="0 auto 0.4rem",s.style.width=window.innerHeight<=500?"clamp(100px, 24vmin, 180px)":"clamp(160px, 32vmin, 280px)",s.style.pointerEvents="none",s.style.fontFamily="'Zen Maru Gothic', sans-serif";const a=document.createElement("div");a.setAttribute("data-stage-progress-ship",""),a.textContent="🚀",a.style.fontSize="clamp(0.9rem, 2.4vmin, 1.1rem)",a.style.lineHeight="1",a.style.pointerEvents="none";const n=document.createElement("div");n.setAttribute("data-stage-progress-track",""),n.style.flex="1",n.style.height="14px",n.style.background=this.highContrastMode?"rgba(6, 12, 28, 0.94)":"rgba(255, 255, 255, 0.18)",n.style.borderRadius="7px",n.style.overflow="hidden",n.style.boxShadow="inset 0 2px 6px rgba(0, 0, 0, 0.35)",n.style.border=this.highContrastMode?"3px solid rgba(255, 255, 255, 0.92)":"none";const o=document.createElement("div");o.setAttribute("data-stage-progress-fill",""),o.style.height="100%",o.style.width="0%",o.style.borderRadius="7px",o.style.background=this.highContrastMode?`repeating-linear-gradient(90deg, #ffffff 0 10px, #00ddff 10px 18px, ${i} 18px 30px)`:`linear-gradient(90deg, #00ddff, ${i})`,o.style.transition="width 0.15s linear",o.setAttribute("data-stage-progress-color",i),n.appendChild(o);const c=document.createElement("div");c.setAttribute("data-stage-progress-goal",""),c.textContent="🪐",c.style.fontSize="clamp(0.9rem, 2.4vmin, 1.1rem)",c.style.lineHeight="1",c.style.pointerEvents="none",c.style.textShadow=`0 0 8px ${i}`,s.appendChild(a),s.appendChild(n),s.appendChild(c),t.appendChild(s),this.stageProgressContainer=s,this.stageProgressTrack=n,this.stageProgressFill=o,this.stageProgressGoalEl=c}toCssColor(t){return`#${Math.max(0,Math.min(16777215,Math.floor(t))).toString(16).padStart(6,"0")}`}createMuteButton(){const t=document.getElementById("hud");t&&(this.muteHandle=Nt({initialMuted:this.muted,container:t,onToggle:()=>this.onMuteCallback?.()}),this.muteButton=this.muteHandle.element)}createPauseButton(){const t=document.getElementById("hud");if(!t)return;const e=window.innerHeight<=500;this.pauseButton=document.createElement("button"),this.pauseButton.textContent="✋ やすむ",this.pauseButton.setAttribute("aria-label","やすむ"),this.pauseButton.style.position="absolute",this.pauseButton.style.top="0.8rem",this.pauseButton.style.left=e?"4rem":"4.7rem",this.pauseButton.style.fontFamily="'Zen Maru Gothic', sans-serif",this.pauseButton.style.fontSize=e?"clamp(0.9rem, 3.2vmin, 1rem)":"clamp(1rem, 3.5vmin, 1.15rem)",this.pauseButton.style.fontWeight="900",this.pauseButton.style.padding=e?"0.45rem 0.9rem":"0.7rem 1.2rem",this.pauseButton.style.border="none",this.pauseButton.style.borderRadius="999px",this.pauseButton.style.background="rgba(255, 255, 255, 0.16)",this.pauseButton.style.color="#fff",this.pauseButton.style.cursor="pointer",this.pauseButton.style.pointerEvents="auto",this.pauseButton.style.touchAction="manipulation",this.pauseButton.style.boxShadow="0 4px 14px rgba(0, 0, 0, 0.2)",this.pauseButton.style.transform="scale(1)",this.pauseButton.style.transition="transform 0.08s ease-out, opacity 0.12s ease-out",this.pauseButton.style.minHeight=e?"2.4rem":"3rem",this.pauseButton.style.minWidth=e?"5.6rem":"7rem",this.pauseButtonCleanup=I(this.pauseButton,{onActivate:()=>this.onPauseCallback?.(),canActivate:()=>this.pauseEnabled,onPressChange:i=>{this.writePauseButtonStyle("transform",i?"scale(0.95)":"scale(1)")}}),t.appendChild(this.pauseButton),this.applyPauseButtonState()}createBoostButton(){const t=document.getElementById("ui-overlay");if(!t)return;this.injectBoostAnimations(),this.boostButton=document.createElement("button"),this.boostButton.textContent="🚀 ブースト!",this.boostButton.setAttribute("aria-label","ブースト"),this.boostButton.setAttribute("aria-disabled","false");const e=window.innerHeight<=500;this.boostButton.style.position="absolute",this.boostButton.style.bottom=e?"1rem":"2rem",this.boostButton.style.right=e?"1rem":"2rem",this.boostButton.style.fontFamily="'Zen Maru Gothic', sans-serif",this.boostButton.style.fontSize=e?"clamp(0.85rem, 2.8vmin, 1.05rem)":"clamp(1rem, 3.5vmin, 1.3rem)",this.boostButton.style.fontWeight="700",this.boostButton.style.padding=e?"0.5rem 1rem":"0.8rem 1.5rem",this.boostButton.style.border="none",this.boostButton.style.borderRadius="2rem",this.boostButton.style.background="linear-gradient(135deg, #FF6B6B, #FFD93D, #6BCB77)",this.boostButton.style.color="#fff",this.boostButton.style.cursor="pointer",this.boostButton.style.touchAction="manipulation",this.boostButton.style.pointerEvents="auto",this.boostButton.style.boxShadow="0 4px 15px rgba(255, 107, 107, 0.4)",this.boostButton.style.animation="boostBtnPulse 2s ease-in-out infinite",this.boostButton.addEventListener("pointerdown",i=>{i.stopPropagation();const s=this.boostButton;if(s&&!this.boostLocked){if(this.lastCooldownProgress<1){if(s.hasAttribute("data-boost-shake"))return;s.setAttribute("data-boost-shake",""),this.registerTimeout(()=>{s.removeAttribute("data-boost-shake")},250),this.onBoostDeniedCallback?.();return}this.writeBoostButtonStyle("transform","scale(0.9)"),this.registerTimeout(()=>{this.writeBoostButtonStyle("transform","scale(1.0)")},150),this.onBoostCallback?.()}}),t.appendChild(this.boostButton),this.boostHintEl=document.createElement("div"),this.boostHintEl.setAttribute("data-boost-hint",""),this.boostHintEl.setAttribute("aria-hidden","true"),this.boostHintEl.style.cssText=`
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
    `,document.head.appendChild(t)}setBoostCallback(t){this.onBoostCallback=t}setBoostDeniedCallback(t){this.onBoostDeniedCallback=t}setBoostLocked(t){this.boostLocked=t,this.applyBoostButtonState()}setHomeCallback(t){this.onHomeCallback=t}setHomeConfirmOpenCallback(t){this.onHomeConfirmOpenCallback=t}setHomeConfirmCancelCallback(t){this.onHomeConfirmCancelCallback=t}setPauseCallback(t){this.onPauseCallback=t}setPauseEnabled(t){this.pauseEnabled=t,this.applyPauseButtonState()}setMuteCallback(t){this.onMuteCallback=t}setPauseOpenCallback(t){this.onPauseOpenCallback=t}setPauseResumeCallback(t){this.onPauseResumeCallback=t}setMuteState(t){this.muted=t,this.muteHandle?.setMuted(t)}setHighContrastMode(t){this.highContrastMode=t,this.applyColorAccessibilityState()}applyColorAccessibilityState(){if(this.stageNameEl&&(this.stageNameEl.style.color=this.highContrastMode?"#fff58f":"#FFD700",this.stageNameEl.style.textShadow=this.highContrastMode?"0 0 0 #000, 0 2px 8px rgba(0, 0, 0, 0.9), 0 0 20px rgba(255, 255, 255, 0.25)":"0 2px 8px rgba(0, 0, 0, 0.7)"),this.assistMessageEl&&(this.assistMessageEl.style.background=this.highContrastMode?"rgba(5, 10, 28, 0.96)":"rgba(255, 255, 255, 0.14)",this.assistMessageEl.style.border=this.highContrastMode?"3px solid rgba(255, 255, 255, 0.95)":"none",this.assistMessageEl.style.color=this.highContrastMode?"#ffffff":"#fff7bf"),this.bestStarContainerEl&&(this.bestStarContainerEl.style.color=this.highContrastMode?"#e6f4ff":"#9ec5ff",this.bestStarContainerEl.style.opacity=this.highContrastMode?"1":"0.7"),this.stageProgressTrack&&(this.stageProgressTrack.style.background=this.highContrastMode?"rgba(6, 12, 28, 0.94)":"rgba(255, 255, 255, 0.18)",this.stageProgressTrack.style.border=this.highContrastMode?"3px solid rgba(255, 255, 255, 0.92)":"none"),this.stageProgressFill){const t=this.stageProgressFill.getAttribute("data-stage-progress-color")??"#ffd700";this.stageProgressFill.style.background=this.highContrastMode?`repeating-linear-gradient(90deg, #ffffff 0 10px, #00ddff 10px 18px, ${t} 18px 30px)`:`linear-gradient(90deg, #00ddff, ${t})`}if(this.stageProgressGoalEl){const t=this.stageProgressFill?.getAttribute("data-stage-progress-color")??"#ffd700";this.stageProgressGoalEl.style.textShadow=this.highContrastMode?`0 0 0 #000, 0 0 12px #ffffff, 0 0 18px ${t}`:`0 0 8px ${t}`}this.boostButton&&(this.boostButton.style.border=this.highContrastMode?"4px solid rgba(255, 255, 255, 0.95)":"none",this.boostButton.style.background=this.highContrastMode?"linear-gradient(135deg, #fff27a, #76f0ff, #6BCB77)":"linear-gradient(135deg, #FF6B6B, #FFD93D, #6BCB77)",this.boostButton.style.color=this.highContrastMode?"#0b1535":"#fff"),this.cooldownContainer&&(this.cooldownContainer.style.background=this.highContrastMode?"rgba(6, 12, 28, 0.94)":"rgba(255, 255, 255, 0.2)",this.cooldownContainer.style.border=this.highContrastMode?"2px solid rgba(255, 255, 255, 0.95)":"none",this.cooldownContainer.style.height=this.highContrastMode?"10px":"6px"),this.cooldownBar&&(this.cooldownBar.style.background=this.highContrastMode?"repeating-linear-gradient(90deg, #ffffff 0 10px, #00ddff 10px 18px, #00ff88 18px 30px)":"linear-gradient(90deg, #00ddff, #00ff88)"),this.applyBoostButtonState()}showAssistMessage(t){this.assistMessageEl&&(this.assistMessageEl.textContent=t,this.assistMessageEl.style.display="block",this.announcePolite(t))}hideAssistMessage(){this.assistMessageEl&&(this.assistMessageEl.style.display="none",this.assistMessageEl.textContent="")}showBoostHint(t){!this.boostHintEl||!this.boostButton||!this.cooldownContainer||(this.boostHintEl.textContent=t,this.boostHintEl.style.display="block",this.boostHintEl.setAttribute("data-boost-hint-visible",""),this.boostHintEl.setAttribute("aria-hidden","false"),this.boostButton.setAttribute("data-boost-hint-active",""),this.cooldownContainer.setAttribute("data-boost-hint-active",""))}hideBoostHint(){this.boostHintEl&&(this.boostHintEl.style.display="none",this.boostHintEl.textContent="",this.boostHintEl.removeAttribute("data-boost-hint-visible"),this.boostHintEl.setAttribute("aria-hidden","true")),this.boostButton?.removeAttribute("data-boost-hint-active"),this.cooldownContainer?.removeAttribute("data-boost-hint-active")}isMuted(){return this.muted}update(t,e){if(this.scoreEl&&t!==this.lastScore){const i=this.lastScore;this.setDisplayedScore(t),this.lastScore=t,i!==-1&&t>i&&this.flashCount(this.scoreEl)}if(this.starCountEl&&e!==this.lastStarCount){const i=this.lastStarCount;this.starCountEl.textContent=String(e),this.lastStarCount=e,i!==-1&&e>i&&(this.flashCount(this.starCountEl),this.announcePolite(`ほし ${e}こ ゲット！`))}this.bestStarCount>0&&!this.bestStarPulsed&&e>this.bestStarCount&&this.bestStarContainerEl&&this.bestStarContainerEl.style.display!=="none"&&(this.bestStarPulsed=!0,this.flashCount(this.bestStarContainerEl))}animateScoreGain(t,e){if(!this.scoreEl)return;const i=Math.max(0,Math.round(e)),s=Math.max(0,Math.round(t));if(s<=0){this.setDisplayedScore(i),this.lastScore=i;return}this.lastScore=i,this.flashCount(this.scoreEl),this.showScoreGainPopup(s),this.animateScoreValue(i)}setBestStarCount(t){const e=Number.isInteger(t)&&t>0?t:0;this.bestStarCount=e,this.bestStarPulsed=!1,!(!this.bestStarContainerEl||!this.bestStarCountEl)&&(e>0?(this.lastBestStarCount!==e&&(this.bestStarCountEl.textContent=String(e),this.lastBestStarCount=e),this.bestStarContainerEl.style.display=""):(this.bestStarContainerEl.style.display="none",this.lastBestStarCount=-1))}flashCount(t){if(t.hasAttribute("data-hud-count-pop"))return;t.setAttribute("data-hud-count-pop","");let e=!1;const i=()=>{e||(e=!0,t.removeAttribute("data-hud-count-pop"),t.removeEventListener("animationend",s))},s=a=>{a.animationName==="hudCountPop"&&i()};t.addEventListener("animationend",s),this.registerTimeout(i,500)}setDisplayedScore(t){this.scoreEl&&this.displayedScore!==t&&(this.scoreEl.textContent=String(t)),this.displayedScore=t}animateScoreValue(t){const e=this.displayedScore;if(t<=e){this.setDisplayedScore(t);return}this.scoreAnimationToken+=1;const i=this.scoreAnimationToken,s=t-e,a=Math.min(7,Math.max(4,Math.ceil(s/120))),n=40;for(let o=1;o<=a;o+=1)this.registerTimeout(()=>{if(i!==this.scoreAnimationToken)return;const c=o/a,u=1-(1-c)*(1-c),m=o===a?t:Math.min(t,e+Math.round(s*u));this.setDisplayedScore(m)},o*n)}showScoreGainPopup(t){const e=this.scoreGainEl;if(!e)return;const i=fe(t),s=this.scoreGainUseAltAnimation?"hudScoreGainFloatB":"hudScoreGainFloatA";this.scoreGainUseAltAnimation=!this.scoreGainUseAltAnimation,this.scoreGainAnimationEndHandler&&(e.removeEventListener("animationend",this.scoreGainAnimationEndHandler),this.scoreGainAnimationEndHandler=null),e.textContent=i.hudText,e.style.color=i.color,e.style.textShadow=`0 2px 10px ${i.shadow}`,e.style.animationName=s,e.style.visibility="visible",e.style.opacity="1",e.setAttribute("data-hud-score-gain-kind",i.kind),e.removeAttribute("data-hud-score-gain-active"),e.setAttribute("data-hud-score-gain-active","");let a=!1;const n=()=>{a||(a=!0,e.removeAttribute("data-hud-score-gain-active"),e.style.visibility="hidden",e.style.opacity="0",e.style.animationName="none",e.removeEventListener("animationend",o),this.scoreGainAnimationEndHandler===o&&(this.scoreGainAnimationEndHandler=null))},o=c=>{c.animationName===s&&n()};this.scoreGainAnimationEndHandler=o,e.addEventListener("animationend",o),this.registerTimeout(n,620)}registerTimeout(t,e){let i=0;return i=window.setTimeout(()=>{this.pendingTimeouts.delete(i),t()},e),this.pendingTimeouts.add(i),i}clearPendingTimeouts(){for(const t of this.pendingTimeouts)window.clearTimeout(t);this.pendingTimeouts.clear()}updateCooldown(t){if(!this.cooldownBar||!this.boostButton)return;const e=Math.max(0,Math.min(1,t)),i=Math.round(e*100);i!==this.lastCooldownPct&&(this.cooldownBar.style.width=`${i}%`,this.lastCooldownPct=i),this.lastCooldownProgress=e;const s=e>=1;s!==this.lastReadyState&&(this.lastReadyState=s,this.applyBoostButtonState())}updateStageProgress(t){if(!this.stageProgressContainer||!this.stageProgressFill)return;const e=Math.max(0,Math.min(1,t)),i=Math.round(e*100);i!==this.lastStageProgressPct&&(this.stageProgressFill.style.width=`${i}%`,this.stageProgressContainer.setAttribute("aria-valuenow",String(i)),this.stageProgressContainer.setAttribute("aria-valuetext",`ゴールまで あと ${100-i}%`),this.lastStageProgressPct=i),this.announceStageProgressMilestone(i);const s=e>=1;s!==this.lastStageProgressComplete&&(s?(this.stageProgressContainer.setAttribute("data-stage-progress-complete",""),this.flashStageGoal()):this.stageProgressContainer.removeAttribute("data-stage-progress-complete"),this.lastStageProgressComplete=s)}flashStageGoal(){const t=this.stageProgressGoalEl;if(!t||t.hasAttribute("data-stage-goal-flash"))return;t.setAttribute("data-stage-goal-flash","");let e=!1;const i=()=>{e||(e=!0,t.removeAttribute("data-stage-goal-flash"),t.removeEventListener("animationend",s))},s=a=>{a.animationName==="stageGoalFlash"&&i()};t.addEventListener("animationend",s),this.registerTimeout(i,500)}flashBoostReady(){const t=this.boostButton;if(!t||t.hasAttribute("data-boost-ready-flash"))return;this.announcePolite("ブースト じゅんび OK！"),t.setAttribute("data-boost-ready-flash","");let e=!1;const i=()=>{e||(e=!0,t.removeAttribute("data-boost-ready-flash"),t.removeEventListener("animationend",s),this.lastReadyState===!0&&this.writeBoostButtonStyle("animation","boostBtnPulse 2s ease-in-out infinite, boostReadyRing 1.15s ease-in-out infinite"))},s=a=>{a.animationName==="boostBtnReadyFlash"&&i()};t.addEventListener("animationend",s),this.registerTimeout(i,500)}clearBoostReadyFlash(){this.boostButton?.hasAttribute("data-boost-ready-flash")&&this.boostButton.removeAttribute("data-boost-ready-flash")}announceMeteoriteHit(){this.announceAssertive("いんせきに ぶつかった！ シールド かいふくちゅう")}announceStageClear(t,e=!1,i=!1){const s=[`ステージ クリア！ ほし ${t}こ あつめたよ！`];i&&s.push("じこベスト こうしん！"),e&&s.push("あたらしい なかまも みつけたよ！"),this.announceAssertive(s.join(" "))}applyBoostButtonState(){if(!this.cooldownBar||!this.boostButton)return;const e=this.lastCooldownProgress>=1&&!this.boostLocked;this.setCooldownBarBoxShadow(e?this.highContrastMode?"0 0 0 2px rgba(255, 255, 255, 0.7), 0 0 14px #00ff88":"0 0 10px #00ff88":"none"),this.writeBoostButtonStyle("opacity",e?"1":"0.5"),this.writeBoostButtonStyle("filter",e?"none":"grayscale(0.8)"),this.writeBoostButtonStyle("animation",e?"boostBtnPulse 2s ease-in-out infinite, boostReadyRing 1.15s ease-in-out infinite":"none"),this.setBoostReadyRing(e),this.setBoostButtonAriaDisabled(e?"false":"true"),e||(this.clearBoostReadyFlash(),this.hideBoostHint())}applyPauseButtonState(){this.pauseButton&&(this.writePauseButtonStyle("opacity",this.pauseEnabled?"1":"0.45"),this.writePauseButtonStyle("filter",this.pauseEnabled?"none":"grayscale(0.8)"),this.writePauseButtonStyle("cursor",this.pauseEnabled?"pointer":"default"),this.setPauseButtonAriaDisabled(this.pauseEnabled?"false":"true"))}writeBoostButtonStyle(t,e){!this.boostButton||this.boostButtonStyleCache[t]===e||(this.boostButton.style[t]=e,this.boostButtonStyleCache[t]=e)}writePauseButtonStyle(t,e){!this.pauseButton||this.pauseButtonStyleCache[t]===e||(this.pauseButton.style[t]=e,this.pauseButtonStyleCache[t]=e)}setCooldownBarBoxShadow(t){!this.cooldownBar||this.lastCooldownBarBoxShadow===t||(this.cooldownBar.style.boxShadow=t,this.lastCooldownBarBoxShadow=t)}setBoostReadyRing(t){!this.boostButton||this.lastBoostReadyRingVisible===t||(t?this.boostButton.setAttribute("data-boost-ready-ring",""):this.boostButton.removeAttribute("data-boost-ready-ring"),this.lastBoostReadyRingVisible=t)}setBoostButtonAriaDisabled(t){!this.boostButton||this.lastBoostButtonAriaDisabled===t||(this.boostButton.setAttribute("aria-disabled",t),this.lastBoostButtonAriaDisabled=t)}setPauseButtonAriaDisabled(t){!this.pauseButton||this.lastPauseButtonAriaDisabled===t||(this.pauseButton.setAttribute("aria-disabled",t),this.lastPauseButtonAriaDisabled=t)}createLiveRegions(t){this.politeLiveRegionEl=this.createLiveRegion("polite"),this.assertiveLiveRegionEl=this.createLiveRegion("assertive"),t.appendChild(this.politeLiveRegionEl),t.appendChild(this.assertiveLiveRegionEl)}createLiveRegion(t){const e=document.createElement("div");return e.setAttribute("data-hud-live-region",t),e.setAttribute("aria-live",t),e.setAttribute("aria-atomic","true"),e.setAttribute("role",t==="assertive"?"alert":"status"),e.style.cssText=`
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    `,e}announcePolite(t){this.writeLiveRegion(this.politeLiveRegionEl,t)}announceAssertive(t){this.writeLiveRegion(this.assertiveLiveRegionEl,t)}writeLiveRegion(t,e){if(!t||e.length===0)return;this.liveRegionWriteNonce+=1;const i=this.liveRegionWriteNonce%2===0?"​":"‌";t.textContent=`${e}${i}`,t.setAttribute("data-live-message",e)}announceStageProgressMilestone(t){if(t>=100){this.lastAnnouncedProgressThreshold<100&&(this.announcePolite("ゴール！"),this.lastAnnouncedProgressThreshold=100);return}const e=[{pct:75,remaining:25},{pct:50,remaining:50},{pct:25,remaining:75}];for(const i of e)t>=i.pct&&this.lastAnnouncedProgressThreshold<i.pct&&(this.lastAnnouncedProgressThreshold=i.pct,this.announcePolite(`ゴールまで あと ${i.remaining}%`))}hide(){this.clearPendingTimeouts(),this.homeConfirmOverlay.hide(),this.pauseOverlay.hide(),this.homeButton&&(this.homeButton.remove(),this.homeButton=null),this.pauseButtonCleanup?.(),this.pauseButtonCleanup=null,this.pauseButton&&(this.pauseButton.remove(),this.pauseButton=null),this.muteHandle&&(this.muteHandle.remove(),this.muteHandle=null),this.muteButton=null,this.stageNameEl&&(this.stageNameEl.remove(),this.stageNameEl=null),this.assistMessageEl&&(this.assistMessageEl.remove(),this.assistMessageEl=null),this.politeLiveRegionEl&&(this.politeLiveRegionEl.remove(),this.politeLiveRegionEl=null),this.assertiveLiveRegionEl&&(this.assertiveLiveRegionEl.remove(),this.assertiveLiveRegionEl=null),this.stageProgressContainer&&(this.stageProgressContainer.remove(),this.stageProgressContainer=null),this.stageProgressTrack=null,this.stageProgressFill=null,this.stageProgressGoalEl=null,this.container&&(this.container.remove(),this.container=null),this.boostButton&&(this.boostButton.remove(),this.boostButton=null),this.boostHintEl&&(this.boostHintEl.remove(),this.boostHintEl=null),this.cooldownContainer&&(this.cooldownContainer.remove(),this.cooldownContainer=null),this.cooldownBar=null,this.boostLocked=!1,this.pauseEnabled=!0,this.lastCooldownProgress=1,this.lastCooldownPct=-1,this.lastReadyState=null,this.lastCooldownBarBoxShadow=null,this.lastBoostButtonAriaDisabled=null,this.lastBoostReadyRingVisible=null,this.boostButtonStyleCache={opacity:null,filter:null,animation:null,transform:null},this.lastPauseButtonAriaDisabled=null,this.pauseButtonStyleCache={opacity:null,filter:null,cursor:null,transform:null},this.lastStageProgressPct=-1,this.lastStageProgressComplete=null,this.lastScore=-1,this.lastStarCount=-1,this.displayedScore=0,this.scoreAnimationToken=0,this.scoreGainUseAltAnimation=!1,this.scoreGainAnimationEndHandler=null,this.scoreEl=null,this.scoreGainEl=null,this.starCountEl=null,this.bestStarContainerEl=null,this.bestStarCountEl=null,this.bestStarCount=0,this.lastBestStarCount=-1,this.bestStarPulsed=!1,this.liveRegionWriteNonce=0,this.lastAnnouncedProgressThreshold=0}}class Ni{overlayEl=null;bubbleEl=null;highContrastMode=!1;show(t,e){const i=document.getElementById("ui-overlay");i&&(this.injectStyles(),(!this.overlayEl||!this.bubbleEl)&&(this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-adaptive-tutorial-hint",""),this.overlayEl.setAttribute("aria-hidden","true"),this.overlayEl.style.cssText=`
        position: absolute;
        top: clamp(4.6rem, 13vh, 6.8rem);
        left: 50%;
        transform: translateX(-50%);
        pointer-events: none;
        z-index: 11;
      `,this.bubbleEl=document.createElement("div"),this.bubbleEl.setAttribute("data-adaptive-tutorial-bubble",""),this.bubbleEl.setAttribute("role","status"),this.bubbleEl.setAttribute("aria-live","polite"),this.bubbleEl.setAttribute("aria-atomic","true"),this.overlayEl.appendChild(this.bubbleEl)),this.overlayEl.setAttribute("aria-hidden","false"),this.overlayEl.style.display="block",this.overlayEl.setAttribute("data-adaptive-tutorial-kind",e),this.overlayEl.setAttribute("data-adaptive-tutorial-contrast",this.highContrastMode?"high":"default"),this.bubbleEl.textContent=t,this.applyStyles(e),this.overlayEl.isConnected||i.appendChild(this.overlayEl))}hide(){!this.overlayEl||!this.bubbleEl||(this.overlayEl.style.display="none",this.overlayEl.setAttribute("aria-hidden","true"),this.overlayEl.removeAttribute("data-adaptive-tutorial-kind"),this.bubbleEl.textContent="")}setHighContrastMode(t){this.highContrastMode=t,this.overlayEl?.setAttribute("data-adaptive-tutorial-contrast",t?"high":"default");const e=this.overlayEl?.getAttribute("data-adaptive-tutorial-kind");!this.bubbleEl||!e||this.applyStyles(e)}applyStyles(t){if(!this.bubbleEl)return;const e=t==="meteorite"?{background:this.highContrastMode?"rgba(5, 10, 28, 0.96)":"rgba(29, 35, 84, 0.92)",border:this.highContrastMode?"3px solid rgba(255, 255, 255, 0.95)":"2px solid rgba(255, 187, 117, 0.95)",color:"#ffffff",shadow:this.highContrastMode?"0 12px 28px rgba(0, 0, 0, 0.42)":"0 12px 28px rgba(255, 143, 61, 0.22)"}:{background:this.highContrastMode?"rgba(5, 10, 28, 0.96)":"rgba(15, 23, 58, 0.92)",border:this.highContrastMode?"3px solid rgba(255, 255, 255, 0.95)":"2px solid rgba(255, 227, 120, 0.95)",color:"#ffffff",shadow:this.highContrastMode?"0 12px 28px rgba(0, 0, 0, 0.42)":"0 12px 28px rgba(255, 215, 0, 0.2)"};this.bubbleEl.style.cssText=`
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
    `,document.head.appendChild(t)}}const _i=1,$i=.4;class te{overlayEl=null;numberEl=null;phase="idle";elapsed=0;currentStep=0;stepDuration;goDuration;onTick;onGo;onComplete=null;steps=["3","2","1"];constructor(t={}){this.stepDuration=t.stepDuration??_i,this.goDuration=t.goDuration??$i,this.onTick=t.onTick,this.onGo=t.onGo}show(t){if(this.phase!=="idle"&&this.phase!=="done")return;const e=document.getElementById("ui-overlay")??document.body;this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-countdown-overlay",""),this.overlayEl.style.cssText=`
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
    `,this.overlayEl.appendChild(this.numberEl),e.appendChild(this.overlayEl),this.phase="counting",this.elapsed=0,this.currentStep=0,this.onComplete=t,this.renderStep(this.steps[this.currentStep]),this.fireTick()}tick(t){if(!(this.phase==="idle"||this.phase==="done")){if(t<0&&(t=0),this.elapsed+=t,this.phase==="counting"){const e=this.elapsed;this.applyStepAnimation(e/this.stepDuration),e>=this.stepDuration&&(this.currentStep++,this.elapsed=0,this.currentStep<this.steps.length?(this.renderStep(this.steps[this.currentStep]),this.fireTick()):(this.phase="go",this.renderStep("スタート！"),this.fireGo()));return}this.phase==="go"&&(this.applyStepAnimation(this.elapsed/this.goDuration),this.elapsed>=this.goDuration&&this.complete())}}hide(){this.overlayEl&&(this.overlayEl.remove(),this.overlayEl=null),this.numberEl=null,this.phase="done",this.onComplete=null}dispose(){this.hide(),this.onTick=void 0,this.onGo=void 0}isActive(){return this.phase==="counting"||this.phase==="go"}getCurrentLabel(){return this.numberEl?.textContent??null}renderStep(t){this.numberEl&&(this.numberEl.textContent=t,this.numberEl.style.opacity="0",this.numberEl.style.transform="scale(0.6)")}applyStepAnimation(t){if(!this.numberEl)return;const e=Math.max(0,Math.min(1,t));let i,s;if(e<.2){const a=e/.2;i=.6+a*.5,s=a}else if(e<.7)i=1.1-(e-.2)/.5*.1,s=1;else{const a=(e-.7)/.3;i=1+a*.2,s=1-a}this.numberEl.style.transform=`scale(${i.toFixed(3)})`,this.numberEl.style.opacity=s.toFixed(3)}fireTick(){try{this.onTick?.()}catch{}}fireGo(){try{this.onGo?.()}catch{}}complete(){const t=this.onComplete;if(this.hide(),t)try{t()}catch{}}}const Vi=1.8;class Ui{constructor(t,e={}){this.entry=t,this.totalDuration=e.totalDuration??Vi}overlayEl=null;cardEl=null;phase="idle";elapsed=0;onComplete=null;totalDuration;show(t){if(this.phase!=="idle"&&this.phase!=="done")return;const e=document.getElementById("ui-overlay")??document.body;ne();const i=H().height<=500;this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-stage-intro-overlay",""),this.overlayEl.style.cssText=`
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: ${i?"0.75rem":"1.2rem"};
      pointer-events: none;
      z-index: 24;
      opacity: 0;
      will-change: opacity;
    `,this.cardEl=document.createElement("div"),this.cardEl.setAttribute("data-stage-intro-card",""),this.cardEl.setAttribute("data-stage-intro-compact",i?"true":"false"),this.cardEl.style.cssText=`
      width: min(${i?"88vw":"82vw"}, ${i?"22rem":"30rem"});
      max-width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: ${i?"0.25rem":"0.5rem"};
      padding: ${i?"0.9rem 1rem":"1.4rem 1.6rem"};
      border-radius: ${i?"24px":"32px"};
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
    `;const s=document.createElement("div");s.textContent="つぎは ここ！",s.setAttribute("data-stage-intro-label",""),s.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${i?"0.85rem":"1rem"};
      font-weight: 800;
      letter-spacing: 0.08em;
      color: #bcd9ff;
    `;const a=document.createElement("div");a.textContent=this.entry.emoji,a.setAttribute("data-stage-intro-emoji",""),a.style.cssText=`
      font-size: ${i?"clamp(3rem, 15vw, 4.2rem)":"clamp(4.4rem, 18vw, 6rem)"};
      line-height: 1;
      filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.28));
    `;const n=document.createElement("div");n.textContent=this.entry.reading,n.setAttribute("data-stage-intro-name",""),n.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${i?"clamp(1.8rem, 8vw, 2.6rem)":"clamp(2.5rem, 10vw, 3.4rem)"};
      font-weight: 900;
      line-height: 1.05;
      color: #ffffff;
      text-shadow: 0 0 18px rgba(126, 199, 255, 0.2);
    `;const o=document.createElement("div");o.textContent=this.entry.trivia,o.setAttribute("data-stage-intro-trivia",""),o.style.cssText=`
      max-width: 100%;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${i?"clamp(0.88rem, 3.4vmin, 1rem)":"clamp(1.02rem, 3.7vmin, 1.15rem)"};
      font-weight: 700;
      line-height: 1.35;
      color: #eef5ff;
      overflow-wrap: anywhere;
    `,this.cardEl.append(s,a,n,o),this.overlayEl.appendChild(this.cardEl),e.appendChild(this.overlayEl),this.phase="showing",this.elapsed=0,this.onComplete=t,this.applyAnimation(0)}tick(t){this.phase==="showing"&&(this.elapsed+=Math.max(0,t),this.applyAnimation(this.elapsed/this.totalDuration),this.elapsed>=this.totalDuration&&this.complete())}hide(){this.overlayEl&&(this.overlayEl.remove(),this.overlayEl=null),this.cardEl=null,this.phase="done",this.onComplete=null}dispose(){this.hide()}isActive(){return this.phase==="showing"}applyAnimation(t){if(!this.overlayEl||!this.cardEl)return;const e=Math.max(0,Math.min(1,t));let i=1,s=1,a=0,n=1;if(e<.18){const o=e/.18;s=o,i=o,a=24-24*o,n=.92+.1*o}else if(e<.72){const o=(e-.18)/.54;s=1,i=1,a=0,n=1.02-.02*o}else{const o=(e-.72)/.28;s=1-o*.8,i=1-o,a=-18*o,n=1-.04*o}this.overlayEl.style.opacity=s.toFixed(3),this.cardEl.style.opacity=i.toFixed(3),this.cardEl.style.transform=`translateY(${a.toFixed(1)}px) scale(${n.toFixed(3)})`}complete(){const t=this.onComplete;if(this.hide(),!!t)try{t()}catch{}}}class ji{overlayEl=null;leftGuideEl=null;rightGuideEl=null;instructionEl=null;currentMode=null;show(t="intro"){if(this.overlayEl){this.setMode(t);return}const e=document.getElementById("ui-overlay");e&&(this.injectStyles(),this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-touch-guide-overlay",""),this.overlayEl.setAttribute("role","region"),this.overlayEl.setAttribute("aria-label","そうさ ガイド"),this.overlayEl.style.cssText=`
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 12;
    `,this.leftGuideEl=this.createGuide("left","⬅️ ひだり"),this.rightGuideEl=this.createGuide("right","みぎ ➡️"),this.instructionEl=this.createInstruction(),this.overlayEl.appendChild(this.leftGuideEl),this.overlayEl.appendChild(this.rightGuideEl),this.overlayEl.appendChild(this.instructionEl),e.appendChild(this.overlayEl),this.setMode(t))}setMode(t){!this.overlayEl||this.currentMode===t||(this.currentMode=t,this.overlayEl.setAttribute("data-touch-guide-state",t),this.overlayEl.setAttribute("data-touch-guide-active-side",this.getActiveSide(t)),this.overlayEl.setAttribute("aria-hidden",t==="hidden"?"true":"false"),this.overlayEl.style.visibility=t==="hidden"?"hidden":"visible",this.leftGuideEl?.setAttribute("data-touch-guide-emphasis",this.getGuideEmphasis("left",t)),this.rightGuideEl?.setAttribute("data-touch-guide-emphasis",this.getGuideEmphasis("right",t)),this.updateInstruction(t))}hide(){this.overlayEl&&(this.overlayEl.remove(),this.overlayEl=null,this.leftGuideEl=null,this.rightGuideEl=null,this.instructionEl=null,this.currentMode=null)}createGuide(t,e){const i=document.createElement("div");return i.setAttribute("data-touch-guide",t),i.setAttribute("aria-hidden","true"),i.textContent=e,i.style.position="absolute",i.style.top="50%",i.style.transform="translateY(-50%)",i.style.maxWidth="min(24vw, 11rem)",i.style.padding="0.7rem 1rem",i.style.borderRadius="999px",i.style.background="rgba(6, 19, 58, 0.38)",i.style.border="2px solid rgba(255, 255, 255, 0.24)",i.style.color="#ffffff",i.style.fontFamily="'Zen Maru Gothic', sans-serif",i.style.fontSize="clamp(1rem, 2.8vmin, 1.3rem)",i.style.fontWeight="700",i.style.textShadow="0 2px 10px rgba(0, 0, 0, 0.45)",i.style.boxShadow="0 8px 24px rgba(0, 0, 0, 0.16)",i.style.transition="opacity 0.24s ease-out, transform 0.24s ease-out",i.style.whiteSpace="nowrap",i.style.opacity="0",t==="left"?(i.style.left="0.8rem",i.style.textAlign="left"):(i.style.right="0.8rem",i.style.textAlign="right"),i}createInstruction(){const t=document.createElement("div");return t.setAttribute("data-touch-guide-instruction",""),t.setAttribute("role","status"),t.setAttribute("aria-live","polite"),t.setAttribute("aria-atomic","true"),t.style.cssText=`
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
    `,document.head.appendChild(t)}getActiveSide(t){return t==="active-left"?"left":t==="active-right"?"right":t==="assist-left"?"left":t==="assist-right"?"right":t==="hidden"?"none":"both"}getGuideEmphasis(t,e){return e==="active-left"?t==="left"?"primary":"secondary":e==="active-right"?t==="right"?"primary":"secondary":e==="assist-left"?t==="left"?"primary":"secondary":e==="assist-right"?t==="right"?"primary":"secondary":e==="hidden"?"hidden":"balanced"}updateInstruction(t){if(!this.instructionEl)return;const e=this.getInstructionMessage(t);this.instructionEl.textContent=e,this.instructionEl.setAttribute("data-touch-guide-message",e)}getInstructionMessage(t){return t==="intro"?"ひだりか みぎを さわると うごけるよ":t==="idle"?"ひつような ときは ひだりか みぎを さわって うごこう":t==="assist-left"?"ひだりへ よけよう":t==="assist-right"?"みぎへ よけよう":""}}class R{static DEFAULT_DURATION=4.2;static CELEBRATION_DURATION=3.6;static STYLE_ID="constellation-hint-overlay-styles";static POINTER_SIZE=56;static POINTER_SAFE_MARGIN=28;static POINTER_TOP_SAFE_AREA=124;element=null;messageElement=null;statusElement=null;miniMapElement=null;pointerElement=null;pointerArrowElement=null;timer=0;mode="hidden";message=null;highContrast=!1;motionSensitivity="strong";guideState=null;targetScreenPosition=null;showHint(t){this.mode="message",this.timer=R.DEFAULT_DURATION,this.message=t,this.render()}showGuide(t,e){this.mode="guide",this.timer=0,this.guideState={definition:t,collectedCount:Math.max(0,Math.min(e,t.points.length))},this.message=this.buildGuideMessage(t,this.guideState.collectedCount),this.render()}showCelebration(t){this.mode="celebration",this.timer=R.CELEBRATION_DURATION,this.message=t,this.render()}updateTargetScreenPosition(t){this.targetScreenPosition=t,this.renderPointer()}tick(t){if(!(this.timer<=0)&&(this.timer=Math.max(0,this.timer-t),this.timer===0)){if(this.mode==="celebration"){const e=this.guideState;if(e!==null&&e.collectedCount<e.definition.points.length){this.mode="guide",this.message=this.buildGuideMessage(e.definition,e.collectedCount),this.render();return}}this.hide()}}hide(){this.timer=0,this.mode="hidden",this.message=null,this.guideState=null,this.targetScreenPosition=null,this.element&&(this.element.style.display="none",this.element.removeAttribute("data-constellation-message")),this.pointerElement&&(this.pointerElement.style.display="none")}dispose(){this.hide(),this.element?.remove(),this.pointerElement?.remove(),this.element=null,this.messageElement=null,this.statusElement=null,this.miniMapElement=null,this.pointerElement=null,this.pointerArrowElement=null}setHighContrastMode(t){this.highContrast=t,this.applyTheme(),this.render()}setMotionSensitivity(t){this.motionSensitivity=t,this.applyTheme(),this.renderPointer()}getMessage(){return this.message}render(){const t=this.ensureElement();if(this.applyTheme(),this.mode==="hidden"){t.style.display="none",this.renderPointer();return}t.style.display="flex",t.setAttribute("data-constellation-mode",this.mode),this.message?(t.setAttribute("data-constellation-message",this.message),t.setAttribute("aria-label",this.message)):(t.removeAttribute("data-constellation-message"),t.removeAttribute("aria-label"));const e=this.guideState,i=e!==null,s=this.mode==="guide"||this.mode==="celebration",a=i&&s?this.buildGuideStatus(e.definition,e.collectedCount):"ヒント";if(this.messageElement&&(this.messageElement.textContent=this.message??""),this.statusElement&&(this.statusElement.textContent=a,this.statusElement.style.display=a?"inline-flex":"none"),this.miniMapElement)if(this.miniMapElement.style.display=i?"block":"none",i){const n=this.buildMiniMapMarkup(e.definition,e.collectedCount);this.miniMapElement.innerHTML=n,this.miniMapElement.setAttribute("aria-label",`${e.definition.reading} の ほしならび。あと${Math.max(0,e.definition.points.length-e.collectedCount)}こ。`)}else this.miniMapElement.innerHTML="";this.renderPointer()}ensureElement(){if(this.element)return this.element;this.injectStyles();const t=document.getElementById("ui-overlay")??document.body,e=document.createElement("div");e.setAttribute("data-constellation-hint",""),e.setAttribute("data-constellation-hint-overlay",""),e.setAttribute("aria-live","polite"),e.style.cssText=`
      position: absolute;
      top: 0.75rem;
      left: 50%;
      transform: translateX(-50%);
      width: min(82vw, 22.5rem);
      max-width: min(82vw, 22.5rem);
      min-height: 6.25rem;
      padding: 0.7rem 0.8rem 0.8rem;
      border-radius: 1.45rem;
      display: none;
      flex-direction: column;
      gap: 0.55rem;
      pointer-events: none;
      z-index: 35;
      box-sizing: border-box;
      contain: layout style paint;
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.24);
    `;const i=document.createElement("div");i.style.cssText="display:flex; align-items:flex-start; justify-content:space-between; gap:0.5rem;";const s=document.createElement("div");s.setAttribute("data-constellation-message-text",""),s.style.cssText=`
      flex: 1;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 1rem;
      font-weight: 700;
      line-height: 1.35;
      letter-spacing: 0.01em;
      text-wrap: balance;
    `;const a=document.createElement("div");a.setAttribute("data-constellation-status",""),a.style.cssText=`
      min-width: 4.25rem;
      min-height: 2rem;
      padding: 0.28rem 0.7rem;
      border-radius: 999px;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 0.88rem;
      font-weight: 800;
      justify-content: center;
      align-items: center;
      text-align: center;
      box-sizing: border-box;
      display: inline-flex;
      align-self: flex-start;
    `;const n=document.createElementNS("http://www.w3.org/2000/svg","svg");return n.setAttribute("data-constellation-minimap",""),n.setAttribute("viewBox","0 0 200 88"),n.setAttribute("width","100%"),n.setAttribute("height","88"),n.setAttribute("role","img"),n.style.cssText="display:block; width:100%; height:5.5rem; overflow:visible;",i.append(s,a),e.append(i,n),t.appendChild(e),this.element=e,this.messageElement=s,this.statusElement=a,this.miniMapElement=n,this.ensurePointerElement(),this.applyTheme(),e}ensurePointerElement(){if(this.pointerElement)return this.pointerElement;const t=document.getElementById("ui-overlay")??document.body,e=document.createElement("div");e.setAttribute("data-constellation-pointer",""),e.style.cssText=`
      position: fixed;
      display: none;
      width: ${R.POINTER_SIZE}px;
      height: ${R.POINTER_SIZE}px;
      border-radius: 999px;
      pointer-events: none;
      z-index: 34;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.28);
      transform-origin: center;
    `;const i=document.createElement("div");i.setAttribute("data-constellation-pointer-arrow",""),i.textContent="➜",i.style.cssText=`
      font-size: 1.5rem;
      font-weight: 900;
      line-height: 1;
      transform-origin: center;
      filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
    `;const s=document.createElement("div");return s.textContent="つぎ",s.style.cssText=`
      position: absolute;
      bottom: -0.75rem;
      left: 50%;
      transform: translateX(-50%);
      min-width: 2.8rem;
      min-height: 1.5rem;
      padding: 0.1rem 0.45rem;
      border-radius: 999px;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 0.72rem;
      font-weight: 800;
      text-align: center;
      box-sizing: border-box;
      white-space: nowrap;
    `,e.append(i,s),t.appendChild(e),this.pointerElement=e,this.pointerArrowElement=i,this.applyTheme(),e}renderPointer(){const t=this.ensurePointerElement(),e=this.pointerArrowElement,i=this.guideState,s=this.targetScreenPosition;if(!(this.mode==="guide"&&i!==null&&i.collectedCount<i.definition.points.length&&s!==null)||!e){t.style.display="none";return}const n=Math.max(window.innerWidth||0,document.documentElement.clientWidth||0,1),o=Math.max(window.innerHeight||0,document.documentElement.clientHeight||0,1),c=R.POINTER_SAFE_MARGIN,u=n-R.POINTER_SAFE_MARGIN-R.POINTER_SIZE,m=R.POINTER_TOP_SAFE_AREA,f=o-R.POINTER_SAFE_MARGIN-R.POINTER_SIZE,b=s.visible?s.x:Math.min(Math.max(s.x,c+28),u+28),g=s.visible?Math.max(s.y-56,m+28):Math.min(Math.max(s.y,m+28),f+28),r=Math.min(Math.max(b-R.POINTER_SIZE/2,c),u),d=Math.min(Math.max(g-R.POINTER_SIZE/2,m),f),S=s.x-(r+R.POINTER_SIZE/2),x=s.y-(d+R.POINTER_SIZE/2),T=Math.atan2(x,S)*(180/Math.PI);t.style.display="flex",t.style.left=`${r}px`,t.style.top=`${d}px`,e.style.transform=`rotate(${T}deg)`}applyTheme(){const t=this.element,e=this.pointerElement,i=this.isReducedMotion();if(t&&(t.style.setProperty("--constellation-card-bg",this.highContrast?"rgba(255, 255, 255, 0.98)":"rgba(11, 24, 88, 0.9)"),t.style.setProperty("--constellation-card-border",this.highContrast?"#102040":"rgba(255, 255, 255, 0.3)"),t.style.setProperty("--constellation-card-text",this.highContrast?"#102040":"#fff8c8"),t.style.setProperty("--constellation-card-subtle",this.highContrast?"rgba(16, 32, 64, 0.12)":"rgba(255, 255, 255, 0.12)"),t.style.setProperty("--constellation-status-bg",this.highContrast?"#102040":"rgba(255, 255, 255, 0.15)"),t.style.setProperty("--constellation-status-text",this.highContrast?"#ffffff":"#fffdf1"),t.style.setProperty("--constellation-line-active",this.highContrast?"#102040":"#ffe27a"),t.style.setProperty("--constellation-line-faint",this.highContrast?"#7687a6":"rgba(255, 255, 255, 0.22)"),t.style.setProperty("--constellation-star-collected",this.highContrast?"#102040":"#fff07b"),t.style.setProperty("--constellation-star-next",this.highContrast?"#102040":"#ff7af6"),t.style.setProperty("--constellation-star-pending",this.highContrast?"#d4d9e2":"rgba(255, 255, 255, 0.32)"),t.style.setProperty("--constellation-pulse-animation",i?"none":"constellationHintPulse 1.6s ease-in-out infinite"),t.style.background="var(--constellation-card-bg)",t.style.border="2px solid var(--constellation-card-border)",t.style.color="var(--constellation-card-text)"),this.messageElement&&(this.messageElement.style.color="var(--constellation-card-text)"),this.statusElement&&(this.statusElement.style.background="var(--constellation-status-bg)",this.statusElement.style.color="var(--constellation-status-text)",this.statusElement.style.border=this.highContrast?"2px solid rgba(255, 255, 255, 0.9)":"1px solid rgba(255, 255, 255, 0.18)"),e){e.style.background=this.highContrast?"linear-gradient(135deg, #ffffff 0%, #d6e4ff 100%)":"linear-gradient(135deg, #6ad7ff 0%, #9e8cff 33%, #ff7cc8 66%, #ffd86f 100%)",e.style.border=this.highContrast?"3px solid #102040":"3px solid rgba(255, 255, 255, 0.82)",e.style.color=(this.highContrast,"#102040"),e.style.animation=i?"none":"constellationPointerFloat 1.8s ease-in-out infinite";const s=e.lastElementChild;s&&(s.style.background=this.highContrast?"#102040":"rgba(11, 24, 88, 0.94)",s.style.color="#fffdf1",s.style.border=this.highContrast?"2px solid #ffffff":"1px solid rgba(255, 255, 255, 0.3)")}}injectStyles(){if(document.getElementById(R.STYLE_ID))return;const t=document.createElement("style");t.id=R.STYLE_ID,t.textContent=`
      @keyframes constellationHintPulse {
        0%, 100% { opacity: 0.9; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.08); }
      }
      @keyframes constellationPointerFloat {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-4px); }
      }
      [data-constellation-minimap] .constellation-line-active {
        stroke: var(--constellation-line-active);
        stroke-width: 4;
        stroke-linecap: round;
      }
      [data-constellation-minimap] .constellation-line-faint {
        stroke: var(--constellation-line-faint);
        stroke-width: 3;
        stroke-dasharray: 6 8;
        stroke-linecap: round;
      }
      [data-constellation-minimap] .constellation-star-collected {
        fill: var(--constellation-star-collected);
        stroke: rgba(255, 255, 255, 0.95);
        stroke-width: 2;
      }
      [data-constellation-minimap] .constellation-star-next {
        fill: var(--constellation-star-next);
        stroke: rgba(255, 255, 255, 0.96);
        stroke-width: 2.5;
      }
      [data-constellation-minimap] .constellation-star-pending {
        fill: var(--constellation-star-pending);
        stroke: rgba(255, 255, 255, 0.4);
        stroke-width: 1.5;
      }
      [data-constellation-minimap] .constellation-star-ring {
        fill: none;
        stroke: var(--constellation-star-next);
        stroke-width: 4;
        animation: var(--constellation-pulse-animation);
        transform-origin: center;
      }
      [data-constellation-minimap] text {
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: 10px;
        font-weight: 800;
        text-anchor: middle;
        dominant-baseline: central;
        fill: #102040;
        pointer-events: none;
      }
    `,document.head.appendChild(t)}buildGuideMessage(t,e){const i=t.points.length-e;return e===0?`${t.reading} を つくろう！⭐`:i<=1?`${t.reading} の さいごだよ！⭐`:`${t.reading} の つぎは ここだよ！⭐`}buildGuideStatus(t,e){const i=Math.max(0,t.points.length-e);return i===0?"やったね！✨":`あと${i}こ！`}buildMiniMapMarkup(t,e){const i=t.points,s=200,a=88,n=22,o=16,c=i.map(w=>w.x),u=i.map(w=>w.y),m=Math.min(...c),f=Math.max(...c),b=Math.min(...u),g=Math.max(...u),r=Math.max(f-m,1),d=Math.max(g-b,1),S=Math.min((s-n*2)/r,(a-o*2)/d),x=r*S,T=d*S,y=(s-x)/2,p=(a-T)/2,M=w=>{const h=i[w];return{x:y+(h.x-m)*S,y:a-(p+(h.y-b)*S)}},k=i.slice(0,-1).map((w,h)=>{const E=M(h),P=M(h+1);return`<line class="${h<e-1?"constellation-line-active":"constellation-line-faint"}" x1="${E.x}" y1="${E.y}" x2="${P.x}" y2="${P.y}" />`}).join(""),C=i.map((w,h)=>{const E=M(h),P=h<e?"collected":h===e?"next":"pending",$=`constellation-star-${P}`,V=`${h+1}`;return`${P==="next"?`<circle data-constellation-next-star="" class="constellation-star-ring" cx="${E.x}" cy="${E.y}" r="14" />`:""}<circle data-constellation-star="${P}" class="${$}" cx="${E.x}" cy="${E.y}" r="7.5" /><text x="${E.x}" y="${E.y+.5}">${V}</text>`}).join("");return`
      <rect x="3" y="3" width="194" height="82" rx="20" fill="var(--constellation-card-subtle)" />
      ${k}
      ${C}
    `}isReducedMotion(){if(this.motionSensitivity==="gentle"||this.motionSensitivity==="minimal")return!0;const t=globalThis.matchMedia;if(typeof t!="function")return!1;try{return t("(prefers-reduced-motion: reduce)").matches}catch{return!1}}}const Wi=4;class Yi{overlayEl=null;cardEl=null;titleEl=null;messageEl=null;elapsed=0;visible=!1;highContrastMode=!1;totalDuration;constructor(t={}){this.totalDuration=t.totalDuration??Wi}show(t){const e=document.getElementById("ui-overlay")??document.body;ne();const i=H().height<=500;(!this.overlayEl||!this.cardEl||!this.titleEl||!this.messageEl)&&(this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-seasonal-event-notice",""),this.overlayEl.style.cssText=`
        position: absolute;
        top: clamp(4.6rem, 12vh, 6.8rem);
        left: 50%;
        transform: translateX(-50%);
        z-index: 14;
        pointer-events: none;
      `,this.cardEl=document.createElement("div"),this.cardEl.setAttribute("data-seasonal-event-notice-card",""),this.titleEl=document.createElement("div"),this.titleEl.setAttribute("data-seasonal-event-notice-title",""),this.messageEl=document.createElement("div"),this.messageEl.setAttribute("data-seasonal-event-notice-message",""),this.messageEl.setAttribute("role","status"),this.messageEl.setAttribute("aria-live","polite"),this.messageEl.setAttribute("aria-atomic","true"),this.cardEl.append(this.titleEl,this.messageEl),this.overlayEl.appendChild(this.cardEl)),this.overlayEl.style.display="block",this.visible=!0,this.elapsed=0,this.titleEl.textContent=`${t.emoji} ${t.title}`,this.messageEl.textContent=t.noticeMessage,this.overlayEl.setAttribute("data-seasonal-event-id",t.id),this.overlayEl.setAttribute("aria-hidden","false"),this.applyStyles(t.accentColor,i),this.overlayEl.isConnected||e.appendChild(this.overlayEl)}tick(t){this.visible&&(this.elapsed+=Math.max(0,t),this.elapsed>=this.totalDuration&&this.hide())}hide(){this.overlayEl&&(this.visible=!1,this.elapsed=0,this.overlayEl.remove(),this.overlayEl=null,this.cardEl=null,this.titleEl=null,this.messageEl=null)}dispose(){this.hide()}isVisible(){return this.visible}setHighContrastMode(t){this.highContrastMode=t;const e=this.overlayEl?.getAttribute("data-seasonal-event-id")?this.overlayEl?.getAttribute("data-seasonal-event-accent"):null;!this.cardEl||!e||this.applyStyles(Number(e),H().height<=500)}applyStyles(t,e){if(!this.overlayEl||!this.cardEl||!this.titleEl||!this.messageEl)return;const i=`#${t.toString(16).padStart(6,"0")}`;this.overlayEl.setAttribute("data-seasonal-event-accent",String(t)),this.cardEl.style.cssText=`
      min-width: min(${e?"86vw":"70vw"}, ${e?"19rem":"28rem"});
      max-width: min(90vw, 32rem);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: ${e?"0.25rem":"0.45rem"};
      padding: ${e?"0.9rem 1rem":"1rem 1.3rem"};
      border-radius: ${e?"22px":"28px"};
      background: ${this.highContrastMode?"rgba(5, 10, 28, 0.96)":"rgba(12, 31, 78, 0.92)"};
      border: ${this.highContrastMode?"3px solid #ffffff":`2px solid ${i}`};
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
    `}}class Zi{overlayEl=null;continueButton=null;retryButton=null;rewardButton=null;isContinueEnabled=!1;hasHandledContinue=!1;isRewardOpen=!1;buttonCleanups=new Set;show(t){this.hide();const e=document.getElementById("ui-overlay");if(!e)return;this.isContinueEnabled=!1,this.hasHandledContinue=!1,this.isRewardOpen=!1,this.injectStageClearBurstAnimation();const i=document.createElement("div");i.setAttribute("data-stage-clear-overlay",""),i.style.cssText=`
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
    `,i.style.overflowY="hidden",this.overlayEl=i,this.appendClearCelebrationBurst(),i.appendChild(this.createHeading("やったね！",`
      position: relative;
      z-index: 1;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(2.3rem, 8vmin, 3rem);
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
      margin-bottom: 0.5rem;
    `)),t.isBestUpdated&&(this.injectBestStageStarsAnimation(),i.appendChild(this.createHeading(`✨ じこベストこうしん！ ⭐ ${t.starCount} こ`,`
        position: relative;
        z-index: 1;
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: clamp(1rem, 3.8vmin, 1.15rem);
        font-weight: 700;
        color: #FFD700;
        margin-bottom: 0.35rem;
        text-shadow: 0 0 12px rgba(255, 215, 0, 0.6);
        animation: bestStageStarsPop 0.6s ease-out;
      `))),i.appendChild(this.createHeading(`⭐ ${t.starCount} こ あつめたよ！`,`
      position: relative;
      z-index: 1;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(1.15rem, 4.2vmin, 1.35rem);
      font-weight: 700;
      color: #fff;
    `)),i.appendChild(this.createMedalSummary(t.stageNumber,t.starCount,t.bestStarCount)),t.nextEntry&&i.appendChild(this.createNextAdventureCard(t.nextEntry)),t.rewardEntry&&i.appendChild(this.createHeading(`${t.rewardEntry.emoji} ${t.rewardEntry.name}の ずかんカード ゲット！ なかまに なったよ！`,`
        position: relative;
        z-index: 1;
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: clamp(0.95rem, 3.2vmin, 1.08rem);
        font-weight: 700;
        color: #FFD700;
        margin-top: 0.45rem;
        text-shadow: 0 0 10px rgba(255, 215, 0, 0.4);
      `)),i.appendChild(this.createActionButtons(t)),e.appendChild(i)}hide(){const t=Array.from(this.buttonCleanups);this.buttonCleanups.clear();for(const e of t)e();this.overlayEl?.remove(),this.overlayEl=null,this.continueButton=null,this.retryButton=null,this.rewardButton=null,this.isContinueEnabled=!1,this.hasHandledContinue=!1,this.isRewardOpen=!1}enableContinue(){if(!this.isContinueEnabled&&!(!this.continueButton||!this.retryButton)){this.isContinueEnabled=!0;for(const t of[this.retryButton,this.continueButton])t.disabled=!1,t.style.opacity="1",t.style.visibility="visible",t.style.pointerEvents="auto"}}setRewardOpen(t){this.isRewardOpen=t,this.rewardButton&&(this.rewardButton.style.pointerEvents=t?"none":"auto",this.rewardButton.style.transform="scale(1)")}createHeading(t,e){const i=document.createElement("div");return i.textContent=t,i.style.cssText=e,i}createMedalSummary(t,e,i){const s=document.createElement("div");s.setAttribute("data-stage-clear-medals",""),s.style.cssText=`
      position: relative;
      z-index: 1;
      display: flex;
      align-items: stretch;
      justify-content: center;
      gap: 0.65rem;
      flex-wrap: wrap;
      margin-top: 0.55rem;
    `;const a=Ot(t,e,{label:"こんかい",hint:`⭐ ${e}`,size:"hero",scope:"stage-clear-current"});a.style.minWidth="136px",a.style.padding="0.65rem 0.8rem",a.style.borderRadius="20px",a.style.background="rgba(255, 255, 255, 0.12)";const n=Ot(t,i,{label:"ベスト",hint:`⭐ ${i}`,size:"hero",scope:"stage-clear-best"});return n.style.minWidth="136px",n.style.padding="0.65rem 0.8rem",n.style.borderRadius="20px",n.style.background="rgba(255, 255, 255, 0.12)",s.append(a,n),s}createNextAdventureCard(t){const e=document.createElement("section");e.setAttribute("data-stage-clear-next-preview",""),e.style.cssText=`
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
    `;const i=this.createHeading("つぎのぼうけん",`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 0.95rem;
      font-weight: 700;
      color: #b9d7ff;
      letter-spacing: 0.08em;
    `),s=this.createHeading(`つぎは ${t.reading}！`,`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(1.25rem, 4.6vmin, 1.7rem);
      font-weight: 900;
      color: #fff4a3;
      text-shadow: 0 0 14px rgba(255, 230, 120, 0.25);
    `);s.setAttribute("data-stage-clear-next-title","");const a=document.createElement("div");a.textContent=t.emoji,a.setAttribute("data-stage-clear-next-emoji",""),a.style.cssText=`
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
    `);return o.setAttribute("data-stage-clear-next-trivia",""),e.append(i,s,a,n,o),e}createActionButtons(t){const e=!!(t.rewardEntry&&t.onReward),i=document.createElement("div");i.setAttribute("data-stage-clear-actions",""),i.style.cssText=`
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: repeat(${e?3:2}, minmax(0, 1fr));
      align-items: stretch;
      justify-content: center;
      gap: clamp(0.4rem, 1.8vmin, 0.7rem);
      width: min(100%, ${e?"42rem":"30rem"});
      margin-top: 0.7rem;
    `,e&&i.appendChild(this.createRewardButton(t));const s=document.createElement("button");s.setAttribute("data-stage-clear-retry",""),s.setAttribute("aria-label","もういちど"),s.textContent="もういちど",s.disabled=!0,s.style.cssText=`
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
    `,s.style.opacity="0",s.style.visibility="hidden",s.style.pointerEvents="none";const a=document.createElement("button");return a.setAttribute("data-stage-clear-continue",""),a.setAttribute("aria-label",t.continueLabel),a.textContent=t.continueLabel,a.disabled=!0,a.style.cssText=`
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
    `,a.style.opacity="0",a.style.visibility="hidden",a.style.pointerEvents="none",this.attachActionHandlers(s,t.onRetry),this.attachActionHandlers(a,t.onContinue),this.retryButton=s,this.continueButton=a,i.append(s,a),i}createRewardButton(t){const e=document.createElement("button");return e.setAttribute("data-stage-clear-card",""),e.textContent="カードをみる",e.style.cssText=`
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
    `,this.buttonCleanups.add(I(e,{canActivate:()=>!this.isRewardOpen,onActivate:()=>{this.isRewardOpen||t.onReward?.()},onPressChange:i=>{e.style.transform=i?"scale(0.96)":"scale(1)"},preventDefaultOnPointerDown:!0,preventDefaultOnClick:!0,stopPropagation:!0})),this.rewardButton=e,e}attachActionHandlers(t,e){const i=()=>!this.isRewardOpen&&this.isContinueEnabled&&!this.hasHandledContinue,s=I(t,{canActivate:i,onActivate:()=>{if(i()){this.hasHandledContinue=!0;for(const a of[this.retryButton,this.continueButton])a&&(a.disabled=!0,a.style.pointerEvents="none",a.style.transform="scale(1)");e()}},onPressChange:a=>{t.style.transform=a?"scale(0.96)":"scale(1)"},preventDefaultOnPointerDown:!0,preventDefaultOnClick:!0,stopPropagation:!0});this.buttonCleanups.add(s)}appendClearCelebrationBurst(){if(!this.overlayEl)return;const t=document.createElement("div");t.setAttribute("data-stage-clear-burst",""),t.style.cssText=`
      position: absolute;
      inset: 0;
      overflow: hidden;
      pointer-events: none;
      z-index: 0;
    `;const e=[{emoji:"⭐",x:"0px",y:"-164px",midX:"0px",midY:"-84px",size:"2.6rem",scale:"1.12",delay:"0ms",duration:"1500ms"},{emoji:"✨",x:"138px",y:"-108px",midX:"72px",midY:"-56px",size:"2.2rem",scale:"0.96",delay:"90ms",duration:"1440ms"},{emoji:"🌟",x:"176px",y:"-10px",midX:"96px",midY:"-8px",size:"2.5rem",scale:"1.04",delay:"150ms",duration:"1520ms"},{emoji:"⭐",x:"136px",y:"112px",midX:"74px",midY:"58px",size:"2.3rem",scale:"0.92",delay:"220ms",duration:"1480ms"},{emoji:"✨",x:"0px",y:"170px",midX:"0px",midY:"88px",size:"2rem",scale:"0.88",delay:"280ms",duration:"1400ms"},{emoji:"🌟",x:"-142px",y:"118px",midX:"-76px",midY:"60px",size:"2.4rem",scale:"1.02",delay:"340ms",duration:"1500ms"},{emoji:"⭐",x:"-182px",y:"-8px",midX:"-98px",midY:"-6px",size:"2.6rem",scale:"1.08",delay:"410ms",duration:"1560ms"},{emoji:"✨",x:"-126px",y:"-118px",midX:"-68px",midY:"-64px",size:"2.1rem",scale:"0.94",delay:"470ms",duration:"1460ms"},{emoji:"🌟",x:"78px",y:"-182px",midX:"40px",midY:"-96px",size:"2rem",scale:"0.86",delay:"520ms",duration:"1380ms"}];for(const i of e){const s=document.createElement("span");s.setAttribute("data-stage-clear-burst-emoji",""),s.setAttribute("aria-hidden","true"),s.textContent=i.emoji,s.style.cssText=`
        position: absolute;
        left: 50%;
        top: 50%;
        font-size: ${i.size};
        line-height: 1;
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.3);
        will-change: transform, opacity;
        animation: stageClearEmojiBurst ${i.duration} ease-out ${i.delay} forwards;
        --stage-clear-burst-mid-x: ${i.midX};
        --stage-clear-burst-mid-y: ${i.midY};
        --stage-clear-burst-x: ${i.x};
        --stage-clear-burst-y: ${i.y};
        --stage-clear-burst-scale: ${i.scale};
      `,t.appendChild(s)}this.overlayEl.appendChild(t)}injectBestStageStarsAnimation(){if(document.getElementById("best-stage-stars-animation"))return;const t=document.createElement("style");t.id="best-stage-stars-animation",t.textContent=`
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
    `,document.head.appendChild(t)}}const Xi=2600,ee={gentle:{title:"じどうで かるくしたよ ⭐",detail:"ほしと きらきらを すこし やさしくして なめらかに したよ"},stronger:{title:"もっと じどうで かるくしたよ 🚀",detail:"なめらかに あそべるように えんしゅつを ぎゅっと したよ"}};class qi{overlayEl=null;hideTimer=null;show(t){if(!this.overlayEl){const a=document.getElementById("ui-overlay")??document.body,n=document.createElement("div");n.setAttribute("data-frame-rate-hint-overlay",""),n.setAttribute("role","status"),n.setAttribute("aria-live","polite"),n.style.cssText=`
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
      `,this.overlayEl=n,a.appendChild(n)}const e=t.level>=2?ee.stronger:ee.gentle,i=this.overlayEl.querySelector("[data-frame-rate-hint-title]"),s=this.overlayEl.querySelector("[data-frame-rate-hint-detail]");i&&(i.textContent=e.title),s&&(s.textContent=e.detail),this.hideTimer!==null&&window.clearTimeout(this.hideTimer),this.hideTimer=window.setTimeout(()=>{this.hide()},Xi)}hide(){this.hideTimer!==null&&(window.clearTimeout(this.hideTimer),this.hideTimer=null),this.overlayEl?.remove(),this.overlayEl=null}dispose(){this.hide()}isVisible(){return this.overlayEl!==null}}class Ki{root=null;remainingEl=null;countEl=null;messageEl=null;resultEl=null;show(t){this.hide();const e=document.getElementById("ui-overlay");if(!e)return;const i=document.createElement("div");i.setAttribute("data-bonus-time-overlay",""),i.style.cssText=`
      position: absolute;
      inset: 0;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding: 1rem;
      pointer-events: none;
      z-index: 45;
      box-sizing: border-box;
    `;const s=document.createElement("section");s.style.cssText=`
      width: min(92vw, 560px);
      display: grid;
      gap: 0.45rem;
      padding: 0.95rem 1.1rem;
      border-radius: 28px;
      background: linear-gradient(180deg, rgba(39, 55, 132, 0.95), rgba(12, 20, 68, 0.96));
      border: 2px solid rgba(255, 255, 255, 0.18);
      box-shadow: 0 16px 34px rgba(0, 0, 0, 0.24);
      text-align: center;
      color: #fff;
      font-family: 'Zen Maru Gothic', sans-serif;
    `;const a=document.createElement("div");a.textContent="🌟 ボーナスタイム",a.style.cssText=`
      font-size: clamp(1.35rem, 4.5vmin, 1.8rem);
      font-weight: 900;
      color: #fff1a8;
    `;const n=document.createElement("div");n.style.cssText=`
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.6rem;
    `,this.remainingEl=document.createElement("div"),this.remainingEl.setAttribute("data-bonus-time-remaining",""),this.remainingEl.style.cssText=`
      padding: 0.55rem 0.75rem;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.12);
      font-size: clamp(1rem, 3.8vmin, 1.2rem);
      font-weight: 800;
    `,this.countEl=document.createElement("div"),this.countEl.setAttribute("data-bonus-time-count",""),this.countEl.style.cssText=this.remainingEl.style.cssText,this.messageEl=document.createElement("div"),this.messageEl.setAttribute("data-bonus-time-message",""),this.messageEl.style.cssText=`
      min-height: 1.6em;
      font-size: clamp(1rem, 3.6vmin, 1.25rem);
      font-weight: 800;
      color: #fff7bf;
    `,this.resultEl=document.createElement("div"),this.resultEl.setAttribute("data-bonus-time-result",""),this.resultEl.style.cssText=`
      display: none;
      padding: 0.65rem 0.8rem;
      border-radius: 22px;
      background: rgba(255, 255, 255, 0.12);
      font-size: clamp(1rem, 3.6vmin, 1.2rem);
      font-weight: 900;
      color: #ffe17a;
    `,n.append(this.remainingEl,this.countEl),s.append(a,n,this.messageEl,this.resultEl),i.appendChild(s),e.appendChild(i),this.root=i,this.update(t)}update(t){!this.root||!this.remainingEl||!this.countEl||!this.messageEl||(this.remainingEl.textContent=`あと ${Math.max(0,Math.ceil(t.remainingSeconds))}びょう`,this.countEl.textContent=`あつめた ほし ${Math.max(0,Math.floor(t.collectedStars))}こ`,this.messageEl.textContent=t.message)}showResult(t){!this.root||!this.resultEl||(this.resultEl.style.display="block",this.resultEl.textContent=t.message,this.update({remainingSeconds:0,collectedStars:t.collectedStars,message:"キラキラ はなび！"}))}hide(){this.root?.remove(),this.root=null,this.remainingEl=null,this.countEl=null,this.messageEl=null,this.resultEl=null}}const Pt=1,Qi=2e3,kt={starCollect:{duration:.09,amplitudeX:.04,amplitudeY:.025,frequency:34},rainbowCollect:{duration:.12,amplitudeX:.07,amplitudeY:.04,frequency:32},constellationCelebrate:{duration:.2,amplitudeX:.09,amplitudeY:.05,frequency:24},meteoriteHit:{duration:.28,amplitudeX:.18,amplitudeY:.12,frequency:42},boost:{duration:.14,amplitudeX:.08,amplitudeY:.045,frequency:28},stageClear:{duration:.3,amplitudeX:.1,amplitudeY:.06,frequency:22}};function Ji(l){const t=window.requestIdleCallback;if(typeof t=="function"){t(l,{timeout:1500});return}window.setTimeout(l,800)}class v{static VISUAL_QUALITY_SCALE_BY_TIER=[.45,.7,1];static BG_STAR_COUNT=Qi;static ASSIST_TRIGGER_HIT_WINDOW=6;static ASSIST_TRIGGER_HIT_COUNT=2;static ASSIST_DURATION=5;static ASSIST_MESSAGE_DURATION=3;static ASSIST_METEORITE_INTERVAL_MULTIPLIER=1.7;static ASSIST_MESSAGE="だいじょうぶ！ ゆっくりいこう ✨";static ASSIST_DIRECTION_REFRESH_INTERVAL=.35;static ASSIST_DIRECTION_LOOKAHEAD=42;static ASSIST_DIRECTION_SIDE_TARGET_X=4.5;static ASSIST_DIRECTION_SIDE_RANGE=7.5;static ASSIST_DIRECTION_DIFF_THRESHOLD=1.1;static ASSIST_DIRECTION_DIFF_RATIO=.28;static AUTO_PERFORMANCE_LEVEL_MAX=v.VISUAL_QUALITY_SCALE_BY_TIER.length-1;threeScene;camera;lastAspect=0;initialized=!1;sceneManager;inputSystem;audioManager;saveManager;ambientLight;directionalLight;spaceship;stars=[];meteorites=[];shootingStars=[];comets=[];specialShootingStars=[];monthlyEncounters=[];spaceGems=[];collisionSystem=new Se;scoreSystem=new Ee;spawnSystem=new xe;boostSystem=new Ce;lodSystem=new we;meteoShowerEventSystem=new Te;stageSpecialEventSystem=new Ae;spaceWeatherEventSystem=new Me;specialStarSpawnSystem=new Pe;seasonalEventSystem;monthlyEncounterSystem=new ke;hud;scorePopupManager=new q;scorePopupEffect=new Be;particleBurstManager=new Re;planetRingEffect=new Oe;constellationLineEffect=new Ie;constellationCelebrationEffect=new De;constellationSystem=new Le;constellationHintOverlay=new R;airShield;meteoShowerEffect;spaceWeatherEffect;stageSpecialEffects;seasonalEventEffects=new Ge;monthlyEncounterEffect=new Fe;spaceGemCollectionEffect=new ze;lovelyStarBurstEffect=new He;starBonusEffect=new Ne;rainbowTrailEffect;stageAtmosphereEffect=new oe;wormholeTunnelEffect=new _e;seasonalEventNotice=new Yi;bonusTimeOverlay=new Ki;bonusCollectionSystem=new $e;stageConfig;stageNumber=1;launchSource="campaign";isCleared=!1;clearTimer=0;stageClearOverlay=new Zi;isClearRewardOpen=!1;isOpeningClearReward=!1;clearRewardOverlay=null;clearRewardOverlayPromise=null;static CLEAR_CONTINUE_DELAY=.6;static BONUS_TIME_DURATION=10;static BONUS_RESULT_DURATION=2.2;stageEntryTotalScore=0;stageEntryTotalStarCount=0;isBonusTime=!1;isBonusResultVisible=!1;bonusTimeRemaining=0;bonusCollectedStars=0;bonusResultTimer=0;playTime=0;meteoriteHitTimes=[];assistTimer=0;assistMessageTimer=0;assistDirection=null;assistDirectionRefreshTimer=0;damageTimer=0;static DAMAGE_FLASH_DURATION=.5;cameraShakeTimer=0;cameraShakeElapsed=0;cameraShakeOffset=new W;cameraShakeProfile=kt.meteoriteHit;visualFeedbackOverlay=null;activeVisualFeedback=null;motionSensitivity=X();cameraPositionTarget=new W(0,5,10);cameraLookAtTarget=new W(0,0,-10);destinationPlanet=null;destinationPlanetSpinTarget=null;static DESTINATION_PLANET_SPIN_SPEED=.2;static BOOST_HINT_DURATION=2.4;static ADAPTIVE_HINT_DURATION=3;static SHOOTING_STAR_SCORE_BONUS_DURATION=6;static LOVELY_STAR_SCORE_BONUS_DURATION=3;static LOVELY_STAR_BONUS_SCORE=200;static METEO_SHOWER_MESSAGE="りゅうせいぐんだ！ ✨";static METEO_SHOWER_MESSAGE_DURATION=2.4;static STAGE_SPECIAL_MESSAGE_DURATION=2.8;static WORMHOLE_TRANSITION_DURATION=2.2;bgStars=null;boostLinesEffect;companionManager=null;elapsedTime=0;boostFlameEffect;isStarting=!1;stageIntroOverlay=null;countdownOverlay=null;awaitingResume=!1;resumeCountdownOverlay=null;isHomeConfirmOpen=!1;shouldResumeAfterHomeConfirm=!1;pauseOverlay=new ge;isPauseOpen=!1;shouldResumeAfterPause=!1;touchGuide=new ji;touchFeedbackOverlay=new K;touchGuideMode="intro";touchGuideIdleTimer=0;hasSeenMoveInput=!1;isActive=!1;boostHintDisplayTimer=0;adaptiveHintDisplayTimer=0;adaptiveTutorialSystem=new Ve;adaptiveTutorialHint=new Ni;meteoShowerAnnouncementTimer=0;spaceWeatherAnnouncementTimer=0;spaceWeatherAnnouncementMessage="";stageSpecialAnnouncementTimer=0;stageSpecialAnnouncementMessage="";prewarmRequestToken=0;static TOUCH_GUIDE_IDLE_DELAY=3;visualQualityTier=v.VISUAL_QUALITY_SCALE_BY_TIER.length-1;performanceAdaptationLevel=0;autoPerformanceAdaptationLevel=0;frameRateHintOverlay=new qi;frameRateMonitor=new Ue(60);autoPerformanceManager;scheduleIdleTask;loadEncyclopediaOverlay;clearRewardRequestToken=0;wormholeTransitionTimer=0;pendingWormholeTransition=null;onPauseRequested=null;onResumeRequested=null;onExitHomeRequested=null;attemptStatsRecorded=!1;constructor(t,e,i,s,a={}){this.sceneManager=t,this.inputSystem=e,this.audioManager=i,this.saveManager=s,this.scoreSystem.setScoreGainListener(c=>{this.initialized&&this.hud.animateScoreGain(c.amount,c.stageScore),c.worldPosition&&(this.scorePopupEffect.emit(c.worldPosition,c.amount),c.kind==="bonus"&&this.scorePopupManager.show(c.amount,c.worldPosition,this.camera))}),this.scheduleIdleTask=a.scheduleIdleTask??Ji,this.seasonalEventSystem=new je(a.seasonalEventDateProvider),this.autoPerformanceManager=new We(v.AUTO_PERFORMANCE_LEVEL_MAX,({level:c,direction:u})=>{this.autoPerformanceAdaptationLevel=c,this.applyVisualQualityTier(),u==="degraded"&&this.showFrameRateHint(this.getCombinedPerformanceAdaptationLevel())}),this.loadEncyclopediaOverlay=a.loadEncyclopediaOverlay??(()=>Bt(()=>import("./EncyclopediaOverlay-C94utvHg.js"),__vite__mapDeps([0,1,2]))),this.threeScene=new ct,this.threeScene.background=new ht(32);const{width:n,height:o}=H();this.camera=new xt(60,n/o,.1,2e3)}ensureInitialized(){this.initialized||(this.ambientLight=new Et(16777215,.6),this.directionalLight=new ce(16777215,.8),this.directionalLight.position.set(5,10,5),this.threeScene.add(this.ambientLight),this.threeScene.add(this.directionalLight),this.spaceship=new re,this.threeScene.add(this.spaceship.mesh),this.airShield=new Ye,this.threeScene.add(this.airShield.getMesh()),this.companionManager=new Dt([]),this.threeScene.add(this.companionManager.getGroup()),this.boostLinesEffect=new Ze,this.boostLinesEffect.init(this.threeScene),this.boostFlameEffect=new Xe,this.boostFlameEffect.init(this.threeScene),this.rainbowTrailEffect=new qe,this.threeScene.add(this.rainbowTrailEffect.group),this.constellationLineEffect.init(this.threeScene),this.constellationCelebrationEffect.init(this.threeScene),this.meteoShowerEffect=new Ke,this.meteoShowerEffect.init(this.threeScene),this.spaceWeatherEffect=new Qe,this.spaceWeatherEffect.init(this.threeScene),this.stageSpecialEffects=new Je,this.stageSpecialEffects.init(this.threeScene),this.seasonalEventEffects.init(this.threeScene),this.stageAtmosphereEffect.init(this.threeScene),this.wormholeTunnelEffect.init(this.threeScene),this.scorePopupEffect.init(this.threeScene),this.monthlyEncounterEffect.init(this.threeScene),this.spaceGemCollectionEffect.init(this.threeScene),this.lovelyStarBurstEffect.init(this.threeScene),this.starBonusEffect.init(this.threeScene),this.hud=new Hi,this.initialized=!0,this.applyVisualQualityTier())}setVisualQualityTier(t){this.visualQualityTier=v.clampVisualQualityTier(t),this.applyVisualQualityTier()}setPerformanceAdaptationLevel(t){this.performanceAdaptationLevel=v.clampPerformanceAdaptationLevel(t),this.applyVisualQualityTier()}showFrameRateHint(t){this.isActive&&this.frameRateHintOverlay.show({level:t})}enter(t){this.ensureInitialized(),this.isActive=!0,this.prewarmRequestToken+=1,this.clearRewardRequestToken+=1,this.lastAspect=0,this.stageNumber=t.stageNumber??1,this.launchSource=t.launchSource??"campaign",this.stageConfig=Q(this.stageNumber),this.prefetchEndingSceneModuleIfNeeded(),this.isCleared=!1,this.clearTimer=0,this.isBonusTime=!1,this.isBonusResultVisible=!1,this.bonusTimeRemaining=0,this.bonusCollectedStars=0,this.bonusResultTimer=0,this.bonusCollectionSystem.reset(),this.bonusTimeOverlay.hide(),this.starBonusEffect.clear(),this.stageClearOverlay.hide(),this.isClearRewardOpen=!1,this.isOpeningClearReward=!1,this.wormholeTransitionTimer=0,this.pendingWormholeTransition=null,this.wormholeTunnelEffect.clear(),this.damageTimer=0,this.activeVisualFeedback=null,this.ensureVisualFeedbackOverlay(),this.updateVisualFeedbackOverlay(0,"transparent"),this.elapsedTime=0,this.destinationPlanetSpinTarget=null,this.planetRingEffect.clear(),this.isHomeConfirmOpen=!1,this.shouldResumeAfterHomeConfirm=!1,this.isPauseOpen=!1,this.shouldResumeAfterPause=!1,this.pauseOverlay.hide(),this.touchGuideIdleTimer=0,this.hasSeenMoveInput=!1,this.touchGuideMode="intro",this.playTime=0,this.attemptStatsRecorded=!1,this.frameRateMonitor.reset(),this.autoPerformanceManager.reset(!0),this.meteoriteHitTimes.length=0,this.meteoShowerAnnouncementTimer=0,this.spaceWeatherAnnouncementTimer=0,this.spaceWeatherAnnouncementMessage="",this.stageSpecialAnnouncementTimer=0,this.stageSpecialAnnouncementMessage="",this.assistTimer=0,this.assistMessageTimer=0,this.assistDirection=null,this.assistDirectionRefreshTimer=0,this.adaptiveTutorialSystem.reset(),this.adaptiveHintDisplayTimer=0,this.adaptiveTutorialHint.hide(),this.meteoShowerEventSystem.reset(),this.spaceWeatherEventSystem.reset(),this.stageSpecialEventSystem.setStage(ti(this.stageNumber)),this.meteoShowerEffect.clear(),this.spaceWeatherEffect.clear(),this.stageSpecialEffects.clear(),this.resetBoostHintState();const e=t.totalScore??0,i=t.totalStarCount??0,s=this.saveManager.load();this.spaceship.applyCustomization(s.spaceshipCustomization??It);const a=s.colorAccessibility?.highContrast===!0;this.motionSensitivity=s.colorAccessibility?.motionSensitivity??X();const n=s.colorAccessibility?.colorVisionSupportMode??j;se(s.visualFeedbackSettings?.intensity??"medium"),Vt(f=>this.handleVisualFeedback(f)),ri(a),li(n),Rt(n),ci(a),this.hud.setHighContrastMode(a),this.scorePopupManager.setHighContrastMode(a),this.adaptiveTutorialHint.setHighContrastMode(a),this.constellationHintOverlay.setHighContrastMode(a),this.constellationHintOverlay.setMotionSensitivity(this.motionSensitivity),this.seasonalEventNotice.setHighContrastMode(a),this.stageEntryTotalScore=e,this.stageEntryTotalStarCount=i,this.scoreSystem.setTotalScore(e),this.scoreSystem.setTotalStarCount(i),this.resetStageObjects(),this.spaceship.reset(),this.inputSystem.resetPointers?.(),this.airShield.reset(0,0,0),this.boostLinesEffect.update(!1,0,0),this.boostFlameEffect.remove(),this.rainbowTrailEffect.clear(),this.companionManager?.resetUnlockedPlanets([]),this.createBackground(),this.stageAtmosphereEffect.start(le(this.stageNumber)),this.applyMotionSensitivity(),this.applyVisualQualityTier();const o=this.seasonalEventSystem.refresh();o&&(this.seasonalEventEffects.start(o),this.seasonalEventNotice.show(o)),this.camera.position.set(0,5,10),this.camera.lookAt(0,0,-10),this.cameraLookAtTarget.set(0,0,-10),this.createDestinationPlanet(),this.scheduleNextStageVisualPrewarm(),this.stars.length=0,this.meteorites.length=0,this.shootingStars.length=0,this.comets.length=0,this.specialShootingStars.length=0,this.monthlyEncounters.length=0,this.spawnSystem.reset(),this.spawnSystem.setMeteoriteIntervalMultiplier(1),this.specialStarSpawnSystem.reset(),this.monthlyEncounterSystem.reset(),this.boostSystem.reset(),this.scoreSystem.resetStage(),this.constellationSystem.reset(ei(this.stageNumber)),this.constellationLineEffect.clear(),this.constellationCelebrationEffect.clear(),this.spawnConstellationStars();const c=this.constellationSystem.getDefinition();c?this.constellationHintOverlay.showGuide(c,this.constellationSystem.getCollectedCount()):this.constellationHintOverlay.hide();const u=ae(this.stageNumber,this.stageConfig.destinationReading,n),m=`ステージ${this.stageConfig.stageNumber}: ${this.stageConfig.emoji} ${u}を めざせ！`;this.hud.show(m,this.stageConfig.planetColor),this.ensureVisualFeedbackOverlay(),this.touchFeedbackOverlay.setMotionSensitivity(this.motionSensitivity),this.touchFeedbackOverlay.attach(),this.touchFeedbackOverlay.bindUiRoots([document.getElementById("hud"),document.getElementById("ui-overlay")]),this.inputSystem.setTouchFeedbackOverlay?.(this.touchFeedbackOverlay),this.hud.setBoostCallback(()=>{this.inputSystem.setBoostPressed(!0)}),this.hud.setBoostDeniedCallback(()=>{this.audioManager.playSFX("boostDenied")}),this.hud.setHomeCallback(()=>{this.isHomeConfirmOpen=!1,this.shouldResumeAfterHomeConfirm=!1,this.syncBoostInputLock(),this.syncPauseAvailability(),this.sceneManager.requestTransition("title")}),this.hud.setHomeConfirmOpenCallback(()=>{this.shouldResumeAfterHomeConfirm=this.isPlaying(),this.clearBlockedGameplayInput(),this.isHomeConfirmOpen=!0,this.syncBoostInputLock(),this.syncPauseAvailability()}),this.hud.setHomeConfirmCancelCallback(()=>{const f=this.shouldResumeAfterHomeConfirm;if(this.isHomeConfirmOpen=!1,this.shouldResumeAfterHomeConfirm=!1,this.syncPauseAvailability(),f){this.requestResumeCountdown();return}this.syncBoostInputLock()}),this.hud.setPauseCallback(()=>{this.requestManualPause()}),this.hud.setMuteState(this.audioManager.isMuted()),this.hud.setMuteCallback(()=>{const f=this.audioManager.toggleMute();this.hud.setMuteState(f);const b=this.saveManager.load();b.muted=f,this.saveManager.save(b)}),this.hud.update(this.scoreSystem.getStageScore(),this.scoreSystem.getStarCount()),this.hud.hideAssistMessage(),this.adaptiveTutorialHint.hide(),this.touchGuide.show("intro"),this.syncPauseAvailability(),this.hud.setBestStarCount(s.bestStageStars?.[this.stageNumber]??0),this.companionManager?.resetUnlockedPlanets(s.unlockedPlanets),this.bgStars&&ft(this.bgStars,this.spaceship.position.z,Pt),this.audioManager.playBGM(this.stageNumber),this.stageIntroOverlay?.dispose(),this.stageIntroOverlay=null,this.startOpeningSequence(t)}prefetchEndingSceneModuleIfNeeded(){if(this.stageNumber<z-1)return;this.sceneManager.prefetchSceneModule?.call(this.sceneManager,"ending")?.catch(()=>{})}startOpeningSequence(t){if(this.isStarting=!0,this.syncBoostInputLock(),this.syncPauseAvailability(),!this.shouldShowStageIntro(t)){this.startCountdown();return}const e=gt(this.stageNumber);if(!e){this.startCountdown();return}this.stageIntroOverlay=new Ui(e),this.stageIntroOverlay.show(()=>{this.stageIntroOverlay=null,this.startCountdown()})}startCountdown(){if(this.isStarting=!0,this.syncBoostInputLock(),this.syncPauseAvailability(),this.shouldSkipCountdown()){this.isStarting=!1,this.countdownOverlay=null,this.syncBoostInputLock(),this.syncPauseAvailability();return}this.countdownOverlay=new te({onTick:()=>{this.audioManager.playSFX("countdownTick")},onGo:()=>{this.audioManager.playSFX("countdownGo")}}),this.countdownOverlay.show(()=>{this.isStarting=!1,this.countdownOverlay=null,this.syncBoostInputLock(),this.syncPauseAvailability()})}shouldShowStageIntro(t){return this.shouldSkipCountdown()||this.launchSource!=="campaign"||t.replayToken!==void 0||t.totalScore===void 0||t.totalStarCount===void 0?!1:gt(this.stageNumber)!==void 0}releasePointerInputForLock(){this.inputSystem.resetPointers?.()}syncBoostInputLock(){const t=this.isStarting||this.awaitingResume||this.isHomeConfirmOpen||this.isPauseOpen||this.isBonusTime||this.isBonusResultVisible;this.hud.setBoostLocked(t),t&&(this.resetBoostHintState(),this.inputSystem.setBoostPressed?.(!1))}clearBlockedGameplayInput(){this.inputSystem.resetPointers?.(),this.inputSystem.setBoostPressed?.(!1)}syncPauseAvailability(){this.hud.setPauseEnabled(this.canPause())}shouldSkipCountdown(){try{return new URLSearchParams(window.location.search).get("nocount")==="1"}catch{return!1}}isPlaying(){return!(!this.stageConfig||this.isCleared||this.isClearRewardOpen||this.isOpeningClearReward||this.isBonusTime||this.isBonusResultVisible||this.isStarting||this.awaitingResume||this.isHomeConfirmOpen||this.isPauseOpen)}isUserPaused(){return this.isPauseOpen}requestResumeCountdown(){this.isPlaying()&&(this.resumeCountdownOverlay||this.shouldSkipCountdown()||(this.clearBlockedGameplayInput(),this.awaitingResume=!0,this.syncBoostInputLock(),this.syncPauseAvailability(),this.resumeCountdownOverlay=new te({onTick:()=>{this.audioManager.playSFX("countdownTick")},onGo:()=>{this.audioManager.playSFX("countdownGo")}}),this.resumeCountdownOverlay.show(()=>{this.awaitingResume=!1,this.resumeCountdownOverlay=null,this.syncBoostInputLock(),this.syncPauseAvailability()})))}setPauseHandlers(t){this.onPauseRequested=t.onPauseRequested??null,this.onResumeRequested=t.onResumeRequested??null,this.onExitHomeRequested=t.onExitHomeRequested??null}isManuallyPaused(){return this.isPauseOpen}requestManualPause(){this.canPause()&&(this.clearBlockedGameplayInput(),this.isPauseOpen=!0,this.syncBoostInputLock(),this.syncPauseAvailability(),this.pauseOverlay.show(()=>{this.isPauseOpen=!1,this.syncBoostInputLock(),this.syncPauseAvailability(),this.onResumeRequested?.()},()=>{this.isPauseOpen=!1,this.syncBoostInputLock(),this.syncPauseAvailability(),this.onExitHomeRequested?.()}),this.onPauseRequested?.())}canPause(){return!(!this.stageConfig||this.isCleared||this.isClearRewardOpen||this.isOpeningClearReward||this.isBonusTime||this.isBonusResultVisible||this.isStarting||this.awaitingResume||this.isHomeConfirmOpen||this.isPauseOpen)}createBackground(){this.bgStars||(this.bgStars=me(this.getBackgroundStarDrawCount()),this.threeScene.add(this.bgStars))}createDestinationPlanet(){this.removeDestinationPlanet();const t=-(this.stageConfig.stageLength+50),{planet:e,spinTarget:i}=de(this.stageNumber,this.stageConfig,t);this.destinationPlanet=e,this.destinationPlanetSpinTarget=i,this.threeScene.add(this.destinationPlanet)}scheduleNextStageVisualPrewarm(){const t=this.stageNumber+1;if(t>z)return;const e=this.prewarmRequestToken;this.scheduleIdleTask(()=>{!this.isActive||this.prewarmRequestToken!==e||_t(t)})}removeDestinationPlanet(){this.destinationPlanet&&(this.destinationPlanet.parent?.remove(this.destinationPlanet),this.destinationPlanet=null,this.destinationPlanetSpinTarget=null)}resetStageObjects(){this.clearRewardOverlay?.hide(),this.stageClearOverlay.hide(),this.bonusTimeOverlay.hide(),this.starBonusEffect.clear(),this.bonusCollectionSystem.reset(),this.isBonusTime=!1,this.isBonusResultVisible=!1,this.bonusTimeRemaining=0,this.bonusCollectedStars=0,this.bonusResultTimer=0,this.isClearRewardOpen=!1,this.isOpeningClearReward=!1,this.removeDestinationPlanet(),this.resetCameraShake(),this.planetRingEffect.clear(),this.scorePopupEffect.clear(),this.particleBurstManager.clear(this.threeScene),this.lovelyStarBurstEffect.clear(),this.spawnSystem.recycleAll(),this.spawnSystem.setMeteoriteIntervalMultiplier(1),this.meteoShowerEventSystem.reset(),this.meteoShowerEffect.clear(),this.meteoShowerAnnouncementTimer=0,this.spaceWeatherEventSystem.reset(),this.spaceWeatherEffect.clear(),this.spaceWeatherAnnouncementTimer=0,this.spaceWeatherAnnouncementMessage="",this.stageSpecialEventSystem.reset(),this.stageSpecialEffects.clear(),this.seasonalEventSystem.clear(),this.seasonalEventEffects.clear(),this.monthlyEncounterEffect.clear(),this.spaceGemCollectionEffect.clear(),this.stageAtmosphereEffect.clear(),this.wormholeTunnelEffect.clear(),this.wormholeTransitionTimer=0,this.pendingWormholeTransition=null,this.rainbowTrailEffect.clear(),this.stageSpecialAnnouncementTimer=0,this.stageSpecialAnnouncementMessage="",this.seasonalEventNotice.hide(),this.stars.length=0,this.meteorites.length=0,this.shootingStars.length=0,this.comets.length=0,this.specialShootingStars.length=0,this.monthlyEncounters.length=0,this.spaceGems.length=0,this.specialStarSpawnSystem.recycleAll(),this.specialStarSpawnSystem.reset(),this.monthlyEncounterSystem.recycleAll(),this.monthlyEncounterSystem.reset(),this.hud?.hideAssistMessage(),this.constellationHintOverlay.hide(),this.constellationLineEffect.clear(),this.constellationCelebrationEffect.clear(),this.constellationSystem.reset(),this.resetBoostHintState()}update(t){if(!this.initialized)return;if(this.updateAutoPerformanceMonitoring(t),this.isCleared)return this.resetBoostHintState(),this.clearTimer+=t,this.updateBonusTime(t),this.seasonalEventNotice.tick(t),this.constellationHintOverlay.tick(t),this.updateConstellationHintOverlay(),this.constellationLineEffect.update(t),this.constellationCelebrationEffect.update(t),this.planetRingEffect.update(t),this.monthlyEncounterEffect.update(t),this.spaceGemCollectionEffect.update(t),this.lovelyStarBurstEffect.update(t),this.scorePopupEffect.update(t),this.particleBurstManager.update(this.threeScene,t),this.companionManager?.update(t,this.spaceship.position.x,this.spaceship.position.y,this.spaceship.position.z),this.destinationPlanetSpinTarget&&(this.destinationPlanetSpinTarget.rotation.y+=t*v.DESTINATION_PLANET_SPIN_SPEED),this.seasonalEventEffects.update(t,this.spaceship.position.x,this.spaceship.position.z),this.pendingWormholeTransition||this.revealClearActionButtonsIfReady(),this.stageAtmosphereEffect.update(t,this.camera,this.spaceship.position.x,this.spaceship.position.z),this.updateWormholeTransition(t),void 0;if(this.isStarting||this.awaitingResume||this.isHomeConfirmOpen||this.isPauseOpen){if(this.resetBoostHintState(),this.hideAdaptiveTutorialHint(),this.seasonalEventNotice.tick(t),this.inputSystem.setBoostPressed?.(!1),!this.isHomeConfirmOpen&&!this.isPauseOpen){const r=this.stageIntroOverlay?.isActive()??!1;this.stageIntroOverlay?.tick(t),r||this.countdownOverlay?.tick(t),this.resumeCountdownOverlay?.tick(t)}this.destinationPlanetSpinTarget&&(this.destinationPlanetSpinTarget.rotation.y+=t*v.DESTINATION_PLANET_SPIN_SPEED),this.bgStars&&ft(this.bgStars,this.spaceship.position.z,Pt),this.airShield.setPosition(this.spaceship.position.x,this.spaceship.position.y,this.spaceship.position.z),this.airShield.update(t),this.hud.update(this.scoreSystem.getStageScore(),this.scoreSystem.getStarCount()),this.constellationHintOverlay.tick(t),this.updateConstellationHintOverlay(),this.constellationLineEffect.update(t),this.constellationCelebrationEffect.update(t),this.seasonalEventEffects.update(t,this.spaceship.position.x,this.spaceship.position.z),this.monthlyEncounterEffect.update(t),this.lovelyStarBurstEffect.update(t),this.stageAtmosphereEffect.update(t,this.camera,this.spaceship.position.x,this.spaceship.position.z);return}const e=this.inputSystem.getState();this.playTime+=t,this.seasonalEventNotice.tick(t),this.updateAssistTimers(t),this.updateMeteoShowerAnnouncement(t),this.updateSpaceWeatherAnnouncement(t),this.updateStageSpecialAnnouncement(t),this.updateAdaptiveHintDisplay(t),this.updateBoostHintDisplay(t),this.updateTouchGuide(e.moveDirection,t);const i=this.boostSystem.isActive(),s=this.boostSystem.isAvailable();e.boostPressed&&(this.boostSystem.activate()?(this.adaptiveTutorialSystem.recordBoostUsed(),this.audioManager.playSFX("boost"),Y("boost"),this.audioManager.startBoostSFX(),this.boostFlameEffect.start()):this.audioManager.playSFX("boostDenied"),this.inputSystem.setBoostPressed(!1)),this.boostSystem.update(t),i&&!this.boostSystem.isActive()&&(this.audioManager.stopBoostSFX(),this.boostFlameEffect.stopEmitting()),!s&&this.boostSystem.isAvailable()&&(this.audioManager.playSFX("boostReady"),this.hud.flashBoostReady()),this.boostSystem.isActive()&&this.spaceship.speedState!=="BOOST"&&this.spaceship.activateBoost(),e.moveDirection===-1?this.spaceship.moveLeft(t):e.moveDirection===1&&this.spaceship.moveRight(t),this.spaceship.update(t),this.seasonalEventEffects.update(t,this.spaceship.position.x,this.spaceship.position.z);const a=this.spaceship.getProgress(this.stageConfig.stageLength),n=this.stageSpecialEventSystem.update(a,t);n.started&&n.event&&(this.stageSpecialEffects.start(n.event),this.showStageSpecialAnnouncement(n.event.message));const o=this.meteoShowerEventSystem.update(t);o.started&&(this.audioManager.playSFX("meteorShowerStart"),this.meteoShowerEffect.start(),this.showMeteoShowerAnnouncement());const c=this.spaceWeatherEventSystem.update(t);this.scoreSystem.setEventStarMultiplier?.(c.active&&c.event?c.event.starScoreMultiplier:1),c.started&&c.event&&(this.spaceWeatherEffect.start(c.event),this.showSpaceWeatherAnnouncement(c.event.message));const u=this.spawnSystem.update(t,this.spaceship.position.z,this.stageConfig,this.stars,this.meteorites,this.shootingStars,this.comets,{meteoShowerActive:o.active},this.spaceGems);for(const r of u.newStars)this.stars.push(r),this.threeScene.add(r.mesh);for(const r of u.newMeteorites)this.meteorites.push(r),this.threeScene.add(r.mesh);for(const r of u.newShootingStars)this.shootingStars.push(r),this.threeScene.add(r.mesh);for(const r of u.newComets)this.comets.push(r),this.threeScene.add(r.mesh);for(const r of u.newSpaceGems)this.spaceGems.push(r),this.threeScene.add(r.mesh);const m=this.specialStarSpawnSystem.update(t,this.spaceship.position.z,this.specialShootingStars,this.shootingStars,this.comets);for(const r of m.newSpecialStars)this.specialShootingStars.push(r),this.threeScene.add(r.mesh);const f=this.monthlyEncounterSystem.update(t,this.spaceship.position.z,this.monthlyEncounters,this.specialShootingStars,this.shootingStars,this.comets);for(const r of f.newMonthlyEncounters)this.monthlyEncounters.push(r),this.threeScene.add(r.mesh);this.lodSystem.update(this.spaceship.position,this.stars),this.lodSystem.update(this.spaceship.position,this.meteorites),this.companionManager?.update(t,this.spaceship.position.x,this.spaceship.position.y,this.spaceship.position.z);const b=this.companionManager?.getStarAttractionBonus()??0,g=this.collisionSystem.check(this.spaceship,this.stars,this.meteorites,b,this.shootingStars,this.comets,this.specialShootingStars,this.monthlyEncounters,this.spaceGems);if(g.shootingStarHit){const r=g.shootingStarHit;this.scoreSystem.addBonusScore(r.scoreBonus,r.position),this.scoreSystem.activateShootingStarBonus(Math.max(v.SHOOTING_STAR_SCORE_BONUS_DURATION,r.bonusDuration)),this.audioManager.playSFX("shootingStarCollect"),this.scorePopupManager.showLabel("☆ながれぼし☆",r.position,this.camera,"shooting-star"),this.particleBurstManager.emitShootingStar(this.threeScene,r.position.x,r.position.y,r.position.z)}if(g.cometHit){const r=g.cometHit;this.scoreSystem.addBonusScore(r.scoreBonus,r.position),this.scoreSystem.activateShootingStarBonus(r.bonusDuration),this.audioManager.playSFX("cometCollect"),this.particleBurstManager.emit(this.threeScene,r.position.x,r.position.y,r.position.z,12447743,50,!0),this.particleBurstManager.emit(this.threeScene,r.position.x,r.position.y,r.position.z,16777215,50,!0)}if(g.specialShootingStarHit){const r=g.specialShootingStarHit,d=ii(r.specialType),S=this.saveManager.markSpecialStarDiscovered?.(r.specialType)??!1;this.scoreSystem.addBonusScore(r.scoreBonus,r.position),this.audioManager.playSFX("shootingStarCollect"),Y("rainbowCollect"),this.particleBurstManager.emitShootingStar(this.threeScene,r.position.x,r.position.y,r.position.z),this.particleBurstManager.emit(this.threeScene,r.position.x,r.position.y,r.position.z,Tt[r.specialType].visual.trailColor,50,!0),this.particleBurstManager.emit(this.threeScene,r.position.x,r.position.y,r.position.z,Tt[r.specialType].visual.auraColor,50,!0),this.scorePopupManager.showLabel(S&&d?`${d.emoji} ${d.reading}`:Tt[r.specialType].label,r.position,this.camera,"special-star")}if(g.monthlyEncounterHit){const r=g.monthlyEncounterHit,d=si(r.encounterId),S=this.saveManager.markMonthlyEncounterDiscovered?.(r.encounterId)??!1;this.scoreSystem.addBonusScore(r.scoreBonus,r.position),this.audioManager.playSFX("shootingStarCollect"),Y("rainbowCollect"),this.monthlyEncounterEffect.emit(r.position,d?.accentColor??16777215),this.particleBurstManager.emitShootingStar(this.threeScene,r.position.x,r.position.y,r.position.z),this.scorePopupManager.showLabel(S?"✨ あたらしい てんたい はっけん！":`${d?.emoji??"✨"} ${d?.reading??"てんたい"}`,r.position,this.camera,"monthly-encounter")}if(g.spaceGemHit){const r=g.spaceGemHit,d=ai(r.gemType),S=ni[r.gemType],x=this.saveManager.markSpaceGemDiscovered?.(r.gemType)??!1;this.scoreSystem.addBonusScore(r.scoreBonus,r.position),this.audioManager.playSFX("spaceGemCollect"),Y("constellationCelebrate"),this.spaceGemCollectionEffect.emit(r.position,S.visual.glowColor),this.particleBurstManager.emit(this.threeScene,r.position.x,r.position.y,r.position.z,S.visual.particleColor,50,!0),this.particleBurstManager.emit(this.threeScene,r.position.x,r.position.y,r.position.z,S.visual.ringColor,40,!0),this.scorePopupManager.showLabel(x&&d?`${d.emoji} ${d.reading}`:S.pickupLabel,r.position,this.camera,"space-gem")}for(const r of g.starCollisions)this.scoreSystem.addStarScore(r.starType,r.position),r.starType==="LOVELY"?(this.scoreSystem.addBonusScore(v.LOVELY_STAR_BONUS_SCORE,r.position),this.scoreSystem.activateShootingStarBonus(v.LOVELY_STAR_SCORE_BONUS_DURATION),this.audioManager.playSFX("lovelyCollect"),this.lovelyStarBurstEffect.emit(r.position),this.scorePopupManager.showLabel("💖 ラブリースター！",r.position,this.camera,"lovely-star")):r.starType==="RAINBOW"?(this.audioManager.playSFX("rainbowCollect"),this.rainbowTrailEffect.start(this.spaceship.position),this.particleBurstManager.emit(this.threeScene,r.position.x,r.position.y,r.position.z,16768256,50,!0)):(this.audioManager.playSFX("starCollect"),this.particleBurstManager.emit(this.threeScene,r.position.x,r.position.y,r.position.z,16768256,20,!1)),this.handleConstellationStarCollected(r);if(g.meteoriteCollision){if(g.meteoriteHit){const r=g.meteoriteHit;typeof r.handleCollision=="function"?r.handleCollision():(r.isActive=!1,r.mesh.visible=!1,Y("meteoriteHit")),this.particleBurstManager.emit(this.threeScene,r.position.x,r.position.y,r.position.z,16755268,24,!1)}this.spaceship.onMeteoriteHit(),this.hud.announceMeteoriteHit(),this.recordMeteoriteHit(),this.boostSystem.cancel(),this.damageTimer=v.DAMAGE_FLASH_DURATION,this.startCameraShake("meteoriteHit"),this.audioManager.playSFX("meteoriteHit"),this.audioManager.stopBoostSFX(),this.boostFlameEffect.remove()}this.updateDamageEffect(t),this.updateVisualFeedback(t),this.cleanupPassedObjects(t),this.updateAdaptiveTutorial(e.moveDirection,t),this.updateCameraFollow(t),this.stageAtmosphereEffect.update(t,this.camera,this.spaceship.position.x,this.spaceship.position.z),this.monthlyEncounterEffect.update(t),this.spaceGemCollectionEffect.update(t),this.rainbowTrailEffect.update(t,this.spaceship.position);for(const r of g.starCollisions)this.scorePopupManager.show(r.scoreValue,r.position,this.camera,r.starType);if(this.stageNumber===10&&this.destinationPlanet){const r=1+Math.sin(this.elapsedTime*2)*.05;this.destinationPlanet.scale.set(r,r,r)}this.destinationPlanetSpinTarget&&(this.destinationPlanetSpinTarget.rotation.y+=t*v.DESTINATION_PLANET_SPIN_SPEED),this.elapsedTime+=t,this.bgStars&&ft(this.bgStars,this.spaceship.position.z,Pt),this.meteoShowerEffect.update(o.active,t,this.spaceship.position.x,this.spaceship.position.z),this.stageSpecialEffects.update(n.active,t,this.spaceship.position.x,this.spaceship.position.z),this.spaceWeatherEffect.update(c.active,t,this.spaceship.position.x,this.spaceship.position.z),this.boostLinesEffect.update(this.boostSystem.isActive(),this.spaceship.position.x,this.spaceship.position.z),this.boostSystem.isActive()&&this.boostFlameEffect.emit(this.spaceship.position,this.boostSystem.getDurationProgress()),this.boostFlameEffect.update(t),this.airShield.setPosition(this.spaceship.position.x,this.spaceship.position.y,this.spaceship.position.z),this.boostSystem.isActive()?this.airShield.setShieldMode("BOOST"):this.spaceship.speedState==="SLOWDOWN"?this.airShield.setShieldMode("INVINCIBLE",1):this.spaceship.speedState==="RECOVERING"?this.airShield.setShieldMode("INVINCIBLE",this.spaceship.getSpeedStateRemainingRatio()):this.airShield.setShieldMode("OFF"),this.airShield.update(t),this.scorePopupEffect.update(t),this.lovelyStarBurstEffect.update(t),this.particleBurstManager.update(this.threeScene,t),this.scoreSystem.update(t),this.constellationLineEffect.update(t),this.constellationCelebrationEffect.update(t),this.constellationHintOverlay.tick(t),this.updateConstellationHintOverlay(),this.hud.update(this.scoreSystem.getStageScore(),this.scoreSystem.getStarCount()),this.hud.updateCooldown(this.boostSystem.getCooldownProgress()),this.hud.updateStageProgress(a),a>=1&&this.onStageClear()}updateTouchGuide(t,e){if(this.assistTimer>0){this.setTouchGuideMode(this.getAssistTouchGuideMode());return}if(t!==0){this.touchGuideIdleTimer=0,this.hasSeenMoveInput=!0,this.setTouchGuideMode(t<0?"active-left":"active-right");return}if(!this.hasSeenMoveInput){this.setTouchGuideMode("intro");return}if(this.touchGuideIdleTimer+=e,this.touchGuideIdleTimer>=v.TOUCH_GUIDE_IDLE_DELAY){this.setTouchGuideMode("idle");return}this.setTouchGuideMode("hidden")}setTouchGuideMode(t){this.touchGuideMode!==t&&(this.touchGuideMode=t,this.touchGuide.setMode(t))}resetAssistNavigation(){this.meteoriteHitTimes.length=0,this.assistTimer=0,this.assistMessageTimer=0,this.assistDirection=null,this.assistDirectionRefreshTimer=0}updateAssistTimers(t){this.assistTimer>0&&(this.assistDirectionRefreshTimer=Math.max(0,this.assistDirectionRefreshTimer-t),this.assistDirectionRefreshTimer===0&&this.refreshAssistDirection(),this.assistTimer=Math.max(0,this.assistTimer-t),this.assistTimer===0&&(this.spawnSystem.setMeteoriteIntervalMultiplier(1),this.assistDirection=null,this.assistDirectionRefreshTimer=0)),this.assistMessageTimer>0&&(this.assistMessageTimer=Math.max(0,this.assistMessageTimer-t),this.assistMessageTimer===0&&this.syncAssistMessage())}updateMeteoShowerAnnouncement(t){this.meteoShowerAnnouncementTimer<=0||(this.meteoShowerAnnouncementTimer=Math.max(0,this.meteoShowerAnnouncementTimer-t),this.meteoShowerAnnouncementTimer===0&&this.syncAssistMessage())}updateSpaceWeatherAnnouncement(t){this.spaceWeatherAnnouncementTimer<=0||(this.spaceWeatherAnnouncementTimer=Math.max(0,this.spaceWeatherAnnouncementTimer-t),this.spaceWeatherAnnouncementTimer===0&&(this.spaceWeatherAnnouncementMessage="",this.syncAssistMessage()))}showMeteoShowerAnnouncement(){this.meteoShowerAnnouncementTimer=v.METEO_SHOWER_MESSAGE_DURATION,this.syncAssistMessage()}showSpaceWeatherAnnouncement(t){this.spaceWeatherAnnouncementMessage=t,this.spaceWeatherAnnouncementTimer=v.STAGE_SPECIAL_MESSAGE_DURATION,this.syncAssistMessage()}updateStageSpecialAnnouncement(t){this.stageSpecialAnnouncementTimer<=0||(this.stageSpecialAnnouncementTimer=Math.max(0,this.stageSpecialAnnouncementTimer-t),this.stageSpecialAnnouncementTimer===0&&(this.stageSpecialAnnouncementMessage="",this.syncAssistMessage()))}showStageSpecialAnnouncement(t){this.stageSpecialAnnouncementMessage=t,this.stageSpecialAnnouncementTimer=v.STAGE_SPECIAL_MESSAGE_DURATION,this.syncAssistMessage()}syncAssistMessage(){if(this.meteoShowerAnnouncementTimer>0){this.hud.showAssistMessage(v.METEO_SHOWER_MESSAGE);return}if(this.stageSpecialAnnouncementTimer>0&&this.stageSpecialAnnouncementMessage){this.hud.showAssistMessage(this.stageSpecialAnnouncementMessage);return}if(this.spaceWeatherAnnouncementTimer>0&&this.spaceWeatherAnnouncementMessage){this.hud.showAssistMessage(this.spaceWeatherAnnouncementMessage);return}if(this.assistMessageTimer>0){this.hud.showAssistMessage(v.ASSIST_MESSAGE);return}this.hud.hideAssistMessage()}resetBoostHintState(){this.boostHintDisplayTimer=0,this.hud?.hideBoostHint()}updateBoostHintDisplay(t){this.boostHintDisplayTimer>0&&(this.boostHintDisplayTimer=Math.max(0,this.boostHintDisplayTimer-t),this.boostHintDisplayTimer===0&&this.hud.hideBoostHint())}updateAdaptiveHintDisplay(t){this.adaptiveHintDisplayTimer<=0||(this.adaptiveHintDisplayTimer=Math.max(0,this.adaptiveHintDisplayTimer-t),this.adaptiveHintDisplayTimer===0&&this.adaptiveTutorialHint.hide())}hideAdaptiveTutorialHint(){this.adaptiveHintDisplayTimer=0,this.adaptiveTutorialHint.hide()}updateAdaptiveTutorial(t,e){const i=this.adaptiveTutorialSystem.update({deltaTime:e,moveDirection:t,shipX:this.spaceship.position.x,shipZ:this.spaceship.position.z,boostAvailable:this.boostSystem.isAvailable(),boostActive:this.boostSystem.isActive(),meteorites:this.meteorites});i&&this.showAdaptiveTutorialEvent(i)}showAdaptiveTutorialEvent(t){if(t.type==="boost"){this.hideAdaptiveTutorialHint(),this.hud.showBoostHint(t.message),this.boostHintDisplayTimer=v.BOOST_HINT_DURATION;return}this.resetBoostHintState(),this.adaptiveTutorialHint.show(t.message,t.type),this.adaptiveHintDisplayTimer=v.ADAPTIVE_HINT_DURATION}recordMeteoriteHit(){const t=this.playTime;for(this.meteoriteHitTimes.push(t);this.meteoriteHitTimes.length>0&&t-this.meteoriteHitTimes[0]>v.ASSIST_TRIGGER_HIT_WINDOW;)this.meteoriteHitTimes.shift();this.assistTimer>0||this.meteoriteHitTimes.length<v.ASSIST_TRIGGER_HIT_COUNT||this.activateAssistMode()}activateAssistMode(){this.assistTimer=v.ASSIST_DURATION,this.assistMessageTimer=v.ASSIST_MESSAGE_DURATION,this.assistDirectionRefreshTimer=0,this.refreshAssistDirection(),this.spawnSystem.setMeteoriteIntervalMultiplier(v.ASSIST_METEORITE_INTERVAL_MULTIPLIER),this.hud.showAssistMessage(v.ASSIST_MESSAGE),this.meteoriteHitTimes.length=0}refreshAssistDirection(){this.assistDirection=this.getSaferAssistDirection(),this.assistDirectionRefreshTimer=v.ASSIST_DIRECTION_REFRESH_INTERVAL}getAssistTouchGuideMode(){return this.assistDirection==="left"?"assist-left":this.assistDirection==="right"?"assist-right":"hidden"}getSaferAssistDirection(){const t=this.spaceship.position.x,e=this.spaceship.position.z,i=Math.min(t-2.5,-v.ASSIST_DIRECTION_SIDE_TARGET_X),s=Math.max(t+2.5,v.ASSIST_DIRECTION_SIDE_TARGET_X);let a=0,n=0;for(const u of this.meteorites){if(!u.isActive)continue;const m=e-u.position.z;if(m<0||m>v.ASSIST_DIRECTION_LOOKAHEAD)continue;const f=1+(v.ASSIST_DIRECTION_LOOKAHEAD-m)/7,b=Math.abs(u.position.x-i),g=Math.abs(u.position.x-s),r=Math.max(0,1-b/v.ASSIST_DIRECTION_SIDE_RANGE),d=Math.max(0,1-g/v.ASSIST_DIRECTION_SIDE_RANGE);a+=f*r,n+=f*d}const o=Math.abs(a-n),c=Math.max(a,n);return o<v.ASSIST_DIRECTION_DIFF_THRESHOLD||c>0&&o<c*v.ASSIST_DIRECTION_DIFF_RATIO?null:a<n?"left":"right"}updateDamageEffect(t){if(this.damageTimer>0){if(this.damageTimer-=t,this.damageTimer<=0){this.damageTimer=0,this.spaceship.mesh.rotation.z=0,this.spaceship.mesh.rotation.y=0,this.spaceship.mesh.visible=!0;return}const e=Math.sin(this.damageTimer*30)*.3;this.spaceship.mesh.rotation.z=e,this.spaceship.mesh.rotation.y=0;const i=Math.sin(this.damageTimer*20)>0;this.spaceship.mesh.visible=i}else this.spaceship.mesh.visible=!0}resetCameraShake(){this.cameraShakeTimer=0,this.cameraShakeElapsed=0,this.cameraShakeProfile=kt.meteoriteHit,this.cameraShakeOffset.set(0,0,0)}startCameraShake(t="meteoriteHit"){this.cameraShakeProfile=kt[t],this.cameraShakeTimer=this.cameraShakeProfile.duration,this.cameraShakeElapsed=0}ensureVisualFeedbackOverlay(){if(this.visualFeedbackOverlay)return;const t=document.getElementById("ui-overlay");if(!t)return;const e=document.createElement("div");e.setAttribute("data-stage-visual-feedback",""),e.style.cssText=`
      position: absolute;
      inset: 0;
      pointer-events: none;
      opacity: 0;
      z-index: 8;
      transition: opacity 0.05s linear;
      will-change: opacity, background;
    `,t.prepend(e),this.visualFeedbackOverlay=e}updateVisualFeedbackOverlay(t,e){this.visualFeedbackOverlay?.style.setProperty("opacity",String(t)),this.visualFeedbackOverlay?.style.setProperty("background",e)}handleVisualFeedback(t){this.activeVisualFeedback={background:t.overlayBackground,duration:t.durationMs/1e3,elapsed:0,overlayOpacity:t.overlayOpacity,spaceshipScale:t.spaceshipScale},t.event!=="meteoriteHit"&&(t.event!=="starCollect"&&t.event!=="boost"&&this.startCameraShake(t.event),this.updateVisualFeedbackOverlay(t.overlayOpacity,t.overlayBackground))}updateVisualFeedback(t){const e=this.activeVisualFeedback;if(!e){this.spaceship.mesh.scale.setScalar(1),this.updateVisualFeedbackOverlay(0,"transparent");return}e.elapsed=Math.min(e.duration,e.elapsed+t);const i=e.duration>0?e.elapsed/e.duration:1,s=1-i,a=Math.sin(i*Math.PI);this.spaceship.mesh.scale.setScalar(1+(e.spaceshipScale-1)*a),this.updateVisualFeedbackOverlay(e.overlayOpacity*s,e.background),i>=1&&(this.activeVisualFeedback=null,this.spaceship.mesh.scale.setScalar(1),this.updateVisualFeedbackOverlay(0,"transparent"))}updateCameraShake(t){if(this.cameraShakeTimer<=0){this.cameraShakeOffset.set(0,0,0);return}if(this.cameraShakeElapsed+=t,this.cameraShakeTimer=Math.max(0,this.cameraShakeTimer-t),this.cameraShakeTimer===0){this.cameraShakeOffset.set(0,0,0);return}const e=this.cameraShakeTimer/this.cameraShakeProfile.duration,i=this.cameraShakeElapsed*this.cameraShakeProfile.frequency,s=At(this.motionSensitivity);this.cameraShakeOffset.set(Math.sin(i)*this.cameraShakeProfile.amplitudeX*e*s.cameraShakeScale,Math.cos(i*.8)*this.cameraShakeProfile.amplitudeY*e*s.cameraShakeScale,0)}updateCameraFollow(t){this.updateCameraShake(t);const e=At(this.motionSensitivity),i=this.spaceship.position.x*.3+this.cameraShakeOffset.x,s=5+this.cameraShakeOffset.y,a=this.spaceship.position.z+12,n=e.cameraFollowResponsiveness;if(n>=1)this.camera.position.set(i,s,a);else{const o=1-Math.pow(1-n,Math.max(1,t*60));this.cameraPositionTarget.set(i,s,a),this.camera.position.lerp(this.cameraPositionTarget,o)}this.cameraLookAtTarget.set(this.spaceship.position.x*.5,0,this.spaceship.position.z-20),this.camera.lookAt(this.cameraLookAtTarget)}cleanupPassedObjects(t){const e=this.spaceship.position.z,i=e+30,s=this.stars;let a=0,n=0;for(let y=0;y<s.length;y++){const p=s[y];p.isCollected||p.position.z>i?(!p.isCollected&&p.position.z>i&&(n+=1),this.spawnSystem.releaseStar(p)):(p.update(t,e),a!==y&&(s[a]=p),a++)}s.length=a,n>0&&this.adaptiveTutorialSystem.recordMissedStars(n);const o=this.meteorites;let c=0;for(let y=0;y<o.length;y++){const p=o[y];!p.isActive||p.position.z>i?this.spawnSystem.releaseMeteorite(p):(p.isActive&&p.update(t,e),c!==y&&(o[c]=p),c++)}o.length=c;const u=this.shootingStars;let m=0;for(let y=0;y<u.length;y++){const p=u[y];p.isCollected||p.position.z>i?this.spawnSystem.releaseShootingStar(p):(p.update(t,e),m!==y&&(u[m]=p),m++)}u.length=m;const f=this.comets;let b=0;for(let y=0;y<f.length;y++){const p=f[y];p.isCollected||p.position.z>i?this.spawnSystem.releaseComet(p):(p.update(t,e),b!==y&&(f[b]=p),b++)}f.length=b;const g=this.specialShootingStars;let r=0;for(let y=0;y<g.length;y++){const p=g[y];p.isCollected||p.position.z>i?this.specialStarSpawnSystem.releaseSpecialStar(p):(p.update(t,e),r!==y&&(g[r]=p),r++)}g.length=r;const d=this.monthlyEncounters;let S=0;for(let y=0;y<d.length;y++){const p=d[y];p.isCollected||p.position.z>i?this.monthlyEncounterSystem.releaseMonthlyEncounter(p):(p.update(t,e),S!==y&&(d[S]=p),S++)}d.length=S;const x=this.spaceGems;let T=0;for(let y=0;y<x.length;y++){const p=x[y];p.isCollected||p.position.z>i?this.spawnSystem.releaseSpaceGem(p):(p.update(t,e),T!==y&&(x[T]=p),T++)}x.length=T}spawnConstellationStars(){const t=this.constellationSystem.getDefinition();if(t)for(let e=0;e<t.points.length;e++){const i=t.points[e],s=this.spawnSystem.acquireStar(i.x,i.y,i.z,"RAINBOW");s.setConstellationMarker(t.id,t.stageNumber,e),this.stars.push(s),this.threeScene.add(s.mesh)}}handleConstellationStarCollected(t){const e=this.constellationSystem.registerCollectedStar(t);if(!e.advanced)return;const i=this.constellationSystem.getDefinition();if(i&&this.constellationHintOverlay.showGuide(i,this.constellationSystem.getCollectedCount()),e.lineSegment&&this.constellationLineEffect.addSegment(e.lineSegment.from,e.lineSegment.to),!e.completed||!i)return;this.saveManager.markConstellationDiscovered?.(this.stageNumber),this.constellationHintOverlay.showCelebration(i.celebrationMessage);const s=this.getConstellationCelebrationPosition(i);this.constellationCelebrationEffect.play(s,this.stageConfig.planetColor),this.audioManager.playSFX("constellationCelebrate"),Y("constellationCelebrate"),this.particleBurstManager.emit(this.threeScene,t.position.x,t.position.y,t.position.z,9103615,42,!0),this.particleBurstManager.emit(this.threeScene,s.x,s.y,s.z,this.stageConfig.planetColor,36,!0)}getConstellationCelebrationPosition(t){if(t.points.length===0)return{x:0,y:0,z:this.spaceship.position.z};let e=0,i=0,s=0;for(const a of t.points)e+=a.x,i+=a.y,s+=a.z;return{x:e/t.points.length,y:i/t.points.length,z:s/t.points.length}}onStageClear(){if(this.isCleared)return;this.isCleared=!0,this.clearTimer=0,this.stageClearOverlay.hide(),this.resetAssistNavigation(),this.meteoShowerAnnouncementTimer=0,this.spaceWeatherAnnouncementTimer=0,this.spaceWeatherAnnouncementMessage="",this.stageSpecialAnnouncementTimer=0,this.stageSpecialAnnouncementMessage="",this.meteoShowerEventSystem.reset(),this.meteoShowerEffect.clear(),this.spaceWeatherEventSystem.reset(),this.spaceWeatherEffect.clear(),this.scoreSystem.setEventStarMultiplier?.(1),this.stageSpecialEventSystem.reset(),this.stageSpecialEffects.clear(),this.rainbowTrailEffect.clear(),this.resetBoostHintState(),this.touchGuide.hide(),this.syncPauseAvailability();const t=this.saveManager.markStageCleared(this.stageNumber);if(this.audioManager.playSFX("stageClear"),Y("stageClear"),this.audioManager.stopBoostSFX(),this.boostFlameEffect.remove(),this.destinationPlanet){const n=this.getDestinationPlanetEffectRadius(this.destinationPlanet);this.planetRingEffect.start(this.threeScene,this.destinationPlanet,n,this.stageConfig.planetColor,this.particleBurstManager)}const e=this.scoreSystem.getStarCount(),i=this.saveManager.load().bestStageStars?.[this.stageNumber]??0;this.saveManager.updateBestStageStars(this.stageNumber,e);const s=Math.max(i,e),a=e>i;t&&(this.companionManager?.addCompanion(this.stageNumber),this.prefetchClearRewardOverlay()),this.showClearMessage(a,e,t,s),this.startBonusTime(),this.hud.announceStageClear(e,t,a),a&&this.audioManager.playSFX("rainbowCollect")}updateConstellationHintOverlay(){if(this.constellationSystem.isCompleted()){this.constellationHintOverlay.updateTargetScreenPosition(null);return}const t=this.constellationSystem.getNextPoint();if(!t){this.constellationHintOverlay.updateTargetScreenPosition(null);return}const e=H(),i=new W(t.x,t.y,t.z).project(this.camera),s=i.z>=-1&&i.z<=1&&i.x>=-1&&i.x<=1&&i.y>=-1&&i.y<=1;this.constellationHintOverlay.updateTargetScreenPosition({x:(i.x+1)*.5*e.width,y:(1-i.y)*.5*e.height,visible:s})}startBonusTime(){this.isBonusTime=!0,this.isBonusResultVisible=!1,this.bonusTimeRemaining=v.BONUS_TIME_DURATION,this.bonusCollectedStars=0,this.bonusResultTimer=0,this.bonusCollectionSystem.reset(),this.starBonusEffect.start(this.spaceship.position.z),this.bonusTimeOverlay.show({remainingSeconds:this.bonusTimeRemaining,collectedStars:this.bonusCollectedStars,message:this.getBonusTimeMessage(this.bonusCollectedStars)}),this.syncBoostInputLock(),this.syncPauseAvailability()}updateBonusTime(t){if(!(!this.isBonusTime&&!this.isBonusResultVisible)){if(this.isBonusTime){const e=this.inputSystem.getState?.()??{moveDirection:0};this.updateBonusSpaceship(e.moveDirection,t),this.starBonusEffect.update(t,this.spaceship.position.z);const i=this.spaceship.mesh?.position??new W(this.spaceship.position.x,this.spaceship.position.y,this.spaceship.position.z),s=this.bonusCollectionSystem.collect(i,this.starBonusEffect.getStars());if(s.collectedStars.length>0){this.bonusCollectedStars=s.totalCollected,this.audioManager.playSFX("starCollect");for(const n of s.collectedStars)this.particleBurstManager.emit(this.threeScene,n.position.x,n.position.y,n.position.z,16772997,24,!0);this.starBonusEffect.consumeCollectedStars(s.collectedStars)}const a=Math.min(t,this.bonusTimeRemaining);if(this.bonusTimeRemaining=Math.max(0,this.bonusTimeRemaining-t),this.bonusTimeOverlay.update({remainingSeconds:this.bonusTimeRemaining,collectedStars:this.bonusCollectedStars,message:this.getBonusTimeMessage(this.bonusCollectedStars)}),this.bonusTimeRemaining===0){this.finishBonusTime();const n=t-a;n>0&&this.updateBonusTime(n)}return}this.bonusResultTimer+=t,this.bonusResultTimer>=v.BONUS_RESULT_DURATION&&(this.isBonusResultVisible=!1,this.bonusTimeOverlay.hide(),this.syncBoostInputLock(),this.syncPauseAvailability())}}updateBonusSpaceship(t,e){t<0?this.spaceship.position.x=Math.max(this.spaceship.boundaryMin,this.spaceship.position.x-15*e):t>0&&(this.spaceship.position.x=Math.min(this.spaceship.boundaryMax,this.spaceship.position.x+15*e)),this.spaceship.mesh?.position.set(this.spaceship.position.x,this.spaceship.position.y,this.spaceship.position.z)}finishBonusTime(){this.isBonusTime=!1,this.isBonusResultVisible=!0,this.bonusTimeRemaining=0,this.bonusResultTimer=0,this.starBonusEffect.clear(),this.showBonusCelebration(),this.bonusTimeOverlay.showResult({collectedStars:this.bonusCollectedStars,message:this.getBonusResultMessage(this.bonusCollectedStars)}),this.syncBoostInputLock(),this.syncPauseAvailability()}showBonusCelebration(){const t=this.bonusCollectedStars>=7?4:this.bonusCollectedStars>=3?3:2;for(let e=0;e<t;e++)this.particleBurstManager.emit(this.threeScene,this.spaceship.position.x+(e-(t-1)/2)*2.1,1.8+e%2*1.4,this.spaceship.position.z-6,e%2===0?16751317:9103615,42,!0)}getBonusTimeMessage(t){return t>=8?"キラキラ だいせいこう！":t>=5?"すごいね！":t>=2?"やったね！":"ほしを あつめよう！"}getBonusResultMessage(t){return`${t>=8?"キラキラ だいせいこう！":t>=5?"すごいね！":t>=2?"やったね！":"たのしかったね！"} ${t}こ あつめたね！`}getClearRewardOverlay(){return this.clearRewardOverlay?Promise.resolve(this.clearRewardOverlay):this.clearRewardOverlayPromise?this.clearRewardOverlayPromise:(this.clearRewardOverlayPromise=this.loadEncyclopediaOverlay().then(({EncyclopediaOverlay:t})=>{const e=new t;return this.clearRewardOverlay=e,e}).finally(()=>{this.clearRewardOverlayPromise=null}),this.clearRewardOverlayPromise)}isCurrentClearRewardRequest(t){return this.isActive&&this.clearRewardRequestToken===t}restoreClearRewardButton(){this.stageClearOverlay.setRewardOpen(!1)}prefetchClearRewardOverlay(){this.clearRewardOverlay||this.clearRewardOverlayPromise||this.getClearRewardOverlay().catch(()=>{})}async openClearRewardOverlay(t){if(this.isClearRewardOpen||this.isOpeningClearReward)return;const e=this.clearRewardRequestToken;this.isOpeningClearReward=!0,this.stageClearOverlay.setRewardOpen(!0);try{const i=this.clearRewardOverlay??await this.getClearRewardOverlay();if(!this.isCurrentClearRewardRequest(e))return;if(!i.showStageDetail(this.stageNumber,()=>{this.isCurrentClearRewardRequest(e)&&(this.isClearRewardOpen=!1,this.syncPauseAvailability(),this.restoreClearRewardButton())},{bestStageStars:{[this.stageNumber]:t},backLabel:"クリアへ もどる",colorVisionSupportMode:this.saveManager.load().colorAccessibility?.colorVisionSupportMode??j,discoveredConstellations:this.saveManager.load().discoveredConstellations??[],zIndex:50})){this.restoreClearRewardButton();return}this.isClearRewardOpen=!0,this.syncPauseAvailability()}catch{if(!this.isCurrentClearRewardRequest(e))return;this.restoreClearRewardButton()}finally{this.clearRewardRequestToken===e&&(this.isOpeningClearReward=!1,this.syncPauseAvailability(),this.isClearRewardOpen||this.restoreClearRewardButton())}}showClearMessage(t=!1,e,i=!1,s){const a=e??this.scoreSystem.getStarCount(),n=s??a,o=this.launchSource==="encyclopedia"?void 0:oi(this.stageNumber),c=i?gt(this.stageNumber):void 0;this.stageClearOverlay.show({stageNumber:this.stageNumber,starCount:a,bestStarCount:n,isBestUpdated:t,continueLabel:this.launchSource==="encyclopedia"?"タイトルへ":this.stageNumber>=z?"おいわいへ":"つぎへ",nextEntry:o,rewardEntry:c,onContinue:()=>{this.handleStageComplete()},onRetry:()=>{this.handleStageRetry()},onReward:c?()=>{this.openClearRewardOverlay(a)}:void 0})}revealClearActionButtonsIfReady(){this.isBonusTime||this.isBonusResultVisible||this.clearTimer<Math.max(v.CLEAR_CONTINUE_DELAY,v.BONUS_TIME_DURATION+v.BONUS_RESULT_DURATION)||this.stageClearOverlay.enableContinue()}getDestinationPlanetEffectRadius(t){const e=new pi().setFromObject(t);if(e.isEmpty())return 15;const i=e.getSize(new W);return Math.max(i.x,i.y,i.z)*.5}handleStageComplete(){this.recordAttemptStats(!0);const{totalScore:t,totalStarCount:e}=this.scoreSystem.finalizeStage(),i=e+this.bonusCollectedStars;if(this.shouldPlayWormholeTransition()){this.startWormholeTransition({stageNumber:this.stageNumber+1,totalScore:t,totalStarCount:i});return}if(this.launchSource==="encyclopedia"){this.sceneManager.requestTransition("title");return}this.stageNumber>=z?this.sceneManager.requestTransition("ending",{totalScore:t,totalStarCount:i}):this.sceneManager.requestTransition("stage",{stageNumber:this.stageNumber+1,totalScore:t,totalStarCount:i})}shouldPlayWormholeTransition(){return this.launchSource==="campaign"&&this.stageNumber<z}startWormholeTransition(t){if(this.pendingWormholeTransition)return;const e=t.stageNumber??this.stageNumber+1,i=Q(e);this.pendingWormholeTransition=t,this.wormholeTransitionTimer=0,this.stageClearOverlay.hide(),this.bonusTimeOverlay.hide(),this.clearRewardOverlay?.hide(),this.isClearRewardOpen=!1,this.isOpeningClearReward=!1,this.wormholeTunnelEffect.start({sourceColor:this.stageConfig.planetColor,targetColor:i.planetColor,duration:v.WORMHOLE_TRANSITION_DURATION,particleCount:72,rayCount:20}),this.audioManager.playSFX("wormhole")}updateWormholeTransition(t){if(!this.pendingWormholeTransition||(this.wormholeTransitionTimer+=t,this.wormholeTunnelEffect.update(t,this.camera),this.wormholeTransitionTimer<v.WORMHOLE_TRANSITION_DURATION))return!1;const e=this.pendingWormholeTransition;return this.pendingWormholeTransition=null,this.wormholeTransitionTimer=0,this.wormholeTunnelEffect.clear(),this.sceneManager.requestTransition("stage",e),!0}handleStageRetry(){const t={stageNumber:this.stageNumber,totalScore:this.stageEntryTotalScore,totalStarCount:this.stageEntryTotalStarCount,replayToken:Date.now()+Math.random()};this.launchSource!=="campaign"&&(t.launchSource=this.launchSource),this.sceneManager.requestTransition("stage",t)}recordAttemptStats(t){this.attemptStatsRecorded||(this.attemptStatsRecorded=!0,this.saveManager.recordGameplaySession?.({stageNumber:this.stageNumber,playTimeSeconds:this.playTime,collectedStars:this.scoreSystem.getStarCount()+this.bonusCollectedStars,boostUses:this.boostSystem.getActivationCount(),stageCleared:t}))}exit(){this.initialized&&(this.recordAttemptStats(this.isCleared),this.isActive=!1,this.prewarmRequestToken+=1,this.clearRewardRequestToken+=1,this.clearRewardOverlay?.hide(),this.stageClearOverlay.hide(),this.bonusTimeOverlay.hide(),this.isClearRewardOpen=!1,this.isOpeningClearReward=!1,this.pauseOverlay.hide(),this.touchGuide.hide(),this.touchFeedbackOverlay.hide(),this.inputSystem.setTouchFeedbackOverlay?.(null),this.visualFeedbackOverlay?.remove(),this.visualFeedbackOverlay=null,this.activeVisualFeedback=null,this.adaptiveTutorialHint.hide(),this.constellationHintOverlay.hide(),this.seasonalEventNotice.dispose(),this.frameRateHintOverlay.hide(),this.hud.hide(),this.scorePopupManager.dispose(),Vt(null),this.audioManager.stopBGM(),this.audioManager.stopBoostSFX(),this.wormholeTunnelEffect.clear(),this.starBonusEffect.clear(),this.bonusCollectionSystem.reset(),this.isBonusTime=!1,this.isBonusResultVisible=!1,this.bonusTimeRemaining=0,this.bonusCollectedStars=0,this.bonusResultTimer=0,this.pendingWormholeTransition=null,this.wormholeTransitionTimer=0,this.stageIntroOverlay&&(this.stageIntroOverlay.dispose(),this.stageIntroOverlay=null),this.countdownOverlay&&(this.countdownOverlay.dispose(),this.countdownOverlay=null),this.resumeCountdownOverlay&&(this.resumeCountdownOverlay.dispose(),this.resumeCountdownOverlay=null),this.isStarting=!1,this.awaitingResume=!1,this.isHomeConfirmOpen=!1,this.shouldResumeAfterHomeConfirm=!1,this.isPauseOpen=!1,this.shouldResumeAfterPause=!1,this.boostFlameEffect.remove(),this.boostLinesEffect.update(!1,this.spaceship.position.x,this.spaceship.position.z),this.airShield.reset(this.spaceship.position.x,this.spaceship.position.y,this.spaceship.position.z),this.planetRingEffect.clear(),this.meteoShowerEffect.clear(),this.spaceWeatherEffect.clear(),this.stageSpecialEffects.clear(),this.seasonalEventEffects.clear(),this.spaceWeatherEventSystem.reset(),this.seasonalEventSystem.clear(),this.scoreSystem.setEventStarMultiplier?.(1),this.frameRateHintOverlay.dispose(),this.frameRateMonitor.reset(),this.autoPerformanceManager.reset(!0),this.resetStageObjects(),this.bgStars&&(this.bgStars.parent?.remove(this.bgStars),this.bgStars=null))}getThreeScene(){return this.threeScene}getCamera(){const{width:t,height:e}=H(),i=t/e;return i!==this.lastAspect&&Number.isFinite(i)&&i>0&&(this.camera.aspect=i,this.camera.updateProjectionMatrix(),this.lastAspect=i),this.camera}applyVisualQualityTier(){const t=this.getEffectiveVisualQualityTier();if(this.particleBurstManager.setQualityTier(t),this.lodSystem.setQualityTier(t),!this.initialized){this.bgStars&&this.bgStars.geometry.setDrawRange(0,this.getBackgroundStarDrawCount());return}this.boostLinesEffect.setQualityTier(t),this.boostFlameEffect.setQualityTier(t),this.stageAtmosphereEffect.setQualityTier(t),this.wormholeTunnelEffect.setQualityTier(t),this.bgStars&&this.bgStars.geometry.setDrawRange(0,this.getBackgroundStarDrawCount())}getBackgroundStarDrawCount(){const t=At(this.motionSensitivity);return Math.max(1,Math.round(v.BG_STAR_COUNT*v.getVisualQualityScale(this.getEffectiveVisualQualityTier())*t.particleDensityScale))}applyMotionSensitivity(){this.initialized&&(this.boostLinesEffect.setMotionSensitivity(this.motionSensitivity),this.boostFlameEffect.setMotionSensitivity(this.motionSensitivity),this.stageAtmosphereEffect.setMotionSensitivity(this.motionSensitivity),this.wormholeTunnelEffect.setMotionSensitivity(this.motionSensitivity))}static clampVisualQualityTier(t){const e=v.VISUAL_QUALITY_SCALE_BY_TIER.length-1;return Math.max(0,Math.min(e,Math.round(t)))}static clampPerformanceAdaptationLevel(t){const e=v.VISUAL_QUALITY_SCALE_BY_TIER.length-1;return Math.max(0,Math.min(e,Math.round(t)))}static getVisualQualityScale(t){return v.VISUAL_QUALITY_SCALE_BY_TIER[v.clampVisualQualityTier(t)]}getEffectiveVisualQualityTier(){return v.clampVisualQualityTier(this.visualQualityTier-this.getCombinedPerformanceAdaptationLevel())}getCombinedPerformanceAdaptationLevel(){return v.clampPerformanceAdaptationLevel(this.performanceAdaptationLevel+this.autoPerformanceAdaptationLevel)}updateAutoPerformanceMonitoring(t){if(!this.isPlaying()){this.frameRateMonitor.reset(),this.autoPerformanceManager.resetStabilityTimers();return}this.frameRateMonitor.update(t),this.autoPerformanceManager.sample(t,this.frameRateMonitor.getFps(),this.frameRateMonitor.getSampleCount())}}const ls=Object.freeze(Object.defineProperty({__proto__:null,StageScene:v,__resetStageSceneSharedAssetCachesForTest:Pi,__stageSceneSharedAssetCachesForTest:ki,prewarmStageVisualAssets:_t},Symbol.toStringTag,{value:"Module"}));class ts{constructor(t,e,i,s,a={}){this.sceneManager=t,this.inputSystem=e,this.audioManager=i,this.saveManager=s,this.randomProvider=a.randomProvider??Math.random,this.effectSystem=a.effectSystem??new hi({randomProvider:this.randomProvider}),this.stageDurationSeconds=a.stageDurationSeconds??8;const{width:n,height:o}=H();this.camera=new xt(60,n/o,.1,1400),this.camera.position.set(0,2.8,12),this.threeScene.background=new ht(32),this.directionalLight.position.set(4,6,5),this.stageAtmosphereEffect.init(this.threeScene),this.effectSystem.init(this.threeScene)}threeScene=new ct;ambientLight=new Et(16777215,1.1);directionalLight=new ce(16777215,.7);camera;stageAtmosphereEffect=new oe;randomProvider;effectSystem;stageDurationSeconds;overlayButtonCleanups=new Set;currentLookAt=new W;ship=null;companionManager=null;backgroundStars=null;currentPlanet=null;currentPlanetSpinTarget=null;overlay=null;stageLabel=null;companionBadge=null;currentStageNumber=1;currentStageConfig=Q(1);stageTimeRemaining=0;lastAspect=0;isActive=!1;enter(t){this.isActive=!0,this.lastAspect=0,this.inputSystem.resetPointers?.(),this.setupSceneObjects(),this.createOverlay(),this.audioManager.playBGM(0)}update(t){if(!this.isActive||!this.ship)return;const e=Math.max(0,t),i=this.inputSystem.getState();i.moveDirection<0?this.ship.moveLeft(e):i.moveDirection>0&&this.ship.moveRight(e),this.ship.update(e);const s=this.ship.mesh.position;this.companionManager?.update(e,s.x,s.y+1.15,s.z+.8),this.effectSystem.update(e,s),this.stageAtmosphereEffect.update(e,this.camera,s.x,s.z),this.updateCamera(),this.updatePlanet(e),this.updateStageRotation(e),this.backgroundStars&&(this.backgroundStars.rotation.y+=e*.02,ft(this.backgroundStars,s.z,1))}exit(){this.isActive=!1,this.inputSystem.resetPointers?.(),this.audioManager.stopBGM(),this.effectSystem.clear(),this.stageAtmosphereEffect.clear(),this.companionManager?.dispose(),this.companionManager=null,this.ship?.dispose(),this.ship=null,this.clearPlanet(),this.backgroundStars&&(this.backgroundStars.parent?.remove(this.backgroundStars),this.backgroundStars=null);const t=Array.from(this.overlayButtonCleanups);this.overlayButtonCleanups.clear();for(const e of t)e();this.overlay?.remove(),this.overlay=null,this.stageLabel=null,this.companionBadge=null}getThreeScene(){return this.threeScene}getCamera(){const{width:t,height:e}=H(),i=t/e;return i!==this.lastAspect&&Number.isFinite(i)&&i>0&&(this.camera.aspect=i,this.camera.updateProjectionMatrix(),this.lastAspect=i),this.camera}setupSceneObjects(){this.threeScene.background=new ht(32),this.ambientLight.parent||this.threeScene.add(this.ambientLight),this.directionalLight.parent||this.threeScene.add(this.directionalLight),this.backgroundStars=me(2e3),this.backgroundStars.name="free-play-background-stars",this.threeScene.add(this.backgroundStars);const t=this.saveManager.load();this.ship=new re(t.spaceshipCustomization),this.ship.mesh.name="free-play-spaceship",this.ship.mesh.position.set(0,-.3,0),this.ship.boundaryMin=-9,this.ship.boundaryMax=9,this.threeScene.add(this.ship.mesh),this.companionManager=new Dt([...new Set(t.unlockedPlanets)]);const e=this.companionManager.getGroup();e.name="free-play-companions",this.threeScene.add(e),this.updateCompanionBadge(),this.applyStage(this.pickRandomStage())}createOverlay(){const t=document.getElementById("ui-overlay");if(!t)return;this.overlay=document.createElement("div"),this.overlay.setAttribute("data-free-play-overlay",""),this.overlay.style.cssText=`
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
    `;const i=document.createElement("div");i.style.cssText=`
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      padding: 0.85rem 1rem;
      border-radius: 1.5rem;
      background: rgba(7, 16, 56, 0.62);
      color: #fff;
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.24);
    `;const s=document.createElement("div");s.textContent="あそびの うちゅう",s.style.cssText=`
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
    `,i.append(s,this.stageLabel,this.companionBadge);const a=document.createElement("button");a.textContent="もどる",a.setAttribute("data-free-play-back-button",""),a.style.cssText=`
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
    `,this.overlayButtonCleanups.add(I(a,{onActivate:()=>{this.inputSystem.resetPointers?.(),this.sceneManager.requestTransition("title")},onPressChange:o=>{a.style.transform=o?"scale(0.96)":"scale(1)"}})),e.append(i,a);const n=document.createElement("div");n.style.cssText=`
      align-self: center;
      padding: 0.7rem 1.1rem;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.28);
      color: #fff;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 0.95rem;
      font-weight: 700;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    `,n.textContent="← → で ゆったり うちゅうさんぽ",this.overlay.append(e,n),t.appendChild(this.overlay),this.updateStageLabel(),this.updateCompanionBadge()}updateCamera(){if(!this.ship)return;const t=this.ship.mesh.position;this.camera.position.x+=(t.x*.32-this.camera.position.x)*.12,this.camera.position.y=2.8,this.camera.position.z=t.z+12,this.currentLookAt.set(t.x*.18,t.y+.4,t.z-18),this.camera.lookAt(this.currentLookAt)}updatePlanet(t){!this.currentPlanet||!this.ship||(this.currentPlanet.position.set(0,.5,this.ship.mesh.position.z-52),this.currentPlanet.rotation.y+=t*.08,this.currentPlanetSpinTarget?.rotateY(t*.22))}updateStageRotation(t){this.stageTimeRemaining-=t,!(this.stageTimeRemaining>0)&&this.applyStage(this.pickRandomStage(this.currentStageNumber))}applyStage(t){this.currentStageNumber=t,this.currentStageConfig=Q(t),this.stageTimeRemaining=this.sampleStageDuration(),this.clearPlanet();const{planet:e,spinTarget:i}=de(t,this.currentStageConfig,-52);e.name="free-play-stage-planet",this.currentPlanet=e,this.currentPlanetSpinTarget=i,this.threeScene.add(e),this.stageAtmosphereEffect.start(le(t)),this.effectSystem.setCurrentStage(t),this.updateStageLabel()}clearPlanet(){this.currentPlanet&&(this.currentPlanet.parent?.remove(this.currentPlanet),this.currentPlanet=null,this.currentPlanetSpinTarget=null)}updateStageLabel(){this.stageLabel&&(this.stageLabel.textContent=`${this.currentStageConfig.emoji} ${this.currentStageConfig.destinationReading}の そらで あそんでるよ`)}updateCompanionBadge(){if(!this.companionBadge)return;const t=this.companionManager?.getCount()??0;this.companionBadge.textContent=t>0?`👾 なかま ${t}にん と いっしょ！`:"👾 なかまを あつめると ここに くるよ！"}sampleStageDuration(){return this.stageDurationSeconds*(.8+this.randomProvider()*.4)}pickRandomStage(t){const e=Array.from({length:z},(a,n)=>n+1),i=t===void 0?e:e.filter(a=>a!==t),s=Math.min(i.length-1,Math.floor(this.randomProvider()*i.length));return i[s]}}const cs=Object.freeze(Object.defineProperty({__proto__:null,FreePlayScene:ts},Symbol.toStringTag,{value:"Module"}));let rt=null,lt=null;function es(){if(!rt){const l=new Gt,t=new Float32Array(3e3);for(let e=0;e<3e3;e++)t[e]=(Math.random()-.5)*200;l.setAttribute("position",new Ft(t,3)),rt=l}return rt}function is(){return lt||(lt=new zt({color:16777215,size:.3})),lt}function ss(){rt=null,lt=null}const as={getBgStarsGeometry:()=>rt,getBgStarsMaterial:()=>lt};class F{static CIRCLE_RADIUS=3;static POPIN_DELAY=.2;static POPIN_DURATION=.3;static BOUNCE_SPEED=3;static BOUNCE_HEIGHT=.5;static THANK_YOU_DELAY=2.5;threeScene;camera;lastAspect=0;sceneManager;saveManager;audioManager;overlay=null;muteHandle=null;bgStars=null;companionMeshes=[];companionGroup=null;circleX=[];circleZ=[];popinSettled=[];celebrationElapsed=0;thankYouShown=!1;canExit=!1;exitTriggered=!1;exitCta=null;constructor(t,e,i){this.sceneManager=t,this.saveManager=e,this.audioManager=i,this.threeScene=new ct;const{width:s,height:a}=H();this.camera=new xt(60,s/a,.1,1e3),this.camera.position.set(0,0,5)}enter(t){this.lastAspect=0,this.canExit=!1,this.exitTriggered=!1,this.exitCta=null;const e=t.totalScore??0,i=t.totalStarCount??0;this.threeScene=new ct,this.threeScene.background=new ht(48),this.bgStars=new Lt(es(),is()),this.bgStars.userData.sharedAssets=!0,this.bgStars.rotation.set(0,0,0),this.threeScene.add(this.bgStars),this.threeScene.add(new Et(16777215,1));const s=this.saveManager.load();s.clearedStage=0,this.saveManager.save(s),this.audioManager.playBGM(-1),this.setupCelebration(),this.createOverlay(e,i),this.createMuteButton()}createMuteButton(){const t=document.getElementById("hud")??document.getElementById("ui-overlay");t&&(this.muteHandle=Nt({initialMuted:this.audioManager.isMuted(),container:t,onToggle:()=>{const e=this.audioManager.toggleMute();this.muteHandle?.setMuted(e);const i=this.saveManager.load();i.muted=e,this.saveManager.save(i)}}))}createOverlay(t,e){const i=document.getElementById("ui-overlay");if(!i)return;this.overlay=document.createElement("div"),this.overlay.setAttribute("data-ending-overlay",""),this.overlay.style.cssText=`
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      pointer-events: auto;
    `,this.overlay.addEventListener("pointerdown",o=>{this.handleOverlayPointerDown(o)});const s=document.createElement("div");s.textContent="うちゅうの たびは おしまい！",s.style.cssText=`
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
    `,this.overlay.appendChild(s),this.overlay.appendChild(a),this.overlay.appendChild(n),this.overlay.appendChild(this.exitCta),i.appendChild(this.overlay)}update(t){this.bgStars&&(this.bgStars.rotation.y+=t*.03),this.updateCelebration(t)}setupCelebration(){this.companionGroup=new at,this.companionMeshes=[],this.circleX.length=0,this.circleZ.length=0,this.popinSettled.length=0,this.celebrationElapsed=0,this.thankYouShown=!1,this.canExit=!1,this.exitTriggered=!1;for(let t=0;t<st.length;t++){const e=st[t],i=Dt.createCompanionMesh(e),s=t*(2*Math.PI/st.length),a=Math.cos(s)*F.CIRCLE_RADIUS,n=Math.sin(s)*F.CIRCLE_RADIUS;this.circleX.push(a),this.circleZ.push(n),i.position.set(a,0,n),i.scale.set(0,0,0),this.companionMeshes.push(i),this.popinSettled.push(!1),this.companionGroup.add(i)}this.threeScene.add(this.companionGroup)}updateCelebration(t){if(this.companionMeshes.length===0)return;this.celebrationElapsed+=t;const e=F.POPIN_DELAY*(this.companionMeshes.length-1)+F.POPIN_DURATION,i=this.celebrationElapsed>e,s=i?Math.abs(Math.sin(this.celebrationElapsed*F.BOUNCE_SPEED))*F.BOUNCE_HEIGHT:0;for(let a=0;a<this.companionMeshes.length;a++){const n=this.companionMeshes[a];if(this.popinSettled[a]){i&&(n.position.y=s),n.rotation.y+=t*2;continue}const o=a*F.POPIN_DELAY;if(!(this.celebrationElapsed<o)){if(this.celebrationElapsed<o+F.POPIN_DURATION){const c=(this.celebrationElapsed-o)/F.POPIN_DURATION,u=this.bounceEase(c);n.scale.set(u,u,u)}else n.scale.set(1,1,1),this.popinSettled[a]=!0;i&&(n.position.y=s),n.rotation.y+=t*2}}!this.thankYouShown&&this.celebrationElapsed>=F.THANK_YOU_DELAY&&(this.showThankYouText(),this.thankYouShown=!0)}bounceEase(t){return t<.6?t/.6*1.2:1.2-(t-.6)/.4*.2}showThankYouText(){if(!this.overlay||!this.exitCta)return;const t=document.createElement("div");t.setAttribute("data-ending-thank-you",""),t.textContent="みんな ありがとう！",t.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 2rem;
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
      margin-bottom: 1.5rem;
      opacity: 0;
      transition: opacity 0.5s ease-in;
    `,this.overlay.insertBefore(t,this.exitCta),this.exitCta.style.visibility="visible",this.canExit=!0,requestAnimationFrame(()=>{t.style.opacity="1",this.exitCta&&(this.exitCta.style.opacity="1")})}handleOverlayPointerDown(t){if(!this.canExit||this.exitTriggered)return;const e=t.target;e instanceof HTMLElement&&e.closest("[data-mute-button]")||(this.exitTriggered=!0,this.sceneManager.requestTransition("title"))}exit(){this.audioManager.stopBGM(),this.bgStars&&(this.threeScene.remove(this.bgStars),this.bgStars=null),this.companionGroup&&(this.threeScene.remove(this.companionGroup),this.companionMeshes=[],this.companionGroup=null),this.overlay&&(this.overlay.remove(),this.overlay=null),this.exitCta=null,this.canExit=!1,this.exitTriggered=!1,this.muteHandle&&(this.muteHandle.remove(),this.muteHandle=null)}getThreeScene(){return this.threeScene}getCamera(){const{width:t,height:e}=H(),i=t/e;return i!==this.lastAspect&&Number.isFinite(i)&&i>0&&(this.camera.aspect=i,this.camera.updateProjectionMatrix(),this.lastAspect=i),this.camera}}const hs=Object.freeze(Object.defineProperty({__proto__:null,EndingScene:F,__endingSceneSharedAssetsForTest:as,__resetEndingSceneSharedAssetsForTest:ss},Symbol.toStringTag,{value:"Module"}));export{hs as E,cs as F,ls as S,rs as T,I as a,Ot as c};
