import { ChatConfig } from "../interface";

export default function getChartContainer (options: ChatConfig) {
  const container = document.querySelector(options.container) as HTMLElement | undefined;

  if (!container) throw new Error('chat container not found');

  return container
}