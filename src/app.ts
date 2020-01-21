import * as bodyParser from 'body-parser'
import * as express from 'express'
import { connect } from 'mongoose'

import { CollectionController, UserController } from './controllers'
import { CollectionModel, UserModel } from './models'
import { CollectionRoutes, UserRoutes } from './routes'

class App {
	public app: express.Application
	private mongoUrl: string = process.env.MONGODB_URL

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
	}

	private mongoSetup(): void {
		connect(this.mongoUrl, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false
		})
	}

	private initializeRoutes(): void {
		const userRoutes: UserRoutes = new UserRoutes(
			new UserController(UserModel),
			'users'
		)
		const collectionRoutes: CollectionRoutes = new CollectionRoutes(
			new CollectionController(CollectionModel),
			'collections'
		)

		userRoutes.routes(this.app)
		collectionRoutes.routes(this.app)
	}
}

export default new App().app
