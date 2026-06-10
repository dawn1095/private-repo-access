// 优先读取插件配置参数，其次读取持久化存储
const TOKEN = $loon.github_token || $persistentStore.read("github_token");

if (!TOKEN || TOKEN === "ghp_你的Token") {
  $notification.post("GitHub Private Repo", "⚠️ 请先填写 Token", "插件页面 → 配置 → github_token");
  $done({});
} else {
  // 同步保存到持久化存储
  $persistentStore.write(TOKEN, "github_token");
  
  let headers = $request.headers;
  headers["Authorization"] = `token ${TOKEN}`;
  $done({ headers });
}
