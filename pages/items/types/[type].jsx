import React from 'react';
import { useRouter } from 'next/router';

function Types() {
  const router = useRouter();
  const { type } = router.query;
  return (
    <div>{type}</div>
  );
}

export default Types;
