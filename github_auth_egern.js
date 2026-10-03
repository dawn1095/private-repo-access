// Egern 运行时脚本：为 raw.githubusercontent.com 请求注入 GitHub Token
// 依赖模块 github-private.yaml 通过 env 传入 GITHUB_TOKEN，并使用 ctx.storage 持久化

const STORAGE_KEY = "github_token"; // ctx.storage 中保存 Token 的键
const PLACEHOLDER_TOKEN = "ghp_你的Token"; // 模块默认值占位符，视为「未配置」

/**
 * 归一化 Token：去空白，非字符串 / 空值 / 占位符一律视为未配置。
 */
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

export default async function (ctx) {
  const envToken = normalizeToken(ctx.env.GITHUB_TOKEN);
  const storedToken = normalizeToken(ctx.storage.get(STORAGE_KEY));

  // 优先使用模块参数，未填写时回退到上次持久化的 Token
  const token = envToken || storedToken;

  if (!token) {
    ctx.notify({
      title: "GitHub Private Repo",
      subtitle: "⚠️ 请先填写 Token",
      body: "模块设置页 -> GitHub Token",
    });
    return {};
  }

  // Token 变化时持久化，避免重复填写
  if (envToken && envToken !== storedToken) {
    ctx.storage.set(STORAGE_KEY, envToken);
  }

  // 在原请求头对象上 set 后回传（Headers 为大小写无关对象，支持直接返回）
  // 未返回 URL / method / body，Egern 保持原值不变
  const headers = ctx.request.headers;
  headers.set("Authorization", `token ${token}`);
  return { headers };
}