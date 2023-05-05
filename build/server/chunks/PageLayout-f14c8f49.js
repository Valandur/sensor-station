import { c as create_ssr_component, v as validate_component, e as escape } from './index3-00641961.js';
import { P as PageTitle } from './PageTitle-cbb73582.js';

const PageLayout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { title } = $$props;
  let { subTitle = "" } = $$props;
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  if ($$props.subTitle === void 0 && $$bindings.subTitle && subTitle !== void 0)
    $$bindings.subTitle(subTitle);
  return `<div class="container-fluid vh-100 d-flex flex-column py-1">${validate_component(PageTitle, "PageTitle").$$render($$result, { showReload: true }, {}, {
    center: () => {
      return `${escape(subTitle)}`;
    },
    default: () => {
      return `${escape(title)}`;
    }
  })}

	${slots.default ? slots.default({}) : ``}</div>`;
});

export { PageLayout as P };
//# sourceMappingURL=PageLayout-f14c8f49.js.map
