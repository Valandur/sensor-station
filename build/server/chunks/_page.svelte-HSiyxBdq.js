import { c as create_ssr_component, h as each, v as validate_component, j as add_attribute, e as escape } from './ssr-C0K3FAqp.js';
import { formatInTimeZone } from 'date-fns-tz';
import { de } from 'date-fns/locale';
import './client-CjdeEz1m.js';
import { E as EmptyCard } from './EmptyCard-CfonTR6E.js';
import { C as Card } from './Card-BVME-Fpr.js';
import './exports-DuWZopOC.js';

const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let games;
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  games = data.games;
  data.prevPage;
  data.nextPage;
  return `<div class="h-100 d-flex flex-column justify-content-end">${games.length > 0 ? `<div class="row row-cols-2">${each(games, (game) => {
    return `<div class="col">${validate_component(Card, "Card").$$render($$result, {}, {}, {
      body: () => {
        return `<div slot="body" class="p-1"><img${add_attribute("src", `/data/games/${game.image}`, 0)} class="card-img"${add_attribute("alt", game.title, 0)}> <div class="card-img-overlay d-flex flex-column justify-content-end p-1 z-2"><div class="bg-black bg-opacity-75 fw-bold text-white px-1">${escape(game.title)}</div></div> </div>`;
      },
      header: () => {
        return `<div>${escape(formatInTimeZone(game.startsAt, data.tz, "dd MMM", { locale: de }))} -
								${escape(game.endsAt ? formatInTimeZone(game.endsAt, data.tz, "dd MMM", { locale: de }) : "")}</div> <div>${game.pct === 0 ? `Free` : `${escape(game.pct)}%`}</div> `;
      }
    })} </div>`;
  })}</div>` : `${validate_component(EmptyCard, "EmptyCard").$$render($$result, {}, {}, {
    default: () => {
      return `Es wurden keine Spiele gefunden`;
    }
  })}`}</div>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-HSiyxBdq.js.map
