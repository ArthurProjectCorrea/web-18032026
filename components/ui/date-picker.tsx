'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DatePickerProps {
  date?: string | Date | null;
  setDate: (date: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  captionLayout?: 'label' | 'dropdown' | 'dropdown-months' | 'dropdown-years';
}

export function DatePicker({
  date,
  setDate,
  placeholder = 'Selecione uma data',
  disabled,
  className,
  captionLayout = 'dropdown',
}: DatePickerProps) {
  const selectedDate = React.useMemo(() => {
    if (!date) return undefined;
    if (date instanceof Date) return date;
    const d = new Date(date);
    return isNaN(d.getTime()) ? undefined : d;
  }, [date]);

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Button
        variant={'outline'}
        className={cn(
          'w-full justify-start text-left font-normal',
          !date && 'text-muted-foreground',
          className
        )}
        disabled
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        <span>{placeholder}</span>
      </Button>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground',
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? (
            format(selectedDate, 'PPP', { locale: ptBR })
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(d) => d && setDate(d.toISOString())}
          initialFocus
          captionLayout={captionLayout}
          // Permitir seleção de datas passadas e futuras para nascimento e processos
          fromYear={1900}
          toYear={new Date().getFullYear() + 10}
        />
      </PopoverContent>
    </Popover>
  );
}
