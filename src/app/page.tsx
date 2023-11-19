'use client';

import React from 'react';

import QueryEditor from '@/components/QueryEditor';
import useConnection from '@/hooks/useConnection';

export default function Home() {
  const { connection, database } = useConnection();

  return (
    <>
      <QueryEditor />
    </>
  );
}
