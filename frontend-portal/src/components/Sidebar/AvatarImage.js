'use client';
import { useEffect, useState } from 'react';

export default function AvatarImage() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  if (!show) return null;

  return (
    <img
      src="/img/user.png"
      alt="Avatar"
      className="user-avatar"
    />
  );
}
