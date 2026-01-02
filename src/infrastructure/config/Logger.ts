type LogLevel = "debug" | "info" | "warn" | "error";

const normalizeMeta = (meta?: unknown) => {
  if (meta instanceof Error) {
    return {
      name: meta.name,
      message: meta.message,
      stack: meta.stack,
      ...("cause" in meta ? { cause: (meta as any).cause } : {}),
    };
  }
  return meta;
};

const log = (level: LogLevel, message: string, meta?: unknown): void => {
  const payload = {
    level,
    message,
    meta: normalizeMeta(meta),
    timestamp: new Date().toISOString(),
  };

  if (level === "error") console.error(JSON.stringify(payload));
  else if (level === "warn") console.warn(JSON.stringify(payload));
  else console.log(JSON.stringify(payload));
};

export default class Logger {
  static debug(msg: string, meta?: unknown) {
    log("debug", msg, meta);
  }
  static info(msg: string, meta?: unknown) {
    log("info", msg, meta);
  }
  static warn(msg: string, meta?: unknown) {
    log("warn", msg, meta);
  }
  static error(msg: string, meta?: unknown) {
    log("error", msg, meta);
  }
  static time(label: string) {
    console.time(label);
  }
  static timeEnd(label: string) {
    console.timeEnd(label);
  }
}
