const TOKEN = $persistentStore.read("github_token");

if (!TOKEN) {
    const notification = "⚠️ GitHub Token 未设置，请先运行 Set Token 脚本";
    $notification.post("GitHub Private Repo", "", notification);
    $done({});
} else {
    let headers = $request.headers;
    headers["Authorization"] = `token ${TOKEN}`;
    $done({ headers });
}
