import{aa as R,ab as k,ac as B,e as T,h as O,P as F,ad as G,ae as j,Y as Z,af as V}from"./game-core-BBrrPWfA.js";import{v as X,P as Y,u as W,w as U}from"./three-BsQe5WE2.js";import{a as C,c as $}from"./game-scenes-CkxdGDKS.js";const M=120,q=1.5,J=.015;function K(A={}){const e=A.createRenderer??R,i=A.createPreviewMesh??k,t=A.raf??requestAnimationFrame,n=A.caf??cancelAnimationFrame;let a=!1,s=!1,l=null,d=null,r=null,c=null,m=null,u=null,b=null,h=null,o=!1;const p=()=>l||(l=document.createElement("canvas"),l.setAttribute("data-companion-preview-canvas",""),l.style.cssText=`
      width: 100%;
      height: 100%;
      display: block;
    `,l),f=()=>d||(d=document.createElement("div"),d.setAttribute("data-companion-preview-fallback",""),d.textContent="👾",d.style.cssText=`
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.35));
    `,d),x=()=>{o&&(o=!1,h!==null&&(n(h),h=null))},y=()=>{!c||!u||(c.remove(u),B(u),u=null)},_=()=>{b?.replaceChildren(),l?.remove(),d?.remove(),b=null},D=()=>{!r||!c||!m||r.render(c,m)},I=()=>{if(o||!r||!c||!m||!u)return;o=!0;const v=()=>{!o||a||!r||!c||!m||!u||(u.rotation.y+=J,r.render(c,m),h=t(v))};h=t(v)},N=()=>{if(r&&c&&m)return!0;if(!(typeof window<"u"&&(typeof window.WebGLRenderingContext<"u"||typeof window.WebGL2RenderingContext<"u"))||s)return s=!0,!1;try{const E=Math.min(typeof window<"u"&&window.devicePixelRatio||1,q),w=e(p(),E);w.setPixelRatio(E),w.setSize(M,M,!1),w.setClearColor(0,0);const S=new X,P=new Y(32,1,.1,20);P.position.set(0,.15,3.1);const z=new W(16777215,1.5),L=new U(16777215,1.2);return L.position.set(2,3,4),S.add(z,L),r=w,c=S,m=P,!0}catch{return l?.remove(),r=null,c=null,m=null,s=!0,!1}};return{show(v,E){if(!a){if(x(),y(),b=E,!N()){E.replaceChildren(f());return}E.replaceChildren(p()),u=i(v),c?.add(u),D(),I()}},hide(){a||(x(),y(),_())},dispose(){a||(this.hide(),a=!0,r?.forceContextLoss?.(),r?.dispose(),r=null,c=null,m=null,l=null,d=null)}}}class g{static RELEASE_CONFIRM_MOVE_TOLERANCE_PX=12;static GALLERY_TITLE_ID="encyclopedia-gallery-title";static DETAIL_TITLE_ID="encyclopedia-detail-title";static PLANET_TAB_LABEL="わくせいずかん";static MONTHLY_TAB_LABEL="てんたいずかん";overlayEl=null;detailEl=null;galleryTitleEl=null;galleryPanels=new Map;activeTab="planets";isShowingDetail=!1;onSelectStage=null;bestStageStars={};discoveredConstellations=[];discoveredMonthlyEncounters=[];colorVisionSupportMode=T;detailBackLabel="もどる";detailPreviewController=null;createPreviewController;galleryActionCleanups=new Set;detailActionCleanups=new Set;static COMPACT_HEIGHT_THRESHOLD=768;constructor(e={}){this.createPreviewController=e.createPreviewController??K}show(e,i,t,n,a=[],s=T,l=[]){if(this.overlayEl)return;this.onSelectStage=t??null,this.bestStageStars=n??{},this.discoveredConstellations=a,this.colorVisionSupportMode=s,this.discoveredMonthlyEncounters=l,this.detailBackLabel="もどる",this.activeTab="planets",this.galleryPanels.clear();const d=document.getElementById("ui-overlay");if(!d)return;this.overlayEl=document.createElement("div"),this.applyOverlayStyle(this.overlayEl,30),this.overlayEl.setAttribute("role","dialog"),this.overlayEl.setAttribute("aria-modal","true"),this.overlayEl.setAttribute("aria-labelledby",g.GALLERY_TITLE_ID);const r=this.isCompactHeight(),c=document.createElement("div");c.setAttribute("data-gallery-content",""),c.style.cssText=`
      width: min(960px, 100%);
      height: 100%;
      max-height: 720px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      padding: ${r?"0.45rem 0.35rem":"0.5rem"};
      box-sizing: border-box;
    `;const m=document.createElement("div");m.id=g.GALLERY_TITLE_ID,m.textContent=g.PLANET_TAB_LABEL,m.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${r?"1.7rem":"2rem"};
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
      margin-bottom: ${r?"0.45rem":"0.8rem"};
      text-align: center;
    `,this.galleryTitleEl=m,c.appendChild(m),c.appendChild(this.createTabBar(r));const u=document.createElement("div");u.setAttribute("data-gallery-main",""),u.style.cssText=`
      position: relative;
      width: min(100%, 900px);
      min-height: 0;
      flex: 1 1 auto;
      display: grid;
      align-items: stretch;
      justify-content: center;
    `;const b=this.createPlanetPanel(e,r),h=this.createMonthlyPanel(r);this.galleryPanels.set("planets",b),this.galleryPanels.set("monthly",h),u.appendChild(b),u.appendChild(h),this.setActiveTab("planets"),c.appendChild(u);const o=document.createElement("button");o.setAttribute("data-gallery-back",""),o.textContent="もどる",o.style.cssText=`
      margin-top: ${r?"0.55rem":"0.8rem"};
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${r?"1.05rem":"1.25rem"};
      font-weight: 700;
      padding: ${r?"0.45rem 1.45rem":"0.55rem 1.8rem"};
      border: none;
      border-radius: 1.5rem;
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
      cursor: pointer;
      touch-action: manipulation;
      transform: scale(1);
      transition: transform 0.08s ease-out;
    `,this.galleryActionCleanups.add(C(o,{onActivate:()=>{this.hide(),i()},onPressChange:p=>{o.style.transform=p?"scale(0.96)":"scale(1)"},moveTolerancePx:g.RELEASE_CONFIRM_MOVE_TOLERANCE_PX})),c.appendChild(o),this.overlayEl.appendChild(c),d.appendChild(this.overlayEl)}showStageDetail(e,i,t={}){if(this.overlayEl)return!1;const n=O(e);if(!n)return!1;this.onSelectStage=null,this.bestStageStars=t.bestStageStars??{},this.discoveredConstellations=t.discoveredConstellations??[],this.colorVisionSupportMode=t.colorVisionSupportMode??T,this.detailBackLabel=t.backLabel??"もどる";const a=document.getElementById("ui-overlay");return a?(this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-encyclopedia-detail-overlay",""),this.applyOverlayStyle(this.overlayEl,t.zIndex??30),this.overlayEl.setAttribute("role","dialog"),this.overlayEl.setAttribute("aria-modal","true"),this.overlayEl.setAttribute("aria-labelledby",g.DETAIL_TITLE_ID),a.appendChild(this.overlayEl),this.showDetail(n,i),!0):!1}applyOverlayStyle(e,i){e.style.cssText=`
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
    `,e.style.zIndex=String(i)}hide(){this.cleanupActionCleanups(this.detailActionCleanups),this.cleanupActionCleanups(this.galleryActionCleanups),this.hideDetailPreview(),this.detailEl&&(this.detailEl.remove(),this.detailEl=null),this.overlayEl&&(this.overlayEl.remove(),this.overlayEl=null),this.isShowingDetail=!1,this.onSelectStage=null,this.bestStageStars={},this.discoveredConstellations=[],this.discoveredMonthlyEncounters=[],this.colorVisionSupportMode=T,this.detailBackLabel="もどる",this.galleryTitleEl=null,this.galleryPanels.clear(),this.activeTab="planets",this.disposeDetailPreview()}createTabBar(e){const i=document.createElement("div");return i.style.cssText=`
      display: flex;
      gap: 0.45rem;
      margin-bottom: ${e?"0.4rem":"0.55rem"};
    `,i.appendChild(this.createTabButton("planets","わくせい",e)),i.appendChild(this.createTabButton("monthly","てんたい",e)),i}createTabButton(e,i,t){const n=document.createElement("button");return n.setAttribute("data-encyclopedia-tab",e),n.textContent=i,n.style.cssText=`
      min-width: ${t?"7.4rem":"8.4rem"};
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${t?"0.95rem":"1.05rem"};
      font-weight: 800;
      padding: ${t?"0.42rem 0.9rem":"0.5rem 1rem"};
      border: none;
      border-radius: 999px;
      color: #fff;
      background: rgba(255, 255, 255, 0.12);
      cursor: pointer;
      touch-action: manipulation;
      transform: scale(1);
      transition: transform 0.08s ease-out, background 0.12s ease-out;
    `,this.galleryActionCleanups.add(C(n,{onActivate:()=>{this.setActiveTab(e)},onPressChange:a=>{n.style.transform=a?"scale(0.96)":"scale(1)"},moveTolerancePx:g.RELEASE_CONFIRM_MOVE_TOLERANCE_PX})),n}setActiveTab(e){this.activeTab=e,this.galleryTitleEl&&(this.galleryTitleEl.textContent=e==="monthly"?g.MONTHLY_TAB_LABEL:g.PLANET_TAB_LABEL);for(const[t,n]of this.galleryPanels){const a=t===e;n.style.display=a?"grid":"none",n.setAttribute("data-active",a?"true":"false")}(this.overlayEl?.querySelectorAll("[data-encyclopedia-tab]")??[]).forEach(t=>{const n=t.getAttribute("data-encyclopedia-tab")===e;t.style.background=n?"linear-gradient(135deg, rgba(255, 215, 112, 0.9), rgba(123, 199, 255, 0.85))":"rgba(255, 255, 255, 0.12)",t.style.color=n?"#18233b":"#fff",t.setAttribute("aria-pressed",n?"true":"false")})}createPlanetPanel(e,i){const t=document.createElement("div");t.setAttribute("data-encyclopedia-panel","planets"),t.style.cssText=`
      display: grid;
      grid-area: 1 / 1;
      grid-template-columns: minmax(0, 1fr) minmax(12rem, 0.34fr);
      gap: ${i?"0.55rem":"0.8rem"};
      width: 100%;
      align-items: stretch;
      min-height: 0;
    `;const n=document.createElement("div");n.setAttribute("data-gallery-grid",""),n.setAttribute("aria-label","わくせい の いちらん"),n.style.cssText=`
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(${i?"86px":"110px"}, 1fr));
      gap: ${i?"0.45rem":"0.65rem"};
      width: 100%;
      justify-items: center;
      align-items: stretch;
    `;for(const a of F){const s=e.includes(a.stageNumber),l=this.createCard(a,s,i);n.appendChild(l)}return t.appendChild(n),t.appendChild(this.createConstellationSection(i)),t}createMonthlyPanel(e){const i=document.createElement("div");i.setAttribute("data-encyclopedia-panel","monthly"),i.style.cssText=`
      display: none;
      grid-area: 1 / 1;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: ${e?"0.45rem":"0.6rem"};
      width: 100%;
      align-content: start;
    `;for(const t of G){const n=this.discoveredMonthlyEncounters.includes(t.id),a=document.createElement("div");a.setAttribute("data-monthly-encounter-card",""),a.setAttribute("data-monthly-encounter-id",t.id),a.style.cssText=`
        min-height: ${e?"96px":"116px"};
        border-radius: 18px;
        padding: ${e?"0.5rem":"0.65rem"};
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        gap: 0.18rem;
        background: ${n?`linear-gradient(135deg, #${t.accentColor.toString(16).padStart(6,"0")}aa, rgba(255,255,255,0.16))`:"rgba(255,255,255,0.08)"};
        color: ${n?"#fff":"#aeb8d7"};
        box-shadow: 0 4px 12px rgba(0,0,0,0.24);
      `;const s=document.createElement("div");s.textContent=`${t.month}がつ`,s.style.cssText=`
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${e?"0.7rem":"0.8rem"};
        font-weight: 800;
      `,a.appendChild(s);const l=document.createElement("div");l.textContent=n?t.emoji:"✨",l.style.fontSize=e?"1.4rem":"1.7rem",a.appendChild(l);const d=document.createElement("div");d.textContent=n?t.reading:"？？？",d.style.cssText=`
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${e?"0.78rem":"0.9rem"};
        font-weight: 900;
        overflow-wrap: anywhere;
      `,a.appendChild(d);const r=document.createElement("div");r.textContent=n?t.trivia:"こんげつ みつけると ずかんに のるよ",r.style.cssText=`
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${e?"0.62rem":"0.72rem"};
        line-height: 1.3;
        overflow-wrap: anywhere;
      `,a.appendChild(r),i.appendChild(a)}return i}createConstellationSection(e){const i=document.createElement("div");i.setAttribute("data-constellation-gallery",""),i.style.cssText=`
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
    `,i.appendChild(t);const n=document.createElement("div");n.style.cssText=`
      display: flex;
      flex-direction: column;
      gap: ${e?"0.4rem":"0.55rem"};
      width: 100%;
      min-width: 0;
    `;for(const a of j){const s=this.discoveredConstellations.includes(a.stageNumber),l=document.createElement("div");l.setAttribute("data-constellation-card",""),l.setAttribute("data-stage",String(a.stageNumber)),l.style.cssText=`
        min-height: ${e?"62px":"74px"};
        border-radius: 16px;
        padding: ${e?"0.45rem":"0.55rem"};
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: ${e?"0.45rem":"0.55rem"};
        background: ${s?"linear-gradient(135deg, rgba(98, 220, 255, 0.35), rgba(71, 100, 255, 0.2))":"rgba(255, 255, 255, 0.08)"};
        color: ${s?"#fff":"#9aa7c8"};
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.24);
        box-sizing: border-box;
      `,l.appendChild(this.createConstellationPicture(a,s,e));const d=document.createElement("div");d.style.cssText=`
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        min-width: 0;
      `;const r=document.createElement("div");r.textContent=`ステージ ${a.stageNumber}`,r.style.cssText=`
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${e?"0.68rem":"0.76rem"};
        font-weight: 700;
      `,d.appendChild(r);const c=document.createElement("div");c.textContent=s?a.name:"？？？",c.style.cssText=`
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${e?"0.86rem":"0.95rem"};
        font-weight: 900;
        margin-top: 0.08rem;
        text-align: left;
        overflow-wrap: anywhere;
      `,d.appendChild(c),l.appendChild(d),n.appendChild(l)}return i.appendChild(n),i}createConstellationPicture(e,i,t){const n=document.createElementNS("http://www.w3.org/2000/svg","svg"),a=t?48:56;n.setAttribute("data-constellation-picture",""),n.setAttribute("viewBox","0 0 100 64"),n.setAttribute("width",String(a)),n.setAttribute("height",String(Math.round(a*.64))),n.setAttribute("aria-hidden","true"),n.style.cssText=`
      flex: 0 0 auto;
      border-radius: 12px;
      background: ${i?"rgba(4, 12, 40, 0.42)":"rgba(255, 255, 255, 0.05)"};
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.14);
    `;const s=e.points,l=Math.min(...s.map(o=>o.x)),d=Math.max(...s.map(o=>o.x)),r=Math.min(...s.map(o=>o.z)),c=Math.max(...s.map(o=>o.z)),m=Math.max(d-l,1),u=Math.max(c-r,1),b=s.map(o=>{const p=12+(o.x-l)/m*76,f=10+(o.z-r)/u*44;return{x:p,y:f}}),h=document.createElementNS("http://www.w3.org/2000/svg","polyline");h.setAttribute("points",b.map(o=>`${o.x.toFixed(1)},${o.y.toFixed(1)}`).join(" ")),h.setAttribute("fill","none"),h.setAttribute("stroke",i?"#bdf4ff":"#7b86a8"),h.setAttribute("stroke-width","4"),h.setAttribute("stroke-linecap","round"),h.setAttribute("stroke-linejoin","round"),h.setAttribute("opacity",i?"0.95":"0.45"),n.appendChild(h);for(const o of b){const p=document.createElementNS("http://www.w3.org/2000/svg","circle");p.setAttribute("cx",o.x.toFixed(1)),p.setAttribute("cy",o.y.toFixed(1)),p.setAttribute("r",i?"4.8":"4.2"),p.setAttribute("fill",i?"#fff8aa":"#aab2d4"),p.setAttribute("opacity",i?"1":"0.55"),n.appendChild(p)}return n}createCard(e,i,t){const n=document.createElement("div");if(n.setAttribute("data-card",""),n.setAttribute("data-stage",String(e.stageNumber)),n.style.cssText=`
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
    `,i){const a="#"+e.planetColor.toString(16).padStart(6,"0");n.style.background=`linear-gradient(135deg, ${a}88, ${a}44)`,n.style.cursor="pointer",n.setAttribute("role","button"),n.setAttribute("tabindex","0");const s=document.createElement("div");s.textContent=e.emoji,s.setAttribute("aria-hidden","true"),s.style.fontSize=t?"1.45rem":"1.75rem",n.appendChild(s);const l=document.createElement("div");l.textContent=this.getPlanetLabel(e),l.style.cssText=`
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${t?"0.76rem":"0.88rem"};
        font-weight: 700;
        color: #fff;
        margin-top: 0.18rem;
        text-align: center;
        overflow-wrap: anywhere;
      `,n.appendChild(l);const d=this.bestStageStars[e.stageNumber]??0;n.setAttribute("aria-label",this.getCardAriaLabel(e,d));const r=$(e.stageNumber,d,{hint:d>0?`⭐ ベスト ${d}`:void 0,size:"compact",scope:"encyclopedia-card"});r.style.marginTop="0.22rem",n.appendChild(r),this.galleryActionCleanups.add(C(n,{onActivate:()=>{this.showDetail(e)},onPressChange:c=>{n.style.transform=c?"scale(0.95)":"scale(1)"},moveTolerancePx:g.RELEASE_CONFIRM_MOVE_TOLERANCE_PX}))}else{n.style.background="#444",n.style.opacity="0.6",n.style.pointerEvents="none",n.setAttribute("aria-disabled","true"),n.setAttribute("aria-label","まだ みつけていない わくせい");const a=document.createElement("div");a.textContent="？？？",a.style.cssText=`
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${t?"0.9rem":"1.05rem"};
        color: #aaa;
        text-align: center;
      `,n.appendChild(a)}return n}showDetail(e,i){if(this.isShowingDetail||!this.overlayEl)return;this.isShowingDetail=!0,this.cleanupActionCleanups(this.detailActionCleanups);const t=this.isCompactHeight();this.detailEl=document.createElement("div"),this.detailEl.setAttribute("data-detail",""),this.detailEl.setAttribute("role","dialog"),this.detailEl.setAttribute("aria-modal","true"),this.detailEl.setAttribute("aria-labelledby",g.DETAIL_TITLE_ID),this.detailEl.style.cssText=`
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
    `;const n="#"+e.planetColor.toString(16).padStart(6,"0"),a=document.createElement("div");a.setAttribute("data-detail-content",""),a.style.cssText=`
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
    `;const s=document.createElement("div");s.setAttribute("data-detail-card",""),s.style.cssText=`
      width: min(${t?"440px":"500px"}, 100%);
      background: linear-gradient(135deg, ${n}88, ${n}44);
      border-radius: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: ${t?"0.8rem 0.9rem":"1.15rem"};
      overflow: hidden;
      box-sizing: border-box;
    `,s.style.overflowY="hidden";const l=document.createElement("div");l.textContent=e.emoji,l.setAttribute("aria-hidden","true"),l.style.fontSize=t?"2.35rem":"3rem",s.appendChild(l);const d=document.createElement("div");d.id=g.DETAIL_TITLE_ID,d.textContent=this.getPlanetLabel(e),d.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${t?"1.35rem":"1.65rem"};
      font-weight: 700;
      color: #FFD700;
      margin: 0.25rem 0;
      text-align: center;
    `,s.appendChild(d);const r=document.createElement("div");r.setAttribute("data-detail-companion",""),r.style.cssText=`
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.35rem;
      margin-top: 0.2rem;
    `;const c=document.createElement("div");c.textContent="うちゅうの なかま",c.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${t?"0.78rem":"0.9rem"};
      font-weight: 700;
      color: #fff;
      letter-spacing: 0.04em;
    `,r.appendChild(c);const m=document.createElement("div");m.setAttribute("data-detail-companion-preview",""),m.setAttribute("aria-hidden","true"),m.style.cssText=`
      width: ${t?"78px":"96px"};
      height: ${t?"78px":"96px"};
      border-radius: 20px;
      overflow: hidden;
      background: radial-gradient(circle at top, rgba(255,255,255,0.22), rgba(0,0,0,0.16));
      box-shadow: inset 0 0 18px rgba(255,255,255,0.12), 0 10px 20px rgba(0,0,0,0.22);
    `,r.appendChild(m),this.getDetailPreviewController().show(e,m),s.appendChild(r);const u=document.createElement("div");u.textContent=e.trivia,u.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${t?"0.9rem":"1.05rem"};
      color: #fff;
      line-height: ${t?"1.35":"1.5"};
      padding: ${t?"0.55rem 0.25rem":"0.8rem 0.5rem"};
      text-align: center;
    `,s.appendChild(u);const b=this.bestStageStars[e.stageNumber]??0,h=$(e.stageNumber,b,{label:"メダル",hint:b>0?`⭐ ベスト ${b}`:void 0,size:"hero",scope:"encyclopedia-detail"});h.style.marginTop="0.2rem",s.appendChild(h);const o=Z(e.stageNumber);if(o){const f=document.createElement("div"),x=this.discoveredConstellations.includes(e.stageNumber);f.setAttribute("data-detail-constellation",""),f.style.cssText=`
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
      `,f.appendChild(this.createConstellationPicture(o,x,!0));const y=document.createElement("span");y.textContent=x?`✨ みつけた せいざ: ${o.encyclopediaLabel}`:`💫 このステージの せいざ: ${o.name}`,f.appendChild(y),s.appendChild(f)}if(this.onSelectStage){const f=document.createElement("button");f.setAttribute("data-detail-play",""),f.textContent="このステージで あそぶ",f.style.cssText=`
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
      `,this.detailActionCleanups.add(C(f,{onActivate:()=>{const x=this.onSelectStage;if(!x)return;const y=e.stageNumber;this.hide(),x(y)},onPressChange:x=>{f.style.transform=x?"scale(0.96)":"scale(1)"},moveTolerancePx:g.RELEASE_CONFIRM_MOVE_TOLERANCE_PX})),s.appendChild(f)}a.appendChild(s);const p=document.createElement("button");p.setAttribute("data-detail-back",""),p.textContent=this.detailBackLabel,p.style.cssText=`
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
    `,this.detailActionCleanups.add(C(p,{onActivate:()=>{if(i){this.hide(),i();return}this.hideDetail()},onPressChange:f=>{p.style.transform=f?"scale(0.96)":"scale(1)"},moveTolerancePx:g.RELEASE_CONFIRM_MOVE_TOLERANCE_PX})),a.appendChild(p),this.detailEl.appendChild(a),this.overlayEl.appendChild(this.detailEl)}hideDetail(){this.cleanupActionCleanups(this.detailActionCleanups),this.hideDetailPreview(),this.detailEl&&(this.detailEl.remove(),this.detailEl=null),this.isShowingDetail=!1}getDetailPreviewController(){return this.detailPreviewController||(this.detailPreviewController=this.createPreviewController()),this.detailPreviewController}hideDetailPreview(){this.detailPreviewController?.hide()}disposeDetailPreview(){this.detailPreviewController?.dispose(),this.detailPreviewController=null}cleanupActionCleanups(e){for(const i of e)i();e.clear()}isCompactHeight(){return window.innerHeight<=g.COMPACT_HEIGHT_THRESHOLD}getCardAriaLabel(e,i){const t=[this.getPlanetLabel(e)];return i>0&&t.push(`ベスト ほし ${i}こ`),t.push("くわしく みる"),t.join("、")}getPlanetLabel(e){return V(e,this.colorVisionSupportMode)}}export{g as EncyclopediaOverlay};
