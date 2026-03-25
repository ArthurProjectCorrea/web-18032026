import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function maskCpf(value: string) {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
}

export function maskPhone(value: string) {
  const clean = value.replace(/\D/g, '');
  if (clean.length <= 10) {
    return clean
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 14);
  }
  return clean
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 15);
}

export function maskCep(value: string) {
  if (!value) return '';
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{5})(\d)/, '$1-$2')
    .slice(0, 9);
}

export function maskLawsuit(value: string) {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{7})(\d)/, '$1-$2')
    .replace(/(\d{7}-\d{2})(\d)/, '$1.$2')
    .replace(/(\d{7}-\d{2}.\d{4})(\d)/, '$1.$2')
    .replace(/(\d{7}-\d{2}.\d{4}.\d{1})(\d)/, '$1.$2')
    .replace(/(\d{7}-\d{2}.\d{4}.\d{1}.\d{2})(\d)/, '$1.$2')
    .slice(0, 25);
}

export function maskCpfOrLawsuit(value: string) {
  const clean = value.replace(/\D/g, '');
  if (clean.length <= 11) {
    return maskCpf(value);
  }
  return maskLawsuit(value);
}
