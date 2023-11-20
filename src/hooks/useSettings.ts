import { useStoreState } from 'react-state-hooks';

export default function useSettings() {
  const [section, setSection] = useStoreState('settings.section', 'appearance');

  return { section, setSection };
}
