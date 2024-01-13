import { c as create_ssr_component, h as each, v as validate_component, e as escape, j as add_attribute } from './ssr-4574e5c0.js';
import { format } from 'date-fns';
import de from 'date-fns/locale/de/index.js';
import { E as EmptyCard } from './EmptyCard-148676d8.js';

const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let games;
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  games = data.games;
  data.prevPage;
  data.nextPage;
  return `<div class="h-100 d-flex flex-column justify-content-end">${games.length > 0 ? `<div class="row row-cols-2">${each(games, (game) => {
    return `<div class="col"><div class="card"><div class="card-header fw-bold d-flex justify-content-between"><div>${escape(format(game.startsAt, "dd MMM"))} - ${escape(game.endsAt ? format(game.endsAt, "dd MMM", { locale: de }) : "")}</div> <div>${game.pct === 0 ? `Free` : `${escape(game.pct)}%`} </div></div> <div class="card-body p-1 overflow-hidden"><img${add_attribute("src", `/data/games/${game.image}`, 0)} class="card-img"${add_attribute("alt", game.title, 0)}> <div class="card-img-overlay d-flex flex-column justify-content-end p-1 z-2"><div class="bg-black bg-opacity-75 fw-bold text-white px-1">${escape(game.title)}</div> </div></div> <div class="card-arrow" data-svelte-h="svelte-xg9wqp"><div class="card-arrow-top-left"></div> <div class="card-arrow-top-right"></div> <div class="card-arrow-bottom-left"></div> <div class="card-arrow-bottom-right"></div> </div></div> </div>`;
  })}</div>` : `${validate_component(EmptyCard, "EmptyCard").$$render($$result, {}, {}, {
    default: () => {
      return `Es wurden keine Spiele gefunden`;
    }
  })}`}</div>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-54573a50.js.map
