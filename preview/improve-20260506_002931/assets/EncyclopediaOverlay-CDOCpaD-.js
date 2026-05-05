import{aj as k,ak as R,al as G,h as T,j as B,P as O,am as F,an as j,ao as Z,a4 as V,ap as X}from"./game-core-Bm5ToED6.js";import{v as Y,P as W,u as U,w as q}from"./three-BsQe5WE2.js";import{a as C,c as $}from"./game-scenes-D0ge68f3.js";const M=120,J=1.5,K=.015;function Q(A={}){const e=A.createRenderer??k,i=A.createPreviewMesh??R,t=A.raf??requestAnimationFrame,n=A.caf??cancelAnimationFrame;let a=!1,r=!1,s=null,l=null,d=null,o=null,m=null,h=null,g=null,f=null,c=!1;const p=()=>s||(s=document.createElement("canvas"),s.setAttribute("data-companion-preview-canvas",""),s.style.cssText=`
      width: 100%;
      height: 100%;
      display: block;
    `,s),u=()=>l||(l=document.createElement("div"),l.setAttribute("data-companion-preview-fallback",""),l.textContent="👾",l.style.cssText=`
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.35));
    `,l),x=()=>{c&&(c=!1,f!==null&&(n(f),f=null))},y=()=>{!o||!h||(o.remove(h),G(h),h=null)},_=()=>{g?.replaceChildren(),s?.remove(),l?.remove(),g=null},D=()=>{!d||!o||!m||d.render(o,m)},I=()=>{if(c||!d||!o||!m||!h)return;c=!0;const v=()=>{!c||a||!d||!o||!m||!h||(h.rotation.y+=K,d.render(o,m),f=t(v))};f=t(v)},N=()=>{if(d&&o&&m)return!0;if(!(typeof window<"u"&&(typeof window.WebGLRenderingContext<"u"||typeof window.WebGL2RenderingContext<"u"))||r)return r=!0,!1;try{const E=Math.min(typeof window<"u"&&window.devicePixelRatio||1,J),w=e(p(),E);w.setPixelRatio(E),w.setSize(M,M,!1),w.setClearColor(0,0);const S=new Y,P=new W(32,1,.1,20);P.position.set(0,.15,3.1);const z=new U(16777215,1.5),L=new q(16777215,1.2);return L.position.set(2,3,4),S.add(z,L),d=w,o=S,m=P,!0}catch{return s?.remove(),d=null,o=null,m=null,r=!0,!1}};return{show(v,E){if(!a){if(x(),y(),g=E,!N()){E.replaceChildren(u());return}E.replaceChildren(p()),h=i(v),o?.add(h),D(),I()}},hide(){a||(x(),y(),_())},dispose(){a||(this.hide(),a=!0,d?.forceContextLoss?.(),d?.dispose(),d=null,o=null,m=null,s=null,l=null)}}}class b{static RELEASE_CONFIRM_MOVE_TOLERANCE_PX=12;static GALLERY_TITLE_ID="encyclopedia-gallery-title";static DETAIL_TITLE_ID="encyclopedia-detail-title";static PLANET_TAB_LABEL="わくせいずかん";static MONTHLY_TAB_LABEL="てんたいずかん";static GEM_TAB_LABEL="たからばこ";overlayEl=null;detailEl=null;galleryTitleEl=null;galleryPanels=new Map;activeTab="planets";isShowingDetail=!1;onSelectStage=null;bestStageStars={};discoveredConstellations=[];discoveredMonthlyEncounters=[];discoveredSpaceGems=[];colorVisionSupportMode=T;detailBackLabel="もどる";detailPreviewController=null;createPreviewController;galleryActionCleanups=new Set;detailActionCleanups=new Set;static COMPACT_HEIGHT_THRESHOLD=768;constructor(e={}){this.createPreviewController=e.createPreviewController??Q}show(e,i,t,n,a=[],r=T,s=[],l=[]){if(this.overlayEl)return;this.onSelectStage=t??null,this.bestStageStars=n??{},this.discoveredConstellations=a,this.colorVisionSupportMode=r,this.discoveredMonthlyEncounters=s,this.discoveredSpaceGems=l,this.detailBackLabel="もどる",this.activeTab="planets",this.galleryPanels.clear();const d=document.getElementById("ui-overlay");if(!d)return;this.overlayEl=document.createElement("div"),this.applyOverlayStyle(this.overlayEl,30),this.overlayEl.setAttribute("role","dialog"),this.overlayEl.setAttribute("aria-modal","true"),this.overlayEl.setAttribute("aria-labelledby",b.GALLERY_TITLE_ID);const o=this.isCompactHeight(),m=document.createElement("div");m.setAttribute("data-gallery-content",""),m.style.cssText=`
      width: min(960px, 100%);
      height: 100%;
      max-height: 720px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      padding: ${o?"0.45rem 0.35rem":"0.5rem"};
      box-sizing: border-box;
    `;const h=document.createElement("div");h.id=b.GALLERY_TITLE_ID,h.textContent=b.PLANET_TAB_LABEL,h.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${o?"1.7rem":"2rem"};
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
      margin-bottom: ${o?"0.45rem":"0.8rem"};
      text-align: center;
    `,this.galleryTitleEl=h,m.appendChild(h),m.appendChild(this.createTabBar(o));const g=document.createElement("div");g.setAttribute("data-gallery-main",""),g.style.cssText=`
      position: relative;
      width: min(100%, 900px);
      min-height: 0;
      flex: 1 1 auto;
      display: grid;
      align-items: stretch;
      justify-content: center;
    `;const f=this.createPlanetPanel(e,o),c=this.createMonthlyPanel(o),p=this.createGemPanel(o);this.galleryPanels.set("planets",f),this.galleryPanels.set("monthly",c),this.galleryPanels.set("gems",p),g.appendChild(f),g.appendChild(c),g.appendChild(p),this.setActiveTab("planets"),m.appendChild(g);const u=document.createElement("button");u.setAttribute("data-gallery-back",""),u.textContent="もどる",u.style.cssText=`
      margin-top: ${o?"0.55rem":"0.8rem"};
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${o?"1.05rem":"1.25rem"};
      font-weight: 700;
      padding: ${o?"0.45rem 1.45rem":"0.55rem 1.8rem"};
      border: none;
      border-radius: 1.5rem;
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
      cursor: pointer;
      touch-action: manipulation;
      transform: scale(1);
      transition: transform 0.08s ease-out;
    `,this.galleryActionCleanups.add(C(u,{onActivate:()=>{this.hide(),i()},onPressChange:x=>{u.style.transform=x?"scale(0.96)":"scale(1)"},moveTolerancePx:b.RELEASE_CONFIRM_MOVE_TOLERANCE_PX})),m.appendChild(u),this.overlayEl.appendChild(m),d.appendChild(this.overlayEl)}showStageDetail(e,i,t={}){if(this.overlayEl)return!1;const n=B(e);if(!n)return!1;this.onSelectStage=null,this.bestStageStars=t.bestStageStars??{},this.discoveredConstellations=t.discoveredConstellations??[],this.colorVisionSupportMode=t.colorVisionSupportMode??T,this.detailBackLabel=t.backLabel??"もどる";const a=document.getElementById("ui-overlay");return a?(this.overlayEl=document.createElement("div"),this.overlayEl.setAttribute("data-encyclopedia-detail-overlay",""),this.applyOverlayStyle(this.overlayEl,t.zIndex??30),this.overlayEl.setAttribute("role","dialog"),this.overlayEl.setAttribute("aria-modal","true"),this.overlayEl.setAttribute("aria-labelledby",b.DETAIL_TITLE_ID),a.appendChild(this.overlayEl),this.showDetail(n,i),!0):!1}applyOverlayStyle(e,i){e.style.cssText=`
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
    `,e.style.zIndex=String(i)}hide(){this.cleanupActionCleanups(this.detailActionCleanups),this.cleanupActionCleanups(this.galleryActionCleanups),this.hideDetailPreview(),this.detailEl&&(this.detailEl.remove(),this.detailEl=null),this.overlayEl&&(this.overlayEl.remove(),this.overlayEl=null),this.isShowingDetail=!1,this.onSelectStage=null,this.bestStageStars={},this.discoveredConstellations=[],this.discoveredMonthlyEncounters=[],this.discoveredSpaceGems=[],this.colorVisionSupportMode=T,this.detailBackLabel="もどる",this.galleryTitleEl=null,this.galleryPanels.clear(),this.activeTab="planets",this.disposeDetailPreview()}createTabBar(e){const i=document.createElement("div");return i.style.cssText=`
      display: flex;
      gap: 0.45rem;
      margin-bottom: ${e?"0.4rem":"0.55rem"};
    `,i.appendChild(this.createTabButton("planets","わくせい",e)),i.appendChild(this.createTabButton("monthly","てんたい",e)),i.appendChild(this.createTabButton("gems","たから",e)),i}createTabButton(e,i,t){const n=document.createElement("button");return n.setAttribute("data-encyclopedia-tab",e),n.textContent=i,n.style.cssText=`
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
    `,this.galleryActionCleanups.add(C(n,{onActivate:()=>{this.setActiveTab(e)},onPressChange:a=>{n.style.transform=a?"scale(0.96)":"scale(1)"},moveTolerancePx:b.RELEASE_CONFIRM_MOVE_TOLERANCE_PX})),n}setActiveTab(e){this.activeTab=e,this.galleryTitleEl&&(this.galleryTitleEl.textContent=e==="monthly"?b.MONTHLY_TAB_LABEL:e==="gems"?b.GEM_TAB_LABEL:b.PLANET_TAB_LABEL);for(const[t,n]of this.galleryPanels){const a=t===e;n.style.display=a?"grid":"none",n.setAttribute("data-active",a?"true":"false")}(this.overlayEl?.querySelectorAll("[data-encyclopedia-tab]")??[]).forEach(t=>{const n=t.getAttribute("data-encyclopedia-tab")===e;t.style.background=n?"linear-gradient(135deg, rgba(255, 215, 112, 0.9), rgba(123, 199, 255, 0.85))":"rgba(255, 255, 255, 0.12)",t.style.color=n?"#18233b":"#fff",t.setAttribute("aria-pressed",n?"true":"false")})}createPlanetPanel(e,i){const t=document.createElement("div");t.setAttribute("data-encyclopedia-panel","planets"),t.style.cssText=`
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
    `;for(const a of O){const r=e.includes(a.stageNumber),s=this.createCard(a,r,i);n.appendChild(s)}return t.appendChild(n),t.appendChild(this.createConstellationSection(i)),t}createMonthlyPanel(e){const i=document.createElement("div");i.setAttribute("data-encyclopedia-panel","monthly"),i.style.cssText=`
      display: none;
      grid-area: 1 / 1;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: ${e?"0.45rem":"0.6rem"};
      width: 100%;
      align-content: start;
    `;for(const t of F){const n=this.discoveredMonthlyEncounters.includes(t.id),a=document.createElement("div");a.setAttribute("data-monthly-encounter-card",""),a.setAttribute("data-monthly-encounter-id",t.id),a.style.cssText=`
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
      `;const r=document.createElement("div");r.textContent=`${t.month}がつ`,r.style.cssText=`
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${e?"0.7rem":"0.8rem"};
        font-weight: 800;
      `,a.appendChild(r);const s=document.createElement("div");s.textContent=n?t.emoji:"✨",s.style.fontSize=e?"1.4rem":"1.7rem",a.appendChild(s);const l=document.createElement("div");l.textContent=n?t.reading:"？？？",l.style.cssText=`
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${e?"0.78rem":"0.9rem"};
        font-weight: 900;
        overflow-wrap: anywhere;
      `,a.appendChild(l);const d=document.createElement("div");d.textContent=n?t.trivia:"こんげつ みつけると ずかんに のるよ",d.style.cssText=`
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${e?"0.62rem":"0.72rem"};
        line-height: 1.3;
        overflow-wrap: anywhere;
      `,a.appendChild(d),i.appendChild(a)}return i}createGemPanel(e){const i=document.createElement("div");i.setAttribute("data-encyclopedia-panel","gems"),i.style.cssText=`
      display: none;
      grid-area: 1 / 1;
      grid-template-columns: repeat(auto-fit, minmax(${e?"112px":"132px"}, 1fr));
      gap: ${e?"0.45rem":"0.6rem"};
      width: 100%;
      align-content: start;
    `;for(const t of j){const n=this.discoveredSpaceGems.includes(t.id),a=document.createElement("div");a.setAttribute("data-space-gem-card",""),a.setAttribute("data-space-gem-id",t.id),a.style.cssText=`
        min-height: ${e?"112px":"132px"};
        border-radius: 18px;
        padding: ${e?"0.5rem":"0.7rem"};
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        gap: 0.22rem;
        background: ${n?`linear-gradient(135deg, #${t.accentColor.toString(16).padStart(6,"0")}cc, rgba(255,255,255,0.16))`:"rgba(255,255,255,0.08)"};
        color: ${n?"#fff":"#aeb8d7"};
        box-shadow: 0 4px 12px rgba(0,0,0,0.24);
      `;const r=document.createElement("div");r.textContent=n?t.emoji:"🎁",r.style.fontSize=e?"1.5rem":"1.8rem",a.appendChild(r);const s=document.createElement("div");s.textContent=n?t.reading:"？？？",s.style.cssText=`
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${e?"0.74rem":"0.88rem"};
        font-weight: 900;
        overflow-wrap: anywhere;
      `,a.appendChild(s);const l=document.createElement("div");l.textContent=n?t.trivia:"ステージで みつけると たからばこに はいるよ",l.style.cssText=`
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${e?"0.6rem":"0.72rem"};
        line-height: 1.3;
        overflow-wrap: anywhere;
      `,a.appendChild(l),i.appendChild(a)}return i}createConstellationSection(e){const i=document.createElement("div");i.setAttribute("data-constellation-gallery",""),i.style.cssText=`
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
    `;for(const a of Z){const r=this.discoveredConstellations.includes(a.stageNumber),s=document.createElement("div");s.setAttribute("data-constellation-card",""),s.setAttribute("data-stage",String(a.stageNumber)),s.style.cssText=`
        min-height: ${e?"62px":"74px"};
        border-radius: 16px;
        padding: ${e?"0.45rem":"0.55rem"};
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: ${e?"0.45rem":"0.55rem"};
        background: ${r?"linear-gradient(135deg, rgba(98, 220, 255, 0.35), rgba(71, 100, 255, 0.2))":"rgba(255, 255, 255, 0.08)"};
        color: ${r?"#fff":"#9aa7c8"};
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.24);
        box-sizing: border-box;
      `,s.appendChild(this.createConstellationPicture(a,r,e));const l=document.createElement("div");l.style.cssText=`
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        min-width: 0;
      `;const d=document.createElement("div");d.textContent=`ステージ ${a.stageNumber}`,d.style.cssText=`
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${e?"0.68rem":"0.76rem"};
        font-weight: 700;
      `,l.appendChild(d);const o=document.createElement("div");o.textContent=r?a.name:"？？？",o.style.cssText=`
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${e?"0.86rem":"0.95rem"};
        font-weight: 900;
        margin-top: 0.08rem;
        text-align: left;
        overflow-wrap: anywhere;
      `,l.appendChild(o),s.appendChild(l),n.appendChild(s)}return i.appendChild(n),i}createConstellationPicture(e,i,t){const n=document.createElementNS("http://www.w3.org/2000/svg","svg"),a=t?48:56;n.setAttribute("data-constellation-picture",""),n.setAttribute("viewBox","0 0 100 64"),n.setAttribute("width",String(a)),n.setAttribute("height",String(Math.round(a*.64))),n.setAttribute("aria-hidden","true"),n.style.cssText=`
      flex: 0 0 auto;
      border-radius: 12px;
      background: ${i?"rgba(4, 12, 40, 0.42)":"rgba(255, 255, 255, 0.05)"};
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.14);
    `;const r=e.points,s=Math.min(...r.map(c=>c.x)),l=Math.max(...r.map(c=>c.x)),d=Math.min(...r.map(c=>c.z)),o=Math.max(...r.map(c=>c.z)),m=Math.max(l-s,1),h=Math.max(o-d,1),g=r.map(c=>{const p=12+(c.x-s)/m*76,u=10+(c.z-d)/h*44;return{x:p,y:u}}),f=document.createElementNS("http://www.w3.org/2000/svg","polyline");f.setAttribute("points",g.map(c=>`${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(" ")),f.setAttribute("fill","none"),f.setAttribute("stroke",i?"#bdf4ff":"#7b86a8"),f.setAttribute("stroke-width","4"),f.setAttribute("stroke-linecap","round"),f.setAttribute("stroke-linejoin","round"),f.setAttribute("opacity",i?"0.95":"0.45"),n.appendChild(f);for(const c of g){const p=document.createElementNS("http://www.w3.org/2000/svg","circle");p.setAttribute("cx",c.x.toFixed(1)),p.setAttribute("cy",c.y.toFixed(1)),p.setAttribute("r",i?"4.8":"4.2"),p.setAttribute("fill",i?"#fff8aa":"#aab2d4"),p.setAttribute("opacity",i?"1":"0.55"),n.appendChild(p)}return n}createCard(e,i,t){const n=document.createElement("div");if(n.setAttribute("data-card",""),n.setAttribute("data-stage",String(e.stageNumber)),n.style.cssText=`
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
    `,i){const a="#"+e.planetColor.toString(16).padStart(6,"0");n.style.background=`linear-gradient(135deg, ${a}88, ${a}44)`,n.style.cursor="pointer",n.setAttribute("role","button"),n.setAttribute("tabindex","0");const r=document.createElement("div");r.textContent=e.emoji,r.setAttribute("aria-hidden","true"),r.style.fontSize=t?"1.45rem":"1.75rem",n.appendChild(r);const s=document.createElement("div");s.textContent=this.getPlanetLabel(e),s.style.cssText=`
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${t?"0.76rem":"0.88rem"};
        font-weight: 700;
        color: #fff;
        margin-top: 0.18rem;
        text-align: center;
        overflow-wrap: anywhere;
      `,n.appendChild(s);const l=this.bestStageStars[e.stageNumber]??0;n.setAttribute("aria-label",this.getCardAriaLabel(e,l));const d=$(e.stageNumber,l,{hint:l>0?`⭐ ベスト ${l}`:void 0,size:"compact",scope:"encyclopedia-card"});d.style.marginTop="0.22rem",n.appendChild(d),this.galleryActionCleanups.add(C(n,{onActivate:()=>{this.showDetail(e)},onPressChange:o=>{n.style.transform=o?"scale(0.95)":"scale(1)"},moveTolerancePx:b.RELEASE_CONFIRM_MOVE_TOLERANCE_PX}))}else{n.style.background="#444",n.style.opacity="0.6",n.style.pointerEvents="none",n.setAttribute("aria-disabled","true"),n.setAttribute("aria-label","まだ みつけていない わくせい");const a=document.createElement("div");a.textContent="？？？",a.style.cssText=`
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: ${t?"0.9rem":"1.05rem"};
        color: #aaa;
        text-align: center;
      `,n.appendChild(a)}return n}showDetail(e,i){if(this.isShowingDetail||!this.overlayEl)return;this.isShowingDetail=!0,this.cleanupActionCleanups(this.detailActionCleanups);const t=this.isCompactHeight();this.detailEl=document.createElement("div"),this.detailEl.setAttribute("data-detail",""),this.detailEl.setAttribute("role","dialog"),this.detailEl.setAttribute("aria-modal","true"),this.detailEl.setAttribute("aria-labelledby",b.DETAIL_TITLE_ID),this.detailEl.style.cssText=`
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
    `;const r=document.createElement("div");r.setAttribute("data-detail-card",""),r.style.cssText=`
      width: min(${t?"440px":"500px"}, 100%);
      background: linear-gradient(135deg, ${n}88, ${n}44);
      border-radius: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: ${t?"0.8rem 0.9rem":"1.15rem"};
      overflow: hidden;
      box-sizing: border-box;
    `,r.style.overflowY="hidden";const s=document.createElement("div");s.textContent=e.emoji,s.setAttribute("aria-hidden","true"),s.style.fontSize=t?"2.35rem":"3rem",r.appendChild(s);const l=document.createElement("div");l.id=b.DETAIL_TITLE_ID,l.textContent=this.getPlanetLabel(e),l.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${t?"1.35rem":"1.65rem"};
      font-weight: 700;
      color: #FFD700;
      margin: 0.25rem 0;
      text-align: center;
    `,r.appendChild(l);const d=document.createElement("div");d.setAttribute("data-detail-companion",""),d.style.cssText=`
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.35rem;
      margin-top: 0.2rem;
    `;const o=document.createElement("div");o.textContent="うちゅうの なかま",o.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${t?"0.78rem":"0.9rem"};
      font-weight: 700;
      color: #fff;
      letter-spacing: 0.04em;
    `,d.appendChild(o);const m=document.createElement("div");m.setAttribute("data-detail-companion-preview",""),m.setAttribute("aria-hidden","true"),m.style.cssText=`
      width: ${t?"78px":"96px"};
      height: ${t?"78px":"96px"};
      border-radius: 20px;
      overflow: hidden;
      background: radial-gradient(circle at top, rgba(255,255,255,0.22), rgba(0,0,0,0.16));
      box-shadow: inset 0 0 18px rgba(255,255,255,0.12), 0 10px 20px rgba(0,0,0,0.22);
    `,d.appendChild(m),this.getDetailPreviewController().show(e,m),r.appendChild(d);const h=document.createElement("div");h.textContent=e.trivia,h.style.cssText=`
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${t?"0.9rem":"1.05rem"};
      color: #fff;
      line-height: ${t?"1.35":"1.5"};
      padding: ${t?"0.55rem 0.25rem":"0.8rem 0.5rem"};
      text-align: center;
    `,r.appendChild(h);const g=this.bestStageStars[e.stageNumber]??0,f=$(e.stageNumber,g,{label:"メダル",hint:g>0?`⭐ ベスト ${g}`:void 0,size:"hero",scope:"encyclopedia-detail"});f.style.marginTop="0.2rem",r.appendChild(f);const c=V(e.stageNumber);if(c){const u=document.createElement("div"),x=this.discoveredConstellations.includes(e.stageNumber);u.setAttribute("data-detail-constellation",""),u.style.cssText=`
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
      `,u.appendChild(this.createConstellationPicture(c,x,!0));const y=document.createElement("span");y.textContent=x?`✨ みつけた せいざ: ${c.encyclopediaLabel}`:`💫 このステージの せいざ: ${c.name}`,u.appendChild(y),r.appendChild(u)}if(this.onSelectStage){const u=document.createElement("button");u.setAttribute("data-detail-play",""),u.textContent="このステージで あそぶ",u.style.cssText=`
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
      `,this.detailActionCleanups.add(C(u,{onActivate:()=>{const x=this.onSelectStage;if(!x)return;const y=e.stageNumber;this.hide(),x(y)},onPressChange:x=>{u.style.transform=x?"scale(0.96)":"scale(1)"},moveTolerancePx:b.RELEASE_CONFIRM_MOVE_TOLERANCE_PX})),r.appendChild(u)}a.appendChild(r);const p=document.createElement("button");p.setAttribute("data-detail-back",""),p.textContent=this.detailBackLabel,p.style.cssText=`
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
    `,this.detailActionCleanups.add(C(p,{onActivate:()=>{if(i){this.hide(),i();return}this.hideDetail()},onPressChange:u=>{p.style.transform=u?"scale(0.96)":"scale(1)"},moveTolerancePx:b.RELEASE_CONFIRM_MOVE_TOLERANCE_PX})),a.appendChild(p),this.detailEl.appendChild(a),this.overlayEl.appendChild(this.detailEl)}hideDetail(){this.cleanupActionCleanups(this.detailActionCleanups),this.hideDetailPreview(),this.detailEl&&(this.detailEl.remove(),this.detailEl=null),this.isShowingDetail=!1}getDetailPreviewController(){return this.detailPreviewController||(this.detailPreviewController=this.createPreviewController()),this.detailPreviewController}hideDetailPreview(){this.detailPreviewController?.hide()}disposeDetailPreview(){this.detailPreviewController?.dispose(),this.detailPreviewController=null}cleanupActionCleanups(e){for(const i of e)i();e.clear()}isCompactHeight(){return window.innerHeight<=b.COMPACT_HEIGHT_THRESHOLD}getCardAriaLabel(e,i){const t=[this.getPlanetLabel(e)];return i>0&&t.push(`ベスト ほし ${i}こ`),t.push("くわしく みる"),t.join("、")}getPlanetLabel(e){return X(e,this.colorVisionSupportMode)}}export{b as EncyclopediaOverlay};
