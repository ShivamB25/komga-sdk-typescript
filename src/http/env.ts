type ProcessEnvRef = {
  NODE_ENV?: string;
};

type ProcessRef = {
  env?: ProcessEnvRef;
};

function getGlobalProcess(): ProcessRef | undefined {
  return (globalThis as { process?: ProcessRef }).process;
}

export function getNodeEnv(): string | undefined {
  return getGlobalProcess()?.env?.NODE_ENV;
}

export function getProcessRef(): ProcessRef | undefined {
  return getGlobalProcess();
}
