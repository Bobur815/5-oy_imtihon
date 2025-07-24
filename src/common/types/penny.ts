// src/common/types/penny.ts

import { Prisma } from '@prisma/client';  
import { toNumber } from '../utils/time-utils';


export function amountToPenny(amount: number | string | Prisma.Decimal): number {
  const num = toNumber(amount);
  return Math.round(num * 100);
}

export function pennyToAmount(pennies: number): number {
  return pennies / 100;
}