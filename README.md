# GitHub Private Repo Access

[Loon](https://nsloon.app/) 插件，用于为 GitHub 私有仓库的 Raw 文件请求自动添加 Token 认证。

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

## 配置

在插件设置中填写以下参数：

| 参数 | 说明 |
|------|------|
| `github_token` | GitHub Personal Access Token（需 `repo` 权限） |

## Token 获取

1. 访问 https://github.com/settings/tokens
2. 点击 **Generate new token (classic)**
3. 勾选 `repo` 权限范围
4. 生成并复制 Token 填入插件设置

## 工作原理

插件通过 Loon 的 `http-request` 脚本捕获对 `raw.githubusercontent.com` 的请求，在执行 `github_auth.js` 时将 GitHub Token 注入请求头，从而实现对私有仓库 Raw 内容的访问。

## 文件

- `github-private.plugin` — Loon 插件配置文件
- `github_auth.js` — 认证逻辑脚本

## 作者

[@Dawn1095](https://github.com/dawn1095)
