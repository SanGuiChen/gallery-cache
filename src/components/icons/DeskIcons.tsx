import type { SVGProps } from 'react';

function cx(className?: string) {
  return className ?? '';
}

export function IconLogoMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden {...props} className={cx(props.className)}>
      <rect x="5" y="7" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="13" y="5" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" fill="#ffffff" />
    </svg>
  );
}

export function IconFolder(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden {...props} className={cx(props.className)}>
      <path
        d="M3.5 6.5h4l1.2 1.5H16.5a1 1 0 011 1V14a1 1 0 01-1 1h-13a1 1 0 01-1-1V7.5a1 1 0 011-1z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconTag(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden {...props} className={cx(props.className)}>
      <path
        d="M3.5 4.5h5.2L16 11.8a1.2 1.2 0 010 1.7l-2.3 2.3a1.2 1.2 0 01-1.7 0L3.5 9.7V4.5z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <circle cx="6" cy="7" r="1" fill="currentColor" />
    </svg>
  );
}

export function IconPencil(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden {...props} className={cx(props.className)}>
      <path
        d="M12.5 4.5l3 3-8 8H4.5v-3l8-8z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconSearch(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden {...props} className={cx(props.className)}>
      <circle cx="8.5" cy="8.5" r="5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12.2 12.2L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconPlus(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden {...props} className={cx(props.className)}>
      <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconSettings(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden {...props} className={cx(props.className)}>
      <path
        d="M10 12a2 2 0 100-4 2 2 0 000 4z"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="M16.18 11.42a2.5 2.5 0 00.36-3.05l1.29-1.29a1 1 0 000-1.42l-1.28-1.28a2.5 2.5 0 00-3.06-.36l-1.28.65a2.2 2.2 0 00-1.26.05l-.03.01a2 2 0 00-.97.58l-.92.92a2 2 0 00-.58.97l-.01.03c-.06.24-.08.49-.03.74l.65 1.28a2.5 2.5 0 00.36 3.06l1.28 1.28a1 1 0 001.42 0l1.29-1.29a2.5 2.5 0 003.05-.36l.64-1.28c.06-.12.1-.25.13-.38a2 2 0 00-.08-1.33l-.43-1.25z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconGrid(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden {...props} className={cx(props.className)}>
      <rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="11" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="3" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="11" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export function IconList(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden {...props} className={cx(props.className)}>
      <path d="M4 5h12M4 10h12M4 15h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconDownload(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden {...props} className={cx(props.className)}>
      <path d="M10 3v9m0 0l3-3m-3 3L7 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 16h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function IconImage(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden {...props} className={cx(props.className)}>
      <rect x="3" y="4" width="14" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="7" cy="8" r="1.5" fill="currentColor" />
      <path d="M3 14l4-4 3 3 4-5 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconUser(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden {...props} className={cx(props.className)}>
      <circle cx="12" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconCameraEmpty(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden {...props} className={cx(props.className)}>
      <rect x="8" y="22" width="64" height="44" rx="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M28 22V16a4 4 0 014-4h16a4 4 0 014 4v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="40" cy="44" r="12" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="40" cy="44" r="6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
