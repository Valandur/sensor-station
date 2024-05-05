import { c as create_ssr_component, e as escape, k as compute_slots } from './ssr-C0K3FAqp.js';

const Card = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$slots = compute_slots(slots);
  let { type = "theme" } = $$props;
  if ($$props.type === void 0 && $$bindings.type && type !== void 0)
    $$bindings.type(type);
  return `<div class="${"card bg-" + escape(type, true) + " border-" + escape(type, true) + " bg-opacity-25"}">${$$slots.header ? `<div class="${"card-header border-" + escape(type, true) + " fw-bold small d-flex justify-content-between"}">${slots.header ? slots.header({}) : ``}</div>` : ``} ${$$slots.title || $$slots.subTitle || $$slots.default ? `<div class="card-body">${$$slots.title ? `<h5 class="card-title">${slots.title ? slots.title({}) : ``}</h5>` : ``} ${$$slots.subTitle ? `<h6 class="card-subtitle mb-2 text-white text-opacity-50">${slots.subTitle ? slots.subTitle({}) : ``}</h6>` : ``} ${$$slots.default ? `${slots.default ? slots.default({}) : ``}` : ``}</div>` : ``} ${slots.body ? slots.body({}) : ``} <div class="card-arrow" data-svelte-h="svelte-1yy7ii4"><div class="card-arrow-top-left"></div> <div class="card-arrow-top-right"></div> <div class="card-arrow-bottom-left"></div> <div class="card-arrow-bottom-right"></div></div></div>`;
});

export { Card as C };
//# sourceMappingURL=Card-BVME-Fpr.js.map
