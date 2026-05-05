const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/EncyclopediaOverlay-CJxa9-SV.js","assets/game-core-DJGfrB45.js","assets/three-BsQe5WE2.js"])))=>i.map(i=>d[i]);
import{D as dt,i as w,g as Ct,a as Rt,S as Q,T as z,b as X,c as ee,L as fe,d as ye,_ as Pt,e as _,f as W,h as $,s as ie,j as mt,k as se,l as be,P as it,u as ae,C as ve,m as Se,n as Ee,B as xe,o as Ce,M as we,p as Te,q as Ae,r as Me,t as Be,v as Pe,w as ke,x as Re,y as Oe,z as Ie,A as De,E as Le,F as Ge,G as ze,H as He,I as ne,W as Ne,J as _e,K as Fe,N as $e,O as oe,Q as Ve,R as Ot,U as Ue,V as je,X as We,Y as Ze,Z as Ye,$ as qe,a0 as Xe,a1 as Ft,a2 as re,a3 as Qe,a4 as pt,a5 as K,a6 as Ke,a7 as wt,a8 as Je,a9 as Tt,aa as ti,ab as ei,ac as ii,ad as si,ae as ai}from"./game-core-DJGfrB45.js";import{n as It,l as Dt,j as Lt,m as Gt,G as st,r as ni,a as oi,s as ri,M as O,h as N,C as $t,B as Vt,D as Ut,R as jt,t as H,u as St,v as lt,i as ht,P as Et,V as Z,w as le,x as li}from"./three-BsQe5WE2.js";class zt{overlayEl=null;static COMPACT_HEIGHT_THRESHOLD=720;show(t){if(this.overlayEl)return;const e=document.getElementById("ui-overlay");if(!e)return;const i=this.isCompactHeight();this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-tutorial-overlay",""),this.overlayEl.style.cssText=`
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
    `,o.addEventListener("pointerdown",h=>{h.stopPropagation(),t()}),s.appendChild(o),this.injectAnimations(),this.overlayEl.appendChild(s),e.appendChild(this.overlayEl)}hide(){this.overlayEl&&(this.overlayEl.remove(),this.overlayEl=null)}createCard(t,e,i,s,a){const n=document.createElement("div");n.setAttribute("data-tutorial-card",""),n.style.cssText=`
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
    `;const h=document.createElement("div");h.textContent=e,h.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${a?"0.95rem":"1.1rem"};
      font-weight: 700;
      color: #fff;
      margin-bottom: 0.4rem;
    `;const u=document.createElement("div");return u.textContent=i,u.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${a?"0.8rem":"0.9rem"};
      color: rgba(255, 255, 255, 0.7);
    `,n.appendChild(o),n.appendChild(h),n.appendChild(u),n}isCompactHeight(){return window.innerHeight<=zt.COMPACT_HEIGHT_THRESHOLD}injectAnimations(){if(document.getElementById("tutorial-animations"))return;const t=document.createElement("style");t.id="tutorial-animations",t.textContent=`
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
    `,document.head.appendChild(t)}}class hi{overlayEl=null;activePressCleanups=new Set;show(t,e){if(this.overlayEl)return;const i=document.getElementById("ui-overlay");if(!i)return;this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-title-reset-confirm-overlay",""),this.overlayEl.setAttribute("role","dialog"),this.overlayEl.setAttribute("aria-modal","true"),this.overlayEl.setAttribute("aria-label","さいしょからに もどしますか"),this.overlayEl.style.cssText=`
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
    `,o.addEventListener("pointerdown",d=>{d.stopPropagation()}),this.overlayEl.appendChild(o);const h=document.createElement("div");h.textContent="さいしょからに する？",h.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 1.7rem;
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 0 16px rgba(255, 215, 0, 0.45);
      margin-bottom: 0.8rem;
    `,o.appendChild(h);const u=document.createElement("div");u.textContent="いまの すすみぐあいだけ きえて、ステージ 1 から あそべるよ",u.style.cssText=`
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
    `,b=(d,x)=>{let y=!1,p=!1;const A=()=>{B(!0)},T=()=>{d.style.transform="scale(0.92)"},k=()=>{d.style.transform="scale(1)"},B=(c=!1)=>{y=!1,p=c,k(),this.activePressCleanups.delete(A),document.removeEventListener("pointerup",S,!0),document.removeEventListener("pointercancel",C,!0)},S=c=>{const E=c.target===d||c.target instanceof Node&&d.contains(c.target),D=y&&E;B(!E),D&&x()},C=()=>{B(!0)};d.addEventListener("pointerdown",c=>{c.stopPropagation(),y=!0,p=!1,T(),this.activePressCleanups.add(A),document.addEventListener("pointerup",S,!0),document.addEventListener("pointercancel",C,!0)}),d.addEventListener("pointerenter",()=>{y&&T()}),d.addEventListener("pointerleave",()=>{y&&k()}),d.addEventListener("pointercancel",()=>B(!0)),d.addEventListener("click",c=>{if(c.stopPropagation(),p){p=!1;return}y||x()})},g=document.createElement("button");g.setAttribute("data-title-reset-cancel",""),g.textContent="やめる",g.style.cssText=f,g.style.background="rgba(255, 255, 255, 0.18)",g.style.color="#ffffff",b(g,a),m.appendChild(g);const r=document.createElement("button");r.setAttribute("data-title-reset-confirm",""),r.textContent="うん！ さいしょから",r.style.cssText=f,r.style.background="linear-gradient(135deg, #FF9F68, #FFE66D)",r.style.color="#3b1f00",b(r,n),m.appendChild(r),i.appendChild(this.overlayEl)}hide(){if(!this.overlayEl)return;const t=Array.from(this.activePressCleanups);this.activePressCleanups.clear();for(const e of t)e();this.overlayEl.remove(),this.overlayEl=null}}function Ht(l){const t=l.topRem??.8,e=window.innerHeight<=500,i=document.createElement("button");let s=l.initialMuted;const a=()=>{i.textContent=s?"🔇":"🔊",i.setAttribute("aria-label",s?"サウンド オフ":"サウンド オン")};i.setAttribute("data-mute-button",""),i.style.position="absolute",i.style.top=`${t}rem`,i.style.right="1rem",i.style.fontSize=e?"clamp(1.1rem, 3.5vmin, 1.4rem)":"clamp(1.4rem, 4vmin, 1.8rem)",i.style.background="rgba(255, 255, 255, 0.15)",i.style.border="none",i.style.borderRadius="50%",i.style.width=e?"2.4rem":"3rem",i.style.height=e?"2.4rem":"3rem",i.style.display="flex",i.style.alignItems="center",i.style.justifyContent="center",i.style.cursor="pointer",i.style.pointerEvents="auto",i.style.touchAction="manipulation",i.style.transform="scale(1)",i.style.transition="transform 0.08s ease-out",a();const n=()=>{i.style.transform="scale(1)"};return i.addEventListener("pointerdown",o=>{o.stopPropagation(),i.style.transform="scale(0.9)",l.onToggle()}),i.addEventListener("pointerup",n),i.addEventListener("pointercancel",n),i.addEventListener("pointerleave",n),l.container.appendChild(i),{element:i,setMuted(o){s=o,a()},remove(){i.remove()}}}const gt=[{value:0,labelKey:"colorSettings.audio.volume.quiet"},{value:25,labelKey:"colorSettings.audio.volume.small"},{value:50,labelKey:"colorSettings.audio.volume.normal"},{value:75,labelKey:"colorSettings.audio.volume.loud"},{value:100,labelKey:"colorSettings.audio.volume.max"}],Wt=[{value:"color-only",labelKey:"colorSettings.colorVision.option.colorOnly",icon:"🎨"},{value:"color-and-marks",labelKey:"colorSettings.colorVision.option.colorAndMarks",icon:"★"}],Zt=[{value:"strong",labelKey:"colorSettings.vibration.option.strong"},{value:"medium",labelKey:"colorSettings.vibration.option.medium"},{value:"weak",labelKey:"colorSettings.vibration.option.weak"},{value:"off",labelKey:"colorSettings.vibration.option.off"}],Yt=[{value:"ja",labelKey:"colorSettings.language.option.ja",icon:"🇯🇵"},{value:"en",labelKey:"colorSettings.language.option.en",icon:"🇬🇧"}],qt={strong:{shortLabel:"colorSettings.motion.option.strong.shortLabel",description:"colorSettings.motion.option.strong.description"},medium:{shortLabel:"colorSettings.motion.option.medium.shortLabel",description:"colorSettings.motion.option.medium.description"},gentle:{shortLabel:"colorSettings.motion.option.gentle.shortLabel",description:"colorSettings.motion.option.gentle.description"},minimal:{shortLabel:"colorSettings.motion.option.minimal.shortLabel",description:"colorSettings.motion.option.minimal.description"}};function Xt(l){const t=gt.find(e=>e.value===l)??gt[2];return w.t(t.labelKey)}class ci{overlay=null;toggleButton=null;descriptionEl=null;highContrast=!1;colorVisionSupportMode="color-only";bgmVolume=100;sfxVolume=100;vibrationIntensity="medium";motionSensitivity="strong";restReminderEnabled=!0;language=dt;bgmVolumeDescriptionEl=null;sfxVolumeDescriptionEl=null;bgmVolumeSlider=null;sfxVolumeSlider=null;colorVisionDescriptionEl=null;colorVisionButtons=new Map;vibrationDescriptionEl=null;vibrationButtons=new Map;motionDescriptionEl=null;motionButtons=new Map;restReminderDescriptionEl=null;restReminderToggleButton=null;motionPreviewEl=null;motionPreviewTokenEl=null;motionPreviewCaptionEl=null;languageDescriptionEl=null;languageButtons=new Map;motionPreviewTimeoutId=null;motionPreviewFrameId=null;onToggle=null;onColorVisionSupportModeChange=null;onBGMVolumeChange=null;onSFXVolumeChange=null;onVibrationIntensityChange=null;onMotionSensitivityChange=null;onRestReminderToggle=null;onLanguageChange=null;languageUnsubscribe=null;show(t){const e=document.getElementById("ui-overlay");if(e){if(this.highContrast=t.initialHighContrast,this.colorVisionSupportMode=t.initialColorVisionSupportMode,this.bgmVolume=t.initialBGMVolume,this.sfxVolume=t.initialSFXVolume,this.vibrationIntensity=t.initialVibrationIntensity,this.motionSensitivity=t.initialMotionSensitivity,this.restReminderEnabled=t.initialRestReminderEnabled,this.language=t.initialLanguage,this.onToggle=t.onToggle,this.onColorVisionSupportModeChange=t.onColorVisionSupportModeChange,this.onBGMVolumeChange=t.onBGMVolumeChange,this.onSFXVolumeChange=t.onSFXVolumeChange,this.onVibrationIntensityChange=t.onVibrationIntensityChange,this.onMotionSensitivityChange=t.onMotionSensitivityChange,this.onRestReminderToggle=t.onRestReminderToggle,this.onLanguageChange=t.onLanguageChange,w.setLanguage(this.language,{notify:!1}),this.languageUnsubscribe?.(),this.languageUnsubscribe=w.subscribe(i=>{this.language=i,this.render()}),!this.overlay){const i=window.innerHeight<=760;this.overlay=document.createElement("div"),this.overlay.setAttribute("data-color-accessibility-settings",""),this.overlay.style.cssText=`
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
      `,this.toggleButton.addEventListener("click",()=>{this.highContrast=!this.highContrast,this.render(),this.onToggle?.(this.highContrast)});const n=document.createElement("h3");n.setAttribute("data-audio-title",""),n.style.cssText="margin: 0.75rem 0 0.45rem; font-size: clamp(1rem, 3.8vmin, 1.2rem);";const o=document.createElement("p");o.setAttribute("data-audio-hint",""),o.style.cssText="margin: 0 0 0.65rem; font-size: clamp(0.9rem, 3.1vmin, 1rem); line-height: 1.45;";const h=(c,E,D)=>{const U=document.createElement("div");U.style.cssText="margin-bottom: 0.85rem; text-align: left;";const V=document.createElement("p");V.setAttribute(`data-${c}-volume-heading`,""),V.dataset.i18nKey=E,V.style.cssText="margin: 0 0 0.3rem; font-size: clamp(0.95rem, 3.2vmin, 1rem); font-weight: 900;";const F=document.createElement("p");F.setAttribute(`data-${c}-volume-label`,""),F.style.cssText="margin: 0 0 0.45rem; font-size: clamp(0.88rem, 3vmin, 0.98rem); line-height: 1.4;";const L=document.createElement("input");L.type="range",L.min="0",L.max="100",L.step="25",L.value="100",L.setAttribute(`data-${c}-volume-slider`,""),L.style.cssText="width: 100%; margin: 0 0 0.3rem;",L.addEventListener("input",()=>{const et=Number(L.value);c==="bgm"?this.bgmVolume=et:this.sfxVolume=et,this.render(),D(et)});const xt=document.createElement("div");xt.style.cssText=`
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 0.2rem;
          font-size: clamp(0.68rem, 2.25vmin, 0.8rem);
          color: rgba(255, 255, 255, 0.86);
          text-align: center;
        `;for(const et of gt){const _t=document.createElement("span");_t.setAttribute("data-volume-option",String(et.value)),xt.appendChild(_t)}return c==="bgm"?(this.bgmVolumeDescriptionEl=F,this.bgmVolumeSlider=L):(this.sfxVolumeDescriptionEl=F,this.sfxVolumeSlider=L),U.append(V,F,L,xt),U},u=h("bgm","colorSettings.audio.bgm",c=>{this.onBGMVolumeChange?.(c)}),m=h("sfx","colorSettings.audio.sfx",c=>{this.onSFXVolumeChange?.(c)}),f=document.createElement("h3");f.setAttribute("data-rest-reminder-title",""),f.style.cssText="margin: 0.9rem 0 0.45rem; font-size: clamp(1rem, 3.8vmin, 1.2rem);",this.restReminderDescriptionEl=document.createElement("p"),this.restReminderDescriptionEl.style.cssText="margin: 0 0 0.6rem; font-size: clamp(0.9rem, 3.2vmin, 1rem); line-height: 1.5;",this.restReminderToggleButton=document.createElement("button"),this.restReminderToggleButton.setAttribute("data-rest-reminder-toggle",""),this.restReminderToggleButton.style.cssText=`
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
      `;for(const c of Yt){const E=document.createElement("button");E.setAttribute("data-language-button",c.value),E.style.cssText=`
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
        `,E.addEventListener("click",()=>{w.setLanguage(c.value),this.onLanguageChange?.(c.value)}),this.languageButtons.set(c.value,E),g.appendChild(E)}const r=document.createElement("h3");r.setAttribute("data-color-vision-title",""),r.style.cssText="margin: 0.9rem 0 0.45rem; font-size: clamp(1rem, 3.8vmin, 1.2rem);",this.colorVisionDescriptionEl=document.createElement("p"),this.colorVisionDescriptionEl.style.cssText="margin: 0 0 0.8rem; font-size: clamp(0.9rem, 3.2vmin, 1rem); line-height: 1.5;";const d=document.createElement("div");d.setAttribute("data-color-vision-mode-group",""),d.style.cssText=`
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.65rem;
        margin-bottom: 0.95rem;
      `;for(const c of Wt){const E=document.createElement("button");E.setAttribute("data-color-vision-mode-button",c.value),E.style.cssText=`
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
        `,E.addEventListener("click",()=>{this.colorVisionSupportMode=c.value,this.render(),this.onColorVisionSupportModeChange?.(c.value)}),this.colorVisionButtons.set(c.value,E),d.appendChild(E)}const x=document.createElement("h3");x.setAttribute("data-vibration-title",""),x.style.cssText="margin: 0.9rem 0 0.45rem; font-size: clamp(1rem, 3.8vmin, 1.2rem);",this.vibrationDescriptionEl=document.createElement("p"),this.vibrationDescriptionEl.style.cssText="margin: 0 0 0.8rem; font-size: clamp(0.9rem, 3.2vmin, 1rem); line-height: 1.5;";const y=document.createElement("div");y.setAttribute("data-vibration-intensity-group",""),y.style.cssText=`
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.65rem;
        margin-bottom: 0.95rem;
      `;for(const c of Zt){const E=document.createElement("button");E.setAttribute("data-vibration-intensity-button",c.value),E.style.cssText=`
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
        `,E.addEventListener("click",()=>{this.vibrationIntensity=c.value,this.render(),this.onVibrationIntensityChange?.(c.value)}),this.vibrationButtons.set(c.value,E),y.appendChild(E)}const p=document.createElement("h3");p.setAttribute("data-motion-title",""),p.style.cssText="margin: 1.1rem 0 0.45rem; font-size: clamp(1rem, 3.8vmin, 1.2rem);";const A=document.createElement("p");A.setAttribute("data-motion-hint",""),A.style.cssText="margin: 0 0 0.5rem; font-size: clamp(0.9rem, 3.2vmin, 1rem); line-height: 1.5;",this.motionDescriptionEl=document.createElement("p"),this.motionDescriptionEl.style.cssText="margin: 0 0 0.8rem; font-size: clamp(0.9rem, 3.2vmin, 1rem); line-height: 1.5;";const T=document.createElement("div");T.setAttribute("data-motion-sensitivity-group",""),T.style.cssText=`
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.65rem;
        margin-bottom: 0.95rem;
      `;const k=["strong","medium","gentle","minimal"];for(const c of k){const E=Ct(c),D=document.createElement("button");D.setAttribute("data-motion-sensitivity-button",c),D.style.cssText=`
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
        `;const U=document.createElement("span");U.textContent=E.emoji,U.style.cssText="font-size: clamp(1.25rem, 4.8vmin, 1.7rem); line-height: 1;";const V=document.createElement("span");V.textContent=E.stars,V.style.cssText="font-size: clamp(0.82rem, 2.9vmin, 0.95rem); letter-spacing: 0.08em;";const F=document.createElement("span");F.setAttribute("data-motion-label",c),F.style.cssText="font-size: clamp(0.9rem, 3vmin, 1rem);",D.append(U,V,F),D.addEventListener("click",()=>{this.motionSensitivity=c,this.render(),this.playMotionPreview(),this.onMotionSensitivityChange?.(c)}),this.motionButtons.set(c,D),T.appendChild(D)}this.motionPreviewEl=document.createElement("div"),this.motionPreviewEl.setAttribute("data-motion-preview",""),this.motionPreviewEl.style.cssText=`
        position: relative;
        min-height: 5.8rem;
        margin: 0 0 1rem;
        padding: 0.8rem 0.9rem;
        border-radius: 1.25rem;
        border: 2px solid rgba(255, 255, 255, 0.2);
        background: linear-gradient(180deg, rgba(14, 24, 60, 0.92), rgba(8, 14, 38, 0.96));
        overflow: hidden;
      `;const B=document.createElement("div");B.style.cssText=`
        position: relative;
        height: 2.7rem;
        margin-bottom: 0.7rem;
        border-radius: 999px;
        background: linear-gradient(90deg, rgba(255, 255, 255, 0.12), rgba(118, 240, 255, 0.22));
        box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.12);
      `;const S=document.createElement("div");S.style.cssText=`
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
      `,this.motionPreviewCaptionEl=document.createElement("p"),this.motionPreviewCaptionEl.setAttribute("data-motion-preview-caption",""),this.motionPreviewCaptionEl.style.cssText="margin: 0; font-size: clamp(0.9rem, 3vmin, 1rem); line-height: 1.5;",B.append(S,this.motionPreviewTokenEl),this.motionPreviewEl.append(B,this.motionPreviewCaptionEl);const C=document.createElement("button");C.setAttribute("data-color-settings-close",""),C.style.cssText=`
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
      `,C.addEventListener("click",()=>this.hide()),s.appendChild(a),s.appendChild(this.descriptionEl),s.appendChild(this.toggleButton),s.appendChild(n),s.appendChild(o),s.appendChild(u),s.appendChild(m),s.appendChild(f),s.appendChild(this.restReminderDescriptionEl),s.appendChild(this.restReminderToggleButton),s.appendChild(b),s.appendChild(this.languageDescriptionEl),s.appendChild(g),s.appendChild(r),s.appendChild(this.colorVisionDescriptionEl),s.appendChild(d),s.appendChild(x),s.appendChild(this.vibrationDescriptionEl),s.appendChild(y),s.appendChild(p),s.appendChild(A),s.appendChild(this.motionDescriptionEl),s.appendChild(T),s.appendChild(this.motionPreviewEl),s.appendChild(C),this.overlay.appendChild(s)}this.render(),e.appendChild(this.overlay)}}hide(){this.clearMotionPreviewTimers(),this.languageUnsubscribe?.(),this.languageUnsubscribe=null,this.overlay?.remove()}isVisible(){return this.overlay?.isConnected===!0}getMotionShortLabel(t){return w.t(qt[t].shortLabel)}getMotionDescription(t){return w.t(qt[t].description)}setStaticText(t,e){const i=this.overlay?.querySelector(t);i&&(i.textContent=w.t(e))}render(){if(!this.toggleButton||!this.descriptionEl||!this.bgmVolumeDescriptionEl||!this.sfxVolumeDescriptionEl||!this.bgmVolumeSlider||!this.sfxVolumeSlider||!this.restReminderDescriptionEl||!this.restReminderToggleButton||!this.languageDescriptionEl||!this.colorVisionDescriptionEl||!this.vibrationDescriptionEl||!this.motionDescriptionEl)return;this.setStaticText("[data-color-settings-title]","colorSettings.title"),this.setStaticText("[data-audio-title]","colorSettings.audio.title"),this.setStaticText("[data-audio-hint]","colorSettings.audio.hint"),this.setStaticText("[data-bgm-volume-heading]","colorSettings.audio.bgm"),this.setStaticText("[data-sfx-volume-heading]","colorSettings.audio.sfx"),this.setStaticText("[data-rest-reminder-title]","colorSettings.restReminder.title"),this.setStaticText("[data-language-title]","colorSettings.language.title"),this.setStaticText("[data-color-vision-title]","colorSettings.colorVision.title"),this.setStaticText("[data-vibration-title]","colorSettings.vibration.title"),this.setStaticText("[data-motion-title]","colorSettings.motion.title"),this.setStaticText("[data-motion-hint]","colorSettings.motion.hint"),this.setStaticText("[data-color-settings-close]","colorSettings.close"),this.descriptionEl.textContent=this.highContrast?w.t("colorSettings.description.on"):w.t("colorSettings.description.off"),this.toggleButton.textContent=this.highContrast?w.t("colorSettings.toggle.on"):w.t("colorSettings.toggle.off"),this.toggleButton.setAttribute("aria-pressed",this.highContrast?"true":"false");const t=Xt(this.bgmVolume);this.bgmVolumeDescriptionEl.textContent=`🎵 ${t} (${this.bgmVolume}%)`,this.bgmVolumeSlider.value=String(this.bgmVolume),this.bgmVolumeSlider.setAttribute("aria-valuetext",`${t} ${this.bgmVolume}%`);const e=Xt(this.sfxVolume);this.sfxVolumeDescriptionEl.textContent=`✨ ${e} (${this.sfxVolume}%)`,this.sfxVolumeSlider.value=String(this.sfxVolume),this.sfxVolumeSlider.setAttribute("aria-valuetext",`${e} ${this.sfxVolume}%`);for(const s of gt){const a=this.overlay?.querySelector(`[data-volume-option="${s.value}"]`);a&&(a.textContent=w.t(s.labelKey))}this.restReminderDescriptionEl.textContent=this.restReminderEnabled?w.t("colorSettings.restReminder.description.on"):w.t("colorSettings.restReminder.description.off"),this.restReminderToggleButton.textContent=this.restReminderEnabled?w.t("colorSettings.restReminder.toggle.on"):w.t("colorSettings.restReminder.toggle.off"),this.restReminderToggleButton.setAttribute("aria-pressed",this.restReminderEnabled?"true":"false"),this.languageDescriptionEl.textContent=w.t("colorSettings.language.description");for(const s of Yt){const a=this.languageButtons.get(s.value);if(!a)continue;const n=s.value===this.language;a.textContent=`${s.icon} ${w.t(s.labelKey)}`,a.setAttribute("aria-pressed",n?"true":"false"),a.style.borderColor=n?"#fff27a":"rgba(255, 255, 255, 0.4)",a.style.background=n?"linear-gradient(135deg, rgba(255, 242, 122, 0.94), rgba(118, 240, 255, 0.92))":"rgba(255, 255, 255, 0.08)",a.style.color=n?"#102040":"#fff",a.style.transform=n?"scale(1.02)":"scale(1)"}this.colorVisionDescriptionEl.textContent=this.colorVisionSupportMode==="color-and-marks"?w.t("colorSettings.colorVision.description.colorAndMarks"):w.t("colorSettings.colorVision.description.colorOnly");for(const s of Wt){const a=this.colorVisionButtons.get(s.value);if(!a)continue;const n=s.value===this.colorVisionSupportMode;a.textContent=`${s.icon} ${w.t(s.labelKey)}`,a.setAttribute("aria-pressed",n?"true":"false"),a.style.borderColor=n?"#fff27a":"rgba(255, 255, 255, 0.4)",a.style.background=n?"linear-gradient(135deg, rgba(255, 242, 122, 0.94), rgba(118, 240, 255, 0.92))":"rgba(255, 255, 255, 0.08)",a.style.color=n?"#102040":"#fff",a.style.transform=n?"scale(1.02)":"scale(1)"}const i={strong:w.t("colorSettings.vibration.description.strong"),medium:w.t("colorSettings.vibration.description.medium"),weak:w.t("colorSettings.vibration.description.weak"),off:w.t("colorSettings.vibration.description.off")};this.vibrationDescriptionEl.textContent=i[this.vibrationIntensity];for(const s of Zt){const a=this.vibrationButtons.get(s.value);if(!a)continue;const n=s.value===this.vibrationIntensity;a.textContent=w.t(s.labelKey),a.setAttribute("aria-pressed",n?"true":"false"),a.style.borderColor=n?"#fff27a":"rgba(255, 255, 255, 0.4)",a.style.background=n?"linear-gradient(135deg, rgba(255, 242, 122, 0.94), rgba(118, 240, 255, 0.92))":"rgba(255, 255, 255, 0.08)",a.style.color=n?"#102040":"#fff",a.style.transform=n?"scale(1.02)":"scale(1)"}this.motionDescriptionEl.textContent=this.getMotionDescription(this.motionSensitivity);for(const[s,a]of this.motionButtons.entries()){const n=s===this.motionSensitivity,o=a.querySelector(`[data-motion-label="${s}"]`);o&&(o.textContent=this.getMotionShortLabel(s)),a.setAttribute("aria-pressed",n?"true":"false"),a.style.borderColor=n?"#fff27a":"rgba(255, 255, 255, 0.4)",a.style.background=n?"linear-gradient(135deg, rgba(255, 242, 122, 0.94), rgba(118, 240, 255, 0.92))":"rgba(255, 255, 255, 0.08)",a.style.color=n?"#102040":"#fff",a.style.transform=n?"scale(1.02)":"scale(1)"}this.motionPreviewEl?.dataset.previewActive!=="true"&&this.resetMotionPreview()}playMotionPreview(){if(!this.motionPreviewEl||!this.motionPreviewTokenEl||!this.motionPreviewCaptionEl)return;this.clearMotionPreviewTimers();const t=Ct(this.motionSensitivity),e=this.getMotionShortLabel(this.motionSensitivity);this.motionPreviewEl.dataset.previewActive="true",this.motionPreviewTokenEl.textContent=t.emoji,this.motionPreviewTokenEl.style.background="rgba(255, 242, 122, 0.92)",this.motionPreviewTokenEl.style.boxShadow=t.previewGlow,this.motionPreviewTokenEl.style.transition="none",this.motionPreviewTokenEl.style.left="0.35rem",this.motionPreviewTokenEl.style.transform="translateY(-50%) scale(1)",this.motionPreviewCaptionEl.textContent=w.t("colorSettings.motion.preview.playing",{emoji:t.emoji,label:e}),this.motionPreviewFrameId=window.requestAnimationFrame(()=>{this.motionPreviewTokenEl&&(this.motionPreviewTokenEl.style.transition=`left ${t.previewDurationMs}ms ease-in-out, transform ${t.previewDurationMs}ms ease-in-out`,this.motionPreviewTokenEl.style.left="calc(100% - 2.45rem)",this.motionPreviewTokenEl.style.transform=`translateY(-50%) scale(${t.previewScale})`)}),this.motionPreviewTimeoutId=window.setTimeout(()=>{this.resetMotionPreview()},t.previewDurationMs+260)}resetMotionPreview(){if(!this.motionPreviewEl||!this.motionPreviewTokenEl||!this.motionPreviewCaptionEl)return;const t=Ct(this.motionSensitivity),e=this.getMotionShortLabel(this.motionSensitivity);this.motionPreviewEl.dataset.previewActive="false",this.motionPreviewTokenEl.textContent=t.emoji,this.motionPreviewTokenEl.style.transition="none",this.motionPreviewTokenEl.style.left="0.35rem",this.motionPreviewTokenEl.style.transform="translateY(-50%) scale(1)",this.motionPreviewTokenEl.style.background="rgba(255, 242, 122, 0.92)",this.motionPreviewTokenEl.style.boxShadow=t.previewGlow,this.motionPreviewCaptionEl.textContent=w.t("colorSettings.motion.preview.idle",{stars:t.stars,label:e})}clearMotionPreviewTimers(){this.motionPreviewTimeoutId!==null&&(window.clearTimeout(this.motionPreviewTimeoutId),this.motionPreviewTimeoutId=null),this.motionPreviewFrameId!==null&&(window.cancelAnimationFrame(this.motionPreviewFrameId),this.motionPreviewFrameId=null)}}function R(l,t){let e=!1,i=!1,s=null,a=null;const n=t.documentTarget??document,o=t.stopPropagation??!0,h=()=>{t.canActivate?.()!==!1&&t.onActivate()},u=S=>{t.onPressChange?.(S)},m=S=>{const C=S;return typeof C.clientX=="number"&&typeof C.clientY=="number"?{x:C.clientX,y:C.clientY}:null},f=S=>{const C=S;return typeof C.pointerId=="number"?C.pointerId:null},b=S=>{const C=f(S);return s===null||C===null||C===s},g=S=>{if(!e||a===null||t.moveTolerancePx===void 0)return!1;const C=m(S);return C===null?!1:Math.hypot(C.x-a.x,C.y-a.y)>t.moveTolerancePx},r=S=>{e=!1,i=S,s=null,a=null,u(!1),n.removeEventListener("pointermove",y,!0),n.removeEventListener("pointerup",d,!0),n.removeEventListener("pointercancel",x,!0)},d=S=>{if(!e||!b(S))return;if(g(S)){r(!0);return}const C=S.target,c=C===l||C instanceof Node&&l.contains(C),E=e&&c;r(E||!c),E&&h()},x=()=>{r(!0)},y=S=>{!e||!b(S)||g(S)&&r(!0)},p=S=>{t.canActivate?.()!==!1&&((t.preventDefaultOnPointerDown??!1)&&S.preventDefault(),o&&S.stopPropagation(),e=!0,i=!1,s=f(S),a=m(S),u(!0),t.moveTolerancePx!==void 0&&n.addEventListener("pointermove",y,!0),n.addEventListener("pointerup",d,!0),n.addEventListener("pointercancel",x,!0))},A=()=>{e&&u(!0)},T=()=>{e&&u(!1)},k=()=>{r(!0)},B=S=>{if(o&&S.stopPropagation(),(t.preventDefaultOnClick??!1)&&S.preventDefault(),i){i=!1;return}e||h()};return l.addEventListener("pointerdown",p),l.addEventListener("pointerenter",A),l.addEventListener("pointerleave",T),l.addEventListener("pointercancel",k),l.addEventListener("click",B),()=>{r(!1),l.removeEventListener("pointerdown",p),l.removeEventListener("pointerenter",A),l.removeEventListener("pointerleave",T),l.removeEventListener("pointercancel",k),l.removeEventListener("click",B)}}class ui{overlay=null;previewBody=null;previewNose=null;previewWings=null;buttonCleanups=new Set;optionButtons=new Map;draft={...Rt};colorOptions=Q.getColorOptions();show(t){this.hide();const e=document.getElementById("ui-overlay");if(!e)return;this.draft=Q.normalizeCustomization(t.initialCustomization),this.overlay=document.createElement("div"),this.overlay.setAttribute("data-spaceship-customizer",""),this.overlay.setAttribute("role","dialog"),this.overlay.setAttribute("aria-modal","true"),this.overlay.setAttribute("aria-label","うちゅうせんを かざろう"),this.overlay.style.cssText=`
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
    `,i.style.overflowY="hidden",i.style.height="100%",i.style.maxHeight="720px",i.addEventListener("pointerdown",u=>u.stopPropagation()),this.overlay.appendChild(i);const s=document.createElement("h2");s.textContent="うちゅうせんを かざろう",s.style.cssText="margin: 0 0 0.3rem; font-size: clamp(1.25rem, 4.3vmin, 1.85rem); color: #ffe66d;";const a=document.createElement("p");a.textContent="おおきな ボタンで えらぶと、すぐに みためが かわるよ。",a.style.cssText="margin: 0 0 0.45rem; font-size: clamp(0.85rem, 2.8vmin, 1rem); line-height: 1.35;",i.appendChild(s),i.appendChild(a);const n=document.createElement("div");n.setAttribute("data-spaceship-customizer-content",""),n.style.cssText="display: grid; grid-template-columns: minmax(12rem, 15rem) minmax(0, 1fr); gap: 0.65rem; align-items: stretch; margin: 0.45rem 0 0.65rem;",n.appendChild(this.createPreviewCard());const o=document.createElement("div");o.setAttribute("data-spaceship-customizer-sections",""),o.style.cssText="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.5rem; align-items: stretch;",o.appendChild(this.createPartSection("bodyColor","ほんたい")),o.appendChild(this.createPartSection("noseColor","ノーズ")),o.appendChild(this.createPartSection("wingColor","つばさ")),n.appendChild(o),i.appendChild(n);const h=document.createElement("button");h.textContent="かんりょう",h.setAttribute("data-spaceship-customizer-done",""),h.style.cssText=`
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
    `,this.buttonCleanups.add(R(h,{onActivate:()=>{const u={...this.draft};this.hide(),t.onComplete(u)},onPressChange:u=>{h.style.transform=u?"scale(0.96)":"scale(1)"}})),i.appendChild(h),e.appendChild(this.overlay),this.render()}hide(){const t=Array.from(this.buttonCleanups);this.buttonCleanups.clear();for(const e of t)e();this.optionButtons.clear(),this.overlay?.remove(),this.overlay=null,this.previewBody=null,this.previewNose=null,this.previewWings=null}isVisible(){return this.overlay?.isConnected===!0}createPreviewCard(){const t=document.createElement("div");t.setAttribute("data-spaceship-customizer-preview-card",""),t.style.cssText=`
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
    `;const a=document.createElement("span");return a.textContent=e.label,a.style.cssText="font-family: Zen Maru Gothic, sans-serif; font-size: 0.82rem; font-weight: 700;",i.appendChild(s),i.appendChild(a),this.buttonCleanups.add(R(i,{onActivate:()=>this.selectColor(t,e.key),onPressChange:n=>{i.style.transform=n?"scale(0.95)":"scale(1)"}})),this.optionButtons.set(`${t}:${e.key}`,i),i}selectColor(t,e){this.draft={...this.draft,[t]:e},this.render()}render(){const t=Q.normalizeCustomization(this.draft);this.draft=t,this.previewBody?.style.setProperty("background",`#${Q.getColorHex(t.bodyColor).toString(16).padStart(6,"0")}`),this.previewWings?.style.setProperty("background",`#${Q.getColorHex(t.wingColor).toString(16).padStart(6,"0")}`),this.previewNose&&(this.previewNose.style.borderBottomColor=`#${Q.getColorHex(t.noseColor).toString(16).padStart(6,"0")}`);for(const e of this.colorOptions)this.renderOptionState("bodyColor",e.key,t.bodyColor===e.key),this.renderOptionState("noseColor",e.key,t.noseColor===e.key),this.renderOptionState("wingColor",e.key,t.wingColor===e.key)}renderOptionState(t,e,i){const s=this.optionButtons.get(`${t}:${e}`);s&&(s.setAttribute("aria-pressed",i?"true":"false"),s.style.borderColor=i?"#ffe66d":"transparent",s.style.background=i?"rgba(255, 230, 109, 0.18)":"rgba(255, 255, 255, 0.12)")}}function di(l){return{totalPlayTimeSeconds:l?.totalPlayTimeSeconds??0,totalStarsCollected:l?.totalStarsCollected??0,totalBoostUses:l?.totalBoostUses??0,stageClearCounts:{...l?.stageClearCounts??{}}}}function mi(l){const t=Math.max(0,Math.round(l)),e=Math.floor(t/3600),i=Math.floor(t%3600/60),s=t%60;return e>0?`${e}じかん ${i}ふん`:i>0?`${i}ふん ${s}びょう`:`${s}びょう`}class pi{overlayEl=null;actionCleanups=new Set;show(t,e){this.hide();const i=document.getElementById("ui-overlay");if(!i)return;const s=di(t),a=window.innerHeight<=720,n=document.createElement("div");n.setAttribute("data-stats-overlay",""),n.style.cssText=`
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
    `,o.appendChild(h);const u=document.createElement("div");u.style.cssText=`
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(${a?"120px":"150px"}, 1fr));
      gap: 0.8rem;
      margin-bottom: 1rem;
    `,u.append(this.createSummaryCard("あそんだ じかん",mi(s.totalPlayTimeSeconds),"data-stats-total-play-time"),this.createSummaryCard("とった ほし",`${s.totalStarsCollected}こ`,"data-stats-total-stars"),this.createSummaryCard("ブースト",`${s.totalBoostUses}かい`,"data-stats-total-boosts")),o.appendChild(u);const m=document.createElement("div");m.style.cssText=`
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
    `;const g=Array.from({length:z},(d,x)=>x+1).map(d=>({stageNumber:d,clearCount:s.stageClearCounts[d]??0})).filter(d=>d.clearCount>0);if(g.length===0){const d=document.createElement("div");d.textContent="まだ きろくが ないよ",d.style.cssText=`
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${a?"1rem":"1.1rem"};
        font-weight: 700;
        text-align: center;
        color: rgba(255, 255, 255, 0.88);
      `,b.appendChild(d)}else for(const{stageNumber:d,clearCount:x}of g){const y=X(d),p=document.createElement("div");p.setAttribute("data-stats-stage-clear-row",String(d)),p.style.cssText=`
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
        `;const A=document.createElement("span");A.textContent=`${y.emoji} ステージ ${d} ${y.destinationReading}`;const T=document.createElement("span");T.textContent=`${x}かい`,T.style.color="#FFE66D",p.append(A,T),b.appendChild(p)}m.appendChild(b),o.appendChild(m);const r=document.createElement("button");r.textContent="もどる",r.style.cssText=`
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
    `,this.actionCleanups.add(R(r,{onActivate:()=>{this.hide(),e()},onPressChange:d=>{r.style.transform=d?"scale(0.96)":"scale(1)"}})),o.appendChild(r),n.appendChild(o),i.appendChild(n)}hide(){const t=Array.from(this.actionCleanups);this.actionCleanups.clear();for(const e of t)e();this.overlayEl?.remove(),this.overlayEl=null}createSummaryCard(t,e,i){const s=document.createElement("div");s.setAttribute(i,""),s.style.cssText=`
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
    `,s.append(a,n),s}}const j={strong:{rippleDurationMs:360,markerDurationMs:300,rippleScale:2.35,markerScale:1},medium:{rippleDurationMs:340,markerDurationMs:300,rippleScale:2.05,markerScale:.98},gentle:{rippleDurationMs:320,markerDurationMs:280,rippleScale:1.75,markerScale:.94},minimal:{rippleDurationMs:280,markerDurationMs:240,rippleScale:1.45,markerScale:.9}};class q{static STYLE_ID="touch-feedback-overlay-styles";static UI_ROOT_LISTENER_OPTIONS={capture:!0,passive:!0};root=null;activeEntries=new Map;pooledEntries=[];uiRootCleanups=new Set;motionSensitivity="strong";attach(){const t=this.ensureRoot();t.isConnected||document.body.appendChild(t)}hide(){this.clearUiRoots();for(const t of this.activeEntries.keys())this.releaseGameplayTouch(t);for(this.activeEntries.clear();this.pooledEntries.length>0;)this.pooledEntries.pop()?.host.remove();this.root?.remove()}dispose(){this.hide(),this.root=null}setMotionSensitivity(t){this.motionSensitivity=t;const e=this.ensureRoot(),i=j[t];e.style.setProperty("--touch-feedback-ripple-duration",`${i.rippleDurationMs}ms`),e.style.setProperty("--touch-feedback-marker-duration",`${i.markerDurationMs}ms`),e.style.setProperty("--touch-feedback-ripple-scale",`${i.rippleScale}`),e.style.setProperty("--touch-feedback-marker-scale",`${i.markerScale}`)}bindUiRoots(t){this.clearUiRoots();for(const e of t){if(!e)continue;const i=s=>{const a=s.target;if(!(a instanceof Element)||this.root?.contains(a))return;const n=a.closest('button, [role="button"], [data-touch-feedback-button]');if(!(n instanceof HTMLElement)||!e.contains(n))return;const o=s;typeof o.clientX!="number"||typeof o.clientY!="number"||this.showUiTouch(o.clientX,o.clientY)};e.addEventListener("pointerdown",i,q.UI_ROOT_LISTENER_OPTIONS),this.uiRootCleanups.add(()=>{e.removeEventListener("pointerdown",i,q.UI_ROOT_LISTENER_OPTIONS)})}}showGameplayTouch(t,e,i,s){const a=this.activeEntries.get(t)??this.acquireEntry(t);this.activeEntries.set(t,a),this.activateEntry(a,e,i,this.toGameplayVariant(s))}moveGameplayTouch(t,e,i,s){this.showGameplayTouch(t,e,i,s)}releaseGameplayTouch(t){const e=this.activeEntries.get(t);e&&(this.activeEntries.delete(t),e.activePointerId=null,this.recycleWhenIdle(e))}showUiTouch(t,e){const i=this.acquireEntry(null);this.activateEntry(i,t,e,"ui"),this.recycleWhenIdle(i)}ensureRoot(){if(this.root)return this.root;this.injectStyles();const t=document.createElement("div");return t.setAttribute("data-touch-feedback-root",""),t.style.cssText=`
      position: fixed;
      inset: 0;
      overflow: hidden;
      pointer-events: none;
      z-index: 25;
      contain: layout style paint;
      --touch-feedback-ripple-duration: ${j.strong.rippleDurationMs}ms;
      --touch-feedback-marker-duration: ${j.strong.markerDurationMs}ms;
      --touch-feedback-ripple-scale: ${j.strong.rippleScale};
      --touch-feedback-marker-scale: ${j.strong.markerScale};
    `,this.root=t,this.setMotionSensitivity(this.motionSensitivity),t}injectStyles(){if(document.getElementById(q.STYLE_ID))return;const t=document.createElement("style");t.id=q.STYLE_ID,t.textContent=`
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
    `,document.head.appendChild(t)}acquireEntry(t){const e=this.pooledEntries.pop()??this.createEntry();return e.activePointerId=t,e.releaseScheduled=!1,this.ensureRoot().appendChild(e.host),e}createEntry(){const t=document.createElement("div");t.setAttribute("data-touch-feedback-entry","");const e=document.createElement("div");e.setAttribute("data-touch-feedback-ripple","");const i=document.createElement("div");i.setAttribute("data-touch-feedback-marker",""),t.append(e,i);const s={host:t,marker:i,ripple:e,markerTimeoutId:null,rippleTimeoutId:null,releaseScheduled:!1,activePointerId:null,animationToggle:!1},a=n=>{n.target instanceof HTMLElement&&(n.target.removeAttribute("data-touch-feedback-anim"),this.recycleWhenIdle(s))};return e.addEventListener("animationend",a),i.addEventListener("animationend",a),s}activateEntry(t,e,i,s){const a=t.animationToggle?"a":"b";t.animationToggle=!t.animationToggle,t.releaseScheduled=!1,t.host.style.left=`${e}px`,t.host.style.top=`${i}px`,t.host.setAttribute("data-touch-feedback-variant",s),t.ripple.setAttribute("data-touch-feedback-anim",a),t.marker.setAttribute("data-touch-feedback-anim",a),t.markerTimeoutId!==null&&window.clearTimeout(t.markerTimeoutId),t.rippleTimeoutId!==null&&window.clearTimeout(t.rippleTimeoutId);const n=j[this.motionSensitivity].rippleDurationMs,o=j[this.motionSensitivity].markerDurationMs;t.rippleTimeoutId=window.setTimeout(()=>{t.rippleTimeoutId=null,t.ripple.removeAttribute("data-touch-feedback-anim"),this.recycleWhenIdle(t)},n+24),t.markerTimeoutId=window.setTimeout(()=>{t.markerTimeoutId=null,t.marker.removeAttribute("data-touch-feedback-anim"),this.recycleWhenIdle(t)},o+24)}recycleWhenIdle(t){if(t.activePointerId!==null||t.releaseScheduled)return;const e=t.ripple.hasAttribute("data-touch-feedback-anim"),i=t.marker.hasAttribute("data-touch-feedback-anim");e||i||(t.releaseScheduled=!0,t.host.remove(),t.host.removeAttribute("data-touch-feedback-variant"),t.markerTimeoutId!==null&&(window.clearTimeout(t.markerTimeoutId),t.markerTimeoutId=null),t.rippleTimeoutId!==null&&(window.clearTimeout(t.rippleTimeoutId),t.rippleTimeoutId=null),this.pooledEntries.push(t))}clearUiRoots(){const t=Array.from(this.uiRootCleanups);this.uiRootCleanups.clear();for(const e of t)e()}toGameplayVariant(t){switch(t){case"left":return"game-left";case"right":return"game-right";default:return"game-center"}}}function Qt(l,t){if(!Number.isFinite(l)||l<=0||t<=0)return"ずかん";const e=Math.min(l,t);return e>=t?`ずかん ${t} / ${t} 🎉`:`ずかん ${e} / ${t}`}function gi(l){switch(l){case"hero":return{gap:"0.35rem",label:"0.92rem",medal:"1.7rem",hint:"0.98rem"};case"compact":return{gap:"0.18rem",label:"0.7rem",medal:"1rem",hint:"0.76rem"};default:return{gap:"0.26rem",label:"0.8rem",medal:"1.25rem",hint:"0.84rem"}}}function kt(l,t,e={}){const i=ee(l,t),s=e.size??"regular",a=gi(s),n=document.createElement("div");if(n.setAttribute("data-stage-medal-display",""),n.setAttribute("data-stage-medal-stage",String(l)),n.setAttribute("data-stage-medal-tier",i.tier),n.setAttribute("data-stage-medal-earned",String(i.earnedCount)),e.scope&&n.setAttribute("data-stage-medal-scope",e.scope),n.style.cssText=`
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
    `,o.appendChild(f)}n.appendChild(o);const h=e.hint??(i.nextThreshold===null?"かんぺき！":`つぎ ⭐ ${i.nextThreshold}`),u=document.createElement("div");return u.setAttribute("data-stage-medal-hint",""),u.textContent=h,u.style.cssText=`
    font-family: 'Zen Maru Gothic', sans-serif;
    font-size: ${a.hint};
    font-weight: 700;
    color: ${i.nextThreshold===null?"#FFE66D":"rgba(255, 255, 255, 0.86)"};
  `,n.appendChild(u),n}const Kt=2e3,ft=new Map,yt=new Map,bt=new Map;let ct=null,ut=null;function tt(l,t){if(typeof document>"u"){const i=typeof OffscreenCanvas=="function",s=i?new OffscreenCanvas(l,t):{width:l,height:t};return{canvas:s,ctx:i?s.getContext("2d"):null}}const e=document.createElement("canvas");return e.width=l,e.height=t,{canvas:e,ctx:e.getContext("2d")}}function J(l,t){let e=ft.get(l);return e||(e=t(),e.generateMipmaps=!1,e.minFilter=ri,e.needsUpdate=!0,ft.set(l,e)),e}function P(l,t){let e=yt.get(l);return e||(e=t(),yt.set(l,e)),e}function I(l,t){let e=bt.get(l);return e||(e=t(),bt.set(l,e)),e}function M(l,t){const e=new oi(l,t);return e.userData.sharedAssets=!0,e}function he(){if(!ct){const l=new Dt,t=new Float32Array(Kt*3);for(let e=0;e<Kt*3;e+=3)t[e]=(Math.random()-.5)*200,t[e+1]=(Math.random()-.5)*200,t[e+2]=(Math.random()-.5)*400;l.setAttribute("position",new Lt(t,3)),ct=l}ut||(ut=new Gt({color:16777215,size:.2,sizeAttenuation:!0}))}function fi(){const{canvas:l,ctx:t}=tt(256,256);if(!t)return new H(l);t.fillStyle="#888888",t.fillRect(0,0,256,256);for(let e=0;e<30;e++){const i=Math.random()*256,s=Math.random()*256,a=3+Math.random()*12;t.beginPath(),t.arc(i,s,a,0,Math.PI*2),t.fillStyle=`rgba(60,60,60,${.3+Math.random()*.4})`,t.fill()}return new H(l)}function yi(){const{canvas:l,ctx:t}=tt(256,256);if(!t)return new H(l);t.fillStyle="#ddaa44",t.fillRect(0,0,256,256);for(let e=0;e<8;e++){t.beginPath();const i=128+(Math.random()-.5)*100,s=128+(Math.random()-.5)*100;t.strokeStyle=`rgba(200,150,60,${.3+Math.random()*.3})`,t.lineWidth=3+Math.random()*5;for(let a=0;a<Math.PI*4;a+=.1){const n=10+a*8;t.lineTo(i+Math.cos(a)*n,s+Math.sin(a)*n)}t.stroke()}return new H(l)}function bi(){const{canvas:l,ctx:t}=tt(256,256);if(!t)return new H(l);const e=["#cc7733","#dd9955","#bb6622","#eebb77","#aa5511","#ddaa66"];for(let i=0;i<256;i++){const s=Math.floor(i/(256/e.length))%e.length;t.fillStyle=e[s],t.fillRect(0,i,256,1)}return new H(l)}function vi(){const{canvas:l,ctx:t}=tt(512,256);return t?(t.fillStyle="#2266aa",t.fillRect(0,0,512,256),t.fillStyle="#886644",t.beginPath(),t.ellipse(300,80,80,40,.2,0,Math.PI*2),t.fill(),t.beginPath(),t.ellipse(280,150,30,50,.1,0,Math.PI*2),t.fill(),t.beginPath(),t.ellipse(100,90,25,60,.3,0,Math.PI*2),t.fill(),t.beginPath(),t.ellipse(110,170,20,40,-.2,0,Math.PI*2),t.fill(),t.beginPath(),t.ellipse(420,170,25,15,0,0,Math.PI*2),t.fill(),t.fillStyle="#447733",t.beginPath(),t.ellipse(290,75,40,20,.3,0,Math.PI*2),t.fill(),t.beginPath(),t.ellipse(95,85,15,30,.2,0,Math.PI*2),t.fill(),new H(l)):new H(l)}function Si(){const{canvas:l,ctx:t}=tt(512,256);if(!t)return new H(l);t.clearRect(0,0,512,256),t.fillStyle="rgba(255,255,255,0.6)";for(let e=0;e<20;e++){const i=Math.random()*512,s=Math.random()*256;t.beginPath(),t.ellipse(i,s,20+Math.random()*40,8+Math.random()*15,Math.random()*Math.PI,0,Math.PI*2),t.fill()}return new H(l)}function Ei(){const{canvas:l,ctx:t}=tt(256,128);if(!t)return new H(l);t.fillStyle="#d7dde8",t.fillRect(0,0,256,128),t.fillStyle="#8bbcff",t.fillRect(0,0,256,28),t.fillStyle="#90a4bf";for(let e=0;e<256;e+=24)t.fillRect(e,40,4,88);t.fillStyle="#4a6c9a";for(let e=44;e<128;e+=16)t.fillRect(0,e,256,6);return new H(l)}function xi(){ft.clear(),yt.clear(),bt.clear(),ct=null,ut=null}const Ci={planetTextureCache:ft,planetGeometryCache:yt,planetMaterialCache:bt,getBgStarsGeometry:()=>ct,getBgStarsMaterial:()=>ut};function ce(l,t,e){const i=new st;let s=null;switch(l){case 2:{const a=J("mercury",fi),n=P("mercury:sphere",()=>new N(10,24,24)),o=I("mercury:mat",()=>new O({map:a})),h=M(n,o);i.add(h),s=h;break}case 3:{const a=J("venus",yi),n=P("venus:sphere",()=>new N(14,24,24)),o=I("venus:mat",()=>new O({map:a})),h=M(n,o);i.add(h),s=h;break}case 5:{const a=J("jupiter",bi),n=P("jupiter:sphere",()=>new N(20,24,24)),o=I("jupiter:mat",()=>new O({map:a})),h=M(n,o);i.add(h),s=h;break}case 6:{const a=P("saturn:sphere",()=>new N(15,24,24)),n=t.planetColor,o=I(`saturn:mat:${n}`,()=>new O({color:n})),h=M(a,o);i.add(h);const u=P("saturn:ring",()=>new jt(20,30,48)),m=I("saturn:ringMat",()=>new O({color:15645542,side:Ut})),f=M(u,m);f.rotation.x=Math.PI/3,i.add(f),s=h;break}case 7:{const a=P("uranus:sphere",()=>new N(16,24,24)),n=I("uranus:mat",()=>new O({color:6737117})),o=M(a,n);i.add(o);const h=P("uranus:ring",()=>new jt(21,28,48)),u=I("uranus:ringMat",()=>new O({color:10083822,side:Ut})),m=M(h,u);m.rotation.z=Math.PI/2,i.add(m),s=o;break}case 9:{const a=P("pluto:sphere",()=>new N(8,24,24)),n=I("pluto:mat",()=>new O({color:12298922})),o=M(a,n);i.add(o),s=o;break}case 10:{const a=P("sun:sphere",()=>new N(25,24,24)),n=I("sun:mat",()=>new O({color:16763904,emissive:16755200,emissiveIntensity:.5})),o=M(a,n);i.add(o),i.add(new ni(16763904,2,200)),s=o;break}case 11:{const a=J("station:panel",Ei),n=P("station:core",()=>new $t(3.2,3.2,12,12)),o=P("station:module",()=>new $t(1.7,1.7,6,10)),h=P("station:truss",()=>new Vt(18,.9,.9)),u=P("station:panelGeo",()=>new Vt(8,3.6,.18)),m=P("station:dish",()=>new N(1.4,12,12,0,Math.PI)),f=I("station:metal",()=>new O({color:14213354})),b=I("station:moduleMat",()=>new O({color:11057099})),g=I("station:panelMat",()=>new O({map:a,color:16777215})),r=new st,d=M(n,f);d.rotation.z=Math.PI/2,r.add(d);const x=M(h,b);r.add(x);const y=M(o,b);y.position.x=-6,y.rotation.z=Math.PI/2,r.add(y);const p=M(o,b);p.position.x=6,p.rotation.z=Math.PI/2,r.add(p);const A=M(u,g);A.position.set(-11,0,0),r.add(A);const T=M(u,g);T.position.set(11,0,0),r.add(T);const k=M(m,f);k.position.set(0,3.2,0),k.rotation.x=-Math.PI/2,r.add(k),i.add(r),s=r;break}case 12:{const a=J("earth",vi),n=P("earth:sphere",()=>new N(15,32,32)),o=I("earth:mat",()=>new O({map:a})),h=J("earth:cloud",Si),u=P("earth:cloudSphere",()=>new N(15.5,32,32)),m=I("earth:cloudMat",()=>new O({map:h,transparent:!0,opacity:.3})),f=new st;f.add(M(n,o)),f.add(M(u,m)),i.add(f),s=f;break}default:{const a=P("default:sphere",()=>new N(15,24,24)),n=t.planetColor,o=I(`default:mat:${n}`,()=>new O({color:n})),h=M(a,o);i.add(h),s=h;break}}return i.position.set(0,0,e),{planet:i,spinTarget:s}}function ue(l,t,e){return ce(l,t,e)}function de(l){he();const t=new It(ct,ut);return t.userData.sharedAssets=!0,t.geometry.setDrawRange(0,l),t}function Nt(l){!Number.isInteger(l)||l<1||l>z||typeof document>"u"&&typeof OffscreenCanvas!="function"||(he(),ce(l,X(l),0))}let at=null,nt=null;function wi(){if(!at){const l=new Dt,t=new Float32Array(3e3);for(let e=0;e<3e3;e++)t[e]=(Math.random()-.5)*200;l.setAttribute("position",new Lt(t,3)),at=l}return at}function Ti(){return nt||(nt=new Gt({color:16777215,size:.3,sizeAttenuation:!0})),nt}function Ai(){at=null,nt=null}const Mi={getBgStarsGeometry:()=>at,getBgStarsMaterial:()=>nt};function Bi(l){const t=window.requestIdleCallback;if(typeof t=="function"){t(l,{timeout:1500});return}window.setTimeout(l,800)}function me(l){return new Set(l.filter(t=>Number.isInteger(t)&&t>=1&&t<=z)).size}function Pi(l){return me(l)>=z}function At(l){const t=Pi(l.unlockedPlanets),e=t?1:Math.min(l.clearedStage+1,z),i=X(e),s=l.bestStageStars?.[e]??0,a=l.colorAccessibility?.colorVisionSupportMode??$,n=se(e,i.destinationReading,a);return t?{startStage:e,destination:n,emoji:i.emoji,statusLabel:"ぜんぶ あつめたよ！",destinationLabel:`${n}へ もういちど しゅっぱつ！`,buttonHint:`${i.emoji} ステージ ${e} から もういちど あそぶ`,bestStars:s}:{startStage:e,destination:n,emoji:i.emoji,statusLabel:l.clearedStage>0?"つづきから しゅっぱつ！":"はじめての しゅっぱつ！",destinationLabel:`${n}へ むかおう！`,buttonHint:`${i.emoji} ステージ ${e} から スタート`,bestStars:s}}function ki(l){return l.clearedStage>0||me(l.unlockedPlanets)>0||Object.keys(l.bestStageStars??{}).length>0}class Ri{threeScene;ambientLight=new St(16777215,1);camera;lastAspect=0;sceneManager;saveManager;audioManager;stars=null;companionParade=null;overlay=null;muteHandle=null;tutorialOverlay=new zt;titleResetConfirmOverlay=new hi;colorAccessibilitySettings=new ci;spaceshipCustomizer=new ui;statsOverlay=new pi;encyclopediaOverlay=null;encyclopediaOverlayPromise=null;companionFactory=null;companionFactoryPromise=null;loadEncyclopediaOverlay;loadTitleCompanionFactory;loadingOverlay;loadFailureOverlay;scheduleIdleTask;encyclopediaBtn=null;isOpeningEncyclopedia=!1;isActive=!1;touchFeedbackOverlay=new q;encyclopediaRequestToken=0;companionParadeRequestToken=0;bgmPending=!1;overlayButtonCleanups=new Set;colorSettingsButton=null;unsubscribeLanguageChange=null;constructor(t,e,i,s={}){this.sceneManager=t,this.saveManager=e,this.audioManager=i,this.loadingOverlay=s.loadingOverlay??new fe,this.loadFailureOverlay=s.loadFailureOverlay??new ye,this.scheduleIdleTask=s.scheduleIdleTask??Bi,this.loadEncyclopediaOverlay=s.loadEncyclopediaOverlay??(()=>Pt(()=>import("./EncyclopediaOverlay-CJxa9-SV.js"),__vite__mapDeps([0,1,2]))),this.loadTitleCompanionFactory=s.loadTitleCompanionFactory??(()=>Pt(()=>import("./game-core-DJGfrB45.js").then(o=>o.an),__vite__mapDeps([1,2]))),this.threeScene=new lt,this.threeScene.background=new ht(32);const{width:a,height:n}=_();this.camera=new Et(60,a/n,.1,1e3),this.camera.position.set(0,0,5)}enter(t){this.isActive=!0,this.encyclopediaRequestToken+=1,this.companionParadeRequestToken+=1,this.lastAspect=0,this.stars=new It(wi(),Ti()),this.stars.userData.sharedAssets=!0,this.stars.rotation.set(0,0,0),this.threeScene.add(this.stars),this.ambientLight.parent||this.threeScene.add(this.ambientLight);const e=this.saveManager.load();w.setLanguage(e.language??dt,{notify:!1}),this.createCompanionParade(e.unlockedPlanets),this.createOverlay(),this.createMuteButton(),this.touchFeedbackOverlay.setMotionSensitivity(e.colorAccessibility?.motionSensitivity??W()),this.touchFeedbackOverlay.attach(),this.touchFeedbackOverlay.bindUiRoots([document.getElementById("hud"),document.getElementById("ui-overlay")]),this.prefetchEncyclopediaOnIdle(),this.prewarmNextAdventureOnIdle(At(e).startStage),this.audioManager.isInitialized()?(this.audioManager.playBGM(0),this.bgmPending=!1):this.bgmPending=!0,e.tutorialShown||this.tutorialOverlay.show(()=>{this.ensureTitleAudioInitialized(!0),this.tutorialOverlay.hide(),this.saveManager.markTutorialShown()})}createMuteButton(){const t=document.getElementById("hud")??document.getElementById("ui-overlay");t&&(this.muteHandle=Ht({initialMuted:this.audioManager.isMuted(),container:t,onToggle:()=>{this.ensureTitleAudioInitialized(!0);const e=this.audioManager.toggleMute();this.muteHandle?.setMuted(e);const i=this.saveManager.load();i.muted=e,this.saveManager.save(i)}}))}getEncyclopediaOverlay(){return this.encyclopediaOverlay?Promise.resolve(this.encyclopediaOverlay):this.encyclopediaOverlayPromise?this.encyclopediaOverlayPromise:(this.encyclopediaOverlayPromise=this.loadEncyclopediaOverlay().then(({EncyclopediaOverlay:t})=>{const e=new t;return this.encyclopediaOverlay=e,e}).finally(()=>{this.encyclopediaOverlayPromise=null}),this.encyclopediaOverlayPromise)}getTitleCompanionFactory(){return this.companionFactory?Promise.resolve(this.companionFactory):this.companionFactoryPromise?this.companionFactoryPromise:(this.companionFactoryPromise=this.loadTitleCompanionFactory().then(t=>(this.companionFactory=t,t)).finally(()=>{this.companionFactoryPromise=null}),this.companionFactoryPromise)}showEncyclopedia(){if(!this.isActive||!this.encyclopediaOverlay)return;const t=this.saveManager.load();this.encyclopediaOverlay.show(t.unlockedPlanets,()=>this.refreshEncyclopediaButtonLabel(),e=>{this.ensureTitleAudioInitialized(!1),this.sceneManager.requestTransition("stage",{stageNumber:e,totalScore:0,totalStarCount:0,launchSource:"encyclopedia"})},t.bestStageStars??{},t.discoveredConstellations??[],t.colorAccessibility?.colorVisionSupportMode??$,t.discoveredMonthlyEncounters??[])}isCurrentEncyclopediaRequest(t){return this.isActive&&this.encyclopediaRequestToken===t}prefetchEncyclopediaOnIdle(){const t=this.encyclopediaRequestToken;this.scheduleIdleTask(()=>{!this.isCurrentEncyclopediaRequest(t)||this.encyclopediaOverlay||this.encyclopediaOverlayPromise||this.getEncyclopediaOverlay().catch(()=>{})})}prewarmNextAdventureOnIdle(t){if(t>z)return;const e=this.encyclopediaRequestToken;this.scheduleIdleTask(()=>{this.isCurrentEncyclopediaRequest(e)&&Nt(t)})}async openEncyclopedia(){if(!this.isActive)return;if(this.loadFailureOverlay.hide(),this.encyclopediaOverlay){this.showEncyclopedia();return}if(this.isOpeningEncyclopedia)return;const t=this.encyclopediaRequestToken;this.isOpeningEncyclopedia=!0,this.loadingOverlay.show("ずかんを よんでるよ...");try{if(await this.getEncyclopediaOverlay(),!this.isCurrentEncyclopediaRequest(t))return;this.loadingOverlay.hide(),this.showEncyclopedia()}catch(e){if(!this.isCurrentEncyclopediaRequest(t))return;this.loadingOverlay.hide(),console.error("Failed to load encyclopedia overlay",e),this.loadFailureOverlay.show({title:"ずかんを もういちど よんでみよう！",message:"「もういちど よむ」を おして つづきを たのしもう！",primaryAction:{label:"もういちど よむ",onSelect:()=>this.openEncyclopedia()}})}finally{this.encyclopediaRequestToken===t&&(this.isOpeningEncyclopedia=!1)}}persistHighContrastSetting(t){const e=this.saveManager.load(),i=e.colorAccessibility?.motionSensitivity??W(),s=e.colorAccessibility?.colorVisionSupportMode??$;e.colorAccessibility=this.buildColorAccessibilitySettings(t,i,s),e.colorAccessibility||delete e.colorAccessibility,this.saveManager.save(e)}persistVibrationIntensitySetting(t){const e=this.saveManager.load();e.vibrationSettings={intensity:t},this.saveManager.save(e),ie(t)}persistRestReminderSetting(t){const e=this.saveManager.load();e.restReminderSettings={enabled:t},this.saveManager.save(e)}persistLanguageSetting(t){const e=this.saveManager.load();t===dt?delete e.language:e.language=t,this.saveManager.save(e)}persistBGMVolumeSetting(t){const e=this.saveManager.load();e.audioSettings=this.buildAudioSettings(t,e.audioSettings?.sfxVolume??100),e.audioSettings||delete e.audioSettings,this.saveManager.save(e),this.audioManager.setBGMVolume(t)}persistSFXVolumeSetting(t){const e=this.saveManager.load();e.audioSettings=this.buildAudioSettings(e.audioSettings?.bgmVolume??100,t),e.audioSettings||delete e.audioSettings,this.saveManager.save(e),this.audioManager.setSFXVolume(t)}persistMotionSensitivitySetting(t){const e=this.saveManager.load(),i=e.colorAccessibility?.highContrast===!0,s=e.colorAccessibility?.colorVisionSupportMode??$;e.colorAccessibility=this.buildColorAccessibilitySettings(i,t,s),e.colorAccessibility||delete e.colorAccessibility,this.saveManager.save(e)}persistColorVisionSupportModeSetting(t){const e=this.saveManager.load(),i=e.colorAccessibility?.highContrast===!0,s=e.colorAccessibility?.motionSensitivity??W();e.colorAccessibility=this.buildColorAccessibilitySettings(i,s,t),e.colorAccessibility||delete e.colorAccessibility,this.saveManager.save(e)}buildColorAccessibilitySettings(t,e,i){const s=W();if(!(!t&&e===s&&i===$))return{...t?{highContrast:!0}:{},...e!==s?{motionSensitivity:e}:{},...i!==$?{colorVisionSupportMode:i}:{}}}buildAudioSettings(t,e){if(!(t===100&&e===100))return{...t!==100?{bgmVolume:t}:{},...e!==100?{sfxVolume:e}:{}}}createOverlay(){const t=document.getElementById("ui-overlay");if(!t)return;const e=this.saveManager.load(),i=At(e),s=ki(e);this.overlay=document.createElement("div"),this.unsubscribeLanguageChange?.(),this.unsubscribeLanguageChange=w.subscribe(()=>this.applyLocalizedText()),this.overlay.style.cssText=`
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
    `;const h=document.createElement("div");h.textContent="つぎの ぼうけん",h.style.cssText=`
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
    `;const b=ee(i.startStage,i.bestStars),g=kt(i.startStage,i.bestStars,{label:"メダル",hint:b.nextThreshold===null?"かんぺき！":`${b.icon} いま ・ つぎ ⭐ ${b.nextThreshold}`,size:"regular",scope:"title-next-adventure"});g.style.marginTop=a?"0.35rem":"0.55rem",o.appendChild(h),o.appendChild(u),o.appendChild(m),o.appendChild(f),o.appendChild(g);const r=document.createElement("div");r.style.cssText=`
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
    `,this.overlayButtonCleanups.add(R(d,{onActivate:()=>{this.ensureTitleAudioInitialized(!1);const c=this.saveManager.load(),E=At(c).startStage;this.sceneManager.requestTransition("stage",{stageNumber:E,totalScore:0,totalStarCount:0,launchSource:"campaign"})},onPressChange:c=>{d.style.transform=c?"scale(0.96)":"scale(1)"}}));const x=document.createElement("div");x.setAttribute("data-play-button-hint",""),x.textContent=i.buttonHint,x.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${a?"0.85rem":"1rem"};
      font-weight: 700;
      color: rgba(255, 255, 255, 0.88);
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
    `;const y=document.createElement("button");y.textContent="うちゅうで あそぶ",y.setAttribute("data-free-play-button",""),y.style.cssText=`
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
    `,this.overlayButtonCleanups.add(R(y,{onActivate:()=>{this.ensureTitleAudioInitialized(!1),this.sceneManager.requestTransition("freePlay",{})},onPressChange:c=>{y.style.transform=c?"scale(0.96)":"scale(1)"}}));const p=document.createElement("div");p.setAttribute("data-title-secondary-actions",""),p.style.cssText=`
      display: grid;
      grid-template-columns: repeat(${s?3:2}, minmax(0, 1fr));
      gap: ${a?"0.45rem":"0.55rem"};
      width: 100%;
      align-items: stretch;
    `;const A=document.createElement("button");A.setAttribute("data-spaceship-customizer-button",""),A.textContent="うちゅうせんをかざろう",A.style.cssText=`
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
    `,this.overlayButtonCleanups.add(R(A,{onActivate:()=>{const c=this.saveManager.load();this.spaceshipCustomizer.show({initialCustomization:c.spaceshipCustomization??Rt,onComplete:E=>{const D=this.saveManager.load();D.spaceshipCustomization=E,this.saveManager.save(D)}})},onPressChange:c=>{A.style.transform=c?"scale(0.96)":"scale(1)"}}));const T=document.createElement("button");T.setAttribute("data-stats-button",""),T.textContent="あそびの きろく",T.style.cssText=`
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
    `,this.overlayButtonCleanups.add(R(T,{onActivate:()=>{this.ensureTitleAudioInitialized(!0),this.statsOverlay.show(this.saveManager.load().gameplayStats,()=>{})},onPressChange:c=>{T.style.transform=c?"scale(0.96)":"scale(1)"}}));const k=document.createElement("div");k.setAttribute("data-title-footer-actions",""),k.style.cssText=`
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: ${a?"0.45rem":"0.65rem"};
      width: min(94vw, 42rem);
      margin-top: ${a?"0.5rem":"0.8rem"};
      align-items: stretch;
    `;const B=document.createElement("button");B.textContent="あそびかた",B.style.cssText=`
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
    `,this.overlayButtonCleanups.add(R(B,{onActivate:()=>{this.ensureTitleAudioInitialized(!0),this.tutorialOverlay.show(()=>{this.ensureTitleAudioInitialized(!0),this.tutorialOverlay.hide()})},onPressChange:c=>{B.style.transform=c?"scale(0.96)":"scale(1)"}}));const S=document.createElement("button");S.setAttribute("data-color-settings-button",""),S.textContent=w.t("titleScene.colorSettingsButton"),this.colorSettingsButton=S,S.style.cssText=`
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
    `,this.overlayButtonCleanups.add(R(S,{onActivate:()=>{this.ensureTitleAudioInitialized(!0),this.colorAccessibilitySettings.show({initialHighContrast:this.saveManager.load().colorAccessibility?.highContrast===!0,initialColorVisionSupportMode:this.saveManager.load().colorAccessibility?.colorVisionSupportMode??$,initialBGMVolume:this.saveManager.load().audioSettings?.bgmVolume??100,initialSFXVolume:this.saveManager.load().audioSettings?.sfxVolume??100,initialVibrationIntensity:this.saveManager.load().vibrationSettings?.intensity??"medium",initialMotionSensitivity:this.saveManager.load().colorAccessibility?.motionSensitivity??W(),initialRestReminderEnabled:this.saveManager.load().restReminderSettings?.enabled??be,initialLanguage:this.saveManager.load().language??dt,onToggle:c=>this.persistHighContrastSetting(c),onColorVisionSupportModeChange:c=>this.persistColorVisionSupportModeSetting(c),onBGMVolumeChange:c=>this.persistBGMVolumeSetting(c),onSFXVolumeChange:c=>this.persistSFXVolumeSetting(c),onVibrationIntensityChange:c=>this.persistVibrationIntensitySetting(c),onMotionSensitivityChange:c=>this.persistMotionSensitivitySetting(c),onRestReminderToggle:c=>this.persistRestReminderSetting(c),onLanguageChange:c=>this.persistLanguageSetting(c)})},onPressChange:c=>{S.style.transform=c?"scale(0.96)":"scale(1)"}}));const C=document.createElement("button");if(C.textContent=Qt(e.unlockedPlanets.length,it.length),C.style.cssText=`
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
    `,this.encyclopediaBtn=C,this.overlayButtonCleanups.add(R(C,{onActivate:()=>{this.ensureTitleAudioInitialized(!0),this.openEncyclopedia()},onPressChange:c=>{C.style.transform=c?"scale(0.96)":"scale(1)"}})),r.appendChild(d),r.appendChild(y),r.appendChild(x),p.appendChild(A),p.appendChild(T),s){const c=document.createElement("button");c.setAttribute("data-reset-progress-button",""),c.textContent="さいしょから",c.style.cssText=`
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
      `,c.addEventListener("pointerdown",E=>{E.stopPropagation(),this.ensureTitleAudioInitialized(!0),this.titleResetConfirmOverlay.show(()=>{this.saveManager.resetProgressPreservingSettings(),this.startCampaign(1)},()=>{})}),p.appendChild(c)}r.appendChild(p),k.append(C,S,B),this.overlay.appendChild(n),this.overlay.appendChild(o),this.overlay.appendChild(r),this.overlay.appendChild(k),t.appendChild(this.overlay),this.overlay.addEventListener("pointerdown",()=>{this.ensureTitleAudioInitialized(!0)},{once:!0})}applyLocalizedText(){this.colorSettingsButton&&(this.colorSettingsButton.textContent=w.t("titleScene.colorSettingsButton"))}ensureTitleAudioInitialized(t){!this.bgmPending&&this.audioManager.isInitialized()||(this.audioManager.initSync(),t&&this.bgmPending&&this.audioManager.playBGM(0),this.bgmPending=!1)}startCampaign(t){this.sceneManager.requestTransition("stage",{stageNumber:t,totalScore:0,totalStarCount:0,launchSource:"campaign"})}refreshEncyclopediaButtonLabel(){if(!this.encyclopediaBtn)return;const t=this.saveManager.load();this.encyclopediaBtn.textContent=Qt(t.unlockedPlanets.length,it.length)}async createCompanionParade(t){this.clearCompanionParade();const e=[...new Set(t)].reduce((h,u)=>{const m=mt(u);return m&&h.push(m),h},[]);if(e.length===0)return;const i=this.encyclopediaRequestToken,{createCompanionMesh:s}=await this.getTitleCompanionFactory();if(!this.isActive||this.encyclopediaRequestToken!==i)return;const a=new st;a.name="title-companion-parade",a.position.set(0,1.35,-1.2),a.rotation.x=-.12;const n=Math.min(2.1,1.1+e.length*.18),o=Math.min(.45,.18+e.length*.02);e.forEach((h,u)=>{const m=s(h),f=u/e.length*Math.PI*2;m.position.set(Math.cos(f)*n,Math.sin(f)*o,Math.sin(f)*n*.45),m.rotation.y=Math.PI*.15-f,m.scale.setScalar(.6),a.add(m)}),this.companionParade=a,this.threeScene.add(a)}clearCompanionParade(){this.companionParade&&(this.companionParade.parent?.remove(this.companionParade),this.companionParade=null)}update(t){this.stars&&(this.stars.rotation.y+=t*.05),this.companionParade&&(this.companionParade.rotation.y+=t*.35)}exit(){this.isActive=!1,this.encyclopediaRequestToken+=1,this.companionParadeRequestToken+=1,this.isOpeningEncyclopedia=!1,this.tutorialOverlay.hide(),this.titleResetConfirmOverlay.hide(),this.colorAccessibilitySettings.hide(),this.spaceshipCustomizer.hide(),this.statsOverlay.hide(),this.encyclopediaOverlay?.hide(),this.loadingOverlay.hide(),this.loadFailureOverlay.hide(),this.audioManager.stopBGM(),this.bgmPending=!1,this.touchFeedbackOverlay.hide(),this.clearCompanionParade(),this.stars&&(this.stars.parent?.remove(this.stars),this.stars=null),this.clearCompanionParade();const t=Array.from(this.overlayButtonCleanups);this.overlayButtonCleanups.clear();for(const e of t)e();this.overlay&&(this.overlay.remove(),this.overlay=null),this.encyclopediaBtn=null,this.colorSettingsButton=null,this.unsubscribeLanguageChange?.(),this.unsubscribeLanguageChange=null,this.muteHandle&&(this.muteHandle.remove(),this.muteHandle=null)}getThreeScene(){return this.threeScene}getCamera(){const{width:t,height:e}=_(),i=t/e;return i!==this.lastAspect&&Number.isFinite(i)&&i>0&&(this.camera.aspect=i,this.camera.updateProjectionMatrix(),this.lastAspect=i),this.camera}}const es=Object.freeze(Object.defineProperty({__proto__:null,TitleScene:Ri,__resetTitleSceneSharedAssetsForTest:Ai,__titleSceneSharedAssetsForTest:Mi},Symbol.toStringTag,{value:"Module"}));class Oi{overlayEl=null;activePressCleanups=new Set;show(t,e){if(this.overlayEl)return;const i=document.getElementById("ui-overlay");if(!i)return;this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-home-confirm-overlay",""),this.overlayEl.setAttribute("role","dialog"),this.overlayEl.setAttribute("aria-modal","true"),this.overlayEl.setAttribute("aria-label","ホームへ もどりますか"),this.overlayEl.style.cssText=`
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
    `,o.addEventListener("pointerdown",r=>{r.stopPropagation()}),this.overlayEl.appendChild(o);const h=document.createElement("div");h.textContent="タイトルへ もどる？",h.style.cssText=`
      font-size: 1.8rem;
      font-weight: 900;
      text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
      margin-bottom: 1.2rem;
      text-align: center;
      padding: 0 0.6rem;
      white-space: nowrap;
    `,h.style.fontFamily="'Zen Maru Gothic', sans-serif",h.style.color="#FFD700",o.appendChild(h);const u=document.createElement("div");u.style.cssText=`
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
    `,f=(r,d)=>{const x=R(r,{onActivate:d,onPressChange:y=>{r.style.transform=y?"scale(0.9)":"scale(1)"}});this.activePressCleanups.add(x)},b=document.createElement("button");b.setAttribute("data-home-confirm-back",""),b.setAttribute("aria-label","タイトルへ もどる"),b.textContent="🏠 タイトルへ もどる",b.style.cssText=m,b.style.fontFamily="'Zen Maru Gothic', sans-serif",b.style.background="rgba(255, 255, 255, 0.18)",b.style.color="#ffffff",b.style.minWidth="88px",b.style.minHeight="88px",b.style.touchAction="manipulation",b.style.transform="scale(1)",b.style.transition="transform 0.08s ease-out",b.style.whiteSpace="nowrap",f(b,n),u.appendChild(b);const g=document.createElement("button");g.setAttribute("data-home-confirm-continue",""),g.setAttribute("aria-label","つづける"),g.textContent="✋ つづける",g.style.cssText=m,g.style.fontFamily="'Zen Maru Gothic', sans-serif",g.style.background="linear-gradient(135deg, #FF6B6B, #FFE66D)",g.style.color="#FFD700",g.style.textShadow="0 1px 2px rgba(0, 0, 32, 0.6)",g.style.minWidth="88px",g.style.minHeight="88px",g.style.touchAction="manipulation",g.style.transform="scale(1)",g.style.transition="transform 0.08s ease-out",g.style.whiteSpace="nowrap",f(g,a),u.appendChild(g),i.appendChild(this.overlayEl)}hide(){if(this.overlayEl){const t=Array.from(this.activePressCleanups);this.activePressCleanups.clear();for(const e of t)e();this.overlayEl.remove(),this.overlayEl=null}}isVisible(){return this.overlayEl!==null}}class pe{overlayEl=null;activePressCleanups=new Set;show(t,e){if(this.overlayEl)return;const i=document.getElementById("ui-overlay")??document.body;this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-pause-overlay",""),this.overlayEl.setAttribute("role","dialog"),this.overlayEl.setAttribute("aria-modal","true"),this.overlayEl.setAttribute("aria-label","やすみちゅう"),this.overlayEl.style.cssText=`
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
    `,s.appendChild(o);const h=(u,m,f,b,g,r)=>{const d=document.createElement("button");d.setAttribute(m,""),d.setAttribute("aria-label",f),d.textContent=u,d.style.cssText=`
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
      `,d.style.minWidth="140px",d.style.minHeight="88px";const x=R(d,{onActivate:()=>{this.hide(),r()},onPressChange:y=>{d.style.transform=y?"scale(0.94)":"scale(1)"}});return this.activePressCleanups.add(x),d};o.appendChild(h("▶ つづける","data-pause-continue","つづける","linear-gradient(135deg, #FF6B6B, #FFE66D)","#1b1f52",t)),o.appendChild(h("🏠 おうちへ","data-pause-home","おうちへ","rgba(255, 255, 255, 0.18)","#ffffff",e)),i.appendChild(this.overlayEl)}hide(){if(!this.overlayEl)return;const t=Array.from(this.activePressCleanups);this.activePressCleanups.clear();for(const e of t)e();this.overlayEl.remove(),this.overlayEl=null}dispose(){this.hide()}isVisible(){return this.overlayEl!==null}}function ge(l,t){if(t==="LOVELY")return{worldText:`💖 +${l}`,hudText:`+${l}`,kind:"lovely-star",color:"#ff8fd6",shadow:"rgba(255, 143, 214, 0.65)"};const e=l>=500;return{worldText:`${e?"🌈":"⬢"} +${l}`,hudText:`+${l}`,kind:e?"bonus":"normal",color:e?"#ff9cf7":"#ffe066",shadow:e?"rgba(255, 156, 247, 0.55)":"rgba(255, 214, 102, 0.55)"}}class Y{static STYLE_ID="score-popup-animations";static POOL_SIZE=6;static POPUP_LIFETIME_MS=720;root=null;pool=[];highContrastMode=!1;nextRecycleIndex=0;scratch=new Z;setHighContrastMode(t){this.highContrastMode=t}show(t,e,i,s){const a=ge(t,s);this.showPopup({text:a.worldText,kind:a.kind,color:a.color,shadow:a.shadow},e,i)}showLabel(t,e,i,s="normal"){const a=s==="shooting-star"||s==="special-star"||s==="monthly-encounter"||s==="lovely-star"?{text:t,kind:s,color:s==="lovely-star"?"#ff8fd6":"rgb(255, 244, 179)",shadow:s==="lovely-star"?"rgba(255, 143, 214, 0.65)":"rgba(191, 231, 255, 0.75)"}:{text:t,kind:s,color:"#ffe066",shadow:"rgba(255, 214, 102, 0.55)"};this.showPopup(a,e,i)}showPopup(t,e,i){const s=this.ensureRoot();if(!s||(this.scratch.set(e.x,e.y,e.z).project(i),!Number.isFinite(this.scratch.x)||!Number.isFinite(this.scratch.y)||!Number.isFinite(this.scratch.z)))return;const a=Math.round((this.scratch.x*.5+.5)*1e5)/1e3,n=Math.round((-this.scratch.y*.5+.5)*1e5)/1e3,o=this.acquireEntry(s),h=o.useAltAnimation?"scorePopupFloatB":"scorePopupFloatA";o.useAltAnimation=!o.useAltAnimation,o.currentAnimationName=h,o.el.textContent=t.text,o.el.style.left=`${a}%`,o.el.style.top=`${n}%`,o.el.style.color=t.color,o.el.style.textShadow=`0 2px 10px ${t.shadow}`,o.el.style.background=this.highContrastMode?t.kind==="bonus"||t.kind==="shooting-star"||t.kind==="special-star"||t.kind==="monthly-encounter"||t.kind==="lovely-star"?"rgba(13, 18, 38, 0.92)":"rgba(0, 0, 0, 0.82)":"transparent",o.el.style.border=this.highContrastMode?t.kind==="bonus"||t.kind==="shooting-star"||t.kind==="special-star"||t.kind==="monthly-encounter"||t.kind==="lovely-star"?"3px solid rgba(255, 255, 255, 0.95)":"2px dashed rgba(255, 255, 255, 0.95)":"none",o.el.style.borderRadius=this.highContrastMode?"999px":"0",o.el.style.padding=this.highContrastMode?"0.18rem 0.55rem":"0",o.el.style.setProperty("-webkit-text-stroke",this.highContrastMode?"0.6px #061126":"0"),o.el.setAttribute("data-score-popup-kind",t.kind),o.el.style.visibility="visible",o.el.style.opacity="1",o.el.style.animationName=h,o.el.removeAttribute("data-score-popup-active"),o.el.setAttribute("data-score-popup-active",""),o.active=!0;const u=()=>{this.releaseEntry(o)};o.onAnimationEnd=m=>{m.animationName===o.currentAnimationName&&u()},o.el.addEventListener("animationend",o.onAnimationEnd),o.timeoutId=window.setTimeout(u,Y.POPUP_LIFETIME_MS)}dispose(){for(const t of this.pool)this.clearEntry(t),t.el.remove();this.pool=[],this.root?.remove(),this.root=null,this.nextRecycleIndex=0}ensureRoot(){const t=document.getElementById("ui-overlay");return t?(this.root&&(this.root.parentElement!==t||!this.root.isConnected)&&this.dispose(),this.root?this.root:(this.injectStyles(),this.root=document.createElement("div"),this.root.setAttribute("data-score-popup-root",""),this.root.style.position="absolute",this.root.style.inset="0",this.root.style.overflow="hidden",this.root.style.pointerEvents="none",this.root.style.contain="layout style paint",t.appendChild(this.root),this.root)):null}acquireEntry(t){if(this.pool.length<Y.POOL_SIZE){const i=this.createEntry();return this.pool.push(i),t.appendChild(i.el),i}const e=this.pool.find(i=>!i.active)??this.pool[this.nextRecycleIndex++%this.pool.length];return this.clearEntry(e),e}createEntry(){const t=document.createElement("div");return t.setAttribute("data-score-popup",""),t.style.position="absolute",t.style.transform="translate3d(-50%, -50%, 0)",t.style.fontFamily="'Zen Maru Gothic', sans-serif",t.style.fontSize="clamp(1rem, 3.5vmin, 1.4rem)",t.style.fontWeight="900",t.style.lineHeight="1",t.style.whiteSpace="nowrap",t.style.pointerEvents="none",t.style.willChange="transform, opacity",t.style.visibility="hidden",t.style.opacity="0",t.style.animationDuration=`${Y.POPUP_LIFETIME_MS}ms`,t.style.animationTimingFunction="ease-out",t.style.animationIterationCount="1",{el:t,active:!1,timeoutId:null,onAnimationEnd:null,useAltAnimation:!1,currentAnimationName:"none"}}releaseEntry(t){this.clearEntry(t),t.el.style.visibility="hidden",t.el.style.opacity="0"}clearEntry(t){t.active=!1,t.currentAnimationName="none",t.el.removeAttribute("data-score-popup-active"),t.el.removeAttribute("data-score-popup-kind"),t.el.style.animationName="none",t.timeoutId!==null&&(window.clearTimeout(t.timeoutId),t.timeoutId=null),t.onAnimationEnd&&(t.el.removeEventListener("animationend",t.onAnimationEnd),t.onAnimationEnd=null)}injectStyles(){if(document.getElementById(Y.STYLE_ID))return;const t=document.createElement("style");t.id=Y.STYLE_ID,t.textContent=`
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
    `,document.head.appendChild(t)}}class Ii{pendingTimeouts=new Set;container=null;stageNameEl=null;assistMessageEl=null;politeLiveRegionEl=null;assertiveLiveRegionEl=null;scoreEl=null;scoreGainEl=null;starCountEl=null;bestStarContainerEl=null;bestStarCountEl=null;boostButton=null;boostHintEl=null;homeButton=null;pauseButton=null;homeConfirmOverlay=new Oi;pauseOverlay=new pe;muteButton=null;muteHandle=null;cooldownContainer=null;cooldownBar=null;stageProgressContainer=null;stageProgressTrack=null;stageProgressFill=null;stageProgressGoalEl=null;onBoostCallback=null;onBoostDeniedCallback=null;onHomeCallback=null;onHomeConfirmOpenCallback=null;onHomeConfirmCancelCallback=null;onPauseCallback=null;onPauseOpenCallback=null;onPauseResumeCallback=null;onMuteCallback=null;muted=!1;highContrastMode=!1;boostLocked=!1;pauseEnabled=!0;pauseButtonCleanup=null;lastCooldownProgress=1;lastCooldownPct=-1;lastReadyState=null;lastCooldownBarBoxShadow=null;lastBoostButtonAriaDisabled=null;lastBoostReadyRingVisible=null;boostButtonStyleCache={opacity:null,filter:null,animation:null,transform:null};lastPauseButtonAriaDisabled=null;pauseButtonStyleCache={opacity:null,filter:null,cursor:null,transform:null};lastStageProgressPct=-1;lastStageProgressComplete=null;lastScore=-1;lastStarCount=-1;displayedScore=0;scoreAnimationToken=0;scoreGainUseAltAnimation=!1;scoreGainAnimationEndHandler=null;bestStarCount=0;lastBestStarCount=-1;bestStarPulsed=!1;liveRegionWriteNonce=0;lastAnnouncedProgressThreshold=0;show(t,e){const i=document.getElementById("hud");if(!i)return;i.style.zIndex="10";const s=window.innerHeight<=500;this.homeButton=document.createElement("button"),this.homeButton.textContent="🏠",this.homeButton.setAttribute("aria-label","ホームへ もどる"),this.homeButton.style.position="absolute",this.homeButton.style.top="0.8rem",this.homeButton.style.left="1rem",this.homeButton.style.fontSize=s?"clamp(1.1rem, 3.5vmin, 1.4rem)":"clamp(1.4rem, 4vmin, 1.8rem)",this.homeButton.style.background="rgba(255, 255, 255, 0.15)",this.homeButton.style.border="none",this.homeButton.style.borderRadius="50%",this.homeButton.style.width=s?"2.4rem":"3rem",this.homeButton.style.height=s?"2.4rem":"3rem",this.homeButton.style.display="flex",this.homeButton.style.alignItems="center",this.homeButton.style.justifyContent="center",this.homeButton.style.cursor="pointer",this.homeButton.style.pointerEvents="auto",this.homeButton.style.touchAction="manipulation",this.homeButton.style.transform="scale(1)",this.homeButton.style.transition="transform 0.08s ease-out";const a=()=>{this.homeButton&&(this.homeButton.style.transform="scale(1)")};this.homeButton.addEventListener("pointerdown",h=>{h.stopPropagation(),this.homeButton&&(this.homeButton.style.transform="scale(0.9)"),!this.homeConfirmOverlay.isVisible()&&document.getElementById("ui-overlay")&&(this.onHomeConfirmOpenCallback?.(),this.homeConfirmOverlay.show(()=>this.onHomeCallback?.(),()=>this.onHomeConfirmCancelCallback?.()))}),this.homeButton.addEventListener("pointerup",a),this.homeButton.addEventListener("pointercancel",a),this.homeButton.addEventListener("pointerleave",a),i.appendChild(this.homeButton),t&&(this.stageNameEl=document.createElement("div"),this.stageNameEl.textContent=t,this.stageNameEl.style.cssText=`
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
    `,this.bestStarContainerEl.textContent="ベスト ⭐",this.bestStarCountEl=document.createElement("span"),this.bestStarCountEl.textContent="0",this.bestStarContainerEl.appendChild(this.bestStarCountEl),o.appendChild(this.bestStarContainerEl),this.container.appendChild(n),this.container.appendChild(o),i.appendChild(this.container),this.createBoostButton(),this.createMuteButton(),this.applyColorAccessibilityState(),this.createLiveRegions(i)}createStageProgress(t,e){const i=this.toCssColor(e??16766720),s=document.createElement("div");s.setAttribute("data-stage-progress-container",""),s.setAttribute("role","progressbar"),s.setAttribute("aria-label","ゴールまでの すすみ"),s.setAttribute("aria-valuemin","0"),s.setAttribute("aria-valuemax","100"),s.setAttribute("aria-valuenow","0"),s.setAttribute("aria-valuetext","ゴールまで あと 100%"),s.style.position="relative",s.style.display="flex",s.style.alignItems="center",s.style.justifyContent="center",s.style.gap="0.4rem",s.style.margin="0 auto 0.4rem",s.style.width=window.innerHeight<=500?"clamp(100px, 24vmin, 180px)":"clamp(160px, 32vmin, 280px)",s.style.pointerEvents="none",s.style.fontFamily="'Zen Maru Gothic', sans-serif";const a=document.createElement("div");a.setAttribute("data-stage-progress-ship",""),a.textContent="🚀",a.style.fontSize="clamp(0.9rem, 2.4vmin, 1.1rem)",a.style.lineHeight="1",a.style.pointerEvents="none";const n=document.createElement("div");n.setAttribute("data-stage-progress-track",""),n.style.flex="1",n.style.height="14px",n.style.background=this.highContrastMode?"rgba(6, 12, 28, 0.94)":"rgba(255, 255, 255, 0.18)",n.style.borderRadius="7px",n.style.overflow="hidden",n.style.boxShadow="inset 0 2px 6px rgba(0, 0, 0, 0.35)",n.style.border=this.highContrastMode?"3px solid rgba(255, 255, 255, 0.92)":"none";const o=document.createElement("div");o.setAttribute("data-stage-progress-fill",""),o.style.height="100%",o.style.width="0%",o.style.borderRadius="7px",o.style.background=this.highContrastMode?`repeating-linear-gradient(90deg, #ffffff 0 10px, #00ddff 10px 18px, ${i} 18px 30px)`:`linear-gradient(90deg, #00ddff, ${i})`,o.style.transition="width 0.15s linear",o.setAttribute("data-stage-progress-color",i),n.appendChild(o);const h=document.createElement("div");h.setAttribute("data-stage-progress-goal",""),h.textContent="🪐",h.style.fontSize="clamp(0.9rem, 2.4vmin, 1.1rem)",h.style.lineHeight="1",h.style.pointerEvents="none",h.style.textShadow=`0 0 8px ${i}`,s.appendChild(a),s.appendChild(n),s.appendChild(h),t.appendChild(s),this.stageProgressContainer=s,this.stageProgressTrack=n,this.stageProgressFill=o,this.stageProgressGoalEl=h}toCssColor(t){return`#${Math.max(0,Math.min(16777215,Math.floor(t))).toString(16).padStart(6,"0")}`}createMuteButton(){const t=document.getElementById("hud");t&&(this.muteHandle=Ht({initialMuted:this.muted,container:t,onToggle:()=>this.onMuteCallback?.()}),this.muteButton=this.muteHandle.element)}createPauseButton(){const t=document.getElementById("hud");if(!t)return;const e=window.innerHeight<=500;this.pauseButton=document.createElement("button"),this.pauseButton.textContent="✋ やすむ",this.pauseButton.setAttribute("aria-label","やすむ"),this.pauseButton.style.position="absolute",this.pauseButton.style.top="0.8rem",this.pauseButton.style.left=e?"4rem":"4.7rem",this.pauseButton.style.fontFamily="'Zen Maru Gothic', sans-serif",this.pauseButton.style.fontSize=e?"clamp(0.9rem, 3.2vmin, 1rem)":"clamp(1rem, 3.5vmin, 1.15rem)",this.pauseButton.style.fontWeight="900",this.pauseButton.style.padding=e?"0.45rem 0.9rem":"0.7rem 1.2rem",this.pauseButton.style.border="none",this.pauseButton.style.borderRadius="999px",this.pauseButton.style.background="rgba(255, 255, 255, 0.16)",this.pauseButton.style.color="#fff",this.pauseButton.style.cursor="pointer",this.pauseButton.style.pointerEvents="auto",this.pauseButton.style.touchAction="manipulation",this.pauseButton.style.boxShadow="0 4px 14px rgba(0, 0, 0, 0.2)",this.pauseButton.style.transform="scale(1)",this.pauseButton.style.transition="transform 0.08s ease-out, opacity 0.12s ease-out",this.pauseButton.style.minHeight=e?"2.4rem":"3rem",this.pauseButton.style.minWidth=e?"5.6rem":"7rem",this.pauseButtonCleanup=R(this.pauseButton,{onActivate:()=>this.onPauseCallback?.(),canActivate:()=>this.pauseEnabled,onPressChange:i=>{this.writePauseButtonStyle("transform",i?"scale(0.95)":"scale(1)")}}),t.appendChild(this.pauseButton),this.applyPauseButtonState()}createBoostButton(){const t=document.getElementById("ui-overlay");if(!t)return;this.injectBoostAnimations(),this.boostButton=document.createElement("button"),this.boostButton.textContent="🚀 ブースト!",this.boostButton.setAttribute("aria-label","ブースト"),this.boostButton.setAttribute("aria-disabled","false");const e=window.innerHeight<=500;this.boostButton.style.position="absolute",this.boostButton.style.bottom=e?"1rem":"2rem",this.boostButton.style.right=e?"1rem":"2rem",this.boostButton.style.fontFamily="'Zen Maru Gothic', sans-serif",this.boostButton.style.fontSize=e?"clamp(0.85rem, 2.8vmin, 1.05rem)":"clamp(1rem, 3.5vmin, 1.3rem)",this.boostButton.style.fontWeight="700",this.boostButton.style.padding=e?"0.5rem 1rem":"0.8rem 1.5rem",this.boostButton.style.border="none",this.boostButton.style.borderRadius="2rem",this.boostButton.style.background="linear-gradient(135deg, #FF6B6B, #FFD93D, #6BCB77)",this.boostButton.style.color="#fff",this.boostButton.style.cursor="pointer",this.boostButton.style.touchAction="manipulation",this.boostButton.style.pointerEvents="auto",this.boostButton.style.boxShadow="0 4px 15px rgba(255, 107, 107, 0.4)",this.boostButton.style.animation="boostBtnPulse 2s ease-in-out infinite",this.boostButton.addEventListener("pointerdown",i=>{i.stopPropagation();const s=this.boostButton;if(s&&!this.boostLocked){if(this.lastCooldownProgress<1){if(s.hasAttribute("data-boost-shake"))return;s.setAttribute("data-boost-shake",""),this.registerTimeout(()=>{s.removeAttribute("data-boost-shake")},250),this.onBoostDeniedCallback?.();return}this.writeBoostButtonStyle("transform","scale(0.9)"),this.registerTimeout(()=>{this.writeBoostButtonStyle("transform","scale(1.0)")},150),this.onBoostCallback?.()}}),t.appendChild(this.boostButton),this.boostHintEl=document.createElement("div"),this.boostHintEl.setAttribute("data-boost-hint",""),this.boostHintEl.setAttribute("aria-hidden","true"),this.boostHintEl.style.cssText=`
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
    `,document.head.appendChild(t)}setBoostCallback(t){this.onBoostCallback=t}setBoostDeniedCallback(t){this.onBoostDeniedCallback=t}setBoostLocked(t){this.boostLocked=t,this.applyBoostButtonState()}setHomeCallback(t){this.onHomeCallback=t}setHomeConfirmOpenCallback(t){this.onHomeConfirmOpenCallback=t}setHomeConfirmCancelCallback(t){this.onHomeConfirmCancelCallback=t}setPauseCallback(t){this.onPauseCallback=t}setPauseEnabled(t){this.pauseEnabled=t,this.applyPauseButtonState()}setMuteCallback(t){this.onMuteCallback=t}setPauseOpenCallback(t){this.onPauseOpenCallback=t}setPauseResumeCallback(t){this.onPauseResumeCallback=t}setMuteState(t){this.muted=t,this.muteHandle?.setMuted(t)}setHighContrastMode(t){this.highContrastMode=t,this.applyColorAccessibilityState()}applyColorAccessibilityState(){if(this.stageNameEl&&(this.stageNameEl.style.color=this.highContrastMode?"#fff58f":"#FFD700",this.stageNameEl.style.textShadow=this.highContrastMode?"0 0 0 #000, 0 2px 8px rgba(0, 0, 0, 0.9), 0 0 20px rgba(255, 255, 255, 0.25)":"0 2px 8px rgba(0, 0, 0, 0.7)"),this.assistMessageEl&&(this.assistMessageEl.style.background=this.highContrastMode?"rgba(5, 10, 28, 0.96)":"rgba(255, 255, 255, 0.14)",this.assistMessageEl.style.border=this.highContrastMode?"3px solid rgba(255, 255, 255, 0.95)":"none",this.assistMessageEl.style.color=this.highContrastMode?"#ffffff":"#fff7bf"),this.bestStarContainerEl&&(this.bestStarContainerEl.style.color=this.highContrastMode?"#e6f4ff":"#9ec5ff",this.bestStarContainerEl.style.opacity=this.highContrastMode?"1":"0.7"),this.stageProgressTrack&&(this.stageProgressTrack.style.background=this.highContrastMode?"rgba(6, 12, 28, 0.94)":"rgba(255, 255, 255, 0.18)",this.stageProgressTrack.style.border=this.highContrastMode?"3px solid rgba(255, 255, 255, 0.92)":"none"),this.stageProgressFill){const t=this.stageProgressFill.getAttribute("data-stage-progress-color")??"#ffd700";this.stageProgressFill.style.background=this.highContrastMode?`repeating-linear-gradient(90deg, #ffffff 0 10px, #00ddff 10px 18px, ${t} 18px 30px)`:`linear-gradient(90deg, #00ddff, ${t})`}if(this.stageProgressGoalEl){const t=this.stageProgressFill?.getAttribute("data-stage-progress-color")??"#ffd700";this.stageProgressGoalEl.style.textShadow=this.highContrastMode?`0 0 0 #000, 0 0 12px #ffffff, 0 0 18px ${t}`:`0 0 8px ${t}`}this.boostButton&&(this.boostButton.style.border=this.highContrastMode?"4px solid rgba(255, 255, 255, 0.95)":"none",this.boostButton.style.background=this.highContrastMode?"linear-gradient(135deg, #fff27a, #76f0ff, #6BCB77)":"linear-gradient(135deg, #FF6B6B, #FFD93D, #6BCB77)",this.boostButton.style.color=this.highContrastMode?"#0b1535":"#fff"),this.cooldownContainer&&(this.cooldownContainer.style.background=this.highContrastMode?"rgba(6, 12, 28, 0.94)":"rgba(255, 255, 255, 0.2)",this.cooldownContainer.style.border=this.highContrastMode?"2px solid rgba(255, 255, 255, 0.95)":"none",this.cooldownContainer.style.height=this.highContrastMode?"10px":"6px"),this.cooldownBar&&(this.cooldownBar.style.background=this.highContrastMode?"repeating-linear-gradient(90deg, #ffffff 0 10px, #00ddff 10px 18px, #00ff88 18px 30px)":"linear-gradient(90deg, #00ddff, #00ff88)"),this.applyBoostButtonState()}showAssistMessage(t){this.assistMessageEl&&(this.assistMessageEl.textContent=t,this.assistMessageEl.style.display="block",this.announcePolite(t))}hideAssistMessage(){this.assistMessageEl&&(this.assistMessageEl.style.display="none",this.assistMessageEl.textContent="")}showBoostHint(t){!this.boostHintEl||!this.boostButton||!this.cooldownContainer||(this.boostHintEl.textContent=t,this.boostHintEl.style.display="block",this.boostHintEl.setAttribute("data-boost-hint-visible",""),this.boostHintEl.setAttribute("aria-hidden","false"),this.boostButton.setAttribute("data-boost-hint-active",""),this.cooldownContainer.setAttribute("data-boost-hint-active",""))}hideBoostHint(){this.boostHintEl&&(this.boostHintEl.style.display="none",this.boostHintEl.textContent="",this.boostHintEl.removeAttribute("data-boost-hint-visible"),this.boostHintEl.setAttribute("aria-hidden","true")),this.boostButton?.removeAttribute("data-boost-hint-active"),this.cooldownContainer?.removeAttribute("data-boost-hint-active")}isMuted(){return this.muted}update(t,e){if(this.scoreEl&&t!==this.lastScore){const i=this.lastScore;this.setDisplayedScore(t),this.lastScore=t,i!==-1&&t>i&&this.flashCount(this.scoreEl)}if(this.starCountEl&&e!==this.lastStarCount){const i=this.lastStarCount;this.starCountEl.textContent=String(e),this.lastStarCount=e,i!==-1&&e>i&&(this.flashCount(this.starCountEl),this.announcePolite(`ほし ${e}こ ゲット！`))}this.bestStarCount>0&&!this.bestStarPulsed&&e>this.bestStarCount&&this.bestStarContainerEl&&this.bestStarContainerEl.style.display!=="none"&&(this.bestStarPulsed=!0,this.flashCount(this.bestStarContainerEl))}animateScoreGain(t,e){if(!this.scoreEl)return;const i=Math.max(0,Math.round(e)),s=Math.max(0,Math.round(t));if(s<=0){this.setDisplayedScore(i),this.lastScore=i;return}this.lastScore=i,this.flashCount(this.scoreEl),this.showScoreGainPopup(s),this.animateScoreValue(i)}setBestStarCount(t){const e=Number.isInteger(t)&&t>0?t:0;this.bestStarCount=e,this.bestStarPulsed=!1,!(!this.bestStarContainerEl||!this.bestStarCountEl)&&(e>0?(this.lastBestStarCount!==e&&(this.bestStarCountEl.textContent=String(e),this.lastBestStarCount=e),this.bestStarContainerEl.style.display=""):(this.bestStarContainerEl.style.display="none",this.lastBestStarCount=-1))}flashCount(t){if(t.hasAttribute("data-hud-count-pop"))return;t.setAttribute("data-hud-count-pop","");let e=!1;const i=()=>{e||(e=!0,t.removeAttribute("data-hud-count-pop"),t.removeEventListener("animationend",s))},s=a=>{a.animationName==="hudCountPop"&&i()};t.addEventListener("animationend",s),this.registerTimeout(i,500)}setDisplayedScore(t){this.scoreEl&&this.displayedScore!==t&&(this.scoreEl.textContent=String(t)),this.displayedScore=t}animateScoreValue(t){const e=this.displayedScore;if(t<=e){this.setDisplayedScore(t);return}this.scoreAnimationToken+=1;const i=this.scoreAnimationToken,s=t-e,a=Math.min(7,Math.max(4,Math.ceil(s/120))),n=40;for(let o=1;o<=a;o+=1)this.registerTimeout(()=>{if(i!==this.scoreAnimationToken)return;const h=o/a,u=1-(1-h)*(1-h),m=o===a?t:Math.min(t,e+Math.round(s*u));this.setDisplayedScore(m)},o*n)}showScoreGainPopup(t){const e=this.scoreGainEl;if(!e)return;const i=ge(t),s=this.scoreGainUseAltAnimation?"hudScoreGainFloatB":"hudScoreGainFloatA";this.scoreGainUseAltAnimation=!this.scoreGainUseAltAnimation,this.scoreGainAnimationEndHandler&&(e.removeEventListener("animationend",this.scoreGainAnimationEndHandler),this.scoreGainAnimationEndHandler=null),e.textContent=i.hudText,e.style.color=i.color,e.style.textShadow=`0 2px 10px ${i.shadow}`,e.style.animationName=s,e.style.visibility="visible",e.style.opacity="1",e.setAttribute("data-hud-score-gain-kind",i.kind),e.removeAttribute("data-hud-score-gain-active"),e.setAttribute("data-hud-score-gain-active","");let a=!1;const n=()=>{a||(a=!0,e.removeAttribute("data-hud-score-gain-active"),e.style.visibility="hidden",e.style.opacity="0",e.style.animationName="none",e.removeEventListener("animationend",o),this.scoreGainAnimationEndHandler===o&&(this.scoreGainAnimationEndHandler=null))},o=h=>{h.animationName===s&&n()};this.scoreGainAnimationEndHandler=o,e.addEventListener("animationend",o),this.registerTimeout(n,620)}registerTimeout(t,e){let i=0;return i=window.setTimeout(()=>{this.pendingTimeouts.delete(i),t()},e),this.pendingTimeouts.add(i),i}clearPendingTimeouts(){for(const t of this.pendingTimeouts)window.clearTimeout(t);this.pendingTimeouts.clear()}updateCooldown(t){if(!this.cooldownBar||!this.boostButton)return;const e=Math.max(0,Math.min(1,t)),i=Math.round(e*100);i!==this.lastCooldownPct&&(this.cooldownBar.style.width=`${i}%`,this.lastCooldownPct=i),this.lastCooldownProgress=e;const s=e>=1;s!==this.lastReadyState&&(this.lastReadyState=s,this.applyBoostButtonState())}updateStageProgress(t){if(!this.stageProgressContainer||!this.stageProgressFill)return;const e=Math.max(0,Math.min(1,t)),i=Math.round(e*100);i!==this.lastStageProgressPct&&(this.stageProgressFill.style.width=`${i}%`,this.stageProgressContainer.setAttribute("aria-valuenow",String(i)),this.stageProgressContainer.setAttribute("aria-valuetext",`ゴールまで あと ${100-i}%`),this.lastStageProgressPct=i),this.announceStageProgressMilestone(i);const s=e>=1;s!==this.lastStageProgressComplete&&(s?(this.stageProgressContainer.setAttribute("data-stage-progress-complete",""),this.flashStageGoal()):this.stageProgressContainer.removeAttribute("data-stage-progress-complete"),this.lastStageProgressComplete=s)}flashStageGoal(){const t=this.stageProgressGoalEl;if(!t||t.hasAttribute("data-stage-goal-flash"))return;t.setAttribute("data-stage-goal-flash","");let e=!1;const i=()=>{e||(e=!0,t.removeAttribute("data-stage-goal-flash"),t.removeEventListener("animationend",s))},s=a=>{a.animationName==="stageGoalFlash"&&i()};t.addEventListener("animationend",s),this.registerTimeout(i,500)}flashBoostReady(){const t=this.boostButton;if(!t||t.hasAttribute("data-boost-ready-flash"))return;this.announcePolite("ブースト じゅんび OK！"),t.setAttribute("data-boost-ready-flash","");let e=!1;const i=()=>{e||(e=!0,t.removeAttribute("data-boost-ready-flash"),t.removeEventListener("animationend",s),this.lastReadyState===!0&&this.writeBoostButtonStyle("animation","boostBtnPulse 2s ease-in-out infinite, boostReadyRing 1.15s ease-in-out infinite"))},s=a=>{a.animationName==="boostBtnReadyFlash"&&i()};t.addEventListener("animationend",s),this.registerTimeout(i,500)}clearBoostReadyFlash(){this.boostButton?.hasAttribute("data-boost-ready-flash")&&this.boostButton.removeAttribute("data-boost-ready-flash")}announceMeteoriteHit(){this.announceAssertive("いんせきに ぶつかった！ シールド かいふくちゅう")}announceStageClear(t,e=!1,i=!1){const s=[`ステージ クリア！ ほし ${t}こ あつめたよ！`];i&&s.push("じこベスト こうしん！"),e&&s.push("あたらしい なかまも みつけたよ！"),this.announceAssertive(s.join(" "))}applyBoostButtonState(){if(!this.cooldownBar||!this.boostButton)return;const e=this.lastCooldownProgress>=1&&!this.boostLocked;this.setCooldownBarBoxShadow(e?this.highContrastMode?"0 0 0 2px rgba(255, 255, 255, 0.7), 0 0 14px #00ff88":"0 0 10px #00ff88":"none"),this.writeBoostButtonStyle("opacity",e?"1":"0.5"),this.writeBoostButtonStyle("filter",e?"none":"grayscale(0.8)"),this.writeBoostButtonStyle("animation",e?"boostBtnPulse 2s ease-in-out infinite, boostReadyRing 1.15s ease-in-out infinite":"none"),this.setBoostReadyRing(e),this.setBoostButtonAriaDisabled(e?"false":"true"),e||(this.clearBoostReadyFlash(),this.hideBoostHint())}applyPauseButtonState(){this.pauseButton&&(this.writePauseButtonStyle("opacity",this.pauseEnabled?"1":"0.45"),this.writePauseButtonStyle("filter",this.pauseEnabled?"none":"grayscale(0.8)"),this.writePauseButtonStyle("cursor",this.pauseEnabled?"pointer":"default"),this.setPauseButtonAriaDisabled(this.pauseEnabled?"false":"true"))}writeBoostButtonStyle(t,e){!this.boostButton||this.boostButtonStyleCache[t]===e||(this.boostButton.style[t]=e,this.boostButtonStyleCache[t]=e)}writePauseButtonStyle(t,e){!this.pauseButton||this.pauseButtonStyleCache[t]===e||(this.pauseButton.style[t]=e,this.pauseButtonStyleCache[t]=e)}setCooldownBarBoxShadow(t){!this.cooldownBar||this.lastCooldownBarBoxShadow===t||(this.cooldownBar.style.boxShadow=t,this.lastCooldownBarBoxShadow=t)}setBoostReadyRing(t){!this.boostButton||this.lastBoostReadyRingVisible===t||(t?this.boostButton.setAttribute("data-boost-ready-ring",""):this.boostButton.removeAttribute("data-boost-ready-ring"),this.lastBoostReadyRingVisible=t)}setBoostButtonAriaDisabled(t){!this.boostButton||this.lastBoostButtonAriaDisabled===t||(this.boostButton.setAttribute("aria-disabled",t),this.lastBoostButtonAriaDisabled=t)}setPauseButtonAriaDisabled(t){!this.pauseButton||this.lastPauseButtonAriaDisabled===t||(this.pauseButton.setAttribute("aria-disabled",t),this.lastPauseButtonAriaDisabled=t)}createLiveRegions(t){this.politeLiveRegionEl=this.createLiveRegion("polite"),this.assertiveLiveRegionEl=this.createLiveRegion("assertive"),t.appendChild(this.politeLiveRegionEl),t.appendChild(this.assertiveLiveRegionEl)}createLiveRegion(t){const e=document.createElement("div");return e.setAttribute("data-hud-live-region",t),e.setAttribute("aria-live",t),e.setAttribute("aria-atomic","true"),e.setAttribute("role",t==="assertive"?"alert":"status"),e.style.cssText=`
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    `,e}announcePolite(t){this.writeLiveRegion(this.politeLiveRegionEl,t)}announceAssertive(t){this.writeLiveRegion(this.assertiveLiveRegionEl,t)}writeLiveRegion(t,e){if(!t||e.length===0)return;this.liveRegionWriteNonce+=1;const i=this.liveRegionWriteNonce%2===0?"​":"‌";t.textContent=`${e}${i}`,t.setAttribute("data-live-message",e)}announceStageProgressMilestone(t){if(t>=100){this.lastAnnouncedProgressThreshold<100&&(this.announcePolite("ゴール！"),this.lastAnnouncedProgressThreshold=100);return}const e=[{pct:75,remaining:25},{pct:50,remaining:50},{pct:25,remaining:75}];for(const i of e)t>=i.pct&&this.lastAnnouncedProgressThreshold<i.pct&&(this.lastAnnouncedProgressThreshold=i.pct,this.announcePolite(`ゴールまで あと ${i.remaining}%`))}hide(){this.clearPendingTimeouts(),this.homeConfirmOverlay.hide(),this.pauseOverlay.hide(),this.homeButton&&(this.homeButton.remove(),this.homeButton=null),this.pauseButtonCleanup?.(),this.pauseButtonCleanup=null,this.pauseButton&&(this.pauseButton.remove(),this.pauseButton=null),this.muteHandle&&(this.muteHandle.remove(),this.muteHandle=null),this.muteButton=null,this.stageNameEl&&(this.stageNameEl.remove(),this.stageNameEl=null),this.assistMessageEl&&(this.assistMessageEl.remove(),this.assistMessageEl=null),this.politeLiveRegionEl&&(this.politeLiveRegionEl.remove(),this.politeLiveRegionEl=null),this.assertiveLiveRegionEl&&(this.assertiveLiveRegionEl.remove(),this.assertiveLiveRegionEl=null),this.stageProgressContainer&&(this.stageProgressContainer.remove(),this.stageProgressContainer=null),this.stageProgressTrack=null,this.stageProgressFill=null,this.stageProgressGoalEl=null,this.container&&(this.container.remove(),this.container=null),this.boostButton&&(this.boostButton.remove(),this.boostButton=null),this.boostHintEl&&(this.boostHintEl.remove(),this.boostHintEl=null),this.cooldownContainer&&(this.cooldownContainer.remove(),this.cooldownContainer=null),this.cooldownBar=null,this.boostLocked=!1,this.pauseEnabled=!0,this.lastCooldownProgress=1,this.lastCooldownPct=-1,this.lastReadyState=null,this.lastCooldownBarBoxShadow=null,this.lastBoostButtonAriaDisabled=null,this.lastBoostReadyRingVisible=null,this.boostButtonStyleCache={opacity:null,filter:null,animation:null,transform:null},this.lastPauseButtonAriaDisabled=null,this.pauseButtonStyleCache={opacity:null,filter:null,cursor:null,transform:null},this.lastStageProgressPct=-1,this.lastStageProgressComplete=null,this.lastScore=-1,this.lastStarCount=-1,this.displayedScore=0,this.scoreAnimationToken=0,this.scoreGainUseAltAnimation=!1,this.scoreGainAnimationEndHandler=null,this.scoreEl=null,this.scoreGainEl=null,this.starCountEl=null,this.bestStarContainerEl=null,this.bestStarCountEl=null,this.bestStarCount=0,this.lastBestStarCount=-1,this.bestStarPulsed=!1,this.liveRegionWriteNonce=0,this.lastAnnouncedProgressThreshold=0}}class Di{overlayEl=null;bubbleEl=null;highContrastMode=!1;show(t,e){const i=document.getElementById("ui-overlay");i&&(this.injectStyles(),(!this.overlayEl||!this.bubbleEl)&&(this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-adaptive-tutorial-hint",""),this.overlayEl.setAttribute("aria-hidden","true"),this.overlayEl.style.cssText=`
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
    `,document.head.appendChild(t)}}const Li=1,Gi=.4;class Jt{overlayEl=null;numberEl=null;phase="idle";elapsed=0;currentStep=0;stepDuration;goDuration;onTick;onGo;onComplete=null;steps=["3","2","1"];constructor(t={}){this.stepDuration=t.stepDuration??Li,this.goDuration=t.goDuration??Gi,this.onTick=t.onTick,this.onGo=t.onGo}show(t){if(this.phase!=="idle"&&this.phase!=="done")return;const e=document.getElementById("ui-overlay")??document.body;this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-countdown-overlay",""),this.overlayEl.style.cssText=`
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
    `,this.overlayEl.appendChild(this.numberEl),e.appendChild(this.overlayEl),this.phase="counting",this.elapsed=0,this.currentStep=0,this.onComplete=t,this.renderStep(this.steps[this.currentStep]),this.fireTick()}tick(t){if(!(this.phase==="idle"||this.phase==="done")){if(t<0&&(t=0),this.elapsed+=t,this.phase==="counting"){const e=this.elapsed;this.applyStepAnimation(e/this.stepDuration),e>=this.stepDuration&&(this.currentStep++,this.elapsed=0,this.currentStep<this.steps.length?(this.renderStep(this.steps[this.currentStep]),this.fireTick()):(this.phase="go",this.renderStep("スタート！"),this.fireGo()));return}this.phase==="go"&&(this.applyStepAnimation(this.elapsed/this.goDuration),this.elapsed>=this.goDuration&&this.complete())}}hide(){this.overlayEl&&(this.overlayEl.remove(),this.overlayEl=null),this.numberEl=null,this.phase="done",this.onComplete=null}dispose(){this.hide(),this.onTick=void 0,this.onGo=void 0}isActive(){return this.phase==="counting"||this.phase==="go"}getCurrentLabel(){return this.numberEl?.textContent??null}renderStep(t){this.numberEl&&(this.numberEl.textContent=t,this.numberEl.style.opacity="0",this.numberEl.style.transform="scale(0.6)")}applyStepAnimation(t){if(!this.numberEl)return;const e=Math.max(0,Math.min(1,t));let i,s;if(e<.2){const a=e/.2;i=.6+a*.5,s=a}else if(e<.7)i=1.1-(e-.2)/.5*.1,s=1;else{const a=(e-.7)/.3;i=1+a*.2,s=1-a}this.numberEl.style.transform=`scale(${i.toFixed(3)})`,this.numberEl.style.opacity=s.toFixed(3)}fireTick(){try{this.onTick?.()}catch{}}fireGo(){try{this.onGo?.()}catch{}}complete(){const t=this.onComplete;if(this.hide(),t)try{t()}catch{}}}const zi=1.8;class Hi{constructor(t,e={}){this.entry=t,this.totalDuration=e.totalDuration??zi}overlayEl=null;cardEl=null;phase="idle";elapsed=0;onComplete=null;totalDuration;show(t){if(this.phase!=="idle"&&this.phase!=="done")return;const e=document.getElementById("ui-overlay")??document.body;ae();const i=_().height<=500;this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-stage-intro-overlay",""),this.overlayEl.style.cssText=`
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
    `,this.cardEl.append(s,a,n,o),this.overlayEl.appendChild(this.cardEl),e.appendChild(this.overlayEl),this.phase="showing",this.elapsed=0,this.onComplete=t,this.applyAnimation(0)}tick(t){this.phase==="showing"&&(this.elapsed+=Math.max(0,t),this.applyAnimation(this.elapsed/this.totalDuration),this.elapsed>=this.totalDuration&&this.complete())}hide(){this.overlayEl&&(this.overlayEl.remove(),this.overlayEl=null),this.cardEl=null,this.phase="done",this.onComplete=null}dispose(){this.hide()}isActive(){return this.phase==="showing"}applyAnimation(t){if(!this.overlayEl||!this.cardEl)return;const e=Math.max(0,Math.min(1,t));let i=1,s=1,a=0,n=1;if(e<.18){const o=e/.18;s=o,i=o,a=24-24*o,n=.92+.1*o}else if(e<.72){const o=(e-.18)/.54;s=1,i=1,a=0,n=1.02-.02*o}else{const o=(e-.72)/.28;s=1-o*.8,i=1-o,a=-18*o,n=1-.04*o}this.overlayEl.style.opacity=s.toFixed(3),this.cardEl.style.opacity=i.toFixed(3),this.cardEl.style.transform=`translateY(${a.toFixed(1)}px) scale(${n.toFixed(3)})`}complete(){const t=this.onComplete;if(this.hide(),!!t)try{t()}catch{}}}class Ni{overlayEl=null;leftGuideEl=null;rightGuideEl=null;instructionEl=null;currentMode=null;show(t="intro"){if(this.overlayEl){this.setMode(t);return}const e=document.getElementById("ui-overlay");e&&(this.injectStyles(),this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-touch-guide-overlay",""),this.overlayEl.setAttribute("role","region"),this.overlayEl.setAttribute("aria-label","そうさ ガイド"),this.overlayEl.style.cssText=`
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
    `,document.head.appendChild(t)}getActiveSide(t){return t==="active-left"?"left":t==="active-right"?"right":t==="assist-left"?"left":t==="assist-right"?"right":t==="hidden"?"none":"both"}getGuideEmphasis(t,e){return e==="active-left"?t==="left"?"primary":"secondary":e==="active-right"?t==="right"?"primary":"secondary":e==="assist-left"?t==="left"?"primary":"secondary":e==="assist-right"?t==="right"?"primary":"secondary":e==="hidden"?"hidden":"balanced"}updateInstruction(t){if(!this.instructionEl)return;const e=this.getInstructionMessage(t);this.instructionEl.textContent=e,this.instructionEl.setAttribute("data-touch-guide-message",e)}getInstructionMessage(t){return t==="intro"?"ひだりか みぎを さわると うごけるよ":t==="idle"?"ひつような ときは ひだりか みぎを さわって うごこう":t==="assist-left"?"ひだりへ よけよう":t==="assist-right"?"みぎへ よけよう":""}}class vt{static DEFAULT_DURATION=4.2;static CELEBRATION_DURATION=3.6;element=null;timer=0;message=null;highContrast=!1;showHint(t){this.showMessage(t,vt.DEFAULT_DURATION)}showCelebration(t){this.showMessage(t,vt.CELEBRATION_DURATION)}tick(t){this.timer<=0||(this.timer=Math.max(0,this.timer-t),this.timer===0&&this.hide())}hide(){this.timer=0,this.message=null,this.element&&(this.element.style.display="none",this.element.textContent="",this.element.removeAttribute("data-constellation-message"))}setHighContrastMode(t){this.highContrast=t,this.element&&this.applyElementStyle(this.element)}getMessage(){return this.message}showMessage(t,e){const i=this.ensureElement();this.timer=e,this.message=t,i.textContent=t,i.setAttribute("data-constellation-message",t),i.style.display="flex"}ensureElement(){if(this.element)return this.element;const t=document.getElementById("ui-overlay"),e=document.createElement("div");return e.setAttribute("data-constellation-hint",""),e.setAttribute("aria-live","polite"),this.applyElementStyle(e),e.style.display="none",t?.appendChild(e),this.element=e,e}applyElementStyle(t){t.style.cssText=`
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
    `}}const _i=4;class Fi{overlayEl=null;cardEl=null;titleEl=null;messageEl=null;elapsed=0;visible=!1;highContrastMode=!1;totalDuration;constructor(t={}){this.totalDuration=t.totalDuration??_i}show(t){const e=document.getElementById("ui-overlay")??document.body;ae();const i=_().height<=500;(!this.overlayEl||!this.cardEl||!this.titleEl||!this.messageEl)&&(this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-seasonal-event-notice",""),this.overlayEl.style.cssText=`
        position: absolute;
        top: clamp(4.6rem, 12vh, 6.8rem);
        left: 50%;
        transform: translateX(-50%);
        z-index: 14;
        pointer-events: none;
      `,this.cardEl=document.createElement("div"),this.cardEl.setAttribute("data-seasonal-event-notice-card",""),this.titleEl=document.createElement("div"),this.titleEl.setAttribute("data-seasonal-event-notice-title",""),this.messageEl=document.createElement("div"),this.messageEl.setAttribute("data-seasonal-event-notice-message",""),this.messageEl.setAttribute("role","status"),this.messageEl.setAttribute("aria-live","polite"),this.messageEl.setAttribute("aria-atomic","true"),this.cardEl.append(this.titleEl,this.messageEl),this.overlayEl.appendChild(this.cardEl)),this.overlayEl.style.display="block",this.visible=!0,this.elapsed=0,this.titleEl.textContent=`${t.emoji} ${t.title}`,this.messageEl.textContent=t.noticeMessage,this.overlayEl.setAttribute("data-seasonal-event-id",t.id),this.overlayEl.setAttribute("aria-hidden","false"),this.applyStyles(t.accentColor,i),this.overlayEl.isConnected||e.appendChild(this.overlayEl)}tick(t){this.visible&&(this.elapsed+=Math.max(0,t),this.elapsed>=this.totalDuration&&this.hide())}hide(){this.overlayEl&&(this.visible=!1,this.elapsed=0,this.overlayEl.remove(),this.overlayEl=null,this.cardEl=null,this.titleEl=null,this.messageEl=null)}dispose(){this.hide()}isVisible(){return this.visible}setHighContrastMode(t){this.highContrastMode=t;const e=this.overlayEl?.getAttribute("data-seasonal-event-id")?this.overlayEl?.getAttribute("data-seasonal-event-accent"):null;!this.cardEl||!e||this.applyStyles(Number(e),_().height<=500)}applyStyles(t,e){if(!this.overlayEl||!this.cardEl||!this.titleEl||!this.messageEl)return;const i=`#${t.toString(16).padStart(6,"0")}`;this.overlayEl.setAttribute("data-seasonal-event-accent",String(t)),this.cardEl.style.cssText=`
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
    `}}class $i{overlayEl=null;continueButton=null;retryButton=null;rewardButton=null;isContinueEnabled=!1;hasHandledContinue=!1;isRewardOpen=!1;buttonCleanups=new Set;show(t){this.hide();const e=document.getElementById("ui-overlay");if(!e)return;this.isContinueEnabled=!1,this.hasHandledContinue=!1,this.isRewardOpen=!1,this.injectStageClearBurstAnimation();const i=document.createElement("div");i.setAttribute("data-stage-clear-overlay",""),i.style.cssText=`
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
    `;const a=kt(t,e,{label:"こんかい",hint:`⭐ ${e}`,size:"hero",scope:"stage-clear-current"});a.style.minWidth="136px",a.style.padding="0.65rem 0.8rem",a.style.borderRadius="20px",a.style.background="rgba(255, 255, 255, 0.12)";const n=kt(t,i,{label:"ベスト",hint:`⭐ ${i}`,size:"hero",scope:"stage-clear-best"});return n.style.minWidth="136px",n.style.padding="0.65rem 0.8rem",n.style.borderRadius="20px",n.style.background="rgba(255, 255, 255, 0.12)",s.append(a,n),s}createNextAdventureCard(t){const e=document.createElement("section");e.setAttribute("data-stage-clear-next-preview",""),e.style.cssText=`
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
    `,this.buttonCleanups.add(R(e,{canActivate:()=>!this.isRewardOpen,onActivate:()=>{this.isRewardOpen||t.onReward?.()},onPressChange:i=>{e.style.transform=i?"scale(0.96)":"scale(1)"},preventDefaultOnPointerDown:!0,preventDefaultOnClick:!0,stopPropagation:!0})),this.rewardButton=e,e}attachActionHandlers(t,e){const i=()=>!this.isRewardOpen&&this.isContinueEnabled&&!this.hasHandledContinue,s=R(t,{canActivate:i,onActivate:()=>{if(i()){this.hasHandledContinue=!0;for(const a of[this.retryButton,this.continueButton])a&&(a.disabled=!0,a.style.pointerEvents="none",a.style.transform="scale(1)");e()}},onPressChange:a=>{t.style.transform=a?"scale(0.96)":"scale(1)"},preventDefaultOnPointerDown:!0,preventDefaultOnClick:!0,stopPropagation:!0});this.buttonCleanups.add(s)}appendClearCelebrationBurst(){if(!this.overlayEl)return;const t=document.createElement("div");t.setAttribute("data-stage-clear-burst",""),t.style.cssText=`
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
    `,document.head.appendChild(t)}}const Vi=2600,te={gentle:{title:"うちゅうせんを かるくしたよ ⭐",detail:"ほしと きらきらを すこし やさしく したよ"},stronger:{title:"もっと かるくしたよ 🚀",detail:"なめらかに あそべるように えんしゅつを ぎゅっと したよ"}};class Ui{overlayEl=null;hideTimer=null;show(t){if(!this.overlayEl){const a=document.getElementById("ui-overlay")??document.body,n=document.createElement("div");n.setAttribute("data-frame-rate-hint-overlay",""),n.setAttribute("role","status"),n.setAttribute("aria-live","polite"),n.style.cssText=`
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
      `,this.overlayEl=n,a.appendChild(n)}const e=t.level>=2?te.stronger:te.gentle,i=this.overlayEl.querySelector("[data-frame-rate-hint-title]"),s=this.overlayEl.querySelector("[data-frame-rate-hint-detail]");i&&(i.textContent=e.title),s&&(s.textContent=e.detail),this.hideTimer!==null&&window.clearTimeout(this.hideTimer),this.hideTimer=window.setTimeout(()=>{this.hide()},Vi)}hide(){this.hideTimer!==null&&(window.clearTimeout(this.hideTimer),this.hideTimer=null),this.overlayEl?.remove(),this.overlayEl=null}dispose(){this.hide()}isVisible(){return this.overlayEl!==null}}class ji{root=null;remainingEl=null;countEl=null;messageEl=null;resultEl=null;show(t){this.hide();const e=document.getElementById("ui-overlay");if(!e)return;const i=document.createElement("div");i.setAttribute("data-bonus-time-overlay",""),i.style.cssText=`
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
    `,n.append(this.remainingEl,this.countEl),s.append(a,n,this.messageEl,this.resultEl),i.appendChild(s),e.appendChild(i),this.root=i,this.update(t)}update(t){!this.root||!this.remainingEl||!this.countEl||!this.messageEl||(this.remainingEl.textContent=`あと ${Math.max(0,Math.ceil(t.remainingSeconds))}びょう`,this.countEl.textContent=`あつめた ほし ${Math.max(0,Math.floor(t.collectedStars))}こ`,this.messageEl.textContent=t.message)}showResult(t){!this.root||!this.resultEl||(this.resultEl.style.display="block",this.resultEl.textContent=t.message,this.update({remainingSeconds:0,collectedStars:t.collectedStars,message:"キラキラ はなび！"}))}hide(){this.root?.remove(),this.root=null,this.remainingEl=null,this.countEl=null,this.messageEl=null,this.resultEl=null}}const Mt=1,Wi=2e3,Bt={starCollect:{duration:.09,amplitudeX:.04,amplitudeY:.025,frequency:34},rainbowCollect:{duration:.12,amplitudeX:.07,amplitudeY:.04,frequency:32},constellationCelebrate:{duration:.2,amplitudeX:.09,amplitudeY:.05,frequency:24},meteoriteHit:{duration:.28,amplitudeX:.18,amplitudeY:.12,frequency:42},boost:{duration:.14,amplitudeX:.08,amplitudeY:.045,frequency:28},stageClear:{duration:.3,amplitudeX:.1,amplitudeY:.06,frequency:22}};function Zi(l){const t=window.requestIdleCallback;if(typeof t=="function"){t(l,{timeout:1500});return}window.setTimeout(l,800)}class v{static VISUAL_QUALITY_SCALE_BY_TIER=[.45,.7,1];static BG_STAR_COUNT=Wi;static ASSIST_TRIGGER_HIT_WINDOW=6;static ASSIST_TRIGGER_HIT_COUNT=2;static ASSIST_DURATION=5;static ASSIST_MESSAGE_DURATION=3;static ASSIST_METEORITE_INTERVAL_MULTIPLIER=1.7;static ASSIST_MESSAGE="だいじょうぶ！ ゆっくりいこう ✨";static ASSIST_DIRECTION_REFRESH_INTERVAL=.35;static ASSIST_DIRECTION_LOOKAHEAD=42;static ASSIST_DIRECTION_SIDE_TARGET_X=4.5;static ASSIST_DIRECTION_SIDE_RANGE=7.5;static ASSIST_DIRECTION_DIFF_THRESHOLD=1.1;static ASSIST_DIRECTION_DIFF_RATIO=.28;threeScene;camera;lastAspect=0;initialized=!1;sceneManager;inputSystem;audioManager;saveManager;ambientLight;directionalLight;spaceship;stars=[];meteorites=[];shootingStars=[];comets=[];specialShootingStars=[];monthlyEncounters=[];collisionSystem=new ve;scoreSystem=new Se;spawnSystem=new Ee;boostSystem=new xe;lodSystem=new Ce;meteoShowerEventSystem=new we;stageSpecialEventSystem=new Te;spaceWeatherEventSystem=new Ae;specialStarSpawnSystem=new Me;seasonalEventSystem;monthlyEncounterSystem=new Be;hud;scorePopupManager=new Y;scorePopupEffect=new Pe;particleBurstManager=new ke;planetRingEffect=new Re;constellationLineEffect=new Oe;constellationCelebrationEffect=new Ie;constellationSystem=new De;constellationHintOverlay=new vt;airShield;meteoShowerEffect;spaceWeatherEffect;stageSpecialEffects;seasonalEventEffects=new Le;monthlyEncounterEffect=new Ge;lovelyStarBurstEffect=new ze;starBonusEffect=new He;rainbowTrailEffect;stageAtmosphereEffect=new ne;wormholeTunnelEffect=new Ne;seasonalEventNotice=new Fi;bonusTimeOverlay=new ji;bonusCollectionSystem=new _e;stageConfig;stageNumber=1;launchSource="campaign";isCleared=!1;clearTimer=0;stageClearOverlay=new $i;isClearRewardOpen=!1;isOpeningClearReward=!1;clearRewardOverlay=null;clearRewardOverlayPromise=null;static CLEAR_CONTINUE_DELAY=.6;static BONUS_TIME_DURATION=10;static BONUS_RESULT_DURATION=2.2;stageEntryTotalScore=0;stageEntryTotalStarCount=0;isBonusTime=!1;isBonusResultVisible=!1;bonusTimeRemaining=0;bonusCollectedStars=0;bonusResultTimer=0;playTime=0;meteoriteHitTimes=[];assistTimer=0;assistMessageTimer=0;assistDirection=null;assistDirectionRefreshTimer=0;damageTimer=0;static DAMAGE_FLASH_DURATION=.5;cameraShakeTimer=0;cameraShakeElapsed=0;cameraShakeOffset=new Z;cameraShakeProfile=Bt.meteoriteHit;motionSensitivity=W();cameraPositionTarget=new Z(0,5,10);cameraLookAtTarget=new Z(0,0,-10);destinationPlanet=null;destinationPlanetSpinTarget=null;static DESTINATION_PLANET_SPIN_SPEED=.2;static BOOST_HINT_DURATION=2.4;static ADAPTIVE_HINT_DURATION=3;static SHOOTING_STAR_SCORE_BONUS_DURATION=6;static LOVELY_STAR_SCORE_BONUS_DURATION=3;static LOVELY_STAR_BONUS_SCORE=200;static METEO_SHOWER_MESSAGE="りゅうせいぐんだ！ ✨";static METEO_SHOWER_MESSAGE_DURATION=2.4;static STAGE_SPECIAL_MESSAGE_DURATION=2.8;static WORMHOLE_TRANSITION_DURATION=2.2;bgStars=null;boostLinesEffect;companionManager=null;elapsedTime=0;boostFlameEffect;isStarting=!1;stageIntroOverlay=null;countdownOverlay=null;awaitingResume=!1;resumeCountdownOverlay=null;isHomeConfirmOpen=!1;shouldResumeAfterHomeConfirm=!1;pauseOverlay=new pe;isPauseOpen=!1;shouldResumeAfterPause=!1;touchGuide=new Ni;touchFeedbackOverlay=new q;touchGuideMode="intro";touchGuideIdleTimer=0;hasSeenMoveInput=!1;isActive=!1;boostHintDisplayTimer=0;adaptiveHintDisplayTimer=0;adaptiveTutorialSystem=new Fe;adaptiveTutorialHint=new Di;meteoShowerAnnouncementTimer=0;spaceWeatherAnnouncementTimer=0;spaceWeatherAnnouncementMessage="";stageSpecialAnnouncementTimer=0;stageSpecialAnnouncementMessage="";prewarmRequestToken=0;static TOUCH_GUIDE_IDLE_DELAY=3;visualQualityTier=v.VISUAL_QUALITY_SCALE_BY_TIER.length-1;performanceAdaptationLevel=0;frameRateHintOverlay=new Ui;scheduleIdleTask;loadEncyclopediaOverlay;clearRewardRequestToken=0;wormholeTransitionTimer=0;pendingWormholeTransition=null;onPauseRequested=null;onResumeRequested=null;onExitHomeRequested=null;attemptStatsRecorded=!1;constructor(t,e,i,s,a={}){this.sceneManager=t,this.inputSystem=e,this.audioManager=i,this.saveManager=s,this.scoreSystem.setScoreGainListener(h=>{this.initialized&&this.hud.animateScoreGain(h.amount,h.stageScore),h.worldPosition&&(this.scorePopupEffect.emit(h.worldPosition,h.amount),h.kind==="bonus"&&this.scorePopupManager.show(h.amount,h.worldPosition,this.camera))}),this.scheduleIdleTask=a.scheduleIdleTask??Zi,this.seasonalEventSystem=new $e(a.seasonalEventDateProvider),this.loadEncyclopediaOverlay=a.loadEncyclopediaOverlay??(()=>Pt(()=>import("./EncyclopediaOverlay-CJxa9-SV.js"),__vite__mapDeps([0,1,2]))),this.threeScene=new lt,this.threeScene.background=new ht(32);const{width:n,height:o}=_();this.camera=new Et(60,n/o,.1,2e3)}ensureInitialized(){this.initialized||(this.ambientLight=new St(16777215,.6),this.directionalLight=new le(16777215,.8),this.directionalLight.position.set(5,10,5),this.threeScene.add(this.ambientLight),this.threeScene.add(this.directionalLight),this.spaceship=new oe,this.threeScene.add(this.spaceship.mesh),this.airShield=new Ve,this.threeScene.add(this.airShield.getMesh()),this.companionManager=new Ot([]),this.threeScene.add(this.companionManager.getGroup()),this.boostLinesEffect=new Ue,this.boostLinesEffect.init(this.threeScene),this.boostFlameEffect=new je,this.boostFlameEffect.init(this.threeScene),this.rainbowTrailEffect=new We,this.threeScene.add(this.rainbowTrailEffect.group),this.constellationLineEffect.init(this.threeScene),this.constellationCelebrationEffect.init(this.threeScene),this.meteoShowerEffect=new Ze,this.meteoShowerEffect.init(this.threeScene),this.spaceWeatherEffect=new Ye,this.spaceWeatherEffect.init(this.threeScene),this.stageSpecialEffects=new qe,this.stageSpecialEffects.init(this.threeScene),this.seasonalEventEffects.init(this.threeScene),this.stageAtmosphereEffect.init(this.threeScene),this.wormholeTunnelEffect.init(this.threeScene),this.scorePopupEffect.init(this.threeScene),this.monthlyEncounterEffect.init(this.threeScene),this.lovelyStarBurstEffect.init(this.threeScene),this.starBonusEffect.init(this.threeScene),this.hud=new Ii,this.initialized=!0,this.applyVisualQualityTier())}setVisualQualityTier(t){this.visualQualityTier=v.clampVisualQualityTier(t),this.applyVisualQualityTier()}setPerformanceAdaptationLevel(t){this.performanceAdaptationLevel=v.clampPerformanceAdaptationLevel(t),this.applyVisualQualityTier()}showFrameRateHint(t){this.isActive&&this.frameRateHintOverlay.show({level:t})}enter(t){this.ensureInitialized(),this.isActive=!0,this.prewarmRequestToken+=1,this.clearRewardRequestToken+=1,this.lastAspect=0,this.stageNumber=t.stageNumber??1,this.launchSource=t.launchSource??"campaign",this.stageConfig=X(this.stageNumber),this.prefetchEndingSceneModuleIfNeeded(),this.isCleared=!1,this.clearTimer=0,this.isBonusTime=!1,this.isBonusResultVisible=!1,this.bonusTimeRemaining=0,this.bonusCollectedStars=0,this.bonusResultTimer=0,this.bonusCollectionSystem.reset(),this.bonusTimeOverlay.hide(),this.starBonusEffect.clear(),this.stageClearOverlay.hide(),this.isClearRewardOpen=!1,this.isOpeningClearReward=!1,this.wormholeTransitionTimer=0,this.pendingWormholeTransition=null,this.wormholeTunnelEffect.clear(),this.damageTimer=0,this.elapsedTime=0,this.destinationPlanetSpinTarget=null,this.planetRingEffect.clear(),this.isHomeConfirmOpen=!1,this.shouldResumeAfterHomeConfirm=!1,this.isPauseOpen=!1,this.shouldResumeAfterPause=!1,this.pauseOverlay.hide(),this.touchGuideIdleTimer=0,this.hasSeenMoveInput=!1,this.touchGuideMode="intro",this.playTime=0,this.attemptStatsRecorded=!1,this.meteoriteHitTimes.length=0,this.meteoShowerAnnouncementTimer=0,this.spaceWeatherAnnouncementTimer=0,this.spaceWeatherAnnouncementMessage="",this.stageSpecialAnnouncementTimer=0,this.stageSpecialAnnouncementMessage="",this.assistTimer=0,this.assistMessageTimer=0,this.assistDirection=null,this.assistDirectionRefreshTimer=0,this.adaptiveTutorialSystem.reset(),this.adaptiveHintDisplayTimer=0,this.adaptiveTutorialHint.hide(),this.meteoShowerEventSystem.reset(),this.spaceWeatherEventSystem.reset(),this.stageSpecialEventSystem.setStage(Xe(this.stageNumber)),this.meteoShowerEffect.clear(),this.spaceWeatherEffect.clear(),this.stageSpecialEffects.clear(),this.resetBoostHintState();const e=t.totalScore??0,i=t.totalStarCount??0,s=this.saveManager.load();this.spaceship.applyCustomization(s.spaceshipCustomization??Rt);const a=s.colorAccessibility?.highContrast===!0;this.motionSensitivity=s.colorAccessibility?.motionSensitivity??W();const n=s.colorAccessibility?.colorVisionSupportMode??$;ie(s.vibrationSettings?.intensity??"medium"),Ft(f=>this.handleVibrationFallback(f)),ei(a),ii(n),si(a),this.hud.setHighContrastMode(a),this.scorePopupManager.setHighContrastMode(a),this.adaptiveTutorialHint.setHighContrastMode(a),this.constellationHintOverlay.setHighContrastMode(a),this.seasonalEventNotice.setHighContrastMode(a),this.stageEntryTotalScore=e,this.stageEntryTotalStarCount=i,this.scoreSystem.setTotalScore(e),this.scoreSystem.setTotalStarCount(i),this.resetStageObjects(),this.spaceship.reset(),this.inputSystem.resetPointers?.(),this.airShield.reset(0,0,0),this.boostLinesEffect.update(!1,0,0),this.boostFlameEffect.remove(),this.rainbowTrailEffect.clear(),this.companionManager?.resetUnlockedPlanets([]),this.createBackground(),this.stageAtmosphereEffect.start(re(this.stageNumber)),this.applyMotionSensitivity(),this.applyVisualQualityTier();const o=this.seasonalEventSystem.refresh();o&&(this.seasonalEventEffects.start(o),this.seasonalEventNotice.show(o)),this.camera.position.set(0,5,10),this.camera.lookAt(0,0,-10),this.cameraLookAtTarget.set(0,0,-10),this.createDestinationPlanet(),this.scheduleNextStageVisualPrewarm(),this.stars.length=0,this.meteorites.length=0,this.shootingStars.length=0,this.comets.length=0,this.specialShootingStars.length=0,this.monthlyEncounters.length=0,this.spawnSystem.reset(),this.spawnSystem.setMeteoriteIntervalMultiplier(1),this.specialStarSpawnSystem.reset(),this.monthlyEncounterSystem.reset(),this.boostSystem.reset(),this.scoreSystem.resetStage(),this.constellationSystem.reset(Qe(this.stageNumber)),this.constellationLineEffect.clear(),this.constellationCelebrationEffect.clear(),this.spawnConstellationStars();const h=this.constellationSystem.getDefinition();h?this.constellationHintOverlay.showHint(h.hintMessage):this.constellationHintOverlay.hide();const u=se(this.stageNumber,this.stageConfig.destinationReading,n),m=`ステージ${this.stageConfig.stageNumber}: ${this.stageConfig.emoji} ${u}を めざせ！`;this.hud.show(m,this.stageConfig.planetColor),this.touchFeedbackOverlay.setMotionSensitivity(this.motionSensitivity),this.touchFeedbackOverlay.attach(),this.touchFeedbackOverlay.bindUiRoots([document.getElementById("hud"),document.getElementById("ui-overlay")]),this.inputSystem.setTouchFeedbackOverlay?.(this.touchFeedbackOverlay),this.hud.setBoostCallback(()=>{this.inputSystem.setBoostPressed(!0)}),this.hud.setBoostDeniedCallback(()=>{this.audioManager.playSFX("boostDenied")}),this.hud.setHomeCallback(()=>{this.isHomeConfirmOpen=!1,this.shouldResumeAfterHomeConfirm=!1,this.syncBoostInputLock(),this.syncPauseAvailability(),this.sceneManager.requestTransition("title")}),this.hud.setHomeConfirmOpenCallback(()=>{this.shouldResumeAfterHomeConfirm=this.isPlaying(),this.clearBlockedGameplayInput(),this.isHomeConfirmOpen=!0,this.syncBoostInputLock(),this.syncPauseAvailability()}),this.hud.setHomeConfirmCancelCallback(()=>{const f=this.shouldResumeAfterHomeConfirm;if(this.isHomeConfirmOpen=!1,this.shouldResumeAfterHomeConfirm=!1,this.syncPauseAvailability(),f){this.requestResumeCountdown();return}this.syncBoostInputLock()}),this.hud.setPauseCallback(()=>{this.requestManualPause()}),this.hud.setMuteState(this.audioManager.isMuted()),this.hud.setMuteCallback(()=>{const f=this.audioManager.toggleMute();this.hud.setMuteState(f);const b=this.saveManager.load();b.muted=f,this.saveManager.save(b)}),this.hud.update(this.scoreSystem.getStageScore(),this.scoreSystem.getStarCount()),this.hud.hideAssistMessage(),this.adaptiveTutorialHint.hide(),this.touchGuide.show("intro"),this.syncPauseAvailability(),this.hud.setBestStarCount(s.bestStageStars?.[this.stageNumber]??0),this.companionManager?.resetUnlockedPlanets(s.unlockedPlanets),this.bgStars&&pt(this.bgStars,this.spaceship.position.z,Mt),this.audioManager.playBGM(this.stageNumber),this.stageIntroOverlay?.dispose(),this.stageIntroOverlay=null,this.startOpeningSequence(t)}prefetchEndingSceneModuleIfNeeded(){if(this.stageNumber<z-1)return;this.sceneManager.prefetchSceneModule?.call(this.sceneManager,"ending")?.catch(()=>{})}startOpeningSequence(t){if(this.isStarting=!0,this.syncBoostInputLock(),this.syncPauseAvailability(),!this.shouldShowStageIntro(t)){this.startCountdown();return}const e=mt(this.stageNumber);if(!e){this.startCountdown();return}this.stageIntroOverlay=new Hi(e),this.stageIntroOverlay.show(()=>{this.stageIntroOverlay=null,this.startCountdown()})}startCountdown(){if(this.isStarting=!0,this.syncBoostInputLock(),this.syncPauseAvailability(),this.shouldSkipCountdown()){this.isStarting=!1,this.countdownOverlay=null,this.syncBoostInputLock(),this.syncPauseAvailability();return}this.countdownOverlay=new Jt({onTick:()=>{this.audioManager.playSFX("countdownTick")},onGo:()=>{this.audioManager.playSFX("countdownGo")}}),this.countdownOverlay.show(()=>{this.isStarting=!1,this.countdownOverlay=null,this.syncBoostInputLock(),this.syncPauseAvailability()})}shouldShowStageIntro(t){return this.shouldSkipCountdown()||this.launchSource!=="campaign"||t.replayToken!==void 0||t.totalScore===void 0||t.totalStarCount===void 0?!1:mt(this.stageNumber)!==void 0}releasePointerInputForLock(){this.inputSystem.resetPointers?.()}syncBoostInputLock(){const t=this.isStarting||this.awaitingResume||this.isHomeConfirmOpen||this.isPauseOpen||this.isBonusTime||this.isBonusResultVisible;this.hud.setBoostLocked(t),t&&(this.resetBoostHintState(),this.inputSystem.setBoostPressed?.(!1))}clearBlockedGameplayInput(){this.inputSystem.resetPointers?.(),this.inputSystem.setBoostPressed?.(!1)}syncPauseAvailability(){this.hud.setPauseEnabled(this.canPause())}shouldSkipCountdown(){try{return new URLSearchParams(window.location.search).get("nocount")==="1"}catch{return!1}}isPlaying(){return!(!this.stageConfig||this.isCleared||this.isClearRewardOpen||this.isOpeningClearReward||this.isBonusTime||this.isBonusResultVisible||this.isStarting||this.awaitingResume||this.isHomeConfirmOpen||this.isPauseOpen)}isUserPaused(){return this.isPauseOpen}requestResumeCountdown(){this.isPlaying()&&(this.resumeCountdownOverlay||this.shouldSkipCountdown()||(this.clearBlockedGameplayInput(),this.awaitingResume=!0,this.syncBoostInputLock(),this.syncPauseAvailability(),this.resumeCountdownOverlay=new Jt({onTick:()=>{this.audioManager.playSFX("countdownTick")},onGo:()=>{this.audioManager.playSFX("countdownGo")}}),this.resumeCountdownOverlay.show(()=>{this.awaitingResume=!1,this.resumeCountdownOverlay=null,this.syncBoostInputLock(),this.syncPauseAvailability()})))}setPauseHandlers(t){this.onPauseRequested=t.onPauseRequested??null,this.onResumeRequested=t.onResumeRequested??null,this.onExitHomeRequested=t.onExitHomeRequested??null}isManuallyPaused(){return this.isPauseOpen}requestManualPause(){this.canPause()&&(this.clearBlockedGameplayInput(),this.isPauseOpen=!0,this.syncBoostInputLock(),this.syncPauseAvailability(),this.pauseOverlay.show(()=>{this.isPauseOpen=!1,this.syncBoostInputLock(),this.syncPauseAvailability(),this.onResumeRequested?.()},()=>{this.isPauseOpen=!1,this.syncBoostInputLock(),this.syncPauseAvailability(),this.onExitHomeRequested?.()}),this.onPauseRequested?.())}canPause(){return!(!this.stageConfig||this.isCleared||this.isClearRewardOpen||this.isOpeningClearReward||this.isBonusTime||this.isBonusResultVisible||this.isStarting||this.awaitingResume||this.isHomeConfirmOpen||this.isPauseOpen)}createBackground(){this.bgStars||(this.bgStars=de(this.getBackgroundStarDrawCount()),this.threeScene.add(this.bgStars))}createDestinationPlanet(){this.removeDestinationPlanet();const t=-(this.stageConfig.stageLength+50),{planet:e,spinTarget:i}=ue(this.stageNumber,this.stageConfig,t);this.destinationPlanet=e,this.destinationPlanetSpinTarget=i,this.threeScene.add(this.destinationPlanet)}scheduleNextStageVisualPrewarm(){const t=this.stageNumber+1;if(t>z)return;const e=this.prewarmRequestToken;this.scheduleIdleTask(()=>{!this.isActive||this.prewarmRequestToken!==e||Nt(t)})}removeDestinationPlanet(){this.destinationPlanet&&(this.destinationPlanet.parent?.remove(this.destinationPlanet),this.destinationPlanet=null,this.destinationPlanetSpinTarget=null)}resetStageObjects(){this.clearRewardOverlay?.hide(),this.stageClearOverlay.hide(),this.bonusTimeOverlay.hide(),this.starBonusEffect.clear(),this.bonusCollectionSystem.reset(),this.isBonusTime=!1,this.isBonusResultVisible=!1,this.bonusTimeRemaining=0,this.bonusCollectedStars=0,this.bonusResultTimer=0,this.isClearRewardOpen=!1,this.isOpeningClearReward=!1,this.removeDestinationPlanet(),this.resetCameraShake(),this.planetRingEffect.clear(),this.scorePopupEffect.clear(),this.particleBurstManager.clear(this.threeScene),this.lovelyStarBurstEffect.clear(),this.spawnSystem.recycleAll(),this.spawnSystem.setMeteoriteIntervalMultiplier(1),this.meteoShowerEventSystem.reset(),this.meteoShowerEffect.clear(),this.meteoShowerAnnouncementTimer=0,this.spaceWeatherEventSystem.reset(),this.spaceWeatherEffect.clear(),this.spaceWeatherAnnouncementTimer=0,this.spaceWeatherAnnouncementMessage="",this.stageSpecialEventSystem.reset(),this.stageSpecialEffects.clear(),this.seasonalEventSystem.clear(),this.seasonalEventEffects.clear(),this.monthlyEncounterEffect.clear(),this.stageAtmosphereEffect.clear(),this.wormholeTunnelEffect.clear(),this.wormholeTransitionTimer=0,this.pendingWormholeTransition=null,this.rainbowTrailEffect.clear(),this.stageSpecialAnnouncementTimer=0,this.stageSpecialAnnouncementMessage="",this.seasonalEventNotice.hide(),this.stars.length=0,this.meteorites.length=0,this.shootingStars.length=0,this.comets.length=0,this.specialShootingStars.length=0,this.monthlyEncounters.length=0,this.specialStarSpawnSystem.recycleAll(),this.specialStarSpawnSystem.reset(),this.monthlyEncounterSystem.recycleAll(),this.monthlyEncounterSystem.reset(),this.hud?.hideAssistMessage(),this.constellationHintOverlay.hide(),this.constellationLineEffect.clear(),this.constellationCelebrationEffect.clear(),this.constellationSystem.reset(),this.resetBoostHintState()}update(t){if(!this.initialized)return;if(this.isCleared)return this.resetBoostHintState(),this.clearTimer+=t,this.updateBonusTime(t),this.seasonalEventNotice.tick(t),this.constellationHintOverlay.tick(t),this.constellationLineEffect.update(t),this.constellationCelebrationEffect.update(t),this.planetRingEffect.update(t),this.monthlyEncounterEffect.update(t),this.lovelyStarBurstEffect.update(t),this.scorePopupEffect.update(t),this.particleBurstManager.update(this.threeScene,t),this.companionManager?.update(t,this.spaceship.position.x,this.spaceship.position.y,this.spaceship.position.z),this.destinationPlanetSpinTarget&&(this.destinationPlanetSpinTarget.rotation.y+=t*v.DESTINATION_PLANET_SPIN_SPEED),this.seasonalEventEffects.update(t,this.spaceship.position.x,this.spaceship.position.z),this.pendingWormholeTransition||this.revealClearActionButtonsIfReady(),this.stageAtmosphereEffect.update(t,this.camera,this.spaceship.position.x,this.spaceship.position.z),this.updateWormholeTransition(t),void 0;if(this.isStarting||this.awaitingResume||this.isHomeConfirmOpen||this.isPauseOpen){if(this.resetBoostHintState(),this.hideAdaptiveTutorialHint(),this.seasonalEventNotice.tick(t),this.inputSystem.setBoostPressed?.(!1),!this.isHomeConfirmOpen&&!this.isPauseOpen){const r=this.stageIntroOverlay?.isActive()??!1;this.stageIntroOverlay?.tick(t),r||this.countdownOverlay?.tick(t),this.resumeCountdownOverlay?.tick(t)}this.destinationPlanetSpinTarget&&(this.destinationPlanetSpinTarget.rotation.y+=t*v.DESTINATION_PLANET_SPIN_SPEED),this.bgStars&&pt(this.bgStars,this.spaceship.position.z,Mt),this.airShield.setPosition(this.spaceship.position.x,this.spaceship.position.y,this.spaceship.position.z),this.airShield.update(t),this.hud.update(this.scoreSystem.getStageScore(),this.scoreSystem.getStarCount()),this.constellationHintOverlay.tick(t),this.constellationLineEffect.update(t),this.constellationCelebrationEffect.update(t),this.seasonalEventEffects.update(t,this.spaceship.position.x,this.spaceship.position.z),this.monthlyEncounterEffect.update(t),this.lovelyStarBurstEffect.update(t),this.stageAtmosphereEffect.update(t,this.camera,this.spaceship.position.x,this.spaceship.position.z);return}const e=this.inputSystem.getState();this.playTime+=t,this.seasonalEventNotice.tick(t),this.updateAssistTimers(t),this.updateMeteoShowerAnnouncement(t),this.updateSpaceWeatherAnnouncement(t),this.updateStageSpecialAnnouncement(t),this.updateAdaptiveHintDisplay(t),this.updateBoostHintDisplay(t),this.updateTouchGuide(e.moveDirection,t);const i=this.boostSystem.isActive(),s=this.boostSystem.isAvailable();e.boostPressed&&(this.boostSystem.activate()?(this.adaptiveTutorialSystem.recordBoostUsed(),this.audioManager.playSFX("boost"),K("boost"),this.audioManager.startBoostSFX(),this.boostFlameEffect.start()):this.audioManager.playSFX("boostDenied"),this.inputSystem.setBoostPressed(!1)),this.boostSystem.update(t),i&&!this.boostSystem.isActive()&&(this.audioManager.stopBoostSFX(),this.boostFlameEffect.stopEmitting()),!s&&this.boostSystem.isAvailable()&&(this.audioManager.playSFX("boostReady"),this.hud.flashBoostReady()),this.boostSystem.isActive()&&this.spaceship.speedState!=="BOOST"&&this.spaceship.activateBoost(),e.moveDirection===-1?this.spaceship.moveLeft(t):e.moveDirection===1&&this.spaceship.moveRight(t),this.spaceship.update(t),this.seasonalEventEffects.update(t,this.spaceship.position.x,this.spaceship.position.z);const a=this.spaceship.getProgress(this.stageConfig.stageLength),n=this.stageSpecialEventSystem.update(a,t);n.started&&n.event&&(this.stageSpecialEffects.start(n.event),this.showStageSpecialAnnouncement(n.event.message));const o=this.meteoShowerEventSystem.update(t);o.started&&(this.audioManager.playSFX("meteorShowerStart"),this.meteoShowerEffect.start(),this.showMeteoShowerAnnouncement());const h=this.spaceWeatherEventSystem.update(t);this.scoreSystem.setEventStarMultiplier?.(h.active&&h.event?h.event.starScoreMultiplier:1),h.started&&h.event&&(this.spaceWeatherEffect.start(h.event),this.showSpaceWeatherAnnouncement(h.event.message));const u=this.spawnSystem.update(t,this.spaceship.position.z,this.stageConfig,this.stars,this.meteorites,this.shootingStars,this.comets,{meteoShowerActive:o.active});for(const r of u.newStars)this.stars.push(r),this.threeScene.add(r.mesh);for(const r of u.newMeteorites)this.meteorites.push(r),this.threeScene.add(r.mesh);for(const r of u.newShootingStars)this.shootingStars.push(r),this.threeScene.add(r.mesh);for(const r of u.newComets)this.comets.push(r),this.threeScene.add(r.mesh);const m=this.specialStarSpawnSystem.update(t,this.spaceship.position.z,this.specialShootingStars,this.shootingStars,this.comets);for(const r of m.newSpecialStars)this.specialShootingStars.push(r),this.threeScene.add(r.mesh);const f=this.monthlyEncounterSystem.update(t,this.spaceship.position.z,this.monthlyEncounters,this.specialShootingStars,this.shootingStars,this.comets);for(const r of f.newMonthlyEncounters)this.monthlyEncounters.push(r),this.threeScene.add(r.mesh);this.lodSystem.update(this.spaceship.position,this.stars),this.lodSystem.update(this.spaceship.position,this.meteorites),this.companionManager?.update(t,this.spaceship.position.x,this.spaceship.position.y,this.spaceship.position.z);const b=this.companionManager?.getStarAttractionBonus()??0,g=this.collisionSystem.check(this.spaceship,this.stars,this.meteorites,b,this.shootingStars,this.comets,this.specialShootingStars,this.monthlyEncounters);if(g.shootingStarHit){const r=g.shootingStarHit;this.scoreSystem.addBonusScore(r.scoreBonus,r.position),this.scoreSystem.activateShootingStarBonus(Math.max(v.SHOOTING_STAR_SCORE_BONUS_DURATION,r.bonusDuration)),this.audioManager.playSFX("shootingStarCollect"),this.scorePopupManager.showLabel("☆ながれぼし☆",r.position,this.camera,"shooting-star"),this.particleBurstManager.emitShootingStar(this.threeScene,r.position.x,r.position.y,r.position.z)}if(g.cometHit){const r=g.cometHit;this.scoreSystem.addBonusScore(r.scoreBonus,r.position),this.scoreSystem.activateShootingStarBonus(r.bonusDuration),this.audioManager.playSFX("cometCollect"),this.particleBurstManager.emit(this.threeScene,r.position.x,r.position.y,r.position.z,12447743,50,!0),this.particleBurstManager.emit(this.threeScene,r.position.x,r.position.y,r.position.z,16777215,50,!0)}if(g.specialShootingStarHit){const r=g.specialShootingStarHit,d=Ke(r.specialType),x=this.saveManager.markSpecialStarDiscovered?.(r.specialType)??!1;this.scoreSystem.addBonusScore(r.scoreBonus,r.position),this.audioManager.playSFX("shootingStarCollect"),K("rainbowCollect"),this.particleBurstManager.emitShootingStar(this.threeScene,r.position.x,r.position.y,r.position.z),this.particleBurstManager.emit(this.threeScene,r.position.x,r.position.y,r.position.z,wt[r.specialType].visual.trailColor,50,!0),this.particleBurstManager.emit(this.threeScene,r.position.x,r.position.y,r.position.z,wt[r.specialType].visual.auraColor,50,!0),this.scorePopupManager.showLabel(x&&d?`${d.emoji} ${d.reading}`:wt[r.specialType].label,r.position,this.camera,"special-star")}if(g.monthlyEncounterHit){const r=g.monthlyEncounterHit,d=Je(r.encounterId),x=this.saveManager.markMonthlyEncounterDiscovered?.(r.encounterId)??!1;this.scoreSystem.addBonusScore(r.scoreBonus,r.position),this.audioManager.playSFX("shootingStarCollect"),K("rainbowCollect"),this.monthlyEncounterEffect.emit(r.position,d?.accentColor??16777215),this.particleBurstManager.emitShootingStar(this.threeScene,r.position.x,r.position.y,r.position.z),this.scorePopupManager.showLabel(x?"✨ あたらしい てんたい はっけん！":`${d?.emoji??"✨"} ${d?.reading??"てんたい"}`,r.position,this.camera,"monthly-encounter")}for(const r of g.starCollisions)this.scoreSystem.addStarScore(r.starType,r.position),r.starType==="LOVELY"?(this.scoreSystem.addBonusScore(v.LOVELY_STAR_BONUS_SCORE,r.position),this.scoreSystem.activateShootingStarBonus(v.LOVELY_STAR_SCORE_BONUS_DURATION),this.audioManager.playSFX("lovelyCollect"),this.lovelyStarBurstEffect.emit(r.position),this.scorePopupManager.showLabel("💖 ラブリースター！",r.position,this.camera,"lovely-star")):r.starType==="RAINBOW"?(this.audioManager.playSFX("rainbowCollect"),this.rainbowTrailEffect.start(this.spaceship.position),this.particleBurstManager.emit(this.threeScene,r.position.x,r.position.y,r.position.z,16768256,50,!0)):(this.audioManager.playSFX("starCollect"),this.particleBurstManager.emit(this.threeScene,r.position.x,r.position.y,r.position.z,16768256,20,!1)),this.handleConstellationStarCollected(r);if(g.meteoriteCollision){if(g.meteoriteHit){const r=g.meteoriteHit;typeof r.handleCollision=="function"?r.handleCollision():(r.isActive=!1,r.mesh.visible=!1,K("meteoriteHit")),this.particleBurstManager.emit(this.threeScene,r.position.x,r.position.y,r.position.z,16755268,24,!1)}this.spaceship.onMeteoriteHit(),this.hud.announceMeteoriteHit(),this.recordMeteoriteHit(),this.boostSystem.cancel(),this.damageTimer=v.DAMAGE_FLASH_DURATION,this.startCameraShake("meteoriteHit"),this.audioManager.playSFX("meteoriteHit"),this.audioManager.stopBoostSFX(),this.boostFlameEffect.remove()}this.updateDamageEffect(t),this.cleanupPassedObjects(t),this.updateAdaptiveTutorial(e.moveDirection,t),this.updateCameraFollow(t),this.stageAtmosphereEffect.update(t,this.camera,this.spaceship.position.x,this.spaceship.position.z),this.monthlyEncounterEffect.update(t),this.rainbowTrailEffect.update(t,this.spaceship.position);for(const r of g.starCollisions)this.scorePopupManager.show(r.scoreValue,r.position,this.camera,r.starType);if(this.stageNumber===10&&this.destinationPlanet){const r=1+Math.sin(this.elapsedTime*2)*.05;this.destinationPlanet.scale.set(r,r,r)}this.destinationPlanetSpinTarget&&(this.destinationPlanetSpinTarget.rotation.y+=t*v.DESTINATION_PLANET_SPIN_SPEED),this.elapsedTime+=t,this.bgStars&&pt(this.bgStars,this.spaceship.position.z,Mt),this.meteoShowerEffect.update(o.active,t,this.spaceship.position.x,this.spaceship.position.z),this.stageSpecialEffects.update(n.active,t,this.spaceship.position.x,this.spaceship.position.z),this.spaceWeatherEffect.update(h.active,t,this.spaceship.position.x,this.spaceship.position.z),this.boostLinesEffect.update(this.boostSystem.isActive(),this.spaceship.position.x,this.spaceship.position.z),this.boostSystem.isActive()&&this.boostFlameEffect.emit(this.spaceship.position,this.boostSystem.getDurationProgress()),this.boostFlameEffect.update(t),this.airShield.setPosition(this.spaceship.position.x,this.spaceship.position.y,this.spaceship.position.z),this.boostSystem.isActive()?this.airShield.setShieldMode("BOOST"):this.spaceship.speedState==="SLOWDOWN"?this.airShield.setShieldMode("INVINCIBLE",1):this.spaceship.speedState==="RECOVERING"?this.airShield.setShieldMode("INVINCIBLE",this.spaceship.getSpeedStateRemainingRatio()):this.airShield.setShieldMode("OFF"),this.airShield.update(t),this.scorePopupEffect.update(t),this.lovelyStarBurstEffect.update(t),this.particleBurstManager.update(this.threeScene,t),this.scoreSystem.update(t),this.constellationLineEffect.update(t),this.constellationCelebrationEffect.update(t),this.constellationHintOverlay.tick(t),this.hud.update(this.scoreSystem.getStageScore(),this.scoreSystem.getStarCount()),this.hud.updateCooldown(this.boostSystem.getCooldownProgress()),this.hud.updateStageProgress(a),a>=1&&this.onStageClear()}updateTouchGuide(t,e){if(this.assistTimer>0){this.setTouchGuideMode(this.getAssistTouchGuideMode());return}if(t!==0){this.touchGuideIdleTimer=0,this.hasSeenMoveInput=!0,this.setTouchGuideMode(t<0?"active-left":"active-right");return}if(!this.hasSeenMoveInput){this.setTouchGuideMode("intro");return}if(this.touchGuideIdleTimer+=e,this.touchGuideIdleTimer>=v.TOUCH_GUIDE_IDLE_DELAY){this.setTouchGuideMode("idle");return}this.setTouchGuideMode("hidden")}setTouchGuideMode(t){this.touchGuideMode!==t&&(this.touchGuideMode=t,this.touchGuide.setMode(t))}resetAssistNavigation(){this.meteoriteHitTimes.length=0,this.assistTimer=0,this.assistMessageTimer=0,this.assistDirection=null,this.assistDirectionRefreshTimer=0}updateAssistTimers(t){this.assistTimer>0&&(this.assistDirectionRefreshTimer=Math.max(0,this.assistDirectionRefreshTimer-t),this.assistDirectionRefreshTimer===0&&this.refreshAssistDirection(),this.assistTimer=Math.max(0,this.assistTimer-t),this.assistTimer===0&&(this.spawnSystem.setMeteoriteIntervalMultiplier(1),this.assistDirection=null,this.assistDirectionRefreshTimer=0)),this.assistMessageTimer>0&&(this.assistMessageTimer=Math.max(0,this.assistMessageTimer-t),this.assistMessageTimer===0&&this.syncAssistMessage())}updateMeteoShowerAnnouncement(t){this.meteoShowerAnnouncementTimer<=0||(this.meteoShowerAnnouncementTimer=Math.max(0,this.meteoShowerAnnouncementTimer-t),this.meteoShowerAnnouncementTimer===0&&this.syncAssistMessage())}updateSpaceWeatherAnnouncement(t){this.spaceWeatherAnnouncementTimer<=0||(this.spaceWeatherAnnouncementTimer=Math.max(0,this.spaceWeatherAnnouncementTimer-t),this.spaceWeatherAnnouncementTimer===0&&(this.spaceWeatherAnnouncementMessage="",this.syncAssistMessage()))}showMeteoShowerAnnouncement(){this.meteoShowerAnnouncementTimer=v.METEO_SHOWER_MESSAGE_DURATION,this.syncAssistMessage()}showSpaceWeatherAnnouncement(t){this.spaceWeatherAnnouncementMessage=t,this.spaceWeatherAnnouncementTimer=v.STAGE_SPECIAL_MESSAGE_DURATION,this.syncAssistMessage()}updateStageSpecialAnnouncement(t){this.stageSpecialAnnouncementTimer<=0||(this.stageSpecialAnnouncementTimer=Math.max(0,this.stageSpecialAnnouncementTimer-t),this.stageSpecialAnnouncementTimer===0&&(this.stageSpecialAnnouncementMessage="",this.syncAssistMessage()))}showStageSpecialAnnouncement(t){this.stageSpecialAnnouncementMessage=t,this.stageSpecialAnnouncementTimer=v.STAGE_SPECIAL_MESSAGE_DURATION,this.syncAssistMessage()}syncAssistMessage(){if(this.meteoShowerAnnouncementTimer>0){this.hud.showAssistMessage(v.METEO_SHOWER_MESSAGE);return}if(this.stageSpecialAnnouncementTimer>0&&this.stageSpecialAnnouncementMessage){this.hud.showAssistMessage(this.stageSpecialAnnouncementMessage);return}if(this.spaceWeatherAnnouncementTimer>0&&this.spaceWeatherAnnouncementMessage){this.hud.showAssistMessage(this.spaceWeatherAnnouncementMessage);return}if(this.assistMessageTimer>0){this.hud.showAssistMessage(v.ASSIST_MESSAGE);return}this.hud.hideAssistMessage()}resetBoostHintState(){this.boostHintDisplayTimer=0,this.hud?.hideBoostHint()}updateBoostHintDisplay(t){this.boostHintDisplayTimer>0&&(this.boostHintDisplayTimer=Math.max(0,this.boostHintDisplayTimer-t),this.boostHintDisplayTimer===0&&this.hud.hideBoostHint())}updateAdaptiveHintDisplay(t){this.adaptiveHintDisplayTimer<=0||(this.adaptiveHintDisplayTimer=Math.max(0,this.adaptiveHintDisplayTimer-t),this.adaptiveHintDisplayTimer===0&&this.adaptiveTutorialHint.hide())}hideAdaptiveTutorialHint(){this.adaptiveHintDisplayTimer=0,this.adaptiveTutorialHint.hide()}updateAdaptiveTutorial(t,e){const i=this.adaptiveTutorialSystem.update({deltaTime:e,moveDirection:t,shipX:this.spaceship.position.x,shipZ:this.spaceship.position.z,boostAvailable:this.boostSystem.isAvailable(),boostActive:this.boostSystem.isActive(),meteorites:this.meteorites});i&&this.showAdaptiveTutorialEvent(i)}showAdaptiveTutorialEvent(t){if(t.type==="boost"){this.hideAdaptiveTutorialHint(),this.hud.showBoostHint(t.message),this.boostHintDisplayTimer=v.BOOST_HINT_DURATION;return}this.resetBoostHintState(),this.adaptiveTutorialHint.show(t.message,t.type),this.adaptiveHintDisplayTimer=v.ADAPTIVE_HINT_DURATION}recordMeteoriteHit(){const t=this.playTime;for(this.meteoriteHitTimes.push(t);this.meteoriteHitTimes.length>0&&t-this.meteoriteHitTimes[0]>v.ASSIST_TRIGGER_HIT_WINDOW;)this.meteoriteHitTimes.shift();this.assistTimer>0||this.meteoriteHitTimes.length<v.ASSIST_TRIGGER_HIT_COUNT||this.activateAssistMode()}activateAssistMode(){this.assistTimer=v.ASSIST_DURATION,this.assistMessageTimer=v.ASSIST_MESSAGE_DURATION,this.assistDirectionRefreshTimer=0,this.refreshAssistDirection(),this.spawnSystem.setMeteoriteIntervalMultiplier(v.ASSIST_METEORITE_INTERVAL_MULTIPLIER),this.hud.showAssistMessage(v.ASSIST_MESSAGE),this.meteoriteHitTimes.length=0}refreshAssistDirection(){this.assistDirection=this.getSaferAssistDirection(),this.assistDirectionRefreshTimer=v.ASSIST_DIRECTION_REFRESH_INTERVAL}getAssistTouchGuideMode(){return this.assistDirection==="left"?"assist-left":this.assistDirection==="right"?"assist-right":"hidden"}getSaferAssistDirection(){const t=this.spaceship.position.x,e=this.spaceship.position.z,i=Math.min(t-2.5,-v.ASSIST_DIRECTION_SIDE_TARGET_X),s=Math.max(t+2.5,v.ASSIST_DIRECTION_SIDE_TARGET_X);let a=0,n=0;for(const u of this.meteorites){if(!u.isActive)continue;const m=e-u.position.z;if(m<0||m>v.ASSIST_DIRECTION_LOOKAHEAD)continue;const f=1+(v.ASSIST_DIRECTION_LOOKAHEAD-m)/7,b=Math.abs(u.position.x-i),g=Math.abs(u.position.x-s),r=Math.max(0,1-b/v.ASSIST_DIRECTION_SIDE_RANGE),d=Math.max(0,1-g/v.ASSIST_DIRECTION_SIDE_RANGE);a+=f*r,n+=f*d}const o=Math.abs(a-n),h=Math.max(a,n);return o<v.ASSIST_DIRECTION_DIFF_THRESHOLD||h>0&&o<h*v.ASSIST_DIRECTION_DIFF_RATIO?null:a<n?"left":"right"}updateDamageEffect(t){if(this.damageTimer>0){if(this.damageTimer-=t,this.damageTimer<=0){this.damageTimer=0,this.spaceship.mesh.rotation.z=0,this.spaceship.mesh.rotation.y=0,this.spaceship.mesh.visible=!0;return}const e=Math.sin(this.damageTimer*30)*.3;this.spaceship.mesh.rotation.z=e,this.spaceship.mesh.rotation.y=0;const i=Math.sin(this.damageTimer*20)>0;this.spaceship.mesh.visible=i}else this.spaceship.mesh.visible=!0}resetCameraShake(){this.cameraShakeTimer=0,this.cameraShakeElapsed=0,this.cameraShakeProfile=Bt.meteoriteHit,this.cameraShakeOffset.set(0,0,0)}startCameraShake(t="meteoriteHit"){this.cameraShakeProfile=Bt[t],this.cameraShakeTimer=this.cameraShakeProfile.duration,this.cameraShakeElapsed=0}handleVibrationFallback(t){t!=="meteoriteHit"&&this.startCameraShake(t)}updateCameraShake(t){if(this.cameraShakeTimer<=0){this.cameraShakeOffset.set(0,0,0);return}if(this.cameraShakeElapsed+=t,this.cameraShakeTimer=Math.max(0,this.cameraShakeTimer-t),this.cameraShakeTimer===0){this.cameraShakeOffset.set(0,0,0);return}const e=this.cameraShakeTimer/this.cameraShakeProfile.duration,i=this.cameraShakeElapsed*this.cameraShakeProfile.frequency,s=Tt(this.motionSensitivity);this.cameraShakeOffset.set(Math.sin(i)*this.cameraShakeProfile.amplitudeX*e*s.cameraShakeScale,Math.cos(i*.8)*this.cameraShakeProfile.amplitudeY*e*s.cameraShakeScale,0)}updateCameraFollow(t){this.updateCameraShake(t);const e=Tt(this.motionSensitivity),i=this.spaceship.position.x*.3+this.cameraShakeOffset.x,s=5+this.cameraShakeOffset.y,a=this.spaceship.position.z+12,n=e.cameraFollowResponsiveness;if(n>=1)this.camera.position.set(i,s,a);else{const o=1-Math.pow(1-n,Math.max(1,t*60));this.cameraPositionTarget.set(i,s,a),this.camera.position.lerp(this.cameraPositionTarget,o)}this.cameraLookAtTarget.set(this.spaceship.position.x*.5,0,this.spaceship.position.z-20),this.camera.lookAt(this.cameraLookAtTarget)}cleanupPassedObjects(t){const e=this.spaceship.position.z,i=e+30,s=this.stars;let a=0,n=0;for(let y=0;y<s.length;y++){const p=s[y];p.isCollected||p.position.z>i?(!p.isCollected&&p.position.z>i&&(n+=1),this.spawnSystem.releaseStar(p)):(p.update(t,e),a!==y&&(s[a]=p),a++)}s.length=a,n>0&&this.adaptiveTutorialSystem.recordMissedStars(n);const o=this.meteorites;let h=0;for(let y=0;y<o.length;y++){const p=o[y];!p.isActive||p.position.z>i?this.spawnSystem.releaseMeteorite(p):(p.isActive&&p.update(t,e),h!==y&&(o[h]=p),h++)}o.length=h;const u=this.shootingStars;let m=0;for(let y=0;y<u.length;y++){const p=u[y];p.isCollected||p.position.z>i?this.spawnSystem.releaseShootingStar(p):(p.update(t,e),m!==y&&(u[m]=p),m++)}u.length=m;const f=this.comets;let b=0;for(let y=0;y<f.length;y++){const p=f[y];p.isCollected||p.position.z>i?this.spawnSystem.releaseComet(p):(p.update(t,e),b!==y&&(f[b]=p),b++)}f.length=b;const g=this.specialShootingStars;let r=0;for(let y=0;y<g.length;y++){const p=g[y];p.isCollected||p.position.z>i?this.specialStarSpawnSystem.releaseSpecialStar(p):(p.update(t,e),r!==y&&(g[r]=p),r++)}g.length=r;const d=this.monthlyEncounters;let x=0;for(let y=0;y<d.length;y++){const p=d[y];p.isCollected||p.position.z>i?this.monthlyEncounterSystem.releaseMonthlyEncounter(p):(p.update(t,e),x!==y&&(d[x]=p),x++)}d.length=x}spawnConstellationStars(){const t=this.constellationSystem.getDefinition();if(t)for(let e=0;e<t.points.length;e++){const i=t.points[e],s=this.spawnSystem.acquireStar(i.x,i.y,i.z,"RAINBOW");s.setConstellationMarker(t.id,t.stageNumber,e),this.stars.push(s),this.threeScene.add(s.mesh)}}handleConstellationStarCollected(t){const e=this.constellationSystem.registerCollectedStar(t);if(!e.advanced||(e.lineSegment&&this.constellationLineEffect.addSegment(e.lineSegment.from,e.lineSegment.to),!e.completed))return;const i=this.constellationSystem.getDefinition();if(!i)return;this.saveManager.markConstellationDiscovered?.(this.stageNumber),this.constellationHintOverlay.showCelebration(i.celebrationMessage);const s=this.getConstellationCelebrationPosition(i);this.constellationCelebrationEffect.play(s,this.stageConfig.planetColor),this.audioManager.playSFX("constellationCelebrate"),K("constellationCelebrate"),this.particleBurstManager.emit(this.threeScene,t.position.x,t.position.y,t.position.z,9103615,42,!0),this.particleBurstManager.emit(this.threeScene,s.x,s.y,s.z,this.stageConfig.planetColor,36,!0)}getConstellationCelebrationPosition(t){if(t.points.length===0)return{x:0,y:0,z:this.spaceship.position.z};let e=0,i=0,s=0;for(const a of t.points)e+=a.x,i+=a.y,s+=a.z;return{x:e/t.points.length,y:i/t.points.length,z:s/t.points.length}}onStageClear(){if(this.isCleared)return;this.isCleared=!0,this.clearTimer=0,this.stageClearOverlay.hide(),this.resetAssistNavigation(),this.meteoShowerAnnouncementTimer=0,this.spaceWeatherAnnouncementTimer=0,this.spaceWeatherAnnouncementMessage="",this.stageSpecialAnnouncementTimer=0,this.stageSpecialAnnouncementMessage="",this.meteoShowerEventSystem.reset(),this.meteoShowerEffect.clear(),this.spaceWeatherEventSystem.reset(),this.spaceWeatherEffect.clear(),this.scoreSystem.setEventStarMultiplier?.(1),this.stageSpecialEventSystem.reset(),this.stageSpecialEffects.clear(),this.rainbowTrailEffect.clear(),this.resetBoostHintState(),this.touchGuide.hide(),this.syncPauseAvailability();const t=this.saveManager.markStageCleared(this.stageNumber);if(this.audioManager.playSFX("stageClear"),K("stageClear"),this.audioManager.stopBoostSFX(),this.boostFlameEffect.remove(),this.destinationPlanet){const n=this.getDestinationPlanetEffectRadius(this.destinationPlanet);this.planetRingEffect.start(this.threeScene,this.destinationPlanet,n,this.stageConfig.planetColor,this.particleBurstManager)}const e=this.scoreSystem.getStarCount(),i=this.saveManager.load().bestStageStars?.[this.stageNumber]??0;this.saveManager.updateBestStageStars(this.stageNumber,e);const s=Math.max(i,e),a=e>i;t&&(this.companionManager?.addCompanion(this.stageNumber),this.prefetchClearRewardOverlay()),this.showClearMessage(a,e,t,s),this.startBonusTime(),this.hud.announceStageClear(e,t,a),a&&this.audioManager.playSFX("rainbowCollect")}startBonusTime(){this.isBonusTime=!0,this.isBonusResultVisible=!1,this.bonusTimeRemaining=v.BONUS_TIME_DURATION,this.bonusCollectedStars=0,this.bonusResultTimer=0,this.bonusCollectionSystem.reset(),this.starBonusEffect.start(this.spaceship.position.z),this.bonusTimeOverlay.show({remainingSeconds:this.bonusTimeRemaining,collectedStars:this.bonusCollectedStars,message:this.getBonusTimeMessage(this.bonusCollectedStars)}),this.syncBoostInputLock(),this.syncPauseAvailability()}updateBonusTime(t){if(!(!this.isBonusTime&&!this.isBonusResultVisible)){if(this.isBonusTime){const e=this.inputSystem.getState?.()??{moveDirection:0};this.updateBonusSpaceship(e.moveDirection,t),this.starBonusEffect.update(t,this.spaceship.position.z);const i=this.spaceship.mesh?.position??new Z(this.spaceship.position.x,this.spaceship.position.y,this.spaceship.position.z),s=this.bonusCollectionSystem.collect(i,this.starBonusEffect.getStars());if(s.collectedStars.length>0){this.bonusCollectedStars=s.totalCollected,this.audioManager.playSFX("starCollect");for(const n of s.collectedStars)this.particleBurstManager.emit(this.threeScene,n.position.x,n.position.y,n.position.z,16772997,24,!0);this.starBonusEffect.consumeCollectedStars(s.collectedStars)}const a=Math.min(t,this.bonusTimeRemaining);if(this.bonusTimeRemaining=Math.max(0,this.bonusTimeRemaining-t),this.bonusTimeOverlay.update({remainingSeconds:this.bonusTimeRemaining,collectedStars:this.bonusCollectedStars,message:this.getBonusTimeMessage(this.bonusCollectedStars)}),this.bonusTimeRemaining===0){this.finishBonusTime();const n=t-a;n>0&&this.updateBonusTime(n)}return}this.bonusResultTimer+=t,this.bonusResultTimer>=v.BONUS_RESULT_DURATION&&(this.isBonusResultVisible=!1,this.bonusTimeOverlay.hide(),this.syncBoostInputLock(),this.syncPauseAvailability())}}updateBonusSpaceship(t,e){t<0?this.spaceship.position.x=Math.max(this.spaceship.boundaryMin,this.spaceship.position.x-15*e):t>0&&(this.spaceship.position.x=Math.min(this.spaceship.boundaryMax,this.spaceship.position.x+15*e)),this.spaceship.mesh?.position.set(this.spaceship.position.x,this.spaceship.position.y,this.spaceship.position.z)}finishBonusTime(){this.isBonusTime=!1,this.isBonusResultVisible=!0,this.bonusTimeRemaining=0,this.bonusResultTimer=0,this.starBonusEffect.clear(),this.showBonusCelebration(),this.bonusTimeOverlay.showResult({collectedStars:this.bonusCollectedStars,message:this.getBonusResultMessage(this.bonusCollectedStars)}),this.syncBoostInputLock(),this.syncPauseAvailability()}showBonusCelebration(){const t=this.bonusCollectedStars>=7?4:this.bonusCollectedStars>=3?3:2;for(let e=0;e<t;e++)this.particleBurstManager.emit(this.threeScene,this.spaceship.position.x+(e-(t-1)/2)*2.1,1.8+e%2*1.4,this.spaceship.position.z-6,e%2===0?16751317:9103615,42,!0)}getBonusTimeMessage(t){return t>=8?"キラキラ だいせいこう！":t>=5?"すごいね！":t>=2?"やったね！":"ほしを あつめよう！"}getBonusResultMessage(t){return`${t>=8?"キラキラ だいせいこう！":t>=5?"すごいね！":t>=2?"やったね！":"たのしかったね！"} ${t}こ あつめたね！`}getClearRewardOverlay(){return this.clearRewardOverlay?Promise.resolve(this.clearRewardOverlay):this.clearRewardOverlayPromise?this.clearRewardOverlayPromise:(this.clearRewardOverlayPromise=this.loadEncyclopediaOverlay().then(({EncyclopediaOverlay:t})=>{const e=new t;return this.clearRewardOverlay=e,e}).finally(()=>{this.clearRewardOverlayPromise=null}),this.clearRewardOverlayPromise)}isCurrentClearRewardRequest(t){return this.isActive&&this.clearRewardRequestToken===t}restoreClearRewardButton(){this.stageClearOverlay.setRewardOpen(!1)}prefetchClearRewardOverlay(){this.clearRewardOverlay||this.clearRewardOverlayPromise||this.getClearRewardOverlay().catch(()=>{})}async openClearRewardOverlay(t){if(this.isClearRewardOpen||this.isOpeningClearReward)return;const e=this.clearRewardRequestToken;this.isOpeningClearReward=!0,this.stageClearOverlay.setRewardOpen(!0);try{const i=this.clearRewardOverlay??await this.getClearRewardOverlay();if(!this.isCurrentClearRewardRequest(e))return;if(!i.showStageDetail(this.stageNumber,()=>{this.isCurrentClearRewardRequest(e)&&(this.isClearRewardOpen=!1,this.syncPauseAvailability(),this.restoreClearRewardButton())},{bestStageStars:{[this.stageNumber]:t},backLabel:"クリアへ もどる",colorVisionSupportMode:this.saveManager.load().colorAccessibility?.colorVisionSupportMode??$,discoveredConstellations:this.saveManager.load().discoveredConstellations??[],zIndex:50})){this.restoreClearRewardButton();return}this.isClearRewardOpen=!0,this.syncPauseAvailability()}catch{if(!this.isCurrentClearRewardRequest(e))return;this.restoreClearRewardButton()}finally{this.clearRewardRequestToken===e&&(this.isOpeningClearReward=!1,this.syncPauseAvailability(),this.isClearRewardOpen||this.restoreClearRewardButton())}}showClearMessage(t=!1,e,i=!1,s){const a=e??this.scoreSystem.getStarCount(),n=s??a,o=this.launchSource==="encyclopedia"?void 0:ti(this.stageNumber),h=i?mt(this.stageNumber):void 0;this.stageClearOverlay.show({stageNumber:this.stageNumber,starCount:a,bestStarCount:n,isBestUpdated:t,continueLabel:this.launchSource==="encyclopedia"?"タイトルへ":this.stageNumber>=z?"おいわいへ":"つぎへ",nextEntry:o,rewardEntry:h,onContinue:()=>{this.handleStageComplete()},onRetry:()=>{this.handleStageRetry()},onReward:h?()=>{this.openClearRewardOverlay(a)}:void 0})}revealClearActionButtonsIfReady(){this.isBonusTime||this.isBonusResultVisible||this.clearTimer<Math.max(v.CLEAR_CONTINUE_DELAY,v.BONUS_TIME_DURATION+v.BONUS_RESULT_DURATION)||this.stageClearOverlay.enableContinue()}getDestinationPlanetEffectRadius(t){const e=new li().setFromObject(t);if(e.isEmpty())return 15;const i=e.getSize(new Z);return Math.max(i.x,i.y,i.z)*.5}handleStageComplete(){this.recordAttemptStats(!0);const{totalScore:t,totalStarCount:e}=this.scoreSystem.finalizeStage(),i=e+this.bonusCollectedStars;if(this.shouldPlayWormholeTransition()){this.startWormholeTransition({stageNumber:this.stageNumber+1,totalScore:t,totalStarCount:i});return}if(this.launchSource==="encyclopedia"){this.sceneManager.requestTransition("title");return}this.stageNumber>=z?this.sceneManager.requestTransition("ending",{totalScore:t,totalStarCount:i}):this.sceneManager.requestTransition("stage",{stageNumber:this.stageNumber+1,totalScore:t,totalStarCount:i})}shouldPlayWormholeTransition(){return this.launchSource==="campaign"&&this.stageNumber<z}startWormholeTransition(t){if(this.pendingWormholeTransition)return;const e=t.stageNumber??this.stageNumber+1,i=X(e);this.pendingWormholeTransition=t,this.wormholeTransitionTimer=0,this.stageClearOverlay.hide(),this.bonusTimeOverlay.hide(),this.clearRewardOverlay?.hide(),this.isClearRewardOpen=!1,this.isOpeningClearReward=!1,this.wormholeTunnelEffect.start({sourceColor:this.stageConfig.planetColor,targetColor:i.planetColor,duration:v.WORMHOLE_TRANSITION_DURATION,particleCount:72,rayCount:20}),this.audioManager.playSFX("wormhole")}updateWormholeTransition(t){if(!this.pendingWormholeTransition||(this.wormholeTransitionTimer+=t,this.wormholeTunnelEffect.update(t,this.camera),this.wormholeTransitionTimer<v.WORMHOLE_TRANSITION_DURATION))return!1;const e=this.pendingWormholeTransition;return this.pendingWormholeTransition=null,this.wormholeTransitionTimer=0,this.wormholeTunnelEffect.clear(),this.sceneManager.requestTransition("stage",e),!0}handleStageRetry(){const t={stageNumber:this.stageNumber,totalScore:this.stageEntryTotalScore,totalStarCount:this.stageEntryTotalStarCount,replayToken:Date.now()+Math.random()};this.launchSource!=="campaign"&&(t.launchSource=this.launchSource),this.sceneManager.requestTransition("stage",t)}recordAttemptStats(t){this.attemptStatsRecorded||(this.attemptStatsRecorded=!0,this.saveManager.recordGameplaySession?.({stageNumber:this.stageNumber,playTimeSeconds:this.playTime,collectedStars:this.scoreSystem.getStarCount()+this.bonusCollectedStars,boostUses:this.boostSystem.getActivationCount(),stageCleared:t}))}exit(){this.initialized&&(this.recordAttemptStats(this.isCleared),this.isActive=!1,this.prewarmRequestToken+=1,this.clearRewardRequestToken+=1,this.clearRewardOverlay?.hide(),this.stageClearOverlay.hide(),this.bonusTimeOverlay.hide(),this.isClearRewardOpen=!1,this.isOpeningClearReward=!1,this.pauseOverlay.hide(),this.touchGuide.hide(),this.touchFeedbackOverlay.hide(),this.inputSystem.setTouchFeedbackOverlay?.(null),this.adaptiveTutorialHint.hide(),this.constellationHintOverlay.hide(),this.seasonalEventNotice.dispose(),this.frameRateHintOverlay.hide(),this.hud.hide(),this.scorePopupManager.dispose(),Ft(null),this.audioManager.stopBGM(),this.audioManager.stopBoostSFX(),this.wormholeTunnelEffect.clear(),this.starBonusEffect.clear(),this.bonusCollectionSystem.reset(),this.isBonusTime=!1,this.isBonusResultVisible=!1,this.bonusTimeRemaining=0,this.bonusCollectedStars=0,this.bonusResultTimer=0,this.pendingWormholeTransition=null,this.wormholeTransitionTimer=0,this.stageIntroOverlay&&(this.stageIntroOverlay.dispose(),this.stageIntroOverlay=null),this.countdownOverlay&&(this.countdownOverlay.dispose(),this.countdownOverlay=null),this.resumeCountdownOverlay&&(this.resumeCountdownOverlay.dispose(),this.resumeCountdownOverlay=null),this.isStarting=!1,this.awaitingResume=!1,this.isHomeConfirmOpen=!1,this.shouldResumeAfterHomeConfirm=!1,this.isPauseOpen=!1,this.shouldResumeAfterPause=!1,this.boostFlameEffect.remove(),this.boostLinesEffect.update(!1,this.spaceship.position.x,this.spaceship.position.z),this.airShield.reset(this.spaceship.position.x,this.spaceship.position.y,this.spaceship.position.z),this.planetRingEffect.clear(),this.meteoShowerEffect.clear(),this.spaceWeatherEffect.clear(),this.stageSpecialEffects.clear(),this.seasonalEventEffects.clear(),this.spaceWeatherEventSystem.reset(),this.seasonalEventSystem.clear(),this.scoreSystem.setEventStarMultiplier?.(1),this.frameRateHintOverlay.dispose(),this.resetStageObjects(),this.bgStars&&(this.bgStars.parent?.remove(this.bgStars),this.bgStars=null))}getThreeScene(){return this.threeScene}getCamera(){const{width:t,height:e}=_(),i=t/e;return i!==this.lastAspect&&Number.isFinite(i)&&i>0&&(this.camera.aspect=i,this.camera.updateProjectionMatrix(),this.lastAspect=i),this.camera}applyVisualQualityTier(){const t=this.getEffectiveVisualQualityTier();if(this.particleBurstManager.setQualityTier(t),this.lodSystem.setQualityTier(t),!this.initialized){this.bgStars&&this.bgStars.geometry.setDrawRange(0,this.getBackgroundStarDrawCount());return}this.boostLinesEffect.setQualityTier(t),this.boostFlameEffect.setQualityTier(t),this.stageAtmosphereEffect.setQualityTier(t),this.wormholeTunnelEffect.setQualityTier(t),this.bgStars&&this.bgStars.geometry.setDrawRange(0,this.getBackgroundStarDrawCount())}getBackgroundStarDrawCount(){const t=Tt(this.motionSensitivity);return Math.max(1,Math.round(v.BG_STAR_COUNT*v.getVisualQualityScale(this.getEffectiveVisualQualityTier())*t.particleDensityScale))}applyMotionSensitivity(){this.initialized&&(this.boostLinesEffect.setMotionSensitivity(this.motionSensitivity),this.boostFlameEffect.setMotionSensitivity(this.motionSensitivity),this.stageAtmosphereEffect.setMotionSensitivity(this.motionSensitivity),this.wormholeTunnelEffect.setMotionSensitivity(this.motionSensitivity))}static clampVisualQualityTier(t){const e=v.VISUAL_QUALITY_SCALE_BY_TIER.length-1;return Math.max(0,Math.min(e,Math.round(t)))}static clampPerformanceAdaptationLevel(t){const e=v.VISUAL_QUALITY_SCALE_BY_TIER.length-1;return Math.max(0,Math.min(e,Math.round(t)))}static getVisualQualityScale(t){return v.VISUAL_QUALITY_SCALE_BY_TIER[v.clampVisualQualityTier(t)]}getEffectiveVisualQualityTier(){return v.clampVisualQualityTier(this.visualQualityTier-this.performanceAdaptationLevel)}}const is=Object.freeze(Object.defineProperty({__proto__:null,StageScene:v,__resetStageSceneSharedAssetCachesForTest:xi,__stageSceneSharedAssetCachesForTest:Ci,prewarmStageVisualAssets:Nt},Symbol.toStringTag,{value:"Module"}));class Yi{constructor(t,e,i,s,a={}){this.sceneManager=t,this.inputSystem=e,this.audioManager=i,this.saveManager=s,this.randomProvider=a.randomProvider??Math.random,this.effectSystem=a.effectSystem??new ai({randomProvider:this.randomProvider}),this.stageDurationSeconds=a.stageDurationSeconds??8;const{width:n,height:o}=_();this.camera=new Et(60,n/o,.1,1400),this.camera.position.set(0,2.8,12),this.threeScene.background=new ht(32),this.directionalLight.position.set(4,6,5),this.stageAtmosphereEffect.init(this.threeScene),this.effectSystem.init(this.threeScene)}threeScene=new lt;ambientLight=new St(16777215,1.1);directionalLight=new le(16777215,.7);camera;stageAtmosphereEffect=new ne;randomProvider;effectSystem;stageDurationSeconds;overlayButtonCleanups=new Set;currentLookAt=new Z;ship=null;companionManager=null;backgroundStars=null;currentPlanet=null;currentPlanetSpinTarget=null;overlay=null;stageLabel=null;companionBadge=null;currentStageNumber=1;currentStageConfig=X(1);stageTimeRemaining=0;lastAspect=0;isActive=!1;enter(t){this.isActive=!0,this.lastAspect=0,this.inputSystem.resetPointers?.(),this.setupSceneObjects(),this.createOverlay(),this.audioManager.playBGM(0)}update(t){if(!this.isActive||!this.ship)return;const e=Math.max(0,t),i=this.inputSystem.getState();i.moveDirection<0?this.ship.moveLeft(e):i.moveDirection>0&&this.ship.moveRight(e),this.ship.update(e);const s=this.ship.mesh.position;this.companionManager?.update(e,s.x,s.y+1.15,s.z+.8),this.effectSystem.update(e,s),this.stageAtmosphereEffect.update(e,this.camera,s.x,s.z),this.updateCamera(),this.updatePlanet(e),this.updateStageRotation(e),this.backgroundStars&&(this.backgroundStars.rotation.y+=e*.02,pt(this.backgroundStars,s.z,1))}exit(){this.isActive=!1,this.inputSystem.resetPointers?.(),this.audioManager.stopBGM(),this.effectSystem.clear(),this.stageAtmosphereEffect.clear(),this.companionManager?.dispose(),this.companionManager=null,this.ship?.dispose(),this.ship=null,this.clearPlanet(),this.backgroundStars&&(this.backgroundStars.parent?.remove(this.backgroundStars),this.backgroundStars=null);const t=Array.from(this.overlayButtonCleanups);this.overlayButtonCleanups.clear();for(const e of t)e();this.overlay?.remove(),this.overlay=null,this.stageLabel=null,this.companionBadge=null}getThreeScene(){return this.threeScene}getCamera(){const{width:t,height:e}=_(),i=t/e;return i!==this.lastAspect&&Number.isFinite(i)&&i>0&&(this.camera.aspect=i,this.camera.updateProjectionMatrix(),this.lastAspect=i),this.camera}setupSceneObjects(){this.threeScene.background=new ht(32),this.ambientLight.parent||this.threeScene.add(this.ambientLight),this.directionalLight.parent||this.threeScene.add(this.directionalLight),this.backgroundStars=de(2e3),this.backgroundStars.name="free-play-background-stars",this.threeScene.add(this.backgroundStars);const t=this.saveManager.load();this.ship=new oe(t.spaceshipCustomization),this.ship.mesh.name="free-play-spaceship",this.ship.mesh.position.set(0,-.3,0),this.ship.boundaryMin=-9,this.ship.boundaryMax=9,this.threeScene.add(this.ship.mesh),this.companionManager=new Ot([...new Set(t.unlockedPlanets)]);const e=this.companionManager.getGroup();e.name="free-play-companions",this.threeScene.add(e),this.updateCompanionBadge(),this.applyStage(this.pickRandomStage())}createOverlay(){const t=document.getElementById("ui-overlay");if(!t)return;this.overlay=document.createElement("div"),this.overlay.setAttribute("data-free-play-overlay",""),this.overlay.style.cssText=`
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
    `,this.overlayButtonCleanups.add(R(a,{onActivate:()=>{this.inputSystem.resetPointers?.(),this.sceneManager.requestTransition("title")},onPressChange:o=>{a.style.transform=o?"scale(0.96)":"scale(1)"}})),e.append(i,a);const n=document.createElement("div");n.style.cssText=`
      align-self: center;
      padding: 0.7rem 1.1rem;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.28);
      color: #fff;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 0.95rem;
      font-weight: 700;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    `,n.textContent="← → で ゆったり うちゅうさんぽ",this.overlay.append(e,n),t.appendChild(this.overlay),this.updateStageLabel(),this.updateCompanionBadge()}updateCamera(){if(!this.ship)return;const t=this.ship.mesh.position;this.camera.position.x+=(t.x*.32-this.camera.position.x)*.12,this.camera.position.y=2.8,this.camera.position.z=t.z+12,this.currentLookAt.set(t.x*.18,t.y+.4,t.z-18),this.camera.lookAt(this.currentLookAt)}updatePlanet(t){!this.currentPlanet||!this.ship||(this.currentPlanet.position.set(0,.5,this.ship.mesh.position.z-52),this.currentPlanet.rotation.y+=t*.08,this.currentPlanetSpinTarget?.rotateY(t*.22))}updateStageRotation(t){this.stageTimeRemaining-=t,!(this.stageTimeRemaining>0)&&this.applyStage(this.pickRandomStage(this.currentStageNumber))}applyStage(t){this.currentStageNumber=t,this.currentStageConfig=X(t),this.stageTimeRemaining=this.sampleStageDuration(),this.clearPlanet();const{planet:e,spinTarget:i}=ue(t,this.currentStageConfig,-52);e.name="free-play-stage-planet",this.currentPlanet=e,this.currentPlanetSpinTarget=i,this.threeScene.add(e),this.stageAtmosphereEffect.start(re(t)),this.effectSystem.setCurrentStage(t),this.updateStageLabel()}clearPlanet(){this.currentPlanet&&(this.currentPlanet.parent?.remove(this.currentPlanet),this.currentPlanet=null,this.currentPlanetSpinTarget=null)}updateStageLabel(){this.stageLabel&&(this.stageLabel.textContent=`${this.currentStageConfig.emoji} ${this.currentStageConfig.destinationReading}の そらで あそんでるよ`)}updateCompanionBadge(){if(!this.companionBadge)return;const t=this.companionManager?.getCount()??0;this.companionBadge.textContent=t>0?`👾 なかま ${t}にん と いっしょ！`:"👾 なかまを あつめると ここに くるよ！"}sampleStageDuration(){return this.stageDurationSeconds*(.8+this.randomProvider()*.4)}pickRandomStage(t){const e=Array.from({length:z},(a,n)=>n+1),i=t===void 0?e:e.filter(a=>a!==t),s=Math.min(i.length-1,Math.floor(this.randomProvider()*i.length));return i[s]}}const ss=Object.freeze(Object.defineProperty({__proto__:null,FreePlayScene:Yi},Symbol.toStringTag,{value:"Module"}));let ot=null,rt=null;function qi(){if(!ot){const l=new Dt,t=new Float32Array(3e3);for(let e=0;e<3e3;e++)t[e]=(Math.random()-.5)*200;l.setAttribute("position",new Lt(t,3)),ot=l}return ot}function Xi(){return rt||(rt=new Gt({color:16777215,size:.3})),rt}function Qi(){ot=null,rt=null}const Ki={getBgStarsGeometry:()=>ot,getBgStarsMaterial:()=>rt};class G{static CIRCLE_RADIUS=3;static POPIN_DELAY=.2;static POPIN_DURATION=.3;static BOUNCE_SPEED=3;static BOUNCE_HEIGHT=.5;static THANK_YOU_DELAY=2.5;threeScene;camera;lastAspect=0;sceneManager;saveManager;audioManager;overlay=null;muteHandle=null;bgStars=null;companionMeshes=[];companionGroup=null;circleX=[];circleZ=[];popinSettled=[];celebrationElapsed=0;thankYouShown=!1;canExit=!1;exitTriggered=!1;exitCta=null;constructor(t,e,i){this.sceneManager=t,this.saveManager=e,this.audioManager=i,this.threeScene=new lt;const{width:s,height:a}=_();this.camera=new Et(60,s/a,.1,1e3),this.camera.position.set(0,0,5)}enter(t){this.lastAspect=0,this.canExit=!1,this.exitTriggered=!1,this.exitCta=null;const e=t.totalScore??0,i=t.totalStarCount??0;this.threeScene=new lt,this.threeScene.background=new ht(48),this.bgStars=new It(qi(),Xi()),this.bgStars.userData.sharedAssets=!0,this.bgStars.rotation.set(0,0,0),this.threeScene.add(this.bgStars),this.threeScene.add(new St(16777215,1));const s=this.saveManager.load();s.clearedStage=0,this.saveManager.save(s),this.audioManager.playBGM(-1),this.setupCelebration(),this.createOverlay(e,i),this.createMuteButton()}createMuteButton(){const t=document.getElementById("hud")??document.getElementById("ui-overlay");t&&(this.muteHandle=Ht({initialMuted:this.audioManager.isMuted(),container:t,onToggle:()=>{const e=this.audioManager.toggleMute();this.muteHandle?.setMuted(e);const i=this.saveManager.load();i.muted=e,this.saveManager.save(i)}}))}createOverlay(t,e){const i=document.getElementById("ui-overlay");if(!i)return;this.overlay=document.createElement("div"),this.overlay.setAttribute("data-ending-overlay",""),this.overlay.style.cssText=`
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
    `,this.overlay.appendChild(s),this.overlay.appendChild(a),this.overlay.appendChild(n),this.overlay.appendChild(this.exitCta),i.appendChild(this.overlay)}update(t){this.bgStars&&(this.bgStars.rotation.y+=t*.03),this.updateCelebration(t)}setupCelebration(){this.companionGroup=new st,this.companionMeshes=[],this.circleX.length=0,this.circleZ.length=0,this.popinSettled.length=0,this.celebrationElapsed=0,this.thankYouShown=!1,this.canExit=!1,this.exitTriggered=!1;for(let t=0;t<it.length;t++){const e=it[t],i=Ot.createCompanionMesh(e),s=t*(2*Math.PI/it.length),a=Math.cos(s)*G.CIRCLE_RADIUS,n=Math.sin(s)*G.CIRCLE_RADIUS;this.circleX.push(a),this.circleZ.push(n),i.position.set(a,0,n),i.scale.set(0,0,0),this.companionMeshes.push(i),this.popinSettled.push(!1),this.companionGroup.add(i)}this.threeScene.add(this.companionGroup)}updateCelebration(t){if(this.companionMeshes.length===0)return;this.celebrationElapsed+=t;const e=G.POPIN_DELAY*(this.companionMeshes.length-1)+G.POPIN_DURATION,i=this.celebrationElapsed>e,s=i?Math.abs(Math.sin(this.celebrationElapsed*G.BOUNCE_SPEED))*G.BOUNCE_HEIGHT:0;for(let a=0;a<this.companionMeshes.length;a++){const n=this.companionMeshes[a];if(this.popinSettled[a]){i&&(n.position.y=s),n.rotation.y+=t*2;continue}const o=a*G.POPIN_DELAY;if(!(this.celebrationElapsed<o)){if(this.celebrationElapsed<o+G.POPIN_DURATION){const h=(this.celebrationElapsed-o)/G.POPIN_DURATION,u=this.bounceEase(h);n.scale.set(u,u,u)}else n.scale.set(1,1,1),this.popinSettled[a]=!0;i&&(n.position.y=s),n.rotation.y+=t*2}}!this.thankYouShown&&this.celebrationElapsed>=G.THANK_YOU_DELAY&&(this.showThankYouText(),this.thankYouShown=!0)}bounceEase(t){return t<.6?t/.6*1.2:1.2-(t-.6)/.4*.2}showThankYouText(){if(!this.overlay||!this.exitCta)return;const t=document.createElement("div");t.setAttribute("data-ending-thank-you",""),t.textContent="みんな ありがとう！",t.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 2rem;
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
      margin-bottom: 1.5rem;
      opacity: 0;
      transition: opacity 0.5s ease-in;
    `,this.overlay.insertBefore(t,this.exitCta),this.exitCta.style.visibility="visible",this.canExit=!0,requestAnimationFrame(()=>{t.style.opacity="1",this.exitCta&&(this.exitCta.style.opacity="1")})}handleOverlayPointerDown(t){if(!this.canExit||this.exitTriggered)return;const e=t.target;e instanceof HTMLElement&&e.closest("[data-mute-button]")||(this.exitTriggered=!0,this.sceneManager.requestTransition("title"))}exit(){this.audioManager.stopBGM(),this.bgStars&&(this.threeScene.remove(this.bgStars),this.bgStars=null),this.companionGroup&&(this.threeScene.remove(this.companionGroup),this.companionMeshes=[],this.companionGroup=null),this.overlay&&(this.overlay.remove(),this.overlay=null),this.exitCta=null,this.canExit=!1,this.exitTriggered=!1,this.muteHandle&&(this.muteHandle.remove(),this.muteHandle=null)}getThreeScene(){return this.threeScene}getCamera(){const{width:t,height:e}=_(),i=t/e;return i!==this.lastAspect&&Number.isFinite(i)&&i>0&&(this.camera.aspect=i,this.camera.updateProjectionMatrix(),this.lastAspect=i),this.camera}}const as=Object.freeze(Object.defineProperty({__proto__:null,EndingScene:G,__endingSceneSharedAssetsForTest:Ki,__resetEndingSceneSharedAssetsForTest:Qi},Symbol.toStringTag,{value:"Module"}));export{as as E,ss as F,is as S,es as T,R as a,kt as c};
