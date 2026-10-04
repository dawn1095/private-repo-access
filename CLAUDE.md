# 插件/模块格式说明
.plugin：适用于iOS应用Loon

.sgmodule：适用于iOS应用Surge

.yaml：适用于iOS应用Egern

.stoverride：适用于iOS应用Stash

Stash 约束：覆写无参数设置面板且数组只能前插，Token 不得写入可订阅的公开文件；
本仓库 Stash 支持为双文件：公开的 github-private.stoverride（仅 mitm + script-providers）
与设备本地的 github-private.token.stoverride（仅 http.script + argument，见 .example 模板，
真实文件由 .gitignore 排除）。

特别注意：不要用错了文件格式。