import { 
    GraphQLServer, 
    JsonLogger 
} from '@dreamit/graphql-server'
import { 
    userSchema, 
    userSchemaResolvers 
} from './ExampleSchemas'
import Hapi from '@hapi/hapi'

const graphqlServer = new GraphQLServer(
    {
        schema: userSchema,
        rootValue: userSchemaResolvers,
        logger: new JsonLogger('fastifyServer', 'user-service')
    }
)

async function init(): Promise<void> {

    const server = Hapi.server({
        port: 7070,
        host: 'localhost'
    })

    server.route({
        method: 'GET',
        path: '/graphql',
        handler: async(request, h) => {
            // TODO: Try this when executeRequest function is available            
            return 'Hello world'
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


