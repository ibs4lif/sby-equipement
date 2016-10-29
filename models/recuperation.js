var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RecuperationSchema = new Schema({
	name:String,
	open:String,
	magasin:String,
	articles:[],
	published:{
		type:Date,
		default:new Date
	}
});

module.exports = mongoose.model('recuperation',RecuperationSchema);
