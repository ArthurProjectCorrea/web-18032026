'use client';

import * as React from 'react';
import { ColumnDef, Row } from '@tanstack/react-table';
import { DataTableColumnHeader } from './data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Helper to create a standard text column with sorting header
 */
export function createTextColumn<TData>(
  accessorKey: string,
  title: string
): ColumnDef<TData> {
  return {
    accessorKey,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={title} />
    ),
    meta: { title },
  };
}

/**
 * Helper to create a badge column
 */
export function createBadgeColumn<TData>(
  accessorKey: string,
  title: string,
  options?: {
    variant?:
      | 'default'
      | 'secondary'
      | 'destructive'
      | 'outline'
      | null
      | ((
          value: unknown
        ) => 'default' | 'secondary' | 'destructive' | 'outline');
    formatter?: (value: unknown) => string;
    fallback?: string;
  }
): ColumnDef<TData> {
  return {
    accessorKey,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={title} />
    ),
    cell: ({ getValue }) => {
      const value = getValue();
      const label = options?.formatter ? options.formatter(value) : value;
      const variant =
        typeof options?.variant === 'function'
          ? options.variant(value)
          : options?.variant || 'secondary';

      return (
        <Badge
          variant={
            variant as
              | 'default'
              | 'secondary'
              | 'destructive'
              | 'outline'
              | null
              | undefined
          }
          className="capitalize"
        >
          {String(label || options?.fallback || 'N/A')}
        </Badge>
      );
    },
    meta: { title },
  };
}

/**
 * Helper to create a formatted date column
 */
export function createDateColumn<TData>(
  accessorKey: string,
  title: string,
  dateFormat: string = "dd 'de' MMMM 'de' yyyy"
): ColumnDef<TData> {
  return {
    accessorKey,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={title} />
    ),
    cell: ({ getValue }) => {
      const date = getValue() as string;
      if (!date) return '-';
      try {
        return format(new Date(date), dateFormat, {
          locale: ptBR,
        });
      } catch {
        return 'Data Inválida';
      }
    },
    meta: { title },
  };
}

export function createCustomColumn<TData, TValue = unknown>(
  accessorKey: string,
  title: string,
  CellComponent: React.ComponentType<{ row: Row<TData>; value: TValue }>,
  options: Partial<ColumnDef<TData, TValue>> = {}
): ColumnDef<TData, TValue> {
  return {
    accessorKey,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={title} />
    ),
    cell: ({ row, getValue }) => (
      <CellComponent row={row} value={getValue() as TValue} />
    ),
    meta: { title },
    ...options,
  };
}
