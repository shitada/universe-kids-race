import{x as k,y as z,z as N,P as F,d as O}from"./game-core-DJPUxdH9.js";import{s as G,P as H,r as B,t as j}from"./three-By3JikJA.js";import{a as A,c as P}from"./game-scenes-BEyrVbRt.js";const $=120,Z=1.5,V=.015;function W(C={}){const t=C.createRenderer??k,c=C.createPreviewMesh??z,e=C.raf??requestAnimationFrame,i=C.caf??cancelAnimationFrame;let s=!1,r=!1,n=null,o=null,a=null,l=null,d=null,m=null,f=null,g=null,u=!1;const h=()=>n||(n=document.createElement("canvas"),n.setAttribute("data-companion-preview-canvas",""),n.style.cssText=`
      width: 100%;
      height: 100%;
      display: block;
    `,n),b=()=>o||(o=document.createElement("div"),o.setAttribute("data-companion-preview-fallback",""),o.textContent="👾",o.style.cssText=`
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.35));
    `,o),y=()=>{u&&(u=!1,g!==null&&(i(g),g=null))},w=()=>{!l||!m||(l.remove(m),N(m),m=null)},D=()=>{f?.replaceChildren(),n?.remove(),o?.remove(),f=null},I=()=>{!a||!l||!d||a.render(l,d)},_=()=>{if(u||!a||!l||!d||!m)return;u=!0;const x=()=>{!u||s||!a||!l||!d||!m||(m.rotation.y+=V,a.render(l,d),g=e(x))};g=e(x)},R=()=>{if(a&&l&&d)return!0;if(!(typeof window<"u"&&(typeof window.WebGLRenderingContext<"u"||typeof window.WebGL2RenderingContext<"u"))||r)return r=!0,!1;try{const E=Math.min(typeof window<"u"&&window.devicePixelRatio||1,Z),v=t(h(),E);v.setPixelRatio(E),v.setSize($,$,!1),v.setClearColor(0,0);const S=new G,T=new H(32,1,.1,20);T.position.set(0,.15,3.1);const M=new B(16777215,1.5),L=new j(16777215,1.2);return L.position.set(2,3,4),S.add(M,L),a=v,l=S,d=T,!0}catch{return n?.remove(),a=null,l=null,d=null,r=!0,!1}};return{show(x,E){if(!s){if(y(),w(),f=E,!R()){E.replaceChildren(b());return}E.replaceChildren(h()),m=c(x),l?.add(m),I(),_()}},hide(){s||(y(),w(),D())},dispose(){s||(this.hide(),s=!0,a?.forceContextLoss?.(),a?.dispose(),a=null,l=null,d=null,n=null,o=null)}}}class p{static RELEASE_CONFIRM_MOVE_TOLERANCE_PX=12;static GALLERY_TITLE_ID="encyclopedia-gallery-title";static DETAIL_TITLE_ID="encyclopedia-detail-title";overlayEl=null;detailEl=null;isShowingDetail=!1;onSelectStage=null;bestStageStars={};detailBackLabel="もどる";detailPreviewController=null;createPreviewController;galleryActionCleanups=new Set;detailActionCleanups=new Set;static COMPACT_HEIGHT_THRESHOLD=720;constructor(t={}){this.createPreviewController=t.createPreviewController??W}show(t,c,e,i){if(this.overlayEl)return;this.onSelectStage=e??null,this.bestStageStars=i??{},this.detailBackLabel="もどる";const s=document.getElementById("ui-overlay");if(!s)return;this.overlayEl=document.createElement("div"),this.applyOverlayStyle(this.overlayEl,30),this.overlayEl.setAttribute("role","dialog"),this.overlayEl.setAttribute("aria-modal","true"),this.overlayEl.setAttribute("aria-labelledby",p.GALLERY_TITLE_ID);const r=this.isCompactHeight(),n=document.createElement("div");n.setAttribute("data-gallery-content",""),n.style.cssText=`
      width: min(960px, 100%);
      max-height: calc(100% - ${r?"0.5rem":"1rem"});
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow-y: auto;
      padding: ${r?"0.75rem 0.35rem 1rem":"0.5rem"};
      box-sizing: border-box;
    `;const o=document.createElement("div");o.id=p.GALLERY_TITLE_ID,o.textContent="わくせいずかん",o.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${r?"1.7rem":"2rem"};
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
      margin-bottom: ${r?"0.9rem":"1.5rem"};
      text-align: center;
    `,n.appendChild(o);const a=document.createElement("div");a.setAttribute("data-gallery-grid",""),a.setAttribute("aria-label","わくせい の いちらん"),a.style.cssText=`
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(${r?"110px":"140px"}, 1fr));
      gap: ${r?"0.7rem":"1rem"};
      width: min(100%, 820px);
      justify-items: center;
    `;for(const d of F){const m=t.includes(d.stageNumber),f=this.createCard(d,m,r);a.appendChild(f)}n.appendChild(a);const l=document.createElement("button");l.setAttribute("data-gallery-back",""),l.textContent="もどる",l.style.cssText=`
      margin-top: ${r?"0.9rem":"1.5rem"};
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${r?"1.15rem":"1.4rem"};
      font-weight: 700;
      padding: ${r?"0.55rem 1.6rem":"0.6rem 2rem"};
      border: none;
      border-radius: 1.5rem;
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
      cursor: pointer;
      touch-action: manipulation;
      transform: scale(1);
      transition: transform 0.08s ease-out;
    `,this.galleryActionCleanups.add(A(l,{onActivate:()=>{this.hide(),c()},onPressChange:d=>{l.style.transform=d?"scale(0.96)":"scale(1)"},moveTolerancePx:p.RELEASE_CONFIRM_MOVE_TOLERANCE_PX})),n.appendChild(l),this.overlayEl.appendChild(n),s.appendChild(this.overlayEl)}showStageDetail(t,c,e={}){if(this.overlayEl)return!1;const i=O(t);if(!i)return!1;this.onSelectStage=null,this.bestStageStars=e.bestStageStars??{},this.detailBackLabel=e.backLabel??"もどる";const s=document.getElementById("ui-overlay");return s?(this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-encyclopedia-detail-overlay",""),this.applyOverlayStyle(this.overlayEl,e.zIndex??30),this.overlayEl.setAttribute("role","dialog"),this.overlayEl.setAttribute("aria-modal","true"),this.overlayEl.setAttribute("aria-labelledby",p.DETAIL_TITLE_ID),s.appendChild(this.overlayEl),this.showDetail(i,c),!0):!1}applyOverlayStyle(t,c){t.style.cssText=`
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
    `,t.style.zIndex=String(c)}hide(){this.cleanupActionCleanups(this.detailActionCleanups),this.cleanupActionCleanups(this.galleryActionCleanups),this.hideDetailPreview(),this.detailEl&&(this.detailEl.remove(),this.detailEl=null),this.overlayEl&&(this.overlayEl.remove(),this.overlayEl=null),this.isShowingDetail=!1,this.onSelectStage=null,this.bestStageStars={},this.detailBackLabel="もどる",this.disposeDetailPreview()}createCard(t,c,e){const i=document.createElement("div");if(i.setAttribute("data-card",""),i.setAttribute("data-stage",String(t.stageNumber)),i.style.cssText=`
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
    `,c){const s="#"+t.planetColor.toString(16).padStart(6,"0");i.style.background=`linear-gradient(135deg, ${s}88, ${s}44)`,i.style.cursor="pointer",i.setAttribute("role","button"),i.setAttribute("tabindex","0");const r=document.createElement("div");r.textContent=t.emoji,r.setAttribute("aria-hidden","true"),r.style.fontSize=e?"1.7rem":"2rem",i.appendChild(r);const n=document.createElement("div");n.textContent=t.encyclopediaLabel,n.style.cssText=`
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${e?"0.9rem":"1rem"};
        font-weight: 700;
        color: #fff;
        margin-top: 0.3rem;
      `,i.appendChild(n);const o=this.bestStageStars[t.stageNumber]??0;i.setAttribute("aria-label",this.getCardAriaLabel(t,o));const a=P(t.stageNumber,o,{hint:o>0?`⭐ ベスト ${o}`:void 0,size:"compact",scope:"encyclopedia-card"});a.style.marginTop="0.35rem",i.appendChild(a),this.galleryActionCleanups.add(A(i,{onActivate:()=>{this.showDetail(t)},onPressChange:l=>{i.style.transform=l?"scale(0.95)":"scale(1)"},moveTolerancePx:p.RELEASE_CONFIRM_MOVE_TOLERANCE_PX}))}else{i.style.background="#444",i.style.opacity="0.6",i.style.pointerEvents="none",i.setAttribute("aria-disabled","true"),i.setAttribute("aria-label","まだ みつけていない わくせい");const s=document.createElement("div");s.textContent="？？？",s.style.cssText=`
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${e?"1rem":"1.2rem"};
        color: #aaa;
        text-align: center;
      `,i.appendChild(s)}return i}showDetail(t,c){if(this.isShowingDetail||!this.overlayEl)return;this.isShowingDetail=!0,this.cleanupActionCleanups(this.detailActionCleanups);const e=this.isCompactHeight();this.detailEl=document.createElement("div"),this.detailEl.setAttribute("data-detail",""),this.detailEl.setAttribute("role","dialog"),this.detailEl.setAttribute("aria-modal","true"),this.detailEl.setAttribute("aria-labelledby",p.DETAIL_TITLE_ID),this.detailEl.style.cssText=`
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
    `;const i="#"+t.planetColor.toString(16).padStart(6,"0"),s=document.createElement("div");s.setAttribute("data-detail-content",""),s.style.cssText=`
      width: min(460px, 100%);
      max-height: calc(100% - ${e?"0.5rem":"1rem"});
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow-y: auto;
      padding: ${e?"0.25rem 0.1rem 1rem":"0.25rem"};
      box-sizing: border-box;
    `;const r=document.createElement("div");r.setAttribute("data-detail-card",""),r.style.cssText=`
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
    `;const n=document.createElement("div");n.textContent=t.emoji,n.setAttribute("aria-hidden","true"),n.style.fontSize=e?"3rem":"4rem",r.appendChild(n);const o=document.createElement("div");o.id=p.DETAIL_TITLE_ID,o.textContent=t.encyclopediaLabel,o.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${e?"1.6rem":"2rem"};
      font-weight: 700;
      color: #FFD700;
      margin: 0.5rem 0;
      text-align: center;
    `,r.appendChild(o);const a=document.createElement("div");a.setAttribute("data-detail-companion",""),a.style.cssText=`
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.6rem;
      margin-top: 0.4rem;
    `;const l=document.createElement("div");l.textContent="うちゅうの なかま",l.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${e?"0.9rem":"1rem"};
      font-weight: 700;
      color: #fff;
      letter-spacing: 0.04em;
    `,a.appendChild(l);const d=document.createElement("div");d.setAttribute("data-detail-companion-preview",""),d.setAttribute("aria-hidden","true"),d.style.cssText=`
      width: ${e?"96px":"120px"};
      height: ${e?"96px":"120px"};
      border-radius: 20px;
      overflow: hidden;
      background: radial-gradient(circle at top, rgba(255,255,255,0.22), rgba(0,0,0,0.16));
      box-shadow: inset 0 0 18px rgba(255,255,255,0.12), 0 10px 20px rgba(0,0,0,0.22);
    `,a.appendChild(d),this.getDetailPreviewController().show(t,d),r.appendChild(a);const m=document.createElement("div");m.textContent=t.trivia,m.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${e?"1rem":"1.2rem"};
      color: #fff;
      line-height: ${e?"1.65":"1.8"};
      padding: ${e?"1rem 0.4rem":"1.5rem"};
      text-align: center;
    `,r.appendChild(m);const f=this.bestStageStars[t.stageNumber]??0,g=P(t.stageNumber,f,{label:"メダル",hint:f>0?`⭐ ベスト ${f}`:void 0,size:"hero",scope:"encyclopedia-detail"});if(g.style.marginTop="0.4rem",r.appendChild(g),this.onSelectStage){const h=document.createElement("button");h.setAttribute("data-detail-play",""),h.textContent="このステージで あそぶ",h.style.cssText=`
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
      `,this.detailActionCleanups.add(A(h,{onActivate:()=>{const b=this.onSelectStage;if(!b)return;const y=t.stageNumber;this.hide(),b(y)},onPressChange:b=>{h.style.transform=b?"scale(0.96)":"scale(1)"},moveTolerancePx:p.RELEASE_CONFIRM_MOVE_TOLERANCE_PX})),r.appendChild(h)}s.appendChild(r);const u=document.createElement("button");u.setAttribute("data-detail-back",""),u.textContent=this.detailBackLabel,u.style.cssText=`
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
    `,this.detailActionCleanups.add(A(u,{onActivate:()=>{if(c){this.hide(),c();return}this.hideDetail()},onPressChange:h=>{u.style.transform=h?"scale(0.96)":"scale(1)"},moveTolerancePx:p.RELEASE_CONFIRM_MOVE_TOLERANCE_PX})),s.appendChild(u),this.detailEl.appendChild(s),this.overlayEl.appendChild(this.detailEl)}hideDetail(){this.cleanupActionCleanups(this.detailActionCleanups),this.hideDetailPreview(),this.detailEl&&(this.detailEl.remove(),this.detailEl=null),this.isShowingDetail=!1}getDetailPreviewController(){return this.detailPreviewController||(this.detailPreviewController=this.createPreviewController()),this.detailPreviewController}hideDetailPreview(){this.detailPreviewController?.hide()}disposeDetailPreview(){this.detailPreviewController?.dispose(),this.detailPreviewController=null}cleanupActionCleanups(t){for(const c of t)c();t.clear()}isCompactHeight(){return window.innerHeight<=p.COMPACT_HEIGHT_THRESHOLD}getCardAriaLabel(t,c){const e=[`${t.encyclopediaLabel}`];return c>0&&e.push(`ベスト ほし ${c}こ`),e.push("くわしく みる"),e.join("、")}}export{p as EncyclopediaOverlay};
