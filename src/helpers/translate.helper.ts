import { AnyObject } from '@react-bulk/core';

// TODO TYPE
const tokens = {
  'pt-BR': {
    Add: 'Adicionar',
    Cancel: 'Cancelar',
    Connect: 'Conectar',
    Connections: 'Conexões',
    Database: 'Banco de Dados',
    'Delete connection?': 'Remover conexão?',
    Disconnect: 'Desconectar',
    Edit: 'Editar',
    Empty: 'Vazio',
    Hide: 'Esconder',
    More: 'Mais',
    Name: 'Nome',
    Password: 'Senha',
    Port: 'Porta',
    Query: 'Consulta',
    Refresh: 'Atualizar',
    Remove: 'Remover',
    Results: 'Resultados',
    Save: 'Salvar',
    Server: 'Servidor',
    Show: 'Mostrar',
    'Something went wrong': 'Houve um erro inesperado',
    Structs: 'Estruturas',
    Tables: 'Tabelas',
    Test: 'Testar',
    Type: 'Tipo',
    Username: 'Usuário',
  },
};

export function t(text: string) {
  // @ts-expect-error
  const lang = navigator.language || navigator.userLanguage;
  // @ts-expect-error
  let langTokens: AnyObject = tokens?.[lang] || {};

  let suffix = '';
  let checkText = `${text ?? ''}`.trim();

  if (checkText.endsWith(' *')) {
    suffix = ' *';
    checkText = checkText.replace(/ \*$/, '');
  }

  // Check full lowercase
  if (/^[a-z]+$/.test(checkText)) {
    langTokens = Object.fromEntries(
      Object.entries(langTokens).map(([key, text]) => [key.toLowerCase(), text.toLowerCase()]),
    );
  }

  // Check full uppercase
  if (/^[A-Z]+$/.test(checkText)) {
    langTokens = Object.fromEntries(
      Object.entries(langTokens).map(([key, text]) => [key.toUpperCase(), text.toUpperCase()]),
    );
  }

  const found = langTokens[checkText];

  return typeof found === 'undefined' ? text ?? '' : `${found}${suffix}`;
}
