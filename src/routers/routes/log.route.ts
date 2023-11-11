import { FastifyInstance } from 'fastify';
import logController from "../../controllers/log.controller";
import logMiddleware from "../../middlewares/log.middleware";

export default function (fastify: FastifyInstance, opts: any, done: () => void) {
    fastify.get('/', logController.getAllLogs);
    fastify.get('/:fileName', { preHandler: [logMiddleware.checkLogFile] }, logController.getLog);
    fastify.get('/asin/:fileName/:logId', { preHandler: [logMiddleware.checkLogFile] }, logController.getAsinList);
    done();
}