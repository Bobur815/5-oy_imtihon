
import { Prisma } from '@prisma/client';

export function toNumber(value: number | string | Prisma.Decimal): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    if (isNaN(parsed)) throw new Error(`toNumber: "${value}" ni number ga o‘girishda xato`);
    return parsed;
  }
  return (value as Prisma.Decimal).toNumber();
}

export function getFutureTime(seconds: number) {
  const date = new Date();
  date.setSeconds(new Date().getSeconds() + seconds);
  return date;
}

export function getPastTime(seconds: number) {
  const now = new Date();
  return new Date(now.getTime() - seconds * 1000);
}

export function secToMills(seconds: number) {
  return seconds * 1000;
}

export function getInMills(date: Date | number | string) {
  if (!date) {
    return 0;
  }
  try {
    return new Date(date).getTime();
  } catch {
    return 0;
  }
}

export function validateWithinMinutes(date: Date, minute: number): boolean {
  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - date.getTime();
  return timeDifference <= minute * 60000;
}