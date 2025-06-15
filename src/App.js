import { format,formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import React, { useState, useEffect } from 'react';

function App() {
  const [tarefa, setTarefa] = useState('');
  const [lista, setLista] = useState(() => {
    const tarefasSalvas = localStorage.getItem('minha_lista');
    if (tarefasSalvas) {
      try {
        return JSON.parse(tarefasSalvas);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [editandoIndex, setEditandoIndex] = useState(null);
const [textoEditado, setTextoEditado] = useState('');

  useEffect(() => {
    localStorage.setItem('minha_lista', JSON.stringify(lista));
  }, [lista]);

  const formatarDataCompleta = (data) => {
  const dataFormatada = format(new Date(data), "dd/MM/yyyy 'às' HH:mm", {
    locale: ptBR,
  });

  const tempoPassado = formatDistanceToNow(new Date(data), {
    addSuffix: true,
    locale: ptBR,
  });

  return `${dataFormatada} (${tempoPassado})`;
};

 
    const adicionarTarefa = () => {
    if (tarefa.trim() === '') return;

    const novaTarefa = {
      texto: tarefa,
      concluida: false,
      dataCriacao: new Date().toISOString()
    };

    setLista(prev => [...prev, novaTarefa]);
    setTarefa('');
  };

  const removerTarefa = (index) => {
    const novaLista = lista.filter((_, i) => i !== index);
    setLista(novaLista);
  };

  const alternarConcluida = (index) => {
    const novaLista = [...lista];
    novaLista[index].concluida = !novaLista[index].concluida;
    setLista(novaLista);
  };

 
  const salvarEdicao = () => {
  if (textoEditado.trim() === '') return;

  const novaLista = [...lista];
  novaLista[editandoIndex].texto = textoEditado;
  setLista(novaLista);
  setEditandoIndex(null);
  setTextoEditado('');
};

  return (
    <div style={{ padding: '20px' }}>
      <h1>Minha Lista de Tarefas</h1>

      <input
        type="text"
        placeholder="Digite uma tarefa..."
        value={tarefa}
        onChange={(e) => setTarefa(e.target.value)}
      />

      <button onClick={adicionarTarefa}>Adicionar</button>

   <ul>
  {lista.map((item, index) => (
    <li
  key={index}
  style={{
    listStyle: 'none',
    marginBottom: '16px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: item.concluida ? '#f0f0f0' : '#fff',
    transition: 'all 0.3s ease',
  }}
>
  {editandoIndex === index ? (
    <>
      <input
        type="text"
        value={textoEditado}
        onChange={(e) => setTextoEditado(e.target.value)}
        style={{ width: '100%', padding: '6px', fontSize: '16px' }}
      />
      <button
        onClick={salvarEdicao}
        style={{
          marginTop: '8px',
          padding: '4px 8px',
          fontSize: '14px',
          backgroundColor: '#52c41a',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginRight: '8px',
        }}
      >
        Salvar
      </button>

      <button
       onClick={() => {
        setEditandoIndex(null);
        setTextoEditado('');
       }}
       style={{
         padding: '4px 8px',
        fontSize: '14px',
        backgroundColor: '#bfbfbf',
        color: 'black',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
       }}
       >
        Cancelar
      </button>
   
      
    </>
  ) : (
    <>
      <div
        onClick={() => alternarConcluida(index)}
        style={{
          textDecoration: item.concluida ? 'line-through' : 'none',
          color: item.concluida ? 'gray' : 'black',
          fontSize: '18px',
          cursor: 'pointer',
        }}
      >
        {item.texto}
      </div>

      <small style={{ color: 'gray', display: 'block', marginTop: '4px' }}>
        Criada em {formatarDataCompleta(item.dataCriacao)}
      </small>

      <div style={{ marginTop: '8px' }}>
        <button
          onClick={() => {
            setEditandoIndex(index);
            setTextoEditado(item.texto);
          }}
          style={{
            padding: '4px 8px',
            fontSize: '14px',
            backgroundColor: '#1890ff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '8px',
          }}
        >
          Editar
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            removerTarefa(index);
          }}
          style={{
            padding: '4px 8px',
            fontSize: '14px',
            backgroundColor: '#ff4d4f',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Remover
        </button>
      </div>
    </>
  )}
</li>
  ))}
</ul>
    </div>
  );
}

export default App;