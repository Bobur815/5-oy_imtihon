// src/common/types/penny.ts

import { Prisma } from '@prisma/client';  // Prisma namespace ichida Decimal tipi bor

/**
 * Har xil turdagi qiymatni (number, string yoki Prisma.Decimal) oddiy JS number ga o‘giradi.
 */
export function toNumber(value: number | string | Prisma.Decimal): number {
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    if (isNaN(parsed)) {
      throw new Error(`toNumber: "${value}" ni number ga o‘girishda xato`);
    }
    return parsed;
  }
  // Prisma.Decimal obyekti
  if (typeof (value as Prisma.Decimal).toNumber === 'function') {
    return (value as Prisma.Decimal).toNumber();
  }
  throw new Error(`toNumber: tip qo‘llab-quvvatlanmaydi (${typeof value})`);
}

/**
 * Asosiy birlikdagi (masalan so‘m yoki dollar) qiymatni sent (yoki tiyinga) o‘tkazadi.
 * @example amountToPenny(12.34) //=> 1234
 */
export function amountToPenny(amount: number | string | Prisma.Decimal): number {
  const num = toNumber(amount);
  return Math.round(num * 100);
}

export function pennyToAmount(pennies: number): number {
  return pennies / 100;
}