// Basic認証を実装するミドルウェア関数
export async function onRequest({ request, env, next }) {
	// 認証のヘッダーを取得
	const authorization = request.headers.get("Authorization");

	// 認証情報が提供されていない場合
	if (!authorization) {
		return new Response("認証が必要です", {
			status: 401,
			headers: {
				"WWW-Authenticate": 'Basic realm="Secure Area"',
				"Content-Type": "text/plain",
			},
		});
	}

	// Basic認証のフォーマット: "Basic base64(username:password)"
	const [scheme, encoded] = authorization.split(" ");

	// スキームがBasicではない場合
	if (!encoded || scheme !== "Basic") {
		return new Response("認証形式が不正です", {
			status: 400,
			headers: { "Content-Type": "text/plain" },
		});
	}

	// Base64デコード
	const buffer = Uint8Array.from(atob(encoded), (character) =>
		character.charCodeAt(0),
	);
	const decoded = new TextDecoder().decode(buffer).normalize();

	// ユーザー名とパスワードを取得
	const index = decoded.indexOf(":");
	if (index === -1 || index === 0 || index === decoded.length - 1) {
		return new Response("認証情報の形式が不正です", {
			status: 400,
			headers: { "Content-Type": "text/plain" },
		});
	}

	const username = decoded.substring(0, index);
	const password = decoded.substring(index + 1);

	// 環境変数からユーザー名とパスワードを取得して比較
	// 本番環境では、環境変数を使用することをお勧めします
	const AUTH_USERNAME = env.AUTH_USERNAME || "admin";
	const AUTH_PASSWORD = env.AUTH_PASSWORD || "password";

	if (username !== AUTH_USERNAME || password !== AUTH_PASSWORD) {
		return new Response("認証に失敗しました", {
			status: 401,
			headers: {
				"WWW-Authenticate": 'Basic realm="Secure Area"',
				"Content-Type": "text/plain",
			},
		});
	}

	// 認証成功の場合、次のハンドラへ処理を渡す
	return next();
}
