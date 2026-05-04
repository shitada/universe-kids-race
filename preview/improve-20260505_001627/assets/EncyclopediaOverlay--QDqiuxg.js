import{J as N,K as k,N as z,P as O,d as G,O as F,y as Z}from"./game-core-CKRoNsJR.js";import{s as j,P as B,r as V,t as W}from"./three-By3JikJA.js";import{a as w,c as L}from"./game-scenes-Bm0K0U9b.js";const P=120,H=1.5,X=.015;function Y(y={}){const t=y.createRenderer??N,d=y.createPreviewMesh??k,e=y.raf??requestAnimationFrame,n=y.caf??cancelAnimationFrame;let l=!1,s=!1,i=null,r=null,a=null,o=null,c=null,m=null,f=null,p=null,g=!1;const b=()=>i||(i=document.createElement("canvas"),i.setAttribute("data-companion-preview-canvas",""),i.style.cssText=`
      width: 100%;
      height: 100%;
      display: block;
    `,i),u=()=>r||(r=document.createElement("div"),r.setAttribute("data-companion-preview-fallback",""),r.textContent="👾",r.style.cssText=`
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.35));
    `,r),x=()=>{g&&(g=!1,p!==null&&(n(p),p=null))},v=()=>{!o||!m||(o.remove(m),z(m),m=null)},D=()=>{f?.replaceChildren(),i?.remove(),r?.remove(),f=null},I=()=>{!a||!o||!c||a.render(o,c)},_=()=>{if(g||!a||!o||!c||!m)return;g=!0;const C=()=>{!g||l||!a||!o||!c||!m||(m.rotation.y+=X,a.render(o,c),p=e(C))};p=e(C)},R=()=>{if(a&&o&&c)return!0;if(!(typeof window<"u"&&(typeof window.WebGLRenderingContext<"u"||typeof window.WebGL2RenderingContext<"u"))||s)return s=!0,!1;try{const E=Math.min(typeof window<"u"&&window.devicePixelRatio||1,H),A=t(b(),E);A.setPixelRatio(E),A.setSize(P,P,!1),A.setClearColor(0,0);const T=new j,S=new B(32,1,.1,20);S.position.set(0,.15,3.1);const M=new V(16777215,1.5),$=new W(16777215,1.2);return $.position.set(2,3,4),T.add(M,$),a=A,o=T,c=S,!0}catch{return i?.remove(),a=null,o=null,c=null,s=!0,!1}};return{show(C,E){if(!l){if(x(),v(),f=E,!R()){E.replaceChildren(u());return}E.replaceChildren(b()),m=d(C),o?.add(m),I(),_()}},hide(){l||(x(),v(),D())},dispose(){l||(this.hide(),l=!0,a?.forceContextLoss?.(),a?.dispose(),a=null,o=null,c=null,i=null,r=null)}}}class h{static RELEASE_CONFIRM_MOVE_TOLERANCE_PX=12;static GALLERY_TITLE_ID="encyclopedia-gallery-title";static DETAIL_TITLE_ID="encyclopedia-detail-title";overlayEl=null;detailEl=null;isShowingDetail=!1;onSelectStage=null;bestStageStars={};discoveredConstellations=[];detailBackLabel="もどる";detailPreviewController=null;createPreviewController;galleryActionCleanups=new Set;detailActionCleanups=new Set;static COMPACT_HEIGHT_THRESHOLD=720;constructor(t={}){this.createPreviewController=t.createPreviewController??Y}show(t,d,e,n,l=[]){if(this.overlayEl)return;this.onSelectStage=e??null,this.bestStageStars=n??{},this.discoveredConstellations=l,this.detailBackLabel="もどる";const s=document.getElementById("ui-overlay");if(!s)return;this.overlayEl=document.createElement("div"),this.applyOverlayStyle(this.overlayEl,30),this.overlayEl.setAttribute("role","dialog"),this.overlayEl.setAttribute("aria-modal","true"),this.overlayEl.setAttribute("aria-labelledby",h.GALLERY_TITLE_ID);const i=this.isCompactHeight(),r=document.createElement("div");r.setAttribute("data-gallery-content",""),r.style.cssText=`
      width: min(960px, 100%);
      max-height: calc(100% - ${i?"0.5rem":"1rem"});
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow-y: auto;
      padding: ${i?"0.75rem 0.35rem 1rem":"0.5rem"};
      box-sizing: border-box;
    `;const a=document.createElement("div");a.id=h.GALLERY_TITLE_ID,a.textContent="わくせいずかん",a.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${i?"1.7rem":"2rem"};
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
      margin-bottom: ${i?"0.9rem":"1.5rem"};
      text-align: center;
    `,r.appendChild(a);const o=document.createElement("div");o.setAttribute("data-gallery-grid",""),o.setAttribute("aria-label","わくせい の いちらん"),o.style.cssText=`
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(${i?"110px":"140px"}, 1fr));
      gap: ${i?"0.7rem":"1rem"};
      width: min(100%, 820px);
      justify-items: center;
    `;for(const m of O){const f=t.includes(m.stageNumber),p=this.createCard(m,f,i);o.appendChild(p)}r.appendChild(o),r.appendChild(this.createConstellationSection(i));const c=document.createElement("button");c.setAttribute("data-gallery-back",""),c.textContent="もどる",c.style.cssText=`
      margin-top: ${i?"0.9rem":"1.5rem"};
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${i?"1.15rem":"1.4rem"};
      font-weight: 700;
      padding: ${i?"0.55rem 1.6rem":"0.6rem 2rem"};
      border: none;
      border-radius: 1.5rem;
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
      cursor: pointer;
      touch-action: manipulation;
      transform: scale(1);
      transition: transform 0.08s ease-out;
    `,this.galleryActionCleanups.add(w(c,{onActivate:()=>{this.hide(),d()},onPressChange:m=>{c.style.transform=m?"scale(0.96)":"scale(1)"},moveTolerancePx:h.RELEASE_CONFIRM_MOVE_TOLERANCE_PX})),r.appendChild(c),this.overlayEl.appendChild(r),s.appendChild(this.overlayEl)}showStageDetail(t,d,e={}){if(this.overlayEl)return!1;const n=G(t);if(!n)return!1;this.onSelectStage=null,this.bestStageStars=e.bestStageStars??{},this.discoveredConstellations=e.discoveredConstellations??[],this.detailBackLabel=e.backLabel??"もどる";const l=document.getElementById("ui-overlay");return l?(this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-encyclopedia-detail-overlay",""),this.applyOverlayStyle(this.overlayEl,e.zIndex??30),this.overlayEl.setAttribute("role","dialog"),this.overlayEl.setAttribute("aria-modal","true"),this.overlayEl.setAttribute("aria-labelledby",h.DETAIL_TITLE_ID),l.appendChild(this.overlayEl),this.showDetail(n,d),!0):!1}applyOverlayStyle(t,d){t.style.cssText=`
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
    `,t.style.zIndex=String(d)}hide(){this.cleanupActionCleanups(this.detailActionCleanups),this.cleanupActionCleanups(this.galleryActionCleanups),this.hideDetailPreview(),this.detailEl&&(this.detailEl.remove(),this.detailEl=null),this.overlayEl&&(this.overlayEl.remove(),this.overlayEl=null),this.isShowingDetail=!1,this.onSelectStage=null,this.bestStageStars={},this.discoveredConstellations=[],this.detailBackLabel="もどる",this.disposeDetailPreview()}createConstellationSection(t){const d=document.createElement("div");d.setAttribute("data-constellation-gallery",""),d.style.cssText=`
      width: min(100%, 820px);
      margin-top: ${t?"1rem":"1.4rem"};
      display: flex;
      flex-direction: column;
      gap: ${t?"0.55rem":"0.75rem"};
    `;const e=document.createElement("div");e.textContent="ほしざずかん",e.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${t?"1.1rem":"1.25rem"};
      font-weight: 900;
      color: #9be7ff;
      text-align: center;
    `,d.appendChild(e);const n=document.createElement("div");n.style.cssText=`
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(${t?"110px":"140px"}, 1fr));
      gap: ${t?"0.6rem":"0.8rem"};
      width: 100%;
    `;for(const l of F){const s=this.discoveredConstellations.includes(l.stageNumber),i=document.createElement("div");i.setAttribute("data-constellation-card",""),i.setAttribute("data-stage",String(l.stageNumber)),i.style.cssText=`
        min-height: ${t?"84px":"96px"};
        border-radius: 16px;
        padding: ${t?"0.7rem":"0.85rem"};
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: ${s?"linear-gradient(135deg, rgba(98, 220, 255, 0.35), rgba(71, 100, 255, 0.2))":"rgba(255, 255, 255, 0.08)"};
        color: ${s?"#fff":"#9aa7c8"};
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.24);
      `;const r=document.createElement("div");r.textContent=`ステージ ${l.stageNumber}`,r.style.cssText=`
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${t?"0.75rem":"0.82rem"};
        font-weight: 700;
      `,i.appendChild(r);const a=document.createElement("div");a.textContent=s?l.name:"？？？",a.style.cssText=`
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${t?"0.95rem":"1rem"};
        font-weight: 900;
        margin-top: 0.2rem;
        text-align: center;
      `,i.appendChild(a),n.appendChild(i)}return d.appendChild(n),d}createCard(t,d,e){const n=document.createElement("div");if(n.setAttribute("data-card",""),n.setAttribute("data-stage",String(t.stageNumber)),n.style.cssText=`
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
    `,d){const l="#"+t.planetColor.toString(16).padStart(6,"0");n.style.background=`linear-gradient(135deg, ${l}88, ${l}44)`,n.style.cursor="pointer",n.setAttribute("role","button"),n.setAttribute("tabindex","0");const s=document.createElement("div");s.textContent=t.emoji,s.setAttribute("aria-hidden","true"),s.style.fontSize=e?"1.7rem":"2rem",n.appendChild(s);const i=document.createElement("div");i.textContent=t.encyclopediaLabel,i.style.cssText=`
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${e?"0.9rem":"1rem"};
        font-weight: 700;
        color: #fff;
        margin-top: 0.3rem;
      `,n.appendChild(i);const r=this.bestStageStars[t.stageNumber]??0;n.setAttribute("aria-label",this.getCardAriaLabel(t,r));const a=L(t.stageNumber,r,{hint:r>0?`⭐ ベスト ${r}`:void 0,size:"compact",scope:"encyclopedia-card"});a.style.marginTop="0.35rem",n.appendChild(a),this.galleryActionCleanups.add(w(n,{onActivate:()=>{this.showDetail(t)},onPressChange:o=>{n.style.transform=o?"scale(0.95)":"scale(1)"},moveTolerancePx:h.RELEASE_CONFIRM_MOVE_TOLERANCE_PX}))}else{n.style.background="#444",n.style.opacity="0.6",n.style.pointerEvents="none",n.setAttribute("aria-disabled","true"),n.setAttribute("aria-label","まだ みつけていない わくせい");const l=document.createElement("div");l.textContent="？？？",l.style.cssText=`
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${e?"1rem":"1.2rem"};
        color: #aaa;
        text-align: center;
      `,n.appendChild(l)}return n}showDetail(t,d){if(this.isShowingDetail||!this.overlayEl)return;this.isShowingDetail=!0,this.cleanupActionCleanups(this.detailActionCleanups);const e=this.isCompactHeight();this.detailEl=document.createElement("div"),this.detailEl.setAttribute("data-detail",""),this.detailEl.setAttribute("role","dialog"),this.detailEl.setAttribute("aria-modal","true"),this.detailEl.setAttribute("aria-labelledby",h.DETAIL_TITLE_ID),this.detailEl.style.cssText=`
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
    `;const n="#"+t.planetColor.toString(16).padStart(6,"0"),l=document.createElement("div");l.setAttribute("data-detail-content",""),l.style.cssText=`
      width: min(460px, 100%);
      max-height: calc(100% - ${e?"0.5rem":"1rem"});
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow-y: auto;
      padding: ${e?"0.25rem 0.1rem 1rem":"0.25rem"};
      box-sizing: border-box;
    `;const s=document.createElement("div");s.setAttribute("data-detail-card",""),s.style.cssText=`
      width: min(${e?"340px":"400px"}, 100%);
      max-height: calc(100vh - ${e?"8.5rem":"10rem"});
      background: linear-gradient(135deg, ${n}88, ${n}44);
      border-radius: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: ${e?"1.1rem 1rem":"2rem"};
      overflow-y: auto;
      box-sizing: border-box;
    `;const i=document.createElement("div");i.textContent=t.emoji,i.setAttribute("aria-hidden","true"),i.style.fontSize=e?"3rem":"4rem",s.appendChild(i);const r=document.createElement("div");r.id=h.DETAIL_TITLE_ID,r.textContent=t.encyclopediaLabel,r.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${e?"1.6rem":"2rem"};
      font-weight: 700;
      color: #FFD700;
      margin: 0.5rem 0;
      text-align: center;
    `,s.appendChild(r);const a=document.createElement("div");a.setAttribute("data-detail-companion",""),a.style.cssText=`
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.6rem;
      margin-top: 0.4rem;
    `;const o=document.createElement("div");o.textContent="うちゅうの なかま",o.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${e?"0.9rem":"1rem"};
      font-weight: 700;
      color: #fff;
      letter-spacing: 0.04em;
    `,a.appendChild(o);const c=document.createElement("div");c.setAttribute("data-detail-companion-preview",""),c.setAttribute("aria-hidden","true"),c.style.cssText=`
      width: ${e?"96px":"120px"};
      height: ${e?"96px":"120px"};
      border-radius: 20px;
      overflow: hidden;
      background: radial-gradient(circle at top, rgba(255,255,255,0.22), rgba(0,0,0,0.16));
      box-shadow: inset 0 0 18px rgba(255,255,255,0.12), 0 10px 20px rgba(0,0,0,0.22);
    `,a.appendChild(c),this.getDetailPreviewController().show(t,c),s.appendChild(a);const m=document.createElement("div");m.textContent=t.trivia,m.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${e?"1rem":"1.2rem"};
      color: #fff;
      line-height: ${e?"1.65":"1.8"};
      padding: ${e?"1rem 0.4rem":"1.5rem"};
      text-align: center;
    `,s.appendChild(m);const f=this.bestStageStars[t.stageNumber]??0,p=L(t.stageNumber,f,{label:"メダル",hint:f>0?`⭐ ベスト ${f}`:void 0,size:"hero",scope:"encyclopedia-detail"});p.style.marginTop="0.4rem",s.appendChild(p);const g=Z(t.stageNumber);if(g){const u=document.createElement("div"),x=this.discoveredConstellations.includes(t.stageNumber);u.setAttribute("data-detail-constellation",""),u.style.cssText=`
        margin-top: 0.8rem;
        padding: 0.8rem 1rem;
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.14);
        color: #fff;
        text-align: center;
        font-family: 'Zen Maru Gothic', sans-serif;
      `,u.textContent=x?`✨ みつけた ほしざ: ${g.encyclopediaLabel}`:`💫 このステージの ほしざ: ${g.name}`,s.appendChild(u)}if(this.onSelectStage){const u=document.createElement("button");u.setAttribute("data-detail-play",""),u.textContent="このステージで あそぶ",u.style.cssText=`
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
      `,this.detailActionCleanups.add(w(u,{onActivate:()=>{const x=this.onSelectStage;if(!x)return;const v=t.stageNumber;this.hide(),x(v)},onPressChange:x=>{u.style.transform=x?"scale(0.96)":"scale(1)"},moveTolerancePx:h.RELEASE_CONFIRM_MOVE_TOLERANCE_PX})),s.appendChild(u)}l.appendChild(s);const b=document.createElement("button");b.setAttribute("data-detail-back",""),b.textContent=this.detailBackLabel,b.style.cssText=`
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
    `,this.detailActionCleanups.add(w(b,{onActivate:()=>{if(d){this.hide(),d();return}this.hideDetail()},onPressChange:u=>{b.style.transform=u?"scale(0.96)":"scale(1)"},moveTolerancePx:h.RELEASE_CONFIRM_MOVE_TOLERANCE_PX})),l.appendChild(b),this.detailEl.appendChild(l),this.overlayEl.appendChild(this.detailEl)}hideDetail(){this.cleanupActionCleanups(this.detailActionCleanups),this.hideDetailPreview(),this.detailEl&&(this.detailEl.remove(),this.detailEl=null),this.isShowingDetail=!1}getDetailPreviewController(){return this.detailPreviewController||(this.detailPreviewController=this.createPreviewController()),this.detailPreviewController}hideDetailPreview(){this.detailPreviewController?.hide()}disposeDetailPreview(){this.detailPreviewController?.dispose(),this.detailPreviewController=null}cleanupActionCleanups(t){for(const d of t)d();t.clear()}isCompactHeight(){return window.innerHeight<=h.COMPACT_HEIGHT_THRESHOLD}getCardAriaLabel(t,d){const e=[`${t.encyclopediaLabel}`];return d>0&&e.push(`ベスト ほし ${d}こ`),e.push("くわしく みる"),e.join("、")}}export{h as EncyclopediaOverlay};
