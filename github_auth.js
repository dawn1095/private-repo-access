const PERSIST_KEY = "github_token";
const PLACEHOLDER_TOKEN = "ghp_你的Token";

function normalizeToken(value) {
  if (typeof value !== "string") {
    return "";
  }

  const trimmedValue = value.trim();
  if (!trimmedValue || trimmedValue === PLACEHOLDER_TOKEN) {
    return "";
  }

  return trimmedValue;
}

function parseArgument(argument) {
  if (!argument) {
    return {};
  }

  if (typeof argument === "object") {
    return argument;
  }

  if (typeof argument !== "string") {
    return {};
  }

  return argument
    .split("&")
    .map((item) => item.trim())
    .filter(Boolean)
    .reduce((result, item) => {
      const [rawKey, ...rawValueParts] = item.split("=");
      const key = rawKey ? rawKey.trim() : "";
      if (!key) {
        return result;
      }

      result[key] = decodeURIComponent(rawValueParts.join("=").trim());
      return result;
    }, {});
}

function resolveToken(argument, persistentStore) {
  const parsedArgument = parseArgument(argument);
  const argumentToken = normalizeToken(
    parsedArgument.github_token || parsedArgument.githubToken || parsedArgument.token,
  );
  const storedToken = normalizeToken(persistentStore.read(PERSIST_KEY));

  return {
    token: argumentToken || storedToken,
    shouldPersist: Boolean(argumentToken && argumentToken !== storedToken),
  };
}

function handleGithubAuth(env) {
  const persistentStore = env.persistentStore || {
    read() {
      return null;
    },
    write() {
      return false;
    },
  };
  const notification = env.notification || {
    post() {},
  };
  const request = env.request || {};
  const { token, shouldPersist } = resolveToken(env.argument, persistentStore);

  if (!token) {
    notification.post(
      "GitHub Private Repo",
      "⚠️ 请先填写 Token",
      "插件设置页 -> github_token",
    );
    return {};
  }

  if (shouldPersist) {
    persistentStore.write(token, PERSIST_KEY);
  }

  return {
    headers: {
      ...(request.headers || {}),
      Authorization: `token ${token}`,
    },
  };
}

function createLoonEnv() {
  return {
    argument: typeof $argument === "undefined" ? undefined : $argument,
    request: typeof $request === "undefined" ? undefined : $request,
    persistentStore: typeof $persistentStore === "undefined" ? undefined : $persistentStore,
    notification: typeof $notification === "undefined" ? undefined : $notification,
  };
}

if (typeof module !== "undefined") {
  module.exports = {
    handleGithubAuth,
    parseArgument,
    resolveToken,
  };
}

if (typeof $done === "function") {
  $done(handleGithubAuth(createLoonEnv()));
}
