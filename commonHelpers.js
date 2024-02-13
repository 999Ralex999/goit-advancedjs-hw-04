import{S as b,a as d,i as c}from"./assets/vendor-64b55ca9.js";(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))l(t);new MutationObserver(t=>{for(const s of t)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&l(i)}).observe(document,{childList:!0,subtree:!0});function a(t){const s={};return t.integrity&&(s.integrity=t.integrity),t.referrerPolicy&&(s.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?s.credentials="include":t.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function l(t){if(t.ep)return;t.ep=!0;const s=a(t);fetch(t.href,s)}})();var v=new b(".gallery a");function u(){v.refresh()}d.defaults.baseURL="https://pixabay.com/";const n={form:document.querySelector("#search-form"),gallery:document.querySelector(".gallery")},r={query:"",page:1,loader:document.querySelector(".load-more"),showLoader:function(){this.loader.style.visibility="visible"},hideLoader:function(){this.loader.style.visibility="hidden"},updateQuery:function(e){this.query=e},nextPage:function(){this.page++},resetPage:function(){this.page=1}};r.hideLoader();async function h(e,o){return await d.get("api/",{params:{key:"42355472-3aa41b7abe4d1083b6d3aff39",page:o,image_type:"photo",orientation:"horizontal",safesearch:!0,per_page:40,q:e}})}function f({hits:e,total:o,totalHits:a}){return e.map(({webformatURL:l,largeImageURL:t,tags:s,likes:i,views:g,comments:m,downloads:y})=>`
        <a class="photo-card" href="${t}">
          <img src="${l}" alt="${s}" loading="lazy" />
          <div class="info">
          <p class="info-item">
              <b>Likes</b>
              ${i}
          </p>
              <p class="info-item">
          <b>Views</b>
          ${g}
          </p>
          <p class="info-item">
              <b>Comments</b>
              ${m}
          </p>
          <p class="info-item">
              <b>Downloads</b>
              ${y}
          </p>
      </div>`).join("")}n.form.addEventListener("submit",L);function L(e){e.preventDefault();const{searchQuery:o}=e.currentTarget.elements,a=o.value.trim();a&&(r.updateQuery(a),r.resetPage(),w())}async function w(){r.hideLoader();try{const{data:e}=await h(r.query,r.page);if(!e.hits.length)throw n.gallery.innerHTML="",c.show({color:"red",position:"topRight",message:`"We're sorry, repeat search."`}),new Error("Error");const o=Math.ceil(e.totalHits/40);r.page===o?(r.hideLoader(),c.show({color:"red",position:"topRight",message:`"We're sorry, but you've reached the end of search results."`})):r.showLoader(),c.show({color:"green",position:"topRight",message:`"Hooray! We found ${e.totalHits} images."`}),n.gallery.innerHTML=f(e),p.observe(r.loader),u()}catch(e){console.log(e)}}let p=new IntersectionObserver(q,{rootMargin:"500px"});function q(e,o){e.forEach(a=>{a.isIntersecting&&(r.nextPage(),H())})}async function H(){try{const{data:e}=await h(r.query,r.page),o=Math.ceil(e.totalHits/40);r.page===o&&(r.hideLoader(),p.unobserve(r.loader),c.show({color:"red",position:"topRight",message:`"We're sorry, but you've reached the end of search results."`})),n.gallery.insertAdjacentHTML("beforeend",f(e));const{height:a}=n.gallery.firstElementChild.getBoundingClientRect();window.scrollBy({top:a*2.5,behavior:"smooth"}),u()}catch(e){console.log(e)}}
//# sourceMappingURL=commonHelpers.js.map
