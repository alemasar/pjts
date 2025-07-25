import type { Page } from "@cat/cat-vite-plugin/types/pages";
import CatPage from "@cat/template/cat-page";
import catPages from "virtual:page-files";
import catGaps from "virtual:cat-files";
import { CatRouter } from "@cat/core/cat-router";

const router = CatRouter.getInstance();

catPages.forEach((page: Page) => {
  console.log(page.routes.path);
  router.addRoute(page.routes.id, page.routes.path);
  router.addTemplate(page.templates.id, page.templates.template);
});

console.log(catGaps);

customElements.define("cat-page", CatPage);
