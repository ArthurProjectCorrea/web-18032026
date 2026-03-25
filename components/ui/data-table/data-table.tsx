'use client';

import * as React from 'react';
import { ColumnDef, Table as TanStackTable } from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
  VisibilityState,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CirclePlus, MoreHorizontal, RefreshCw, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { DataTablePagination } from './data-table-pagination';
import { DataTableViewOptions } from './data-table-view-options';

import { toast } from 'sonner';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterColumn?: string;
  filterPlaceholder?: string;
  onDelete?: (data: TData) => Promise<void>;
  EditForm?: React.ComponentType<{ data: TData; close: () => void }>;
  CreateForm?: React.ComponentType<{ close: () => void }>;
  createLink?: string;
  editLink?: (data: TData) => string;
  additionalActions?: (data: TData) => React.ReactNode;
  permissions?: {
    canCreate?: boolean;
    canEdit?: boolean;
    canDelete?: boolean;
    canView?: boolean;
  };
  extraFilters?:
    | React.ReactNode
    | ((table: TanStackTable<TData>) => React.ReactNode);
  dialogClassName?: string;
  filterMask?: (value: string) => string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterColumn,
  filterPlaceholder = 'Filtrar...',
  onDelete,
  EditForm,
  CreateForm,
  createLink,
  editLink,
  additionalActions,
  permissions,
  dialogClassName,
  filterMask,
  extraFilters,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState('');

  const [selectedRow, setSelectedRow] = React.useState<TData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Fix hydration mismatch
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const columnsWithActions = React.useMemo(() => {
    if (!onDelete && !EditForm && !additionalActions && !editLink)
      return columns;

    const actionColumn: ColumnDef<TData, TValue> = {
      id: 'actions',
      cell: ({ row }) => {
        const data = row.original;

        const hasEditLink = !!editLink && permissions?.canEdit !== false;
        const hasEditAction =
          (EditForm || hasEditLink) && permissions?.canEdit !== false;
        const hasDeleteAction = onDelete && permissions?.canDelete !== false;
        const hasAdditionalAction = !!additionalActions;
        const hasAnyAction =
          hasEditAction || hasDeleteAction || hasAdditionalAction;

        if (!isMounted) return <div className="flex w-8 justify-end" />;

        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-8 p-0">
                  <span className="sr-only">Abrir menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>

                {!hasAnyAction && (
                  <DropdownMenuItem
                    disabled
                    className="text-muted-foreground italic"
                  >
                    Sem permissões
                  </DropdownMenuItem>
                )}

                {hasEditAction &&
                  (editLink ? (
                    <DropdownMenuItem asChild>
                      <Link href={editLink(data)}>Editar</Link>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedRow(data);
                        setIsDialogOpen(true);
                      }}
                    >
                      Editar
                    </DropdownMenuItem>
                  ))}

                {additionalActions?.(data)}

                {hasDeleteAction && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => {
                        setSelectedRow(data);
                        setIsAlertDialogOpen(true);
                      }}
                    >
                      Excluir
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    };

    return [...columns, actionColumn];
  }, [
    columns,
    onDelete,
    EditForm,
    additionalActions,
    permissions?.canEdit,
    permissions?.canDelete,
    editLink,
    isMounted,
  ]);

  const table = useReactTable({
    data,
    columns: columnsWithActions,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  const handleDelete = async () => {
    if (!selectedRow || !onDelete) return;
    try {
      setIsDeleting(true);
      await onDelete(selectedRow);
      toast.success('Registro excluído com sucesso!');
      setIsAlertDialogOpen(false);
      setSelectedRow(null);
    } catch (error: unknown) {
      console.error('Delete error:', error);
      toast.error(
        'Erro ao tentar excluir: ' +
          (error instanceof Error ? error.message : String(error))
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex items-center">
            {filterColumn ? (
              <Input
                placeholder={filterPlaceholder}
                value={
                  (table.getColumn(filterColumn)?.getFilterValue() as string) ??
                  ''
                }
                onChange={(event) => {
                  const val = filterMask
                    ? filterMask(event.target.value)
                    : event.target.value;
                  table.getColumn(filterColumn)?.setFilterValue(val);
                }}
                className="w-[320px] pr-9 transition-all"
              />
            ) : (
              <Input
                placeholder={filterPlaceholder}
                value={globalFilter ?? ''}
                onChange={(event) => {
                  const val = filterMask
                    ? filterMask(event.target.value)
                    : event.target.value;
                  setGlobalFilter(val);
                }}
                className="w-[320px] pr-9 transition-all"
              />
            )}

            {(filterColumn
              ? !!table.getColumn(filterColumn)?.getFilterValue()
              : !!globalFilter) && (
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground absolute top-0 right-0 w-9 hover:bg-transparent"
                onClick={() => {
                  if (filterColumn) {
                    table.getColumn(filterColumn)?.setFilterValue('');
                  } else {
                    setGlobalFilter('');
                  }
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {typeof extraFilters === 'function'
            ? extraFilters(table)
            : extraFilters && (
                <div className="flex items-center gap-2">{extraFilters}</div>
              )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => startTransition(() => router.refresh())}
            disabled={isPending}
            className="w-8"
          >
            <RefreshCw className={cn('h-4 w-4', isPending && 'animate-spin')} />
          </Button>
          <DataTableViewOptions table={table} />
          {CreateForm && permissions?.canCreate !== false && (
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <CirclePlus className="mr-2 h-4 w-4" />
              Criar Registro
            </Button>
          )}
          {createLink && permissions?.canCreate !== false && (
            <Button asChild>
              <Link href={createLink}>
                <CirclePlus className="mr-2 h-4 w-4" />
                Criar Registro
              </Link>
            </Button>
          )}
        </div>
      </div>
      <div className="border-border/40 bg-card overflow-hidden rounded-xl border shadow-xs">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />

      {CreateForm && (
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className={cn('sm:max-w-md', dialogClassName)}>
            <DialogHeader>
              <DialogTitle>Criar Novo Registro</DialogTitle>
            </DialogHeader>
            <CreateForm close={() => setIsCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      )}

      {EditForm && selectedRow && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className={cn('sm:max-w-md', dialogClassName)}>
            <DialogHeader>
              <DialogTitle>Editar Registro</DialogTitle>
            </DialogHeader>
            <EditForm data={selectedRow} close={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      )}

      {onDelete && selectedRow && (
        <AlertDialog
          open={isAlertDialogOpen}
          onOpenChange={setIsAlertDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. Isso excluirá permanentemente o
                registro.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete();
                }}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? 'Excluindo...' : 'Confirmar Exclusão'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
