import { c as create_ssr_component, j as each, e as escape, k as add_attribute } from './index3-8ba04f94.js';
import { format } from 'date-fns';
import de from 'date-fns/locale/de/index.js';

const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let games;
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  games = data.games;
  return `<div class="container-fluid h-100 m-0 d-flex flex-column justify-content-end"><div class="row row-cols-2">${each(games, (game) => {
    return `<div class="col"><div class="card"><div class="card-header fw-bold d-flex justify-content-between"><div>${escape(format(game.startsAt, "dd MMM"))} - ${escape(format(game.endsAt, "dd MMM", { locale: de }))}</div>
						<div>Free</div></div>

					<div class="card-body p-1 overflow-hidden"><img${add_attribute("src", game.image, 0)} class="card-img"${add_attribute("alt", game.title, 0)}></div>

					<div class="card-arrow"><div class="card-arrow-top-left"></div>
						<div class="card-arrow-top-right"></div>
						<div class="card-arrow-bottom-left"></div>
						<div class="card-arrow-bottom-right"></div>
					</div></div>
			</div>`;
  })}</div></div>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-17bd3d51.js.map
