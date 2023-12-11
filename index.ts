import express ,{Express} from "express"
import dotenv from "dotenv"
import * as database from "./config/database"
import clientRoutes from "./routes/client/index.route"
import adminRoutes from "./routes/admin/index.route"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import { systemConfig } from "./config/config"
import methodOverride from "method-override";
import path from "path"
const app: Express = express()
const port: number | string =process.env.PORT || 3000
app.use(bodyParser.urlencoded({ extended: false }));

//File tinh
app.use(express.static(`${__dirname}/public`));
//End File tinh

//Pug
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");
//End Pug

// App Local Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// TinyMCE
app.use(
    "/tinymce",
    express.static(path.join(__dirname, "node_modules", "tinymce"))
  );
// End TinyMCE
  

app.use(cookieParser("LHNASDASDAD"));
dotenv.config()
database.connect()

app.use(methodOverride("_method"));

//Client Route
clientRoutes(app)
//End Client Route

//Admin Route
adminRoutes(app)
//End Admin Route

app.listen(port,() =>{
    console.log(`App listening on port ${port}`);
})