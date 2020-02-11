import * as bodyParser from 'body-parser'
import * as express from 'express'
import { connect } from 'mongoose'
import AuthenticationRoutes from './core/authentication/routes/Authentication.routes'
import UserRoutes from './core/authentication/routes/User.routes'
import UserGroupRoutes from './core/authentication/routes/UserGroup.routes'
import CollectionRoutes from './core/collections/routes/Collection.routes'
import CollectionItemRoutes from './core/collections/routes/CollectionItem.routes'
import ExtensionLoaderController from './core/extensions/controllers/ExtensionLoader.controller'
import ExtensionRoutes from './core/extensions/routes/Extension.routes'
import ModuleRoutes from './core/modules/routes/Module.routes'
import ModuleUtils from './core/modules/utils/Module.utils'

class App {
	public app: express.Application
	private mongoUrl: string = process.env.MONGODB_URL
	private extensionLoaderController = new ExtensionLoaderController()

	constructor() {
		this.app = express()
		this.config()
		this.mongoSetup()
		this.initializeRoutes()
	}

	private config(): void {
		this.app.use(bodyParser.json())
		this.app.use(bodyParser.urlencoded({ extended: false }))
		this.app.use((req, res, next) => {
			res.header('Access-Control-Allow-Origin', '*')
			res.header(
				'Access-Control-Allow-Headers',
				'Origin, X-Requested-With, Content-Type, Accept, Authorization'
			)
			res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE')
			next()
		})

		this.extensionLoaderController.loadRoutesFromValidExtensions(this.app)
		ModuleUtils.loadModules()
	}

	private mongoSetup(): void {
		connect(this.mongoUrl, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false
		}).then(() => {
			console.log('Connected to database!')
		}).catch(error => {
			console.log(error)
		})
	}

	private initializeRoutes(): void {
		const authenticationRoutes: AuthenticationRoutes = new AuthenticationRoutes('auth')
		const userRoutes: UserRoutes = new UserRoutes('users')
		const userGroupRoutes: UserGroupRoutes = new UserGroupRoutes('userGroups')
		const collectionRoutes: CollectionRoutes = new CollectionRoutes(
			'collections'
		)
		const collectionItemRoutes: CollectionItemRoutes = new CollectionItemRoutes(
			'collectionItems'
		)
		const extensionRoutes: ExtensionRoutes = new ExtensionRoutes(
			'extensions'
		)
		const moduleRoutes: ModuleRoutes = new ModuleRoutes('modules')

		authenticationRoutes.routes(this.app)
		userRoutes.routes(this.app)
		userGroupRoutes.routes(this.app)
		collectionRoutes.routes(this.app)
		collectionItemRoutes.routes(this.app)
		extensionRoutes.routes(this.app)
		moduleRoutes.routes(this.app)
	}
}

export default new App().app
