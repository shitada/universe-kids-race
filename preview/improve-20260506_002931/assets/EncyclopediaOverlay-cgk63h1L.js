import{a6 as k,a7 as N,a8 as O,e as A,P as F,h as G,a9 as j,U as Z,aa as V}from"./game-core-Bnr71eB_.js";import{v as B,P as X,u as W,w as H}from"./three-BsQe5WE2.js";import{a as S,c as $}from"./game-scenes-6DRKs2oE.js";const M=120,Y=1.5,U=.015;function q(v={}){const e=v.createRenderer??k,o=v.createPreviewMesh??N,t=v.raf??requestAnimationFrame,i=v.caf??cancelAnimationFrame;let s=!1,a=!1,l=null,n=null,r=null,d=null,m=null,h=null,g=null,u=null,c=!1;const p=()=>l||(l=document.createElement("canvas"),l.setAttribute("data-companion-preview-canvas",""),l.style.cssText=`
      width: 100%;
      height: 100%;
      display: block;
    `,l),f=()=>n||(n=document.createElement("div"),n.setAttribute("data-companion-preview-fallback",""),n.textContent="👾",n.style.cssText=`
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.35));
    `,n),x=()=>{c&&(c=!1,u!==null&&(i(u),u=null))},y=()=>{!d||!h||(d.remove(h),O(h),h=null)},D=()=>{g?.replaceChildren(),l?.remove(),n?.remove(),g=null},I=()=>{!r||!d||!m||r.render(d,m)},_=()=>{if(c||!r||!d||!m||!h)return;c=!0;const E=()=>{!c||s||!r||!d||!m||!h||(h.rotation.y+=U,r.render(d,m),u=t(E))};u=t(E)},R=()=>{if(r&&d&&m)return!0;if(!(typeof window<"u"&&(typeof window.WebGLRenderingContext<"u"||typeof window.WebGL2RenderingContext<"u"))||a)return a=!0,!1;try{const C=Math.min(typeof window<"u"&&window.devicePixelRatio||1,Y),w=e(p(),C);w.setPixelRatio(C),w.setSize(M,M,!1),w.setClearColor(0,0);const T=new B,P=new X(32,1,.1,20);P.position.set(0,.15,3.1);const z=new W(16777215,1.5),L=new H(16777215,1.2);return L.position.set(2,3,4),T.add(z,L),r=w,d=T,m=P,!0}catch{return l?.remove(),r=null,d=null,m=null,a=!0,!1}};return{show(E,C){if(!s){if(x(),y(),g=C,!R()){C.replaceChildren(f());return}C.replaceChildren(p()),h=o(E),d?.add(h),I(),_()}},hide(){s||(x(),y(),D())},dispose(){s||(this.hide(),s=!0,r?.forceContextLoss?.(),r?.dispose(),r=null,d=null,m=null,l=null,n=null)}}}class b{static RELEASE_CONFIRM_MOVE_TOLERANCE_PX=12;static GALLERY_TITLE_ID="encyclopedia-gallery-title";static DETAIL_TITLE_ID="encyclopedia-detail-title";overlayEl=null;detailEl=null;isShowingDetail=!1;onSelectStage=null;bestStageStars={};discoveredConstellations=[];colorVisionSupportMode=A;detailBackLabel="もどる";detailPreviewController=null;createPreviewController;galleryActionCleanups=new Set;detailActionCleanups=new Set;static COMPACT_HEIGHT_THRESHOLD=768;constructor(e={}){this.createPreviewController=e.createPreviewController??q}show(e,o,t,i,s=[],a=A){if(this.overlayEl)return;this.onSelectStage=t??null,this.bestStageStars=i??{},this.discoveredConstellations=s,this.colorVisionSupportMode=a,this.detailBackLabel="もどる";const l=document.getElementById("ui-overlay");if(!l)return;this.overlayEl=document.createElement("div"),this.applyOverlayStyle(this.overlayEl,30),this.overlayEl.setAttribute("role","dialog"),this.overlayEl.setAttribute("aria-modal","true"),this.overlayEl.setAttribute("aria-labelledby",b.GALLERY_TITLE_ID);const n=this.isCompactHeight(),r=document.createElement("div");r.setAttribute("data-gallery-content",""),r.style.cssText=`
      width: min(960px, 100%);
      height: 100%;
      max-height: 720px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      padding: ${n?"0.45rem 0.35rem":"0.5rem"};
      box-sizing: border-box;
    `;const d=document.createElement("div");d.id=b.GALLERY_TITLE_ID,d.textContent="わくせいずかん",d.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${n?"1.7rem":"2rem"};
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
      margin-bottom: ${n?"0.45rem":"0.8rem"};
      text-align: center;
    `,r.appendChild(d);const m=document.createElement("div");m.setAttribute("data-gallery-main",""),m.style.cssText=`
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(12rem, 0.34fr);
      gap: ${n?"0.55rem":"0.8rem"};
      width: min(100%, 900px);
      align-items: stretch;
    `;const h=document.createElement("div");h.setAttribute("data-gallery-grid",""),h.setAttribute("aria-label","わくせい の いちらん"),h.style.cssText=`
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(${n?"86px":"110px"}, 1fr));
      gap: ${n?"0.45rem":"0.65rem"};
      width: 100%;
      justify-items: center;
      align-items: stretch;
    `;for(const u of F){const c=e.includes(u.stageNumber),p=this.createCard(u,c,n);h.appendChild(p)}m.appendChild(h),m.appendChild(this.createConstellationSection(n)),r.appendChild(m);const g=document.createElement("button");g.setAttribute("data-gallery-back",""),g.textContent="もどる",g.style.cssText=`
      margin-top: ${n?"0.55rem":"0.8rem"};
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${n?"1.05rem":"1.25rem"};
      font-weight: 700;
      padding: ${n?"0.45rem 1.45rem":"0.55rem 1.8rem"};
      border: none;
      border-radius: 1.5rem;
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
      cursor: pointer;
      touch-action: manipulation;
      transform: scale(1);
      transition: transform 0.08s ease-out;
    `,this.galleryActionCleanups.add(S(g,{onActivate:()=>{this.hide(),o()},onPressChange:u=>{g.style.transform=u?"scale(0.96)":"scale(1)"},moveTolerancePx:b.RELEASE_CONFIRM_MOVE_TOLERANCE_PX})),r.appendChild(g),this.overlayEl.appendChild(r),l.appendChild(this.overlayEl)}showStageDetail(e,o,t={}){if(this.overlayEl)return!1;const i=G(e);if(!i)return!1;this.onSelectStage=null,this.bestStageStars=t.bestStageStars??{},this.discoveredConstellations=t.discoveredConstellations??[],this.colorVisionSupportMode=t.colorVisionSupportMode??A,this.detailBackLabel=t.backLabel??"もどる";const s=document.getElementById("ui-overlay");return s?(this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-encyclopedia-detail-overlay",""),this.applyOverlayStyle(this.overlayEl,t.zIndex??30),this.overlayEl.setAttribute("role","dialog"),this.overlayEl.setAttribute("aria-modal","true"),this.overlayEl.setAttribute("aria-labelledby",b.DETAIL_TITLE_ID),s.appendChild(this.overlayEl),this.showDetail(i,o),!0):!1}applyOverlayStyle(e,o){e.style.cssText=`
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 32, 0.95);
      pointer-events: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: ${this.isCompactHeight()?"0.5rem":"0.9rem"};
      box-sizing: border-box;
      overflow: hidden;
    `,e.style.zIndex=String(o)}hide(){this.cleanupActionCleanups(this.detailActionCleanups),this.cleanupActionCleanups(this.galleryActionCleanups),this.hideDetailPreview(),this.detailEl&&(this.detailEl.remove(),this.detailEl=null),this.overlayEl&&(this.overlayEl.remove(),this.overlayEl=null),this.isShowingDetail=!1,this.onSelectStage=null,this.bestStageStars={},this.discoveredConstellations=[],this.colorVisionSupportMode=A,this.detailBackLabel="もどる",this.disposeDetailPreview()}createConstellationSection(e){const o=document.createElement("div");o.setAttribute("data-constellation-gallery",""),o.style.cssText=`
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: ${e?"0.4rem":"0.55rem"};
      min-width: 0;
    `;const t=document.createElement("div");t.textContent="せいざずかん",t.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${e?"1rem":"1.15rem"};
      font-weight: 900;
      color: #9be7ff;
      text-align: center;
    `,o.appendChild(t);const i=document.createElement("div");i.style.cssText=`
      display: flex;
      flex-direction: column;
      gap: ${e?"0.4rem":"0.55rem"};
      width: 100%;
      min-width: 0;
    `;for(const s of j){const a=this.discoveredConstellations.includes(s.stageNumber),l=document.createElement("div");l.setAttribute("data-constellation-card",""),l.setAttribute("data-stage",String(s.stageNumber)),l.style.cssText=`
        min-height: ${e?"62px":"74px"};
        border-radius: 16px;
        padding: ${e?"0.45rem":"0.55rem"};
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: ${e?"0.45rem":"0.55rem"};
        background: ${a?"linear-gradient(135deg, rgba(98, 220, 255, 0.35), rgba(71, 100, 255, 0.2))":"rgba(255, 255, 255, 0.08)"};
        color: ${a?"#fff":"#9aa7c8"};
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.24);
        box-sizing: border-box;
      `,l.appendChild(this.createConstellationPicture(s,a,e));const n=document.createElement("div");n.style.cssText=`
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        min-width: 0;
      `;const r=document.createElement("div");r.textContent=`ステージ ${s.stageNumber}`,r.style.cssText=`
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${e?"0.68rem":"0.76rem"};
        font-weight: 700;
      `,n.appendChild(r);const d=document.createElement("div");d.textContent=a?s.name:"？？？",d.style.cssText=`
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${e?"0.86rem":"0.95rem"};
        font-weight: 900;
        margin-top: 0.08rem;
        text-align: left;
        overflow-wrap: anywhere;
      `,n.appendChild(d),l.appendChild(n),i.appendChild(l)}return o.appendChild(i),o}createConstellationPicture(e,o,t){const i=document.createElementNS("http://www.w3.org/2000/svg","svg"),s=t?48:56;i.setAttribute("data-constellation-picture",""),i.setAttribute("viewBox","0 0 100 64"),i.setAttribute("width",String(s)),i.setAttribute("height",String(Math.round(s*.64))),i.setAttribute("aria-hidden","true"),i.style.cssText=`
      flex: 0 0 auto;
      border-radius: 12px;
      background: ${o?"rgba(4, 12, 40, 0.42)":"rgba(255, 255, 255, 0.05)"};
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.14);
    `;const a=e.points,l=Math.min(...a.map(c=>c.x)),n=Math.max(...a.map(c=>c.x)),r=Math.min(...a.map(c=>c.z)),d=Math.max(...a.map(c=>c.z)),m=Math.max(n-l,1),h=Math.max(d-r,1),g=a.map(c=>{const p=12+(c.x-l)/m*76,f=10+(c.z-r)/h*44;return{x:p,y:f}}),u=document.createElementNS("http://www.w3.org/2000/svg","polyline");u.setAttribute("points",g.map(c=>`${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(" ")),u.setAttribute("fill","none"),u.setAttribute("stroke",o?"#bdf4ff":"#7b86a8"),u.setAttribute("stroke-width","4"),u.setAttribute("stroke-linecap","round"),u.setAttribute("stroke-linejoin","round"),u.setAttribute("opacity",o?"0.95":"0.45"),i.appendChild(u);for(const c of g){const p=document.createElementNS("http://www.w3.org/2000/svg","circle");p.setAttribute("cx",c.x.toFixed(1)),p.setAttribute("cy",c.y.toFixed(1)),p.setAttribute("r",o?"4.8":"4.2"),p.setAttribute("fill",o?"#fff8aa":"#aab2d4"),p.setAttribute("opacity",o?"1":"0.55"),i.appendChild(p)}return i}createCard(e,o,t){const i=document.createElement("div");if(i.setAttribute("data-card",""),i.setAttribute("data-stage",String(e.stageNumber)),i.style.cssText=`
      min-height: ${t?"82px":"96px"};
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: ${t?"0.45rem":"0.6rem"};
      width: 100%;
      max-width: none;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      transition: transform 0.12s ease-out;
      transform: scale(1);
      box-sizing: border-box;
    `,o){const s="#"+e.planetColor.toString(16).padStart(6,"0");i.style.background=`linear-gradient(135deg, ${s}88, ${s}44)`,i.style.cursor="pointer",i.setAttribute("role","button"),i.setAttribute("tabindex","0");const a=document.createElement("div");a.textContent=e.emoji,a.setAttribute("aria-hidden","true"),a.style.fontSize=t?"1.45rem":"1.75rem",i.appendChild(a);const l=document.createElement("div");l.textContent=this.getPlanetLabel(e),l.style.cssText=`
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${t?"0.76rem":"0.88rem"};
        font-weight: 700;
        color: #fff;
        margin-top: 0.18rem;
        text-align: center;
        overflow-wrap: anywhere;
      `,i.appendChild(l);const n=this.bestStageStars[e.stageNumber]??0;i.setAttribute("aria-label",this.getCardAriaLabel(e,n));const r=$(e.stageNumber,n,{hint:n>0?`⭐ ベスト ${n}`:void 0,size:"compact",scope:"encyclopedia-card"});r.style.marginTop="0.22rem",i.appendChild(r),this.galleryActionCleanups.add(S(i,{onActivate:()=>{this.showDetail(e)},onPressChange:d=>{i.style.transform=d?"scale(0.95)":"scale(1)"},moveTolerancePx:b.RELEASE_CONFIRM_MOVE_TOLERANCE_PX}))}else{i.style.background="#444",i.style.opacity="0.6",i.style.pointerEvents="none",i.setAttribute("aria-disabled","true"),i.setAttribute("aria-label","まだ みつけていない わくせい");const s=document.createElement("div");s.textContent="？？？",s.style.cssText=`
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${t?"0.9rem":"1.05rem"};
        color: #aaa;
        text-align: center;
      `,i.appendChild(s)}return i}showDetail(e,o){if(this.isShowingDetail||!this.overlayEl)return;this.isShowingDetail=!0,this.cleanupActionCleanups(this.detailActionCleanups);const t=this.isCompactHeight();this.detailEl=document.createElement("div"),this.detailEl.setAttribute("data-detail",""),this.detailEl.setAttribute("role","dialog"),this.detailEl.setAttribute("aria-modal","true"),this.detailEl.setAttribute("aria-labelledby",b.DETAIL_TITLE_ID),this.detailEl.style.cssText=`
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 32, 0.9);
      z-index: 31;
      padding: ${t?"0.5rem":"0.9rem"};
      box-sizing: border-box;
      overflow: hidden;
    `;const i="#"+e.planetColor.toString(16).padStart(6,"0"),s=document.createElement("div");s.setAttribute("data-detail-content",""),s.style.cssText=`
      width: min(560px, 100%);
      height: 100%;
      max-height: 720px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      padding: 0;
      box-sizing: border-box;
    `;const a=document.createElement("div");a.setAttribute("data-detail-card",""),a.style.cssText=`
      width: min(${t?"440px":"500px"}, 100%);
      background: linear-gradient(135deg, ${i}88, ${i}44);
      border-radius: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: ${t?"0.8rem 0.9rem":"1.15rem"};
      overflow: hidden;
      box-sizing: border-box;
    `,a.style.overflowY="hidden";const l=document.createElement("div");l.textContent=e.emoji,l.setAttribute("aria-hidden","true"),l.style.fontSize=t?"2.35rem":"3rem",a.appendChild(l);const n=document.createElement("div");n.id=b.DETAIL_TITLE_ID,n.textContent=this.getPlanetLabel(e),n.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${t?"1.35rem":"1.65rem"};
      font-weight: 700;
      color: #FFD700;
      margin: 0.25rem 0;
      text-align: center;
    `,a.appendChild(n);const r=document.createElement("div");r.setAttribute("data-detail-companion",""),r.style.cssText=`
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.35rem;
      margin-top: 0.2rem;
    `;const d=document.createElement("div");d.textContent="うちゅうの なかま",d.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${t?"0.78rem":"0.9rem"};
      font-weight: 700;
      color: #fff;
      letter-spacing: 0.04em;
    `,r.appendChild(d);const m=document.createElement("div");m.setAttribute("data-detail-companion-preview",""),m.setAttribute("aria-hidden","true"),m.style.cssText=`
      width: ${t?"78px":"96px"};
      height: ${t?"78px":"96px"};
      border-radius: 20px;
      overflow: hidden;
      background: radial-gradient(circle at top, rgba(255,255,255,0.22), rgba(0,0,0,0.16));
      box-shadow: inset 0 0 18px rgba(255,255,255,0.12), 0 10px 20px rgba(0,0,0,0.22);
    `,r.appendChild(m),this.getDetailPreviewController().show(e,m),a.appendChild(r);const h=document.createElement("div");h.textContent=e.trivia,h.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${t?"0.9rem":"1.05rem"};
      color: #fff;
      line-height: ${t?"1.35":"1.5"};
      padding: ${t?"0.55rem 0.25rem":"0.8rem 0.5rem"};
      text-align: center;
    `,a.appendChild(h);const g=this.bestStageStars[e.stageNumber]??0,u=$(e.stageNumber,g,{label:"メダル",hint:g>0?`⭐ ベスト ${g}`:void 0,size:"hero",scope:"encyclopedia-detail"});u.style.marginTop="0.2rem",a.appendChild(u);const c=Z(e.stageNumber);if(c){const f=document.createElement("div"),x=this.discoveredConstellations.includes(e.stageNumber);f.setAttribute("data-detail-constellation",""),f.style.cssText=`
        margin-top: 0.45rem;
        padding: ${t?"0.45rem 0.65rem":"0.6rem 0.8rem"};
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.14);
        color: #fff;
        text-align: center;
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${t?"0.82rem":"0.95rem"};
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.55rem;
      `,f.appendChild(this.createConstellationPicture(c,x,!0));const y=document.createElement("span");y.textContent=x?`✨ みつけた せいざ: ${c.encyclopediaLabel}`:`💫 このステージの せいざ: ${c.name}`,f.appendChild(y),a.appendChild(f)}if(this.onSelectStage){const f=document.createElement("button");f.setAttribute("data-detail-play",""),f.textContent="このステージで あそぶ",f.style.cssText=`
        margin-top: ${t?"0.55rem":"0.75rem"};
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${t?"0.95rem":"1.1rem"};
        font-weight: 700;
        padding: ${t?"0.55rem 1rem":"0.65rem 1.3rem"};
        border: none;
        border-radius: 1.5rem;
        background: linear-gradient(135deg, #FF6B6B, #FFE66D);
        color: #333;
        cursor: pointer;
        touch-action: manipulation;
        transform: scale(1);
        transition: transform 0.08s ease-out;
      `,this.detailActionCleanups.add(S(f,{onActivate:()=>{const x=this.onSelectStage;if(!x)return;const y=e.stageNumber;this.hide(),x(y)},onPressChange:x=>{f.style.transform=x?"scale(0.96)":"scale(1)"},moveTolerancePx:b.RELEASE_CONFIRM_MOVE_TOLERANCE_PX})),a.appendChild(f)}s.appendChild(a);const p=document.createElement("button");p.setAttribute("data-detail-back",""),p.textContent=this.detailBackLabel,p.style.cssText=`
      margin-top: ${t?"0.55rem":"0.8rem"};
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${t?"1.05rem":"1.25rem"};
      font-weight: 700;
      padding: ${t?"0.45rem 1.45rem":"0.55rem 1.8rem"};
      border: none;
      border-radius: 1.5rem;
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
      cursor: pointer;
      touch-action: manipulation;
      transform: scale(1);
      transition: transform 0.08s ease-out;
    `,this.detailActionCleanups.add(S(p,{onActivate:()=>{if(o){this.hide(),o();return}this.hideDetail()},onPressChange:f=>{p.style.transform=f?"scale(0.96)":"scale(1)"},moveTolerancePx:b.RELEASE_CONFIRM_MOVE_TOLERANCE_PX})),s.appendChild(p),this.detailEl.appendChild(s),this.overlayEl.appendChild(this.detailEl)}hideDetail(){this.cleanupActionCleanups(this.detailActionCleanups),this.hideDetailPreview(),this.detailEl&&(this.detailEl.remove(),this.detailEl=null),this.isShowingDetail=!1}getDetailPreviewController(){return this.detailPreviewController||(this.detailPreviewController=this.createPreviewController()),this.detailPreviewController}hideDetailPreview(){this.detailPreviewController?.hide()}disposeDetailPreview(){this.detailPreviewController?.dispose(),this.detailPreviewController=null}cleanupActionCleanups(e){for(const o of e)o();e.clear()}isCompactHeight(){return window.innerHeight<=b.COMPACT_HEIGHT_THRESHOLD}getCardAriaLabel(e,o){const t=[this.getPlanetLabel(e)];return o>0&&t.push(`ベスト ほし ${o}こ`),t.push("くわしく みる"),t.join("、")}getPlanetLabel(e){return V(e,this.colorVisionSupportMode)}}export{b as EncyclopediaOverlay};
