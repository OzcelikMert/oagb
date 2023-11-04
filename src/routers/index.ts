import { FastifyInstance } from 'fastify';
import logRoute from "./routes/log.route";

export default function (fastify: FastifyInstance, opts: any, done: () => void) {
    fastify.register(logRoute, { prefix: "/" });

    done();
}

