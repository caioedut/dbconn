import { useEffect, useState } from 'react';

import { Box, Button, Card, Grid, Text, Tooltip, useTheme } from '@react-bulk/web';

import useApiOnce from '@/hooks/useApiOnce';

export default function CheckUpdate() {
  const theme = useTheme();
  const { gap } = theme.shape;

  const [latest, setLatest] = useState<any>();
  const [visible, setVisible] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const { data: appInfo } = useApiOnce<any>('/app');
  const appVersion = appInfo?.version;
  const currentVersion = appVersion?.replace(/^\D/g, '');
  const latestVersion = latest?.name?.replace(/^\D/g, '');
  const downloadURL = latest?.assets?.[0]?.browser_download_url;
  const hasUpdate = Boolean(currentVersion && latestVersion && downloadURL) && currentVersion !== latestVersion;

  useEffect(() => {
    fetch('https://api.github.com/repos/caioedut/dbconn/releases/latest')
      .then((res) => res.json())
      .then((res) => setLatest(res))
      .catch(() => setLatest(null))
      .finally(() => setVisible(true));
  }, []);

  if (!visible || !hasUpdate) {
    return null;
  }

  return (
    <Card b={gap} border="1px solid white" corners={8} p={gap / 2} position="fixed" r={gap}>
      {downloading ? (
        <Tooltip title="Downloading new version">
          <Button circular loading color="yellow" />
        </Tooltip>
      ) : (
        <Grid gap noWrap alignItems="center" justifyContent="end">
          <Box>
            <Text bold color="yellow" ml={gap / 2}>
              New version available!
            </Text>
          </Box>
          <Box>
            <Button circular color="white" px={gap / 2} variant="text" onPress={() => setVisible(false)}>
              Skip
            </Button>
          </Box>
          <Box>
            <Button circular color="yellow" href={downloadURL} px={gap} onPress={() => setDownloading(true)}>
              Update Now!
            </Button>
          </Box>
        </Grid>
      )}
    </Card>
  );
}
