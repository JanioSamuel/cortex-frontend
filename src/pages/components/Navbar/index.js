import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <>
      <div className="nav">
        <Link to="novo-criterio">
          <button>Novo</button>
        </Link>
        <Link to="/">
          <button>Critérios</button>
        </Link>
      </div>
    </>
  )
}