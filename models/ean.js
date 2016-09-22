var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EanSchema = new Schema({
	EAN:String,
	SAP:String,
	FRANCAIS:String,
  ENGLISH:String,
	published:{
		type:Date,
		default:new Date
	}
});

module.exports = mongoose.model('ean',EanSchema);
