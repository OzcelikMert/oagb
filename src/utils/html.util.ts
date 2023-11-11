import {HtmlUtilGetPageDocument} from "../types/utils/html.util";

export default {
    getPage(params: HtmlUtilGetPageDocument) {
        return `
            <html>
              <head>
                <title>OneAMZ Group Bot ${params.titleTag ? `| ${params.titleTag}` : ""}</title>
                <style>
                    html. body, {
                        padding: 0;
                        margin: 0;
                    }
                    a {
                        color: blue;
                        text-decoration: none;
                    }
                    .text-center {
                        text-align: center !important;
                    }
                    ${params.style}
                </style>
              </head>
              <body>
                ${params.body}
              </body>
            </html>
        `;
    }
}