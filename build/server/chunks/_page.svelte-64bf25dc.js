import { c as create_ssr_component, d as each, v as validate_component, e as escape } from './ssr-966767de.js';
import { isSameDay, format } from 'date-fns';
import de from 'date-fns/locale/de/index.js';
import { E as EmptyCard } from './EmptyCard-54bf603c.js';

const css = {
  code: ".row.svelte-1fyrj5j:not(:first-child):not(.same){border-top:1px dashed var(--bs-gray)}.row.odd.svelte-1fyrj5j{color:pink}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let events;
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  data.prevPage;
  data.nextPage;
  events = data.events?.map((event) => ({ ...event, isSameDay: false, isOdd: false }));
  {
    events?.forEach((event, i, arr) => {
      event.isSameDay = i > 0 && isSameDay(arr[i].tsStart, arr[i - 1].tsStart);
      event.isOdd = event.isSameDay ? arr[i - 1].isOdd : !arr[i - 1]?.isOdd;
    });
  }
  return `<div class="h-100 d-flex flex-column justify-content-end">${events.length > 0 ? `${each(events, (event) => {
    return `<div class="${[
      "row fs-2 svelte-1fyrj5j",
      (event.isSameDay ? "same" : "") + " " + (event.isOdd ? "odd" : "")
    ].join(" ").trim()}">${!event.isSameDay ? `<div class="col-1">${escape(format(event.tsStart, "iii", { locale: de }))}</div> <div class="col-1">${escape(format(event.tsStart, "d.", { locale: de }))}</div>` : `<div class="col-2"></div>`} ${event.isWholeDay ? `<div class="col-2" data-svelte-h="svelte-1xjyjcs">------</div>` : `<div class="col-2">${escape(format(event.tsStart, "HH:mm", { locale: de }))}</div>`} <div class="col">${escape(event.content)}</div> </div>`;
  })}` : `${validate_component(EmptyCard, "EmptyCard").$$render($$result, {}, {}, {
    default: () => {
      return `Es wurden keine Kalendereinträge gefunden`;
    }
  })}`} </div>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-64bf25dc.js.map
