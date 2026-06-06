// SSR entry used only at build time by scripts/prerender.mjs to bake the
// landing page into static HTML. Not part of the client bundle.
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import LandingPage from "./components/landing/LandingPage.jsx";

export function render() {
  return renderToStaticMarkup(
    <MemoryRouter initialEntries={["/"]}>
      <LandingPage />
    </MemoryRouter>
  );
}
