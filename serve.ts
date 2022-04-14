import { serve } from "https://deno.land/x/esbuild_serve@0.0.5/mod.ts";

serve({
    pages: {
        "serial": "./pages/serial.ts",
        "index": "./pages/landing.ts",
        "account": "./pages/account/mod.ts",
        "p/imprint": "./pages/imprint.ts",
        "games/nonogramm/index": "./pages/games/nonogramm.ts"
    }
})