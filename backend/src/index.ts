import server from './server';

server.listen({ port: 1337 }).then(() => {
    console.log('Server is running on http://localhost:1337');
});
