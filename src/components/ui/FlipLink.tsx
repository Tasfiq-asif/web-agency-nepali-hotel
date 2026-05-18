'use client';

import { useState } from 'react';

interface FlipLinkProps {
  href: string;
  label: string;
  defaultColor?: string;
  activeColor?: string;
  fontSize?: number;
  letterSpacing?: string;
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
}

export function FlipLink({
  href,
  label,
  defaultColor = 'var(--color-text-secondary)',
  activeColor = 'var(--color-ink)',
  fontSize = 11,
  letterSpacing = '0.12em',
  style,
  className,
  onClick,
}: FlipLinkProps) {
  const [hovered, setHovered] = useState(false);

  const spanBase: React.CSSProperties = {
    display: 'block',
    fontFamily: 'var(--font-mono)',
    fontSize,
    letterSpacing,
    textTransform: 'uppercase',
    lineHeight: 1,
    whiteSpace: 'nowrap',
    transition: 'transform 0.42s cubic-bezier(0.16, 1, 0.3, 1)',
  };

  return (
    <a
      href={href}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        display: 'inline-block',
        overflow: 'hidden',
        textDecoration: 'none',
        lineHeight: 1,
        ...style,
      }}
      className={className}
    >
      <span
        style={{
          ...spanBase,
          color: defaultColor,
          transform: hovered ? 'translateY(-110%)' : 'translateY(0)',
          transition: `${spanBase.transition}, color 0.5s ease`,
        }}
      >
        {label}
      </span>

      <span
        aria-hidden
        style={{
          ...spanBase,
          position: 'absolute',
          top: '100%',
          left: 0,
          color: activeColor,
          transform: hovered ? 'translateY(-110%)' : 'translateY(0)',
        }}
      >
        {label}
      </span>
    </a>
  );
}
