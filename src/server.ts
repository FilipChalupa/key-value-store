import { serve } from 'https://deno.land/std@0.136.0/http/server.ts'
import { parse } from 'https://deno.land/std@0.137.0/flags/mod.ts'
import staticFiles from 'https://deno.land/x/static_files@1.1.6/mod.ts'

const { args } = Deno
const DEFAULT_PORT = 8080
const argPort = parse(args).port
const port = argPort ? Number(argPort) : DEFAULT_PORT

console.log(`HTTP webserver running. Access it at: http://localhost:${port}/`)

const handler = async (request: Request): Promise<Response> => {
	const url = new URL(request.url)

	const key = url.searchParams.get('key')
	const value = url.searchParams.get('value')

	if (key) {
		const persistedValue = (() => {
			if (value) {
				return value
			}
			return 'Test'
		})()
		return new Response(persistedValue)
	}

	return staticFiles('public')({
		request,
		respondWith: (response: Response) => response,
	})
}

await serve(handler, { port })
