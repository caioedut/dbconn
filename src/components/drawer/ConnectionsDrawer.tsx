import { useRef, useState } from 'react';
import {
  Panel as ResizablePanel,
  PanelGroup as ResizablePanelGroup,
  PanelResizeHandle as ResizablePanelHandle,
} from 'react-resizable-panels';
import { useObjectState } from 'react-state-hooks';

import { AnyObject, FormRef, RbkFormEvent, useToaster } from '@react-bulk/core';
import {
  Animation,
  Box,
  Button,
  Drawer,
  Dropdown,
  Form,
  Grid,
  Input,
  Scrollable,
  Select,
  Tabs,
  Text,
} from '@react-bulk/web';
import * as yup from 'yup';

import Icon from '@/components/Icon';
import List from '@/components/List';
import Panel from '@/components/Panel';
import State from '@/components/State';
import { getError } from '@/helpers/api.helper';
import { validate } from '@/helpers/form.helper';
import { t } from '@/helpers/translate.helper';
import useApiOnce from '@/hooks/useApiOnce';
import useConnection from '@/hooks/useConnection';
import useHotkey from '@/hooks/useHotkey';
import useTabs from '@/hooks/useTabs';
import api from '@/services/api';

import { Connection, Database } from '../../../types/database.type';

export default function ConnectionsDrawer() {
  const toaster = useToaster();
  const { add } = useTabs();

  const formConnectionRef = useRef<FormRef>();

  const { connection, database, setConnection, setDatabase } = useConnection();

  const [isConnecting, updateIsConnecting] = useObjectState<{ [key: string]: boolean }>({});

  const [tablesTab, setTablesTab] = useState<'table' | 'view'>('table');

  const [tableMenu, setTableMenu] = useState<string>();

  const [editModel, setEditModel] = useState<Partial<Connection>>();

  const [editType, setEditType] = useState<string>();

  const [editRequired, updateEditRequired] = useObjectState({
    database: true,
    host: true,
    password: true,
    port: true,
    username: true,
  });

  const {
    data: connections,
    error: errorConnections,
    isValidating: isValidatingConnections,
    mutate: mutateConnections,
  } = useApiOnce<any[]>('/connections');

  const {
    data: databases,
    error: errorDatabases,
    isValidating: isValidatingDatabases,
    mutate: mutateDatabases,
  } = useApiOnce<any[]>(connection && '/connections/databases', connection?.id);

  const {
    data: tables,
    error: errorTables,
    isValidating: isValidatingTables,
    mutate: mutateTables,
  } = useApiOnce<any[]>(connection && database && '/tables', connection?.id, database?.name);

  const displayTablesHk = useHotkey({
    callback: () => setTablesTab('table'),
    ctrl: true,
    key: 'F1',
  });

  const displayViewsHk = useHotkey({
    callback: () => setTablesTab('view'),
    ctrl: true,
    key: 'F2',
  });

  const handleChangeType = (type: string) => {
    setEditType(type);

    updateEditRequired({
      database: type === 'pg',
      password: type !== 'mysql',
    });
  };

  const handleEditConnection = (e: Event, conn: Connection) => {
    e.stopPropagation();
    setEditModel(conn);
    handleChangeType(conn.type);
  };

  const handleCancelEditConnection = () => {
    setEditModel(undefined);
    formConnectionRef.current?.clear();
    formConnectionRef.current?.setErrors(null);
  };

  const handleDeleteConnection = async (e: Event, conn: Connection) => {
    e.stopPropagation();

    if (!window.confirm(t('Delete connection?'))) {
      return;
    }

    try {
      await api.delete('/connections', conn.id);
      await mutateConnections();
    } catch (err) {
      toaster.error(getError(err));
    }
  };

  const handleSaveConnection = async (e: RbkFormEvent, data: AnyObject) => {
    const errors = await validate(data, {
      database: editRequired.database ? yup.string().required() : yup.string().nullable(),
      host: editRequired.host ? yup.string().required() : yup.string().nullable(),
      password: editRequired.password ? yup.string().required() : yup.string().nullable(),
      port: editRequired.port ? yup.string().required() : yup.string().nullable(),
      type: yup.string().required(),
      username: editRequired.username ? yup.string().required() : yup.string().nullable(),
    });

    e.form.setErrors(errors);
    if (errors) return;

    try {
      await api.post('/connections', data);
      await mutateConnections();
    } catch (err) {
      toaster.error(getError(err));
    }

    handleCancelEditConnection();
  };

  const handleConnect = async (e: Event, conn: Connection) => {
    e.stopPropagation();

    if (!conn.connected) {
      updateIsConnecting({ [conn.id]: true });

      try {
        await api.post('/connections/connect', conn.id);
        await mutateConnections();
      } catch (err) {
        toaster.error(getError(err));
      }

      updateIsConnecting({ [conn.id]: false });
    }

    setConnection(conn);
    setDatabase(conn.database ? { name: conn.database } : undefined);
  };

  const handleDisconnect = async (e: Event, conn: Connection) => {
    e.stopPropagation();

    if (conn.connected) {
      try {
        await api.post('/connections/disconnect', conn.id);
        await mutateConnections();
      } catch (err) {
        toaster.error(getError(err));
      }
    }

    setConnection(undefined);
    setDatabase(undefined);
  };

  const handleSelectDatabase = async (e: Event, db: Database) => {
    e.stopPropagation();

    if (db.name !== database?.name) {
      try {
        await api.post('/connections/databases', connection?.id, db.name);
        setDatabase(db);
      } catch (err) {
        toaster.error(getError(err));
      }
    }
  };

  const handleSelectTop = async (e: Event, tableName: string, limit: number) => {
    e.stopPropagation();

    setTableMenu(undefined);

    try {
      const response = await api.get('/query/topQuery', connection?.id, tableName, limit);

      add({
        props: {
          autoRun: true,
          sql: response.data,
        },
      });
    } catch (err) {
      toaster.error(getError(err));
    }
  };

  const newConnHk = useHotkey({
    callback: () => setEditModel({}),
    ctrl: true,
    key: 'n',
  });

  useHotkey({
    callback: () => editModel && handleCancelEditConnection(),
    key: 'Escape',
  });

  return (
    <>
      <ResizablePanelGroup autoSaveId="example" direction="vertical">
        <ResizablePanel collapsible>
          <Panel
            h="100%"
            loading={isValidatingConnections || isValidatingDatabases}
            right={
              <Button
                circular
                size="xsmall"
                title={`${t('Add')} ${newConnHk.title}`}
                variant="text"
                onPress={() => setEditModel({})}
              >
                <Icon color="contrast" name="PlusCircle" />
              </Button>
            }
            title={t('Connections')}
          >
            <State error={errorConnections}>
              <Scrollable>
                {connections?.map((conn, index) => {
                  const isConnSelected = conn.id === connection?.id;

                  return (
                    <Box key={index}>
                      <Box
                        style={{ '&:hover': { bg: 'primary.main.25' } }}
                        onPress={(e: Event) => handleConnect(e, conn)}
                      >
                        <Box center noWrap row p={1} style={{ gap: 4 }}>
                          <Box
                            center
                            bg={isConnecting[conn.id] ? 'warning' : conn.connected ? 'success' : 'error'}
                            corners={3}
                            h={12}
                            ml={1}
                            w={12}
                          >
                            {isConnecting[conn.id] && (
                              <Animation in loop zoom direction="alternate" duration={500} timing="linear">
                                <Box bg="warning.light" corners={3} h={12} w={12} />
                              </Animation>
                            )}
                          </Box>

                          <Text flex ml={1} numberOfLines={1}>
                            {conn.name || conn.host}
                          </Text>

                          {!conn.connected ? (
                            <Button
                              circular
                              color="yellow"
                              size="xsmall"
                              title={t('Connect')}
                              variant="text"
                              onPress={(e: Event) => handleConnect(e, conn)}
                            >
                              <Icon color="yellow" name="Zap" />
                            </Button>
                          ) : (
                            <Button
                              circular
                              color="error"
                              size="xsmall"
                              title={t('Disconnect')}
                              variant="text"
                              onPress={(e: Event) => handleDisconnect(e, conn)}
                            >
                              <Icon color="error" name="ZapOff" />
                            </Button>
                          )}
                          <Button
                            circular
                            size="xsmall"
                            title={t('Edit')}
                            variant="text"
                            onPress={(e: Event) => handleEditConnection(e, conn)}
                          >
                            <Icon name="Edit2" />
                          </Button>
                          <Button
                            circular
                            size="xsmall"
                            title={t('Remove')}
                            variant="text"
                            onPress={(e: Event) => handleDeleteConnection(e, conn)}
                          >
                            <Icon name="Trash" />
                          </Button>
                        </Box>
                      </Box>

                      {isConnSelected &&
                        databases?.map((db, index) => {
                          const isSelected = db.name === database?.name;

                          return (
                            <Box
                              key={index}
                              style={{ '&:hover': { bg: 'primary.main.25' } }}
                              onPress={(e: Event) => handleSelectDatabase(e, db)}
                            >
                              <Box center noWrap row ml={4} p={1}>
                                <Box h={12} ml={1} w={12}>
                                  {isSelected && <Icon name="ChevronsRight" size={12} />}
                                </Box>
                                <Text flex bold={isSelected} ml={2} numberOfLines={1} variant="secondary">
                                  {db.name}
                                </Text>
                              </Box>
                            </Box>
                          );
                        })}
                    </Box>
                  );
                })}
              </Scrollable>
            </State>
          </Panel>
        </ResizablePanel>

        <ResizablePanelHandle style={{ height: 4 }} />

        <ResizablePanel collapsible>
          <Panel
            h="100%"
            loading={isValidatingTables}
            right={
              <Button circular size="xsmall" title={t('Refresh')} variant="text" onPress={() => mutateTables()}>
                <Icon color="contrast" name="RefreshCw" />
              </Button>
            }
            title={t('Structs')}
          >
            <State error={errorTables}>
              <Box center p={2}>
                <Tabs
                  size="small"
                  tabs={[
                    { title: displayTablesHk.title, label: t('Tables'), value: 'table' },
                    { title: displayViewsHk.title, label: t('Views'), value: 'view' },
                  ]}
                  value={tablesTab}
                  variant="nav"
                  onChange={(_, value: any) => setTablesTab(value)}
                />
              </Box>

              <Scrollable>
                {tables
                  ?.filter((table) => table.type === tablesTab)
                  ?.map((table) => (
                    <Box key={table.name} style={{ '&:hover': { bg: 'primary.main.25' } }}>
                      <Box center noWrap row p={1}>
                        <Box h={12} ml={1} w={12}>
                          <Icon name="Table" size={12} />
                        </Box>
                        <Text flex ml={2} numberOfLines={1}>
                          {table.name}
                        </Text>
                        <Button
                          circular
                          size="xsmall"
                          title="SELECT TOP 10"
                          variant="text"
                          onPress={(e: Event) => handleSelectTop(e, table.name, 10)}
                        >
                          10
                        </Button>
                        <Button
                          circular
                          size="xsmall"
                          title={`${t('More')}...`}
                          variant="text"
                          onPress={() => setTableMenu(table.name)}
                        >
                          <Icon name="Menu" />
                        </Button>
                        <Dropdown visible={table.name === tableMenu} onClose={() => setTableMenu(undefined)}>
                          <List
                            corners={1}
                            items={[
                              {
                                label: 'SELECT TOP 100',
                                icon: 'Code',
                                onPress: (e: Event) => handleSelectTop(e, table.name, 100),
                              },
                              {
                                label: 'SELECT TOP 1000',
                                icon: 'Code',
                                onPress: (e: Event) => handleSelectTop(e, table.name, 1000),
                              },
                              { divider: true },
                            ]}
                            overflow="hidden"
                            w={200}
                          />
                        </Dropdown>
                      </Box>
                    </Box>
                  ))}
              </Scrollable>
            </State>
          </Panel>
        </ResizablePanel>
      </ResizablePanelGroup>

      <Drawer visible={Boolean(editModel)}>
        <Form ref={formConnectionRef} flex onCancel={handleCancelEditConnection} onSubmit={handleSaveConnection}>
          <Input name="id" type="hidden" value={editModel?.id} />

          <Scrollable contentInset={4} maxw="100%" w={400}>
            <Grid gap>
              <Box xs={12}>
                <Select
                  label={t('Type *')}
                  name="type"
                  options={[
                    { label: 'MySQL', value: 'mysql' },
                    { label: 'PostgreSQL', value: 'pg' },
                    { label: 'Microsoft SQL Server', value: 'mssql' },
                    { label: 'Oracle', value: 'oracledb' },
                  ]}
                  value={editModel?.type}
                  onChange={(_, value) => handleChangeType(value)}
                />
              </Box>
              {Boolean(editType) && (
                <>
                  <Box xs={8}>
                    <Input label={t('Server') + (editRequired.host ? ' *' : '')} name="host" value={editModel?.host} />
                  </Box>
                  <Box xs={4}>
                    <Input label={t('Port') + (editRequired.port ? ' *' : '')} name="port" value={editModel?.port} />
                  </Box>
                  <Box xs={12}>
                    <Input
                      label={t('Username') + (editRequired.username ? ' *' : '')}
                      name="username"
                      value={editModel?.username}
                    />
                  </Box>
                  <Box xs={12}>
                    <Input
                      notNull
                      label={t('Password') + (editRequired.password ? ' *' : '')}
                      name="password"
                      type="password"
                      value={editModel?.password}
                    />
                  </Box>
                  <Box xs={12}>
                    <Input
                      label={t('Database') + (editRequired.database ? ' *' : '')}
                      name="database"
                      value={editModel?.database}
                    />
                  </Box>
                  <Box xs={12}>
                    <Input label={`${t('Name')}/${t('Alias')}`} name="name" value={editModel?.name} />
                  </Box>
                </>
              )}
            </Grid>
          </Scrollable>
          <Box bg="background.secondary" p={4}>
            <Grid gap>
              <Box xs>
                <Button type="cancel" variant="outline">
                  {t('Cancel')}
                </Button>
              </Box>
              <Box xs>
                <Button variant="outline">{t('Test')}</Button>
              </Box>
              <Box xs>
                <Button type="submit">{t('Save')}</Button>
              </Box>
            </Grid>
          </Box>
        </Form>
      </Drawer>
    </>
  );
}