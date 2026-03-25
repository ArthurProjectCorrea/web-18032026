'use client';

import * as React from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

interface MtLogoProps {
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export function MtLogo({
  width = 180,
  height = 60,
  className = 'h-auto w-full object-contain',
  priority = true,
}: MtLogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Provisoriamente usamos os caminhos informados pelo usuário (.png)
  const logoSrc =
    mounted && resolvedTheme === 'dark'
      ? '/_logo_govmt_pb_horizontal.png'
      : '/_logo_govmt_horizontal.png';

  return (
    <Image
      src={logoSrc}
      alt="Logo Governo de Mato Grosso"
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  );
}
