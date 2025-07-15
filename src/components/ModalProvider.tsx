'use client';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

export default function ModalPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return ReactDOM.createPortal(children, document.body);
}
