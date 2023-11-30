import { memo, useRef, useState } from 'react';
import {
  Panel as ResizablePanel,
  PanelGroup as ResizablePanelGroup,
  PanelResizeHandle as ResizablePanelHandle,
} from 'react-resizable-panels';
import { useObjectState } from 'react-state-hooks';

import { AnyObject, FormRef, RbkFormEvent, useToaster } from '@react-bulk/core';
import { Animation, Box, Button, Drawer, Form, Grid, Input, Modal, Scrollable, Select, Text } from '@react-bulk/web';
import * as yup from 'yup';

import DatabaseList from '@/components/DatabaseList';
import Icon from '@/components/Icon';
import Panel from '@/components/Panel';
import State from '@/components/State';
import TableList from '@/components/TableList';
import { getError } from '@/helpers/api.helper';
import { validate } from '@/helpers/form.helper';
import { t } from '@/helpers/translate.helper';
import useApiOnce from '@/hooks/useApiOnce';
import useConnection from '@/hooks/useConnection';
import useHotkey from '@/hooks/useHotkey';
import api from '@/services/api';
import { Connection } from '@/types/database.type';

function ConnectionsDrawer() {
  const toaster = useToaster();

  const { setConnection, setDatabase } = useConnection();

  const formConnectionRef = useRef<FormRef>();

  const [isConnecting, updateIsConnecting] = useObjectState<{ [key: string]: boolean }>({});

  const [changePasswordConn, setChangePasswordConn] = useState<Connection>();

  const [editModel, setEditModel] = useState<Partial<Connection>>();

  const [editType, setEditType] = useState<string>();

  const [editRequired, updateEditRequired] = useObjectState({
    database: true,
    host: true,
    password: true,
    port: true,
    user: true,
  });

  const {
    data: connections,
    error: errorConnections,
    isValidating: isValidatingConnections,
    mutate: mutateConnections,
  } = useApiOnce<Connection[]>('/connections');

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
      user: editRequired.user ? yup.string().required() : yup.string().nullable(),
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
        const isPasswordExpired =
          (err as Error)?.message?.includes('password') && (err as Error)?.message?.includes('expired');

        if (!isPasswordExpired) {
          toaster.error(getError(err));
        } else {
          setChangePasswordConn(conn);
        }
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

  const handleSubmitPassword = async (e: RbkFormEvent, data: AnyObject) => {
    const errors = await validate(data, {
      confirmPassword: yup
        .string()
        .required()
        .oneOf([yup.ref('password')]),
      password: yup.string().required(),
    });

    e.form.setErrors(errors);
    if (errors) return;

    try {
      await api.post('/users/password', changePasswordConn?.id, data.password);
      await mutateConnections();
    } catch (err) {
      toaster.error(getError(err));
    }

    setChangePasswordConn(undefined);
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
        <ResizablePanel minSizePixels={32} order={1}>
          <Panel
            h="100%"
            loading={isValidatingConnections}
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
                {connections?.map((conn, index) => (
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
                          title={t(
                            isConnecting[conn.id] ? 'Connecting' : conn.connected ? 'Connected' : 'Disconnected',
                          )}
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

                    <DatabaseList key={index} connection={conn} />
                  </Box>
                ))}
              </Scrollable>
            </State>
          </Panel>
        </ResizablePanel>

        <ResizablePanelHandle style={{ height: 4 }} />

        <ResizablePanel minSizePixels={32} order={2}>
          <TableList />
        </ResizablePanel>
      </ResizablePanelGroup>

      <Drawer visible={Boolean(editModel)} onBackdropPress={() => setEditModel(undefined)}>
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
                    // { label: 'Oracle', value: 'oracledb' },
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
                    <Input
                      label={t('Port') + (editRequired.port ? ' *' : '')}
                      name="port"
                      unmask={(value) => (value ? Number(value) : null)}
                      value={editModel?.port}
                    />
                  </Box>
                  <Box xs={12}>
                    <Input label={t('User') + (editRequired.user ? ' *' : '')} name="user" value={editModel?.user} />
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

      <Modal visible={Boolean(changePasswordConn)}>
        <Form onCancel={() => setChangePasswordConn(undefined)} onSubmit={handleSubmitPassword}>
          <Scrollable contentInset={4} maxw="100%" w={400}>
            <Grid gap>
              <Box xs={12}>
                <Text variant="title">{t('Password expired, set a new one')}.</Text>
              </Box>
              <Box xs={12}>
                <Input label={t('Password *')} name="password" value={changePasswordConn?.password} />
              </Box>
              <Box xs={12}>
                <Input label={t('Confirm Password *')} name="confirmPassword" value={changePasswordConn?.password} />
              </Box>
            </Grid>
          </Scrollable>
          <Box bg="background.secondary" m={-4} mt={4} p={4}>
            <Grid gap>
              <Box xs>
                <Button type="cancel" variant="outline">
                  {t('Cancel')}
                </Button>
              </Box>
              <Box xs>
                <Button type="submit">{t('Save Password')}</Button>
              </Box>
            </Grid>
          </Box>
        </Form>
      </Modal>
    </>
  );
}

export default memo(ConnectionsDrawer);
