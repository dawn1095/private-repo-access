# GitHub Private Repo Access

[Loon](https://nsloon.app/) / [Surge](https://surge.network/) / [Egern](https://egernapp.com/) 模块，用于为 GitHub 私有仓库的 Raw 文件请求自动添加 Token 认证。

## 功能

- 拦截 `raw.githubusercontent.com` 的请求
- 自动注入 `Authorization: token <your_token>` 请求头
- Token 支持持久化存储，避免重复填写
- 未配置 Token 时弹出提示

## 安装

1. 在 Loon 中前往 **配置 → 插件**，点击右上角 **+**
2. 输入插件 URL：

```
https://raw.githubusercontent.com/dawn1095/private-repo-access/refs/heads/main/github-private.plugin
```

3. 在 **插件设置页** 填写 `github_token`

### Surge

1. 在 Surge 中前往 **模块**，点击右上角 **+**
2. 输入模块 URL：

```
https://raw.githubusercontent.com/dawn1095/private-repo-access/refs/heads/main/github-private.sgmodule
```

3. 在模块设置中填写 `github_token`

### Egern

1. 开启 Egern 的 MitM，安装并**完全信任** CA 证书（**设置 > 通用 > 关于本机 > 证书信任设置**）
2. 在 **配置文件** 的 `modules` 中引用本模块（或在模块管理页添加远程链接）：

```yaml
modules:
  - name: "GitHub Private Repo Access"
    url: "https://raw.githubusercontent.com/dawn1095/private-repo-access/refs/heads/main/github-private.yaml"
    enabled: true
```

3. 在模块设置页填写 **GitHub Token**（由 `env_schema` 自动生成输入框，脚本通过 `ctx.env.GITHUB_TOKEN` 读取）
### Stash

1. 开启 Stash 的 MitM，安装并**完全信任** CA 证书
2. 在 **配置 → 覆写（Override）** 中点击 **+** 添加远程覆写链接：

```
https://raw.githubusercontent.com/dawn1095/private-repo-access/refs/heads/main/github-private.stoverride
```

3. 在覆写中启用后，编辑覆写文件里 `http.script.argument` 的 `github_token`，填入你的 GitHub Personal Access Token（保持 `ghp_你的Token` 占位符时脚本会弹窗提示未配置）

## 配置

| 平台 | 参数 | 说明 |
|------|------|------|
| Loon | `github_token` | GitHub Personal Access Token（需 `repo` 权限） |
| Surge | `github_token` | 同上 |
| Egern | `GitHub Token` | 同上，脚本内对应 `ctx.env.GITHUB_TOKEN` |
| Stash | `github_token`（覆写内 `argument`） | 同上 |

## Token 获取

1. 访问 https://github.com/settings/tokens
2. 点击 **Generate new token (classic)**
3. 勾选 `repo` 权限范围
4. 生成并复制 Token 填入插件设置

## 工作原理

- **Loon**：插件通过 `http-request` 脚本捕获对 `raw.githubusercontent.com` 的请求，执行 `github_auth.js` 时将 GitHub Token 注入请求头。
- **Surge**：模块以 `http-request` 规则命中后执行同一份 `github_auth.js`，行为一致。
- **Stash**：覆写文件（`github-private.stoverride`）声明 `http.mitm` 与 `http.script`（`type: request`），命中后由 `script-providers` 拉取同一份 `github_auth.js` 执行，脚本 API 与 Loon/Surge 兼容（`$argument` / `$request` / `$persistentStore` / `$done`）。
- **Egern**：模块（`github-private.yaml`）声明 MitM 域名与 `http_request` 脚本，命中后执行 `github_auth_egern.js`，通过 `ctx.env.GITHUB_TOKEN` 取 Token、`ctx.storage` 持久化，并回传改写后的 `headers`。Egern 运行时为 `export default async (ctx)`，与 Loon/Surge 的 `$done` 脚本 API 不通用，故两份脚本并存。

## 文件

- `github-private.plugin` — Loon 插件配置
- `github-private.sgmodule` — Surge 模块配置
- `github-private.yaml` — Egern 模块配置
- `github_auth.js` — Loon / Surge / Stash 认证逻辑脚本
- `github-private.stoverride` — Stash 覆写文件
- `github_auth_egern.js` — Egern 认证逻辑脚本

## 作者

[@Dawn1095](https://github.com/dawn1095)
