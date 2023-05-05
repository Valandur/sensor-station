import { c as create_ssr_component, d as each, e as escape } from './index3-5519d9f6.js';
import { format } from 'date-fns';
import de from 'date-fns/locale/de/index.js';

const css = {
  code: ".row.svelte-s7rz14{font-size:1.6rem}.row.svelte-s7rz14:nth-of-type(even){color:pink}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let events;
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  events = data.events;
  data.prevPage;
  data.nextPage;
  return `<div class="container-fluid m-0 h-100">${each(events, (event) => {
    return `<div class="row svelte-s7rz14"><div class="col-1">${escape(format(event.tsStart, "iii", { locale: de }))}</div>
			<div class="col-1">${escape(format(event.tsStart, "d.", { locale: de }))}</div>
			${event.isWholeDay ? `<div class="col-2">-------</div>` : `<div class="col-2">${escape(format(event.tsStart, "HH:mm", { locale: de }))}</div>`}
			<div class="col">${escape(event.content)}</div>
		</div>`;
  })}
</div>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-ab2c507a.js.map
