import React, { useEffect, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import marked from 'marked';
import htmlToText from 'html-to-text';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'

import api from '../../services/api';

import './styles.css'
import Navbar from '../components/Navbar';

export default function Home() {
  const [criterios, setCriterios] = useState([]);
  const [count, setCount] = useState(0);
  const [tags, setTags] = useState('');
  const [grupos, setGrupos] = useState([]);
  const [grupoSelecionado, setGrupoSelecionado] = useState('');

  useEffect(() => {
    async function loadCriterios() {
      const grupoResponse = await api.get('/grupo');
      console.log(grupoResponse.data);
      setGrupos(grupoResponse.data);
      setGrupoSelecionado(grupoResponse.data[0].id);

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
    const response = await api.get('/criterio', {
      params: {
        tag: tags,
        grupo: grupoSelecionado
      }
    });
    console.log(response.data.dataValues);
    setCriterios(() => response.data.dataValues);
    setCount(() => response.data.count);
  }
  return (
    <>
      <Navbar />

      <form className="search" onSubmit={onHandleSubmit}>
        <label>Tag</label>
        <input
          type="text"
          placeholder="Insira a tag aqui"
          value={tags}
          onChange={e => setTags(e.target.value)}
        />
        <label>Grupo</label>
        <select onChange={e => setGrupoSelecionado(e.target.value)}>
          <option disabled selected>Selecione um grupo</option>
          {grupos.map(gr => (
            <option value={gr.id}>{gr.nome}</option>
          ))}
        </select>
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
              <label>Grupo: {criterio.Grupo.nome}</label>
              <label>Tags: {criterio.tags}</label>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}