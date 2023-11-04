import { FastifyRequest, FastifyReply } from 'fastify';
import pathUtil from "../utils/path.util";
import htmlUtil from "../utils/html.util";
import {LogDocument} from "../types/utils/log.util";
import path from "path";
import {checkLogFile} from "../utils/log.util";
const fs = require('fs');

export default {
    async checkLogFile(
        req: FastifyRequest,
        reply: FastifyReply
    ) {
        const params = req.params as { fileName: string };
        const fileName = params.fileName ?? "";
        let filePathWithName = path.resolve(pathUtil.output, `${fileName}.json`);

        if(await checkLogFile(filePathWithName)){
            return;
        }else {
            reply.header('Content-Type', 'text/html').code(200).send(htmlUtil.getPage({
                titleTag: "File not found",
                style: `
                    .head {
                       display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                    }
                    
                    .head h3 {
                        margin-top: 0;
                    }
                `,
                body: `
                <div class="head">
                    <h1>File not found!</h1>
                    <h3><a href="/" >Return Home</a></h3>
                </div>
                `
            }));
        }
    }
}