import React, { useEffect, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import marked from 'marked';
import htmlToText from 'html-to-text';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'

import api from '../../services/api';

import './styles.css'
import { Link } from 'react-router-dom';
export default function Home() {
  const [criterios, setCriterios] = useState([]);
  const [count, setCount] = useState(0);
  const [tags, setTags] = useState('');

  useEffect(() => {
    async function loadCriterios() {
      const response = await api.get('/criterio');
      setCriterios(() => response.data.dataValues);
      setCount(() => response.data.count);
    };
    loadCriterios();
  }, []);

  async function copyToClipboard(e) {
    const el = await document.createElement("textarea");
    console.log(htmlToText.fromString(marked(e)));
    el.innerHTML = htmlToText.fromString(marked(e));
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

  async function onHandleSubmit(e) {
    e.preventDefault();
    if (tags === '') {
      alert('É obrigatório informar uma tag');
    } else {
      const response = await api.get('/criterio', {
        params: {
          tag: tags
        }
      });
      console.log(response.data.dataValues);
      setCriterios(() => response.data.dataValues);
      setCount(() => response.data.count);
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

      <form className="search" onSubmit={onHandleSubmit}>
        <input
          type="text"
          placeholder="Insira a tag aqui"
          value={tags}
          onChange={e => setTags(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>
      <div className="resultados">
        <label>Resultados: {count}</label>
      </div>
      <ul className="apresentacao">
        {criterios.map(criterio => (
          <li key={criterio.id} style={{ listStyle: 'none' }}>
            <div className="markdown">
              <MDEditor.Markdown source={criterio.criterio} />
              <div className="icon">
                <FontAwesomeIcon title="Copiar" icon={faCopy} onClick={() => copyToClipboard(criterio.criterio)} />
              </div>
            </div>
            <div className="label-tags">
              <label>Tags: {criterio.tags}</label>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}