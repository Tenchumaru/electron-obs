interface Main {
  startStreaming: (streamKey: string) => Promise<boolean>;
  stopStreaming: () => void;
}

interface Window {
  main: Main;
}
