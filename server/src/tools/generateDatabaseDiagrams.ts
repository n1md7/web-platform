import {writeFileSync} from 'fs';
import path from "path";
import sequelizeErd from 'sequelize-erd';
import db from "../database";

(async function () {
  const svg = await sequelizeErd({
    source: db,
    format: 'svg', // Options are "svg", "dot", "xdot", "plain", "plain-ext", "ps", "ps2", "json", "json0"
    engine: 'twopi', // options are "circo", "dot", "fdp", "neato", "osage", "twopi". Default to "circo"
    color: 'green3',  // Default: 'black'
  });
  writeFileSync(path.join(__dirname, '../../../docs/img/db.diagram.svg'), svg);
})();
