import { Panel } from "./panel.model";

export interface Bus {
  id: string;
  name: string;
  voltage: string;
  panels: Panel[];
}

