import{o as _,p as z,q as I,P as N,d as F}from"./game-core-Dbp0ekY0.js";import{p as G,P as H,o as B,q as j}from"./three-D-dORC6w.js";import{a as w,c as T}from"./game-scenes-DQN19fUs.js";const D=120,Z=1.5,V=.015;function W(y={}){const t=y.createRenderer??_,m=y.createPreviewMesh??z,e=y.raf??requestAnimationFrame,i=y.caf??cancelAnimationFrame;let l=!1,n=!1,s=null,o=null,r=null,a=null,c=null,d=null,p=null,f=null,u=!1;const h=()=>s||(s=document.createElement("canvas"),s.setAttribute("data-companion-preview-canvas",""),s.style.cssText=`
      width: 100%;
      height: 100%;
      display: block;
    `,s),g=()=>o||(o=document.createElement("div"),o.setAttribute("data-companion-preview-fallback",""),o.textContent="👾",o.style.cssText=`
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.35));
    `,o),v=()=>{u&&(u=!1,f!==null&&(i(f),f=null))},S=()=>{!a||!d||(a.remove(d),I(d),d=null)},L=()=>{p?.replaceChildren(),s?.remove(),o?.remove(),p=null},R=()=>{!r||!a||!c||r.render(a,c)},M=()=>{if(u||!r||!a||!c||!d)return;u=!0;const C=()=>{!u||l||!r||!a||!c||!d||(d.rotation.y+=V,r.render(a,c),f=e(C))};f=e(C)},k=()=>{if(r&&a&&c)return!0;if(!(typeof window<"u"&&(typeof window.WebGLRenderingContext<"u"||typeof window.WebGL2RenderingContext<"u"))||n)return n=!0,!1;try{const b=Math.min(typeof window<"u"&&window.devicePixelRatio||1,Z),E=t(h(),b);E.setPixelRatio(b),E.setSize(D,D,!1),E.setClearColor(0,0);const A=new G,P=new H(32,1,.1,20);P.position.set(0,.15,3.1);const O=new B(16777215,1.5),$=new j(16777215,1.2);return $.position.set(2,3,4),A.add(O,$),r=E,a=A,c=P,!0}catch{return s?.remove(),r=null,a=null,c=null,n=!0,!1}};return{show(C,b){if(!l){if(v(),S(),p=b,!k()){b.replaceChildren(g());return}b.replaceChildren(h()),d=m(C),a?.add(d),R(),M()}},hide(){l||(v(),S(),L())},dispose(){l||(this.hide(),l=!0,r?.forceContextLoss?.(),r?.dispose(),r=null,a=null,c=null,s=null,o=null)}}}class x{static RELEASE_CONFIRM_MOVE_TOLERANCE_PX=12;overlayEl=null;detailEl=null;isShowingDetail=!1;onSelectStage=null;bestStageStars={};detailBackLabel="もどる";detailPreviewController=null;createPreviewController;galleryActionCleanups=new Set;detailActionCleanups=new Set;static COMPACT_HEIGHT_THRESHOLD=720;constructor(t={}){this.createPreviewController=t.createPreviewController??W}show(t,m,e,i){if(this.overlayEl)return;this.onSelectStage=e??null,this.bestStageStars=i??{},this.detailBackLabel="もどる";const l=document.getElementById("ui-overlay");if(!l)return;this.overlayEl=document.createElement("div"),this.applyOverlayStyle(this.overlayEl,30);const n=this.isCompactHeight(),s=document.createElement("div");s.setAttribute("data-gallery-content",""),s.style.cssText=`
      width: min(960px, 100%);
      max-height: calc(100% - ${n?"0.5rem":"1rem"});
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow-y: auto;
      padding: ${n?"0.75rem 0.35rem 1rem":"0.5rem"};
      box-sizing: border-box;
    `;const o=document.createElement("div");o.textContent="わくせいずかん",o.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${n?"1.7rem":"2rem"};
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
      margin-bottom: ${n?"0.9rem":"1.5rem"};
      text-align: center;
    `,s.appendChild(o);const r=document.createElement("div");r.setAttribute("data-gallery-grid",""),r.style.cssText=`
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(${n?"110px":"140px"}, 1fr));
      gap: ${n?"0.7rem":"1rem"};
      width: min(100%, 820px);
      justify-items: center;
    `;for(const c of N){const d=t.includes(c.stageNumber),p=this.createCard(c,d,n);r.appendChild(p)}s.appendChild(r);const a=document.createElement("button");a.setAttribute("data-gallery-back",""),a.textContent="もどる",a.style.cssText=`
      margin-top: ${n?"0.9rem":"1.5rem"};
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${n?"1.15rem":"1.4rem"};
      font-weight: 700;
      padding: ${n?"0.55rem 1.6rem":"0.6rem 2rem"};
      border: none;
      border-radius: 1.5rem;
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
      cursor: pointer;
      touch-action: manipulation;
      transform: scale(1);
      transition: transform 0.08s ease-out;
    `,this.galleryActionCleanups.add(w(a,{onActivate:()=>{this.hide(),m()},onPressChange:c=>{a.style.transform=c?"scale(0.96)":"scale(1)"},moveTolerancePx:x.RELEASE_CONFIRM_MOVE_TOLERANCE_PX})),s.appendChild(a),this.overlayEl.appendChild(s),l.appendChild(this.overlayEl)}showStageDetail(t,m,e={}){if(this.overlayEl)return!1;const i=F(t);if(!i)return!1;this.onSelectStage=null,this.bestStageStars=e.bestStageStars??{},this.detailBackLabel=e.backLabel??"もどる";const l=document.getElementById("ui-overlay");return l?(this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-encyclopedia-detail-overlay",""),this.applyOverlayStyle(this.overlayEl,e.zIndex??30),l.appendChild(this.overlayEl),this.showDetail(i,m),!0):!1}applyOverlayStyle(t,m){t.style.cssText=`
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 32, 0.95);
      pointer-events: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: ${this.isCompactHeight()?"flex-start":"center"};
      padding: ${this.isCompactHeight()?"0.75rem":"1.25rem"};
      box-sizing: border-box;
    `,t.style.zIndex=String(m)}hide(){this.cleanupActionCleanups(this.detailActionCleanups),this.cleanupActionCleanups(this.galleryActionCleanups),this.hideDetailPreview(),this.detailEl&&(this.detailEl.remove(),this.detailEl=null),this.overlayEl&&(this.overlayEl.remove(),this.overlayEl=null),this.isShowingDetail=!1,this.onSelectStage=null,this.bestStageStars={},this.detailBackLabel="もどる",this.disposeDetailPreview()}createCard(t,m,e){const i=document.createElement("div");if(i.setAttribute("data-card",""),i.setAttribute("data-stage",String(t.stageNumber)),i.style.cssText=`
      min-height: ${e?"96px":"120px"};
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: ${e?"0.65rem":"0.8rem"};
      width: 100%;
      max-width: ${e?"150px":"180px"};
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      transition: transform 0.12s ease-out;
      transform: scale(1);
      box-sizing: border-box;
    `,m){const l="#"+t.planetColor.toString(16).padStart(6,"0");i.style.background=`linear-gradient(135deg, ${l}88, ${l}44)`,i.style.cursor="pointer";const n=document.createElement("div");n.textContent=t.emoji,n.style.fontSize=e?"1.7rem":"2rem",i.appendChild(n);const s=document.createElement("div");s.textContent=t.encyclopediaLabel,s.style.cssText=`
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${e?"0.9rem":"1rem"};
        font-weight: 700;
        color: #fff;
        margin-top: 0.3rem;
      `,i.appendChild(s);const o=this.bestStageStars[t.stageNumber]??0,r=T(t.stageNumber,o,{hint:o>0?`⭐ ベスト ${o}`:void 0,size:"compact",scope:"encyclopedia-card"});r.style.marginTop="0.35rem",i.appendChild(r),this.galleryActionCleanups.add(w(i,{onActivate:()=>{this.showDetail(t)},onPressChange:a=>{i.style.transform=a?"scale(0.95)":"scale(1)"},moveTolerancePx:x.RELEASE_CONFIRM_MOVE_TOLERANCE_PX}))}else{i.style.background="#444",i.style.opacity="0.6",i.style.pointerEvents="none";const l=document.createElement("div");l.textContent="？？？",l.style.cssText=`
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${e?"1rem":"1.2rem"};
        color: #aaa;
        text-align: center;
      `,i.appendChild(l)}return i}showDetail(t,m){if(this.isShowingDetail||!this.overlayEl)return;this.isShowingDetail=!0,this.cleanupActionCleanups(this.detailActionCleanups);const e=this.isCompactHeight();this.detailEl=document.createElement("div"),this.detailEl.setAttribute("data-detail",""),this.detailEl.style.cssText=`
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: ${e?"flex-start":"center"};
      background: rgba(0, 0, 32, 0.9);
      z-index: 31;
      padding: ${e?"0.75rem":"1.25rem"};
      box-sizing: border-box;
    `;const i="#"+t.planetColor.toString(16).padStart(6,"0"),l=document.createElement("div");l.setAttribute("data-detail-content",""),l.style.cssText=`
      width: min(460px, 100%);
      max-height: calc(100% - ${e?"0.5rem":"1rem"});
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow-y: auto;
      padding: ${e?"0.25rem 0.1rem 1rem":"0.25rem"};
      box-sizing: border-box;
    `;const n=document.createElement("div");n.setAttribute("data-detail-card",""),n.style.cssText=`
      width: min(${e?"340px":"400px"}, 100%);
      max-height: calc(100vh - ${e?"8.5rem":"10rem"});
      background: linear-gradient(135deg, ${i}88, ${i}44);
      border-radius: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: ${e?"1.1rem 1rem":"2rem"};
      overflow-y: auto;
      box-sizing: border-box;
    `;const s=document.createElement("div");s.textContent=t.emoji,s.style.fontSize=e?"3rem":"4rem",n.appendChild(s);const o=document.createElement("div");o.textContent=t.encyclopediaLabel,o.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${e?"1.6rem":"2rem"};
      font-weight: 700;
      color: #FFD700;
      margin: 0.5rem 0;
      text-align: center;
    `,n.appendChild(o);const r=document.createElement("div");r.setAttribute("data-detail-companion",""),r.style.cssText=`
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.6rem;
      margin-top: 0.4rem;
    `;const a=document.createElement("div");a.textContent="うちゅうの なかま",a.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${e?"0.9rem":"1rem"};
      font-weight: 700;
      color: #fff;
      letter-spacing: 0.04em;
    `,r.appendChild(a);const c=document.createElement("div");c.setAttribute("data-detail-companion-preview",""),c.style.cssText=`
      width: ${e?"96px":"120px"};
      height: ${e?"96px":"120px"};
      border-radius: 20px;
      overflow: hidden;
      background: radial-gradient(circle at top, rgba(255,255,255,0.22), rgba(0,0,0,0.16));
      box-shadow: inset 0 0 18px rgba(255,255,255,0.12), 0 10px 20px rgba(0,0,0,0.22);
    `,r.appendChild(c),this.getDetailPreviewController().show(t,c),n.appendChild(r);const d=document.createElement("div");d.textContent=t.trivia,d.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${e?"1rem":"1.2rem"};
      color: #fff;
      line-height: ${e?"1.65":"1.8"};
      padding: ${e?"1rem 0.4rem":"1.5rem"};
      text-align: center;
    `,n.appendChild(d);const p=this.bestStageStars[t.stageNumber]??0,f=T(t.stageNumber,p,{label:"メダル",hint:p>0?`⭐ ベスト ${p}`:void 0,size:"hero",scope:"encyclopedia-detail"});if(f.style.marginTop="0.4rem",n.appendChild(f),this.onSelectStage){const h=document.createElement("button");h.setAttribute("data-detail-play",""),h.textContent="このステージで あそぶ",h.style.cssText=`
        margin-top: ${e?"0.8rem":"1rem"};
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${e?"1.05rem":"1.2rem"};
        font-weight: 700;
        padding: ${e?"0.75rem 1.2rem":"0.8rem 1.6rem"};
        border: none;
        border-radius: 1.5rem;
        background: linear-gradient(135deg, #FF6B6B, #FFE66D);
        color: #333;
        cursor: pointer;
        touch-action: manipulation;
        transform: scale(1);
        transition: transform 0.08s ease-out;
      `,this.detailActionCleanups.add(w(h,{onActivate:()=>{const g=this.onSelectStage;if(!g)return;const v=t.stageNumber;this.hide(),g(v)},onPressChange:g=>{h.style.transform=g?"scale(0.96)":"scale(1)"},moveTolerancePx:x.RELEASE_CONFIRM_MOVE_TOLERANCE_PX})),n.appendChild(h)}l.appendChild(n);const u=document.createElement("button");u.setAttribute("data-detail-back",""),u.textContent=this.detailBackLabel,u.style.cssText=`
      margin-top: ${e?"0.9rem":"1.5rem"};
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${e?"1.15rem":"1.4rem"};
      font-weight: 700;
      padding: ${e?"0.55rem 1.6rem":"0.6rem 2rem"};
      border: none;
      border-radius: 1.5rem;
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
      cursor: pointer;
      touch-action: manipulation;
      transform: scale(1);
      transition: transform 0.08s ease-out;
    `,this.detailActionCleanups.add(w(u,{onActivate:()=>{if(m){this.hide(),m();return}this.hideDetail()},onPressChange:h=>{u.style.transform=h?"scale(0.96)":"scale(1)"},moveTolerancePx:x.RELEASE_CONFIRM_MOVE_TOLERANCE_PX})),l.appendChild(u),this.detailEl.appendChild(l),this.overlayEl.appendChild(this.detailEl)}hideDetail(){this.cleanupActionCleanups(this.detailActionCleanups),this.hideDetailPreview(),this.detailEl&&(this.detailEl.remove(),this.detailEl=null),this.isShowingDetail=!1}getDetailPreviewController(){return this.detailPreviewController||(this.detailPreviewController=this.createPreviewController()),this.detailPreviewController}hideDetailPreview(){this.detailPreviewController?.hide()}disposeDetailPreview(){this.detailPreviewController?.dispose(),this.detailPreviewController=null}cleanupActionCleanups(t){for(const m of t)m();t.clear()}isCompactHeight(){return window.innerHeight<=x.COMPACT_HEIGHT_THRESHOLD}}export{x as EncyclopediaOverlay};
