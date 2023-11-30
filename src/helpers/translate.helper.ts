import { AnyObject } from '@react-bulk/core';

// TODO TYPE
const tokens = {
  'pt-BR': {
    Add: 'Adicionar',
    Alias: 'Apelido',
    Appearance: 'Aparência',
    Cancel: 'Cancelar',
    Close: 'Fechar',
    'Close all tabs': 'Fechar todas as abas',
    'Close other tabs': 'Fechar as outras abas',
    Columns: 'Colunas',
    'Confirm Password': 'Confirmação de Senha',
    Connect: 'Conectar',
    Connected: 'Conectado',
    Connecting: 'Conectando',
    Connections: 'Conexões',
    Database: 'Banco de Dados',
    'Delete connection?': 'Remover conexão?',
    Disconnect: 'Desconectar',
    Disconnected: 'Desconectado',
    Edit: 'Editar',
    Empty: 'Vazio',
    Error: 'Erro',
    Hide: 'Esconder',
    More: 'Mais',
    Name: 'Nome',
    'New Tab': 'Nova Aba',
    Password: 'Senha',
    'Password expired, set a new one': 'Senha expirada, defina uma nova',
    Port: 'Porta',
    'Primary Key': 'Chave Primária',
    Query: 'Consulta',
    Refresh: 'Atualizar',
    Remove: 'Remover',
    Result: 'Resultado',
    Results: 'Resultados',
    'row(s) affected': 'linha(s) afetada(s)',
    Rows: 'Linhas',
    Save: 'Salvar',
    'Save Password': 'Salvar Senha',
    Search: 'Buscar',
    Selected: 'Selecionado',
    Server: 'Servidor',
    Settings: 'Ajustes',
    Shortcuts: 'Atalhos',
    Show: 'Mostrar',
    'Something went wrong': 'Houve um erro inesperado',
    Structs: 'Estruturas',
    'Table Info': 'Informações da Tabela',
    Tables: 'Tabelas',
    Test: 'Testar',
    Theme: 'Tema',
    Type: 'Tipo',
    User: 'Usuário',
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
