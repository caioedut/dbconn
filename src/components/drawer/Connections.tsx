import { useState } from 'react';
import {
  Panel as ResizablePanel,
  PanelGroup as ResizablePanelGroup,
  PanelResizeHandle as ResizablePanelHandle,
} from 'react-resizable-panels';
import { useObjectState } from 'react-state-hooks';

import { AnyObject, FormRef, RbkFormEvent, useToaster } from '@react-bulk/core';
import { Animation, Box, Button, Collapse, Drawer, Form, Grid, Input, Scrollable, Select, Text } from '@react-bulk/web';
import * as yup from 'yup';

import Icon from '@/components/Icon';
import Panel from '@/components/Panel';
import State from '@/components/State';
import { getError } from '@/helpers/api.helper';
import { groupBy } from '@/helpers/array.helper';
import { validate } from '@/helpers/form.helper';
import { t } from '@/helpers/translate.helper';
import useApiOnce from '@/hooks/useApiOnce';
import useConnection from '@/hooks/useConnection';
import api from '@/services/api';

import { Connection, Database, Table } from '../../../types/database.type';

export default function DrawerConnections() {
  const toaster = useToaster();

  const { connection, database, setConnection, setDatabase } = useConnection();

  const [editModel, setEditModel] = useState<Partial<Connection>>();

  const [isConnecting, updateIsConnecting] = useObjectState<{ [key: string]: boolean }>({});

  const [showTableGroup, updateShowTableGroup] = useObjectState<{ [key: string]: boolean }>({ table: true });

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

  const handleCancelConnection = (form: FormRef) => {
    setEditModel(undefined);
    form.setErrors(null);
  };

  const handleEditConnection = (e: Event, conn: Connection) => {
    e.stopPropagation();
    setEditModel(conn);
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
      host: yup.string().required(),
      // password: yup.string().required(),
      port: yup.string().required(),
      type: yup.string().required(),
      username: yup.string().required(),
    });

    e.form.setErrors(errors);
    if (errors) return;

    try {
      await api.post('/connections', data);
      await mutateConnections();
    } catch (err) {
      toaster.error(getError(err));
    }

    setEditModel(undefined);
    e.form.clear();
  };

  const handleConnect = async (e: Event, conn: Connection) => {
    e.stopPropagation();

    if (!conn.connected) {
      updateIsConnecting({ [conn.id]: true });

      try {
        const res = await api.post('/connections/connect', conn.id);
        console.log(res);
        await mutateConnections();
      } catch (err) {}

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
      } catch (err) {}
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

  return (
    <>
      <ResizablePanelGroup autoSaveId="example" direction="vertical">
        <ResizablePanel collapsible>
          <Panel
            h="100%"
            loading={isValidatingConnections}
            right={
              <Button circular size="xsmall" title={t('Add')} variant="text" onPress={() => setEditModel({})}>
                <Icon name="PlusCircle" />
              </Button>
            }
            title={t('Connections')}
          >
            <State error={errorConnections}>
              <Box mx={-2}>
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
              </Box>
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
                <Icon name="RefreshCw" />
              </Button>
            }
            title={`${t('Tables')} / ${t('Views')} / ${t('Procedures')} / ${t('Functions')}`}
          >
            <State error={errorTables}>
              <Box mx={-2}>
                {groupBy<Table>(tables || [], 'type')?.map((group) => {
                  const isGroupExpanded = showTableGroup[group.key];

                  return (
                    <Box key={group.key}>
                      <Box
                        noWrap
                        row
                        alignItems="center"
                        p={2}
                        onPress={() => updateShowTableGroup({ [group.key]: !isGroupExpanded })}
                      >
                        <Text bold transform="capitalize">
                          {t(`${group.title}s`)}
                        </Text>
                        <Button
                          circular
                          ml={1}
                          size="xsmall"
                          title={t(isGroupExpanded ? 'Hide' : 'Show')}
                          variant="text"
                        >
                          <Icon name={isGroupExpanded ? 'ChevronUp' : 'ChevronDown'} size={12} />
                        </Button>
                      </Box>

                      <Collapse visible={isGroupExpanded}>
                        {group.data.map((table) => (
                          <Box key={table.name} style={{ '&:hover': { bg: 'primary.main.25' } }}>
                            <Box center noWrap row p={1}>
                              <Box h={12} ml={1} w={12}>
                                <Icon name=" Table" size={12} />
                              </Box>
                              <Text flex ml={2} numberOfLines={1}>
                                {table.name}
                              </Text>
                              <Button circular size="xsmall" title="SELECT TOP 10" variant="text">
                                10
                              </Button>
                              <Button circular size="xsmall" title={`${t('More')}...`} variant="text">
                                <Icon name="Menu" />
                              </Button>
                            </Box>
                          </Box>
                        ))}
                      </Collapse>
                    </Box>
                  );
                })}
              </Box>
            </State>
          </Panel>
        </ResizablePanel>
      </ResizablePanelGroup>

      <Drawer visible={Boolean(editModel)}>
        <Form flex onCancel={handleCancelConnection} onSubmit={handleSaveConnection}>
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
                />
              </Box>
              <Box xs={8}>
                <Input label={t('Server *')} name="host" value={editModel?.host} />
              </Box>
              <Box xs={4}>
                <Input label={t('Port *')} name="port" value={editModel?.port} />
              </Box>
              <Box xs={12}>
                <Input label={t('Username *')} name="username" value={editModel?.username} />
              </Box>
              <Box xs={12}>
                <Input notNull label={t('Password *')} name="password" type="password" value={editModel?.password} />
              </Box>
              <Box xs={12}>
                <Input label={t('Name')} name="name" value={editModel?.name} />
              </Box>
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
