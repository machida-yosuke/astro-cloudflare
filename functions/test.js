// テスト用の関数
export async function onRequest(context) {
	return new Response("Functionsは正常に動作しています", {
		headers: { "Content-Type": "text/plain" },
	});
}
