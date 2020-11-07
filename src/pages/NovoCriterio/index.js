import React, { useEffect, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';

import api from '../../services/api';

import './styles.css'
import Navbar from '../components/Navbar';
export default function NovoCriterio() {
  const [value, setValue] = useState('**DADO QUE** \n\n**QUANDO** \n\n**ENTAO**');
  const [tags, setTags] = useState('');
  const [novo, setNovo] = useState(false);
  const [grupos, setGrupos] = useState([]);
  const [novoGrupo, setNovoGrupo] = useState('');

  useEffect(() => {
    async function loadGrupos() {
      const response = await api.get('/grupo');
      console.log(response.data);
      setGrupos(response.data);
    };
    loadGrupos();
  }, []);
  async function onHandleSubmit(e) {
    e.preventDefault();
    if (tags === '') {
      alert('É obrigatório informar uma tag');
    } else {
      const data = {
        criterio: value,
        tags: tags.toLowerCase()
      }

      if (novo) {
        const grupoResponse = await api.post('/grupo', { nome: novoGrupo })
        console.log(grupoResponse);
        data.grupoId = grupoResponse.data.id;
      } else {
        data.grupoId = novoGrupo;
      }
      const response = await api.post('/criterio', data);
      if (response.data && response.data.id) {
        alert('Inserido com sucesso');
        window.location.reload();
      }
    }
  }

  async function onSelectOption(e) {
    if (e === "novo") {
      setNovo(() => true);
    } else {
      setNovoGrupo(e);
    }
  }
  return (
    <>
      <Navbar />
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
        <select hidden={novo} onChange={e => onSelectOption(e.target.value)}>
          <option disabled selected>Selecione um grupo</option>
          {grupos.map(gr => (
            <option key={gr.id} value={gr.id}>{gr.nome}</option>
          ))}
          <option value="novo">Novo Grupo</option>
        </select>
        <input
          hidden={!novo}
          type="text"
          placeholder="Digite o nome do novo grupo"
          value={novoGrupo}
          onChange={e => setNovoGrupo(e.target.value)}
        />
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