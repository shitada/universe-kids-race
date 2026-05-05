const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/EncyclopediaOverlay-BeHPNDjy.js","assets/game-core-YJtqaFI3.js","assets/three-BsQe5WE2.js"])))=>i.map(i=>d[i]);
import{D as ht,i as C,g as Et,a as Bt,S as Z,T as z,b as W,c as Qt,L as ue,d as me,_ as Mt,e as H,f as $,h as Y,s as Kt,j as ct,k as Jt,l as pe,P as J,u as te,C as ge,m as fe,n as ye,B as be,o as ve,M as Se,p as Ee,q as xe,r as Ce,t as we,v as Ae,w as Te,x as Me,y as Pe,z as Be,A as Re,E as ke,F as Oe,G as ee,W as Ie,H as De,I as Le,J as ie,K as Ge,N as Rt,O as ze,Q as He,R as Ne,U as Fe,V as _e,X as $e,Y as Ve,Z as Nt,$ as se,a0 as je,a1 as dt,a2 as q,a3 as Ue,a4 as xt,a5 as We,a6 as Ct,a7 as Ze,a8 as qe,a9 as Ye,aa as Xe,ab as Qe}from"./game-core-YJtqaFI3.js";import{n as kt,l as Ot,j as It,m as Dt,G as ut,r as Ke,a as Je,s as ti,M as O,h as N,D as Ft,R as _t,t as F,u as bt,v as nt,i as at,P as vt,V as X,w as ne,x as ei}from"./three-BsQe5WE2.js";class Lt{overlayEl=null;static COMPACT_HEIGHT_THRESHOLD=720;show(t){if(this.overlayEl)return;const e=document.getElementById("ui-overlay");if(!e)return;const i=this.isCompactHeight();this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-tutorial-overlay",""),this.overlayEl.style.cssText=`
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
    `;const n=document.createElement("div");n.setAttribute("data-tutorial-title",""),n.textContent="あそびかた",n.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${i?"1.8rem":"2.2rem"};
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
      margin-bottom: ${i?"0.9rem":"1.5rem"};
      text-align: center;
    `,s.appendChild(n);const a=document.createElement("div");a.style.cssText=`
      display: flex;
      gap: ${i?"0.8rem":"1.5rem"};
      flex-wrap: wrap;
      justify-content: center;
      width: 100%;
      max-width: 90%;
    `,a.appendChild(this.createCard("👆","ひだり・みぎ を タッチ","うちゅうせんが うごくよ","swipe 2s ease-in-out infinite",i)),a.appendChild(this.createCard("🚀","ブースト ボタン","はやく すすめるよ！","boostPulse 1.5s ease-in-out infinite",i)),a.appendChild(this.createCard("⭐","ほしを あつめて","ゴールを めざそう！","starGlow 3s linear infinite",i)),s.appendChild(a);const o=document.createElement("button");o.textContent="とじる",o.style.cssText=`
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
    `,o.addEventListener("pointerdown",h=>{h.stopPropagation(),t()}),s.appendChild(o),this.injectAnimations(),this.overlayEl.appendChild(s),e.appendChild(this.overlayEl)}hide(){this.overlayEl&&(this.overlayEl.remove(),this.overlayEl=null)}createCard(t,e,i,s,n){const a=document.createElement("div");a.setAttribute("data-tutorial-card",""),a.style.cssText=`
      background: rgba(255, 255, 255, 0.08);
      border-radius: 1.5rem;
      padding: ${n?"1rem 0.85rem":"1.5rem 1.2rem"};
      width: ${n?"150px":"180px"};
      text-align: center;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
    `;const o=document.createElement("div");o.textContent=t,o.style.cssText=`
      font-size: ${n?"2rem":"2.5rem"};
      margin-bottom: ${n?"0.55rem":"0.8rem"};
      animation: ${s};
    `;const h=document.createElement("div");h.textContent=e,h.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${n?"0.95rem":"1.1rem"};
      font-weight: 700;
      color: #fff;
      margin-bottom: 0.4rem;
    `;const d=document.createElement("div");return d.textContent=i,d.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${n?"0.8rem":"0.9rem"};
      color: rgba(255, 255, 255, 0.7);
    `,a.appendChild(o),a.appendChild(h),a.appendChild(d),a}isCompactHeight(){return window.innerHeight<=Lt.COMPACT_HEIGHT_THRESHOLD}injectAnimations(){if(document.getElementById("tutorial-animations"))return;const t=document.createElement("style");t.id="tutorial-animations",t.textContent=`
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
    `,document.head.appendChild(t)}}class ii{overlayEl=null;activePressCleanups=new Set;show(t,e){if(this.overlayEl)return;const i=document.getElementById("ui-overlay");if(!i)return;this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-title-reset-confirm-overlay",""),this.overlayEl.setAttribute("role","dialog"),this.overlayEl.setAttribute("aria-modal","true"),this.overlayEl.setAttribute("aria-label","さいしょからに もどしますか"),this.overlayEl.style.cssText=`
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
    `;let s=!1;const n=()=>{s||(s=!0,this.hide(),e())},a=()=>{s||(s=!0,this.hide(),t())};this.overlayEl.addEventListener("pointerdown",u=>{u.target===this.overlayEl&&n()});const o=document.createElement("div");o.setAttribute("data-title-reset-confirm-card",""),o.style.cssText=`
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
    `,o.appendChild(h);const d=document.createElement("div");d.textContent="いまの すすみぐあいだけ きえて、ステージ 1 から あそべるよ",d.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 1rem;
      font-weight: 700;
      line-height: 1.5;
      color: rgba(255, 255, 255, 0.92);
      margin-bottom: 1.2rem;
    `,o.appendChild(d);const m=document.createElement("div");m.style.cssText=`
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
    `,b=(u,w)=>{let y=!1,p=!1;const T=()=>{M(!0)},A=()=>{u.style.transform="scale(0.92)"},R=()=>{u.style.transform="scale(1)"},M=(c=!1)=>{y=!1,p=c,R(),this.activePressCleanups.delete(T),document.removeEventListener("pointerup",S,!0),document.removeEventListener("pointercancel",x,!0)},S=c=>{const E=c.target===u||c.target instanceof Node&&u.contains(c.target),B=y&&E;M(!E),B&&w()},x=()=>{M(!0)};u.addEventListener("pointerdown",c=>{c.stopPropagation(),y=!0,p=!1,A(),this.activePressCleanups.add(T),document.addEventListener("pointerup",S,!0),document.addEventListener("pointercancel",x,!0)}),u.addEventListener("pointerenter",()=>{y&&A()}),u.addEventListener("pointerleave",()=>{y&&R()}),u.addEventListener("pointercancel",()=>M(!0)),u.addEventListener("click",c=>{if(c.stopPropagation(),p){p=!1;return}y||w()})},g=document.createElement("button");g.setAttribute("data-title-reset-cancel",""),g.textContent="やめる",g.style.cssText=f,g.style.background="rgba(255, 255, 255, 0.18)",g.style.color="#ffffff",b(g,n),m.appendChild(g);const r=document.createElement("button");r.setAttribute("data-title-reset-confirm",""),r.textContent="うん！ さいしょから",r.style.cssText=f,r.style.background="linear-gradient(135deg, #FF9F68, #FFE66D)",r.style.color="#3b1f00",b(r,a),m.appendChild(r),i.appendChild(this.overlayEl)}hide(){if(!this.overlayEl)return;const t=Array.from(this.activePressCleanups);this.activePressCleanups.clear();for(const e of t)e();this.overlayEl.remove(),this.overlayEl=null}}function Gt(l){const t=l.topRem??.8,e=window.innerHeight<=500,i=document.createElement("button");let s=l.initialMuted;const n=()=>{i.textContent=s?"🔇":"🔊",i.setAttribute("aria-label",s?"サウンド オフ":"サウンド オン")};i.setAttribute("data-mute-button",""),i.style.position="absolute",i.style.top=`${t}rem`,i.style.right="1rem",i.style.fontSize=e?"clamp(1.1rem, 3.5vmin, 1.4rem)":"clamp(1.4rem, 4vmin, 1.8rem)",i.style.background="rgba(255, 255, 255, 0.15)",i.style.border="none",i.style.borderRadius="50%",i.style.width=e?"2.4rem":"3rem",i.style.height=e?"2.4rem":"3rem",i.style.display="flex",i.style.alignItems="center",i.style.justifyContent="center",i.style.cursor="pointer",i.style.pointerEvents="auto",i.style.touchAction="manipulation",i.style.transform="scale(1)",i.style.transition="transform 0.08s ease-out",n();const a=()=>{i.style.transform="scale(1)"};return i.addEventListener("pointerdown",o=>{o.stopPropagation(),i.style.transform="scale(0.9)",l.onToggle()}),i.addEventListener("pointerup",a),i.addEventListener("pointercancel",a),i.addEventListener("pointerleave",a),l.container.appendChild(i),{element:i,setMuted(o){s=o,n()},remove(){i.remove()}}}const mt=[{value:0,labelKey:"colorSettings.audio.volume.quiet"},{value:25,labelKey:"colorSettings.audio.volume.small"},{value:50,labelKey:"colorSettings.audio.volume.normal"},{value:75,labelKey:"colorSettings.audio.volume.loud"},{value:100,labelKey:"colorSettings.audio.volume.max"}],$t=[{value:"color-only",labelKey:"colorSettings.colorVision.option.colorOnly",icon:"🎨"},{value:"color-and-marks",labelKey:"colorSettings.colorVision.option.colorAndMarks",icon:"★"}],Vt=[{value:"strong",labelKey:"colorSettings.vibration.option.strong"},{value:"medium",labelKey:"colorSettings.vibration.option.medium"},{value:"weak",labelKey:"colorSettings.vibration.option.weak"},{value:"off",labelKey:"colorSettings.vibration.option.off"}],jt=[{value:"ja",labelKey:"colorSettings.language.option.ja",icon:"🇯🇵"},{value:"en",labelKey:"colorSettings.language.option.en",icon:"🇬🇧"}],Ut={strong:{shortLabel:"colorSettings.motion.option.strong.shortLabel",description:"colorSettings.motion.option.strong.description"},medium:{shortLabel:"colorSettings.motion.option.medium.shortLabel",description:"colorSettings.motion.option.medium.description"},gentle:{shortLabel:"colorSettings.motion.option.gentle.shortLabel",description:"colorSettings.motion.option.gentle.description"},minimal:{shortLabel:"colorSettings.motion.option.minimal.shortLabel",description:"colorSettings.motion.option.minimal.description"}};function Wt(l){const t=mt.find(e=>e.value===l)??mt[2];return C.t(t.labelKey)}class si{overlay=null;toggleButton=null;descriptionEl=null;highContrast=!1;colorVisionSupportMode="color-only";bgmVolume=100;sfxVolume=100;vibrationIntensity="medium";motionSensitivity="strong";restReminderEnabled=!0;language=ht;bgmVolumeDescriptionEl=null;sfxVolumeDescriptionEl=null;bgmVolumeSlider=null;sfxVolumeSlider=null;colorVisionDescriptionEl=null;colorVisionButtons=new Map;vibrationDescriptionEl=null;vibrationButtons=new Map;motionDescriptionEl=null;motionButtons=new Map;restReminderDescriptionEl=null;restReminderToggleButton=null;motionPreviewEl=null;motionPreviewTokenEl=null;motionPreviewCaptionEl=null;languageDescriptionEl=null;languageButtons=new Map;motionPreviewTimeoutId=null;motionPreviewFrameId=null;onToggle=null;onColorVisionSupportModeChange=null;onBGMVolumeChange=null;onSFXVolumeChange=null;onVibrationIntensityChange=null;onMotionSensitivityChange=null;onRestReminderToggle=null;onLanguageChange=null;languageUnsubscribe=null;show(t){const e=document.getElementById("ui-overlay");if(e){if(this.highContrast=t.initialHighContrast,this.colorVisionSupportMode=t.initialColorVisionSupportMode,this.bgmVolume=t.initialBGMVolume,this.sfxVolume=t.initialSFXVolume,this.vibrationIntensity=t.initialVibrationIntensity,this.motionSensitivity=t.initialMotionSensitivity,this.restReminderEnabled=t.initialRestReminderEnabled,this.language=t.initialLanguage,this.onToggle=t.onToggle,this.onColorVisionSupportModeChange=t.onColorVisionSupportModeChange,this.onBGMVolumeChange=t.onBGMVolumeChange,this.onSFXVolumeChange=t.onSFXVolumeChange,this.onVibrationIntensityChange=t.onVibrationIntensityChange,this.onMotionSensitivityChange=t.onMotionSensitivityChange,this.onRestReminderToggle=t.onRestReminderToggle,this.onLanguageChange=t.onLanguageChange,C.setLanguage(this.language,{notify:!1}),this.languageUnsubscribe?.(),this.languageUnsubscribe=C.subscribe(i=>{this.language=i,this.render()}),!this.overlay){const i=window.innerHeight<=760;this.overlay=document.createElement("div"),this.overlay.setAttribute("data-color-accessibility-settings",""),this.overlay.style.cssText=`
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
      `;const n=document.createElement("h2");n.setAttribute("data-color-settings-title",""),n.style.cssText="margin: 0 0 0.55rem; font-size: clamp(1.2rem, 4.4vmin, 1.6rem);",this.descriptionEl=document.createElement("p"),this.descriptionEl.style.cssText="margin: 0 0 1rem; font-size: clamp(0.95rem, 3.4vmin, 1.05rem); line-height: 1.55;",this.toggleButton=document.createElement("button"),this.toggleButton.setAttribute("data-color-accessibility-toggle",""),this.toggleButton.style.cssText=`
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
      `,this.toggleButton.addEventListener("click",()=>{this.highContrast=!this.highContrast,this.render(),this.onToggle?.(this.highContrast)});const a=document.createElement("h3");a.setAttribute("data-audio-title",""),a.style.cssText="margin: 0.75rem 0 0.45rem; font-size: clamp(1rem, 3.8vmin, 1.2rem);";const o=document.createElement("p");o.setAttribute("data-audio-hint",""),o.style.cssText="margin: 0 0 0.65rem; font-size: clamp(0.9rem, 3.1vmin, 1rem); line-height: 1.45;";const h=(c,E,B)=>{const j=document.createElement("div");j.style.cssText="margin-bottom: 0.85rem; text-align: left;";const V=document.createElement("p");V.setAttribute(`data-${c}-volume-heading`,""),V.dataset.i18nKey=E,V.style.cssText="margin: 0 0 0.3rem; font-size: clamp(0.95rem, 3.2vmin, 1rem); font-weight: 900;";const _=document.createElement("p");_.setAttribute(`data-${c}-volume-label`,""),_.style.cssText="margin: 0 0 0.45rem; font-size: clamp(0.88rem, 3vmin, 0.98rem); line-height: 1.4;";const k=document.createElement("input");k.type="range",k.min="0",k.max="100",k.step="25",k.value="100",k.setAttribute(`data-${c}-volume-slider`,""),k.style.cssText="width: 100%; margin: 0 0 0.3rem;",k.addEventListener("input",()=>{const Q=Number(k.value);c==="bgm"?this.bgmVolume=Q:this.sfxVolume=Q,this.render(),B(Q)});const St=document.createElement("div");St.style.cssText=`
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 0.2rem;
          font-size: clamp(0.68rem, 2.25vmin, 0.8rem);
          color: rgba(255, 255, 255, 0.86);
          text-align: center;
        `;for(const Q of mt){const Ht=document.createElement("span");Ht.setAttribute("data-volume-option",String(Q.value)),St.appendChild(Ht)}return c==="bgm"?(this.bgmVolumeDescriptionEl=_,this.bgmVolumeSlider=k):(this.sfxVolumeDescriptionEl=_,this.sfxVolumeSlider=k),j.append(V,_,k,St),j},d=h("bgm","colorSettings.audio.bgm",c=>{this.onBGMVolumeChange?.(c)}),m=h("sfx","colorSettings.audio.sfx",c=>{this.onSFXVolumeChange?.(c)}),f=document.createElement("h3");f.setAttribute("data-rest-reminder-title",""),f.style.cssText="margin: 0.9rem 0 0.45rem; font-size: clamp(1rem, 3.8vmin, 1.2rem);",this.restReminderDescriptionEl=document.createElement("p"),this.restReminderDescriptionEl.style.cssText="margin: 0 0 0.6rem; font-size: clamp(0.9rem, 3.2vmin, 1rem); line-height: 1.5;",this.restReminderToggleButton=document.createElement("button"),this.restReminderToggleButton.setAttribute("data-rest-reminder-toggle",""),this.restReminderToggleButton.style.cssText=`
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
      `;for(const c of jt){const E=document.createElement("button");E.setAttribute("data-language-button",c.value),E.style.cssText=`
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
        `,E.addEventListener("click",()=>{C.setLanguage(c.value),this.onLanguageChange?.(c.value)}),this.languageButtons.set(c.value,E),g.appendChild(E)}const r=document.createElement("h3");r.setAttribute("data-color-vision-title",""),r.style.cssText="margin: 0.9rem 0 0.45rem; font-size: clamp(1rem, 3.8vmin, 1.2rem);",this.colorVisionDescriptionEl=document.createElement("p"),this.colorVisionDescriptionEl.style.cssText="margin: 0 0 0.8rem; font-size: clamp(0.9rem, 3.2vmin, 1rem); line-height: 1.5;";const u=document.createElement("div");u.setAttribute("data-color-vision-mode-group",""),u.style.cssText=`
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.65rem;
        margin-bottom: 0.95rem;
      `;for(const c of $t){const E=document.createElement("button");E.setAttribute("data-color-vision-mode-button",c.value),E.style.cssText=`
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
        `,E.addEventListener("click",()=>{this.colorVisionSupportMode=c.value,this.render(),this.onColorVisionSupportModeChange?.(c.value)}),this.colorVisionButtons.set(c.value,E),u.appendChild(E)}const w=document.createElement("h3");w.setAttribute("data-vibration-title",""),w.style.cssText="margin: 0.9rem 0 0.45rem; font-size: clamp(1rem, 3.8vmin, 1.2rem);",this.vibrationDescriptionEl=document.createElement("p"),this.vibrationDescriptionEl.style.cssText="margin: 0 0 0.8rem; font-size: clamp(0.9rem, 3.2vmin, 1rem); line-height: 1.5;";const y=document.createElement("div");y.setAttribute("data-vibration-intensity-group",""),y.style.cssText=`
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.65rem;
        margin-bottom: 0.95rem;
      `;for(const c of Vt){const E=document.createElement("button");E.setAttribute("data-vibration-intensity-button",c.value),E.style.cssText=`
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
        `,E.addEventListener("click",()=>{this.vibrationIntensity=c.value,this.render(),this.onVibrationIntensityChange?.(c.value)}),this.vibrationButtons.set(c.value,E),y.appendChild(E)}const p=document.createElement("h3");p.setAttribute("data-motion-title",""),p.style.cssText="margin: 1.1rem 0 0.45rem; font-size: clamp(1rem, 3.8vmin, 1.2rem);";const T=document.createElement("p");T.setAttribute("data-motion-hint",""),T.style.cssText="margin: 0 0 0.5rem; font-size: clamp(0.9rem, 3.2vmin, 1rem); line-height: 1.5;",this.motionDescriptionEl=document.createElement("p"),this.motionDescriptionEl.style.cssText="margin: 0 0 0.8rem; font-size: clamp(0.9rem, 3.2vmin, 1rem); line-height: 1.5;";const A=document.createElement("div");A.setAttribute("data-motion-sensitivity-group",""),A.style.cssText=`
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.65rem;
        margin-bottom: 0.95rem;
      `;const R=["strong","medium","gentle","minimal"];for(const c of R){const E=Et(c),B=document.createElement("button");B.setAttribute("data-motion-sensitivity-button",c),B.style.cssText=`
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
        `;const j=document.createElement("span");j.textContent=E.emoji,j.style.cssText="font-size: clamp(1.25rem, 4.8vmin, 1.7rem); line-height: 1;";const V=document.createElement("span");V.textContent=E.stars,V.style.cssText="font-size: clamp(0.82rem, 2.9vmin, 0.95rem); letter-spacing: 0.08em;";const _=document.createElement("span");_.setAttribute("data-motion-label",c),_.style.cssText="font-size: clamp(0.9rem, 3vmin, 1rem);",B.append(j,V,_),B.addEventListener("click",()=>{this.motionSensitivity=c,this.render(),this.playMotionPreview(),this.onMotionSensitivityChange?.(c)}),this.motionButtons.set(c,B),A.appendChild(B)}this.motionPreviewEl=document.createElement("div"),this.motionPreviewEl.setAttribute("data-motion-preview",""),this.motionPreviewEl.style.cssText=`
        position: relative;
        min-height: 5.8rem;
        margin: 0 0 1rem;
        padding: 0.8rem 0.9rem;
        border-radius: 1.25rem;
        border: 2px solid rgba(255, 255, 255, 0.2);
        background: linear-gradient(180deg, rgba(14, 24, 60, 0.92), rgba(8, 14, 38, 0.96));
        overflow: hidden;
      `;const M=document.createElement("div");M.style.cssText=`
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
      `,this.motionPreviewCaptionEl=document.createElement("p"),this.motionPreviewCaptionEl.setAttribute("data-motion-preview-caption",""),this.motionPreviewCaptionEl.style.cssText="margin: 0; font-size: clamp(0.9rem, 3vmin, 1rem); line-height: 1.5;",M.append(S,this.motionPreviewTokenEl),this.motionPreviewEl.append(M,this.motionPreviewCaptionEl);const x=document.createElement("button");x.setAttribute("data-color-settings-close",""),x.style.cssText=`
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
      `,x.addEventListener("click",()=>this.hide()),s.appendChild(n),s.appendChild(this.descriptionEl),s.appendChild(this.toggleButton),s.appendChild(a),s.appendChild(o),s.appendChild(d),s.appendChild(m),s.appendChild(f),s.appendChild(this.restReminderDescriptionEl),s.appendChild(this.restReminderToggleButton),s.appendChild(b),s.appendChild(this.languageDescriptionEl),s.appendChild(g),s.appendChild(r),s.appendChild(this.colorVisionDescriptionEl),s.appendChild(u),s.appendChild(w),s.appendChild(this.vibrationDescriptionEl),s.appendChild(y),s.appendChild(p),s.appendChild(T),s.appendChild(this.motionDescriptionEl),s.appendChild(A),s.appendChild(this.motionPreviewEl),s.appendChild(x),this.overlay.appendChild(s)}this.render(),e.appendChild(this.overlay)}}hide(){this.clearMotionPreviewTimers(),this.languageUnsubscribe?.(),this.languageUnsubscribe=null,this.overlay?.remove()}isVisible(){return this.overlay?.isConnected===!0}getMotionShortLabel(t){return C.t(Ut[t].shortLabel)}getMotionDescription(t){return C.t(Ut[t].description)}setStaticText(t,e){const i=this.overlay?.querySelector(t);i&&(i.textContent=C.t(e))}render(){if(!this.toggleButton||!this.descriptionEl||!this.bgmVolumeDescriptionEl||!this.sfxVolumeDescriptionEl||!this.bgmVolumeSlider||!this.sfxVolumeSlider||!this.restReminderDescriptionEl||!this.restReminderToggleButton||!this.languageDescriptionEl||!this.colorVisionDescriptionEl||!this.vibrationDescriptionEl||!this.motionDescriptionEl)return;this.setStaticText("[data-color-settings-title]","colorSettings.title"),this.setStaticText("[data-audio-title]","colorSettings.audio.title"),this.setStaticText("[data-audio-hint]","colorSettings.audio.hint"),this.setStaticText("[data-bgm-volume-heading]","colorSettings.audio.bgm"),this.setStaticText("[data-sfx-volume-heading]","colorSettings.audio.sfx"),this.setStaticText("[data-rest-reminder-title]","colorSettings.restReminder.title"),this.setStaticText("[data-language-title]","colorSettings.language.title"),this.setStaticText("[data-color-vision-title]","colorSettings.colorVision.title"),this.setStaticText("[data-vibration-title]","colorSettings.vibration.title"),this.setStaticText("[data-motion-title]","colorSettings.motion.title"),this.setStaticText("[data-motion-hint]","colorSettings.motion.hint"),this.setStaticText("[data-color-settings-close]","colorSettings.close"),this.descriptionEl.textContent=this.highContrast?C.t("colorSettings.description.on"):C.t("colorSettings.description.off"),this.toggleButton.textContent=this.highContrast?C.t("colorSettings.toggle.on"):C.t("colorSettings.toggle.off"),this.toggleButton.setAttribute("aria-pressed",this.highContrast?"true":"false");const t=Wt(this.bgmVolume);this.bgmVolumeDescriptionEl.textContent=`🎵 ${t} (${this.bgmVolume}%)`,this.bgmVolumeSlider.value=String(this.bgmVolume),this.bgmVolumeSlider.setAttribute("aria-valuetext",`${t} ${this.bgmVolume}%`);const e=Wt(this.sfxVolume);this.sfxVolumeDescriptionEl.textContent=`✨ ${e} (${this.sfxVolume}%)`,this.sfxVolumeSlider.value=String(this.sfxVolume),this.sfxVolumeSlider.setAttribute("aria-valuetext",`${e} ${this.sfxVolume}%`);for(const s of mt){const n=this.overlay?.querySelector(`[data-volume-option="${s.value}"]`);n&&(n.textContent=C.t(s.labelKey))}this.restReminderDescriptionEl.textContent=this.restReminderEnabled?C.t("colorSettings.restReminder.description.on"):C.t("colorSettings.restReminder.description.off"),this.restReminderToggleButton.textContent=this.restReminderEnabled?C.t("colorSettings.restReminder.toggle.on"):C.t("colorSettings.restReminder.toggle.off"),this.restReminderToggleButton.setAttribute("aria-pressed",this.restReminderEnabled?"true":"false"),this.languageDescriptionEl.textContent=C.t("colorSettings.language.description");for(const s of jt){const n=this.languageButtons.get(s.value);if(!n)continue;const a=s.value===this.language;n.textContent=`${s.icon} ${C.t(s.labelKey)}`,n.setAttribute("aria-pressed",a?"true":"false"),n.style.borderColor=a?"#fff27a":"rgba(255, 255, 255, 0.4)",n.style.background=a?"linear-gradient(135deg, rgba(255, 242, 122, 0.94), rgba(118, 240, 255, 0.92))":"rgba(255, 255, 255, 0.08)",n.style.color=a?"#102040":"#fff",n.style.transform=a?"scale(1.02)":"scale(1)"}this.colorVisionDescriptionEl.textContent=this.colorVisionSupportMode==="color-and-marks"?C.t("colorSettings.colorVision.description.colorAndMarks"):C.t("colorSettings.colorVision.description.colorOnly");for(const s of $t){const n=this.colorVisionButtons.get(s.value);if(!n)continue;const a=s.value===this.colorVisionSupportMode;n.textContent=`${s.icon} ${C.t(s.labelKey)}`,n.setAttribute("aria-pressed",a?"true":"false"),n.style.borderColor=a?"#fff27a":"rgba(255, 255, 255, 0.4)",n.style.background=a?"linear-gradient(135deg, rgba(255, 242, 122, 0.94), rgba(118, 240, 255, 0.92))":"rgba(255, 255, 255, 0.08)",n.style.color=a?"#102040":"#fff",n.style.transform=a?"scale(1.02)":"scale(1)"}const i={strong:C.t("colorSettings.vibration.description.strong"),medium:C.t("colorSettings.vibration.description.medium"),weak:C.t("colorSettings.vibration.description.weak"),off:C.t("colorSettings.vibration.description.off")};this.vibrationDescriptionEl.textContent=i[this.vibrationIntensity];for(const s of Vt){const n=this.vibrationButtons.get(s.value);if(!n)continue;const a=s.value===this.vibrationIntensity;n.textContent=C.t(s.labelKey),n.setAttribute("aria-pressed",a?"true":"false"),n.style.borderColor=a?"#fff27a":"rgba(255, 255, 255, 0.4)",n.style.background=a?"linear-gradient(135deg, rgba(255, 242, 122, 0.94), rgba(118, 240, 255, 0.92))":"rgba(255, 255, 255, 0.08)",n.style.color=a?"#102040":"#fff",n.style.transform=a?"scale(1.02)":"scale(1)"}this.motionDescriptionEl.textContent=this.getMotionDescription(this.motionSensitivity);for(const[s,n]of this.motionButtons.entries()){const a=s===this.motionSensitivity,o=n.querySelector(`[data-motion-label="${s}"]`);o&&(o.textContent=this.getMotionShortLabel(s)),n.setAttribute("aria-pressed",a?"true":"false"),n.style.borderColor=a?"#fff27a":"rgba(255, 255, 255, 0.4)",n.style.background=a?"linear-gradient(135deg, rgba(255, 242, 122, 0.94), rgba(118, 240, 255, 0.92))":"rgba(255, 255, 255, 0.08)",n.style.color=a?"#102040":"#fff",n.style.transform=a?"scale(1.02)":"scale(1)"}this.motionPreviewEl?.dataset.previewActive!=="true"&&this.resetMotionPreview()}playMotionPreview(){if(!this.motionPreviewEl||!this.motionPreviewTokenEl||!this.motionPreviewCaptionEl)return;this.clearMotionPreviewTimers();const t=Et(this.motionSensitivity),e=this.getMotionShortLabel(this.motionSensitivity);this.motionPreviewEl.dataset.previewActive="true",this.motionPreviewTokenEl.textContent=t.emoji,this.motionPreviewTokenEl.style.background="rgba(255, 242, 122, 0.92)",this.motionPreviewTokenEl.style.boxShadow=t.previewGlow,this.motionPreviewTokenEl.style.transition="none",this.motionPreviewTokenEl.style.left="0.35rem",this.motionPreviewTokenEl.style.transform="translateY(-50%) scale(1)",this.motionPreviewCaptionEl.textContent=C.t("colorSettings.motion.preview.playing",{emoji:t.emoji,label:e}),this.motionPreviewFrameId=window.requestAnimationFrame(()=>{this.motionPreviewTokenEl&&(this.motionPreviewTokenEl.style.transition=`left ${t.previewDurationMs}ms ease-in-out, transform ${t.previewDurationMs}ms ease-in-out`,this.motionPreviewTokenEl.style.left="calc(100% - 2.45rem)",this.motionPreviewTokenEl.style.transform=`translateY(-50%) scale(${t.previewScale})`)}),this.motionPreviewTimeoutId=window.setTimeout(()=>{this.resetMotionPreview()},t.previewDurationMs+260)}resetMotionPreview(){if(!this.motionPreviewEl||!this.motionPreviewTokenEl||!this.motionPreviewCaptionEl)return;const t=Et(this.motionSensitivity),e=this.getMotionShortLabel(this.motionSensitivity);this.motionPreviewEl.dataset.previewActive="false",this.motionPreviewTokenEl.textContent=t.emoji,this.motionPreviewTokenEl.style.transition="none",this.motionPreviewTokenEl.style.left="0.35rem",this.motionPreviewTokenEl.style.transform="translateY(-50%) scale(1)",this.motionPreviewTokenEl.style.background="rgba(255, 242, 122, 0.92)",this.motionPreviewTokenEl.style.boxShadow=t.previewGlow,this.motionPreviewCaptionEl.textContent=C.t("colorSettings.motion.preview.idle",{stars:t.stars,label:e})}clearMotionPreviewTimers(){this.motionPreviewTimeoutId!==null&&(window.clearTimeout(this.motionPreviewTimeoutId),this.motionPreviewTimeoutId=null),this.motionPreviewFrameId!==null&&(window.cancelAnimationFrame(this.motionPreviewFrameId),this.motionPreviewFrameId=null)}}function P(l,t){let e=!1,i=!1,s=null,n=null;const a=t.documentTarget??document,o=t.stopPropagation??!0,h=()=>{t.canActivate?.()!==!1&&t.onActivate()},d=S=>{t.onPressChange?.(S)},m=S=>{const x=S;return typeof x.clientX=="number"&&typeof x.clientY=="number"?{x:x.clientX,y:x.clientY}:null},f=S=>{const x=S;return typeof x.pointerId=="number"?x.pointerId:null},b=S=>{const x=f(S);return s===null||x===null||x===s},g=S=>{if(!e||n===null||t.moveTolerancePx===void 0)return!1;const x=m(S);return x===null?!1:Math.hypot(x.x-n.x,x.y-n.y)>t.moveTolerancePx},r=S=>{e=!1,i=S,s=null,n=null,d(!1),a.removeEventListener("pointermove",y,!0),a.removeEventListener("pointerup",u,!0),a.removeEventListener("pointercancel",w,!0)},u=S=>{if(!e||!b(S))return;if(g(S)){r(!0);return}const x=S.target,c=x===l||x instanceof Node&&l.contains(x),E=e&&c;r(E||!c),E&&h()},w=()=>{r(!0)},y=S=>{!e||!b(S)||g(S)&&r(!0)},p=S=>{t.canActivate?.()!==!1&&((t.preventDefaultOnPointerDown??!1)&&S.preventDefault(),o&&S.stopPropagation(),e=!0,i=!1,s=f(S),n=m(S),d(!0),t.moveTolerancePx!==void 0&&a.addEventListener("pointermove",y,!0),a.addEventListener("pointerup",u,!0),a.addEventListener("pointercancel",w,!0))},T=()=>{e&&d(!0)},A=()=>{e&&d(!1)},R=()=>{r(!0)},M=S=>{if(o&&S.stopPropagation(),(t.preventDefaultOnClick??!1)&&S.preventDefault(),i){i=!1;return}e||h()};return l.addEventListener("pointerdown",p),l.addEventListener("pointerenter",T),l.addEventListener("pointerleave",A),l.addEventListener("pointercancel",R),l.addEventListener("click",M),()=>{r(!1),l.removeEventListener("pointerdown",p),l.removeEventListener("pointerenter",T),l.removeEventListener("pointerleave",A),l.removeEventListener("pointercancel",R),l.removeEventListener("click",M)}}class ni{overlay=null;previewBody=null;previewNose=null;previewWings=null;buttonCleanups=new Set;optionButtons=new Map;draft={...Bt};colorOptions=Z.getColorOptions();show(t){this.hide();const e=document.getElementById("ui-overlay");if(!e)return;this.draft=Z.normalizeCustomization(t.initialCustomization),this.overlay=document.createElement("div"),this.overlay.setAttribute("data-spaceship-customizer",""),this.overlay.setAttribute("role","dialog"),this.overlay.setAttribute("aria-modal","true"),this.overlay.setAttribute("aria-label","うちゅうせんを かざろう"),this.overlay.style.cssText=`
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
    `,i.style.overflowY="hidden",i.style.height="100%",i.style.maxHeight="720px",i.addEventListener("pointerdown",d=>d.stopPropagation()),this.overlay.appendChild(i);const s=document.createElement("h2");s.textContent="うちゅうせんを かざろう",s.style.cssText="margin: 0 0 0.3rem; font-size: clamp(1.25rem, 4.3vmin, 1.85rem); color: #ffe66d;";const n=document.createElement("p");n.textContent="おおきな ボタンで えらぶと、すぐに みためが かわるよ。",n.style.cssText="margin: 0 0 0.45rem; font-size: clamp(0.85rem, 2.8vmin, 1rem); line-height: 1.35;",i.appendChild(s),i.appendChild(n);const a=document.createElement("div");a.setAttribute("data-spaceship-customizer-content",""),a.style.cssText="display: grid; grid-template-columns: minmax(12rem, 15rem) minmax(0, 1fr); gap: 0.65rem; align-items: stretch; margin: 0.45rem 0 0.65rem;",a.appendChild(this.createPreviewCard());const o=document.createElement("div");o.setAttribute("data-spaceship-customizer-sections",""),o.style.cssText="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.5rem; align-items: stretch;",o.appendChild(this.createPartSection("bodyColor","ほんたい")),o.appendChild(this.createPartSection("noseColor","ノーズ")),o.appendChild(this.createPartSection("wingColor","つばさ")),a.appendChild(o),i.appendChild(a);const h=document.createElement("button");h.textContent="かんりょう",h.setAttribute("data-spaceship-customizer-done",""),h.style.cssText=`
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
    `,this.buttonCleanups.add(P(h,{onActivate:()=>{const d={...this.draft};this.hide(),t.onComplete(d)},onPressChange:d=>{h.style.transform=d?"scale(0.96)":"scale(1)"}})),i.appendChild(h),e.appendChild(this.overlay),this.render()}hide(){const t=Array.from(this.buttonCleanups);this.buttonCleanups.clear();for(const e of t)e();this.optionButtons.clear(),this.overlay?.remove(),this.overlay=null,this.previewBody=null,this.previewNose=null,this.previewWings=null}isVisible(){return this.overlay?.isConnected===!0}createPreviewCard(){const t=document.createElement("div");t.setAttribute("data-spaceship-customizer-preview-card",""),t.style.cssText=`
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
    `,i.appendChild(this.previewWings),i.appendChild(this.previewBody),i.appendChild(this.previewNose),i.appendChild(n),t.appendChild(i),t}createPartSection(t,e){const i=document.createElement("div");i.style.cssText=`
      padding: 0.5rem 0.45rem;
      border-radius: 1.1rem;
      background: rgba(255, 255, 255, 0.08);
      text-align: left;
      box-sizing: border-box;
    `;const s=document.createElement("div");s.textContent=e,s.style.cssText="margin-bottom: 0.25rem; font-size: 0.88rem; font-weight: 900; color: #ffe66d; text-align: center;",i.appendChild(s);const n=document.createElement("div");n.style.cssText="display: grid; grid-template-columns: minmax(0, 1fr); gap: 0.32rem;";for(const a of this.colorOptions)n.appendChild(this.createColorButton(t,a));return i.appendChild(n),i}createColorButton(t,e){const i=document.createElement("button");i.type="button",i.setAttribute("data-spaceship-color-option",`${t}:${e.key}`),i.style.cssText=`
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
    `;const n=document.createElement("span");return n.textContent=e.label,n.style.cssText="font-family: Zen Maru Gothic, sans-serif; font-size: 0.82rem; font-weight: 700;",i.appendChild(s),i.appendChild(n),this.buttonCleanups.add(P(i,{onActivate:()=>this.selectColor(t,e.key),onPressChange:a=>{i.style.transform=a?"scale(0.95)":"scale(1)"}})),this.optionButtons.set(`${t}:${e.key}`,i),i}selectColor(t,e){this.draft={...this.draft,[t]:e},this.render()}render(){const t=Z.normalizeCustomization(this.draft);this.draft=t,this.previewBody?.style.setProperty("background",`#${Z.getColorHex(t.bodyColor).toString(16).padStart(6,"0")}`),this.previewWings?.style.setProperty("background",`#${Z.getColorHex(t.wingColor).toString(16).padStart(6,"0")}`),this.previewNose&&(this.previewNose.style.borderBottomColor=`#${Z.getColorHex(t.noseColor).toString(16).padStart(6,"0")}`);for(const e of this.colorOptions)this.renderOptionState("bodyColor",e.key,t.bodyColor===e.key),this.renderOptionState("noseColor",e.key,t.noseColor===e.key),this.renderOptionState("wingColor",e.key,t.wingColor===e.key)}renderOptionState(t,e,i){const s=this.optionButtons.get(`${t}:${e}`);s&&(s.setAttribute("aria-pressed",i?"true":"false"),s.style.borderColor=i?"#ffe66d":"transparent",s.style.background=i?"rgba(255, 230, 109, 0.18)":"rgba(255, 255, 255, 0.12)")}}function ai(l){return{totalPlayTimeSeconds:l?.totalPlayTimeSeconds??0,totalStarsCollected:l?.totalStarsCollected??0,totalBoostUses:l?.totalBoostUses??0,stageClearCounts:{...l?.stageClearCounts??{}}}}function oi(l){const t=Math.max(0,Math.round(l)),e=Math.floor(t/3600),i=Math.floor(t%3600/60),s=t%60;return e>0?`${e}じかん ${i}ふん`:i>0?`${i}ふん ${s}びょう`:`${s}びょう`}class ri{overlayEl=null;actionCleanups=new Set;show(t,e){this.hide();const i=document.getElementById("ui-overlay");if(!i)return;const s=ai(t),n=window.innerHeight<=720,a=document.createElement("div");a.setAttribute("data-stats-overlay",""),a.style.cssText=`
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
    `,o.appendChild(h);const d=document.createElement("div");d.style.cssText=`
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(${n?"120px":"150px"}, 1fr));
      gap: 0.8rem;
      margin-bottom: 1rem;
    `,d.append(this.createSummaryCard("あそんだ じかん",oi(s.totalPlayTimeSeconds),"data-stats-total-play-time"),this.createSummaryCard("とった ほし",`${s.totalStarsCollected}こ`,"data-stats-total-stars"),this.createSummaryCard("ブースト",`${s.totalBoostUses}かい`,"data-stats-total-boosts")),o.appendChild(d);const m=document.createElement("div");m.style.cssText=`
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
    `;const g=Array.from({length:z},(u,w)=>w+1).map(u=>({stageNumber:u,clearCount:s.stageClearCounts[u]??0})).filter(u=>u.clearCount>0);if(g.length===0){const u=document.createElement("div");u.textContent="まだ きろくが ないよ",u.style.cssText=`
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${n?"1rem":"1.1rem"};
        font-weight: 700;
        text-align: center;
        color: rgba(255, 255, 255, 0.88);
      `,b.appendChild(u)}else for(const{stageNumber:u,clearCount:w}of g){const y=W(u),p=document.createElement("div");p.setAttribute("data-stats-stage-clear-row",String(u)),p.style.cssText=`
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
        `;const T=document.createElement("span");T.textContent=`${y.emoji} ステージ ${u} ${y.destinationReading}`;const A=document.createElement("span");A.textContent=`${w}かい`,A.style.color="#FFE66D",p.append(T,A),b.appendChild(p)}m.appendChild(b),o.appendChild(m);const r=document.createElement("button");r.textContent="もどる",r.style.cssText=`
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
    `,this.actionCleanups.add(P(r,{onActivate:()=>{this.hide(),e()},onPressChange:u=>{r.style.transform=u?"scale(0.96)":"scale(1)"}})),o.appendChild(r),a.appendChild(o),i.appendChild(a)}hide(){const t=Array.from(this.actionCleanups);this.actionCleanups.clear();for(const e of t)e();this.overlayEl?.remove(),this.overlayEl=null}createSummaryCard(t,e,i){const s=document.createElement("div");s.setAttribute(i,""),s.style.cssText=`
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
    `,s.append(n,a),s}}function Zt(l,t){if(!Number.isFinite(l)||l<=0||t<=0)return"ずかん";const e=Math.min(l,t);return e>=t?`ずかん ${t} / ${t} 🎉`:`ずかん ${e} / ${t}`}function li(l){switch(l){case"hero":return{gap:"0.35rem",label:"0.92rem",medal:"1.7rem",hint:"0.98rem"};case"compact":return{gap:"0.18rem",label:"0.7rem",medal:"1rem",hint:"0.76rem"};default:return{gap:"0.26rem",label:"0.8rem",medal:"1.25rem",hint:"0.84rem"}}}function Pt(l,t,e={}){const i=Qt(l,t),s=e.size??"regular",n=li(s),a=document.createElement("div");if(a.setAttribute("data-stage-medal-display",""),a.setAttribute("data-stage-medal-stage",String(l)),a.setAttribute("data-stage-medal-tier",i.tier),a.setAttribute("data-stage-medal-earned",String(i.earnedCount)),e.scope&&a.setAttribute("data-stage-medal-scope",e.scope),a.style.cssText=`
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
  `;for(const m of i.slots){const f=document.createElement("span");f.setAttribute("data-stage-medal-slot",m.tier),f.setAttribute("data-stage-medal-threshold",String(m.threshold)),f.setAttribute("data-stage-medal-reached",String(m.reached)),f.textContent=m.icon,f.style.cssText=`
      font-size: ${n.medal};
      line-height: 1;
      filter: ${m.reached?"drop-shadow(0 0 10px rgba(255, 215, 0, 0.45))":"none"};
      opacity: ${m.reached?"1":"0.3"};
      transform: ${m.reached?"scale(1)":"scale(0.92)"};
    `,o.appendChild(f)}a.appendChild(o);const h=e.hint??(i.nextThreshold===null?"かんぺき！":`つぎ ⭐ ${i.nextThreshold}`),d=document.createElement("div");return d.setAttribute("data-stage-medal-hint",""),d.textContent=h,d.style.cssText=`
    font-family: 'Zen Maru Gothic', sans-serif;
    font-size: ${n.hint};
    font-weight: 700;
    color: ${i.nextThreshold===null?"#FFE66D":"rgba(255, 255, 255, 0.86)"};
  `,a.appendChild(d),a}const qt=2e3,pt=new Map,gt=new Map,ft=new Map;let ot=null,rt=null;function lt(l,t){if(typeof document>"u"){const i=typeof OffscreenCanvas=="function",s=i?new OffscreenCanvas(l,t):{width:l,height:t};return{canvas:s,ctx:i?s.getContext("2d"):null}}const e=document.createElement("canvas");return e.width=l,e.height=t,{canvas:e,ctx:e.getContext("2d")}}function K(l,t){let e=pt.get(l);return e||(e=t(),e.generateMipmaps=!1,e.minFilter=ti,e.needsUpdate=!0,pt.set(l,e)),e}function I(l,t){let e=gt.get(l);return e||(e=t(),gt.set(l,e)),e}function D(l,t){let e=ft.get(l);return e||(e=t(),ft.set(l,e)),e}function L(l,t){const e=new Je(l,t);return e.userData.sharedAssets=!0,e}function ae(){if(!ot){const l=new Ot,t=new Float32Array(qt*3);for(let e=0;e<qt*3;e+=3)t[e]=(Math.random()-.5)*200,t[e+1]=(Math.random()-.5)*200,t[e+2]=(Math.random()-.5)*400;l.setAttribute("position",new It(t,3)),ot=l}rt||(rt=new Dt({color:16777215,size:.2,sizeAttenuation:!0}))}function hi(){const{canvas:l,ctx:t}=lt(256,256);if(!t)return new F(l);t.fillStyle="#888888",t.fillRect(0,0,256,256);for(let e=0;e<30;e++){const i=Math.random()*256,s=Math.random()*256,n=3+Math.random()*12;t.beginPath(),t.arc(i,s,n,0,Math.PI*2),t.fillStyle=`rgba(60,60,60,${.3+Math.random()*.4})`,t.fill()}return new F(l)}function ci(){const{canvas:l,ctx:t}=lt(256,256);if(!t)return new F(l);t.fillStyle="#ddaa44",t.fillRect(0,0,256,256);for(let e=0;e<8;e++){t.beginPath();const i=128+(Math.random()-.5)*100,s=128+(Math.random()-.5)*100;t.strokeStyle=`rgba(200,150,60,${.3+Math.random()*.3})`,t.lineWidth=3+Math.random()*5;for(let n=0;n<Math.PI*4;n+=.1){const a=10+n*8;t.lineTo(i+Math.cos(n)*a,s+Math.sin(n)*a)}t.stroke()}return new F(l)}function di(){const{canvas:l,ctx:t}=lt(256,256);if(!t)return new F(l);const e=["#cc7733","#dd9955","#bb6622","#eebb77","#aa5511","#ddaa66"];for(let i=0;i<256;i++){const s=Math.floor(i/(256/e.length))%e.length;t.fillStyle=e[s],t.fillRect(0,i,256,1)}return new F(l)}function ui(){const{canvas:l,ctx:t}=lt(512,256);return t?(t.fillStyle="#2266aa",t.fillRect(0,0,512,256),t.fillStyle="#886644",t.beginPath(),t.ellipse(300,80,80,40,.2,0,Math.PI*2),t.fill(),t.beginPath(),t.ellipse(280,150,30,50,.1,0,Math.PI*2),t.fill(),t.beginPath(),t.ellipse(100,90,25,60,.3,0,Math.PI*2),t.fill(),t.beginPath(),t.ellipse(110,170,20,40,-.2,0,Math.PI*2),t.fill(),t.beginPath(),t.ellipse(420,170,25,15,0,0,Math.PI*2),t.fill(),t.fillStyle="#447733",t.beginPath(),t.ellipse(290,75,40,20,.3,0,Math.PI*2),t.fill(),t.beginPath(),t.ellipse(95,85,15,30,.2,0,Math.PI*2),t.fill(),new F(l)):new F(l)}function mi(){const{canvas:l,ctx:t}=lt(512,256);if(!t)return new F(l);t.clearRect(0,0,512,256),t.fillStyle="rgba(255,255,255,0.6)";for(let e=0;e<20;e++){const i=Math.random()*512,s=Math.random()*256;t.beginPath(),t.ellipse(i,s,20+Math.random()*40,8+Math.random()*15,Math.random()*Math.PI,0,Math.PI*2),t.fill()}return new F(l)}function pi(){pt.clear(),gt.clear(),ft.clear(),ot=null,rt=null}const gi={planetTextureCache:pt,planetGeometryCache:gt,planetMaterialCache:ft,getBgStarsGeometry:()=>ot,getBgStarsMaterial:()=>rt};function oe(l,t,e){const i=new ut;let s=null;switch(l){case 2:{const n=K("mercury",hi),a=I("mercury:sphere",()=>new N(10,24,24)),o=D("mercury:mat",()=>new O({map:n})),h=L(a,o);i.add(h),s=h;break}case 3:{const n=K("venus",ci),a=I("venus:sphere",()=>new N(14,24,24)),o=D("venus:mat",()=>new O({map:n})),h=L(a,o);i.add(h),s=h;break}case 5:{const n=K("jupiter",di),a=I("jupiter:sphere",()=>new N(20,24,24)),o=D("jupiter:mat",()=>new O({map:n})),h=L(a,o);i.add(h),s=h;break}case 6:{const n=I("saturn:sphere",()=>new N(15,24,24)),a=t.planetColor,o=D(`saturn:mat:${a}`,()=>new O({color:a})),h=L(n,o);i.add(h);const d=I("saturn:ring",()=>new _t(20,30,48)),m=D("saturn:ringMat",()=>new O({color:15645542,side:Ft})),f=L(d,m);f.rotation.x=Math.PI/3,i.add(f),s=h;break}case 7:{const n=I("uranus:sphere",()=>new N(16,24,24)),a=D("uranus:mat",()=>new O({color:6737117})),o=L(n,a);i.add(o);const h=I("uranus:ring",()=>new _t(21,28,48)),d=D("uranus:ringMat",()=>new O({color:10083822,side:Ft})),m=L(h,d);m.rotation.z=Math.PI/2,i.add(m),s=o;break}case 9:{const n=I("pluto:sphere",()=>new N(8,24,24)),a=D("pluto:mat",()=>new O({color:12298922})),o=L(n,a);i.add(o),s=o;break}case 10:{const n=I("sun:sphere",()=>new N(25,24,24)),a=D("sun:mat",()=>new O({color:16763904,emissive:16755200,emissiveIntensity:.5})),o=L(n,a);i.add(o),i.add(new Ke(16763904,2,200)),s=o;break}case 11:{const n=K("earth",ui),a=I("earth:sphere",()=>new N(15,32,32)),o=D("earth:mat",()=>new O({map:n})),h=K("earth:cloud",mi),d=I("earth:cloudSphere",()=>new N(15.5,32,32)),m=D("earth:cloudMat",()=>new O({map:h,transparent:!0,opacity:.3})),f=new ut;f.add(L(a,o)),f.add(L(d,m)),i.add(f),s=f;break}default:{const n=I("default:sphere",()=>new N(15,24,24)),a=t.planetColor,o=D(`default:mat:${a}`,()=>new O({color:a})),h=L(n,o);i.add(h),s=h;break}}return i.position.set(0,0,e),{planet:i,spinTarget:s}}function re(l,t,e){return oe(l,t,e)}function le(l){ae();const t=new kt(ot,rt);return t.userData.sharedAssets=!0,t.geometry.setDrawRange(0,l),t}function zt(l){!Number.isInteger(l)||l<1||l>z||typeof document>"u"&&typeof OffscreenCanvas!="function"||(ae(),oe(l,W(l),0))}let tt=null,et=null;function fi(){if(!tt){const l=new Ot,t=new Float32Array(3e3);for(let e=0;e<3e3;e++)t[e]=(Math.random()-.5)*200;l.setAttribute("position",new It(t,3)),tt=l}return tt}function yi(){return et||(et=new Dt({color:16777215,size:.3,sizeAttenuation:!0})),et}function bi(){tt=null,et=null}const vi={getBgStarsGeometry:()=>tt,getBgStarsMaterial:()=>et};function Si(l){const t=window.requestIdleCallback;if(typeof t=="function"){t(l,{timeout:1500});return}window.setTimeout(l,800)}function he(l){return new Set(l.filter(t=>Number.isInteger(t)&&t>=1&&t<=z)).size}function Ei(l){return he(l)>=z}function wt(l){const t=Ei(l.unlockedPlanets),e=t?1:Math.min(l.clearedStage+1,z),i=W(e),s=l.bestStageStars?.[e]??0,n=l.colorAccessibility?.colorVisionSupportMode??$,a=Jt(e,i.destinationReading,n);return t?{startStage:e,destination:a,emoji:i.emoji,statusLabel:"ぜんぶ あつめたよ！",destinationLabel:`${a}へ もういちど しゅっぱつ！`,buttonHint:`${i.emoji} ステージ ${e} から もういちど あそぶ`,bestStars:s}:{startStage:e,destination:a,emoji:i.emoji,statusLabel:l.clearedStage>0?"つづきから しゅっぱつ！":"はじめての しゅっぱつ！",destinationLabel:`${a}へ むかおう！`,buttonHint:`${i.emoji} ステージ ${e} から スタート`,bestStars:s}}function xi(l){return l.clearedStage>0||he(l.unlockedPlanets)>0||Object.keys(l.bestStageStars??{}).length>0}class Ci{threeScene;ambientLight=new bt(16777215,1);camera;lastAspect=0;sceneManager;saveManager;audioManager;stars=null;companionParade=null;overlay=null;muteHandle=null;tutorialOverlay=new Lt;titleResetConfirmOverlay=new ii;colorAccessibilitySettings=new si;spaceshipCustomizer=new ni;statsOverlay=new ri;encyclopediaOverlay=null;encyclopediaOverlayPromise=null;companionFactory=null;companionFactoryPromise=null;loadEncyclopediaOverlay;loadTitleCompanionFactory;loadingOverlay;loadFailureOverlay;scheduleIdleTask;encyclopediaBtn=null;isOpeningEncyclopedia=!1;isActive=!1;encyclopediaRequestToken=0;companionParadeRequestToken=0;bgmPending=!1;overlayButtonCleanups=new Set;colorSettingsButton=null;unsubscribeLanguageChange=null;constructor(t,e,i,s={}){this.sceneManager=t,this.saveManager=e,this.audioManager=i,this.loadingOverlay=s.loadingOverlay??new ue,this.loadFailureOverlay=s.loadFailureOverlay??new me,this.scheduleIdleTask=s.scheduleIdleTask??Si,this.loadEncyclopediaOverlay=s.loadEncyclopediaOverlay??(()=>Mt(()=>import("./EncyclopediaOverlay-BeHPNDjy.js"),__vite__mapDeps([0,1,2]))),this.loadTitleCompanionFactory=s.loadTitleCompanionFactory??(()=>Mt(()=>import("./game-core-YJtqaFI3.js").then(o=>o.ak),__vite__mapDeps([1,2]))),this.threeScene=new nt,this.threeScene.background=new at(32);const{width:n,height:a}=H();this.camera=new vt(60,n/a,.1,1e3),this.camera.position.set(0,0,5)}enter(t){this.isActive=!0,this.encyclopediaRequestToken+=1,this.companionParadeRequestToken+=1,this.lastAspect=0,this.stars=new kt(fi(),yi()),this.stars.userData.sharedAssets=!0,this.stars.rotation.set(0,0,0),this.threeScene.add(this.stars),this.ambientLight.parent||this.threeScene.add(this.ambientLight);const e=this.saveManager.load();C.setLanguage(e.language??ht,{notify:!1}),this.createCompanionParade(e.unlockedPlanets),this.createOverlay(),this.createMuteButton(),this.prefetchEncyclopediaOnIdle(),this.prewarmNextAdventureOnIdle(wt(e).startStage),this.audioManager.isInitialized()?(this.audioManager.playBGM(0),this.bgmPending=!1):this.bgmPending=!0,e.tutorialShown||this.tutorialOverlay.show(()=>{this.ensureTitleAudioInitialized(!0),this.tutorialOverlay.hide(),this.saveManager.markTutorialShown()})}createMuteButton(){const t=document.getElementById("hud")??document.getElementById("ui-overlay");t&&(this.muteHandle=Gt({initialMuted:this.audioManager.isMuted(),container:t,onToggle:()=>{this.ensureTitleAudioInitialized(!0);const e=this.audioManager.toggleMute();this.muteHandle?.setMuted(e);const i=this.saveManager.load();i.muted=e,this.saveManager.save(i)}}))}getEncyclopediaOverlay(){return this.encyclopediaOverlay?Promise.resolve(this.encyclopediaOverlay):this.encyclopediaOverlayPromise?this.encyclopediaOverlayPromise:(this.encyclopediaOverlayPromise=this.loadEncyclopediaOverlay().then(({EncyclopediaOverlay:t})=>{const e=new t;return this.encyclopediaOverlay=e,e}).finally(()=>{this.encyclopediaOverlayPromise=null}),this.encyclopediaOverlayPromise)}getTitleCompanionFactory(){return this.companionFactory?Promise.resolve(this.companionFactory):this.companionFactoryPromise?this.companionFactoryPromise:(this.companionFactoryPromise=this.loadTitleCompanionFactory().then(t=>(this.companionFactory=t,t)).finally(()=>{this.companionFactoryPromise=null}),this.companionFactoryPromise)}showEncyclopedia(){if(!this.isActive||!this.encyclopediaOverlay)return;const t=this.saveManager.load();this.encyclopediaOverlay.show(t.unlockedPlanets,()=>this.refreshEncyclopediaButtonLabel(),e=>{this.ensureTitleAudioInitialized(!1),this.sceneManager.requestTransition("stage",{stageNumber:e,totalScore:0,totalStarCount:0,launchSource:"encyclopedia"})},t.bestStageStars??{},t.discoveredConstellations??[],t.colorAccessibility?.colorVisionSupportMode??$,t.discoveredMonthlyEncounters??[])}isCurrentEncyclopediaRequest(t){return this.isActive&&this.encyclopediaRequestToken===t}prefetchEncyclopediaOnIdle(){const t=this.encyclopediaRequestToken;this.scheduleIdleTask(()=>{!this.isCurrentEncyclopediaRequest(t)||this.encyclopediaOverlay||this.encyclopediaOverlayPromise||this.getEncyclopediaOverlay().catch(()=>{})})}prewarmNextAdventureOnIdle(t){if(t>z)return;const e=this.encyclopediaRequestToken;this.scheduleIdleTask(()=>{this.isCurrentEncyclopediaRequest(e)&&zt(t)})}async openEncyclopedia(){if(!this.isActive)return;if(this.loadFailureOverlay.hide(),this.encyclopediaOverlay){this.showEncyclopedia();return}if(this.isOpeningEncyclopedia)return;const t=this.encyclopediaRequestToken;this.isOpeningEncyclopedia=!0,this.loadingOverlay.show("ずかんを よんでるよ...");try{if(await this.getEncyclopediaOverlay(),!this.isCurrentEncyclopediaRequest(t))return;this.loadingOverlay.hide(),this.showEncyclopedia()}catch(e){if(!this.isCurrentEncyclopediaRequest(t))return;this.loadingOverlay.hide(),console.error("Failed to load encyclopedia overlay",e),this.loadFailureOverlay.show({title:"ずかんを もういちど よんでみよう！",message:"「もういちど よむ」を おして つづきを たのしもう！",primaryAction:{label:"もういちど よむ",onSelect:()=>this.openEncyclopedia()}})}finally{this.encyclopediaRequestToken===t&&(this.isOpeningEncyclopedia=!1)}}persistHighContrastSetting(t){const e=this.saveManager.load(),i=e.colorAccessibility?.motionSensitivity??Y(),s=e.colorAccessibility?.colorVisionSupportMode??$;e.colorAccessibility=this.buildColorAccessibilitySettings(t,i,s),e.colorAccessibility||delete e.colorAccessibility,this.saveManager.save(e)}persistVibrationIntensitySetting(t){const e=this.saveManager.load();e.vibrationSettings={intensity:t},this.saveManager.save(e),Kt(t)}persistRestReminderSetting(t){const e=this.saveManager.load();e.restReminderSettings={enabled:t},this.saveManager.save(e)}persistLanguageSetting(t){const e=this.saveManager.load();t===ht?delete e.language:e.language=t,this.saveManager.save(e)}persistBGMVolumeSetting(t){const e=this.saveManager.load();e.audioSettings=this.buildAudioSettings(t,e.audioSettings?.sfxVolume??100),e.audioSettings||delete e.audioSettings,this.saveManager.save(e),this.audioManager.setBGMVolume(t)}persistSFXVolumeSetting(t){const e=this.saveManager.load();e.audioSettings=this.buildAudioSettings(e.audioSettings?.bgmVolume??100,t),e.audioSettings||delete e.audioSettings,this.saveManager.save(e),this.audioManager.setSFXVolume(t)}persistMotionSensitivitySetting(t){const e=this.saveManager.load(),i=e.colorAccessibility?.highContrast===!0,s=e.colorAccessibility?.colorVisionSupportMode??$;e.colorAccessibility=this.buildColorAccessibilitySettings(i,t,s),e.colorAccessibility||delete e.colorAccessibility,this.saveManager.save(e)}persistColorVisionSupportModeSetting(t){const e=this.saveManager.load(),i=e.colorAccessibility?.highContrast===!0,s=e.colorAccessibility?.motionSensitivity??Y();e.colorAccessibility=this.buildColorAccessibilitySettings(i,s,t),e.colorAccessibility||delete e.colorAccessibility,this.saveManager.save(e)}buildColorAccessibilitySettings(t,e,i){const s=Y();if(!(!t&&e===s&&i===$))return{...t?{highContrast:!0}:{},...e!==s?{motionSensitivity:e}:{},...i!==$?{colorVisionSupportMode:i}:{}}}buildAudioSettings(t,e){if(!(t===100&&e===100))return{...t!==100?{bgmVolume:t}:{},...e!==100?{sfxVolume:e}:{}}}createOverlay(){const t=document.getElementById("ui-overlay");if(!t)return;const e=this.saveManager.load(),i=wt(e),s=xi(e);this.overlay=document.createElement("div"),this.unsubscribeLanguageChange?.(),this.unsubscribeLanguageChange=C.subscribe(()=>this.applyLocalizedText()),this.overlay.style.cssText=`
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
    `;const o=document.createElement("div");o.setAttribute("data-next-adventure-card",""),o.setAttribute("data-next-stage-number",String(i.startStage)),o.setAttribute("data-next-stage-destination",i.destination),o.style.cssText=`
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
    `;const d=document.createElement("div");d.textContent=i.statusLabel,d.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${n?"1rem":"1.25rem"};
      font-weight: 900;
      margin-bottom: ${n?"0.15rem":"0.35rem"};
    `;const m=document.createElement("div");m.textContent=`${i.emoji} ステージ ${i.startStage} ・ ${i.destination}`,m.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${n?"1.05rem":"1.35rem"};
      font-weight: 700;
      margin-bottom: 0.25rem;
    `;const f=document.createElement("div");f.textContent=i.destinationLabel,f.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${n?"0.85rem":"1rem"};
      font-weight: 700;
      color: rgba(255, 255, 255, 0.92);
    `;const b=Qt(i.startStage,i.bestStars),g=Pt(i.startStage,i.bestStars,{label:"メダル",hint:b.nextThreshold===null?"かんぺき！":`${b.icon} いま ・ つぎ ⭐ ${b.nextThreshold}`,size:"regular",scope:"title-next-adventure"});g.style.marginTop=n?"0.35rem":"0.55rem",o.appendChild(h),o.appendChild(d),o.appendChild(m),o.appendChild(f),o.appendChild(g);const r=document.createElement("div");r.style.cssText=`
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: ${n?"0.42rem":"0.55rem"};
      width: min(94vw, ${s?"44rem":"34rem"});
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
    `,this.overlayButtonCleanups.add(P(u,{onActivate:()=>{this.ensureTitleAudioInitialized(!1);const c=this.saveManager.load(),E=wt(c).startStage;this.sceneManager.requestTransition("stage",{stageNumber:E,totalScore:0,totalStarCount:0,launchSource:"campaign"})},onPressChange:c=>{u.style.transform=c?"scale(0.96)":"scale(1)"}}));const w=document.createElement("div");w.setAttribute("data-play-button-hint",""),w.textContent=i.buttonHint,w.style.cssText=`
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
    `,this.overlayButtonCleanups.add(P(y,{onActivate:()=>{this.ensureTitleAudioInitialized(!1),this.sceneManager.requestTransition("freePlay",{})},onPressChange:c=>{y.style.transform=c?"scale(0.96)":"scale(1)"}}));const p=document.createElement("div");p.setAttribute("data-title-secondary-actions",""),p.style.cssText=`
      display: grid;
      grid-template-columns: repeat(${s?3:2}, minmax(0, 1fr));
      gap: ${n?"0.45rem":"0.55rem"};
      width: 100%;
      align-items: stretch;
    `;const T=document.createElement("button");T.setAttribute("data-spaceship-customizer-button",""),T.textContent="うちゅうせんをかざろう",T.style.cssText=`
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
    `,this.overlayButtonCleanups.add(P(T,{onActivate:()=>{const c=this.saveManager.load();this.spaceshipCustomizer.show({initialCustomization:c.spaceshipCustomization??Bt,onComplete:E=>{const B=this.saveManager.load();B.spaceshipCustomization=E,this.saveManager.save(B)}})},onPressChange:c=>{T.style.transform=c?"scale(0.96)":"scale(1)"}}));const A=document.createElement("button");A.setAttribute("data-stats-button",""),A.textContent="あそびの きろく",A.style.cssText=`
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
    `,this.overlayButtonCleanups.add(P(A,{onActivate:()=>{this.ensureTitleAudioInitialized(!0),this.statsOverlay.show(this.saveManager.load().gameplayStats,()=>{})},onPressChange:c=>{A.style.transform=c?"scale(0.96)":"scale(1)"}}));const R=document.createElement("div");R.setAttribute("data-title-footer-actions",""),R.style.cssText=`
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: ${n?"0.45rem":"0.65rem"};
      width: min(94vw, 42rem);
      margin-top: ${n?"0.5rem":"0.8rem"};
      align-items: stretch;
    `;const M=document.createElement("button");M.textContent="あそびかた",M.style.cssText=`
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
    `,this.overlayButtonCleanups.add(P(M,{onActivate:()=>{this.ensureTitleAudioInitialized(!0),this.tutorialOverlay.show(()=>{this.ensureTitleAudioInitialized(!0),this.tutorialOverlay.hide()})},onPressChange:c=>{M.style.transform=c?"scale(0.96)":"scale(1)"}}));const S=document.createElement("button");S.setAttribute("data-color-settings-button",""),S.textContent=C.t("titleScene.colorSettingsButton"),this.colorSettingsButton=S,S.style.cssText=`
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
    `,this.overlayButtonCleanups.add(P(S,{onActivate:()=>{this.ensureTitleAudioInitialized(!0),this.colorAccessibilitySettings.show({initialHighContrast:this.saveManager.load().colorAccessibility?.highContrast===!0,initialColorVisionSupportMode:this.saveManager.load().colorAccessibility?.colorVisionSupportMode??$,initialBGMVolume:this.saveManager.load().audioSettings?.bgmVolume??100,initialSFXVolume:this.saveManager.load().audioSettings?.sfxVolume??100,initialVibrationIntensity:this.saveManager.load().vibrationSettings?.intensity??"medium",initialMotionSensitivity:this.saveManager.load().colorAccessibility?.motionSensitivity??Y(),initialRestReminderEnabled:this.saveManager.load().restReminderSettings?.enabled??pe,initialLanguage:this.saveManager.load().language??ht,onToggle:c=>this.persistHighContrastSetting(c),onColorVisionSupportModeChange:c=>this.persistColorVisionSupportModeSetting(c),onBGMVolumeChange:c=>this.persistBGMVolumeSetting(c),onSFXVolumeChange:c=>this.persistSFXVolumeSetting(c),onVibrationIntensityChange:c=>this.persistVibrationIntensitySetting(c),onMotionSensitivityChange:c=>this.persistMotionSensitivitySetting(c),onRestReminderToggle:c=>this.persistRestReminderSetting(c),onLanguageChange:c=>this.persistLanguageSetting(c)})},onPressChange:c=>{S.style.transform=c?"scale(0.96)":"scale(1)"}}));const x=document.createElement("button");if(x.textContent=Zt(e.unlockedPlanets.length,J.length),x.style.cssText=`
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
    `,this.encyclopediaBtn=x,this.overlayButtonCleanups.add(P(x,{onActivate:()=>{this.ensureTitleAudioInitialized(!0),this.openEncyclopedia()},onPressChange:c=>{x.style.transform=c?"scale(0.96)":"scale(1)"}})),r.appendChild(u),r.appendChild(y),r.appendChild(w),p.appendChild(T),p.appendChild(A),s){const c=document.createElement("button");c.setAttribute("data-reset-progress-button",""),c.textContent="さいしょから",c.style.cssText=`
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
      `,c.addEventListener("pointerdown",E=>{E.stopPropagation(),this.ensureTitleAudioInitialized(!0),this.titleResetConfirmOverlay.show(()=>{this.saveManager.resetProgressPreservingSettings(),this.startCampaign(1)},()=>{})}),p.appendChild(c)}r.appendChild(p),R.append(x,S,M),this.overlay.appendChild(a),this.overlay.appendChild(o),this.overlay.appendChild(r),this.overlay.appendChild(R),t.appendChild(this.overlay),this.overlay.addEventListener("pointerdown",()=>{this.ensureTitleAudioInitialized(!0)},{once:!0})}applyLocalizedText(){this.colorSettingsButton&&(this.colorSettingsButton.textContent=C.t("titleScene.colorSettingsButton"))}ensureTitleAudioInitialized(t){!this.bgmPending&&this.audioManager.isInitialized()||(this.audioManager.initSync(),t&&this.bgmPending&&this.audioManager.playBGM(0),this.bgmPending=!1)}startCampaign(t){this.sceneManager.requestTransition("stage",{stageNumber:t,totalScore:0,totalStarCount:0,launchSource:"campaign"})}refreshEncyclopediaButtonLabel(){if(!this.encyclopediaBtn)return;const t=this.saveManager.load();this.encyclopediaBtn.textContent=Zt(t.unlockedPlanets.length,J.length)}async createCompanionParade(t){this.clearCompanionParade();const e=[...new Set(t)].reduce((h,d)=>{const m=ct(d);return m&&h.push(m),h},[]);if(e.length===0)return;const i=this.encyclopediaRequestToken,{createCompanionMesh:s}=await this.getTitleCompanionFactory();if(!this.isActive||this.encyclopediaRequestToken!==i)return;const n=new ut;n.name="title-companion-parade",n.position.set(0,1.35,-1.2),n.rotation.x=-.12;const a=Math.min(2.1,1.1+e.length*.18),o=Math.min(.45,.18+e.length*.02);e.forEach((h,d)=>{const m=s(h),f=d/e.length*Math.PI*2;m.position.set(Math.cos(f)*a,Math.sin(f)*o,Math.sin(f)*a*.45),m.rotation.y=Math.PI*.15-f,m.scale.setScalar(.6),n.add(m)}),this.companionParade=n,this.threeScene.add(n)}clearCompanionParade(){this.companionParade&&(this.companionParade.parent?.remove(this.companionParade),this.companionParade=null)}update(t){this.stars&&(this.stars.rotation.y+=t*.05),this.companionParade&&(this.companionParade.rotation.y+=t*.35)}exit(){this.isActive=!1,this.encyclopediaRequestToken+=1,this.companionParadeRequestToken+=1,this.isOpeningEncyclopedia=!1,this.tutorialOverlay.hide(),this.titleResetConfirmOverlay.hide(),this.colorAccessibilitySettings.hide(),this.spaceshipCustomizer.hide(),this.statsOverlay.hide(),this.encyclopediaOverlay?.hide(),this.loadingOverlay.hide(),this.loadFailureOverlay.hide(),this.audioManager.stopBGM(),this.bgmPending=!1,this.clearCompanionParade(),this.stars&&(this.stars.parent?.remove(this.stars),this.stars=null),this.clearCompanionParade();const t=Array.from(this.overlayButtonCleanups);this.overlayButtonCleanups.clear();for(const e of t)e();this.overlay&&(this.overlay.remove(),this.overlay=null),this.encyclopediaBtn=null,this.colorSettingsButton=null,this.unsubscribeLanguageChange?.(),this.unsubscribeLanguageChange=null,this.muteHandle&&(this.muteHandle.remove(),this.muteHandle=null)}getThreeScene(){return this.threeScene}getCamera(){const{width:t,height:e}=H(),i=t/e;return i!==this.lastAspect&&Number.isFinite(i)&&i>0&&(this.camera.aspect=i,this.camera.updateProjectionMatrix(),this.lastAspect=i),this.camera}}const Wi=Object.freeze(Object.defineProperty({__proto__:null,TitleScene:Ci,__resetTitleSceneSharedAssetsForTest:bi,__titleSceneSharedAssetsForTest:vi},Symbol.toStringTag,{value:"Module"}));class wi{overlayEl=null;activePressCleanups=new Set;show(t,e){if(this.overlayEl)return;const i=document.getElementById("ui-overlay");if(!i)return;this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-home-confirm-overlay",""),this.overlayEl.setAttribute("role","dialog"),this.overlayEl.setAttribute("aria-modal","true"),this.overlayEl.setAttribute("aria-label","ホームへ もどりますか"),this.overlayEl.style.cssText=`
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
    `,this.overlayEl.style.background="rgba(0, 0, 32, 0.92)";let s=!1;const n=()=>{s||(s=!0,this.hide(),e())},a=()=>{s||(s=!0,this.hide(),t())};this.overlayEl.addEventListener("pointerdown",r=>{r.target===this.overlayEl&&n()});const o=document.createElement("div");o.setAttribute("data-home-confirm-card",""),o.style.cssText=`
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
    `,h.style.fontFamily="'Zen Maru Gothic', sans-serif",h.style.color="#FFD700",o.appendChild(h);const d=document.createElement("div");d.style.cssText=`
      display: flex;
      flex-direction: row;
      gap: 1rem;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
    `,o.appendChild(d);const m=`
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
    `,f=(r,u)=>{const w=P(r,{onActivate:u,onPressChange:y=>{r.style.transform=y?"scale(0.9)":"scale(1)"}});this.activePressCleanups.add(w)},b=document.createElement("button");b.setAttribute("data-home-confirm-back",""),b.setAttribute("aria-label","タイトルへ もどる"),b.textContent="🏠 タイトルへ もどる",b.style.cssText=m,b.style.fontFamily="'Zen Maru Gothic', sans-serif",b.style.background="rgba(255, 255, 255, 0.18)",b.style.color="#ffffff",b.style.minWidth="88px",b.style.minHeight="88px",b.style.touchAction="manipulation",b.style.transform="scale(1)",b.style.transition="transform 0.08s ease-out",b.style.whiteSpace="nowrap",f(b,a),d.appendChild(b);const g=document.createElement("button");g.setAttribute("data-home-confirm-continue",""),g.setAttribute("aria-label","つづける"),g.textContent="✋ つづける",g.style.cssText=m,g.style.fontFamily="'Zen Maru Gothic', sans-serif",g.style.background="linear-gradient(135deg, #FF6B6B, #FFE66D)",g.style.color="#FFD700",g.style.textShadow="0 1px 2px rgba(0, 0, 32, 0.6)",g.style.minWidth="88px",g.style.minHeight="88px",g.style.touchAction="manipulation",g.style.transform="scale(1)",g.style.transition="transform 0.08s ease-out",g.style.whiteSpace="nowrap",f(g,n),d.appendChild(g),i.appendChild(this.overlayEl)}hide(){if(this.overlayEl){const t=Array.from(this.activePressCleanups);this.activePressCleanups.clear();for(const e of t)e();this.overlayEl.remove(),this.overlayEl=null}}isVisible(){return this.overlayEl!==null}}class ce{overlayEl=null;activePressCleanups=new Set;show(t,e){if(this.overlayEl)return;const i=document.getElementById("ui-overlay")??document.body;this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-pause-overlay",""),this.overlayEl.setAttribute("role","dialog"),this.overlayEl.setAttribute("aria-modal","true"),this.overlayEl.setAttribute("aria-label","やすみちゅう"),this.overlayEl.style.cssText=`
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
    `,s.addEventListener("pointerdown",d=>{d.stopPropagation()}),this.overlayEl.appendChild(s);const n=document.createElement("div");n.textContent="ひとやすみ ちゅう",n.style.cssText=`
      font-size: clamp(1.8rem, 5vmin, 2.4rem);
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
    `,s.appendChild(n);const a=document.createElement("div");a.textContent="また じゅんびが できたら つづけよう",a.style.cssText=`
      font-size: clamp(1rem, 3.5vmin, 1.2rem);
      font-weight: 700;
      color: #ffffff;
      opacity: 0.92;
    `,s.appendChild(a);const o=document.createElement("div");o.style.cssText=`
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      justify-content: center;
      align-items: stretch;
      width: 100%;
    `,s.appendChild(o);const h=(d,m,f,b,g,r)=>{const u=document.createElement("button");u.setAttribute(m,""),u.setAttribute("aria-label",f),u.textContent=d,u.style.cssText=`
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
      `,u.style.minWidth="140px",u.style.minHeight="88px";const w=P(u,{onActivate:()=>{this.hide(),r()},onPressChange:y=>{u.style.transform=y?"scale(0.94)":"scale(1)"}});return this.activePressCleanups.add(w),u};o.appendChild(h("▶ つづける","data-pause-continue","つづける","linear-gradient(135deg, #FF6B6B, #FFE66D)","#1b1f52",t)),o.appendChild(h("🏠 おうちへ","data-pause-home","おうちへ","rgba(255, 255, 255, 0.18)","#ffffff",e)),i.appendChild(this.overlayEl)}hide(){if(!this.overlayEl)return;const t=Array.from(this.activePressCleanups);this.activePressCleanups.clear();for(const e of t)e();this.overlayEl.remove(),this.overlayEl=null}dispose(){this.hide()}isVisible(){return this.overlayEl!==null}}function de(l){const t=l>=500;return{worldText:`${t?"🌈":"⬢"} +${l}`,hudText:`+${l}`,kind:t?"bonus":"normal",color:t?"#ff9cf7":"#ffe066",shadow:t?"rgba(255, 156, 247, 0.55)":"rgba(255, 214, 102, 0.55)"}}class U{static STYLE_ID="score-popup-animations";static POOL_SIZE=6;static POPUP_LIFETIME_MS=720;root=null;pool=[];highContrastMode=!1;nextRecycleIndex=0;scratch=new X;setHighContrastMode(t){this.highContrastMode=t}show(t,e,i){const s=de(t);this.showPopup({text:s.worldText,kind:s.kind,color:s.color,shadow:s.shadow},e,i)}showLabel(t,e,i,s="normal"){const n=s==="shooting-star"||s==="special-star"||s==="monthly-encounter"?{text:t,kind:s,color:"rgb(255, 244, 179)",shadow:"rgba(191, 231, 255, 0.75)"}:{text:t,kind:s,color:"#ffe066",shadow:"rgba(255, 214, 102, 0.55)"};this.showPopup(n,e,i)}showPopup(t,e,i){const s=this.ensureRoot();if(!s||(this.scratch.set(e.x,e.y,e.z).project(i),!Number.isFinite(this.scratch.x)||!Number.isFinite(this.scratch.y)||!Number.isFinite(this.scratch.z)))return;const n=Math.round((this.scratch.x*.5+.5)*1e5)/1e3,a=Math.round((-this.scratch.y*.5+.5)*1e5)/1e3,o=this.acquireEntry(s),h=o.useAltAnimation?"scorePopupFloatB":"scorePopupFloatA";o.useAltAnimation=!o.useAltAnimation,o.currentAnimationName=h,o.el.textContent=t.text,o.el.style.left=`${n}%`,o.el.style.top=`${a}%`,o.el.style.color=t.color,o.el.style.textShadow=`0 2px 10px ${t.shadow}`,o.el.style.background=this.highContrastMode?t.kind==="bonus"||t.kind==="shooting-star"||t.kind==="special-star"||t.kind==="monthly-encounter"?"rgba(13, 18, 38, 0.92)":"rgba(0, 0, 0, 0.82)":"transparent",o.el.style.border=this.highContrastMode?t.kind==="bonus"||t.kind==="shooting-star"||t.kind==="special-star"||t.kind==="monthly-encounter"?"3px solid rgba(255, 255, 255, 0.95)":"2px dashed rgba(255, 255, 255, 0.95)":"none",o.el.style.borderRadius=this.highContrastMode?"999px":"0",o.el.style.padding=this.highContrastMode?"0.18rem 0.55rem":"0",o.el.style.setProperty("-webkit-text-stroke",this.highContrastMode?"0.6px #061126":"0"),o.el.setAttribute("data-score-popup-kind",t.kind),o.el.style.visibility="visible",o.el.style.opacity="1",o.el.style.animationName=h,o.el.removeAttribute("data-score-popup-active"),o.el.setAttribute("data-score-popup-active",""),o.active=!0;const d=()=>{this.releaseEntry(o)};o.onAnimationEnd=m=>{m.animationName===o.currentAnimationName&&d()},o.el.addEventListener("animationend",o.onAnimationEnd),o.timeoutId=window.setTimeout(d,U.POPUP_LIFETIME_MS)}dispose(){for(const t of this.pool)this.clearEntry(t),t.el.remove();this.pool=[],this.root?.remove(),this.root=null,this.nextRecycleIndex=0}ensureRoot(){const t=document.getElementById("ui-overlay");return t?(this.root&&(this.root.parentElement!==t||!this.root.isConnected)&&this.dispose(),this.root?this.root:(this.injectStyles(),this.root=document.createElement("div"),this.root.setAttribute("data-score-popup-root",""),this.root.style.position="absolute",this.root.style.inset="0",this.root.style.overflow="hidden",this.root.style.pointerEvents="none",this.root.style.contain="layout style paint",t.appendChild(this.root),this.root)):null}acquireEntry(t){if(this.pool.length<U.POOL_SIZE){const i=this.createEntry();return this.pool.push(i),t.appendChild(i.el),i}const e=this.pool.find(i=>!i.active)??this.pool[this.nextRecycleIndex++%this.pool.length];return this.clearEntry(e),e}createEntry(){const t=document.createElement("div");return t.setAttribute("data-score-popup",""),t.style.position="absolute",t.style.transform="translate3d(-50%, -50%, 0)",t.style.fontFamily="'Zen Maru Gothic', sans-serif",t.style.fontSize="clamp(1rem, 3.5vmin, 1.4rem)",t.style.fontWeight="900",t.style.lineHeight="1",t.style.whiteSpace="nowrap",t.style.pointerEvents="none",t.style.willChange="transform, opacity",t.style.visibility="hidden",t.style.opacity="0",t.style.animationDuration=`${U.POPUP_LIFETIME_MS}ms`,t.style.animationTimingFunction="ease-out",t.style.animationIterationCount="1",{el:t,active:!1,timeoutId:null,onAnimationEnd:null,useAltAnimation:!1,currentAnimationName:"none"}}releaseEntry(t){this.clearEntry(t),t.el.style.visibility="hidden",t.el.style.opacity="0"}clearEntry(t){t.active=!1,t.currentAnimationName="none",t.el.removeAttribute("data-score-popup-active"),t.el.removeAttribute("data-score-popup-kind"),t.el.style.animationName="none",t.timeoutId!==null&&(window.clearTimeout(t.timeoutId),t.timeoutId=null),t.onAnimationEnd&&(t.el.removeEventListener("animationend",t.onAnimationEnd),t.onAnimationEnd=null)}injectStyles(){if(document.getElementById(U.STYLE_ID))return;const t=document.createElement("style");t.id=U.STYLE_ID,t.textContent=`
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
    `,document.head.appendChild(t)}}class Ai{pendingTimeouts=new Set;container=null;stageNameEl=null;assistMessageEl=null;politeLiveRegionEl=null;assertiveLiveRegionEl=null;scoreEl=null;scoreGainEl=null;starCountEl=null;bestStarContainerEl=null;bestStarCountEl=null;boostButton=null;boostHintEl=null;homeButton=null;pauseButton=null;homeConfirmOverlay=new wi;pauseOverlay=new ce;muteButton=null;muteHandle=null;cooldownContainer=null;cooldownBar=null;stageProgressContainer=null;stageProgressTrack=null;stageProgressFill=null;stageProgressGoalEl=null;onBoostCallback=null;onBoostDeniedCallback=null;onHomeCallback=null;onHomeConfirmOpenCallback=null;onHomeConfirmCancelCallback=null;onPauseCallback=null;onPauseOpenCallback=null;onPauseResumeCallback=null;onMuteCallback=null;muted=!1;highContrastMode=!1;boostLocked=!1;pauseEnabled=!0;pauseButtonCleanup=null;lastCooldownProgress=1;lastCooldownPct=-1;lastReadyState=null;lastCooldownBarBoxShadow=null;lastBoostButtonAriaDisabled=null;lastBoostReadyRingVisible=null;boostButtonStyleCache={opacity:null,filter:null,animation:null,transform:null};lastPauseButtonAriaDisabled=null;pauseButtonStyleCache={opacity:null,filter:null,cursor:null,transform:null};lastStageProgressPct=-1;lastStageProgressComplete=null;lastScore=-1;lastStarCount=-1;displayedScore=0;scoreAnimationToken=0;scoreGainUseAltAnimation=!1;scoreGainAnimationEndHandler=null;bestStarCount=0;lastBestStarCount=-1;bestStarPulsed=!1;liveRegionWriteNonce=0;lastAnnouncedProgressThreshold=0;show(t,e){const i=document.getElementById("hud");if(!i)return;i.style.zIndex="10";const s=window.innerHeight<=500;this.homeButton=document.createElement("button"),this.homeButton.textContent="🏠",this.homeButton.setAttribute("aria-label","ホームへ もどる"),this.homeButton.style.position="absolute",this.homeButton.style.top="0.8rem",this.homeButton.style.left="1rem",this.homeButton.style.fontSize=s?"clamp(1.1rem, 3.5vmin, 1.4rem)":"clamp(1.4rem, 4vmin, 1.8rem)",this.homeButton.style.background="rgba(255, 255, 255, 0.15)",this.homeButton.style.border="none",this.homeButton.style.borderRadius="50%",this.homeButton.style.width=s?"2.4rem":"3rem",this.homeButton.style.height=s?"2.4rem":"3rem",this.homeButton.style.display="flex",this.homeButton.style.alignItems="center",this.homeButton.style.justifyContent="center",this.homeButton.style.cursor="pointer",this.homeButton.style.pointerEvents="auto",this.homeButton.style.touchAction="manipulation",this.homeButton.style.transform="scale(1)",this.homeButton.style.transition="transform 0.08s ease-out";const n=()=>{this.homeButton&&(this.homeButton.style.transform="scale(1)")};this.homeButton.addEventListener("pointerdown",h=>{h.stopPropagation(),this.homeButton&&(this.homeButton.style.transform="scale(0.9)"),!this.homeConfirmOverlay.isVisible()&&document.getElementById("ui-overlay")&&(this.onHomeConfirmOpenCallback?.(),this.homeConfirmOverlay.show(()=>this.onHomeCallback?.(),()=>this.onHomeConfirmCancelCallback?.()))}),this.homeButton.addEventListener("pointerup",n),this.homeButton.addEventListener("pointercancel",n),this.homeButton.addEventListener("pointerleave",n),i.appendChild(this.homeButton),t&&(this.stageNameEl=document.createElement("div"),this.stageNameEl.textContent=t,this.stageNameEl.style.cssText=`
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
    `,this.bestStarContainerEl.textContent="ベスト ⭐",this.bestStarCountEl=document.createElement("span"),this.bestStarCountEl.textContent="0",this.bestStarContainerEl.appendChild(this.bestStarCountEl),o.appendChild(this.bestStarContainerEl),this.container.appendChild(a),this.container.appendChild(o),i.appendChild(this.container),this.createBoostButton(),this.createMuteButton(),this.applyColorAccessibilityState(),this.createLiveRegions(i)}createStageProgress(t,e){const i=this.toCssColor(e??16766720),s=document.createElement("div");s.setAttribute("data-stage-progress-container",""),s.setAttribute("role","progressbar"),s.setAttribute("aria-label","ゴールまでの すすみ"),s.setAttribute("aria-valuemin","0"),s.setAttribute("aria-valuemax","100"),s.setAttribute("aria-valuenow","0"),s.setAttribute("aria-valuetext","ゴールまで あと 100%"),s.style.position="relative",s.style.display="flex",s.style.alignItems="center",s.style.justifyContent="center",s.style.gap="0.4rem",s.style.margin="0 auto 0.4rem",s.style.width=window.innerHeight<=500?"clamp(100px, 24vmin, 180px)":"clamp(160px, 32vmin, 280px)",s.style.pointerEvents="none",s.style.fontFamily="'Zen Maru Gothic', sans-serif";const n=document.createElement("div");n.setAttribute("data-stage-progress-ship",""),n.textContent="🚀",n.style.fontSize="clamp(0.9rem, 2.4vmin, 1.1rem)",n.style.lineHeight="1",n.style.pointerEvents="none";const a=document.createElement("div");a.setAttribute("data-stage-progress-track",""),a.style.flex="1",a.style.height="14px",a.style.background=this.highContrastMode?"rgba(6, 12, 28, 0.94)":"rgba(255, 255, 255, 0.18)",a.style.borderRadius="7px",a.style.overflow="hidden",a.style.boxShadow="inset 0 2px 6px rgba(0, 0, 0, 0.35)",a.style.border=this.highContrastMode?"3px solid rgba(255, 255, 255, 0.92)":"none";const o=document.createElement("div");o.setAttribute("data-stage-progress-fill",""),o.style.height="100%",o.style.width="0%",o.style.borderRadius="7px",o.style.background=this.highContrastMode?`repeating-linear-gradient(90deg, #ffffff 0 10px, #00ddff 10px 18px, ${i} 18px 30px)`:`linear-gradient(90deg, #00ddff, ${i})`,o.style.transition="width 0.15s linear",o.setAttribute("data-stage-progress-color",i),a.appendChild(o);const h=document.createElement("div");h.setAttribute("data-stage-progress-goal",""),h.textContent="🪐",h.style.fontSize="clamp(0.9rem, 2.4vmin, 1.1rem)",h.style.lineHeight="1",h.style.pointerEvents="none",h.style.textShadow=`0 0 8px ${i}`,s.appendChild(n),s.appendChild(a),s.appendChild(h),t.appendChild(s),this.stageProgressContainer=s,this.stageProgressTrack=a,this.stageProgressFill=o,this.stageProgressGoalEl=h}toCssColor(t){return`#${Math.max(0,Math.min(16777215,Math.floor(t))).toString(16).padStart(6,"0")}`}createMuteButton(){const t=document.getElementById("hud");t&&(this.muteHandle=Gt({initialMuted:this.muted,container:t,onToggle:()=>this.onMuteCallback?.()}),this.muteButton=this.muteHandle.element)}createPauseButton(){const t=document.getElementById("hud");if(!t)return;const e=window.innerHeight<=500;this.pauseButton=document.createElement("button"),this.pauseButton.textContent="✋ やすむ",this.pauseButton.setAttribute("aria-label","やすむ"),this.pauseButton.style.position="absolute",this.pauseButton.style.top="0.8rem",this.pauseButton.style.left=e?"4rem":"4.7rem",this.pauseButton.style.fontFamily="'Zen Maru Gothic', sans-serif",this.pauseButton.style.fontSize=e?"clamp(0.9rem, 3.2vmin, 1rem)":"clamp(1rem, 3.5vmin, 1.15rem)",this.pauseButton.style.fontWeight="900",this.pauseButton.style.padding=e?"0.45rem 0.9rem":"0.7rem 1.2rem",this.pauseButton.style.border="none",this.pauseButton.style.borderRadius="999px",this.pauseButton.style.background="rgba(255, 255, 255, 0.16)",this.pauseButton.style.color="#fff",this.pauseButton.style.cursor="pointer",this.pauseButton.style.pointerEvents="auto",this.pauseButton.style.touchAction="manipulation",this.pauseButton.style.boxShadow="0 4px 14px rgba(0, 0, 0, 0.2)",this.pauseButton.style.transform="scale(1)",this.pauseButton.style.transition="transform 0.08s ease-out, opacity 0.12s ease-out",this.pauseButton.style.minHeight=e?"2.4rem":"3rem",this.pauseButton.style.minWidth=e?"5.6rem":"7rem",this.pauseButtonCleanup=P(this.pauseButton,{onActivate:()=>this.onPauseCallback?.(),canActivate:()=>this.pauseEnabled,onPressChange:i=>{this.writePauseButtonStyle("transform",i?"scale(0.95)":"scale(1)")}}),t.appendChild(this.pauseButton),this.applyPauseButtonState()}createBoostButton(){const t=document.getElementById("ui-overlay");if(!t)return;this.injectBoostAnimations(),this.boostButton=document.createElement("button"),this.boostButton.textContent="🚀 ブースト!",this.boostButton.setAttribute("aria-label","ブースト"),this.boostButton.setAttribute("aria-disabled","false");const e=window.innerHeight<=500;this.boostButton.style.position="absolute",this.boostButton.style.bottom=e?"1rem":"2rem",this.boostButton.style.right=e?"1rem":"2rem",this.boostButton.style.fontFamily="'Zen Maru Gothic', sans-serif",this.boostButton.style.fontSize=e?"clamp(0.85rem, 2.8vmin, 1.05rem)":"clamp(1rem, 3.5vmin, 1.3rem)",this.boostButton.style.fontWeight="700",this.boostButton.style.padding=e?"0.5rem 1rem":"0.8rem 1.5rem",this.boostButton.style.border="none",this.boostButton.style.borderRadius="2rem",this.boostButton.style.background="linear-gradient(135deg, #FF6B6B, #FFD93D, #6BCB77)",this.boostButton.style.color="#fff",this.boostButton.style.cursor="pointer",this.boostButton.style.touchAction="manipulation",this.boostButton.style.pointerEvents="auto",this.boostButton.style.boxShadow="0 4px 15px rgba(255, 107, 107, 0.4)",this.boostButton.style.animation="boostBtnPulse 2s ease-in-out infinite",this.boostButton.addEventListener("pointerdown",i=>{i.stopPropagation();const s=this.boostButton;if(s&&!this.boostLocked){if(this.lastCooldownProgress<1){if(s.hasAttribute("data-boost-shake"))return;s.setAttribute("data-boost-shake",""),this.registerTimeout(()=>{s.removeAttribute("data-boost-shake")},250),this.onBoostDeniedCallback?.();return}this.writeBoostButtonStyle("transform","scale(0.9)"),this.registerTimeout(()=>{this.writeBoostButtonStyle("transform","scale(1.0)")},150),this.onBoostCallback?.()}}),t.appendChild(this.boostButton),this.boostHintEl=document.createElement("div"),this.boostHintEl.setAttribute("data-boost-hint",""),this.boostHintEl.setAttribute("aria-hidden","true"),this.boostHintEl.style.cssText=`
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
    `,document.head.appendChild(t)}setBoostCallback(t){this.onBoostCallback=t}setBoostDeniedCallback(t){this.onBoostDeniedCallback=t}setBoostLocked(t){this.boostLocked=t,this.applyBoostButtonState()}setHomeCallback(t){this.onHomeCallback=t}setHomeConfirmOpenCallback(t){this.onHomeConfirmOpenCallback=t}setHomeConfirmCancelCallback(t){this.onHomeConfirmCancelCallback=t}setPauseCallback(t){this.onPauseCallback=t}setPauseEnabled(t){this.pauseEnabled=t,this.applyPauseButtonState()}setMuteCallback(t){this.onMuteCallback=t}setPauseOpenCallback(t){this.onPauseOpenCallback=t}setPauseResumeCallback(t){this.onPauseResumeCallback=t}setMuteState(t){this.muted=t,this.muteHandle?.setMuted(t)}setHighContrastMode(t){this.highContrastMode=t,this.applyColorAccessibilityState()}applyColorAccessibilityState(){if(this.stageNameEl&&(this.stageNameEl.style.color=this.highContrastMode?"#fff58f":"#FFD700",this.stageNameEl.style.textShadow=this.highContrastMode?"0 0 0 #000, 0 2px 8px rgba(0, 0, 0, 0.9), 0 0 20px rgba(255, 255, 255, 0.25)":"0 2px 8px rgba(0, 0, 0, 0.7)"),this.assistMessageEl&&(this.assistMessageEl.style.background=this.highContrastMode?"rgba(5, 10, 28, 0.96)":"rgba(255, 255, 255, 0.14)",this.assistMessageEl.style.border=this.highContrastMode?"3px solid rgba(255, 255, 255, 0.95)":"none",this.assistMessageEl.style.color=this.highContrastMode?"#ffffff":"#fff7bf"),this.bestStarContainerEl&&(this.bestStarContainerEl.style.color=this.highContrastMode?"#e6f4ff":"#9ec5ff",this.bestStarContainerEl.style.opacity=this.highContrastMode?"1":"0.7"),this.stageProgressTrack&&(this.stageProgressTrack.style.background=this.highContrastMode?"rgba(6, 12, 28, 0.94)":"rgba(255, 255, 255, 0.18)",this.stageProgressTrack.style.border=this.highContrastMode?"3px solid rgba(255, 255, 255, 0.92)":"none"),this.stageProgressFill){const t=this.stageProgressFill.getAttribute("data-stage-progress-color")??"#ffd700";this.stageProgressFill.style.background=this.highContrastMode?`repeating-linear-gradient(90deg, #ffffff 0 10px, #00ddff 10px 18px, ${t} 18px 30px)`:`linear-gradient(90deg, #00ddff, ${t})`}if(this.stageProgressGoalEl){const t=this.stageProgressFill?.getAttribute("data-stage-progress-color")??"#ffd700";this.stageProgressGoalEl.style.textShadow=this.highContrastMode?`0 0 0 #000, 0 0 12px #ffffff, 0 0 18px ${t}`:`0 0 8px ${t}`}this.boostButton&&(this.boostButton.style.border=this.highContrastMode?"4px solid rgba(255, 255, 255, 0.95)":"none",this.boostButton.style.background=this.highContrastMode?"linear-gradient(135deg, #fff27a, #76f0ff, #6BCB77)":"linear-gradient(135deg, #FF6B6B, #FFD93D, #6BCB77)",this.boostButton.style.color=this.highContrastMode?"#0b1535":"#fff"),this.cooldownContainer&&(this.cooldownContainer.style.background=this.highContrastMode?"rgba(6, 12, 28, 0.94)":"rgba(255, 255, 255, 0.2)",this.cooldownContainer.style.border=this.highContrastMode?"2px solid rgba(255, 255, 255, 0.95)":"none",this.cooldownContainer.style.height=this.highContrastMode?"10px":"6px"),this.cooldownBar&&(this.cooldownBar.style.background=this.highContrastMode?"repeating-linear-gradient(90deg, #ffffff 0 10px, #00ddff 10px 18px, #00ff88 18px 30px)":"linear-gradient(90deg, #00ddff, #00ff88)"),this.applyBoostButtonState()}showAssistMessage(t){this.assistMessageEl&&(this.assistMessageEl.textContent=t,this.assistMessageEl.style.display="block",this.announcePolite(t))}hideAssistMessage(){this.assistMessageEl&&(this.assistMessageEl.style.display="none",this.assistMessageEl.textContent="")}showBoostHint(t){!this.boostHintEl||!this.boostButton||!this.cooldownContainer||(this.boostHintEl.textContent=t,this.boostHintEl.style.display="block",this.boostHintEl.setAttribute("data-boost-hint-visible",""),this.boostHintEl.setAttribute("aria-hidden","false"),this.boostButton.setAttribute("data-boost-hint-active",""),this.cooldownContainer.setAttribute("data-boost-hint-active",""))}hideBoostHint(){this.boostHintEl&&(this.boostHintEl.style.display="none",this.boostHintEl.textContent="",this.boostHintEl.removeAttribute("data-boost-hint-visible"),this.boostHintEl.setAttribute("aria-hidden","true")),this.boostButton?.removeAttribute("data-boost-hint-active"),this.cooldownContainer?.removeAttribute("data-boost-hint-active")}isMuted(){return this.muted}update(t,e){if(this.scoreEl&&t!==this.lastScore){const i=this.lastScore;this.setDisplayedScore(t),this.lastScore=t,i!==-1&&t>i&&this.flashCount(this.scoreEl)}if(this.starCountEl&&e!==this.lastStarCount){const i=this.lastStarCount;this.starCountEl.textContent=String(e),this.lastStarCount=e,i!==-1&&e>i&&(this.flashCount(this.starCountEl),this.announcePolite(`ほし ${e}こ ゲット！`))}this.bestStarCount>0&&!this.bestStarPulsed&&e>this.bestStarCount&&this.bestStarContainerEl&&this.bestStarContainerEl.style.display!=="none"&&(this.bestStarPulsed=!0,this.flashCount(this.bestStarContainerEl))}animateScoreGain(t,e){if(!this.scoreEl)return;const i=Math.max(0,Math.round(e)),s=Math.max(0,Math.round(t));if(s<=0){this.setDisplayedScore(i),this.lastScore=i;return}this.lastScore=i,this.flashCount(this.scoreEl),this.showScoreGainPopup(s),this.animateScoreValue(i)}setBestStarCount(t){const e=Number.isInteger(t)&&t>0?t:0;this.bestStarCount=e,this.bestStarPulsed=!1,!(!this.bestStarContainerEl||!this.bestStarCountEl)&&(e>0?(this.lastBestStarCount!==e&&(this.bestStarCountEl.textContent=String(e),this.lastBestStarCount=e),this.bestStarContainerEl.style.display=""):(this.bestStarContainerEl.style.display="none",this.lastBestStarCount=-1))}flashCount(t){if(t.hasAttribute("data-hud-count-pop"))return;t.setAttribute("data-hud-count-pop","");let e=!1;const i=()=>{e||(e=!0,t.removeAttribute("data-hud-count-pop"),t.removeEventListener("animationend",s))},s=n=>{n.animationName==="hudCountPop"&&i()};t.addEventListener("animationend",s),this.registerTimeout(i,500)}setDisplayedScore(t){this.scoreEl&&this.displayedScore!==t&&(this.scoreEl.textContent=String(t)),this.displayedScore=t}animateScoreValue(t){const e=this.displayedScore;if(t<=e){this.setDisplayedScore(t);return}this.scoreAnimationToken+=1;const i=this.scoreAnimationToken,s=t-e,n=Math.min(7,Math.max(4,Math.ceil(s/120))),a=40;for(let o=1;o<=n;o+=1)this.registerTimeout(()=>{if(i!==this.scoreAnimationToken)return;const h=o/n,d=1-(1-h)*(1-h),m=o===n?t:Math.min(t,e+Math.round(s*d));this.setDisplayedScore(m)},o*a)}showScoreGainPopup(t){const e=this.scoreGainEl;if(!e)return;const i=de(t),s=this.scoreGainUseAltAnimation?"hudScoreGainFloatB":"hudScoreGainFloatA";this.scoreGainUseAltAnimation=!this.scoreGainUseAltAnimation,this.scoreGainAnimationEndHandler&&(e.removeEventListener("animationend",this.scoreGainAnimationEndHandler),this.scoreGainAnimationEndHandler=null),e.textContent=i.hudText,e.style.color=i.color,e.style.textShadow=`0 2px 10px ${i.shadow}`,e.style.animationName=s,e.style.visibility="visible",e.style.opacity="1",e.setAttribute("data-hud-score-gain-kind",i.kind),e.removeAttribute("data-hud-score-gain-active"),e.setAttribute("data-hud-score-gain-active","");let n=!1;const a=()=>{n||(n=!0,e.removeAttribute("data-hud-score-gain-active"),e.style.visibility="hidden",e.style.opacity="0",e.style.animationName="none",e.removeEventListener("animationend",o),this.scoreGainAnimationEndHandler===o&&(this.scoreGainAnimationEndHandler=null))},o=h=>{h.animationName===s&&a()};this.scoreGainAnimationEndHandler=o,e.addEventListener("animationend",o),this.registerTimeout(a,620)}registerTimeout(t,e){let i=0;return i=window.setTimeout(()=>{this.pendingTimeouts.delete(i),t()},e),this.pendingTimeouts.add(i),i}clearPendingTimeouts(){for(const t of this.pendingTimeouts)window.clearTimeout(t);this.pendingTimeouts.clear()}updateCooldown(t){if(!this.cooldownBar||!this.boostButton)return;const e=Math.max(0,Math.min(1,t)),i=Math.round(e*100);i!==this.lastCooldownPct&&(this.cooldownBar.style.width=`${i}%`,this.lastCooldownPct=i),this.lastCooldownProgress=e;const s=e>=1;s!==this.lastReadyState&&(this.lastReadyState=s,this.applyBoostButtonState())}updateStageProgress(t){if(!this.stageProgressContainer||!this.stageProgressFill)return;const e=Math.max(0,Math.min(1,t)),i=Math.round(e*100);i!==this.lastStageProgressPct&&(this.stageProgressFill.style.width=`${i}%`,this.stageProgressContainer.setAttribute("aria-valuenow",String(i)),this.stageProgressContainer.setAttribute("aria-valuetext",`ゴールまで あと ${100-i}%`),this.lastStageProgressPct=i),this.announceStageProgressMilestone(i);const s=e>=1;s!==this.lastStageProgressComplete&&(s?(this.stageProgressContainer.setAttribute("data-stage-progress-complete",""),this.flashStageGoal()):this.stageProgressContainer.removeAttribute("data-stage-progress-complete"),this.lastStageProgressComplete=s)}flashStageGoal(){const t=this.stageProgressGoalEl;if(!t||t.hasAttribute("data-stage-goal-flash"))return;t.setAttribute("data-stage-goal-flash","");let e=!1;const i=()=>{e||(e=!0,t.removeAttribute("data-stage-goal-flash"),t.removeEventListener("animationend",s))},s=n=>{n.animationName==="stageGoalFlash"&&i()};t.addEventListener("animationend",s),this.registerTimeout(i,500)}flashBoostReady(){const t=this.boostButton;if(!t||t.hasAttribute("data-boost-ready-flash"))return;this.announcePolite("ブースト じゅんび OK！"),t.setAttribute("data-boost-ready-flash","");let e=!1;const i=()=>{e||(e=!0,t.removeAttribute("data-boost-ready-flash"),t.removeEventListener("animationend",s),this.lastReadyState===!0&&this.writeBoostButtonStyle("animation","boostBtnPulse 2s ease-in-out infinite, boostReadyRing 1.15s ease-in-out infinite"))},s=n=>{n.animationName==="boostBtnReadyFlash"&&i()};t.addEventListener("animationend",s),this.registerTimeout(i,500)}clearBoostReadyFlash(){this.boostButton?.hasAttribute("data-boost-ready-flash")&&this.boostButton.removeAttribute("data-boost-ready-flash")}announceMeteoriteHit(){this.announceAssertive("いんせきに ぶつかった！ シールド かいふくちゅう")}announceStageClear(t,e=!1,i=!1){const s=[`ステージ クリア！ ほし ${t}こ あつめたよ！`];i&&s.push("じこベスト こうしん！"),e&&s.push("あたらしい なかまも みつけたよ！"),this.announceAssertive(s.join(" "))}applyBoostButtonState(){if(!this.cooldownBar||!this.boostButton)return;const e=this.lastCooldownProgress>=1&&!this.boostLocked;this.setCooldownBarBoxShadow(e?this.highContrastMode?"0 0 0 2px rgba(255, 255, 255, 0.7), 0 0 14px #00ff88":"0 0 10px #00ff88":"none"),this.writeBoostButtonStyle("opacity",e?"1":"0.5"),this.writeBoostButtonStyle("filter",e?"none":"grayscale(0.8)"),this.writeBoostButtonStyle("animation",e?"boostBtnPulse 2s ease-in-out infinite, boostReadyRing 1.15s ease-in-out infinite":"none"),this.setBoostReadyRing(e),this.setBoostButtonAriaDisabled(e?"false":"true"),e||(this.clearBoostReadyFlash(),this.hideBoostHint())}applyPauseButtonState(){this.pauseButton&&(this.writePauseButtonStyle("opacity",this.pauseEnabled?"1":"0.45"),this.writePauseButtonStyle("filter",this.pauseEnabled?"none":"grayscale(0.8)"),this.writePauseButtonStyle("cursor",this.pauseEnabled?"pointer":"default"),this.setPauseButtonAriaDisabled(this.pauseEnabled?"false":"true"))}writeBoostButtonStyle(t,e){!this.boostButton||this.boostButtonStyleCache[t]===e||(this.boostButton.style[t]=e,this.boostButtonStyleCache[t]=e)}writePauseButtonStyle(t,e){!this.pauseButton||this.pauseButtonStyleCache[t]===e||(this.pauseButton.style[t]=e,this.pauseButtonStyleCache[t]=e)}setCooldownBarBoxShadow(t){!this.cooldownBar||this.lastCooldownBarBoxShadow===t||(this.cooldownBar.style.boxShadow=t,this.lastCooldownBarBoxShadow=t)}setBoostReadyRing(t){!this.boostButton||this.lastBoostReadyRingVisible===t||(t?this.boostButton.setAttribute("data-boost-ready-ring",""):this.boostButton.removeAttribute("data-boost-ready-ring"),this.lastBoostReadyRingVisible=t)}setBoostButtonAriaDisabled(t){!this.boostButton||this.lastBoostButtonAriaDisabled===t||(this.boostButton.setAttribute("aria-disabled",t),this.lastBoostButtonAriaDisabled=t)}setPauseButtonAriaDisabled(t){!this.pauseButton||this.lastPauseButtonAriaDisabled===t||(this.pauseButton.setAttribute("aria-disabled",t),this.lastPauseButtonAriaDisabled=t)}createLiveRegions(t){this.politeLiveRegionEl=this.createLiveRegion("polite"),this.assertiveLiveRegionEl=this.createLiveRegion("assertive"),t.appendChild(this.politeLiveRegionEl),t.appendChild(this.assertiveLiveRegionEl)}createLiveRegion(t){const e=document.createElement("div");return e.setAttribute("data-hud-live-region",t),e.setAttribute("aria-live",t),e.setAttribute("aria-atomic","true"),e.setAttribute("role",t==="assertive"?"alert":"status"),e.style.cssText=`
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    `,e}announcePolite(t){this.writeLiveRegion(this.politeLiveRegionEl,t)}announceAssertive(t){this.writeLiveRegion(this.assertiveLiveRegionEl,t)}writeLiveRegion(t,e){if(!t||e.length===0)return;this.liveRegionWriteNonce+=1;const i=this.liveRegionWriteNonce%2===0?"​":"‌";t.textContent=`${e}${i}`,t.setAttribute("data-live-message",e)}announceStageProgressMilestone(t){if(t>=100){this.lastAnnouncedProgressThreshold<100&&(this.announcePolite("ゴール！"),this.lastAnnouncedProgressThreshold=100);return}const e=[{pct:75,remaining:25},{pct:50,remaining:50},{pct:25,remaining:75}];for(const i of e)t>=i.pct&&this.lastAnnouncedProgressThreshold<i.pct&&(this.lastAnnouncedProgressThreshold=i.pct,this.announcePolite(`ゴールまで あと ${i.remaining}%`))}hide(){this.clearPendingTimeouts(),this.homeConfirmOverlay.hide(),this.pauseOverlay.hide(),this.homeButton&&(this.homeButton.remove(),this.homeButton=null),this.pauseButtonCleanup?.(),this.pauseButtonCleanup=null,this.pauseButton&&(this.pauseButton.remove(),this.pauseButton=null),this.muteHandle&&(this.muteHandle.remove(),this.muteHandle=null),this.muteButton=null,this.stageNameEl&&(this.stageNameEl.remove(),this.stageNameEl=null),this.assistMessageEl&&(this.assistMessageEl.remove(),this.assistMessageEl=null),this.politeLiveRegionEl&&(this.politeLiveRegionEl.remove(),this.politeLiveRegionEl=null),this.assertiveLiveRegionEl&&(this.assertiveLiveRegionEl.remove(),this.assertiveLiveRegionEl=null),this.stageProgressContainer&&(this.stageProgressContainer.remove(),this.stageProgressContainer=null),this.stageProgressTrack=null,this.stageProgressFill=null,this.stageProgressGoalEl=null,this.container&&(this.container.remove(),this.container=null),this.boostButton&&(this.boostButton.remove(),this.boostButton=null),this.boostHintEl&&(this.boostHintEl.remove(),this.boostHintEl=null),this.cooldownContainer&&(this.cooldownContainer.remove(),this.cooldownContainer=null),this.cooldownBar=null,this.boostLocked=!1,this.pauseEnabled=!0,this.lastCooldownProgress=1,this.lastCooldownPct=-1,this.lastReadyState=null,this.lastCooldownBarBoxShadow=null,this.lastBoostButtonAriaDisabled=null,this.lastBoostReadyRingVisible=null,this.boostButtonStyleCache={opacity:null,filter:null,animation:null,transform:null},this.lastPauseButtonAriaDisabled=null,this.pauseButtonStyleCache={opacity:null,filter:null,cursor:null,transform:null},this.lastStageProgressPct=-1,this.lastStageProgressComplete=null,this.lastScore=-1,this.lastStarCount=-1,this.displayedScore=0,this.scoreAnimationToken=0,this.scoreGainUseAltAnimation=!1,this.scoreGainAnimationEndHandler=null,this.scoreEl=null,this.scoreGainEl=null,this.starCountEl=null,this.bestStarContainerEl=null,this.bestStarCountEl=null,this.bestStarCount=0,this.lastBestStarCount=-1,this.bestStarPulsed=!1,this.liveRegionWriteNonce=0,this.lastAnnouncedProgressThreshold=0}}class Ti{overlayEl=null;bubbleEl=null;highContrastMode=!1;show(t,e){const i=document.getElementById("ui-overlay");i&&(this.injectStyles(),(!this.overlayEl||!this.bubbleEl)&&(this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-adaptive-tutorial-hint",""),this.overlayEl.setAttribute("aria-hidden","true"),this.overlayEl.style.cssText=`
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
    `,document.head.appendChild(t)}}const Mi=1,Pi=.4;class Yt{overlayEl=null;numberEl=null;phase="idle";elapsed=0;currentStep=0;stepDuration;goDuration;onTick;onGo;onComplete=null;steps=["3","2","1"];constructor(t={}){this.stepDuration=t.stepDuration??Mi,this.goDuration=t.goDuration??Pi,this.onTick=t.onTick,this.onGo=t.onGo}show(t){if(this.phase!=="idle"&&this.phase!=="done")return;const e=document.getElementById("ui-overlay")??document.body;this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-countdown-overlay",""),this.overlayEl.style.cssText=`
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
    `,this.overlayEl.appendChild(this.numberEl),e.appendChild(this.overlayEl),this.phase="counting",this.elapsed=0,this.currentStep=0,this.onComplete=t,this.renderStep(this.steps[this.currentStep]),this.fireTick()}tick(t){if(!(this.phase==="idle"||this.phase==="done")){if(t<0&&(t=0),this.elapsed+=t,this.phase==="counting"){const e=this.elapsed;this.applyStepAnimation(e/this.stepDuration),e>=this.stepDuration&&(this.currentStep++,this.elapsed=0,this.currentStep<this.steps.length?(this.renderStep(this.steps[this.currentStep]),this.fireTick()):(this.phase="go",this.renderStep("スタート！"),this.fireGo()));return}this.phase==="go"&&(this.applyStepAnimation(this.elapsed/this.goDuration),this.elapsed>=this.goDuration&&this.complete())}}hide(){this.overlayEl&&(this.overlayEl.remove(),this.overlayEl=null),this.numberEl=null,this.phase="done",this.onComplete=null}dispose(){this.hide(),this.onTick=void 0,this.onGo=void 0}isActive(){return this.phase==="counting"||this.phase==="go"}getCurrentLabel(){return this.numberEl?.textContent??null}renderStep(t){this.numberEl&&(this.numberEl.textContent=t,this.numberEl.style.opacity="0",this.numberEl.style.transform="scale(0.6)")}applyStepAnimation(t){if(!this.numberEl)return;const e=Math.max(0,Math.min(1,t));let i,s;if(e<.2){const n=e/.2;i=.6+n*.5,s=n}else if(e<.7)i=1.1-(e-.2)/.5*.1,s=1;else{const n=(e-.7)/.3;i=1+n*.2,s=1-n}this.numberEl.style.transform=`scale(${i.toFixed(3)})`,this.numberEl.style.opacity=s.toFixed(3)}fireTick(){try{this.onTick?.()}catch{}}fireGo(){try{this.onGo?.()}catch{}}complete(){const t=this.onComplete;if(this.hide(),t)try{t()}catch{}}}const Bi=1.8;class Ri{constructor(t,e={}){this.entry=t,this.totalDuration=e.totalDuration??Bi}overlayEl=null;cardEl=null;phase="idle";elapsed=0;onComplete=null;totalDuration;show(t){if(this.phase!=="idle"&&this.phase!=="done")return;const e=document.getElementById("ui-overlay")??document.body;te();const i=H().height<=500;this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-stage-intro-overlay",""),this.overlayEl.style.cssText=`
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
    `;const n=document.createElement("div");n.textContent=this.entry.emoji,n.setAttribute("data-stage-intro-emoji",""),n.style.cssText=`
      font-size: ${i?"clamp(3rem, 15vw, 4.2rem)":"clamp(4.4rem, 18vw, 6rem)"};
      line-height: 1;
      filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.28));
    `;const a=document.createElement("div");a.textContent=this.entry.reading,a.setAttribute("data-stage-intro-name",""),a.style.cssText=`
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
    `,this.cardEl.append(s,n,a,o),this.overlayEl.appendChild(this.cardEl),e.appendChild(this.overlayEl),this.phase="showing",this.elapsed=0,this.onComplete=t,this.applyAnimation(0)}tick(t){this.phase==="showing"&&(this.elapsed+=Math.max(0,t),this.applyAnimation(this.elapsed/this.totalDuration),this.elapsed>=this.totalDuration&&this.complete())}hide(){this.overlayEl&&(this.overlayEl.remove(),this.overlayEl=null),this.cardEl=null,this.phase="done",this.onComplete=null}dispose(){this.hide()}isActive(){return this.phase==="showing"}applyAnimation(t){if(!this.overlayEl||!this.cardEl)return;const e=Math.max(0,Math.min(1,t));let i=1,s=1,n=0,a=1;if(e<.18){const o=e/.18;s=o,i=o,n=24-24*o,a=.92+.1*o}else if(e<.72){const o=(e-.18)/.54;s=1,i=1,n=0,a=1.02-.02*o}else{const o=(e-.72)/.28;s=1-o*.8,i=1-o,n=-18*o,a=1-.04*o}this.overlayEl.style.opacity=s.toFixed(3),this.cardEl.style.opacity=i.toFixed(3),this.cardEl.style.transform=`translateY(${n.toFixed(1)}px) scale(${a.toFixed(3)})`}complete(){const t=this.onComplete;if(this.hide(),!!t)try{t()}catch{}}}class ki{overlayEl=null;leftGuideEl=null;rightGuideEl=null;instructionEl=null;currentMode=null;show(t="intro"){if(this.overlayEl){this.setMode(t);return}const e=document.getElementById("ui-overlay");e&&(this.injectStyles(),this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-touch-guide-overlay",""),this.overlayEl.setAttribute("role","region"),this.overlayEl.setAttribute("aria-label","そうさ ガイド"),this.overlayEl.style.cssText=`
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
    `,document.head.appendChild(t)}getActiveSide(t){return t==="active-left"?"left":t==="active-right"?"right":t==="assist-left"?"left":t==="assist-right"?"right":t==="hidden"?"none":"both"}getGuideEmphasis(t,e){return e==="active-left"?t==="left"?"primary":"secondary":e==="active-right"?t==="right"?"primary":"secondary":e==="assist-left"?t==="left"?"primary":"secondary":e==="assist-right"?t==="right"?"primary":"secondary":e==="hidden"?"hidden":"balanced"}updateInstruction(t){if(!this.instructionEl)return;const e=this.getInstructionMessage(t);this.instructionEl.textContent=e,this.instructionEl.setAttribute("data-touch-guide-message",e)}getInstructionMessage(t){return t==="intro"?"ひだりか みぎを さわると うごけるよ":t==="idle"?"ひつような ときは ひだりか みぎを さわって うごこう":t==="assist-left"?"ひだりへ よけよう":t==="assist-right"?"みぎへ よけよう":""}}class yt{static DEFAULT_DURATION=4.2;static CELEBRATION_DURATION=3.6;element=null;timer=0;message=null;highContrast=!1;showHint(t){this.showMessage(t,yt.DEFAULT_DURATION)}showCelebration(t){this.showMessage(t,yt.CELEBRATION_DURATION)}tick(t){this.timer<=0||(this.timer=Math.max(0,this.timer-t),this.timer===0&&this.hide())}hide(){this.timer=0,this.message=null,this.element&&(this.element.style.display="none",this.element.textContent="",this.element.removeAttribute("data-constellation-message"))}setHighContrastMode(t){this.highContrast=t,this.element&&this.applyElementStyle(this.element)}getMessage(){return this.message}showMessage(t,e){const i=this.ensureElement();this.timer=e,this.message=t,i.textContent=t,i.setAttribute("data-constellation-message",t),i.style.display="flex"}ensureElement(){if(this.element)return this.element;const t=document.getElementById("ui-overlay"),e=document.createElement("div");return e.setAttribute("data-constellation-hint",""),e.setAttribute("aria-live","polite"),this.applyElementStyle(e),e.style.display="none",t?.appendChild(e),this.element=e,e}applyElementStyle(t){t.style.cssText=`
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
    `}}const Oi=4;class Ii{overlayEl=null;cardEl=null;titleEl=null;messageEl=null;elapsed=0;visible=!1;highContrastMode=!1;totalDuration;constructor(t={}){this.totalDuration=t.totalDuration??Oi}show(t){const e=document.getElementById("ui-overlay")??document.body;te();const i=H().height<=500;(!this.overlayEl||!this.cardEl||!this.titleEl||!this.messageEl)&&(this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-seasonal-event-notice",""),this.overlayEl.style.cssText=`
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
    `}}class Di{overlayEl=null;continueButton=null;retryButton=null;rewardButton=null;isContinueEnabled=!1;hasHandledContinue=!1;isRewardOpen=!1;buttonCleanups=new Set;show(t){this.hide();const e=document.getElementById("ui-overlay");if(!e)return;this.isContinueEnabled=!1,this.hasHandledContinue=!1,this.isRewardOpen=!1,this.injectStageClearBurstAnimation();const i=document.createElement("div");i.setAttribute("data-stage-clear-overlay",""),i.style.cssText=`
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
    `;const n=Pt(t,e,{label:"こんかい",hint:`⭐ ${e}`,size:"hero",scope:"stage-clear-current"});n.style.minWidth="136px",n.style.padding="0.65rem 0.8rem",n.style.borderRadius="20px",n.style.background="rgba(255, 255, 255, 0.12)";const a=Pt(t,i,{label:"ベスト",hint:`⭐ ${i}`,size:"hero",scope:"stage-clear-best"});return a.style.minWidth="136px",a.style.padding="0.65rem 0.8rem",a.style.borderRadius="20px",a.style.background="rgba(255, 255, 255, 0.12)",s.append(n,a),s}createNextAdventureCard(t){const e=document.createElement("section");e.setAttribute("data-stage-clear-next-preview",""),e.style.cssText=`
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
    `);s.setAttribute("data-stage-clear-next-title","");const n=document.createElement("div");n.textContent=t.emoji,n.setAttribute("data-stage-clear-next-emoji",""),n.style.cssText=`
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
    `);return o.setAttribute("data-stage-clear-next-trivia",""),e.append(i,s,n,a,o),e}createActionButtons(t){const e=!!(t.rewardEntry&&t.onReward),i=document.createElement("div");i.setAttribute("data-stage-clear-actions",""),i.style.cssText=`
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
    `,s.style.opacity="0",s.style.visibility="hidden",s.style.pointerEvents="none";const n=document.createElement("button");return n.setAttribute("data-stage-clear-continue",""),n.setAttribute("aria-label",t.continueLabel),n.textContent=t.continueLabel,n.disabled=!0,n.style.cssText=`
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
    `,n.style.opacity="0",n.style.visibility="hidden",n.style.pointerEvents="none",this.attachActionHandlers(s,t.onRetry),this.attachActionHandlers(n,t.onContinue),this.retryButton=s,this.continueButton=n,i.append(s,n),i}createRewardButton(t){const e=document.createElement("button");return e.setAttribute("data-stage-clear-card",""),e.textContent="カードをみる",e.style.cssText=`
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
    `,this.buttonCleanups.add(P(e,{canActivate:()=>!this.isRewardOpen,onActivate:()=>{this.isRewardOpen||t.onReward?.()},onPressChange:i=>{e.style.transform=i?"scale(0.96)":"scale(1)"},preventDefaultOnPointerDown:!0,preventDefaultOnClick:!0,stopPropagation:!0})),this.rewardButton=e,e}attachActionHandlers(t,e){const i=()=>!this.isRewardOpen&&this.isContinueEnabled&&!this.hasHandledContinue,s=P(t,{canActivate:i,onActivate:()=>{if(i()){this.hasHandledContinue=!0;for(const n of[this.retryButton,this.continueButton])n&&(n.disabled=!0,n.style.pointerEvents="none",n.style.transform="scale(1)");e()}},onPressChange:n=>{t.style.transform=n?"scale(0.96)":"scale(1)"},preventDefaultOnPointerDown:!0,preventDefaultOnClick:!0,stopPropagation:!0});this.buttonCleanups.add(s)}appendClearCelebrationBurst(){if(!this.overlayEl)return;const t=document.createElement("div");t.setAttribute("data-stage-clear-burst",""),t.style.cssText=`
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
    `,document.head.appendChild(t)}}const Li=2600,Xt={gentle:{title:"うちゅうせんを かるくしたよ ⭐",detail:"ほしと きらきらを すこし やさしく したよ"},stronger:{title:"もっと かるくしたよ 🚀",detail:"なめらかに あそべるように えんしゅつを ぎゅっと したよ"}};class Gi{overlayEl=null;hideTimer=null;show(t){if(!this.overlayEl){const n=document.getElementById("ui-overlay")??document.body,a=document.createElement("div");a.setAttribute("data-frame-rate-hint-overlay",""),a.setAttribute("role","status"),a.setAttribute("aria-live","polite"),a.style.cssText=`
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
      `,this.overlayEl=a,n.appendChild(a)}const e=t.level>=2?Xt.stronger:Xt.gentle,i=this.overlayEl.querySelector("[data-frame-rate-hint-title]"),s=this.overlayEl.querySelector("[data-frame-rate-hint-detail]");i&&(i.textContent=e.title),s&&(s.textContent=e.detail),this.hideTimer!==null&&window.clearTimeout(this.hideTimer),this.hideTimer=window.setTimeout(()=>{this.hide()},Li)}hide(){this.hideTimer!==null&&(window.clearTimeout(this.hideTimer),this.hideTimer=null),this.overlayEl?.remove(),this.overlayEl=null}dispose(){this.hide()}isVisible(){return this.overlayEl!==null}}const At=1,zi=2e3,Tt={starCollect:{duration:.09,amplitudeX:.04,amplitudeY:.025,frequency:34},rainbowCollect:{duration:.12,amplitudeX:.07,amplitudeY:.04,frequency:32},constellationCelebrate:{duration:.2,amplitudeX:.09,amplitudeY:.05,frequency:24},meteoriteHit:{duration:.28,amplitudeX:.18,amplitudeY:.12,frequency:42},boost:{duration:.14,amplitudeX:.08,amplitudeY:.045,frequency:28},stageClear:{duration:.3,amplitudeX:.1,amplitudeY:.06,frequency:22}};function Hi(l){const t=window.requestIdleCallback;if(typeof t=="function"){t(l,{timeout:1500});return}window.setTimeout(l,800)}class v{static VISUAL_QUALITY_SCALE_BY_TIER=[.45,.7,1];static BG_STAR_COUNT=zi;static ASSIST_TRIGGER_HIT_WINDOW=6;static ASSIST_TRIGGER_HIT_COUNT=2;static ASSIST_DURATION=5;static ASSIST_MESSAGE_DURATION=3;static ASSIST_METEORITE_INTERVAL_MULTIPLIER=1.7;static ASSIST_MESSAGE="だいじょうぶ！ ゆっくりいこう ✨";static ASSIST_DIRECTION_REFRESH_INTERVAL=.35;static ASSIST_DIRECTION_LOOKAHEAD=42;static ASSIST_DIRECTION_SIDE_TARGET_X=4.5;static ASSIST_DIRECTION_SIDE_RANGE=7.5;static ASSIST_DIRECTION_DIFF_THRESHOLD=1.1;static ASSIST_DIRECTION_DIFF_RATIO=.28;threeScene;camera;lastAspect=0;initialized=!1;sceneManager;inputSystem;audioManager;saveManager;ambientLight;directionalLight;spaceship;stars=[];meteorites=[];shootingStars=[];comets=[];specialShootingStars=[];monthlyEncounters=[];collisionSystem=new ge;scoreSystem=new fe;spawnSystem=new ye;boostSystem=new be;lodSystem=new ve;meteoShowerEventSystem=new Se;stageSpecialEventSystem=new Ee;spaceWeatherEventSystem=new xe;specialStarSpawnSystem=new Ce;seasonalEventSystem;monthlyEncounterSystem=new we;hud;scorePopupManager=new U;scorePopupEffect=new Ae;particleBurstManager=new Te;planetRingEffect=new Me;constellationLineEffect=new Pe;constellationCelebrationEffect=new Be;constellationSystem=new Re;constellationHintOverlay=new yt;airShield;meteoShowerEffect;spaceWeatherEffect;stageSpecialEffects;seasonalEventEffects=new ke;monthlyEncounterEffect=new Oe;rainbowTrailEffect;stageAtmosphereEffect=new ee;wormholeTunnelEffect=new Ie;seasonalEventNotice=new Ii;stageConfig;stageNumber=1;launchSource="campaign";isCleared=!1;clearTimer=0;stageClearOverlay=new Di;isClearRewardOpen=!1;isOpeningClearReward=!1;clearRewardOverlay=null;clearRewardOverlayPromise=null;static CLEAR_CONTINUE_DELAY=.6;stageEntryTotalScore=0;stageEntryTotalStarCount=0;playTime=0;meteoriteHitTimes=[];assistTimer=0;assistMessageTimer=0;assistDirection=null;assistDirectionRefreshTimer=0;damageTimer=0;static DAMAGE_FLASH_DURATION=.5;cameraShakeTimer=0;cameraShakeElapsed=0;cameraShakeOffset=new X;cameraShakeProfile=Tt.meteoriteHit;motionSensitivity=Y();cameraPositionTarget=new X(0,5,10);cameraLookAtTarget=new X(0,0,-10);destinationPlanet=null;destinationPlanetSpinTarget=null;static DESTINATION_PLANET_SPIN_SPEED=.2;static BOOST_HINT_DURATION=2.4;static ADAPTIVE_HINT_DURATION=3;static SHOOTING_STAR_SCORE_BONUS_DURATION=6;static METEO_SHOWER_MESSAGE="りゅうせいぐんだ！ ✨";static METEO_SHOWER_MESSAGE_DURATION=2.4;static STAGE_SPECIAL_MESSAGE_DURATION=2.8;static WORMHOLE_TRANSITION_DURATION=2.2;bgStars=null;boostLinesEffect;companionManager=null;elapsedTime=0;boostFlameEffect;isStarting=!1;stageIntroOverlay=null;countdownOverlay=null;awaitingResume=!1;resumeCountdownOverlay=null;isHomeConfirmOpen=!1;shouldResumeAfterHomeConfirm=!1;pauseOverlay=new ce;isPauseOpen=!1;shouldResumeAfterPause=!1;touchGuide=new ki;touchGuideMode="intro";touchGuideIdleTimer=0;hasSeenMoveInput=!1;isActive=!1;boostHintDisplayTimer=0;adaptiveHintDisplayTimer=0;adaptiveTutorialSystem=new De;adaptiveTutorialHint=new Ti;meteoShowerAnnouncementTimer=0;spaceWeatherAnnouncementTimer=0;spaceWeatherAnnouncementMessage="";stageSpecialAnnouncementTimer=0;stageSpecialAnnouncementMessage="";prewarmRequestToken=0;static TOUCH_GUIDE_IDLE_DELAY=3;visualQualityTier=v.VISUAL_QUALITY_SCALE_BY_TIER.length-1;performanceAdaptationLevel=0;frameRateHintOverlay=new Gi;scheduleIdleTask;loadEncyclopediaOverlay;clearRewardRequestToken=0;wormholeTransitionTimer=0;pendingWormholeTransition=null;onPauseRequested=null;onResumeRequested=null;onExitHomeRequested=null;attemptStatsRecorded=!1;constructor(t,e,i,s,n={}){this.sceneManager=t,this.inputSystem=e,this.audioManager=i,this.saveManager=s,this.scoreSystem.setScoreGainListener(h=>{this.initialized&&this.hud.animateScoreGain(h.amount,h.stageScore),h.worldPosition&&(this.scorePopupEffect.emit(h.worldPosition,h.amount),h.kind==="bonus"&&this.scorePopupManager.show(h.amount,h.worldPosition,this.camera))}),this.scheduleIdleTask=n.scheduleIdleTask??Hi,this.seasonalEventSystem=new Le(n.seasonalEventDateProvider),this.loadEncyclopediaOverlay=n.loadEncyclopediaOverlay??(()=>Mt(()=>import("./EncyclopediaOverlay-BeHPNDjy.js"),__vite__mapDeps([0,1,2]))),this.threeScene=new nt,this.threeScene.background=new at(32);const{width:a,height:o}=H();this.camera=new vt(60,a/o,.1,2e3)}ensureInitialized(){this.initialized||(this.ambientLight=new bt(16777215,.6),this.directionalLight=new ne(16777215,.8),this.directionalLight.position.set(5,10,5),this.threeScene.add(this.ambientLight),this.threeScene.add(this.directionalLight),this.spaceship=new ie,this.threeScene.add(this.spaceship.mesh),this.airShield=new Ge,this.threeScene.add(this.airShield.getMesh()),this.companionManager=new Rt([]),this.threeScene.add(this.companionManager.getGroup()),this.boostLinesEffect=new ze,this.boostLinesEffect.init(this.threeScene),this.boostFlameEffect=new He,this.boostFlameEffect.init(this.threeScene),this.rainbowTrailEffect=new Ne,this.threeScene.add(this.rainbowTrailEffect.group),this.constellationLineEffect.init(this.threeScene),this.constellationCelebrationEffect.init(this.threeScene),this.meteoShowerEffect=new Fe,this.meteoShowerEffect.init(this.threeScene),this.spaceWeatherEffect=new _e,this.spaceWeatherEffect.init(this.threeScene),this.stageSpecialEffects=new $e,this.stageSpecialEffects.init(this.threeScene),this.seasonalEventEffects.init(this.threeScene),this.stageAtmosphereEffect.init(this.threeScene),this.wormholeTunnelEffect.init(this.threeScene),this.scorePopupEffect.init(this.threeScene),this.monthlyEncounterEffect.init(this.threeScene),this.hud=new Ai,this.initialized=!0,this.applyVisualQualityTier())}setVisualQualityTier(t){this.visualQualityTier=v.clampVisualQualityTier(t),this.applyVisualQualityTier()}setPerformanceAdaptationLevel(t){this.performanceAdaptationLevel=v.clampPerformanceAdaptationLevel(t),this.applyVisualQualityTier()}showFrameRateHint(t){this.isActive&&this.frameRateHintOverlay.show({level:t})}enter(t){this.ensureInitialized(),this.isActive=!0,this.prewarmRequestToken+=1,this.clearRewardRequestToken+=1,this.lastAspect=0,this.stageNumber=t.stageNumber??1,this.launchSource=t.launchSource??"campaign",this.stageConfig=W(this.stageNumber),this.prefetchEndingSceneModuleIfNeeded(),this.isCleared=!1,this.clearTimer=0,this.stageClearOverlay.hide(),this.isClearRewardOpen=!1,this.isOpeningClearReward=!1,this.wormholeTransitionTimer=0,this.pendingWormholeTransition=null,this.wormholeTunnelEffect.clear(),this.damageTimer=0,this.elapsedTime=0,this.destinationPlanetSpinTarget=null,this.planetRingEffect.clear(),this.isHomeConfirmOpen=!1,this.shouldResumeAfterHomeConfirm=!1,this.isPauseOpen=!1,this.shouldResumeAfterPause=!1,this.pauseOverlay.hide(),this.touchGuideIdleTimer=0,this.hasSeenMoveInput=!1,this.touchGuideMode="intro",this.playTime=0,this.attemptStatsRecorded=!1,this.meteoriteHitTimes.length=0,this.meteoShowerAnnouncementTimer=0,this.spaceWeatherAnnouncementTimer=0,this.spaceWeatherAnnouncementMessage="",this.stageSpecialAnnouncementTimer=0,this.stageSpecialAnnouncementMessage="",this.assistTimer=0,this.assistMessageTimer=0,this.assistDirection=null,this.assistDirectionRefreshTimer=0,this.adaptiveTutorialSystem.reset(),this.adaptiveHintDisplayTimer=0,this.adaptiveTutorialHint.hide(),this.meteoShowerEventSystem.reset(),this.spaceWeatherEventSystem.reset(),this.stageSpecialEventSystem.setStage(Ve(this.stageNumber)),this.meteoShowerEffect.clear(),this.spaceWeatherEffect.clear(),this.stageSpecialEffects.clear(),this.resetBoostHintState();const e=t.totalScore??0,i=t.totalStarCount??0,s=this.saveManager.load();this.spaceship.applyCustomization(s.spaceshipCustomization??Bt);const n=s.colorAccessibility?.highContrast===!0;this.motionSensitivity=s.colorAccessibility?.motionSensitivity??Y();const a=s.colorAccessibility?.colorVisionSupportMode??$;Kt(s.vibrationSettings?.intensity??"medium"),Nt(f=>this.handleVibrationFallback(f)),qe(n),Ye(a),Xe(n),this.hud.setHighContrastMode(n),this.scorePopupManager.setHighContrastMode(n),this.adaptiveTutorialHint.setHighContrastMode(n),this.constellationHintOverlay.setHighContrastMode(n),this.seasonalEventNotice.setHighContrastMode(n),this.stageEntryTotalScore=e,this.stageEntryTotalStarCount=i,this.scoreSystem.setTotalScore(e),this.scoreSystem.setTotalStarCount(i),this.resetStageObjects(),this.spaceship.reset(),this.inputSystem.resetPointers?.(),this.airShield.reset(0,0,0),this.boostLinesEffect.update(!1,0,0),this.boostFlameEffect.remove(),this.rainbowTrailEffect.clear(),this.companionManager?.resetUnlockedPlanets([]),this.createBackground(),this.stageAtmosphereEffect.start(se(this.stageNumber)),this.applyMotionSensitivity(),this.applyVisualQualityTier();const o=this.seasonalEventSystem.refresh();o&&(this.seasonalEventEffects.start(o),this.seasonalEventNotice.show(o)),this.camera.position.set(0,5,10),this.camera.lookAt(0,0,-10),this.cameraLookAtTarget.set(0,0,-10),this.createDestinationPlanet(),this.scheduleNextStageVisualPrewarm(),this.stars.length=0,this.meteorites.length=0,this.shootingStars.length=0,this.comets.length=0,this.specialShootingStars.length=0,this.monthlyEncounters.length=0,this.spawnSystem.reset(),this.spawnSystem.setMeteoriteIntervalMultiplier(1),this.specialStarSpawnSystem.reset(),this.monthlyEncounterSystem.reset(),this.boostSystem.reset(),this.scoreSystem.resetStage(),this.constellationSystem.reset(je(this.stageNumber)),this.constellationLineEffect.clear(),this.constellationCelebrationEffect.clear(),this.spawnConstellationStars();const h=this.constellationSystem.getDefinition();h?this.constellationHintOverlay.showHint(h.hintMessage):this.constellationHintOverlay.hide();const d=Jt(this.stageNumber,this.stageConfig.destinationReading,a),m=`ステージ${this.stageConfig.stageNumber}: ${this.stageConfig.emoji} ${d}を めざせ！`;this.hud.show(m,this.stageConfig.planetColor),this.hud.setBoostCallback(()=>{this.inputSystem.setBoostPressed(!0)}),this.hud.setBoostDeniedCallback(()=>{this.audioManager.playSFX("boostDenied")}),this.hud.setHomeCallback(()=>{this.isHomeConfirmOpen=!1,this.shouldResumeAfterHomeConfirm=!1,this.syncBoostInputLock(),this.syncPauseAvailability(),this.sceneManager.requestTransition("title")}),this.hud.setHomeConfirmOpenCallback(()=>{this.shouldResumeAfterHomeConfirm=this.isPlaying(),this.clearBlockedGameplayInput(),this.isHomeConfirmOpen=!0,this.syncBoostInputLock(),this.syncPauseAvailability()}),this.hud.setHomeConfirmCancelCallback(()=>{const f=this.shouldResumeAfterHomeConfirm;if(this.isHomeConfirmOpen=!1,this.shouldResumeAfterHomeConfirm=!1,this.syncPauseAvailability(),f){this.requestResumeCountdown();return}this.syncBoostInputLock()}),this.hud.setPauseCallback(()=>{this.requestManualPause()}),this.hud.setMuteState(this.audioManager.isMuted()),this.hud.setMuteCallback(()=>{const f=this.audioManager.toggleMute();this.hud.setMuteState(f);const b=this.saveManager.load();b.muted=f,this.saveManager.save(b)}),this.hud.update(this.scoreSystem.getStageScore(),this.scoreSystem.getStarCount()),this.hud.hideAssistMessage(),this.adaptiveTutorialHint.hide(),this.touchGuide.show("intro"),this.syncPauseAvailability(),this.hud.setBestStarCount(s.bestStageStars?.[this.stageNumber]??0),this.companionManager?.resetUnlockedPlanets(s.unlockedPlanets),this.bgStars&&dt(this.bgStars,this.spaceship.position.z,At),this.audioManager.playBGM(this.stageNumber),this.stageIntroOverlay?.dispose(),this.stageIntroOverlay=null,this.startOpeningSequence(t)}prefetchEndingSceneModuleIfNeeded(){if(this.stageNumber<z-1)return;this.sceneManager.prefetchSceneModule?.call(this.sceneManager,"ending")?.catch(()=>{})}startOpeningSequence(t){if(this.isStarting=!0,this.syncBoostInputLock(),this.syncPauseAvailability(),!this.shouldShowStageIntro(t)){this.startCountdown();return}const e=ct(this.stageNumber);if(!e){this.startCountdown();return}this.stageIntroOverlay=new Ri(e),this.stageIntroOverlay.show(()=>{this.stageIntroOverlay=null,this.startCountdown()})}startCountdown(){if(this.isStarting=!0,this.syncBoostInputLock(),this.syncPauseAvailability(),this.shouldSkipCountdown()){this.isStarting=!1,this.countdownOverlay=null,this.syncBoostInputLock(),this.syncPauseAvailability();return}this.countdownOverlay=new Yt({onTick:()=>{this.audioManager.playSFX("countdownTick")},onGo:()=>{this.audioManager.playSFX("countdownGo")}}),this.countdownOverlay.show(()=>{this.isStarting=!1,this.countdownOverlay=null,this.syncBoostInputLock(),this.syncPauseAvailability()})}shouldShowStageIntro(t){return this.shouldSkipCountdown()||this.launchSource!=="campaign"||t.replayToken!==void 0||t.totalScore===void 0||t.totalStarCount===void 0?!1:ct(this.stageNumber)!==void 0}releasePointerInputForLock(){this.inputSystem.resetPointers?.()}syncBoostInputLock(){const t=this.isStarting||this.awaitingResume||this.isHomeConfirmOpen||this.isPauseOpen;this.hud.setBoostLocked(t),t&&(this.resetBoostHintState(),this.inputSystem.setBoostPressed?.(!1))}clearBlockedGameplayInput(){this.inputSystem.resetPointers?.(),this.inputSystem.setBoostPressed?.(!1)}syncPauseAvailability(){this.hud.setPauseEnabled(this.canPause())}shouldSkipCountdown(){try{return new URLSearchParams(window.location.search).get("nocount")==="1"}catch{return!1}}isPlaying(){return!(!this.stageConfig||this.isCleared||this.isClearRewardOpen||this.isOpeningClearReward||this.isStarting||this.awaitingResume||this.isHomeConfirmOpen||this.isPauseOpen)}isUserPaused(){return this.isPauseOpen}requestResumeCountdown(){this.isPlaying()&&(this.resumeCountdownOverlay||this.shouldSkipCountdown()||(this.clearBlockedGameplayInput(),this.awaitingResume=!0,this.syncBoostInputLock(),this.syncPauseAvailability(),this.resumeCountdownOverlay=new Yt({onTick:()=>{this.audioManager.playSFX("countdownTick")},onGo:()=>{this.audioManager.playSFX("countdownGo")}}),this.resumeCountdownOverlay.show(()=>{this.awaitingResume=!1,this.resumeCountdownOverlay=null,this.syncBoostInputLock(),this.syncPauseAvailability()})))}setPauseHandlers(t){this.onPauseRequested=t.onPauseRequested??null,this.onResumeRequested=t.onResumeRequested??null,this.onExitHomeRequested=t.onExitHomeRequested??null}isManuallyPaused(){return this.isPauseOpen}requestManualPause(){this.canPause()&&(this.clearBlockedGameplayInput(),this.isPauseOpen=!0,this.syncBoostInputLock(),this.syncPauseAvailability(),this.pauseOverlay.show(()=>{this.isPauseOpen=!1,this.syncBoostInputLock(),this.syncPauseAvailability(),this.onResumeRequested?.()},()=>{this.isPauseOpen=!1,this.syncBoostInputLock(),this.syncPauseAvailability(),this.onExitHomeRequested?.()}),this.onPauseRequested?.())}canPause(){return!(!this.stageConfig||this.isCleared||this.isClearRewardOpen||this.isOpeningClearReward||this.isStarting||this.awaitingResume||this.isHomeConfirmOpen||this.isPauseOpen)}createBackground(){this.bgStars||(this.bgStars=le(this.getBackgroundStarDrawCount()),this.threeScene.add(this.bgStars))}createDestinationPlanet(){this.removeDestinationPlanet();const t=-(this.stageConfig.stageLength+50),{planet:e,spinTarget:i}=re(this.stageNumber,this.stageConfig,t);this.destinationPlanet=e,this.destinationPlanetSpinTarget=i,this.threeScene.add(this.destinationPlanet)}scheduleNextStageVisualPrewarm(){const t=this.stageNumber+1;if(t>z)return;const e=this.prewarmRequestToken;this.scheduleIdleTask(()=>{!this.isActive||this.prewarmRequestToken!==e||zt(t)})}removeDestinationPlanet(){this.destinationPlanet&&(this.destinationPlanet.parent?.remove(this.destinationPlanet),this.destinationPlanet=null,this.destinationPlanetSpinTarget=null)}resetStageObjects(){this.clearRewardOverlay?.hide(),this.stageClearOverlay.hide(),this.isClearRewardOpen=!1,this.isOpeningClearReward=!1,this.removeDestinationPlanet(),this.resetCameraShake(),this.planetRingEffect.clear(),this.scorePopupEffect.clear(),this.particleBurstManager.clear(this.threeScene),this.spawnSystem.recycleAll(),this.spawnSystem.setMeteoriteIntervalMultiplier(1),this.meteoShowerEventSystem.reset(),this.meteoShowerEffect.clear(),this.meteoShowerAnnouncementTimer=0,this.spaceWeatherEventSystem.reset(),this.spaceWeatherEffect.clear(),this.spaceWeatherAnnouncementTimer=0,this.spaceWeatherAnnouncementMessage="",this.stageSpecialEventSystem.reset(),this.stageSpecialEffects.clear(),this.seasonalEventSystem.clear(),this.seasonalEventEffects.clear(),this.monthlyEncounterEffect.clear(),this.stageAtmosphereEffect.clear(),this.wormholeTunnelEffect.clear(),this.wormholeTransitionTimer=0,this.pendingWormholeTransition=null,this.rainbowTrailEffect.clear(),this.stageSpecialAnnouncementTimer=0,this.stageSpecialAnnouncementMessage="",this.seasonalEventNotice.hide(),this.stars.length=0,this.meteorites.length=0,this.shootingStars.length=0,this.comets.length=0,this.specialShootingStars.length=0,this.monthlyEncounters.length=0,this.specialStarSpawnSystem.recycleAll(),this.specialStarSpawnSystem.reset(),this.monthlyEncounterSystem.recycleAll(),this.monthlyEncounterSystem.reset(),this.hud?.hideAssistMessage(),this.constellationHintOverlay.hide(),this.constellationLineEffect.clear(),this.constellationCelebrationEffect.clear(),this.constellationSystem.reset(),this.resetBoostHintState()}update(t){if(!this.initialized)return;if(this.isCleared)return this.resetBoostHintState(),this.clearTimer+=t,this.seasonalEventNotice.tick(t),this.constellationHintOverlay.tick(t),this.constellationLineEffect.update(t),this.constellationCelebrationEffect.update(t),this.planetRingEffect.update(t),this.monthlyEncounterEffect.update(t),this.scorePopupEffect.update(t),this.particleBurstManager.update(this.threeScene,t),this.companionManager?.update(t,this.spaceship.position.x,this.spaceship.position.y,this.spaceship.position.z),this.destinationPlanetSpinTarget&&(this.destinationPlanetSpinTarget.rotation.y+=t*v.DESTINATION_PLANET_SPIN_SPEED),this.seasonalEventEffects.update(t,this.spaceship.position.x,this.spaceship.position.z),this.pendingWormholeTransition||this.revealClearActionButtonsIfReady(),this.stageAtmosphereEffect.update(t,this.camera,this.spaceship.position.x,this.spaceship.position.z),this.updateWormholeTransition(t),void 0;if(this.isStarting||this.awaitingResume||this.isHomeConfirmOpen||this.isPauseOpen){if(this.resetBoostHintState(),this.hideAdaptiveTutorialHint(),this.seasonalEventNotice.tick(t),this.inputSystem.setBoostPressed?.(!1),!this.isHomeConfirmOpen&&!this.isPauseOpen){const r=this.stageIntroOverlay?.isActive()??!1;this.stageIntroOverlay?.tick(t),r||this.countdownOverlay?.tick(t),this.resumeCountdownOverlay?.tick(t)}this.destinationPlanetSpinTarget&&(this.destinationPlanetSpinTarget.rotation.y+=t*v.DESTINATION_PLANET_SPIN_SPEED),this.bgStars&&dt(this.bgStars,this.spaceship.position.z,At),this.airShield.setPosition(this.spaceship.position.x,this.spaceship.position.y,this.spaceship.position.z),this.airShield.update(t),this.hud.update(this.scoreSystem.getStageScore(),this.scoreSystem.getStarCount()),this.constellationHintOverlay.tick(t),this.constellationLineEffect.update(t),this.constellationCelebrationEffect.update(t),this.seasonalEventEffects.update(t,this.spaceship.position.x,this.spaceship.position.z),this.monthlyEncounterEffect.update(t),this.stageAtmosphereEffect.update(t,this.camera,this.spaceship.position.x,this.spaceship.position.z);return}const e=this.inputSystem.getState();this.playTime+=t,this.seasonalEventNotice.tick(t),this.updateAssistTimers(t),this.updateMeteoShowerAnnouncement(t),this.updateSpaceWeatherAnnouncement(t),this.updateStageSpecialAnnouncement(t),this.updateAdaptiveHintDisplay(t),this.updateBoostHintDisplay(t),this.updateTouchGuide(e.moveDirection,t);const i=this.boostSystem.isActive(),s=this.boostSystem.isAvailable();e.boostPressed&&(this.boostSystem.activate()?(this.adaptiveTutorialSystem.recordBoostUsed(),this.audioManager.playSFX("boost"),q("boost"),this.audioManager.startBoostSFX(),this.boostFlameEffect.start()):this.audioManager.playSFX("boostDenied"),this.inputSystem.setBoostPressed(!1)),this.boostSystem.update(t),i&&!this.boostSystem.isActive()&&(this.audioManager.stopBoostSFX(),this.boostFlameEffect.stopEmitting()),!s&&this.boostSystem.isAvailable()&&(this.audioManager.playSFX("boostReady"),this.hud.flashBoostReady()),this.boostSystem.isActive()&&this.spaceship.speedState!=="BOOST"&&this.spaceship.activateBoost(),e.moveDirection===-1?this.spaceship.moveLeft(t):e.moveDirection===1&&this.spaceship.moveRight(t),this.spaceship.update(t),this.seasonalEventEffects.update(t,this.spaceship.position.x,this.spaceship.position.z);const n=this.spaceship.getProgress(this.stageConfig.stageLength),a=this.stageSpecialEventSystem.update(n,t);a.started&&a.event&&(this.stageSpecialEffects.start(a.event),this.showStageSpecialAnnouncement(a.event.message));const o=this.meteoShowerEventSystem.update(t);o.started&&(this.audioManager.playSFX("meteorShowerStart"),this.meteoShowerEffect.start(),this.showMeteoShowerAnnouncement());const h=this.spaceWeatherEventSystem.update(t);this.scoreSystem.setEventStarMultiplier?.(h.active&&h.event?h.event.starScoreMultiplier:1),h.started&&h.event&&(this.spaceWeatherEffect.start(h.event),this.showSpaceWeatherAnnouncement(h.event.message));const d=this.spawnSystem.update(t,this.spaceship.position.z,this.stageConfig,this.stars,this.meteorites,this.shootingStars,this.comets,{meteoShowerActive:o.active});for(const r of d.newStars)this.stars.push(r),this.threeScene.add(r.mesh);for(const r of d.newMeteorites)this.meteorites.push(r),this.threeScene.add(r.mesh);for(const r of d.newShootingStars)this.shootingStars.push(r),this.threeScene.add(r.mesh);for(const r of d.newComets)this.comets.push(r),this.threeScene.add(r.mesh);const m=this.specialStarSpawnSystem.update(t,this.spaceship.position.z,this.specialShootingStars,this.shootingStars,this.comets);for(const r of m.newSpecialStars)this.specialShootingStars.push(r),this.threeScene.add(r.mesh);const f=this.monthlyEncounterSystem.update(t,this.spaceship.position.z,this.monthlyEncounters,this.specialShootingStars,this.shootingStars,this.comets);for(const r of f.newMonthlyEncounters)this.monthlyEncounters.push(r),this.threeScene.add(r.mesh);this.lodSystem.update(this.spaceship.position,this.stars),this.lodSystem.update(this.spaceship.position,this.meteorites),this.companionManager?.update(t,this.spaceship.position.x,this.spaceship.position.y,this.spaceship.position.z);const b=this.companionManager?.getStarAttractionBonus()??0,g=this.collisionSystem.check(this.spaceship,this.stars,this.meteorites,b,this.shootingStars,this.comets,this.specialShootingStars,this.monthlyEncounters);if(g.shootingStarHit){const r=g.shootingStarHit;this.scoreSystem.addBonusScore(r.scoreBonus,r.position),this.scoreSystem.activateShootingStarBonus(Math.max(v.SHOOTING_STAR_SCORE_BONUS_DURATION,r.bonusDuration)),this.audioManager.playSFX("shootingStarCollect"),this.scorePopupManager.showLabel("☆ながれぼし☆",r.position,this.camera,"shooting-star"),this.particleBurstManager.emitShootingStar(this.threeScene,r.position.x,r.position.y,r.position.z)}if(g.cometHit){const r=g.cometHit;this.scoreSystem.addBonusScore(r.scoreBonus,r.position),this.scoreSystem.activateShootingStarBonus(r.bonusDuration),this.audioManager.playSFX("cometCollect"),this.particleBurstManager.emit(this.threeScene,r.position.x,r.position.y,r.position.z,12447743,50,!0),this.particleBurstManager.emit(this.threeScene,r.position.x,r.position.y,r.position.z,16777215,50,!0)}if(g.specialShootingStarHit){const r=g.specialShootingStarHit,u=Ue(r.specialType),w=this.saveManager.markSpecialStarDiscovered?.(r.specialType)??!1;this.scoreSystem.addBonusScore(r.scoreBonus,r.position),this.audioManager.playSFX("shootingStarCollect"),q("rainbowCollect"),this.particleBurstManager.emitShootingStar(this.threeScene,r.position.x,r.position.y,r.position.z),this.particleBurstManager.emit(this.threeScene,r.position.x,r.position.y,r.position.z,xt[r.specialType].visual.trailColor,50,!0),this.particleBurstManager.emit(this.threeScene,r.position.x,r.position.y,r.position.z,xt[r.specialType].visual.auraColor,50,!0),this.scorePopupManager.showLabel(w&&u?`${u.emoji} ${u.reading}`:xt[r.specialType].label,r.position,this.camera,"special-star")}if(g.monthlyEncounterHit){const r=g.monthlyEncounterHit,u=We(r.encounterId),w=this.saveManager.markMonthlyEncounterDiscovered?.(r.encounterId)??!1;this.scoreSystem.addBonusScore(r.scoreBonus,r.position),this.audioManager.playSFX("shootingStarCollect"),q("rainbowCollect"),this.monthlyEncounterEffect.emit(r.position,u?.accentColor??16777215),this.particleBurstManager.emitShootingStar(this.threeScene,r.position.x,r.position.y,r.position.z),this.scorePopupManager.showLabel(w?"✨ あたらしい てんたい はっけん！":`${u?.emoji??"✨"} ${u?.reading??"てんたい"}`,r.position,this.camera,"monthly-encounter")}for(const r of g.starCollisions)this.scoreSystem.addStarScore(r.starType,r.position),r.starType==="RAINBOW"?(this.audioManager.playSFX("rainbowCollect"),this.rainbowTrailEffect.start(this.spaceship.position),this.particleBurstManager.emit(this.threeScene,r.position.x,r.position.y,r.position.z,16768256,50,!0)):(this.audioManager.playSFX("starCollect"),this.particleBurstManager.emit(this.threeScene,r.position.x,r.position.y,r.position.z,16768256,20,!1)),this.handleConstellationStarCollected(r);if(g.meteoriteCollision){if(g.meteoriteHit){const r=g.meteoriteHit;typeof r.handleCollision=="function"?r.handleCollision():(r.isActive=!1,r.mesh.visible=!1,q("meteoriteHit")),this.particleBurstManager.emit(this.threeScene,r.position.x,r.position.y,r.position.z,16755268,24,!1)}this.spaceship.onMeteoriteHit(),this.hud.announceMeteoriteHit(),this.recordMeteoriteHit(),this.boostSystem.cancel(),this.damageTimer=v.DAMAGE_FLASH_DURATION,this.startCameraShake("meteoriteHit"),this.audioManager.playSFX("meteoriteHit"),this.audioManager.stopBoostSFX(),this.boostFlameEffect.remove()}this.updateDamageEffect(t),this.cleanupPassedObjects(t),this.updateAdaptiveTutorial(e.moveDirection,t),this.updateCameraFollow(t),this.stageAtmosphereEffect.update(t,this.camera,this.spaceship.position.x,this.spaceship.position.z),this.monthlyEncounterEffect.update(t),this.rainbowTrailEffect.update(t,this.spaceship.position);for(const r of g.starCollisions)this.scorePopupManager.show(r.scoreValue,r.position,this.camera);if(this.stageNumber===10&&this.destinationPlanet){const r=1+Math.sin(this.elapsedTime*2)*.05;this.destinationPlanet.scale.set(r,r,r)}this.destinationPlanetSpinTarget&&(this.destinationPlanetSpinTarget.rotation.y+=t*v.DESTINATION_PLANET_SPIN_SPEED),this.elapsedTime+=t,this.bgStars&&dt(this.bgStars,this.spaceship.position.z,At),this.meteoShowerEffect.update(o.active,t,this.spaceship.position.x,this.spaceship.position.z),this.stageSpecialEffects.update(a.active,t,this.spaceship.position.x,this.spaceship.position.z),this.spaceWeatherEffect.update(h.active,t,this.spaceship.position.x,this.spaceship.position.z),this.boostLinesEffect.update(this.boostSystem.isActive(),this.spaceship.position.x,this.spaceship.position.z),this.boostSystem.isActive()&&this.boostFlameEffect.emit(this.spaceship.position,this.boostSystem.getDurationProgress()),this.boostFlameEffect.update(t),this.airShield.setPosition(this.spaceship.position.x,this.spaceship.position.y,this.spaceship.position.z),this.boostSystem.isActive()?this.airShield.setShieldMode("BOOST"):this.spaceship.speedState==="SLOWDOWN"?this.airShield.setShieldMode("INVINCIBLE",1):this.spaceship.speedState==="RECOVERING"?this.airShield.setShieldMode("INVINCIBLE",this.spaceship.getSpeedStateRemainingRatio()):this.airShield.setShieldMode("OFF"),this.airShield.update(t),this.scorePopupEffect.update(t),this.particleBurstManager.update(this.threeScene,t),this.scoreSystem.update(t),this.constellationLineEffect.update(t),this.constellationCelebrationEffect.update(t),this.constellationHintOverlay.tick(t),this.hud.update(this.scoreSystem.getStageScore(),this.scoreSystem.getStarCount()),this.hud.updateCooldown(this.boostSystem.getCooldownProgress()),this.hud.updateStageProgress(n),n>=1&&this.onStageClear()}updateTouchGuide(t,e){if(this.assistTimer>0){this.setTouchGuideMode(this.getAssistTouchGuideMode());return}if(t!==0){this.touchGuideIdleTimer=0,this.hasSeenMoveInput=!0,this.setTouchGuideMode(t<0?"active-left":"active-right");return}if(!this.hasSeenMoveInput){this.setTouchGuideMode("intro");return}if(this.touchGuideIdleTimer+=e,this.touchGuideIdleTimer>=v.TOUCH_GUIDE_IDLE_DELAY){this.setTouchGuideMode("idle");return}this.setTouchGuideMode("hidden")}setTouchGuideMode(t){this.touchGuideMode!==t&&(this.touchGuideMode=t,this.touchGuide.setMode(t))}resetAssistNavigation(){this.meteoriteHitTimes.length=0,this.assistTimer=0,this.assistMessageTimer=0,this.assistDirection=null,this.assistDirectionRefreshTimer=0}updateAssistTimers(t){this.assistTimer>0&&(this.assistDirectionRefreshTimer=Math.max(0,this.assistDirectionRefreshTimer-t),this.assistDirectionRefreshTimer===0&&this.refreshAssistDirection(),this.assistTimer=Math.max(0,this.assistTimer-t),this.assistTimer===0&&(this.spawnSystem.setMeteoriteIntervalMultiplier(1),this.assistDirection=null,this.assistDirectionRefreshTimer=0)),this.assistMessageTimer>0&&(this.assistMessageTimer=Math.max(0,this.assistMessageTimer-t),this.assistMessageTimer===0&&this.syncAssistMessage())}updateMeteoShowerAnnouncement(t){this.meteoShowerAnnouncementTimer<=0||(this.meteoShowerAnnouncementTimer=Math.max(0,this.meteoShowerAnnouncementTimer-t),this.meteoShowerAnnouncementTimer===0&&this.syncAssistMessage())}updateSpaceWeatherAnnouncement(t){this.spaceWeatherAnnouncementTimer<=0||(this.spaceWeatherAnnouncementTimer=Math.max(0,this.spaceWeatherAnnouncementTimer-t),this.spaceWeatherAnnouncementTimer===0&&(this.spaceWeatherAnnouncementMessage="",this.syncAssistMessage()))}showMeteoShowerAnnouncement(){this.meteoShowerAnnouncementTimer=v.METEO_SHOWER_MESSAGE_DURATION,this.syncAssistMessage()}showSpaceWeatherAnnouncement(t){this.spaceWeatherAnnouncementMessage=t,this.spaceWeatherAnnouncementTimer=v.STAGE_SPECIAL_MESSAGE_DURATION,this.syncAssistMessage()}updateStageSpecialAnnouncement(t){this.stageSpecialAnnouncementTimer<=0||(this.stageSpecialAnnouncementTimer=Math.max(0,this.stageSpecialAnnouncementTimer-t),this.stageSpecialAnnouncementTimer===0&&(this.stageSpecialAnnouncementMessage="",this.syncAssistMessage()))}showStageSpecialAnnouncement(t){this.stageSpecialAnnouncementMessage=t,this.stageSpecialAnnouncementTimer=v.STAGE_SPECIAL_MESSAGE_DURATION,this.syncAssistMessage()}syncAssistMessage(){if(this.meteoShowerAnnouncementTimer>0){this.hud.showAssistMessage(v.METEO_SHOWER_MESSAGE);return}if(this.stageSpecialAnnouncementTimer>0&&this.stageSpecialAnnouncementMessage){this.hud.showAssistMessage(this.stageSpecialAnnouncementMessage);return}if(this.spaceWeatherAnnouncementTimer>0&&this.spaceWeatherAnnouncementMessage){this.hud.showAssistMessage(this.spaceWeatherAnnouncementMessage);return}if(this.assistMessageTimer>0){this.hud.showAssistMessage(v.ASSIST_MESSAGE);return}this.hud.hideAssistMessage()}resetBoostHintState(){this.boostHintDisplayTimer=0,this.hud?.hideBoostHint()}updateBoostHintDisplay(t){this.boostHintDisplayTimer>0&&(this.boostHintDisplayTimer=Math.max(0,this.boostHintDisplayTimer-t),this.boostHintDisplayTimer===0&&this.hud.hideBoostHint())}updateAdaptiveHintDisplay(t){this.adaptiveHintDisplayTimer<=0||(this.adaptiveHintDisplayTimer=Math.max(0,this.adaptiveHintDisplayTimer-t),this.adaptiveHintDisplayTimer===0&&this.adaptiveTutorialHint.hide())}hideAdaptiveTutorialHint(){this.adaptiveHintDisplayTimer=0,this.adaptiveTutorialHint.hide()}updateAdaptiveTutorial(t,e){const i=this.adaptiveTutorialSystem.update({deltaTime:e,moveDirection:t,shipX:this.spaceship.position.x,shipZ:this.spaceship.position.z,boostAvailable:this.boostSystem.isAvailable(),boostActive:this.boostSystem.isActive(),meteorites:this.meteorites});i&&this.showAdaptiveTutorialEvent(i)}showAdaptiveTutorialEvent(t){if(t.type==="boost"){this.hideAdaptiveTutorialHint(),this.hud.showBoostHint(t.message),this.boostHintDisplayTimer=v.BOOST_HINT_DURATION;return}this.resetBoostHintState(),this.adaptiveTutorialHint.show(t.message,t.type),this.adaptiveHintDisplayTimer=v.ADAPTIVE_HINT_DURATION}recordMeteoriteHit(){const t=this.playTime;for(this.meteoriteHitTimes.push(t);this.meteoriteHitTimes.length>0&&t-this.meteoriteHitTimes[0]>v.ASSIST_TRIGGER_HIT_WINDOW;)this.meteoriteHitTimes.shift();this.assistTimer>0||this.meteoriteHitTimes.length<v.ASSIST_TRIGGER_HIT_COUNT||this.activateAssistMode()}activateAssistMode(){this.assistTimer=v.ASSIST_DURATION,this.assistMessageTimer=v.ASSIST_MESSAGE_DURATION,this.assistDirectionRefreshTimer=0,this.refreshAssistDirection(),this.spawnSystem.setMeteoriteIntervalMultiplier(v.ASSIST_METEORITE_INTERVAL_MULTIPLIER),this.hud.showAssistMessage(v.ASSIST_MESSAGE),this.meteoriteHitTimes.length=0}refreshAssistDirection(){this.assistDirection=this.getSaferAssistDirection(),this.assistDirectionRefreshTimer=v.ASSIST_DIRECTION_REFRESH_INTERVAL}getAssistTouchGuideMode(){return this.assistDirection==="left"?"assist-left":this.assistDirection==="right"?"assist-right":"hidden"}getSaferAssistDirection(){const t=this.spaceship.position.x,e=this.spaceship.position.z,i=Math.min(t-2.5,-v.ASSIST_DIRECTION_SIDE_TARGET_X),s=Math.max(t+2.5,v.ASSIST_DIRECTION_SIDE_TARGET_X);let n=0,a=0;for(const d of this.meteorites){if(!d.isActive)continue;const m=e-d.position.z;if(m<0||m>v.ASSIST_DIRECTION_LOOKAHEAD)continue;const f=1+(v.ASSIST_DIRECTION_LOOKAHEAD-m)/7,b=Math.abs(d.position.x-i),g=Math.abs(d.position.x-s),r=Math.max(0,1-b/v.ASSIST_DIRECTION_SIDE_RANGE),u=Math.max(0,1-g/v.ASSIST_DIRECTION_SIDE_RANGE);n+=f*r,a+=f*u}const o=Math.abs(n-a),h=Math.max(n,a);return o<v.ASSIST_DIRECTION_DIFF_THRESHOLD||h>0&&o<h*v.ASSIST_DIRECTION_DIFF_RATIO?null:n<a?"left":"right"}updateDamageEffect(t){if(this.damageTimer>0){if(this.damageTimer-=t,this.damageTimer<=0){this.damageTimer=0,this.spaceship.mesh.rotation.z=0,this.spaceship.mesh.rotation.y=0,this.spaceship.mesh.visible=!0;return}const e=Math.sin(this.damageTimer*30)*.3;this.spaceship.mesh.rotation.z=e,this.spaceship.mesh.rotation.y=0;const i=Math.sin(this.damageTimer*20)>0;this.spaceship.mesh.visible=i}else this.spaceship.mesh.visible=!0}resetCameraShake(){this.cameraShakeTimer=0,this.cameraShakeElapsed=0,this.cameraShakeProfile=Tt.meteoriteHit,this.cameraShakeOffset.set(0,0,0)}startCameraShake(t="meteoriteHit"){this.cameraShakeProfile=Tt[t],this.cameraShakeTimer=this.cameraShakeProfile.duration,this.cameraShakeElapsed=0}handleVibrationFallback(t){t!=="meteoriteHit"&&this.startCameraShake(t)}updateCameraShake(t){if(this.cameraShakeTimer<=0){this.cameraShakeOffset.set(0,0,0);return}if(this.cameraShakeElapsed+=t,this.cameraShakeTimer=Math.max(0,this.cameraShakeTimer-t),this.cameraShakeTimer===0){this.cameraShakeOffset.set(0,0,0);return}const e=this.cameraShakeTimer/this.cameraShakeProfile.duration,i=this.cameraShakeElapsed*this.cameraShakeProfile.frequency,s=Ct(this.motionSensitivity);this.cameraShakeOffset.set(Math.sin(i)*this.cameraShakeProfile.amplitudeX*e*s.cameraShakeScale,Math.cos(i*.8)*this.cameraShakeProfile.amplitudeY*e*s.cameraShakeScale,0)}updateCameraFollow(t){this.updateCameraShake(t);const e=Ct(this.motionSensitivity),i=this.spaceship.position.x*.3+this.cameraShakeOffset.x,s=5+this.cameraShakeOffset.y,n=this.spaceship.position.z+12,a=e.cameraFollowResponsiveness;if(a>=1)this.camera.position.set(i,s,n);else{const o=1-Math.pow(1-a,Math.max(1,t*60));this.cameraPositionTarget.set(i,s,n),this.camera.position.lerp(this.cameraPositionTarget,o)}this.cameraLookAtTarget.set(this.spaceship.position.x*.5,0,this.spaceship.position.z-20),this.camera.lookAt(this.cameraLookAtTarget)}cleanupPassedObjects(t){const e=this.spaceship.position.z,i=e+30,s=this.stars;let n=0,a=0;for(let y=0;y<s.length;y++){const p=s[y];p.isCollected||p.position.z>i?(!p.isCollected&&p.position.z>i&&(a+=1),this.spawnSystem.releaseStar(p)):(p.update(t,e),n!==y&&(s[n]=p),n++)}s.length=n,a>0&&this.adaptiveTutorialSystem.recordMissedStars(a);const o=this.meteorites;let h=0;for(let y=0;y<o.length;y++){const p=o[y];!p.isActive||p.position.z>i?this.spawnSystem.releaseMeteorite(p):(p.isActive&&p.update(t,e),h!==y&&(o[h]=p),h++)}o.length=h;const d=this.shootingStars;let m=0;for(let y=0;y<d.length;y++){const p=d[y];p.isCollected||p.position.z>i?this.spawnSystem.releaseShootingStar(p):(p.update(t,e),m!==y&&(d[m]=p),m++)}d.length=m;const f=this.comets;let b=0;for(let y=0;y<f.length;y++){const p=f[y];p.isCollected||p.position.z>i?this.spawnSystem.releaseComet(p):(p.update(t,e),b!==y&&(f[b]=p),b++)}f.length=b;const g=this.specialShootingStars;let r=0;for(let y=0;y<g.length;y++){const p=g[y];p.isCollected||p.position.z>i?this.specialStarSpawnSystem.releaseSpecialStar(p):(p.update(t,e),r!==y&&(g[r]=p),r++)}g.length=r;const u=this.monthlyEncounters;let w=0;for(let y=0;y<u.length;y++){const p=u[y];p.isCollected||p.position.z>i?this.monthlyEncounterSystem.releaseMonthlyEncounter(p):(p.update(t,e),w!==y&&(u[w]=p),w++)}u.length=w}spawnConstellationStars(){const t=this.constellationSystem.getDefinition();if(t)for(let e=0;e<t.points.length;e++){const i=t.points[e],s=this.spawnSystem.acquireStar(i.x,i.y,i.z,"RAINBOW");s.setConstellationMarker(t.id,t.stageNumber,e),this.stars.push(s),this.threeScene.add(s.mesh)}}handleConstellationStarCollected(t){const e=this.constellationSystem.registerCollectedStar(t);if(!e.advanced||(e.lineSegment&&this.constellationLineEffect.addSegment(e.lineSegment.from,e.lineSegment.to),!e.completed))return;const i=this.constellationSystem.getDefinition();if(!i)return;this.saveManager.markConstellationDiscovered?.(this.stageNumber),this.constellationHintOverlay.showCelebration(i.celebrationMessage);const s=this.getConstellationCelebrationPosition(i);this.constellationCelebrationEffect.play(s,this.stageConfig.planetColor),this.audioManager.playSFX("constellationCelebrate"),q("constellationCelebrate"),this.particleBurstManager.emit(this.threeScene,t.position.x,t.position.y,t.position.z,9103615,42,!0),this.particleBurstManager.emit(this.threeScene,s.x,s.y,s.z,this.stageConfig.planetColor,36,!0)}getConstellationCelebrationPosition(t){if(t.points.length===0)return{x:0,y:0,z:this.spaceship.position.z};let e=0,i=0,s=0;for(const n of t.points)e+=n.x,i+=n.y,s+=n.z;return{x:e/t.points.length,y:i/t.points.length,z:s/t.points.length}}onStageClear(){if(this.isCleared)return;this.isCleared=!0,this.clearTimer=0,this.stageClearOverlay.hide(),this.resetAssistNavigation(),this.meteoShowerAnnouncementTimer=0,this.spaceWeatherAnnouncementTimer=0,this.spaceWeatherAnnouncementMessage="",this.stageSpecialAnnouncementTimer=0,this.stageSpecialAnnouncementMessage="",this.meteoShowerEventSystem.reset(),this.meteoShowerEffect.clear(),this.spaceWeatherEventSystem.reset(),this.spaceWeatherEffect.clear(),this.scoreSystem.setEventStarMultiplier?.(1),this.stageSpecialEventSystem.reset(),this.stageSpecialEffects.clear(),this.rainbowTrailEffect.clear(),this.resetBoostHintState(),this.touchGuide.hide(),this.syncPauseAvailability();const t=this.saveManager.markStageCleared(this.stageNumber);if(this.audioManager.playSFX("stageClear"),q("stageClear"),this.audioManager.stopBoostSFX(),this.boostFlameEffect.remove(),this.destinationPlanet){const a=this.getDestinationPlanetEffectRadius(this.destinationPlanet);this.planetRingEffect.start(this.threeScene,this.destinationPlanet,a,this.stageConfig.planetColor,this.particleBurstManager)}const e=this.scoreSystem.getStarCount(),i=this.saveManager.load().bestStageStars?.[this.stageNumber]??0;this.saveManager.updateBestStageStars(this.stageNumber,e),this.recordAttemptStats(!0);const s=Math.max(i,e),n=e>i;t&&(this.companionManager?.addCompanion(this.stageNumber),this.prefetchClearRewardOverlay()),this.showClearMessage(n,e,t,s),this.hud.announceStageClear(e,t,n),n&&this.audioManager.playSFX("rainbowCollect")}getClearRewardOverlay(){return this.clearRewardOverlay?Promise.resolve(this.clearRewardOverlay):this.clearRewardOverlayPromise?this.clearRewardOverlayPromise:(this.clearRewardOverlayPromise=this.loadEncyclopediaOverlay().then(({EncyclopediaOverlay:t})=>{const e=new t;return this.clearRewardOverlay=e,e}).finally(()=>{this.clearRewardOverlayPromise=null}),this.clearRewardOverlayPromise)}isCurrentClearRewardRequest(t){return this.isActive&&this.clearRewardRequestToken===t}restoreClearRewardButton(){this.stageClearOverlay.setRewardOpen(!1)}prefetchClearRewardOverlay(){this.clearRewardOverlay||this.clearRewardOverlayPromise||this.getClearRewardOverlay().catch(()=>{})}async openClearRewardOverlay(t){if(this.isClearRewardOpen||this.isOpeningClearReward)return;const e=this.clearRewardRequestToken;this.isOpeningClearReward=!0,this.stageClearOverlay.setRewardOpen(!0);try{const i=this.clearRewardOverlay??await this.getClearRewardOverlay();if(!this.isCurrentClearRewardRequest(e))return;if(!i.showStageDetail(this.stageNumber,()=>{this.isCurrentClearRewardRequest(e)&&(this.isClearRewardOpen=!1,this.syncPauseAvailability(),this.restoreClearRewardButton())},{bestStageStars:{[this.stageNumber]:t},backLabel:"クリアへ もどる",colorVisionSupportMode:this.saveManager.load().colorAccessibility?.colorVisionSupportMode??$,discoveredConstellations:this.saveManager.load().discoveredConstellations??[],zIndex:50})){this.restoreClearRewardButton();return}this.isClearRewardOpen=!0,this.syncPauseAvailability()}catch{if(!this.isCurrentClearRewardRequest(e))return;this.restoreClearRewardButton()}finally{this.clearRewardRequestToken===e&&(this.isOpeningClearReward=!1,this.syncPauseAvailability(),this.isClearRewardOpen||this.restoreClearRewardButton())}}showClearMessage(t=!1,e,i=!1,s){const n=e??this.scoreSystem.getStarCount(),a=s??n,o=this.launchSource==="encyclopedia"?void 0:Ze(this.stageNumber),h=i?ct(this.stageNumber):void 0;this.stageClearOverlay.show({stageNumber:this.stageNumber,starCount:n,bestStarCount:a,isBestUpdated:t,continueLabel:this.launchSource==="encyclopedia"?"タイトルへ":this.stageNumber>=z?"おいわいへ":"つぎへ",nextEntry:o,rewardEntry:h,onContinue:()=>{this.handleStageComplete()},onRetry:()=>{this.handleStageRetry()},onReward:h?()=>{this.openClearRewardOverlay(n)}:void 0})}revealClearActionButtonsIfReady(){this.clearTimer<v.CLEAR_CONTINUE_DELAY||this.stageClearOverlay.enableContinue()}getDestinationPlanetEffectRadius(t){const e=new ei().setFromObject(t);if(e.isEmpty())return 15;const i=e.getSize(new X);return Math.max(i.x,i.y,i.z)*.5}handleStageComplete(){const{totalScore:t,totalStarCount:e}=this.scoreSystem.finalizeStage();if(this.shouldPlayWormholeTransition()){this.startWormholeTransition({stageNumber:this.stageNumber+1,totalScore:t,totalStarCount:e});return}if(this.launchSource==="encyclopedia"){this.sceneManager.requestTransition("title");return}this.stageNumber>=z?this.sceneManager.requestTransition("ending",{totalScore:t,totalStarCount:e}):this.sceneManager.requestTransition("stage",{stageNumber:this.stageNumber+1,totalScore:t,totalStarCount:e})}shouldPlayWormholeTransition(){return this.launchSource==="campaign"&&this.stageNumber<z}startWormholeTransition(t){if(this.pendingWormholeTransition)return;const e=t.stageNumber??this.stageNumber+1,i=W(e);this.pendingWormholeTransition=t,this.wormholeTransitionTimer=0,this.stageClearOverlay.hide(),this.clearRewardOverlay?.hide(),this.isClearRewardOpen=!1,this.isOpeningClearReward=!1,this.wormholeTunnelEffect.start({sourceColor:this.stageConfig.planetColor,targetColor:i.planetColor,duration:v.WORMHOLE_TRANSITION_DURATION,particleCount:72,rayCount:20}),this.audioManager.playSFX("wormhole")}updateWormholeTransition(t){if(!this.pendingWormholeTransition||(this.wormholeTransitionTimer+=t,this.wormholeTunnelEffect.update(t,this.camera),this.wormholeTransitionTimer<v.WORMHOLE_TRANSITION_DURATION))return!1;const e=this.pendingWormholeTransition;return this.pendingWormholeTransition=null,this.wormholeTransitionTimer=0,this.wormholeTunnelEffect.clear(),this.sceneManager.requestTransition("stage",e),!0}handleStageRetry(){const t={stageNumber:this.stageNumber,totalScore:this.stageEntryTotalScore,totalStarCount:this.stageEntryTotalStarCount,replayToken:Date.now()+Math.random()};this.launchSource!=="campaign"&&(t.launchSource=this.launchSource),this.sceneManager.requestTransition("stage",t)}recordAttemptStats(t){this.attemptStatsRecorded||(this.attemptStatsRecorded=!0,this.saveManager.recordGameplaySession?.({stageNumber:this.stageNumber,playTimeSeconds:this.playTime,collectedStars:this.scoreSystem.getStarCount(),boostUses:this.boostSystem.getActivationCount(),stageCleared:t}))}exit(){this.initialized&&(this.recordAttemptStats(this.isCleared),this.isActive=!1,this.prewarmRequestToken+=1,this.clearRewardRequestToken+=1,this.clearRewardOverlay?.hide(),this.stageClearOverlay.hide(),this.isClearRewardOpen=!1,this.isOpeningClearReward=!1,this.pauseOverlay.hide(),this.touchGuide.hide(),this.adaptiveTutorialHint.hide(),this.constellationHintOverlay.hide(),this.seasonalEventNotice.dispose(),this.frameRateHintOverlay.hide(),this.hud.hide(),this.scorePopupManager.dispose(),Nt(null),this.audioManager.stopBGM(),this.audioManager.stopBoostSFX(),this.wormholeTunnelEffect.clear(),this.pendingWormholeTransition=null,this.wormholeTransitionTimer=0,this.stageIntroOverlay&&(this.stageIntroOverlay.dispose(),this.stageIntroOverlay=null),this.countdownOverlay&&(this.countdownOverlay.dispose(),this.countdownOverlay=null),this.resumeCountdownOverlay&&(this.resumeCountdownOverlay.dispose(),this.resumeCountdownOverlay=null),this.isStarting=!1,this.awaitingResume=!1,this.isHomeConfirmOpen=!1,this.shouldResumeAfterHomeConfirm=!1,this.isPauseOpen=!1,this.shouldResumeAfterPause=!1,this.boostFlameEffect.remove(),this.boostLinesEffect.update(!1,this.spaceship.position.x,this.spaceship.position.z),this.airShield.reset(this.spaceship.position.x,this.spaceship.position.y,this.spaceship.position.z),this.planetRingEffect.clear(),this.meteoShowerEffect.clear(),this.spaceWeatherEffect.clear(),this.stageSpecialEffects.clear(),this.seasonalEventEffects.clear(),this.spaceWeatherEventSystem.reset(),this.seasonalEventSystem.clear(),this.scoreSystem.setEventStarMultiplier?.(1),this.frameRateHintOverlay.dispose(),this.resetStageObjects(),this.bgStars&&(this.bgStars.parent?.remove(this.bgStars),this.bgStars=null))}getThreeScene(){return this.threeScene}getCamera(){const{width:t,height:e}=H(),i=t/e;return i!==this.lastAspect&&Number.isFinite(i)&&i>0&&(this.camera.aspect=i,this.camera.updateProjectionMatrix(),this.lastAspect=i),this.camera}applyVisualQualityTier(){const t=this.getEffectiveVisualQualityTier();if(this.particleBurstManager.setQualityTier(t),this.lodSystem.setQualityTier(t),!this.initialized){this.bgStars&&this.bgStars.geometry.setDrawRange(0,this.getBackgroundStarDrawCount());return}this.boostLinesEffect.setQualityTier(t),this.boostFlameEffect.setQualityTier(t),this.stageAtmosphereEffect.setQualityTier(t),this.wormholeTunnelEffect.setQualityTier(t),this.bgStars&&this.bgStars.geometry.setDrawRange(0,this.getBackgroundStarDrawCount())}getBackgroundStarDrawCount(){const t=Ct(this.motionSensitivity);return Math.max(1,Math.round(v.BG_STAR_COUNT*v.getVisualQualityScale(this.getEffectiveVisualQualityTier())*t.particleDensityScale))}applyMotionSensitivity(){this.initialized&&(this.boostLinesEffect.setMotionSensitivity(this.motionSensitivity),this.boostFlameEffect.setMotionSensitivity(this.motionSensitivity),this.stageAtmosphereEffect.setMotionSensitivity(this.motionSensitivity),this.wormholeTunnelEffect.setMotionSensitivity(this.motionSensitivity))}static clampVisualQualityTier(t){const e=v.VISUAL_QUALITY_SCALE_BY_TIER.length-1;return Math.max(0,Math.min(e,Math.round(t)))}static clampPerformanceAdaptationLevel(t){const e=v.VISUAL_QUALITY_SCALE_BY_TIER.length-1;return Math.max(0,Math.min(e,Math.round(t)))}static getVisualQualityScale(t){return v.VISUAL_QUALITY_SCALE_BY_TIER[v.clampVisualQualityTier(t)]}getEffectiveVisualQualityTier(){return v.clampVisualQualityTier(this.visualQualityTier-this.performanceAdaptationLevel)}}const Zi=Object.freeze(Object.defineProperty({__proto__:null,StageScene:v,__resetStageSceneSharedAssetCachesForTest:pi,__stageSceneSharedAssetCachesForTest:gi,prewarmStageVisualAssets:zt},Symbol.toStringTag,{value:"Module"}));class Ni{constructor(t,e,i,s,n={}){this.sceneManager=t,this.inputSystem=e,this.audioManager=i,this.saveManager=s,this.randomProvider=n.randomProvider??Math.random,this.effectSystem=n.effectSystem??new Qe({randomProvider:this.randomProvider}),this.stageDurationSeconds=n.stageDurationSeconds??8;const{width:a,height:o}=H();this.camera=new vt(60,a/o,.1,1400),this.camera.position.set(0,2.8,12),this.threeScene.background=new at(32),this.directionalLight.position.set(4,6,5),this.stageAtmosphereEffect.init(this.threeScene),this.effectSystem.init(this.threeScene)}threeScene=new nt;ambientLight=new bt(16777215,1.1);directionalLight=new ne(16777215,.7);camera;stageAtmosphereEffect=new ee;randomProvider;effectSystem;stageDurationSeconds;overlayButtonCleanups=new Set;currentLookAt=new X;ship=null;companionManager=null;backgroundStars=null;currentPlanet=null;currentPlanetSpinTarget=null;overlay=null;stageLabel=null;companionBadge=null;currentStageNumber=1;currentStageConfig=W(1);stageTimeRemaining=0;lastAspect=0;isActive=!1;enter(t){this.isActive=!0,this.lastAspect=0,this.inputSystem.resetPointers?.(),this.setupSceneObjects(),this.createOverlay(),this.audioManager.playBGM(0)}update(t){if(!this.isActive||!this.ship)return;const e=Math.max(0,t),i=this.inputSystem.getState();i.moveDirection<0?this.ship.moveLeft(e):i.moveDirection>0&&this.ship.moveRight(e),this.ship.update(e);const s=this.ship.mesh.position;this.companionManager?.update(e,s.x,s.y+1.15,s.z+.8),this.effectSystem.update(e,s),this.stageAtmosphereEffect.update(e,this.camera,s.x,s.z),this.updateCamera(),this.updatePlanet(e),this.updateStageRotation(e),this.backgroundStars&&(this.backgroundStars.rotation.y+=e*.02,dt(this.backgroundStars,s.z,1))}exit(){this.isActive=!1,this.inputSystem.resetPointers?.(),this.audioManager.stopBGM(),this.effectSystem.clear(),this.stageAtmosphereEffect.clear(),this.companionManager?.dispose(),this.companionManager=null,this.ship?.dispose(),this.ship=null,this.clearPlanet(),this.backgroundStars&&(this.backgroundStars.parent?.remove(this.backgroundStars),this.backgroundStars=null);const t=Array.from(this.overlayButtonCleanups);this.overlayButtonCleanups.clear();for(const e of t)e();this.overlay?.remove(),this.overlay=null,this.stageLabel=null,this.companionBadge=null}getThreeScene(){return this.threeScene}getCamera(){const{width:t,height:e}=H(),i=t/e;return i!==this.lastAspect&&Number.isFinite(i)&&i>0&&(this.camera.aspect=i,this.camera.updateProjectionMatrix(),this.lastAspect=i),this.camera}setupSceneObjects(){this.threeScene.background=new at(32),this.ambientLight.parent||this.threeScene.add(this.ambientLight),this.directionalLight.parent||this.threeScene.add(this.directionalLight),this.backgroundStars=le(2e3),this.backgroundStars.name="free-play-background-stars",this.threeScene.add(this.backgroundStars);const t=this.saveManager.load();this.ship=new ie(t.spaceshipCustomization),this.ship.mesh.name="free-play-spaceship",this.ship.mesh.position.set(0,-.3,0),this.ship.boundaryMin=-9,this.ship.boundaryMax=9,this.threeScene.add(this.ship.mesh),this.companionManager=new Rt([...new Set(t.unlockedPlanets)]);const e=this.companionManager.getGroup();e.name="free-play-companions",this.threeScene.add(e),this.updateCompanionBadge(),this.applyStage(this.pickRandomStage())}createOverlay(){const t=document.getElementById("ui-overlay");if(!t)return;this.overlay=document.createElement("div"),this.overlay.setAttribute("data-free-play-overlay",""),this.overlay.style.cssText=`
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
    `,i.append(s,this.stageLabel,this.companionBadge);const n=document.createElement("button");n.textContent="もどる",n.setAttribute("data-free-play-back-button",""),n.style.cssText=`
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
    `,this.overlayButtonCleanups.add(P(n,{onActivate:()=>{this.inputSystem.resetPointers?.(),this.sceneManager.requestTransition("title")},onPressChange:o=>{n.style.transform=o?"scale(0.96)":"scale(1)"}})),e.append(i,n);const a=document.createElement("div");a.style.cssText=`
      align-self: center;
      padding: 0.7rem 1.1rem;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.28);
      color: #fff;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 0.95rem;
      font-weight: 700;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    `,a.textContent="← → で ゆったり うちゅうさんぽ",this.overlay.append(e,a),t.appendChild(this.overlay),this.updateStageLabel(),this.updateCompanionBadge()}updateCamera(){if(!this.ship)return;const t=this.ship.mesh.position;this.camera.position.x+=(t.x*.32-this.camera.position.x)*.12,this.camera.position.y=2.8,this.camera.position.z=t.z+12,this.currentLookAt.set(t.x*.18,t.y+.4,t.z-18),this.camera.lookAt(this.currentLookAt)}updatePlanet(t){!this.currentPlanet||!this.ship||(this.currentPlanet.position.set(0,.5,this.ship.mesh.position.z-52),this.currentPlanet.rotation.y+=t*.08,this.currentPlanetSpinTarget?.rotateY(t*.22))}updateStageRotation(t){this.stageTimeRemaining-=t,!(this.stageTimeRemaining>0)&&this.applyStage(this.pickRandomStage(this.currentStageNumber))}applyStage(t){this.currentStageNumber=t,this.currentStageConfig=W(t),this.stageTimeRemaining=this.sampleStageDuration(),this.clearPlanet();const{planet:e,spinTarget:i}=re(t,this.currentStageConfig,-52);e.name="free-play-stage-planet",this.currentPlanet=e,this.currentPlanetSpinTarget=i,this.threeScene.add(e),this.stageAtmosphereEffect.start(se(t)),this.effectSystem.setCurrentStage(t),this.updateStageLabel()}clearPlanet(){this.currentPlanet&&(this.currentPlanet.parent?.remove(this.currentPlanet),this.currentPlanet=null,this.currentPlanetSpinTarget=null)}updateStageLabel(){this.stageLabel&&(this.stageLabel.textContent=`${this.currentStageConfig.emoji} ${this.currentStageConfig.destinationReading}の そらで あそんでるよ`)}updateCompanionBadge(){if(!this.companionBadge)return;const t=this.companionManager?.getCount()??0;this.companionBadge.textContent=t>0?`👾 なかま ${t}にん と いっしょ！`:"👾 なかまを あつめると ここに くるよ！"}sampleStageDuration(){return this.stageDurationSeconds*(.8+this.randomProvider()*.4)}pickRandomStage(t){const e=Array.from({length:z},(n,a)=>a+1),i=t===void 0?e:e.filter(n=>n!==t),s=Math.min(i.length-1,Math.floor(this.randomProvider()*i.length));return i[s]}}const qi=Object.freeze(Object.defineProperty({__proto__:null,FreePlayScene:Ni},Symbol.toStringTag,{value:"Module"}));let it=null,st=null;function Fi(){if(!it){const l=new Ot,t=new Float32Array(3e3);for(let e=0;e<3e3;e++)t[e]=(Math.random()-.5)*200;l.setAttribute("position",new It(t,3)),it=l}return it}function _i(){return st||(st=new Dt({color:16777215,size:.3})),st}function $i(){it=null,st=null}const Vi={getBgStarsGeometry:()=>it,getBgStarsMaterial:()=>st};class G{static CIRCLE_RADIUS=3;static POPIN_DELAY=.2;static POPIN_DURATION=.3;static BOUNCE_SPEED=3;static BOUNCE_HEIGHT=.5;static THANK_YOU_DELAY=2.5;threeScene;camera;lastAspect=0;sceneManager;saveManager;audioManager;overlay=null;muteHandle=null;bgStars=null;companionMeshes=[];companionGroup=null;circleX=[];circleZ=[];popinSettled=[];celebrationElapsed=0;thankYouShown=!1;canExit=!1;exitTriggered=!1;exitCta=null;constructor(t,e,i){this.sceneManager=t,this.saveManager=e,this.audioManager=i,this.threeScene=new nt;const{width:s,height:n}=H();this.camera=new vt(60,s/n,.1,1e3),this.camera.position.set(0,0,5)}enter(t){this.lastAspect=0,this.canExit=!1,this.exitTriggered=!1,this.exitCta=null;const e=t.totalScore??0,i=t.totalStarCount??0;this.threeScene=new nt,this.threeScene.background=new at(48),this.bgStars=new kt(Fi(),_i()),this.bgStars.userData.sharedAssets=!0,this.bgStars.rotation.set(0,0,0),this.threeScene.add(this.bgStars),this.threeScene.add(new bt(16777215,1));const s=this.saveManager.load();s.clearedStage=0,this.saveManager.save(s),this.audioManager.playBGM(-1),this.setupCelebration(),this.createOverlay(e,i),this.createMuteButton()}createMuteButton(){const t=document.getElementById("hud")??document.getElementById("ui-overlay");t&&(this.muteHandle=Gt({initialMuted:this.audioManager.isMuted(),container:t,onToggle:()=>{const e=this.audioManager.toggleMute();this.muteHandle?.setMuted(e);const i=this.saveManager.load();i.muted=e,this.saveManager.save(i)}}))}createOverlay(t,e){const i=document.getElementById("ui-overlay");if(!i)return;this.overlay=document.createElement("div"),this.overlay.setAttribute("data-ending-overlay",""),this.overlay.style.cssText=`
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
    `,this.overlay.appendChild(s),this.overlay.appendChild(n),this.overlay.appendChild(a),this.overlay.appendChild(this.exitCta),i.appendChild(this.overlay)}update(t){this.bgStars&&(this.bgStars.rotation.y+=t*.03),this.updateCelebration(t)}setupCelebration(){this.companionGroup=new ut,this.companionMeshes=[],this.circleX.length=0,this.circleZ.length=0,this.popinSettled.length=0,this.celebrationElapsed=0,this.thankYouShown=!1,this.canExit=!1,this.exitTriggered=!1;for(let t=0;t<J.length;t++){const e=J[t],i=Rt.createCompanionMesh(e),s=t*(2*Math.PI/J.length),n=Math.cos(s)*G.CIRCLE_RADIUS,a=Math.sin(s)*G.CIRCLE_RADIUS;this.circleX.push(n),this.circleZ.push(a),i.position.set(n,0,a),i.scale.set(0,0,0),this.companionMeshes.push(i),this.popinSettled.push(!1),this.companionGroup.add(i)}this.threeScene.add(this.companionGroup)}updateCelebration(t){if(this.companionMeshes.length===0)return;this.celebrationElapsed+=t;const e=G.POPIN_DELAY*(this.companionMeshes.length-1)+G.POPIN_DURATION,i=this.celebrationElapsed>e,s=i?Math.abs(Math.sin(this.celebrationElapsed*G.BOUNCE_SPEED))*G.BOUNCE_HEIGHT:0;for(let n=0;n<this.companionMeshes.length;n++){const a=this.companionMeshes[n];if(this.popinSettled[n]){i&&(a.position.y=s),a.rotation.y+=t*2;continue}const o=n*G.POPIN_DELAY;if(!(this.celebrationElapsed<o)){if(this.celebrationElapsed<o+G.POPIN_DURATION){const h=(this.celebrationElapsed-o)/G.POPIN_DURATION,d=this.bounceEase(h);a.scale.set(d,d,d)}else a.scale.set(1,1,1),this.popinSettled[n]=!0;i&&(a.position.y=s),a.rotation.y+=t*2}}!this.thankYouShown&&this.celebrationElapsed>=G.THANK_YOU_DELAY&&(this.showThankYouText(),this.thankYouShown=!0)}bounceEase(t){return t<.6?t/.6*1.2:1.2-(t-.6)/.4*.2}showThankYouText(){if(!this.overlay||!this.exitCta)return;const t=document.createElement("div");t.setAttribute("data-ending-thank-you",""),t.textContent="みんな ありがとう！",t.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 2rem;
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
      margin-bottom: 1.5rem;
      opacity: 0;
      transition: opacity 0.5s ease-in;
    `,this.overlay.insertBefore(t,this.exitCta),this.exitCta.style.visibility="visible",this.canExit=!0,requestAnimationFrame(()=>{t.style.opacity="1",this.exitCta&&(this.exitCta.style.opacity="1")})}handleOverlayPointerDown(t){if(!this.canExit||this.exitTriggered)return;const e=t.target;e instanceof HTMLElement&&e.closest("[data-mute-button]")||(this.exitTriggered=!0,this.sceneManager.requestTransition("title"))}exit(){this.audioManager.stopBGM(),this.bgStars&&(this.threeScene.remove(this.bgStars),this.bgStars=null),this.companionGroup&&(this.threeScene.remove(this.companionGroup),this.companionMeshes=[],this.companionGroup=null),this.overlay&&(this.overlay.remove(),this.overlay=null),this.exitCta=null,this.canExit=!1,this.exitTriggered=!1,this.muteHandle&&(this.muteHandle.remove(),this.muteHandle=null)}getThreeScene(){return this.threeScene}getCamera(){const{width:t,height:e}=H(),i=t/e;return i!==this.lastAspect&&Number.isFinite(i)&&i>0&&(this.camera.aspect=i,this.camera.updateProjectionMatrix(),this.lastAspect=i),this.camera}}const Yi=Object.freeze(Object.defineProperty({__proto__:null,EndingScene:G,__endingSceneSharedAssetsForTest:Vi,__resetEndingSceneSharedAssetsForTest:$i},Symbol.toStringTag,{value:"Module"}));export{Yi as E,qi as F,Zi as S,Wi as T,P as a,Pt as c};
