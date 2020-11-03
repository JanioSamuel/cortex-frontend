import React, { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';

import api from '../../services/api';

import './styles.css'
import { Link } from 'react-router-dom';
export default function NovoCriterio() {
  const [value, setValue] = useState('**DADO QUE** \n\n**QUANDO** \n\n**ENTAO**');
  const [tags, setTags] = useState('');

  async function onHandleSubmit(e) {
    e.preventDefault();
    if (tags === '') {
      alert('É obrigatório informar uma tag');
    } else {
      const data = {
        criterio: value,
        tags: tags.toLowerCase()
      }

      const response = await api.post('/criterio', data);
      if (response.data && response.data.id) {
        alert('Inserido com sucesso');
        window.location.reload();
      }
    }
  }
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
      <div className="titulo-criterio">
        <h1>Novo Critério</h1>
      </div>
      <div className="editor">
        <MDEditor
          value={value}
          onChange={setValue}
          height={400}
        />
      </div>
      <div className="tags">
        <input
          type="text"
          placeholder="tags separadas por vírgula"
          value={tags}
          onChange={e => setTags(e.target.value)}
        />
        <button type="submit" onClick={onHandleSubmit}>Salvar</button>
      </div>
    </>
  )
}