import { HookNextFunction, model, Schema } from 'mongoose'

import { FieldTypes, IFieldTypeModel } from '../interfaces/FieldType.interfaces'
import { fieldTypeName } from '../utils/schema.utils'

export const FieldTypeSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			lowercase: true,
			unique: true
		},
		fieldType: {
			type: String,
			enum: Object.keys(FieldTypes),
			default: FieldTypes.TEXT,
			required: true
		}
	},
	{ timestamps: true }
)

// Name uniqueness for proper error
FieldTypeSchema.post(
	'save',
	(error: any, doc: IFieldTypeModel, next: HookNextFunction) => {
		if (error.name === 'MongoError' && error.code === 11000) {
			next(new Error('Name must be unique'))
		} else {
			next(error)
		}
	}
)

export default model<IFieldTypeModel>(fieldTypeName, FieldTypeSchema)