import { Config } from "@remotion/cli/config";

// Neste espaço na nuvem, usa o Chromium que já vem instalado.
// No seu computador o Remotion baixa o navegador sozinho, então essa linha só vale se o caminho existir.
import { existsSync } from "node:fs";
const chromiumLocal = "/opt/pw-browsers/chromium";
if (existsSync(chromiumLocal)) {
  Config.setBrowserExecutable(chromiumLocal);
}
