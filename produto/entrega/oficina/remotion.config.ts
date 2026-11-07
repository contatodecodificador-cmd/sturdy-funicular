import { Config } from "@remotion/cli/config";
import { existsSync } from "node:fs";

// Na nuvem do Claude Code já existe um navegador instalado.
// Se ele estiver aqui, o Remotion usa esse em vez de baixar outro.
const navegadorDaNuvem = "/opt/pw-browsers/chromium";
if (existsSync(navegadorDaNuvem)) {
  Config.setBrowserExecutable(navegadorDaNuvem);
}

