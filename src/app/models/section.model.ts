import { Bus } from "./bus.model";

export interface Section {
  id: string;
  name?: string;
  buses?: Bus[];
}