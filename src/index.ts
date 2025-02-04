import {
    GraphQLServer, 
    JsonLogger 
} from '@dreamit/graphql-server'
import {GraphQLExecutionResult} from '@dreamit/graphql-server-base'
import { 
    userSchema, 
    userSchemaResolvers 
} from '@dreamit/graphql-testing'
import Hapi from '@hapi/hapi'

const graphqlServer = new GraphQLServer(
    {
        schema: userSchema,
        rootValue: userSchemaResolvers,
        logger: new JsonLogger('hapi-server', 'user-service')
    }
)

async function init(): Promise<void> {

    const server = Hapi.server({
        port: 7070,
        host: 'localhost'
    })

    server.route({
        method: 'POST',
        path: '/graphql',
        handler: async(request, h) => {
            const result: GraphQLExecutionResult = await graphqlServer.handleRequest({
                url: request.url.href,
                headers: request.headers,
                body: request.payload,
                method: request.method.toUpperCase()
            })
            let response = h.response(result.executionResult)
            if (result.statusCode) {
                response = response.code(result.statusCode)
            }

            const customHeaders =  result.customHeaders
            let headerValue
            for (const headerName in customHeaders) {
                headerValue = customHeaders[headerName]
                if (headerName) {
                    response = response.header(headerName, headerValue)
                }
            }
            return response
        }
    })

    await server.start()
    console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', (error) => {
    console.log(error)
    process.exit(1)
})

init()
// eslint-disable-next-line unicorn/prefer-top-level-await
.catch((error) =>  {
    console.log(error)
    throw error
})


