import { Breaker } from './breaker.model';

export interface Panel {
  id: string;
  breakers: Breaker[];
}