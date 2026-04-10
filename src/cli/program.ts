import { Command } from "commander";
import { registerScanCommand } from "./commands/scan.js";

export function createProgram(): Command {
  const program = new Command();

  program
    .name("redsketch")
    .description("Threat-model your Figma designs before writing a single line of code")
    .version("0.1.2");

  registerScanCommand(program);

  return program;
}
